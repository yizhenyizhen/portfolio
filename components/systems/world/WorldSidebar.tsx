"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { WorldChapter } from "@/types/world";
import "./WorldSidebar.css";

const PROXIMITY_RADIUS = 104;
const SMOOTHING_MS = 120;
const ACTIVE_EFFECT = 1;

function smoothFalloff(value: number) {
  return value * value * (3 - 2 * value);
}

type WorldSidebarProps = {
  chapters: WorldChapter[];
  worldLabel: string;
};

export function WorldSidebar({ chapters, worldLabel }: WorldSidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const targetEffectsRef = useRef(chapters.map(() => 0));
  const currentEffectsRef = useRef(chapters.map(() => 0));
  const activeIndexRef = useRef(0);
  const focusedIndexRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const frameCallbackRef = useRef<(now: number) => void>(() => undefined);

  const requestAnimationStep = useCallback(() => {
    animationFrameRef.current = window.requestAnimationFrame((now) => {
      frameCallbackRef.current(now);
    });
  }, []);

  const runFrame = useCallback(
    (now: number) => {
      const elapsed = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      const timeConstant = prefersReducedMotion ? 0.001 : SMOOTHING_MS / 1000;
      const smoothing = 1 - Math.exp(-elapsed / timeConstant);
      let isMoving = false;

      for (let index = 0; index < itemRefs.current.length; index += 1) {
        const item = itemRefs.current[index];

        if (!item) {
          continue;
        }

        const activeTarget = activeIndexRef.current === index ? ACTIVE_EFFECT : 0;
        const focusTarget = focusedIndexRef.current === index ? ACTIVE_EFFECT : 0;
        const target = Math.max(
          targetEffectsRef.current[index] ?? 0,
          activeTarget,
          focusTarget,
        );
        const current = currentEffectsRef.current[index] ?? 0;
        const next = current + (target - current) * smoothing;
        const settled = Math.abs(target - next) < 0.0015;
        const effect = settled ? target : next;

        currentEffectsRef.current[index] = effect;
        item.style.setProperty("--effect", effect.toFixed(4));
        isMoving ||= !settled;
      }

      if (isMoving) {
        requestAnimationStep();
      } else {
        animationFrameRef.current = null;
      }
    },
    [prefersReducedMotion, requestAnimationStep],
  );

  const startAnimationLoop = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    lastFrameRef.current = performance.now();
    requestAnimationStep();
  }, [requestAnimationStep]);

  const activateChapter = useCallback(
    (index: number) => {
      if (index < 0 || index >= chapters.length) {
        return;
      }

      if (activeIndexRef.current !== index) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }

      startAnimationLoop();
    },
    [chapters.length, startAnimationLoop],
  );

  const updateHash = useCallback((slug: string, mode: "push" | "replace") => {
    const nextHash = `#${slug}`;

    if (window.location.hash === nextHash) {
      return;
    }

    if (mode === "push") {
      window.history.pushState(null, "", nextHash);
    } else {
      window.history.replaceState(null, "", nextHash);
    }
  }, []);

  const scrollToChapter = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const chapter = chapters[index];
      const section = chapter ? document.getElementById(chapter.slug) : null;

      if (!section) {
        return;
      }

      activateChapter(index);
      section.scrollIntoView({ behavior, block: "start" });
    },
    [activateChapter, chapters],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLUListElement>) => {
      if (event.pointerType === "touch") {
        return;
      }

      const list = listRef.current;

      if (!list) {
        return;
      }

      const horizontal = window.getComputedStyle(list).flexDirection === "row";

      itemRefs.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        const bounds = item.getBoundingClientRect();
        const itemCenter = horizontal
          ? bounds.left + bounds.width / 2
          : bounds.top + bounds.height / 2;
        const pointerPosition = horizontal ? event.clientX : event.clientY;
        const distance = Math.abs(pointerPosition - itemCenter);
        const proximity = Math.max(0, 1 - distance / PROXIMITY_RADIUS);

        targetEffectsRef.current[index] = smoothFalloff(proximity);
      });

      startAnimationLoop();
    },
    [startAnimationLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetEffectsRef.current.fill(0);
    startAnimationLoop();
  }, [startAnimationLoop]);

  const handleFocus = useCallback(
    (index: number) => {
      focusedIndexRef.current = index;
      startAnimationLoop();
    },
    [startAnimationLoop],
  );

  const handleBlur = useCallback(() => {
    focusedIndexRef.current = null;
    startAnimationLoop();
  }, [startAnimationLoop]);

  useEffect(() => {
    frameCallbackRef.current = runFrame;
  }, [runFrame]);

  useEffect(() => {
    startAnimationLoop();

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [startAnimationLoop]);

  useEffect(() => {
    const syncFromLocation = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      const index = chapters.findIndex((chapter) => chapter.slug === slug);

      if (index >= 0) {
        scrollToChapter(index, "auto");
      }
    };
    const initialSync = window.setTimeout(syncFromLocation, 0);

    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);

    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, [chapters, scrollToChapter]);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.slug))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      () => {
        const readingLine = window.innerHeight * 0.38;
        let nextIndex = 0;

        sections.forEach((section, index) => {
          if (section.getBoundingClientRect().top <= readingLine) {
            nextIndex = index;
          }
        });

        activateChapter(nextIndex);

        if (window.location.hash || nextIndex > 0) {
          updateHash(chapters[nextIndex].slug, "replace");
        }
      },
      {
        rootMargin: "-24% 0px -64% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [activateChapter, chapters, updateHash]);

  return (
    <nav className="world-sidebar" aria-label={`${worldLabel} chapters`}>
      <ul
        ref={listRef}
        className="world-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {chapters.map((chapter, index) => (
          <li
            key={chapter.slug}
            ref={(item) => {
              itemRefs.current[index] = item;
            }}
            className="world-sidebar__item"
            data-active={activeIndex === index ? "true" : "false"}
          >
            <span className="world-sidebar__marker" aria-hidden="true" />
            <a
              href={`#${chapter.slug}`}
              className="world-sidebar__link"
              aria-current={activeIndex === index ? "location" : undefined}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              onClick={(event) => {
                event.preventDefault();
                updateHash(chapter.slug, "push");
                scrollToChapter(
                  index,
                  prefersReducedMotion ? "auto" : "smooth",
                );
              }}
            >
              <span className="world-sidebar__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="world-sidebar__text">{chapter.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
