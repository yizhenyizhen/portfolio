import { Surface } from "@/components/primitives/surface/Surface";
import type { ContentModule } from "@/types/content";

export function ContentModuleRenderer({ module }: { module: ContentModule }) {
  switch (module.kind) {
    case "summary":
      return (
        <Surface>
          <div className="space-y-3">
            <p className="content-module__eyebrow">
              {module.eyebrow}
            </p>
            <h2 className="content-module__title">
              {module.title}
            </h2>
            <p className="content-module__body">
              {module.body}
            </p>
          </div>
        </Surface>
      );
    case "chapter-list":
      return (
        <Surface>
          <div className="space-y-4">
            <p className="content-module__eyebrow">
              {module.eyebrow}
            </p>
            <h2 className="content-module__title">
              {module.title}
            </h2>
            <ul className="content-module__body space-y-3">
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
            <p className="content-module__eyebrow">
              {module.eyebrow}
            </p>
            <h2 className="content-module__title">
              {module.title}
            </h2>
            <p className="content-module__body">
              {module.body}
            </p>
          </div>
        </Surface>
      );
    default:
      return null;
  }
}
