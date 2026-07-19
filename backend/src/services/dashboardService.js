const { db } = require("../config/firebase");

const ORDERS = "orders";
const BUYERS = "buyers";
const MONTHS_BACK = 6;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// quotedAmount is free text like "$580,000" — pull the leading number out of it.
function parseAmount(value) {
  if (!value) return 0;
  const match = String(value).match(/[\d,.]+/);
  if (!match) return 0;
  const num = parseFloat(match[0].replace(/,/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function lastMonths(n) {
  const now = new Date();
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-US", { month: "short" }) });
  }
  return months;
}

async function getDashboardStats() {
  const [ordersSnap, buyersSnap] = await Promise.all([
    db.collection(ORDERS).get(),
    db.collection(BUYERS).get(),
  ]);

  const orders = ordersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const buyers = buyersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const now = Date.now();
  const currentMonthKey = monthKey(new Date().toISOString());

  const totalOrders = orders.length;
  const newOrdersThisWeek = orders.filter((o) => now - new Date(o.createdAt).getTime() <= WEEK_MS).length;
  const pendingApprovals = orders.filter((o) => o.status === "Requested").length;
  const completedRevenue = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + parseAmount(o.quotedAmount), 0);
  const activeBuyers = buyers.filter((b) => b.status === "Active").length;
  const newBuyersThisMonth = buyers.filter((b) => monthKey(b.createdAt) === currentMonthKey).length;

  const monthlyRevenue = lastMonths(MONTHS_BACK).map(({ key, label }) => {
    const monthOrders = orders.filter((o) => monthKey(o.createdAt) === key);
    const revenue = monthOrders
      .filter((o) => o.status === "Completed")
      .reduce((sum, o) => sum + parseAmount(o.quotedAmount), 0);
    return { month: label, revenue, orders: monthOrders.length };
  });

  const volumeByProduct = new Map();
  for (const o of orders) {
    volumeByProduct.set(o.productName, (volumeByProduct.get(o.productName) || 0) + (Number(o.qty) || 0));
  }
  const sortedProducts = [...volumeByProduct.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxVolume = sortedProducts.length ? sortedProducts[0][1] : 1;
  const topProducts = sortedProducts.map(([productName, qty]) => ({
    productName,
    qty,
    pct: Math.round((qty / maxVolume) * 100),
  }));

  const pendingActions = [
    ...orders
      .filter((o) => o.status === "Requested")
      .map((o) => ({ id: `order-${o.id}`, label: `Order ${o.orderCode} — new request`, urgency: "high", time: o.createdAt, target: "admin-orders" })),
    ...orders
      .filter((o) => o.status === "Quoted")
      .map((o) => ({ id: `quote-${o.id}`, label: `Quotation sent for ${o.orderCode} — awaiting approval`, urgency: "medium", time: o.quotedAt || o.updatedAt, target: "admin-orders" })),
    ...buyers
      .filter((b) => b.status === "Pending")
      .map((b) => ({ id: `buyer-${b.id}`, label: `Buyer ${b.companyName} registration pending`, urgency: "medium", time: b.createdAt, target: "admin-buyers" })),
  ]
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 5);

  return {
    totalOrders,
    newOrdersThisWeek,
    pendingApprovals,
    completedRevenue,
    activeBuyers,
    newBuyersThisMonth,
    monthlyRevenue,
    topProducts,
    pendingActions,
  };
}

module.exports = { getDashboardStats };
