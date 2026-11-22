/**
 * The board: a screen's widgets as tiles on a grid of cells, after Android's app widgets
 * (developer.android.com/develop/ui/views/appwidgets/layouts): a widget declares its size in cells,
 * width and height, and the host places it by those cells, never by its content. So the box a tile
 * waits in while its data loads is the box it shows its data in: nothing moves when data arrives.
 * `<ui-board>` (primitives/layout/board.ts) draws it; tests/board.test.ts proves the properties
 * below for every case in a finite domain.
 *
 * - **Tiles across** come from the board's own width (`lanesFor`): the main panel is a whole number
 *   of the screen's tiles (src/components/base/tiles.ts), so the board is too. Each column is one
 *   tile; the grid is gapless and every surface sits `TILE_INSET` (4px) inside its tiles.
 * - **Widths** are tiles: `s` 6 (about Material 3's 360dp fixed pane), `m` 12, `l` 18, `full` all,
 *   or an exact number of tiles (`span`). A widget never takes more tiles than the board has
 *   (`spanOf`), so it can't make a column that doesn't exist: on a phone's 5 tiles every widget is 5.
 * - **Heights** are tiles too (56px each): a widget of `rows` tiles is rows × 56px, whatever it holds
 *   (`rowsHeight`). Every widget declares its rows (Android's `targetCellHeight`), or takes its kind's
 *   (`defaultRows`).
 * - **Placement** (`place`): widgets fill rows ("bands") across, in order; a band's last widget takes
 *   the rest of it and every widget in a band is as tall as the tallest one there, so no tile is ever
 *   left empty between widgets. Only widths, heights and order go in, never what a widget holds: its
 *   place and size are the same before and after its data arrives, and a later widget never moves an
 *   earlier one to another band or tile (it may only make its band taller).
 */

import { TILE_H_REM, tileH, tileW } from "./tiles.ts";

/** The board is gapless: tiles touch, and each surface sits `TILE_INSET` inside its tiles. */
export const GAP = 0;
/** A row's height, rem: one tile (src/components/base/tiles.ts). */
export const CELL = TILE_H_REM;
/** The fewest and most rows (tiles down) a widget takes. */
export const MIN_ROWS = 1;
export const MAX_ROWS = 200;

/**
 * How many whole tiles across a board `width` px wide holds, at a text size (`scale`, 1 = 16px): the
 * main panel's content box is a whole number of the screen's tiles, so this is that number; never
 * fewer than one. Each column is exactly one tile (`board.lanes`).
 */
export function lanesFor(width: number, scale = 1): number {
  // The browser snaps a tile to its layout unit (52.9875px for 53), so a board of n tiles can measure
  // a few hundredths of a tile short of n: a twentieth of a tile is far below anything else.
  return Math.max(1, Math.floor(width / tileW(scale) + 0.05));
}

export type TileSize = "s" | "m" | "l" | "full";
export const TILE_SIZES: readonly TileSize[] = ["s", "m", "l", "full"];
/** The sizes in tiles across: `s` 6 (about M3's 360dp fixed pane), `m` 12, `l` 18, `full` all. */
export const SIZE_TILES: Record<Exclude<TileSize, "full">, number> = { s: 6, m: 12, l: 18 };

/** How many tiles across a widget of this size takes on a board `lanes` tiles wide. */
export const spanOf = (size: TileSize, lanes: number) => (size === "full" ? lanes : Math.min(SIZE_TILES[size], lanes));

/** A widget `rows` tiles high, in px, at a text size (`scale`, 1 = 16px). */
export const rowsHeight = (rows: number, scale = 1) => rows * tileH(scale);

/** The fewest tiles down that hold `px` of content at a text size: what "Show all" opens a tile to. */
export const rowsFor = (px: number, scale = 1) =>
  Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.ceil(px / tileH(scale) - 1e-9)));

/** What a widget is drawn as while it loads (its `skeleton`), and so what height it usually needs. */
export type TileKind = "stats" | "text" | "card" | "table" | "list" | "chart" | "entries";

