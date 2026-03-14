import { Controller, Get, Post, Put, Delete, NotFoundException, Param, Body, Query, ValidationPipe, BadRequestException } from "@nestjs/common";
import { ProductsService } from "../../application/products/products.service";
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from "./dtos";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll(@Query('category') category?: string) {
    if (category) {
      return this.productsService.getByCategory(category);
    }
    return this.productsService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const product = await this.productsService.getById(id);
    if (!product) {
      throw new NotFoundException("Producto no encontrado");
    }
    return product;
  }

  @Post()
  async create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body(ValidationPipe) dto: UpdateProductDto
  ) {
    const updated = await this.productsService.update(id, dto);
    if (!updated) {
      throw new NotFoundException("Producto no encontrado");
    }
    return updated;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const deleted = await this.productsService.delete(id);
    if (!deleted) {
      throw new NotFoundException("Producto no encontrado");
    }
    return { message: "Producto eliminado" };
  }
}
