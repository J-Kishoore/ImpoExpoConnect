import { useEffect, useState } from "react";
import { Download, Eye, Printer } from "lucide-react";
import { Badge, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, listMyOrders } from "../../lib/api";
import type { Order } from "../../lib/api";

function quotationStatus(order: Order): string {
  if (order.status === "Quoted") return "Pending Review";
  if (order.status === "Rejected") return "Rejected";
  return "Approved";
}

export function BuyerQuotations({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    listMyOrders(token)
      .then(res => setOrders(res.orders))
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load quotations.", "error"))
      .finally(() => setLoading(false));
  }, [token]);

  const quoted = orders.filter(o => o.quotedAmount);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Quotations & Invoices</h2>
        <p className="text-sm text-muted-foreground">Quotations sent by our team for your bulk order requests.</p>
      </div>
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading quotations...</div>
        ) : quoted.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No quotations yet. They'll appear here once our team prices your order request.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#f6f4f0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quoted On</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quoted.map(o => (
                  <tr key={o.id} className="hover:bg-[#faf9f7] transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{o.orderCode}</td>
                    <td className="px-4 py-3 text-foreground">{o.productName} · {o.qty} MT</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.quotedAt ? new Date(o.quotedAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 font-semibold text-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{o.quotedAmount}</td>
                    <td className="px-4 py-3"><Badge label={quotationStatus(o)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => showToast(o.quotedNote || "No additional notes from the seller.", "info")}
                          className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors" title="View notes"><Eye size={14} /></button>
                        <button onClick={() => showToast("Document download isn't available yet.", "info")}
                          className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors" title="Download"><Download size={14} /></button>
                        <button onClick={() => showToast("Print isn't available yet.", "info")}
                          className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors" title="Print"><Printer size={14} /></button>
                      </div>
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
