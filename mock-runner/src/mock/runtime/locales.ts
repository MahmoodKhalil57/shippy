import type { FieldLike, Localization } from "../../types.ts";
import { blockFields, childFields, dataFields } from "./fields.ts";
import { isObject } from "../../payload/index.ts";

/**
 * Payload's field localization (payloadcms.com/docs/configuration/localization): a field marked
 * `localized: true` holds one value per locale, stored as `{ en: …, ar: … }` (as Payload stores it
 * in a document database). A request names its locale (`?locale=ar`, the Local API's `locale`):
 *
 * - Reads give each localized field its value in that locale, else in the fallback locale (the
 *   request's `fallback-locale`, else the default locale while `localization.fallback` isn't
 *   false), else nothing. `locale=all` gives every locale's values as stored.
 * - `where` and `sort` read the same values (a document matches in the locale asked for).
 * - Writes set that locale's value and keep the others. `locale=all` takes `{ en, ar }` as given.
 * - Hooks, validation and access see the document in the request's locale.
 *
 * A localized group, array or blocks field is one value per locale as a whole; fields inside a
 * field that isn't localized are localized on their own. A value stored before its field was
 * localized (a plain value) reads as the default locale's.
 */

export interface LocaleRead {
  /** The locale asked for, or `all`. */
  locale: string;
  /** Where a missing value is read from instead (`false`: nowhere). */
  fallback: string | false;
  /** The config's locale codes and default locale. */
  codes: string[];
  defaultLocale: string;
}

/** The locale codes of a config's `localization`. */
export const localeCodes = (l: Localization) => l.locales.map((x) => (typeof x === "string" ? x : x.code));

/** How a request reads: its locale (known, or the default) and fallback. */
export function localeRead(
  l: Localization | undefined,
  locale: string | undefined,
  fallback: string | false | undefined,
): LocaleRead | undefined {
  if (!l) return undefined;
  const codes = localeCodes(l);
  const asked = locale === "all" || (locale && codes.includes(locale)) ? locale : l.defaultLocale;
  return {
    locale: asked,
    fallback:
      fallback === false || fallback === "none" || fallback === "false"
        ? false
        : fallback && codes.includes(fallback)
          ? fallback
          : l.fallback === false
            ? false
            : l.defaultLocale,
    codes,
    defaultLocale: l.defaultLocale,
  };
}

/** A stored localized value: an object keyed by locale codes only. */
const isPerLocale = (v: unknown, codes: string[]): v is Record<string, unknown> =>
  isObject(v) && Object.keys(v).length > 0 && Object.keys(v).every((k) => codes.includes(k));

const empty = (v: unknown) => v === undefined || v === null || v === "";
const same = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);

/** One localized value as read. */
function pick(v: unknown, r: LocaleRead): unknown {
  if (!isPerLocale(v, r.codes)) return v;
  const got = v[r.locale];
  if (!empty(got) || r.fallback === false) return got;
  return v[r.fallback];
}

/** The document as read in `r.locale` (a copy; `all` returns it as it is). */
export function inLocale<T extends Record<string, unknown>>(fields: FieldLike[], doc: T, r: LocaleRead | undefined): T {
  if (!r || r.locale === "all") return doc;
  const walk: Walk = (list, data) => {
    const out: Record<string, unknown> = { ...data };
    for (const f of dataFields(list)) {
      const name = f.name!;
      if (!(name in out)) continue;
      const v = f.localized ? pick(out[name], r) : out[name];
      out[name] = nested(f, v, walk);
    }
    return out;
  };
  return walk(fields, doc) as T;
}

type Walk = (
  list: FieldLike[],
  data: Record<string, unknown>,
  before?: Record<string, unknown>,
  raw?: Record<string, unknown>,
) => Record<string, unknown>;

const asObject = (v: unknown) => (isObject(v) ? v : undefined);

/**
 * A group's, array's or blocks field's own fields, read or written the same way: each row with
 * the row it was (`before`, by id, else in its place) and the row as given (`raw`, in its place).
 */
