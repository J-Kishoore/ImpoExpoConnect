import { Bell, ChevronDown } from "lucide-react";
import type { Portal } from "../../types";

export function PortalTopBar({ title, portal, collapsed }: { title: string; portal: Portal; collapsed: boolean }) {
  return (
    <header className={`fixed top-0 right-0 z-10 h-16 bg-white border-b border-border flex items-center justify-between px-6 transition-all ${collapsed ? "left-16" : "left-56"}`}>
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#c47f2e] rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-[#1e5c3a] flex items-center justify-center text-white text-xs font-semibold">
            {portal === "buyer" ? "A" : "M"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground">{portal === "buyer" ? "Al Fajr Trading" : "Manoj Kumar"}</p>
            <p className="text-[10px] text-muted-foreground">{portal === "buyer" ? "Buyer" : "Admin"}</p>
          </div>
          <ChevronDown size={14} className="text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
