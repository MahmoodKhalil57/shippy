import { z } from "zod";
import type { FieldLike } from "./config.ts";

/**
 * What every field a project declares owes the person filling it in, and what it accepts, by
 * construction (no DOM; Node and the browser alike):
 *
 * - **A hint** (`admin.description`): one short line, read at a glance, under the field's label,
 *   at most `MAX_HINT` characters. The longer story, when there is one, goes in `custom.about`: a
 *   "More" the person opens when they want it.
 * - **A placeholder** (`admin.placeholder`) on every field people type or pick into: an example of
 *   a good value ("e.g. MV Nordic Tern"), never a repeat of the label.
 * - **A schema** (`zodOf`): its value's zod schema, derived from its Payload settings (type,
 *   `required`, `min` / `max`, `minLength` / `maxLength`, `options`, `hasMany`, `minRows` /
 *   `maxRows`, nested fields), in plain words when it fails; `custom.zod` narrows it further.
 *   Every field has one, so every value can be checked as it's typed.
 * - **A mock** (`mockOf` in `saastemlycrm-design-system/testing`): faker values drawn from that
 *   schema's own bounds, so a mock always passes it; `custom.mock` gives a realistic one.
 * - **An input** (`inputOf`): how it's entered, the most direct one its shape allows (a segmented
 *   choice for a few options, a scale for a small range, a slider for a share, a stepper for days,
 *   a switch for yes / no, chips for many…); `custom.input` picks another.
 *
 * `fieldProblems` lists what a config is missing; a project's tests require none
 * (`golden-sea-payload-config/tests/fields.test.ts`).
 */

/** The longest hint that still reads at a glance (about one line in a half-width field). */
export const MAX_HINT = 120;

/** How a field is entered (`inputOf`; `custom.input` to choose). */
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

/** Field types that hold no value of their own (they lay others out). */
const LAYOUT = new Set(["row", "collapsible", "tabs", "ui", "join"]);
/** Field types people type or pick a value into: these show a placeholder. */
const TYPED = new Set(["text", "email", "textarea", "number", "select", "relationship"]);

const optionValues = (f: FieldLike) => (f.options ?? []).map((o) => (typeof o === "string" ? o : o.value));
const optionLabels = (f: FieldLike) =>
  (f.options ?? []).map((o) => (typeof o === "string" ? o : typeof o.label === "string" ? o.label : o.value));
const unit = (f: FieldLike) => f.custom?.number?.unit;

