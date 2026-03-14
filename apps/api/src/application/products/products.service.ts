import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Product } from "../../domain/products/product";
import {
  PRODUCT_REPOSITORY,
  ProductRepository
} from "../../domain/products/product-repository";
import { randomUUID } from "crypto";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async getAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async getByCategory(category: string): Promise<Product[]> {
    return this.repository.findByCategory(category);
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    salePrice?: number;
    onSale?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    inStock?: boolean;
    images?: string[];
    sizes?: string[];
    colors?: string[];
    brand?: string;
    collection?: string;
  }): Promise<Product> {
    if (!data.name || !data.description || !data.price || !data.image || !data.category) {
      throw new BadRequestException("Datos incompletos");
    }

    const product: Product = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      price: data.price,
      salePrice: data.salePrice,
      onSale: data.onSale ?? false,
      isBestSeller: data.isBestSeller ?? false,
      isNewArrival: data.isNewArrival ?? false,
      inStock: data.inStock ?? data.stock > 0,
      image: data.image,
      images: data.images,
      category: data.category,
      stock: data.stock || 0,
      sizes: data.sizes,
      colors: data.colors,
      brand: data.brand,
      collection: data.collection,
      createdAt: new Date().toISOString()
    };

    return this.repository.create(product);
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      stock: number;
      salePrice: number;
      onSale: boolean;
      isBestSeller: boolean;
      isNewArrival: boolean;
      inStock: boolean;
      images: string[];
      sizes: string[];
      colors: string[];
      brand: string;
      collection: string;
    }>
  ): Promise<Product | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new BadRequestException("Producto no encontrado");
    }

    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new BadRequestException("Producto no encontrado");
    }

    return this.repository.delete(id);
  }
}
