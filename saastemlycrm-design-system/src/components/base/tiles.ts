/**
 * The tile: the one unit everything on screen is laid out in. A tile is 53 × 56px at the default
 * text size (3.3125rem × 3.5rem, so it grows with the text), gap included: the grid is gapless, and
 * whatever sits in tiles insets its own surface inside them (`TILE_INSET`).
 *
 * - **The screen is a whole, even number of tiles across** (`columnsFor`): 6 at the smallest screen
 *   (320px: 6 × 53 = 318, a 1px margin a side), and two more each time two more fit, one a side, so
 *   the grid never re-centres by half a tile. What's left is split into two equal margins. With the
 *   text enlarged past what six tiles fit, the six share the screen (`tileWIn`).
 * - **The frame is tiles** (src/components/base/frame-fit.ts): the header is 1 tile high, a closed
 *   column (its rail) 1 tile wide, an open column (the navigation, the side panel, their sheets) 4,
 *   a content sheet 8; the main panel takes the tiles left between them.
 * - **Widgets are tiles** (src/components/base/board.ts): a widget's width and height are whole
 *   tiles, with a target, a minimum and a maximum, never pixels.
 *
 * tests/tiles.test.ts proves the column rule for every window width from 320 to 3840px at text sizes
 * 1×, 1.25× and 1.5×.
 */

/** A tile's width and height, rem (53 × 56px at 16px). */
export const TILE_W_REM = 3.3125;
export const TILE_H_REM = 3.5;
/** The fewest tiles across: the smallest screen (320px) holds 6. */
export const MIN_COLUMNS = 6;
/** Tiles are added two at a time (one a side), so the grid stays centred on the same axis. */
export const COLUMN_STEP = 2;
/** How far a surface sits inside its tiles, px a side: two neighbours' surfaces are 8px apart. */
export const TILE_INSET = 4;
/**
 * The most tiles across a page's content takes (1272px at the default text size): on a wider main
 * panel the rest goes to the page's side padding (`<ui-container padding-x="slack">`), so a board has
 * from 5 to 24 tiles across, whatever the screen.
 */
export const PAGE_MAX_TILES = 24;

/** A tile's width and height in px at a text size (`scale`, 1 = 16px). */
export const tileW = (scale = 1) => TILE_W_REM * 16 * scale;
export const tileH = (scale = 1) => TILE_H_REM * 16 * scale;

/** How many tiles across a window `width` px wide holds: 6, then 2 more each time 2 more fit. */
export function columnsFor(width: number, scale = 1): number {
  const fit = Math.floor(width / tileW(scale) + 1e-9);
  return Math.max(MIN_COLUMNS, MIN_COLUMNS + COLUMN_STEP * Math.floor((fit - MIN_COLUMNS) / COLUMN_STEP));
}

/**
 * A tile's width in a window `width` px wide: its own, unless six of them don't fit (a 320px screen
 * with the text enlarged), when the six share the width.
 */
export const tileWIn = (width: number, scale = 1) => Math.min(tileW(scale), width / MIN_COLUMNS);

/** The margin each side of the tiles, px (never negative). */
export const marginFor = (width: number, scale = 1) => (width - columnsFor(width, scale) * tileWIn(width, scale)) / 2;
