export interface CheckoutInput {
  currency: "COP";
  amount: number;
  reference: string;
  customerEmail: string;
}

export interface CheckoutSession {
  provider: string;
  checkoutUrl: string;
  reference: string;
}

export interface PaymentGateway {
  createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession>;
}

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");
