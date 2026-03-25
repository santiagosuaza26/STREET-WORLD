import { Injectable } from "@nestjs/common";
import {
  CheckoutInput,
  CheckoutSession,
  PaymentGateway,
  TransactionStatus
} from "../../domain/payments/payment-gateway";

@Injectable()
export class MockGateway implements PaymentGateway {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession> {
    const baseUrl = process.env.WEB_URL ?? "http://localhost:3000";
    const checkoutUrl = `${baseUrl}/checkout/estado?orderId=${encodeURIComponent(input.reference)}`;

    return {
      provider: "mock",
      checkoutUrl,
      reference: input.reference
    };
  }

  async getTransactionStatus(_reference: string): Promise<TransactionStatus> {
    // Mock provider keeps status predictable for local development.
    return "paid";
  }
}
