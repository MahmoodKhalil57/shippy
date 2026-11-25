export interface BridgeStep {
  value: number;
  total?: boolean;
}

export type BridgeKind = "up" | "down" | "total";

export interface BridgeColumn {
  kind: BridgeKind;
  from: number;
  to: number;
  run: number;
}

export function bridge(steps: readonly BridgeStep[]): BridgeColumn[] {
  let run = 0;
  return steps.map((s) => {
    if (s.total) return { kind: "total", from: 0, to: run, run };
    const from = run;
    run += s.value;
    return { kind: s.value < 0 ? "down" : "up", from, to: run, run };
  });
}

export function bridgeDomain(columns: readonly BridgeColumn[]): [number, number] {
  const lo = Math.min(0, ...columns.flatMap((c) => [c.from, c.to]));
  const hi = Math.max(0, ...columns.flatMap((c) => [c.from, c.to]));
  return hi > lo ? [lo, hi] : [lo, lo + 1];
}

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

export const bridgeAt = (v: number, [lo, hi]: readonly [number, number]): number => ((v - lo) / (hi - lo)) * 100;
