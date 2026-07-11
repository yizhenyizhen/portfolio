import type {
  ColorTokenName,
  LayerTokenName,
  MotionTokenName,
  RadiusTokenName,
  SpaceTokenName,
} from "@/types/design";

export const colorTokens: Record<ColorTokenName, string> = {
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  "surface-elevated": "var(--color-surface-elevated)",
  "border-subtle": "var(--color-border-subtle)",
  "text-primary": "var(--color-text-primary)",
  "text-secondary": "var(--color-text-secondary)",
  "text-muted": "var(--color-text-muted)",
};

export const spaceTokens: Record<SpaceTokenName, string> = {
  "2xs": "var(--space-2xs)",
  xs: "var(--space-xs)",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
  "2xl": "var(--space-2xl)",
  "3xl": "var(--space-3xl)",
};

export const radiusTokens: Record<RadiusTokenName, string> = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
};

export const layerTokens: Record<LayerTokenName, string> = {
  base: "var(--layer-base)",
  content: "var(--layer-content)",
  navigation: "var(--layer-navigation)",
  overlay: "var(--layer-overlay)",
};

export const motionTokens: Record<MotionTokenName, string> = {
  fast: "var(--motion-fast)",
  standard: "var(--motion-standard)",
  scene: "var(--motion-scene)",
};
