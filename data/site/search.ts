export type HomepageMobileLayoutConfig = {
  maxWidth: number;
  compactLandscapeMaxWidth: number;
  compactLandscapeMaxHeight: number;
  radiusMinWidthRatio: number;
  radiusHeightRatio: number;
  radiusMaxWidthRatio: number;
  ringCenterOffset: number;
  searchOffsetFromRing: number;
  previewOffsetMin: number;
  previewOffsetHeightRatio: number;
  previewOffsetMax: number;
  previewBottomGutterMin: number;
  previewBottomGutterHeightRatio: number;
  previewBottomGutterMax: number;
  compactLandscape: {
    ringCenterOffset: number;
    searchOffsetFromRing: number;
    previewOffsetMin: number;
    previewOffsetHeightRatio: number;
    previewOffsetMax: number;
    previewBottomGutterMin: number;
    previewBottomGutterHeightRatio: number;
    previewBottomGutterMax: number;
  };
};

export type HomepageSearchConfig = {
  placeholder: string;
  ringCenterOffset: number;
  searchOffsetFromRing: number;
  mobileLayout: HomepageMobileLayoutConfig;
};

export const homepageSearchConfig: HomepageSearchConfig = {
  placeholder: "Ask anything about Yizhen...",
  ringCenterOffset: 0.17,
  searchOffsetFromRing: 0.17,
  mobileLayout: {
    maxWidth: 768,
    compactLandscapeMaxWidth: 950,
    compactLandscapeMaxHeight: 500,
    radiusMinWidthRatio: 0.9,
    radiusHeightRatio: 0.68,
    radiusMaxWidthRatio: 1.55,
    ringCenterOffset: 0.13,
    searchOffsetFromRing: 0.13,
    previewOffsetMin: 92,
    previewOffsetHeightRatio: 0.11,
    previewOffsetMax: 104,
    previewBottomGutterMin: 16,
    previewBottomGutterHeightRatio: 0.025,
    previewBottomGutterMax: 24,
    compactLandscape: {
      ringCenterOffset: 0.08,
      searchOffsetFromRing: 0.08,
      previewOffsetMin: 60,
      previewOffsetHeightRatio: 0.15,
      previewOffsetMax: 72,
      previewBottomGutterMin: 12,
      previewBottomGutterHeightRatio: 0.035,
      previewBottomGutterMax: 18,
    },
  },
};
