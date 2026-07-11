import type { MotionPreset } from "@/types/motion";

export const motionPresets: MotionPreset[] = [
  {
    name: "interactive",
    durationMs: 180,
    description: "Reserved for future high-frequency interactions.",
  },
  {
    name: "transition",
    durationMs: 360,
    description: "Reserved for standard state and page transitions.",
  },
  {
    name: "scene",
    durationMs: 720,
    description: "Reserved for future world-entry or cinematic transitions.",
  },
  {
    name: "reduced",
    durationMs: 0,
    description: "Fallback preset for reduced-motion environments.",
  },
];
