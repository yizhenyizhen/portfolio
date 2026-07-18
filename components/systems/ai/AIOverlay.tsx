"use client";

import {
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
  type TransitionEvent,
} from "react";
import { createPortal } from "react-dom";
import { AIWorkspace } from "./AIWorkspace";
import styles from "./AIOverlay.module.css";

export type AIWorkspacePhase = "closed" | "open" | "closing";

type AIOverlayProps = {
  phase: AIWorkspacePhase;
  onRequestClose: () => void;
  onExitComplete: () => void;
};

function stopHomepageInput(event: SyntheticEvent) {
  event.stopPropagation();
}

export function AIOverlay({
  phase,
  onRequestClose,
  onExitComplete,
}: AIOverlayProps) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const active = phase !== "closed";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPortalTarget(document.body);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!active) return;

    const homepage = document.querySelector<HTMLElement>(
      "main.homepage-viewport",
    );
    const wasInert = homepage?.inert ?? false;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (homepage) homepage.inert = true;

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (homepage) homepage.inert = wasInert;
      previousFocusRef.current?.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };
  }, [active]);

  useEffect(() => {
    if (phase !== "open") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onRequestClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onRequestClose, phase]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      phase === "closing" &&
      event.target === event.currentTarget &&
      event.propertyName === "opacity"
    ) {
      onExitComplete();
    }
  };

  if (!portalTarget) return null;

  return createPortal(
    <div
      className={styles.overlay}
      data-phase={phase}
      role="dialog"
      aria-labelledby="ai-workspace-title"
      aria-modal={active ? "true" : undefined}
      aria-hidden={!active}
      onTransitionEnd={handleTransitionEnd}
      onPointerDown={stopHomepageInput}
      onPointerMove={stopHomepageInput}
      onPointerUp={stopHomepageInput}
      onMouseDown={stopHomepageInput}
      onMouseMove={stopHomepageInput}
      onMouseUp={stopHomepageInput}
      onTouchStart={stopHomepageInput}
      onTouchMove={stopHomepageInput}
      onTouchEnd={stopHomepageInput}
      onWheel={stopHomepageInput}
    >
      <button
        ref={closeButtonRef}
        className={styles.close}
        type="button"
        aria-label="Close AI workspace"
        onClick={onRequestClose}
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className={styles.workspaceLayer}>
        <AIWorkspace />
      </div>
    </div>,
    portalTarget,
  );
}
