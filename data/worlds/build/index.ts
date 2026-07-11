import type { WorldDefinition } from "@/types/world";

export const buildWorld: WorldDefinition = {
  slug: "build",
  label: "Build",
  name: "Execution as systems",
  summary: "Show ideas becoming systems.",
  description:
    "Build is the world for AI, Horizon, research, products, and future ventures that express execution beyond personal interests.",
  chapters: [
    {
      slug: "ai",
      name: "AI",
      summary: "Experiments, tools, and learning systems.",
    },
    {
      slug: "horizon",
      name: "Horizon",
      summary: "A future-facing product chapter within the same world.",
    },
  ],
  modules: [
    {
      id: "build-summary",
      kind: "summary",
      eyebrow: "World purpose",
      title: "Building should show what the future is trying to become.",
      body: "This registry can absorb startups, research, and product chapters without increasing top-level navigation complexity.",
    },
    {
      id: "build-chapters",
      kind: "chapter-list",
      eyebrow: "Planned chapters",
      title: "Current starter set",
      items: [
        {
          slug: "ai",
          name: "AI",
          summary: "Continuous learning and execution.",
        },
        {
          slug: "horizon",
          name: "Horizon",
          summary: "A future brand or product system.",
        },
      ],
    },
  ],
};
