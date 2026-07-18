import { Leaf, Package, ShoppingCart, Shield, Globe, TrendingUp, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import type { View } from "../../types";
import { products } from "../../data";
import { Badge, Btn, Card } from "../../components/shared";

export function HomeView({ setView }: { setView: (v: View) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1a2e1f]" style={{ minHeight: 540 }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1400&h=600&fit=crop&auto=format"
            alt="Agricultural commodities" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-medium mb-6">
              <Leaf size={12} />
              Trusted Agricultural Trade Partner
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-5" style={{ fontFamily: "Fraunces, serif" }}>
              India's Premium<br />Agri-Commodity<br />
              <span className="text-emerald-400">Export Platform</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
              Makgrow Impex connects global buyers with certified Indian agricultural suppliers. Streamlined bulk ordering, transparent pricing, and end-to-end trade documentation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn variant="accent" size="lg" onClick={() => setView("products")}>
                <Package size={16} /> Browse Products
              </Btn>
              <button onClick={() => setView("buyer-order-form")}
                className="px-6 py-3 rounded border border-white/30 text-white text-base font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                <ShoppingCart size={16} /> Request Bulk Order
              </button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {[
              { label: "Countries Served", val: "34+" },
              { label: "MT Exported / Year", val: "12,000+" },
              { label: "Active Buyers", val: "180+" },
              { label: "Product Categories", val: "8" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
                <p className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>{s.val}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <p className="text-[#c47f2e] text-sm font-medium uppercase tracking-widest mb-2">Why ImpoExpo Connect</p>
          <h2 className="text-3xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Built for B2B Trade at Scale</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Verified Quality", desc: "Every shipment backed by APEDA, FSSAI, and phytosanitary certifications. Lab-tested quality assurance." },
            { icon: Globe, title: "Global Reach", desc: "Seamless export to UAE, UK, Egypt, Africa and beyond. Full customs & documentation support." },
            { icon: TrendingUp, title: "Transparent Pricing", desc: "Real-time FOB/CIF pricing, instant quotations, and clear invoice trails for your procurement team." },
          ].map(f => (
            <Card key={f.title} className="p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Product Preview */}
      <section className="bg-[#edeae3] py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#c47f2e] text-sm font-medium uppercase tracking-widest mb-1">Our Products</p>
              <h2 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Featured Commodities</h2>
            </div>
            <Btn variant="ghost" onClick={() => setView("products")}>View All <ArrowRight size={14} /></Btn>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map(p => (
              <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-36 overflow-hidden bg-[#e5e1d8]">
                  <img src={`https://images.unsplash.com/${p.img}?w=300&h=160&fit=crop&auto=format`}
                    alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm text-foreground">{p.name}</h3>
                    <Badge label={p.stock} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{p.category} · Min {p.minOrder}</p>
                  <p className="text-sm font-semibold text-[#1e5c3a]">{p.price} / {p.unit}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="rounded-2xl bg-[#1e5c3a] px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "Fraunces, serif" }}>Ready to source premium Indian commodities?</h2>
            <p className="text-emerald-200 text-sm">Register as a buyer and get access to exclusive bulk pricing and dedicated support.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Btn variant="accent" size="lg" onClick={() => setView("contact")}>Get in Touch</Btn>
            <button onClick={() => setView("buyer-dashboard")}
              className="px-6 py-3 rounded border border-emerald-400 text-emerald-200 text-base font-medium hover:bg-emerald-800 transition-colors">
              Buyer Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-10">
        <div className="max-w-7xl mx-auto px-5 grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-[#1e5c3a] flex items-center justify-center"><Leaf size={13} className="text-white" /></div>
              <span className="font-semibold text-foreground text-sm" style={{ fontFamily: "Fraunces, serif" }}>Makgrow Impex Pvt Ltd</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">India's trusted partner for agri-commodity exports to global markets since 2014.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Quick Links</p>
            <div className="space-y-1.5">
              {["Products", "About Us", "Contact"].map(l => (
                <button key={l} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Contact</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin size={12} /> APMC, Vashi, Navi Mumbai 400703</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone size={12} /> +91 98200 00000</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail size={12} /> trade@makgrowimpex.com</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2024 Makgrow Impex Pvt Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
