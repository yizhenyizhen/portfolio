"use client";

import { useEffect, useState } from "react";
import type { ReducedMotionMode } from "@/types/motion";

export function useReducedMotion(mode: ReducedMotionMode = "system") {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    mode === "reduce",
  );

  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, [mode]);

  return prefersReducedMotion;
}
