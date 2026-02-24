import { Order } from "./order";

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(order: Order): Promise<Order>;
}

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");
