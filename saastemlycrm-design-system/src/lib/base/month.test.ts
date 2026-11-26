import { describe, it, expect } from "vite-plus/test";
import { monthWeeks, readMonth, weekdayOf, weekdayOrder } from "./month";

describe("readMonth", () => {
  it("parses YYYY-MM with the day count", () => {
    expect(readMonth("2024-02")).toEqual({ year: 2024, month: 2, days: 29 });
    expect(readMonth("2023-02")).toEqual({ year: 2023, month: 2, days: 28 });
    expect(readMonth("2025-12")).toEqual({ year: 2025, month: 12, days: 31 });
  });

  it("rejects malformed text and out-of-range months", () => {
    expect(readMonth("2024-2")).toBeUndefined();
    expect(readMonth("x2024-02")).toBeUndefined();
    expect(readMonth("2024-00")).toBeUndefined();
    expect(readMonth("2024-13")).toBeUndefined();
  });
});

describe("weekdayOf and weekdayOrder", () => {
  it("returns the UTC weekday", () => {
    expect(weekdayOf(2024, 1, 1)).toBe(1);
    expect(weekdayOf(2023, 10, 1)).toBe(0);
  });

  it("rotates the week from its start", () => {
    expect(weekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(weekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(weekdayOrder(6)).toEqual([6, 0, 1, 2, 3, 4, 5]);
  });
});

describe("monthWeeks", () => {
  it("pads leading and trailing cells to full weeks", () => {
    const weeks = monthWeeks(2024, 1, 0);
    expect(weeks[0]).toEqual([null, 1, 2, 3, 4, 5, 6]);
    expect(weeks.at(-1)).toEqual([28, 29, 30, 31, null, null, null]);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
  });

  it("starts flush when the month begins on the week start", () => {
    const weeks = monthWeeks(2024, 1, 1);
    expect(weeks[0]![0]).toBe(1);
    expect(weeks.flat().filter((d) => d !== null)).toHaveLength(31);
  });

  it("fills exactly four weeks for a flush 28-day February", () => {
    const weeks = monthWeeks(2026, 2, 0);
    expect(weeks).toHaveLength(4);
    expect(weeks.flat().includes(null)).toBe(false);
  });
});
