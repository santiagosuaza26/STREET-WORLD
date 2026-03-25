import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://127.0.0.1:3001";

test("payments metrics endpoint returns counters", async () => {
  const response = await fetch(`${BASE_URL}/payments/metrics`);
  assert.equal(response.status, 200);

  const body = await response.json();
  const keys = [
    "processed",
    "duplicates",
    "failed",
    "retriesScheduled",
    "retriesExecuted",
    "retriesExhausted",
    "reconciliationsRun",
    "reconciledPaid",
    "reconciledCancelled",
    "recentFailuresLast5Min",
  ];

  for (const key of keys) {
    assert.equal(typeof body[key], "number", `Expected numeric metric for ${key}`);
    assert.ok(body[key] >= 0, `Expected non-negative metric for ${key}`);
  }

  assert.equal(typeof body.generatedAt, "string");
  assert.ok(body.generatedAt.length > 0);
}, { timeout: 30000 });
