import { IsOptional, IsString, MaxLength, MinLength, Matches, IsNumber, Min, Max, IsBoolean } from "class-validator";

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  documentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  addressLine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  country?: string;
}

export class CreatePaymentMethodDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  holderName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  brand: string;

  @IsString()
  @Matches(/^\d{4}$/)
  last4: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  expMonth: number;

  @IsNumber()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 25)
  expYear: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  holderName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  expMonth?: number;

  @IsOptional()
  @IsNumber()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 25)
  expYear?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
