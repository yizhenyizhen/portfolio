import { Mesh, Plane, Program, Texture } from "ogl";

const SAMPLE_SCALE = 0.625;
const SAMPLE_INTERVAL_MS = 1000 / 30;
const SOURCE_SELECTOR = ".dither-container canvas";

const vertex = `
  precision highp float;

  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = `
  precision highp float;

  uniform sampler2D tBackground;
  uniform vec2 uResolution;
  uniform vec2 uRingCenter;
  uniform float uAspect;
  uniform float uRadius;
  uniform float uTrackHalfWidth;
  uniform float uRotation;
  uniform float uReady;

  varying vec2 vUv;

  float radialDistortionField(float angle, float radialPosition) {
    float broadWarp =
      sin(angle * 1.0 + radialPosition * 0.85) * 0.68 +
      sin(angle * 2.0 - radialPosition * 1.25) * 0.31 +
      sin(angle * 4.0 + radialPosition * 0.45) * 0.17;
    float warpedPhase =
      angle * 52.0 +
      broadWarp * 4.6 +
      sin(angle * 6.0 + radialPosition * 2.7) * 1.35 +
      sin(angle * 10.0 - radialPosition * 1.6) * 0.55;

    float primary = sin(warpedPhase);
    float secondary = sin(
      angle * 30.0 - broadWarp * 2.1 + radialPosition * 3.3
    );
    float tertiary = sin(
      angle * 18.0 + broadWarp * 1.35 - radialPosition * 2.2
    );

    return primary * 0.66 + secondary * 0.23 + tertiary * 0.11;
  }

  void main() {
    if (uReady < 0.5) discard;

    vec2 aspectScale = vec2(uAspect, 1.0);
    vec2 ringPosition = (vUv - uRingCenter) * aspectScale;
    float radius = length(ringPosition);
    float radialDistance = radius - uRadius;
    float innerRadius = uRadius - uTrackHalfWidth;
    float outerRadius = uRadius + uTrackHalfWidth;
    float antialiasWidth = 1.5 / uResolution.y;
    float innerMask = smoothstep(
      innerRadius - antialiasWidth,
      innerRadius + antialiasWidth,
      radius
    );
    float outerMask = 1.0 - smoothstep(
      outerRadius - antialiasWidth,
      outerRadius + antialiasWidth,
      radius
    );
    float ringMask = innerMask * outerMask;

    if (ringMask <= 0.001) discard;

    float materialAngle = atan(ringPosition.y, ringPosition.x) - uRotation;
    float radialPosition = clamp(
      radialDistance / max(uTrackHalfWidth, 0.0001),
      -1.0,
      1.0
    );
    vec2 radialDirection = ringPosition / max(radius, 0.0001);
    vec2 tangentDirection = vec2(-radialDirection.y, radialDirection.x);

    float angularStep = 0.0035;
    float radialStep = 0.035;
    float field = radialDistortionField(materialAngle, radialPosition);
    float angularSlope = 0.5 * (
      radialDistortionField(materialAngle + angularStep, radialPosition) -
      radialDistortionField(materialAngle - angularStep, radialPosition)
    );
    float radialSlope = 0.5 * (
      radialDistortionField(materialAngle, radialPosition + radialStep) -
      radialDistortionField(materialAngle, radialPosition - radialStep)
    );
    float localLensEdge = smoothstep(0.06, 0.68, abs(angularSlope));
    float localRadialContrast = smoothstep(0.05, 0.58, abs(radialSlope));
    float localGradient = angularSlope * mix(1.0, 1.48, localLensEdge);
    float radialStretch = radialSlope * mix(1.0, 1.45, localRadialContrast);

    float thickness = 0.88 + 0.12 * sin(
      materialAngle * 5.0 + field * 0.65
    );
    float ior = 1.13;
    float refractionStrength = (ior - 1.0) * thickness;
    float edgeDistance = 1.0 - abs(radialPosition);
    float edgeRefraction = 1.0 - smoothstep(0.0, 0.3, edgeDistance);
    float edgeDirection = radialPosition < 0.0 ? -1.0 : 1.0;

    vec2 refractionOffset = tangentDirection *
      (field * 0.09 + localGradient * 0.044) *
      refractionStrength;
    refractionOffset += radialDirection * radialStretch * 0.034 * refractionStrength;
    refractionOffset += radialDirection *
      edgeDirection *
      edgeRefraction *
      0.115 *
      refractionStrength;

    vec2 sampleUv = clamp(
      vUv + refractionOffset / aspectScale,
      vec2(0.001),
      vec2(0.999)
    );

    vec3 refracted = texture2D(tBackground, sampleUv).rgb;
    float transmission = 0.86 + edgeRefraction * 0.1;
    gl_FragColor = vec4(refracted, ringMask * transmission);
  }
