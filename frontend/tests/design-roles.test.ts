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

/** Its `size` prop is a display scale (avatar initials grow with the avatar). */
const DISPLAY_SCALE = new Set(["people/avatar.ts"]);

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
    const m = /^bg-(on-surface|base-content|primary|secondary|accent|neutral|info|success|warning|error)\/(\S+)$/.exec(
      b,
    );
    if (m) out.push(`${cls}: use the state-layer utility (hover, focus and press at M3's opacities)`);
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

describe("controls are easy to hit (M3 48px touch, WCAG 24px pointer targets)", () => {
  it.each(files(primitivesDir).map((f) => [path.relative(primitivesDir, f).split(path.sep).join("/"), f]))(
    "%s: every control with a state layer has a touch target",
    (rel, file) => {
      const { classes } = classStrings(readFileSync(file, "utf8"), file);
      // Table rows are full-width targets already (and a ::before hit area doesn't belong on a <tr>).
      const row = (c: string) => rel === "data/table.ts" && c.trim() === "state-layer";
      // A button-like recipe whose base (`btn …`) has the target covers its variant strings.
      const baseHasTarget = classes.some(
        (c) => /(?:^|\s)btn(?:\s|$)/.test(c) && /(?:^|\s)touch-target(?:\s|$)/.test(c),
      );
      const bad = classes.filter(
        (c) =>
          c.split(/\s+/).includes("state-layer") &&
          !c.split(/\s+/).includes("touch-target") &&
          !row(c) &&
          !(baseHasTarget && !/(?:^|\s)btn(?:\s|$)/.test(c)),
      );
      expect(bad, "add `touch-target` next to `state-layer`").toEqual([]);
    },
  );
  it("buttons always have a touch target", () => {
    const { classes } = classStrings(readFileSync(path.join(primitivesDir, "actions/button.ts"), "utf8"), "button.ts");
    expect(classes.some((c) => /(?:^|\s)btn\s/.test(c) && c.includes("touch-target"))).toBe(true);
  });
});

describe("everything that floats is glass", () => {
  const read = (rel: string) => readFileSync(path.join(primitivesDir, rel), "utf8");
  // A primitive that renders a popover or a dialog draws it with the glass material.
  it.each(
    files(primitivesDir)
      .map((f) => [path.relative(primitivesDir, f).split(path.sep).join("/"), f] as const)
      .filter(([, f]) => /\spopover(?:[\s=>]|$)|<dialog\b/m.test(readFileSync(f, "utf8"))),
  )("%s renders a floating surface in glass", (_, file) => {
    expect(readFileSync(file, "utf8")).toMatch(/liquid-glass/);
  });
  it("dropdown panels are always glass (no solid surface option)", () => {
    const src = read("actions/dropdown.ts");
    expect(src).toMatch(/dropdownPanel = rcva\(\s*"liquid-glass /);
    expect(src).not.toMatch(/"base-[123]00": "bg-/);
  });
  it("every select's open list is glass (set once for all selects)", () => {
    const css = readFileSync(path.join(root, "styles/daisy-m3.css"), "utf8");
    expect(css).toMatch(/select::picker\(select\)\s*\{[^}]*@apply liquid-glass/);
  });
});

describe("pages use the semantic components, not hand-built copies", () => {
  const consumers = [...files(path.join(root, "pages")), ...files(path.join(root, "components/composed"))];
  const rel = (f: string) => path.relative(root, f).split(path.sep).join("/");
  const RULES: [RegExp, string][] = [
    [
      /<ui-badge\b(?![^>]*(?:\.count=|\bcount=|\sdot[\s>]))[^>]*>/,
      "a badge is a count (.count) or a dot; a word is a <ui-tag>",
    ],
    [/<ui-flex slot="heading"/, 'a card header is the card\'s heading / count / subhead and slot="trailing"'],
    [/<ui-heading level="1"/, "the page title is <ui-page-header>"],
    [/<ui-card\b[^>]*\b(?:shadow|color|width)=/, 'cards take variant="outlined|filled|elevated" only'],
    [/<ui-join\b/, "a set of options is a <ui-button-group> (ui-join is for inputs and pagination)"],
    [
      /<ui-button\b[^>]*\.(?:color|variant)=\$\{[^}]*\?\s*"(?:primary|tonal|soft)"\s*:\s*(?:undefined|"text"|"ghost")\s*\}/,
      "selection isn't a colour swap: use <ui-button-group> or a toggle (toggle ?selected)",
    ],
    [/<ui-toggle\b/, "an on/off setting is a <ui-switch>; a statement someone confirms is a <ui-checkbox>"],
    [
      /<ui-(?:text-input|textarea|select|combobox)\b(?![^>]*\s[.?]?(?:label|legend|aria-label|leading|floating|placeholder)[=\s>])[^>]*>/,
      "every field has a name: label, legend, aria-label (or a search field's placeholder)",
    ],
    [
      /<ui-button\b(?:[^>]|\$\{[^}]*\})*>\s*<ui-icon\b[^>]*>\s*<\/ui-icon\s*>\s*<\/ui-button\s*>/,
      "an icon-only action is <ui-icon-button label> (named, with a tooltip)",
    ],
    [
      /<ui-text-input\b(?:[^>]|\$\{[^}]*\})*?\s(?:type|icon)="search"/,
      "a search field is <ui-search label> (icon, clear, Escape)",
    ],
    [/<ui-button\b[^>]*variant="field"/, "a search launcher is <ui-search launcher>"],
    [
      /<ui-progress\b(?:[^>]|\$\{[^}]*\})*?\s\.?(?:color|tone)=/,
      "progress is always primary; a measurement (3 of 5 ready) is a <ui-gauge tone>",
    ],
    [/<ui-steps\b(?:[^>]|\$\{[^}]*\})*?\s\.?color=/, "steps take one tone (primary, warning, error)"],
  ];
  it.each(consumers.map((f) => [rel(f), f]))("%s", (_, file) => {
    const src = readFileSync(file, "utf8");
    const composed = rel(file).startsWith("components/");
    const bad = RULES.filter(([re]) => !(composed && re.source.includes("ui-join"))).flatMap(([re, why]) =>
      re.test(src) ? [`${why}: ${src.match(re)![0].slice(0, 80)}`] : [],
    );
    expect(bad).toEqual([]);
  });
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
      "state-layer",
      "[&_tbody_tr]:state-layer",
      "bg-on-surface/(--state-focus)",
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
      "hover:bg-on-surface/(--state-hover)",
      "text-sm",
      "[&_th]:text-xs",
      "text-[13px]",
    ])
      expect(roleProblems(bad), bad).not.toEqual([]);
  });
});
