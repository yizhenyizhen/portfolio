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
      slug: "about",
      name: "About",
      summary: "A concise introduction will connect current focus with the wider body of work.",
      status: "coming-soon",
      order: 1,
      contentTypes: ["Introduction", "Principles", "Current focus"],
    },
    {
      slug: "timeline",
      name: "Timeline",
      summary: "Selected education and experience will be arranged as a restrained chronology.",
      status: "coming-soon",
      order: 2,
      contentTypes: ["Education", "Experience", "Milestones"],
    },
    {
      slug: "contact",
      name: "Contact",
      summary: "Public links and contact details will make future conversation possible without exposing private information.",
      status: "coming-soon",
      order: 3,
      contentTypes: ["Public links", "Contact channel", "Availability"],
    },
    {
      slug: "chat-with-steven",
      name: "Chat with Steven",
      summary: "A future conversational entry will be introduced only when its scope and voice are ready.",
      status: "coming-later",
      order: 4,
      contentTypes: ["Conversation entry", "Scope", "Privacy notes"],
    },
  ],
  modules: [],
};
