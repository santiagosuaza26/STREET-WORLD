import { Order, OrderItem, OrderStatus } from "../../domain/orders/order";
import { OrderRepository } from "../../domain/orders/order-repository";
type CreateOrderInput = {
    customerEmail: string;
    currency: "COP";
    items: OrderItem[];
};
export declare class OrderService {
    private readonly repository;
    constructor(repository: OrderRepository);
    createOrder(input: CreateOrderInput): Promise<Order>;
    getOrder(id: string): Promise<Order | null>;
    updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}
export {};
