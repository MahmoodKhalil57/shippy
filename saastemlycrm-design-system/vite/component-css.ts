import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { booleanBindings, recipeVariants, responsiveSafelist, responsiveTokens } from "./recipes.ts";

/**
 * Per-component Tailwind CSS without per-component .css files.
 *
 * Every module under `src/components/` at any depth (e.g.
 * `primitives/forms/select.ts`), except `index.ts` barrels and `base/`, gets an
 * injected `import "./<name>.ui.css"`. That stylesheet doesn't
 * exist on disk: this plugin generates it, and @tailwindcss/vite then compiles
 * it like any other CSS file. It contains only the classes found in
 * `<name>.ts`, so a component's styles reach the bundle only when the component
 * is imported. HMR works as usual: Tailwind watches the `@source` file.
 *
 * Generated stylesheet:
 *   @reference "<rel>/styles/reference.css";   // theme + daisyUI, emits nothing
 *   @import "tailwindcss/utilities.css" layer(utilities) source(none);
 *   @source "./<name>.ts";                      // scan only this component
 *   @source inline("lg:menu-horizontal ...");   // responsive variants in use
 *
 * Responsive variants (see src/components/base/variants.ts) are built at
 * runtime, e.g. direction="vertical lg:horizontal" -> lg:menu-horizontal, so
 * Tailwind can't find them in the source. The plugin reads the component's
 * recipe configs and adds only what's used in src/ (see `responsiveSafelist`
 * in ./recipes.ts): enum options at each breakpoint written as `<bp>:<option>`,
 * and boolean variants at each bare breakpoint assigned to the attribute or
 * property that feeds them (e.g. `hide="lg"` -> `lg:hidden`).
 * In dev, editing a file that changes those tokens regenerates the stylesheets.
 *
 * Must be listed before tailwindcss() in `plugins`.
 */
/**
 * `dir`: the components (default `src/components`); `reference`: the Tailwind reference stylesheet
 * (default `src/styles/reference.css`); `scan`: where responsive tokens are used (default `src` and
 * the root's index.html). Relative to the Vite root, or absolute (a linked package).
 */
