import { Product } from "./product";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
}

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");
