"use client";

import { useRef } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { NavigationItem } from "@/types/navigation";

export type RingNavigationBoundaryProps = {
  items: NavigationItem[];
  activeSlug?: string;
};

export function RingNavigationBoundary({
  items,
  activeSlug,
}: RingNavigationBoundaryProps) {
  const defaultSlug = activeSlug ?? items[0]?.slug;
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = items.findIndex((item) => item.slug === defaultSlug);

  const moveFocus = (nextIndex: number) => {
    const target = items[nextIndex];

    if (!target) {
      return;
    }

    buttonRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!items.length) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus((selectedIndex + 1 + items.length) % items.length);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus((selectedIndex - 1 + items.length) % items.length);
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveFocus(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      moveFocus(items.length - 1);
    }
  };

  return (
    <section
      className="pointer-events-none relative h-full w-full overflow-hidden"
      aria-label="Homepage ring navigation"
    >
      <div
        className="absolute left-1/2 top-1/2"
        onKeyDown={handleKeyDown}
        style={
          {
            "--ring-size": "clamp(220vw, 240vw, 260vw)",
            "--ring-stroke": "clamp(1.75rem, 2.4vw, 2.5rem)",
            "--label-radius": "calc(var(--ring-size) / 2)",
            left: "50%",
            top: "155vh",
          } as CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border-solid border-[#2f3135]"
          style={{
            width: "var(--ring-size)",
            height: "var(--ring-size)",
            transform: "translate(-50%, -50%)",
            borderWidth: "var(--ring-stroke)",
          }}
        />

        <div
          role="group"
          aria-label="Homepage worlds"
          className="absolute"
          style={{
            width: "var(--ring-size)",
            height: "var(--ring-size)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {items.map((item, index) => {
            const arcOffsets = [0, 20, 40, -40, -20];
            const angle = -90 + (arcOffsets[index] ?? 0);
            const isSelected = item.slug === defaultSlug;
            const distanceFromTop = Math.abs((arcOffsets[index] ?? 0) / 40);
            const emphasis = 1 - distanceFromTop;
            const softened = Math.pow(Math.max(0, emphasis), 1.35);
            const opacity = 0.04 + softened * 0.96;
            const fontSize = 0.62 + softened * 0.9;
            const letterSpacing = 0.035 + softened * 0.07;
            const weight = 340 + softened * 200;
            const color = isSelected
              ? `rgba(255, 255, 255, ${Math.min(1, opacity)})`
              : `rgba(182, 186, 194, ${opacity * 0.78})`;

            return (
              <button
                key={item.slug}
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                type="button"
                aria-current={isSelected ? "page" : undefined}
                aria-label={`${item.label}. ${item.summary}`}
                className={[
                  "pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent text-center outline-none",
                  "focus-visible:text-[var(--color-text-primary)] focus-visible:underline focus-visible:underline-offset-8",
                ].join(" ")}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(var(--label-radius)) rotate(${-angle}deg)`,
                  color,
                  fontSize: `clamp(${fontSize}rem, ${0.45 + softened * 1.15}vw, ${
                    fontSize + 0.14
                  }rem)`,
                  fontWeight: isSelected ? 560 : weight,
                  letterSpacing: `${letterSpacing}em`,
                  lineHeight: 1,
                  opacity,
                  textTransform: "none",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <span className="sr-only">
        Selected action: {items[selectedIndex]?.label ?? "Create"}
      </span>
    </section>
  );
}
