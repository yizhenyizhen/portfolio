# Yizhen Zhou

This project is a long-term Next.js product foundation for a personal digital identity, not a template portfolio. The architecture follows the documents in [`docs/core`](/Users/zhouyizhen/Developer/portfolio/docs/core), [`docs/design`](/Users/zhouyizhen/Developer/portfolio/docs/design), and [`docs/specs`](/Users/zhouyizhen/Developer/portfolio/docs/specs) as the highest priority.

## Philosophy

The product is organized around five permanent worlds:

- `create`
- `collect`
- `discover`
- `build`
- `meet`

Growth should add depth inside those worlds rather than add new top-level navigation.

## Repo Structure

- `app/`: Next.js routing, layouts, metadata, and thin page composition
- `components/`: reusable systems and visual primitives
- `data/`: typed product registries and world content declarations
- `hooks/`: reusable interaction and environment boundaries
- `lib/`: pure domain logic, routing helpers, token helpers, and config access
- `types/`: shared TypeScript contracts
- `public/`: static assets by role

## Current Implementation Boundary

This stage establishes architecture only.

- The homepage UI is intentionally not implemented yet.
- Ring Navigation behavior is intentionally not implemented yet.
- Motion effects and cinematic transitions are intentionally not implemented yet.
- World routes are generic shells driven by typed local data.

## Content Model

The route system reads from `data/site/worlds.ts`, which registers the five permanent worlds. Each world owns its own starter content under `data/worlds/<world>/`.

To add future chapters such as Running or Horizon:

1. Add typed content to the correct world folder.
2. Add assets under `public/` if needed.
3. Add a new content module renderer only if the chapter needs a new presentation pattern.

Top-level navigation and route composition should not need to change.
