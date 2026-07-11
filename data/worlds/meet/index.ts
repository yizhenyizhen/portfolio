import type { WorldDefinition } from "@/types/world";

export const meetWorld: WorldDefinition = {
  slug: "meet",
  label: "Meet",
  name: "Connection after understanding",
  summary: "Create connection.",
  description:
    "Meet is the final world, where conversation becomes possible after the visitor already understands the broader identity.",
  chapters: [
    {
      slug: "contact",
      name: "Contact",
      summary: "Direct ways to begin a conversation.",
    },
    {
      slug: "ai-steven",
      name: "AI Steven",
      summary: "A future assistant or conversational layer for deeper interaction.",
    },
  ],
  modules: [
    {
      id: "meet-summary",
      kind: "summary",
      eyebrow: "World purpose",
      title: "Meeting should feel like the continuation of a journey.",
      body: "This world remains intentionally light for now, but the structure is ready for future collaboration and contact surfaces.",
    },
  ],
};
