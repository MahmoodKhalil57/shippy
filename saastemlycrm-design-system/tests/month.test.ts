import { describe, expect, it } from "vite-plus/test";
import { monthWeeks, readMonth, weekdayOrder, type WeekStart } from "../src/components/base/month.ts";

/**
 * A month's weeks (src/components/base/month.ts), proved for every month of 2024 to 2030 with
 * both week starts (168 cases): every row has seven cells; the month's days (counted by the
 * Gregorian rule, not by Date) appear once each, in order; each day sits in its weekday's column
 * (its weekday counted from a known Monday, 1 January 2024, by days elapsed); there are 4 to 6
 * rows; the blanks before the 1st are exactly its column, and those after the last day are fewer
 * than seven.
 */

const leap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const lengthOf = (y: number, m: number) => (m === 2 && leap(y) ? 29 : LENGTHS[m - 1]!);
/** Days from 1 Jan 2024 (a Monday) to the 1st of this month. */
const daysBefore = (y: number, m: number) => {
  let n = 0;
  for (let yy = 2024; yy < y; yy++) n += leap(yy) ? 366 : 365;
  for (let mm = 1; mm < m; mm++) n += lengthOf(y, mm);
  return n;
};
/** Weekday, 0 Sunday … 6 Saturday. */
const weekday = (y: number, m: number, d: number) => (1 + daysBefore(y, m) + d - 1) % 7;

describe("a month's weeks", () => {
  it("puts every day of every month of 2024–2030 in its weekday's column, for both week starts", () => {
    const bad: string[] = [];
    for (let y = 2024; y <= 2030; y++)
      for (let m = 1; m <= 12; m++)
        for (const ws of [0, 1] as WeekStart[]) {
          const at = `${y}-${m} from ${ws}`;
          const read = readMonth(`${y}-${String(m).padStart(2, "0")}`);
          if (read?.days !== lengthOf(y, m)) bad.push(`${at}: ${read?.days} days`);
          const weeks = monthWeeks(y, m, ws);
          if (weeks.length < 4 || weeks.length > 6) bad.push(`${at}: ${weeks.length} rows`);
          if (weeks.some((w) => w.length !== 7)) bad.push(`${at}: a row not of seven`);
          const cells = weeks.flat();
          const days = cells.filter((c): c is number => c !== null);
          const want = Array.from({ length: lengthOf(y, m) }, (_, i) => i + 1);
          if (days.join() !== want.join()) bad.push(`${at}: days ${days.join()}`);
          const order = weekdayOrder(ws);
          weeks.forEach((w, r) =>
            w.forEach((d, c) => {
              if (d !== null && weekday(y, m, d) !== order[c]) bad.push(`${at}: ${d} in column ${c} (row ${r})`);
            }),
          );
          const lead = cells.indexOf(1);
          if (lead !== (weekday(y, m, 1) - ws + 7) % 7) bad.push(`${at}: ${lead} blanks before`);
          const trail = cells.length - 1 - cells.lastIndexOf(lengthOf(y, m));
          if (trail < 0 || trail > 6) bad.push(`${at}: ${trail} blanks after`);
          if (cells.slice(0, lead).some((c) => c !== null) || cells.slice(cells.length - trail).some((c) => c !== null))
            bad.push(`${at}: a day among the blanks`);
        }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it("orders the weekdays from the week's start", () => {
    expect(weekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(weekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });

  it("reads months and refuses what isn't one", () => {
    expect(readMonth("2026-11")).toEqual({ year: 2026, month: 11, days: 30 });
    for (const bad of ["2026-13", "2026-00", "2026-1", "26-11", "", "2026-11-17"])
      expect(readMonth(bad), bad).toBeUndefined();
  });
});
