import { TILE_H_REM, tileH, tileW } from "./tiles.ts";

export const GAP = 0;
export const CELL = TILE_H_REM;
export const MIN_ROWS = 1;
export const MAX_ROWS = 200;

export function lanesFor(width: number, scale = 1): number {
  return Math.max(1, Math.floor(width / tileW(scale) + 0.05));
}

export type TileSize = "s" | "m" | "l" | "full";
export const TILE_SIZES: readonly TileSize[] = ["s", "m", "l", "full"];
export const SIZE_TILES: Record<Exclude<TileSize, "full">, number> = { s: 6, m: 12, l: 18 };

export const spanOf = (size: TileSize, lanes: number) => (size === "full" ? lanes : Math.min(SIZE_TILES[size], lanes));

export const rowsHeight = (rows: number, scale = 1) => rows * tileH(scale);

export const rowsFor = (px: number, scale = 1) =>
  Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.ceil(px / tileH(scale) - 1e-9)));

export type TileKind = "stats" | "text" | "card" | "table" | "list" | "chart" | "entries";

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

export const KIND_BOUNDS: Record<TileKind, { minSpan: number; maxSpan?: number; minRows: number; maxRows: number }> = {
  stats: { minSpan: 3, maxSpan: 8, minRows: 2, maxRows: 6 },
  text: { minSpan: 4, minRows: 1, maxRows: 6 },
  list: { minSpan: 5, minRows: 4, maxRows: 20 },
  card: { minSpan: 5, minRows: 3, maxRows: 20 },
  entries: { minSpan: 6, minRows: 4, maxRows: 30 },
  chart: { minSpan: 6, minRows: 4, maxRows: 14 },
  table: { minSpan: 8, minRows: 5, maxRows: 30 },
};

export interface TileBounds {
  size: TileSize;
  rows: number;
  minSize: TileSize;
  maxSize: TileSize;
  minRows: number;
  maxRows: number;
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
  width?: number;
  kind?: TileKind;
}): TileBounds {
  const k = w.kind ? KIND_BOUNDS[w.kind] : undefined;
  const order = TILE_SIZES;
  const minSize = w.minSize ?? "s";
  const maxSize = w.maxSize ?? "full";
  const rows = clampRows(w.rows);
  const minRows = Math.min(rows, clampRows(w.minRows ?? k?.minRows ?? Math.max(MIN_ROWS + 2, Math.round(w.rows / 2))));
  const maxRows = Math.max(rows, clampRows(Math.max(minRows, w.maxRows ?? k?.maxRows ?? w.rows * 2)));
  const size =
    order.indexOf(w.size) < order.indexOf(minSize)
      ? minSize
      : order.indexOf(w.size) > order.indexOf(maxSize)
        ? maxSize
        : w.size;
  const span = w.width ?? (size === "full" ? undefined : SIZE_TILES[size]);
  const least =
    w.minWidth ??
    (w.minSize === undefined ? k?.minSpan : undefined) ??
    (minSize === "full" ? undefined : SIZE_TILES[minSize]);
  const most =
    w.maxWidth ??
    (w.maxSize === undefined ? k?.maxSpan : undefined) ??
    (maxSize === "full" ? undefined : SIZE_TILES[maxSize]);
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

export function resizeTo(b: TileBounds, lanes: number, span: number, rows: number): { span: number; rows: number } {
  const most = Math.min(lanes, b.maxSpan ?? lanes);
  const least = Math.min(most, Math.max(1, b.minSpan ?? 1));
  return {
    span: Math.min(most, Math.max(least, Math.round(span))),
    rows: Math.min(b.maxRows, Math.max(b.minRows, Math.round(rows))),
  };
}

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

export const sizesWithin = (b: TileBounds) =>
  TILE_SIZES.slice(TILE_SIZES.indexOf(b.minSize), TILE_SIZES.indexOf(b.maxSize) + 1);

export const clampRows = (rows: number) => Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.round(rows)));

export interface Placed {
  lane: number;
  span: number;
  row: number;
  rows: number;
}

export const LAYOUT_STEP = 6;

export const layoutLanes = (lanes: number) =>
  lanes < LAYOUT_STEP ? lanes : LAYOUT_STEP * Math.floor(lanes / LAYOUT_STEP);

export function stretch(boxes: readonly Placed[], from: number, to: number): Placed[] {
  const at = (x: number) => (from === to ? x : Math.round((x * to) / from));
  return boxes.map((b) => {
    const lane = at(b.lane);
    return { ...b, lane, span: at(b.lane + b.span) - lane };
  });
}

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

export const designSpan = (size: TileSize) => (size === "full" ? 18 : SIZE_TILES[size]);

export const rowsAt = (rows: number, designed: number, span: number, reflow = 1) =>
  clampRows(rows * Math.min(Math.max(1, reflow), Math.max(1, Math.round(designed / span))));

export const reflowOf = (kind: TileKind | undefined) => (kind === "stats" ? 4 : kind === "text" ? 2 : 1);

export interface PlaceInput {
  size: TileSize;
  rows: number;
  span?: number;
  reflow?: number;
  maxSpan?: number;
  maxRows?: number;
  at?: number;
  atRow?: number;
}

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
