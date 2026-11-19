import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { booleanBindings, classStrings, recipeVariants } from "../plugins/recipes.ts";
import {
  elementApis,
  invalidValue,
  stylingApis,
  templateElements,
  valueImports,
  type ElementApi,
  type ValueSpec,
} from "../plugins/templates.ts";

/**
 * The design system is enforced through the components:
 *
 * 1. Only primitives (src/components/primitives) style things: padding,
 *    spacing, sizes, colours, typography... Everything else (composed
 *    components, pages, app code) is assembled from `ui-*` elements and
 *    nothing else:
 *    - no classes or inline styles, no DOM styling APIs, no stylesheets;
 *    - no primitive recipes (only types and element registrations are
 *      imported from primitives);
 *    - templates contain only `ui-*` elements plus a few unstyled inline text
 *      elements (`strong`, `em`, `br`...);
 *    - every value passed to a primitive is one of its design tokens (a
 *      recipe variant's options, per breakpoint if wanted), checked here
 *      because Lit templates aren't type-checked.
 * 2. Primitives use theme colours only (no Tailwind palette or literal colours).
 * 3. Composed components are made of primitives; primitives never depend on
 *    composed components, and never render another component (`ui-*`) either:
 *    a primitive is one building block, a composition of them is composed.
 *
 * In addition, src/index.css generates no utilities from app code
 * (`source(none)`), and vite.config.ts lint rules ban classMap/styleMap
 * outside primitives.
 */

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const componentsDir = path.join(src, "components");
const primitivesDir = path.join(componentsDir, "primitives");
const composedDir = path.join(componentsDir, "composed");
const baseDir = path.join(componentsDir, "base");

const tsFiles = (dir: string, withIndex = false): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return tsFiles(p, withIndex);
    return e.name.endsWith(".ts") && (withIndex || e.name !== "index.ts") && !e.name.endsWith(".d.ts") ? [p] : [];
  });

const inside = (dir: string) => (f: string) => f.startsWith(dir + path.sep);
const all = tsFiles(src);
const primitives = all.filter(inside(primitivesDir));
const composed = all.filter(inside(composedDir));
/** Everything that must not style: composed components, pages, app code. */
const consumers = all.filter((f) => !inside(primitivesDir)(f) && !inside(baseDir)(f));

const read = (f: string) => readFileSync(f, "utf8");
const rel = (f: string) => path.relative(src, f).split(path.sep).join("/");
const cases = (files: string[]) => files.map((f) => [rel(f), f]);

/** Every custom element: primitives, composed components and page elements (which follow the consumer rules). */
const apis = elementApis(all.map((file) => ({ file, source: read(file) })));

/** Unstyled inline text elements consumers may use (Tailwind's preflight leaves them alone). */
const TEXT_ELEMENTS = new Set([
  "span",
  "strong",
  "em",
  "b",
  "i",
  "abbr",
  "cite",
  "q",
  "time",
  "data",
  "bdi",
  "bdo",
  "br",
  "wbr",
]);
/** Attributes any element may carry; none of them style anything. */
const GLOBAL_ATTRIBUTES = new Set(["slot", "id", "lang", "dir", "title"]);
const TEXT_ELEMENT_ATTRIBUTES = new Set([...GLOBAL_ATTRIBUTES, "role", "datetime", "value", "cite"]);

/** Problems with how a consumer template uses elements, as "line N: <tag attr>: problem". */
function templateProblems(file: string): string[] {
  const problems: string[] = [];
  for (const el of templateElements(read(file), file)) {
    const at = (what: string) => problems.push(`line ${el.line}: <${el.tag}> ${what}`);
    if (el.elementBinding) at("has an element binding (`<x ${...}>`); bind attributes or properties instead");
    const api: ElementApi | undefined = apis.get(el.tag);
    if (el.tag.startsWith("ui-") && !api) {
      at("is not a known component");
      continue;
    }
    if (!api) {
      if (!TEXT_ELEMENTS.has(el.tag)) {
        at("is plain HTML: use a primitive (`ui-*`), or add one to src/components/primitives");
        continue;
      }
      for (const a of el.attributes) {
        if (a.name.startsWith("@") || a.name.startsWith("aria-") || TEXT_ELEMENT_ATTRIBUTES.has(a.name)) continue;
        at(`${a.name}: not allowed on plain text elements`);
      }
      continue;
    }
    for (const a of el.attributes) {
      if (a.name.startsWith("@") || GLOBAL_ATTRIBUTES.has(a.name)) continue;
      if (/^[.?]?(class|style|className)$/.test(a.name)) {
        at(`${a.name}: styling belongs in primitives; use a variant (add one to the primitive if needed)`);
        continue;
      }
      const prefix = a.name[0];
      const name = ".?".includes(prefix) ? a.name.slice(1) : a.name;
      const spec = prefix === "." ? api.properties.get(name) : api.attributes.get(name);
      if (!spec) {
        at(`${a.name}: not ${prefix === "." ? "a property" : "an attribute"} of <${el.tag}> (${rel(api.file)})`);
        continue;
      }
      if (prefix === "?") {
        if (spec.kind !== "boolean") at(`?${name}: not a boolean`);
        continue;
      }
      if (a.value === undefined) continue; // computed: can't check statically
      const problem = invalidValue(spec, a.value);
      if (problem) at(`${a.name}="${a.value}": ${problem}`);
    }
  }
  return problems;
}

