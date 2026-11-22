/**
 * A board's default layout, as an optimisation: of the layouts its widgets' bounds allow, the one
 * that scores best by one formula (`score`), found exactly (`pack`). No DOM; tests/pack.test.ts
 * proves `pack` finds the minimum of every case in a finite domain by checking every layout there.
 *
 * **The formula.** A layout λ on a board L tiles across puts each widget i at a box wᵢ × hᵢ tiles.
 * Its cost is the pair C(λ) = (G, A + D + E), compared in that order (lexicographically):
 *
 * - G, gaps: the empty tiles, L·H − Σ wᵢhᵢ, H the rows the board takes. Tightest first.
 * - A, likeness: Σ over pairs k(dᵢⱼ)·[exp(−(ln aᵢ − ln aⱼ)² / 2σ²) − ½]. aᵢ is the widget's aspect
 *   ratio in px (wᵢ·53 / hᵢ·56), so two widgets of the same shape score ½ and shapes 2× apart
 *   −0.36 (σ = ln 2 / 2): alike neighbours cost, unlike ones earn (`LIKE`). k is a diamond (an L1 ball of radius 1 tile): dᵢⱼ = gx + gy, the
 *   tiles between the two boxes across and down, plus ½ when they meet only at a corner; k(d) =
 *   max(0, 1 − d). So neighbours sharing an edge (on the main axes) weigh 1, ones meeting at a
 *   corner ½, and ones apart nothing: different shapes side by side, most of all edge to edge.
 * - D, drift: Σ [(ln wᵢ/wᵢ*)² + (ln hᵢ/hᵢ*(wᵢ))²] / 2τ², how far each widget is from the
 *   width it asked for and from the rows it asks for at the width it got (`rowsAt`), τ = ln 2: bent
 *   2× costs ½, 6× 3.3. So a shape is only bent as far as it pays for itself in A, and a little
 *   bending is cheap where a lot is dear (the same Gaussian form as A's).
 * - E, straight seams: Σ over pairs k(dᵢⱼ)·eᵢⱼ, eᵢⱼ the parallel edges of the two that line up:
 *   side by side, their tops and their bottoms (each 1 when at the same row); one over the other,
 *   their starts and their ends (at the same lane); meeting at a corner, both lines cross there
 *   (e = 2, so k·e = 1: a + where four widgets meet). On the board's border too: two full-width
 *   widgets one over the other are two straight lines all the way across.
 *   So the line between two widgets stops where they do, and the pieces interlock like a jigsaw
 *   (or a brick wall) rather than lining up in a grid.
 *
 * **Every screen.** The best layout for all screens minimises J = ∫ C(λ_W) dW over window widths W.
 * A board's width only matters through its lanes, L(W), and each width's layout is chosen on its
 * own, so J's integrand at W depends only on λ_W: the minimum of the integral is the minimum at
 * every width (a sum of independent terms is least when each term is). So `pack` solves one lane
 * count at a time, exactly, and that is the best combination for all screens.
 *
 * **The layouts it chooses from** (what "exactly" is over): the widgets in their order, in bands
 * across the board, one under another. A band is a row of columns as wide as one of `TEMPLATES`
 * (halves, thirds, quarters, fifths, sixths of the board, rounded to whole tiles), each column a
 * stack of up to `STACK` consecutive widgets as wide as the column (inside each one's bounds; what
 * they can't fill is a gap). A band is as tall as its tallest column; a column's widgets share its
 * height in proportion to the rows they ask for (inside their bounds), at one of the band heights
 * the columns ask for. Order is kept: reading the board down the bands, across the columns and down
 * each stack gives the widgets in their order. And one more: the board's own first-fit layout of
 * their target sizes (`place`), so the default layout never scores worse than that.
 *
 * Bands line up their tops, so the best of them is then improved by **seam slides** (`slides`): a
 * stretch of the line between widgets moves, where no widget crosses its ends, the widgets on one
 * side growing by what the others give up (inside their bounds). The slide that lowers the cost
 * most is made, again and again, until none does: the cost falls every time, and there are finitely
 * many layouts, so it ends, at a layout no single slide improves (tests/pack.test.ts checks both).
 * That's a local optimum of the formula, not the global one: past the bands, layouts are too many
 * to search exactly at run time.
 */

import { designSpan, place, rowsAt, spanOf, type Placed, type TileSize } from "./board.ts";
import { TILE_H_REM, TILE_W_REM } from "./tiles.ts";

