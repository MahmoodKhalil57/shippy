import { stringify } from "qs-esm";
import type { CollectionConfig } from "payload";
import type { CollectionAction, CollectionSettings, Doc, FieldLike } from "../../contracts/config.ts";
import { matches, sortDocs, valuesAt } from "../../payload/query.ts";
import {
  cellText,
  collectionOf,
  dashboardPath,
  dataFields,
  fieldsOf,
  formFields,
  globalOf,
  isToned,
  labels,
  numberText,
  titleOf,
  toneOf,
  useAsTitle,
} from "../shared.ts";
import { block, type Action, type Cell, type Row, type Tone } from "./schema.ts";
import {
  figures,
  type BreakdownSpec,
  type DrawingWidget,
  type MetricsSpec,
  type RecordsSpec,
  type Source,
  type Widget,
  type WidgetScope,
} from "./widget.ts";

/**
 * The built-in data widgets (`records`, `counts`, `fields`), turned into a source and a render
 * that read the field config: labels, formats, links and tag tones come from the collection, so
 * the project writes no code for them.
 */

const labelOf = (f: FieldLike) =>
  typeof f.label === "string" ? f.label : f.name![0]!.toUpperCase() + f.name!.slice(1).replace(/([A-Z])/g, " $1");

const optionsOf = (f: FieldLike) =>
  (f.options ?? []).map((o) =>
    typeof o === "string" ? { value: o, label: o } : { value: o.value, label: String(o.label) },
  );

/** A list page link filtered to `field = value`. */
const filtered = (slug: string, field: string, value: string) =>
  `${dashboardPath("collections", slug)}${stringify(
    { filters: [{ field, operator: "equals", value }] },
    { addQueryPrefix: true, encodeValuesOnly: true },
  )}`;

/** One field's value as a cell: a link for relationships, a tag for toned selects, text otherwise. */
function cellOf(f: FieldLike, doc: Doc): Cell {
  const v = doc[f.name!];
  const text = cellText(f, v);
  if (!text || text === "—") return null;
  if ((f.type === "relationship" || f.type === "upload") && typeof f.relationTo === "string") {
    const id = v && typeof v === "object" && "id" in v ? String((v as Doc).id) : undefined;
    const href = id ? dashboardPath("collections", f.relationTo, id) : undefined;
    // One person (a relationship to a collection people sign in to): their avatar and name.
    if (!f.hasMany && collectionOf(f.relationTo)?.auth) return { text, person: true, href };
    return href ? { text, href } : text;
  }
  if (isToned(f)) return { text, tone: toneOf(f, v, text) as Tone, tag: true };
  // A category (a select with no meaning in its values: a channel, a type): its own hue.
  if (f.type === "select" && !f.hasMany) {
    const at = optionsOf(f).findIndex((o) => o.value === String(v));
    if (at >= 0) return { text, tag: true, hue: at };
  }
  return text;
}

type Kind<K extends string> = Extract<Widget, Record<K, unknown>>;

/**
 * A field in `fields` by name, or by a dotted path through relationships and groups
 * (`customer.contactRule`, `eInvoice.status`): the field at the end of the path, labelled by its own
 * label. Timestamps are dates; an unknown name is text.
 */
function fieldIn(fields: FieldLike[], path: string): FieldLike {
  const f = fieldThrough(fields, path);
  return path.includes(".") && typeof f.label !== "string"
    ? { ...f, label: labelOf({ ...f, name: path.split(".").at(-1)! }) }
    : f;
}

function fieldThrough(fields: FieldLike[], path: string): FieldLike {
  const [head, ...rest] = path.split(".");
  const f = dataFields(fields).find((x) => x.name === head);
  if (!f) return { type: head === "createdAt" || head === "updatedAt" ? "date" : "text", name: path };
  if (!rest.length) return f;
  if (f.type === "group" || f.type === "array") {
    const inner = fieldThrough(f.fields ?? [], rest.join("."));
    // Inside a virtual group, every field is virtual (computed on read, never queried or sorted on).
    return { ...inner, name: path, virtual: inner.virtual || f.virtual };
  }
  const next = typeof f.relationTo === "string" ? collectionOf(f.relationTo) : undefined;
  return next ? { ...fieldThrough(formFields(next), rest.join(".")), name: path } : { ...f, name: path };
}

