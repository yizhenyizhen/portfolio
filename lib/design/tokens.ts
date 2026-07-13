import type {
  ColorTokenName,
  LayerTokenName,
  LayoutSpaceTokenName,
  MotionTokenName,
  RadiusTokenName,
  SpaceTokenName,
  TypographyTokenName,
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

export const typographyTokens: Record<TypographyTokenName, string> = {
  display: "var(--type-display)",
  "page-title": "var(--type-page-title)",
  "page-title-long": "var(--type-page-title-long)",
  "world-title": "var(--type-world-title)",
  "ring-title-base": "var(--type-ring-title-base)",
  "section-title": "var(--type-section-title)",
  "subsection-title": "var(--type-subsection-title)",
  body: "var(--type-body)",
  "body-small": "var(--type-body-small)",
  navigation: "var(--type-navigation)",
  sidebar: "var(--type-sidebar)",
  preview: "var(--type-preview)",
  hint: "var(--type-hint)",
  label: "var(--type-label)",
  button: "var(--type-button)",
  caption: "var(--type-caption)",
  index: "var(--type-index)",
  search: "var(--type-search)",
};

export const layoutSpaceTokens: Record<LayoutSpaceTokenName, string> = {
  "page-inline": "var(--space-page-inline)",
  "page-block": "var(--space-page-block)",
  section: "var(--space-section)",
  "title-body": "var(--space-title-body)",
  "nav-item": "var(--space-nav-item)",
  "header-end": "var(--space-header-end)",
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
