import { describe, it, expect } from "vite-plus/test";
import { cssTime } from "./css-time";

describe("cssTime", () => {
  it("reads milliseconds", () => {
    expect(cssTime("150ms")).toBe(150);
    expect(cssTime(" 20MS ")).toBe(20);
  });

  it("converts seconds to milliseconds", () => {
    expect(cssTime("0.3s")).toBe(300);
    expect(cssTime("2S")).toBe(2000);
  });

  it("treats a unitless number as milliseconds", () => {
    expect(cssTime("42")).toBe(42);
    expect(cssTime("-5")).toBe(-5);
  });

  it("falls back on unparseable values", () => {
    expect(cssTime("")).toBe(0);
    expect(cssTime("auto", 7)).toBe(7);
    expect(cssTime("NaN", 3)).toBe(3);
  });
});