/** A collection's field by name or dotted path. */
const fieldAt = (c: CollectionConfig, path: string) => fieldIn(formFields(c), path);

/** The value at a field's path in a document (through populated relationships and groups). */
const valueAt = (doc: Doc, path: string): unknown => (path.includes(".") ? valuesAt(doc, path)[0] : doc[path]);

/** The value at a dotted path, walked as it is (an array stays an array): an action's `each` rows. */
function pathAt(doc: Doc, path: string): unknown[] {
  let at: unknown = doc;
  for (const p of path.split(".")) at = at && typeof at === "object" ? (at as Doc)[p] : undefined;
  return Array.isArray(at) ? at : [];
}

/** The document a dotted path's last field belongs to (for a money field's currency). */
function ownerAt(doc: Doc, path: string): Doc {
  let at: unknown = doc;
  for (const p of path.split(".").slice(0, -1)) at = at && typeof at === "object" ? (at as Doc)[p] : undefined;
  return at && typeof at === "object" ? (at as Doc) : doc;
}

/**
 * `$<root>.<path>` in strings: the value at that path of `values[root]` (the whole value when the
 * string is only that, else spliced in). `$row`, `$item`, `$parent`; `$index` is a number.
 */
function filled<T>(value: T, values: Record<string, unknown>): T {
  const at = (root: string, path: string | undefined): unknown => {
    const v = values[root];
    if (!path) return v;
    return v && typeof v === "object" ? valueAt(v as Doc, path) : undefined;
  };
  const text = (x: unknown) =>
    x == null ? "" : typeof x === "object" ? String((x as Doc).id ?? "") : String(x as string | number);
  const roots = Object.keys(values).join("|");
  const whole = new RegExp(`^\\$(${roots})(?:\\.(\\w+(?:\\.\\w+)*))?$`);
  const part = new RegExp(`\\$(${roots})(?:\\.(\\w+(?:\\.\\w+)*))?`, "g");
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") {
      const m = whole.exec(v);
      if (m) return at(m[1]!, m[2]);
      return v.replace(part, (_, root: string, path?: string) => text(at(root, path)));
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype)
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}

const where = (w: Record<string, unknown>) => w as Parameters<typeof matches>[1];

/** A value as text, an id for a document, nothing for anything else. */
const scalarOf = (x: unknown): string =>
  typeof x === "string" || typeof x === "number"
    ? String(x)
    : x && typeof x === "object" && "id" in x
      ? String((x as Doc).id)
      : "";

/**
 * What people can do to this document: actions (a collection's `custom.actions`, an array field's)
 * that apply to it and to them, filled in (`$row`, and `$parent` for an array's row); an action with
 * `each` once per row of that array (`$item`, `$index`).
 */
export function actionsOf(all: CollectionAction[] | undefined, doc: Doc, scope: WidgetScope, parent?: Doc): Action[] {
  return (all ?? []).flatMap((a) => {
    if (a.roles && !a.roles.includes(String(scope.user.role ?? ""))) return [];
    if (a.when && !matches(doc, where(a.when))) return [];
    const { when: _w, roles: _r, each, itemWhen, ...action } = a;
    const base = { row: doc, ...(parent ? { parent } : {}) };
    if (!each) return [filled(action as Action, base)];
    const items = pathAt(doc, each);
    return items.flatMap((item, index) =>
      itemWhen && !matches(item as Doc, where(itemWhen)) ? [] : [filled(action as Action, { ...base, item, index })],
    );
  });
}

/** What people can do to this document of a collection (its `custom.actions`). */
export const actionsFor = (slug: string, doc: Doc, scope: WidgetScope): Action[] =>
  actionsOf((collectionOf(slug)?.custom as CollectionSettings | undefined)?.actions, doc, scope);

/** A field's value in a document (through a dotted path) as text, the way the field reads. */
const textAt = (f: FieldLike, doc: Doc) => cellText(f, valueAt(doc, f.name!), ownerAt(doc, f.name!));

/** A value's tone: its select's tone, else its field's first `toneWhen` rule that holds for the document. */
function toneAt(f: FieldLike, doc: Doc, text: string): Tone | undefined {
  const rule = f.custom?.toneWhen?.find((r) => matches(doc, where(r.when)));
  if (rule) return rule.tone as Tone;
  return isToned(f) ? (toneOf(f, valueAt(doc, f.name!), text) as Tone) : undefined;
}

