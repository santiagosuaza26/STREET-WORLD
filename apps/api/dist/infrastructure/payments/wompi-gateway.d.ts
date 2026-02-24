import { CheckoutInput, CheckoutSession, PaymentGateway } from "../../domain/payments/payment-gateway";
export declare class WompiGateway implements PaymentGateway {
    createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession>;
}
