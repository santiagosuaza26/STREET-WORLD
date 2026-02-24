import { Injectable } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";

type WebhookValidationInput = {
  rawBody: string;
  signature: string;
};

@Injectable()
export class WebhookValidator {
  private readonly secret = process.env.PAYMENTS_WEBHOOK_SECRET ?? "";
  private readonly algo = (process.env.PAYMENTS_WEBHOOK_ALGO ?? "hmac-sha256").toLowerCase();
  private readonly allowInsecure =
    process.env.PAYMENTS_WEBHOOK_ALLOW_INSECURE === "true";

  verify({ rawBody, signature }: WebhookValidationInput): boolean {
    if (!signature) {
      return this.allowInsecure && !this.secret;
    }
    if (!this.secret) {
      return this.allowInsecure;
    }

    if (this.algo !== "hmac-sha256") {
      return false;
    }

    const normalized = signature.split("=").pop()?.trim() ?? signature.trim();

    try {
      const expected = createHmac("sha256", this.secret)
        .update(rawBody)
        .digest("hex");

      const expectedBuffer = Buffer.from(expected, "hex");
      const receivedBuffer = Buffer.from(normalized, "hex");
      if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
      }
      return timingSafeEqual(expectedBuffer, receivedBuffer);
    } catch {
      return false;
    }
  }
}
