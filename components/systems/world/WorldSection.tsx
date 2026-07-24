import type { ReactNode } from "react";
import type { WorldChapter } from "@/types/world";

const STATUS_LABELS: Record<WorldChapter["status"], string> = {
  "coming-soon": "Coming soon",
  "coming-later": "Coming later",
};

type WorldSectionProps = {
  chapter: WorldChapter;
  index: number;
  children?: ReactNode;
};

export function WorldSection({
  chapter,
  index,
  children,
}: WorldSectionProps) {
  return (
    <section
      id={chapter.slug}
      aria-labelledby={`${chapter.slug}-title`}
      className="world-section"
    >
      <div className="world-section__meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{STATUS_LABELS[chapter.status]}</span>
      </div>

      <div className="world-section__intro">
        <h2 id={`${chapter.slug}-title`} className="world-section__title">
          {chapter.name}
        </h2>
        <p className="world-section__summary">
          {chapter.summary}
        </p>
      </div>

      <div className="world-section__framework">
        <p className="world-section__framework-label">
          Content framework
        </p>
        <ol className="world-section__content-list">
          {chapter.contentTypes.map((contentType, contentIndex) => (
            <li
              key={contentType}
              className="world-section__content-item"
            >
              <span>{contentType}</span>
              <span className="world-section__content-index">
                {String(contentIndex + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {children}
    </section>
  );
}