/**
 * A widget's height in tiles when it doesn't say: from what it holds (its kind), else its size. A
 * few lines are 2 tiles (112px), figures 3 (168), lists, charts and cards 8 (448), tables and
 * entries 10 (560).
 */
export function defaultRows(kind: TileKind | undefined, size: TileSize): number {
  switch (kind) {
    case "text":
      return 2;
    case "stats":
      return 3;
    case "list":
    case "chart":
    case "card":
      return 8;
    case "table":
    case "entries":
      return 10;
    default:
      return size === "s" || size === "m" ? 8 : 10;
  }
}

/**
 * A widget's size bounds (Android's `minResizeWidth` / `maxResizeWidth`, `minResizeHeight` /
 * `maxResizeHeight`): what someone may resize it to on their board. Left out, any width, and from
 * about half to twice its rows.
 */
export interface TileBounds {
  size: TileSize;
  rows: number;
  minSize: TileSize;
  maxSize: TileSize;
  minRows: number;
  maxRows: number;
  /** The fewest and most tiles across (a widget's `minWidth` / `maxWidth`, else its sizes' tiles; `full`: the board's). */
  minSpan?: number;
  maxSpan?: number;
}
export function boundsOf(w: {
  size: TileSize;
  rows: number;
  minSize?: TileSize;
  maxSize?: TileSize;
  minRows?: number;
  maxRows?: number;
  minWidth?: number;
  maxWidth?: number;
  /** Its own width in tiles, when exact rather than its size's (a figure 4 tiles wide). */
  width?: number;
}): TileBounds {
  const order = TILE_SIZES;
  const minSize = w.minSize ?? "s";
  const maxSize = w.maxSize ?? "full";
  // Its own size is always inside its bounds, whatever they default to or say: a tile resized by
  // hand can always go back to the size it was made at (a figure 4 tiles wide isn't held to the
  // 6 tiles of its size, `s`, once widened; a 2-row header isn't held to 3 rows).
  const rows = clampRows(w.rows);
  const minRows = Math.min(rows, clampRows(w.minRows ?? Math.max(MIN_ROWS + 2, Math.round(w.rows / 2))));
  const maxRows = Math.max(rows, clampRows(Math.max(minRows, w.maxRows ?? w.rows * 2)));
  const size =
    order.indexOf(w.size) < order.indexOf(minSize)
      ? minSize
      : order.indexOf(w.size) > order.indexOf(maxSize)
        ? maxSize
        : w.size;
  const span = w.width ?? (size === "full" ? undefined : SIZE_TILES[size]);
  const least = w.minWidth ?? (minSize === "full" ? undefined : SIZE_TILES[minSize]);
  const most = w.maxWidth ?? (maxSize === "full" ? undefined : SIZE_TILES[maxSize]);
  return {
    size,
    rows,
    minSize,
    maxSize,
    minRows,
    maxRows,
    minSpan: least === undefined || span === undefined ? least : Math.min(least, span),
    maxSpan: most === undefined || span === undefined ? most : Math.max(most, span),
  };
}

/**
 * A tile resized by hand (its corner dragged): the tiles across and rows it asks for, kept inside
 * its bounds and the board's lanes. Never under one tile either way.
 */
export function resizeTo(b: TileBounds, lanes: number, span: number, rows: number): { span: number; rows: number } {
  const most = Math.min(lanes, b.maxSpan ?? lanes);
  const least = Math.min(most, Math.max(1, b.minSpan ?? 1));
  return {
    span: Math.min(most, Math.max(least, Math.round(span))),
    rows: Math.min(b.maxRows, Math.max(b.minRows, Math.round(rows))),
  };
}

/**
 * A tile moved by hand (its grab bar dragged) onto another: the order with `key` just before
 * `over` (`after`: just after it). The same order when either isn't in it, or they're the same.
 */
