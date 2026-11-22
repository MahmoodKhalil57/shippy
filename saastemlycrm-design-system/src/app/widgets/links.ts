import { stringify } from "qs-esm";

/**
 * Links to the dashboard's own pages, built the one way the app reads them: a document (and one
 * of its edit tabs), a collection's list (optionally filtered), a new document, a global, a
 * custom root view. Pure, so endpoints (links in their data) and widgets both use it.
 *
 * A project narrows the names to its own, so a wrong slug is a compile error:
 *
 *   export const { doc, list, create, global, view } = links<CollectionSlug, GlobalSlug, ViewPath>();
 *   doc("cases", c.id, "pricing")   // "/collections/cases/gs-rfq-0142/pricing"
 *   list("invoices", { status: "Overdue" })
 *
 * The `saastemly/no-raw-hrefs` lint rule reports `/collections/…` and `/globals/…` strings built by
 * hand; `screenDesignProblems` (`saastemlycrm-design-system/testing`) checks that every link a screen draws
 * leads to a collection, document, tab, global or view that exists.
 */
export interface Links<C extends string, G extends string, V extends string> {
  /** A document's edit page, or one of its edit tabs (`admin.components.views.edit.<tab>.path`). */
  doc: (collection: C, id: string | number, tab?: string) => string;
  /** A collection's list; `filter` keeps the documents whose field equals the value. */
  list: (collection: C, filter?: Record<string, string>) => string;
  /** A new document's form. */
  create: (collection: C) => string;
  /** A global's page. */
  global: (slug: G) => string;
  /** A custom root view (`admin.components.views.<key>.path`), with an optional query. */
  view: (path: V, query?: Record<string, string>) => string;
}

/**
 * A path segment, encoded. A placeholder filled in later (`$row.case`, `$item.id`, `$doc.id`) stays
 * as it is, so a link can be built for any document: `link.doc("cases", "$row.case")`.
 */
const part = (s: string | number) =>
  typeof s === "string" && /^\$\w+(?:\.\w+)*$/.test(s) ? s : encodeURIComponent(String(s));
const query = (q?: Record<string, unknown>) =>
  q && Object.keys(q).length ? stringify(q, { addQueryPrefix: true, encodeValuesOnly: true }) : "";

export function links<C extends string = string, G extends string = string, V extends string = string>(): Links<
  C,
  G,
  V
> {
  return {
    doc: (collection, id, tab) => `/collections/${part(collection)}/${part(id)}${tab ? `/${part(tab)}` : ""}`,
    list: (collection, filter) =>
      `/collections/${part(collection)}${query(
        filter && {
          filters: Object.entries(filter).map(([field, value]) => ({ field, operator: "equals", value })),
        },
      )}`,
    create: (collection) => `/collections/${part(collection)}/create`,
    global: (slug) => `/globals/${part(slug)}`,
    view: (path, q) => `${path}${query(q)}`,
  };
}

/** Where a dashboard link leads, read back (for checks): what kind of page, and its parts. */
export type LinkTarget =
  | { kind: "list" | "create"; collection: string }
  | { kind: "doc"; collection: string; id: string; tab?: string }
  | { kind: "global"; slug: string }
  | { kind: "view"; path: string }
  | { kind: "outside" };

/** Reads a link the dashboard draws (`href`) back into what it points at. */
export function linkTarget(href: string): LinkTarget {
  if (!href.startsWith("/") || href.startsWith("//")) return { kind: "outside" };
  const path = href.split(/[?#]/)[0]!;
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === "collections" && parts[1]) {
    if (parts.length === 2) return { kind: "list", collection: parts[1] };
    if (parts[2] === "create") return { kind: "create", collection: parts[1] };
    return { kind: "doc", collection: parts[1], id: parts[2]!, tab: parts[3] };
  }
  if (parts[0] === "globals" && parts[1]) return { kind: "global", slug: parts[1] };
  return { kind: "view", path: path.replace(/\/+$/, "") || "/" };
}
