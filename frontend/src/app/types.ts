export type View =
  | "home" | "products" | "about" | "contact"
  | "buyer-dashboard" | "buyer-catalog" | "buyer-order-form" | "buyer-tracking"
  | "buyer-quotations" | "buyer-payment"
  | "admin-dashboard" | "admin-buyers" | "admin-products" | "admin-orders"
  | "admin-payments" | "admin-reports";

export type Portal = "public" | "buyer" | "admin";
