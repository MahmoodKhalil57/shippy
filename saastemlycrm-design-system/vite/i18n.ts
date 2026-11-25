import path from "node:path";
import { paraglideVitePlugin, type CompilerOptions } from "@inlang/paraglide-js";
import MagicString from "magic-string";
import { parseSync } from "vite/rolldown/utils";

export const LANGUAGE_KEY = "ui-language";

export const I18N_OPTIONS = {
  strategy: ["localStorage", "preferredLanguage", "baseLocale"],
  localStorageKey: LANGUAGE_KEY,
  outputStructure: "locale-modules",
  emitGitIgnore: false,
  emitPrettierIgnore: false,
  emitReadme: false,
  emitTsDeclarations: true,
  isDevelopment: "import.meta.env?.DEV === true",
  isServer: "import.meta.env?.SSR ?? typeof window === 'undefined'",
  experimentalStaticLocale: "/** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__",
} satisfies Partial<CompilerOptions>;

export function i18nCompileOptions(root: string, outdir = "src/i18n/paraglide"): CompilerOptions {
  return {
    ...I18N_OPTIONS,
    project: path.join(root, "project.inlang"),
    outdir: path.join(root, outdir),
  } as CompilerOptions;
}

export function i18n(root: string, outdir?: string) {
  return paraglideVitePlugin(i18nCompileOptions(root, outdir) as never);
}

export const STATIC_LOCALE = "globalThis.__PARAGLIDE_STATIC_LOCALE__";

const VIRTUAL = "virtual:locale-text";

export function localeText(locale: string | undefined, locales: readonly string[], include: RegExp) {
  return {
    name: "saastemly:locale-text",
    enforce: "pre" as const,
    resolveId: (id: string) => (id === VIRTUAL ? `\0${VIRTUAL}` : undefined),
    load: (id: string) =>
      id === `\0${VIRTUAL}`
        ? `export const __lt = (s) => ({ ${locales.map((l) => `${JSON.stringify(l)}: s`).join(", ")} });`
        : undefined,
    transform(code: string, id: string) {
      if (!locale || !include.test(id.split("?")[0]!) || !/\ben\s*:/.test(code)) return undefined;
      const { program } = parseSync(id, code);
      const out = new MagicString(code);
      let n = 0;
      const want = new Set(locales);
      const visit = (node: unknown): void => {
        if (Array.isArray(node)) return node.forEach(visit);
        if (!node || typeof node !== "object") return;
        const x = node as { type?: string; properties?: Node[]; start: number; end: number };
        if (x.type === "ObjectExpression" && x.properties?.length === want.size) {
          const texts = new Map<string, Node>();
          for (const p of x.properties) {
            const key =
              p.key?.type === "Identifier" ? (p.key.name ?? "") : p.key?.type === "Literal" ? String(p.key.value) : "";
            const v = p.value;
            const text = v && ((v.type === "Literal" && typeof v.value === "string") || v.type === "TemplateLiteral");
            if (p.type === "Property" && !p.computed && !p.method && want.has(key) && text) texts.set(key, v!);
          }
          const mine = texts.size === want.size ? texts.get(locale) : undefined;
          if (mine) {
            out.overwrite(x.start, x.end, `__lt(${code.slice(mine.start, mine.end)})`);
            n++;
            return;
          }
        }
        for (const v of Object.values(node)) if (v && typeof v === "object") visit(v);
      };
      visit(program);
      if (!n) return undefined;
      out.prepend(`import { __lt } from "${VIRTUAL}";\n`);
      return { code: out.toString(), map: out.generateMap({ hires: true }) };
    },
  };
}

type Node = {
  type: string;
  start: number;
  end: number;
  key?: { type: string; name?: string; value?: unknown };
  value?: Node & { value?: unknown };
  computed?: boolean;
  method?: boolean;
};
