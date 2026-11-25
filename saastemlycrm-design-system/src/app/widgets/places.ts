import { parse, stringify } from "qs-esm";
import type { Widget, WidgetPage } from "./widget.ts";
import { linkTarget } from "./links.ts";

export interface ViewLike {
  path: string;
  Component?: unknown;
}

export interface Place {
  view: string;
  path: string;
  key: string;
  param?: string;
}

export interface Places {
  collections: Map<string, Place>;
  documents: Map<string, Place>;
  globals: Map<string, Place>;
}

export function viewWidgets(view: ViewLike): Widget[] {
  const c = view.Component as { clientProps?: { page?: WidgetPage } } | undefined;
  const flat = (list: Widget[]): Widget[] =>
    list.flatMap((w) => (w.grid ? flat(w.grid) : w.split ? flat([...w.split.main, ...w.split.side]) : [w]));
  return flat(c?.clientProps?.page?.widgets ?? []);
}

export const pathParams = (pattern: string) => [...pattern.matchAll(/:(\w+)/g)].map((m) => m[1]!);

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const want = pattern.split("/").filter(Boolean);
  const got = path.split("/").filter(Boolean);
  if (want.length !== got.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < want.length; i++) {
    const w = want[i]!;
    if (w.startsWith(":")) params[w.slice(1)] = decodeURIComponent(got[i]!);
    else if (w !== got[i]) return null;
  }
  return params;
}

export function placesOf(views: Record<string, ViewLike>): Places {
  const out: Places = { collections: new Map(), documents: new Map(), globals: new Map() };
  const homes = { collections: new Set<string>(), documents: new Set<string>(), globals: new Set<string>() };
  const put = (kind: keyof Places, slug: string, place: Place, home: boolean | undefined) => {
    if (homes[kind].has(slug)) return;
    if (home) homes[kind].add(slug);
    if (home || !out[kind].has(slug)) out[kind].set(slug, place);
  };
  for (const [view, v] of Object.entries(views))
    for (const w of viewWidgets(v)) {
      if (w.collection) {
        const c = w.collection;
        put("collections", c.collection, { view, path: v.path, key: c.key ?? c.collection }, c.home);
      } else if (w.document) {
        const d = w.document;
        const param = /^\$param\.(\w+)$/.exec(d.id)?.[1];
        if (param && pathParams(v.path).includes(param))
          put("documents", d.collection, { view, path: v.path, key: d.key ?? d.collection, param }, d.home);
      } else if (w.global) {
        const g = w.global;
        put("globals", g.global, { view, path: v.path, key: g.key ?? g.global }, g.home);
      }
    }
  return out;
}

const query = (q: Record<string, unknown>) =>
  Object.keys(q).length ? stringify(q, { addQueryPrefix: true, encodeValuesOnly: true }) : "";

export function placeOf(href: string, places: Places): string | null {
  const t = linkTarget(href);
  const [, search = ""] = href.split("?");
  const given = parse(search.split("#")[0] ?? "", { depth: 5, arrayLimit: 200 }) as Record<string, unknown>;
  if (t.kind === "list") {
    const p = places.collections.get(t.collection);
    return p ? `${p.path}${query(Object.keys(given).length ? { [p.key]: given } : {})}` : null;
  }
  if (t.kind === "doc" || t.kind === "create") {
    const id = t.kind === "doc" ? t.id : "create";
    const d = places.documents.get(t.collection);
    if (d)
      return `${d.path.replace(`:${d.param}`, encodeURIComponent(id))}${query(
        t.kind === "doc" && t.tab ? { [d.key]: { tab: t.tab } } : {},
      )}`;
    const p = places.collections.get(t.collection);
    if (!p || t.kind === "create") return null;
    return `${p.path}${query({ [p.key]: { open: id } })}`;
  }
  if (t.kind === "global") {
    const p = places.globals.get(t.slug);
    const tab = href.split(/[?#]/)[0]!.split("/").filter(Boolean)[2];
    return p ? `${p.path}${query(tab ? { [p.key]: { tab } } : {})}` : null;
  }
  return null;
}
