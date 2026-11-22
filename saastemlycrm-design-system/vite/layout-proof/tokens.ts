/**
 * The width vocabulary: what each class does to an element's inline size, in the subset of CSS
 * the layout proof models (./README.md). A class either has a width effect here, is width-neutral
 * (colour, type, motion, state), or is unknown, and an unknown class that could change a width is
 * a build error: the design system's layout is written only in this vocabulary.
 *
 * Lengths are linear in the text size: `{ px, rem }` is `px + rem × 16 × scale`. Spacing utilities
 * are px (theme.css: the spacing unit is px, so spacing doesn't grow with text); `rem` lengths do.
 */

/** `px + rem × 16 × textScale`. */
export interface Len {
  px: number;
  rem: number;
}
export const len = (px = 0, rem = 0): Len => ({ px, rem });
export const ZERO: Len = len();
export const at = (l: Len, scale: number) => l.px + l.rem * 16 * scale;
export const add = (...ls: Len[]): Len => ({
  px: ls.reduce((s, l) => s + l.px, 0),
  rem: ls.reduce((s, l) => s + l.rem, 0),
});
export const times = (l: Len, n: number): Len => ({ px: l.px * n, rem: l.rem * n });

/** A size: a length, a share of the containing box, or one of CSS's keywords. */
export type Size =
  | { kind: "len"; len: Len }
  | { kind: "pct"; pct: number }
  /** `min(100%, len)`. */
  | { kind: "minPct"; pct: number; len: Len }
  /** `clamp(min, cqi, max)` against the nearest container. */
  | { kind: "fluid"; min: Len; cqi: number; max: Len }
  | { kind: "full" }
  | { kind: "fit" }
  | { kind: "max" }
  | { kind: "min" }
  | { kind: "auto" }
  | { kind: "var"; name: string };

/** Under which condition a class applies. */
export type Condition =
  /** Always. */
  | { kind: "always" }
  /** A window width range, px: `md:` (≥ 48rem), `max-md:`. Viewport media queries use rem at 16px. */
  | { kind: "window"; min?: Len; max?: Len }
  /** The nearest container (or the one named) is at least `min` / under `max`. */
  | { kind: "container"; name?: string; min?: Len; max?: Len }
  /** A state (hover, open, aria-…, group-…): the proof takes both, with and without. */
  | { kind: "state"; what: string };

/** What a class does to the element's inline size. */
export type Effect =
  | {
      kind: "display";
      value:
        | "block"
        | "inline"
        | "inline-block"
        | "flex"
        | "inline-flex"
        | "grid"
        | "inline-grid"
        | "contents"
        | "none"
        | "table";
    }
  | { kind: "direction"; value: "row" | "col" }
  | { kind: "wrap"; value: boolean }
  | { kind: "gapX"; len: Len }
  /** Inline padding on both sides (each side). */
  | { kind: "padX"; side: "both" | "start" | "end"; size: Size }
  | { kind: "marginX"; side: "both" | "start" | "end"; len: Len | "auto" }
  | { kind: "borderX"; side: "both" | "start" | "end"; px: number }
  | { kind: "width"; size: Size }
  | { kind: "minWidth"; size: Size }
  | { kind: "maxWidth"; size: Size }
  | { kind: "basis"; size: Size }
  | { kind: "grow"; value: number }
  | { kind: "shrink"; value: number }
  /** `flex-1` and friends: grow, shrink and basis together. */
  | { kind: "flex"; grow: number; shrink: number; basis: Size }
  | { kind: "overflowX"; value: "visible" | "hidden" | "clip" | "auto" }
  | { kind: "whitespace"; value: "normal" | "nowrap" | "pre-line" | "pre" }
  /** `truncate`: nowrap, hidden overflow, ellipsis: its narrowest width is 0. */
  | { kind: "truncate" }
  /** `[overflow-wrap:break-word]`: a word too long for the line breaks. */
  | { kind: "breakWord" }
  | { kind: "gridCols"; cols: GridCols }
  | { kind: "colSpan"; span: number | "full" }
  | { kind: "container"; name?: string }
  | { kind: "position"; value: "static" | "relative" | "sticky" | "absolute" | "fixed" }
  /** Text role: prose (body, title, headline) must get a readable column; labels needn't. */
  | { kind: "text"; role: "prose" | "label" }
  /** Sets a custom property (`[--card-p:…]`). */
  | { kind: "setVar"; name: string; size: Size }
  /** A daisyUI component class, with its declared semantics (./daisy.ts). */
  | { kind: "daisy"; name: string }
  | { kind: "srOnly" }
  /** `grid-flow-col`: every item adds a column. */
  | { kind: "flowCol" };

