import Link from "next/link";
import { StarBorderLink } from "@/components/systems/identity/StarBorderLink";
import { WorldSection } from "@/components/systems/world/WorldSection";
import { WorldSidebar } from "@/components/systems/world/WorldSidebar";
import {
  identityEntries,
  type IdentityEntry,
} from "@/data/site/identity";

type IdentityPageShellProps = {
  identity: IdentityEntry;
};

export function IdentityPageShell({ identity }: IdentityPageShellProps) {
  const chapters = [...identity.chapters].sort((a, b) => a.order - b.order);
  const identityIndex = identityEntries.findIndex(
    (entry) => entry.slug === identity.slug,
  );

  return (
    <main
      className={`min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] ${
        identity.externalAction ? "pb-32 sm:pb-36" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <header className="pb-20 pt-7 sm:pb-28 sm:pt-9 lg:pb-36">
          <div className="flex items-center justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-5">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 text-xs tracking-[0.08em] text-[var(--color-text-secondary)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span aria-hidden="true">&larr;</span>
              Back to home
            </Link>
            <p className="font-mono text-[0.62rem] tracking-[0.18em] text-[var(--color-text-muted)]">
              {String(identityIndex + 1).padStart(2, "0")} /{" "}
              {String(identityEntries.length).padStart(2, "0")}
            </p>
          </div>

          <div className="mt-20 max-w-6xl sm:mt-28 lg:mt-36">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              {identity.eyebrow}
            </p>
            <h1 className="mt-6 max-w-6xl text-[clamp(3.25rem,9.5vw,8.5rem)] font-medium leading-[0.88] tracking-[-0.06em]">
              {identity.title}
            </h1>
            <p className="mt-8 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base sm:leading-8">
              {identity.summary}
            </p>
          </div>
        </header>

        <div className="grid items-start gap-x-16 md:grid-cols-[12rem_minmax(0,1fr)] lg:gap-x-24 xl:grid-cols-[14rem_minmax(0,1fr)]">
          <WorldSidebar
            key={identity.slug}
            chapters={chapters}
            worldLabel={identity.title}
          />

          <div className="min-w-0">
            {chapters.map((chapter, index) => (
              <WorldSection
                key={chapter.slug}
                chapter={chapter}
                index={index}
              />
            ))}
          </div>
        </div>

        <footer className="border-t border-[var(--color-border-subtle)] py-14 sm:py-18 md:ml-[calc(12rem+4rem)] lg:ml-[calc(12rem+6rem)] lg:py-20 xl:ml-[calc(14rem+6rem)]">
          <nav aria-label="Identity navigation">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Identity
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-10">
              {identityEntries.map((entry) => (
                <li key={entry.slug}>
                  {entry.slug === identity.slug ? (
                    <span
                      aria-current="page"
                      className="text-sm text-[var(--color-text-primary)]"
                    >
                      {entry.title}
                    </span>
                  ) : (
                    <Link
                      href={entry.href}
                      className="text-sm text-[var(--color-text-muted)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {entry.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </div>

      {identity.externalAction ? (
        <StarBorderLink
          href={identity.externalAction.href}
          label={identity.externalAction.label}
        />
      ) : null}
    </main>
  );
}
