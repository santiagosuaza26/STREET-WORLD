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
    const byId = await this.repository.findById(id);
    if (byId) {
      return byId;
    }

    return this.repository.findBySlug(id);
  }

  async getByCategory(category: string): Promise<Product[]> {
    return this.repository.findByCategory(category);
  }

  async getFilters() {
    const products = await this.repository.findAll();

    const categoryCounts = new Map<string, number>();
    const genderCounts = new Map<string, number>();
    const sizeCounts = new Map<string, number>();
    const colorCounts = new Map<string, number>();
    const brandCounts = new Map<string, number>();
    const collectionCounts = new Map<string, number>();

    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;

    for (const product of products) {
      this.increment(categoryCounts, product.category);
      this.increment(genderCounts, product.gender);
      this.increment(brandCounts, product.brand);
      this.increment(collectionCounts, product.collection);

      for (const size of product.sizes ?? []) {
        this.increment(sizeCounts, size);
      }

      for (const color of product.colors ?? []) {
        this.increment(colorCounts, color);
      }

      const effectivePrice =
        product.onSale && product.salePrice !== undefined ? product.salePrice : product.price;
      if (Number.isFinite(effectivePrice) && effectivePrice > 0) {
        minPrice = Math.min(minPrice, effectivePrice);
        maxPrice = Math.max(maxPrice, effectivePrice);
      }
    }

    const hasPrices = Number.isFinite(minPrice) && Number.isFinite(maxPrice) && maxPrice > 0;

    return {
      totalProducts: products.length,
      categories: this.mapToSortedArray(categoryCounts),
      genders: this.mapToSortedArray(genderCounts),
      sizes: this.mapToSortedArray(sizeCounts),
      colors: this.mapToSortedArray(colorCounts),
      brands: this.mapToSortedArray(brandCounts),
      collections: this.mapToSortedArray(collectionCounts),
      priceRange: {
        min: hasPrices ? minPrice : 0,
        max: hasPrices ? maxPrice : 0,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  async create(data: {
    slug?: string;
    name: string;
    summary?: string;
    description: string;
    tag?: string;
    gender?: string;
    highlights?: string[];
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
      slug: this.normalizeSlug(data.slug ?? data.name),
      name: data.name,
      summary: data.summary?.trim() || data.description.slice(0, 140),
      description: data.description,
      tag: data.tag,
      gender: data.gender?.trim().toLowerCase() || "unisex",
      highlights: data.highlights,
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
      slug: string;
      name: string;
      summary: string;
      description: string;
      tag: string;
      gender: string;
      highlights: string[];
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

  private normalizeSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 120);
  }

  private increment(map: Map<string, number>, value: string | undefined) {
    const normalized = value?.trim();
    if (!normalized) {
      return;
    }

    map.set(normalized, (map.get(normalized) ?? 0) + 1);
  }

  private mapToSortedArray(map: Map<string, number>) {
    return Array.from(map.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value, "es"));
  }
}
