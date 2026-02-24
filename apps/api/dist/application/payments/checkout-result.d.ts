import { CheckoutSession } from "../../domain/payments/payment-gateway";
export type CheckoutResult = CheckoutSession & {
    orderId: string;
};
