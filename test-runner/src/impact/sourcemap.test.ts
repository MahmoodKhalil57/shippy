import { describe, expect, test } from "vite-plus/test";
import { vlq } from "./fixtures.ts";
import { ambiguousLines, decodeMappings, lineStarts, offsetOf } from "./sourcemap.ts";

const strings = (alphabet: string[], max: number): string[] => {
  const out = [""];
  let layer = [""];
  for (let n = 1; n <= max; n++) {
    layer = layer.flatMap((s) => alphabet.map((c) => s + c));
    out.push(...layer);
  }
  return out;
};

describe("decodeMappings", () => {
  test("every value in [-4096, 4096] decodes in every field", () => {
    for (let n = -4096; n <= 4096; n++) {
      const [segment] = decodeMappings([vlq(n), vlq(n), vlq(n), vlq(n)].join(""));
      expect(segment).toEqual({ line: 0, column: n, source: n, sourceLine: n, sourceColumn: n });
    }
  });

  test("fields accumulate across segments and lines, and columns reset per line, for every delta in [-2, 2]^3", () => {
    const deltas = [-2, -1, 0, 1, 2];
    for (const a of deltas)
      for (const b of deltas)
        for (const c of deltas) {
          const group = (d: number) => [d, d, d, d].map(vlq).join("");
          const mappings = `${group(a + 2)},${group(b)};${group(c + 2)}`;
          expect(decodeMappings(mappings)).toEqual([
            { line: 0, column: a + 2, source: a + 2, sourceLine: a + 2, sourceColumn: a + 2 },
            { line: 0, column: a + 2 + b, source: a + 2 + b, sourceLine: a + 2 + b, sourceColumn: a + 2 + b },
            {
              line: 1,
              column: c + 2,
              source: a + 4 + b + c,
              sourceLine: a + 4 + b + c,
              sourceColumn: a + 4 + b + c,
            },
          ]);
        }
  });

  test("segments without a source are skipped and five-field segments are kept", () => {
    expect(decodeMappings(`${vlq(3)},${[1, 0, 0, 0, 0].map(vlq).join("")};;`)).toEqual([
      { line: 0, column: 4, source: 0, sourceLine: 0, sourceColumn: 0 },
    ]);
  });

  test("rejects characters outside base64 and truncated groups", () => {
    expect(() => decodeMappings("A!")).toThrow(/Invalid/);
    expect(() => decodeMappings("g")).toThrow(/Truncated/);
  });
});

describe("lines", () => {
  const texts = strings(["a", "\n", "\r"], 5);

  test("offsetOf matches a split on \\n for every text up to five characters and every position", () => {
    for (const text of texts) {
      const lines = text.split("\n");
      const starts = lineStarts(text);
      expect(starts.length).toBe(lines.length);
      for (let line = -1; line <= lines.length; line++)
        for (let column = -1; column <= 7; column++) {
          const known = line >= 0 && line < lines.length && column >= 0 && column <= lines[line]!.length;
          const expected = known ? lines.slice(0, line).reduce((n, l) => n + l.length + 1, 0) + column : undefined;
          expect(offsetOf(starts, text.length, line, column)).toBe(expected);
        }
    }
  });

  test("ambiguousLines flags exactly a lone \\r or a Unicode line separator", () => {
    for (const text of strings(["a", "\n", "\r", "\u2028", "\u2029"], 4)) {
      const lone = text.split("").some((c, i) => c === "\r" && text[i + 1] !== "\n");
      expect(ambiguousLines(text)).toBe(lone || text.includes("\u2028") || text.includes("\u2029"));
    }
  });
});
