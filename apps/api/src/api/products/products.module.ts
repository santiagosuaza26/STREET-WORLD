import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "../../application/products/products.service";
import { PRODUCT_REPOSITORY } from "../../domain/products/product-repository";
import { InMemoryProductRepository } from "../../infrastructure/products/in-memory-product.repository";

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: InMemoryProductRepository
    }
  ]
})
export class ProductsModule {}
