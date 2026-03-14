import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateContactMessageDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @IsEmail()
  @MaxLength(160)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(160)
  subject: string;

  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  message: string;
}

export class ContactMessageResponseDto {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}
