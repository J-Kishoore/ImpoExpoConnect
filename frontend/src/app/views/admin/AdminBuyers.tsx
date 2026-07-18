import { Eye, Search, Plus, CheckCircle, XCircle, Edit2 } from "lucide-react";
import { buyers } from "../../data";
import { Badge, Btn, Card } from "../../components/shared";

export function AdminBuyers({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Buyer Management</h2>
          <p className="text-sm text-muted-foreground">{buyers.length} registered buyers</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2">
            <Search size={14} className="text-muted-foreground" />
            <input className="w-36 text-sm bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search buyers..." />
          </div>
          <Btn variant="primary" size="sm"><Plus size={14} /> Add Buyer</Btn>
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#f6f4f0]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Buyer ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Orders</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {buyers.map(b => (
                <tr key={b.id} className="hover:bg-[#faf9f7] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-muted-foreground">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.country}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{b.orders}</td>
                  <td className="px-4 py-3"><Badge label={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => showToast(`Viewing buyer ${b.name}...`, "info")}
                        className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors" title="View"><Eye size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Edit2 size={14} /></button>
                      {b.status === "Active" ? (
                        <button onClick={() => showToast(`Buyer ${b.name} suspended.`, "error")}
                          className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Suspend"><XCircle size={14} /></button>
                      ) : b.status === "Pending" ? (
                        <button onClick={() => showToast(`Buyer ${b.name} approved.`, "success")}
                          className="p-1.5 rounded hover:bg-emerald-50 text-muted-foreground hover:text-emerald-600 transition-colors" title="Approve"><CheckCircle size={14} /></button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
