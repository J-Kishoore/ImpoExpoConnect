const fs = require("fs");
const path = require("path");
const { db } = require("../config/firebase");
const { ApiError } = require("../utils/ApiError");
const notificationService = require("./notificationService");
const { UPLOAD_DIR } = require("../middleware/upload");

const PAYMENTS = "payments";
const ORDERS = "orders";

function toPublic(id, data) {
  const { storedFileName, ...rest } = data; // never leak the on-disk filename
  return { id, ...rest };
}

async function createPayment(buyerId, { orderId, amount }, file) {
  if (!orderId) throw new ApiError(400, "orderId is required.");
  if (!file) throw new ApiError(400, "A payment proof file is required.");

  const orderDoc = await db.collection(ORDERS).doc(orderId).get();
  if (!orderDoc.exists) throw new ApiError(400, "orderId does not reference an existing order.");
  const order = orderDoc.data();
  if (order.buyerId !== buyerId) throw new ApiError(403, "This order does not belong to you.");

  const now = new Date().toISOString();
  const docRef = await db.collection(PAYMENTS).add({
    orderId,
    orderCode: order.orderCode,
    buyerId,
    buyerCompanyName: order.buyerCompanyName,
    amount: amount ? String(amount).trim() : order.quotedAmount || null,
    fileName: file.originalname,
    storedFileName: file.filename,
    mimeType: file.mimetype,
    fileSize: file.size,
    status: "Pending",
    declineReason: null,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  const snap = await docRef.get();
  const payment = toPublic(docRef.id, snap.data());
  await notificationService.create({
    recipient: "admin:all",
    type: "payment_uploaded",
    title: "Payment proof uploaded",
    body: `${order.orderCode} · ${file.originalname} by ${order.buyerCompanyName}.`,
    data: { paymentId: payment.id, orderId: order.orderCode, orderCode: order.orderCode, buyerId },
    link: "/admin/payments",
  });
  return payment;
}

async function listPaymentsForBuyer(buyerId) {
  // where(buyerId) + orderBy(createdAt) needs a composite index; sort in memory instead.
  const snap = await db.collection(PAYMENTS).where("buyerId", "==", buyerId).get();
  return snap.docs
    .map((doc) => toPublic(doc.id, doc.data()))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

async function listAllPayments() {
  const snap = await db.collection(PAYMENTS).orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) => toPublic(doc.id, doc.data()));
}

async function reviewPayment(id, { status, declineReason }) {
  const ref = db.collection(PAYMENTS).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new ApiError(404, "Payment not found.");

  const current = doc.data();
  if (current.status !== "Pending") {
    throw new ApiError(409, `Payment is already "${current.status}" and cannot be reviewed again.`);
  }
  if (!["Approved", "Declined"].includes(status)) {
    throw new ApiError(400, 'status must be "Approved" or "Declined".');
  }
  if (status === "Declined" && !declineReason) {
    throw new ApiError(400, "declineReason is required when declining a payment.");
  }

  const patch = {
    status,
    declineReason: status === "Declined" ? String(declineReason).trim() : null,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await ref.update(patch);
  const updated = await ref.get();
  const payment = toPublic(updated.id, updated.data());

  if (payment.buyerId) {
    const approved = status === "Approved";
    await notificationService.create({
      recipient: `buyer:${payment.buyerId}`,
      type: approved ? "payment_approved" : "payment_declined",
      title: approved ? `Payment for ${payment.orderCode} approved` : `Payment for ${payment.orderCode} declined`,
      body: approved
        ? "Your payment proof has been verified."
        : `Reason: ${String(declineReason).trim()}`,
      data: { paymentId: payment.id, orderCode: payment.orderCode, status },
      link: "/buyer/payment",
    });
  }

  return payment;
}

async function getPaymentFileInfo(id, requester) {
  const doc = await db.collection(PAYMENTS).doc(id).get();
  if (!doc.exists) throw new ApiError(404, "Payment not found.");
  const payment = doc.data();

  if (requester.role !== "admin" && payment.buyerId !== requester.uid) {
    throw new ApiError(403, "You do not have access to this file.");
  }

  const filePath = path.join(UPLOAD_DIR, payment.storedFileName);
  if (!fs.existsSync(filePath)) throw new ApiError(404, "File not found on server.");

  return { filePath, fileName: payment.fileName, mimeType: payment.mimeType };
}

module.exports = { createPayment, listPaymentsForBuyer, listAllPayments, reviewPayment, getPaymentFileInfo };
