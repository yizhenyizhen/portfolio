import { worlds } from "./worlds";
import type { NavigationItem } from "@/types/navigation";

export const primaryNavigation = Object.values(worlds).map((world): NavigationItem => ({
  slug: world.slug,
  href: `/${world.slug}`,
  label: world.label,
  name: world.name,
  summary: world.summary,
}));
