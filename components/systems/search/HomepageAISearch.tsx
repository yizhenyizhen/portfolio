"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type SyntheticEvent,
} from "react";
import styles from "./HomepageAISearch.module.css";

export type HomepageSearchGeometry = {
  activeY: number;
  bend: number;
  circleCenterX: number;
  circleCenterY: number;
  isMobileGeometry: boolean;
  layoutMode: "desktop" | "mobile" | "compact-landscape";
  radiusWorld: number;
  ringRadiusPixels: number;
  screenWidth: number;
  screenHeight: number;
};

type HomepageAISearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onActivate: () => void;
  geometry: HomepageSearchGeometry | null;
  placeholder: string;
  searchOffsetFromRing: number;
  workspaceActive: boolean;
};

type CaretMetrics = {
  angle: number;
  scrollLength: number;
  x: number;
  y: number;
};

const SEARCH_MAX_WIDTH = 560;
const SEARCH_MIN_WIDTH = 280;
const SEARCH_CORNER_RADIUS_RATIO = 0.24;

function clampValue(minimum: number, value: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getResponsiveSearchMetrics(
  screenWidth: number,
  screenHeight: number,
) {
  const shortestSide = Math.min(screenWidth, screenHeight);
  const sideMargin = clampValue(16, screenWidth * 0.05, 32);
  const height = clampValue(48, shortestSide * 0.07, 60);
  const preferredWidth = clampValue(
    SEARCH_MIN_WIDTH,
    screenWidth * 0.72,
    SEARCH_MAX_WIDTH,
  );

  return {
    caretHalfHeight: clampValue(8, height * 0.18, 11),
    height,
    sideMargin,
    textBaselineOffset: clampValue(4, height * 0.09, 5.5),
    textInset: clampValue(22, height * 0.48, 30),
    width: Math.min(preferredWidth, Math.max(0, screenWidth - sideMargin * 2)),
  };
}

function pointOnTopArc(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
) {
  return {
    x: centerX + radius * Math.sin(angle),
    y: centerY - radius * Math.cos(angle),
  };
}

function createArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  halfAngle: number,
) {
  const start = pointOnTopArc(centerX, centerY, radius, -halfAngle);
  const end = pointOnTopArc(centerX, centerY, radius, halfAngle);

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}

function createBandPath(
  centerX: number,
  centerY: number,
  radius: number,
  halfAngle: number,
  height: number,
) {
  const outerRadius = radius + height / 2;
  const innerRadius = radius - height / 2;
  const cornerRadius = height * SEARCH_CORNER_RADIUS_RATIO;
  const outerCornerAngle = Math.min(
    cornerRadius / outerRadius,
    halfAngle * 0.4,
  );
  const innerCornerAngle = Math.min(
    cornerRadius / innerRadius,
    halfAngle * 0.4,
  );
  const outerStart = pointOnTopArc(
    centerX,
    centerY,
    outerRadius,
    -halfAngle,
  );
  const outerEnd = pointOnTopArc(
    centerX,
    centerY,
    outerRadius,
    halfAngle,
  );
  const innerEnd = pointOnTopArc(
    centerX,
    centerY,
    innerRadius,
    halfAngle,
  );
  const innerStart = pointOnTopArc(
    centerX,
    centerY,
    innerRadius,
    -halfAngle,
  );
  const outerArcStart = pointOnTopArc(
    centerX,
    centerY,
    outerRadius,
    -halfAngle + outerCornerAngle,
  );
  const outerArcEnd = pointOnTopArc(
    centerX,
    centerY,
    outerRadius,
    halfAngle - outerCornerAngle,
  );
  const innerArcEnd = pointOnTopArc(
    centerX,
    centerY,
    innerRadius,
    halfAngle - innerCornerAngle,
  );
  const innerArcStart = pointOnTopArc(
    centerX,
    centerY,
    innerRadius,
    -halfAngle + innerCornerAngle,
  );
  const rightOuterSide = pointOnTopArc(
    centerX,
    centerY,
    outerRadius - cornerRadius,
    halfAngle,
  );
  const rightInnerSide = pointOnTopArc(
    centerX,
    centerY,
    innerRadius + cornerRadius,
    halfAngle,
  );
  const leftInnerSide = pointOnTopArc(
    centerX,
    centerY,
    innerRadius + cornerRadius,
    -halfAngle,
  );
  const leftOuterSide = pointOnTopArc(
    centerX,
    centerY,
    outerRadius - cornerRadius,
    -halfAngle,
  );

  return [
    `M ${outerArcStart.x} ${outerArcStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerArcEnd.x} ${outerArcEnd.y}`,
    `Q ${outerEnd.x} ${outerEnd.y} ${rightOuterSide.x} ${rightOuterSide.y}`,
    `L ${rightInnerSide.x} ${rightInnerSide.y}`,
    `Q ${innerEnd.x} ${innerEnd.y} ${innerArcEnd.x} ${innerArcEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerArcStart.x} ${innerArcStart.y}`,
    `Q ${innerStart.x} ${innerStart.y} ${leftInnerSide.x} ${leftInnerSide.y}`,
    `L ${leftOuterSide.x} ${leftOuterSide.y}`,
    `Q ${outerStart.x} ${outerStart.y} ${outerArcStart.x} ${outerArcStart.y}`,
    "Z",
  ].join(" ");
}

