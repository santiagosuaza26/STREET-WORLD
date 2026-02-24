import { Order } from "../../domain/orders/order";
import { OrderRepository } from "../../domain/orders/order-repository";
export declare class InMemoryOrderRepository implements OrderRepository {
    private readonly store;
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    update(order: Order): Promise<Order>;
}
