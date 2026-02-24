export type PaymentWebhookEvent = {
  reference: string;
  status: "paid" | "failed" | "pending";
};
