import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentService } from "../../application/payments/payment.service";
import { WebhookValidator } from "../../application/payments/webhook-validator";
import { PAYMENT_GATEWAY } from "../../domain/payments/payment-gateway";
import { WompiGateway } from "../../infrastructure/payments/wompi-gateway";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [
    PaymentService,
    WebhookValidator,
    {
      provide: PAYMENT_GATEWAY,
      useClass: WompiGateway
    }
  ]
})
export class PaymentsModule {}
