import { test } from "node:test";
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";

const BASE_URL = "http://127.0.0.1:3001";

async function waitForServer(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }
    await delay(250);
  }

  throw new Error("API did not start in time");
}

test("POST /contact creates a message and validates payload", async () => {
  try {
    await waitForServer(`${BASE_URL}/health`);
  } catch {
    assert.fail(
      "API is not reachable on http://127.0.0.1:3001. Start it first (for example: docker compose up -d api)."
    );
  }

  const validPayload = {
    fullName: "Prueba E2E",
    email: "e2e@example.com",
    subject: "Consulta",
    message: "Mensaje valido de prueba para endpoint de contacto"
  };

  const createdResponse = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validPayload)
  });

  assert.equal(createdResponse.status, 201);
  const createdBody = await createdResponse.json();
  assert.ok(createdBody.id);
  assert.equal(createdBody.email, validPayload.email.toLowerCase());
  assert.equal(createdBody.fullName, validPayload.fullName);
  assert.ok(createdBody.createdAt);

  const invalidPayload = {
    ...validPayload,
    message: "corto"
  };

  const invalidResponse = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invalidPayload)
  });

  assert.equal(invalidResponse.status, 400);
}, { timeout: 30000 });
