import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OrderService } from "../orders/order.service";
import {
  PAYMENT_GATEWAY,
  PaymentGateway,
  TransactionStatus,
} from "../../domain/payments/payment-gateway";
import { PaymentMetricsService } from "./payment-metrics.service";
import { PaymentWebhookRetryService } from "./payment-webhook-retry.service";
import { PaymentService } from "./payment.service";

@Injectable()
export class PaymentsMaintenanceService {
  private readonly logger = new Logger(PaymentsMaintenanceService.name);
  private isRunning = false;

  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly metrics: PaymentMetricsService,
    private readonly retryQueue: PaymentWebhookRetryService,
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGateway
  ) {}

  @Cron(process.env.PAYMENTS_RECONCILE_CRON ?? CronExpression.EVERY_MINUTE)
  async runTick() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    try {
      this.metrics.markReconciliationRun();
      await this.processRetryQueue();
      await this.reconcileOrders();
    } catch (error) {
      this.logger.error(
        `Maintenance tick failed: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      this.isRunning = false;
    }
  }

  private async processRetryQueue() {
    const maxBatch = this.parsePositiveInt(process.env.PAYMENTS_WEBHOOK_RETRY_BATCH_SIZE, 20);
    const dueJobs = await this.retryQueue.popDue(maxBatch);

    for (const job of dueJobs) {
      this.metrics.markRetryExecuted();
      await this.paymentService.processWebhookEvent(job.event, "retry", job.attempt);
    }
  }

  private async reconcileOrders() {
    const pendingTimeoutMs = this.parsePositiveInt(
      process.env.PAYMENTS_PENDING_TIMEOUT_MS,
      30 * 60 * 1000
    );
    const now = Date.now();

    const orders = await this.orderService.getAllOrders();
    for (const order of orders) {
      if (order.status !== "PENDING" && order.status !== "CANCELLED") {
        continue;
      }

      const providerStatus = await this.gateway.getTransactionStatus(order.id);
      const resolved = this.resolveOrderStatus(providerStatus);

      if (resolved === "PAID") {
        await this.orderService.updateStatus(order.id, "PAID");
        this.metrics.markReconciledPaid();
        continue;
      }

      if (resolved === "CANCELLED" && order.status === "PENDING") {
        await this.orderService.updateStatus(order.id, "CANCELLED");
        this.metrics.markReconciledCancelled();
        continue;
      }

      if (order.status === "PENDING") {
        const ageMs = now - new Date(order.createdAt).getTime();
        if (ageMs > pendingTimeoutMs && resolved === "PENDING") {
          await this.orderService.updateStatus(order.id, "CANCELLED");
          this.metrics.markReconciledCancelled();
        }
      }
    }
  }

  private resolveOrderStatus(status: TransactionStatus): "PAID" | "CANCELLED" | "PENDING" {
    if (status === "paid") {
      return "PAID";
    }

    if (status === "failed") {
      return "CANCELLED";
    }

    return "PENDING";
  }

  private parsePositiveInt(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
