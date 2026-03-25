import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentsController } from "./payments.controller";
import { PaymentService } from "../../application/payments/payment.service";
import { PaymentMetricsService } from "../../application/payments/payment-metrics.service";
import { PaymentWebhookRetryService } from "../../application/payments/payment-webhook-retry.service";
import { PaymentsMaintenanceService } from "../../application/payments/payments-maintenance.service";
import { WebhookValidator } from "../../application/payments/webhook-validator";
import { PAYMENT_GATEWAY } from "../../domain/payments/payment-gateway";
import { PRODUCT_REPOSITORY } from "../../domain/products/product-repository";
import { USER_REPOSITORY } from "../../domain/users/user-repository";
import { ProductEntity } from "../../infrastructure/database/entities/product.entity";
import { MockGateway } from "../../infrastructure/payments/mock-gateway";
import { TypeOrmProductRepository } from "../../infrastructure/repositories/typeorm-product.repository";
import { WompiGateway } from "../../infrastructure/payments/wompi-gateway";
import { UserEntity } from "../../infrastructure/database/entities/user.entity";
import { TypeOrmUserRepository } from "../../infrastructure/repositories/typeorm-user.repository";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [OrdersModule, TypeOrmModule.forFeature([UserEntity, ProductEntity])],
  controllers: [PaymentsController],
  providers: [
    PaymentService,
    PaymentMetricsService,
    PaymentWebhookRetryService,
    PaymentsMaintenanceService,
    WebhookValidator,
    WompiGateway,
    MockGateway,
    {
      provide: PAYMENT_GATEWAY,
      useFactory: (wompiGateway: WompiGateway, mockGateway: MockGateway) => {
        const provider = (process.env.PAYMENTS_PROVIDER ?? "mock").toLowerCase();
        return provider === "wompi" ? wompiGateway : mockGateway;
      },
      inject: [WompiGateway, MockGateway]
    },
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository,
    }
  ]
})
export class PaymentsModule {}
