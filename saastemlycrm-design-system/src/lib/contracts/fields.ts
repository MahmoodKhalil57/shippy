import { z } from "zod";
import type { FieldLike } from "./config.ts";
import { m } from "../i18n/index.ts";

export const MAX_HINT = 120;

export type FieldInput =
  | "text"
  | "email"
  | "textarea"
  | "code"
  | "json"
  | "number"
  | "stepper"
  | "slider"
  | "rating"
  | "scale"
  | "money"
  | "percent"
  | "segmented"
  | "chips"
  | "select"
  | "radio"
  | "switch"
  | "checkbox"
  | "date"
  | "tags"
  | "relationship"
  | "upload"
  | "point";

const LAYOUT = new Set(["row", "collapsible", "tabs", "ui", "join"]);
const TYPED = new Set(["text", "email", "textarea", "number", "select", "relationship"]);

const optionValues = (f: FieldLike) => (f.options ?? []).map((o) => (typeof o === "string" ? o : o.value));
const optionLabels = (f: FieldLike) =>
  (f.options ?? []).map((o) => (typeof o === "string" ? o : typeof o.label === "string" ? o.label : o.value));
const unit = (f: FieldLike) => f.custom?.number?.unit;

export function inputOf(f: FieldLike): FieldInput {
  const chosen = f.custom?.input as FieldInput | undefined;
  if (chosen) return chosen;
  switch (f.type) {
    case "checkbox":
      return "switch";
    case "select":
    case "radio": {
      const labels = optionLabels(f);
      if (f.hasMany) return labels.length <= 8 ? "chips" : "select";
      return labels.length >= 2 && labels.length <= 4 && labels.every((l) => l.length <= 16) ? "segmented" : "select";
    }
    case "number": {
      if (f.hasMany) return "tags";
      const u = unit(f);
      if (u === "money") return "money";
      if (u === "pct") return f.min != null && f.max != null ? "slider" : "percent";
      if (u === "days") return "stepper";
      if (f.min === 0 && f.max === 1) return "slider";
      if (f.min != null && f.max != null && f.max - f.min >= 2 && f.max - f.min <= 10 && (f.admin?.step ?? 1) === 1)
        return /rating|score|stars/i.test(f.name ?? "") ? "rating" : "scale";
      return "number";
    }
    case "text":
      return f.hasMany ? "tags" : "text";
    case "email":
      return "email";
    case "textarea":
    case "richText":
      return "textarea";
    case "code":
      return "code";
    case "json":
      return "json";
    case "date":
      return "date";
    case "relationship":
      return "relationship";
    case "upload":
      return "upload";
    case "point":
      return "point";
    default:
      return "text";
  }
}

const relationValue = z.union([
  z.string().min(1),
  z.number(),
  z.looseObject({ id: z.union([z.string(), z.number()]) }),
  z.looseObject({ relationTo: z.string(), value: z.unknown() }),
]);

const dateValue = z.union([
  z.date(),
  z.string().refine((s) => !Number.isNaN(Date.parse(s)), { error: () => m.field_error_date() }),
]);

export function zodOfFields(fields: FieldLike[]): z.ZodType {
  const shape: Record<string, z.ZodType> = {};
  const add = (list: FieldLike[]) => {
    for (const f of list) {
      if (f.type === "row" || f.type === "collapsible") add(f.fields ?? []);
      else if (f.type === "tabs")
        for (const t of f.tabs ?? [])
          if (t.name) shape[t.name] = z.looseObject({}).and(zodOfFields(t.fields)).nullable().optional();
          else add(t.fields);
      else if (f.name && !LAYOUT.has(f.type) && !f.virtual) shape[f.name] = zodOf(f);
    }
  };
  add(fields);
  return z.looseObject(shape);
}

