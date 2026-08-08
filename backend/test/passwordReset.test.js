const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/config/firebase");
const emailService = require("../src/services/emailService");
const tokenService = require("../src/services/tokenService");

const testEmail = `test.reset.${Date.now()}@example.com`;
const password = "TestPass123";
const newPassword = "NewPass123";

const captured = [];
const originalSend = emailService.sendEmail;
emailService.sendEmail = async ({ to, html }) => {
  const match = html.match(/(reset-password|verify-email)\?token=([a-f0-9]+)/);
  if (match) captured.push({ to, path: match[1], token: match[2] });
  return { skipped: true };
};

test("password reset flow", async (t) => {
  let buyerId;
  let resetToken;
  const tokenIds = [];

  await t.test("register a buyer", async () => {
    const res = await request(app).post("/api/buyer/register").send({
      companyName: "Reset Trading Co",
      contactName: "Reset Buyer",
      email: testEmail,
      password,
      country: "Testland",
    });
    assert.equal(res.status, 201);
    buyerId = res.body.buyer.id;
  });

  await t.test("requesting reset for an unknown email still succeeds", async () => {
    const res = await request(app).post("/api/buyer/forgot-password").send({ email: "nobody@example.com" });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  await t.test("requesting reset emails a link and stores a token", async () => {
    const res = await request(app).post("/api/buyer/forgot-password").send({ email: testEmail });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    const reset = captured.find((c) => c.to === testEmail && c.path === "reset-password");
    assert.ok(reset, "a reset email should have been captured");
    resetToken = reset.token;
  });

  await t.test("a wrong token is rejected", async () => {
    const res = await request(app)
      .post("/api/buyer/reset-password")
      .send({ token: "deadbeef", password: newPassword });
    assert.equal(res.status, 400);
  });

  await t.test("resetting with the real token works", async () => {
    const res = await request(app)
      .post("/api/buyer/reset-password")
      .send({ token: resetToken, password: newPassword });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  await t.test("the used token cannot be reused", async () => {
    const res = await request(app)
      .post("/api/buyer/reset-password")
      .send({ token: resetToken, password });
    assert.equal(res.status, 400);
  });

  await t.test("old password no longer works, new password does", async () => {
    const oldLogin = await request(app).post("/api/buyer/login").send({ email: testEmail, password });
    assert.equal(oldLogin.status, 401);
    const newLogin = await request(app).post("/api/buyer/login").send({ email: testEmail, password: newPassword });
    assert.equal(newLogin.status, 200);
  });

  await t.test("an expired token is rejected", async () => {
    const created = await tokenService.createToken({ role: "buyer", userId: buyerId, purpose: "reset", ttl: "1m" });
    tokenIds.push(created.id);
    await db
      .collection("auth_tokens")
      .doc(created.id)
      .update({ expiresAt: new Date(Date.now() - 60000).toISOString() });
    const res = await request(app)
      .post("/api/buyer/reset-password")
      .send({ token: created.token, password: newPassword });
    assert.equal(res.status, 400);
  });

  t.after(async () => {
    const cleanup = [];
    if (buyerId) cleanup.push(db.collection("buyers").doc(buyerId).delete());
    const buyerTokens = await db.collection("auth_tokens").where("userId", "==", buyerId || "__none__").get();
    for (const d of buyerTokens.docs) cleanup.push(d.ref.delete());
    for (const id of tokenIds) cleanup.push(db.collection("auth_tokens").doc(id).delete());
    await Promise.all(cleanup);
    emailService.sendEmail = originalSend;
  });
});
