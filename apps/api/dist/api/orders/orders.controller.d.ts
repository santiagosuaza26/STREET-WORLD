import { OrderService } from "../../application/orders/order.service";
export declare class OrdersController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getOrder(id: string): Promise<import("../../domain/orders/order").Order | null>;
}
