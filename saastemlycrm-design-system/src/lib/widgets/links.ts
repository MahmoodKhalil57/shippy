import { stringify } from "qs-esm";

export interface Links<C extends string, G extends string, V extends string> {
  doc: (collection: C, id: string | number, tab?: string) => string;
  list: (collection: C, filter?: Record<string, string>) => string;
  create: (collection: C) => string;
  global: (slug: G) => string;
  view: (path: V, query?: Record<string, string>) => string;
}

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

export type LinkTarget =
  | { kind: "list" | "create"; collection: string }
  | { kind: "doc"; collection: string; id: string; tab?: string }
  | { kind: "global"; slug: string }
  | { kind: "view"; path: string }
  | { kind: "outside" };

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
