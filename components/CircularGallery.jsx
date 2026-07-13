"use client";

import { Camera, Renderer, Transform } from "ogl";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import "./CircularGallery.css";
import { GlassRingTrack } from "./systems/ring/GlassRingTrack";

const MAX_LABEL_SCALE = 1.6;
const MAX_LABEL_FONT_WEIGHT = "700";
const MAX_LABEL_LETTER_SPACING = "0.12em";
const MINIMUM_GAP_FONT_RATIO = 0.75;
const SNAP_CONVERGENCE_MULTIPLIER = 1.18;
const SNAP_CONVERGENCE_RANGE_RATIO = 0.25;
const HINT_SETTLE_DURATION = 75;
const HINT_POSITION_EPSILON_PIXELS = 0.25;
const HINT_VELOCITY_EPSILON_PIXELS_PER_MS = 0.0025;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

let hintPathSequence = 0;

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

class Media {
  constructor({
    container,
    index,
    length,
    screen,
    text,
    viewport,
    bend,
    centerOffsetPixels,
    textColor,
    font,
    href,
    onNavigate,
  }) {
    this.extra = 0;
    this.container = container;
    this.index = index;
    this.length = length;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.centerOffsetPixels = centerOffsetPixels;
    this.textColor = textColor;
    this.font = font;
    this.href = href;
    this.onNavigate = onNavigate;
    this.boundOnClick = this.handleClick.bind(this);
    this.createText();
    this.onResize();
  }

  createText() {
    this.element = document.createElement("button");
    this.element.className = "circular-gallery__item";
    this.element.type = "button";
    this.element.textContent = this.text;
    this.element.setAttribute("aria-label", this.text);
    this.element.style.color = this.textColor;
    this.element.style.font = this.font;
    this.element.addEventListener("click", this.boundOnClick);
    this.container.appendChild(this.element);
  }

  handleClick(event) {
    if (!this.href) return;
    this.onNavigate?.(this.href, event);
  }

  measureMaximumTextWidth() {
    const previousFontWeight = this.element.style.fontWeight;
    const previousLetterSpacing = this.element.style.letterSpacing;
    const previousTransform = this.element.style.transform;
    const previousVisibility = this.element.style.visibility;

    this.element.style.fontWeight = MAX_LABEL_FONT_WEIGHT;
    this.element.style.letterSpacing = MAX_LABEL_LETTER_SPACING;
    this.element.style.transform = "none";
    this.element.style.visibility = "hidden";

    const computedStyle = window.getComputedStyle(this.element);
    const fontSize = Number.parseFloat(computedStyle.fontSize);
    const textWidth = this.element.getBoundingClientRect().width * MAX_LABEL_SCALE;

    this.element.style.fontWeight = previousFontWeight;
    this.element.style.letterSpacing = previousLetterSpacing;
    this.element.style.transform = previousTransform;
    this.element.style.visibility = previousVisibility;

    return {
      fontSize: Number.isFinite(fontSize) ? fontSize : 64,
      textWidth,
    };
  }

  update(scroll, direction) {
    this.positionX = this.x - scroll.current - this.extra;

    const x = this.positionX;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.positionY = 0;
      this.rotation = 0;
    } else {
      const BAbs = Math.abs(this.bend);
      const radius = (H * H + BAbs * BAbs) / (2 * BAbs);
      const effectiveX = Math.min(Math.abs(x), H);
      const signedX = Math.max(-H, Math.min(x, H));
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      const theta = Math.asin(signedX / radius);

      if (this.bend > 0) {
        this.positionY = -arc;
        this.rotation = theta;
      } else {
        this.positionY = arc;
        this.rotation = -theta;
      }
    }

    const screenX = this.screen.width / 2 + (x / this.viewport.width) * this.screen.width;
    const screenY =
      this.screen.height / 2 +
      this.centerOffsetPixels -
      (this.positionY / this.viewport.height) * this.screen.height;
    const distance = Math.min(Math.abs(x) / H, 1);
    const focus = 1 - distance;
    const scale = 0.42 + Math.pow(focus, 1.35) * 1.18;
    const opacity = 0.035 + Math.pow(focus, 1.8) * 0.965;

    this.element.style.left = `${screenX}px`;
    this.element.style.top = `${screenY}px`;
    this.element.style.opacity = `${opacity}`;
    this.element.style.fontWeight = `${Math.round(300 + focus * 400)}`;
    this.element.style.letterSpacing = `${0.025 + focus * 0.095}em`;
    this.element.style.zIndex = `${Math.round(focus * 100)}`;
    this.element.style.transform = `translate(-50%, -50%) rotate(${this.rotation}rad) scale(${scale})`;

