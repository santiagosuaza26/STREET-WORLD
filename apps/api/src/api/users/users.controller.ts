import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import type { Request } from "express";
import { UsersService } from "../../application/users/users.service";
import { JwtAuthGuard } from "../guards";
import { CreatePaymentMethodDto, UpdatePaymentMethodDto, UpdateUserProfileDto } from "./dtos";

type AuthedRequest = Request & { user: { sub: string; email: string } };

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getMe(@Req() req: AuthedRequest) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch("me")
  async updateMe(
    @Req() req: AuthedRequest,
    @Body(ValidationPipe) body: UpdateUserProfileDto
  ) {
    return this.usersService.updateProfile(req.user.sub, body);
  }

  @Get("me/orders")
  async getMyOrders(@Req() req: AuthedRequest) {
    return this.usersService.getOrders(req.user.sub);
  }

  @Get("me/payment-methods")
  async getMyPaymentMethods(@Req() req: AuthedRequest) {
    return this.usersService.getPaymentMethods(req.user.sub);
  }

  @Post("me/payment-methods")
  async addPaymentMethod(
    @Req() req: AuthedRequest,
    @Body(ValidationPipe) body: CreatePaymentMethodDto
  ) {
    return this.usersService.createPaymentMethod(req.user.sub, body);
  }

  @Patch("me/payment-methods/:paymentMethodId")
  async updatePaymentMethod(
    @Req() req: AuthedRequest,
    @Param("paymentMethodId") paymentMethodId: string,
    @Body(ValidationPipe) body: UpdatePaymentMethodDto
  ) {
    return this.usersService.updatePaymentMethod(req.user.sub, paymentMethodId, body);
  }

  @Delete("me/payment-methods/:paymentMethodId")
  async deletePaymentMethod(
    @Req() req: AuthedRequest,
    @Param("paymentMethodId") paymentMethodId: string
  ) {
    return this.usersService.deletePaymentMethod(req.user.sub, paymentMethodId);
  }
}
