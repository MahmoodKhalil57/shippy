import { describe, it, expect } from "vite-plus/test";
import {
  axisOf,
  decimalsOf,
  labelBoxes,
  labelRoom,
  labelStep,
  niceScale,
  pointAt,
  shownLabels,
  smoothPath,
  smoothSegments,
} from "./chart";

describe("niceScale", () => {
  it("picks a 1-2-2.5-5-10 step with at most four intervals", () => {
    expect(niceScale(100)).toEqual({ top: 100, step: 25, ticks: [0, 25, 50, 75, 100] });
    expect(niceScale(7)).toEqual({ top: 8, step: 2, ticks: [0, 2, 4, 6, 8] });
    expect(niceScale(4)).toEqual({ top: 4, step: 1, ticks: [0, 1, 2, 3, 4] });
    expect(niceScale(0.3)).toEqual({ top: 0.3, step: 0.1, ticks: [0, 0.1, 0.2, 0.3] });
    expect(niceScale(39_000)).toEqual({ top: 40_000, step: 10_000, ticks: [0, 10_000, 20_000, 30_000, 40_000] });
  });

  it("treats zero, negative and non-finite maxima as one", () => {
    const one = niceScale(1);
    expect(one.top).toBe(1);
    for (const v of [0, -5, NaN, Infinity]) expect(niceScale(v)).toEqual(one);
  });

  it("keeps whole-number scales on integer steps with at least three intervals", () => {
    expect(niceScale(9, true)).toEqual({ top: 12, step: 4, ticks: [0, 4, 8, 12] });
    expect(niceScale(2, true)).toEqual({ top: 3, step: 1, ticks: [0, 1, 2, 3] });
    expect(niceScale(0.5, true)).toEqual({ top: 3, step: 1, ticks: [0, 1, 2, 3] });
    expect(niceScale(100, true).step).toBe(25);
  });

  it("falls back to a single interval when the step underflows", () => {
    expect(niceScale(Number.MIN_VALUE)).toEqual({
      top: Number.MIN_VALUE,
      step: Number.MIN_VALUE,
      ticks: [0, Number.MIN_VALUE],
    });
  });
});

describe("decimalsOf", () => {
  it("counts the decimals a step needs, up to three", () => {
    expect(decimalsOf(5)).toBe(0);
    expect(decimalsOf(2.5)).toBe(1);
    expect(decimalsOf(0.25)).toBe(2);
    expect(decimalsOf(0.1 + 0.2)).toBe(1);
    expect(decimalsOf(0.0001)).toBe(3);
  });
});

describe("smoothSegments", () => {
  it("needs two points", () => {
    expect(smoothSegments([])).toEqual([]);
    expect(smoothSegments([[0, 0]])).toEqual([]);
  });

  it("follows a straight line exactly", () => {
    expect(
      smoothSegments([
        [0, 0],
        [3, 3],
        [6, 6],
      ]),
    ).toEqual([
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      [
        [4, 4],
        [5, 5],
        [6, 6],
      ],
    ]);
  });

  it("flattens tangents at peaks so curves never overshoot", () => {
    const [first, second] = smoothSegments([
      [0, 0],
      [3, 6],
      [6, 0],
    ]);
    expect(first![1]).toEqual([2, 6]);
    expect(second![0]).toEqual([4, 6]);
  });

  it("uses the harmonic mean of neighbouring slopes", () => {
    const [first] = smoothSegments([
      [0, 0],
      [3, 3],
      [6, 9],
    ]);
    expect(first![1][1]).toBeCloseTo(3 - (4 / 3) * 1);
  });

  it("treats vertical steps as flat", () => {
    const [seg] = smoothSegments([
      [1, 0],
      [1, 5],
    ]);
    expect(seg).toEqual([
      [1, 0],
      [1, 5],
      [1, 5],
    ]);
  });
});

describe("smoothPath", () => {
  it("is empty without points", () => {
    expect(smoothPath([])).toBe("");
  });

  it("moves or joins to the first point and rounds to three decimals", () => {
    expect(smoothPath([[1 / 3, 2]])).toBe("M0.333,2");
    expect(
      smoothPath(
        [
          [0, 0],
          [3, 3],
        ],
        true,
      ),
    ).toBe("L0,0 C1,1 2,2 3,3");
  });
});

describe("axisOf and pointAt", () => {
  it("centres bars in equal slots", () => {
    expect(axisOf(4, true)).toEqual({ slot: 25, edge: 0.5 });
    expect(axisOf(0, true)).toEqual({ slot: 100, edge: 0.5 });
    expect(pointAt(0, axisOf(4, true))).toBe(12.5);
  });

  it("spans lines edge to edge, centring a single point", () => {
    expect(axisOf(5, false)).toEqual({ slot: 25, edge: 0 });
    expect(axisOf(1, false)).toEqual({ slot: 100, edge: 0.5 });
    expect(pointAt(4, axisOf(5, false))).toBe(100);
    expect(pointAt(0, axisOf(1, false))).toBe(50);
  });
});

describe("shownLabels", () => {
  it("always keeps the last label and steps back from it", () => {
    expect(shownLabels(5, 1)).toEqual([0, 1, 2, 3, 4]);
    expect(shownLabels(6, 2)).toEqual([1, 3, 5]);
    expect(shownLabels(3, 0.4)).toEqual([0, 1, 2]);
    expect(shownLabels(0, 1)).toEqual([]);
  });
});

describe("labelRoom and labelStep", () => {
  it("gives each label the room between its neighbours", () => {
    expect(labelRoom(4, 1, true)).toBe(25);
    expect(labelRoom(5, 1, false)).toBeCloseTo(50 / 3);
    expect(labelRoom(1, 1, false)).toBe(100);
  });

  it("thins labels until the widest one fits", () => {
    expect(labelStep(10, true, 1000, 50)).toBe(1);
    expect(labelStep(10, true, 1000, 150)).toBe(2);
    expect(labelStep(10, true, 100, 500)).toBe(10);
    expect(labelStep(0, true, 100, 10)).toBe(1);
  });
});

describe("labelBoxes", () => {
  it("keeps every box inside the axis and aligns the edge boxes", () => {
    const boxes = labelBoxes(5, 1, false);
    expect(boxes.map((b) => b.align)).toEqual(["start", "center", "center", "center", "end"]);
    for (const b of boxes) {
      expect(b.from).toBeGreaterThanOrEqual(0);
      expect(b.to).toBeLessThanOrEqual(100 + 1e-9);
    }
    expect(boxes[0]!.from).toBe(0);
    expect(boxes[4]!.to).toBeCloseTo(100);
  });

  it("centres bar labels in their slots", () => {
    expect(labelBoxes(2, 1, true)).toEqual([
      { index: 0, from: 0, to: 50, align: "center" },
      { index: 1, from: 50, to: 100, align: "center" },
    ]);
  });
});
