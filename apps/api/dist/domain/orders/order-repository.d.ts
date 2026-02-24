import { Order } from "./order";
export interface OrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    update(order: Order): Promise<Order>;
}
export declare const ORDER_REPOSITORY: unique symbol;
