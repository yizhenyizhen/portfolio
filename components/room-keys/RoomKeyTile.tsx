import Link from "next/link";
import type { CSSProperties } from "react";
import type { RoomKey } from "@/types/room-key";
import type { Locale } from "@/lib/i18n/config";
import { getMessages, formatMessage } from "@/lib/i18n/messages";
import { localizeHref } from "@/lib/i18n/routing";
import { RoomKeyVisual } from "./RoomKeyVisual";
import styles from "./RoomKeyDome.module.css";

type RoomKeyTileProps = {
  roomKey: RoomKey;
  longitude: number;
  latitude: number;
  priority?: boolean;
  locale: Locale;
};

type TileStyle = CSSProperties & {
  "--room-key-longitude": string;
  "--room-key-latitude": string;
  "--room-key-width": string;
  "--room-key-height": string;
};

export function RoomKeyTile({
  roomKey,
  longitude,
  latitude,
  priority = false,
  locale,
}: RoomKeyTileProps) {
  const messages = getMessages(locale);
  const largestDimension = Math.max(roomKey.width, roomKey.height);
  const style: TileStyle = {
    "--room-key-longitude": `${longitude}deg`,
    "--room-key-latitude": `${latitude}deg`,
    "--room-key-width": `${(roomKey.width / largestDimension) * 100}%`,
    "--room-key-height": `${(roomKey.height / largestDimension) * 100}%`,
  };

  return (
    <div
      role="listitem"
      className={styles.slot}
      data-room-key-slot
      data-longitude={longitude}
      data-latitude={latitude}
      style={style}
    >
      <Link
        href={localizeHref(roomKey.href, locale)}
        aria-label={formatMessage(messages.roomKeys.viewLabel, {
          title: roomKey.title,
        })}
        className={styles.tileLink}
        data-room-key-link={roomKey.id}
        data-room-key-width={roomKey.width}
        data-room-key-height={roomKey.height}
      >
        <RoomKeyVisual roomKey={roomKey} priority={priority} />
      </Link>
    </div>
  );
}