export default function componentCss(options: { dir?: string; reference?: string; scan?: string[] } = {}) {
  let root = "";
  let componentsDir = "";
  let referenceFile = "";
  const SUFFIX = ".ui.css";

  const posix = (p: string) => p.split(path.sep).join("/");

  /** Responsive tokens (`lg:horizontal`) per scanned source file. */
  let scanDirs: string[] = [];
  const tokensByFile = new Map<string, Set<string>>();
  const SCANNED = /\.(ts|js|html)$/;
  const scanFile = (file: string) => {
    try {
      tokensByFile.set(path.normalize(file), responsiveTokens(readFileSync(file, "utf8")));
    } catch {
      tokensByFile.delete(path.normalize(file));
    }
  };
  /**
   * Usage = app code and composed components. Primitives are skipped: their
   * JSDoc examples aren't usage, and a primitive that needs a responsive class
   * writes it literally in its own recipe (scanned by its own @source).
   */
  let primitivesDir = "";
  const isUsage = (file: string) => !path.normalize(file).startsWith(primitivesDir + path.sep);
  const scanDir = (dir: string): void => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (isUsage(p + path.sep + "x")) scanDir(p);
      } else if (SCANNED.test(e.name)) scanFile(p);
    }
  };
  const allTokens = () => new Set([...tokensByFile.values()].flatMap((t) => [...t]));
  const tokenKey = () => [...allTokens()].sort().join(" ");

  /** Any `.ts` module under `componentsDir` (any depth), except index barrels and base/. */
  const isComponentModule = (file: string) => {
    const rel = path.relative(componentsDir, file);
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return false;
    const parts = rel.split(path.sep);
    const name = parts[parts.length - 1];
    return parts[0] !== "base" && name.endsWith(".ts") && name !== "index.ts" && !name.endsWith(".d.ts");
  };

  return {
    name: "shippy:component-css",
    enforce: "pre" as const,

    configResolved(config: { root: string }) {
      root = path.resolve(config.root);
      componentsDir = path.resolve(config.root, options.dir ?? "src/components");
      referenceFile = path.resolve(config.root, options.reference ?? "src/styles/reference.css");
      scanDirs = (options.scan ?? ["src"]).map((d) => path.resolve(config.root, d));
      primitivesDir = path.join(componentsDir, "primitives");
    },

    buildStart() {
      tokensByFile.clear();
      for (const d of scanDirs) scanDir(d);
      scanFile(path.join(root, "index.html"));
    },

    /** Regenerate stylesheets when a component's recipes or the app's responsive tokens change. */
    handleHotUpdate(ctx: {
      file: string;
      modules: unknown[];
      server: { moduleGraph: { idToModuleMap: Map<string, unknown>; invalidateModule(mod: unknown): void } };
    }) {
      const file = path.normalize(ctx.file);
      if (!SCANNED.test(file)) return;
      const graph = ctx.server.moduleGraph;
      const before = tokenKey();
      if (isUsage(file)) scanFile(file);
      const css: unknown[] = [];
      if (tokenKey() !== before) {
        // New responsive values in use: any component stylesheet may need more classes.
        for (const [id, mod] of graph.idToModuleMap) if (id.split("?")[0].endsWith(SUFFIX)) css.push(mod);
      } else if (isComponentModule(file)) {
        // The component's recipes may have changed: regenerate its own stylesheet.
        const own = posix(file.slice(0, -".ts".length) + SUFFIX);
        for (const [id, mod] of graph.idToModuleMap) if (id.split("?")[0] === own) css.push(mod);
      }
      if (!css.length) return;
      for (const mod of css) graph.invalidateModule(mod);
      return [...ctx.modules, ...css];
    },

    resolveId(source: string, importer?: string) {
      const clean = source.split("?")[0];
      if (!clean.endsWith(SUFFIX)) return null;
      let file: string;
      if (path.isAbsolute(clean) && path.normalize(clean).startsWith(componentsDir)) {
        file = clean; // already a filesystem path
      } else if (clean.startsWith("/@fs/")) {
        file = clean.slice("/@fs".length).replace(/^\/([A-Za-z]:)/, "$1"); // a file outside the root (a linked package)
      } else if (clean.startsWith("/")) {
        file = path.join(root, clean); // root-relative URL, as requested by the dev server
      } else if (importer) {
        file = path.resolve(path.dirname(importer.split("?")[0]), clean);
      } else {
        return null;
      }
      return posix(path.normalize(file)) + source.slice(clean.length);
    },

    load(id: string) {
      const file = id.split("?")[0];
      if (!file.endsWith(SUFFIX)) return null;
      const dir = path.dirname(file);
      const name = path.basename(file, SUFFIX);
      let ref = posix(path.relative(dir, referenceFile));
      if (!ref.startsWith(".")) ref = `./${ref}`;
      const tsFile = path.join(dir, `${name}.ts`);
      if (!tokensByFile.size) for (const d of scanDirs) scanDir(d);
      const source = readFileSync(tsFile, "utf8");
      // App/composed usage, plus the component's own responsive values (e.g. a
      // default of `direction = "sm:horizontal"`), which only affect this file.
      const tokens = new Set([...allTokens(), ...responsiveTokens(source)]);
      const safelist = responsiveSafelist(recipeVariants(source, tsFile), tokens, booleanBindings(source, tsFile));
      return [
        `@reference "${ref}";`,
        `@import "tailwindcss/utilities.css" layer(utilities) source(none);`,
        `@source "./${name}.ts";`,
        ...(safelist.length ? [`@source inline("${safelist.join(" ")}");`] : []),
        "",
      ].join("\n");
    },

    transform(code: string, id: string) {
      const file = path.normalize(id.split("?")[0]);
      if (!isComponentModule(file)) return null;
      const name = path.basename(file, ".ts");
      return { code: `import "./${name}${SUFFIX}";\n${code}`, map: null };
    },
  };
}
