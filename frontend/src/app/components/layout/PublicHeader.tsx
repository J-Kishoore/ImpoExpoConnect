import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import type { View } from "../../types";
import { Btn } from "../shared";
import { useAuth } from "../../context/AuthContext";

export function PublicHeader({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links: { label: string; v: View }[] = [
    { label: "Home", v: "home" },
    { label: "Products", v: "products" },
    { label: "About", v: "about" },
    { label: "Contact", v: "contact" },
  ];
  const portalCta = role === "buyer"
    ? { label: "Buyer Dashboard", v: "buyer-dashboard" as View }
    : role === "admin"
      ? { label: "Admin Dashboard", v: "admin-dashboard" as View }
      : null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <button onClick={() => setView("home")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1e5c3a] flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground leading-none" style={{ fontFamily: "Fraunces, serif" }}>ImpoExpo Connect</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Makgrow Impex Pvt Ltd</p>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.v} onClick={() => setView(l.v)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${view === l.v ? "bg-[#edeae3] text-[#1e5c3a]" : "text-muted-foreground hover:text-foreground hover:bg-[#f0ece5]"}`}>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {portalCta ? (
            <Btn variant="primary" size="sm" onClick={() => setView(portalCta.v)}>{portalCta.label}</Btn>
          ) : (
            <>
              <Btn variant="secondary" size="sm" onClick={() => setView("buyer-login")}>Buyer Login</Btn>
              <Btn variant="primary" size="sm" onClick={() => setView("admin-login")}>Admin</Btn>
            </>
          )}
        </div>
        <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {links.map(l => (
            <button key={l.v} onClick={() => { setView(l.v); setMobileOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded text-sm text-foreground hover:bg-[#f0ece5]">{l.label}</button>
          ))}
          <div className="flex gap-2 pt-2">
            {portalCta ? (
              <Btn variant="primary" size="sm" onClick={() => { setView(portalCta.v); setMobileOpen(false); }}>{portalCta.label}</Btn>
            ) : (
              <>
                <Btn variant="secondary" size="sm" onClick={() => { setView("buyer-login"); setMobileOpen(false); }}>Buyer Login</Btn>
                <Btn variant="primary" size="sm" onClick={() => { setView("admin-login"); setMobileOpen(false); }}>Admin</Btn>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