export type GridCols =
  /** `repeat(auto-fit, minmax(min(100%, min), 1fr))`. */
  { kind: "fit"; min: Len } | { kind: "tracks"; tracks: Track[] };
export type Track =
  | { kind: "fixed"; len: Len }
  | { kind: "auto" }
  | { kind: "fr"; min: Len }
  | { kind: "minmaxContent"; min: Size };

export interface ParsedClass {
  token: string;
  conditions: Condition[];
  /** The class styles other elements (`[&_dd]:…`, `[&>.card-body]:…`): the selector, and what it does. */
  target?: string;
  effect: Effect | "neutral" | "unknown";
}

const SPACING = (n: string) => len(Number(n) * 4);
const NAMED_REM: Record<string, number> = {
  "3xs": 16,
  "2xs": 18,
  xs: 20,
  sm: 24,
  md: 28,
  lg: 32,
  xl: 36,
  "2xl": 42,
  "3xl": 48,
  "4xl": 56,
  "5xl": 64,
  "6xl": 72,
  "7xl": 80,
};
/** Tailwind's viewport breakpoints, rem. */
const BREAKPOINT: Record<string, number> = { sm: 40, md: 48, lg: 64, xl: 80, "2xl": 96 };
/** Tailwind's container sizes, rem (`@sm` = 24rem). */
const CONTAINER: Record<string, number> = { ...NAMED_REM };

/** A CSS length in an arbitrary value: `12px`, `1.5rem`, `0`. */
export function cssLen(v: string): Len | null {
  const m = /^(-?\d*\.?\d+)(px|rem|em)?$/.exec(v.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return m[2] === "rem" || m[2] === "em" ? len(0, n) : len(n);
}

/** An arbitrary size: a length, `%`, `min(100%,x)`, `clamp(a,ncqi,b)`, `var(--x)`. */
export function cssSize(v: string): Size | null {
  v = v.replace(/_/g, " ").trim();
  const l = cssLen(v);
  if (l) return { kind: "len", len: l };
  let m = /^(\d+(?:\.\d+)?)%$/.exec(v);
  if (m) return { kind: "pct", pct: Number(m[1]) };
  m = /^min\(\s*100%\s*,\s*([^)]+)\)$/.exec(v);
  if (m && cssLen(m[1]!)) return { kind: "minPct", pct: 100, len: cssLen(m[1]!)! };
  m = /^clamp\(\s*([^,]+),\s*(\d+(?:\.\d+)?)cqi\s*,\s*([^)]+)\)$/.exec(v);
  if (m && cssLen(m[1]!) && cssLen(m[3]!))
    return { kind: "fluid", min: cssLen(m[1]!)!, cqi: Number(m[2]), max: cssLen(m[3]!)! };
  m = /^var\((--[\w-]+)\)$/.exec(v);
  if (m) return { kind: "var", name: m[1]! };
  // The layout algebra's self-limiting padding, `min(p, max(0px, calc((100% − 7rem)/2)))`: at most p.
  m = /^min\((.+?),\s*max\(0px\s*,\s*calc\(/.exec(v);
  if (m) {
    const p = cssLen(m[1]!);
    return p ? { kind: "len", len: { px: Math.min(p.px, 4), rem: 0 } } : { kind: "len", len: ZERO };
  }
  return null;
}

/** A spacing or sizing value after the utility's prefix: `4`, `[1.5rem]`, `(--x)`, `full`, `xs`. */
function sizeValue(v: string, named = true): Size | null {
  if (/^\d+(\.\d+)?$/.test(v)) return { kind: "len", len: SPACING(v) };
  if (v === "px") return { kind: "len", len: len(1) };
  if (v === "0") return { kind: "len", len: ZERO };
  if (v === "full") return { kind: "full" };
  if (v === "fit") return { kind: "fit" };
  if (v === "max") return { kind: "max" };
  if (v === "min") return { kind: "min" };
  if (v === "auto") return { kind: "auto" };
  if (/^\d+\/\d+$/.test(v)) {
    const [a, b] = v.split("/").map(Number);
    return { kind: "pct", pct: (a! / b!) * 100 };
  }
  if (named && v in NAMED_REM) return { kind: "len", len: len(0, NAMED_REM[v]!) };
  if (v.startsWith("[") && v.endsWith("]")) return cssSize(v.slice(1, -1));
  if (v.startsWith("(") && v.endsWith(")")) return { kind: "var", name: v.slice(1, -1) };
  return null;
}

/** Splits `a:b:[x:y]:c` at the top level. */
export function splitVariants(token: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) {
      parts.push(token.slice(from, i));
      from = i + 1;
    }
  }
  parts.push(token.slice(from));
  return parts;
}

