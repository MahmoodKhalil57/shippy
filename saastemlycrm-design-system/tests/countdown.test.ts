import { describe, expect, it } from "vite-plus/test";
import { DAY_MS, HOUR_MS, MINUTE_MS, timeLeft } from "../src/components/base/countdown.ts";

/**
 * Time left to a deadline (src/components/base/countdown.ts), proved over a finite grid of offsets
 * from it: every second of two minutes either side, every minute of six days either side, and
 * every hour of sixty days either side. For each, the words are read back into the interval of
 * offsets they claim, and the real offset must lie in it (so the text is never wrong and never
 * promises more time than there is); overdue holds exactly past the deadline; the share left is
 * the remaining part of a three-day run, between 0 and 1, 0 once overdue, full without a start;
 * and as the clock runs, the share never grows.
 */

/** The offsets (due − now, ms) a text claims: [lo, hi), and whether it says overdue. */
function claims(text: string): { lo: number; hi: number; overdue: boolean } | undefined {
  let m: RegExpExecArray | null;
  if (text === "due now") return { lo: 0, hi: 1, overdue: false };
  if (text === "under 1 min left") return { lo: 1, hi: MINUTE_MS, overdue: false };
  if (text === "just overdue") return { lo: -MINUTE_MS + 1, hi: 0, overdue: true };
  if ((m = /^([1-9]|[1-5]\d) min left$/.exec(text))) {
    const lo = Number(m[1]) * MINUTE_MS;
    return { lo, hi: lo + MINUTE_MS, overdue: false };
  }
  if ((m = /^([1-9]|1\d|2[0-3]) h(?: ([1-9]|[1-5]\d) min)? left$/.exec(text))) {
    const lo = Number(m[1]) * HOUR_MS + Number(m[2] ?? 0) * MINUTE_MS;
    return { lo, hi: lo + MINUTE_MS, overdue: false };
  }
  if ((m = /^([12]) d(?: ([1-9]|1\d|2[0-3]) h)? left$/.exec(text))) {
    const lo = Number(m[1]) * DAY_MS + Number(m[2] ?? 0) * HOUR_MS;
    return { lo, hi: lo + HOUR_MS, overdue: false };
  }
  if ((m = /^([3-9]|[1-9]\d+) d left$/.exec(text))) {
    const lo = Number(m[1]) * DAY_MS;
    return { lo, hi: lo + DAY_MS, overdue: false };
  }
  if ((m = /^overdue ([1-9]|[1-5]\d) min$/.exec(text))) {
    const e = Number(m[1]) * MINUTE_MS;
    return { lo: -e - MINUTE_MS + 1, hi: -e + 1, overdue: true };
  }
  if ((m = /^overdue ([1-9]|1\d|2[0-3]) h$/.exec(text))) {
    const e = Number(m[1]) * HOUR_MS;
    return { lo: -e - HOUR_MS + 1, hi: -e + 1, overdue: true };
  }
  if ((m = /^overdue ([1-9]\d*) d$/.exec(text))) {
    const e = Number(m[1]) * DAY_MS;
    return { lo: -e - DAY_MS + 1, hi: -e + 1, overdue: true };
  }
  return undefined;
}

const offsets = (): number[] => {
  const s = new Set<number>();
  for (let x = -120; x <= 120; x++) s.add(x * 1000);
  for (let x = -6 * 24 * 60; x <= 6 * 24 * 60; x++) s.add(x * MINUTE_MS);
  for (let x = -60 * 24; x <= 60 * 24; x++) s.add(x * HOUR_MS);
  return [...s].sort((a, b) => a - b);
};

const DUE = Date.UTC(2026, 10, 17, 12);
const RUN = 3 * DAY_MS;

describe("time left", () => {
  it("says the truth, in whole units rounded down, at every offset", () => {
    const bad: string[] = [];
    for (const d of offsets()) {
      const t = timeLeft(DUE, DUE - d, DUE - RUN);
      const c = claims(t.text);
      if (!c) bad.push(`${d}: unreadable "${t.text}"`);
      else if (d < c.lo || d >= c.hi) bad.push(`${d}: "${t.text}" claims [${c.lo}, ${c.hi})`);
      else if (c.overdue !== t.overdue) bad.push(`${d}: "${t.text}" overdue ${t.overdue}`);
      if (t.overdue !== d < 0) bad.push(`${d}: overdue ${t.overdue}`);
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it("drains its share as the clock runs: 0 to 1, 0 once overdue, full without a start", () => {
    const bad: string[] = [];
    let before = Infinity;
    // The clock runs forward: the offset to the deadline falls.
    for (const d of offsets().reverse()) {
      const { share, overdue } = timeLeft(DUE, DUE - d, DUE - RUN);
      const want = d < 0 ? 0 : Math.min(1, d / RUN);
      if (Math.abs(share - want) > 1e-12) bad.push(`${d}: share ${share}, not ${want}`);
      if (share < 0 || share > 1) bad.push(`${d}: share ${share}`);
      if (overdue && share !== 0) bad.push(`${d}: overdue with share ${share}`);
      if (share > before) bad.push(`${d}: share grew to ${share}`);
      before = share;
      const free = timeLeft(DUE, DUE - d);
      if (free.share !== (d < 0 ? 0 : d === 0 ? 0 : 1)) bad.push(`${d}: no start, share ${free.share}`);
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });
});
