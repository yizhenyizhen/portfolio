import type { ReactNode } from "react";

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="type-label uppercase text-[var(--color-text-muted)]">
      {children}
    </p>
  );
}
