import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Order, OrderItem, OrderStatus } from "../../domain/orders/order";
import {
  ORDER_REPOSITORY,
  OrderRepository
} from "../../domain/orders/order-repository";

type CreateOrderInput = {
  customerEmail: string;
  currency: "COP";
  items: OrderItem[];
};

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepository
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (input.items.length === 0) {
      throw new BadRequestException("El carrito no puede estar vacio");
    }

    for (const item of input.items) {
      if (!item.slug || !item.name) {
        throw new BadRequestException("Item invalido");
      }
      if (!Number.isFinite(item.price) || item.price <= 0) {
        throw new BadRequestException("Precio invalido");
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException("Cantidad invalida");
      }
    }

    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      throw new BadRequestException("Total invalido");
    }

    const order: Order = {
      id: randomUUID(),
      customerEmail: input.customerEmail,
      currency: input.currency,
      items: input.items,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    return this.repository.create(order);
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.repository.findById(id);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const order = await this.repository.findById(id);
    if (!order) {
      return null;
    }
    const updated = { ...order, status };
    await this.repository.update(updated);
    return updated;
  }
}
