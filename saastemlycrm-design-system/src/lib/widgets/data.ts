import { stringify } from "qs-esm";
import type { CollectionConfig } from "payload";
import type { CollectionAction, CollectionSettings, Doc, FieldLike } from "../contracts/config.ts";
import { matches, sortDocs, valuesAt } from "../payload/query.ts";
import {
  dataFields,
  fieldsOf,
  formFields,
  isToned,
  labels,
  numberText,
  titleOf,
  useAsTitle,
  type Project,
} from "../dashboard/project.ts";
import { block, type Action, type Cell, type Row, type Tone } from "./schema.ts";
import { intl, m } from "../i18n/index.ts";
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

const labelOf = (f: FieldLike) =>
  typeof f.label === "string" ? f.label : f.name![0]!.toUpperCase() + f.name!.slice(1).replace(/([A-Z])/g, " $1");

const optionsOf = (f: FieldLike) =>
  (f.options ?? []).map((o) =>
    typeof o === "string" ? { value: o, label: o } : { value: o.value, label: String(o.label) },
  );

const filtered = (p: Project, slug: string, field: string, value: string) =>
  `${p.dashboardPath("collections", slug)}${stringify(
    { filters: [{ field, operator: "equals", value }] },
    { addQueryPrefix: true, encodeValuesOnly: true },
  )}`;

function cellOf(p: Project, f: FieldLike, doc: Doc): Cell {
  const v = doc[f.name!];
  const text = p.cellText(f, v);
  if ((f.type === "relationship" || f.type === "upload") && typeof f.relationTo === "string") {
    const id = v && typeof v === "object" && "id" in v ? String((v as Doc).id) : undefined;
    const href = id ? p.dashboardPath("collections", f.relationTo, id) : undefined;
    if (!f.hasMany && p.collectionOf(f.relationTo)?.auth) return { text, person: true, href };
    return href ? { text, href } : text;
  }
  if (isToned(f)) return { text, tone: p.toneOf(f, v, text) as Tone, tag: true };
  if (f.type === "select" && !f.hasMany) {
    const at = optionsOf(f).findIndex((o) => o.value === String(v));
    if (at >= 0) return { text, tag: true, hue: at };
  }
  return text;
}

type Kind<K extends string> = Extract<Widget, Record<K, unknown>>;

function fieldIn(p: Project, fields: FieldLike[], path: string): FieldLike {
  const f = fieldThrough(p, fields, path);
  return path.includes(".") && typeof f.label !== "string"
    ? { ...f, label: labelOf({ ...f, name: path.split(".").at(-1)! }) }
    : f;
}

function fieldThrough(p: Project, fields: FieldLike[], path: string): FieldLike {
  const [head, ...rest] = path.split(".");
  const f = dataFields(fields).find((x) => x.name === head);
  if (!f) return { type: head === "createdAt" || head === "updatedAt" ? "date" : "text", name: path };
  if (!rest.length) return f;
  if (f.type === "group" || f.type === "array") {
    const inner = fieldThrough(p, f.fields ?? [], rest.join("."));
    return { ...inner, name: path, virtual: inner.virtual || f.virtual };
  }
  const next = typeof f.relationTo === "string" ? p.collectionOf(f.relationTo) : undefined;
  return next ? { ...fieldThrough(p, formFields(next), rest.join(".")), name: path } : { ...f, name: path };
}

const fieldAt = (p: Project, c: CollectionConfig, path: string) => fieldIn(p, formFields(c), path);

const valueAt = (doc: Doc, path: string): unknown => (path.includes(".") ? valuesAt(doc, path)[0] : doc[path]);

function pathAt(doc: Doc, path: string): unknown[] {
  let at: unknown = doc;
  for (const p of path.split(".")) at = at && typeof at === "object" ? (at as Doc)[p] : undefined;
  return Array.isArray(at) ? at : [];
}

function ownerAt(doc: Doc, path: string): Doc {
  let at: unknown = doc;
  for (const p of path.split(".").slice(0, -1)) at = at && typeof at === "object" ? (at as Doc)[p] : undefined;
  return at && typeof at === "object" ? (at as Doc) : doc;
}

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

