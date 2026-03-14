import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersController } from "./orders.controller";
import { OrderService } from "../../application/orders/order.service";
import { ORDER_REPOSITORY } from "../../domain/orders/order-repository";
import { OrderEntity } from "../../infrastructure/database/entities/order.entity";
import { OrderItemEntity } from "../../infrastructure/database/entities/order-item.entity";
import { TypeOrmOrderRepository } from "../../infrastructure/repositories/typeorm-order.repository";

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  controllers: [OrdersController],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY,
      useClass: TypeOrmOrderRepository
    }
  ],
  exports: [OrderService]
})
export class OrdersModule {}
