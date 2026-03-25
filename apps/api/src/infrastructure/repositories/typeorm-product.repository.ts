import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../database/entities/product.entity';
import { ProductRepository } from '../../domain/products/product-repository';
import { Product } from '../../domain/products/product';
import { randomUUID } from 'crypto';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async create(product: Product): Promise<Product> {
    const entity = await this.repository.save({
      id: product.id || randomUUID(),
      slug: product.slug,
      name: product.name,
      description: product.description,
      summary: product.summary,
      tag: product.tag,
      gender: product.gender ?? "unisex",
      highlights: product.highlights,
      price: product.price,
      salePrice: product.salePrice,
      onSale: product.onSale ?? false,
      isBestSeller: product.isBestSeller ?? false,
      isNewArrival: product.isNewArrival ?? false,
      inStock: product.inStock ?? product.stock > 0,
      image: product.image,
      images: product.images,
      category: product.category,
      stock: product.stock,
      sizes: product.sizes,
      colors: product.colors,
      brand: product.brand,
      collection: product.collection,
      createdAt: new Date(),
    });
    return this.mapToDomain(entity);
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find();
    return entities.map((e) => this.mapToDomain(e));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { slug } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const entities = await this.repository.find({ where: { category } });
    return entities.map((e) => this.mapToDomain(e));
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    await this.repository.update(id, {
      ...(product.slug !== undefined && { slug: product.slug }),
      ...(product.name && { name: product.name }),
      ...(product.description && { description: product.description }),
      ...(product.summary !== undefined && { summary: product.summary }),
      ...(product.tag !== undefined && { tag: product.tag }),
      ...(product.gender !== undefined && { gender: product.gender }),
      ...(product.highlights !== undefined && { highlights: product.highlights }),
      ...(product.price !== undefined && { price: product.price }),
      ...(product.image && { image: product.image }),
      ...(product.stock !== undefined && { stock: product.stock }),
      ...(product.salePrice !== undefined && { salePrice: product.salePrice }),
      ...(product.onSale !== undefined && { onSale: product.onSale }),
      ...(product.isBestSeller !== undefined && { isBestSeller: product.isBestSeller }),
      ...(product.isNewArrival !== undefined && { isNewArrival: product.isNewArrival }),
      ...(product.inStock !== undefined && { inStock: product.inStock }),
      ...(product.images !== undefined && { images: product.images }),
      ...(product.sizes !== undefined && { sizes: product.sizes }),
      ...(product.colors !== undefined && { colors: product.colors }),
      ...(product.brand !== undefined && { brand: product.brand }),
      ...(product.collection !== undefined && { collection: product.collection }),
      updatedAt: new Date(),
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private mapToDomain(entity: ProductEntity): Product {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      description: entity.description,
      summary: entity.summary,
      tag: entity.tag,
      gender: entity.gender,
      highlights: entity.highlights,
      price: Number(entity.price),
      salePrice: entity.salePrice !== null && entity.salePrice !== undefined ? Number(entity.salePrice) : undefined,
      onSale: entity.onSale,
      isBestSeller: entity.isBestSeller,
      isNewArrival: entity.isNewArrival,
      inStock: entity.inStock,
      image: entity.image,
      images: entity.images,
      category: entity.category,
      stock: entity.stock,
      sizes: entity.sizes,
      colors: entity.colors,
      brand: entity.brand,
      collection: entity.collection,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