/** A widget as the board packs it: what it asks for and how far it may be bent. */
export interface PackInput {
  size: TileSize;
  /** Its target height in tiles. */
  rows: number;
  /** Its target width in tiles, when exact rather than its size's. */
  span?: number;
  /** How much it grows when narrowed below its design (`rowsAt`). */
  reflow?: number;
  /**
   * Its bounds (its widget's `TileBounds`: a span left out is the board's width); left out, exactly
   * its target. Whatever its bounds allow by hand, the default layout narrows a widget to half its
   * target width at most, and never gives it fewer rows than it asks for at the width it gets
   * (`rowsAt`): what it shows would be cut off. It may take more, up to its bounds.
   */
  bounds?: { minSpan?: number; maxSpan?: number; minRows: number; maxRows: number };
  /** The board's width, its own rows (a screen's header). */
  fixed?: boolean;
}

/** σ of the likeness term: shapes 2× apart score e⁻². */
export const SIGMA = Math.LN2 / 2;
/**
 * The likeness midpoint: neighbours more alike than this (shapes within 1.6× of each other) cost,
 * less alike earn. Without it every neighbour would cost, and the formula would favour layouts with
 * few neighbours (stripes) over ones whose pieces interlock.
 */
export const LIKE = 0.5;
/** E's weight against A and D: one pair of lined-up edges costs as much as two alike neighbours. */
export const SEAM = 1;
/** τ of the drift term: a widget bent 2× either way costs ½, 3× 1.26, 6× 3.3. */
export const TAU = Math.LN2;
/** The deepest stack in a column. */
export const STACK = 3;
/** The most widgets in a band. */
export const BAND = 8;
/** The column widths a band may have, as parts of the board. */
export const TEMPLATES: readonly (readonly number[])[] = [
  [1],
  [1 / 2, 1 / 2],
  [1 / 3, 2 / 3],
  [2 / 3, 1 / 3],
  [1 / 4, 3 / 4],
  [3 / 4, 1 / 4],
  [1 / 3, 1 / 3, 1 / 3],
  [1 / 4, 1 / 4, 1 / 2],
  [1 / 4, 1 / 2, 1 / 4],
  [1 / 2, 1 / 4, 1 / 4],
  [1 / 4, 1 / 4, 1 / 4, 1 / 4],
  [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5],
  [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
];

/** A cost: gaps, then likeness plus drift. */
export type Cost = readonly [gaps: number, shape: number];
export const less = (a: Cost, b: Cost) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1] - 1e-9);
const plus = (a: Cost, b: Cost): Cost => [a[0] + b[0], a[1] + b[1]];

/** A widget on a board `lanes` across: its target and bounds there. */
interface Spec {
  /** Target width; the fewest and most tiles across. */
  w: number;
  lo: number;
  hi: number;
  /** Target rows, fewest and most, at a width. */
  t: (w: number) => number;
  rmin: (w: number) => number;
  rmax: (w: number) => number;
}

function specOf(p: PackInput, lanes: number): Spec {
  const w = Math.min(lanes, Math.max(1, p.span ?? spanOf(p.size, lanes)));
  const designed = p.span ?? designSpan(p.size);
  const at = (rows: number, width: number) => rowsAt(rows, designed, width, p.reflow);
  const t = (width: number) => at(p.rows, width);
  if (p.fixed) return { w: lanes, lo: lanes, hi: lanes, t, rmin: t, rmax: t };
  const b = p.bounds;
  if (!b) return { w, lo: w, hi: w, t, rmin: t, rmax: t };
  const lo = Math.min(w, Math.max(1, Math.ceil(w / 2), b.minSpan ?? lanes));
  // One that doesn't ask for the whole width never gets it: its top and bottom would be straight
  // lines across the board, which nothing could break.
  const hi = Math.min(w < lanes ? Math.max(w, lanes - lo) : lanes, Math.max(w, b.maxSpan ?? lanes));
  return {
    w,
    lo,
    hi,
    t,
    rmin: t,
    rmax: (width) => Math.max(t(width), at(b.maxRows, width)),
  };
}

/** A widget's aspect ratio in px. */
const aspect = (b: Placed) => (b.span * TILE_W_REM) / (b.rows * TILE_H_REM);

/** k(d): 1 for boxes sharing an edge, ½ for boxes meeting at a corner, 0 for boxes apart. */
export function contact(a: Placed, b: Placed): number {
  const gx = Math.max(0, b.lane - (a.lane + a.span), a.lane - (b.lane + b.span));
  const gy = Math.max(0, b.row - (a.row + a.rows), a.row - (b.row + b.rows));
  const overlapX = Math.min(a.lane + a.span, b.lane + b.span) > Math.max(a.lane, b.lane);
  const overlapY = Math.min(a.row + a.rows, b.row + b.rows) > Math.max(a.row, b.row);
  const d = gx + gy + (!overlapX && !overlapY ? 0.5 : 0);
  return Math.max(0, 1 - d);
}

