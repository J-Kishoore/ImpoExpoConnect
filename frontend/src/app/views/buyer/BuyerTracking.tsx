import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Badge, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, listMyOrders } from "../../lib/api";
import type { Order } from "../../lib/api";
import { ORDER_STEPS, stepIndexForStatus } from "../../lib/orderStatus";

export function BuyerTracking({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    if (!token) return;
    listMyOrders(token)
      .then(res => { setOrders(res.orders); setSelected(res.orders[0] ?? null); })
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load orders.", "error"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Order Tracking</h2>
        <p className="text-sm text-muted-foreground">Real-time status for all your orders.</p>
      </div>
      {loading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">Loading orders...</Card>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">You haven't placed any orders yet.</Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="space-y-2">
            {orders.map(o => (
              <button key={o.id} onClick={() => setSelected(o)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${selected?.id === o.id ? "border-[#1e5c3a] bg-emerald-50/50" : "border-border bg-card hover:border-[#1e5c3a]/30"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{o.productName}</p>
                  <Badge label={o.status} />
                </div>
                <p className="text-xs text-muted-foreground">{o.orderCode} · {o.qty} MT</p>
                <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
          {selected && (
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground">{selected.productName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{selected.orderCode} · {selected.qty} MT · {new Date(selected.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge label={selected.status} />
                </div>
                {selected.status === "Rejected" ? (
                  <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    This order was rejected.{selected.quotedNote ? ` ${selected.quotedNote}` : ""}
                  </div>
                ) : (
                  <>
                    {selected.status === "Delayed" && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2">
                        This order is delayed.{selected.quotedNote ? ` ${selected.quotedNote}` : ""}
                      </div>
                    )}
                    <div className="relative mb-8">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#e5e1d8]" />
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-[#1e5c3a] transition-all duration-500"
                      style={{ width: `${(stepIndexForStatus(selected.status) / (ORDER_STEPS.length - 1)) * (100 - 8)}%` }}
                    />
                    <div className="relative flex justify-between">
                      {ORDER_STEPS.map((step, i) => {
                        const currentStep = stepIndexForStatus(selected.status);
                        const done = i < currentStep;
                        const current = i === currentStep;
                        return (
                          <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative border-2 text-xs font-semibold transition-all ${done ? "bg-[#1e5c3a] border-[#1e5c3a] text-white" : current ? "bg-white border-[#1e5c3a] text-[#1e5c3a]" : "bg-white border-[#e5e1d8] text-muted-foreground"}`}>
                              {done ? <Check size={14} /> : i + 1}
                            </div>
                            <p className={`text-[10px] font-medium text-center ${current ? "text-[#1e5c3a]" : done ? "text-foreground" : "text-muted-foreground"}`}>{step}</p>
                          </div>
                        );
                      })}
                    </div>
                    </div>
                  </>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Order ID", val: selected.orderCode },
                    { label: "Product", val: selected.productName },
                    { label: "Quantity", val: `${selected.qty} MT` },
                    { label: "Order Date", val: new Date(selected.createdAt).toLocaleDateString() },
                    { label: "Shipment Date", val: selected.shipmentDate ? new Date(selected.shipmentDate).toLocaleDateString() : "Not specified" },
                    { label: "Delivery Port", val: selected.deliveryPort || "Not specified" },
                  ].map(d => (
                    <div key={d.label} className="bg-[#f6f4f0] rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{d.label}</p>
                      <p className="text-sm font-medium text-foreground">{d.val}</p>
                    </div>
                  ))}
                </div>
                {selected.quotedAmount && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-800 mb-0.5">Quoted Amount</p>
                    <p className="text-sm font-semibold text-emerald-900" style={{ fontFamily: "JetBrains Mono, monospace" }}>{selected.quotedAmount}</p>
                    {selected.quotedNote && <p className="text-xs text-emerald-700 mt-1">{selected.quotedNote}</p>}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
