import { Inject, Injectable } from "@nestjs/common";
import {
  CheckoutSession,
  PAYMENT_GATEWAY,
  PaymentGateway
} from "../../domain/payments/payment-gateway";
import { OrderService } from "../orders/order.service";
import { CheckoutRequest } from "./checkout-request";
import { CheckoutResult } from "./checkout-result";
import { PaymentWebhookEvent } from "./webhook-event";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGateway,
    private readonly orderService: OrderService
  ) {}

  async createCheckout(input: CheckoutRequest): Promise<CheckoutResult> {
    const order = await this.orderService.createOrder({
      customerEmail: input.customerEmail,
      currency: input.currency,
      items: input.items
    });

    const session: CheckoutSession = await this.gateway.createCheckoutSession({
      currency: order.currency,
      amount: order.totalAmount,
      reference: order.id,
      customerEmail: order.customerEmail
    });

    return {
      ...session,
      orderId: order.id
    };
  }

  async handleWebhook(event: PaymentWebhookEvent) {
    const order = await this.orderService.updateStatus(
      event.reference,
      event.status
    );
    return { ok: true, order };
  }
}
