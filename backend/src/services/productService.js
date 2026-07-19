const { db } = require("../config/firebase");
const { ApiError } = require("../utils/ApiError");

const PRODUCTS = "products";
const CATEGORIES = "categories";
const EDITABLE_FIELDS = ["name", "categoryId", "minOrder", "qty", "price"];

function toPublic(id, data) {
  return { id, ...data };
}

async function assertCategoryExists(categoryId) {
  const doc = await db.collection(CATEGORIES).doc(categoryId).get();
  if (!doc.exists) throw new ApiError(400, "categoryId does not reference an existing category.");
}

function parseQty(value) {
  const qty = Number(value);
  if (!Number.isFinite(qty) || qty < 0) throw new ApiError(400, "qty must be a non-negative number.");
  return qty;
}

async function listProducts() {
  const snap = await db.collection(PRODUCTS).orderBy("name", "asc").get();
  return snap.docs.map((doc) => toPublic(doc.id, doc.data()));
}

async function createProduct({ name, categoryId, minOrder, qty, price }) {
  if (!name || !categoryId || !minOrder || price === undefined || price === null || price === "") {
    throw new ApiError(400, "name, categoryId, minOrder and price are required.");
  }
  const qtyNum = parseQty(qty);
  await assertCategoryExists(categoryId);

  const docRef = await db.collection(PRODUCTS).add({
    name: String(name).trim(),
    categoryId,
    minOrder: String(minOrder).trim(),
    qty: qtyNum,
    price: String(price).trim(),
    createdAt: new Date().toISOString(),
  });
  const snap = await docRef.get();
  return toPublic(docRef.id, snap.data());
}

async function updateProduct(id, updates) {
  const ref = db.collection(PRODUCTS).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Product not found.");

  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    if (updates[field] === undefined) continue;
    patch[field] = updates[field];
  }

  if (patch.categoryId) await assertCategoryExists(patch.categoryId);
  if (patch.qty !== undefined) patch.qty = parseQty(patch.qty);
  if (patch.name) patch.name = String(patch.name).trim();
  if (patch.minOrder) patch.minOrder = String(patch.minOrder).trim();
  if (patch.price) patch.price = String(patch.price).trim();

  if (Object.keys(patch).length === 0) {
    throw new ApiError(400, "No editable fields provided.");
  }

  patch.updatedAt = new Date().toISOString();
  await ref.update(patch);
  const updated = await ref.get();
  return toPublic(updated.id, updated.data());
}

async function deleteProduct(id) {
  const ref = db.collection(PRODUCTS).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Product not found.");
  await ref.delete();
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct };
