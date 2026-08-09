import re
from datetime import datetime, timedelta, timezone

from google.cloud import firestore

from .firebase_client import db

PRODUCTS = "products"
CATEGORIES = "categories"
ORDERS = "orders"
BUYERS = "buyers"

VALID_ORDER_STATUSES = ["Requested", "Quoted", "Approved", "In Progress", "Delayed", "Completed", "Rejected"]


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def _parse_dt(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def _parse_amount(value):
    """quotedAmount/price are free text like '$580,000' — pull the leading number out, same as
    backend/src/services/dashboardService.js's parseAmount."""
    if not value:
        return 0
    match = re.search(r"[\d,.]+", str(value))
    if not match:
        return 0
    try:
        return float(match.group(0).replace(",", ""))
    except ValueError:
        return 0


def _month_key(date_str):
    d = _parse_dt(date_str)
    return f"{d.year}-{d.month}" if d else None


def _last_months(n):
    now = datetime.now(timezone.utc)
    months = []
    for i in range(n - 1, -1, -1):
        total = (now.year * 12 + (now.month - 1)) - i
        year, month = divmod(total, 12)
        month += 1
        months.append({"key": f"{year}-{month}", "label": datetime(year, month, 1).strftime("%b")})
    return months


def _category_names():
    return {doc.id: doc.to_dict().get("name") for doc in db.collection(CATEGORIES).stream()}


def _product_dict(doc, category_names):
    data = doc.to_dict()
    return {
        "id": doc.id,
        "name": data.get("name"),
        "categoryName": category_names.get(data.get("categoryId"), "Uncategorized"),
        "minOrder": data.get("minOrder"),
        "price": data.get("price"),
    }


def _order_dict(doc):
    data = doc.to_dict()
    return {
        "id": doc.id,
        "orderCode": data.get("orderCode"),
        "productName": data.get("productName"),
        "qty": data.get("qty"),
        "unitPrice": data.get("unitPrice"),
        "status": data.get("status"),
        "deliveryPort": data.get("deliveryPort"),
        "shipmentDate": data.get("shipmentDate"),
        "quotedAmount": data.get("quotedAmount"),
        "quotedNote": data.get("quotedNote"),
        "createdAt": data.get("createdAt"),
        "updatedAt": data.get("updatedAt"),
    }


# ---------------------------------------------------------------------------
# public tools — no login required
# ---------------------------------------------------------------------------

def list_products():
    """Return the full product catalog: name, category, price and minimum order for every product."""
    category_names = _category_names()
    docs = db.collection(PRODUCTS).order_by("name").stream()
    return {"products": [_product_dict(doc, category_names) for doc in docs]}


def get_product(product_name: str):
    """Look up one product by name (case-insensitive, partial match allowed) for its price and minimum order."""
    category_names = _category_names()
    needle = product_name.strip().lower()
    matches = []
    for doc in db.collection(PRODUCTS).stream():
        data = doc.to_dict()
        name = (data.get("name") or "").lower()
        if needle in name or name in needle:
            matches.append(_product_dict(doc, category_names))
    if not matches:
        return {"found": False, "query": product_name}
    return {"found": True, "matches": matches}


PUBLIC_TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "list_products",
            "description": "Get the full product catalog: every product's category, price and minimum order.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_product",
            "description": "Look up a single product by name to get its price and minimum order.",
            "parameters": {
                "type": "object",
                "properties": {"product_name": {"type": "string", "description": "Product name, e.g. 'Basmati Rice'."}},
                "required": ["product_name"],
            },
        },
    },
]

PUBLIC_TOOL_REGISTRY = {"list_products": list_products, "get_product": get_product}


# ---------------------------------------------------------------------------
# buyer tools — require a logged-in buyer, always scoped to that buyer's own uid
# ---------------------------------------------------------------------------

def list_my_orders(uid: str):
    """List every order this buyer has placed, most recent first."""
    docs = db.collection(ORDERS).where("buyerId", "==", uid).stream()
    orders = sorted((_order_dict(doc) for doc in docs), key=lambda o: o["createdAt"] or "", reverse=True)
    return {"orders": orders}


def get_order_status(uid: str, order_code: str):
    """Look up the status of one of this buyer's own orders by its order code."""
    needle = order_code.strip().lower()
    for doc in db.collection(ORDERS).where("buyerId", "==", uid).stream():
        data = doc.to_dict()
        if (data.get("orderCode") or "").lower() == needle:
            return {"found": True, "order": _order_dict(doc)}
    return {"found": False, "orderCode": order_code}


def get_my_account_status(uid: str):
    """Get this buyer's own account status (active/pending/suspended) and profile details."""
    doc = db.collection(BUYERS).doc(uid).get()
    if not doc.exists:
        return {"found": False}
    data = doc.to_dict()
    return {
        "found": True,
        "companyName": data.get("companyName"),
        "contactName": data.get("contactName"),
        "email": data.get("email"),
        "country": data.get("country"),
        "status": data.get("status"),
        "emailVerified": data.get("emailVerified"),
    }


