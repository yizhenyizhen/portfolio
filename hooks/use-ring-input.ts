"use client";

import { useState } from "react";

export function useRingInput() {
  const [isEnabled] = useState(false);

  return {
    isEnabled,
  };
}
