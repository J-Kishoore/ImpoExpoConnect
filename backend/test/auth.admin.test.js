const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/config/firebase");
const { config } = require("../src/config/env");

const testEmail = `test.admin.${Date.now()}@example.com`;
const password = "TestPass123";
const hasInviteCode = Boolean(config.adminInviteCode);

test(
  "admin registration and login flow",
  { skip: !hasInviteCode && "ADMIN_INVITE_CODE is not set in .env; admin self-registration is disabled" },
  async (t) => {
    let adminId;

    await t.test("register fails with a wrong invite code", async () => {
      const res = await request(app).post("/api/admin/register").send({
        name: "Wrong Code Admin",
        email: `wrong.${testEmail}`,
        password,
        inviteCode: "not-the-real-code",
      });
      assert.equal(res.status, 403);
    });

    await t.test("register succeeds with the correct invite code", async () => {
      const res = await request(app).post("/api/admin/register").send({
        name: "Test Admin",
        email: testEmail,
        password,
        inviteCode: config.adminInviteCode,
      });
      assert.equal(res.status, 201);
      assert.ok(res.body.token);
      assert.equal(res.body.admin.email, testEmail);
      adminId = res.body.admin.id;
    });

    await t.test("login with correct credentials succeeds", async () => {
      const res = await request(app).post("/api/admin/login").send({ email: testEmail, password });
      assert.equal(res.status, 200);
      assert.ok(res.body.token);
    });

    await t.test("GET /api/me returns the authenticated admin's profile", async () => {
      const login = await request(app).post("/api/admin/login").send({ email: testEmail, password });
      const res = await request(app).get("/api/me").set("Authorization", `Bearer ${login.body.token}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.role, "admin");
      assert.equal(res.body.profile.email, testEmail);
    });

    t.after(async () => {
      if (adminId) await db.collection("admins").doc(adminId).delete();
    });
  }
);