/**
 * The order a board keeps its tiles in the document: the order it had (`was`), less the tiles that
 * are gone, then the new ones in the order they come (`now`). Rearranging tiles never changes it,
 * so no existing tile's element is ever moved in the document. A moved element counts as a new one
 * (its entrance, `@starting-style`, plays again: a tile fades out and back in) and loses what it was
 * doing (a slide, focus, a scroll); where a tile shows comes from its placement alone, and a change
 * of place slides.
 */
export function keepOrder(was: readonly string[], now: readonly string[]): string[] {
  const here = new Set(now);
  const kept = was.filter((k) => here.has(k));
  const seen = new Set(kept);
  return [...kept, ...now.filter((k) => !seen.has(k))];
}

export function moveTo(order: readonly string[], key: string, over: string, after: boolean): string[] {
  if (key === over || !order.includes(key) || !order.includes(over)) return [...order];
  const rest = order.filter((k) => k !== key);
  const at = rest.indexOf(over) + (after ? 1 : 0);
  return [...rest.slice(0, at), key, ...rest.slice(at)];
}

/** The sizes between a widget's bounds, smallest first. */
export const sizesWithin = (b: TileBounds) =>
  TILE_SIZES.slice(TILE_SIZES.indexOf(b.minSize), TILE_SIZES.indexOf(b.maxSize) + 1);

/** Clamped to the rows a tile may take. */
export const clampRows = (rows: number) => Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.round(rows)));

export interface Placed {
  /** First lane, from 0. */
  lane: number;
  /** How many lanes. */
  span: number;
  /** First row, from 0. */
  row: number;
  /** How many rows. */
  rows: number;
}

/**
 * The default layout is worked out only at whole `s` widths (6 tiles: 6, 12, 18, 24) and stretched
 * across the band up to the next (`stretch`), as gridstack scales its columns: a board widened or
 * narrowed by a tile keeps its arrangement, each tile a little wider or narrower, and only crossing
 * a band re-arranges it. Laid out afresh at every tile, a window dragged 53px moved and resized most
 * of a board's tiles.
 */
export const LAYOUT_STEP = 6;

/** The width a board `lanes` tiles wide is laid out at: the band it's in (a board under 6, its own). */
export const layoutLanes = (lanes: number) =>
  lanes < LAYOUT_STEP ? lanes : LAYOUT_STEP * Math.floor(lanes / LAYOUT_STEP);

/**
 * A layout `from` tiles wide stretched to `to` (`to ≥ from`): every tile edge x goes to
 * round(x · to / from). That map is monotone with slope ≥ 1, so each tile keeps at least one tile
 * per tile it had, tiles that touched still touch, none that were apart overlap, the first lane stays
 * 0 and the last edge goes to `to`; rows stay as they were. Proved over every edge pair of every band
 * in tests/board.test.ts.
 */
export function stretch(boxes: readonly Placed[], from: number, to: number): Placed[] {
  const at = (x: number) => (from === to ? x : Math.round((x * to) / from));
  return boxes.map((b) => {
    const lane = at(b.lane);
    return { ...b, lane, span: at(b.lane + b.span) - lane };
  });
}

/**
 * A tile someone placed by hand on a board `from` tiles across, on one `to` across (gridstack's
 * `moveScale` on a column change): its start and end edges go to round(x · to / from), the map
 * `stretch` uses, so on a wider board it's `stretch` exactly, and on a narrower one tiles that were
 * apart stay apart in the same order (the map is monotone) and each keeps at least a tile (`place`
 * then pushes down whatever still lies on another). Below half the width it was arranged at, a
 * layout scaled that far would crush every tile: the board keeps only the arrangement's order
 * (gridstack's `list` mode), each tile its width clamped to the board. Rows are never scaled.
 */
export function scaleArranged(
  at: number,
  span: number,
  from: number,
  to: number,
): { at: number; span: number } | { span: number } {
  if (from === to) return { at, span };
  if (to * 2 < from) return { span: Math.min(span, to) };
  const edge = (x: number) => Math.round((x * to) / from);
  const lane = Math.min(edge(at), to - 1);
  return { at: lane, span: Math.max(1, Math.min(to - lane, edge(at + span) - lane)) };
}

