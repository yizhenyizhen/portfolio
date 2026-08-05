import type { ReactNode } from "react";
import type { WorldChapter } from "@/types/world";

type WorldSectionProps = {
  chapter: WorldChapter;
  index: number;
  children?: ReactNode;
  labels: {
    comingSoon: string;
    comingLater: string;
    contentFramework: string;
  };
};

export function WorldSection({
  chapter,
  index,
  children,
  labels,
}: WorldSectionProps) {
  const statusLabel =
    chapter.status === "coming-soon"
      ? labels.comingSoon
      : labels.comingLater;
  return (
    <section
      id={chapter.slug}
      aria-labelledby={`${chapter.slug}-title`}
      className="world-section"
    >
      <div className="world-section__meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{statusLabel}</span>
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
          {labels.contentFramework}
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
