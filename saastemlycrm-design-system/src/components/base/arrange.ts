/**
 * Arranging a board by hand, as geometry (no DOM): where each tile goes when one is put down by
 * another tile's edge, or in empty space. The board's places are boxes in whole tiles (`lane`,
 * `row` from 0; `span` across, `rows` down); the result is every tile's new top start corner.
 *
 * A line between two tiles means one thing, whichever tile's edge it's drawn on: put it in there.
 *
 * - Across (a start or end edge), in that tile's row: the tiles from the line on move on along the
 *   row, each just clear of the one before it; a tile that would pass the board's end wraps, like
 *   text, to the start of the next row under the line's tiles. By an end edge, the tiles before
 *   the line first move back towards the start, into what room there is before them (never past
 *   the board's start or a fixed tile); what that room can't hold pushes on, as above.
 * - Down (a top or bottom edge), in the lanes it was let go at: by a top edge, it goes in at that
 *   tile's top and what's under moves down; by a bottom edge, the tiles above the line first move
 *   up, into what room there is above them (never above the top or a fixed tile), and what that
 *   room can't hold pushes down, which always has room.
 *
 * Whatever ends up on a tile it didn't push is pushed down, just under it, and so on (`settle`).
 */

export interface Box {
  lane: number;
  row: number;
  span: number;
  rows: number;
}
export type Edge = "start" | "end" | "top" | "bottom";
export type Spot = { lane: number; row: number };

const overlaps = (a: Box, b: Box) =>
  a.row < b.row + b.rows && a.row + a.rows > b.row && a.lane < b.lane + b.span && a.lane + a.span > b.lane;

/**
 * Pushes down whatever overlaps the tiles in `movers` (and then whatever overlaps those): each
 * just under the tile it's on. A fixed tile never moves. Rows only grow, so it ends.
 */
export function settle(boxes: Map<string, Box>, movers: string[], fixed: ReadonlySet<string>) {
  // In order (the one put in first): each, once settled, stays; what overlaps it goes under it,
  // movers that ended up on each other included.
  const still = new Set<string>();
  const queue = [...movers];
  while (queue.length) {
    const key = queue.shift()!;
    const m = boxes.get(key)!;
    for (const [k, o] of boxes) {
      if (k === key || fixed.has(k) || still.has(k) || !overlaps(o, m)) continue;
      boxes.set(k, { ...o, row: m.row + m.rows });
      queue.push(k);
    }
    still.add(key);
  }
}

/**
 * Makes room for `mover`, already where it goes: only what it actually lands on moves, and only
 * just clear of it, then what that lands on, and so on, each tile always the same way. What it lands
 * on before lane `at` moves back towards the start (and what that lands on, back too),
 * as far as the board's start lets it (a fixed tile never moves); what it lands on from there on
 * moves on towards the end, and one that would pass the board's end wraps, like text, to the start
 * of the row under the tiles that moved. Tiles in the same lanes but other rows aren't in the way,
 * so they stay. Returns the tiles it moved (whatever still overlaps is for `settle`).
 */
function makeRoom(boxes: Map<string, Box>, mover: string, at: number, lanes: number, fixed: ReadonlySet<string>) {
  const moved = new Set<string>();
  const wrapped: string[] = [];
  // The way each tile goes, set by the first push it gets; later pushes only take it further that
  // way (back: to a lower lane; on: to a higher one), so this ends.
  const way = new Map<string, "back" | "on" | "off">();
  const queue = [mover];
  while (queue.length) {
    const key = queue.shift()!;
    // A tile that wraps pushes nothing here: it goes to the next row (below).
    if (way.get(key) === "off") continue;
    const m = boxes.get(key)!;
    for (const [k, o] of [...boxes].sort(([, a], [, b]) => a.lane - b.lane)) {
      if (k === key || k === mover || fixed.has(k) || way.get(k) === "off" || !overlaps(o, m)) continue;
      // Hit by the tile put in: back if it starts before `at`, else on; hit by a pushed tile: the
      // way that one goes. Once set, always that way.
      const go = way.get(k) ?? (key === mover ? (o.lane < at ? "back" : "on") : (way.get(key) as "back" | "on"));
      const lane = go === "back" ? m.lane - o.span : m.lane + m.span;
      // No room back: it stays (and goes down, `settle`); past the end: it wraps.
      if (go === "back" && lane < 0) continue;
      if (go === "on" && lane + o.span > lanes) {
        way.set(k, "off");
        wrapped.push(k);
        continue;
      }
      way.set(k, go);
      boxes.set(k, { ...o, lane });
      moved.add(k);
      queue.push(k);
    }
  }
  if (wrapped.length) {
    // The row under the tiles that moved (and the one put in), from the start.
    const row = Math.max(
      ...[mover, ...moved].filter((k) => !wrapped.includes(k)).map((k) => boxes.get(k)!.row + boxes.get(k)!.rows),
    );
    let next = 0;
    for (const k of wrapped) {
      const b = boxes.get(k)!;
      boxes.set(k, { ...b, lane: Math.min(next, lanes - b.span), row });
      next += b.span;
      moved.add(k);
    }
  }
  return [...moved];
}

