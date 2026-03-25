import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  CheckoutSession,
  PAYMENT_GATEWAY,
  PaymentGateway
} from "../../domain/payments/payment-gateway";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../domain/products/product-repository";
import { USER_REPOSITORY, UserRepository } from "../../domain/users/user-repository";
import { OrderService } from "../orders/order.service";
import { CheckoutRequest } from "./checkout-request";
import { CheckoutResult } from "./checkout-result";
import { PaymentWebhookEvent } from "./webhook-event";
import { RedisStoreService } from "../../infrastructure/cache/redis-store.service";
import { randomUUID } from "crypto";
import { PaymentMetricsService } from "./payment-metrics.service";
import { PaymentWebhookRetryService } from "./payment-webhook-retry.service";

type WebhookSource = "webhook" | "retry";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGateway,
    private readonly orderService: OrderService,
    private readonly redisStore: RedisStoreService,
    private readonly metrics: PaymentMetricsService,
    private readonly retryQueue: PaymentWebhookRetryService,
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository
  ) {}

  async createCheckout(input: CheckoutRequest): Promise<CheckoutResult> {
    this.validateCheckoutRequest(input);

    const normalizedEmail = input.customerEmail.trim().toLowerCase();
    const identity = input.userId?.trim() || `guest:${normalizedEmail}`;
    const orderUserId = input.userId?.trim() || (await this.resolveGuestUserId(normalizedEmail));
    const idempotencyCacheKey = this.buildIdempotencyCacheKey(identity, input.idempotencyKey);

    if (idempotencyCacheKey) {
      const cached = await this.redisStore.getJson<CheckoutResult>(idempotencyCacheKey);
      if (cached) {
        return cached;
      }
    }

    const consolidatedItems = await this.consolidateItems(input.items);
    
    // Map CheckoutRequest items to OrderItem format
    const orderItems = consolidatedItems.map(item => ({
      productId: item.slug,
      productName: item.name,
      unitPrice: Number(item.price.toFixed(2)),
      quantity: item.quantity,
      subtotal: Number((item.price * item.quantity).toFixed(2))
    }));

    const order = await this.orderService.createOrder({
      userId: orderUserId,
      items: orderItems,
      notes: JSON.stringify({
        checkoutType: input.userId ? "account" : "guest",
        customerEmail: normalizedEmail,
        shipping: input.shipping,
      }),
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
      await this.redisStore.setJson(idempotencyCacheKey, result, 15 * 60 * 1000);
    }

    return result;
  }

  async handleWebhook(event: PaymentWebhookEvent) {
    return this.processWebhookEvent(event, "webhook", 0);
  }

  async processWebhookEvent(event: PaymentWebhookEvent, source: WebhookSource, attempt: number) {
    const dedupeKey = event.eventId
      ? `webhook:event:${event.eventId}`
      : `webhook:reference:${event.reference}:${event.status}`;
    const alreadyProcessed = await this.redisStore.getJson<{ processed: true }>(dedupeKey);
    if (alreadyProcessed) {
      this.metrics.markDuplicate();
      return { ok: true, duplicate: true };
    }

    const statusMap: Record<PaymentWebhookEvent["status"], "PAID" | "CANCELLED" | "PENDING"> = {
      paid: "PAID",
      failed: "CANCELLED",
      pending: "PENDING",
    };

    try {
      const orderStatus = statusMap[event.status] ?? "PENDING";
      const order = await this.orderService.updateStatus(event.reference, orderStatus);
      await this.redisStore.setJson(dedupeKey, { processed: true }, 48 * 60 * 60 * 1000);
      this.metrics.markProcessed();
      return { ok: true, order };
    } catch (error) {
      const nextAttempt = attempt + 1;
      const maxAttempts = this.retryQueue.getMaxAttempts();
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.metrics.markFailed(source, errorMessage);

      if (nextAttempt <= maxAttempts) {
        const job = await this.retryQueue.schedule(event, nextAttempt, errorMessage);
        this.metrics.markRetryScheduled();
        return {
          ok: false,
          retryScheduled: true,
          attempt: nextAttempt,
          maxAttempts,
          retryAt: new Date(job.nextRunAt).toISOString(),
        };
      }

      this.metrics.markRetryExhausted();
      return {
        ok: false,
        retryScheduled: false,
        attempt: nextAttempt,
        maxAttempts,
        error: errorMessage,
      };
    }
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

    const shipping = input.shipping;
    if (!shipping) {
      throw new BadRequestException("Datos de envio requeridos");
    }

    if (!shipping.firstName?.trim() || shipping.firstName.trim().length < 2) {
      throw new BadRequestException("Nombre de envio invalido");
    }

    if (!shipping.lastName?.trim() || shipping.lastName.trim().length < 2) {
      throw new BadRequestException("Apellido de envio invalido");
    }

    if (!shipping.phone?.trim() || shipping.phone.trim().length < 7) {
      throw new BadRequestException("Telefono de envio invalido");
    }

    if (!shipping.addressLine?.trim() || shipping.addressLine.trim().length < 8) {
      throw new BadRequestException("Direccion de envio invalida");
    }

    if (!shipping.city?.trim() || shipping.city.trim().length < 2) {
      throw new BadRequestException("Ciudad de envio invalida");
    }

    if (!shipping.country?.trim() || shipping.country.trim().length < 2) {
      throw new BadRequestException("Pais de envio invalido");
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

  private async consolidateItems(items: CheckoutRequest["items"]) {
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

    const result = Array.from(consolidated.values());

    for (const item of result) {
      item.slug = await this.resolveProductId(item.slug);
    }

    return result;
  }

  private buildIdempotencyCacheKey(identity: string, idempotencyKey?: string) {
    if (!idempotencyKey) {
      return "";
    }

    return `checkout:idempotency:${identity}:${idempotencyKey}`;
  }

  private async resolveGuestUserId(_email: string): Promise<string> {
    const guestEmail = "guest.checkout@streetworld.local";
    const existing = await this.users.findByEmail(guestEmail);
    if (existing) {
      return existing.id;
    }

    const userId = randomUUID();
    await this.users.create({
      id: userId,
      email: guestEmail,
      passwordHash: `guest-${userId}`,
      createdAt: new Date().toISOString(),
    });

    return userId;
  }

  private async resolveProductId(slugOrId: string): Promise<string> {
    if (this.isUuid(slugOrId)) {
      return slugOrId;
    }

    const bySlug = await this.products.findBySlug(slugOrId);
    if (bySlug?.id) {
      return bySlug.id;
    }

    throw new BadRequestException("Producto invalido para checkout");
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
}
