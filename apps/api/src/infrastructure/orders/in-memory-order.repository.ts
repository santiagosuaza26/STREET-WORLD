import { Injectable } from "@nestjs/common";
import { Order } from "../../domain/orders/order";
import { OrderRepository } from "../../domain/orders/order-repository";

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private readonly store = new Map<string, Order>();

  async create(order: Order): Promise<Order> {
    this.store.set(order.id, order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.store.get(id) ?? null;
  }

  async update(order: Order): Promise<Order> {
    this.store.set(order.id, order);
    return order;
  }
}
