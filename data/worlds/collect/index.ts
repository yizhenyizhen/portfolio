import type { WorldDefinition } from "@/types/world";

export const collectWorld: WorldDefinition = {
  slug: "collect",
  label: "Collect",
  name: "Curiosity as memory",
  summary: "Reveal long-term curiosity.",
  description:
    "Collect is the world for room keys, running routes, health, photography, books, and the objects or habits that reveal attention over time.",
  chapters: [
    {
      slug: "room-keys",
      name: "Room Keys",
      summary: "Objects as memories rather than trophies.",
    },
    {
      slug: "running",
      name: "Running",
      summary: "Discipline, repetition, and personal records of movement.",
    },
    {
      slug: "health",
      name: "Health",
      summary: "Long-term self-care as part of the same identity system.",
    },
  ],
  modules: [
    {
      id: "collect-summary",
      kind: "summary",
      eyebrow: "World purpose",
      title: "Collections should explain attention.",
      body: "The final experience can later mix imagery, metrics, and storytelling, but the content model begins with typed chapter registration.",
    },
    {
      id: "collect-status",
      kind: "status",
      eyebrow: "Architecture status",
      title: "Ready for new chapter data",
      body: "Future additions like books, photography, and travel memories should be added here without changing route logic.",
    },
  ],
};
