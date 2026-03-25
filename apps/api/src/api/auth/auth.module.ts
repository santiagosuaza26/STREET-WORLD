import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "../../application/auth/auth.service";
import { USER_REPOSITORY } from "../../domain/users/user-repository";
import { UserEntity } from "../../infrastructure/database/entities";
import { TypeOrmUserRepository } from "../../infrastructure/repositories/typeorm-user.repository";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error("JWT_SECRET is required");
        }

        return {
          secret,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" },
        };
      },
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository
    }
  ]
})
export class AuthModule {}
