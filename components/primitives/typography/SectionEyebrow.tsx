import type { ReactNode } from "react";

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
      {children}
    </p>
  );
}
