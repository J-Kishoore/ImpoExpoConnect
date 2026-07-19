import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Search, CheckCircle, XCircle, Edit2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, deleteBuyer, listBuyers, updateBuyer } from "../../lib/api";
import type { BuyerProfile } from "../../lib/api";

const PAGE_SIZE = 10;

export function AdminBuyers({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [buyers, setBuyers] = useState<BuyerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<BuyerProfile | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // cursors[i] is the "cursor" query param used to fetch page i (cursors[0] is
  // always null for page 1); grows lazily as the admin pages forward.
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    listBuyers(token, { limit: PAGE_SIZE, cursor: cursors[pageIndex] })
      .then(res => {
        if (cancelled) return;
        setBuyers(res.buyers);
        setHasMore(res.hasMore);
        if (res.hasMore && res.nextCursor && cursors.length === pageIndex + 1) {
          setCursors(prev => [...prev, res.nextCursor as string]);
        }
      })
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load buyers.", "error"))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token, pageIndex]);

  const filtered = buyers.filter(b =>
    b.companyName.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase())
  );

  const setStatus = async (buyer: BuyerProfile, status: BuyerProfile["status"]) => {
    if (!token) return;
    setBusyId(buyer.id);
    try {
      const res = await updateBuyer(token, buyer.id, { status });
      setBuyers(prev => prev.map(b => (b.id === buyer.id ? res.buyer : b)));
      showToast(`${buyer.companyName} ${status === "Suspended" ? "suspended" : "approved"}.`, status === "Suspended" ? "error" : "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update buyer.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (buyer: BuyerProfile) => {
    if (!token) return;
    if (!window.confirm(`Delete ${buyer.companyName}? This cannot be undone.`)) return;
    setBusyId(buyer.id);
    try {
      await deleteBuyer(token, buyer.id);
      setBuyers(prev => prev.filter(b => b.id !== buyer.id));
      showToast(`${buyer.companyName} deleted.`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to delete buyer.", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Buyer Management</h2>
          <p className="text-sm text-muted-foreground">Page {pageIndex + 1} · {buyers.length} shown</p>
        </div>
        <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2">
          <Search size={14} className="text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-36 text-sm bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search buyers..." />
        </div>
      </div>
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading buyers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No buyers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#f6f4f0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Country</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-[#faf9f7] transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{b.companyName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.contactName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.country || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.email}</td>
                    <td className="px-4 py-3"><Badge label={b.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(b)} disabled={busyId === b.id}
                          className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        {b.status === "Active" ? (
                          <button onClick={() => setStatus(b, "Suspended")} disabled={busyId === b.id}
                            className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50" title="Suspend">
                            <XCircle size={14} />
                          </button>
                        ) : (
                          <button onClick={() => setStatus(b, "Active")} disabled={busyId === b.id}
                            className="p-1.5 rounded hover:bg-emerald-50 text-muted-foreground hover:text-emerald-600 transition-colors disabled:opacity-50"
                            title={b.status === "Pending" ? "Approve" : "Reactivate"}>
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(b)} disabled={busyId === b.id}
                          className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {(pageIndex > 0 || hasMore) && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">Page {pageIndex + 1}</p>
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm" disabled={pageIndex === 0 || loading} onClick={() => setPageIndex(i => i - 1)}>
              <ChevronLeft size={14} /> Prev
            </Btn>
            <Btn variant="secondary" size="sm" disabled={!hasMore || loading} onClick={() => setPageIndex(i => i + 1)}>
              Next <ChevronRight size={14} />
            </Btn>
          </div>
        </div>
      )}
      {editing && token && (
        <EditBuyerModal
          buyer={editing}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={updated => {
            setBuyers(prev => prev.map(b => (b.id === updated.id ? updated : b)));
            setEditing(null);
            showToast("Buyer updated.", "success");
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function EditBuyerModal({ buyer, token, onClose, onSaved, showToast }: {
  buyer: BuyerProfile;
  token: string;
  onClose: () => void;
  onSaved: (b: BuyerProfile) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const [companyName, setCompanyName] = useState(buyer.companyName);
  const [contactName, setContactName] = useState(buyer.contactName);
  const [email, setEmail] = useState(buyer.email);
  const [phone, setPhone] = useState(buyer.phone || "");
  const [country, setCountry] = useState(buyer.country || "");
  const [status, setStatus] = useState(buyer.status);
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateBuyer(token, buyer.id, { companyName, contactName, email, phone, country, status });
      onSaved(res.buyer);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update buyer.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <Card className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Edit Buyer</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Company Name</label>
            <input required value={companyName} onChange={e => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Contact Name</label>
            <input required value={contactName} onChange={e => setContactName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as BuyerProfile["status"])}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30">
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Btn type="submit" variant="primary" disabled={saving} className="flex-1 justify-center">
              {saving ? "Saving..." : "Save Changes"}
            </Btn>
            <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      </Card>
    </div>
  );
}