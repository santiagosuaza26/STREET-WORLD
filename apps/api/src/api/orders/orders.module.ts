import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrderService } from "../../application/orders/order.service";
import { ORDER_REPOSITORY } from "../../domain/orders/order-repository";
import { InMemoryOrderRepository } from "../../infrastructure/orders/in-memory-order.repository";

@Module({
  controllers: [OrdersController],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY,
      useClass: InMemoryOrderRepository
    }
  ],
  exports: [OrderService]
})
export class OrdersModule {}
