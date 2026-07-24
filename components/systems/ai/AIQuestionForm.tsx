"use client";

import {
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  AI_QUESTION_MAX_LENGTH,
  type AIInterfaceState,
} from "@/lib/ai/client-types";
import styles from "./AIQuestionForm.module.css";

type AIQuestionFormProps = {
  value: string;
  state: AIInterfaceState;
  onChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  onSubmit: () => void;
  onStop: () => void;
};

export function AIQuestionForm({
  value,
  state,
  onChange,
  onFocusChange,
  onSubmit,
  onStop,
}: AIQuestionFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pending = state === "submitting" || state === "streaming";
  const canSubmit = value.trim().length > 0 && !pending;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.srOnly} htmlFor="ai-question">
        Ask a question
      </label>
      <div className={styles.inputFrame} data-pending={pending}>
        <textarea
          ref={textareaRef}
          id="ai-question"
          className={styles.input}
          data-ai-question-input
          name="question"
          value={value}
          maxLength={AI_QUESTION_MAX_LENGTH}
          rows={1}
          placeholder="Ask anything about Yizhen..."
          autoComplete="off"
          spellCheck="true"
          onBlur={() => onFocusChange(false)}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => onFocusChange(true)}
          onKeyDown={handleKeyDown}
        />

        {pending ? (
          <button
            className={styles.action}
            type="button"
            aria-label="Stop generating answer"
            onClick={onStop}
            onPointerDown={(event) => {
              if (event.button === 0) onStop();
            }}
          >
            Stop
          </button>
        ) : (
          <button
            className={styles.action}
            type="submit"
            aria-label="Submit question"
            disabled={!canSubmit}
          >
            Ask
          </button>
        )}
      </div>

      <div className={styles.meta} aria-hidden="true">
        <span>Enter to ask · Shift + Enter for a new line</span>
        {value.length > AI_QUESTION_MAX_LENGTH * 0.8 ? (
          <span>
            {value.length}/{AI_QUESTION_MAX_LENGTH}
          </span>
        ) : null}
      </div>
    </form>
  );
}
