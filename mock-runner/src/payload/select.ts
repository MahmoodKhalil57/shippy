import type { Where } from "payload";
import { isObject } from "./util.ts";

export type Select = { [field: string]: boolean | Select };

export interface JoinQuery {
  limit?: number;
  page?: number;
  sort?: string;
  where?: Where;
  count?: boolean;
}
export type Joins = false | Record<string, JoinQuery | false>;

const includes = (select: Select): boolean =>
  Object.values(select).some((v) => v === true || (isObject(v) && includes(v as Select)));

export function selects(select: Select | undefined, name: string): boolean {
  if (!select || !Object.keys(select).length) return true;
  const v = select[name];
  return includes(select) ? v === true || (isObject(v) && includes(v as Select)) : v !== false;
}

export function applySelect<T extends Record<string, unknown>>(doc: T, select: Select | undefined): T {
  if (!select || !Object.keys(select).length) return doc;
  return (includes(select) ? keep(doc, select) : drop(doc, select)) as T;
}

function keep(value: unknown, select: Select): unknown {
  if (Array.isArray(value)) return value.map((row) => keep(row, select));
  if (!isObject(value)) return value;
  const out: Record<string, unknown> = {};
  if ("id" in value) out.id = value.id;
  if ("blockType" in value) out.blockType = value.blockType;
  for (const [k, v] of Object.entries(select)) {
    if (!(k in value)) continue;
    if (v === true) out[k] = value[k];
    else if (isObject(v)) out[k] = keep(value[k], v as Select);
  }
  return out;
}

function drop(value: unknown, select: Select): unknown {
  if (Array.isArray(value)) return value.map((row) => drop(row, select));
  if (!isObject(value)) return value;
  const out: Record<string, unknown> = { ...value };
  for (const [k, v] of Object.entries(select)) {
    if (v === false) delete out[k];
    else if (isObject(v) && k in out) out[k] = drop(out[k], v as Select);
  }
  return out;
}

export function parseSelect(raw: unknown): Select | undefined {
  if (!isObject(raw)) return undefined;
  const out: Select = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v === true || v === "true") out[k] = true;
    else if (v === false || v === "false") out[k] = false;
    else if (isObject(v)) out[k] = parseSelect(v) ?? {};
  }
  return out;
}

export function parsePopulate(raw: unknown): Record<string, Select> | undefined {
  if (!isObject(raw)) return undefined;
  return Object.fromEntries(Object.entries(raw).map(([slug, v]) => [slug, parseSelect(v) ?? {}]));
}

export function parseJoins(raw: unknown): Joins | undefined {
  if (raw === false || raw === "false") return false;
  if (!isObject(raw)) return undefined;
  const num = (v: unknown) => (v == null || v === "" ? undefined : Number(v));
  return Object.fromEntries(
    Object.entries(raw).map(([name, q]) => {
      if (q === false || q === "false" || !isObject(q)) return [name, false];
      return [
        name,
        {
          limit: num(q.limit),
          page: num(q.page),
          sort: typeof q.sort === "string" ? q.sort : undefined,
          where: isObject(q.where) ? (q.where as Where) : undefined,
          count: q.count === true || q.count === "true",
        } satisfies JoinQuery,
      ];
    }),
  );
}
