"use client";

import { useDrag } from "@use-gesture/react";
import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { RoomKey } from "@/types/room-key";
import { RoomKeyTile } from "./RoomKeyTile";
import styles from "./RoomKeyDome.module.css";

type RoomKeyDomeProps = {
  items: readonly RoomKey[];
};

type Rotation = {
  x: number;
  y: number;
};

type DomeSlot = {
  item: RoomKey;
  latitude: number;
  longitude: number;
};

type DomeRootStyle = CSSProperties & {
  "--dome-radius": string;
  "--room-key-slot": string;
};

const MAX_VERTICAL_ROTATION = 30;
const DRAG_SENSITIVITY = 20;
const INERTIA_FRICTION = 0.945;
const INERTIA_THRESHOLD = 0.012;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getRowCount(itemCount: number) {
  if (itemCount <= 8) return 1;
  if (itemCount <= 20) return 2;
  if (itemCount <= 36) return 3;
  return 4;
}

function getLatitudes(rowCount: number) {
  if (rowCount === 1) return [0];

  const latitudeLimit = rowCount === 2 ? 16 : rowCount === 3 ? 26 : 33;
  return Array.from(
    { length: rowCount },
    (_, index) =>
      -latitudeLimit + (index * latitudeLimit * 2) / (rowCount - 1),
  );
}

