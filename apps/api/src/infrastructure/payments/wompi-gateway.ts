import { Injectable } from "@nestjs/common";
import {
  CheckoutInput,
  CheckoutSession,
  PaymentGateway,
  TransactionStatus
} from "../../domain/payments/payment-gateway";

@Injectable()
export class WompiGateway implements PaymentGateway {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession> {
    const template =
      process.env.PAYMENTS_CHECKOUT_URL_TEMPLATE ??
      "http://localhost:3000/checkout/estado?orderId={reference}";
    const checkoutUrl = template
      .replace("{reference}", encodeURIComponent(input.reference))
      .replace("{email}", encodeURIComponent(input.customerEmail))
      .replace("{amount}", encodeURIComponent(String(input.amount)))
      .replace("{currency}", encodeURIComponent(input.currency));

    return {
      provider: "wompi",
      checkoutUrl,
      reference: input.reference
    };
  }

  async getTransactionStatus(_reference: string): Promise<TransactionStatus> {
    // Placeholder until provider polling endpoint is wired with credentials.
    return "unknown";
  }
}
