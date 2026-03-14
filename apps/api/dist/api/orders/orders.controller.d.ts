import { OrderService } from "../../application/orders/order.service";
import { CreateOrderDto } from "./dtos";
import type { Request } from "express";
export declare class OrdersController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getAll(req: Request): Promise<import("../../domain/orders/order").Order[]>;
    getOrder(id: string): Promise<import("../../domain/orders/order").Order>;
    create(dto: CreateOrderDto, req: Request): Promise<import("../../domain/orders/order").Order>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<import("../../domain/orders/order").Order>;
}
