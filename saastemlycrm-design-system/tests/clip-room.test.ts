import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * Nothing is cut by the box it's in, by construction. What draws outside an element's own box (a
 * focus ring: a 2px outline 2px out; a selection ring; an elevation-1 shadow) is cut by any
 * ancestor that scrolls, at the edge its content touches. So every box that scrolls
 * (`overflow-*-auto` / `-scroll`) gives its content the ring's room, at least 4px of padding on
 * the axes it scrolls (`p-1` or more, its axis's `px-` / `py-` or both sides', or the algebra's
 * `scrollRoom`); a box sized to its content never clips at all (a fitted tile's body overflows
 * visibly, `tile.ts`). The test reads every class string of the design system's components and
 * app, so a new scroller without room fails here, not on a screen.
 */

const root = path.resolve(import.meta.dirname, "../src");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.name.endsWith(".ts") ? [p] : [];
  });

/** The class strings in a source file: string and template literals holding an overflow class. */
const strings = (src: string) =>
  src
    .split("\n")
    .filter((l) => !/^\s*(?:\*|\/\/|\/\*)/.test(l))
    .flatMap((l) => [...l.matchAll(/(["'`])((?:(?!\1).)*?overflow-(?:(?!\1).)*)\1/g)].map((m) => m[2]!));

/** Padding of at least 4px (`-1` and up, a bracketed or var value, or the algebra's `inset` / `pad`) on an axis. */
const room = (cls: string, axis: "x" | "y") => {
  const sides = axis === "x" ? ["px", "ps", "pe"] : ["py", "pt", "pb"];
  const big = String.raw`(?:[1-9]\d*(?:\.\d+)?|0\.5\b(?!)|\[[^\]]+\]|\([^)]+\))`;
  if (new RegExp(String.raw`(?:^|[\s"'\`])p-${big}`).test(cls)) return true;
  if (/\$\{scrollRoom\}|scrollRoom/.test(cls)) return true;
  if (axis === "x" && /\$\{(?:inset|pad)\[/.test(cls)) return true;
  const [both, a, b] = sides;
  if (new RegExp(String.raw`(?:^|[\s"'\`])${both}-${big}`).test(cls)) return true;
  return (
    new RegExp(String.raw`(?:^|[\s"'\`])${a}-${big}`).test(cls) &&
    new RegExp(String.raw`(?:^|[\s"'\`])${b}-${big}`).test(cls)
  );
};

/**
 * Why a box may clip without room: what it clips draws no ring past its edge. A bar's fill, a
 * shape's slices, an image, a text's end, a surface's own rounded corners (everything in it sits in
 * its padded body), the frame's cells (each 4px around its card), a folding menu group (its rows
 * mark focus with a fill inside them, never an outline). Declared on the box itself
 * (`[--clips:<reason>]`), so the reason is read where the clip is.
 */
const REASONS = new Set(["bar", "shape", "media", "text", "surface", "frame", "fold"]);

describe("nothing is cut by the box it's in", () => {
  it("every clipping box gives its content a ring's room, or says why it needs none", () => {
    const problems: string[] = [];
    for (const f of files(root)) {
      const rel = path.relative(root, f).split(path.sep).join("/");
      if (rel.startsWith("testing/") || rel.endsWith(".test.ts")) continue;
      for (const cls of strings(readFileSync(f, "utf8"))) {
        // Scrollers are the other test's (their scrolling axis has room; the other may clip on purpose).
        if (/(?:^|\s)overflow(?:-[xy])?-(?:auto|scroll)\b/.test(cls)) continue;
        if (!/(?:^|[\s:])overflow(?:-[xy])?-(?:hidden|clip)\b/.test(cls)) continue;
        const reason = /\[--clips:([a-z]+)\]/.exec(cls)?.[1];
        if (reason) {
          if (!REASONS.has(reason)) problems.push(`${rel}: "${reason}" isn't a reason to clip: ${cls.slice(0, 80)}`);
          continue;
        }
        if (/clipRoom|overflow-clip-margin/.test(cls)) continue;
        if (room(cls, "x") && room(cls, "y")) continue;
        problems.push(`${rel}: clips with no room for rings and no reason: ${cls.slice(0, 90)}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("every scroller gives its content a ring's room on the axes it scrolls", () => {
    const problems: string[] = [];
    for (const f of files(root)) {
      const rel = path.relative(root, f).split(path.sep).join("/");
      if (rel.startsWith("testing/") || rel.endsWith(".test.ts")) continue;
      for (const cls of strings(readFileSync(f, "utf8"))) {
        // A box whose own padding is the room (a text area: `--ring-room: own`).
        if (cls.includes("[--ring-room:own]")) continue;
        const both = /(?:^|\s)overflow-(?:auto|scroll)\b/.test(cls);
        const sx = /(?:^|\s)overflow-x-(?:auto|scroll)\b/.test(cls);
        const sy = /(?:^|\s)overflow-y-(?:auto|scroll)\b/.test(cls);
        // Scrolling one way clips the other (CSS turns its `visible` into `auto`), so both need room,
        // unless the other axis is clipped on purpose (`hidden` / `clip`: its content carries its own
        // margin, like the main panel's page inset).
        const clipsX = /(?:^|\s)overflow-x-(?:hidden|clip)\b/.test(cls);
        const clipsY = /(?:^|\s)overflow-y-(?:hidden|clip)\b/.test(cls);
        const x = both || sx || (sy && !clipsX);
        const y = both || sy || (sx && !clipsY);
        if (x && !room(cls, "x")) problems.push(`${rel}: scrolls across with no room for rings: ${cls.slice(0, 90)}`);
        if (y && !room(cls, "y")) problems.push(`${rel}: scrolls down with no room for rings: ${cls.slice(0, 90)}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
