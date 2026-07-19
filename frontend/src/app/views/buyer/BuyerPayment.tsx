import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { FileText, AlertCircle, Upload } from "lucide-react";
import { Badge, Btn, Card } from "../../components/shared";

export function BuyerPayment({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f.name); showToast(`File "${f.name}" uploaded. Pending verification.`, "success"); }
  };
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f.name); showToast(`File "${f.name}" uploaded. Pending verification.`, "success"); }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Payment Upload</h2>
        <p className="text-sm text-muted-foreground">Upload bank transfer proof or payment receipt for verification.</p>
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Pending Payment</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-4">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900">Payment due for ORD-2024-0041</p>
            <p className="text-xs text-amber-700 mt-0.5">Invoice INV-2024-041 · $580,000 · Due by 20 Jun 2024</p>
          </div>
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
              { l: "Amount", v: "$580,000" },
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
              {file ? file : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={handleFile} />
          </div>
          {file && (
            <div className="mt-3 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-emerald-700" />
                <span className="text-xs font-medium text-emerald-800">{file}</span>
              </div>
              <Badge label="Pending" />
            </div>
          )}
          {file && <Btn variant="primary" className="mt-4" onClick={() => showToast("Payment proof submitted for verification.", "success")}>Submit for Verification</Btn>}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Payment History</h3>
        <div className="space-y-2">
          {[
            { id: "PAY-035", order: "ORD-2024-0035", amount: "$260,000", date: "04 Jun 2024", status: "Approved" },
            { id: "PAY-031", order: "ORD-2024-0031", amount: "$156,000", date: "30 May 2024", status: "Approved" },
          ].map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f6f4f0]">
              <div>
                <p className="text-sm font-medium text-foreground">{p.id}</p>
                <p className="text-xs text-muted-foreground">{p.order} · {p.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.amount}</span>
                <Badge label={p.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