/** Value imports from primitives (recipes, helpers) by a consumer. Barrels re-export primitives too. */
function primitiveValueImports(file: string): string[] {
  return valueImports(read(file), file)
    .filter(({ from }) => from.startsWith("."))
    .filter(({ from }) => {
      const target = path.resolve(path.dirname(file), from);
      return inside(primitivesDir)(target) || target === path.join(componentsDir, "index.ts");
    })
    .map(({ from, names }) => `${names.join(", ")} from ${from}`);
}

describe("only primitives style things", () => {
  it("finds the files", () => {
    expect(primitives.length).toBeGreaterThan(60);
    expect(composed.length).toBeGreaterThan(0);
    expect(consumers).toContain(path.join(src, "app", "app.ts"));
    expect(apis.size).toBeGreaterThan(70);
  });

  describe.each(cases(consumers))("%s", (_, file) => {
    it("writes no classes or inline styles", () => {
      const { classes, styles } = classStrings(read(file), file);
      expect(classes.flatMap((c) => c.split(/\s+/)).filter(Boolean), "use a primitive's variant").toEqual([]);
      expect(
        styles.filter((s) => s.trim()),
        "inline styles belong in a primitive",
      ).toEqual([]);
    });

    it("uses no styling APIs (DOM class/style APIs, stylesheets, raw HTML)", () => {
      expect(stylingApis(read(file), file)).toEqual([]);
    });

    it("imports only types and element registrations from primitives, not recipes", () => {
      expect(primitiveValueImports(file), 'use `import type` for types and `import "…/x.ts"` to register').toEqual([]);
    });

    it("renders only components, with design-token values", () => {
      expect(templateProblems(file)).toEqual([]);
    });
  });
});

/** Tailwind palette and literal colours: these bypass the theme. */
const PALETTE =
  /(?:^|[\s:])(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|accent|caret|divide|shadow|placeholder)-(?:(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}|black|white)(?:\/\d+)?(?=$|\s)|#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/;

describe("primitives use theme colours only", () => {
  it.each(cases(primitives))("%s", (_, file) => {
    const { classes, styles } = classStrings(read(file), file);
    const bad = [...classes.flatMap((c) => c.split(/\s+/)), ...styles].filter((c) => PALETTE.test(c));
    expect(bad, "use theme colours (primary, base-200, …) so every theme applies").toEqual([]);
  });
});

describe("responsive variants", () => {
  // plugins/component-css.ts only generates a responsive boolean's classes
  // (e.g. `lg:hidden` for `hide="lg"`) when it can see which recipe
  // variant the property feeds: `recipe({ variant: ...this.prop... })`.
  it.each(cases(primitives))("%s: responsive booleans feed a recipe variant", (_, file) => {
    const source = read(file);
    const props = [...source.matchAll(/@property\(\{[^}]*converter: responsiveBoolean[^}]*\}\)\s+(\w+)/g)].map(
      (m) => m[1],
    );
    const booleanVariants = new Set(
      recipeVariants(source, file).flatMap((r) =>
        Object.entries(r)
          .filter(([, options]) => "true" in options)
          .map(([name]) => name),
      ),
    );
    const fed = new Set(
      [...booleanBindings(source, file)].filter(([v]) => booleanVariants.has(v)).flatMap(([, names]) => [...names]),
    );
    expect(props.filter((p) => !fed.has(p))).toEqual([]);
  });
});