/** How alike two shapes are, less the midpoint `LIKE`: ½ the same, −0.36 2× apart. */
const alike = (a: Placed, b: Placed) => likeness(Math.log(aspect(a)), Math.log(aspect(b)));
const likeness = (a: number, b: number) => Math.exp(-((a - b) ** 2) / (2 * SIGMA ** 2)) - LIKE;

/**
 * e: the parallel edges of two touching boxes that line up (k·e is their part of E), on the board's
 * border too: two full-width widgets one over the other are two straight lines all the way across.
 */
export function aligned(a: Placed, b: Placed): number {
  const aEnd = a.lane + a.span;
  const bEnd = b.lane + b.span;
  const aFoot = a.row + a.rows;
  const bFoot = b.row + b.rows;
  const besideX = aEnd === b.lane || bEnd === a.lane;
  const besideY = aFoot === b.row || bFoot === a.row;
  const overlapX = Math.min(aEnd, bEnd) > Math.max(a.lane, b.lane);
  const overlapY = Math.min(aFoot, bFoot) > Math.max(a.row, b.row);
  if (besideX && overlapY) return +(a.row === b.row) + +(aFoot === bFoot);
  if (besideY && overlapX) return +(a.lane === b.lane) + +(aEnd === bEnd);
  if (besideX && besideY) return 2;
  return 0;
}

const drift = (b: Placed, s: Spec) =>
  (Math.log(b.span / s.w) ** 2 + Math.log(b.rows / s.t(b.span)) ** 2) / (2 * TAU ** 2);

/** The formula on any layout (one box per widget, in the widgets' order): `C(λ) = (G, A + D)`. */
export function score(boxes: readonly Placed[], tiles: readonly PackInput[], lanes: number): Cost {
  return scoreOf(
    boxes,
    tiles.map((t) => specOf(t, lanes)),
    lanes,
  );
}

function scoreOf(boxes: readonly Placed[], specs: readonly Spec[], lanes: number): Cost {
  const height = Math.max(0, ...boxes.map((b) => b.row + b.rows));
  const gaps = lanes * height - boxes.reduce((n, b) => n + b.span * b.rows, 0);
  let shape = 0;
  for (let i = 0; i < boxes.length; i++) {
    shape += drift(boxes[i]!, specs[i]!);
    for (let j = i + 1; j < boxes.length; j++) {
      const k = contact(boxes[i]!, boxes[j]!);
      if (k) shape += k * (alike(boxes[i]!, boxes[j]!) + SEAM * aligned(boxes[i]!, boxes[j]!));
    }
  }
  return [gaps, shape];
}

const pairTerm = (a: Placed, b: Placed) => {
  const k = contact(a, b);
  return k ? k * (alike(a, b) + SEAM * aligned(a, b)) : 0;
};

/** A seam slide: the widgets it changes, and where each goes. */
type Slide = Map<number, Placed>;

/**
 * Every seam slide from `boxes`. A seam is the line between the widgets that end at it and the ones
 * that start there (a row's or a lane's). A stretch of it can move wherever no widget on either side
 * crosses either of its ends: then the widgets on one side grow by what the others give up, all
 * still rectangles, none overlapping, no gap opened (the board's own border never moves). On the
 * line between two bands, the stretch's ends are where lines from both sides meet: moving it turns
 * each + there into two T's apart. Every place for it that keeps each widget inside its bounds
 * (widths `lo` to `hi`; rows from what it asks for at its width to its most).
 */
