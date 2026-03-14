import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { ApiModule } from "./api/api.module";
import {
  ContactMessageEntity,
  UserEntity,
  ProductEntity,
  OrderEntity,
  OrderItemEntity,
  PaymentEntity,
} from "./infrastructure/database/entities";

dotenv.config();

const shouldSynchronize =
  process.env.TYPEORM_SYNCHRONIZE === "true" || process.env.NODE_ENV === "development";

const typeOrmConfig: TypeOrmModuleOptions = process.env.DATABASE_URL
  ? {
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [UserEntity, ProductEntity, ContactMessageEntity, OrderEntity, OrderItemEntity, PaymentEntity],
      synchronize: shouldSynchronize,
      logging: process.env.NODE_ENV === "development",
    }
  : {
      type: "sqlite",
      database: process.env.DB_PATH || "street_world.db",
      entities: [UserEntity, ProductEntity, ContactMessageEntity, OrderEntity, OrderItemEntity, PaymentEntity],
      synchronize: shouldSynchronize,
      logging: process.env.NODE_ENV === "development",
    };

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserEntity, ProductEntity, ContactMessageEntity, OrderEntity, OrderItemEntity, PaymentEntity]),
    ApiModule,
  ],
})
export class AppModule {}
