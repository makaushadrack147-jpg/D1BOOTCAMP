import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";
import { createApp } from "../src/app.js";
import { createDatabase } from "../src/db.js";

const config = {
  nodeEnv: "test",
  accessTokenSecret: "test-access-secret-that-is-longer-than-32-characters",
  refreshTokenSecret: "test-refresh-secret-that-is-longer-than-32-characters",
  accessTokenTtl: "15m",
  refreshTokenTtl: "7d",
  refreshTokenTtlSeconds: 7 * 24 * 60 * 60,
};

let directory;
let db;
let app;

function cookiePair(response, name) {
  const cookie = response.headers["set-cookie"].find((item) => item.startsWith(`${name}=`));
  assert.ok(cookie, `${name} cookie should be set`);
  return cookie.split(";")[0];
}

before(() => {
  directory = mkdtempSync(join(tmpdir(), "jwt-auth-test-"));
  db = createDatabase(join(directory, "test.sqlite"));
  app = createApp(db, config);
});

after(() => {
  db.close();
  rmSync(directory, { recursive: true, force: true });
});

test("registers users, protects profile routes, and supports profile updates", async () => {
  const client = request.agent(app);
  const registration = await client.post("/api/auth/register").send({
    username: "sample_user",
    email: "sample@example.com",
    password: "correct horse battery staple",
  });
  assert.equal(registration.status, 201);
  assert.equal(registration.body.user.username, "sample_user");
  assert.match(registration.headers["set-cookie"].join(" "), /HttpOnly/i);

  const profile = await client.get("/api/profile");
  assert.equal(profile.status, 200);
  assert.equal(profile.body.profile.displayName, "sample_user");

  const update = await client.patch("/api/profile").send({ displayName: "Sample Person" });
  assert.equal(update.status, 200);
  assert.equal(update.body.profile.displayName, "Sample Person");

  const me = await client.get("/api/auth/me");
  assert.equal(me.status, 200);
  assert.equal(me.body.user.displayName, "Sample Person");
});

test("rejects weak registration data and duplicate identities", async () => {
  const invalid = await request(app).post("/api/auth/register").send({
    username: "ab",
    email: "not-an-email",
    password: "short",
  });
  assert.equal(invalid.status, 400);

  const duplicate = await request(app).post("/api/auth/register").send({
    username: "sample_user",
    email: "another@example.com",
    password: "correct horse battery staple",
  });
  assert.equal(duplicate.status, 409);
});

test("rotates refresh tokens and revokes the current session on logout", async () => {
  const client = request.agent(app);
  const login = await client.post("/api/auth/login").send({
    username: "sample_user",
    password: "correct horse battery staple",
  });
  assert.equal(login.status, 200);
  const originalRefreshCookie = cookiePair(login, "refresh_token");

  const firstRefresh = await client.post("/api/auth/refresh");
  assert.equal(firstRefresh.status, 200);
  const rotatedRefreshCookie = cookiePair(firstRefresh, "refresh_token");

  const replay = await request(app)
    .post("/api/auth/refresh")
    .set("Cookie", originalRefreshCookie);
  assert.equal(replay.status, 401);

  const logout = await client.post("/api/auth/logout");
  assert.equal(logout.status, 204);

  const afterLogout = await request(app)
    .post("/api/auth/refresh")
    .set("Cookie", rotatedRefreshCookie);
  assert.equal(afterLogout.status, 401);

  const unauthorized = await request(app).get("/api/profile");
  assert.equal(unauthorized.status, 401);
});
