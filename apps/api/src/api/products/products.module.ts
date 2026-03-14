import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "./products.controller";
import { ProductsService } from "../../application/products/products.service";
import { PRODUCT_REPOSITORY } from "../../domain/products/product-repository";
import { ProductEntity } from "../../infrastructure/database/entities/product.entity";
import { TypeOrmProductRepository } from "../../infrastructure/repositories/typeorm-product.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository
    }
  ]
})
export class ProductsModule {}
