import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { classStrings } from "../plugins/recipes.ts";

/**
 * Primitives speak in Material Design 3 roles (src/styles/theme.css), not raw values:
 * - colour: ink is `on-surface` / `on-surface-variant` / `on-surface-disabled`, lines are `outline`
 *   (controls) / `outline-variant` (decoration), fills are `surface` and the `surface-container-*`
 *   steps, tints are the `*-container` pairs, and state layers use `state-layer` or
 *   `/(--state-hover)` etc. Never "base-content at 70%", `bg-base-200` or `hover:bg-primary/12`.
 * - type: a role from the type scale (`text-body-md`, `text-title-sm`…), never `text-sm` or a
 *   pixel size. Components whose `size` prop is itself a display scale are listed below.
 * Pages and composed components set text by role too: `<ui-text variant="body-sm">`, never the
 * old `size` / `weight` attributes.
 */

const root = path.resolve(import.meta.dirname, "../src");
const primitivesDir = path.join(root, "components/primitives");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : p.endsWith(".ts") && !p.endsWith("index.ts") ? [p] : [];
  });

/** Their `size` prop is a decorative display scale (countdown digits, rotating hero words…). */
const DISPLAY_SCALE = new Set([
  "actions/swap.ts",
  "data/countdown.ts",
  "media/text-rotate.ts",
  "showcase/diff.ts",
  "people/avatar.ts",
]);

const base = (cls: string) => cls.replace(/^(?:[^[\]:]+:|\[[^\]]*\]:)*/, "").replace(/!$/, "");

/** Problems with one class (variants like `hover:` stripped, except where they matter). */
export function roleProblems(cls: string, displayScale = false): string[] {
  const b = base(cls);
  const out: string[] = [];
  if (
    /^(?:text|bg|border(?:-[trblxyse])?|ring|outline|divide|decoration|fill|stroke|from|to|via)-base-content\/\S+$/.test(
      b,
    )
  )
    out.push(`${cls}: use a role (on-surface-variant, outline, outline-variant, surface-container-*, state layer)`);
  if (/^(?:bg|border(?:-[trblxyse])?|ring|divide)-base-(?:200|300)(?:\/\S+)?$/.test(b))
    out.push(`${cls}: use surface-container-* / outline-variant`);
  if (/^bg-base-100(?:\/\S+)?$/.test(b)) out.push(`${cls}: use bg-surface`);
  // A state layer is the content colour at the M3 opacities, from tokens.
  if (/(?:^|:)(?:hover|focus|focus-visible|active)\]?:/.test(cls) || /:(?:hover|focus|active)\]:/.test(cls)) {
    const m =
      /^bg-(on-surface|base-content|primary|secondary|accent|neutral|info|success|warning|error)\/([\d.[\]]+)$/.exec(b);
    if (m) out.push(`${cls}: use a state token (bg-${m[1]}/(--state-hover)) or state-layer`);
  }
  if (!displayScale && /^text-(?:xs|sm|base|lg|xl|[2-9]xl)$/.test(b))
    out.push(`${cls}: use a type role (text-body-md, text-title-sm…)`);
  if (/^text-\[(?:[\d.]+(?:px|rem)\]|clamp|calc)/.test(b)) out.push(`${cls}: use a type role, not a raw font size`);
  return out;
}

describe("primitives use colour and type roles", () => {
  it.each(files(primitivesDir).map((f) => [path.relative(primitivesDir, f).split(path.sep).join("/"), f]))(
    "%s",
    (rel, file) => {
      const { classes } = classStrings(readFileSync(file, "utf8"), file);
      const bad = classes.flatMap((c) => c.split(/\s+/)).flatMap((c) => roleProblems(c, DISPLAY_SCALE.has(rel)));
      expect([...new Set(bad)]).toEqual([]);
    },
  );
});

describe("pages and composed components set text by role", () => {
  const consumers = [...files(path.join(root, "pages")), ...files(path.join(root, "components/composed"))];
  it.each(consumers.map((f) => [path.relative(root, f).split(path.sep).join("/"), f]))("%s", (_, file) => {
    const src = readFileSync(file, "utf8");
    const bad = [...src.matchAll(/<ui-(?:text|heading)(?=[\s>])(?:[^>$]|\$\{[^}]*\})*?\s\.?(size|weight)=/g)].map((m) =>
      m[0].slice(0, 80),
    );
    expect(bad, 'use variant="body-md" / emphasized').toEqual([]);
  });
});

describe("the role checks themselves", () => {
  it("accept roles and reject raw values", () => {
    for (const ok of [
      "text-on-surface-variant",
      "border-outline-variant",
      "bg-surface-container-low",
      "hover:bg-on-surface/(--state-hover)",
      "bg-primary-container",
      "text-body-md",
      "[&_thead_th]:text-label-md",
      "bg-scrim/32",
    ])
      expect(roleProblems(ok), ok).toEqual([]);
    for (const bad of [
      "text-base-content/70",
      "[&_td]:border-base-content/10",
      "bg-base-200",
      "hover:bg-primary/12",
      "hover:bg-base-content/5",
      "text-sm",
      "[&_th]:text-xs",
      "text-[13px]",
    ])
      expect(roleProblems(bad), bad).not.toEqual([]);
  });
});
