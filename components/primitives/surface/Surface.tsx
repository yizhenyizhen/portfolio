import type { ReactNode } from "react";

export function Surface({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-[clamp(1rem,2vw,1.5rem)]">
      {children}
    </div>
  );
}
