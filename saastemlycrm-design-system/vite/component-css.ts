import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { formatViolations, widthViolations } from "./layout-proof/check.ts";
import { booleanBindings, recipeVariants, responsiveSafelist, responsiveTokens } from "./recipes.ts";

export default function componentCss(
  options: { dir?: string; reference?: string; scan?: string[]; styled?: string[] } = {},
) {
  let root = "";
  let componentsDir = "";
  let referenceFile = "";
  const SUFFIX = ".ui.css";

  const posix = (p: string) => p.split(path.sep).join("/");

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

  let styled = new Set<string>();
  const isComponentModule = (file: string) => {
    if (styled.has(path.normalize(file))) return true;
    const rel = path.relative(componentsDir, file);
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return false;
    const name = path.basename(rel);
    return name.endsWith(".ts") && name !== "index.ts" && !name.endsWith(".d.ts") && !name.endsWith(".test.ts");
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
      styled = new Set((options.styled ?? []).map((f) => path.normalize(path.resolve(config.root, f))));
    },

    buildStart() {
      tokensByFile.clear();
      for (const d of scanDirs) scanDir(d);
      scanFile(path.join(root, "index.html"));
    },

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
        for (const [id, mod] of graph.idToModuleMap) if (id.split("?")[0].endsWith(SUFFIX)) css.push(mod);
      } else if (isComponentModule(file)) {
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
      const own = path.normalize(clean);
      if (
        path.isAbsolute(clean) &&
        (own.startsWith(componentsDir) || styled.has(own.slice(0, -SUFFIX.length) + ".ts"))
      ) {
        file = clean;
      } else if (clean.startsWith("/@fs/")) {
        file = clean.slice("/@fs".length).replace(/^\/([A-Za-z]:)/, "$1");
      } else if (clean.startsWith("/")) {
        file = path.join(root, clean);
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
      const primitives = path.join(componentsDir, "primitives");
      if (path.normalize(tsFile).startsWith(primitives)) {
        const violations = widthViolations(source, tsFile);
        if (violations.length)
          throw new Error(
            `Layout proof: ${posix(path.relative(componentsDir, tsFile))} decides widths outside the layout algebra (src/styles/algebra.ts):
${formatViolations(posix(path.relative(componentsDir, tsFile)), violations)}`,
          );
      }
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
