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

  async findByUserId(userId: string): Promise<Order[]> {
    const results: Order[] = [];
    for (const order of this.store.values()) {
      if (order.userId === userId) {
        results.push(order);
      }
    }
    return results;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.store.values());
  }

  async update(id: string, order: Partial<Order>): Promise<Order | null> {
    const existing = this.store.get(id);
    if (!existing) {
      return null;
    }
    const updated = { ...existing, ...order };
    this.store.set(id, updated);
    return updated;
  }
}
