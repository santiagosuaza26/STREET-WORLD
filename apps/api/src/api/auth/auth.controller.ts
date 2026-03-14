import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "../../application/auth/auth.service";
import { RegisterDto, LoginDto, AuthResponseDto } from "./dtos";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body(ValidationPipe) body: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(body);
  }

  @Post("login")
  async login(@Body(ValidationPipe) body: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }
}
