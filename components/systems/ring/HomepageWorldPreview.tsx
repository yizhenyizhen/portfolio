"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { WorldChapter, WorldSlug } from "@/types/world";
import styles from "./HomepageWorldPreview.module.css";

type PreviewWorld = {
  slug: WorldSlug;
  label: string;
  chapters: WorldChapter[];
};

type HomepageWorldPreviewProps = {
  worldSlug: WorldSlug;
  worldLabel: string;
  chapters: WorldChapter[];
};

const FADE_OUT_DURATION = 200;

export function HomepageWorldPreview({
  worldSlug,
  worldLabel,
  chapters,
}: HomepageWorldPreviewProps) {
  const [displayedWorld, setDisplayedWorld] = useState<PreviewWorld>({
    slug: worldSlug,
    label: worldLabel,
    chapters,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (displayedWorld.slug === worldSlug) return;

    const fadeOutTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 0);
    const contentSwapTimer = window.setTimeout(() => {
      setDisplayedWorld({
        slug: worldSlug,
        label: worldLabel,
        chapters,
      });
      setIsVisible(true);
    }, FADE_OUT_DURATION);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(contentSwapTimer);
    };
  }, [chapters, displayedWorld.slug, worldLabel, worldSlug]);

  return (
    <section
      className={styles.preview}
      data-visible={isVisible ? "true" : "false"}
      aria-label={`${displayedWorld.label} chapters`}
    >
      <ul className={styles.list}>
        {displayedWorld.chapters.map((chapter) => (
          <li key={chapter.slug} className={styles.item}>
            <Link
              href={`/${displayedWorld.slug}#${chapter.slug}`}
              className={styles.link}
            >
              {chapter.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
