import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)] md:text-6xl">
      {children}
    </h1>
  );
}
