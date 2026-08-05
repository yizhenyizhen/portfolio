import { worlds } from "@/data/site/worlds";
import type { Locale } from "@/lib/i18n/config";
import type { WorldDefinition, WorldSlug } from "@/types/world";

type ChapterCopy = {
  name: string;
  summary: string;
  contentTypes: string[];
};

type WorldCopy = {
  label: string;
  name: string;
  summary: string;
  description: string;
  chapters: Record<string, ChapterCopy>;
};

const chineseWorlds: Record<WorldSlug, WorldCopy> = {
  create: {
    label: "创作",
    name: "创作是一种过程",
    summary: "呈现想法如何成为现实。",
    description: "创作收录建筑、设计过程、模型、图纸与未来的创意实践。这里解释想法如何被实现，而不只展示最终结果。",
    chapters: {
      architecture: { name: "建筑", summary: "通过项目、图纸与模型，呈现空间想法的发展过程。", contentTypes: ["项目", "图纸", "三维模型"] },
      portfolio: { name: "作品集", summary: "以过程、材料与结果串联经过选择的实践。", contentTypes: ["精选作品", "过程", "项目媒介"] },
      furniture: { name: "家具", summary: "以物件和原型记录更小尺度下的材料思考。", contentTypes: ["物件", "原型", "材料研究"] },
      experiments: { name: "实验", summary: "容纳 AI 测试、视觉尝试与尚未完成的想法。", contentTypes: ["AI 研究", "视觉测试", "开放问题"] },
    },
  },
  collect: {
    label: "收藏",
    name: "好奇心成为记忆",
    summary: "呈现持续积累的好奇心。",
    description: "收藏收录房卡、跑步路线、健康、摄影、书籍，以及那些在时间中显露关注方式的物件与习惯。",
    chapters: {
      "room-keys": { name: "房卡", summary: "未来将成为酒店房卡、地点及其相关记忆的档案。", contentTypes: ["房卡档案", "地点笔记", "收藏记录"] },
      running: { name: "跑步", summary: "以路线和笔记记录纪律、重复，以及身体穿行于地点的过程。", contentTypes: ["路线", "训练笔记", "里程碑"] },
      health: { name: "健康", summary: "以个人经验和参考资料，谨慎记录长期健康实践。", contentTypes: ["经验笔记", "参考资料", "习惯"] },
      music: { name: "音乐", summary: "保存值得再次聆听的专辑、播放列表与时刻。", contentTypes: ["专辑", "播放列表", "聆听笔记"] },
    },
  },
  discover: {
    label: "探索",
    name: "在探索中形成视角",
    summary: "拓展看待世界的方式。",
    description: "探索收录地点、想法、建筑参访、笔记与经历，记录它们如何影响 Yizhen Zhou 理解世界。",
    chapters: {
      places: { name: "地点", summary: "以城市、建筑和观察到的细节构成地点记录。", contentTypes: ["城市", "建筑", "观察"] },
      travel: { name: "旅行", summary: "通过旅程与田野笔记，记录移动如何改变视角。", contentTypes: ["旅程", "田野笔记", "行程"] },
      photography: { name: "摄影", summary: "以影像系列承载视觉研究，而不成为普通图片库。", contentTypes: ["影像系列", "接触印样", "图注"] },
      notes: { name: "笔记", summary: "用简短观察保存想法，而不引入博客系统。", contentTypes: ["想法", "参考", "问题"] },
    },
  },
  build: {
    label: "建设",
    name: "执行成为系统",
    summary: "呈现想法如何成为系统。",
    description: "建设收录 AI、Horizon、研究、产品与未来项目，呈现个人兴趣之外的长期执行。",
    chapters: {
      horizon: { name: "Horizon", summary: "以独立结构记录项目方向、过程与后续更新。", contentTypes: ["产品方向", "建设日志", "更新"] },
      "zen-furniture": { name: "Zen Furniture", summary: "让品牌研究、物件与原型共同构成持续演进的产品记录。", contentTypes: ["物件", "品牌研究", "原型"] },
      "ai-projects": { name: "AI 项目", summary: "通过实验与产品概念，展示新工具如何成为有用的系统。", contentTypes: ["实验", "产品概念", "建设笔记"] },
      "future-products": { name: "未来产品", summary: "保留早期想法，同时不把未完成的工作伪装成成品。", contentTypes: ["早期概念", "研究问题", "状态笔记"] },
    },
  },
  meet: {
    label: "相遇",
    name: "理解之后的连接",
    summary: "创造真实连接。",
    description: "相遇是最后一个主题。当访客理解更完整的身份之后，对话才在这里成为可能。",
    chapters: {
      about: { name: "关于", summary: "以简洁介绍连接当下关注与更广泛的实践。", contentTypes: ["介绍", "原则", "当前关注"] },
      timeline: { name: "时间线", summary: "将经过选择的教育与经历整理为克制的时间脉络。", contentTypes: ["教育", "经历", "里程碑"] },
      contact: { name: "联系", summary: "通过公开链接与联系渠道开启未来对话，同时保护私人信息。", contentTypes: ["公开链接", "联系渠道", "可联系状态"] },
      "chat-with-steven": { name: "与 Steven 对话", summary: "只有在范围与表达方式准备好后，才会开放未来的对话入口。", contentTypes: ["对话入口", "范围", "隐私说明"] },
    },
  },
};

export function localizeWorld(
  world: WorldDefinition,
  locale: Locale,
): WorldDefinition {
  if (locale === "en") return world;

  const copy = chineseWorlds[world.slug];

  return {
    ...world,
    label: copy.label,
    name: copy.name,
    summary: copy.summary,
    description: copy.description,
    chapters: world.chapters.map((chapter) => {
      const chapterCopy = copy.chapters[chapter.slug];

      if (!chapterCopy) {
        throw new Error(`Missing Chinese chapter copy: ${world.slug}/${chapter.slug}`);
      }

      return { ...chapter, ...chapterCopy };
    }),
  };
}

export function getLocalizedWorlds(locale: Locale) {
  return Object.fromEntries(
    Object.entries(worlds).map(([slug, world]) => [slug, localizeWorld(world, locale)]),
  ) as Record<WorldSlug, WorldDefinition>;
}
