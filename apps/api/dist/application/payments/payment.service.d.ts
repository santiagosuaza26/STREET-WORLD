import { PaymentGateway } from "../../domain/payments/payment-gateway";
import { OrderService } from "../orders/order.service";
import { CheckoutRequest } from "./checkout-request";
import { CheckoutResult } from "./checkout-result";
import { PaymentWebhookEvent } from "./webhook-event";
export declare class PaymentService {
    private readonly gateway;
    private readonly orderService;
    private readonly idempotencyCache;
    constructor(gateway: PaymentGateway, orderService: OrderService);
    createCheckout(input: CheckoutRequest): Promise<CheckoutResult>;
    handleWebhook(event: PaymentWebhookEvent): Promise<{
        ok: boolean;
        order: import("../../domain/orders/order").Order | null;
    }>;
    private validateCheckoutRequest;
    private consolidateItems;
    private buildIdempotencyCacheKey;
    private readCachedCheckout;
}
