import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  documentId?: string;

  @Column({ nullable: true })
  addressLine?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ default: 'CO' })
  country: string;

  @Column({ type: 'simple-json', nullable: true })
  paymentMethods?: Array<{
    id: string;
    holderName: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
