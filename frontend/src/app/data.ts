export const products = [
  ];

export const orders = [
];

export const buyers = [
];

export const revenueData = [
];

export const activityFeed = [
];

export const chatMessages = [
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
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Delayed: "bg-amber-100 text-amber-800 border-amber-300",
  "Pending Review": "bg-purple-50 text-purple-700 border-purple-200",
};

export const portalTitles: Record<string, string> = {
  "buyer-dashboard": "Dashboard",
  "buyer-catalog": "Product Catalog",
  "buyer-order-form": "New Bulk Order",
  "buyer-tracking": "Order Tracking",
  "buyer-quotations": "Quotations & Invoices",
  "buyer-payment": "Payment Upload",
  "buyer-notifications": "Notifications",
  "admin-dashboard": "Dashboard",
  "admin-buyers": "Buyer Management",
  "admin-products": "Product Management",
  "admin-categories": "Category Management",
  "admin-orders": "Order Approvals",
  "admin-payments": "Payment Verification",
  "admin-reports": "Reports",
  "admin-notifications": "Notifications",
};
