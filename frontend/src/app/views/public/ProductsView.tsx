import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { View, Portal } from "../../types";
import { products } from "../../data";
import { Badge, Btn, Card } from "../../components/shared";

export function ProductsView({ setView, setPortal }: { setView: (v: View) => void; setPortal: (p: Portal) => void }) {
  const [category, setCategory] = useState("All");
  const cats = ["All", "Grains", "Vegetables", "Pulses", "Processed"];
  const filtered = category === "All" ? products : products.filter(p => p.category === category);
  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <div className="mb-8">
        <p className="text-[#c47f2e] text-sm font-medium uppercase tracking-widest mb-1">Catalog</p>
        <h1 className="text-3xl font-semibold text-foreground mb-1" style={{ fontFamily: "Fraunces, serif" }}>Product Range</h1>
        <p className="text-muted-foreground text-sm">Premium Indian agricultural commodities available for bulk export.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {cats.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === c ? "bg-[#1e5c3a] text-white" : "bg-[#edeae3] text-muted-foreground hover:bg-[#e0dbd0]"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => (
          <Card key={p.id} className="overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-44 overflow-hidden bg-[#e5e1d8]">
              <img src={`https://images.unsplash.com/${p.img}?w=400&h=200&fit=crop&auto=format`}
                alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-foreground">{p.name}</h2>
                <Badge label={p.stock} />
              </div>
              <p className="text-xs text-muted-foreground mb-3">{p.category} · Min order: {p.minOrder}</p>
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-[#1e5c3a]">{p.price} <span className="text-xs font-normal text-muted-foreground">/ {p.unit}</span></p>
                <Btn variant="primary" size="sm" onClick={() => { setPortal("buyer"); setView("buyer-order-form"); }}>
                  <ShoppingCart size={13} /> Order
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
