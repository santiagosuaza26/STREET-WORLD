import type { Request } from "express";
import { CheckoutResult } from "../../application/payments/checkout-result";
import { PaymentService } from "../../application/payments/payment.service";
import { WebhookValidator } from "../../application/payments/webhook-validator";
import { CheckoutDto } from "./dtos";
export declare class PaymentsController {
    private readonly paymentService;
    private readonly webhookValidator;
    constructor(paymentService: PaymentService, webhookValidator: WebhookValidator);
    createCheckout(input: CheckoutDto, idempotencyKey?: string): Promise<CheckoutResult>;
    handleWebhook(payload: unknown, req: Request): Promise<{
        ok: boolean;
        order: import("../../domain/orders/order").Order | null;
    }>;
}
