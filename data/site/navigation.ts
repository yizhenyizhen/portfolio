import { worlds } from "./worlds";

export const primaryNavigation = Object.values(worlds).map((world) => ({
  slug: world.slug,
  label: world.label,
  name: world.name,
  summary: world.summary,
}));
