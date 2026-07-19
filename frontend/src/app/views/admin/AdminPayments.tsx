import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { FileText, X, Check, Eye } from "lucide-react";
import { Badge, Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, fetchPaymentFileBlob, listAllPayments, reviewPayment } from "../../lib/api";
import type { Payment } from "../../lib/api";
import { viewBlob } from "../../lib/viewFile";

export function AdminPayments({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [declining, setDeclining] = useState<Payment | null>(null);

  const load = () => {
    if (!token) return;
    setLoading(true);
    listAllPayments(token)
      .then(res => setPayments(res.payments))
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load payments.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const approve = async (payment: Payment) => {
    if (!token) return;
    setBusyId(payment.id);
    try {
      const res = await reviewPayment(token, payment.id, { status: "Approved" });
      setPayments(prev => prev.map(p => (p.id === res.payment.id ? res.payment : p)));
      showToast(`Payment for ${payment.orderCode} approved.`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to approve payment.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const viewFile = async (payment: Payment) => {
    if (!token) return;
    setBusyId(payment.id);
    try {
      const { blob } = await fetchPaymentFileBlob(token, payment.id);
      viewBlob(blob);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to load file.", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Payment Verification</h2>
        <p className="text-sm text-muted-foreground">Review uploaded payment proofs and approve or decline.</p>
      </div>
      {loading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">Loading payments...</Card>
      ) : payments.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No payment proofs submitted yet.</Card>
      ) : (
        <div className="grid gap-4">
          {payments.map(p => (
            <Card key={p.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f0ece5] flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-[#c47f2e]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-foreground text-sm">{p.orderCode}</p>
                      <Badge label={p.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">{p.buyerCompanyName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm font-semibold text-foreground mt-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.amount || "—"}</p>
                    {p.status === "Declined" && p.declineReason && (
                      <p className="text-xs text-red-700 mt-1">Declined: {p.declineReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => viewFile(p)} disabled={busyId === p.id}
                    className="bg-[#f6f4f0] rounded-lg px-3 py-2 flex items-center gap-2 text-[#1e5c3a] hover:bg-[#f0ece5] transition-colors disabled:opacity-50">
                    <FileText size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{p.fileName}</span>
                    <Eye size={13} />
                  </button>
                  {p.status === "Pending" && (
                    <div className="flex gap-2">
                      <Btn variant="primary" size="sm" disabled={busyId === p.id} onClick={() => approve(p)}><Check size={13} /> Approve</Btn>
                      <Btn variant="danger" size="sm" disabled={busyId === p.id} onClick={() => setDeclining(p)}><X size={13} /> Decline</Btn>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {declining && token && (
        <DeclineModal
          payment={declining}
          token={token}
          onClose={() => setDeclining(null)}
          onDeclined={updated => {
            setPayments(prev => prev.map(p => (p.id === updated.id ? updated : p)));
            setDeclining(null);
            showToast(`Payment for ${updated.orderCode} declined.`, "error");
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function DeclineModal({ payment, token, onClose, onDeclined, showToast }: {
  payment: Payment;
  token: string;
  onClose: () => void;
  onDeclined: (p: Payment) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await reviewPayment(token, payment.id, { status: "Declined", declineReason: reason });
      onDeclined(res.payment);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to decline payment.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <Card className="w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Decline Payment</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{payment.orderCode} · {payment.buyerCompanyName}</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Reason *</label>
            <textarea required autoFocus rows={3} value={reason} onChange={e => setReason(e.target.value)}
              placeholder="e.g. Amount doesn't match the invoice, illegible receipt..."
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <Btn type="submit" variant="danger" disabled={saving} className="flex-1 justify-center">
              {saving ? "Declining..." : "Decline Payment"}
            </Btn>
            <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      </Card>
    </div>
  );
}
