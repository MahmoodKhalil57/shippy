import { getLocale, locales, setLocale } from "./paraglide/runtime.js";

/**
 * The interface's language: its text, its direction and how it writes numbers and dates. Pure (no
 * DOM; the language is read from `localStorage` when there is one), so the contracts, a project's
 * formatters and the backend's service worker use it too.
 *
 * - Text: `m.<key>(inputs)`, one typed function per message (messages/{locale}.json, ICU
 *   MessageFormat 1, compiled by Paraglide: vite/i18n.ts). A key missing from a language, or an
 *   input missing from a call, fails the typecheck.
 * - A Payload label, hint or placeholder (`string | { en, ar }`): `localize(value)`.
 * - Numbers, money and dates: `intl` (cached `Intl` formatters for the language). Arabic writes
 *   Latin digits (`ar-u-nu-latn`): tabular figures line up and tiles keep their widths.
 * - The language is chosen once per page load: `setLanguage` saves it and reloads, so a session
 *   runs in one language and one direction (index.html sets `<html lang dir>` before the first
 *   paint from the same saved choice).
 */
export { m } from "./paraglide/messages.js";
export { getLocale };

export type Locale = (typeof locales)[number];
export const LOCALES = locales as readonly Locale[];
export const BASE_LOCALE: Locale = "en";

/** Each language's own name (a picker lists them in their own words) and direction. */
export const LANGUAGES: Record<Locale, { name: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", dir: "ltr" },
  ar: { name: "العربية", dir: "rtl" },
};

/** The language now. */
export const locale = (): Locale => getLocale() as Locale;

/** Its writing direction. */
export const dir = (l: Locale = locale()) => LANGUAGES[l].dir;

/** Where else a language choice is kept (the signed-in person's record): each runs before the reload. */
const keepers = new Set<(l: Locale) => Promise<unknown>>();

/** Keeps every language choice somewhere else too, until the returned function is called. */
export function keepLanguage(keep: (l: Locale) => Promise<unknown>) {
  keepers.add(keep);
  return () => void keepers.delete(keep);
}

/**
 * Switches language: kept where it is kept (this browser, and wherever `keepLanguage` says, such
 * as the person's record), then the page reloads into it. A keeper that fails doesn't stop it.
 */
export async function setLanguage(l: Locale) {
  if (l === locale()) return;
  await Promise.allSettled([...keepers].map((keep) => keep(l)));
  void setLocale(l);
}

/** The language chosen in this browser, if one was (the picker saves it; `LANGUAGE_KEY`). */
export function savedLanguage(): Locale | undefined {
  try {
    const l = localStorage.getItem("ui-language");
    return (LOCALES as readonly (string | null)[]).includes(l) ? (l as Locale) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Follows a language kept elsewhere (the person's record, as they sign in) when it isn't this
 * page's: saved here and reloaded into, once per page load (a browser that can't keep it doesn't
 * reload forever). False when nothing changes.
 */
export function followLanguage(l: unknown): boolean {
  if (typeof l !== "string" || !(LOCALES as readonly string[]).includes(l) || l === locale()) return false;
  try {
    if (sessionStorage.getItem("ui-language-followed") === l) return false;
    sessionStorage.setItem("ui-language-followed", l);
  } catch {
    return false;
  }
  void setLocale(l as Locale);
  return true;
}

/* ---------------------------------------------------------------- Payload's localized text */

/** Text in every language (Payload's shape for a label, a hint or a placeholder). */
export type Localized = Record<Locale, string>;
/** What Payload accepts where it shows text: one string, or one per language. */
export type Localizable = string | Partial<Record<Locale, string>>;

/**
 * A label, hint or placeholder as read in `l`: a string as it is; per language, that language's,
 * else English's, else the first one given. Payload's label functions (`({ t }) => …`) are called
 * with the language. Anything else: "".
 */
export function localize(value: unknown, l: Locale = locale()): string {
  if (typeof value === "string") return value;
  if (typeof value === "function")
    return localize((value as (a: { i18n: { language: Locale } }) => unknown)({ i18n: { language: l } }), l);
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    const got = v[l] ?? v[BASE_LOCALE] ?? Object.values(v).find((x) => typeof x === "string");
    return typeof got === "string" ? got : "";
  }
  return "";
}

/* ---------------------------------------------------------------- Intl, cached per language */

/** The tag `Intl` gets: Latin digits in Arabic; English writes numbers US-style, dates British (17 Nov 2026). */
export function intlTag(kind: "number" | "date" = "number", l: Locale = locale()) {
  if (l === "ar") return "ar-u-nu-latn";
  return kind === "date" ? "en-GB" : "en-US";
}

const cache = new Map<string, unknown>();
function cached<T>(kind: string, options: object | undefined, make: () => T): T {
  const key = `${kind}|${locale()}|${options ? JSON.stringify(options) : ""}`;
  let got = cache.get(key) as T | undefined;
  if (got === undefined) {
    got = make();
    cache.set(key, got);
  }
  return got;
}

/** `Intl` formatters for the language now, each made once per language and options. */
export const intl = {
  number: (o?: Intl.NumberFormatOptions) => cached("n", o, () => new Intl.NumberFormat(intlTag("number"), o)),
  date: (o?: Intl.DateTimeFormatOptions) => cached("d", o, () => new Intl.DateTimeFormat(intlTag("date"), o)),
  relative: (o?: Intl.RelativeTimeFormatOptions) =>
    cached("r", o, () => new Intl.RelativeTimeFormat(intlTag("date"), o)),
  list: (o?: Intl.ListFormatOptions) => cached("l", o, () => new Intl.ListFormat(intlTag("number"), o)),
  plural: (o?: Intl.PluralRulesOptions) => cached("p", o, () => new Intl.PluralRules(intlTag("number"), o)),
  /** Sorting and comparing text the language's way (Arabic letters in Arabic order, case and accents ignored). */
  collator: (o: Intl.CollatorOptions = { sensitivity: "base", numeric: true }) =>
    cached("c", o, () => new Intl.Collator(intlTag("number"), o)),
};

/** A number written the language's way (`intl.number`). */
export const formatInt = (v: number, o?: Intl.NumberFormatOptions) => intl.number(o).format(v);

/* ---------------------------------------------------------------- a config in one language */

/** Text given per language: a plain object whose keys are all locale codes (`{ en, ar }`). */
export const isLocalized = (v: unknown): v is Partial<Record<Locale, string>> =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  Object.getPrototypeOf(v) === Object.prototype &&
  Object.keys(v).length > 0 &&
  Object.entries(v).every(([k, x]) => (LOCALES as readonly string[]).includes(k) && typeof x === "string");

/**
 * A Payload config (or any part of one) read in one language, in place: every text given per
 * language (`isLocalized`: a label, a hint, a placeholder, an option's or a tab's label, a
 * view's title…) becomes its string in `l`. The dashboard does this once as it starts
 * (`startDashboard`): a page runs in one language, so everything after reads plain strings.
 * Functions (hooks, widgets' formatters) are left as they are; they call `m.*` themselves.
 */
export function localizeConfig<T>(config: T, l: Locale = locale()): T {
  const seen = new WeakSet<object>();
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      node.forEach((x, i) => (isLocalized(x) ? (node[i] = localize(x, l)) : walk(x)));
      return;
    }
    const proto = Object.getPrototypeOf(node);
    if (proto !== Object.prototype && proto !== null) return;
    for (const [k, v] of Object.entries(node)) {
      if (isLocalized(v)) (node as Record<string, unknown>)[k] = localize(v, l);
      else walk(v);
    }
  };
  walk(config);
  return config;
}
