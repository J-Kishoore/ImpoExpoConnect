const crypto = require("crypto");
const { db } = require("../config/firebase");
const { ApiError } = require("../utils/ApiError");

const AUTH_TOKENS = "auth_tokens";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function ttlMs(ttl) {
  const match = String(ttl).match(/^(\d+)\s*(m|h|d)$/i);
  if (!match) return 15 * 60 * 1000;
  const n = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const mult = unit === "m" ? 60 * 1000 : unit === "h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  return n * mult;
}

async function createToken({ role, userId, purpose, ttl }) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ttlMs(ttl)).toISOString();
  const docRef = await db.collection(AUTH_TOKENS).add({
    role,
    userId,
    purpose,
    tokenHash: hashToken(token),
    expiresAt,
    usedAt: null,
    createdAt: new Date().toISOString(),
  });
  return { token, id: docRef.id, expiresAt };
}

async function consumeToken({ token, role, purpose }) {
  const tokenHash = hashToken(token);
  const snap = await db.collection(AUTH_TOKENS).where("tokenHash", "==", tokenHash).limit(1).get();
  if (snap.empty) throw new ApiError(400, "Invalid or expired link.");
  const doc = snap.docs[0];
  const data = doc.data();
  if (data.role !== role || data.purpose !== purpose) throw new ApiError(400, "Invalid or expired link.");
  if (data.usedAt) throw new ApiError(400, "Invalid or expired link.");
  if (new Date(data.expiresAt).getTime() < Date.now()) throw new ApiError(400, "Invalid or expired link.");
  await doc.ref.update({ usedAt: new Date().toISOString() });
  return { userId: data.userId };
}

async function invalidateTokens({ role, userId, purpose }) {
  const snap = await db.collection(AUTH_TOKENS).where("userId", "==", userId).get();
  const toMark = snap.docs.filter(
    (d) => d.data().role === role && d.data().purpose === purpose && !d.data().usedAt
  );
  const batch = db.batch();
  for (const doc of toMark) batch.update(doc.ref, { usedAt: new Date().toISOString() });
  if (toMark.length) await batch.commit();
}

module.exports = { createToken, consumeToken, invalidateTokens };