function single(f: FieldLike): z.ZodType {
  switch (f.type) {
    case "text":
    case "textarea":
    case "code":
    case "richText": {
      let s = z.string({ error: () => m.field_error_text() });
      if (f.minLength != null)
        s = s.min(f.minLength, { error: () => m.field_error_min_length({ count: f.minLength! }) });
      if (f.maxLength != null)
        s = s.max(f.maxLength, { error: () => m.field_error_max_length({ count: f.maxLength! }) });
      return s;
    }
    case "email":
      return z.email({ error: () => m.field_error_email() });
    case "number": {
      let n = z
        .number({ error: () => m.field_error_number() })
        .refine(Number.isFinite, { error: () => m.field_error_number() });
      if (f.min != null) n = n.refine((v) => v >= f.min!, { error: () => m.field_error_min({ min: f.min! }) });
      if (f.max != null) n = n.refine((v) => v <= f.max!, { error: () => m.field_error_max({ max: f.max! }) });
      return n;
    }
    case "checkbox":
      return z.boolean();
    case "date":
      return dateValue;
    case "select":
    case "radio": {
      const values = optionValues(f);
      return values.length
        ? z.enum(values as [string, ...string[]], { error: () => m.field_error_option() })
        : z.string();
    }
    case "relationship":
    case "upload":
      return relationValue;
    case "point":
      return z.tuple([z.number(), z.number()]);
    case "json":
      return z.unknown();
    case "group":
      return zodOfFields(f.fields ?? []);
    case "array": {
      let a = z.array(zodOfFields(f.fields ?? []));
      if (f.minRows != null) a = a.min(f.minRows, { error: () => m.field_error_min_rows({ count: f.minRows! }) });
      if (f.maxRows != null) a = a.max(f.maxRows, { error: () => m.field_error_max_rows({ count: f.maxRows! }) });
      return a;
    }
    case "blocks": {
      const kinds = (f.blocks ?? []).map((b) =>
        z.looseObject({ blockType: z.literal(b.slug) }).and(zodOfFields(b.fields)),
      );
      const one = kinds.length === 0 ? z.looseObject({}) : kinds.length === 1 ? kinds[0]! : z.union(kinds);
      return z.array(one);
    }
    default:
      return z.unknown();
  }
}

export function zodOf(f: FieldLike): z.ZodType {
  const one = single(f);
  const many = f.hasMany && f.type !== "array" && f.type !== "blocks";
  let s: z.ZodType = many
    ? f.required
      ? z.array(one).min(1, { error: () => m.field_error_at_least_one() })
      : z.array(one)
    : one;
  if (!f.required || f.type === "array" || f.type === "blocks" || f.type === "group" || f.type === "checkbox")
    s = s.nullable().optional();
  else if (f.type === "text" || f.type === "textarea" || f.type === "email" || f.type === "code")
    s = s.refine((v) => typeof v !== "string" || v.trim() !== "", { error: () => m.field_error_required() });
  const custom = f.custom?.zod;
  if (typeof custom === "function") s = (custom as (base: z.ZodType) => z.ZodType)(s);
  return f.localized ? z.union([s, z.record(z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/), s)]) : s;
}

export function fieldError(f: FieldLike, value: unknown): string | undefined {
  if (f.required && (value == null || value === "" || (Array.isArray(value) && !value.length)))
    return m.field_error_required();
  if (value == null || value === "") return undefined;
  const r = zodOf(f).safeParse(value);
  return r.success ? undefined : (r.error.issues[0]?.message ?? m.field_error_check());
}

export interface FieldProblem {
  at: string;
  problem: string;
}

