import type { WorldDefinition } from "@/types/world";

export function WorldPlaceholder({ world }: { world: WorldDefinition }) {
  return (
    <main className="grid min-h-screen place-items-center px-[var(--space-page-inline)] text-center">
      <div className="max-w-[var(--measure-wide-title)]">
        <h1 className="type-world-title max-w-full whitespace-nowrap font-medium uppercase text-[var(--color-text-primary)]">
          {world.label}
        </h1>
        <p className="type-label mt-[var(--space-title-body)] uppercase text-[var(--color-text-muted)]">
          Under Construction
        </p>
      </div>
    </main>
  );
}
