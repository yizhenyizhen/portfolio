import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="type-section-title w-fit max-w-full whitespace-nowrap font-semibold text-[var(--color-text-primary)]">
      {children}
    </h1>
  );
}
