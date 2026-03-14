import { Order } from "../../domain/orders/order";
import { OrderRepository } from "../../domain/orders/order-repository";
export declare class InMemoryOrderRepository implements OrderRepository {
    private readonly store;
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByUserId(userId: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
    update(id: string, order: Partial<Order>): Promise<Order | null>;
}
