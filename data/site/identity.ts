import type { WorldChapter } from "@/types/world";

export type IdentitySlug = "about" | "zen-furniture" | "horizon";
export type IdentityType = "person" | "practice" | "startup";

export type IdentityEntry = {
  slug: IdentitySlug;
  title: string;
  href: `/${IdentitySlug}`;
  type: IdentityType;
  eyebrow: string;
  description: string;
  summary: string;
  chapters: WorldChapter[];
  externalAction?: {
    label: string;
    href: `https://${string}`;
  };
};

export const identityEntries: IdentityEntry[] = [
  {
    slug: "about",
    title: "YIZHEN ZHOU",
    href: "/about",
    type: "person",
    eyebrow: "Personal identity",
    description: "Personal identity, practice, principles, and experience.",
    summary: "Coming Soon",
    chapters: [
      {
        slug: "overview",
        name: "Overview",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 1,
        contentTypes: ["Introduction", "Current focus", "Selected links"],
      },
      {
        slug: "practice",
        name: "Practice",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 2,
        contentTypes: ["Architecture", "Design", "Experiments"],
      },
      {
        slug: "principles",
        name: "Principles",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 3,
        contentTypes: ["Values", "Working methods", "Long-term direction"],
      },
      {
        slug: "timeline",
        name: "Timeline",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 4,
        contentTypes: ["Education", "Experience", "Milestones"],
      },
      {
        slug: "contact",
        name: "Contact",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 5,
        contentTypes: ["Public links", "Contact channel", "Availability"],
      },
    ],
  },
  {
    slug: "zen-furniture",
    title: "ZEN FURNITURE",
    href: "/zen-furniture",
    type: "practice",
    eyebrow: "Furniture practice",
    description: "Furniture objects, collections, materials, and process.",
    summary: "Coming Soon",
    chapters: [
      {
        slug: "overview",
        name: "Overview",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 1,
        contentTypes: ["Introduction", "Current direction", "Studio notes"],
      },
      {
        slug: "objects",
        name: "Objects",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 2,
        contentTypes: ["Furniture", "Prototypes", "Studies"],
      },
      {
        slug: "collections",
        name: "Collections",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 3,
        contentTypes: ["Current work", "Archive", "Future releases"],
      },
      {
        slug: "materials",
        name: "Materials",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 4,
        contentTypes: ["Material studies", "Details", "Making"],
      },
      {
        slug: "process",
        name: "Process",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 5,
        contentTypes: ["Research", "Development", "Prototyping"],
      },
    ],
  },
  {
    slug: "horizon",
    title: "HORIZON — STARTUP",
    href: "/horizon",
    type: "startup",
    eyebrow: "Startup",
    description: "Horizon vision, product, progress, and future updates.",
    summary: "Coming Soon",
    chapters: [
      {
        slug: "overview",
        name: "Overview",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 1,
        contentTypes: ["Introduction", "Current status", "Updates"],
      },
      {
        slug: "vision",
        name: "Vision",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 2,
        contentTypes: ["Purpose", "Principles", "Direction"],
      },
      {
        slug: "product",
        name: "Product",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 3,
        contentTypes: ["Concept", "Experience", "System"],
      },
      {
        slug: "progress",
        name: "Progress",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 4,
        contentTypes: ["Research", "Development", "Milestones"],
      },
      {
        slug: "updates",
        name: "Updates",
        summary: "Coming Soon.",
        status: "coming-soon",
        order: 5,
        contentTypes: ["Announcements", "Build notes", "Next steps"],
      },
    ],
    externalAction: {
      label: "ENTER THE PAGE",
      href: "https://www.horizon-startup.com/?lang=en",
    },
  },
];

export function getIdentityEntry(slug: IdentitySlug) {
  const entry = identityEntries.find((identity) => identity.slug === slug);

  if (!entry) {
    throw new Error(`Unknown identity entry: ${slug}`);
  }

  return entry;
}
