import type { WorldDefinition } from "@/types/world";

export function WorldPlaceholder({ world }: { world: WorldDefinition }) {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-4xl font-medium uppercase tracking-[0.16em] text-[var(--color-text-primary)] sm:text-5xl">
          {world.label}
        </h1>
        <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
          Under Construction
        </p>
      </div>
    </main>
  );
}
