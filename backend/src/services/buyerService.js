const { db } = require("../config/firebase");
const { ApiError } = require("../utils/ApiError");

const BUYERS = "buyers";
const EDITABLE_FIELDS = ["companyName", "contactName", "email", "phone", "country", "status"];
const VALID_STATUSES = ["Pending", "Active", "Suspended"];
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function stripHash(id, data) {
  const { passwordHash, ...rest } = data;
  return { id, ...rest };
}

async function listBuyers({ limit, cursor } = {}) {
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);

  // Firestore has no offset-based paging at scale, so we page by cursoring on the
  // orderBy field itself (createdAt) and over-fetch by one row to detect a next page.
  let query = db.collection(BUYERS).orderBy("createdAt", "desc").limit(pageSize + 1);
  if (cursor) query = query.startAfter(cursor);

  const snap = await query.get();
  const hasMore = snap.docs.length > pageSize;
  const pageDocs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;

  return {
    buyers: pageDocs.map((doc) => stripHash(doc.id, doc.data())),
    nextCursor: hasMore ? pageDocs[pageDocs.length - 1].data().createdAt : null,
    hasMore,
  };
}

async function updateBuyer(id, updates) {
  const ref = db.collection(BUYERS).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Buyer not found.");

  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    if (updates[field] === undefined) continue;
    patch[field] = updates[field];
  }

  if (patch.status && !VALID_STATUSES.includes(patch.status)) {
    throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (patch.email) {
    const normalizedEmail = patch.email.toLowerCase().trim();
    const existing = await db.collection(BUYERS).where("email", "==", normalizedEmail).limit(1).get();
    if (!existing.empty && existing.docs[0].id !== id) {
      throw new ApiError(409, "Another buyer already uses this email.");
    }
    patch.email = normalizedEmail;
  }

  if (Object.keys(patch).length === 0) {
    throw new ApiError(400, "No editable fields provided.");
  }

  patch.updatedAt = new Date().toISOString();
  await ref.update(patch);
  const updated = await ref.get();
  return stripHash(updated.id, updated.data());
}

async function deleteBuyer(id) {
  const ref = db.collection(BUYERS).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Buyer not found.");
  await ref.delete();
}

module.exports = { listBuyers, updateBuyer, deleteBuyer };
