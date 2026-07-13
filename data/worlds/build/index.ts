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
      slug: "horizon",
      name: "Horizon",
      summary: "A dedicated structure will document the project's direction, process, and future updates.",
      status: "coming-soon",
      order: 1,
      contentTypes: ["Product direction", "Build log", "Updates"],
    },
    {
      slug: "zen-furniture",
      name: "Zen Furniture",
      summary: "Brand studies, objects, and prototypes will share one evolving product record.",
      status: "coming-soon",
      order: 2,
      contentTypes: ["Objects", "Brand studies", "Prototypes"],
    },
    {
      slug: "ai-projects",
      name: "AI Projects",
      summary: "Experiments and product concepts will show how emerging tools become useful systems.",
      status: "coming-soon",
      order: 3,
      contentTypes: ["Experiments", "Product concepts", "Build notes"],
    },
    {
      slug: "future-products",
      name: "Future Products",
      summary: "Early ideas will remain visible without pretending unfinished work is complete.",
      status: "coming-soon",
      order: 4,
      contentTypes: ["Early concepts", "Research questions", "Status notes"],
    },
  ],
  modules: [],
};
