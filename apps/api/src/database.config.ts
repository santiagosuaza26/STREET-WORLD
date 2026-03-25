import { DataSource, type DataSourceOptions } from 'typeorm';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { ProductEntity } from './infrastructure/database/entities/product.entity';
import { CategoryEntity } from './infrastructure/database/entities/category.entity';
import { ContactMessageEntity } from './infrastructure/database/entities/contact-message.entity';
import { OrderEntity } from './infrastructure/database/entities/order.entity';
import { OrderItemEntity } from './infrastructure/database/entities/order-item.entity';
import { PaymentEntity } from './infrastructure/database/entities/payment.entity';

const shouldSynchronize =
  process.env.TYPEORM_SYNCHRONIZE === 'true' && process.env.NODE_ENV !== 'production';

const migrationGlobs = [
  'src/infrastructure/database/migrations/*.{ts,js}',
  'dist/infrastructure/database/migrations/*.js',
];

const dataSourceOptions: DataSourceOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: shouldSynchronize,
      logging: process.env.NODE_ENV === 'development',
      entities: [UserEntity, ProductEntity, CategoryEntity, ContactMessageEntity, OrderEntity, OrderItemEntity, PaymentEntity],
      migrations: migrationGlobs,
      subscribers: [],
    }
  : {
      type: 'sqljs',
      autoSave: true,
      location: process.env.DB_PATH || 'street_world.db',
      synchronize: shouldSynchronize,
      logging: process.env.NODE_ENV === 'development',
      entities: [UserEntity, ProductEntity, CategoryEntity, ContactMessageEntity, OrderEntity, OrderItemEntity, PaymentEntity],
      migrations: migrationGlobs,
      subscribers: [],
    };

export const AppDataSource = new DataSource(dataSourceOptions);
