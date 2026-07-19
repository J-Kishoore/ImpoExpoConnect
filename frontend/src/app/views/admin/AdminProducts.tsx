import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import {
  ApiError, createProduct, deleteProduct, listCategories, listProducts, updateProduct,
} from "../../lib/api";
import type { Category, Product } from "../../lib/api";

export function AdminProducts({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const categoryName = (id: string) => categories.find(c => c.id === id)?.name ?? "Uncategorized";

  const load = () => {
    if (!token) return;
    setLoading(true);
    Promise.all([listProducts(token), listCategories(token)])
      .then(([p, c]) => { setProducts(p.products); setCategories(c.categories); })
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load products.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleDelete = async (product: Product) => {
    if (!token) return;
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusyId(product.id);
    try {
      await deleteProduct(token, product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast(`${product.name} deleted.`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to delete product.", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Product Management</h2>
          <p className="text-sm text-muted-foreground">Manage catalog items.</p>
        </div>
        <Btn variant="primary" size="sm" disabled={categories.length === 0} onClick={() => setEditing("new")}>
          <Plus size={14} /> Add Product
        </Btn>
      </div>
      {!loading && categories.length === 0 && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Add at least one category before creating products.
        </div>
      )}
      {loading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">Loading products...</Card>
      ) : products.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No products yet.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <Card key={p.id} className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{categoryName(p.categoryId)}</p>
              </div>
              <p className="text-sm font-semibold text-[#1e5c3a] mb-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.price}</p>
              <p className="text-xs text-muted-foreground mb-3">Min order: {p.minOrder}</p>
              <div className="flex gap-2">
                <Btn variant="secondary" size="sm" disabled={busyId === p.id} className="flex-1 justify-center" onClick={() => setEditing(p)}>
                  <Edit2 size={12} /> Edit
                </Btn>
                <button onClick={() => handleDelete(p)} disabled={busyId === p.id}
                  className="p-1.5 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {editing && token && (
        <EditProductModal
          product={editing === "new" ? null : editing}
          categories={categories}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={saved => {
            setProducts(prev => {
              const exists = prev.some(p => p.id === saved.id);
              return exists ? prev.map(p => (p.id === saved.id ? saved : p)) : [...prev, saved].sort((a, b) => a.name.localeCompare(b.name));
            });
            setEditing(null);
            showToast(editing === "new" ? "Product created." : "Product updated.", "success");
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function EditProductModal({ product, categories, token, onClose, onSaved, showToast }: {
  product: Product | null;
  categories: Category[];
  token: string;
  onClose: () => void;
  onSaved: (p: Product) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [minOrder, setMinOrder] = useState(product?.minOrder ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, categoryId, minOrder, price };
      const res = product ? await updateProduct(token, product.id, payload) : await createProduct(token, payload);
      onSaved(res.product);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to save product.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <Card className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{product ? "Edit Product" : "Add Product"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Product Name</label>
            <input required value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
            <select required value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Min Order</label>
            <input required placeholder="e.g. 5 MT" value={minOrder} onChange={e => setMinOrder(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Price</label>
            <input required placeholder="e.g. $58,000 / MT" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div className="flex gap-2 pt-2">
            <Btn type="submit" variant="primary" disabled={saving} className="flex-1 justify-center">
              {saving ? "Saving..." : "Save Product"}
            </Btn>
            <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      </Card>
    </div>
  );
}
