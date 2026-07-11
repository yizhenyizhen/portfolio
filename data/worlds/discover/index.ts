import type { WorldDefinition } from "@/types/world";

export const discoverWorld: WorldDefinition = {
  slug: "discover",
  label: "Discover",
  name: "Perspective through exploration",
  summary: "Expand perspective.",
  description:
    "Discover is the world for places, ideas, architecture visits, notes, and experiences that influence how Yizhen Zhou sees the world.",
  chapters: [
    {
      slug: "travel",
      name: "Travel",
      summary: "Movement through cities and environments that shape taste.",
    },
    {
      slug: "architecture-visits",
      name: "Architecture Visits",
      summary: "Recorded encounters with spaces and built work.",
    },
  ],
  modules: [
    {
      id: "discover-summary",
      kind: "summary",
      eyebrow: "World purpose",
      title: "Discovery should widen perspective, not dump information.",
      body: "This world is structured for future stories, notes, and environments while keeping the route and shell generic.",
    },
  ],
};
