import type { RoomKey, RoomKeyInput } from "@/types/room-key";

export const STANDARD_ROOM_KEY_WIDTH = 85.6;
export const STANDARD_ROOM_KEY_HEIGHT = 54;
export const STANDARD_ROOM_KEY_ASPECT_RATIO =
  STANDARD_ROOM_KEY_WIDTH / STANDARD_ROOM_KEY_HEIGHT;

export const STANDARD_ROOM_KEY_DEFAULTS = {
  width: STANDARD_ROOM_KEY_WIDTH,
  height: STANDARD_ROOM_KEY_HEIGHT,
  borderRadius: 6,
  objectFit: "contain",
  transparentBackground: false,
  shape: "rounded",
  maskImage: null,
  placeholder: true,
} as const satisfies Omit<
  RoomKey,
  | "id"
  | "title"
  | "image"
  | "alt"
  | "href"
  | "className"
  | "hotel"
  | "city"
  | "country"
  | "year"
>;

export function defineRoomKey(input: RoomKeyInput): RoomKey {
  return {
    ...STANDARD_ROOM_KEY_DEFAULTS,
    ...input,
  };
}

const formatSequence = (index: number) => String(index).padStart(3, "0");

function createPlaceholderRoomKey(
  index: number,
  overrides: Partial<RoomKeyInput> = {},
): RoomKey {
  const sequence = formatSequence(index);

  return defineRoomKey({
    id: `room-key-${sequence}`,
    title: `Room Key ${sequence}`,
    image: "/images/room-keys/placeholder-card.svg",
    alt: `Neutral placeholder for room key archive record ${sequence}`,
    href: `/collect/room-keys/room-key-${sequence}`,
    ...overrides,
  });
}

export const roomKeys = Array.from({ length: 12 }, (_, index) => {
  const itemNumber = index + 1;

  if (itemNumber === 4) {
    return createPlaceholderRoomKey(itemNumber, {
      image: "/images/room-keys/placeholder-portrait.svg",
      width: 54,
      height: 85.6,
      borderRadius: 3,
      shape: "rectangle",
    });
  }

  if (itemNumber === 8) {
    return createPlaceholderRoomKey(itemNumber, {
      image: "/images/room-keys/placeholder-circle.svg",
      width: 64,
      height: 64,
      borderRadius: "50%",
      shape: "circle",
    });
  }

  if (itemNumber === 12) {
    return createPlaceholderRoomKey(itemNumber, {
      image: "/images/room-keys/placeholder-irregular.svg",
      width: 68,
      height: 82,
      borderRadius: 0,
      objectFit: "scale-down",
      transparentBackground: true,
      shape: "irregular",
      maskImage: "/images/room-keys/masks/irregular-tag.svg",
    });
  }

  return createPlaceholderRoomKey(itemNumber);
}) satisfies readonly RoomKey[];

export function getRoomKey(id: string) {
  return roomKeys.find((roomKey) => roomKey.id === id);
}
