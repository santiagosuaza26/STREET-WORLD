import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://127.0.0.1:3001";

function buildCookieHeader(values) {
  return values
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}

test("auth cookie session lifecycle", async () => {
  const uniqueEmail = `auth-e2e-${Date.now()}@example.com`;
  const password = "password123";

  const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: uniqueEmail, password })
  });

  assert.equal(registerResponse.status, 201);
  const registerBody = await registerResponse.json();
  assert.equal(registerBody.email, uniqueEmail);
  assert.ok(registerBody.id);

  const setCookie = registerResponse.headers.getSetCookie();
  assert.ok(setCookie.length >= 2);
  const cookieHeader = buildCookieHeader(setCookie);

  const meResponse = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Cookie: cookieHeader }
  });

  assert.equal(meResponse.status, 200);
  const meBody = await meResponse.json();
  assert.equal(meBody.email, uniqueEmail);

  const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { Cookie: cookieHeader }
  });

  assert.equal(refreshResponse.status, 201);
  const refreshBody = await refreshResponse.json();
  assert.equal(refreshBody.email, uniqueEmail);

  const refreshCookies = refreshResponse.headers.getSetCookie();
  const refreshedCookieHeader = buildCookieHeader(refreshCookies.length > 0 ? refreshCookies : setCookie);

  const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Cookie: refreshedCookieHeader }
  });

  assert.equal(logoutResponse.status, 201);
  const logoutCookies = logoutResponse.headers.getSetCookie();
  const loggedOutCookieHeader = buildCookieHeader(
    logoutCookies.length > 0 ? logoutCookies : refreshCookies.length > 0 ? refreshCookies : setCookie
  );

  const meAfterLogout = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Cookie: loggedOutCookieHeader }
  });

  assert.equal(meAfterLogout.status, 401);
}, { timeout: 30000 });
