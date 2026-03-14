import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Order, OrderItem, OrderStatus } from "../../domain/orders/order";
import {
  ORDER_REPOSITORY,
  OrderRepository
} from "../../domain/orders/order-repository";

type CreateOrderInput = {
  userId: string;
  items: OrderItem[];
  notes?: string;
};

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepository
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (!input.userId) {
      throw new BadRequestException("Usuario requerido");
    }

    if (input.items.length === 0) {
      throw new BadRequestException("El carrito no puede estar vacio");
    }

    for (const item of input.items) {
      if (!item.productId || !item.productName) {
        throw new BadRequestException("Item invalido");
      }
      if (!Number.isFinite(item.unitPrice) || item.unitPrice <= 0) {
        throw new BadRequestException("Precio invalido");
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException("Cantidad invalida");
      }
      if (!Number.isFinite(item.subtotal) || item.subtotal <= 0) {
        throw new BadRequestException("Subtotal invalido");
      }
    }

    const total = input.items.reduce((sum, item) => sum + item.subtotal, 0);

    if (total <= 0) {
      throw new BadRequestException("Total invalido");
    }

    const order: Order = {
      id: randomUUID(),
      userId: input.userId,
      items: input.items,
      total,
      status: "PENDING",
      notes: input.notes,
      createdAt: new Date().toISOString()
    };

    return this.repository.create(order);
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.repository.findById(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.repository.findByUserId(userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.repository.findAll();
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new BadRequestException("Orden no encontrada");
    }

    return this.repository.update(id, { status });
  }
}
