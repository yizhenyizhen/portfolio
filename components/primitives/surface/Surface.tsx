import type { ReactNode } from "react";

export function Surface({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
      {children}
    </div>
  );
}
