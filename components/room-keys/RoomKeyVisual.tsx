import Image from "next/image";
import type { CSSProperties } from "react";
import type { RoomKey } from "@/types/room-key";
import { cn } from "@/lib/utils/cn";
import styles from "./RoomKeyDome.module.css";

type RoomKeyVisualProps = {
  roomKey: RoomKey;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

function toBorderRadius(value: RoomKey["borderRadius"]) {
  return typeof value === "number" ? `${value}px` : value;
}

export function RoomKeyVisual({
  roomKey,
  className,
  priority = false,
  sizes = "(max-width: 48rem) 31vw, 12rem",
}: RoomKeyVisualProps) {
  const mask = roomKey.maskImage
    ? `url("${roomKey.maskImage}")`
    : undefined;
  const visualStyle: CSSProperties = {
    borderRadius: toBorderRadius(roomKey.borderRadius),
    maskImage: mask,
    WebkitMaskImage: mask,
  };
  const intrinsicScale = 10;
  const sequence = roomKey.id.replace("room-key-", "");

  return (
    <span
      className={cn(styles.visual, roomKey.className, className)}
      data-room-key-shape={roomKey.shape}
      data-transparent-background={String(roomKey.transparentBackground)}
      style={visualStyle}
    >
      <Image
        src={roomKey.image}
        alt={roomKey.alt}
        width={Math.max(1, Math.round(roomKey.width * intrinsicScale))}
        height={Math.max(1, Math.round(roomKey.height * intrinsicScale))}
        sizes={sizes}
        priority={priority}
        draggable={false}
        unoptimized={roomKey.image.endsWith(".svg")}
        className={styles.visualImage}
        style={{ objectFit: roomKey.objectFit }}
      />
      {roomKey.placeholder ? (
        <span aria-hidden="true" className={styles.placeholderIndex}>
          {sequence}
        </span>
      ) : null}
    </span>
  );
}
