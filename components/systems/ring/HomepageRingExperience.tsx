"use client";

import { useState } from "react";
import CircularGallery from "@/components/CircularGallery";
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
  const [ringGeometry, setRingGeometry] =
    useState<HomepageSearchGeometry | null>(null);
  const activeWorld = items[activeIndex] ?? items[0];
  const previewOffset = `${homepageSearchConfig.ringCenterOffset * 100}vh`;

  const handleSearchSubmit = (value: string) => {
    console.log(value);
  };

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
        onActiveIndexChange={setActiveIndex}
        onGeometryChange={setRingGeometry}
      />

      {activeWorld ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateY(${previewOffset})` }}
        >
          <HomepageWorldPreview
            worldSlug={activeWorld.slug}
            worldLabel={activeWorld.text}
            chapters={activeWorld.chapters}
          />
        </div>
      ) : null}

      <HomepageAISearch
        value={searchValue}
        onChange={setSearchValue}
        onSubmit={handleSearchSubmit}
        geometry={ringGeometry}
        placeholder={homepageSearchConfig.placeholder}
        searchOffsetFromRing={homepageSearchConfig.searchOffsetFromRing}
      />
    </div>
  );
}