describe("composition", () => {
  it.each(cases(composed))("%s renders primitives", (_, file) => {
    const used = templateElements(read(file), file)
      .map((el) => apis.get(el.tag))
      .filter((api) => api && inside(primitivesDir)(api.file));
    expect(used.length).toBeGreaterThan(0);
  });

  // A primitive is one building block: it draws its own markup (and may borrow another
  // primitive's recipes or icons), but never renders another `ui-*` element. Something built from
  // other components is a composed component (src/components/composed), which in turn can't style.
  it.each(cases(primitives))("%s renders no other component", (_, file) => {
    const own = new Set([...read(file).matchAll(/@customElement\("([^"]+)"\)/g)].map((m) => m[1]));
    const others = templateElements(read(file), file)
      .map((el) => el.tag)
      .filter((tag) => tag.startsWith("ui-") && !own.has(tag));
    expect([...new Set(others)], "build it in src/components/composed, from primitives").toEqual([]);
  });

  it("primitives never import composed components", () => {
    const bad = primitives.filter(
      (f) => /from "[^"]*\/composed\//.test(read(f)) || /import "[^"]*\/composed\//.test(read(f)),
    );
    expect(bad.map(rel)).toEqual([]);
  });
});

describe("the checks themselves", () => {
  it("find classes and styles in class positions and ignore other words", () => {
    const source = [
      `import { checkbox } from "x"; // a btn comment`,
      `const r = rcva("join", { variants: { dir: { v: "join-vertical" } }, defaultVariants: { dir: "toggle" } });`,
      'const t = html`<input type="radio" class="btn-square ${x}" style="color: red" />`;',
      `f({ class: mode === "swap" ? "collapse-arrow" : "" });`,
      `g({ class: panel({ surface: "base-300", width: "52" }) });`,
      `h({ class: [joinItem(), "p-4"].join(" ") });`,
    ].join("\n");
    const { classes, styles } = classStrings(source, "x.ts");
    expect(classes.join(" ").split(/\s+/).filter(Boolean).sort()).toEqual([
      "btn-square",
      "collapse-arrow",
      "join",
      "join-vertical",
      "p-4",
    ]);
    expect(styles).toEqual(["color: red"]);
  });

  it("see the classes primitives write", () => {
    const { classes } = classStrings(read(path.join(primitivesDir, "actions/button.ts")), "button.ts");
    expect(classes.join(" ")).toContain("btn-primary");
  });

  it("read element APIs: tokens, booleans, literals, renamed attributes", () => {
    const button = apis.get("ui-button")!;
    expect(button.attributes.get("size")).toEqual({ kind: "tokens", options: ["xs", "sm", "md"] });
    expect(button.attributes.get("block")).toMatchObject({ kind: "boolean", responsive: true });
    expect(button.attributes.get("disabled")).toMatchObject({ kind: "boolean", responsive: false, allowFalse: false });
    expect(button.attributes.get("type")).toMatchObject({ kind: "literal" });
    expect(apis.get("ui-flex")!.attributes.get("full-width")).toMatchObject({ kind: "boolean", responsive: true });
    expect(apis.get("ui-flex")!.attributes.get("as")).toMatchObject({ kind: "literal" });
    expect(apis.get("ui-accordion")!.properties.has("items")).toBe(true);
    expect(apis.get("ui-accordion")!.attributes.has("items")).toBe(false);
  });

  it("validate values", () => {
    const tokens: ValueSpec = { kind: "tokens", options: ["sm", "lg"] };
    expect(invalidValue(tokens, "sm lg:lg")).toBeNull();
    expect(invalidValue(tokens, "max-md:sm")).toBeNull();
    expect(invalidValue(tokens, "13px")).toMatch(/not an option/);
    expect(invalidValue(tokens, "huge:lg")).toMatch(/not a breakpoint/);
    const responsive = { kind: "boolean", responsive: true, allowFalse: true } as const;
    expect(invalidValue(responsive, "")).toBeNull();
    expect(invalidValue(responsive, "lg")).toBeNull();
    expect(invalidValue(responsive, "max-md:true")).toBeNull();
    expect(invalidValue(responsive, "yes")).not.toBeNull();
    expect(invalidValue({ kind: "boolean", responsive: false, allowFalse: false }, "false")).toMatch(/plain boolean/);
    expect(invalidValue({ kind: "number" }, "3")).toBeNull();
  });

  it("catch plain HTML, unknown attributes, off-token values and styling APIs", () => {
    const source = [
      `import { button } from "./components/primitives/actions/button.ts";`,
      `import type { ButtonVariants } from "./components/primitives/actions/button.ts";`,
      `import "./components/primitives/actions/button.ts";`,
      'const a = html`<div><ui-button size="13px" padding="4" .size=${\'lg\'} @click=${f}>Hi <strong>there</strong></ui-button></div>`;',
      `el.classList.add("p-4"); el.style.color = "red"; el.setAttribute("class", "x");`,
    ].join("\n");
    const els = templateElements(source, "x.ts");
    expect(els.map((e) => e.tag)).toEqual(["div", "ui-button", "strong"]);
    const button = els[1].attributes;
    expect(button.map((a) => [a.name, a.value])).toEqual([
      ["size", "13px"],
      ["padding", "4"],
      [".size", "lg"],
      ["@click", undefined],
    ]);
    expect(stylingApis(source, "x.ts")).toEqual(["uses .classList", "uses .style", `calls setAttribute("class")`]);
    expect(valueImports(source, "x.ts")).toEqual([
      { from: "./components/primitives/actions/button.ts", names: ["button"] },
    ]);
  });
});
