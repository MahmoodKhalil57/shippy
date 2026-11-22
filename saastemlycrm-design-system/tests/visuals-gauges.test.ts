import { describe, expect, it } from "vite-plus/test";
import {
  apportion,
  bandsOf,
  cellCounts,
  foldParts,
  fraction,
  indexAt,
  percentOf,
  sharePercents,
  zonesOf,
  type ZoneTone,
} from "../src/components/primitives/data/visual-math.ts";

/**
 * The data visuals' arithmetic (src/components/primitives/data/visual-math.ts: `<ui-bullet>`,
 * `<ui-dial>`, `<ui-waffle>`, `<ui-share-bar>`), proved over every case of small finite domains,
 * not samples: every value vector, every threshold set, every zone list in the range.
 */

/** Every vector of `length` values drawn from `values`. */
const vectors = (length: number, values: number[]): number[][] =>
  length === 0 ? [[]] : vectors(length - 1, values).flatMap((v) => values.map((x) => [...v, x]));
/** Every subset of `xs`, in order. */
const subsets = <T>(xs: T[]): T[][] => xs.reduce<T[][]>((all, x) => [...all, ...all.map((s) => [...s, x])], [[]]);

const sum = (xs: number[]) => xs.reduce((t, x) => t + x, 0);

describe("fraction", () => {
  it("is in [0, 1], 0 at min, 1 at max, monotone in the value, for every integer range in 0..6", () => {
    const bad: string[] = [];
    for (let min = 0; min <= 6; min++)
      for (let max = 0; max <= 6; max++) {
        let before = -1;
        for (let v = -2; v <= 8; v++) {
          const f = fraction(v, min, max);
          if (f < 0 || f > 1) bad.push(`${v} in ${min}..${max}: ${f}`);
          if (max <= min && f !== 0) bad.push(`${v} in empty ${min}..${max}: ${f}`);
          if (max > min && f < before) bad.push(`${v} in ${min}..${max}: not monotone`);
          if (max > min && v === min && f !== 0) bad.push(`min ${min}..${max}: ${f}`);
          if (max > min && v === max && f !== 1) bad.push(`max ${min}..${max}: ${f}`);
          before = f;
        }
      }
    expect(bad).toEqual([]);
    expect(fraction(Number.NaN, 0, 1)).toBe(0);
  });

  it("percentOf is the rounded share, or null with no whole", () => {
    for (let a = -3; a <= 12; a++)
      for (let b = -2; b <= 12; b++) expect(percentOf(a, b)).toBe(b > 0 ? Math.round((a / b) * 100) : null);
  });
});

describe("apportion (largest remainder)", () => {
  it("sums to the total and keeps each part within a cell of its exact share, for every vector", () => {
    const bad: string[] = [];
    for (let n = 1; n <= 4; n++)
      for (const v of vectors(n, [0, 1, 2, 3, 5]))
        for (let total = 0; total <= 12; total++) {
          const out = apportion(v, total);
          const s = sum(v);
          const at = `${v.join(",")}→${total}: ${out.join(",")}`;
          if (out.length !== v.length) bad.push(`${at} length`);
          if (s === 0 || total === 0) {
            if (out.some((x) => x !== 0)) bad.push(`${at} not all 0`);
            continue;
          }
          if (sum(out) !== total) bad.push(`${at} sums to ${sum(out)}`);
          v.forEach((x, i) => {
            const exact = (x / s) * total;
            if (out[i]! < Math.floor(exact) || out[i]! > Math.ceil(exact)) bad.push(`${at} part ${i}`);
            if (x === 0 && out[i] !== 0) bad.push(`${at} a zero part got cells`);
          });
          // Equal values never get counts more than one apart, and the earlier one never fewer.
          v.forEach((x, i) =>
            v.forEach((y, j) => {
              if (x === y && i < j && out[i]! < out[j]!) bad.push(`${at} tie went to the later part`);
            }),
          );
        }
    expect(bad).toEqual([]);
  });

  it("shares in whole percents add up to 100", () => {
    for (let n = 1; n <= 4; n++) for (const v of vectors(n, [1, 2, 3, 7])) expect(sum(sharePercents(v))).toBe(100);
  });
});

describe("cellCounts (the waffle)", () => {
  it("fills the whole's share of the cells exactly, for every vector and whole", () => {
    const bad: string[] = [];
    for (let n = 1; n <= 3; n++)
      for (const v of vectors(n, [0, 1, 3, 4]))
        for (let whole = 0; whole <= 14; whole++)
          for (const cells of [10, 100]) {
            const out = cellCounts(v, whole, cells);
            const s = sum(v);
            const of = Math.max(s, whole);
            const want = of > 0 ? Math.round((s / of) * cells) : 0;
            if (sum(out) !== want) bad.push(`${v.join(",")} of ${whole} in ${cells}: ${out.join(",")}`);
            if (sum(out) > cells) bad.push(`${v.join(",")} of ${whole}: overflows`);
          }
    expect(bad).toEqual([]);
  });
});