`;

export class GlassRingTrack {
  constructor({
    gl,
    scene,
    screen,
    viewport,
    ringGeometry,
  }) {
    this.gl = gl;
    this.scene = scene;
    this.lastCaptureTime = -SAMPLE_INTERVAL_MS;
    this.sourceCanvas = null;
    this.captureCanvas = document.createElement("canvas");
    this.captureCanvas.width = 1;
    this.captureCanvas.height = 1;
    this.captureContext = this.captureCanvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    this.backgroundTexture = new Texture(gl, {
      image: this.captureCanvas,
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      flipY: true,
    });

    this.geometry = new Plane(gl);
    this.program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      cullFace: null,
      uniforms: {
        tBackground: { value: this.backgroundTexture },
        uResolution: { value: [1, 1] },
        uRingCenter: { value: [0.5, 0.5] },
        uAspect: { value: 1 },
        uRadius: { value: 1 },
        uTrackHalfWidth: { value: 0.05 },
        uRotation: { value: 0 },
        uReady: { value: 0 },
      },
    });
    this.mesh = new Mesh(gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.mesh.setParent(scene);
    this.onResize({ screen, viewport, ringGeometry });
  }

  findSourceCanvas() {
    if (this.sourceCanvas?.isConnected) return this.sourceCanvas;
    this.sourceCanvas = document.querySelector(SOURCE_SELECTOR);
    return this.sourceCanvas;
  }

  resizeCaptureBuffer() {
    const width = Math.max(1, Math.round(this.screen.width * SAMPLE_SCALE));
    const height = Math.max(1, Math.round(this.screen.height * SAMPLE_SCALE));

    if (this.captureCanvas.width === width && this.captureCanvas.height === height) return;
    this.captureCanvas.width = width;
    this.captureCanvas.height = height;
    this.backgroundTexture.needsUpdate = true;
  }

  captureBackground(time) {
    if (time - this.lastCaptureTime < SAMPLE_INTERVAL_MS) return;

    const sourceCanvas = this.findSourceCanvas();
    if (!sourceCanvas || !this.captureContext || sourceCanvas.width === 0) return;

    this.resizeCaptureBuffer();

    try {
      this.captureContext.drawImage(
        sourceCanvas,
        0,
        0,
        this.captureCanvas.width,
        this.captureCanvas.height,
      );
    } catch {
      return;
    }

    this.backgroundTexture.needsUpdate = true;
    this.program.uniforms.uReady.value = 1;
    this.lastCaptureTime = time;
  }

  update({ scroll, time }) {
    this.captureBackground(time);
    this.program.uniforms.uRotation.value = scroll / this.radiusWorld;
  }

  onResize({ screen, viewport, ringGeometry }) {
    this.screen = screen;
    this.viewport = viewport;
    this.bend = ringGeometry.bend;
    this.radiusWorld = ringGeometry.radiusWorld;
    const radius = this.radiusWorld / viewport.height;
    const baseTrackHalfWidthPixels = Math.min(Math.max(screen.width * 0.045, 34), 68);
    const currentTrackHalfWidthPixels = baseTrackHalfWidthPixels * 1.2;
    const trackHalfWidthPixels = currentTrackHalfWidthPixels * 1.2;

    this.mesh.scale.set(viewport.width, viewport.height, 1);
    this.program.uniforms.uResolution.value = [screen.width, screen.height];
    this.program.uniforms.uRingCenter.value = ringGeometry.ringCenterUv;
    this.program.uniforms.uAspect.value = screen.width / screen.height;
    this.program.uniforms.uRadius.value = radius;
    this.program.uniforms.uTrackHalfWidth.value = trackHalfWidthPixels / screen.height;
    this.resizeCaptureBuffer();
  }

  destroy() {
    this.mesh.setParent(null);
    this.geometry.remove();
    this.program.remove();
    this.gl.deleteTexture(this.backgroundTexture.texture);
    this.sourceCanvas = null;
    this.captureContext = null;
  }
}

export const glassRingCaptureProfile = {
  framesPerSecond: 30,
  sampleScale: SAMPLE_SCALE,
  drawCalls: 1,
};
