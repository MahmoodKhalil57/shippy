import { stringify } from "qs-esm";
import {
  designProblems,
  fill,
  linkTarget,
  type MockConfig,
  type Source,
  type ViewBlock,
  type Widget,
  type WidgetPage,
  type WidgetScope,
} from "saastemlycrm-design-system/contracts";
import type { TestBackend } from "./testing.ts";

/**
 * Every screen of a project, drawn as each user sees it, and checked against the design rules
 * that need real data (`designProblems` in the design system's contracts). Knows no project: the
 * screens come from the config's component slots, the users from the seed.
 *
 *   it("every screen follows the design system", async () => {
 *     expect(await screenDesignProblems(backend, { password: "demo1234" })).toEqual([]);
 *   });
 */

/** A screen of widgets, where it sits, and the document it's about (an edit tab, a list). */
export interface Screen {
  name: string;
  page: WidgetPage;
  /** The collection whose first document an edit-tab screen is drawn for. */
  docOf?: string;
}

type Component = { path?: string; clientProps?: { page?: WidgetPage } } | string | undefined;
const pageOf = (c: Component): WidgetPage | undefined =>
  c && typeof c === "object" && c.path === "app-widgets" ? c.clientProps?.page : undefined;

/** The screens in a config: root views, the home page, edit tabs, widgets above forms and lists. */
export function screensOf(config: MockConfig): Screen[] {
  const out: Screen[] = [];
  const add = (name: string, c: Component, docOf?: string) => {
    const page = pageOf(c);
    if (page) out.push({ name, page, docOf });
  };
  for (const [key, view] of Object.entries(config.admin?.components?.views ?? {}))
    add(key === "dashboard" ? "home" : `/${key}`, (view as { Component?: Component }).Component);
  for (const c of config.collections) {
    const views = (c.admin?.components as { views?: { edit?: Record<string, { Component?: Component }> } } | undefined)
      ?.views?.edit;
    for (const [tab, v] of Object.entries(views ?? {})) add(`${c.slug} › ${tab}`, v?.Component, c.slug);
    const before = (c.custom as { edit?: { before?: Widget[] } } | undefined)?.edit?.before;
    if (before?.length) out.push({ name: `${c.slug} › above the form`, page: { widgets: before }, docOf: c.slug });
    const lists = c.admin?.components as { beforeList?: Component[]; afterList?: Component[] } | undefined;
    for (const [i, comp] of [...(lists?.beforeList ?? []), ...(lists?.afterList ?? [])].entries())
      add(`${c.slug} › list ${i + 1}`, comp);
  }
  return out;
}

/** A source's data as the widget host loads it, through the REST API as the signed-in user. */
async function load(backend: TestBackend, s: Source, scope: WidgetScope): Promise<{ status: number; data: unknown }> {
  const get = async (url: string) => {
    const r = await backend.call("GET", url);
    return { status: r.status, data: r.body as unknown };
  };
  const api = backend.engine.apiRoute;
  if ("all" in s) {
    const parts = await Promise.all(
      Object.entries(s.all).map(async ([k, x]) => [k, await load(backend, x, scope)] as const),
    );
    const refused = parts.find(([, r]) => r.status !== 200);
    if (refused) return refused[1];
    return { status: 200, data: Object.fromEntries(parts.map(([k, r]) => [k, r.data])) };
  }
  if ("endpoint" in s) return get(`${api}${s.endpoint}${stringify(s.query ?? {}, { addQueryPrefix: true })}`);
  if ("find" in s) {
    const { find, ...rest } = s;
    return get(`${api}/${find}${stringify(rest, { addQueryPrefix: true })}`);
  }
  if ("count" in s) {
    const r = await get(`${api}/${s.count}/count${stringify({ where: s.where }, { addQueryPrefix: true })}`);
    return { status: r.status, data: (r.data as { totalDocs?: number }).totalDocs };
  }
  if ("global" in s) return get(`${api}/globals/${s.global}${stringify({ depth: s.depth }, { addQueryPrefix: true })}`);
  if (!scope.doc) return { status: 400, data: "needs a document" };
  return get(
    `${api}/${scope.doc.slug}/${scope.doc.id}${stringify({ depth: s.depth ?? 1, joins: s.joins }, { addQueryPrefix: true })}`,
  );
}

/** What each widget of a page draws for this user (titled widgets as cards, like the host). */
async function draw(backend: TestBackend, page: WidgetPage, scope: WidgetScope, where: string) {
  const problems: string[] = [];
  const one = async (w: Widget): Promise<ViewBlock[]> => {
    if (w.visible && !w.visible(scope)) return [];
    if (w.grid) return [{ type: "grid", blocks: (await Promise.all(w.grid.map(one))).flat() }];
    if (w.split)
      return [
        {
          type: "split",
          main: (await Promise.all(w.split.main.map(one))).flat(),
          side: (await Promise.all(w.split.side.map(one))).flat(),
        },
      ];
    // Data widgets (`records`, `counts`, `fields`) are drawn by the design system from the field config.
    if (!w.render) return [];
    const at = `${where} › ${w.title ?? "widget"}`;
    const { status, data } = w.source ? await load(backend, fill(w.source, scope), scope) : { status: 200, data: null };
    if (status === 403) return [];
    if (status !== 200) {
      problems.push(`${at}: its source answered ${status}`);
      return [];
    }
    try {
      if (w.hidden?.(data as never, scope)) return [];
      const r = w.render(data as never, scope);
      const blocks = r ? (Array.isArray(r) ? r : [r]) : [];
      if (!w.title) return blocks;
      const head = w.head?.(data as never, scope);
      if (w.title.length > 90) problems.push(`${at}: title is ${w.title.length} characters`);
      return [{ type: "card", heading: w.title, count: head?.count, actions: head?.actions, blocks }];
    } catch (e) {
      problems.push(`${at}: render threw ${(e as Error).message}`);
      return [];
    }
  };
  const blocks = (await Promise.all(page.widgets.map(one))).flat();
  return { blocks, problems };
}

