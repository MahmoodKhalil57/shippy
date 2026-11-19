import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { classStrings } from "../vite/recipes.ts";

/**
 * Primitives use Material Design 3's scales (src/styles/theme.css), nothing in between:
 * - elevation: `shadow-elevation-1` … `-5` (or `shadow-none`), never Tailwind's `shadow-sm` / `-lg`
 *   or a hand-made `shadow-[…]`;
 * - shape: M3's corner steps (`rounded-xs` … `rounded-2xl`, `rounded-full`, `rounded-none`), the
 *   colour scheme's role radii (`rounded-field` / `-box` / `-selector`), `rounded-inner` for nested
 *   corners, or a value made of radius tokens — never a raw `rounded-[6px]`;
 * - spacing: M3's spacing steps (2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 36, 40, 48, 56, 64, 72dp),
 *   a value built from tokens or a fluid `clamp()`, or a step limited by the layout algebra
 *   (`min(16px, max(0px, …))`) — never `p-7` (28) or `gap-[13px]`.
 */

const primitivesDir = path.resolve(import.meta.dirname, "../src/components/primitives");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : p.endsWith(".ts") && !p.endsWith("index.ts") ? [p] : [];
  });

const SPACE_STEPS = new Set([
  "0",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "8",
  "9",
  "10",
  "12",
  "14",
  "16",
  "18",
]);
const RADIUS_STEPS = new Set([
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "lg-increased",
  "xl",
  "xl-increased",
  "2xl",
  "full",
  "box",
  "field",
  "selector",
  "inner",
]);
const SIDES = "t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee";
/** A value made from tokens (`var(--…)`, `(--…)`) or a fluid `clamp()` of them. */
const tokenValue = (v: string) => /var\(--|^\(--|clamp\(/.test(v);

/** Problems with one class (variants like `hover:` or `[&.btn-circle]:` stripped). */
export function tokenProblems(cls: string): string[] {
  const base = cls.replace(/^(?:[^[\]:]+:|\[[^\]]*\]:)*/, "").replace(/!$/, "");
  const shadow = /^shadow(?:-(.+))?$/.exec(base);
  if (shadow) {
    const v = shadow[1];
    return v === "none" || /^elevation-[1-5]$/.test(v ?? "")
      ? []
      : [`${cls}: use shadow-elevation-1 … -5 (M3 elevation)`];
  }
  const rounded = new RegExp(`^rounded(?:-(?:${SIDES}))?(?:-(.+))?$`).exec(base);
  if (rounded) {
    const v = rounded[1];
    if (v && (RADIUS_STEPS.has(v) || (/^[[(]/.test(v) && tokenValue(v)))) return [];
    return [`${cls}: use an M3 corner step (rounded-xs … rounded-2xl, full) or a role radius`];
  }
  const space = /^-?(?:gap-x|gap-y|space-x|space-y|gap|px|py|pt|pb|ps|pe|pl|pr|p|mx|my|mt|mb|ms|me|ml|mr|m)-(.+)$/.exec(
    base,
  );
  if (space) {
    const v = space[1]!;
    // The layout algebra's self-limiting padding (layout/algebra.ts `pad`, `inset`): an M3 step,
    // capped so it never leaves the content less than min(7rem, the box).
    const limited = /^\[min\((\d+(?:\.\d+)?)px,max\(0px,calc\(/.exec(v);
    if (limited && SPACE_STEPS.has(String(Number(limited[1]) / 4))) return [];
    if (SPACE_STEPS.has(v) || v === "auto" || (/^[[(]/.test(v) && tokenValue(v))) return [];
    return [`${cls}: use an M3 spacing step (0.5 = 2dp … 18 = 72dp) or a token`];
  }
  return [];
}

describe("primitives use M3's elevation, shape and spacing scales", () => {
  it.each(files(primitivesDir).map((f) => [path.relative(primitivesDir, f).split(path.sep).join("/"), f]))(
    "%s",
    (_, file) => {
      const { classes } = classStrings(readFileSync(file, "utf8"), file);
      const bad = classes.flatMap((c) => c.split(/\s+/)).flatMap(tokenProblems);
      expect([...new Set(bad)]).toEqual([]);
    },
  );
});

describe("the token checks themselves", () => {
  it("accept M3 tokens and reject the rest", () => {
    for (const ok of [
      "shadow-elevation-2",
      "hover:shadow-elevation-4",
      "shadow-none",
      "rounded-xl-increased",
      "rounded-e-field",
      "rounded-inner",
      "rounded-(--main-radius)",
      "active:rounded-[min(var(--radius-sm),var(--radius-field))]",
      "gap-2.5",
      "-ms-(--frame-edge)",
      "px-[clamp(1rem,5cqi,2.5rem)]",
      "mx-auto",
    ])
      expect(tokenProblems(ok), ok).toEqual([]);
    for (const bad of [
      "shadow-lg",
      "shadow-[0_1px_2px_black]",
      "rounded-[6px]",
      "rounded",
      "p-7",
      "gap-[13px]",
      "mt-11",
    ])
      expect(tokenProblems(bad), bad).not.toEqual([]);
  });
});
