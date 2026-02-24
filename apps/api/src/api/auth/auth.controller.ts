import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../../application/auth/auth.service";

type RegisterRequest = {
  email: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterRequest) {
    return this.authService.register(body);
  }

  @Post("login")
  login(@Body() body: LoginRequest) {
    return this.authService.login(body);
  }
}
