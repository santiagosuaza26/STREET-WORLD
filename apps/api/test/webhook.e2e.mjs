import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

const BASE_URL = "http://127.0.0.1:3001";
const WEBHOOK_SECRET = process.env.PAYMENTS_WEBHOOK_SECRET ?? "replace-me";

test("webhook signature and deduplication", async () => {
  const checkoutResponse = await fetch(`${BASE_URL}/payments/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-idempotency-key": `wh-e2e-${Date.now()}`,
    },
    body: JSON.stringify({
      customerEmail: "webhook-e2e@example.com",
      currency: "COP",
      shipping: {
        firstName: "Webhook",
        lastName: "Tester",
        phone: "3000000000",
        addressLine: "Calle 1 # 2-3",
        city: "Bogota",
        country: "CO",
      },
      items: [
        {
          slug: "hoodie-andes",
          name: "Hoodie Andes",
          price: 189000,
          quantity: 1,
        },
      ],
    }),
  });

  assert.equal(checkoutResponse.status, 201);
  const checkoutBody = await checkoutResponse.json();
  assert.ok(checkoutBody.orderId);

  const webhookPayload = {
    id: `evt-${Date.now()}`,
    reference: checkoutBody.orderId,
    status: "approved",
  };
  const rawBody = JSON.stringify(webhookPayload);
  const signature = createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");

  const firstWebhook = await fetch(`${BASE_URL}/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-signature": signature,
    },
    body: rawBody,
  });

  assert.equal(firstWebhook.status, 201);
  const firstBody = await firstWebhook.json();
  assert.equal(firstBody.ok, true);
  assert.ok(firstBody.order);

  const duplicatedWebhook = await fetch(`${BASE_URL}/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-signature": signature,
    },
    body: rawBody,
  });

  assert.equal(duplicatedWebhook.status, 201);
  const duplicatedBody = await duplicatedWebhook.json();
  assert.equal(duplicatedBody.ok, true);
  assert.equal(duplicatedBody.duplicate, true);
}, { timeout: 30000 });