/** And as a cell: a person, a tag in its tone, a link, a bar, or text in its tone. */
function cellAt(f: FieldLike, doc: Doc): Cell {
  const text = textAt(f, doc);
  if (!text || text === "—") return null;
  const tone = toneAt(f, doc, text);
  const href = f.custom?.href ? filled(f.custom.href, { row: doc }) : undefined;
  if (!f.name!.includes(".") && f.type !== "number" && !f.custom?.toneWhen && !href) return cellOf(f, doc);
  if (isToned(f) && !f.custom?.toneWhen) return { text, tone, tag: true };
  const g = f.custom?.gauge;
  const v = Number(valueAt(doc, f.name!));
  const max = g ? (typeof g.max === "number" ? g.max : Number(valueAt(doc, g.max))) : 0;
  const gauge = g && Number.isFinite(v) && max > 0 ? { value: v, max, tone } : undefined;
  return tone || href || gauge ? { text, tone, href, gauge } : text;
}

/** Tags for a document from fields (each in its tone). */
const tagsAt = (fields: FieldLike[], doc: Doc) =>
  fields.flatMap((f) => {
    const text = textAt(f, doc);
    return text && text !== "—" ? [{ label: text, tone: toneAt(f, doc, text) }] : [];
  });

/** Lines from a field: an array of text (or of rows: their first text), or text split by line. */
function linesAt(f: FieldLike, doc: Doc): string[] {
  const v = valueAt(doc, f.name!);
  if (Array.isArray(v))
    return v
      .map((x) =>
        typeof x === "string"
          ? x
          : x && typeof x === "object"
            ? Object.values(x).find((y) => typeof y === "string")
            : "",
      )
      .filter((x): x is string => !!x);
  const t = textAt(f, doc);
  return t && t !== "—" ? t.split("\n").filter(Boolean) : [];
}

/** Whose rows a `records` widget draws: their fields, how a row is titled and linked, its actions. */
interface Rows {
  fields: FieldLike[];
  title?: string;
  titleOf(row: Doc): string;
  href?(row: Doc): string;
  actions?: CollectionAction[];
  source: Source;
  /** The rows in the answer. */
  rows(data: unknown): Doc[];
  /** The document an array's rows belong to (`$parent`). */
  parent?(data: unknown): Doc | undefined;
  count?(data: unknown): number;
  label: string;
  more?: string;
}

function rowsOf(r: RecordsSpec, scope: WidgetScope): Rows | string {
  // The rows of an array field: a global's, or the screen's document's.
  if (r.field && (r.global || r.doc)) {
    const owner = r.global ? globalOf(r.global) : scope.doc ? collectionOf(scope.doc.slug) : undefined;
    if (!owner) return r.global ? `No global "${r.global}".` : "Not on a document's screen.";
    const array = fieldIn(fieldsOf(owner), r.field);
    if (array.type !== "array") return `"${r.field}" isn't an array field.`;
    const fields = dataFields(array.fields ?? []);
    const at = (data: unknown) => (valueAt(data as Doc, r.field!) as Doc[] | undefined) ?? [];
    return {
      fields,
      titleOf: (row) => textAt(fieldIn(fields, r.columns[0]!), row),
      actions: array.custom?.actions,
      source: r.global ? { global: r.global, depth: 1 } : { doc: true, depth: 1 },
      rows: (data) => at(data).map((row, i) => ({ ...row, id: typeof row.id === "string" ? row.id : String(i) })),
      parent: (data) => data as Doc,
      label: typeof array.label === "string" ? array.label : labelOf(array),
    };
  }
  const c = r.collection ? collectionOf(r.collection) : undefined;
  if (!c) return `No collection "${r.collection ?? ""}".`;
  const sortField = r.sort ? fieldAt(c, r.sort.replace(/^-/, "")) : undefined;
  // A query can't sort by a virtual field: fetch them all and sort as read.
  const sortHere = !!sortField?.virtual;
  const all = !!r.keep || sortHere;
  return {
    fields: formFields(c),
    title: useAsTitle(c),
    titleOf: (d) => titleOf(c, d),
    href: (d) => dashboardPath("collections", r.collection!, String(d.id)),
    actions: (c.custom as CollectionSettings | undefined)?.actions,
    source: {
      find: r.collection!,
      where: r.where,
      sort: sortHere ? undefined : r.sort,
      limit: all ? 0 : (r.limit ?? 10),
      depth: 1,
    },
    rows: (data) => {
      let docs = (data as { docs: Doc[] }).docs.filter((d) => keeps(d, r.keep));
      if (sortHere) docs = sortDocs(docs, r.sort);
      return all ? docs.slice(0, r.limit ?? 10) : docs;
    },
    count: (data) =>
      all
        ? (data as { docs: Doc[] }).docs.filter((d) => keeps(d, r.keep)).length
        : (data as { totalDocs: number }).totalDocs,
    label: labels(c).plural,
    more: dashboardPath("collections", r.collection!),
  };
}

