export const products = [
  { id: 1, name: "Basmati Rice", category: "Grains", unit: "MT", price: "₹58,000", minOrder: "5 MT", stock: "Available", img: "photo-1586201375761-83865001e31c" },
  { id: 2, name: "Red Onions", category: "Vegetables", unit: "MT", price: "₹22,000", minOrder: "2 MT", stock: "Available", img: "photo-1508747703725-719777637510" },
  { id: 3, name: "Wheat Flour (Atta)", category: "Processed", unit: "MT", price: "₹32,500", minOrder: "3 MT", stock: "Available", img: "photo-1574323347407-f5e1ad6d020b" },
  { id: 4, name: "Green Gram (Moong)", category: "Pulses", unit: "MT", price: "₹78,000", minOrder: "2 MT", stock: "Limited", img: "photo-1556228453-efd6c1ff04f6" },
  { id: 5, name: "Toor Dal", category: "Pulses", unit: "MT", price: "₹92,000", minOrder: "1 MT", stock: "Available", img: "photo-1607305387299-a3d9611cd469" },
  { id: 6, name: "Maize / Corn", category: "Grains", unit: "MT", price: "₹19,000", minOrder: "10 MT", stock: "Available", img: "photo-1601593768799-76b6a3780a73" },
];

export const orders = [
  { id: "ORD-2024-0041", product: "Basmati Rice", qty: "10 MT", date: "12 Jun 2024", status: "In Progress", step: 3 },
  { id: "ORD-2024-0038", product: "Red Onions", qty: "5 MT", date: "08 Jun 2024", status: "Quoted", step: 1 },
  { id: "ORD-2024-0035", product: "Wheat Flour", qty: "8 MT", date: "02 Jun 2024", status: "Completed", step: 4 },
  { id: "ORD-2024-0031", product: "Green Gram", qty: "2 MT", date: "28 May 2024", status: "Approved", step: 2 },
];

export const buyers = [
  { id: "B-001", name: "Al Fajr Trading LLC", country: "UAE", email: "info@alfajr.ae", orders: 14, status: "Active" },
  { id: "B-002", name: "Nile Foods Co.", country: "Egypt", email: "procurement@nilefoods.eg", orders: 8, status: "Active" },
  { id: "B-003", name: "Horizon Agri Imports", country: "UK", email: "orders@horizonagri.co.uk", orders: 3, status: "Pending" },
  { id: "B-004", name: "Gulf Commodity Hub", country: "Kuwait", email: "buy@gulfcommodity.kw", orders: 21, status: "Active" },
  { id: "B-005", name: "East Africa Grains Ltd", country: "Kenya", email: "ops@eagrains.co.ke", orders: 6, status: "Suspended" },
];

export const revenueData = [
  { month: "Jan", revenue: 4.2, orders: 12 },
  { month: "Feb", revenue: 5.8, orders: 17 },
  { month: "Mar", revenue: 4.9, orders: 14 },
  { month: "Apr", revenue: 7.1, orders: 22 },
  { month: "May", revenue: 6.3, orders: 19 },
  { month: "Jun", revenue: 8.4, orders: 26 },
];

export const activityFeed = [
  { id: 1, action: "Quotation sent for ORD-2024-0041", time: "2 hours ago", type: "quote" },
  { id: 2, action: "Payment proof uploaded for ORD-2024-0035", time: "5 hours ago", type: "payment" },
  { id: 3, action: "New order ORD-2024-0042 submitted", time: "Yesterday", type: "order" },
  { id: 4, action: "ORD-2024-0031 approved & dispatched", time: "2 days ago", type: "shipped" },
];

export const chatMessages = [
  { id: 1, from: "assistant", text: "Hello! I'm your ImpoExpo Connect assistant. How can I help with your order today?", time: "10:02" },
  { id: 2, from: "user", text: "What's the current price for Basmati Rice (Grade A)?", time: "10:04" },
  { id: 3, from: "assistant", text: "Our Basmati Rice (Grade A) is currently priced at ₹58,000 per metric tonne. Minimum order is 5 MT. Would you like to request a bulk quotation?", time: "10:04" },
];

// ─── Utility Components ───────────────────────────────────────────────────────

export const statusColors: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Limited: "bg-amber-50 text-amber-700 border-amber-200",
  "Out of Stock": "bg-red-50 text-red-700 border-red-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Suspended: "bg-red-50 text-red-700 border-red-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Quoted: "bg-purple-50 text-purple-700 border-purple-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-50 text-slate-600 border-slate-200",
  Requested: "bg-orange-50 text-orange-700 border-orange-200",
};

export const portalTitles: Record<string, string> = {
  "buyer-dashboard": "Dashboard",
  "buyer-catalog": "Product Catalog",
  "buyer-order-form": "New Bulk Order",
  "buyer-tracking": "Order Tracking",
  "buyer-quotations": "Quotations & Invoices",
  "buyer-payment": "Payment Upload",
  "admin-dashboard": "Dashboard",
  "admin-buyers": "Buyer Management",
  "admin-products": "Product Management",
  "admin-categories": "Category Management",
  "admin-orders": "Order Approvals",
  "admin-payments": "Payment Verification",
  "admin-reports": "Reports",
};
