import { describe, it, expect } from "vite-plus/test";
import { bridge, bridgeAt, bridgeDomain, bridgeFit } from "./waterfall";

describe("bridge", () => {
  it("runs a cumulative total with up, down and total columns", () => {
    expect(bridge([{ value: 10 }, { value: -4 }, { value: 0, total: true }, { value: 0 }])).toEqual([
      { kind: "up", from: 0, to: 10, run: 10 },
      { kind: "down", from: 10, to: 6, run: 6 },
      { kind: "total", from: 0, to: 6, run: 6 },
      { kind: "up", from: 6, to: 6, run: 6 },
    ]);
    expect(bridge([])).toEqual([]);
  });
});

describe("bridgeDomain", () => {
  it("always includes zero", () => {
    expect(bridgeDomain(bridge([{ value: 5 }, { value: 3 }]))).toEqual([0, 8]);
    expect(bridgeDomain(bridge([{ value: -5 }, { value: 2 }]))).toEqual([-5, 0]);
  });

  it("widens an empty or flat domain", () => {
    expect(bridgeDomain([])).toEqual([0, 1]);
    expect(bridgeDomain(bridge([{ value: 0 }]))).toEqual([0, 1]);
  });
});

describe("bridgeFit", () => {
  it("fits positive levels without going below zero", () => {
    expect(bridgeFit(bridge([{ value: 100 }, { value: 20 }]))).toEqual([95, 121.25]);
    expect(bridgeFit(bridge([{ value: 2 }, { value: 100 }]))).toEqual([0, 108.25]);
  });

  it("fits negative levels without going above zero", () => {
    expect(bridgeFit(bridge([{ value: -100 }, { value: -20 }]))).toEqual([-125, -98.75]);
    expect(bridgeFit(bridge([{ value: -100 }, { value: 99 }]))).toEqual([-124.75, 0]);
  });

  it("pads a single level by its magnitude, or by one at zero", () => {
    expect(bridgeFit(bridge([{ value: 40 }]))).toEqual([30, 42.5]);
    expect(bridgeFit(bridge([{ value: 0 }]))).toEqual([-0.25, 0.0625]);
    expect(bridgeFit([])).toEqual([0, 1]);
  });
});

describe("bridgeAt", () => {
  it("maps a value to a percentage of the domain", () => {
    expect(bridgeAt(5, [0, 10])).toBe(50);
    expect(bridgeAt(-10, [-10, 10])).toBe(0);
    expect(bridgeAt(20, [0, 10])).toBe(200);
  });
});
