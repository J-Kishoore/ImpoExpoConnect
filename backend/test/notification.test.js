const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/config/firebase");
const notificationService = require("../src/services/notificationService");

const testEmail = `test.buyer.notif.${Date.now()}@example.com`;
const password = "TestPass123";

test("notifications: admin broadcast, buyer read flow, and access control", async (t) => {
  let buyerToken;
  let buyerId;
  const createdNotificationIds = [];

  await t.test("registering a buyer notifies admins", async () => {
    const res = await request(app).post("/api/buyer/register").send({
      companyName: "Notif Trading Co",
      contactName: "Notif Buyer",
      email: testEmail,
      password,
      country: "Testland",
    });
    assert.equal(res.status, 201);
    buyerToken = res.body.token;
    buyerId = res.body.buyer.id;

    const adminNotifications = await notificationService.listForRecipient("admin:all");
    const registered = adminNotifications.notifications.find((n) => n.type === "buyer_registered");
    assert.ok(registered, "an admin buyer_registered notification should exist");
    assert.equal(registered.data.buyerId, buyerId);
  });

  await t.test("unauthenticated access to /api/notifications is rejected", async () => {
    const res = await request(app).get("/api/notifications");
    assert.equal(res.status, 401);
  });

  await t.test("buyer list starts empty and returns unreadCount", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.notifications));
    assert.equal(typeof res.body.unreadCount, "number");
  });

  await t.test("buyer can list, count, mark read, and mark all read", async () => {
    const first = await notificationService.create({
      recipient: `buyer:${buyerId}`,
      type: "order_quoted",
      title: "Quotation received for ORD-TEST-1",
      body: "Basmati Rice · 5 MT priced at $58,000.",
      data: { orderCode: "ORD-TEST-1" },
      link: "/buyer/quotations",
    });
    createdNotificationIds.push(first.id);
    const second = await notificationService.create({
      recipient: `buyer:${buyerId}`,
      type: "payment_approved",
      title: "Payment approved",
      body: "Your payment proof has been verified.",
      data: { orderCode: "ORD-TEST-1" },
      link: "/buyer/payment",
    });
    createdNotificationIds.push(second.id);

    const countRes = await request(app)
      .get("/api/notifications/unread-count")
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(countRes.status, 200);
    assert.equal(countRes.body.unreadCount, 2);

    const listRes = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(listRes.status, 200);
    assert.equal(listRes.body.unreadCount, 2);
    assert.ok(listRes.body.notifications.some((n) => n.id === first.id));
    assert.ok(listRes.body.notifications.some((n) => n.id === second.id));

    const markRes = await request(app)
      .patch(`/api/notifications/${first.id}/read`)
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(markRes.status, 200);
    assert.equal(markRes.body.notification.isRead, true);

    const countAfter = await request(app)
      .get("/api/notifications/unread-count")
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(countAfter.body.unreadCount, 1);

    const readAllRes = await request(app)
      .patch("/api/notifications/read-all")
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(readAllRes.status, 200);
    assert.equal(readAllRes.body.marked, 1);

    const countFinal = await request(app)
      .get("/api/notifications/unread-count")
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(countFinal.body.unreadCount, 0);
  });

  await t.test("buyer cannot mark another recipient's notification read", async () => {
    const adminNotif = await notificationService.create({
      recipient: "admin:all",
      type: "order_created",
      title: "New order request",
      body: "ORD-TEST-2 · Maize · 5 MT.",
      data: { orderCode: "ORD-TEST-2" },
      link: "/admin/orders",
    });
    createdNotificationIds.push(adminNotif.id);

    const res = await request(app)
      .patch(`/api/notifications/${adminNotif.id}/read`)
      .set("Authorization", `Bearer ${buyerToken}`);
    assert.equal(res.status, 404);
  });

  t.after(async () => {
    const cleanup = [];
    if (buyerId) cleanup.push(db.collection("buyers").doc(buyerId).delete());
    for (const id of createdNotificationIds) {
      cleanup.push(db.collection("notifications").doc(id).delete());
    }
    await Promise.all(cleanup);
  });
});
