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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../../application/payments/payment.service");
const webhook_normalizer_1 = require("../../application/payments/webhook-normalizer");
const webhook_validator_1 = require("../../application/payments/webhook-validator");
let PaymentsController = class PaymentsController {
    constructor(paymentService, webhookValidator) {
        this.paymentService = paymentService;
        this.webhookValidator = webhookValidator;
    }
    async createCheckout(input) {
        return this.paymentService.createCheckout(input);
    }
    async handleWebhook(payload, req) {
        const rawBody = req.rawBody ?? JSON.stringify(payload);
        const headerName = (process.env.PAYMENTS_WEBHOOK_HEADER ?? "x-signature").toLowerCase();
        const signature = req.headers[headerName] ? String(req.headers[headerName]) : "";
        const isValid = this.webhookValidator.verify({ rawBody, signature });
        if (!isValid) {
            throw new common_1.UnauthorizedException("Firma del webhook invalida");
        }
        const event = (0, webhook_normalizer_1.normalizeWebhookPayload)(payload);
        if (!event) {
            throw new common_1.BadRequestException("Payload de webhook invalido");
        }
        return this.paymentService.handleWebhook(event);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)("checkout"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)("webhook"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        webhook_validator_1.WebhookValidator])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map