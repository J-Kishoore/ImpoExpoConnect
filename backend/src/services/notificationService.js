const { db } = require("../config/firebase");
const { ApiError } = require("../utils/ApiError");

const NOTIFICATIONS = "notifications";
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function toPublic(id, data) {
  return { id, ...data };
}

async function create({ recipient, type, title, body, data = {}, link }) {
  const docRef = await db.collection(NOTIFICATIONS).add({
    recipient,
    type,
    title,
    body,
    data,
    link: link || null,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
  const snap = await docRef.get();
  return toPublic(docRef.id, snap.data());
}

async function listForRecipient(recipient, { limit } = {}) {
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  // where(recipient) + orderBy(createdAt) would need a composite Firestore index;
  // sort in memory instead, consistent with the rest of the codebase.
  const snap = await db.collection(NOTIFICATIONS).where("recipient", "==", recipient).get();
  const notifications = snap.docs
    .map((doc) => toPublic(doc.id, doc.data()))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, pageSize);
  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
  };
}

async function getUnreadCount(recipient) {
  const snap = await db.collection(NOTIFICATIONS).where("recipient", "==", recipient).get();
  return snap.docs.filter((doc) => doc.data().isRead === false).length;
}

async function markAsRead(recipient, id) {
  const ref = db.collection(NOTIFICATIONS).doc(id);
  const doc = await ref.get();
  if (!doc.exists || doc.data().recipient !== recipient) {
    throw new ApiError(404, "Notification not found.");
  }
  if (!doc.data().isRead) {
    await ref.update({ isRead: true });
  }
  const updated = await ref.get();
  return toPublic(updated.id, updated.data());
}

async function markAllAsRead(recipient) {
  const snap = await db.collection(NOTIFICATIONS).where("recipient", "==", recipient).get();
  const unread = snap.docs.filter((doc) => doc.data().isRead === false);
  const batch = db.batch();
  for (const doc of unread) {
    batch.update(doc.ref, { isRead: true });
  }
  if (unread.length) await batch.commit();
  return { marked: unread.length };
}

module.exports = { create, listForRecipient, getUnreadCount, markAsRead, markAllAsRead };
