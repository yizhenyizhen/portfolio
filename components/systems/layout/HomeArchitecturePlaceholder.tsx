import Link from "next/link";
import { SectionEyebrow, SectionTitle } from "@/components/primitives/typography";
import { Surface } from "@/components/primitives/surface/Surface";
import { getPrimaryNavigationItems } from "@/lib/navigation/get-navigation";

export function HomeArchitecturePlaceholder() {
  const navigation = getPrimaryNavigationItems();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl px-6 py-16">
      <div className="flex w-full flex-col justify-between gap-12">
        <div className="space-y-5">
          <SectionEyebrow>Architecture foundation</SectionEyebrow>
          <SectionTitle>Yizhen Zhou</SectionTitle>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
            The homepage experience, Ring Navigation, and motion language are
            intentionally deferred. This route currently exists to prove the
            long-term app shell, data architecture, and world registration
            model.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {navigation.map((item) => (
            <Surface key={item.slug}>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                    {item.label}
                  </p>
                  <h2 className="mt-3 text-xl font-medium text-[var(--color-text-primary)]">
                    {item.name}
                  </h2>
                </div>
                <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                  {item.summary}
                </p>
                <Link
                  href={`/${item.slug}`}
                  className="inline-flex text-sm text-[var(--color-text-primary)] underline underline-offset-4"
                >
                  Open world architecture
                </Link>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </main>
  );
}
