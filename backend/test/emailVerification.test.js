const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/config/firebase");
const emailService = require("../src/services/emailService");

const testEmail = `test.verify.${Date.now()}@example.com`;
const password = "TestPass123";

const captured = [];
const originalSend = emailService.sendEmail;
emailService.sendEmail = async ({ to, html }) => {
  const match = html.match(/verify-email\?token=([a-f0-9]+)/);
  if (match) captured.push({ to, token: match[1] });
  return { skipped: true };
};

test("email verification flow", async (t) => {
  let buyerId;
  let buyerToken;
  let productId;
  let orderId;

  await t.test("registering a buyer sends a verification email and starts unverified", async () => {
    const res = await request(app).post("/api/buyer/register").send({
      companyName: "Verify Trading Co",
      contactName: "Verify Buyer",
      email: testEmail,
      password,
      country: "Testland",
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.buyer.emailVerified, false);
    buyerId = res.body.buyer.id;
    buyerToken = res.body.token;
    assert.ok(captured.find((c) => c.to === testEmail), "a verification email should have been captured");
  });

  await t.test("orders are blocked before email verification", async () => {
    const productRef = await db.collection("products").add({
      name: "Verify Grain",
      price: "$100",
      minOrder: "1 MT",
      categoryId: "test-cat",
    });
    productId = productRef.id;
    const res = await request(app)
      .post("/api/buyer/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId, qty: 5 });
    assert.equal(res.status, 403);
  });

  await t.test("verifying with the emailed token works", async () => {
    const verify = captured.find((c) => c.to === testEmail);
    const res = await request(app).post("/api/buyer/verify-email").send({ token: verify.token });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    const buyerSnap = await db.collection("buyers").doc(buyerId).get();
    assert.equal(buyerSnap.data().emailVerified, true);
  });

  await t.test("orders succeed after verification", async () => {
    const res = await request(app)
      .post("/api/buyer/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId, qty: 5 });
    assert.equal(res.status, 201);
    orderId = res.body.order.id;
  });

  await t.test("resending verification issues a fresh token and invalidates the old one", async () => {
    const first = captured.find((c) => c.to === testEmail);
    const res = await request(app).post("/api/buyer/resend-verification").send({ email: testEmail });
    assert.equal(res.status, 200);
    const links = captured.filter((c) => c.to === testEmail);
    const latest = links[links.length - 1];
    assert.notEqual(latest.token, first.token, "a fresh token should be issued");

    const oldRes = await request(app).post("/api/buyer/verify-email").send({ token: first.token });
    assert.equal(oldRes.status, 400, "the old link should be invalidated");
  });

  await t.test("a wrong verification token is rejected", async () => {
    const res = await request(app).post("/api/buyer/verify-email").send({ token: "deadbeef" });
    assert.equal(res.status, 400);
  });

  t.after(async () => {
    const cleanup = [];
    if (buyerId) cleanup.push(db.collection("buyers").doc(buyerId).delete());
    if (orderId) cleanup.push(db.collection("orders").doc(orderId).delete());
    if (productId) cleanup.push(db.collection("products").doc(productId).delete());
    if (buyerId) {
      const buyerTokens = await db.collection("auth_tokens").where("userId", "==", buyerId).get();
      for (const d of buyerTokens.docs) cleanup.push(d.ref.delete());
    }
    if (orderId) {
      const notifSnap = await db.collection("notifications").where("data.orderId", "==", orderId).get();
      for (const d of notifSnap.docs) cleanup.push(d.ref.delete());
    }
    await Promise.all(cleanup);
    emailService.sendEmail = originalSend;
  });
});
