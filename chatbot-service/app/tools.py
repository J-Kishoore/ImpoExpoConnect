from .firebase_client import db

PRODUCTS = "products"
CATEGORIES = "categories"


def _category_names():
    return {doc.id: doc.to_dict().get("name") for doc in db.collection(CATEGORIES).stream()}


def _product_dict(doc, category_names):
    data = doc.data() if hasattr(doc, "data") else doc.to_dict()
    return {
        "id": doc.id,
        "name": data.get("name"),
        "categoryName": category_names.get(data.get("categoryId"), "Uncategorized"),
        "minOrder": data.get("minOrder"),
        "price": data.get("price"),
        "stockQuantity": data.get("stockQuantity"),
    }


def list_products():
    """Return every product in the catalog with its category, price, min order and current stock quantity."""
    category_names = _category_names()
    docs = db.collection(PRODUCTS).order_by("name").stream()
    return {"products": [_product_dict(doc, category_names) for doc in docs]}


def get_product_stock(product_name: str):
    """Look up the current stock quantity for a single product by name (case-insensitive, partial match allowed)."""
    category_names = _category_names()
    needle = product_name.strip().lower()
    docs = db.collection(PRODUCTS).stream()
    matches = []
    for doc in docs:
        data = doc.to_dict()
        name = (data.get("name") or "").lower()
        if needle in name or name in needle:
            matches.append(_product_dict(doc, category_names))
    if not matches:
        return {"found": False, "query": product_name}
    return {"found": True, "matches": matches}


def get_low_stock_products(limit: int = 5):
    """Return the products with the lowest stock quantity, ascending, excluding products with no stock quantity recorded."""
    category_names = _category_names()
    docs = db.collection(PRODUCTS).stream()
    tracked = [
        _product_dict(doc, category_names)
        for doc in docs
        if isinstance(doc.to_dict().get("stockQuantity"), (int, float))
    ]
    tracked.sort(key=lambda p: p["stockQuantity"])
    return {"products": tracked[: max(1, limit)]}


TOOL_REGISTRY = {
    "list_products": list_products,
    "get_product_stock": get_product_stock,
    "get_low_stock_products": get_low_stock_products,
}

TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "list_products",
            "description": "Get the full product catalog, including category, price, minimum order and current stock quantity for every product.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_product_stock",
            "description": "Get the current stock quantity for one specific product by name.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {"type": "string", "description": "The product name to look up, e.g. 'Basmati Rice'."},
                },
                "required": ["product_name"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_low_stock_products",
            "description": "Get the products with the lowest stock quantity, ordered ascending (lowest first).",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {"type": "integer", "description": "How many products to return, default 5."},
                },
            },
        },
    },
]
