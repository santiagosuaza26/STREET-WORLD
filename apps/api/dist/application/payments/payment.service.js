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
    }
    async createCheckout(input) {
        this.validateCheckoutRequest(input);
        const orderItems = input.items.map(item => ({
            productId: item.id || 'unknown',
            productName: item.name || 'Unknown Product',
            unitPrice: parseFloat(item.price),
            quantity: item.quantity,
            subtotal: parseFloat(item.price) * item.quantity
        }));
        const order = await this.orderService.createOrder({
            userId: input.userId ?? 'guest',
            items: orderItems
        });
        const session = await this.gateway.createCheckoutSession({
            currency: "COP",
            amount: order.total,
            reference: order.id,
            customerEmail: input.customerEmail
        });
        if (session.provider === "mock") {
            await this.orderService.updateStatus(order.id, "PAID");
        }
        return {
            ...session,
            orderId: order.id
        };
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
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_gateway_1.PAYMENT_GATEWAY)),
    __metadata("design:paramtypes", [Object, order_service_1.OrderService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map