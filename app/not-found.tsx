import Link from "next/link";
import { Surface } from "@/components/primitives/surface/Surface";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16">
      <Surface>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Not found
          </p>
          <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
            This route is not part of the current product structure.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
            The architecture is intentionally organized around five permanent
            worlds. Additional chapters should be registered within those worlds
            instead of creating unrelated top-level routes.
          </p>
          <Link
            href="/"
            className="inline-flex text-sm text-[var(--color-text-primary)] underline underline-offset-4"
          >
            Return to the site root
          </Link>
        </div>
      </Surface>
    </main>
  );
}
