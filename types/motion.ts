export const MOTION_PRESET_NAMES = [
  "interactive",
  "transition",
  "scene",
  "reduced",
] as const;

export type MotionPresetName = (typeof MOTION_PRESET_NAMES)[number];

export type ReducedMotionMode = "system" | "reduce" | "full";

export type MotionPreset = {
  name: MotionPresetName;
  durationMs: number;
  description: string;
};
