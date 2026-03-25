import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
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
import { RedisModule } from "./infrastructure/cache/redis.module";

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
      type: "sqljs",
      autoSave: true,
      location: process.env.DB_PATH || "street_world.db",
      entities: [UserEntity, ProductEntity, ContactMessageEntity, OrderEntity, OrderItemEntity, PaymentEntity],
      synchronize: shouldSynchronize,
      logging: process.env.NODE_ENV === "development",
    };

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RedisModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserEntity, ProductEntity, ContactMessageEntity, OrderEntity, OrderItemEntity, PaymentEntity]),
    ApiModule,
  ],
})
export class AppModule {}