function allocateRowCounts(itemCount: number, latitudes: readonly number[]) {
  const weights = latitudes.map((latitude) =>
    Math.cos((latitude * Math.PI) / 180),
  );
  const weightTotal = weights.reduce((total, weight) => total + weight, 0);
  const exactCounts = weights.map(
    (weight) => (itemCount * weight) / weightTotal,
  );
  const counts = exactCounts.map((count) => Math.floor(count));
  let remainder = itemCount - counts.reduce((total, count) => total + count, 0);
  const distributionOrder = exactCounts
    .map((count, index) => ({ index, fraction: count - Math.floor(count) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let index = 0; remainder > 0; index += 1) {
    counts[distributionOrder[index % distributionOrder.length].index] += 1;
    remainder -= 1;
  }

  return counts;
}

function distributeItems(items: readonly RoomKey[]): DomeSlot[] {
  if (items.length === 0) return [];

  const latitudes = getLatitudes(getRowCount(items.length));
  const rowCounts = allocateRowCounts(items.length, latitudes);
  const slots: DomeSlot[] = [];
  let itemIndex = 0;

  rowCounts.forEach((rowCount, rowIndex) => {
    const step = 360 / rowCount;
    const offset = rowIndex % 2 === 0 ? 0 : step / 2;

    for (let columnIndex = 0; columnIndex < rowCount; columnIndex += 1) {
      slots.push({
        item: items[itemIndex],
        latitude: latitudes[rowIndex],
        longitude: columnIndex * step + offset,
      });
      itemIndex += 1;
    }
  });

  return slots;
}

function isInitialFrontSlot(longitude: number) {
  const normalizedLongitude = ((longitude + 180) % 360) - 180;
  return Math.abs(normalizedLongitude) <= 20;
}

export function RoomKeyDome({ items }: RoomKeyDomeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<Rotation>({ x: -4, y: 0 });
  const dragOriginRef = useRef<Rotation>({ x: -4, y: 0 });
  const inertiaFrameRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const slots = useMemo(() => distributeItems(items), [items]);
  const rootStyle: DomeRootStyle = {
    "--dome-radius": "31rem",
    "--room-key-slot": "9.5rem",
  };

  const stopInertia = useCallback(() => {
    if (inertiaFrameRef.current !== null) {
      window.cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
  }, []);

  const applyTransform = useCallback((rotation: Rotation) => {
    rotationRef.current = rotation;

    if (sphereRef.current) {
      sphereRef.current.style.transform = `translateZ(calc(var(--dome-radius) * -1)) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    }

    rootRef.current
      ?.querySelectorAll<HTMLElement>("[data-room-key-slot]")
      .forEach((slot) => {
        const longitude = Number(slot.dataset.longitude ?? 0);
        const latitude = Number(slot.dataset.latitude ?? 0);
        const horizontalAngle = ((longitude + rotation.y) * Math.PI) / 180;
        const verticalAngle = ((latitude + rotation.x) * Math.PI) / 180;
        const isFrontFacing =
          Math.cos(horizontalAngle) * Math.cos(verticalAngle) > 0.06;
        const link = slot.querySelector<HTMLAnchorElement>(
          "[data-room-key-link]",
        );

        if (link && link.dataset.frontFacing !== String(isFrontFacing)) {
          link.dataset.frontFacing = String(isFrontFacing);
          link.tabIndex = isFrontFacing ? 0 : -1;
          link.setAttribute("aria-hidden", String(!isFrontFacing));
          link.style.pointerEvents = isFrontFacing ? "auto" : "none";
        }
      });
  }, []);

  const startInertia = useCallback(
    (velocityX: number, velocityY: number) => {
      stopInertia();

      if (reducedMotionRef.current) return;

      let horizontalVelocity = velocityX;
      let verticalVelocity = velocityY;
      let frameCount = 0;

      const animate = () => {
        const current = rotationRef.current;
        const next = {
          x: clamp(
            current.x + verticalVelocity,
            -MAX_VERTICAL_ROTATION,
            MAX_VERTICAL_ROTATION,
          ),
          y: current.y + horizontalVelocity,
        };

        if (
          next.x === -MAX_VERTICAL_ROTATION ||
          next.x === MAX_VERTICAL_ROTATION
        ) {
          verticalVelocity = 0;
        }

        applyTransform(next);
        horizontalVelocity *= INERTIA_FRICTION;
        verticalVelocity *= INERTIA_FRICTION;
        frameCount += 1;

        if (
          frameCount < 180 &&
          (Math.abs(horizontalVelocity) > INERTIA_THRESHOLD ||
            Math.abs(verticalVelocity) > INERTIA_THRESHOLD)
        ) {
          inertiaFrameRef.current = window.requestAnimationFrame(animate);
        } else {
          inertiaFrameRef.current = null;
        }
      };

      inertiaFrameRef.current = window.requestAnimationFrame(animate);
    },
    [applyTransform, stopInertia],
  );

  const bind = useDrag(
    ({
      first,
      last,
      movement: [movementX, movementY],
      velocity: [velocityX, velocityY],
      direction: [directionX, directionY],
      intentional,
    }) => {
      if (first) {
        stopInertia();
        dragOriginRef.current = { ...rotationRef.current };
      }

      if (intentional) {
        applyTransform({
          x: clamp(
            dragOriginRef.current.x - movementY / DRAG_SENSITIVITY,
            -MAX_VERTICAL_ROTATION,
            MAX_VERTICAL_ROTATION,
          ),
          y: dragOriginRef.current.y + movementX / DRAG_SENSITIVITY,
        });
      }

      if (last && intentional) {
        const travelledDistance = Math.hypot(movementX, movementY);

        if (travelledDistance >= 8) {
          suppressClickUntilRef.current = performance.now() + 280;
          const horizontalVelocity =
            (directionX * Math.min(velocityX, 1.4) * 16) / DRAG_SENSITIVITY;
          const verticalVelocity =
            (-directionY * Math.min(velocityY, 1.4) * 16) /
            DRAG_SENSITIVITY;
          startInertia(horizontalVelocity, verticalVelocity);
        }
      }
    },
    {
      threshold: 4,
      pointer: { capture: true },
      eventOptions: { passive: false },
    },
  );

  useEffect(() => {
    applyTransform(rotationRef.current);
  }, [applyTransform, slots]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotionRef.current = query.matches;
      if (query.matches) stopInertia();
    };

    updatePreference();
    query.addEventListener("change", updatePreference);

    return () => query.removeEventListener("change", updatePreference);
  }, [stopInertia]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateGeometry = (width: number, height: number) => {
      const minimumDimension = Math.min(width, height);
      const compact = width < 640;
      const medium = width < 1024;
      const radius = compact
        ? clamp(minimumDimension * 0.78, 220, 300)
        : medium
          ? clamp(minimumDimension * 0.76, 300, 440)
          : clamp(minimumDimension * 0.8, 390, 590);
      const slotSize = compact
        ? clamp(radius * 0.37, 84, 108)
        : medium
          ? clamp(radius * 0.33, 104, 138)
          : clamp(radius * 0.3, 132, 170);

      root.style.setProperty("--dome-radius", `${radius}px`);
      root.style.setProperty("--room-key-slot", `${slotSize}px`);
    };

    const observer = new ResizeObserver(([entry]) => {
      updateGeometry(entry.contentRect.width, entry.contentRect.height);
    });

    observer.observe(root);
    updateGeometry(root.clientWidth, root.clientHeight);

    return () => observer.disconnect();
  }, []);

  useEffect(() => () => stopInertia(), [stopInertia]);

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (performance.now() < suppressClickUntilRef.current) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyMovement: Record<string, Rotation> = {
      ArrowLeft: { x: 0, y: -15 },
      ArrowRight: { x: 0, y: 15 },
      ArrowUp: { x: 10, y: 0 },
      ArrowDown: { x: -10, y: 0 },
    };
    const movement = keyMovement[event.key];

    if (event.key === "Home") {
      event.preventDefault();
      stopInertia();
      applyTransform({ x: -4, y: 0 });
      return;
    }

    if (!movement) return;

    event.preventDefault();
    stopInertia();
    applyTransform({
      x: clamp(
        rotationRef.current.x + movement.x,
        -MAX_VERTICAL_ROTATION,
        MAX_VERTICAL_ROTATION,
      ),
      y: rotationRef.current.y + movement.y,
    });
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-room-key-dome
      style={rootStyle}
    >
      <p id="room-key-dome-instructions" className={styles.srOnly}>
        Drag to rotate the archive. Use the arrow keys to rotate when the
        archive is focused. Press Home to return to the starting position.
      </p>
      <div
        {...bind()}
        className={styles.surface}
        tabIndex={0}
        aria-label="Interactive room key archive"
        aria-describedby="room-key-dome-instructions"
        onClickCapture={handleClickCapture}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.stage}>
          <div
            ref={sphereRef}
            role="list"
            aria-label={`${items.length} room key records`}
            className={styles.sphere}
            data-room-key-sphere
          >
            {slots.map(({ item, latitude, longitude }) => (
              <RoomKeyTile
                key={item.id}
                roomKey={item}
                latitude={latitude}
                longitude={longitude}
                priority={isInitialFrontSlot(longitude)}
              />
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={styles.vignette} />
      <div aria-hidden="true" className={styles.readout}>
        <span>Drag to rotate</span>
        <span>{String(items.length).padStart(2, "0")} records</span>
      </div>
    </div>
  );
}
