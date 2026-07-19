const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, body.message || "Something went wrong. Please try again.");
  }
  return body as T;
}

export type BuyerProfile = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  country: string | null;
  status: "Pending" | "Active" | "Suspended";
  createdAt: string;
};

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type BuyerRegisterPayload = {
  companyName: string;
  contactName: string;
  email: string;
  password: string;
  country?: string;
  phone?: string;
};

export type AdminRegisterPayload = {
  name: string;
  email: string;
  password: string;
  inviteCode: string;
};

type BuyerAuthResponse = { success: true; token: string; buyer: BuyerProfile };
type AdminAuthResponse = { success: true; token: string; admin: AdminProfile };
type MeResponse =
  | { success: true; role: "buyer"; profile: BuyerProfile }
  | { success: true; role: "admin"; profile: AdminProfile };

export function registerBuyer(payload: BuyerRegisterPayload) {
  return apiFetch<BuyerAuthResponse>("/buyer/register", { method: "POST", body: JSON.stringify(payload) });
}

export function loginBuyer(payload: { email: string; password: string }) {
  return apiFetch<BuyerAuthResponse>("/buyer/login", { method: "POST", body: JSON.stringify(payload) });
}

export function registerAdmin(payload: AdminRegisterPayload) {
  return apiFetch<AdminAuthResponse>("/admin/register", { method: "POST", body: JSON.stringify(payload) });
}

export function loginAdmin(payload: { email: string; password: string }) {
  return apiFetch<AdminAuthResponse>("/admin/login", { method: "POST", body: JSON.stringify(payload) });
}

export function getMe(token: string) {
  return apiFetch<MeResponse>("/me", { method: "GET" }, token);
}

export type BuyerUpdatePayload = Partial<
  Pick<BuyerProfile, "companyName" | "contactName" | "email" | "phone" | "country" | "status">
>;

type BuyerListResponse = { success: true; buyers: BuyerProfile[]; nextCursor: string | null; hasMore: boolean };
type BuyerUpdateResponse = { success: true; buyer: BuyerProfile };
type BuyerDeleteResponse = { success: true; id: string };

export function listBuyers(token: string, opts: { limit?: number; cursor?: string | null } = {}) {
  const params = new URLSearchParams();
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.cursor) params.set("cursor", opts.cursor);
  const qs = params.toString();
  return apiFetch<BuyerListResponse>(`/admin/buyers${qs ? `?${qs}` : ""}`, { method: "GET" }, token);
}

export function updateBuyer(token: string, id: string, patch: BuyerUpdatePayload) {
  return apiFetch<BuyerUpdateResponse>(`/admin/buyers/${id}`, { method: "PATCH", body: JSON.stringify(patch) }, token);
}

export function deleteBuyer(token: string, id: string) {
  return apiFetch<BuyerDeleteResponse>(`/admin/buyers/${id}`, { method: "DELETE" }, token);
}

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  minOrder: string;
  price: string;
  createdAt: string;
};

export type ProductPayload = { name: string; categoryId: string; minOrder: string; price: string };
export type ProductUpdatePayload = Partial<ProductPayload>;

type CategoryListResponse = { success: true; categories: Category[] };
type CategoryMutateResponse = { success: true; category: Category };
type CategoryDeleteResponse = { success: true; id: string };

export function listCategories(token: string) {
  return apiFetch<CategoryListResponse>("/admin/categories", { method: "GET" }, token);
}

export function createCategory(token: string, name: string) {
  return apiFetch<CategoryMutateResponse>("/admin/categories", { method: "POST", body: JSON.stringify({ name }) }, token);
}

export function updateCategory(token: string, id: string, name: string) {
  return apiFetch<CategoryMutateResponse>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }, token);
}

export function deleteCategory(token: string, id: string) {
  return apiFetch<CategoryDeleteResponse>(`/admin/categories/${id}`, { method: "DELETE" }, token);
}

type ProductListResponse = { success: true; products: Product[] };
type ProductMutateResponse = { success: true; product: Product };
type ProductDeleteResponse = { success: true; id: string };

export function listProducts(token: string) {
  return apiFetch<ProductListResponse>("/admin/products", { method: "GET" }, token);
}

export function createProduct(token: string, payload: ProductPayload) {
  return apiFetch<ProductMutateResponse>("/admin/products", { method: "POST", body: JSON.stringify(payload) }, token);
}

export function updateProduct(token: string, id: string, payload: ProductUpdatePayload) {
  return apiFetch<ProductMutateResponse>(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, token);
}

export function deleteProduct(token: string, id: string) {
  return apiFetch<ProductDeleteResponse>(`/admin/products/${id}`, { method: "DELETE" }, token);
}

export type PublicProduct = Product & { categoryName: string };

export function getProducts() {
  return apiFetch<{ success: true; products: PublicProduct[] }>("/products", { method: "GET" });
}

export type OrderStatus = "Requested" | "Quoted" | "Approved" | "In Progress" | "Delayed" | "Completed" | "Rejected";

export type Order = {
  id: string;
  orderCode: string;
  buyerId: string;
  buyerCompanyName: string;
  productId: string;
  productName: string;
  unitPrice: string;
  qty: number;
  deliveryPort: string | null;
  shipmentDate: string | null;
  tradeTerm: string | null;
  qualitySpec: string | null;
  notes: string | null;
  status: OrderStatus;
  quotedAmount: string | null;
  quotedNote: string | null;
  quotedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderCreatePayload = {
  productId: string;
  qty: number;
  deliveryPort?: string;
  shipmentDate?: string;
  tradeTerm?: string;
  qualitySpec?: string;
  notes?: string;
};

export type OrderStatusUpdatePayload = { status: OrderStatus; quotedAmount?: string; quotedNote?: string };

type OrderListResponse = { success: true; orders: Order[] };
type OrderMutateResponse = { success: true; order: Order };

export function createOrder(token: string, payload: OrderCreatePayload) {
  return apiFetch<OrderMutateResponse>("/buyer/orders", { method: "POST", body: JSON.stringify(payload) }, token);
}

export function listMyOrders(token: string) {
  return apiFetch<OrderListResponse>("/buyer/orders", { method: "GET" }, token);
}

export function listAllOrders(token: string) {
  return apiFetch<OrderListResponse>("/admin/orders", { method: "GET" }, token);
}

export function updateOrderStatus(token: string, id: string, payload: OrderStatusUpdatePayload) {
  return apiFetch<OrderMutateResponse>(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, token);
}
