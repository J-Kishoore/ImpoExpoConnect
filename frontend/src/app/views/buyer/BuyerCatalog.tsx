import { useEffect, useState } from "react";
import { ShoppingCart, Search, Filter } from "lucide-react";
import type { View } from "../../types";
import { Btn, Card } from "../../components/shared";
import { ApiError, getProducts } from "../../lib/api";
import type { PublicProduct } from "../../lib/api";

export function BuyerCatalog({ setView, showToast }: {
  setView: (v: View) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.products))
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load products.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Product Catalog</h2>
          <p className="text-sm text-muted-foreground">Click "Request Order" to initiate a bulk order.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2">
            <Search size={14} className="text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-40 text-sm bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search products..." />
          </div>
          <Btn variant="secondary" size="sm"><Filter size={14} /> Filter</Btn>
        </div>
      </div>
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#f6f4f0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Min Order</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-[#faf9f7] transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.categoryName}</td>
                    <td className="px-4 py-3 font-semibold text-[#1e5c3a]" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.price}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.minOrder}</td>
                    <td className="px-4 py-3 text-right">
                      <Btn variant="primary" size="sm" onClick={() => setView("buyer-order-form")}>
                        <ShoppingCart size={12} /> Request Order
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
