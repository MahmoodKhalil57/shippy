import { ambiguousLines, decodeMappings, lineStarts, offsetOf } from "./sourcemap.ts";
import { unitsAt, type UnitTree } from "./units.ts";

export interface V8Range {
  startOffset: number;
  endOffset: number;
  count: number;
}

export interface V8Function {
  ranges: V8Range[];
}

export function executedCounts(length: number, functions: readonly V8Function[], startOffset = 0): Uint8Array {
  const counts = new Uint8Array(length).fill(1);
  const ranges = functions
    .flatMap((f) => f.ranges)
    .map((r) => ({
      start: Math.max(0, r.startOffset - startOffset),
      end: Math.min(length, r.endOffset - startOffset),
      hit: r.count > 0 ? 1 : 0,
    }))
    .filter((r) => r.start < r.end)
    .sort((a, b) => b.end - b.start - (a.end - a.start));
  for (const r of ranges) counts.fill(r.hit, r.start, r.end);
  return counts;
}

export interface MappedSource {
  generated: string;
  mappings: string;
  sources: readonly number[];
}

export type Hits = { all: true } | { all: false; units: Set<number> };

export function hitUnits(tree: UnitTree, original: string, mapped: MappedSource, counts: Uint8Array): Hits {
  if (!tree.parsed || ambiguousLines(original) || ambiguousLines(mapped.generated)) return { all: true };
  const wanted = new Set(mapped.sources);
  const segments = decodeMappings(mapped.mappings).filter((s) => wanted.has(s.source));
  if (!segments.length) return { all: true };
  const generatedStarts = lineStarts(mapped.generated);
  const originalStarts = lineStarts(original);
  const units = new Set<number>();
  for (const s of segments) {
    const at = offsetOf(generatedStarts, mapped.generated.length, s.line, s.column);
    if (at === undefined) return { all: true };
    const from = offsetOf(originalStarts, original.length, s.sourceLine, s.sourceColumn);
    if (from === undefined) return { all: true };
    if (!counts[at]) continue;
    for (const u of unitsAt(tree, from)) units.add(u);
  }
  return { all: false, units };
}

export function identityHits(tree: UnitTree, original: string, counts: Uint8Array): Hits {
  if (!tree.parsed || counts.length !== original.length) return { all: true };
  const units = new Set<number>();
  for (let at = 0; at < original.length; at++) {
    if (!counts[at] || /\s/.test(original[at]!)) continue;
    for (const u of unitsAt(tree, at)) units.add(u);
  }
  return { all: false, units };
}
