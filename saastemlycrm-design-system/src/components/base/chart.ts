/**
 * The arithmetic behind `<ui-chart>` (src/components/primitives/data/chart.ts): the y scale and its
 * round ticks, the smooth line through the points, which x labels show, and the range a chart is
 * cut to. Pure, so tests/chart.test.ts can check each rule over a finite domain.
 */

/** The step sizes a tick may take, within one power of ten: each at most twice the one before. */
export const TICK_STEPS = [1, 2, 2.5, 5, 10] as const;
/** The same for whole numbers under ten (a count has no 2.5): each at most twice the one before. */
export const WHOLE_STEPS = [1, 2, 4, 5, 10] as const;

/** A float cleaned of binary noise (0.1 + 0.2), so ticks print as round numbers. */
const clean = (v: number) => Number(v.toPrecision(12));

export interface Scale {
  top: number;
  step: number;
  ticks: number[];
}
const scale = (step: number, count: number): Scale => ({
  top: clean(step * count),
  step,
  ticks: Array.from({ length: count + 1 }, (_, i) => clean(i * step)),
});

/**
 * A y scale from zero to a round number at or above `max`, in 3 or 4 equal steps of a round size
 * (1, 2, 2.5 or 5 times a power of ten): the gridlines and their labels.
 *
 * Why always 3 or 4: with b the power of ten at or under max / 4, max is in [4b, 40b). The step is
 * the first of b × (1, 2, 2.5, 5, 10) that needs at most 4 steps to reach max (10b always does).
 * If it's b itself, max ≥ 4b needs exactly 4. Otherwise the size before it, p, needed more than 4
 * (max > 4p), and the step is at most 2p (`TICK_STEPS`), so max > 2 × step: at least 3.
 *
 * `whole`: the values are whole numbers (a count), so the ticks are too: where the step above
 * would be a fraction (max under 40), it is the first of 1, 2, 4, 5, 10 that reaches max in at most
 * 4 steps instead, by the same argument (`WHOLE_STEPS`), and never fewer than 3 steps (a count of 1
 * or 2 gets room above it).
 */
export function niceScale(max: number, whole = false): Scale {
  const m = Number.isFinite(max) && max > 0 ? max : 1;
  const base = 10 ** Math.floor(Math.log10(m / 4));
  for (const size of TICK_STEPS) {
    const step = clean(size * base);
    const count = Math.ceil(m / step - 1e-9);
    if (count > 4) continue;
    if (!whole || Number.isInteger(step)) return scale(step, count);
    for (const one of WHOLE_STEPS) {
      const steps = Math.max(3, Math.ceil(m / one - 1e-9));
      if (steps <= 4) return scale(one, steps);
    }
  }
  // Unreachable: 10 × base always reaches max in under 4 steps.
  return { top: m, step: m, ticks: [0, m] };
}

/** How many decimals show a tick step exactly (2.5 → 1, 0.25 → 2, 20 → 0), at most 3. */
export function decimalsOf(step: number): number {
  for (let d = 0; d < 3; d++) if (Math.abs(step * 10 ** d - Math.round(step * 10 ** d)) < 1e-9) return d;
  return 3;
}

export type Point = [x: number, y: number];

/**
 * The cubic Bézier segments of a smooth line through the points (x ascending): each `[c1, c2, end]`.
 * Monotone (Fritsch and Carlson's tangents, as harmonic means): between two points the curve never
 * leaves the range of their values, so a smooth line can't dip under zero or bulge over a peak
 * that isn't in the data. Both control points of a segment are within its two values (a tangent is
 * at most 3 times the segment's slope), and a Bézier curve stays within its control points.
 */
export function smoothSegments(points: Point[]): [Point, Point, Point][] {
  const n = points.length;
  if (n < 2) return [];
  const slope = Array.from({ length: n - 1 }, (_, i) => {
    const dx = points[i + 1]![0] - points[i]![0];
    return dx === 0 ? 0 : (points[i + 1]![1] - points[i]![1]) / dx;
  });
  const tangent = points.map((_, i) => {
    if (i === 0) return slope[0]!;
    if (i === n - 1) return slope[n - 2]!;
    const a = slope[i - 1]!;
    const b = slope[i]!;
    // A peak, a dip or a flat stretch: level there, so the curve turns at the point itself.
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  });
  return slope.map((_, i) => {
    const [x0, y0] = points[i]!;
    const [x1, y1] = points[i + 1]!;
    const third = (x1 - x0) / 3;
    return [
      [x0 + third, y0 + tangent[i]! * third],
      [x1 - third, y1 - tangent[i + 1]! * third],
      [x1, y1],
    ];
  });
}

