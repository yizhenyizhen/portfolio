"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/systems/i18n";
import { AIAnswerView } from "./AIAnswerView";
import { AIQuestionForm } from "./AIQuestionForm";
import { Strands } from "./Strands";
import {
  AI_QUESTION_MAX_LENGTH,
  type AIAnswer,
  type AIErrorResponse,
  type AIInterfaceState,
  type AIQuestionRequest,
} from "@/lib/ai/client-types";
import { consumeAIStreamBuffer } from "@/lib/ai/stream-protocol";
import { formatMessage } from "@/lib/i18n/messages";
import styles from "./AIWorkspace.module.css";

type AIWorkspaceProps = {
  active: boolean;
  initialQuestion: string;
};

const EMPTY_ANSWER: AIAnswer = {
  text: "",
  citations: [],
};

const STRANDS_PROFILE: Record<
  AIInterfaceState,
  { speed: number; intensity: number; opacity: number }
> = {
  idle: { speed: 0.25, intensity: 0.3, opacity: 0.45 },
  focused: { speed: 0.28, intensity: 0.36, opacity: 0.52 },
  submitting: { speed: 0.38, intensity: 0.43, opacity: 0.58 },
  streaming: { speed: 0.34, intensity: 0.4, opacity: 0.56 },
  complete: { speed: 0.24, intensity: 0.32, opacity: 0.47 },
  error: { speed: 0.2, intensity: 0.27, opacity: 0.4 },
  aborted: { speed: 0.2, intensity: 0.27, opacity: 0.4 },
};

function getFallbackError(
  status: number,
  messages: ReturnType<typeof useI18n>["messages"],
) {
  if (status === 429) {
    return messages.ai.tooManyQuestions;
  }
  if (status === 503) {
    return messages.ai.notConnected;
  }
  return messages.ai.serviceUnavailable;
}

