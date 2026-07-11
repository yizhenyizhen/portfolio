import { worlds } from "@/data/site/worlds";
import type { WorldDefinition, WorldSlug } from "@/types/world";

export function getWorldBySlug(slug: WorldSlug): WorldDefinition | undefined {
  return worlds[slug];
}

export function getWorldSlugs(): WorldSlug[] {
  return Object.keys(worlds) as WorldSlug[];
}
