import { getLocale, locales, setLocale } from "./paraglide/runtime.js";

export { m } from "./paraglide/messages.js";
export { getLocale };

export type Locale = (typeof locales)[number];
export const LOCALES = locales as readonly Locale[];
export const BASE_LOCALE: Locale = "en";

export const LANGUAGES: Record<Locale, { name: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", dir: "ltr" },
  ar: { name: "العربية", dir: "rtl" },
};

export const locale = (): Locale => getLocale() as Locale;

export const dir = (l: Locale = locale()) => LANGUAGES[l].dir;

const keepers = new Set<(l: Locale) => Promise<unknown>>();

export function keepLanguage(keep: (l: Locale) => Promise<unknown>) {
  keepers.add(keep);
  return () => void keepers.delete(keep);
}

export async function setLanguage(l: Locale) {
  if (l === locale()) return;
  await Promise.allSettled([...keepers].map((keep) => keep(l)));
  void setLocale(l);
}

export function savedLanguage(): Locale | undefined {
  try {
    const l = localStorage.getItem("ui-language");
    return (LOCALES as readonly (string | null)[]).includes(l) ? (l as Locale) : undefined;
  } catch {
    return undefined;
  }
}

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

export type Localized = Record<Locale, string>;
export type Localizable = string | Partial<Record<Locale, string>>;

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

export const intl = {
  number: (o?: Intl.NumberFormatOptions) => cached("n", o, () => new Intl.NumberFormat(intlTag("number"), o)),
  date: (o?: Intl.DateTimeFormatOptions) => cached("d", o, () => new Intl.DateTimeFormat(intlTag("date"), o)),
  relative: (o?: Intl.RelativeTimeFormatOptions) =>
    cached("r", o, () => new Intl.RelativeTimeFormat(intlTag("date"), o)),
  list: (o?: Intl.ListFormatOptions) => cached("l", o, () => new Intl.ListFormat(intlTag("number"), o)),
  plural: (o?: Intl.PluralRulesOptions) => cached("p", o, () => new Intl.PluralRules(intlTag("number"), o)),
  collator: (o: Intl.CollatorOptions = { sensitivity: "base", numeric: true }) =>
    cached("c", o, () => new Intl.Collator(intlTag("number"), o)),
};

export const formatInt = (v: number, o?: Intl.NumberFormatOptions) => intl.number(o).format(v);

export const isLocalized = (v: unknown): v is Partial<Record<Locale, string>> =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  Object.getPrototypeOf(v) === Object.prototype &&
  Object.keys(v).length > 0 &&
  Object.entries(v).every(([k, x]) => (LOCALES as readonly string[]).includes(k) && typeof x === "string");

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
