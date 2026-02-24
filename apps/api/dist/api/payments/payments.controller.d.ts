import type { Request } from "express";
import { CheckoutRequest } from "../../application/payments/checkout-request";
import { CheckoutResult } from "../../application/payments/checkout-result";
import { PaymentService } from "../../application/payments/payment.service";
import { WebhookValidator } from "../../application/payments/webhook-validator";
export declare class PaymentsController {
    private readonly paymentService;
    private readonly webhookValidator;
    constructor(paymentService: PaymentService, webhookValidator: WebhookValidator);
    createCheckout(input: CheckoutRequest): Promise<CheckoutResult>;
    handleWebhook(payload: unknown, req: Request): Promise<{
        ok: boolean;
        order: import("../../domain/orders/order").Order | null;
    }>;
}