function slidesOf(boxes: readonly Placed[], specs: readonly Spec[]): Slide[] {
  const out: Slide[] = [];
  const fits = (b: Placed, s: Spec) =>
    b.span >= s.lo && b.span <= s.hi && b.rows >= s.rmin(b.span) && b.rows <= s.rmax(b.span);
  const ids = boxes.map((_, i) => i);
  for (const across of [false, true]) {
    // Across: a vertical seam at lane x (widgets ending there on its start side, starting there on
    // its end side), stretches of it in rows. Else a horizontal one at row y, stretches in lanes.
    const lo = (b: Placed) => (across ? b.lane : b.row);
    const hi = (b: Placed) => (across ? b.lane + b.span : b.row + b.rows);
    const from = (b: Placed) => (across ? b.row : b.lane);
    const to = (b: Placed) => (across ? b.row + b.rows : b.lane + b.span);
    const lines = new Set(boxes.map(hi));
    for (const at of lines) {
      const before = ids.filter((i) => hi(boxes[i]!) === at);
      const after = ids.filter((i) => lo(boxes[i]!) === at);
      if (!before.length || !after.length) continue;
      const side = [...before, ...after];
      // The ends a stretch may have: where no widget on either side crosses.
      const ends = [...new Set(side.flatMap((i) => [from(boxes[i]!), to(boxes[i]!)]))]
        .filter((e) => !side.some((i) => from(boxes[i]!) < e && e < to(boxes[i]!)))
        .sort((a, b) => a - b);
      for (let p = 0; p < ends.length; p++)
        for (let q = p + 1; q < ends.length; q++) {
          const [s0, s1] = [ends[p]!, ends[q]!];
          const inside = (i: number) => from(boxes[i]!) >= s0 && to(boxes[i]!) <= s1;
          const one = before.filter(inside);
          const two = after.filter(inside);
          const length = (xs: number[]) => xs.reduce((n, i) => n + to(boxes[i]!) - from(boxes[i]!), 0);
          // Both sides cover the whole stretch.
          if (!one.length || length(one) !== s1 - s0 || length(two) !== s1 - s0) continue;
          const size = (i: number) => hi(boxes[i]!) - lo(boxes[i]!);
          const least = Math.min(...one.map(size));
          const most = Math.min(...two.map(size));
          for (let d = 1 - least; d < most; d++) {
            if (!d) continue;
            const slide: Slide = new Map();
            let ok = true;
            for (const i of one) {
              const b = boxes[i]!;
              const n = across ? { ...b, span: b.span + d } : { ...b, rows: b.rows + d };
              if (!fits(n, specs[i]!)) ok = false;
              slide.set(i, n);
            }
            for (const i of two) {
              const b = boxes[i]!;
              const n = across
                ? { ...b, lane: b.lane + d, span: b.span - d }
                : { ...b, row: b.row + d, rows: b.rows - d };
              if (!fits(n, specs[i]!)) ok = false;
              slide.set(i, n);
            }
            if (ok) out.push(slide);
          }
        }
    }
  }
  return out;
}

/** How far a drop moves a column down, at most. */
export const DROP = 4;

/**
 * Every column drop from `boxes` (with no gaps): a column of widgets that runs straight down to the
 * board's bottom (no widget crosses its sides from a row down) moves down by 1 to `DROP` rows; the
 * widgets right above it grow into the room that leaves, and the widgets beside it at the bottom grow
 * by as much, so the bottom stays level and no gap opens. Its seams then fall between its
 * neighbours' instead of in line with them. Every drop that keeps each widget inside its bounds.
 */
function dropsOf(boxes: readonly Placed[], specs: readonly Spec[], lanes: number): Slide[] {
  const out: Slide[] = [];
  const height = Math.max(0, ...boxes.map((b) => b.row + b.rows));
  if (lanes * height !== boxes.reduce((n, b) => n + b.span * b.rows, 0)) return out;
  const fits = (b: Placed, s: Spec) =>
    b.span >= s.lo && b.span <= s.hi && b.rows >= s.rmin(b.span) && b.rows <= s.rmax(b.span);
  const ids = boxes.map((_, i) => i);
  for (const at of new Set(boxes.map((b) => b.row + b.rows))) {
    if (at === height) continue;
    const above = ids.filter((i) => boxes[i]!.row + boxes[i]!.rows === at);
    const below = ids.filter((i) => boxes[i]!.row >= at);
    const sides = [...new Set([0, lanes, ...below.flatMap((i) => [boxes[i]!.lane, boxes[i]!.lane + boxes[i]!.span])])]
      .filter((x) => ![...above, ...below].some((i) => boxes[i]!.lane < x && x < boxes[i]!.lane + boxes[i]!.span))
      .sort((a, b) => a - b);
    for (let p = 0; p < sides.length; p++)
      for (let q = p + 1; q < sides.length; q++) {
        const [s0, s1] = [sides[p]!, sides[q]!];
        if (s0 === 0 && s1 === lanes) continue;
        const inside = (i: number) => boxes[i]!.lane >= s0 && boxes[i]!.lane + boxes[i]!.span <= s1;
        const top = above.filter(inside);
        const column = below.filter(inside);
        if (!top.length || !column.length) continue;
        // Nothing in the column crosses the line (it would have to move and stay at once).
        if (ids.some((i) => inside(i) && boxes[i]!.row < at && boxes[i]!.row + boxes[i]!.rows > at)) continue;
        // And the column fills the room under its top from wall to wall: the widgets above it cover it.
        if (top.reduce((n, i) => n + boxes[i]!.span, 0) !== s1 - s0) continue;
        const beside = ids.filter((i) => !inside(i) && boxes[i]!.row + boxes[i]!.rows === height);
        for (let d = 1; d <= DROP; d++) {
          const slide: Slide = new Map();
          let ok = true;
          const set = (i: number, b: Placed) => {
            if (!fits(b, specs[i]!)) ok = false;
            slide.set(i, b);
          };
          for (const i of top) set(i, { ...boxes[i]!, rows: boxes[i]!.rows + d });
          for (const i of column) set(i, { ...boxes[i]!, row: boxes[i]!.row + d });
          for (const i of beside) set(i, { ...boxes[i]!, rows: boxes[i]!.rows + d });
          if (ok) out.push(slide);
        }
      }
  }
  return out;
}

