import { describe, expect, it } from "vite-plus/test";
import {
  TICK_STEPS,
  WHOLE_STEPS,
  axisOf,
  decimalsOf,
  labelBoxes,
  labelRoom,
  labelStep,
  pointAt,
  niceScale,
  shownLabels,
  smoothPath,
  smoothSegments,
  type Point,
} from "../src/components/base/chart.ts";

/**
 * The chart's arithmetic (src/components/base/chart.ts). Each rule is argued in its doc comment;
 * here the argument's premises are checked, and the rule itself over a finite domain, whole.
 */

describe("the y scale", () => {
  it("rests on step sizes that at most double (so 3 or 4 steps always reach the top)", () => {
    expect(TICK_STEPS[0]).toBe(1);
    expect(TICK_STEPS.at(-1)).toBe(10);
    for (let i = 1; i < TICK_STEPS.length; i++) expect(TICK_STEPS[i]! / TICK_STEPS[i - 1]!).toBeLessThanOrEqual(2);
    expect(WHOLE_STEPS[0]).toBe(1);
    expect(WHOLE_STEPS.at(-1)).toBe(10);
    for (let i = 1; i < WHOLE_STEPS.length; i++) {
      expect(Number.isInteger(WHOLE_STEPS[i])).toBe(true);
      expect(WHOLE_STEPS[i]! / WHOLE_STEPS[i - 1]!).toBeLessThanOrEqual(2);
    }
  });

  it("gives whole numbers whole ticks, still in 3 or 4 steps: every whole number to 10,000", () => {
    const bad: string[] = [];
    for (let max = 1; max <= 10_000; max++) {
      const { top, step, ticks } = niceScale(max, true);
      const steps = ticks.length - 1;
      // A count of 1 or 2 has room above it; from 3 on the top is the first tick at or above max.
      const tight = max < 3 || top - step < max;
      if ((steps !== 3 && steps !== 4) || !ticks.every(Number.isInteger) || ticks[0] !== 0 || top < max || !tight)
        bad.push(`${max}: ${ticks.join(", ")}`);
      // Above the counts that would get a fraction, it's the same scale as any number's.
      if (max >= 40 && niceScale(max).step !== step) bad.push(`${max}: not the usual step`);
    }
    expect(bad).toEqual([]);
    expect(niceScale(9, true).ticks).toEqual([0, 4, 8, 12]);
    expect(niceScale(9).ticks).toEqual([0, 2.5, 5, 7.5, 10]);
    expect(niceScale(1, true).ticks).toEqual([0, 1, 2, 3]);
  });

  it("has 3 or 4 round steps from zero to just above the largest value: every whole number to 10,000, and each a thousandth and a thousand times", () => {
    const bad: string[] = [];
    for (const scale of [0.001, 1, 1000])
      for (let n = 1; n <= 10_000; n++) {
        const max = n * scale;
        const { top, step, ticks } = niceScale(max);
        const steps = ticks.length - 1;
        const mantissa = step / 10 ** Math.floor(Math.log10(step) + 1e-9);
        const round = TICK_STEPS.some((s) => Math.abs(mantissa - s) < 1e-6);
        if (
          (steps !== 3 && steps !== 4) ||
          !round ||
          ticks[0] !== 0 ||
          Math.abs(ticks.at(-1)! - top) > 1e-9 * top ||
          top < max * (1 - 1e-9) ||
          top - step >= max * (1 + 1e-9)
        )
          bad.push(`${max}: ${ticks.join(", ")}`);
      }
    expect(bad).toEqual([]);
  });

  it("gives a scale to nothing at all", () => {
    for (const max of [0, -3, Number.NaN, Number.POSITIVE_INFINITY])
      expect(niceScale(max).ticks).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it("prints a step with the decimals it needs", () => {
    expect([20, 2.5, 0.25, 0.5, 1, 0.125].map(decimalsOf)).toEqual([0, 1, 2, 1, 0, 3]);
  });
});

describe("the smooth line", () => {
  /** Every sequence of exactly `length` values from `values`. */
  const sequences = (values: number[], length: number): number[][] =>
    length === 0 ? [[]] : sequences(values, length - 1).flatMap((s) => values.map((v) => [...s, v]));

  it("never leaves the range of the two points it runs between: every sequence of up to 6 values from five levels", () => {
    const all = [0, 1, 2, 3, 4, 5, 6].flatMap((length) => sequences([0, 1, 2, 5, 40], length));
    expect(all.length).toBe(1 + 5 + 25 + 125 + 625 + 3125 + 15625);
    const bad: string[] = [];
    for (const values of all) {
      const points: Point[] = values.map((v, i) => [i * 10, v]);
      const segments = smoothSegments(points);
      if (segments.length !== Math.max(0, points.length - 1)) bad.push(`${values.join()}: ${segments.length} segments`);
      segments.forEach(([c1, c2, end], i) => {
        const [lo, hi] = [Math.min(values[i]!, values[i + 1]!), Math.max(values[i]!, values[i + 1]!)];
        const inside = (y: number) => y >= lo - 1e-9 && y <= hi + 1e-9;
        if (!inside(c1[1]) || !inside(c2[1]) || end[1] !== values[i + 1] || !(c1[0] <= c2[0]))
          bad.push(`${values.join()} @${i}`);
      });
    }
    expect(bad).toEqual([]);
  });

  it("writes a path through the points", () => {
    expect(smoothPath([])).toBe("");
    expect(smoothPath([[0, 5]])).toBe("M0,5");
    expect(
      smoothPath([
        [0, 0],
        [30, 30],
      ]),
    ).toBe("M0,0 C10,10 20,20 30,30");
    expect(
      smoothPath(
        [
          [0, 0],
          [30, 30],
        ],
        true,
      ),
    ).toMatch(/^L0,0 C/);
  });
});

describe("the x labels", () => {
  it("always label the latest point, evenly, each once: every count to 60 at every step", () => {
    const bad: string[] = [];
    for (let count = 0; count <= 60; count++)
      for (let step = 1; step <= 61; step++) {
        const shown = shownLabels(count, step);
        const even = shown.every((i, at) => at === 0 || i - shown[at - 1]! === step);
        const whole = shown.length === Math.ceil(count / step);
        if ((count > 0 && shown.at(-1) !== count - 1) || !even || !whole || shown.some((i) => i < 0 || i >= count))
          bad.push(`${count} by ${step}: ${shown.join()}`);
      }
    expect(bad).toEqual([]);
  });

  it("show only as many as fit: a label's room holds the widest label and its gap, and no smaller step would: every count to 40, on axes of 40 to 640px, for bars and lines", () => {
    const bad: string[] = [];
    for (const bars of [true, false])
      for (let count = 1; count <= 40; count++)
        for (let width = 40; width <= 640; width += 40)
          for (let widest = 0; widest <= 120; widest += 4) {
            const step = labelStep(count, bars, width, widest);
            const fits = (k: number) => (labelRoom(count, k, bars) / 100) * width >= widest + 8;
            // The smallest step that fits; when none does, the latest point alone.
            const none = !Array.from({ length: count }, (_, i) => i + 1).some(fits);
            if (none ? step !== count : !fits(step) || (step > 1 && fits(step - 1)))
              bad.push(`${bars ? "bars" : "line"} ${count} in ${width} / ${widest}: ${step}`);
          }
    expect(bad).toEqual([]);
  });

  it("each sit in a box of their own on the axis, as wide as their room: every count to 60 at every step, for bars and lines", () => {
    const bad: string[] = [];
    for (const bars of [true, false])
      for (let count = 1; count <= 60; count++)
        for (let step = 1; step <= count; step++) {
          const axis = axisOf(count, bars);
          const boxes = labelBoxes(count, step, bars);
          const room = labelRoom(count, step, bars);
          const where = `${bars ? "bars" : "line"} ${count} by ${step}`;
          boxes.forEach((box, at) => {
            const x = pointAt(box.index, axis);
            const before = boxes[at - 1];
            // On the axis, as wide as the room a label has, and over its own point.
            if (box.from < -1e-9 || box.to > 100 + 1e-9) bad.push(`${where}: ${box.index} leaves the axis`);
            if (Math.abs(box.to - box.from - room) > 1e-9) bad.push(`${where}: ${box.index} isn't ${room} wide`);
            if (x < box.from - 1e-9 || x > box.to + 1e-9) bad.push(`${where}: ${box.index} isn't over its point`);
            // Centred on its point unless it was pushed in from an end.
            if (box.align === "center" && Math.abs((box.from + box.to) / 2 - x) > 1e-9)
              bad.push(`${where}: ${box.index} off centre`);
            if (before && before.to > box.from + 1e-9) bad.push(`${where}: ${before.index} and ${box.index} overlap`);
          });
          if (boxes.at(-1)?.index !== count - 1) bad.push(`${where}: the latest isn't labelled`);
        }
    expect(bad).toEqual([]);
  });
});
