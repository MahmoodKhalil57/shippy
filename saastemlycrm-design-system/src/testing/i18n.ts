import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { compile } from "@inlang/paraglide-js";
import { i18nCompileOptions } from "../../vite/i18n.ts";

/** The saved language's key (a page's first-paint script reads it). */
export { LANGUAGE_KEY } from "../../vite/i18n.ts";

/**
 * What a package's interface text owes, checked in its tests (Node): every language says every
 * message, with the same inputs, and the compiled messages are the ones its catalogs give.
 * A package's catalog is `messages/{locale}.json` (ICU MessageFormat 1) beside `project.inlang`,
 * maybe split into more files (`pathPattern`s in its settings).
 */

/**
 * A message's inputs: every `{name}` / `{name, type, …}` argument, read as ICU MessageFormat 1
 * reads it. A `plural`, `selectordinal` or `select` argument's branches (`one {…}`, `other {…}`,
 * any word for a select) are text, so only arguments inside them count, never their words.
 */
export function messageInputs(message: string): string[] {
  const out = new Set<string>();
  let i = 0;
  const space = () => {
    while (i < message.length && /\s/.test(message[i]!)) i++;
  };
  // Text up to the `}` that closes it (or the end), reading the arguments in it.
  const text = (): void => {
    while (i < message.length) {
      const c = message[i]!;
      if (c === "'" && message[i + 1] === "'") i += 2; // '' is an apostrophe
      else if (c === "'" && /[{}#|]/.test(message[i + 1] ?? "")) {
        // A quoted literal: up to the next lone apostrophe.
        i += 2;
        while (i < message.length && message[i] !== "'") i++;
        i++;
      } else if (c === "{") {
        i++;
        argument();
      } else if (c === "}") return;
      else i++;
    }
  };
  const argument = () => {
    space();
    const name = /^[^\s,{}]+/.exec(message.slice(i))?.[0] ?? "";
    i += name.length;
    if (name) out.add(name);
    space();
    if (message[i] === "}") {
      i++;
      return;
    }
    // `, type` and maybe `, style` or branches.
    i++;
    space();
    const type = /^\w+/.exec(message.slice(i))?.[0] ?? "";
    i += type.length;
    space();
    if (message[i] === "}") {
      i++;
      return;
    }
    i++; // the comma before a style or the branches
    if (type === "plural" || type === "selectordinal" || type === "select") {
      for (;;) {
        space();
        if (message[i] === "}" || i >= message.length) {
          i++;
          return;
        }
        // `offset:1`, a selector (`one`, `=0`, any word), then its `{text}`.
        const key = /^[^\s{}]+/.exec(message.slice(i))?.[0] ?? "";
        i += key.length;
        space();
        if (message[i] === "{") {
          i++;
          text();
          i++;
        }
      }
    }
    // A style (`{amount, number, ::currency/EUR}`): to the closing brace.
    let depth = 1;
    while (i < message.length && depth) {
      if (message[i] === "{") depth++;
      else if (message[i] === "}") depth--;
      i++;
    }
  };
  text();
  return [...out].sort();
}

export interface CatalogProblem {
  locale: string;
  key: string;
  problem: string;
}

/** Each language's catalog against the base language's (`baseLocale`): same keys, same inputs, nothing empty. */
export function catalogProblems(root: string): CatalogProblem[] {
  const settings = JSON.parse(readFileSync(path.join(root, "project.inlang/settings.json"), "utf8")) as {
    baseLocale: string;
    locales: string[];
    "plugin.inlang.icu-messageformat-1": { pathPattern: string | string[] };
  };
  // A catalog may be split in files (one per part of the package): a language is all of them.
  const patterns = [settings["plugin.inlang.icu-messageformat-1"].pathPattern].flat();
  const read = (l: string) => {
    const all: Record<string, string> = {};
    for (const p of patterns) {
      const file = path.join(root, p.replace("{locale}", l));
      const part = JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
      for (const [k, v] of Object.entries(part)) {
        if (k in all) throw new Error(`${k} is in two catalog files (${file})`);
        all[k] = v;
      }
    }
    return all;
  };
  const base = read(settings.baseLocale);
  const out: CatalogProblem[] = [];
  for (const l of settings.locales) {
    const cat = read(l);
    for (const [key, message] of Object.entries(base)) {
      const got = cat[key];
      if (typeof got !== "string" || !got.trim()) {
        out.push({ locale: l, key, problem: "missing" });
        continue;
      }
      const want = messageInputs(message).join(",");
      const has = messageInputs(got).join(",");
      if (want !== has)
        out.push({ locale: l, key, problem: `inputs ${has || "none"}, ${settings.baseLocale} has ${want || "none"}` });
    }
    for (const key of Object.keys(cat))
      if (!(key in base)) out.push({ locale: l, key, problem: `not in ${settings.baseLocale}` });
  }
  return out;
}

const files = (dir: string, prefix = ""): string[] =>
  readdirSync(dir).flatMap((f) =>
    statSync(path.join(dir, f)).isDirectory() ? files(path.join(dir, f), `${prefix}${f}/`) : [`${prefix}${f}`],
  );

/**
 * The compiled messages a package has (`src/i18n/paraglide`, committed so a typecheck needs no
 * build) against what its catalogs compile to now: the files that differ, are missing or extra.
 */
export async function staleMessages(root: string, outdir = "src/i18n/paraglide"): Promise<string[]> {
  const tmp = mkdtempSync(path.join(tmpdir(), "i18n-"));
  try {
    const options = i18nCompileOptions(root, outdir);
    await compile({ ...options, outdir: tmp });
    const want = new Set(files(tmp));
    const have = new Set(files(options.outdir));
    const out: string[] = [];
    for (const f of want)
      if (!have.has(f)) out.push(`${f}: missing`);
      else if (readFileSync(path.join(tmp, f), "utf8") !== readFileSync(path.join(options.outdir, f), "utf8"))
        out.push(`${f}: out of date`);
    for (const f of have) if (!want.has(f)) out.push(`${f}: not compiled from the catalogs`);
    return out;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
