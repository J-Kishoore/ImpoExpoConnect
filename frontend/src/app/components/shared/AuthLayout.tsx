import type { ReactNode } from "react";
import { Leaf } from "lucide-react";
import { Card } from "./Card";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4f0] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#1e5c3a] flex items-center justify-center mb-3">
            <Leaf size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">{subtitle}</p>
        </div>
        <Card className="p-6">{children}</Card>
      </div>
    </div>
  );
}
