# Room Key Collection

Room Key records live in `data/roomKeys.ts`; the Dome contains no hardcoded
archive entries.

## Add A Room Key

1. Put the image in `public/images/room-keys/`.
2. Add one `defineRoomKey()` record to `data/roomKeys.ts`.
3. Use its generated detail URL under `/collect/room-keys/<id>`.

Standard keys inherit the physical `85.6 x 54` proportion. Override `width`,
`height`, `borderRadius`, and `shape` for portrait cards or circles. Transparent
PNG and SVG assets use `objectFit: "contain"` by default and receive no backing
panel. An irregular silhouette can also provide a local `maskImage`; both
standard and WebKit CSS masks are applied.

Dimensions only affect the object inside a logical Dome slot. They never change
the sphere distribution, so adding a differently shaped key requires no
positioning changes.

All current records are neutral placeholders. No hotel, location, or personal
history is implied until verified archive content is supplied.