function records({ records: r, ...w }: Kind<"records">, scope: WidgetScope): DrawingWidget<unknown> {
  const of = rowsOf(r, scope);
  if (typeof of === "string") return { ...w, render: () => block("alert", { tone: "error", text: of }) };
  const field = (n: string) => fieldIn(of.fields, n);
  const columns = r.columns.map(field);
  const acts = (row: Doc, data: unknown, s: WidgetScope) =>
    r.actions === false ? [] : actionsOf(of.actions, row, s, of.parent?.(data));
  const hasActions = r.actions !== false && !!of.actions?.length;
  const tags = (r.tags ?? []).map(field);
  return {
    ...w,
    skeleton:
      w.skeleton ??
      (r.layout === "list" || r.layout === "timeline" ? "list" : r.layout === "entries" ? "entries" : "table"),
    source: of.source,
    hidden: (data, s) => (r.hideEmpty && !of.rows(data).length) || !!w.hidden?.(data, s),
    head: (data, s) => ({
      count: of.count ? of.count(data) : of.rows(data).length,
      actions:
        r.more && of.more ? [{ label: `All ${of.label.toLowerCase()}`, href: of.more, variant: "text" as const }] : [],
      ...w.head?.(data, s),
    }),
    render: (data, s) => {
      const docs = of.rows(data);
      if (r.layout === "list") {
        const dot = r.dot ? field(r.dot) : undefined;
        return block("list", {
          empty: r.empty,
          items: docs.map((d) => {
            const actions = acts(d, data, s);
            const value = r.select ? scalarOf(valueAt(d, r.select.value ?? "id")) : "";
            return {
              headline: of.titleOf(d),
              supporting: columns
                .filter((f) => f.name !== of.title && f.name !== r.columns[0])
                .map((f) => textAt(f, d))
                .filter((t) => t && t !== "—")
                .join(" · "),
              href: r.select ? undefined : of.href?.(d),
              dot: dot ? toneAt(dot, d, textAt(dot, d)) : undefined,
              tags: tags.length ? tagsAt(tags, d) : undefined,
              actions: actions.length ? actions : undefined,
              ...(r.select
                ? { select: { param: r.select.param, value }, selected: s.params[r.select.param] === value }
                : {}),
            };
          }),
        });
      }
      if (r.layout === "timeline") {
        const [time, heading] = columns;
        const dot = r.dot ? field(r.dot) : undefined;
        const body = r.text ? field(r.text) : undefined;
        const shown = (f: FieldLike | undefined, d: Doc) => {
          const t = f ? textAt(f, d) : "";
          return t && t !== "—" ? t : undefined;
        };
        return block("timeline", {
          items: docs.map((d) => ({
            time: shown(time, d),
            heading: shown(heading, d),
            text: shown(body, d),
            tone: dot ? toneAt(dot, d, textAt(dot, d)) : undefined,
          })),
        });
      }
      if (r.layout === "entries") {
        const status = columns.find((f) => isToned(f) || f.custom?.toneWhen);
        const body = r.text ? field(r.text) : undefined;
        const facts = (r.facts ?? []).map(field);
        const notes = r.notes ? field(r.notes) : undefined;
        const notice = r.notice ? field(r.notice) : undefined;
        return block("entries", {
          empty: r.empty,
          items: docs.map((d) => {
            const st = status ? textAt(status, d) : "";
            const text = body ? textAt(body, d) : "";
            const n = notice ? textAt(notice, d) : "";
            const nt = notice && n && n !== "—" ? toneAt(notice, d, n) : undefined;
            const actions = acts(d, data, s);
            const lines = notes ? linesAt(notes, d) : [];
            const factRows = facts
              .map((f) => ({ label: labelOf(f), value: cellAt(f, d) }))
              .filter((x) => x.value != null);
            return {
              id: String(d.id),
              heading: of.titleOf(d),
              href: of.href?.(d),
              meta: columns
                .filter((f) => f !== status && f.name !== of.title && f.name !== r.columns[0])
                .map((f) => textAt(f, d))
                .filter((t) => t && t !== "—"),
              status: status && st && st !== "—" ? { label: st, tone: toneAt(status, d, st) } : undefined,
              tags: tags.length ? tagsAt(tags, d) : undefined,
              text: text && text !== "—" ? text : undefined,
              facts: factRows.length ? factRows : undefined,
              notes: lines.length ? lines : undefined,
              notice:
                n && n !== "—"
                  ? { text: n, tone: nt === "success" || nt === "warning" || nt === "error" ? nt : "info" }
                  : undefined,
              actions: actions.length ? actions : undefined,
            };
          }),
        });
      }
      return block("table", {
        empty: r.empty,
        columns: [
          ...columns.map((f) => ({
            key: f.name!,
            label: r.labels?.[f.name!] ?? labelOf(f),
            align: f.type === "number" ? ("end" as const) : undefined,
            supporting: r.supporting?.[f.name!] ? `${f.name}__2` : undefined,
          })),
          ...(hasActions ? [{ key: "__actions", label: "" }] : []),
        ],
        rows: docs.map((d, i): Row => {
          const row: Row = {};
          columns.forEach((f, j) => {
            const href = of.href?.(d);
            row[f.name!] =
              j === 0 && href && !f.custom?.href
                ? { text: f.name === of.title ? of.titleOf(d) : textAt(f, d) || `#${i + 1}`, href }
                : cellAt(f, d);
            const sub = r.supporting?.[f.name!];
            if (sub) row[`${f.name}__2`] = cellAt(field(sub), d);
          });
          if (hasActions) {
            const actions = acts(d, data, s);
            row.__actions = actions.length ? { text: "", actions } : null;
          }
          return row;
        }),
      });
    },
  };
}

