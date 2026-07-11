import { WORLD_SLUGS, type WorldSlug } from "@/types/world";

export function isWorldSlug(value: string): value is WorldSlug {
  return WORLD_SLUGS.includes(value as WorldSlug);
}

export function normalizeWorldSlug(value: string): WorldSlug | null {
  return isWorldSlug(value) ? value : null;
}
