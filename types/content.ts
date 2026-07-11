export type ChapterReference = {
  slug: string;
  name: string;
  summary: string;
};

export type SummaryModule = {
  id: string;
  kind: "summary";
  eyebrow: string;
  title: string;
  body: string;
};

export type ChapterListModule = {
  id: string;
  kind: "chapter-list";
  eyebrow: string;
  title: string;
  items: ChapterReference[];
};

export type StatusModule = {
  id: string;
  kind: "status";
  eyebrow: string;
  title: string;
  body: string;
};

export type ContentModule = SummaryModule | ChapterListModule | StatusModule;
