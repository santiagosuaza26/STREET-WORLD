import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../../domain/products/product";
import {
  PRODUCT_REPOSITORY,
  ProductRepository
} from "../../domain/products/product-repository";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async getAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return this.repository.findBySlug(slug);
  }
}
