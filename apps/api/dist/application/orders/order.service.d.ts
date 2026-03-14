import { Order, OrderItem, OrderStatus } from "../../domain/orders/order";
import { OrderRepository } from "../../domain/orders/order-repository";
type CreateOrderInput = {
    userId: string;
    items: OrderItem[];
    notes?: string;
};
export declare class OrderService {
    private readonly repository;
    constructor(repository: OrderRepository);
    createOrder(input: CreateOrderInput): Promise<Order>;
    getOrder(id: string): Promise<Order | null>;
    getUserOrders(userId: string): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
    updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}
export {};
