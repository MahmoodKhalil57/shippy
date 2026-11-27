import { describe, expect, test } from "vite-plus/test";
import { HOLE, normalise, stripTrailers, stripVersionQueries, type Comment, type Span } from "./normalize.ts";

type Fragment =
  | { kind: "code"; text: string }
  | { kind: "space"; text: string; newline: boolean }
  | { kind: "comment"; text: string; type: Comment["type"]; newline: boolean }
  | { kind: "literal"; text: string }
  | { kind: "hole"; text: string };

const FRAGMENTS: Fragment[] = [
  { kind: "code", text: "a" },
  { kind: "code", text: "b" },
  { kind: "code", text: "(" },
  { kind: "code", text: ";" },
  { kind: "space", text: " ", newline: false },
  { kind: "space", text: "\t", newline: false },
  { kind: "space", text: "\n", newline: true },
  { kind: "space", text: "\r\n", newline: true },
  { kind: "space", text: "\u2028", newline: true },
  { kind: "comment", text: "/*c*/", type: "Block", newline: false },
  { kind: "comment", text: "/*\n*/", type: "Block", newline: true },
  { kind: "comment", text: "//c", type: "Line", newline: false },
  { kind: "literal", text: "'p  q'" },
  { kind: "literal", text: "'p q'" },
  { kind: "hole", text: "{h}" },
];

function* sequences(max: number): Generator<Fragment[]> {
  yield [];
  let layer: Fragment[][] = [[]];
  for (let n = 1; n <= max; n++) {
    layer = layer.flatMap((s) => FRAGMENTS.map((f) => [...s, f]));
    yield* layer;
  }
}

function build(sequence: Fragment[]) {
  let text = "";
  const comments: Comment[] = [];
  const literals: Span[] = [];
  const holes: Span[] = [];
  const parts: Fragment[] = [];
  sequence.forEach((f, i) => {
    const start = text.length;
    text += f.text;
    parts.push(f);
    if (f.kind === "comment") comments.push({ start, end: text.length, type: f.type });
    if (f.kind === "literal") literals.push({ start, end: text.length });
    if (f.kind === "hole") holes.push({ start, end: text.length });
    if (f.kind === "comment" && f.type === "Line" && sequence[i + 1]?.kind !== "space") {
      text += "\n";
      parts.push({ kind: "space", text: "\n", newline: true });
    }
  });
  return { text, pieces: { comments, literals, holes }, parts };
}

const SEPARATOR = /^[()[\]{};,]$/;

function reference(parts: Fragment[]): string {
  const out: string[] = [];
  let gap = 0;
  let previous = "";
  for (const p of parts) {
    if (p.kind === "space" || p.kind === "comment") gap = Math.max(gap, p.newline ? 2 : 1);
    else {
      const first = p.kind === "hole" ? "" : p.text[0]!;
      if (gap === 1 && (SEPARATOR.test(previous) || SEPARATOR.test(first))) gap = 0;
      if (out.length) out.push(["", "<sp>", "<nl>"][gap]!);
      gap = 0;
      previous = p.kind === "hole" ? "" : p.text.at(-1)!;
      out.push(p.kind === "code" ? p.text : p.kind === "literal" ? `[${p.text}]` : "<hole>");
    }
  }
  return out.join("|");
}

describe("normalise", () => {
  test("equal output exactly when the token stream and the class of every gap are equal (newline, space, or none, where a space next to a bracket or separator counts as none), for every sequence of up to four fragments", () => {
    const byOutput = new Map<string, string>();
    const byReference = new Map<string, string>();
    let count = 0;
    for (const sequence of sequences(4)) {
      const { text, pieces, parts } = build(sequence);
      const out = normalise(text, { start: 0, end: text.length }, pieces);
      const ref = reference(parts);
      expect(byOutput.get(out) ?? ref).toBe(ref);
      expect(byReference.get(ref) ?? out).toBe(out);
      byOutput.set(out, ref);
      byReference.set(ref, out);
      count++;
    }
    expect(count).toBe(1 + 15 + 15 ** 2 + 15 ** 3 + 15 ** 4);
  });

  test("keeps literal text verbatim and replaces holes with one marker", () => {
    const text = "x = 'a  b' + {  y  }";
    const out = normalise(
      text,
      { start: 0, end: text.length },
      { comments: [], literals: [{ start: 4, end: 10 }], holes: [{ start: 13, end: 20 }] },
    );
    expect(out).toBe(`x = 'a  b' + ${HOLE}`);
  });

  test("ignores pieces outside the span", () => {
    const text = "a /*x*/ b 'q  r' c";
    const out = normalise(
      text,
      { start: 8, end: 18 },
      { comments: [{ start: 2, end: 7, type: "Block" }], literals: [{ start: 0, end: 1 }], holes: [] },
    );
    expect(out).toBe("b 'q r' c");
  });
});

describe("stripVersionQueries", () => {
  test("drops exactly a dependency hash or a timestamp that ends a query value, for every separator, value and ending", () => {
    const values = [
      { text: "v=0123abcd", stripped: true },
      { text: "v=0123abc", stripped: false },
      { text: "v=0123ABCD", stripped: false },
      { text: "t=1764201234567", stripped: true },
      { text: "t=123456789", stripped: false },
      { text: "x=0123abcd", stripped: false },
    ];
    const endings = [
      { text: '"', ends: true },
      { text: "'", ends: true },
      { text: "`", ends: true },
      { text: "&", ends: true },
      { text: " ", ends: true },
      { text: "", ends: true },
      { text: "z", ends: false },
    ];
    for (const separator of ["?", "&"])
      for (const value of values)
        for (const ending of endings) {
          const code = `import "/dep.js${separator}${value.text}${ending.text}`;
          const expected = value.stripped && ending.ends ? `import "/dep.js${separator}${ending.text}` : code;
          expect(stripVersionQueries(code)).toBe(expected);
        }
  });
});

describe("stripTrailers", () => {
  test("removes exactly the trailing //# name=value pragma comments, for every sequence of up to four lines", () => {
    const LINES = [
      { text: "//# sourceMappingURL=data:x", trailer: true },
      { text: "//# sourceMappingSource=vite-generated", trailer: true },
      { text: "//# vitestCache=W10=", trailer: true },
      { text: "//# not a pragma", trailer: false },
      { text: "// plain=comment", trailer: false },
      { text: "code()", trailer: false },
      { text: "", trailer: true },
    ];
    let layer: (typeof LINES)[] = [[]];
    for (let n = 1; n <= 4; n++) {
      layer = layer.flatMap((s) => LINES.map((l) => [...s, l]));
      for (const lines of layer) {
        let keep = lines.length;
        while (keep > 0 && lines[keep - 1]!.trailer) keep--;
        const code = ["start()", ...lines.map((l) => l.text)].join("\n");
        const expected = ["start()", ...lines.slice(0, keep).map((l) => l.text)].join("\n").trimEnd();
        expect(stripTrailers(code)).toBe(expected);
      }
    }
  });
});
