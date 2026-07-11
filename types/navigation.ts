import type { WorldSlug } from "./world";

export type NavigationAction = WorldSlug;

export type NavigationItem = {
  slug: WorldSlug;
  label: string;
  name: string;
  summary: string;
};