/** Whether a document as read matches a `keep` (virtual fields: no query can filter on them). */
const keeps = (d: Doc, keep: Record<string, unknown> | undefined) =>
  !keep || matches(d, keep as Parameters<typeof matches>[1]);

/** A tone that depends on whether there are any: `{ some: "error", none: "success" }`. */
const toneFor = (t: MetricsSpec["items"][number]["tone"], n: number): Tone | undefined =>
  t && typeof t === "object" ? (n ? t.some : t.none) : t;

/** What a figure's query answers: a count (a number), or the documents to add up. */
type Found = number | { docs?: Doc[]; totalDocs: number };

function metrics({ metrics: spec, ...w }: Kind<"metrics">): Widget<Record<string, Found>> {
  const items = spec.items.map((x, i) => ({ ...x, key: `m${i}`, slug: x.collection ?? spec.collection }));
  // Each figure against its whole: the same count or sum over all of its collection's records
  // (a figure is never a number alone: "4 · 40% of 10 cases").
  const source: Source = {
    all: Object.fromEntries(
      items.flatMap((x) => [
        [
          x.key,
          x.sum || x.keep
            ? ({ find: x.slug, where: x.where, limit: 0, depth: 1 } satisfies Source)
            : ({ count: x.slug, where: x.where } satisfies Source),
        ],
        [
          `${x.key}.all`,
          x.sum ? ({ find: x.slug, limit: 0, depth: 1 } satisfies Source) : ({ count: x.slug } satisfies Source),
        ],
      ]),
    ),
  };
  const shown = (data: Record<string, Found>) => {
    const figs = figuresOf(data);
    return spec.hideEmpty && figs.every((f) => !f.count) ? [] : figs.map(({ count: _count, ...f }) => f);
  };
  const figuresOf = (data: Record<string, Found>) =>
    items.map((x) => {
      const got = data[x.key];
      const c = collectionOf(x.slug);
      const found = typeof got === "number" ? { totalDocs: got } : got;
      const docs = (found?.docs ?? []).filter((d) => keeps(d, x.keep));
      let n = x.keep ? docs.length : (found?.totalDocs ?? 0);
      let value = String(n);
      if (x.sum && c) {
        const f = fieldAt(c, x.sum);
        n = docs.reduce((s, d) => s + (Number(valueAt(d, x.sum!)) || 0), 0);
        // Money in each document's own currency: shown in it when they all share one, else bare.
        const fmt = f.custom?.number;
        const owner = (d: Doc) => ownerAt(d, x.sum!);
        const currencies = fmt?.currencyField
          ? new Set(docs.map((d) => scalarOf(owner(d)[fmt.currencyField!])))
          : undefined;
        value =
          currencies && currencies.size === 1
            ? numberText(f, n, owner(docs[0]!))
            : numberText(currencies ? { ...f, custom: {} } : f, n);
      }
      const tone = toneFor(x.tone, n);
      const count = x.keep || x.sum ? docs.length : n;
      // The whole it is part of: all the collection's records, counted or summed the same way.
      const allGot = data[`${x.key}.all`];
      const allFound = typeof allGot === "number" ? { totalDocs: allGot } : allGot;
      const whole = x.sum
        ? (allFound?.docs ?? []).reduce((t, d) => t + (Number(valueAt(d, x.sum!)) || 0), 0)
        : (allFound?.totalDocs ?? 0);
      const noun = c ? labels(c).plural.toLowerCase() : x.slug;
      const share =
        whole > 0 && (x.where || x.keep)
          ? {
              value: n / whole,
              text: `${Math.round((n / whole) * 100)}% of ${x.sum ? `all ${noun}` : `${whole} ${noun}`}`,
            }
          : undefined;
      return {
        label: x.label,
        value,
        note: x.note?.replaceAll("$count", String(count)).replaceAll("$sum", value),
        count,
        main: x.main,
        tone: tone === "success" || tone === "warning" || tone === "error" ? tone : undefined,
        href: dashboardPath("collections", x.slug),
        share,
      };
    });
  return figures<Record<string, Found>>({ ...w, data: source, format: shown } as never) as never;
}