const scalarOf = (x: unknown): string =>
  typeof x === "string" || typeof x === "number"
    ? String(x)
    : x && typeof x === "object" && "id" in x
      ? String((x as Doc).id)
      : "";

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

export const actionsFor = (slug: string, doc: Doc, scope: WidgetScope, p: Project): Action[] =>
  actionsOf((p.collectionOf(slug)?.custom as CollectionSettings | undefined)?.actions, doc, scope);

const textAt = (p: Project, f: FieldLike, doc: Doc) => p.cellText(f, valueAt(doc, f.name!), ownerAt(doc, f.name!));

function toneAt(p: Project, f: FieldLike, doc: Doc, text: string): Tone | undefined {
  const rule = f.custom?.toneWhen?.find((r) => matches(doc, where(r.when)));
  if (rule) return rule.tone as Tone;
  return isToned(f) ? (p.toneOf(f, valueAt(doc, f.name!), text) as Tone) : undefined;
}

function cellAt(p: Project, f: FieldLike, doc: Doc): Cell {
  const text = textAt(p, f, doc);
  if (!text || text === "—") return null;
  const tone = toneAt(p, f, doc, text);
  const href = f.custom?.href ? filled(f.custom.href, { row: doc }) : undefined;
  if (!f.name!.includes(".") && f.type !== "number" && !f.custom?.toneWhen && !href) return cellOf(p, f, doc);
  if (isToned(f) && !f.custom?.toneWhen) return { text, tone, tag: true };
  const g = f.custom?.gauge;
  const v = Number(valueAt(doc, f.name!));
  const max = g ? (typeof g.max === "number" ? g.max : Number(valueAt(doc, g.max))) : 0;
  const gauge = g && Number.isFinite(v) && max > 0 ? { value: v, max, tone } : undefined;
  return tone || href || gauge ? { text, tone, href, gauge } : text;
}

const tagsAt = (p: Project, fields: FieldLike[], doc: Doc) =>
  fields.flatMap((f) => {
    const text = textAt(p, f, doc);
    return text && text !== "—" ? [{ label: text, tone: toneAt(p, f, doc, text) }] : [];
  });

function linesAt(p: Project, f: FieldLike, doc: Doc): string[] {
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
  const t = textAt(p, f, doc);
  return t && t !== "—" ? t.split("\n").filter(Boolean) : [];
}

interface Rows {
  fields: FieldLike[];
  title?: string;
  titleOf(row: Doc): string;
  href?(row: Doc): string;
  actions?: CollectionAction[];
  source: Source;
  rows(data: unknown): Doc[];
  parent?(data: unknown): Doc | undefined;
  count?(data: unknown): number;
  label: string;
  more?: string;
}

function rowsOf(p: Project, r: RecordsSpec, scope: WidgetScope): Rows | string {
  if (r.field && (r.global || r.doc)) {
    const owner = r.global ? p.globalOf(r.global) : scope.doc ? p.collectionOf(scope.doc.slug) : undefined;
    if (!owner) return r.global ? `No global "${r.global}".` : "Not on a document's screen.";
    const array = fieldIn(p, fieldsOf(owner), r.field);
    if (array.type !== "array") return `"${r.field}" isn't an array field.`;
    const fields = dataFields(array.fields ?? []);
    const at = (data: unknown) => (valueAt(data as Doc, r.field!) as Doc[] | undefined) ?? [];
    return {
      fields,
      titleOf: (row) => textAt(p, fieldIn(p, fields, r.columns[0]!), row),
      actions: array.custom?.actions,
      source: r.global ? { global: r.global, depth: 1 } : { doc: true, depth: 1 },
      rows: (data) => at(data).map((row, i) => ({ ...row, id: typeof row.id === "string" ? row.id : String(i) })),
      parent: (data) => data as Doc,
      label: typeof array.label === "string" ? array.label : labelOf(array),
    };
  }
  const c = r.collection ? p.collectionOf(r.collection) : undefined;
  if (!c) return `No collection "${r.collection ?? ""}".`;
  const sortField = r.sort ? fieldAt(p, c, r.sort.replace(/^-/, "")) : undefined;
  const sortHere = !!sortField?.virtual;
  const all = !!r.keep || sortHere;
  return {
    fields: formFields(c),
    title: useAsTitle(c),
    titleOf: (d) => titleOf(c, d),
    href: (d) => p.dashboardPath("collections", r.collection!, String(d.id)),
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
    more: p.dashboardPath("collections", r.collection!),
  };
}