/** The tile `mover` put down by `edge` of `target` (`near`: the lane it was let go at, for top and bottom). */
export function insert(
  places: ReadonlyMap<string, Box>,
  mover: string,
  target: string,
  edge: Edge,
  lanes: number,
  near: number,
  fixed: ReadonlySet<string>,
): Map<string, Spot> {
  const boxes = new Map([...places].map(([k, b]) => [k, { ...b }]));
  const me = boxes.get(mover)!;
  const them = boxes.get(target)!;
  boxes.delete(mover);
  const moved: string[] = [];
  if (edge === "start" || edge === "end") {
    const at = edge === "start" ? them.lane : them.lane + them.span;
    const row = them.row;
    // The row: tiles that share the rows it goes into.
    const band: Box = { lane: 0, row, span: lanes, rows: me.rows };
    const line = [...boxes].filter(([, b]) => overlaps(b, band));
    const before = line.filter(([, b]) => b.lane < at).sort(([, a], [, b]) => b.lane - a.lane);
    // By an end edge: the room before the line (up to a fixed tile or the board's start).
    let room = 0;
    if (edge === "end") {
      let limit = at;
      for (const [k, b] of before) {
        if (fixed.has(k)) {
          room += limit - (b.lane + b.span);
          limit = -1;
          break;
        }
        room += limit - (b.lane + b.span);
        limit = b.lane;
      }
      if (limit >= 0) room += limit;
    }
    const back = Math.min(me.span, Math.max(0, room));
    const lane = Math.max(0, Math.min(lanes - me.span, at - back));
    boxes.set(mover, { ...me, lane, row });
    moved.push(...makeRoom(boxes, mover, at, lanes, fixed));
  } else {
    const lane = Math.max(0, Math.min(lanes - me.span, near));
    const at = edge === "top" ? them.row : them.row + them.rows;
    // The column: tiles in the lanes it goes into, above the line.
    const column = [...boxes]
      .filter(([, b]) => b.lane < lane + me.span && b.lane + b.span > lane && b.row + b.rows <= at)
      .sort(([, a], [, b]) => b.row + b.rows - (a.row + a.rows));
    // By a bottom edge: the room above the line (up to a fixed tile or the top).
    let room = 0;
    if (edge === "bottom") {
      const wall = Math.max(0, ...column.filter(([k]) => fixed.has(k)).map(([, b]) => b.row + b.rows));
      const covered = new Set<number>();
      for (const [k, b] of column)
        if (!fixed.has(k) && b.row >= wall) for (let r = b.row; r < b.row + b.rows; r++) covered.add(r);
      room = at - wall - covered.size;
    }
    const up = Math.min(me.rows, Math.max(0, room));
    const row = at - up;
    boxes.set(mover, { ...me, lane, row });
    if (up) {
      // Up: each tile above the line just clear of the one under it.
      let limit = row;
      for (const [k, b] of column) {
        if (fixed.has(k)) break;
        if (b.row + b.rows > limit) {
          boxes.set(k, { ...b, row: limit - b.rows });
          moved.push(k);
        }
        limit = Math.min(limit, boxes.get(k)!.row);
      }
    }
  }
  settle(boxes, [mover, ...moved], fixed);
  return new Map([...boxes].map(([k, b]) => [k, { lane: b.lane, row: b.row }]));
}

/**
 * The tile `mover` put down at `spot` in space it may only partly fit (or fits: then nothing moves):
 * the row makes room for it there (`makeRoom`: before it back, after it on, wrapping), and whatever
 * still overlaps goes down (`settle`).
 */
export function putAt(
  places: ReadonlyMap<string, Box>,
  mover: string,
  spot: Spot,
  lanes: number,
  fixed: ReadonlySet<string>,
) {
  const boxes = new Map([...places].map(([k, b]) => [k, { ...b }]));
  boxes.set(mover, { ...boxes.get(mover)!, ...spot });
  const moved = makeRoom(boxes, mover, spot.lane, lanes, fixed);
  settle(boxes, [mover, ...moved], fixed);
  return new Map([...boxes].map(([k, b]) => [k, { lane: b.lane, row: b.row }]));
}

/**
 * Compact (gridstack's `compact()`, its `float: false`): every tile moves up as far as it can in its
 * own lanes, top to bottom, start to end, so the gaps people left close and nothing else changes:
 * lanes, sizes and the order down each lane stay. A fixed tile never moves, and a tile never goes
 * above one. Taking tiles in order of their top row, each one's room above is final once the tiles
 * above it are, so one pass reaches the fixpoint: no tile can then move up a row.
 */
export function compact(places: ReadonlyMap<string, Box>, fixed: ReadonlySet<string>): Map<string, Spot> {
  const order = [...places].sort(([, a], [, b]) => a.row - b.row || a.lane - b.lane);
  const done: Box[] = [];
  const out = new Map<string, Spot>();
  for (const [k, b] of order) {
    let row = b.row;
    if (!fixed.has(k)) while (row > 0 && !done.some((d) => overlaps(d, { ...b, row: row - 1 }))) row--;
    done.push({ ...b, row });
    out.set(k, { lane: b.lane, row });
  }
  return out;
}
