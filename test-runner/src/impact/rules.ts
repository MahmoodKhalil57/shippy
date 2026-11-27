export const REASONS = ["all", "new", "test", "global", "failed", "code"] as const;
export type Reason = (typeof REASONS)[number];

type Lazy = () => boolean | Promise<boolean>;

export interface Facts {
  all: boolean;
  recorded: boolean;
  affectedByChanges: Lazy;
  testChanged: Lazy;
  globalChanged: Lazy;
  failedLastTime: Lazy;
  codeChanged: Lazy;
}

export async function decide(facts: Facts): Promise<Reason | undefined> {
  if (facts.all) return "all";
  if (!facts.recorded) return (await facts.affectedByChanges()) ? "new" : undefined;
  if (await facts.testChanged()) return "test";
  if (await facts.globalChanged()) return "global";
  if (await facts.failedLastTime()) return "failed";
  if (await facts.codeChanged()) return "code";
  return undefined;
}

export interface Dependencies {
  units: Record<string, Record<string, string>>;
  modules: Record<string, string>;
}

export interface Snapshot {
  units(file: string): Map<string, string> | undefined | Promise<Map<string, string> | undefined>;
  module(id: string): string | Promise<string>;
}

export const UNAVAILABLE = "!";

export async function staleDependencies(recorded: Dependencies, now: Snapshot, limit = Infinity): Promise<string[]> {
  const stale: string[] = [];
  for (const [file, units] of Object.entries(recorded.units)) {
    const current = await now.units(file);
    if (!current) stale.push(file);
    else
      for (const [id, hash] of Object.entries(units))
        if (current.get(id) !== hash && stale.push(`${file} > ${id || "(module top)"}`) >= limit) return stale;
    if (stale.length >= limit) return stale;
  }
  for (const [id, hash] of Object.entries(recorded.modules))
    if ((hash === UNAVAILABLE || (await now.module(id)) !== hash) && stale.push(id) >= limit) return stale;
  return stale;
}

export const codeChanged = async (recorded: Dependencies, now: Snapshot): Promise<boolean> =>
  (await staleDependencies(recorded, now, 1)).length > 0;

export function summary(ran: number, total: number, reasons: ReadonlyMap<Reason, number>): string {
  const parts = REASONS.filter((r) => reasons.get(r)).map((r) => `${reasons.get(r)} ${r}`);
  return `ran ${ran} of ${total} test files (reasons: ${parts.length ? parts.join(", ") : "none"})`;
}