BUYER_TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "list_my_orders",
            "description": "List all orders the logged-in buyer has placed.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_order_status",
            "description": "Get the status of one of the logged-in buyer's own orders by order code.",
            "parameters": {
                "type": "object",
                "properties": {"order_code": {"type": "string", "description": "e.g. 'ORD-2026-000123'."}},
                "required": ["order_code"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_account_status",
            "description": "Get the logged-in buyer's own account status and profile.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
]


# ---------------------------------------------------------------------------
# admin tools — require a logged-in admin
# ---------------------------------------------------------------------------

def get_dashboard_stats():
    """Get platform-wide business metrics: total orders, revenue, active buyers, top products, pending actions.
    Mirrors backend/src/services/dashboardService.js exactly so numbers match the admin dashboard UI."""
    orders = [{"id": doc.id, **doc.to_dict()} for doc in db.collection(ORDERS).stream()]
    buyers = [{"id": doc.id, **doc.to_dict()} for doc in db.collection(BUYERS).stream()]

    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)
    current_month_key = _month_key(now.isoformat())

    total_orders = len(orders)
    new_orders_this_week = sum(1 for o in orders if (_parse_dt(o.get("createdAt")) or now) >= week_ago)
    pending_approvals = sum(1 for o in orders if o.get("status") == "Requested")
    completed_revenue = sum(_parse_amount(o.get("quotedAmount")) for o in orders if o.get("status") == "Completed")
    active_buyers = sum(1 for b in buyers if b.get("status") == "Active")
    new_buyers_this_month = sum(1 for b in buyers if _month_key(b.get("createdAt")) == current_month_key)

    monthly_revenue = []
    for m in _last_months(6):
        month_orders = [o for o in orders if _month_key(o.get("createdAt")) == m["key"]]
        revenue = sum(_parse_amount(o.get("quotedAmount")) for o in month_orders if o.get("status") == "Completed")
        monthly_revenue.append({"month": m["label"], "revenue": revenue, "orders": len(month_orders)})

    volume_by_product = {}
    for o in orders:
        name = o.get("productName")
        volume_by_product[name] = volume_by_product.get(name, 0) + (o.get("qty") or 0)
    sorted_products = sorted(volume_by_product.items(), key=lambda kv: kv[1], reverse=True)[:4]
    max_volume = sorted_products[0][1] if sorted_products else 1
    top_products = [
        {"productName": name, "qty": qty, "pct": round(qty / max_volume * 100)} for name, qty in sorted_products
    ]

    pending_actions = []
    for o in orders:
        if o.get("status") == "Requested":
            pending_actions.append(
                {"label": f"Order {o.get('orderCode')} — new request", "urgency": "high", "time": o.get("createdAt")}
            )
        elif o.get("status") == "Quoted":
            pending_actions.append(
                {
                    "label": f"Quotation sent for {o.get('orderCode')} — awaiting approval",
                    "urgency": "medium",
                    "time": o.get("quotedAt") or o.get("updatedAt"),
                }
            )
    for b in buyers:
        if b.get("status") == "Pending":
            pending_actions.append(
                {"label": f"Buyer {b.get('companyName')} registration pending", "urgency": "medium", "time": b.get("createdAt")}
            )
    pending_actions.sort(key=lambda a: a.get("time") or "", reverse=True)
    pending_actions = pending_actions[:5]

    return {
        "totalOrders": total_orders,
        "newOrdersThisWeek": new_orders_this_week,
        "pendingApprovals": pending_approvals,
        "completedRevenue": completed_revenue,
        "activeBuyers": active_buyers,
        "newBuyersThisMonth": new_buyers_this_month,
        "monthlyRevenue": monthly_revenue,
        "topProducts": top_products,
        "pendingActions": pending_actions,
    }


def list_orders(status: str | None = None, limit: int = 20):
    """List orders across all buyers, optionally filtered by status, most recent first."""
    if status and status not in VALID_ORDER_STATUSES:
        return {"error": f"status must be one of: {', '.join(VALID_ORDER_STATUSES)}"}
    docs = db.collection(ORDERS).order_by("createdAt", direction=firestore.Query.DESCENDING).stream()
    orders = []
    for doc in docs:
        data = doc.to_dict()
        if status and data.get("status") != status:
            continue
        order = _order_dict(doc)
        order["buyerCompanyName"] = data.get("buyerCompanyName")
        orders.append(order)
        if len(orders) >= max(1, limit):
            break
    return {"orders": orders}


def list_pending_buyers():
    """List buyer accounts awaiting admin approval (status = Pending)."""
    docs = db.collection(BUYERS).where("status", "==", "Pending").stream()
    buyers = [
        {
            "id": doc.id,
            "companyName": doc.to_dict().get("companyName"),
            "contactName": doc.to_dict().get("contactName"),
            "email": doc.to_dict().get("email"),
            "country": doc.to_dict().get("country"),
            "createdAt": doc.to_dict().get("createdAt"),
        }
        for doc in docs
    ]
    return {"buyers": buyers}


ADMIN_TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "get_dashboard_stats",
            "description": "Get platform-wide business metrics: total orders, revenue, active buyers, top-selling products, pending actions.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_orders",
            "description": "List orders across all buyers, optionally filtered by status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": VALID_ORDER_STATUSES, "description": "Optional status filter."},
                    "limit": {"type": "integer", "description": "Max orders to return, default 20."},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_pending_buyers",
            "description": "List buyer accounts awaiting admin approval.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
]

ADMIN_TOOL_REGISTRY = {
    "get_dashboard_stats": get_dashboard_stats,
    "list_orders": list_orders,
    "list_pending_buyers": list_pending_buyers,
}
