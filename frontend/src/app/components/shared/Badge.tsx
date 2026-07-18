import { statusColors } from "../../data";

export function Badge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColors[label] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {label}
    </span>
  );
}
