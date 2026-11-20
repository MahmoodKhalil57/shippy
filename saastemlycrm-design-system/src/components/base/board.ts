/**
 * The board: a screen's widgets as tiles in lanes, placed by a masonry that's a pure function of
 * what it's given. `<ui-board>` (primitives/layout/board.ts) draws it; tests/board.test.ts proves
 * the properties below for every case in a finite domain.
 *
 * - **Lanes** come from the board's own width (container queries, layout/algebra.ts `board.lanes`):
 *   1 lane, then 2 from 37rem, 3 from 56rem and 4 from 75rem. A lane is never narrower than
 *   18rem once there are two (n × 18rem + (n − 1) × 1rem ≤ the width), and a single lane is the
 *   whole board. The smallest screen (a 258px main panel) is always one lane: the tiles stack in
 *   their order, as a phone layout should.
 * - **Sizes** say how many lanes a tile takes: `s` 1, `m` 2, `l` 3, `full` all. A tile never takes
 *   more lanes than the board has (`spanOf`), so it can't make a column that doesn't exist.
 * - **No lane left empty beside a tile** (in `place`): a tile takes the lanes beside it that are
 *   free at its top when the next tile couldn't use them (all-`m` tiles on 3 lanes become whole
 *   rows; an `s` before an `l` takes the row; an `s` list beside an `m` pane stays as it is).
 * - **Placement** (`place`): each tile in its order goes to the run of lanes whose top is lowest,
 *   the first such run when several tie. So the same tiles, sizes and heights always give the
 *   same layout; tiles never overlap; and when the board gets narrower or wider, the tiles move
 *   by that same rule, so where each one goes is predictable.
 *
 * Sizes follow Material 3's layout (.m3-specs/pages/foundations/layout): a lane of 18rem is about
 * a fixed pane (360dp); 1 lane at the compact breakpoint, more as the window grows; the 16px gap
 * is M3's spacer at compact sizes.
 */

/** A lane's narrowest width once there are two or more, rem. */
export const LANE = 18;
/** The gap between lanes and between tiles, px (M3's compact spacer). */
export const GAP = 16;
/** The most lanes a board has. */
export const MAX_LANES = 4;
/** The board's row unit, px: tiles' heights are rounded up to it. */
export const ROW = 4;

/** The board width (rem) from which it has `n` lanes: n lanes of 18rem and n − 1 gaps of (at most) 1rem. */
export const laneThreshold = (n: number) => n * LANE + (n - 1);

/** How many lanes a board `width` px wide has, at a text size (`scale`, 1 = 16px). */
export function lanesFor(width: number, scale = 1): number {
  let n = 1;
  for (let k = 2; k <= MAX_LANES; k++) if (width >= laneThreshold(k) * 16 * scale) n = k;
  return n;
}

export type TileSize = "s" | "m" | "l" | "full";
export const TILE_SIZES: readonly TileSize[] = ["s", "m", "l", "full"];
const SPAN: Record<Exclude<TileSize, "full">, number> = { s: 1, m: 2, l: 3 };

/** How many lanes a tile of this size takes on a board of `lanes` lanes. */
export const spanOf = (size: TileSize, lanes: number) => (size === "full" ? lanes : Math.min(SPAN[size], lanes));

export interface Placed {
  /** First lane, from 0. */
  lane: number;
  /** How many lanes. */
  span: number;
  /** Its top, px from the board's top. */
  top: number;
}

/**
 * Where each tile goes: in order, to the run of its size's lanes whose top (the lowest point of the
 * tiles already in them) is lowest, the first such run on a tie. Then it takes the lanes beside
 * that run that are free at its top, if the next tile couldn't use them (it needs more lanes than
 * there are), so no lane stays empty beside a tile just because the next one was too wide. That
 * reads only the tiles before it, never its own height: a tile that widens (and gets shorter) never
 * changes whether it widens, so measuring again settles. `heights` are the tiles' own heights (px,
 * or rows: any one unit); tiles are `gap` apart.
 */
export function place(tiles: { size: TileSize; height: number }[], lanes: number, gap = GAP): Placed[] {
  const bottom = Array.from({ length: lanes }, () => 0);
  const base = tiles.map((t) => spanOf(t.size, lanes));
  return tiles.map(({ height }, i) => {
    let span = base[i]!;
    let lane = 0;
    let top = Infinity;
    for (let start = 0; start + span <= lanes; start++) {
      const t = Math.max(...bottom.slice(start, start + span));
      if (t < top) {
        top = t;
        lane = start;
      }
    }
    // The lanes on either side that are free at this tile's top.
    let from = lane;
    let to = lane + span;
    while (from > 0 && bottom[from - 1]! <= top) from--;
    while (to < lanes && bottom[to]! <= top) to++;
    const free = to - from - span;
    const next = base[i + 1];
    if (free > 0 && (next === undefined || next > free)) {
      lane = from;
      span = to - from;
    }
    for (let k = lane; k < lane + span; k++) bottom[k] = top + height + gap;
    return { lane, span, top };
  });
}

/** The board's height for these placements, px. */
export const boardHeight = (placed: Placed[], heights: number[], gap = GAP) =>
  Math.max(0, ...placed.map((p, i) => p.top + heights[i]! + gap)) - (placed.length ? gap : 0);
