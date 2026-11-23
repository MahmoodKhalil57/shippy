import { faker as defaultFaker, type Faker } from "@faker-js/faker";
import type { FieldLike } from "../contracts/config.ts";
import { fieldProblems, zodOfFields, type FieldProblem } from "../contracts/fields.ts";

/**
 * Mock documents from a config's own fields (Node; for tests, seeds and demos): every value drawn
 * by faker inside the bounds its schema (`zodOf`, ../contracts/fields.ts) sets: lengths, ranges,
 * options, rows, so a mock always passes it. A field's `custom.mock` gives a realistic value
 * instead; names it recognises (an email, a phone, a company, a vessel, a port, a reference)
 * get one too.
 */

/** Related documents' ids a mock may point at, by collection slug (else a made-up id). */
export interface MockContext {
  ids?: Record<string, string[]>;
}

const fit = (s: string, f: FieldLike) => {
  let out = s;
  if (f.maxLength != null && out.length > f.maxLength)
    out = out.slice(0, f.maxLength).trimEnd() || out.slice(0, f.maxLength);
  if (f.minLength != null) while (out.length < f.minLength) out += "x";
  return out;
};

/** A text value from the field's name: what it most likely holds. */
function textFor(f: FieldLike, fk: Faker): string {
  const n = (f.name ?? "").toLowerCase();
  if (/email/.test(n)) return fk.internet.email();
  if (/phone|mobile|whatsapp/.test(n)) return fk.phone.number({ style: "international" });
  if (/url|website|link/.test(n)) return fk.internet.url();
  if (/imo/.test(n)) return String(fk.number.int({ min: 9_000_000, max: 9_999_999 }));
  if (/vessel|ship/.test(n))
    return `MV ${fk.word.adjective({ length: { min: 4, max: 8 } })} ${fk.word.noun({ length: { min: 3, max: 7 } })}`;
  if (/port|city|town/.test(n)) return fk.location.city();
  if (/country/.test(n)) return fk.location.country();
  if (/address/.test(n)) return fk.location.streetAddress();
  if (/company|customer|supplier|vendor|account|organi[sz]ation/.test(n)) return fk.company.name();
  if (/^name$|person|contact|owner|buyer|who/.test(n)) return fk.person.fullName();
  if (/ref|code|number|sku|id$|po$/.test(n))
    return `${fk.string.alpha({ length: 2, casing: "upper" })}-${fk.string.numeric(4)}`;
  if (/subject|title|headline/.test(n)) return fk.lorem.sentence({ min: 3, max: 7 }).replace(/\.$/, "");
  if (/currency/.test(n)) return fk.finance.currencyCode();
  return fk.lorem.words({ min: 1, max: 4 });
}

const relationTo = (f: FieldLike) => (Array.isArray(f.relationTo) ? f.relationTo[0]! : f.relationTo!);

/** One value of a field (before `hasMany`), inside its schema's bounds. */
function single(f: FieldLike, fk: Faker, ctx: MockContext): unknown {
  switch (f.type) {
    case "text":
      return fit(textFor(f, fk), f);
    case "textarea":
    case "richText":
      return fit(fk.lorem.sentences({ min: 1, max: 3 }), f);
    case "code":
      return fit("const ok = true;", f);
    case "email":
      return fk.internet.email();
    case "number": {
      const unit = f.custom?.number?.unit;
      const min = f.min ?? 0;
      const max = f.max ?? (unit === "pct" ? 100 : unit === "days" ? 60 : 10_000);
      const whole = unit === "days" || (f.admin?.step ?? 0) === 1 || (f.max != null && f.max - min <= 10);
      return whole
        ? fk.number.int({ min: Math.ceil(min), max: Math.floor(max) })
        : fk.number.float({ min, max, fractionDigits: 2 });
    }
    case "checkbox":
      return fk.datatype.boolean();
    case "date":
      return fk.date.soon({ days: 60 }).toISOString();
    case "select":
    case "radio": {
      const values = (f.options ?? []).map((o) => (typeof o === "string" ? o : o.value));
      return values.length ? fk.helpers.arrayElement(values) : fk.lorem.word();
    }
    case "relationship":
    case "upload": {
      const to = relationTo(f);
      const ids = ctx.ids?.[to];
      const id = ids?.length ? fk.helpers.arrayElement(ids) : fk.string.uuid();
      return Array.isArray(f.relationTo) ? { relationTo: to, value: id } : id;
    }
    case "point":
      return [fk.location.longitude(), fk.location.latitude()];
    case "json":
      return {};
    case "group":
      return mockFields(f.fields ?? [], fk, ctx);
    case "array": {
      const least = f.minRows ?? 1;
      const most = Math.max(least, Math.min(f.maxRows ?? 3, 3));
      return Array.from({ length: fk.number.int({ min: least, max: most }) }, () =>
        mockFields(f.fields ?? [], fk, ctx),
      );
    }
    case "blocks": {
      const b = f.blocks?.[0];
      return b ? [{ blockType: b.slug, ...mockFields(b.fields, fk, ctx) }] : [];
    }
    default:
      return null;
  }
}

