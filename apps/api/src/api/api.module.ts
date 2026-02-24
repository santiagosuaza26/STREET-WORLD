import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./controllers/health.controller";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";

@Module({
  imports: [AuthModule, OrdersModule, PaymentsModule],
  controllers: [HealthController]
})
export class ApiModule {}
