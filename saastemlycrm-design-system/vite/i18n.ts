import path from "node:path";
import { paraglideVitePlugin, type CompilerOptions } from "@inlang/paraglide-js";
import MagicString from "magic-string";
import { parseSync } from "vite/rolldown/utils";

/**
 * How every package's interface text is compiled (Paraglide, an inlang project per package:
 * `project.inlang/settings.json`, `messages/{locale}.json` in ICU MessageFormat 1): each message
 * a typed function (`m.nav_collapse({ what })`), plurals by `Intl.PluralRules` (Arabic's six
 * forms), unused messages dropped by the bundler. The output is committed (a typecheck needs it
 * before any build) and kept current: `tests/i18n.test.ts` compiles again and compares.
 *
 * The language is read the same way by every package's runtime, so a project's messages and the
 * design system's always agree: the saved choice (`localStorage`, `LANGUAGE_KEY`), else the
 * browser's languages, else English. Changing it saves it and reloads the page (`setLanguage`,
 * src/i18n/index.ts): a session runs in one language and one direction, laid out once.
 * index.html reads the same key before the first paint to set `<html lang dir>`.
 */
export const LANGUAGE_KEY = "ui-language";

export const I18N_OPTIONS = {
  strategy: ["localStorage", "preferredLanguage", "baseLocale"],
  localStorageKey: LANGUAGE_KEY,
  outputStructure: "locale-modules",
  emitGitIgnore: false,
  emitPrettierIgnore: false,
  emitReadme: false,
  emitTsDeclarations: true,
  // One output for dev, build and tests (it is committed): Vite replaces the flag, so a build
  // drops the runtime's development checks.
  isDevelopment: "import.meta.env.DEV",
  // As the Vite plugin sets it (so the plugin and `compile` write the same output).
  isServer: "import.meta.env?.SSR ?? typeof window === 'undefined'",
  // A build for one language (`STATIC_LOCALE` defines this as it): every message is that
  // language's, so the bundler drops the other languages' text. Unset (dev, tests, the backend's
  // service worker, which answers each request in its own language), every language is in.
  // Paraglide's own expression for it, which it leaves as it is (any other it asserts is a locale).
  experimentalStaticLocale: "/** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__",
} satisfies Partial<CompilerOptions>;

/** A package's compiled messages: `<root>/project.inlang` into `<root>/<outdir>`. */
export function i18nCompileOptions(root: string, outdir = "src/i18n/paraglide"): CompilerOptions {
  return {
    ...I18N_OPTIONS,
    project: path.join(root, "project.inlang"),
    outdir: path.join(root, outdir),
  } as CompilerOptions;
}

/** The Vite plugin compiling a package's messages (recompiled as they change in `vp dev`). */
export function i18n(root: string, outdir?: string) {
  return paraglideVitePlugin(i18nCompileOptions(root, outdir) as never);
}

/** The global a one-language build defines (`define: { [STATIC_LOCALE]: JSON.stringify("ar") }`). */
export const STATIC_LOCALE = "globalThis.__PARAGLIDE_STATIC_LOCALE__";

const VIRTUAL = "virtual:locale-text";

/**
 * A one-language page build's config text: Payload's `{ en: "…", ar: "…" }` written in a
 * project's files keeps only the build's language, as `__lt("…")`, which gives every locale that
 * text (`{ en: "…", ar: "…" }` with the same words). The shape stays, so code reading `.en` or
 * `.ar`, `isLocalized` and `localizeConfig` work as before, and the other languages' words are not
 * shipped. Only object literals whose keys are exactly the locales and whose values are strings
 * or template literals; files matched by `include`. The backend's worker is built without it: it
 * answers in every language.
 */
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
