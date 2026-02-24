import { PaymentWebhookEvent } from "./webhook-event";

export function normalizeWebhookPayload(payload: unknown): PaymentWebhookEvent | null {
  const data = payload as {
    reference?: string;
    status?: string;
    data?: {
      transaction?: {
        reference?: string;
        status?: string;
      };
      reference?: string;
      status?: string;
    };
  };

  const reference =
    data?.reference ?? data?.data?.transaction?.reference ?? data?.data?.reference;

  const rawStatus =
    data?.status ?? data?.data?.transaction?.status ?? data?.data?.status;

  if (!reference || !rawStatus) {
    return null;
  }

  return {
    reference,
    status: mapStatus(rawStatus)
  };
}

function mapStatus(status: string): "paid" | "failed" | "pending" {
  const normalized = status.toLowerCase();
  if (["approved", "paid", "succeeded", "success"].includes(normalized)) {
    return "paid";
  }
  if (["declined", "failed", "error", "canceled", "cancelled"].includes(normalized)) {
    return "failed";
  }
  return "pending";
}
