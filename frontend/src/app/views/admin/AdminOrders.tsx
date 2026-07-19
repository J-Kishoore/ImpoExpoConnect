import { useEffect, useState } from "react";
import type { ElementType, FormEvent } from "react";
import { FileText, Check, X, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge, Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, listAllOrders, updateOrderStatus } from "../../lib/api";
import type { Order, OrderStatus } from "../../lib/api";
import { ORDER_TRANSITIONS } from "../../lib/orderStatus";

const ACTION_META: Partial<Record<OrderStatus, { label: string; icon: ElementType; variant: "primary" | "danger" | "secondary" | "accent" }>> = {
  Approved: { label: "Approve", icon: Check, variant: "primary" },
  Rejected: { label: "Reject", icon: X, variant: "danger" },
  "In Progress": { label: "Mark In Progress", icon: Clock, variant: "primary" },
  Delayed: { label: "Mark Delayed", icon: AlertTriangle, variant: "secondary" },
  Completed: { label: "Mark Completed", icon: CheckCircle, variant: "primary" },
};

export function AdminOrders({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNote, setQuoteNote] = useState("");

  const load = () => {
    if (!token) return;
    setLoading(true);
    listAllOrders(token)
      .then(res => {
        setOrders(res.orders);
        setSelectedId(prev => prev ?? res.orders[0]?.id ?? null);
      })
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load orders.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const selected = orders.find(o => o.id === selectedId) ?? null;
  const allowedNext = selected ? ORDER_TRANSITIONS[selected.status] : [];
  const needsQuoteForm = allowedNext.includes("Quoted");
  const directActions = allowedNext.filter(s => s !== "Quoted");

  const applyUpdate = async (payload: { status: OrderStatus; quotedAmount?: string; quotedNote?: string }) => {
    if (!token || !selected) return;
    setBusy(true);
    try {
      const res = await updateOrderStatus(token, selected.id, payload);
      setOrders(prev => prev.map(o => (o.id === res.order.id ? res.order : o)));
      showToast(`Order ${res.order.orderCode} is now "${res.order.status}".`, "success");
      setQuoteAmount("");
      setQuoteNote("");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update order.", "error");
    } finally {
      setBusy(false);
    }
  };

  const sendQuote = (e: FormEvent) => {
    e.preventDefault();
    applyUpdate({ status: "Quoted", quotedAmount: quoteAmount, quotedNote: quoteNote });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Order Approval</h2>
        <p className="text-sm text-muted-foreground">Review buyer order requests, send quotations, and move orders through their lifecycle.</p>
      </div>
      {loading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">Loading orders...</Card>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No orders yet.</Card>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-2">
            {orders.map(o => (
              <button key={o.id} onClick={() => setSelectedId(o.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedId === o.id ? "border-[#1e5c3a] bg-emerald-50/40" : "border-border bg-card hover:border-[#1e5c3a]/30"}`}>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{o.productName}</p>
                  <Badge label={o.status} />
                </div>
                <p className="text-xs text-muted-foreground">{o.orderCode} · {o.qty} MT</p>
                <p className="text-xs text-muted-foreground">{o.buyerCompanyName} · {new Date(o.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
          {selected && (
            <div className="lg:col-span-3">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-foreground">Order Details</h3>
                  <Badge label={selected.status} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  {[
                    { l: "Order ID", v: selected.orderCode },
                    { l: "Buyer", v: selected.buyerCompanyName },
                    { l: "Product", v: selected.productName },
                    { l: "Quantity", v: `${selected.qty} MT` },
                    { l: "Request Date", v: new Date(selected.createdAt).toLocaleDateString() },
                    { l: "Destination", v: selected.deliveryPort || "Not specified" },
                    { l: "Trade Term", v: selected.tradeTerm || "Not specified" },
                    { l: "Special Req.", v: selected.qualitySpec || "None" },
                  ].map(d => (
                    <div key={d.l} className="bg-[#f6f4f0] rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{d.l}</p>
                      <p className="text-sm font-medium text-foreground">{d.v}</p>
                    </div>
                  ))}
                </div>
                {selected.notes && (
                  <div className="mb-5 p-3 bg-[#f6f4f0] rounded-lg">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Buyer Notes</p>
                    <p className="text-sm text-foreground">{selected.notes}</p>
                  </div>
                )}
                {selected.quotedAmount && (
                  <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-800 mb-0.5">Current Quotation</p>
                    <p className="text-sm font-semibold text-emerald-900" style={{ fontFamily: "JetBrains Mono, monospace" }}>{selected.quotedAmount}</p>
                    {selected.quotedNote && <p className="text-xs text-emerald-700 mt-1">{selected.quotedNote}</p>}
                  </div>
                )}

                {needsQuoteForm && (
                  <form onSubmit={sendQuote} className="mb-5 p-3 bg-[#f6f4f0] rounded-lg space-y-2">
                    <p className="text-xs font-medium text-foreground mb-1.5">Send Quotation</p>
                    <input required value={quoteAmount} onChange={e => setQuoteAmount(e.target.value)}
                      placeholder="Quoted amount, e.g. $580,000"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
                    <textarea rows={2} value={quoteNote} onChange={e => setQuoteNote(e.target.value)}
                      placeholder="Delivery timeline, terms, notes..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 resize-none" />
                    <Btn type="submit" variant="accent" size="sm" disabled={busy}><FileText size={14} /> Send Quote</Btn>
                  </form>
                )}

                {directActions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {directActions.map(status => {
                      const meta = ACTION_META[status];
                      if (!meta) return null;
                      const Icon = meta.icon;
                      return (
                        <Btn key={status} variant={meta.variant} disabled={busy} onClick={() => applyUpdate({ status })}>
                          <Icon size={14} /> {meta.label}
                        </Btn>
                      );
                    })}
                  </div>
                )}

                {!needsQuoteForm && directActions.length === 0 && (
                  <p className="text-sm text-muted-foreground">This order is {selected.status.toLowerCase()} — no further actions available.</p>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
