import { apiClient } from './client';

export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: CartItem[];
  createdAt: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
  total: number;
  notes?: string;
}

class OrderService {
  async create(order: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', order);
    return response.data;
  }

  async getById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  }

  async getMyOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  }
}

export const orderService = new OrderService();
