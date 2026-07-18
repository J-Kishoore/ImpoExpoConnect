import { Bell, X, CheckCircle, XCircle } from "lucide-react";

export function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  const styles = {
    success: "bg-emerald-800 text-white",
    error: "bg-red-700 text-white",
    info: "bg-[#1a2e1f] text-white",
  };
  const icons = { success: CheckCircle, error: XCircle, info: Bell };
  const Icon = icons[type];
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium ${styles[type]}`} style={{ maxWidth: 340 }}>
      <Icon size={16} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}
