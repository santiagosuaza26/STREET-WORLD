import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "../../application/auth/auth.service";
import { USER_REPOSITORY } from "../../domain/users/user-repository";
import { InMemoryUserRepository } from "../../infrastructure/users/in-memory-user.repository";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "dev-secret",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository
    }
  ]
})
export class AuthModule {}
