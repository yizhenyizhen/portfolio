"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type RGBColor = [number, number, number];

type DitherProps = {
  waveColor: RGBColor;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  colorNum?: number;
  pixelSize?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function layeredField(
  x: number,
  y: number,
  time: number,
  amplitude: number,
  frequency: number,
  octaves: number,
) {
  let total = 0;
  let weightTotal = 0;

  for (let index = 0; index < octaves; index += 1) {
    const scale = frequency * (1 + index * 0.55);
    const weight = 1 / (index + 1);
    const phase = time * (0.3 + index * 0.16);

    const waveA = Math.sin(x * scale + phase + index * 1.7);
    const waveB = Math.cos(y * scale * 0.92 - phase * 1.1 - index * 2.1);
    const waveC = Math.sin((x + y) * scale * 0.58 + phase * 0.7);

    total += ((waveA + waveB + waveC) / 3) * weight;
    weightTotal += weight;
  }

  return (total / weightTotal) * amplitude;
}

export function Dither({
  waveColor,
  disableAnimation = false,
  enableMouseInteraction = false,
  mouseRadius = 0.4,
  colorNum = 4,
  pixelSize = 2,
  waveAmplitude = 0.05,
  waveFrequency = 1,
  waveSpeed = 0.04,
}: DitherProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const state = {
      currentMouseX: 0.5,
      currentMouseY: 0.5,
      targetMouseX: 0.5,
      targetMouseY: 0.5,
      currentMouseAlpha: 0,
      targetMouseAlpha: 0,
      width: 0,
      height: 0,
      dpr: 1,
    };

    let frameId = 0;
    const start = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      state.width = Math.max(1, Math.floor(rect.width));
      state.height = Math.max(1, Math.floor(rect.height));
      state.dpr = dpr;

      canvas.width = Math.floor(state.width * dpr);
      canvas.height = Math.floor(state.height * dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeMs: number) => {
      const animated =
        !disableAnimation && !prefersReducedMotion ? (timeMs - start) / 1000 : 0;

      state.currentMouseX += (state.targetMouseX - state.currentMouseX) * 0.09;
      state.currentMouseY += (state.targetMouseY - state.currentMouseY) * 0.09;
      state.currentMouseAlpha +=
        (state.targetMouseAlpha - state.currentMouseAlpha) * 0.08;

      context.clearRect(0, 0, state.width, state.height);

      const [r, g, b] = waveColor;
      const spacing = Math.max(8, pixelSize * 6.5);
      const cols = Math.ceil(state.width / spacing) + 2;
      const rows = Math.ceil(state.height / spacing) + 2;
      const baseRadius = Math.max(0.8, pixelSize * 0.72);
      const maxRadius = baseRadius * (2.2 + waveAmplitude * 6);
      const radiusPx = mouseRadius * Math.min(state.width, state.height);

      for (let row = -1; row < rows; row += 1) {
        for (let col = -1; col < cols; col += 1) {
          const x = col * spacing + (row % 2 === 0 ? spacing * 0.12 : spacing * 0.42);
          const y = row * spacing * 0.96;

          const nx = x / state.width;
          const ny = y / state.height;

          const field = layeredField(
            nx * Math.PI * 2.4,
            ny * Math.PI * 2.8,
            animated * waveSpeed * 20,
            1,
            waveFrequency,
            Math.max(1, colorNum),
          );

          const radialShape =
            Math.exp(-Math.pow((nx - 0.24) / 0.18, 2) - Math.pow((ny - 0.28) / 0.22, 2)) *
              0.95 +
            Math.exp(-Math.pow((nx - 0.58) / 0.21, 2) - Math.pow((ny - 0.56) / 0.18, 2)) *
              1.1 +
            Math.exp(-Math.pow((nx - 0.78) / 0.16, 2) - Math.pow((ny - 0.74) / 0.14, 2)) *
              0.8 +
            Math.exp(-Math.pow((nx - 0.35) / 0.14, 2) - Math.pow((ny - 0.82) / 0.12, 2)) *
              0.7;

          const mouseDistance = Math.hypot(
            x - state.currentMouseX * state.width,
            y - state.currentMouseY * state.height,
          );
          const mouseInfluence =
            enableMouseInteraction && !prefersReducedMotion
              ? (1 - smoothstep(radiusPx * 0.1, radiusPx, mouseDistance)) *
                state.currentMouseAlpha
              : 0;

          const breathe = disableAnimation || prefersReducedMotion
            ? 0
            : (Math.sin(animated * waveSpeed * 14 + nx * 6 + ny * 4) * 0.5 + 0.5) *
              waveAmplitude *
              2.2;

          const density = clamp(radialShape * 0.82 + field * 0.24 + breathe, 0, 1.15);
          const radius = clamp(
            baseRadius + density * (maxRadius - baseRadius) + mouseInfluence * pixelSize * 4.6,
            0,
            maxRadius + pixelSize * 5.2,
          );
          const alpha = clamp(
            0.06 + density * 0.92 + mouseInfluence * 0.28,
            0,
            1,
          );

          if (radius < 0.4 || alpha < 0.03) {
            continue;
          }

          context.beginPath();
          context.fillStyle = `rgba(${Math.round(r * 255)}, ${Math.round(
            g * 255,
          )}, ${Math.round(b * 255)}, ${alpha})`;
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (!disableAnimation && !prefersReducedMotion) {
        frameId = window.requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!enableMouseInteraction) {
        return;
      }

      const rect = container.getBoundingClientRect();
      state.targetMouseX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      state.targetMouseY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      state.targetMouseAlpha = 1;
    };

    const handlePointerEnter = (event: PointerEvent) => {
      handlePointerMove(event);
    };

    const handlePointerLeave = () => {
      state.targetMouseAlpha = 0;
    };

    resize();
    draw(start);

    if (!disableAnimation && !prefersReducedMotion) {
      frameId = window.requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (disableAnimation || prefersReducedMotion) {
        draw(performance.now());
      }
    });

    resizeObserver.observe(container);

    if (enableMouseInteraction) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerenter", handlePointerEnter);
      container.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (enableMouseInteraction) {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerenter", handlePointerEnter);
        container.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, [
    colorNum,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius,
    pixelSize,
    prefersReducedMotion,
    waveAmplitude,
    waveColor,
    waveFrequency,
    waveSpeed,
  ]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
