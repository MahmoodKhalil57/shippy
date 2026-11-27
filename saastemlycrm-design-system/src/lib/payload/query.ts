import type { Where } from "payload";
import type { Doc, PaginatedDocs } from "../contracts/config.ts";
import { isObject, text } from "./util.ts";

export function valuesAt(doc: unknown, path: string): unknown[] {
  let current: unknown[] = [doc];
  for (const key of path.split(".")) {
    const next: unknown[] = [];
    for (const v of current) {
      if (Array.isArray(v)) {
        for (const item of v) {
          if (/^\d+$/.test(key)) next.push(v[Number(key)]);
          else if (isObject(item)) next.push(item[key]);
        }
      } else if (isObject(v)) next.push(v[key]);
    }
    current = next;
    if (/^\d+$/.test(key)) current = [...new Set(current)];
  }
  return current.flatMap((v) => (Array.isArray(v) ? (v.length ? v : [undefined]) : [v]));
}

const idOf = (v: unknown): unknown => {
  if (isObject(v)) {
    if ("value" in v && "relationTo" in v) return idOf(v.value);
    if ("id" in v) return v.id;
  }
  return v;
};

const list = (expected: unknown): unknown[] =>
  Array.isArray(expected) ? expected : typeof expected === "string" ? expected.split(",") : [expected];

function same(actual: unknown, expected: unknown): boolean {
  const a = idOf(actual);
  if (a === expected) return true;
  if (a == null || expected == null) return a == expected;
  if (typeof a === "boolean") return text(a) === text(expected);
  if (typeof a === "number") return a === Number(expected);
  return text(a) === text(expected);
}

function compare(actual: unknown, expected: unknown): number | null {
  if (actual == null || expected == null) return null;
  if (typeof actual === "number") return actual - Number(expected);
  const a = text(actual);
  const b = text(expected);
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (/^\d{4}-\d{2}-\d{2}/.test(a) && !Number.isNaN(da) && !Number.isNaN(db)) return da - db;
  return a.localeCompare(b);
}

const NEGATIVE = new Set(["not_equals", "not_in", "not_like"]);

function test(op: string, actual: unknown, expected: unknown): boolean {
  switch (op) {
    case "equals":
      return same(actual, expected);
    case "not_equals":
      return !same(actual, expected);
    case "in":
      return list(expected).some((e) => same(actual, e));
    case "not_in":
      return !list(expected).some((e) => same(actual, e));
    case "exists": {
      const want = expected === true || expected === "true";
      return want ? actual != null && actual !== "" : actual == null || actual === "";
    }
    case "greater_than":
      return (compare(actual, expected) ?? -1) > 0;
    case "greater_than_equal":
      return (compare(actual, expected) ?? -1) >= 0;
    case "less_than":
      return (compare(actual, expected) ?? 1) < 0;
    case "less_than_equal":
      return (compare(actual, expected) ?? 1) <= 0;
    case "like": {
      const haystack = text(idOf(actual) ?? "").toLowerCase();
      return text(expected)
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((w) => haystack.includes(w));
    }
    case "not_like":
      return !test("like", actual, expected);
    case "contains":
      return text(idOf(actual) ?? "")
        .toLowerCase()
        .includes(text(expected).toLowerCase());
    default:
      throw new Error(`Unsupported query operator "${op}"`);
  }
}

export function matches(doc: Doc | Record<string, unknown>, where: Where | undefined | null): boolean {
  if (!where) return true;
  for (const [key, condition] of Object.entries(where)) {
    if (key === "and") {
      if (!(condition as Where[]).every((w) => matches(doc, w))) return false;
      continue;
    }
    if (key === "or") {
      if (!(condition as Where[]).some((w) => matches(doc, w))) return false;
      continue;
    }
    if (!isObject(condition)) continue;
    const values = valuesAt(doc, key);
    if (!values.length) values.push(undefined);
    for (const [op, expected] of Object.entries(condition)) {
      if (op === "all") {
        if (!list(expected).every((e) => values.some((v) => same(v, e)))) return false;
        continue;
      }
      const ok = NEGATIVE.has(op)
        ? values.every((v) => test(op, v, expected))
        : values.some((v) => test(op, v, expected));
      if (!ok) return false;
    }
  }
  return true;
}

export function sortDocs<T extends Record<string, unknown>>(docs: T[], sort: unknown): T[] {
  const keys = (Array.isArray(sort) ? sort : typeof sort === "string" ? sort.split(",") : [])
    .map((k) => text(k).trim())
    .filter(Boolean);
  if (!keys.length) return docs;
  return [...docs].sort((a, b) => {
    for (const key of keys) {
      const desc = key.startsWith("-");
      const path = desc ? key.slice(1) : key;
      const va = idOf(valuesAt(a, path)[0]);
      const vb = idOf(valuesAt(b, path)[0]);
      if (va == null && vb == null) continue;
      if (va == null) return 1;
      if (vb == null) return -1;
      const c = typeof va === "number" && typeof vb === "number" ? va - vb : text(va).localeCompare(text(vb));
      if (c !== 0) return desc ? -c : c;
    }
    return 0;
  });
}

export function paginate<T>(docs: T[], limit: number, page: number, pagination = true): PaginatedDocs<T> {
  const all = !pagination || limit <= 0;
  const size = all ? docs.length : limit;
  const totalPages = all ? 1 : Math.max(1, Math.ceil(docs.length / size));
  const p = all ? 1 : Math.max(1, page);
  const slice = all ? docs : docs.slice((p - 1) * size, p * size);
  return {
    docs: slice,
    totalDocs: docs.length,
    limit: all ? 0 : size,
    totalPages,
    page: p,
    pagingCounter: all ? 1 : (p - 1) * size + 1,
    hasPrevPage: p > 1,
    hasNextPage: p < totalPages,
    prevPage: p > 1 ? p - 1 : null,
    nextPage: p < totalPages ? p + 1 : null,
  };
}
