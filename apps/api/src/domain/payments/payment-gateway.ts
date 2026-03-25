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

export type TransactionStatus = "paid" | "failed" | "pending" | "unknown";

export interface PaymentGateway {
  createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession>;
  getTransactionStatus(reference: string): Promise<TransactionStatus>;
}

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");
