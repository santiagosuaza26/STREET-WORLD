import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderItemEntity } from './order-item.entity';
import { PaymentEntity } from './payment.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item: OrderItemEntity) => item.order)
  items: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment: PaymentEntity) => payment.order)
  payments: PaymentEntity[];
}
