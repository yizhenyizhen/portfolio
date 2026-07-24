"use client";

import { useCallback, useState } from "react";
import CircularGallery from "@/components/CircularGallery";
import {
  AIOverlay,
  type AIWorkspacePhase,
} from "@/components/systems/ai";
import { HomepageWorldPreview } from "@/components/systems/ring/HomepageWorldPreview";
import {
  HomepageAISearch,
  type HomepageSearchGeometry,
} from "@/components/systems/search/HomepageAISearch";
import { homepageSearchConfig } from "@/data/site/search";
import type { WorldChapter, WorldSlug } from "@/types/world";

type HomepageRingItem = {
  slug: WorldSlug;
  text: string;
  href: string;
  chapters: WorldChapter[];
};

type HomepageRingExperienceProps = {
  items: HomepageRingItem[];
  initialIndex: number;
  bend: number;
  textColor: string;
  font: string;
  scrollSpeed: number;
  scrollEase: number;
};

function clampValue(minimum: number, value: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function HomepageRingExperience({
  items,
  initialIndex,
  bend,
  textColor,
  font,
  scrollSpeed,
  scrollEase,
}: HomepageRingExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [searchValue, setSearchValue] = useState("");
  const [workspacePhase, setWorkspacePhase] =
    useState<AIWorkspacePhase>("closed");
  const [ringGeometry, setRingGeometry] =
    useState<HomepageSearchGeometry | null>(null);
  const activeWorld = items[activeIndex] ?? items[0];
  const previewOffset = `${homepageSearchConfig.ringCenterOffset * 100}vh`;
  const layoutMode = ringGeometry?.layoutMode ?? "desktop";
  const isMobileGeometry = ringGeometry?.isMobileGeometry ?? false;
  const mobileLayout = homepageSearchConfig.mobileLayout;
  const activeMobileLayout =
    layoutMode === "compact-landscape"
      ? mobileLayout.compactLandscape
      : mobileLayout;
  const mobileLayoutMode: "mobile" | "compact-landscape" =
    layoutMode === "compact-landscape" ? "compact-landscape" : "mobile";
  const effectiveSearchOffset = isMobileGeometry
    ? activeMobileLayout.searchOffsetFromRing
    : homepageSearchConfig.searchOffsetFromRing;
  const previewMobileLayout =
    ringGeometry && isMobileGeometry
      ? {
          anchorY:
            ringGeometry.activeY +
            clampValue(
              activeMobileLayout.previewOffsetMin,
              ringGeometry.screenHeight *
                activeMobileLayout.previewOffsetHeightRatio,
              activeMobileLayout.previewOffsetMax,
            ),
          bottomGutter: clampValue(
            activeMobileLayout.previewBottomGutterMin,
            ringGeometry.screenHeight *
              activeMobileLayout.previewBottomGutterHeightRatio,
            activeMobileLayout.previewBottomGutterMax,
          ),
          layoutMode: mobileLayoutMode,
        }
      : null;

  const workspaceActive = workspacePhase !== "closed";

  const openWorkspace = useCallback(() => {
    setWorkspacePhase("open");
  }, []);

  const closeWorkspace = useCallback(() => {
    setWorkspacePhase((currentPhase) =>
      currentPhase === "open" ? "closing" : currentPhase,
    );
  }, []);

  const completeWorkspaceExit = useCallback(() => {
    setWorkspacePhase((currentPhase) =>
      currentPhase === "closing" ? "closed" : currentPhase,
    );
  }, []);

  const handleSearchSubmit = useCallback(() => {
    openWorkspace();
  }, [openWorkspace]);

  return (
    <div className="relative h-full w-full">
      <CircularGallery
        items={items}
        initialIndex={initialIndex}
        bend={bend}
        textColor={textColor}
        font={font}
        scrollSpeed={scrollSpeed}
        scrollEase={scrollEase}
        centerOffsetRatio={homepageSearchConfig.ringCenterOffset}
        mobileLayout={mobileLayout}
        onActiveIndexChange={setActiveIndex}
        onGeometryChange={setRingGeometry}
      />

      {activeWorld ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={
            previewMobileLayout
              ? undefined
              : { transform: `translateY(${previewOffset})` }
          }
        >
          <HomepageWorldPreview
            worldSlug={activeWorld.slug}
            worldLabel={activeWorld.text}
            chapters={activeWorld.chapters}
            mobileLayout={previewMobileLayout}
          />
        </div>
      ) : null}

      <HomepageAISearch
        value={searchValue}
        onChange={setSearchValue}
        onSubmit={handleSearchSubmit}
        onActivate={openWorkspace}
        geometry={ringGeometry}
        placeholder={homepageSearchConfig.placeholder}
        searchOffsetFromRing={effectiveSearchOffset}
        workspaceActive={workspaceActive}
      />

      <AIOverlay
        phase={workspacePhase}
        initialQuestion={searchValue}
        onRequestClose={closeWorkspace}
        onExitComplete={completeWorkspaceExit}
      />
    </div>
  );
}