    const itemOffset = this.maximumTextWidthWorld / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.positionX + itemOffset < -viewportOffset;
    this.isAfter = this.positionX - itemOffset > viewportOffset;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }

    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport, centerOffsetPixels } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    if (Number.isFinite(centerOffsetPixels)) {
      this.centerOffsetPixels = centerOffsetPixels;
    }
  }

  destroy() {
    this.element.removeEventListener("click", this.boundOnClick);
    this.element.remove();
  }
}

class App {
  constructor(
    container,
    {
      items,
      initialIndex = 0,
      bend,
      textColor = "#ffffff",
      font = "600 64px sans-serif",
      scrollSpeed = 2,
      scrollEase = 0.05,
      centerOffsetRatio = 0,
      onNavigate,
      onActiveIndexChange,
      onGeometryChange,
    } = {},
  ) {
    document.documentElement.classList.remove("no-js");
    this.destroyed = false;
    this.container = container;
    this.bend = bend;
    this.centerOffsetRatio = Number.isFinite(centerOffsetRatio)
      ? centerOffsetRatio
      : 0;
    this.scrollSpeed = scrollSpeed;
    this.onNavigate = onNavigate;
    this.onActiveIndexChange = onActiveIndexChange;
    this.onGeometryChange = onGeometryChange;
    this.activeIndex = null;
    this.isSnapping = false;
    this.pointerTravel = 0;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.hasInteracted = false;
    this.hintState = "scroll";
    this.settleStartedAt = null;
    this.previousTargetDistance = Number.POSITIVE_INFINITY;
    this.previousFrameTime = null;
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGlassTrack(bend);
    this.createMedias(items, bend, textColor, font);
    this.setInitialIndex(initialIndex);
    this.createHint();
    this.remeasureWhenFontsReady();
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.canvas.className = "circular-gallery__engine";
    this.gl.canvas.setAttribute("aria-hidden", "true");
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGlassTrack(bend) {
    this.glassRingTrack = new GlassRingTrack({
      gl: this.gl,
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      bend,
      centerOffsetPixels: this.centerOffsetPixels,
    });
  }

  createMedias(items, bend = 1, textColor, font) {
    const galleryItems = items && items.length ? items : [];
    this.uniqueItemCount = galleryItems.length;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        container: this.labels,
        index,
        length: this.mediasImages.length,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        centerOffsetPixels: this.centerOffsetPixels,
        textColor,
        font,
        href: data.href,
        onNavigate: this.navigateTo.bind(this),
      });
    });
    this.layoutMedias();
  }

  navigateTo(href, event) {
    const isKeyboardActivation = event.detail === 0;
    if (!isKeyboardActivation && this.pointerTravel > 6) return;
    this.onNavigate?.(href);
  }

  createHint() {
    hintPathSequence += 1;
    const pathId = `circular-gallery-hint-path-${hintPathSequence}`;

    this.hint = document.createElement("div");
    this.hint.className = "circular-gallery__hint";
    this.hint.dataset.hintState = this.hintState;
    this.hint.setAttribute("aria-hidden", "true");

    this.hintSvg = document.createElementNS(SVG_NAMESPACE, "svg");
    this.hintSvg.setAttribute("class", "circular-gallery__hint-arc");
    this.hintSvg.setAttribute("focusable", "false");

    this.hintPath = document.createElementNS(SVG_NAMESPACE, "path");
    this.hintPath.setAttribute("id", pathId);
    this.hintPath.setAttribute("class", "circular-gallery__hint-path");

    const scrollText = document.createElementNS(SVG_NAMESPACE, "text");
    scrollText.setAttribute("class", "circular-gallery__hint-scroll");

    const textPath = document.createElementNS(SVG_NAMESPACE, "textPath");
    textPath.setAttribute("href", `#${pathId}`);
    textPath.setAttribute("startOffset", "50%");
    textPath.setAttribute("text-anchor", "middle");
    textPath.textContent = "← SCROLL AROUND →";
    scrollText.appendChild(textPath);

    this.hintEnter = document.createElement("span");
    this.hintEnter.className = "circular-gallery__hint-enter";
    this.hintEnter.textContent = "CLICK TO ENTER";

    this.hintSvg.append(this.hintPath, scrollText);
    this.hint.append(this.hintSvg, this.hintEnter);
    this.container.appendChild(this.hint);
    this.updateHintLayout();
  }

  setHintState(state) {
    if (this.hintState === state) return;
    this.hintState = state;
    if (this.hint) this.hint.dataset.hintState = state;
  }

  registerHintInteraction() {
    this.hasInteracted = true;
    this.isSnapping = false;
    this.settleStartedAt = null;
    this.previousTargetDistance = Number.POSITIVE_INFINITY;
    this.setHintState("hidden");
  }

  getHintMotionThresholds() {
    const worldPerPixel = this.viewport.width / Math.max(this.screen.width, 1);
    return {
      position: worldPerPixel * HINT_POSITION_EPSILON_PIXELS,
      velocity: worldPerPixel * HINT_VELOCITY_EPSILON_PIXELS_PER_MS,
    };
  }

  isTargetAtSnapPoint(positionThreshold) {
    const nearestSnapPoint = this.getNearestSnapPoint(this.scroll.target);
    return Math.abs(this.scroll.target - nearestSnapPoint) <= positionThreshold;
  }

  updateHintState(time) {
    const frameDuration =
      this.previousFrameTime === null
        ? 1000 / 60
        : Math.min(Math.max(time - this.previousFrameTime, 1), 100);
    const targetDistance = Math.abs(this.scroll.current - this.scroll.target);
    const frameVelocity = Math.abs(this.scroll.current - this.scroll.last) / frameDuration;
    const thresholds = this.getHintMotionThresholds();
    const targetIsSnapped = this.isTargetAtSnapPoint(thresholds.position);
    const isConverging =
      targetDistance <= this.previousTargetDistance + thresholds.position * 0.1;
    const isStable =
      !this.isDown &&
      targetIsSnapped &&
      isConverging &&
      targetDistance <= thresholds.position &&
      frameVelocity <= thresholds.velocity;

    this.previousFrameTime = time;
    this.previousTargetDistance = targetDistance;

    if (!this.hasInteracted) {
      this.settleStartedAt = null;
      return;
    }

    if (!isStable) {
      this.settleStartedAt = null;
      this.setHintState("hidden");
      return;
    }

    if (this.settleStartedAt === null) {
      this.settleStartedAt = time;
      return;
    }

    if (time - this.settleStartedAt >= HINT_SETTLE_DURATION) {
      this.setHintState("enter");
    }
  }

  updateHintLayout() {
    if (!this.hint || !this.hintSvg || !this.hintPath) return;

    const centerX = this.screen.width / 2;
    const activeY = this.screen.height / 2 + this.centerOffsetPixels;
    const halfViewportWidth = this.viewport.width / 2;
    const bendMagnitude = Math.max(Math.abs(this.bend), 0.0001);
    const radiusWorld =
      (halfViewportWidth * halfViewportWidth + bendMagnitude * bendMagnitude) /
      (2 * bendMagnitude);
    const radiusPixels = (radiusWorld / this.viewport.height) * this.screen.height;
    const curvesDown = this.bend > 0;
    const circleCenterY =
      Math.abs(this.bend) < 0.0001
        ? activeY
        : activeY + (curvesDown ? radiusPixels : -radiusPixels);

    this.onGeometryChange?.({
      bend: this.bend,
      circleCenterX: centerX,
      circleCenterY,
      ringRadiusPixels: radiusPixels,
      screenWidth: this.screen.width,
      screenHeight: this.screen.height,
    });
    const hintInset = Math.min(Math.max(radiusPixels * 0.07, 58), 82);

    this.hintSvg.setAttribute("viewBox", `0 0 ${this.screen.width} ${this.screen.height}`);
    this.hint.style.setProperty("--hint-anchor-x", `${centerX}px`);

    if (Math.abs(this.bend) < 0.0001) {
      const anchorY = activeY + hintInset;
      this.hint.style.setProperty("--hint-anchor-y", `${anchorY}px`);
      this.hintPath.setAttribute(
        "d",
        `M ${centerX - 112} ${anchorY} Q ${centerX} ${anchorY - 6} ${centerX + 112} ${anchorY}`,
      );
      return;
    }

    const hintRadius = curvesDown
      ? Math.max(radiusPixels - hintInset, 1)
      : radiusPixels + hintInset;
    const anchorY = circleCenterY + (curvesDown ? -hintRadius : hintRadius);
    const halfAngle = Math.min(Math.max(112 / hintRadius, 0.12), 0.42);
    const endpointXOffset = hintRadius * Math.sin(halfAngle);
    const endpointYOffset = hintRadius * Math.cos(halfAngle);
    const endpointY = circleCenterY + (curvesDown ? -endpointYOffset : endpointYOffset);
    const sweep = curvesDown ? 1 : 0;

    this.hint.style.setProperty("--hint-anchor-y", `${anchorY}px`);
    this.hintPath.setAttribute(
      "d",
      `M ${centerX - endpointXOffset} ${endpointY} A ${hintRadius} ${hintRadius} 0 0 ${sweep} ${centerX + endpointXOffset} ${endpointY}`,
    );
  }

  layoutMedias() {
    if (!this.medias?.length || this.screen.width === 0) return;

    const halfViewportWidth = this.viewport.width / 2;
    const bendMagnitude = Math.max(Math.abs(this.medias[0].bend), 0.0001);
    const radius =
      (halfViewportWidth * halfViewportWidth + bendMagnitude * bendMagnitude) /
      (2 * bendMagnitude);
    const worldPerPixel = this.viewport.width / this.screen.width;
    const measurements = this.medias.map((media) => media.measureMaximumTextWidth());
    const maximumFontSize = Math.max(...measurements.map(({ fontSize }) => fontSize));
    const minimumGapWorld =
      maximumFontSize * MINIMUM_GAP_FONT_RATIO * worldPerPixel;
    const minimumGapAngle = minimumGapWorld / radius;

    this.medias.forEach((media, index) => {
      const textArcLength = measurements[index].textWidth * worldPerPixel;
      media.maximumTextWidthWorld = textArcLength;
      media.textAngleSpan = textArcLength / radius;
      media.angleSpan = media.textAngleSpan + minimumGapAngle;
    });

    let centerArcPosition = 0;
    this.medias.forEach((media, index) => {
      if (index > 0) {
        const previous = this.medias[index - 1];
        const centerAngleDistance = previous.angleSpan / 2 + media.angleSpan / 2;
        centerArcPosition += centerAngleDistance * radius;
      }
      media.x = centerArcPosition;
    });

    const first = this.medias[0];
    const last = this.medias[this.medias.length - 1];
    const closingAngleDistance = last.angleSpan / 2 + first.angleSpan / 2;
    const widthTotal = last.x + closingAngleDistance * radius;
    const previousWidthTotal = first.widthTotal;

    this.medias.forEach((media) => {
      const loopOffset = previousWidthTotal
        ? Math.round(media.extra / previousWidthTotal)
        : 0;
      media.widthTotal = widthTotal;
      media.extra = loopOffset * widthTotal;
    });

    this.snapPoints = this.medias
      .slice(0, this.uniqueItemCount)
      .map((media) => media.x);
    this.snapCycleLength = this.medias[this.uniqueItemCount]?.x ?? widthTotal;
    const snapIntervals = this.snapPoints
      .map((point, index) => {
        const nextPoint =
          this.snapPoints[index + 1] ??
          this.snapCycleLength + this.snapPoints[0];
        return nextPoint - point;
      })
      .filter((interval) => interval > 0);
    this.snapConvergenceRange = snapIntervals.length
      ? Math.min(...snapIntervals) * SNAP_CONVERGENCE_RANGE_RATIO
      : 0;
  }

  remeasureWhenFontsReady() {
    document.fonts?.ready.then(() => {
      if (this.destroyed) return;
      this.layoutMedias();

      if (this.hasInteracted) {
        this.scroll.target = this.getNearestSnapPoint(this.scroll.target);
      } else {
        this.setInitialIndex(this.initialIndex);
      }
    });
  }

  setInitialIndex(index) {
    const isValidIndex =
      Number.isInteger(index) && index >= 0 && index < this.uniqueItemCount;
    const safeIndex = isValidIndex ? index : 0;
    const initialPosition = this.snapPoints?.[safeIndex] ?? 0;

    this.initialIndex = safeIndex;
    this.scroll.current = initialPosition;
    this.scroll.target = initialPosition;
    this.scroll.last = initialPosition;
    this.activeIndex = safeIndex;
  }

  updateActiveIndex() {
    if (!this.medias?.length || !this.uniqueItemCount) return;

    let closestMedia = this.medias[0];
    let closestDistance = Math.abs(closestMedia.positionX);

    for (let index = 1; index < this.medias.length; index += 1) {
      const media = this.medias[index];
      const distance = Math.abs(media.positionX);

      if (distance < closestDistance) {
        closestMedia = media;
        closestDistance = distance;
      }
    }

    const nextActiveIndex = closestMedia.index % this.uniqueItemCount;
    if (nextActiveIndex === this.activeIndex) return;

    this.activeIndex = nextActiveIndex;
    this.onActiveIndexChange?.(nextActiveIndex);
  }

  getNearestSnapPoint(value) {
    if (!this.snapPoints?.length || !this.snapCycleLength) return 0;

    const cycle = Math.floor(value / this.snapCycleLength);
    let nearest = this.snapPoints[0] + cycle * this.snapCycleLength;
    let nearestDistance = Math.abs(value - nearest);

    for (let cycleOffset = -1; cycleOffset <= 1; cycleOffset += 1) {
      const cycleStart = (cycle + cycleOffset) * this.snapCycleLength;
      this.snapPoints.forEach((point) => {
        const candidate = point + cycleStart;
        const distance = Math.abs(value - candidate);
        if (distance < nearestDistance) {
          nearest = candidate;
          nearestDistance = distance;
        }
      });
    }

    return nearest;
  }

  onTouchDown(e) {
    this.registerHintInteraction();
    this.isDown = true;
    this.pointerTravel = 0;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    this.pointerTravel = Math.max(this.pointerTravel, Math.abs(this.start - x));
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.registerHintInteraction();
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.16;
    this.onCheckDebounce();
  }

  onKeyDown(e) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        this.registerHintInteraction();
        this.scroll.target += this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.registerHintInteraction();
        this.scroll.target -= this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      case "Home":
        e.preventDefault();
        this.registerHintInteraction();
        this.scroll.target = 0;
        this.onCheckDebounce();
        break;
      default:
        break;
    }
  }

  onCheck() {
    this.isSnapping = true;
    this.settleStartedAt = null;
    this.previousTargetDistance = Number.POSITIVE_INFINITY;
    this.scroll.target = this.getNearestSnapPoint(this.scroll.target);
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.centerOffsetPixels = this.screen.height * this.centerOffsetRatio;
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    if (!this.labels) {
      this.labels = document.createElement("div");
      this.labels.className = "circular-gallery__labels";
      this.labels.setAttribute("role", "navigation");
      this.labels.setAttribute("aria-label", "World navigation");
      this.container.appendChild(this.labels);
    }

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({
          screen: this.screen,
          viewport: this.viewport,
          centerOffsetPixels: this.centerOffsetPixels,
        }),
      );
      this.layoutMedias();
    }

    this.glassRingTrack?.onResize({
      screen: this.screen,
      viewport: this.viewport,
      centerOffsetPixels: this.centerOffsetPixels,
    });
    this.updateHintLayout();
  }

  update(time = performance.now()) {
    const isInFinalConvergence =
      this.isSnapping &&
      Math.abs(this.scroll.target - this.scroll.current) <=
        this.snapConvergenceRange;
    const convergenceEase = isInFinalConvergence
      ? Math.min(this.scroll.ease * SNAP_CONVERGENCE_MULTIPLIER, 1)
      : this.scroll.ease;
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      convergenceEase,
    );
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
      this.updateActiveIndex();
    }

    this.glassRingTrack?.update({ scroll: this.scroll.current, time });
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.updateHintState(time);
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("mousewheel", this.boundOnWheel);
    window.addEventListener("wheel", this.boundOnWheel);
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
    this.container.addEventListener("keydown", this.boundOnKeyDown);
  }

  destroy() {
    this.destroyed = true;
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousewheel", this.boundOnWheel);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    this.container.removeEventListener("keydown", this.boundOnKeyDown);
    this.glassRingTrack?.destroy();
    this.medias?.forEach((media) => media.destroy());
    this.hint?.remove();
    this.labels?.remove();

    if (this.gl?.canvas.parentNode) {
      this.gl.canvas.parentNode.removeChild(this.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  initialIndex = 0,
  bend = 3,
  textColor = "#ffffff",
  font = "600 64px sans-serif",
  scrollSpeed = 2,
  scrollEase = 0.05,
  centerOffsetRatio = 0,
  onActiveIndexChange,
  onGeometryChange,
}) {
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new App(containerRef.current, {
      items,
      initialIndex,
      bend,
      textColor,
      font,
      scrollSpeed,
      scrollEase,
      centerOffsetRatio,
      onNavigate: (href) => router.push(href),
      onActiveIndexChange,
      onGeometryChange,
    });

    return () => app.destroy();
  }, [
    items,
    initialIndex,
    bend,
    textColor,
    font,
    scrollSpeed,
    scrollEase,
    centerOffsetRatio,
    router,
    onActiveIndexChange,
    onGeometryChange,
  ]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular navigation. Use the mouse wheel or left and right arrow keys to rotate."
    />
  );
}
