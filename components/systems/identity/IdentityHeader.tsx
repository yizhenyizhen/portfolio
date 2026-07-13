import Link from "next/link";
import { identityEntries } from "@/data/site/identity";
import styles from "./IdentityHeader.module.css";

export function IdentityHeader() {
  return (
    <header className={styles.header}>
      <nav aria-label="Identity navigation">
        <ul className={styles.list}>
          {identityEntries.map((identity) => (
            <li key={identity.slug}>
              <Link
                href={identity.href}
                className={`${styles.link} ${
                  identity.type === "person" ? styles.primary : styles.secondary
                }`}
              >
                {identity.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
