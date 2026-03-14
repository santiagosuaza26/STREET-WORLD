import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
}

class ProductService {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  }

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  }

  async getByCategory(category: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/products?category=${category}`);
    return response.data;
  }
}

export const productService = new ProductService();
