import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice?: number;

  @Column({ default: false })
  onSale: boolean;

  @Column({ default: false })
  isBestSeller: boolean;

  @Column({ default: false })
  isNewArrival: boolean;

  @Column({ default: true })
  inStock: boolean;

  @Column()
  image: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @Column('simple-array', { nullable: true })
  sizes?: string[];

  @Column('simple-array', { nullable: true })
  colors?: string[];

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  collection?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
