"use client";

import { useState } from "react";

export function useRingRotation(initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return {
    activeIndex,
    setActiveIndex,
  };
}