/** Every `href` in drawn blocks (actions, cells, list items, entries, stats…), however deep. */
function hrefsIn(value: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) for (const v of value) hrefsIn(v, out);
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) {
      if (k === "href" && typeof v === "string") out.add(v);
      else hrefsIn(v, out);
    }
  return out;
}

/**
 * Where a link fails to lead: a collection, global, edit tab or view the config doesn't have, or a
 * document that doesn't exist (404; one this user may not open still exists). `undefined` when
 * it leads somewhere.
 */
async function brokenLink(backend: TestBackend, href: string, known: Map<string, boolean>) {
  const config = backend.engine.config;
  const t = linkTarget(href);
  if (t.kind === "outside") return undefined;
  if (t.kind === "global")
    return (config.globals ?? []).some((g) => g.slug === t.slug) ? undefined : `no global "${t.slug}"`;
  if (t.kind === "view") {
    const views = Object.values(config.admin?.components?.views ?? {}).map((v) => (v as { path?: string }).path);
    return views.includes(t.path) ? undefined : `no view at "${t.path}"`;
  }
  const c = config.collections.find((x) => x.slug === t.collection);
  if (!c) return `no collection "${t.collection}"`;
  if (t.kind !== "doc") return undefined;
  if (t.tab) {
    const edit = (c.admin?.components as { views?: { edit?: Record<string, { path?: string }> } } | undefined)?.views
      ?.edit;
    if (!Object.values(edit ?? {}).some((v) => v?.path === `/${t.tab}`)) return `no "${t.tab}" tab on ${t.collection}`;
  }
  const key = `${t.collection}/${t.id}`;
  if (!known.has(key)) {
    const r = await backend.call(
      "GET",
      `${backend.engine.apiRoute}/${t.collection}/${encodeURIComponent(t.id)}?depth=0`,
    );
    known.set(key, r.status !== 404);
  }
  return known.get(key) ? undefined : `no ${t.collection} document "${t.id}"`;
}

export interface ScreenCheckOptions {
  /** The seeded users' password (each user in the seed's auth collection signs in with it). */
  password: string;
  /** The auth collection (default `users`). */
  collection?: string;
  /** Only these screens (by name), e.g. while fixing one. */
  only?: string[];
}

/**
 * Every screen as every seeded user, checked with `designProblems` and for links that lead
 * nowhere (`links()` builds them; this checks the data they're built from): one line per problem,
 * "<user> · <screen> › <widget>: <what's wrong>". Empty when the screens follow the design.
 */
export async function screenDesignProblems(backend: TestBackend, options: ScreenCheckOptions): Promise<string[]> {
  const collection = options.collection ?? "users";
  const users = (backend.seeds.collections[collection] ?? []).filter((u) => typeof u.email === "string");
  const screens = screensOf(backend.engine.config).filter((s) => !options.only || options.only.includes(s.name));
  const out = new Set<string>();
  /** Documents looked up by links, by `<collection>/<id>`: whether they exist. */
  const known = new Map<string, boolean>();
  for (const u of users) {
    const login = await backend.login(String(u.email), options.password, collection);
    if (login.status !== 200) {
      out.add(`${String(u.email)}: can't sign in (${login.status})`);
      continue;
    }
    const me = (await backend.call("GET", `${backend.engine.apiRoute}/${collection}/me`)).body.user;
    const who = String(u.email).split("@")[0];
    for (const screen of screens) {
      let doc: WidgetScope["doc"];
      if (screen.docOf) {
        const first = await backend.call("GET", `${backend.engine.apiRoute}/${screen.docOf}?limit=1&depth=0`);
        const id = first.status === 200 ? first.body.docs?.[0]?.id : undefined;
        if (id === undefined) continue;
        doc = { id: String(id), slug: screen.docOf };
      }
      const scope: WidgetScope = { user: me, doc, params: { ...screen.page.params } };
      const { blocks, problems } = await draw(backend, screen.page, scope, screen.name);
      // The same problem for several users is one line, named for the first.
      const links: string[] = [];
      for (const href of hrefsIn(blocks)) {
        const broken = await brokenLink(backend, href, known);
        if (broken) links.push(`${screen.name}: link ${href} leads nowhere (${broken})`);
      }
      for (const p of [...problems, ...links, ...designProblems(blocks, screen.name)])
        if (![...out].some((x) => x.endsWith(` · ${p}`))) out.add(`${who} · ${p}`);
    }
  }
  return [...out];
}
