import type { WorldSlug } from "./world";

export type NavigationAction = WorldSlug;
export type NavigationHref = `/${WorldSlug}`;

export type NavigationItem = {
  slug: WorldSlug;
  href: NavigationHref;
  label: string;
  name: string;
  summary: string;
};
