import { IsString, IsNumber, IsOptional, MinLength, Min, IsBoolean, IsArray } from 'class-validator';

export class ProductResponseDto {
  id: string;
  slug?: string;
  name: string;
  summary?: string;
  description: string;
  tag?: string;
  gender?: string;
  highlights?: string[];
  price: number;
  salePrice?: number;
  onSale?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  inStock?: boolean;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  brand?: string;
  collection?: string;
  createdAt: Date;
}

export class CreateProductDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsString()
  @MinLength(1)
  image: string;

  @IsString()
  @MinLength(2)
  category: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsBoolean()
  onSale?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @IsOptional()
  @IsBoolean()
  isNewArrival?: boolean;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  collection?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsBoolean()
  onSale?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @IsOptional()
  @IsBoolean()
  isNewArrival?: boolean;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  collection?: string;
}
