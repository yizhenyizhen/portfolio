"use client";

import { useI18n } from "@/components/systems/i18n";
import type { AIAnswer, AIInterfaceState } from "@/lib/ai/client-types";
import styles from "./AIAnswerView.module.css";

type AIAnswerViewProps = {
  answer: AIAnswer;
  question: string;
  state: AIInterfaceState;
  errorMessage: string;
  onRetry: () => void;
  onReset: () => void;
};

export function AIAnswerView({
  answer,
  question,
  state,
  errorMessage,
  onRetry,
  onReset,
}: AIAnswerViewProps) {
  const { messages } = useI18n();
  const hasAnswer = answer.text.length > 0;
  const showError = state === "error";
  const showAborted = state === "aborted";

  if (!hasAnswer && !showError && !showAborted) return null;

  return (
    <section className={styles.answer} aria-label={messages.ai.answerLabel}>
      <p className={styles.question}>{question}</p>

      {hasAnswer ? (
        <div className={styles.text}>
          {answer.text}
          {state === "streaming" ? (
            <span className={styles.caret} aria-hidden="true" />
          ) : null}
        </div>
      ) : null}

      {answer.citations.length > 0 ? (
        <ul className={styles.citations} aria-label={messages.ai.sources}>
          {answer.citations.map((citation) => (
            <li key={citation.id}>
              {citation.href ? (
                <a href={citation.href}>{citation.label}</a>
              ) : (
                citation.label
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {showError ? (
        <p className={styles.notice}>{errorMessage}</p>
      ) : null}
      {showAborted ? (
        <p className={styles.notice}>{messages.ai.generationStopped}</p>
      ) : null}

      {state === "complete" || showError || showAborted ? (
        <div className={styles.controls}>
          {showError ? (
            <button type="button" onClick={onRetry}>
              {messages.ai.retry}
            </button>
          ) : null}
          <button type="button" onClick={onReset}>
            {messages.ai.newQuestion}
          </button>
        </div>
      ) : null}
    </section>
  );
}