const fixed = (v: number) => Number(v.toFixed(3));
/** An SVG path through the points, smooth (`smoothSegments`). `join`: start with a line to the first point, to continue a path. */
export function smoothPath(points: Point[], join = false): string {
  if (!points.length) return "";
  const [x, y] = points[0]!;
  const start = `${join ? "L" : "M"}${fixed(x)},${fixed(y)}`;
  return [
    start,
    ...smoothSegments(points).map(
      ([a, b, c]) => `C${fixed(a[0])},${fixed(a[1])} ${fixed(b[0])},${fixed(b[1])} ${fixed(c[0])},${fixed(c[1])}`,
    ),
  ].join(" ");
}

/**
 * How the points sit on the x axis: `slot` is the room between two points, as a share of the axis
 * (percent), and `edge` how far the first and last points are from its ends, in slots. Bars stand
 * in the middle of their slots (half a slot from each end); a line's points run end to end.
 */
export interface Axis {
  slot: number;
  edge: number;
}
export function axisOf(count: number, bars: boolean): Axis {
  if (bars) return { slot: count > 0 ? 100 / count : 100, edge: 0.5 };
  return count > 1 ? { slot: 100 / (count - 1), edge: 0 } : { slot: 100, edge: 0.5 };
}
/** Where point `i` is on the axis, in percent. */
export const pointAt = (i: number, axis: Axis) => (i + axis.edge) * axis.slot;

/**
 * Which of `count` x labels show at this step: every `step`-th, counted back from the last, so the
 * latest point is always labelled and the labels are evenly spaced.
 */
export function shownLabels(count: number, step: number): number[] {
  const k = Math.max(1, Math.floor(step));
  const out: number[] = [];
  for (let i = count - 1; i >= 0; i -= k) out.unshift(i);
  return out;
}

/**
 * The room a label has on the axis (percent) when every `step`-th of `count` points is labelled:
 * (2 × step + 2 × edge) / 3 slots, and never more than an equal share of the axis.
 * A label is centred on its point, except the first and the last, which are pushed in to stay on
 * the axis; a third of the way to the next label is given up so a pushed-in label can't reach a
 * centred one, and the equal share keeps two pushed-in labels apart.
 */
export function labelRoom(count: number, step: number, bars: boolean): number {
  const axis = axisOf(count, bars);
  const k = Math.max(1, Math.floor(step));
  return Math.min(((2 * k + 2 * axis.edge) / 3) * axis.slot, 100 / Math.max(1, Math.ceil(count / k)));
}

/**
 * Every how many points an x label shows, so the widest label fits the room a label has
 * (`labelRoom`): `width` is the axis' and `widest` the widest label's, in px; `gap` is the space
 * kept between two labels. The smallest step that fits; when not even one label does, only the
 * latest point is labelled.
 */
export function labelStep(count: number, bars: boolean, width: number, widest: number, gap = 8): number {
  for (let step = 1; step < count; step++)
    if ((labelRoom(count, step, bars) / 100) * width >= widest + gap) return step;
  return Math.max(1, count);
}

export interface LabelBox {
  /** The point it labels. */
  index: number;
  /** Its box on the axis, in percent from the start. */
  from: number;
  to: number;
  /** How its text sits in the box: centred on its point, or against the axis' end it was pushed in from. */
  align: "start" | "center" | "end";
}

/**
 * The box of each shown label: `labelRoom` wide, centred on its point, pushed in where it would
 * leave the axis. No two overlap, and none leaves the axis: so a label is never drawn over another
 * or cut by the chart's edge, whatever the labels say (a label longer than its box ends in "…").
 */
export function labelBoxes(count: number, step: number, bars: boolean): LabelBox[] {
  const axis = axisOf(count, bars);
  const k = Math.max(1, Math.floor(step));
  const half = labelRoom(count, k, bars) / 2;
  return shownLabels(count, k).map((index) => {
    const x = pointAt(index, axis);
    const from = Math.min(Math.max(0, x - half), 100 - 2 * half);
    const align = x - half < -1e-9 ? "start" : x + half > 100 + 1e-9 ? "end" : "center";
    return { index, from, to: from + 2 * half, align };
  });
}
