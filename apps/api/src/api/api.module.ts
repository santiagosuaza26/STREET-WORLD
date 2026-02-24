import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./controllers/health.controller";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [AuthModule, OrdersModule, PaymentsModule, ProductsModule],
  controllers: [HealthController]
})
export class ApiModule {}
