import { describe, expect, it } from "vite-plus/test";
import { cssTime } from "../src/components/base/css-time.ts";

/** Every way a motion token can be written, in dev (milliseconds) and after the build's minifier (seconds). */
describe("cssTime", () => {
  it("reads milliseconds and seconds alike", () => {
    const cases: [string, number][] = [
      ["250ms", 250],
      [".25s", 250],
      ["0.25s", 250],
      ["1s", 1000],
      ["1.5s", 1500],
      [" 300ms ", 300],
      ["0s", 0],
      ["0ms", 0],
      ["120", 120],
    ];
    for (const [v, ms] of cases) expect(cssTime(v)).toBeCloseTo(ms, 6);
  });
  it("falls back when there's no value", () => {
    expect(cssTime("", 100)).toBe(100);
    expect(cssTime("none", 7)).toBe(7);
  });
});
