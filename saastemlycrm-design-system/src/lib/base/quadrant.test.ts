import { describe, it, expect } from "vite-plus/test";
import { heightOf, median, paddedExtent, position, quadrantOf, sizeStep } from "./quadrant";

describe("median", () => {
  it("handles empty, odd and even lists without mutating", () => {
    expect(median([])).toBe(0);
    const v = [5, 1, 3];
    expect(median(v)).toBe(3);
    expect(v).toEqual([5, 1, 3]);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([-2])).toBe(-2);
  });
});

describe("paddedExtent", () => {
  it("pads by 8% of the range", () => {
    expect(paddedExtent([0, 100])).toEqual([-8, 108]);
  });

  it("pads a flat or empty list by one", () => {
    expect(paddedExtent([5, 5])).toEqual([4, 6]);
    expect(paddedExtent([])).toEqual([0, 1]);
  });
});

describe("position and heightOf", () => {
  it("maps into 0..100 and clamps", () => {
    expect(position(5, [0, 10])).toBe(50);
    expect(position(-5, [0, 10])).toBe(0);
    expect(position(50, [0, 10])).toBe(100);
  });

  it("returns the middle for an empty or invalid domain", () => {
    expect(position(1, [3, 3])).toBe(50);
    expect(position(1, [NaN, 3])).toBe(50);
  });

  it("inverts on request", () => {
    expect(heightOf(2, [0, 10])).toBe(20);
    expect(heightOf(2, [0, 10], true)).toBe(80);
  });
});

describe("quadrantOf", () => {
  it("numbers quadrants top-start, top-end, bottom-start, bottom-end", () => {
    expect(quadrantOf(0, 10, 5, 5)).toBe(0);
    expect(quadrantOf(10, 10, 5, 5)).toBe(1);
    expect(quadrantOf(0, 0, 5, 5)).toBe(2);
    expect(quadrantOf(10, 0, 5, 5)).toBe(3);
    expect(quadrantOf(5, 5, 5, 5)).toBe(1);
  });

  it("flips the vertical axis when inverted", () => {
    expect(quadrantOf(0, 0, 5, 5, true)).toBe(0);
    expect(quadrantOf(10, 10, 5, 5, true)).toBe(3);
    expect(quadrantOf(0, 5, 5, 5, true)).toBe(0);
  });
});

describe("sizeStep", () => {
  it("returns 0 for missing or non-positive inputs", () => {
    expect(sizeStep(undefined, 10)).toBe(0);
    expect(sizeStep(0, 10)).toBe(0);
    expect(sizeStep(-1, 10)).toBe(0);
    expect(sizeStep(NaN, 10)).toBe(0);
    expect(sizeStep(5, 0)).toBe(0);
  });

  it("steps by square-root area and caps at 3", () => {
    expect(sizeStep(10, 10)).toBe(3);
    expect(sizeStep(100, 10)).toBe(3);
    expect(sizeStep(1, 100)).toBe(0);
    expect(sizeStep(25, 100)).toBe(2);
    expect(sizeStep(4, 100)).toBe(1);
  });
});
