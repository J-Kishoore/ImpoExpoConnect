import { Package, ShoppingCart, FileText, CreditCard, Menu, Home, Users, LogOut, ChevronRight, Leaf, Globe, BarChart2, Truck } from "lucide-react";
import type { ElementType } from "react";
import type { View, Portal } from "../../types";

type NavItem = { icon: ElementType; label: string; view: View };

export function Sidebar({ portal, view, setView, setPortal, collapsed, setCollapsed }: {
  portal: Portal; view: View; setView: (v: View) => void; setPortal: (p: Portal) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const buyerNav: NavItem[] = [
    { icon: Home, label: "Dashboard", view: "buyer-dashboard" },
    { icon: Package, label: "Product Catalog", view: "buyer-catalog" },
    { icon: ShoppingCart, label: "Order Request", view: "buyer-order-form" },
    { icon: Truck, label: "Order Tracking", view: "buyer-tracking" },
    { icon: FileText, label: "Quotations", view: "buyer-quotations" },
    { icon: CreditCard, label: "Payments", view: "buyer-payment" },
  ];
  const adminNav: NavItem[] = [
    { icon: BarChart2, label: "Dashboard", view: "admin-dashboard" },
    { icon: Users, label: "Buyers", view: "admin-buyers" },
    { icon: Package, label: "Products", view: "admin-products" },
    { icon: ShoppingCart, label: "Orders", view: "admin-orders" },
    { icon: CreditCard, label: "Payments", view: "admin-payments" },
    { icon: FileText, label: "Reports", view: "admin-reports" },
  ];
  const nav = portal === "buyer" ? buyerNav : adminNav;
  const name = portal === "buyer" ? "Al Fajr Trading" : "Admin Panel";
  const role = portal === "buyer" ? "Buyer Account" : "Makgrow Impex";

  return (
    <aside className={`fixed left-0 top-0 h-full z-20 flex flex-col transition-all duration-200 ${collapsed ? "w-16" : "w-56"}`}
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}>
      <div className="flex items-center justify-between px-3 h-16 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Leaf size={14} className="text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate" style={{ fontFamily: "Fraunces, serif" }}>ImpoExpo</p>
              <p className="text-[10px] truncate" style={{ color: "var(--sidebar-accent-foreground)" }}>{role}</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white flex-shrink-0 ml-auto">
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
      </div>
      {!collapsed && (
        <div className="px-3 py-3 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{name}</p>
              <p className="text-xs truncate" style={{ color: "var(--sidebar-accent-foreground)" }}>
                {portal === "buyer" ? "B-001" : "Super Admin"}
              </p>
            </div>
          </div>
        </div>
      )}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = view === item.view;
          return (
            <button key={item.view} onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-white/10 text-white font-medium" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              title={collapsed ? item.label : undefined}>
              <item.icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </nav>
      <div className="px-2 pb-4 space-y-0.5 border-t pt-3" style={{ borderColor: "var(--sidebar-border)" }}>
        {!collapsed && (
          <button onClick={() => { setPortal("public"); setView("home"); }}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors">
            <Globe size={17} />
            <span>Public Site</span>
          </button>
        )}
        <button className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors"
          title={collapsed ? "Logout" : undefined}>
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