/** The tiles across a size is designed at: its own, `full` a laptop's main panel (18). */
export const designSpan = (size: TileSize) => (size === "full" ? 18 : SIZE_TILES[size]);

/**
 * A widget's height when it gets fewer tiles across than it was designed at (a phone's 5 for an
 * 18-tile header): what wraps (`reflow`, the most it may grow: text 2, figures 4) grows by the number of
 * times its width goes into the design's, rounded (17 tiles for 18 grows nothing; 5 for 18 is 4×), up to `reflow`; what scrolls or scales inside its
 * tile (lists, tables, charts: `reflow` 1) keeps its height. Only widths and `reflow` go in, never
 * what it holds.
 */
export const rowsAt = (rows: number, designed: number, span: number, reflow = 1) =>
  clampRows(rows * Math.min(Math.max(1, reflow), Math.max(1, Math.round(designed / span))));

/** How much a widget of this kind may grow when narrowed: text 2, figures 4, the rest 1 (see `rowsAt`). */
export const reflowOf = (kind: TileKind | undefined) => (kind === "stats" ? 4 : kind === "text" ? 2 : 1);

/** A widget as the board places it: its target size, and how far the board may stretch it. */
export interface PlaceInput {
  size: TileSize;
  /** Its target height in tiles. */
  rows: number;
  /** Its target width in tiles, when exact rather than its size's. */
  span?: number;
  /** How much it grows when narrowed below its design (`rowsAt`). */
  reflow?: number;
  /** The most tiles across the board may stretch it to (its `maxWidth`); left out, its target. */
  maxSpan?: number;
  /** The most tiles down the board may stretch it to (its `maxRows`); left out, its target. */
  maxRows?: number;
  /**
   * The lane it starts at, when someone placed it there by hand (free placement: the tiles before
   * it can be left empty); clamped to the board. Left out, the first lane that's free.
   */
  at?: number;
  /**
   * With `at`, the row too: the tile stays exactly where it was put (free placement), unless a tile
   * placed before it (higher up, or further towards the start in its row) is there, which pushes it
   * down to the first row where it's free.
   */
  atRow?: number;
}

/**
 * Where each widget goes and how big it is, like a launcher's grid (Android's app widgets): every
 * widget is its target width and height in tiles, whatever the board's width. Widgets go in order,
 * each to the first place, in reading order (down the rows, across each from the start), at or after
 * the place of the one before it where all its tiles are free (gridstack's packing, keeping the
 * order): so small widgets after a tall one fill the column beside it, one under another, and a
 * widget never goes before one ahead of it in the order. A widget placed by hand (`at`) starts at
 * exactly that lane, in the first row from there where it's free, so the lanes before it can stay
 * empty (free placement: gaps where someone put them); one put somewhere by hand (`at` and `atRow`)
 * stays exactly there, placed before the rest, top to bottom, pushed down only by one there before
 * it. Nothing floats up: the only thing that closes a gap is a row no tile is in at all, which is
 * taken out (like a cleared line in Tetris), moving what's under it up together. Then, in order, a widget that may be wider
 * (`maxSpan`) takes the free tiles after it across all its rows, and one that may be taller
 * (`maxRows`) the free tiles under it, no lower than the widgets beside it reach; whatever is left
 * stays empty. So a widget's size changes only within the bounds it declares, and only a board
 * narrower than a widget clamps it (its height then follows `rowsAt`). Only sizes, bounds and order
 * go in.
 */
