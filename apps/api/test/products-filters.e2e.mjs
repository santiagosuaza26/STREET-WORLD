import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://127.0.0.1:3001";

test("products filters endpoint returns aggregated filters", async () => {
  const response = await fetch(`${BASE_URL}/products/filters`);
  assert.equal(response.status, 200);

  const body = await response.json();

  assert.equal(typeof body.totalProducts, "number");
  assert.ok(body.totalProducts >= 0);

  const arrayKeys = ["categories", "genders", "sizes", "colors", "brands", "collections"];
  for (const key of arrayKeys) {
    assert.ok(Array.isArray(body[key]), `Expected array for ${key}`);
    for (const option of body[key]) {
      assert.equal(typeof option.value, "string");
      assert.equal(typeof option.count, "number");
      assert.ok(option.count >= 0);
    }
  }

  assert.equal(typeof body.priceRange, "object");
  assert.equal(typeof body.priceRange.min, "number");
  assert.equal(typeof body.priceRange.max, "number");
  assert.ok(body.priceRange.min <= body.priceRange.max);

  assert.equal(typeof body.generatedAt, "string");
  assert.ok(body.generatedAt.length > 0);
}, { timeout: 30000 });
