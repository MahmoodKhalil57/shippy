import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { classStrings } from "../plugins/recipes.ts";
import { durations, easings, springs } from "../plugins/motion.ts";

/**
 * Motion is Material Design 3's, everywhere (src/styles/motion.css): every transition and
 * animation a primitive or stylesheet writes takes its timing from the M3 tokens.
 * - durations: `--duration-*` / `--settle-*` (springs and M3's duration scale), or 0;
 * - easing: `--ease-*` (springs and M3's easing curves); never a raw cubic-bezier or keyword;
 * - Tailwind: `duration-(--duration-…)`, `ease-<token>`, `delay-(--…)`, never `duration-200`,
 *   `ease-in-out` or `delay-75`.
 */

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const primitivesDir = path.join(src, "components", "primitives");
const stylesDir = path.join(src, "styles");

const files = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p, ext) : ext.test(e.name) ? [p] : [];
  });
const rel = (f: string) => path.relative(src, f).split(path.sep).join("/");
const read = (f: string) => readFileSync(f, "utf8");

const TOKENS = new Set([
  ...Object.keys(springs),
  ...Object.keys(easings),
  "emphasized",
  "linear",
  ...Object.keys(durations),
]);
/** Ambient loops whose cycle length is the component's own token. */

/** A raw time (`.2s`, `150ms`) other than zero. */
const RAW_TIME = /(?<![\w-])(?:\d*\.)?\d+m?s\b/g;
const RAW_EASING = /cubic-bezier\(|steps\(|\b(?:ease|ease-in|ease-out|ease-in-out)\b(?!-)/;

/** Problems in one transition / animation value (a CSS declaration's value or an arbitrary class's). */
function timingProblems(value: string): string[] {
  const problems: string[] = [];
  for (const [time] of value.matchAll(RAW_TIME)) if (Number.parseFloat(time) !== 0) problems.push(`raw time ${time}`);
  if (RAW_EASING.test(value)) problems.push(`raw easing in "${value}"`);
  for (const [, name] of value.matchAll(/--(?:ease|duration|settle)-([\w-]+)/g))
    if (!TOKENS.has(name!)) problems.push(`unknown motion token --…-${name}`);
  return problems;
}

/** Problems in one class (variants like `hover:` stripped). */
function classProblems(cls: string): string[] {
  const base = cls.replace(/^(?:[^[\]:]+:|\[[^\]]*\]:)*/, "");
  const arbitrary = /^\[(transition|animation)[\w-]*:(.+)\]$/.exec(base);
  if (arbitrary) return timingProblems(arbitrary[2]!.replace(/_/g, " "));
  const duration = /^duration-(.+)$/.exec(base);
  if (duration && !/^\(--(?:duration|settle)-[\w-]+\)$|^0$/.test(duration[1]!))
    return [`${cls}: use a duration token, e.g. duration-(--duration-effects)`];
  const ease = /^ease-(.+)$/.exec(base);
  if (ease && !TOKENS.has(ease[1]!)) return [`${cls}: use an M3 easing (ease-spatial, ease-emphasized-decelerate…)`];
  const delay = /^delay-(.+)$/.exec(base);
  if (delay && !/^\(--(?:duration|settle)-[\w-]+\)$|^0$/.test(delay[1]!))
    return [`${cls}: use a token delay, e.g. delay-(--settle-spatial)`];
  return [];
}

describe("primitives time their motion with M3's tokens", () => {
  it.each(files(primitivesDir, /\.ts$/).map((f) => [rel(f), f]))("%s", (_, file) => {
    const source = read(file);
    const { classes } = classStrings(source, file);
    const bad = classes.flatMap((c) => c.split(/\s+/)).flatMap((c) => classProblems(c));
    // Script animations (Element.animate) read their timing from the tokens too.
    for (const m of source.matchAll(/\b(duration|easing|delay)\s*:\s*(\d+|"[^"]*")/g))
      bad.push(`${m[0]}: read the token (getComputedStyle(...).getPropertyValue("--duration-…"))`);
    expect(bad).toEqual([]);
  });
});

describe("stylesheets time their motion with M3's tokens", () => {
  const sheets = [...files(stylesDir, /\.css$/), path.join(src, "index.css")].filter(
    (f) => path.basename(f) !== "motion.css", // generated: it defines the tokens
  );
  it.each(sheets.map((f) => [rel(f), f]))("%s", (_, file) => {
    const css = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
    const bad = [
      ...css.matchAll(/(?<![\w-])(transition|animation)(?:-(?:duration|delay|timing-function))?\s*:\s*([^;{}]+)/g),
    ]
      .filter(([, , value]) => !/^\s*(?:none|revert-layer|inherit|initial|unset)\s*$/.test(value!))
      .flatMap(([decl, , value]) => timingProblems(value!).map((p) => `${decl.trim()}: ${p}`));
    expect(bad).toEqual([]);
  });
});

describe("the motion checks themselves", () => {
  it("accept tokens and reject raw timings", () => {
    expect(classProblems("duration-(--duration-spatial)")).toEqual([]);
    expect(classProblems("ease-emphasized-decelerate")).toEqual([]);
    expect(classProblems("hover:[transition:width_var(--duration-spatial)_var(--ease-spatial)]")).toEqual([]);
    expect(classProblems("duration-200")).not.toEqual([]);
    expect(classProblems("ease-in-out")).not.toEqual([]);
    expect(classProblems("delay-75")).not.toEqual([]);
    expect(classProblems("[transition:color_0.2s]")).not.toEqual([]);
    expect(timingProblems("opacity .2s cubic-bezier(.4,0,.2,1)")).toHaveLength(2);
    expect(timingProblems("all 0s allow-discrete var(--duration-spatial)")).toEqual([]);
  });
});
