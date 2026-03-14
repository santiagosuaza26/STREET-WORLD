import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../database/entities/order.entity';
import { OrderItemEntity } from '../database/entities/order-item.entity';
import { OrderRepository } from '../../domain/orders/order-repository';
import { Order, OrderItem } from '../../domain/orders/order';
import { randomUUID } from 'crypto';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemRepository: Repository<OrderItemEntity>,
  ) {}

  async create(order: Order): Promise<Order> {
    const orderEntity = await this.orderRepository.save({
      id: order.id || randomUUID(),
      userId: order.userId,
      status: order.status as OrderStatus,
      total: order.total,
      notes: order.notes,
      createdAt: new Date(),
    });

    if (order.items && order.items.length > 0) {
      const items = await this.itemRepository.save(
        order.items.map((item) => ({
          id: randomUUID(),
          orderId: orderEntity.id,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      );
      orderEntity.items = items;
    }

    return this.mapToDomain(orderEntity);
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const entities = await this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.mapToDomain(e));
  }

  async findAll(): Promise<Order[]> {
    const entities = await this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.mapToDomain(e));
  }

  async update(id: string, order: Partial<Order>): Promise<Order | null> {
    await this.orderRepository.update(id, {
      ...(order.status && { status: order.status as OrderStatus }),
      ...(order.notes !== undefined && { notes: order.notes }),
      updatedAt: new Date(),
    });
    return this.findById(id);
  }

  private mapToDomain(entity: OrderEntity): Order {
    return {
      id: entity.id,
      userId: entity.userId,
      status: entity.status as any,
      total: Number(entity.total),
      items: entity.items
        ? entity.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            unitPrice: Number(item.unitPrice),
            quantity: item.quantity,
            subtotal: Number(item.subtotal),
          }))
        : [],
      notes: entity.notes,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
