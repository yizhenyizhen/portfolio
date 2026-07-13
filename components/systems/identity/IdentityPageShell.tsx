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

const LONG_TITLE_CHARACTER_THRESHOLD = 14;

export function IdentityPageShell({ identity }: IdentityPageShellProps) {
  const chapters = [...identity.chapters].sort((a, b) => a.order - b.order);
  const identityIndex = identityEntries.findIndex(
    (entry) => entry.slug === identity.slug,
  );
  const titleClassName =
    identity.title.length > LONG_TITLE_CHARACTER_THRESHOLD
      ? "site-page__identity-title site-page__identity-title--long"
      : "site-page__identity-title";

  return (
    <main
      className={`site-page ${
        identity.externalAction ? "site-page--fixed-action" : ""
      }`}
    >
      <div className="site-page__frame">
        <header className="site-page__header">
          <div className="site-page__topbar">
            <Link
              href="/"
              className="site-page__back-link"
            >
              <span aria-hidden="true">&larr;</span>
              Back to home
            </Link>
            <p className="site-page__index">
              {String(identityIndex + 1).padStart(2, "0")} /{" "}
              {String(identityEntries.length).padStart(2, "0")}
            </p>
          </div>

          <div className="site-page__hero">
            <p className="site-page__eyebrow">
              {identity.eyebrow}
            </p>
            <h1 className={titleClassName}>
              {identity.title}
            </h1>
            <p className="site-page__lede">
              {identity.summary}
            </p>
          </div>
        </header>

        <div className="site-page__content-grid">
          <WorldSidebar
            key={identity.slug}
            chapters={chapters}
            worldLabel={identity.title}
          />

          <div className="site-page__content">
            {chapters.map((chapter, index) => (
              <WorldSection
                key={chapter.slug}
                chapter={chapter}
                index={index}
              />
            ))}
          </div>
        </div>

        <footer className="site-page__footer">
          <nav aria-label="Identity navigation">
            <p className="site-page__footer-label">Identity</p>
            <ul className="site-page__footer-list">
              {identityEntries.map((entry) => (
                <li key={entry.slug}>
                  {entry.slug === identity.slug ? (
                    <span
                      aria-current="page"
                      className="site-page__footer-link"
                    >
                      {entry.title}
                    </span>
                  ) : (
                    <Link
                      href={entry.href}
                      className="site-page__footer-link"
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
