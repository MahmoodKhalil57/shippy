/**
 * A waterfall's (bridge chart's) arithmetic: where each column starts and ends, and the running
 * total after it. No DOM; tests/waterfall.test.ts proves it over every sequence of 1–5 steps of
 * −2..2 or a total: the running total is the sum of the steps so far (totals add nothing), each
 * step's column spans exactly its value from the running total before it, each total's column
 * spans 0 to the running total, and the domain holds every column and zero.
 */

export interface BridgeStep {
  value: number;
  /** A subtotal: drawn from 0 to the running total; it doesn't add. */
  total?: boolean;
}

export type BridgeKind = "up" | "down" | "total";

export interface BridgeColumn {
  kind: BridgeKind;
  /** Where the column starts and ends, in the data's units (`from` is the base it grows from). */
  from: number;
  to: number;
  /** The running total after this step. */
  run: number;
}

/** The columns of a bridge, in order. */
export function bridge(steps: readonly BridgeStep[]): BridgeColumn[] {
  let run = 0;
  return steps.map((s) => {
    if (s.total) return { kind: "total", from: 0, to: run, run };
    const from = run;
    run += s.value;
    return { kind: s.value < 0 ? "down" : "up", from, to: run, run };
  });
}

/** The span the columns need, always holding zero (the baseline); never empty. */
export function bridgeDomain(columns: readonly BridgeColumn[]): [number, number] {
  const lo = Math.min(0, ...columns.flatMap((c) => [c.from, c.to]));
  const hi = Math.max(0, ...columns.flatMap((c) => [c.from, c.to]));
  return hi > lo ? [lo, hi] : [lo, lo + 1];
}

/**
 * A span fitted to the levels the bridge moves through (every running total; the first change's
 * start, zero, is left out), not to zero: for a bridge whose changes are small next to its totals. A quarter of the
 * levels' range stays below the lowest level so the lowest total still shows as a column; the
 * span never crosses zero when every level is on one side of it; never empty.
 */
export function bridgeFit(columns: readonly BridgeColumn[]): [number, number] {
  const levels = columns.map((c) => c.run);
  if (!levels.length) return [0, 1];
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  const pad = (max - min || Math.abs(max) || 1) / 4;
  const lo = min > 0 ? Math.max(0, min - pad) : min - pad;
  const hi = max < 0 ? Math.min(0, max + pad / 4) : max + pad / 4;
  return [lo, hi];
}

/** A value's height in the domain, 0 (its bottom) to 100 (its top), as a percentage. */
export const bridgeAt = (v: number, [lo, hi]: readonly [number, number]): number => ((v - lo) / (hi - lo)) * 100;