/**
 * Every line split from `boxes` (with no gaps): at a row where widgets end and others start, `d` rows
 * (1 to `DROP`) go in across the whole board, but along a stretch of the line (where no widget
 * crosses its ends, as for a slide) they go to the widgets on one side of it and elsewhere to the
 * widgets on the other: so the line there moves `d` rows from the rest of it, and one straight line
 * becomes two apart. Widgets across the row grow by `d` too, and everything under it moves down:
 * every lane gains `d` rows, so no gap opens. Every split that keeps each widget inside its bounds.
 */
function splitsOf(boxes: readonly Placed[], specs: readonly Spec[], lanes: number): Slide[] {
  const out: Slide[] = [];
  const height = Math.max(0, ...boxes.map((b) => b.row + b.rows));
  if (lanes * height !== boxes.reduce((n, b) => n + b.span * b.rows, 0)) return out;
  const fits = (b: Placed, s: Spec) =>
    b.span >= s.lo && b.span <= s.hi && b.rows >= s.rmin(b.span) && b.rows <= s.rmax(b.span);
  const ids = boxes.map((_, i) => i);
  for (const at of new Set(boxes.map((b) => b.row + b.rows))) {
    if (at === height) continue;
    const before = ids.filter((i) => boxes[i]!.row + boxes[i]!.rows === at);
    const after = ids.filter((i) => boxes[i]!.row === at);
    const side = [...before, ...after];
    const ends = [...new Set([0, lanes, ...side.flatMap((i) => [boxes[i]!.lane, boxes[i]!.lane + boxes[i]!.span])])]
      .filter((x) => !side.some((i) => boxes[i]!.lane < x && x < boxes[i]!.lane + boxes[i]!.span))
      .sort((a, b) => a - b);
    for (let p = 0; p < ends.length; p++)
      for (let q = p + 1; q < ends.length; q++) {
        const [s0, s1] = [ends[p]!, ends[q]!];
        if (s0 === 0 && s1 === lanes) continue;
        const inside = (i: number) => boxes[i]!.lane >= s0 && boxes[i]!.lane + boxes[i]!.span <= s1;
        for (const low of [true, false])
          for (let d = 1; d <= DROP; d++) {
            // `low`: inside the stretch the widgets under the line take the rows (the line stays
            // there and drops elsewhere); else the ones over it do (it drops there, stays elsewhere).
            const slide: Slide = new Map();
            let ok = true;
            for (const i of ids) {
              const b = boxes[i]!;
              const foot = b.row + b.rows;
              const grows =
                (b.row < at && foot > at) ||
                (foot === at && (low ? !inside(i) : inside(i))) ||
                (b.row === at && (low ? inside(i) : !inside(i)));
              const moves = b.row > at || (b.row === at && !grows);
              if (!grows && !moves) continue;
              const n = { ...b, row: b.row + (moves ? d : 0), rows: b.rows + (grows ? d : 0) };
              if (grows && !fits(n, specs[i]!)) ok = false;
              slide.set(i, n);
            }
            if (ok) out.push(slide);
          }
      }
  }
  return out;
}

/** Every slide, drop and split from `boxes`. */
const movesOf = (boxes: readonly Placed[], specs: readonly Spec[], lanes: number) => [
  ...slidesOf(boxes, specs),
  ...dropsOf(boxes, specs, lanes),
  ...splitsOf(boxes, specs, lanes),
];

const apply = (boxes: readonly Placed[], slide: Slide) => boxes.map((b, i) => slide.get(i) ?? b);

/** The layouts one seam slide or column drop from `boxes` (for tests/pack.test.ts). */
export const slides = (boxes: readonly Placed[], tiles: readonly PackInput[], lanes: number) =>
  movesOf(
    boxes,
    tiles.map((t) => specOf(t, lanes)),
    lanes,
  ).map((s) => apply(boxes, s));

/**
 * Seam slides and column drops, the one that lowers the cost most each time (the first on a tie),
 * while one does. Neither opens a gap (a drop is only tried on a board with none), so only A + D + E
 * change, and only in the widgets it moves and their pairs.
 */
function refine(boxes: Placed[], specs: readonly Spec[], lanes: number): Placed[] {
  let now = boxes;
  for (;;) {
    let best: Slide | undefined;
    let gain = 1e-9;
    for (const slide of movesOf(now, specs, lanes)) {
      let delta = 0;
      for (const [i, b] of slide) {
        delta += drift(b, specs[i]!) - drift(now[i]!, specs[i]!);
        for (let j = 0; j < now.length; j++) {
          if (j === i) continue;
          const other = slide.get(j);
          // A pair both of whose widgets move is counted once (from the lower index).
          if (other && j < i) continue;
          delta += pairTerm(b, other ?? now[j]!) - pairTerm(now[i]!, now[j]!);
        }
      }
      if (-delta > gain) {
        gain = -delta;
        best = slide;
      }
    }
    if (!best) return now;
    now = apply(now, best);
  }
}

