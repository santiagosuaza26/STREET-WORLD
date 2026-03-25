import { DataSource, DataSourceOptions } from 'typeorm';
import { CategoryEntity } from './infrastructure/database/entities/category.entity';
import { ContactMessageEntity } from './infrastructure/database/entities/contact-message.entity';
import { OrderItemEntity } from './infrastructure/database/entities/order-item.entity';
import { OrderEntity } from './infrastructure/database/entities/order.entity';
import { PaymentEntity } from './infrastructure/database/entities/payment.entity';
import { ProductEntity } from './infrastructure/database/entities/product.entity';
import { UserEntity } from './infrastructure/database/entities/user.entity';

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run migrations against PostgreSQL.');
}

const migrationOptions: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  synchronize: false,
  logging: false,
  entities: [
    UserEntity,
    ProductEntity,
    CategoryEntity,
    ContactMessageEntity,
    OrderEntity,
    OrderItemEntity,
    PaymentEntity,
  ],
  migrations: [
    'src/infrastructure/database/migrations/*.{ts,js}',
    'dist/infrastructure/database/migrations/*.js',
  ],
};

export default new DataSource(migrationOptions);