/** A variant as a condition, or a target selector for classes that style other elements. */
function variant(v: string): { condition?: Condition; target?: string } | null {
  if (v in BREAKPOINT) return { condition: { kind: "window", min: len(0, BREAKPOINT[v]!) } };
  let m = /^max-(sm|md|lg|xl|2xl)$/.exec(v);
  if (m) return { condition: { kind: "window", max: len(0, BREAKPOINT[m[1]!]!) } };
  m = /^@(min-|max-)?(\[[^\]]+\]|[\d]?x?[a-z]+)(?:\/([\w-]+))?$/.exec(v);
  if (m) {
    const size = m[2]!.startsWith("[")
      ? cssLen(m[2]!.slice(1, -1))
      : m[2]! in CONTAINER
        ? len(0, CONTAINER[m[2]!]!)
        : null;
    if (!size) return null;
    return { condition: { kind: "container", name: m[3], ...(m[1] === "max-" ? { max: size } : { min: size }) } };
  }
  // Arbitrary selectors: on this element in some state (`[details[open]>&]:`), or on others (`[&_dd]:`).
  if (v.startsWith("[") && v.endsWith("]")) {
    const sel = v.slice(1, -1);
    if (sel.startsWith("@")) return { condition: { kind: "state", what: sel } }; // @supports, @container style()
    if (/&[_>+~]/.test(sel) || /&\./.test(sel) || /&:/.test(sel)) {
      // `&.x` / `&:x` are this element in a state; `&_y` / `&>y` are other elements.
      if (/&[_>+~]/.test(sel)) return { target: sel };
      return { condition: { kind: "state", what: sel } };
    }
    return { condition: { kind: "state", what: sel } };
  }
  // `*:` / `**:` style children.
  if (v === "*" || v === "**") return { target: v === "*" ? "&>*" : "&_*" };
  // States: pseudo-classes, group-/peer-, aria-/data-, has-/not-/in-, motion, dark, supports, print.
  if (
    /^(?:hover|focus|focus-visible|focus-within|active|disabled|enabled|checked|indeterminate|open|visited|target|required|invalid|valid|placeholder-shown|read-only|empty|first|last|only|odd|even|first-of-type|last-of-type|before|after|placeholder|file|marker|selection|backdrop|details-content|dark|light|print|portrait|landscape|ltr|rtl|motion-safe|motion-reduce|contrast-more|contrast-less|forced-colors|starting|pointer-fine|pointer-coarse|any-pointer-fine|any-pointer-coarse|user-valid|user-invalid|inert)$/.test(
      v,
    ) ||
    /^(?:group|peer|has|not|in|aria|data|supports|not-supports|nth|nth-last)(?:-|$)/.test(v) ||
    /^(?:group|peer)-[\w-]+\/[\w-]+$/.test(v)
  )
    return { condition: { kind: "state", what: v } };
  return null;
}

