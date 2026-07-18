import { Download, Eye, Leaf, Printer } from "lucide-react";
import type { View } from "../../types";
import { Badge, Btn, Card } from "../../components/shared";

export function BuyerQuotations({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const docs = [
    { id: "QT-2024-041", order: "ORD-2024-0041", product: "Basmati Rice 10 MT", date: "10 Jun 2024", amount: "₹5,80,000", status: "Pending Review" },
    { id: "INV-2024-035", order: "ORD-2024-0035", product: "Wheat Flour 8 MT", date: "02 Jun 2024", amount: "₹2,60,000", status: "Approved" },
    { id: "QT-2024-038", order: "ORD-2024-0038", product: "Red Onions 5 MT", date: "08 Jun 2024", amount: "₹1,10,000", status: "Pending Review" },
    { id: "INV-2024-031", order: "ORD-2024-0031", product: "Green Gram 2 MT", date: "28 May 2024", amount: "₹1,56,000", status: "Approved" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Quotations & Invoices</h2>
        <p className="text-sm text-muted-foreground">View, download, or print your trade documents.</p>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#f6f4f0]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Document ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {docs.map(d => (
                <tr key={d.id} className="hover:bg-[#faf9f7] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{d.id}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{d.order}</td>
                  <td className="px-4 py-3 text-foreground">{d.product}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-3 font-semibold text-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{d.amount}</td>
                  <td className="px-4 py-3"><Badge label={d.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => showToast("Opening document viewer...", "info")}
                        className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors"><Eye size={14} /></button>
                      <button onClick={() => showToast("Document downloaded.", "success")}
                        className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors"><Download size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors"><Printer size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Invoice Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">Invoice Preview — INV-2024-035</h3>
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm"><Download size={13} /> Download PDF</Btn>
            <Btn variant="ghost" size="sm"><Printer size={13} /> Print</Btn>
          </div>
        </div>
        <div className="border border-border rounded-lg p-6 bg-white">
          <div className="flex justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1"><Leaf size={14} className="text-[#1e5c3a]" /><span className="font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Makgrow Impex Pvt Ltd</span></div>
              <p className="text-xs text-muted-foreground">APMC Vashi, Navi Mumbai 400703</p>
              <p className="text-xs text-muted-foreground">GSTIN: 27AAXCM1234A1Z5</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>INVOICE</p>
              <p className="text-xs font-mono text-muted-foreground">INV-2024-035</p>
              <p className="text-xs text-muted-foreground">Date: 02 Jun 2024</p>
              <Badge label="Approved" />
            </div>
          </div>
          <div className="border-t border-border pt-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Bill To</p>
            <p className="text-sm font-medium text-foreground">Al Fajr Trading LLC</p>
            <p className="text-xs text-muted-foreground">Port Rashid, Dubai, UAE</p>
          </div>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Item</th>
                <th className="text-right py-2 text-xs font-semibold text-muted-foreground">Qty</th>
                <th className="text-right py-2 text-xs font-semibold text-muted-foreground">Rate</th>
                <th className="text-right py-2 text-xs font-semibold text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 text-foreground">Wheat Flour (Atta) Grade A</td>
                <td className="py-2 text-right text-muted-foreground">8 MT</td>
                <td className="py-2 text-right text-muted-foreground">₹32,500</td>
                <td className="py-2 text-right font-medium text-foreground">₹2,60,000</td>
              </tr>
            </tbody>
          </table>
          <div className="text-right space-y-1">
            <p className="text-xs text-muted-foreground">Subtotal: ₹2,60,000</p>
            <p className="text-xs text-muted-foreground">IGST 0% (Export): ₹0</p>
            <p className="text-sm font-semibold text-foreground border-t border-border pt-1 mt-1">Total: ₹2,60,000</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
