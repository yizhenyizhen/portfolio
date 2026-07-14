"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
  mobileLayout?: {
    anchorY: number;
    bottomGutter: number;
    layoutMode: "mobile" | "compact-landscape";
  } | null;
};

const FADE_OUT_DURATION = 200;

export function HomepageWorldPreview({
  worldSlug,
  worldLabel,
  chapters,
  mobileLayout,
}: HomepageWorldPreviewProps) {
  const previewRef = useRef<HTMLElement>(null);
  const measuredHeightRef = useRef(0);
  const [displayedWorld, setDisplayedWorld] = useState<PreviewWorld>({
    slug: worldSlug,
    label: worldLabel,
    chapters,
  });
  const [isVisible, setIsVisible] = useState(true);
  const mobileLayoutMode = mobileLayout?.layoutMode;

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

  useLayoutEffect(() => {
    const preview = previewRef.current;
    if (!preview || !mobileLayoutMode) return;

    const updateMeasuredHeight = () => {
      const height = preview.getBoundingClientRect().height;
      if (Math.abs(height - measuredHeightRef.current) < 0.5) return;

      measuredHeightRef.current = height;
      preview.style.setProperty("--preview-measured-height", `${height}px`);
    };

    updateMeasuredHeight();
    const resizeObserver = new ResizeObserver(updateMeasuredHeight);
    resizeObserver.observe(preview);

    return () => resizeObserver.disconnect();
  }, [displayedWorld.chapters, mobileLayoutMode]);

  const previewStyle = mobileLayout
    ? ({
        "--preview-mobile-anchor-y": `${mobileLayout.anchorY}px`,
        "--preview-mobile-bottom-gutter": `${mobileLayout.bottomGutter}px`,
      } as CSSProperties)
    : undefined;

  return (
    <section
      ref={previewRef}
      className={styles.preview}
      data-visible={isVisible ? "true" : "false"}
      data-layout-mode={mobileLayout?.layoutMode}
      style={previewStyle}
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
