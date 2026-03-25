export type PaymentWebhookEvent = {
  eventId?: string;
  reference: string;
  status: "paid" | "failed" | "pending";
};
