import type { WorldDefinition } from "@/types/world";

export const createWorld: WorldDefinition = {
  slug: "create",
  label: "Create",
  name: "Creation as process",
  summary: "Show how ideas become reality.",
  description:
    "Create is the world for architecture, design process, models, drawings, and future creative work. It should explain how ideas are made, not just what was made.",
  chapters: [
    {
      slug: "architecture",
      name: "Architecture",
      summary: "Projects, drawings, and models will reveal how spatial ideas develop.",
      status: "coming-soon",
      order: 1,
      contentTypes: ["Projects", "Drawings", "3D models"],
    },
    {
      slug: "portfolio",
      name: "Portfolio",
      summary: "Selected work will unfold through process, material, and outcome.",
      status: "coming-soon",
      order: 2,
      contentTypes: ["Selected work", "Process", "Project media"],
    },
    {
      slug: "furniture",
      name: "Furniture",
      summary: "Objects and prototypes will document material thinking at a smaller scale.",
      status: "coming-soon",
      order: 3,
      contentTypes: ["Objects", "Prototypes", "Material studies"],
    },
    {
      slug: "experiments",
      name: "Experiments",
      summary: "Open studies will hold AI tests, visual trials, and unfinished ideas.",
      status: "coming-soon",
      order: 4,
      contentTypes: ["AI studies", "Visual tests", "Open questions"],
    },
  ],
  modules: [],
};
