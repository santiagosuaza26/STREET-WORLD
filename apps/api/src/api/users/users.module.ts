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
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "dev-secret",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
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