/** A date's bucket: its label and its sort key. */
function bucketOf(v: unknown, bucket: BreakdownSpec["bucket"]): [string, string] | undefined {
  if (typeof v !== "string" || !v) return undefined;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return undefined;
  if (bucket === "month")
    return [d.toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" }), v.slice(0, 7)];
  if (bucket === "week") {
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((d.getUTCDay() + 6) % 7)));
    return [
      monday.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }),
      monday.toISOString(),
    ];
  }
  return [d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }), v.slice(0, 10)];
}

function breakdown({ breakdown: b, ...w }: Kind<"breakdown">): DrawingWidget<{ docs: Doc[] }> {
  const c = collectionOf(b.collection);
  if (!c) return { ...w, render: () => block("alert", { tone: "error", text: `No collection "${b.collection}".` }) };
  const by = fieldAt(c, b.by);
  const stack = b.stack ? fieldAt(c, b.stack) : undefined;
  const sum = b.sum ? fieldAt(c, b.sum) : undefined;
  /** Each group's stored value, by its label (what a part of a ring filters its documents by). */
  const raws = new Map<string, unknown>();
  /** A group's label and its order: a select's option order, a date's time, else the order first seen. */
  const groupOf = (f: FieldLike, d: Doc, seen: Map<string, string>): [string, string] | undefined => {
    const v = valueAt(d, f.name!);
    if (f.type === "date") return bucketOf(v, b.bucket);
    const label = textAt(f, d);
    if (!label || label === "—") return undefined;
    if (f === by && !raws.has(label)) raws.set(label, v && typeof v === "object" ? (v as Doc).id : v);
    const at = optionsOf(f)
      .map((o) => o.value)
      .indexOf(String(v));
    if (!seen.has(label)) seen.set(label, String(seen.size).padStart(4, "0"));
    return [label, at >= 0 ? String(at).padStart(4, "0") : seen.get(label)!];
  };
  return {
    ...w,
    skeleton: w.skeleton ?? (b.as === "table" ? "table" : b.as === "ring" || b.as === "share" ? "list" : "chart"),
    source: { find: b.collection, where: b.where, limit: 0, depth: 1 },
    render: (data) => {
      const docs = data.docs.filter((d) => keeps(d, b.keep));
      const seenX = new Map<string, string>();
      const seenS = new Map<string, string>();
      const xs = new Map<string, string>();
      const ss = new Map<string, string>();
      const values = new Map<string, number>();
      const key = (x: string, s: string) => `${x}\u0000${s}`;
      for (const d of docs) {
        const x = groupOf(by, d, seenX);
        const s = stack ? groupOf(stack, d, seenS) : ([labels(c).plural, "0"] as [string, string]);
        if (!x || !s) continue;
        xs.set(x[0], x[1]);
        ss.set(s[0], s[1]);
        values.set(
          key(x[0], s[0]),
          (values.get(key(x[0], s[0])) ?? 0) + (sum ? Number(valueAt(d, sum.name!)) || 0 : 1),
        );
      }
      const order = (m: Map<string, string>) => [...m].sort((p, q) => p[1].localeCompare(q[1])).map(([l]) => l);
      const series = order(ss);
      const total = (x: string) => series.reduce((t, s) => t + (values.get(key(x, s)) ?? 0), 0);
      let xLabels = order(xs);
      if (b.sort === "value") xLabels = [...xLabels].sort((p, q) => total(q) - total(p));
      if (b.top) {
        const top = new Set([...xLabels].sort((p, q) => total(q) - total(p)).slice(0, b.top));
        xLabels = xLabels.filter((x) => top.has(x));
      }
      const fmt = sum?.custom?.number;
      const money = (v: number) => (sum ? numberText(fmt?.currencyField ? { ...sum, custom: {} } : sum, v) : String(v));
      if (b.as === "ring" || b.as === "share" || b.as === "treemap") {
        const grand = xLabels.reduce((t, x) => t + total(x), 0);
        // The groups as parts of a whole, largest first, each opening its documents.
        const parts = [...xLabels]
          .sort((p, q) => total(q) - total(p))
          .map((x) => {
            const raw = raws.get(x);
            return {
              label: x,
              value: total(x),
              valueText: money(total(x)),
              href: raw != null && by.type !== "date" ? filtered(b.collection, by.name!, scalarOf(raw)) : undefined,
            };
          });
        const name = w.title ?? labels(c).plural;
        // The bar's own line reads the pointed part, or the whole: the documents, not the title again.
        if (b.as === "share") return block("share", { label: labels(c).plural, parts, total: money(grand) });
        if (b.as === "treemap") return block("treemap", { label: name, items: parts, total: money(grand) });
        return block("ring", {
          label: name,
          parts,
          total: money(grand),
          center: sum ? "in all" : labels(c).plural.toLowerCase(),
        });
      }
      if (b.as === "table") {
        const shown = (v: number) =>
          v ? (sum ? numberText(fmt?.currencyField ? { ...sum, custom: {} } : sum, v) : String(v)) : "—";
        return block("table", {
          columns: [
            { key: "__x", label: labelOf(by) },
            ...series.map((s, i) => ({ key: `s${i}`, label: s, align: "end" as const })),
            ...(series.length > 1 ? [{ key: "__total", label: "Total", align: "end" as const }] : []),
          ],
          rows: [...xLabels]
            .sort((p, q) => total(q) - total(p))
            .map((x): Row => ({
              __x: { text: x, strong: true },
              ...Object.fromEntries(series.map((s, i) => [`s${i}`, shown(values.get(key(x, s)) ?? 0)])),
              ...(series.length > 1 ? { __total: { text: shown(total(x)), strong: true } } : {}),
            })),
        });
      }
      return block("chart", {
        label: w.title ?? labels(c).plural,
        chart: {
          kind: b.chart ?? (by.type === "date" ? "line" : "bars"),
          stacked: !!stack,
          labels: xLabels,
          series: series.map((s) => ({ name: s, values: xLabels.map((x) => values.get(key(x, s)) ?? 0) })),
          format: fmt && !fmt.currencyField ? { ...fmt, compact: true } : undefined,
        },
      });
    },
  };
}

