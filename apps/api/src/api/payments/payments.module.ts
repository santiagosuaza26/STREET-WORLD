import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentService } from "../../application/payments/payment.service";
import { WebhookValidator } from "../../application/payments/webhook-validator";
import { PAYMENT_GATEWAY } from "../../domain/payments/payment-gateway";
import { MockGateway } from "../../infrastructure/payments/mock-gateway";
import { WompiGateway } from "../../infrastructure/payments/wompi-gateway";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [
    PaymentService,
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
    }
  ]
})
export class PaymentsModule {}
