import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://127.0.0.1:3001";

test("checkout requires shipping payload", async () => {
  const response = await fetch(`${BASE_URL}/payments/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-idempotency-key": `checkout-shipping-missing-${Date.now()}`,
    },
    body: JSON.stringify({
      customerEmail: "guest-shipping-missing@example.com",
      currency: "COP",
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

  assert.equal(response.status, 400);
  const body = await response.json();
  assert.ok(body.message, "Expected validation error message");
}, { timeout: 30000 });