export function fieldProblems(config: {
  collections?: { slug: string; fields: FieldLike[]; labels?: { singular?: unknown; plural?: unknown } }[];
  globals?: { slug: string; fields: FieldLike[]; label?: unknown }[];
  localization?: { locales: (string | { code: string })[] };
}): FieldProblem[] {
  const out: FieldProblem[] = [];
  const codes = (config.localization?.locales ?? []).map((l) => (typeof l === "string" ? l : l.code));
  const each = (v: unknown) =>
    codes.length
      ? !!v &&
        typeof v === "object" &&
        codes.every(
          (c) => typeof (v as Record<string, unknown>)[c] === "string" && !!(v as Record<string, string>)[c].trim(),
        )
      : typeof v === "string" && !!v.trim();
  const words = (v: unknown, l: string): string =>
    typeof v === "string"
      ? v
      : v && typeof v === "object" && typeof (v as Record<string, unknown>)[l] === "string"
        ? ((v as Record<string, string>)[l] ?? "")
        : "";
  const languages = codes.length ? ` in ${codes.join(" and ")}` : "";
  const walk = (fields: FieldLike[], where: string) => {
    for (const f of fields) {
      if (f.type === "row" || f.type === "collapsible") {
        walk(f.fields ?? [], where);
        continue;
      }
      if (f.type === "tabs") {
        for (const t of f.tabs ?? []) walk(t.fields, t.name ? `${where} › ${t.name}` : where);
        continue;
      }
      if (LAYOUT.has(f.type) || !f.name || f.hidden || f.admin?.hidden) continue;
      const at = `${where} › ${f.name}`;
      const hint = f.admin?.description;
      if (!each(hint)) out.push({ at, problem: `needs a hint (admin.description)${languages}` });
      else
        for (const l of codes.length ? codes : [""]) {
          const h = words(hint, l);
          if (h.length > MAX_HINT)
            out.push({
              at,
              problem: `hint${l ? ` (${l})` : ""} is ${h.length} characters; keep ${MAX_HINT}, move the rest to custom.about`,
            });
        }
      if (TYPED.has(f.type) && !f.admin?.readOnly && !f.virtual) {
        const ph = f.admin?.placeholder;
        if (!each(ph)) out.push({ at, problem: `needs a placeholder (admin.placeholder)${languages}` });
      }
      if (codes.length) {
        if (f.label !== false && !each(f.label)) out.push({ at, problem: `label needs ${codes.join(" and ")}` });
        if (f.custom?.about !== undefined && !each(f.custom.about))
          out.push({ at, problem: `custom.about needs ${codes.join(" and ")}` });
        for (const o of f.options ?? [])
          if (typeof o === "object" && !each(o.label))
            out.push({ at, problem: `option ${o.value}'s label needs ${codes.join(" and ")}` });
      }
      if (f.type === "group" || f.type === "array") walk(f.fields ?? [], at);
      if (f.type === "blocks") for (const b of f.blocks ?? []) walk(b.fields, `${at} › ${b.slug}`);
    }
  };
  const actionWords = (actions: unknown, at: string) => {
    if (!codes.length || !Array.isArray(actions)) return;
    const check = (v: unknown, what: string) => {
      if (v === undefined || v === null || each(v)) return;
      if (typeof v === "string" && !/[A-Za-z]{2,}/.test(v.replace(/\$[\w.]+/g, ""))) return;
      out.push({ at, problem: `action ${what} needs ${codes.join(" and ")}` });
    };
    for (const a of actions as Record<string, unknown>[]) {
      const name = words(a.label, codes[0] ?? "") || words(a.label, "");
      check(a.label, `"${name}" label`);
      for (const k of ["done", "prompt", "reason"]) check(a[k], `"${name}" ${k}`);
      const confirm = a.confirm as Record<string, unknown> | undefined;
      if (confirm && typeof confirm === "object")
        for (const k of ["heading", "text", "label"]) check(confirm[k], `"${name}" confirm ${k}`);
      for (const f of (a.fields as Record<string, unknown>[] | undefined) ?? [])
        check(f.label, `"${name}" field label`);
    }
  };
  const fieldActions = (fields: FieldLike[], at: string) => {
    for (const f of fields) {
      if (f.custom?.actions) actionWords(f.custom.actions, `${at} › ${f.name ?? f.type}`);
      if (f.fields) fieldActions(f.fields, f.name ? `${at} › ${f.name}` : at);
      for (const t of f.tabs ?? []) fieldActions(t.fields, at);
    }
  };
  for (const c of config.collections ?? []) {
    actionWords((c as { custom?: { actions?: unknown } }).custom?.actions, c.slug);
    fieldActions(c.fields, c.slug);
  }
  for (const g of config.globals ?? []) fieldActions(g.fields, g.slug);
  for (const c of config.collections ?? []) {
    if (codes.length && (!each(c.labels?.singular) || !each(c.labels?.plural)))
      out.push({ at: c.slug, problem: `labels (singular and plural) need ${codes.join(" and ")}` });
    walk(c.fields, c.slug);
  }
  for (const g of config.globals ?? []) {
    if (codes.length && !each(g.label)) out.push({ at: g.slug, problem: `label needs ${codes.join(" and ")}` });
    walk(g.fields, g.slug);
  }
  return out;
}
