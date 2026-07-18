const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/config/firebase");

const testEmail = `test.buyer.${Date.now()}@example.com`;
const password = "TestPass123";

test("buyer registration and login flow", async (t) => {
  let buyerId;

  await t.test("register creates a Pending buyer and returns a token", async () => {
    const res = await request(app).post("/api/buyer/register").send({
      companyName: "Test Trading Co",
      contactName: "Jane Test",
      email: testEmail,
      password,
      country: "Testland",
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.buyer.email, testEmail);
    assert.equal(res.body.buyer.status, "Pending");
    assert.equal(res.body.buyer.passwordHash, undefined, "password hash must never be returned");
    buyerId = res.body.buyer.id;
  });

  await t.test("registering the same email again is rejected", async () => {
    const res = await request(app).post("/api/buyer/register").send({
      companyName: "Duplicate Co",
      contactName: "Dup",
      email: testEmail,
      password,
    });
    assert.equal(res.status, 409);
  });

  await t.test("login with correct credentials succeeds", async () => {
    const res = await request(app).post("/api/buyer/login").send({ email: testEmail, password });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  await t.test("login with wrong password is rejected", async () => {
    const res = await request(app).post("/api/buyer/login").send({ email: testEmail, password: "WrongPass123" });
    assert.equal(res.status, 401);
  });

  await t.test("GET /api/me returns the authenticated buyer's profile", async () => {
    const login = await request(app).post("/api/buyer/login").send({ email: testEmail, password });
    const res = await request(app).get("/api/me").set("Authorization", `Bearer ${login.body.token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.role, "buyer");
    assert.equal(res.body.profile.email, testEmail);
  });

  await t.test("GET /api/me without a token is rejected", async () => {
    const res = await request(app).get("/api/me");
    assert.equal(res.status, 401);
  });

  t.after(async () => {
    if (buyerId) await db.collection("buyers").doc(buyerId).delete();
  });
});
