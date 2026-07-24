"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import styles from "./Strands.module.css";

const MAX_STRANDS = 12;
const MAX_COLORS = 8;
const MAX_DPR = 1.5;

const VERTEX_SHADER = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int index = int(floor(scaled));
  float blend = fract(scaled);
  int nextIndex = index + 1;
  if (nextIndex >= uColorCount) nextIndex = 0;
  return mix(uColors[index], uColors[nextIndex], blend);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float energy = 0.06 + uIntensity * 0.94;
  float envelope = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);
  vec3 color = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float strand = float(i);
    float phase = strand * 1.7 * uSpread;
    float frequency = (2.0 + strand * 0.35) * uWaviness;
    float phaseSpeed = 1.4 + strand * 1.2;
    float time = uTime * uSpeed;
    float wave = sin(uv.x * frequency + time * phaseSpeed + phase) * 0.60
      + sin(
        uv.x * frequency * 1.1 - time * phaseSpeed * 0.7 + phase * 1.7
      ) * 0.40;

    float amplitude = (0.1 + 0.02 * energy) * envelope * uAmplitude;
    float distanceToStrand = abs(uv.y - wave * amplitude);
    float thickness =
      (0.001 + 0.05 * energy) *
      (0.35 + envelope) *
      uThickness;
    float glow = thickness / (distanceToStrand + thickness * 0.45);
    glow *= glow;

    float palettePosition =
      strand / float(uStrandCount) + uv.x * 0.30 + uTime * 0.015;
    color += samplePalette(palettePosition) * glow * envelope;
  }

  color *= 0.45 + 0.7 * energy;
  color = 1.0 - exp(-color * uGlow);

  float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = max(mix(vec3(gray), color, uSaturation), 0.0);

  float luminance = max(max(color.r, color.g), color.b);
  float alpha = clamp(luminance, 0.0, 1.0) * uOpacity;
  fragColor = vec4(color * uOpacity, alpha);
}
`;

type StrandsProps = {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

type StrandsValues = Required<
  Pick<
    StrandsProps,
    | "colors"
    | "count"
    | "speed"
    | "amplitude"
    | "waviness"
    | "thickness"
    | "glow"
    | "taper"
    | "spread"
    | "intensity"
    | "saturation"
    | "opacity"
    | "scale"
  >
>;

const DEFAULT_COLORS = ["#f2f4f7", "#8298aa", "#89aaa2"];

function clamp(minimum: number, value: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function buildPalette(colors: string[]) {
  const source = colors.length > 0 ? colors : DEFAULT_COLORS;

  return Array.from({ length: MAX_COLORS }, (_, index) => {
    const color = new Color(source[index] ?? source[source.length - 1]);
    return [color.r, color.g, color.b];
  });
}

export function Strands({
  colors = DEFAULT_COLORS,
  count = 3,
  speed = 0.3,
  amplitude = 0.72,
  waviness = 0.82,
  thickness = 0.43,
  glow = 1.45,
  taper = 3,
  spread = 0.96,
  intensity = 0.38,
  saturation = 0.62,
  opacity = 0.58,
  scale = 1.22,
  className = "",
  style,
}: StrandsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawStaticFrameRef = useRef<(() => void) | null>(null);
  const valuesRef = useRef<StrandsValues>({
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    intensity,
    saturation,
    opacity,
    scale,
  });
  useEffect(() => {
    valuesRef.current = {
      colors,
      count,
      speed,
      amplitude,
      waviness,
      thickness,
      glow,
      taper,
      spread,
      intensity,
      saturation,
      opacity,
      scale,
    };
    drawStaticFrameRef.current?.();
  }, [
    amplitude,
    colors,
    count,
    glow,
    intensity,
    opacity,
    saturation,
    scale,
    speed,
    spread,
    taper,
    thickness,
    waviness,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let program: Program | null = null;
    let geometry: Triangle | null = null;
    let animationFrame = 0;
    let resizeFrame = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastPaletteKey = "";
    let reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    container.dataset.motion = reducedMotion ? "static" : "animated";

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        depth: false,
        dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR),
        premultipliedAlpha: true,
        powerPreference: "low-power",
      });

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.setAttribute("aria-hidden", "true");
      gl.canvas.tabIndex = -1;

      geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      program = new Program(gl, {
        vertex: VERTEX_SHADER,
        fragment: FRAGMENT_SHADER,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] },
          uColors: { value: buildPalette(valuesRef.current.colors) },
          uColorCount: {
            value: clamp(
              1,
              valuesRef.current.colors.length || DEFAULT_COLORS.length,
              MAX_COLORS,
            ),
          },
          uStrandCount: {
            value: clamp(
              1,
              Math.round(valuesRef.current.count),
              MAX_STRANDS,
            ),
          },
          uSpeed: { value: valuesRef.current.speed },
          uAmplitude: { value: valuesRef.current.amplitude },
          uWaviness: { value: valuesRef.current.waviness },
          uThickness: { value: valuesRef.current.thickness },
          uGlow: { value: valuesRef.current.glow },
          uTaper: { value: valuesRef.current.taper },
          uSpread: { value: valuesRef.current.spread },
          uIntensity: { value: valuesRef.current.intensity },
          uOpacity: { value: valuesRef.current.opacity },
          uScale: { value: valuesRef.current.scale },
          uSaturation: { value: valuesRef.current.saturation },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });
      container.appendChild(gl.canvas);

      const resize = () => {
        if (!renderer || !program) return;
        const bounds = container.getBoundingClientRect();
        const width = Math.max(1, Math.round(bounds.width));
        const height = Math.max(1, Math.round(bounds.height));
        if (width === lastWidth && height === lastHeight) return;

        lastWidth = width;
        lastHeight = height;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [
          renderer.gl.canvas.width,
          renderer.gl.canvas.height,
        ];
      };

      const applyValues = (time: number) => {
        if (!program) return;
        const current = valuesRef.current;
        const paletteKey = current.colors.join("|");
        if (paletteKey !== lastPaletteKey) {
          lastPaletteKey = paletteKey;
          program.uniforms.uColors.value = buildPalette(current.colors);
          program.uniforms.uColorCount.value = clamp(
            1,
            current.colors.length || DEFAULT_COLORS.length,
            MAX_COLORS,
          );
        }

        program.uniforms.uTime.value = time * 0.001;
        program.uniforms.uStrandCount.value = clamp(
          1,
          Math.round(current.count),
          MAX_STRANDS,
        );
        program.uniforms.uSpeed.value = current.speed;
        program.uniforms.uAmplitude.value = current.amplitude;
        program.uniforms.uWaviness.value = current.waviness;
        program.uniforms.uThickness.value = current.thickness;
        program.uniforms.uGlow.value = current.glow;
        program.uniforms.uTaper.value = current.taper;
        program.uniforms.uSpread.value = current.spread;
        program.uniforms.uIntensity.value = current.intensity;
        program.uniforms.uOpacity.value = current.opacity;
        program.uniforms.uScale.value = current.scale;
        program.uniforms.uSaturation.value = current.saturation;
      };

      const draw = (time = 0) => {
        if (!renderer || !program) return;
        applyValues(time);
        renderer.render({ scene: mesh, clear: true });
      };

      const animate = (time: number) => {
        animationFrame = 0;
        if (document.hidden || reducedMotion) return;
        draw(time);
        animationFrame = window.requestAnimationFrame(animate);
      };

      const startAnimation = () => {
        if (animationFrame || document.hidden || reducedMotion) return;
        animationFrame = window.requestAnimationFrame(animate);
      };

      const resizeObserver = new ResizeObserver(() => {
        if (resizeFrame) return;
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = 0;
          resize();
          draw(performance.now());
        });
      });

      const motionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const handleMotionChange = (event: MediaQueryListEvent) => {
        reducedMotion = event.matches;
        container.dataset.motion = reducedMotion ? "static" : "animated";
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        draw(performance.now());
        startAnimation();
      };
      const handleVisibilityChange = () => {
        if (document.hidden && animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        } else {
          draw(performance.now());
          startAnimation();
        }
      };

      resizeObserver.observe(container);
      motionQuery.addEventListener("change", handleMotionChange);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      resize();
      draw(performance.now());
      startAnimation();
      drawStaticFrameRef.current = () => draw(performance.now());
      container.dataset.renderer = "ready";

      return () => {
        drawStaticFrameRef.current = null;
        delete container.dataset.renderer;
        delete container.dataset.motion;
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        resizeObserver.disconnect();
        motionQuery.removeEventListener("change", handleMotionChange);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        program?.remove();
        geometry?.remove();
        if (gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch {
      drawStaticFrameRef.current = null;
      if (renderer) {
        const gl = renderer.gl;
        if (gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
      container.dataset.renderer = "fallback";
      container.dataset.motion = "static";
      return;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.strands} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
