import { parseSync } from "vite/rolldown/utils";
import * as algebra from "../../src/styles/algebra.ts";
import { at, parseClass, type Effect, type Len, type ParsedClass, type Size } from "./tokens.ts";

type AstNode = { type: string; start: number; end: number; [key: string]: unknown };
const isNode = (v: unknown): v is AstNode => typeof v === "object" && v !== null && "type" in v;

const BUNDLES: string[][] = (() => {
  const out: string[][] = [];
  const add = (v: unknown) => {
    if (typeof v === "string") out.push(v.split(/\s+/).filter(Boolean));
    else if (v && typeof v === "object") Object.values(v).forEach(add);
  };
  Object.entries(algebra).forEach(([name, v]) => name !== "pad" && add(v));
  return out.filter((b) => b.length > 1 || !["7rem"].includes(b[0]!)).sort((a, b) => b.length - a.length);
})();

export const DAISY_SAFE = new Set([
  "btn",
  "badge",
  "card",
  "card-body",
  "card-title",
  "card-actions",
  "card-border",
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
  "join",
  "join-item",
  "divider",
  "modal",
  "modal-box",
  "modal-action",
  "modal-backdrop",
  "modal-toggle",
  "dropdown",
  "dropdown-content",
  "toggle",
  "checkbox",
  "radio",
  "range",
  "progress",
  "loading",
  "avatar",
  "avatar-group",
  "kbd",
  "chat",
  "chat-bubble",
  "chat-image",
  "chat-header",
  "chat-footer",
  "breadcrumbs",
  "collapse",
  "collapse-title",
  "collapse-content",
  "link",
  "mockup-window",
  "file-input",
  "indicator",
  "indicator-item",
  "status",
  "swap",
  "mask",
  "skeleton",
  "skeleton-text",
  "floating-label",
  "steps",
  "step",
  "tooltip",
  "timeline",
  "filter",
  "validator",
  "countdown",
  "diff",
  "otp",
  "modal",
  "modal-middle",
  "modal-top",
  "modal-bottom",
  "modal-start",
  "modal-end",
  "modal-open",
  "dropdown-top",
  "dropdown-bottom",
  "dropdown-left",
  "dropdown-right",
  "dropdown-start",
  "dropdown-end",
  "dropdown-center",
  "dropdown-hover",
  "dropdown-open",
  "dropdown-close",
]);

const px = (l: Len) => at(l, 1);
const small = (s: Size) =>
  (s.kind === "len" && px(s.len) <= 64 && s.len.rem <= 4 && s.len.px <= 64) || s.kind === "minPct" || s.kind === "pct";
const tiny = (s: Size) => s.kind === "len" && s.len.px >= 0 && s.len.px <= 4 && s.len.rem === 0;

