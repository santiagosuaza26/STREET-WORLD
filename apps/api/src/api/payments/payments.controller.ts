import { BadRequestException, Body, Controller, Post, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { CheckoutRequest } from "../../application/payments/checkout-request";
import { CheckoutResult } from "../../application/payments/checkout-result";
import { PaymentService } from "../../application/payments/payment.service";
import { normalizeWebhookPayload } from "../../application/payments/webhook-normalizer";
import { WebhookValidator } from "../../application/payments/webhook-validator";

@Controller("payments")
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly webhookValidator: WebhookValidator
  ) {}

  @Post("checkout")
  async createCheckout(@Body() input: CheckoutRequest): Promise<CheckoutResult> {
    return this.paymentService.createCheckout(input);
  }

  @Post("webhook")
  async handleWebhook(@Body() payload: unknown, @Req() req: Request) {
    const rawBody = (req as { rawBody?: string }).rawBody ?? JSON.stringify(payload);
    const headerName = (process.env.PAYMENTS_WEBHOOK_HEADER ?? "x-signature").toLowerCase();
    const signature = req.headers[headerName] ? String(req.headers[headerName]) : "";

    const isValid = this.webhookValidator.verify({ rawBody, signature });
    if (!isValid) {
      throw new UnauthorizedException("Firma del webhook invalida");
    }

    const event = normalizeWebhookPayload(payload);
    if (!event) {
      throw new BadRequestException("Payload de webhook invalido");
    }

    return this.paymentService.handleWebhook(event);
  }
}