/** The input a field is entered with: `custom.input`, else the most direct its shape allows. */
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
      // A few short options: all in view, one tap (a segmented button); else a menu.
      return labels.length >= 2 && labels.length <= 4 && labels.every((l) => l.length <= 16) ? "segmented" : "select";
    }
    case "number": {
      if (f.hasMany) return "tags";
      const u = unit(f);
      if (u === "money") return "money";
      if (u === "pct") return f.min != null && f.max != null ? "slider" : "percent";
      if (u === "days") return "stepper";
      // A share held as 0 to 1 (a confidence): a slider, read as a percentage.
      if (f.min === 0 && f.max === 1) return "slider";
      // A small whole range (an urgency 1–5, a score 0–10): every step in view.
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

/* ---------------------------------------------------------------- schemas */

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;

/** A related document as stored: its id, the document itself (read deep), or a polymorphic pair. */
const relationValue = z.union([
  z.string().min(1),
  z.number(),
  z.looseObject({ id: z.union([z.string(), z.number()]) }),
  z.looseObject({ relationTo: z.string(), value: z.unknown() }),
]);

/** A date as stored (an ISO string, or a `Date` before it's sent). */
const dateValue = z.union([
  z.date(),
  z.string().refine((s) => !Number.isNaN(Date.parse(s)), { error: "Pick a date." }),
]);

/** The fields' values as one object schema (layout fields opened up, named tabs as groups). */
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

/** One value of a field, before `required` and `hasMany` (Payload's settings, in plain words when it fails). */
function single(f: FieldLike): z.ZodType {
  switch (f.type) {
    case "text":
    case "textarea":
    case "code":
    case "richText": {
      let s = z.string({ error: "Text only." });
      if (f.minLength != null) s = s.min(f.minLength, { error: `At least ${plural(f.minLength, "character")}.` });
      if (f.maxLength != null) s = s.max(f.maxLength, { error: `At most ${plural(f.maxLength, "character")}.` });
      return s;
    }
    case "email":
      return z.email({ error: "An email address, like name@company.com." });
    case "number": {
      let n = z.number({ error: "A number." }).refine(Number.isFinite, { error: "A number." });
      if (f.min != null) n = n.refine((v) => v >= f.min!, { error: `${f.min} or more.` });
      if (f.max != null) n = n.refine((v) => v <= f.max!, { error: `${f.max} or less.` });
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
        ? z.enum(values as [string, ...string[]], { error: "Pick one of the options." })
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
      if (f.minRows != null) a = a.min(f.minRows, { error: `At least ${plural(f.minRows, "row")}.` });
      if (f.maxRows != null) a = a.max(f.maxRows, { error: `At most ${plural(f.maxRows, "row")}.` });
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

/**
 * A field's value schema: its type's, many when `hasMany`, empty allowed (null or left out)
 * unless `required`, narrowed by `custom.zod`. Arrays and blocks are lists (empty unless
 * `minRows`); a checkbox is never empty once set.
 */
export function zodOf(f: FieldLike): z.ZodType {
  const one = single(f);
  const many = f.hasMany && f.type !== "array" && f.type !== "blocks";
  let s: z.ZodType = many ? (f.required ? z.array(one).min(1, { error: "Add at least one." }) : z.array(one)) : one;
  if (!f.required || f.type === "array" || f.type === "blocks" || f.type === "group" || f.type === "checkbox")
    s = s.nullable().optional();
  else if (f.type === "text" || f.type === "textarea" || f.type === "email" || f.type === "code")
    s = s.refine((v) => typeof v !== "string" || v.trim() !== "", { error: "Fill this in to save." });
  const custom = f.custom?.zod;
  return typeof custom === "function" ? (custom as (base: z.ZodType) => z.ZodType)(s) : s;
}

/**
 * The first problem with a value, in plain words, or `undefined` when it's fine: what a form shows
 * under the field as it's typed.
 */
export function fieldError(f: FieldLike, value: unknown): string | undefined {
  if (f.required && (value == null || value === "" || (Array.isArray(value) && !value.length)))
    return "Fill this in to save.";
  if (value == null || value === "") return undefined;
  const r = zodOf(f).safeParse(value);
  return r.success ? undefined : (r.error.issues[0]?.message ?? "Check this value.");
}

/* ---------------------------------------------------------------- the contract */

export interface FieldProblem {
  /** Where: `collection › field path`. */
  at: string;
  problem: string;
}

/**
 * What a project's fields owe the person filling them in and don't give (see the top of this
 * file): a hint on every shown field, at most `MAX_HINT` long (the rest in `custom.about`), and a
 * placeholder on every field typed or picked into. Hidden fields (`hidden`, `admin.hidden`) owe
 * nothing; read-only ones owe no placeholder.
 */
export function fieldProblems(config: {
  collections?: { slug: string; fields: FieldLike[] }[];
  globals?: { slug: string; fields: FieldLike[] }[];
}): FieldProblem[] {
  const out: FieldProblem[] = [];
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
      if (typeof hint !== "string" || !hint.trim()) out.push({ at, problem: "needs a hint (admin.description)" });
      else if (hint.length > MAX_HINT)
        out.push({ at, problem: `hint is ${hint.length} characters; keep ${MAX_HINT}, move the rest to custom.about` });
      if (TYPED.has(f.type) && !f.admin?.readOnly && !f.virtual) {
        const ph = f.admin?.placeholder;
        if (typeof ph !== "string" || !ph.trim()) out.push({ at, problem: "needs a placeholder (admin.placeholder)" });
      }
      if (f.type === "group" || f.type === "array") walk(f.fields ?? [], at);
      if (f.type === "blocks") for (const b of f.blocks ?? []) walk(b.fields, `${at} › ${b.slug}`);
    }
  };
  for (const c of config.collections ?? []) walk(c.fields, c.slug);
  for (const g of config.globals ?? []) walk(g.fields, g.slug);
  return out;
}