/** A mock value for one field: its `custom.mock`, else one from its type and name, many when `hasMany`. */
export function mockOf(f: FieldLike, fk: Faker = defaultFaker, ctx: MockContext = {}): unknown {
  if (typeof f.custom?.mock === "function") return f.custom.mock(fk);
  if (f.hasMany && f.type !== "array" && f.type !== "blocks") {
    if (f.type === "select" || f.type === "radio") {
      const values = (f.options ?? []).map((o) => (typeof o === "string" ? o : o.value));
      return values.length ? fk.helpers.arrayElements(values, { min: 1, max: Math.min(3, values.length) }) : [];
    }
    return Array.from({ length: fk.number.int({ min: 1, max: 3 }) }, () => single(f, fk, ctx));
  }
  return single(f, fk, ctx);
}

/** A mock document for these fields (layout fields opened up, named tabs as groups). */
export function mockFields(
  fields: FieldLike[],
  fk: Faker = defaultFaker,
  ctx: MockContext = {},
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const add = (list: FieldLike[]) => {
    for (const f of list) {
      if (f.type === "row" || f.type === "collapsible") add(f.fields ?? []);
      else if (f.type === "tabs")
        for (const t of f.tabs ?? []) {
          if (t.name) out[t.name] = mockFields(t.fields, fk, ctx);
          else add(t.fields);
        }
      else if (f.name && !["ui", "join"].includes(f.type) && !f.virtual) out[f.name] = mockOf(f, fk, ctx);
    }
  };
  add(fields);
  return out;
}

/**
 * Everything a config's fields owe and accept, checked (a project's tests want none):
 * - `fieldProblems`: a hint on every shown field (short, the rest in `custom.about`), a
 *   placeholder on every field typed into;
 * - each seed document passes its collection's schema (`zodOfFields`): the schemas fit the data;
 * - `mocks` mock documents per collection (faker seeded 1…`mocks`, so the run is the same every
 *   time) pass it too: every field's mock is drawn inside its own schema.
 */
export function fieldContractProblems(opts: {
  config: { collections?: { slug: string; fields: FieldLike[] }[]; globals?: { slug: string; fields: FieldLike[] }[] };
  seeds?: Record<string, Record<string, unknown>[]>;
  mocks?: number;
}): FieldProblem[] {
  const out = fieldProblems(opts.config);
  const ids = Object.fromEntries(
    Object.entries(opts.seeds ?? {}).map(([slug, docs]) => [
      slug,
      docs.map((d) => (typeof d.id === "string" || typeof d.id === "number" ? String(d.id) : "")).filter(Boolean),
    ]),
  );
  const issue = (at: string, r: { error: { issues: { path: PropertyKey[]; message: string }[] } }) => {
    const i = r.error.issues[0]!;
    out.push({ at: `${at} › ${i.path.map(String).join(".")}`, problem: i.message });
  };
  for (const c of opts.config.collections ?? []) {
    const schema = zodOfFields(c.fields);
    for (const d of opts.seeds?.[c.slug] ?? []) {
      const r = schema.safeParse(d);
      if (!r.success) issue(`${c.slug} seed ${typeof d.id === "string" || typeof d.id === "number" ? d.id : "?"}`, r);
    }
    for (let i = 1; i <= (opts.mocks ?? 0); i++) {
      defaultFaker.seed(i);
      const r = schema.safeParse(mockFields(c.fields, defaultFaker, { ids }));
      if (!r.success) issue(`${c.slug} mock #${i}`, r);
    }
  }
  return out;
}
