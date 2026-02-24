import { Injectable } from "@nestjs/common";
import {
  CheckoutInput,
  CheckoutSession,
  PaymentGateway
} from "../../domain/payments/payment-gateway";

@Injectable()
export class WompiGateway implements PaymentGateway {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession> {
    return {
      provider: "wompi",
      checkoutUrl: "https://checkout.wompi.co/placeholder",
      reference: input.reference
    };
  }
}
