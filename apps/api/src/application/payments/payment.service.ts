import { BadRequestException, Inject, Injectable } from "@nestjs/common";
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
    this.validateCheckoutRequest(input);
    
    // Map CheckoutRequest items to OrderItem format
    const orderItems = input.items.map(item => ({
      productId: (item as any).id || 'unknown',
      productName: (item as any).name || 'Unknown Product',
      unitPrice: parseFloat(item.price as any),
      quantity: item.quantity,
      subtotal: parseFloat(item.price as any) * item.quantity
    }));

    const order = await this.orderService.createOrder({
      userId: input.userId ?? 'guest',
      items: orderItems
    });

    const session: CheckoutSession = await this.gateway.createCheckoutSession({
      currency: "COP",
      amount: order.total,
      reference: order.id,
      customerEmail: input.customerEmail
    });

    // In mock mode we auto-approve to keep the full checkout flow working without provider keys.
    if (session.provider === "mock") {
      await this.orderService.updateStatus(order.id, "PAID");
    }

    return {
      ...session,
      orderId: order.id
    };
  }

  async handleWebhook(event: PaymentWebhookEvent) {
    // Map payment status to order status
    const statusMap: { [key: string]: any } = {
      "APPROVED": "PAID",
      "DECLINED": "CANCELLED",
      "ERROR": "CANCELLED",
      "PENDING": "PENDING"
    };

    const orderStatus = statusMap[event.status] || "PENDING";
    
    const order = await this.orderService.updateStatus(
      event.reference,
      orderStatus
    );
    return { ok: true, order };
  }

  private validateCheckoutRequest(input: CheckoutRequest) {
    if (!input || input.currency !== "COP") {
      throw new BadRequestException("Moneda invalida");
    }

    const email = input.customerEmail?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException("Correo invalido");
    }

    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new BadRequestException("El carrito no puede estar vacio");
    }

    for (const item of input.items) {
      if (!item.slug || !item.name) {
        throw new BadRequestException("Item invalido");
      }
      if (!Number.isFinite(item.price) || item.price <= 0) {
        throw new BadRequestException("Precio invalido");
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException("Cantidad invalida");
      }
    }
  }
}
