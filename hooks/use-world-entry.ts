"use client";

import { useState } from "react";

export function useWorldEntry(initialWorld: string | null = null) {
  const [activeWorld, setActiveWorld] = useState<string | null>(initialWorld);

  return {
    activeWorld,
    enterWorld: setActiveWorld,
    exitWorld: () => setActiveWorld(null),
  };
}
