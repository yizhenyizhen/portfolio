import type { WorldChapter } from "@/types/world";

const STATUS_LABELS: Record<WorldChapter["status"], string> = {
  "coming-soon": "Coming soon",
  "coming-later": "Coming later",
};

type WorldSectionProps = {
  chapter: WorldChapter;
  index: number;
};

export function WorldSection({ chapter, index }: WorldSectionProps) {
  return (
    <section
      id={chapter.slug}
      aria-labelledby={`${chapter.slug}-title`}
      className="min-h-[52svh] scroll-mt-28 border-t border-[var(--color-border-subtle)] py-14 sm:py-18 lg:min-h-[58svh] lg:py-20"
    >
      <div className="flex items-center justify-between gap-6 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{STATUS_LABELS[chapter.status]}</span>
      </div>

      <div className="mt-8 max-w-3xl sm:mt-10">
        <h2
          id={`${chapter.slug}-title`}
          className="text-3xl font-medium tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-5xl"
        >
          {chapter.name}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base sm:leading-8">
          {chapter.summary}
        </p>
      </div>

      <div className="mt-12 max-w-3xl sm:mt-16">
        <p className="pb-3 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Content framework
        </p>
        <ol className="border-b border-[var(--color-border-subtle)]">
          {chapter.contentTypes.map((contentType, contentIndex) => (
            <li
              key={contentType}
              className="flex items-center justify-between gap-8 border-t border-[var(--color-border-subtle)] py-4 text-sm text-[var(--color-text-secondary)]"
            >
              <span>{contentType}</span>
              <span className="font-mono text-[0.65rem] tracking-[0.16em] text-[var(--color-text-muted)]">
                {String(contentIndex + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
