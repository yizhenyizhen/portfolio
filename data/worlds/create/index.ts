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
      slug: "portfolio",
      name: "Portfolio",
      summary:
        "Project-based work should eventually unfold as experiences rather than static case-study pages.",
    },
    {
      slug: "design-process",
      name: "Design Process",
      summary:
        "A future home for sketches, iterations, and the thinking behind final outcomes.",
    },
  ],
  modules: [
    {
      id: "create-summary",
      kind: "summary",
      eyebrow: "World purpose",
      title: "Creation should reveal thinking, not just outcomes.",
      body: "This placeholder module marks the contract for future world storytelling without committing to a final UI treatment.",
    },
    {
      id: "create-chapters",
      kind: "chapter-list",
      eyebrow: "Planned chapters",
      title: "Initial chapter registry",
      items: [
        {
          slug: "portfolio",
          name: "Portfolio",
          summary: "Architecture and future creative projects.",
        },
        {
          slug: "design-process",
          name: "Design Process",
          summary: "How ideas are studied, tested, and refined.",
        },
      ],
    },
  ],
};
