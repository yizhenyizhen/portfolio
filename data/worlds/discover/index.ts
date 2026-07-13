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
      slug: "places",
      name: "Places",
      summary: "Cities, buildings, and observed details will form a record of place.",
      status: "coming-soon",
      order: 1,
      contentTypes: ["Cities", "Buildings", "Observations"],
    },
    {
      slug: "travel",
      name: "Travel",
      summary: "Journeys and field notes will capture how movement changes perspective.",
      status: "coming-soon",
      order: 2,
      contentTypes: ["Journeys", "Field notes", "Itineraries"],
    },
    {
      slug: "photography",
      name: "Photography",
      summary: "Image series will hold visual studies without becoming a generic gallery.",
      status: "coming-soon",
      order: 3,
      contentTypes: ["Image series", "Contact sheets", "Captions"],
    },
    {
      slug: "notes",
      name: "Notes",
      summary: "Short observations will preserve ideas without introducing a blog system.",
      status: "coming-soon",
      order: 4,
      contentTypes: ["Thoughts", "References", "Questions"],
    },
  ],
  modules: [],
};
