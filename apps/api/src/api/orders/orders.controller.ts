import { Controller, Get, Param } from "@nestjs/common";
import { OrderService } from "../../application/orders/order.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get(":id")
  async getOrder(@Param("id") id: string) {
    return this.orderService.getOrder(id);
  }
}
