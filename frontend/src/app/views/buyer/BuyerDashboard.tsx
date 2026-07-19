import { useEffect, useState } from "react";
import { Package, ShoppingCart, FileText, ClipboardList, Bell, ChevronRight, ArrowRight, Plus, CheckCircle } from "lucide-react";
import type { ElementType } from "react";
import type { View } from "../../types";
import { Badge, Btn, Card, StatCard } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, listMyOrders } from "../../lib/api";
import type { BuyerProfile, Order } from "../../lib/api";

type ActivityEntry = { id: string; action: string; time: string; type: "order" | "quote" };

export function BuyerDashboard({ setView }: { setView: (v: View) => void }) {
  const { profile, token } = useAuth();
  const buyer = profile as BuyerProfile | null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    listMyOrders(token)
      .then(res => setOrders(res.orders))
      .catch(() => { /* dashboard degrades gracefully to an empty state */ })
      .finally(() => setLoading(false));
  }, [token]);

  const activeOrders = orders.filter(o => o.status === "In Progress").length;
  const pendingQuotations = orders.filter(o => o.status === "Requested").length;
  const approvedOrders = orders.filter(o => ["Approved", "In Progress", "Completed"].includes(o.status)).length;

  const activity: ActivityEntry[] = orders
    .flatMap((o): ActivityEntry[] => {
      const entries: ActivityEntry[] = [{ id: `${o.id}-created`, action: `Order ${o.orderCode} submitted`, time: o.createdAt, type: "order" }];
      if (o.quotedAt) entries.push({ id: `${o.id}-quoted`, action: `Quotation sent for ${o.orderCode}`, time: o.quotedAt, type: "quote" });
      return entries;
    })
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>
            Welcome back{buyer?.companyName ? `, ${buyer.companyName}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Btn variant="primary" onClick={() => setView("buyer-order-form")}><Plus size={15} /> New Order</Btn>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Active Orders" value={String(activeOrders)} sub="In transit" color="green" />
        <StatCard icon={FileText} label="Pending Quotations" value={String(pendingQuotations)} sub="Awaiting response" color="amber" />
        <StatCard icon={CheckCircle} label="Approved Orders" value={String(approvedOrders)} sub="All time" color="blue" />
        <StatCard icon={ClipboardList} label="Total Orders" value={String(orders.length)} sub="All time" color="slate" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h3 className="font-semibold text-sm text-foreground mb-4">Recent Orders</h3>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet. Place your first bulk order request.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f6f4f0] hover:bg-[#f0ece5] transition-colors cursor-pointer" onClick={() => setView("buyer-tracking")}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center"><Package size={14} className="text-emerald-700" /></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{o.productName}</p>
                        <p className="text-xs text-muted-foreground">{o.orderCode} · {o.qty} MT · {new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge label={o.status} />
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setView("buyer-tracking")} className="mt-4 text-xs text-[#1e5c3a] font-medium hover:underline flex items-center gap-1">
              View all orders <ArrowRight size={12} />
            </button>
          </Card>
        </div>
        <div>
          <Card className="p-5 h-full">
            <h3 className="font-semibold text-sm text-foreground mb-4">Activity</h3>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {activity.map(a => {
                  const icons: Record<string, ElementType> = { quote: FileText, order: ShoppingCart };
                  const Icon = icons[a.type] || Bell;
                  return (
                    <div key={a.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#edeae3] flex items-center justify-center flex-shrink-0 mt-0.5"><Icon size={11} className="text-muted-foreground" /></div>
                      <div>
                        <p className="text-xs text-foreground leading-snug">{a.action}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(a.time).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