function counts({ counts: spec, ...w }: Kind<"counts">): DrawingWidget<Record<string, number>> {
  const slug = spec.collection;
  const c = collectionOf(slug);
  let items: {
    key: string;
    label: string;
    where: Record<string, unknown>;
    tone?: Tone;
    href?: string;
    note?: string;
    collection?: string;
  }[];
  if ("field" in spec) {
    const f = c && dataFields(fieldsOf(c)).find((x) => x.name === spec.field);
    items = (f ? optionsOf(f) : [])
      .filter((o) => !spec.skip?.includes(o.value))
      .map((o, i) => ({
        key: `k${i}`,
        label: o.label,
        where: { [spec.field]: { equals: o.value } },
        tone: f && f.custom?.tones?.[o.value] ? (toneOf(f, o.value, o.label) as Tone) : undefined,
        href: filtered(slug, spec.field, o.value),
      }));
  } else
    items = spec.items.map((x, i) => ({
      ...x,
      key: `k${i}`,
      href: dashboardPath("collections", x.collection ?? slug),
    }));
  const hideEmpty = "field" in spec && spec.hideEmpty !== false;
  const noun = (c ? labels(c).plural : slug).toLowerCase();
  const shown = (n: Record<string, number>) => {
    const list = items.filter((x) => !hideEmpty || (n[x.key] ?? 0) > 0);
    // Counts of one collection's values are parts of a whole: each its share of them all.
    const whole = "field" in spec ? list.reduce((t, x) => t + (n[x.key] ?? 0), 0) : 0;
    return list.map((x) => ({
      label: x.label,
      value: String(n[x.key] ?? 0),
      note: x.note,
      tone: x.tone === "success" || x.tone === "warning" || x.tone === "error" ? x.tone : undefined,
      href: x.href,
      share: whole
        ? {
            value: (n[x.key] ?? 0) / whole,
            text: `${Math.round(((n[x.key] ?? 0) / whole) * 100)}% of ${whole} ${noun}`,
          }
        : undefined,
    }));
  };
  const source: Source = {
    all: Object.fromEntries(
      items.map((x) => [x.key, { count: x.collection ?? slug, where: x.where } satisfies Source]),
    ),
  };
  // A tile per value (`figures`): the board tiles them, and each carries its share of the whole.
  if (spec.layout === "funnel")
    return {
      ...w,
      skeleton: w.skeleton ?? "list",
      source,
      render: (n) =>
        block("funnel", {
          label: w.title,
          stages: items.map((x) => ({ label: x.label, value: n[x.key] ?? 0, href: x.href })),
        }),
    };
  if (spec.layout === "list")
    return {
      ...w,
      skeleton: w.skeleton ?? "list",
      source,
      render: (n) =>
        block("list", {
          variant: "divided",
          items: shown(n).map((x) => ({
            headline: x.label,
            supporting: x.note,
            href: x.href,
            // The count, on the label's line, in its tone only while there are any: nothing waiting reads calm.
            value: { text: x.value, strong: true, tone: x.value !== "0" ? x.tone : undefined },
          })),
        }),
    };
  return figures<Record<string, number>>({ ...w, data: source, format: shown } as never) as never;
}

