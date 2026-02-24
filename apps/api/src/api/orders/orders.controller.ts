import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { OrderService } from "../../application/orders/order.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get(":id")
  async getOrder(@Param("id") id: string) {
    const order = await this.orderService.getOrder(id);
    if (!order) {
      throw new NotFoundException("Pedido no encontrado");
    }
    return order;
  }
}
