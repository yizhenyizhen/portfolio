import type { ContentModule } from "./content";

export const WORLD_SLUGS = [
  "create",
  "collect",
  "discover",
  "build",
  "meet",
] as const;

export type WorldSlug = (typeof WORLD_SLUGS)[number];

export type WorldChapterStatus = "coming-soon" | "coming-later";

export type WorldChapter = {
  slug: string;
  name: string;
  summary: string;
  status: WorldChapterStatus;
  order: number;
  contentTypes: string[];
};

export type WorldDefinition = {
  slug: WorldSlug;
  label: string;
  name: string;
  summary: string;
  description: string;
  chapters: WorldChapter[];
  modules: ContentModule[];
};
