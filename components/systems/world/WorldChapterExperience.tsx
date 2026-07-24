import { RoomKeyDome } from "@/components/room-keys/RoomKeyDome";
import { roomKeys } from "@/data/roomKeys";
import type { WorldChapter } from "@/types/world";

export function WorldChapterExperience({
  experience,
}: {
  experience: WorldChapter["experience"];
}) {
  if (experience === "room-key-dome") {
    return <RoomKeyDome items={roomKeys} />;
  }

  return null;
}
