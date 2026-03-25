import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "../../application/users/users.service";
import { USER_REPOSITORY } from "../../domain/users/user-repository";
import { UserEntity } from "../../infrastructure/database/entities";
import { TypeOrmUserRepository } from "../../infrastructure/repositories/typeorm-user.repository";
import { OrdersModule } from "../orders/orders.module";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    OrdersModule,
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
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository
    }
  ]
})
export class UsersModule {}