function fields({ fields: spec, ...w }: Kind<"fields">, scope: WidgetScope): DrawingWidget<Doc> {
  const slug = scope.doc?.slug;
  const c = slug ? collectionOf(slug) : undefined;
  const all = c ? formFields(c) : [];
  return {
    ...w,
    skeleton: w.skeleton ?? "text",
    source: { doc: true, depth: 1 },
    render: (d, s) => {
      const actions = spec.actions === false || !slug ? [] : actionsFor(slug, d, s);
      return [
        block("details", {
          layout: spec.layout,
          items: spec.fields.flatMap((name) => {
            const f = fieldIn(all, name);
            const value = cellAt(f, d);
            return value == null && name.includes(".") ? [] : [{ label: labelOf(f), value }];
          }),
        }),
        ...(actions.length ? [block("actions", { items: actions })] : []),
      ];
    },
  };
}

/** A widget with its data widget (`records`, `counts`, `fields`) turned into a source and a render. */
export function expand(w: Widget, scope: WidgetScope): Widget {
  if (w.records) return records(w, scope) as Widget;
  if (w.counts) return counts(w) as Widget;
  if (w.metrics) return metrics(w) as Widget;
  if (w.breakdown) return breakdown(w) as Widget;
  if (w.fields) return fields(w, scope) as Widget;
  return w;
}
