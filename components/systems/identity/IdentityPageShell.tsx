import Link from "next/link";
import { LanguageSwitcher } from "@/components/systems/i18n";
import { StarBorderLink } from "@/components/systems/identity/StarBorderLink";
import { WorldSection } from "@/components/systems/world/WorldSection";
import { WorldSidebar } from "@/components/systems/world/WorldSidebar";
import type { IdentityEntry } from "@/data/site/identity";
import { getLocalizedIdentityEntries } from "@/data/site/identity-translations";
import type { Locale } from "@/lib/i18n/config";
import { formatMessage, getMessages } from "@/lib/i18n/messages";
import { localizePath } from "@/lib/i18n/routing";

type IdentityPageShellProps = {
  identity: IdentityEntry;
  locale: Locale;
};

const LONG_TITLE_CHARACTER_THRESHOLD = 14;

export function IdentityPageShell({ identity, locale }: IdentityPageShellProps) {
  const messages = getMessages(locale);
  const identityEntries = getLocalizedIdentityEntries(locale);
  // Keep the Horizon CTA data intact so the entry can be restored without changing the route.
  const showExternalAction = identity.slug !== "horizon";
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
        showExternalAction && identity.externalAction
          ? "site-page--fixed-action"
          : ""
      }`}
    >
      <div className="site-page__frame">
        <header className="site-page__header">
          <div className="site-page__topbar">
            <Link
              href={localizePath("/", locale)}
              className="site-page__back-link"
            >
              <span aria-hidden="true">&larr;</span>
              {messages.navigation.backToHome}
            </Link>
            <div className="flex items-center gap-3">
              <p className="site-page__index">
                {String(identityIndex + 1).padStart(2, "0")} /{" "}
                {String(identityEntries.length).padStart(2, "0")}
              </p>
              <LanguageSwitcher />
            </div>
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
            ariaLabel={formatMessage(messages.navigation.chapters, {
              world: identity.title,
            })}
          />

          <div className="site-page__content">
            {chapters.map((chapter, index) => (
              <WorldSection
                key={chapter.slug}
                chapter={chapter}
                index={index}
                labels={messages.world}
              />
            ))}
          </div>
        </div>

        <footer className="site-page__footer">
          <nav aria-label={messages.navigation.identity}>
            <p className="site-page__footer-label">
              {messages.identity.footerLabel}
            </p>
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

      {showExternalAction && identity.externalAction ? (
        <StarBorderLink
          href={identity.externalAction.href}
          label={identity.externalAction.label}
        />
      ) : null}
    </main>
  );
}
