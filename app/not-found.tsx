import Link from "next/link";
import { Surface } from "@/components/primitives/surface/Surface";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-[var(--space-page-inline)] py-[var(--space-section)]">
      <Surface>
        <div className="space-y-[clamp(0.75rem,2vw,1rem)]">
          <p className="type-label uppercase text-[var(--color-text-muted)]">
            Not found
          </p>
          <h1 className="type-subsection-title max-w-[var(--measure-wide-title)] font-semibold text-[var(--color-text-primary)] [overflow-wrap:break-word] [text-wrap:balance]">
            This route is not part of the current product structure.
          </h1>
          <p className="type-body-small max-w-[var(--measure-body)] text-[var(--color-text-secondary)]">
            The architecture is intentionally organized around five permanent
            worlds. Additional chapters should be registered within those worlds
            instead of creating unrelated top-level routes.
          </p>
          <Link
            href="/"
            className="type-navigation inline-flex min-h-[var(--touch-target)] items-center text-[var(--color-text-primary)] underline underline-offset-4"
          >
            Return to the site root
          </Link>
        </div>
      </Surface>
    </main>
  );
}
