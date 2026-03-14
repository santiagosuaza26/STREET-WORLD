import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ContactModule } from "./contact/contact.module";
import { HealthController } from "./controllers/health.controller";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [AuthModule, ContactModule, OrdersModule, PaymentsModule, ProductsModule, UsersModule],
  controllers: [HealthController]
})
export class ApiModule {}
