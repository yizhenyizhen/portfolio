import { ContentModuleRenderer } from "@/components/systems/content/ContentModuleRenderer";
import { SectionEyebrow, SectionTitle } from "@/components/primitives/typography";
import { Surface } from "@/components/primitives/surface/Surface";
import type { WorldDefinition } from "@/types/world";

export function WorldShell({ world }: { world: WorldDefinition }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl px-6 py-16">
      <div className="flex w-full flex-col gap-10">
        <header className="space-y-5">
          <SectionEyebrow>{world.label}</SectionEyebrow>
          <SectionTitle>{world.name}</SectionTitle>
          <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)]">
            {world.description}
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {world.chapters.map((chapter) => (
            <Surface key={chapter.slug}>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Planned chapter
                </p>
                <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
                  {chapter.name}
                </h2>
                <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                  {chapter.summary}
                </p>
              </div>
            </Surface>
          ))}
        </section>

        <section className="space-y-4">
          {world.modules.map((module) => (
            <ContentModuleRenderer key={module.id} module={module} />
          ))}
        </section>
      </div>
    </main>
  );
}
