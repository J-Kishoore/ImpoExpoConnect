import { useEffect, useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { FileText, AlertCircle, Upload, Eye } from "lucide-react";
import { Badge, Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, createPayment, fetchPaymentFileBlob, listMyOrders, listMyPayments } from "../../lib/api";
import type { Order, Payment } from "../../lib/api";
import { viewBlob } from "../../lib/viewFile";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 10 * 1024 * 1024;

export function BuyerPayment({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([listMyOrders(token), listMyPayments(token)])
      .then(([o, p]) => {
        const payable = o.orders.filter(order => order.quotedAmount);
        setOrders(payable);
        setOrderId(prev => prev || payable[0]?.id || "");
        setPayments(p.payments);
      })
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load payment data.", "error"))
      .finally(() => setLoading(false));
  }, [token]);

  const acceptFile = (f: File | undefined) => {
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      showToast("Only PDF, JPG, and PNG files are allowed.", "error");
      return;
    }
    if (f.size > MAX_SIZE) {
      showToast("File is too large (max 10MB).", "error");
      return;
    }
    setSelectedFile(f);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    acceptFile(e.dataTransfer.files[0]);
  };
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => acceptFile(e.target.files?.[0]);

  const submit = async () => {
    if (!token || !orderId || !selectedFile) return;
    setSubmitting(true);
    try {
      const res = await createPayment(token, orderId, selectedFile);
      setPayments(prev => [res.payment, ...prev]);
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
      showToast("Payment proof submitted for verification.", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to submit payment proof.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const viewFile = async (payment: Payment) => {
    if (!token) return;
    setViewingId(payment.id);
    try {
      const { blob } = await fetchPaymentFileBlob(token, payment.id);
      viewBlob(blob);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to load file.", "error");
    } finally {
      setViewingId(null);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Payment Upload</h2>
        <p className="text-sm text-muted-foreground">Upload bank transfer proof or payment receipt for verification.</p>
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Submit Payment Proof</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-900">No quoted orders awaiting payment yet.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-xs font-medium text-foreground mb-1.5">Order</label>
              <select value={orderId} onChange={e => setOrderId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30">
                {orders.map(o => (
                  <option key={o.id} value={o.id}>{o.orderCode} · {o.productName} · {o.quotedAmount}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-1.5">Bank Transfer Details</p>
              <div className="grid sm:grid-cols-2 gap-2 mb-5">
                {[
                  { l: "Beneficiary", v: "Makgrow Impex Pvt Ltd" },
                  { l: "Bank", v: "HDFC Bank Ltd" },
                  { l: "Account No.", v: "50100441200123" },
                  { l: "IFSC", v: "HDFC0000234" },
                  { l: "SWIFT", v: "HDFCINBB" },
                  { l: "Amount", v: orders.find(o => o.id === orderId)?.quotedAmount || "—" },
                ].map(d => (
                  <div key={d.l} className="bg-[#f6f4f0] rounded p-2.5">
                    <p className="text-[10px] text-muted-foreground">{d.l}</p>
                    <p className="text-xs font-mono font-medium text-foreground mt-0.5">{d.v}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-foreground mb-2">Upload Payment Proof</p>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver ? "border-[#1e5c3a] bg-emerald-50/50" : "border-[#e5e1d8] hover:border-[#1e5c3a]/40 hover:bg-[#f6f4f0]"}`}>
                <Upload size={24} className={`mx-auto mb-2 ${dragOver ? "text-[#1e5c3a]" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium text-foreground mb-0.5">
                  {selectedFile ? selectedFile.name : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
              </div>
              {selectedFile && (
                <div className="mt-3 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-emerald-700" />
                    <span className="text-xs font-medium text-emerald-800">{selectedFile.name}</span>
                  </div>
                  <Badge label="Ready" />
                </div>
              )}
              <Btn variant="primary" className="mt-4" disabled={!selectedFile || submitting} onClick={submit}>
                {submitting ? "Submitting..." : "Submit for Verification"}
              </Btn>
            </div>
          </>
        )}
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Payment History</h3>
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payment proofs submitted yet.</p>
        ) : (
          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className="p-3 rounded-lg bg-[#f6f4f0]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.orderCode}</p>
                    <p className="text-xs text-muted-foreground">{p.fileName} · {new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.amount || "—"}</span>
                    <Badge label={p.status} />
                    <button onClick={() => viewFile(p)} disabled={viewingId === p.id}
                      className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" title="View file">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
                {p.status === "Declined" && p.declineReason && (
                  <p className="text-xs text-red-700 mt-2">Declined: {p.declineReason}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