function records(p: Project, { records: r, ...w }: Kind<"records">, scope: WidgetScope): DrawingWidget<unknown> {
  const of = rowsOf(p, r, scope);
  if (typeof of === "string") return { ...w, render: () => block("alert", { tone: "error", text: of }) };
  const field = (n: string) => fieldIn(p, of.fields, n);
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
    head: (data, s) => ({
      count: of.count ? of.count(data) : of.rows(data).length,
      actions:
        r.more && of.more
          ? [{ label: m.widget_data_all({ what: of.label.toLowerCase() }), href: of.more, variant: "text" as const }]
          : [],
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
                .map((f) => textAt(p, f, d))
                .filter((t) => t && t !== "—")
                .join(" · "),
              href: r.select ? undefined : of.href?.(d),
              dot: dot ? toneAt(p, dot, d, textAt(p, dot, d)) : undefined,
              tags: tags.length ? tagsAt(p, tags, d) : undefined,
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
          const t = f ? textAt(p, f, d) : "";
          return t && t !== "—" ? t : undefined;
        };
        return block("timeline", {
          items: docs.map((d) => ({
            time: shown(time, d),
            heading: shown(heading, d),
            text: shown(body, d),
            tone: dot ? toneAt(p, dot, d, textAt(p, dot, d)) : undefined,
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
            const st = status ? textAt(p, status, d) : "";
            const text = body ? textAt(p, body, d) : "";
            const n = notice ? textAt(p, notice, d) : "";
            const nt = notice && n && n !== "—" ? toneAt(p, notice, d, n) : undefined;
            const actions = acts(d, data, s);
            const lines = notes ? linesAt(p, notes, d) : [];
            const factRows = facts
              .map((f) => ({ label: labelOf(f), value: cellAt(p, f, d) }))
              .filter((x) => x.value != null);
            return {
              id: String(d.id),
              heading: of.titleOf(d),
              href: of.href?.(d),
              meta: columns
                .filter((f) => f !== status && f.name !== of.title && f.name !== r.columns[0])
                .map((f) => textAt(p, f, d))
                .filter((t) => t && t !== "—"),
              status: status && st && st !== "—" ? { label: st, tone: toneAt(p, status, d, st) } : undefined,
              tags: tags.length ? tagsAt(p, tags, d) : undefined,
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
          ...(hasActions ? [{ key: "__actions", label: m.command_section_actions() }] : []),
        ],
        rows: docs.map((d, i): Row => {
          const row: Row = {};
          columns.forEach((f, j) => {
            const href = of.href?.(d);
            row[f.name!] =
              j === 0 && href && !f.custom?.href
                ? { text: f.name === of.title ? of.titleOf(d) : textAt(p, f, d) || `#${i + 1}`, href }
                : cellAt(p, f, d);
            const sub = r.supporting?.[f.name!];
            if (sub) row[`${f.name}__2`] = cellAt(p, field(sub), d);
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

const keeps = (d: Doc, keep: Record<string, unknown> | undefined) =>
  !keep || matches(d, keep as Parameters<typeof matches>[1]);

const toneFor = (t: MetricsSpec["items"][number]["tone"], n: number): Tone | undefined =>
  t && typeof t === "object" ? (n ? t.some : t.none) : t;

type Found = number | { docs?: Doc[]; totalDocs: number };

function metrics(p: Project, { metrics: spec, ...w }: Kind<"metrics">): Widget<Record<string, Found>> {
  const items = spec.items.map((x, i) => ({ ...x, key: `m${i}`, slug: x.collection ?? spec.collection }));
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
  const shown = (data: Record<string, Found>) => figuresOf(data).map(({ count: _count, ...f }) => f);
  const figuresOf = (data: Record<string, Found>) =>
    items.map((x) => {
      const got = data[x.key]!;
      const c = p.collectionOf(x.slug);
      const found = typeof got === "number" ? { totalDocs: got } : got;
      const docs = (found.docs ?? []).filter((d) => keeps(d, x.keep));
      let n = x.keep ? docs.length : found.totalDocs;
      let value = String(n);
      if (x.sum && c) {
        const f = fieldAt(p, c, x.sum);
        n = docs.reduce((s, d) => s + (Number(valueAt(d, x.sum!)) || 0), 0);
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
      const allGot = data[`${x.key}.all`]!;
      const allFound = typeof allGot === "number" ? { totalDocs: allGot } : allGot;
      const whole = x.sum
        ? allFound.docs!.reduce((t, d) => t + (Number(valueAt(d, x.sum!)) || 0), 0)
        : allFound.totalDocs;
      const noun = c ? labels(c).plural.toLowerCase() : x.slug;
      const share =
        whole > 0 && (x.where || x.keep)
          ? {
              value: n / whole,
              text: x.sum
                ? m.widget_share_of_all({ pct: Math.round((n / whole) * 100), noun })
                : m.widget_share_of_total({ pct: Math.round((n / whole) * 100), total: whole, noun }),
            }
          : undefined;
      return {
        label: x.label,
        value,
        note: x.note?.replaceAll("$count", String(count)).replaceAll("$sum", value),
        count,
        main: x.main,
        tone: tone === "success" || tone === "warning" || tone === "error" ? tone : undefined,
        href: p.dashboardPath("collections", x.slug),
        share,
      };
    });
  return figures<Record<string, Found>>({
    ...w,
    data: source,
    labels: items.map((x) => x.label),
    format: shown,
  } as never) as never;
}

function bucketOf(v: unknown, bucket: BreakdownSpec["bucket"]): [string, string] | undefined {
  if (typeof v !== "string" || !v) return undefined;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return undefined;
  if (bucket === "month")
    return [intl.date({ month: "short", year: "2-digit", timeZone: "UTC" }).format(d), v.slice(0, 7)];
  if (bucket === "week") {
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((d.getUTCDay() + 6) % 7)));
    return [intl.date({ day: "2-digit", month: "short", timeZone: "UTC" }).format(monday), monday.toISOString()];
  }
  return [intl.date({ day: "2-digit", month: "short", timeZone: "UTC" }).format(d), v.slice(0, 10)];
}

function breakdown(p: Project, { breakdown: b, ...w }: Kind<"breakdown">): DrawingWidget<{ docs: Doc[] }> {
  const c = p.collectionOf(b.collection);
  if (!c) return { ...w, render: () => block("alert", { tone: "error", text: `No collection "${b.collection}".` }) };
  const by = fieldAt(p, c, b.by);
  const stack = b.stack ? fieldAt(p, c, b.stack) : undefined;
  const sum = b.sum ? fieldAt(p, c, b.sum) : undefined;
  const raws = new Map<string, unknown>();
  const groupOf = (f: FieldLike, d: Doc, seen: Map<string, string>): [string, string] | undefined => {
    const v = valueAt(d, f.name!);
    if (f.type === "date") return bucketOf(v, b.bucket);
    const label = textAt(p, f, d);
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
        const parts = [...xLabels]
          .sort((p, q) => total(q) - total(p))
          .map((x) => {
            const raw = raws.get(x);
            return {
              label: x,
              value: total(x),
              valueText: money(total(x)),
              href: raw != null && by.type !== "date" ? filtered(p, b.collection, by.name!, scalarOf(raw)) : undefined,
            };
          });
        const name = w.title ?? labels(c).plural;
        if (b.as === "share") return block("share", { label: labels(c).plural, parts, total: money(grand) });
        if (b.as === "treemap") return block("treemap", { label: name, items: parts, total: money(grand) });
        return block("ring", {
          label: name,
          parts,
          total: money(grand),
          center: sum ? m.widget_data_in_all() : labels(c).plural.toLowerCase(),
        });
      }
      if (b.as === "table") {
        const shown = (v: number) =>
          v ? (sum ? numberText(fmt?.currencyField ? { ...sum, custom: {} } : sum, v) : String(v)) : "—";
        return block("table", {
          columns: [
            { key: "__x", label: labelOf(by) },
            ...series.map((s, i) => ({ key: `s${i}`, label: s, align: "end" as const })),
            ...(series.length > 1 ? [{ key: "__total", label: m.widget_total(), align: "end" as const }] : []),
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

function counts(p: Project, { counts: spec, ...w }: Kind<"counts">): DrawingWidget<Record<string, number>> {
  const slug = spec.collection;
  const c = p.collectionOf(slug);
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
        tone: f && f.custom?.tones?.[o.value] ? (p.toneOf(f, o.value, o.label) as Tone) : undefined,
        href: filtered(p, slug, spec.field, o.value),
      }));
  } else
    items = spec.items.map((x, i) => ({
      ...x,
      key: `k${i}`,
      href: p.dashboardPath("collections", x.collection ?? slug),
    }));
  const noun = (c ? labels(c).plural : slug).toLowerCase();
  const shown = (n: Record<string, number>) => {
    const list = items;
    const whole = "field" in spec ? list.reduce((t, x) => t + n[x.key]!, 0) : 0;
    return list.map((x) => ({
      label: x.label,
      value: String(n[x.key]!),
      note: x.note,
      tone: x.tone === "success" || x.tone === "warning" || x.tone === "error" ? x.tone : undefined,
      href: x.href,
      share: whole
        ? {
            value: n[x.key]! / whole,
            text: m.widget_share_of_total({ pct: Math.round((n[x.key]! / whole) * 100), total: whole, noun }),
          }
        : undefined,
    }));
  };
  const source: Source = {
    all: Object.fromEntries(
      items.map((x) => [x.key, { count: x.collection ?? slug, where: x.where } satisfies Source]),
    ),
  };
  if (spec.layout === "funnel")
    return {
      ...w,
      skeleton: w.skeleton ?? "list",
      source,
      render: (n) =>
        block("funnel", {
          label: w.title,
          stages: items.map((x) => ({ label: x.label, value: n[x.key]!, href: x.href })),
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
            value: { text: x.value, strong: true, tone: x.value !== "0" ? x.tone : undefined },
          })),
        }),
    };
  return figures<Record<string, number>>({
    ...w,
    data: source,
    labels: items.map((x) => x.label),
    format: shown,
  } as never) as never;
}

function fields(p: Project, { fields: spec, ...w }: Kind<"fields">, scope: WidgetScope): DrawingWidget<Doc> {
  const slug = scope.doc?.slug;
  const c = slug ? p.collectionOf(slug) : undefined;
  const all = c ? formFields(c) : [];
  return {
    ...w,
    skeleton: w.skeleton ?? "text",
    source: { doc: true, depth: 1 },
    render: (d, s) => {
      const actions = spec.actions === false || !slug ? [] : actionsFor(slug, d, s, p);
      return [
        block("details", {
          layout: spec.layout,
          items: spec.fields.flatMap((name) => {
            const f = fieldIn(p, all, name);
            const value = cellAt(p, f, d);
            return value == null && name.includes(".") ? [] : [{ label: labelOf(f), value }];
          }),
        }),
        ...(actions.length ? [block("actions", { items: actions })] : []),
      ];
    },
  };
}

export function expand(w: Widget, scope: WidgetScope, p: Project): Widget {
  if (w.records) return records(p, w, scope) as Widget;
  if (w.counts) return counts(p, w) as Widget;
  if (w.metrics) return metrics(p, w) as Widget;
  if (w.breakdown) return breakdown(p, w) as Widget;
  if (w.fields) return fields(p, w, scope) as Widget;
  return w;
}
