import styles from "./StarBorderLink.module.css";

type StarBorderLinkProps = {
  href: string;
  label: string;
};

export function StarBorderLink({ href, label }: StarBorderLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      <span className={styles.topLight} aria-hidden="true" />
      <span className={styles.bottomLight} aria-hidden="true" />
      <span className={styles.content}>{label}</span>
    </a>
  );
}
