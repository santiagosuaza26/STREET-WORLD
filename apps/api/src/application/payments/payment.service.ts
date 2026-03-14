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
  private readonly idempotencyCache = new Map<
    string,
    {
      expiresAt: number;
      result: CheckoutResult;
    }
  >();

  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGateway,
    private readonly orderService: OrderService
  ) {}

  async createCheckout(input: CheckoutRequest): Promise<CheckoutResult> {
    this.validateCheckoutRequest(input);

    const normalizedEmail = input.customerEmail.trim().toLowerCase();
    const identity = input.userId?.trim() || `guest:${normalizedEmail}`;
    const idempotencyCacheKey = this.buildIdempotencyCacheKey(identity, input.idempotencyKey);

    if (idempotencyCacheKey) {
      const cached = this.readCachedCheckout(idempotencyCacheKey);
      if (cached) {
        return cached;
      }
    }

    const consolidatedItems = this.consolidateItems(input.items);
    
    // Map CheckoutRequest items to OrderItem format
    const orderItems = consolidatedItems.map(item => ({
      productId: item.slug,
      productName: item.name,
      unitPrice: Number(item.price.toFixed(2)),
      quantity: item.quantity,
      subtotal: Number((item.price * item.quantity).toFixed(2))
    }));

    const order = await this.orderService.createOrder({
      userId: identity,
      items: orderItems
    });

    const session: CheckoutSession = await this.gateway.createCheckoutSession({
      currency: "COP",
      amount: order.total,
      reference: order.id,
      customerEmail: normalizedEmail
    });

    // In mock mode we auto-approve to keep the full checkout flow working without provider keys.
    if (session.provider === "mock") {
      await this.orderService.updateStatus(order.id, "PAID");
    }

    const result = {
      ...session,
      orderId: order.id
    };

    if (idempotencyCacheKey) {
      this.idempotencyCache.set(idempotencyCacheKey, {
        expiresAt: Date.now() + 15 * 60 * 1000,
        result,
      });
    }

    return result;
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

    if (input.idempotencyKey) {
      if (input.idempotencyKey.length < 8 || input.idempotencyKey.length > 120) {
        throw new BadRequestException("Idempotency key invalido");
      }
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

      if (item.quantity > 20) {
        throw new BadRequestException("Cantidad invalida");
      }
    }
  }

  private consolidateItems(items: CheckoutRequest["items"]) {
    const consolidated = new Map<string, { slug: string; name: string; price: number; quantity: number }>();

    for (const raw of items) {
      const slug = raw.slug.trim();
      const name = raw.name.trim();
      const price = Number(Number(raw.price).toFixed(2));

      const current = consolidated.get(slug);
      if (!current) {
        consolidated.set(slug, {
          slug,
          name,
          price,
          quantity: raw.quantity,
        });
        continue;
      }

      if (current.price !== price) {
        throw new BadRequestException("Inconsistencia en precios del carrito");
      }

      current.quantity += raw.quantity;
      if (current.quantity > 20) {
        throw new BadRequestException("Cantidad invalida");
      }
    }

    return Array.from(consolidated.values());
  }

  private buildIdempotencyCacheKey(identity: string, idempotencyKey?: string) {
    if (!idempotencyKey) {
      return "";
    }

    return `${identity}:${idempotencyKey}`;
  }

  private readCachedCheckout(cacheKey: string): CheckoutResult | null {
    const cached = this.idempotencyCache.get(cacheKey);
    if (!cached) {
      return null;
    }

    if (Date.now() >= cached.expiresAt) {
      this.idempotencyCache.delete(cacheKey);
      return null;
    }

    return cached.result;
  }
}
