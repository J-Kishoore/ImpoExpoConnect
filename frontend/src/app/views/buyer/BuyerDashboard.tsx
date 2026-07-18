import { Package, ShoppingCart, FileText, CreditCard, Bell, ChevronRight, ArrowRight, Truck, Plus, CheckCircle } from "lucide-react";
import type { ElementType } from "react";
import type { View } from "../../types";
import { orders, activityFeed } from "../../data";
import { Badge, Btn, Card, StatCard } from "../../components/shared";

export function BuyerDashboard({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Welcome back, Al Fajr Trading</h2>
          <p className="text-sm text-muted-foreground">Wednesday, 12 June 2024 · Buyer ID: B-001</p>
        </div>
        <Btn variant="primary" onClick={() => setView("buyer-order-form")}><Plus size={15} /> New Order</Btn>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Active Orders" value="3" sub="2 in transit" color="green" />
        <StatCard icon={FileText} label="Pending Quotations" value="2" sub="Awaiting response" color="amber" />
        <StatCard icon={CheckCircle} label="Approved Orders" value="11" sub="This quarter" color="blue" />
        <StatCard icon={CreditCard} label="Pending Payments" value="1" sub="₹4.2L due" color="slate" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h3 className="font-semibold text-sm text-foreground mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f6f4f0] hover:bg-[#f0ece5] transition-colors cursor-pointer" onClick={() => setView("buyer-tracking")}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center"><Package size={14} className="text-emerald-700" /></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{o.product}</p>
                      <p className="text-xs text-muted-foreground">{o.id} · {o.qty} · {o.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={o.status} />
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setView("buyer-tracking")} className="mt-4 text-xs text-[#1e5c3a] font-medium hover:underline flex items-center gap-1">
              View all orders <ArrowRight size={12} />
            </button>
          </Card>
        </div>
        <div>
          <Card className="p-5 h-full">
            <h3 className="font-semibold text-sm text-foreground mb-4">Activity</h3>
            <div className="space-y-4">
              {activityFeed.map(a => {
                const icons: Record<string, ElementType> = { quote: FileText, payment: CreditCard, order: ShoppingCart, shipped: Truck };
                const Icon = icons[a.type] || Bell;
                return (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#edeae3] flex items-center justify-center flex-shrink-0 mt-0.5"><Icon size={11} className="text-muted-foreground" /></div>
                    <div>
                      <p className="text-xs text-foreground leading-snug">{a.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
