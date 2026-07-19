const { db } = require("../config/firebase");
const { ApiError } = require("../utils/ApiError");

const ORDERS = "orders";
const PRODUCTS = "products";
const BUYERS = "buyers";

const VALID_STATUSES = ["Requested", "Quoted", "Approved", "In Progress", "Delayed", "Completed", "Rejected"];

// Enforced order-lifecycle state machine: admin must quote before approving/rejecting,
// approved orders move into progress, and in-progress orders can be delayed before completing.
const ALLOWED_TRANSITIONS = {
  Requested: ["Quoted"],
  Quoted: ["Approved", "Rejected"],
  Approved: ["In Progress"],
  "In Progress": ["Delayed", "Completed"],
  Delayed: ["In Progress", "Completed"],
  Completed: [],
  Rejected: [],
};

function toPublic(id, data) {
  return { id, ...data };
}

function generateOrderCode() {
  const year = new Date().getFullYear();
  const tail = String(Date.now()).slice(-6);
  return `ORD-${year}-${tail}`;
}

// minOrder is admin-entered free text like "5 MT" — pull the leading number out of it.
function parseMinOrderQuantity(minOrder) {
  const match = String(minOrder).match(/[\d,.]+/);
  if (!match) return null;
  const num = parseFloat(match[0].replace(/,/g, ""));
  return Number.isFinite(num) ? num : null;
}

async function createOrder(buyerId, { productId, qty, deliveryPort, shipmentDate, tradeTerm, qualitySpec, notes }) {
  if (!productId || qty === undefined || qty === null || qty === "") {
    throw new ApiError(400, "productId and qty are required.");
  }
  const qtyNum = Number(qty);
  if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
    throw new ApiError(400, "qty must be a positive number.");
  }

  const [productDoc, buyerDoc] = await Promise.all([
    db.collection(PRODUCTS).doc(productId).get(),
    db.collection(BUYERS).doc(buyerId).get(),
  ]);
  if (!productDoc.exists) throw new ApiError(400, "productId does not reference an existing product.");
  if (!buyerDoc.exists) throw new ApiError(404, "Buyer account not found.");

  const product = productDoc.data();
  const buyer = buyerDoc.data();

  const minOrderQty = parseMinOrderQuantity(product.minOrder);
  if (minOrderQty !== null && qtyNum < minOrderQty) {
    throw new ApiError(400, `Quantity must be at least the minimum order of ${product.minOrder}.`);
  }

  const now = new Date().toISOString();

  const docRef = await db.collection(ORDERS).add({
    orderCode: generateOrderCode(),
    buyerId,
    buyerCompanyName: buyer.companyName,
    productId,
    productName: product.name,
    unitPrice: product.price,
    qty: qtyNum,
    deliveryPort: deliveryPort || null,
    shipmentDate: shipmentDate || null,
    tradeTerm: tradeTerm || null,
    qualitySpec: qualitySpec || null,
    notes: notes || null,
    status: "Requested",
    quotedAmount: null,
    quotedNote: null,
    quotedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  const snap = await docRef.get();
  return toPublic(docRef.id, snap.data());
}

async function listOrdersForBuyer(buyerId) {
  // where(buyerId) + orderBy(createdAt) would need a composite Firestore index;
  // sort in memory instead since a buyer's own order count is small.
  const snap = await db.collection(ORDERS).where("buyerId", "==", buyerId).get();
  return snap.docs
    .map((doc) => toPublic(doc.id, doc.data()))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

async function listAllOrders() {
  const snap = await db.collection(ORDERS).orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) => toPublic(doc.id, doc.data()));
}

async function updateOrderStatus(id, { status, quotedAmount, quotedNote }) {
  const ref = db.collection(ORDERS).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Order not found.");

  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const currentStatus = doc.data().status;
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(status)) {
    const options = allowedNext.length ? allowedNext.join(", ") : "none — this is a final state";
    throw new ApiError(409, `Order is "${currentStatus}" and cannot move directly to "${status}". Allowed next: ${options}.`);
  }

  if (status === "Quoted" && !quotedAmount) {
    throw new ApiError(400, "quotedAmount is required when sending a quotation.");
  }

  const patch = { status, updatedAt: new Date().toISOString() };
  if (status === "Quoted") {
    patch.quotedAmount = String(quotedAmount).trim();
    patch.quotedNote = quotedNote ? String(quotedNote).trim() : null;
    patch.quotedAt = new Date().toISOString();
  }

  await ref.update(patch);
  const updated = await ref.get();
  return toPublic(updated.id, updated.data());
}

module.exports = { createOrder, listOrdersForBuyer, listAllOrders, updateOrderStatus, VALID_STATUSES };