function nested(f: FieldLike, v: unknown, walk: Walk, before?: unknown, raw?: unknown): unknown {
  if (f.type === "group" && isObject(v)) return walk(childFields(f), v, asObject(before), asObject(raw));
  if ((f.type === "array" || f.type === "blocks") && Array.isArray(v)) {
    const prev = Array.isArray(before) ? before : [];
    const given = Array.isArray(raw) ? raw : [];
    return v.map((row, i) => {
      if (!isObject(row)) return row;
      const was = prev.find((p) => isObject(p) && row.id !== undefined && p.id === row.id) ?? prev[i];
      const own = f.type === "array" ? childFields(f) : blockFields(f, row.blockType);
      return walk(own, row, asObject(was), asObject(given[i]));
    });
  }
  return v;
}

/**
 * What to store when `doc` (as written in `r.locale`) is saved over `stored`: each localized
 * field's value set in that locale, the other locales' kept. With `all`, the per-locale values
 * as given (`given`: the data as sent, before it was read in the default locale to validate).
 */
export function toStored<T extends Record<string, unknown>>(
  fields: FieldLike[],
  doc: T,
  stored: Record<string, unknown> | undefined,
  r: LocaleRead | undefined,
  given?: Record<string, unknown>,
): T {
  if (!r) return doc;
  const walk: Walk = (list, data, before, raw) => {
    const out: Record<string, unknown> = { ...data };
    for (const f of dataFields(list)) {
      const name = f.name!;
      if (!(name in out)) continue;
      if (!f.localized) {
        out[name] = nested(f, out[name], walk, before?.[name], raw?.[name]);
        continue;
      }
      const sent = r.locale === "all" ? raw?.[name] : undefined;
      if (isPerLocale(sent, r.codes)) {
        out[name] = sent;
        continue;
      }
      const prev = before?.[name];
      // Not sent and unchanged by a hook (still the value it was read as, maybe a fallback): kept.
      if (prev !== undefined && !(raw && name in raw) && same(pick(prev, r), out[name])) {
        out[name] = prev;
        continue;
      }
      const values = isPerLocale(prev, r.codes) ? { ...prev } : empty(prev) ? {} : { [r.defaultLocale]: prev };
      values[r.locale === "all" ? r.defaultLocale : r.locale] = out[name];
      out[name] = values;
    }
    return out;
  };
  return walk(fields, doc, stored, given) as T;
}

/**
 * A stored document given the languages its seed has gained since it was loaded: each localized
 * value people haven't changed (still the seed's value in the default locale, stored plain as
 * before the field was localized, or per locale) takes the seed's other locales. Anything people
 * edited is left as it is. Undefined when nothing changes.
 */
export function withSeedLocales<T extends Record<string, unknown>>(
  fields: FieldLike[],
  stored: T,
  seed: Record<string, unknown>,
  l: Localization | undefined,
): T | undefined {
  if (!l) return undefined;
  const codes = localeCodes(l);
  let changed = false;
  const walk = (list: FieldLike[], data: Record<string, unknown>, from: Record<string, unknown>) => {
    const out: Record<string, unknown> = { ...data };
    for (const f of dataFields(list)) {
      const name = f.name!;
      const have = out[name];
      const want = from[name];
      if (f.localized) {
        if (!isPerLocale(want, codes)) continue;
        const base = isPerLocale(have, codes) ? have[l.defaultLocale] : have;
        // Changed by people since: theirs stays.
        if (!same(base, want[l.defaultLocale])) continue;
        const merged = { ...want, ...(isPerLocale(have, codes) ? have : {}) };
        if (!same(merged, have)) {
          out[name] = merged;
          changed = true;
        }
        continue;
      }
      if (f.type === "group" && isObject(have) && isObject(want)) out[name] = walk(childFields(f), have, want);
      if ((f.type === "array" || f.type === "blocks") && Array.isArray(have) && Array.isArray(want))
        out[name] = have.map((row, i) => {
          if (!isObject(row)) return row;
          const was = want.find((w) => isObject(w) && row.id !== undefined && w.id === row.id) ?? want[i];
          if (!isObject(was)) return row;
          return walk(f.type === "array" ? childFields(f) : blockFields(f, row.blockType), row, was);
        });
    }
    return out;
  };
  const next = walk(fields, stored, seed) as T;
  return changed ? next : undefined;
}
