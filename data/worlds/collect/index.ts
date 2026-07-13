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
      summary: "A future archive of hotel keys, places, and the memories attached to them.",
      status: "coming-soon",
      order: 1,
      contentTypes: ["Key archive", "Place notes", "Collection records"],
    },
    {
      slug: "running",
      name: "Running",
      summary: "Routes and notes will record discipline, repetition, and movement through place.",
      status: "coming-soon",
      order: 2,
      contentTypes: ["Routes", "Training notes", "Milestones"],
    },
    {
      slug: "health",
      name: "Health",
      summary: "Personal experience and references will support a careful record of long-term health.",
      status: "coming-soon",
      order: 3,
      contentTypes: ["Experience notes", "References", "Habits"],
    },
    {
      slug: "music",
      name: "Music",
      summary: "Listening records will preserve albums, playlists, and moments worth returning to.",
      status: "coming-soon",
      order: 4,
      contentTypes: ["Albums", "Playlists", "Listening notes"],
    },
  ],
  modules: [],
};
