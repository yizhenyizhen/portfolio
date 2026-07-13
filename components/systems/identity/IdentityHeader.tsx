import Link from "next/link";
import { identityHeaderEntries } from "@/data/site/identity";
import styles from "./IdentityHeader.module.css";

export function IdentityHeader() {
  return (
    <header className={styles.header}>
      <nav aria-label="Identity navigation">
        <ul className={styles.list}>
          {identityHeaderEntries.map((identity) => (
            <li key={identity.key}>
              <Link
                href={identity.href}
                className={`${styles.link} ${
                  identity.type === "person" ? styles.primary : styles.secondary
                }`}
              >
                <span className={styles.marker} aria-hidden="true" />
                {identity.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
