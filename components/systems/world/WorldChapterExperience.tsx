import { RoomKeyDome } from "@/components/room-keys/RoomKeyDome";
import { getLocalizedRoomKeys } from "@/data/room-key-translations";
import type { Locale } from "@/lib/i18n/config";
import type { WorldChapter } from "@/types/world";

export function WorldChapterExperience({
  experience,
  locale,
}: {
  experience: WorldChapter["experience"];
  locale: Locale;
}) {
  if (experience === "room-key-dome") {
    return <RoomKeyDome items={getLocalizedRoomKeys(locale)} />;
  }

  return null;
}
