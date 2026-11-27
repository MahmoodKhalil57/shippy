import type { CollectionConfig } from "payload";
import { collectionNamed, labelOf, personNamed, project, seeds } from "../project.ts";
import type { Places } from "./compile.ts";

interface View {
  path?: string;
  meta?: { title?: unknown };
  nav?: { label?: unknown } | string;
  tab?: { label?: unknown };
}

const viewsOf = (owner: unknown): Record<string, View> =>
  (owner as { admin?: { components?: { views?: Record<string, View> } } }).admin?.components?.views ?? {};

const pageNames = (v: View) =>
  [labelOf(v.meta?.title), typeof v.nav === "object" ? labelOf(v.nav.label) : undefined].filter(
    (n): n is string => !!n,
  );

const rootPages = () =>
  Object.values(viewsOf(project)).filter((v) => v.path && v.path !== "/" && !v.path.includes(":"));

const editTabs = (c: CollectionConfig) =>
  Object.values((viewsOf(c) as unknown as { edit?: Record<string, View> }).edit ?? {}).filter((v) => v.path);

const titleOf = (c: CollectionConfig, id: string) => {
  const by = c.admin?.useAsTitle ?? "id";
  const doc = (seeds.collections[c.slug] ?? []).find((d) => String(d.id) === id);
  const title = doc?.[by];
  return typeof title === "string" || typeof title === "number" ? String(title) : id;
};

const idOf = (c: CollectionConfig, title: string) => {
  const by = c.admin?.useAsTitle ?? "id";
  const docs = (seeds.collections[c.slug] ?? []).filter((d) => d[by] === title || String(d.id) === title);
  if (docs.length !== 1) throw new Error(`Expected one ${c.slug} called "${title}", found ${docs.length}.`);
  return String(docs[0]!.id);
};

export const places: Places = {
  person: (name) => personNamed(name).id,
  page(name) {
    const wanted = name.toLowerCase();
    const found = rootPages().find((v) => pageNames(v).some((n) => n.toLowerCase() === wanted));
    if (!found) throw new Error(`No page is called "${name}".`);
    return found.path!;
  },
  tab(tab, collection, title) {
    const c = collectionNamed(collection);
    const wanted = tab.toLowerCase();
    const found = editTabs(c).find((v) => labelOf(v.tab?.label)?.toLowerCase() === wanted);
    if (!found) throw new Error(`${collection} has no tab called "${tab}".`);
    return `/collections/${c.slug}/${encodeURIComponent(idOf(c, title))}${found.path}`;
  },
};

export function stepFor(path: string): string {
  if (path === "/") return "I open my home page";
  const page = rootPages().find((v) => v.path === path);
  if (page) return `I open the "${pageNames(page)[0]}" page`;
  const m = /^\/collections\/([^/]+)\/([^/]+)(\/.+)$/.exec(path);
  const c = m && project.collections.find((x) => x.slug === m[1]);
  const tab = c && editTabs(c).find((v) => v.path === m[3]);
  if (!c || !tab) throw new Error(`No page or tab is at ${path}.`);
  const name = (labelOf(c.labels?.singular) ?? c.slug).toLowerCase();
  return `I open the "${labelOf(tab.tab?.label)}" tab of ${name} "${titleOf(c, decodeURIComponent(m[2]!))}"`;
}

export const personName = (id: string) => {
  const p = (seeds.collections[project.admin?.user ?? "users"] ?? []).find((d) => String(d.id) === id);
  const name = p?.name ?? p?.email;
  return typeof name === "string" ? name : id;
};
