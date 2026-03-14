"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const payment_gateway_1 = require("../../domain/payments/payment-gateway");
const order_service_1 = require("../orders/order.service");
let PaymentService = class PaymentService {
    constructor(gateway, orderService) {
        this.gateway = gateway;
        this.orderService = orderService;
        this.idempotencyCache = new Map();
    }
    async createCheckout(input) {
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
        const session = await this.gateway.createCheckoutSession({
            currency: "COP",
            amount: order.total,
            reference: order.id,
            customerEmail: normalizedEmail
        });
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
    async handleWebhook(event) {
        const statusMap = {
            "APPROVED": "PAID",
            "DECLINED": "CANCELLED",
            "ERROR": "CANCELLED",
            "PENDING": "PENDING"
        };
        const orderStatus = statusMap[event.status] || "PENDING";
        const order = await this.orderService.updateStatus(event.reference, orderStatus);
        return { ok: true, order };
    }
    validateCheckoutRequest(input) {
        if (!input || input.currency !== "COP") {
            throw new common_1.BadRequestException("Moneda invalida");
        }
        const email = input.customerEmail?.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new common_1.BadRequestException("Correo invalido");
        }
        if (!Array.isArray(input.items) || input.items.length === 0) {
            throw new common_1.BadRequestException("El carrito no puede estar vacio");
        }
        if (input.idempotencyKey) {
            if (input.idempotencyKey.length < 8 || input.idempotencyKey.length > 120) {
                throw new common_1.BadRequestException("Idempotency key invalido");
            }
        }
        for (const item of input.items) {
            if (!item.slug || !item.name) {
                throw new common_1.BadRequestException("Item invalido");
            }
            if (!Number.isFinite(item.price) || item.price <= 0) {
                throw new common_1.BadRequestException("Precio invalido");
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new common_1.BadRequestException("Cantidad invalida");
            }
            if (item.quantity > 20) {
                throw new common_1.BadRequestException("Cantidad invalida");
            }
        }
    }
    consolidateItems(items) {
        const consolidated = new Map();
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
                throw new common_1.BadRequestException("Inconsistencia en precios del carrito");
            }
            current.quantity += raw.quantity;
            if (current.quantity > 20) {
                throw new common_1.BadRequestException("Cantidad invalida");
            }
        }
        return Array.from(consolidated.values());
    }
    buildIdempotencyCacheKey(identity, idempotencyKey) {
        if (!idempotencyKey) {
            return "";
        }
        return `${identity}:${idempotencyKey}`;
    }
    readCachedCheckout(cacheKey) {
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_gateway_1.PAYMENT_GATEWAY)),
    __metadata("design:paramtypes", [Object, order_service_1.OrderService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map