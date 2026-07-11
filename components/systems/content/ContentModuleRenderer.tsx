import { Surface } from "@/components/primitives/surface/Surface";
import type { ContentModule } from "@/types/content";

export function ContentModuleRenderer({ module }: { module: ContentModule }) {
  switch (module.kind) {
    case "summary":
      return (
        <Surface>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              {module.eyebrow}
            </p>
            <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
              {module.title}
            </h2>
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              {module.body}
            </p>
          </div>
        </Surface>
      );
    case "chapter-list":
      return (
        <Surface>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              {module.eyebrow}
            </p>
            <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
              {module.title}
            </h2>
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              {module.items.map((item) => (
                <li key={item.slug}>
                  <span className="text-[var(--color-text-primary)]">{item.name}</span>
                  {" — "}
                  {item.summary}
                </li>
              ))}
            </ul>
          </div>
        </Surface>
      );
    case "status":
      return (
        <Surface>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              {module.eyebrow}
            </p>
            <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
              {module.title}
            </h2>
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              {module.body}
            </p>
          </div>
        </Surface>
      );
    default:
      return null;
  }
}
