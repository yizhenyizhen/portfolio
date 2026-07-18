import styles from "./AIWorkspace.module.css";

export function AIWorkspace() {
  return (
    <section
      className={styles.workspace}
      aria-labelledby="ai-workspace-title"
    >
      <p className={styles.label}>AI WORKSPACE</p>
      <h2 id="ai-workspace-title" className={styles.title}>
        Ask anything...
      </h2>
      <p className={styles.status}>Coming Soon</p>
    </section>
  );
}
