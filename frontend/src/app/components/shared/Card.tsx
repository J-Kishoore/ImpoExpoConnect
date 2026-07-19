import type { HTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "", ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}
