import { useState } from "react";
import { FileText, X, Check, Send } from "lucide-react";
import { orders } from "../../data";
import { Badge, Btn, Card } from "../../components/shared";

export function AdminOrders({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const [selected, setSelected] = useState(orders[0]);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Order Approval</h2>
        <p className="text-sm text-muted-foreground">Review and action buyer order requests.</p>
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-2">
          {orders.map(o => (
            <button key={o.id} onClick={() => setSelected(o)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${selected.id === o.id ? "border-[#1e5c3a] bg-emerald-50/40" : "border-border bg-card hover:border-[#1e5c3a]/30"}`}>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium text-foreground">{o.product}</p>
                <Badge label={o.status} />
              </div>
              <p className="text-xs text-muted-foreground">{o.id} · {o.qty}</p>
              <p className="text-xs text-muted-foreground">Al Fajr Trading · {o.date}</p>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">Order Details</h3>
              <Badge label={selected.status} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              {[
                { l: "Order ID", v: selected.id },
                { l: "Buyer", v: "Al Fajr Trading LLC" },
                { l: "Product", v: selected.product },
                { l: "Quantity", v: selected.qty },
                { l: "Request Date", v: selected.date },
                { l: "Destination", v: "Dubai, UAE" },
                { l: "Trade Term", v: "CIF Dubai" },
                { l: "Special Req.", v: "APEDA cert. required" },
              ].map(d => (
                <div key={d.l} className="bg-[#f6f4f0] rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{d.l}</p>
                  <p className="text-sm font-medium text-foreground">{d.v}</p>
                </div>
              ))}
            </div>
            <div className="mb-5 p-3 bg-[#f6f4f0] rounded-lg">
              <p className="text-xs font-medium text-foreground mb-1.5">Add Quotation / Note</p>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg bg-white border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 resize-none" placeholder="Enter quoted price, delivery timeline, terms..." />
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn variant="primary" onClick={() => showToast(`Order ${selected.id} approved!`, "success")}><Check size={14} /> Approve</Btn>
              <Btn variant="accent" onClick={() => showToast(`Quotation sent for ${selected.id}.`, "info")}><FileText size={14} /> Send Quote</Btn>
              <Btn variant="danger" onClick={() => showToast(`Order ${selected.id} rejected.`, "error")}><X size={14} /> Reject</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
