import type { View } from "../types";

export const VIEW_TO_PATH: Record<View, string> = {
  "home": "/",
  "products": "/products",
  "about": "/about",
  "contact": "/contact",

  "buyer-login": "/buyer/login",
  "buyer-register": "/buyer/register",
  "buyer-dashboard": "/buyer/dashboard",
  "buyer-catalog": "/buyer/catalog",
  "buyer-order-form": "/buyer/order",
  "buyer-tracking": "/buyer/tracking",
  "buyer-quotations": "/buyer/quotations",
  "buyer-payment": "/buyer/payment",

  "admin-login": "/admin/login",
  "admin-register": "/admin/register",
  "admin-dashboard": "/admin/dashboard",
  "admin-buyers": "/admin/buyers",
  "admin-products": "/admin/products",
  "admin-categories": "/admin/categories",
  "admin-orders": "/admin/orders",
  "admin-payments": "/admin/payments",
  "admin-reports": "/admin/reports",
};

const PATH_TO_VIEW: Record<string, View> = Object.fromEntries(
  Object.entries(VIEW_TO_PATH).map(([view, path]) => [path, view as View])
) as Record<string, View>;

export function viewFromPath(pathname: string): View | null {
  return PATH_TO_VIEW[pathname] ?? null;
}

export function pathFromView(view: View): string {
  return VIEW_TO_PATH[view];
}