function stopRingPointerInput(event: SyntheticEvent) {
  event.stopPropagation();
}

export function HomepageAISearch({
  value,
  onChange,
  onSubmit,
  onActivate,
  geometry,
  placeholder,
  searchOffsetFromRing,
  workspaceActive,
}: HomepageAISearchProps) {
  const pathId = `homepage-search-path-${useId().replaceAll(":", "")}`;
  const clipId = `homepage-search-clip-${useId().replaceAll(":", "")}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [caretIndex, setCaretIndex] = useState(value.length);
  const [focused, setFocused] = useState(false);
  const [caretMetrics, setCaretMetrics] = useState<CaretMetrics>({
    angle: 0,
    scrollLength: 0,
    x: 0,
    y: 0,
  });
  const responsiveMetrics = getResponsiveSearchMetrics(
    geometry?.screenWidth ?? 0,
    geometry?.screenHeight ?? 0,
  );
  const {
    caretHalfHeight,
    height: searchHeight,
    textBaselineOffset,
    textInset,
    width: searchWidth,
  } = responsiveMetrics;

  const searchRadius = geometry
    ? geometry.ringRadiusPixels +
      geometry.screenHeight * searchOffsetFromRing
    : 1;
  const halfAngle = geometry
    ? Math.asin(Math.min(searchWidth / (2 * searchRadius), 0.95))
    : 0;
  const textRadius = Math.max(searchRadius - textBaselineOffset, 1);
  const textArcLength = textRadius * halfAngle * 2;
  const availableTextLength = Math.max(textArcLength - textInset * 2, 1);

  useLayoutEffect(() => {
    if (!geometry) return;

    const safeCaretIndex = Math.min(caretIndex, value.length);
    let caretTextLength = 0;
    let totalTextLength = 0;

    if (textRef.current && value.length > 0) {
      try {
        totalTextLength = textRef.current.getComputedTextLength();
        caretTextLength =
          safeCaretIndex > 0
            ? textRef.current.getSubStringLength(0, safeCaretIndex)
            : 0;
      } catch {
        totalTextLength = 0;
        caretTextLength = 0;
      }
    }

    let scrollLength = caretMetrics.scrollLength;

    if (caretTextLength - scrollLength > availableTextLength) {
      scrollLength = caretTextLength - availableTextLength;
    }

    if (caretTextLength - scrollLength < 0) {
      scrollLength = caretTextLength;
    }

    if (totalTextLength - scrollLength < availableTextLength) {
      scrollLength = Math.max(0, totalTextLength - availableTextLength);
    }

    const caretDistance = Math.min(
      Math.max(textInset + caretTextLength - scrollLength, textInset),
      textArcLength - textInset,
    );
    const angle = -halfAngle + caretDistance / textRadius;
    const point = pointOnTopArc(
      geometry.circleCenterX,
      geometry.circleCenterY,
      searchRadius,
      angle,
    );
    const nextMetrics = {
      angle: (angle * 180) / Math.PI,
      scrollLength,
      x: point.x,
      y: point.y,
    };

    setCaretMetrics((currentMetrics) => {
      const unchanged =
        Math.abs(currentMetrics.angle - nextMetrics.angle) < 0.01 &&
        Math.abs(currentMetrics.scrollLength - nextMetrics.scrollLength) <
          0.01 &&
        Math.abs(currentMetrics.x - nextMetrics.x) < 0.01 &&
        Math.abs(currentMetrics.y - nextMetrics.y) < 0.01;

      return unchanged ? currentMetrics : nextMetrics;
    });
  }, [
    availableTextLength,
    caretIndex,
    caretMetrics.scrollLength,
    geometry,
    halfAngle,
    searchRadius,
    textArcLength,
    textInset,
    textRadius,
    value,
  ]);

  const updateCaretIndex = (input: HTMLInputElement) => {
    setCaretIndex(input.selectionStart ?? input.value.length);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    updateCaretIndex(event.target);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  if (!geometry) {
    return (
      <div
        className={styles.system}
        data-workspace-hidden={workspaceActive ? "true" : "false"}
      >
        <div
          className={styles.conversationPanel}
          data-homepage-ai-conversation-panel=""
          aria-hidden="true"
        />
      </div>
    );
  }

  const bandPath = createBandPath(
    geometry.circleCenterX,
    geometry.circleCenterY,
    searchRadius,
    halfAngle,
    searchHeight,
  );
  const textPath = createArcPath(
    geometry.circleCenterX,
    geometry.circleCenterY,
    textRadius,
    halfAngle,
  );
  const searchApexY = geometry.circleCenterY - searchRadius;

  return (
    <div
      className={styles.system}
      data-workspace-hidden={workspaceActive ? "true" : "false"}
    >
      <form
        className={styles.form}
        data-focused={focused ? "true" : "false"}
        onSubmit={handleSubmit}
        onPointerDown={stopRingPointerInput}
        onMouseDown={stopRingPointerInput}
        onTouchStart={stopRingPointerInput}
      >
        <svg
          className={styles.svg}
          viewBox={`0 0 ${geometry.screenWidth} ${geometry.screenHeight}`}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={bandPath} />
            </clipPath>
          </defs>

          <path className={styles.surface} d={bandPath} />
          <path id={pathId} d={textPath} fill="none" />

          <g clipPath={`url(#${clipId})`}>
            {value ? (
              <text ref={textRef} className={styles.value} xmlSpace="preserve">
                <textPath
                  href={`#${pathId}`}
                  startOffset={textInset - caretMetrics.scrollLength}
                >
                  {value}
                </textPath>
              </text>
            ) : (
              <text className={styles.placeholder} xmlSpace="preserve">
                <textPath href={`#${pathId}`} startOffset={textInset}>
                  {placeholder}
                </textPath>
              </text>
            )}

            {focused ? (
              <line
                className={styles.caret}
                x1={caretMetrics.x}
                x2={caretMetrics.x}
                y1={caretMetrics.y - caretHalfHeight}
                y2={caretMetrics.y + caretHalfHeight}
                transform={`rotate(${caretMetrics.angle} ${caretMetrics.x} ${caretMetrics.y})`}
              />
            ) : null}
          </g>
        </svg>

        <input
          ref={inputRef}
          className={styles.field}
          type="search"
          value={value}
          aria-label={placeholder}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          style={{
            left: geometry.circleCenterX - searchWidth / 2,
            top: searchApexY - searchHeight / 2,
            width: searchWidth,
            height: searchHeight,
          }}
          onChange={handleChange}
          onSelect={(event) => updateCaretIndex(event.currentTarget)}
          onKeyUp={(event) => updateCaretIndex(event.currentTarget)}
          onClick={onActivate}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </form>

      <div
        className={styles.conversationPanel}
        data-homepage-ai-conversation-panel=""
        aria-hidden="true"
      />
    </div>
  );
}