/** How many partial layouts the skyline search keeps at each widget. */
export const BEAM = 48;

/**
 * The skyline search: the widgets in their order, each put at the lowest, leftmost point of the
 * board's top edge so far (its skyline), at each of a few widths (the run of lanes there, its
 * halves and thirds, its own target) and heights (what it asks for, a tile or two more, its most,
 * and whatever brings its top level with or just past a neighbour's). Where nothing fits the lowest
 * run, the run is filled up to its lower neighbour (a gap). After each widget it keeps the `BEAM`
 * partial layouts of least cost (gaps so far, then A + D + E so far; the first found on a tie). At
 * the end, a widget whose top is the skyline there grows down to the board's bottom where its
 * bounds let it. Deterministic, but a search, not a proof: `pack` keeps it only when it scores
 * better than the exact band layout.
 */
function skyline(specs: readonly Spec[], lanes: number): Placed[] | undefined {
  interface Partial {
    boxes: Placed[];
    heights: number[];
    gaps: number;
    shape: number;
  }
  let beam: Partial[] = [{ boxes: [], heights: Array<number>(lanes).fill(0), gaps: 0, shape: 0 }];
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i]!;
    const next: Partial[] = [];
    for (const p of beam) {
      const heights = [...p.heights];
      let gaps = p.gaps;
      let boxes = p.boxes;
      let shape = p.shape;
      // The lowest, leftmost run wide enough for it (filling runs too narrow up to a neighbour).
      let x0 = 0;
      let run = 0;
      for (let guard = 0; guard < 10_000; guard++) {
        const y = Math.min(...heights);
        x0 = heights.indexOf(y);
        run = 0;
        while (x0 + run < lanes && heights[x0 + run] === y) run++;
        if (run >= s.lo) break;
        const left = x0 > 0 ? heights[x0 - 1]! : Infinity;
        const right = x0 + run < lanes ? heights[x0 + run]! : Infinity;
        const up = Math.min(left, right);
        // The widget under the dip, just as wide, grows up into it where it may; else it's a gap.
        const under = boxes.findIndex((b) => b.lane === x0 && b.span === run && b.row + b.rows === y);
        const b = boxes[under];
        if (b && Number.isFinite(up) && b.rows + up - y <= specs[under]!.rmax(b.span)) {
          boxes = boxes.map((o, k) => (k === under ? { ...o, rows: o.rows + up - y } : o));
          shape = 0;
          for (let k = 0; k < boxes.length; k++) {
            shape += drift(boxes[k]!, specs[k]!);
            for (let m = k + 1; m < boxes.length; m++) shape += pairTerm(boxes[k]!, boxes[m]!);
          }
        } else for (let x = x0; x < x0 + run; x++) gaps += up - heights[x]!;
        for (let x = x0; x < x0 + run; x++) heights[x] = up;
      }
      const y = heights[x0]!;
      const widths = new Set(
        [run, Math.round(run / 2), Math.round(run / 3), Math.round((2 * run) / 3), s.w].filter(
          (w) => w >= s.lo && w <= Math.min(s.hi, run),
        ),
      );
      for (const w of widths) {
        const t = s.t(w);
        const levels = new Set<number>([t, t + 1, t + 2, s.rmax(w)]);
        // Level with a neighbour's top, or a tile past it.
        for (const x of [x0 - 1, x0 + w])
          if (x >= 0 && x < lanes && heights[x]! > y) {
            levels.add(heights[x]! - y);
            levels.add(heights[x]! - y + 1);
          }
        for (const h of levels) {
          if (h < t || h > s.rmax(w)) continue;
          const box: Placed = { lane: x0, span: w, row: y, rows: h };
          let more = shape + drift(box, s);
          for (const b of boxes) more += pairTerm(box, b);
          const after = [...heights];
          for (let x = x0; x < x0 + w; x++) after[x] = y + h;
          next.push({ boxes: [...boxes, box], heights: after, gaps, shape: more });
        }
      }
    }
    if (!next.length) return undefined;
    next.sort((a, b) => a.gaps - b.gaps || a.shape - b.shape);
    beam = next.slice(0, BEAM);
  }
  // The bottom: each widget on top of the skyline grows down to it where it may.
  let best: Placed[] | undefined;
  let bestCost: Cost | undefined;
  for (const p of beam) {
    const height = Math.max(...p.heights);
    const boxes = p.boxes.map((b, i) => {
      const foot = b.row + b.rows;
      const onTop = p.heights.slice(b.lane, b.lane + b.span).every((h) => h === foot);
      const rows = height - b.row;
      return onTop && rows <= specs[i]!.rmax(b.span) ? { ...b, rows } : b;
    });
    const cost = scoreOf(boxes, specs, lanes);
    if (!bestCost || less(cost, bestCost)) [best, bestCost] = [boxes, cost];
  }
  return best;
}

