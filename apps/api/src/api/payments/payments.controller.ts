import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UnauthorizedException,
  ValidationPipe,
} from "@nestjs/common";
import type { Request } from "express";
import { CheckoutRequest } from "../../application/payments/checkout-request";
import { CheckoutResult } from "../../application/payments/checkout-result";
import { PaymentService } from "../../application/payments/payment.service";
import { normalizeWebhookPayload } from "../../application/payments/webhook-normalizer";
import { WebhookValidator } from "../../application/payments/webhook-validator";
import { CheckoutDto } from "./dtos";

@Controller("payments")
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly webhookValidator: WebhookValidator
  ) {}

  @Post("checkout")
  async createCheckout(
    @Body(ValidationPipe) input: CheckoutDto,
    @Headers("x-idempotency-key") idempotencyKey?: string
  ): Promise<CheckoutResult> {
    const payload: CheckoutRequest = {
      ...input,
      idempotencyKey: typeof idempotencyKey === "string" ? idempotencyKey.trim() : undefined,
    };

    return this.paymentService.createCheckout(payload);
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
