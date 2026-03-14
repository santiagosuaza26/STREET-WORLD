import { IsArray, IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CheckoutItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  slug: string;

  @IsString()
  @MinLength(1)
  @MaxLength(180)
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(100000000)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  quantity: number;
}

export class CheckoutDto {
  @IsIn(["COP"])
  currency: "COP";

  @IsEmail()
  @MaxLength(160)
  customerEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
