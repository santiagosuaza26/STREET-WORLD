import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ProductsService } from "../../application/products/products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll() {
    return this.productsService.getAll();
  }

  @Get(":slug")
  async getBySlug(@Param("slug") slug: string) {
    const product = await this.productsService.getBySlug(slug);
    if (!product) {
      throw new NotFoundException("Producto no encontrado");
    }
    return product;
  }
}