export function unsafe(p: ParsedClass, all: ParsedClass[], context: string[] = []): string | null {
  const e = p.effect;
  if (e === "neutral") return null;
  if (e === "unknown")
    return /(?:^|:)-?(?:left|right|ml|mr|pl|pr)-/.test(p.token)
      ? "a physical side (left / right): use start / end, so right to left is right too"
      : "not in the width vocabulary (vite/layout-proof/tokens.ts)";
  const has = (f: (x: Effect) => boolean) => all.some((x) => typeof x.effect === "object" && f(x.effect));
  const hasIn = (list: ParsedClass[], f: (x: Effect) => boolean) =>
    list.some((x) => typeof x.effect === "object" && f(x.effect));
  const capped = has(
    (x) =>
      x.kind === "maxWidth" &&
      (x.size.kind === "full" || x.size.kind === "minPct" || (x.size.kind === "pct" && x.size.pct <= 100)),
  );
  const roomFor = (n: number) =>
    p.conditions.some(
      (c) => c.kind === "container" && c.min !== undefined && c.min.px + c.min.rem * 16 >= (7 * n + 4 * (n - 1)) * 16,
    );
  const fixedHere = has((x) => (x.kind === "width" && small(x.size) && x.size.kind === "len") || x.kind === "daisy");
  switch (e.kind) {
    case "display":
      return ["flex", "inline-flex", "grid", "inline-grid"].includes(e.value)
        ? "a flex or grid layout: use `row`, `stack`, `inlineRow` or `grid` from the algebra"
        : null;
    case "direction":
      return "a direction change turns a column into a row that doesn't wrap: use `row` / `stack`";
    case "wrap":
      if (e.value && has((x) => x.kind === "direction" && x.value === "col"))
        return "a column that wraps starts new columns beside itself: use `stack` (it doesn't wrap)";
      return e.value ? null : "a row that doesn't wrap: use `row`";
    case "text": {
      if (e.role !== "prose") return null;
      const tokens = new Set([...all.map((x) => x.token), ...context]);
      const said = [algebra.text.prose, algebra.text.label, algebra.text.line, algebra.rowFill].some((b) =>
        b.split(" ").every((t) => tokens.has(t)),
      );
      return said ? null : "running text that doesn't say how it wraps: add `text.prose`, `text.label` or `text.line`";
    }
    case "gapX":
    case "position":
    case "srOnly":
    case "truncate":
    case "breakWord":
    case "overflowX":
    case "maxWidth":
    case "grow":
      return null;
    case "padX": {
      if (tiny(e.size) || (e.size.kind === "len" && px(e.size.len) === 0)) return null;
      const withBase = [...all, ...context.map(parseClass)];
      const contentSized =
        withBase.some((x) => typeof x.effect === "object") &&
        hasIn(
          withBase,
          (x) =>
            (x.kind === "display" && ["inline", "inline-block", "inline-flex", "inline-grid"].includes(x.value)) ||
            (x.kind === "width" && (x.size.kind === "fit" || x.size.kind === "max")) ||
            (x.kind === "daisy" && /^(?:btn|badge|kbd|tab|join-item|link)(?:-|$)/.test(x.name)),
        );
      const floatingPanel = all.some((x) => /^w-\[min\(calc\(\d+_\*_var\(--tile-w\)\),round\(down/.test(x.token));
      if ((contentSized || floatingPanel) && e.size.kind === "len" && px(e.size.len) <= 24 && e.size.len.rem === 0)
        return null;
      return "padding: `inset` on a full-width box, or `pad` (≤ 24px) on one sized to its content";
    }
    case "marginX":
      return e.len === "auto" || (e.len.px >= 0 && e.len.px <= 4 && e.len.rem === 0)
        ? null
        : "a side margin: use `inset` / `pad`, or a gap";
    case "borderX":
      return Number.isNaN(e.px) || e.px > 2 ? "a wide side border" : null;
    case "width":
      return e.size.kind === "full" || e.size.kind === "fit" || e.size.kind === "auto" || small(e.size) || capped
        ? null
        : "a width: use `cap`, `floating`, `fixed` or `fixedWidth` (or cap it: max-w-full)";
    case "minWidth":
      return (e.size.kind === "len" && px(e.size.len) === 0) || e.size.kind === "minPct" || small(e.size)
        ? null
        : "a minimum width: wider than a narrow box (use `scrollX` around it)";
    case "basis":
      return null;
    case "flowCol":
      return "a grid that adds a column for every item: use `row` or a `grid` template";
    case "shrink":
      return e.value === 0 && !fixedHere ? "shrink-0 on something not fixed: use `fixed` / `fixedWidth`" : null;
    case "flex":
      return e.shrink === 0 && !fixedHere ? "flex-none on something not fixed" : null;
    case "whitespace":
      return e.value === "nowrap" || e.value === "pre"
        ? has((x) => x.kind === "truncate" || (x.kind === "overflowX" && x.value !== "visible"))
          ? null
          : "text that never wraps: use `text.line` (it cuts with an ellipsis)"
        : null;
    case "gridCols": {
      if (e.cols.kind === "fit") return null;
      const n = e.cols.tracks.length;
      const t0 = e.cols.tracks[0]!;
      if (
        n === 1 &&
        (t0.kind === "fr" || (t0.kind === "minmaxContent" && t0.min.kind === "len" && px(t0.min.len) === 0))
      )
        return null;
      if (e.cols.tracks.every((t) => t.kind === "fr") && roomFor(n)) return null;
      return `fixed grid columns: use \`grid\` from the algebra, or put ${n} columns behind @min-[${7 * n + 4 * (n - 1)}rem]`;
    }
    case "colSpan":
      if (e.span === "full" || e.span === 1) return null;
      return roomFor(e.span)
        ? null
        : `spanning ${e.span} columns: only behind @min-[${7 * e.span + 4 * (e.span - 1)}rem]`;
    case "container":
      return has((x) => x.kind === "width" && x.size.kind === "full") ? null : "a size container without w-full";
    case "setVar":
      return "sets a size through a custom property: use the algebra";
    case "daisy": {
      const name = e.name;
      const base = [...DAISY_SAFE].find((d) => name === d || name.startsWith(`${d}-`));
      return base ? null : `daisyUI's ${name} isn't declared in src/styles/daisy-m3.css's layout section`;
    }
  }
}

export interface Violation {
  line: number;
  token: string;
  why: string;
}

export function widthViolations(source: string, filename: string): Violation[] {
  const { program } = parseSync(filename, source);
  const out: Violation[] = [];
  const lineOf = (pos: number) => source.slice(0, pos).split("\n").length;
  const algebraNames = new Set<string>();
  for (const s of (program as unknown as { body: AstNode[] }).body)
    if (
      s.type === "ImportDeclaration" &&
      /layout\/algebra\.ts$|\/algebra\.ts$/.test(((s.source as AstNode).value as string) ?? "")
    )
      for (const sp of s.specifiers as AstNode[]) algebraNames.add((sp.local as AstNode).name as string);

  let context: string[] = [];
  const checkString = (text: string, pos: number) => {
    const tokens = text.split(/\s+/).filter(Boolean);
    if (!tokens.length) return;
    const covered = new Set<string>();
    for (const b of BUNDLES) if (b.every((t) => tokens.includes(t))) b.forEach((t) => covered.add(t));
    const parsed = tokens.map(parseClass);
    for (const p of parsed) {
      if (covered.has(p.token)) continue;
      const why = unsafe(p, parsed, context);
      if (why) out.push({ line: lineOf(pos), token: p.token, why });
    }
  };

  const constants = new Map<string, AstNode>();
  for (const s of (program as unknown as { body: AstNode[] }).body) {
    const decl = s.type === "ExportNamedDeclaration" ? (s.declaration as AstNode | null) : s;
    if (decl?.type === "VariableDeclaration")
      for (const d of decl.declarations as AstNode[]) {
        const init = d.init as AstNode | null;
        if (
          init &&
          (init.type === "Literal" || init.type === "TemplateLiteral") &&
          (d.id as AstNode).type === "Identifier"
        )
          constants.set((d.id as AstNode).name as string, init);
      }
  }

  const bundleOf = (n: AstNode): string[] => {
    const path: string[] = [];
    let cur: AstNode | undefined = n;
    while (cur && (cur.type === "MemberExpression" || cur.type === "ComputedMemberExpression")) {
      const prop = cur.property as AstNode;
      path.unshift(String(prop.name ?? prop.value));
      cur = cur.object as AstNode;
    }
    if (!cur || cur.type !== "Identifier" || !algebraNames.has(cur.name as string)) return [];
    let v: unknown = (algebra as Record<string, unknown>)[cur.name as string];
    for (const k of path) v = (v as Record<string, unknown> | undefined)?.[k];
    return typeof v === "string" ? v.split(/\s+/) : [];
  };

  const isAlgebraRef = (n: AstNode): boolean =>
    (n.type === "Identifier" && algebraNames.has(n.name as string)) ||
    (n.type === "MemberExpression" && isAlgebraRef(n.object as AstNode)) ||
    (n.type === "ComputedMemberExpression" && isAlgebraRef(n.object as AstNode));

  const classValue = (n: unknown) => {
    if (!isNode(n)) return;
    if (n.type === "Literal" || n.type === "StringLiteral") {
      if (typeof n.value === "string") checkString(n.value, n.start);
    } else if (n.type === "TemplateLiteral") {
      const quasis = n.quasis as AstNode[];
      const text = [
        ...quasis.map((q) => (q.value as { cooked: string }).cooked),
        ...(n.expressions as AstNode[]).flatMap((ex) => bundleOf(ex)),
      ].join(" ");
      for (const ex of n.expressions as AstNode[])
        if (!isAlgebraRef(ex)) {
          if (ex.type === "ConditionalExpression") {
            classValue(ex.consequent);
            classValue(ex.alternate);
          } else if (ex.type === "Identifier" && constants.has(ex.name as string)) {
          } else if (ex.type !== "Literal")
            out.push({
              line: lineOf(ex.start),
              token: source.slice(ex.start, ex.end),
              why: "a class built from something the proof can't read: use an algebra bundle or a string",
            });
          else classValue(ex);
        }
      checkString(text, n.start);
    } else if (n.type === "ConditionalExpression") {
      classValue(n.consequent);
      classValue(n.alternate);
    } else if (n.type === "LogicalExpression") classValue(n.right);
    else if (n.type === "ArrayExpression") (n.elements as unknown[]).forEach(classValue);
    else if (isAlgebraRef(n)) return;
  };

  const recipeConfig = (cfg: unknown) => {
    if (!isNode(cfg) || cfg.type !== "ObjectExpression") return;
    for (const prop of cfg.properties as AstNode[]) {
      const key = (prop.key as AstNode | undefined)?.name ?? (prop.key as AstNode | undefined)?.value;
      if (key === "variants" && isNode(prop.value) && prop.value.type === "ObjectExpression")
        for (const v of prop.value.properties as AstNode[])
          if (isNode(v.value) && v.value.type === "ObjectExpression")
            for (const o of v.value.properties as AstNode[]) classValue(o.value);
      if (key === "compoundVariants" && isNode(prop.value) && prop.value.type === "ArrayExpression")
        for (const c of prop.value.elements as AstNode[])
          if (isNode(c) && c.type === "ObjectExpression")
            for (const cp of c.properties as AstNode[]) {
              const k = (cp.key as AstNode).name ?? (cp.key as AstNode).value;
              if (k === "class" || k === "className") classValue(cp.value);
            }
    }
  };

  const WIDTH_STYLE =
    /^(?:width|min-width|max-width|inline-size|min-inline-size|flex|flex-basis|padding-(?:left|right|inline)|margin-(?:left|right|inline)|grid-template-columns|white-space)$/;

  const visit = (n: unknown) => {
    if (Array.isArray(n)) return n.forEach(visit);
    if (!isNode(n)) return;
    if (n.type === "CallExpression") {
      const callee = n.callee as AstNode;
      const name = callee.type === "Identifier" ? (callee.name as string) : "";
      const args = n.arguments as AstNode[];
      if (name === "rcva" || name === "cva") {
        classValue(args[0]);
        const base = args[0];
        context =
          isNode(base) && (base.type === "Literal" || base.type === "StringLiteral") && typeof base.value === "string"
            ? base.value.split(/\s+/)
            : isNode(base) && base.type === "TemplateLiteral"
              ? [
                  ...(base.quasis as AstNode[]).flatMap((q) => (q.value as { cooked: string }).cooked.split(/\s+/)),
                  ...(base.expressions as AstNode[]).flatMap((ex) => bundleOf(ex)),
                ]
              : [];
        recipeConfig(args[1]);
        context = [];
      } else if (name === "classMap" && isNode(args[0]) && args[0].type === "ObjectExpression") {
        for (const p of args[0].properties as AstNode[]) {
          if (p.type !== "Property") {
            out.push({ line: lineOf(p.start), token: "...", why: "a spread in classMap: write each class out" });
            continue;
          }
          const k = p.key as AstNode;
          if (k.type === "Literal" || k.type === "StringLiteral") checkString(String(k.value), k.start);
          else if (k.type === "Identifier") checkString(k.name as string, k.start);
        }
      } else if (name === "styleMap" && isNode(args[0]) && args[0].type === "ObjectExpression") {
        for (const p of args[0].properties as AstNode[]) {
          if (p.type !== "Property") {
            out.push({ line: lineOf(p.start), token: "...", why: "a spread in styleMap: write each property out" });
            continue;
          }
          const k = p.key as AstNode;
          const prop = String(k.name ?? k.value);
          const kebab = prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
          if (WIDTH_STYLE.test(kebab))
            out.push({
              line: lineOf(k.start),
              token: prop,
              why: "an inline width style: widths come from the algebra",
            });
        }
      }
    }
    if (n.type === "TaggedTemplateExpression" && ["html", "svg"].includes((n.tag as AstNode).name as string)) {
      const quasi = n.quasi as AstNode;
      const quasis = quasi.quasis as AstNode[];
      const exprs = quasi.expressions as AstNode[];
      quasis.forEach((q, i) => {
        const raw = (q.value as { raw: string }).raw;
        for (const m of raw.matchAll(/\sclass="([^"$]*)"/g)) checkString(m[1]!, q.start + (m.index ?? 0));
        if (/\sclass=$/.test(raw) && exprs[i]) {
          const ex = exprs[i]!;
          if (ex.type === "Literal" || ex.type === "TemplateLiteral" || ex.type === "StringLiteral") classValue(ex);
        }
        if (/\sstyle="[^"]*(?:width|padding-inline|padding-left|padding-right|flex-basis)/.test(raw))
          out.push({ line: lineOf(q.start), token: "style", why: "an inline width style" });
      });
    }
    for (const v of Object.values(n)) if (v && typeof v === "object") visit(v);
  };
  visit(program);
  const used = new Set<string>();
  for (const m of source.matchAll(/\$\{(\w+)\}/g)) used.add(m[1]!);
  for (const [name, init] of constants) if (used.has(name)) classValue(init);
  return out;
}

export function formatViolations(file: string, vs: Violation[]): string {
  return vs.map((v) => `${file}:${v.line} ${v.token} — ${v.why}`).join("\n");
}
