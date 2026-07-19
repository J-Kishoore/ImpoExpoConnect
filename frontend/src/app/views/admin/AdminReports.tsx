import { Download, FileDown, RefreshCw } from "lucide-react";
import { Badge, Btn, Card } from "../../components/shared";

export function AdminReports({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Reports</h2>
        <p className="text-sm text-muted-foreground">Generate and export business reports.</p>
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Generate Report</h3>
        <div className="grid sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Report Type</label>
            <select className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30">
              <option>Order Summary</option>
              <option>Revenue Report</option>
              <option>Buyer Activity</option>
              <option>Product Sales</option>
              <option>Payment Reconciliation</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">From Date</label>
            <input type="date" defaultValue="2024-06-01" className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">To Date</label>
            <input type="date" defaultValue="2024-06-21" className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div className="flex items-end gap-2">
            <Btn variant="primary" onClick={() => showToast("Generating report...", "info")}><RefreshCw size={14} /> Generate</Btn>
          </div>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="sm" onClick={() => showToast("PDF exported.", "success")}><FileDown size={13} /> Export PDF</Btn>
          <Btn variant="secondary" size="sm" onClick={() => showToast("CSV exported.", "success")}><Download size={13} /> Export CSV</Btn>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-[#f6f4f0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Order Summary — June 2024</h3>
          <Badge label="Generated" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Buyer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Volume</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "ORD-2024-0041", buyer: "Al Fajr Trading", product: "Basmati Rice", vol: "10 MT", value: "$580,000", status: "In Progress" },
                { id: "ORD-2024-0038", buyer: "Nile Foods Co.", product: "Red Onions", vol: "5 MT", value: "$110,000", status: "Quoted" },
                { id: "ORD-2024-0035", buyer: "Al Fajr Trading", product: "Wheat Flour", vol: "8 MT", value: "$260,000", status: "Completed" },
                { id: "ORD-2024-0031", buyer: "Gulf Commodity Hub", product: "Green Gram", vol: "2 MT", value: "$156,000", status: "Approved" },
              ].map(r => (
                <tr key={r.id} className="hover:bg-[#faf9f7] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{r.id}</td>
                  <td className="px-4 py-3 text-foreground">{r.buyer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.product}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{r.vol}</td>
                  <td className="px-4 py-3 font-semibold text-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{r.value}</td>
                  <td className="px-4 py-3"><Badge label={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
