const { db } = require("../config/firebase");
const { ApiError } = require("../utils/ApiError");

const CATEGORIES = "categories";
const PRODUCTS = "products";

function toPublic(id, data) {
  return { id, ...data };
}

async function listCategories() {
  const snap = await db.collection(CATEGORIES).orderBy("name", "asc").get();
  return snap.docs.map((doc) => toPublic(doc.id, doc.data()));
}

async function createCategory({ name }) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new ApiError(400, "name is required.");

  const existing = await db.collection(CATEGORIES).where("name", "==", trimmed).limit(1).get();
  if (!existing.empty) throw new ApiError(409, "A category with this name already exists.");

  const docRef = await db.collection(CATEGORIES).add({ name: trimmed, createdAt: new Date().toISOString() });
  const snap = await docRef.get();
  return toPublic(docRef.id, snap.data());
}

async function updateCategory(id, { name }) {
  const ref = db.collection(CATEGORIES).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Category not found.");

  const trimmed = (name || "").trim();
  if (!trimmed) throw new ApiError(400, "name is required.");

  const existing = await db.collection(CATEGORIES).where("name", "==", trimmed).limit(1).get();
  if (!existing.empty && existing.docs[0].id !== id) {
    throw new ApiError(409, "A category with this name already exists.");
  }

  await ref.update({ name: trimmed, updatedAt: new Date().toISOString() });
  const updated = await ref.get();
  return toPublic(updated.id, updated.data());
}

async function deleteCategory(id) {
  const ref = db.collection(CATEGORIES).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Category not found.");

  const inUse = await db.collection(PRODUCTS).where("categoryId", "==", id).limit(1).get();
  if (!inUse.empty) {
    throw new ApiError(409, "This category is still assigned to one or more products. Reassign or delete those products first.");
  }

  await ref.delete();
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
