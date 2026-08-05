import { worlds } from "@/data/site/worlds";
import { localizeWorld } from "@/data/site/world-translations";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import type { WorldDefinition, WorldSlug } from "@/types/world";

export function getWorldBySlug(
  slug: WorldSlug,
  locale: Locale = DEFAULT_LOCALE,
): WorldDefinition | undefined {
  const world = worlds[slug];
  return world ? localizeWorld(world, locale) : undefined;
}

export function getWorldSlugs(): WorldSlug[] {
  return Object.keys(worlds) as WorldSlug[];
}
