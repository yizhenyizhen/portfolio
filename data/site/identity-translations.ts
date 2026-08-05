import {
  getIdentityEntry,
  identityEntries,
  type IdentityEntry,
  type IdentityHeaderEntry,
  type IdentitySlug,
} from "@/data/site/identity";
import { getWorldBySlug } from "@/lib/content/get-world";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/routing";
import type { WorldChapter } from "@/types/world";

type IdentityCopy = Pick<
  IdentityEntry,
  "eyebrow" | "description" | "summary"
> & {
  chapters: Record<
    string,
    Pick<WorldChapter, "name" | "summary" | "contentTypes">
  >;
  externalActionLabel?: string;
};

const chineseIdentities: Record<IdentitySlug, IdentityCopy> = {
  about: {
    eyebrow: "个人身份",
    description: "个人身份、实践、原则与经历。",
    summary: "即将呈现",
    chapters: {
      overview: { name: "概览", summary: "即将呈现。", contentTypes: ["介绍", "当前关注", "精选链接"] },
      practice: { name: "实践", summary: "即将呈现。", contentTypes: ["建筑", "设计", "实验"] },
      principles: { name: "原则", summary: "即将呈现。", contentTypes: ["价值观", "工作方法", "长期方向"] },
      timeline: { name: "时间线", summary: "即将呈现。", contentTypes: ["教育", "经历", "里程碑"] },
      contact: { name: "联系", summary: "即将呈现。", contentTypes: ["公开链接", "联系渠道", "可联系状态"] },
    },
  },
  "zen-furniture": {
    eyebrow: "家具实践",
    description: "家具物件、系列、材料与制作过程。",
    summary: "即将呈现",
    chapters: {
      overview: { name: "概览", summary: "即将呈现。", contentTypes: ["介绍", "当前方向", "工作室笔记"] },
      objects: { name: "物件", summary: "即将呈现。", contentTypes: ["家具", "原型", "研究"] },
      collections: { name: "系列", summary: "即将呈现。", contentTypes: ["当前作品", "档案", "未来发布"] },
      materials: { name: "材料", summary: "即将呈现。", contentTypes: ["材料研究", "细节", "制作"] },
      process: { name: "过程", summary: "即将呈现。", contentTypes: ["研究", "开发", "原型制作"] },
    },
  },
  horizon: {
    eyebrow: "创业项目",
    description: "Horizon 的愿景、产品、进展与未来更新。",
    summary: "即将呈现",
    externalActionLabel: "进入官网",
    chapters: {
      overview: { name: "概览", summary: "即将呈现。", contentTypes: ["介绍", "当前状态", "更新"] },
      vision: { name: "愿景", summary: "即将呈现。", contentTypes: ["目的", "原则", "方向"] },
      product: { name: "产品", summary: "即将呈现。", contentTypes: ["概念", "体验", "系统"] },
      progress: { name: "进展", summary: "即将呈现。", contentTypes: ["研究", "开发", "里程碑"] },
      updates: { name: "更新", summary: "即将呈现。", contentTypes: ["公告", "建设笔记", "下一步"] },
    },
  },
};

export function localizeIdentity(
  identity: IdentityEntry,
  locale: Locale,
): IdentityEntry {
  if (locale === "en") return identity;

  const copy = chineseIdentities[identity.slug];

  return {
    ...identity,
    eyebrow: copy.eyebrow,
    description: copy.description,
    summary: copy.summary,
    href: localizeHref(identity.href, locale),
    chapters: identity.chapters.map((chapter) => {
      const chapterCopy = copy.chapters[chapter.slug];

      if (!chapterCopy) {
        throw new Error(`Missing Chinese identity copy: ${identity.slug}/${chapter.slug}`);
      }

      return { ...chapter, ...chapterCopy };
    }),
    externalAction: identity.externalAction
      ? {
          ...identity.externalAction,
          label: copy.externalActionLabel ?? identity.externalAction.label,
        }
      : undefined,
  };
}

export function getLocalizedIdentityEntry(
  slug: IdentitySlug,
  locale: Locale = DEFAULT_LOCALE,
) {
  return localizeIdentity(getIdentityEntry(slug), locale);
}

export function getLocalizedIdentityEntries(
  locale: Locale = DEFAULT_LOCALE,
) {
  return identityEntries.map((identity) => localizeIdentity(identity, locale));
}

function toHeaderEntry(
  identity: IdentityEntry,
  locale: Locale,
): IdentityHeaderEntry {
  return {
    key: identity.slug,
    title: identity.title,
    href: localizeHref(identity.href, locale),
    type: identity.type,
  };
}

export function getLocalizedIdentityHeaderEntries(
  locale: Locale = DEFAULT_LOCALE,
) {
  const create = getWorldBySlug("create", locale);
  const portfolio = create?.chapters.find((chapter) => chapter.slug === "portfolio");

  if (!create || !portfolio) {
    throw new Error("Create must expose its registered Portfolio chapter.");
  }

  const about = getLocalizedIdentityEntry("about", locale);
  const zenFurniture = getLocalizedIdentityEntry("zen-furniture", locale);
  const horizon = getLocalizedIdentityEntry("horizon", locale);

  return [
    toHeaderEntry(about, locale),
    {
      key: `${create.slug}:${portfolio.slug}`,
      title: locale === "en" ? portfolio.name.toUpperCase() : portfolio.name,
      href: localizeHref(`/${create.slug}#${portfolio.slug}`, locale),
      type: "world-chapter" as const,
    },
    {
      ...toHeaderEntry(zenFurniture, locale),
      href: "https://zenfurniture.uk",
      external: true,
    },
    toHeaderEntry(horizon, locale),
  ] satisfies IdentityHeaderEntry[];
}
