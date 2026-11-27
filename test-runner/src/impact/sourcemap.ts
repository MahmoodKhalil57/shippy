export interface Segment {
  line: number;
  column: number;
  source: number;
  sourceLine: number;
  sourceColumn: number;
}

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const DIGIT = new Map(BASE64.split("").map((c, i) => [c, i]));

function readFields(group: string): number[] {
  const fields: number[] = [];
  let value = 0;
  let shift = 0;
  for (const char of group) {
    const digit = DIGIT.get(char);
    if (digit === undefined) throw new Error(`Invalid source map character "${char}".`);
    value += (digit & 31) << shift;
    if (digit & 32) {
      shift += 5;
      continue;
    }
    fields.push(value & 1 ? -(value >>> 1) : value >>> 1);
    value = 0;
    shift = 0;
  }
  if (shift !== 0) throw new Error("Truncated source map segment.");
  return fields;
}

export function decodeMappings(mappings: string): Segment[] {
  const segments: Segment[] = [];
  let source = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  mappings.split(";").forEach((lineGroup, line) => {
    let column = 0;
    for (const group of lineGroup.split(",")) {
      if (!group) continue;
      const fields = readFields(group);
      column += fields[0]!;
      if (fields.length < 4) continue;
      source += fields[1]!;
      sourceLine += fields[2]!;
      sourceColumn += fields[3]!;
      segments.push({ line, column, source, sourceLine, sourceColumn });
    }
  });
  return segments;
}

export function lineStarts(text: string): number[] {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return starts;
}

export const ambiguousLines = (text: string): boolean => /\r(?!\n)|[\u2028\u2029]/.test(text);

export function offsetOf(starts: number[], length: number, line: number, column: number): number | undefined {
  const start = starts[line];
  if (start === undefined || column < 0) return undefined;
  const end = line + 1 < starts.length ? starts[line + 1]! - 1 : length;
  return start + column <= end ? start + column : undefined;
}
