import { Controller, Get, Post, Put, NotFoundException, Param, Body, ValidationPipe, BadRequestException, Req } from "@nestjs/common";
import { OrderService } from "../../application/orders/order.service";
import { CreateOrderDto } from "./dtos";
import type { Request } from "express";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAll(@Req() req: Request) {
    // If user is authenticated, get their orders
    const userId = (req as any).user?.sub;
    if (userId) {
      return this.orderService.getUserOrders(userId);
    }
    // If admin or no auth required, get all orders
    return this.orderService.getAllOrders();
  }

  @Get(":id")
  async getOrder(@Param("id") id: string) {
    const order = await this.orderService.getOrder(id);
    if (!order) {
      throw new NotFoundException("Pedido no encontrado");
    }
    return order;
  }

  @Post()
  async create(
    @Body(ValidationPipe) dto: CreateOrderDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user?.sub;
    if (!userId) {
      throw new BadRequestException("Usuario no autenticado");
    }

    // Calculate subtotal for each item
    const itemsWithSubtotal = dto.items.map(item => ({
      ...item,
      subtotal: item.unitPrice * item.quantity
    }));

    return this.orderService.createOrder({
      userId,
      items: itemsWithSubtotal,
      notes: dto.notes
    });
  }

  @Put(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: string }
  ) {
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(body.status)) {
      throw new BadRequestException("Estado invalido");
    }

    const updated = await this.orderService.updateStatus(id, body.status as any);
    if (!updated) {
      throw new NotFoundException("Pedido no encontrado");
    }
    return updated;
  }
}