describe("foldParts", () => {
  it("keeps at most six hues in order, folds the rest into a muted Other, and loses nothing", () => {
    const bad: string[] = [];
    for (let n = 0; n <= 8; n++)
      for (const v of vectors(n, [0, 1, 2])) {
        const parts = v.map((value, i) => ({ label: `p${i}`, value }));
        const out = foldParts(parts);
        const positive = parts.filter((p) => p.value > 0);
        const at = `${v.join(",")}`;
        if (out.length > 6) bad.push(`${at}: ${out.length} hues`);
        if (sum(out.map((o) => o.part.value)) !== sum(v)) bad.push(`${at}: sum changed`);
        const folds = positive.length > 6;
        out.forEach((o, i) => {
          const last = i === out.length - 1;
          if (folds && last) {
            if (o.slot !== "muted" || !o.other || o.part.label !== "Other") bad.push(`${at}: no Other`);
          } else {
            if (o.slot !== String(i) || o.other) bad.push(`${at}: slot ${o.slot} at ${i}`);
            if (o.part !== positive[i]) bad.push(`${at}: order at ${i}`);
          }
        });
        if (!folds && out.length !== positive.length) bad.push(`${at}: dropped a part`);
      }
    expect(bad).toEqual([]);
  });
});

describe("bandsOf (the bullet's bands)", () => {
  it("tiles the range from 0 to 1, poor to good (or back), for every threshold set in -1..11", () => {
    const bad: string[] = [];
    const grid = [-1, 0, 2, 5, 5, 8, 10, 11];
    for (const t of subsets(grid))
      for (const lower of [false, true]) {
        const bands = bandsOf(t, 0, 10, lower);
        const inside = [...new Set(t.filter((x) => x > 0 && x < 10))];
        const at = `[${t.join(",")}] lower=${lower}`;
        if (!inside.length) {
          if (bands.length) bad.push(`${at}: bands without thresholds`);
          continue;
        }
        if (bands.length !== Math.min(2, inside.length) + 1) bad.push(`${at}: ${bands.length} bands`);
        if (bands[0]!.from !== 0 || bands.at(-1)!.end !== 1) bad.push(`${at}: doesn't span the range`);
        bands.forEach((b, i) => {
          if (!(b.from < b.end)) bad.push(`${at}: empty band ${i}`);
          if (i > 0 && bands[i - 1]!.end !== b.from) bad.push(`${at}: gap before ${i}`);
        });
        const good = lower ? bands[0]! : bands.at(-1)!;
        const poor = lower ? bands.at(-1)! : bands[0]!;
        if (good.quality !== "good" || poor.quality !== "poor") bad.push(`${at}: ends ${poor.quality}/${good.quality}`);
        // Every point of the range is in exactly the band whose edges hold it.
        for (let k = 0; k <= 20; k++) {
          const f = k / 20;
          const i = indexAt(bands, f);
          const b = bands[i];
          if (!b || f < b.from || f > b.end || (f === b.end && i !== bands.length - 1)) bad.push(`${at}: ${f} in ${i}`);
        }
      }
    expect(bad).toEqual([]);
    expect(bandsOf([3], 5, 5)).toEqual([]);
  });
});

describe("zonesOf (the dial's zones)", () => {
  it("lays every zone list end to end, ascending, inside the range", () => {
    const tones: ZoneTone[] = ["success", "warning", "error"];
    const bad: string[] = [];
    for (let n = 0; n <= 3; n++)
      for (const tos of vectors(n, [-1, 0, 3, 6, 10, 12]))
        for (const min of [0, 3]) {
          const zones = zonesOf(
            tos.map((to, i) => ({ to, tone: tones[i % 3]! })),
            min,
            10,
          );
          const at = `[${tos.join(",")}] from ${min}`;
          let low = min;
          let end = 0;
          for (const z of zones) {
            if (z.low !== low) bad.push(`${at}: starts at ${z.low}, not ${low}`);
            if (!(z.high > z.low) || z.high > 10) bad.push(`${at}: zone ${z.low}–${z.high}`);
            if (z.from !== end || !(z.end > z.from) || z.end > 1) bad.push(`${at}: fractions ${z.from}–${z.end}`);
            low = z.high;
            end = z.end;
          }
          // What's covered reaches the largest `to` in the range (clipped to max).
          const reach = Math.min(10, Math.max(min, ...tos));
          if (low !== reach) bad.push(`${at}: reaches ${low}, not ${reach}`);
        }
    expect(bad).toEqual([]);
    expect(zonesOf([{ to: 5, tone: "error" }], 10, 10)).toEqual([]);
  });
});