export function place(tiles: PlaceInput[], lanes: number): Placed[] {
  const out: Placed[] = [];
  const taken: boolean[][] = [];
  const free = (row: number, lane: number, span: number, rows: number) => {
    for (let r = row; r < row + rows; r++) for (let c = lane; c < lane + span; c++) if (taken[r]?.[c]) return false;
    return true;
  };
  const take = (row: number, lane: number, span: number, rows: number) => {
    for (let r = row; r < row + rows; r++) for (let c = lane; c < lane + span; c++) (taken[r] ??= [])[c] = true;
  };
  const sizes = tiles.map(({ size, rows: target, span: own, reflow }) => {
    const span = Math.min(lanes, Math.max(1, own ?? spanOf(size, lanes)));
    return { span, rows: rowsAt(target, own ?? designSpan(size), span, reflow) };
  });
  const laneOf = (at: number, span: number) => Math.max(0, Math.min(lanes - span, Math.round(at)));
  // Tiles put somewhere by hand (lane and row) first, top to bottom, start to end: each where it
  // was put, or pushed down to the first row there where it's free.
  tiles
    .map((_, i) => i)
    .filter((i) => tiles[i]!.at !== undefined && tiles[i]!.atRow !== undefined)
    .sort((a, b) => {
      const ta = tiles[a]!;
      const tb = tiles[b]!;
      return ta.atRow! - tb.atRow! || laneOf(ta.at!, sizes[a]!.span) - laneOf(tb.at!, sizes[b]!.span) || a - b;
    })
    .forEach((i) => {
      const { span, rows } = sizes[i]!;
      const lane = laneOf(tiles[i]!.at!, span);
      let row = Math.max(0, Math.round(tiles[i]!.atRow!));
      while (!free(row, lane, span, rows)) row++;
      out[i] = { lane, span, row, rows };
      take(row, lane, span, rows);
    });
  // The rest in order, each at the first free place after the one before it in the order.
  let row = 0;
  let lane = 0;
  tiles.forEach(({ at }, i) => {
    const placed = out[i];
    if (placed) {
      row = placed.row;
      lane = placed.lane;
      return;
    }
    const { span, rows } = sizes[i]!;
    if (at !== undefined) {
      // Placed by hand: exactly its lane, in the first row from here where it's free.
      const pin = Math.max(0, Math.min(lanes - span, Math.round(at)));
      if (pin < lane) row++;
      lane = pin;
      while (!free(row, lane, span, rows)) row++;
    } else
      while (lane + span > lanes || !free(row, lane, span, rows)) {
        lane++;
        if (lane + span > lanes) {
          row++;
          lane = 0;
        }
      }
    out[i] = { lane, span, row, rows };
    take(row, lane, span, rows);
  });
  // Rows no tile is in at all are taken out (like a cleared line in Tetris): what's under them
  // moves up by as many rows, together, so nothing else changes.
  const bottom = Math.max(0, ...out.map((p) => p.row + p.rows));
  const empty: number[] = [];
  for (let r = 0, gone = 0; r <= bottom; r++) {
    empty[r] = gone;
    if (!out.some((p) => p.row <= r && r < p.row + p.rows)) gone++;
  }
  if (empty[bottom]) {
    for (const p of out) p.row -= empty[p.row]!;
    taken.length = 0;
    for (const p of out) take(p.row, p.lane, p.span, p.rows);
  }
  out.forEach((p, i) => {
    const t = tiles[i]!;
    const wide = Math.min(lanes, t.maxSpan ?? 0);
    while (p.span < wide && p.lane + p.span < lanes && free(p.row, p.lane + p.span, 1, p.rows)) {
      take(p.row, p.lane + p.span, 1, p.rows);
      p.span++;
    }
    // No lower than the widgets beside it (sharing any of its rows) reach.
    let reach = p.row + p.rows;
    for (const q of out) if (q.row < p.row + p.rows && q.row + q.rows > p.row) reach = Math.max(reach, q.row + q.rows);
    const tall = Math.min(t.maxRows ?? 0, reach - p.row);
    while (p.rows < tall && free(p.row + p.rows, p.lane, p.span, 1)) {
      take(p.row + p.rows, p.lane, p.span, 1);
      p.rows++;
    }
  });
  return out;
}
