import { createHash } from "node:crypto";

export interface Span {
  start: number;
  end: number;
}

export interface Comment extends Span {
  type: "Line" | "Block";
}

export const HOLE = "\u0000";

const SEPARATORS = new Set(["(", ")", "[", "]", "{", "}", ";", ","]);
const NONE = 0;
const SPACE = 1;
const NEWLINE = 2;

const isLineTerminator = (c: string) => c === "\n" || c === "\r" || c === "\u2028" || c === "\u2029";
const isWhitespace = (c: string) => /\s/.test(c);

export interface Pieces {
  comments: readonly Comment[];
  literals: readonly Span[];
  holes: readonly Span[];
}

type Special = Span & { kind: "comment" | "literal" | "hole"; newline?: boolean };
const RANK = { hole: 0, literal: 1, comment: 2 } as const;

export function normalise(text: string, span: Span, pieces: Pieces): string {
  const inside = (s: Span) => s.start >= span.start && s.end <= span.end;
  const specials: Special[] = [
    ...pieces.comments.filter(inside).map((c) => ({
      start: c.start,
      end: c.end,
      kind: "comment" as const,
      newline: c.type === "Block" && text.slice(c.start, c.end).split("").some(isLineTerminator),
    })),
    ...pieces.literals.filter(inside).map((l) => ({ start: l.start, end: l.end, kind: "literal" as const })),
    ...pieces.holes.filter(inside).map((h) => ({ start: h.start, end: h.end, kind: "hole" as const })),
  ].sort((a, b) => a.start - b.start || b.end - a.end || RANK[a.kind] - RANK[b.kind]);

  let out = "";
  let pending = NONE;
  const emit = (token: string) => {
    if (pending === SPACE && (SEPARATORS.has(out.at(-1)!) || SEPARATORS.has(token[0]!))) pending = NONE;
    if (out && pending) out += pending === NEWLINE ? "\n" : " ";
    pending = NONE;
    out += token;
  };
  const code = (from: number, to: number) => {
    for (let i = from; i < to; i++) {
      const c = text[i]!;
      if (isLineTerminator(c)) pending = NEWLINE;
      else if (isWhitespace(c)) pending = Math.max(pending, SPACE);
      else emit(c);
    }
  };

  let at = span.start;
  for (const s of specials) {
    if (s.start < at) continue;
    code(at, s.start);
    if (s.kind === "comment") pending = Math.max(pending, s.newline ? NEWLINE : SPACE);
    else emit(s.kind === "hole" ? HOLE : text.slice(s.start, s.end));
    at = s.end;
  }
  code(at, span.end);
  return out;
}

export const hashText = (text: string): string => createHash("sha256").update(text).digest("base64url").slice(0, 22);

export const stripVersionQueries = (code: string): string =>
  code.replace(/([?&])(v=[0-9a-f]{8}|t=\d{10,16})(?=[&"'`\s]|$)/g, "$1");

const TRAILER = /(?:^|\n)\/\/# [A-Za-z][\w-]*=[^\n]*\s*$/;

export function stripTrailers(code: string): string {
  let out = code;
  for (let next = out.replace(TRAILER, ""); next !== out; next = out.replace(TRAILER, "")) out = next;
  return out.trimEnd();
}
