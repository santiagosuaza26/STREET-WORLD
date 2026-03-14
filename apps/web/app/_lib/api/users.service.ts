import { apiClient } from "./client";

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  documentId: string;
  addressLine: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt?: string;
};

export type UpdateUserProfileRequest = Partial<
  Pick<UserProfile, "firstName" | "lastName" | "phone" | "documentId" | "addressLine" | "city" | "country">
>;

export type UserOrderItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type UserOrder = {
  id: string;
  userId: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  items: UserOrderItem[];
  createdAt: string;
};

export type UserPaymentMethod = {
  id: string;
  holderName: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export type CreatePaymentMethodRequest = {
  holderName: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
};

export type UpdatePaymentMethodRequest = Partial<
  Pick<UserPaymentMethod, "holderName" | "expMonth" | "expYear" | "isDefault">
>;

class UsersService {
  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>("/users/me");
    return response.data;
  }

  async updateMe(input: UpdateUserProfileRequest): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>("/users/me", input);
    return response.data;
  }

  async getMyOrders(): Promise<UserOrder[]> {
    const response = await apiClient.get<UserOrder[]>("/users/me/orders");
    return response.data;
  }

  async getMyPaymentMethods(): Promise<UserPaymentMethod[]> {
    const response = await apiClient.get<UserPaymentMethod[]>("/users/me/payment-methods");
    return response.data;
  }

  async addPaymentMethod(input: CreatePaymentMethodRequest): Promise<UserPaymentMethod[]> {
    const response = await apiClient.post<UserPaymentMethod[]>("/users/me/payment-methods", input);
    return response.data;
  }

  async updatePaymentMethod(paymentMethodId: string, input: UpdatePaymentMethodRequest): Promise<UserPaymentMethod[]> {
    const response = await apiClient.patch<UserPaymentMethod[]>(`/users/me/payment-methods/${paymentMethodId}`, input);
    return response.data;
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<UserPaymentMethod[]> {
    const response = await apiClient.delete<UserPaymentMethod[]>(`/users/me/payment-methods/${paymentMethodId}`);
    return response.data;
  }
}

export const usersService = new UsersService();
