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
        const order = await this.orderService.createOrder({
            customerEmail: input.customerEmail,
            currency: input.currency,
            items: input.items
        });
        const session = await this.gateway.createCheckoutSession({
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
    async handleWebhook(event) {
        const order = await this.orderService.updateStatus(event.reference, event.status);
        return { ok: true, order };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_gateway_1.PAYMENT_GATEWAY)),
    __metadata("design:paramtypes", [Object, order_service_1.OrderService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map