export function AIWorkspace({
  active,
  initialQuestion,
}: AIWorkspaceProps) {
  const { locale, messages } = useI18n();
  const [question, setQuestion] = useState(initialQuestion);
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [answer, setAnswer] = useState<AIAnswer>(EMPTY_ANSWER);
  const [interfaceState, setInterfaceState] =
    useState<AIInterfaceState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousResponseIdRef = useRef<string | undefined>(undefined);
  const pendingTextRef = useRef("");
  const flushFrameRef = useRef(0);
  const wasActiveRef = useRef(false);

  const flushPendingText = useCallback(() => {
    if (flushFrameRef.current) {
      window.cancelAnimationFrame(flushFrameRef.current);
      flushFrameRef.current = 0;
    }

    const pendingText = pendingTextRef.current;
    pendingTextRef.current = "";
    if (!pendingText) return;

    setAnswer((current) => ({
      ...current,
      text: current.text + pendingText,
    }));
  }, []);

  const queueText = useCallback(
    (text: string) => {
      pendingTextRef.current += text;
      if (flushFrameRef.current) return;
      flushFrameRef.current = window.requestAnimationFrame(() => {
        flushFrameRef.current = 0;
        flushPendingText();
      });
    },
    [flushPendingText],
  );

  const resetWorkspace = useCallback(
    (nextQuestion = "") => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      pendingTextRef.current = "";
      flushPendingText();
      previousResponseIdRef.current = undefined;
      setQuestion(nextQuestion.slice(0, AI_QUESTION_MAX_LENGTH));
      setSubmittedQuestion("");
      setAnswer(EMPTY_ANSWER);
      setErrorMessage("");
      setAnnouncement("");
      setInterfaceState("idle");
    },
    [flushPendingText],
  );

  useEffect(() => {
    if (active && !wasActiveRef.current) {
      resetWorkspace(initialQuestion);
    } else if (!active && wasActiveRef.current) {
      abortControllerRef.current?.abort();
    }
    wasActiveRef.current = active;
  }, [active, initialQuestion, resetWorkspace]);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      if (flushFrameRef.current) {
        window.cancelAnimationFrame(flushFrameRef.current);
      }
    },
    [],
  );

  const submitQuestion = useCallback(async () => {
    const normalizedQuestion = question.trim();
    if (
      !normalizedQuestion ||
      normalizedQuestion.length > AI_QUESTION_MAX_LENGTH ||
      abortControllerRef.current
    ) {
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    pendingTextRef.current = "";
    setSubmittedQuestion(normalizedQuestion);
    setAnswer(EMPTY_ANSWER);
    setErrorMessage("");
    setInterfaceState("submitting");
    setAnnouncement(messages.ai.submittedAnnouncement);

    const payload: AIQuestionRequest = {
      question: normalizedQuestion,
      previousResponseId: previousResponseIdRef.current,
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        credentials: "same-origin",
        signal: abortController.signal,
      });

      if (!response.ok) {
        let message = getFallbackError(response.status, messages);
        try {
          const body = (await response.json()) as AIErrorResponse;
          if (locale === "en" && body.error?.message) {
            message = body.error.message;
          }
        } catch {
          // A non-JSON upstream failure keeps the normalized fallback message.
        }
        throw new Error(message);
      }

      if (!response.body) {
        throw new Error(messages.ai.streamUnavailable);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let completed = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const consumed = consumeAIStreamBuffer(buffer);
        buffer = consumed.remainder;

        for (const event of consumed.events) {
          if (event.type === "delta") {
            setInterfaceState("streaming");
            queueText(event.text);
          } else if (event.type === "done") {
            completed = true;
            previousResponseIdRef.current = event.responseId;
            flushPendingText();
            setAnswer((current) => ({
              ...current,
              citations: event.citations,
            }));
            setInterfaceState("complete");
            setAnnouncement(messages.ai.completeAnnouncement);
          } else {
            throw new Error(event.message);
          }
        }
      }

      buffer += decoder.decode();
      const finalEvents = consumeAIStreamBuffer(`${buffer}\n\n`).events;
      for (const event of finalEvents) {
        if (event.type === "delta") queueText(event.text);
        if (event.type === "done") {
          completed = true;
          previousResponseIdRef.current = event.responseId;
          setAnswer((current) => ({
            ...current,
            citations: event.citations,
          }));
        }
        if (event.type === "error") throw new Error(event.message);
      }

      flushPendingText();
      if (!completed) {
        throw new Error(messages.ai.answerEnded);
      }
      setInterfaceState("complete");
      setAnnouncement(messages.ai.completeAnnouncement);
    } catch (error) {
      flushPendingText();

      if (abortController.signal.aborted) {
        setInterfaceState("aborted");
        setAnnouncement(messages.ai.stoppedAnnouncement);
      } else {
        const message =
          error instanceof Error
            ? error.message
            : messages.ai.serviceUnavailable;
        setErrorMessage(message);
        setInterfaceState("error");
        setAnnouncement(
          formatMessage(messages.ai.errorAnnouncement, { message }),
        );
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [flushPendingText, locale, messages, question, queueText]);

  const stopGeneration = useCallback(() => {
    const abortController = abortControllerRef.current;
    if (!abortController) return;

    abortController.abort();
    setInterfaceState("aborted");
    setAnnouncement(messages.ai.stoppedAnnouncement);
  }, [messages.ai.stoppedAnnouncement]);

  const handleFocusChange = useCallback(
    (focused: boolean) => {
      if (
        interfaceState === "idle" ||
        interfaceState === "focused"
      ) {
        setInterfaceState(focused ? "focused" : "idle");
      }
    },
    [interfaceState],
  );

  const profile = STRANDS_PROFILE[interfaceState];
  const busy =
    interfaceState === "submitting" || interfaceState === "streaming";
  const hasResponseState =
    answer.text.length > 0 ||
    interfaceState === "error" ||
    interfaceState === "aborted";

  return (
    <section
      className={styles.workspace}
      data-state={interfaceState}
      data-has-answer={hasResponseState}
      aria-labelledby="ai-workspace-title"
    >
      <Strands
        className={styles.strands}
        colors={["#f2f4f7", "#8298aa", "#89aaa2"]}
        count={3}
        speed={profile.speed}
        amplitude={0.72}
        waviness={0.82}
        thickness={0.43}
        glow={1.45}
        taper={3.1}
        spread={0.96}
        intensity={profile.intensity}
        saturation={0.62}
        opacity={profile.opacity}
        scale={1.2}
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.label}>{messages.ai.workspaceLabel}</p>
          <h2 id="ai-workspace-title" className={styles.title}>
            {messages.ai.title}
          </h2>
          <p className={styles.intro}>
            {messages.ai.introduction}
          </p>
        </header>

        <AIQuestionForm
          value={question}
          state={interfaceState}
          onChange={setQuestion}
          onFocusChange={handleFocusChange}
          onSubmit={submitQuestion}
          onStop={stopGeneration}
        />

        {interfaceState === "submitting" ? (
          <p className={styles.processing} aria-hidden="true">
            {messages.ai.processing}
          </p>
        ) : null}

        <AIAnswerView
          answer={answer}
          question={submittedQuestion}
          state={interfaceState}
          errorMessage={errorMessage}
          onRetry={submitQuestion}
          onReset={() => resetWorkspace("")}
        />

        <p className={styles.liveStatus} aria-live="polite">
          {announcement}
        </p>
        {busy ? <span className={styles.busyMarker} aria-hidden="true" /> : null}
      </div>
    </section>
  );
}
