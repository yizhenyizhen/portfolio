import Link from "next/link";
import { identityHeaderEntries } from "@/data/site/identity";
import styles from "./IdentityHeader.module.css";

export function IdentityHeader() {
  return (
    <header className={styles.header}>
      <nav aria-label="Identity navigation">
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
                    aria-label={identity.ariaLabel}
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
