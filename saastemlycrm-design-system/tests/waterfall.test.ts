import { describe, expect, it } from "vite-plus/test";
import { bridge, bridgeAt, bridgeDomain, bridgeFit, type BridgeStep } from "../src/components/base/waterfall.ts";

/**
 * The waterfall's arithmetic (src/components/base/waterfall.ts), proved over every sequence of 1–5
 * steps, each a change of −2..2 or a total (6⁵ + … + 6 = 9,330 sequences):
 * - the running total after each step is the sum of the changes so far (totals add nothing);
 * - a change's column runs from the running total before it to the one after, so it spans exactly
 *   its value and starts where the last column's level is (the connector is level);
 * - a total's column runs from 0 to the running total;
 * - its kind is up, down or total as its step is;
 * - the domain holds zero and both ends of every column, and its positions run 0 to 100.
 */

const CHOICES: BridgeStep[] = [...[-2, -1, 0, 1, 2].map((value) => ({ value })), { value: 99, total: true }];

function* sequences(n: number): Generator<BridgeStep[]> {
  if (n === 0) return yield [];
  for (const rest of sequences(n - 1)) for (const c of CHOICES) yield [...rest, c];
}

describe("bridge", () => {
  it("keeps the running total, the spans and the levels, for every sequence of 1–5 steps", () => {
    let cases = 0;
    const bad: string[] = [];
    for (let n = 1; n <= 5; n++)
      for (const steps of sequences(n)) {
        cases++;
        const cols = bridge(steps);
        const [lo, hi] = bridgeDomain(cols);
        let run = 0;
        steps.forEach((s, i) => {
          const c = cols[i]!;
          const say = (p: string) => bad.push(`${JSON.stringify(steps)} #${i}: ${p}`);
          if (s.total) {
            if (c.kind !== "total" || c.from !== 0 || c.to !== run) say("a total spans 0 to the running total");
          } else {
            if (c.from !== run) say("starts at the running total before it");
            run += s.value;
            if (c.to - c.from !== s.value) say("spans its value");
            if (c.kind !== (s.value < 0 ? "down" : "up")) say("kind");
          }
          if (c.run !== run) say("running total");
          for (const v of [0, c.from, c.to]) if (v < lo || v > hi) say("outside the domain");
        });
        if (!(hi > lo)) bad.push(`${JSON.stringify(steps)}: empty domain`);
        if (bridgeAt(lo, [lo, hi]) !== 0 || bridgeAt(hi, [lo, hi]) !== 100) bad.push("positions run 0 to 100");
      }
    expect(cases).toBe(6 + 36 + 216 + 1296 + 7776);
    expect(bad).toEqual([]);
  });

  it("fits every bridge of 1–5 steps: holds every level, never crosses zero needlessly, never empty", () => {
    const bad: string[] = [];
    for (let n = 1; n <= 5; n++)
      for (const steps of sequences(n)) {
        const cols = bridge(steps);
        const [lo, hi] = bridgeFit(cols);
        const levels = cols.map((c) => c.run);
        if (!(hi > lo)) bad.push(`${JSON.stringify(steps)}: empty`);
        for (const v of levels) if (v < lo || v > hi) bad.push(`${JSON.stringify(steps)}: ${v} outside`);
        if (levels.every((v) => v > 0) && lo < 0) bad.push(`${JSON.stringify(steps)}: crosses zero below`);
        if (levels.every((v) => v < 0) && hi > 0) bad.push(`${JSON.stringify(steps)}: crosses zero above`);
      }
    expect(bad).toEqual([]);
    // A profit bridge: 395 down to 371 spans 365..396, not 0..395.
    const [lo, hi] = bridgeFit(bridge([{ value: 395 }, { value: -27 }, { value: 3 }, { value: 0, total: true }]));
    expect(lo).toBeCloseTo(368 - 27 / 4, 5);
    expect(hi).toBeCloseTo(395 + 27 / 16, 5);
  });

  it("reads a quarter's bridge", () => {
    const cols = bridge([{ value: 100 }, { value: 30 }, { value: -45 }, { value: 0, total: true }, { value: -5 }]);
    expect(cols.map((c) => [c.kind, c.from, c.to, c.run])).toEqual([
      ["up", 0, 100, 100],
      ["up", 100, 130, 130],
      ["down", 130, 85, 85],
      ["total", 0, 85, 85],
      ["down", 85, 80, 80],
    ]);
    expect(bridgeDomain(cols)).toEqual([0, 130]);
    expect(bridgeDomain([])).toEqual([0, 1]);
  });
});
