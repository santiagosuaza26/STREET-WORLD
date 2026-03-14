import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { OrderService } from "../orders/order.service";
import { UserPaymentMethod } from "../../domain/users/user";
import { USER_REPOSITORY, UserRepository } from "../../domain/users/user-repository";

type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentId?: string;
  addressLine?: string;
  city?: string;
  country?: string;
};

type CreatePaymentMethodInput = {
  holderName: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
};

type UpdatePaymentMethodInput = {
  holderName?: string;
  expMonth?: number;
  expYear?: number;
  isDefault?: boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    private readonly orders: OrderService
  ) {}

  async getProfile(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      documentId: user.documentId ?? "",
      addressLine: user.addressLine ?? "",
      city: user.city ?? "",
      country: user.country ?? "CO",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const updated = await this.users.update(userId, {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      documentId: input.documentId,
      addressLine: input.addressLine,
      city: input.city,
      country: input.country,
    });

    if (!updated) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return this.getProfile(userId);
  }

  async getOrders(userId: string) {
    return this.orders.getUserOrders(userId);
  }

  async getPaymentMethods(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return user.paymentMethods ?? [];
  }

  async createPaymentMethod(userId: string, input: CreatePaymentMethodInput) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const current = user.paymentMethods ?? [];
    const nextMethod: UserPaymentMethod = {
      id: randomUUID(),
      holderName: input.holderName,
      brand: input.brand,
      last4: input.last4,
      expMonth: input.expMonth,
      expYear: input.expYear,
      isDefault: Boolean(input.isDefault) || current.length === 0,
    };

    let methods = [...current, nextMethod];
    if (nextMethod.isDefault) {
      methods = methods.map((method) => ({
        ...method,
        isDefault: method.id === nextMethod.id,
      }));
    }

    await this.users.update(userId, { paymentMethods: methods });
    return methods;
  }

  async updatePaymentMethod(userId: string, paymentMethodId: string, input: UpdatePaymentMethodInput) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const current = user.paymentMethods ?? [];
    const exists = current.some((method) => method.id === paymentMethodId);
    if (!exists) {
      throw new NotFoundException("Metodo de pago no encontrado");
    }

    let methods = current.map((method) =>
      method.id === paymentMethodId
        ? {
            ...method,
            holderName: input.holderName ?? method.holderName,
            expMonth: input.expMonth ?? method.expMonth,
            expYear: input.expYear ?? method.expYear,
            isDefault: input.isDefault ?? method.isDefault,
          }
        : method
    );

    if (input.isDefault) {
      methods = methods.map((method) => ({
        ...method,
        isDefault: method.id === paymentMethodId,
      }));
    }

    await this.users.update(userId, { paymentMethods: methods });
    return methods;
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const current = user.paymentMethods ?? [];
    const target = current.find((method) => method.id === paymentMethodId);
    if (!target) {
      throw new NotFoundException("Metodo de pago no encontrado");
    }

    let methods = current.filter((method) => method.id !== paymentMethodId);
    if (target.isDefault && methods.length > 0) {
      methods = methods.map((method, index) => ({
        ...method,
        isDefault: index === 0,
      }));
    }

    await this.users.update(userId, { paymentMethods: methods });
    return methods;
  }
}
