import { intl, m } from "../../../i18n/index.ts";

/**
 * The arithmetic the data visuals share (`<ui-bullet>`, `<ui-dial>`, `<ui-waffle>`,
 * `<ui-share-bar>`): where a value sits in its range, which band or zone it's in, how a whole
 * splits into whole cells or whole percents, and how parts fold into six hues. Pure, no DOM, so
 * tests/visuals-gauges.test.ts proves it over every case of small finite domains.
 */

/** A hue of the chart palette, in its fixed order, or the muted "Other". */
export type Slot = "0" | "1" | "2" | "3" | "4" | "5" | "muted";

/** A slot's hue as a CSS colour (the palette's runtime variables), at full strength or faded. */
export const slotColor = (slot: Slot, faded = false) => {
  const c = slot === "muted" ? "var(--chart-muted)" : `var(--chart-${Number(slot) + 1})`;
  return faded ? `color-mix(in oklab, ${c} 30%, transparent)` : c;
};

/** The empty track's colour (the highest container), as a CSS colour. */
export const TRACK = "color-mix(in oklab, var(--color-base-100), var(--color-base-content) 10%)";

/** Where `value` sits between `min` and `max`, from 0 to 1 (0 for an empty or broken range). */
export function fraction(value: number, min: number, max: number): number {
  const span = max - min;
  if (!Number.isFinite(value) || !Number.isFinite(span) || span <= 0) return 0;
  return Math.min(1, Math.max(0, (value - min) / span));
}

/** A whole percent (0 to 100) written the language's way ("42%"). */
export const percentText = (p: number) => intl.number({ style: "percent", maximumFractionDigits: 0 }).format(p / 100);

/** `a` as a whole percent of `b`, or null when `b` isn't positive. */
export const percentOf = (a: number, b: number): number | null =>
  b > 0 && Number.isFinite(a) && Number.isFinite(b) ? Math.round((a / b) * 100) : null;

/**
 * Whole numbers summing to `total`, each the floor or the ceiling of its exact share of it
 * (largest remainder; ties go to the earlier part). Negative or broken values count as 0; with
 * nothing to share, all 0.
 */
export function apportion(values: number[], total: number): number[] {
  const v = values.map((x) => (Number.isFinite(x) && x > 0 ? x : 0));
  const sum = v.reduce((t, x) => t + x, 0);
  const n = Math.max(0, Math.round(total));
  if (sum <= 0 || n === 0) return v.map(() => 0);
  const exact = v.map((x) => (x / sum) * n);
  const out = exact.map(Math.floor);
  let left = n - out.reduce((t, x) => t + x, 0);
  const order = exact.map((x, i) => [x - Math.floor(x), i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (const [, i] of order) {
    if (left <= 0) break;
    out[i]! += 1;
    left -= 1;
  }
  return out;
}

/** Each part's share of the parts' sum, in whole percents that add up to 100. */
export const sharePercents = (values: number[]) => apportion(values, 100);

/**
 * The cells of a grid of `cells` each part fills: as many as its share of the whole (`whole`, or
 * the parts' sum when that's more), rounded so the filled cells are the whole's share exactly.
 */
export function cellCounts(values: number[], whole: number, cells = 100): number[] {
  const v = values.map((x) => (Number.isFinite(x) && x > 0 ? x : 0));
  const sum = v.reduce((t, x) => t + x, 0);
  const of = Math.max(sum, Number.isFinite(whole) ? whole : 0);
  if (of <= 0) return v.map(() => 0);
  return apportion(v, Math.round((sum / of) * cells));
}

export interface Folded<T> {
  part: T | { label: string; value: number };
  slot: Slot;
  /** It stands for several parts (the seventh and later): "Other". */
  other: boolean;
}

/**
 * At most `most` hues: the parts with a positive value in their own order, and when there are
 * more than `most`, the first `most - 1` and one "Other" (muted) holding the rest.
 */
export function foldParts<T extends { label: string; value: number }>(parts: T[], most = 6): Folded<T>[] {
  const p = parts.filter((x) => Number.isFinite(x.value) && x.value > 0);
  const hue = (i: number) => String(i) as Slot;
  if (p.length <= most) return p.map((part, i) => ({ part, slot: hue(i), other: false }));
  const rest = p.slice(most - 1).reduce((t, x) => t + x.value, 0);
  return [
    ...p.slice(0, most - 1).map((part, i) => ({ part, slot: hue(i), other: false })),
    { part: { label: m.visual_other(), value: rest }, slot: "muted", other: true },
  ];
}

export type Quality = "poor" | "ok" | "good";

export interface Band {
  /** Its edges, as fractions of the range (0 to 1). */
  from: number;
  end: number;
  /** Its value bounds, in the measure's own units. */
  low: number;
  high: number;
  quality: Quality;
}

/**
 * A bullet graph's qualitative bands: up to two thresholds strictly inside the range, ascending
 * and distinct (others are dropped), split it into poor / ok / good (two bands: poor / good), the
 * good end at the top unless lower is better. No thresholds: no bands.
 */
export function bandsOf(thresholds: number[], min: number, max: number, lowerIsBetter = false): Band[] {
  if (!(max > min)) return [];
  const t = [...new Set(thresholds.filter((x) => Number.isFinite(x) && x > min && x < max))]
    .sort((a, b) => a - b)
    .slice(0, 2);
  if (!t.length) return [];
  const edges = [min, ...t, max];
  const qualities: Quality[] = t.length === 1 ? ["poor", "good"] : ["poor", "ok", "good"];
  if (lowerIsBetter) qualities.reverse();
  return qualities.map((quality, i) => ({
    from: fraction(edges[i]!, min, max),
    end: fraction(edges[i + 1]!, min, max),
    low: edges[i]!,
    high: edges[i + 1]!,
    quality,
  }));
}

/** The band or zone a fraction of the range falls in (its upper edge belongs to the next; 1 to the last), or -1. */
export function indexAt(spans: { from: number; end: number }[], f: number): number {
  const i = spans.findIndex((s) => f >= s.from && f < s.end);
  if (i >= 0) return i;
  const last = spans.length - 1;
  return last >= 0 && f === spans[last]!.end ? last : -1;
}

export type ZoneTone = "success" | "warning" | "error";

export interface Zone {
  /** Its upper bound, in the measure's units; it starts where the one before it ends (or at `min`). */
  to: number;
  tone: ZoneTone;
  /** What it means ("On track"); left out, its range. */
  label?: string;
}

export interface DrawnZone extends Zone {
  /** Its start, as a fraction of the range. */
  from: number;
  /** Its end, as a fraction of the range. */
  end: number;
  low: number;
  high: number;
}

/**
 * A dial's zones on its range: in ascending order of `to`, each from the one before (or `min`) to
 * its own `to`, clipped to the range; one that ends where the last ended or before `min` adds
 * nothing and is dropped. Past the last zone the track shows.
 */
export function zonesOf(zones: Zone[], min: number, max: number): DrawnZone[] {
  if (!(max > min)) return [];
  const out: DrawnZone[] = [];
  let low = min;
  for (const z of [...zones].filter((z) => Number.isFinite(z.to)).sort((a, b) => a.to - b.to)) {
    const high = Math.min(max, z.to);
    if (high <= low) continue;
    out.push({ ...z, from: fraction(low, min, max), end: fraction(high, min, max), low, high });
    low = high;
  }
  return out;
}
