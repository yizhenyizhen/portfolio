import Link from "next/link";
import { getLocalizedIdentityHeaderEntries } from "@/data/site/identity-translations";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/request";
import styles from "./IdentityHeader.module.css";

export async function IdentityHeader() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const identityHeaderEntries = getLocalizedIdentityHeaderEntries(locale);

  return (
    <header className={styles.header}>
      <nav aria-label={messages.navigation.identity}>
        <ul className={styles.list}>
          {identityHeaderEntries.map((identity) => {
            const className = `${styles.link} ${
              identity.type === "person" ? styles.primary : styles.secondary
            }`;
            const content = (
              <>
                <span className={styles.marker} aria-hidden="true" />
                {identity.title}
              </>
            );

            return (
              <li key={identity.key}>
                {identity.external ? (
                  <a
                    href={identity.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      identity.ariaLabel ?? messages.identity.visitZenFurniture
                    }
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link href={identity.href} className={className}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