/** Width-neutral prefixes: colour, type, effects, motion, interaction, vertical sizes, positioning offsets. */
const NEUTRAL =
  /^(?:-?(?:bg|text-(?:on|primary|secondary|accent|neutral|info|success|warning|error|base|current|transparent|inherit|white|black|surface|outline|center|start|end|left|right|justify|xs|sm|base|lg|xl|\d)|from|via|to|fill|stroke|border-(?:outline|primary|secondary|accent|neutral|info|success|warning|error|base|current|transparent|surface|on|dashed|dotted|solid|none|t|b|y|double)|outline|ring|shadow|opacity|rounded|font|tracking|leading|italic|not-italic|underline|no-underline|line-through|decoration|uppercase|lowercase|capitalize|normal-case|antialiased|tabular-nums|align|cursor|pointer-events|select|resize|touch|scroll-|snap|transition|duration|delay|ease|animate|transform|translate|scale|rotate|skew|origin|backdrop|blur|brightness|contrast|grayscale|invert|saturate|sepia|filter|drop-shadow|mix-blend|isolate|isolation|z|order|items|justify|self|place|content-|object|aspect|h|min-h|max-h|top|bottom|inset-y|mt|mb|my|pt|pb|py|space-y|list|visible|invisible|appearance|will-change|forced-color|overscroll|caret|accent|columns|break-inside|box-decoration|fill-|sr-only-focus|line-clamp|outline-offset|underline-offset|indent|vertical|hyphens|wrap-|field-sizing|state-layer|touch-target|liquid-glass|frame-lip|frame-liquid|frame-matte|scrim|shimmer|mask|group|peer|skeleton|swap|countdown|diff|loading|status|tooltip|glass|text-shadow|perspective|backface|transform-style|gap-y|row-|grid-rows|grid-flow|auto-rows|auto-cols|place-|justify-items|col-start|col-end|tabular|ordinal|slashed-zero|lining-nums|oldstyle-nums|proportional-nums|diagonal-fractions|stacked-fractions|text-wrap|\[text-wrap|\[transition|\[anchor|\[position-|\[container-type|\[view-transition|\[scrollbar|\[clip-path|\[mask|\[stroke|\[fill|\[color|\[background|\[box-shadow|\[outline|\[opacity|\[translate|\[rotate|\[scale|\[transform|\[animation|\[--outer|\[--state|\[--radius|\[--depth|\[--app|\[--shift|\[--swatch|\[--menu|\[--scrollbar|\[--duration|\[--ease|\[--settle|\[--at|\[--x|\[--top|\[--bar|\[--main-radius|\[--glass|\[cursor|\[font|\[letter|\[line-height|\[text-|\[z-index|\[top|\[bottom|\[height|\[min-height|\[max-height|\[content-visibility|\[contain-intrinsic|\[interpolate-size|\[visibility|\[pointer-events|\[user-select|\[touch|\[overscroll|\[scroll|\[accent|\[caret|\[appearance|\[-webkit|\[counter|\[quotes|\[list-style|\[object|\[aspect|\[border-radius|\[border-color|\[order|\[align|\[justify-self|\[place-self|\[grid-row|\[grid-area|\[isolation|\[mix-blend|\[filter|\[backdrop|\[will-change|\[forced-color|\[print|\[color-scheme|\[field-sizing|\[resize|\[inset-block|\[margin-block|\[padding-block|\[block-size|\[min-block|\[max-block|\[transition-behavior|\[display:none\]))/;

/** One class as a width effect. */
export function parseClass(token: string): ParsedClass {
  const parts = splitVariants(token.replace(/^!|!$/g, ""));
  const base = parts.pop()!.replace(/^!|!$/g, "");
  const conditions: Condition[] = [];
  let target: string | undefined;
  for (const v of parts) {
    const p = variant(v);
    if (!p) return { token, conditions, effect: "unknown" };
    if (p.condition) conditions.push(p.condition);
    if (p.target) target = target ? `${target} ${p.target}` : p.target;
  }
  return { token, conditions, target, effect: effectOf(base) };
}

const DISPLAY: Record<string, Effect> = {
  block: { kind: "display", value: "block" },
  inline: { kind: "display", value: "inline" },
  "inline-block": { kind: "display", value: "inline-block" },
  flex: { kind: "display", value: "flex" },
  "inline-flex": { kind: "display", value: "inline-flex" },
  grid: { kind: "display", value: "grid" },
  "inline-grid": { kind: "display", value: "inline-grid" },
  contents: { kind: "display", value: "contents" },
  hidden: { kind: "display", value: "none" },
  table: { kind: "display", value: "table" },
  "flex-row": { kind: "direction", value: "row" },
  "flex-row-reverse": { kind: "direction", value: "row" },
  "flex-col": { kind: "direction", value: "col" },
  "flex-col-reverse": { kind: "direction", value: "col" },
  "flex-wrap": { kind: "wrap", value: true },
  "flex-wrap-reverse": { kind: "wrap", value: true },
  "flex-nowrap": { kind: "wrap", value: false },
  grow: { kind: "grow", value: 1 },
  "flex-grow": { kind: "grow", value: 1 },
  "grow-0": { kind: "grow", value: 0 },
  shrink: { kind: "shrink", value: 1 },
  "shrink-0": { kind: "shrink", value: 0 },
  "flex-1": { kind: "flex", grow: 1, shrink: 1, basis: { kind: "len", len: ZERO } },
  "flex-auto": { kind: "flex", grow: 1, shrink: 1, basis: { kind: "auto" } },
  "flex-none": { kind: "flex", grow: 0, shrink: 0, basis: { kind: "auto" } },
  "flex-initial": { kind: "flex", grow: 0, shrink: 1, basis: { kind: "auto" } },
  "overflow-hidden": { kind: "overflowX", value: "hidden" },
  "overflow-clip": { kind: "overflowX", value: "clip" },
  "overflow-auto": { kind: "overflowX", value: "auto" },
  "overflow-scroll": { kind: "overflowX", value: "auto" },
  "overflow-visible": { kind: "overflowX", value: "visible" },
  "overflow-x-hidden": { kind: "overflowX", value: "hidden" },
  "overflow-x-clip": { kind: "overflowX", value: "clip" },
  "overflow-x-auto": { kind: "overflowX", value: "auto" },
  "overflow-x-scroll": { kind: "overflowX", value: "auto" },
  "overflow-x-visible": { kind: "overflowX", value: "visible" },
  "whitespace-normal": { kind: "whitespace", value: "normal" },
  "whitespace-nowrap": { kind: "whitespace", value: "nowrap" },
  "whitespace-pre-line": { kind: "whitespace", value: "pre-line" },
  "whitespace-pre-wrap": { kind: "whitespace", value: "pre-line" },
  "whitespace-pre": { kind: "whitespace", value: "pre" },
  "whitespace-break-spaces": { kind: "whitespace", value: "pre-line" },
  truncate: { kind: "truncate" },
  "text-ellipsis": { kind: "overflowX", value: "hidden" },
  "[overflow-wrap:break-word]": { kind: "breakWord" },
  "[overflow-wrap:anywhere]": { kind: "breakWord" },
  "wrap-anywhere": { kind: "breakWord" },
  "break-words": { kind: "breakWord" },
  "wrap-break-word": { kind: "breakWord" },
  "break-all": { kind: "breakWord" },
  static: { kind: "position", value: "static" },
  relative: { kind: "position", value: "relative" },
  sticky: { kind: "position", value: "sticky" },
  absolute: { kind: "position", value: "absolute" },
  fixed: { kind: "position", value: "fixed" },
  "sr-only": { kind: "srOnly" },
  "not-sr-only": "neutral" as unknown as Effect,
  "@container": { kind: "container" },
  border: { kind: "borderX", side: "both", px: 1 },
  "border-x": { kind: "borderX", side: "both", px: 1 },
  "border-s": { kind: "borderX", side: "start", px: 1 },
  "border-e": { kind: "borderX", side: "end", px: 1 },
  "border-0": { kind: "borderX", side: "both", px: 0 },
  "col-span-full": { kind: "colSpan", span: "full" },
  "mx-auto": { kind: "marginX", side: "both", len: "auto" },
  "ms-auto": { kind: "marginX", side: "start", len: "auto" },
  "me-auto": { kind: "marginX", side: "end", len: "auto" },
};

/** daisyUI component classes whose width behaviour ./daisy.ts declares. */
export const DAISY = new Set([
  "btn",
  "card",
  "card-body",
  "card-title",
  "card-actions",
  "badge",
  "input",
  "select",
  "textarea",
  "label",
  "fieldset",
  "fieldset-legend",
  "menu",
  "menu-title",
  "table",
  "tabs",
  "tab",
  "steps",
  "step",
  "join",
  "join-item",
  "divider",
  "modal-box",
  "dropdown-content",
  "toggle",
  "checkbox",
  "radio",
  "range",
  "progress",
  "loading",
  "avatar",
  "kbd",
  "chat",
  "chat-bubble",
  "breadcrumbs",
  "collapse",
  "collapse-title",
  "collapse-content",
  "link",
  "mockup-window",
  "file-input",
  "stats",
  "stat",
  "timeline",
  "indicator",
  "rating",
  "filter",
  "validator",
  "status",
  "swap",
  "mask",
  "navbar",
  "footer",
  "hero",
  "drawer",
  "dock",
  "carousel",
  "diff",
  "countdown",
  "tooltip",
  "skeleton",
  "skeleton-text",
  "floating-label",
  "otp",
  "modal",
  "dropdown",
]);

/** Custom properties that feed a width (daisyUI's paddings, the frame): setting one is a width class. */
export const WIDTH_VARS = new Set([
  "--card-p",
  "--btn-p",
  "--frame-edge",
  "--frame-slack",
  "--frame-pad-x",
  "--frame-gap",
  "--frame-rail",
  "--box-basis",
  "--main-min",
  "--main-comfort",
  "--size",
]);

function effectOf(base: string): Effect | "neutral" | "unknown" {
  if (base in DISPLAY) return DISPLAY[base]!;
  // daisyUI components and their modifiers (`btn-sm`, `card-md`, `badge-soft`): the component class
  // carries the width semantics; size modifiers are read with it (./daisy.ts).
  if (/^list-(?:disc|decimal|none|inside|outside|image)/.test(base)) return "neutral"; // list-style, not daisyUI's list
  if (DAISY.has(base)) return { kind: "daisy", name: base };
  const daisyPrefix = [...DAISY].find((d) => base.startsWith(`${d}-`));
  if (daisyPrefix) return { kind: "daisy", name: base };
  let m: RegExpExecArray | null;
  // Text roles (M3 type scale): body / title / headline / display wrap as prose; label is a label.
  if ((m = /^text-(body|title|headline|display|label)-(?:sm|md|lg)$/.exec(base)))
    return { kind: "text", role: m[1] === "label" ? "label" : "prose" };
  if (base === "grid-flow-col" || base === "grid-flow-col-dense") return { kind: "flowCol" };
  if (base.startsWith("basis-")) return { kind: "basis", size: sizeValue(base.slice(6)) ?? { kind: "auto" } };
  if (base.startsWith("gap-y-") || base.startsWith("overflow-y-") || base.startsWith("-space-x-")) return "neutral";
  if ((m = /^gap(?:-x)?-(.+)$/.exec(base))) {
    const s = sizeValue(m[1]!, false);
    return { kind: "gapX", len: s?.kind === "len" ? s.len : ZERO };
  }
  if ((m = /^p([xse]?)-(.+)$/.exec(base))) {
    const s = sizeValue(m[2]!, false);
    if (!s) return "unknown";
    return { kind: "padX", side: m[1] === "s" ? "start" : m[1] === "e" ? "end" : "both", size: s };
  }
  if (/^p[lr]-/.test(base) || /^m[lr]-/.test(base) || /^-m[lr]-/.test(base) || /^(?:left|right)-/.test(base))
    return "unknown"; // physical sides: write start / end (logical) so right-to-left is right by construction
  if ((m = /^m([xse]?)-auto$/.exec(base)))
    return { kind: "marginX", side: m[1] === "s" ? "start" : m[1] === "e" ? "end" : "both", len: "auto" };
  if ((m = /^(-?)m([xse]?)-(.+)$/.exec(base))) {
    const s = sizeValue(m[3]!, false);
    if (!s || s.kind !== "len") return "unknown";
    const l = m[1] ? { px: -s.len.px, rem: -s.len.rem } : s.len;
    return { kind: "marginX", side: m[2] === "s" ? "start" : m[2] === "e" ? "end" : "both", len: l };
  }
  if ((m = /^border-([xse])?-?(\d+|\[(\d+)px\])$/.exec(base)) && !/^border-[tby]/.test(base))
    return { kind: "borderX", side: m[1] === "s" ? "start" : m[1] === "e" ? "end" : "both", px: Number(m[3] ?? m[2]) };
  if ((m = /^border-([se])-\(length:([\w-]+)\)$/.exec(base)))
    return { kind: "borderX", side: m[1] === "s" ? "start" : "end", px: Number.NaN }; // a variable border: ./daisy.ts vars
  if (base.startsWith("max-w-")) return { kind: "maxWidth", size: sizeValue(base.slice(6)) ?? { kind: "auto" } };
  // A width that follows an anchor (a highlight sized to the item it marks) is that item's width.
  if (base.startsWith("w-[anchor-size(")) return { kind: "width", size: { kind: "auto" } };
  if ((m = /^flex-\[(\d+)_(\d+)_([^\]]+)\]$/.exec(base))) {
    const b = cssSize(m[3]!);
    return b ? { kind: "flex", grow: Number(m[1]), shrink: Number(m[2]), basis: b } : "unknown";
  }
  if ((m = /^(min-w|max-w|w|basis)-(.+)$/.exec(base))) {
    const s = m[2] === "prose" ? null : m[2] === "screen" ? null : sizeValue(m[2]!);
    if (!s) return "unknown";
    const kind = m[1] === "w" ? "width" : m[1] === "min-w" ? "minWidth" : m[1] === "max-w" ? "maxWidth" : "basis";
    return { kind, size: s } as Effect;
  }
  if ((m = /^size-(.+)$/.exec(base))) {
    const s = sizeValue(m[1]!);
    return s ? { kind: "width", size: s } : "unknown";
  }
  if ((m = /^grow-\[?(\d+)\]?$/.exec(base))) return { kind: "grow", value: Number(m[1]) };
  if ((m = /^shrink-\[?(\d+)\]?$/.exec(base))) return { kind: "shrink", value: Number(m[1]) };
  if ((m = /^grid-cols-(\d+)$/.exec(base)))
    return {
      kind: "gridCols",
      cols: {
        kind: "tracks",
        tracks: Array.from({ length: Number(m[1]) }, () => ({ kind: "fr", min: ZERO }) as Track),
      },
    };
  if ((m = /^grid-cols-\[(.+)\]$/.exec(base))) {
    const cols = gridTemplate(m[1]!.replace(/_/g, " "));
    return cols ? { kind: "gridCols", cols } : "unknown";
  }
  if ((m = /^col-span-(\d+)$/.exec(base))) return { kind: "colSpan", span: Number(m[1]) };
  if ((m = /^@container\/([\w-]+)$/.exec(base))) return { kind: "container", name: m[1] };
  if ((m = /^\[(--[\w-]+):(.+)\]$/.exec(base))) {
    if (!WIDTH_VARS.has(m[1]!)) return "neutral";
    return { kind: "setVar", name: m[1]!, size: cssSize(m[2]!) ?? { kind: "auto" } };
  }
  if (/^-?(?:inset-x|start|end|inset)-/.test(base)) return "neutral"; // offsets of positioned (out of flow) boxes
  // Type: sizes, wrapping style, custom roles.
  if (base.startsWith("text-") || base.startsWith("[tab-size:")) return "neutral";
  if (NEUTRAL.test(base)) return "neutral";
  return "unknown";
}

/** `repeat(auto-fit,minmax(min(100%,X),1fr))`, or a list of tracks (`auto minmax(0,1fr)`, `20px 1fr`). */
function gridTemplate(t: string): GridCols | null {
  const fit = /^repeat\(auto-(?:fit|fill),\s*minmax\(min\(100%,\s*([^)]+)\),\s*1fr\)\)$/.exec(t.replace(/\s+/g, ""));
  if (fit && cssLen(fit[1]!)) return { kind: "fit", min: cssLen(fit[1]!)! };
  const tracks: Track[] = [];
  const parts = t.match(/minmax\([^()]*(?:\([^()]*\)[^()]*)*\)|\S+/g) ?? [];
  for (const p of parts) {
    if (p === "auto" || p === "max-content" || p === "min-content") tracks.push({ kind: "auto" });
    else if (/^\d*\.?\d*fr$/.test(p)) tracks.push({ kind: "fr", min: ZERO });
    else if (cssLen(p)) tracks.push({ kind: "fixed", len: cssLen(p)! });
    else {
      const mm = /^minmax\((.+),\s*(?:\d*\.?\d*fr|max-content)\)$/.exec(p);
      if (!mm) return null;
      const min = cssSize(mm[1]!.trim());
      if (!min) return null;
      tracks.push({ kind: "minmaxContent", min });
    }
  }
  return tracks.length ? { kind: "tracks", tracks } : null;
}
