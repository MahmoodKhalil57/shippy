import { describe, it, expect } from "vite-plus/test";
import { figureAt, readFigure, settle } from "./count-up";

describe("readFigure", () => {
  it("splits prefix, number and suffix", () => {
    expect(readFigure("$1,234.50 / mo")).toEqual({
      before: "$",
      value: 1234.5,
      after: " / mo",
      decimals: 2,
      grouped: true,
      minus: false,
    });
  });

  it("reads plain integers", () => {
    expect(readFigure("42")).toEqual({ before: "", value: 42, after: "", decimals: 0, grouped: false, minus: false });
  });

  it("reads hyphen and true minus signs", () => {
    expect(readFigure("-12%")).toMatchObject({ value: -12, after: "%", minus: false });
    expect(readFigure("−3.5")).toMatchObject({ value: -3.5, decimals: 1, minus: true });
  });

  it("returns undefined without digits", () => {
    expect(readFigure("n/a")).toBeUndefined();
    expect(readFigure("")).toBeUndefined();
  });
});

describe("figureAt", () => {
  const money = readFigure("$1,000.00")!;

  it("interpolates and formats like the target", () => {
    expect(figureAt(0, money, 0)).toBe("$0.00");
    expect(figureAt(0, money, 0.5)).toBe("$500.00");
    expect(figureAt(0, money, 1)).toBe("$1,000.00");
  });

  it("clamps progress to 0..1", () => {
    expect(figureAt(0, money, -1)).toBe("$0.00");
    expect(figureAt(0, money, 2)).toBe("$1,000.00");
  });

  it("drops grouping when the target had none", () => {
    expect(figureAt(0, readFigure("5000")!, 1)).toBe("5000");
  });

  it("puts the sign the target used in front of negatives", () => {
    expect(figureAt(0, readFigure("-10 pts")!, 0.5)).toBe("-5 pts");
    expect(figureAt(0, readFigure("−10")!, 1)).toBe("−10");
  });

  it("never shows a negative zero", () => {
    expect(figureAt(-0.001, readFigure("1")!, 0)).toBe("0");
  });
});

describe("settle", () => {
  it("eases out from 0 to 1", () => {
    expect(settle(0)).toBe(0);
    expect(settle(1)).toBe(1);
    expect(settle(0.5)).toBe(0.875);
  });
});
