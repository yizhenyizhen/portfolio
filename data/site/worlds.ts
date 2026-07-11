import { buildWorld } from "@/data/worlds/build";
import { collectWorld } from "@/data/worlds/collect";
import { createWorld } from "@/data/worlds/create";
import { discoverWorld } from "@/data/worlds/discover";
import { meetWorld } from "@/data/worlds/meet";
import type { WorldDefinition, WorldSlug } from "@/types/world";

export const worlds: Record<WorldSlug, WorldDefinition> = {
  create: createWorld,
  collect: collectWorld,
  discover: discoverWorld,
  build: buildWorld,
  meet: meetWorld,
};
