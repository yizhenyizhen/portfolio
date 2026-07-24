import type { CSSProperties } from "react";

export type RoomKeyShape =
  | "rectangle"
  | "rounded"
  | "circle"
  | "irregular";

export type RoomKey = {
  id: string;
  title: string;
  image: string;
  alt: string;
  href: string;
  width: number;
  height: number;
  borderRadius: number | string;
  objectFit: NonNullable<CSSProperties["objectFit"]>;
  transparentBackground: boolean;
  shape: RoomKeyShape;
  maskImage: string | null;
  className?: string;
  placeholder: boolean;
  hotel?: string;
  city?: string;
  country?: string;
  year?: number;
};

export type RoomKeyInput = Pick<
  RoomKey,
  "id" | "title" | "image" | "alt" | "href"
> &
  Partial<
    Pick<
      RoomKey,
      | "width"
      | "height"
      | "borderRadius"
      | "objectFit"
      | "transparentBackground"
      | "shape"
      | "maskImage"
      | "className"
      | "placeholder"
      | "hotel"
      | "city"
      | "country"
      | "year"
    >
  >;