/** One way to lay out a band of widgets: their boxes (rows from the band's top), its height, cost. */
export interface Band {
  boxes: Placed[];
  height: number;
  /** Its gaps, and the likeness and drift inside it. */
  cost: Cost;
  /** The boxes on its top and bottom edges (with their shapes' logs): the only ones another band touches. */
  top: Edgewise[];
  bottom: Edgewise[];
}
interface Edgewise {
  lane: number;
  end: number;
  shape: number;
}

/** Column widths for a template on `lanes`: its parts' edges rounded to whole tiles. */
function widthsOf(template: readonly number[], lanes: number): number[] | undefined {
  let at = 0;
  let edge = 0;
  const out: number[] = [];
  for (const part of template) {
    at += part;
    const next = Math.round(at * lanes);
    if (next <= edge) return undefined;
    out.push(next - edge);
    edge = next;
  }
  return out;
}

/** The ways to cut `m` widgets into `c` stacks of 1 to `STACK`, in order. */
function cuts(m: number, c: number): number[][] {
  if (c === 0) return m === 0 ? [[]] : [];
  const out: number[][] = [];
  for (let k = 1; k <= Math.min(STACK, m); k++) for (const rest of cuts(m - k, c - 1)) out.push([k, ...rest]);
  return out;
}

/** A column's heights at band height `h`: in proportion to what each asks for, inside its bounds. */
function stackAt(specs: Spec[], width: number, h: number): number[] {
  const want = specs.map((s) => s.t(width));
  const total = want.reduce((a, b) => a + b, 0);
  const ideal = want.map((t) => (t * h) / total);
  const out = ideal.map(Math.floor);
  let left = h - out.reduce((a, b) => a + b, 0);
  // The rest, a tile each, to the largest remainders (the first on a tie).
  const order = ideal.map((v, i) => [v - Math.floor(v), i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (const [, i] of order) if (left-- > 0) out[i]!++;
  return out.map((v, i) => Math.min(specs[i]!.rmax(width), Math.max(specs[i]!.rmin(width), v)));
}

/** Every way the space allows to lay out widgets `specs` (consecutive) as one band. */
function bands(specs: Spec[], lanes: number): Band[] {
  const m = specs.length;
  const out: Band[] = [];
  const seen = new Set<string>();
  for (const template of TEMPLATES) {
    const widths = widthsOf(template, lanes);
    if (!widths) continue;
    for (const cut of cuts(m, widths.length)) {
      // Each column: its widgets, its width (inside all their bounds).
      let first = 0;
      const cols: { members: number[]; width: number }[] = [];
      let ok = true;
      for (let c = 0; c < cut.length; c++) {
        const members = Array.from({ length: cut[c]! }, (_, k) => first + k);
        first += cut[c]!;
        const lo = Math.max(...members.map((i) => specs[i]!.lo));
        const hi = Math.min(...members.map((i) => specs[i]!.hi));
        if (lo > hi) ok = false;
        cols.push({ members, width: Math.min(hi, Math.max(lo, widths[c]!)) });
      }
      if (!ok || cols.reduce((n, c) => n + c.width, 0) > lanes) continue;
      // The band heights the columns ask for.
      const heights = new Set(cols.map((c) => c.members.reduce((n, i) => n + specs[i]!.t(c.width), 0)));
      for (const h of heights) {
        const boxes: Placed[] = [];
        let lane = 0;
        for (const c of cols) {
          const hs = stackAt(
            c.members.map((i) => specs[i]!),
            c.width,
            h,
          );
          let row = 0;
          c.members.forEach((i, k) => {
            boxes[i] = { lane, span: c.width, row, rows: hs[k]! };
            row += hs[k]!;
          });
          lane += c.width;
        }
        const key = boxes.map((b) => `${b.lane},${b.span},${b.row},${b.rows}`).join(";");
        if (seen.has(key)) continue;
        seen.add(key);
        const height = Math.max(...boxes.map((b) => b.row + b.rows));
        let shape = 0;
        for (let i = 0; i < m; i++) {
          shape += drift(boxes[i]!, specs[i]!);
          for (let j = i + 1; j < m; j++) {
            const a = boxes[i]!;
            const b = boxes[j]!;
            const k = contact(a, b);
            if (!k) continue;
            shape += k * (alike(a, b) + SEAM * aligned(a, b));
          }
        }
        const edgewise = (b: Placed) => ({ lane: b.lane, end: b.lane + b.span, shape: Math.log(aspect(b)) });
        out.push({
          boxes,
          height,
          cost: [lanes * height - boxes.reduce((n, b) => n + b.span * b.rows, 0), shape],
          top: boxes.filter((b) => b.row === 0).map(edgewise),
          bottom: boxes.filter((b) => b.row + b.rows === height).map(edgewise),
        });
      }
    }
  }
  return out;
}

/**
 * Likeness between a band and the one under it (only they can touch: a band is at least a row), the
 * same sum as `score`'s, over the only boxes that can: the upper one's bottom edge and the lower
 * one's top edge, which meet along a line (an edge where they overlap across, a corner where they
 * just meet).
 */
function across(top: Band, under: Band): number {
  let shape = 0;
  for (const a of top.bottom)
    for (const b of under.top) {
      const overlap = Math.min(a.end, b.end) > Math.max(a.lane, b.lane);
      const k = overlap ? 1 : a.end === b.lane || b.end === a.lane ? 0.5 : 0;
      if (!k) continue;
      // Lined up: one over the other, starts and ends; at a corner, both lines (a +).
      const lines = overlap ? +(a.lane === b.lane) + +(a.end === b.end) : 2;
      shape += k * (likeness(a.shape, b.shape) + SEAM * lines);
    }
  return shape;
}

/** The bands of each run of widgets, `i` to `j`, on a board `lanes` across. */
export function bandsOf(tiles: readonly PackInput[], lanes: number) {
  const specs = tiles.map((t) => specOf(t, lanes));
  const memo = new Map<string, Band[]>();
  return (i: number, j: number) => {
    const key = `${i}:${j}`;
    let got = memo.get(key);
    if (!got) memo.set(key, (got = bands(specs.slice(i, j), lanes)));
    return got;
  };
}

const cache = new Map<string, Placed[]>();

/**
 * The layout of least cost (`score`) among the ones described above, for a board `lanes` across:
 * by dynamic programming over where each band ends and how it's laid out (the cost adds up band by
 * band, and a band touches only the one before it, so the best layout ending in a band is the best
 * one before it plus that band). Ties go to the first found (wider templates, fewer columns first).
 * Then seam slides (`slide`; off: the best band layout itself, for tests/pack.test.ts).
 */
export function pack(tiles: readonly PackInput[], lanes: number, slide = true): Placed[] {
  const n = tiles.length;
  if (!n) return [];
  const key = `${lanes}|${slide}|${JSON.stringify(tiles)}`;
  const hit = cache.get(key);
  if (hit) return hit.map((p) => ({ ...p }));
  const bandOf = bandsOf(tiles, lanes);
  interface State {
    band: Band | null;
    from: number;
    cost: Cost;
    prev: State | null;
  }
  const states: State[][] = [[{ band: null, from: 0, cost: [0, 0], prev: null }]];
  for (let j = 1; j <= n; j++) {
    const here: State[] = [];
    for (let i = Math.max(0, j - BAND); i < j; i++)
      for (const band of bandOf(i, j)) {
        let best: State | undefined;
        for (const s of states[i]!) {
          const cost = plus(plus(s.cost, band.cost), [0, s.band ? across(s.band, band) : 0]);
          if (!best || less(cost, best.cost)) best = { band, from: i, cost, prev: s };
        }
        if (best) here.push(best);
      }
    states.push(here);
  }
  let end: State | undefined;
  for (const s of states[n]!) if (!end || less(s.cost, end.cost)) end = s;
  const endCost = end!.cost;
  const chain: State[] = [];
  for (let s: State | null = end!; s?.band; s = s.prev) chain.unshift(s);
  let out: Placed[] = [];
  let top = 0;
  for (const s of chain) {
    s.band!.boxes.forEach((b, k) => (out[s.from + k] = { ...b, row: b.row + top }));
    top += s.band!.height;
  }
  // First fit, at their targets: kept when it scores better (a fixed tile is the board's width).
  const first = place(
    tiles.map((t) => (t.fixed ? { size: "full" as const, rows: t.rows, reflow: t.reflow } : t)),
    lanes,
  );
  const specs = tiles.map((t) => specOf(t, lanes));
  let outCost = endCost;
  if (less(scoreOf(first, specs, lanes), outCost)) [out, outCost] = [first, scoreOf(first, specs, lanes)];
  if (slide) {
    // Past the bands: the skyline search's best, when it scores better; then seam slides.
    const sky = skyline(specs, lanes);
    if (sky && less(scoreOf(sky, specs, lanes), outCost)) out = sky;
    out = refine(out, specs, lanes);
  }
  if (cache.size > 200) cache.clear();
  cache.set(key, out);
  return out.map((p) => ({ ...p }));
}
