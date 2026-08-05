import { roomKeys } from "@/data/roomKeys";
import type { Locale } from "@/lib/i18n/config";

export function getLocalizedRoomKeys(locale: Locale) {
  if (locale === "en") return roomKeys;

  return roomKeys.map((roomKey) => {
    const sequence = roomKey.id.replace("room-key-", "");

    return {
      ...roomKey,
      title: `房卡 ${sequence}`,
      alt: `房卡档案记录 ${sequence} 的中性占位图`,
    };
  });
}

export function getLocalizedRoomKey(id: string, locale: Locale) {
  return getLocalizedRoomKeys(locale).find((roomKey) => roomKey.id === id);
}
