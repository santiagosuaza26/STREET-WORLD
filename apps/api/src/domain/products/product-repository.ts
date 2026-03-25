import { Product } from "./product";

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");
