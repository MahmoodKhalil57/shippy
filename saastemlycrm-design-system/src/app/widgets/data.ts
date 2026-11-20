import { stringify } from "qs-esm";
import type { Doc, FieldLike } from "../../contracts/config.ts";
import {
  cellText,
  collectionOf,
  dashboardPath,
  dataFields,
  fieldsOf,
  formFields,
  isToned,
  labels,
  titleOf,
  toneOf,
  useAsTitle,
} from "../shared.ts";
import { block, type Cell, type Row, type Tone } from "./schema.ts";
import type { DrawingWidget, Source, Widget, WidgetScope } from "./widget.ts";

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
  return text;
}

type Kind<K extends string> = Extract<Widget, Record<K, unknown>>;

function records({ records: r, ...w }: Kind<"records">): DrawingWidget<{ docs: Doc[]; totalDocs: number }> {
  const c = collectionOf(r.collection);
  if (!c) return { ...w, render: () => block("alert", { tone: "error", text: `No collection "${r.collection}".` }) };
  const all = dataFields(formFields(c));
  const field = (name: string): FieldLike =>
    all.find((f) => f.name === name) ?? { type: name === "createdAt" || name === "updatedAt" ? "date" : "text", name };
  const columns = r.columns.map(field);
  const title = useAsTitle(c);
  const link = (d: Doc) => dashboardPath("collections", r.collection, String(d.id));
  return {
    ...w,
    skeleton: w.skeleton ?? (r.layout === "list" ? "list" : "table"),
    source: { find: r.collection, where: r.where, sort: r.sort, limit: r.limit ?? 10, depth: 1 },
    head: (data, scope) => ({
      count: data.totalDocs,
      actions: r.more
        ? [
            {
              label: `All ${labels(c).plural.toLowerCase()}`,
              href: dashboardPath("collections", r.collection),
              variant: "text",
            },
          ]
        : [],
      ...w.head?.(data, scope),
    }),
    render: ({ docs }) => {
      if (r.layout === "list")
        return block("list", {
          empty: r.empty,
          items: docs.map((d) => ({
            headline: titleOf(c, d),
            supporting: columns
              .filter((f) => f.name !== title)
              .map((f) => cellText(f, d[f.name!]))
              .filter((t) => t && t !== "—")
              .join(" · "),
            href: link(d),
          })),
        });
      return block("table", {
        empty: r.empty,
        columns: columns.map((f) => ({
          key: f.name!,
          label: labelOf(f),
          align: f.type === "number" ? ("end" as const) : undefined,
          supporting: r.supporting?.[f.name!] ? `${f.name}__2` : undefined,
        })),
        rows: docs.map((d, i): Row => {
          const row: Row = {};
          columns.forEach((f, j) => {
            const value = cellOf(f, d);
            row[f.name!] =
              j === 0
                ? { text: f.name === title ? titleOf(c, d) : cellText(f, d[f.name!]) || `#${i + 1}`, href: link(d) }
                : value;
            const sub = r.supporting?.[f.name!];
            if (sub) row[`${f.name}__2`] = cellOf(field(sub), d);
          });
          return row;
        }),
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
  return {
    ...w,
    skeleton: w.skeleton ?? "stats",
    source: {
      all: Object.fromEntries(
        items.map((x) => [x.key, { count: x.collection ?? slug, where: x.where } satisfies Source]),
      ),
    },
    render: (n) =>
      block("stats", {
        size: "md",
        items: items
          .filter((x) => !hideEmpty || (n[x.key] ?? 0) > 0)
          .map((x) => ({
            label: x.label,
            value: String(n[x.key] ?? 0),
            note: x.note,
            tone: x.tone === "success" || x.tone === "warning" || x.tone === "error" ? x.tone : undefined,
            href: x.href,
          })),
      }),
  };
}

function fields({ fields: spec, ...w }: Kind<"fields">, scope: WidgetScope): DrawingWidget<Doc> {
  const c = scope.doc ? collectionOf(scope.doc.slug) : undefined;
  const all = c ? dataFields(fieldsOf(c)) : [];
  return {
    ...w,
    skeleton: w.skeleton ?? "text",
    source: { doc: true, depth: 1 },
    render: (d) =>
      block("details", {
        layout: spec.layout,
        items: spec.fields.flatMap((name) => {
          const f = all.find((x) => x.name === name);
          return f ? [{ label: labelOf(f), value: cellOf(f, d) }] : [];
        }),
      }),
  };
}

/** A widget with its data widget (`records`, `counts`, `fields`) turned into a source and a render. */
export function expand(w: Widget, scope: WidgetScope): Widget {
  if (w.records) return records(w) as Widget;
  if (w.counts) return counts(w) as Widget;
  if (w.fields) return fields(w, scope) as Widget;
  return w;
}
