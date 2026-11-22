import { stringify } from "qs-esm";
import {
  designProblems,
  type DrawnTile,
  eachTiles,
  fill,
  linkTarget,
  placeOf,
  placesOf,
  type MockConfig,
  type Source,
  type ViewBlock,
  type Widget,
  type WidgetPage,
  type WidgetScope,
} from "../contracts/index.ts";
import { defaultRows, type TileSize } from "../components/base/board.ts";

/**
 * Every screen of a project, drawn as each user sees it, and checked against the design rules
 * that need real data (`designProblems` in the contracts) and for links that lead nowhere.
 * Knows no project and no backend: the screens come from the config's component slots, the data
 * from any backend that serves Payload's REST API (`ScreenBackend`: a request and a sign-in),
 * such as an in-memory test backend in Node, or a real Payload server.
 *
 *   expect(
 *     await screenDesignProblems({ config, backend, users: ["ana@example.test"], password: "demo" }),
 *   ).toEqual([]);
 */

/** Any backend that serves Payload's REST API: a request (as the signed-in user) and a sign-in. */
export interface ScreenBackend {
  // oxlint-disable-next-line typescript/no-explicit-any
  call(method: "GET", url: string): Promise<{ status: number; body: any }>;
  login(email: string, password: string, collection: string): Promise<{ status: number }>;
}

/** What `load`, `draw` and `brokenLink` need: the backend, the config and its API's route. */
interface Ctx {
  backend: ScreenBackend;
  config: MockConfig;
  api: string;
}

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
async function load(ctx: Ctx, s: Source, scope: WidgetScope): Promise<{ status: number; data: unknown }> {
  const get = async (url: string) => {
    const r = await ctx.backend.call("GET", url);
    return { status: r.status, data: r.body as unknown };
  };
  const api = ctx.api;
  if ("all" in s) {
    const parts = await Promise.all(
      Object.entries(s.all).map(async ([k, x]) => [k, await load(ctx, x, scope)] as const),
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
async function draw(ctx: Ctx, page: WidgetPage, scope: WidgetScope, where: string) {
  const problems: string[] = [];
  /** Each widget's tile as drawn, with its size, for the tile rules (`tileProblems`). */
  const tiles: DrawnTile[] = [];
  /** Widgets that took no tile (hidden by their data, or refused with nothing to say). */
  const gone = new WeakSet<Widget>();
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
    const at = `${where} › ${w.title ?? "widget"}`;
    // A collection placed on a page of widgets starts in a visual layout: a plain table is for its
    // own page (people can still switch to it there and here).
    if (w.collection && !w.collection.home && (w.collection.layout ?? "table") === "table")
      problems.push(
        `${at}: a plain table on a page of widgets; start it in a visual layout (\`list\`, \`cards\`, \`board\`, \`calendar\`, \`chart\`…)`,
      );
    // Data widgets (`records`, `counts`, `fields`) are drawn by the design system from the field config.
    if (!w.render && !w.each) return [];
    const { status, data } = w.source ? await load(ctx, fill(w.source, scope), scope) : { status: 200, data: null };
    if (status === 403 && !w.denied) {
      gone.add(w);
      return [];
    }
    if (status === 403) return [];
    if (status !== 200) {
      problems.push(`${at}: its source answered ${status}`);
      return [];
    }
    try {
      if (w.hidden?.(data as never, scope)) {
        gone.add(w);
        return [];
      }
      // One tile per item: each drawn as a titled widget of its own.
      if (w.each)
        return eachTiles(w, data as never, scope).map(({ widget: t }): ViewBlock => {
          const r = t.render(data as never, scope);
          const head = t.head?.(data as never, scope);
          tiles.push({
            title: t.title,
            size: t.size,
            emphasis: t.emphasis,
            blocks: r ? (Array.isArray(r) ? r : [r]) : [],
          });
          return {
            type: "card",
            heading: t.title,
            count: head?.count,
            actions: head?.actions,
            blocks: r ? (Array.isArray(r) ? r : [r]) : [],
          };
        });
      const r = w.render!(data as never, scope);
      const blocks = r ? (Array.isArray(r) ? r : [r]) : [];
      tiles.push({ title: w.title, size: w.size, emphasis: w.emphasis, blocks });
      if (!w.title) return blocks;
      const head = w.head?.(data as never, scope);
      if (w.title.length > 90) problems.push(`${at}: title is ${w.title.length} characters`);
      return [{ type: "card", heading: w.title, count: head?.count, actions: head?.actions, blocks }];
    } catch (e) {
      problems.push(`${at}: render threw ${(e as Error).message}`);
      return [];
    }
  };
  // The board this user gets: each tile's size and rows, in order.
  const items: { size: TileSize; rows: number; span?: number }[] = [];
  const rowsOf = (w: Widget) => w.rows ?? defaultRows(w.skeleton, w.size ?? "s");
  const top = async (w: Widget, fallback?: TileSize): Promise<ViewBlock[]> => {
    if (w.visible && !w.visible(scope)) return [];
    if (w.grid) return (await Promise.all(w.grid.map((x) => top(x, fallback)))).flat();
    if (w.split)
      return [
        ...(await Promise.all(w.split.main.map((x) => top(x, "l")))).flat(),
        ...(await Promise.all(w.split.side.map((x) => top(x, "s")))).flat(),
      ];
    const sized = { ...w, size: w.size ?? fallback ?? "s" } as Widget;
    const b = await one(sized);
    if (gone.has(sized)) return b;
    const n = w.each ? b.length : 1;
    for (let i = 0; i < n; i++) items.push({ size: sized.size!, rows: rowsOf(sized), span: sized.width });
    return b;
  };
  const blocks: ViewBlock[] = [];
  for (const w of page.widgets) blocks.push(...(await top(w)));
  return { blocks, problems, tiles };
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
 * Where a link fails to lead: a collection, global, edit tab or view the config doesn't have, a
 * collection, document or global no view holds (nothing has a page of its own:
 * src/app/widgets/places.ts), or a document that doesn't exist (404; one this user may not open
 * still exists). `undefined` when it leads somewhere.
 */
async function brokenLink(ctx: Ctx, href: string, known: Map<string, boolean>) {
  const config = ctx.config;
  const t = linkTarget(href);
  if (t.kind === "outside") return undefined;

  // Nothing has a page of its own: a collection, document or global leads somewhere only where a view holds it.
  const unplaced = () =>
    placeOf(href, placesOf(config.admin?.components?.views ?? {}))
      ? undefined
      : t.kind === "global"
        ? `no view holds the global "${t.slug}"`
        : t.kind === "list"
          ? `no view holds the ${t.collection} list`
          : `no view holds ${t.kind === "doc" || t.kind === "create" ? t.collection : ""} documents`;
  if (t.kind === "global")
    return (config.globals ?? []).some((g) => g.slug === t.slug) ? unplaced() : `no global "${t.slug}"`;
  if (t.kind === "view") {
    const views = Object.values(config.admin?.components?.views ?? {}).map((v) => (v as { path?: string }).path);
    return views.includes(t.path) ? undefined : `no view at "${t.path}"`;
  }
  const c = config.collections.find((x) => x.slug === t.collection);
  if (!c) return `no collection "${t.collection}"`;
  if (t.kind !== "doc") return unplaced();
  if (t.tab) {
    const edit = (c.admin?.components as { views?: { edit?: Record<string, { path?: string }> } } | undefined)?.views
      ?.edit;
    if (!Object.values(edit ?? {}).some((v) => v?.path === `/${t.tab}`)) return `no "${t.tab}" tab on ${t.collection}`;
  }
  const key = `${t.collection}/${t.id}`;
  if (!known.has(key)) {
    const r = await ctx.backend.call("GET", `${ctx.api}/${t.collection}/${encodeURIComponent(t.id)}?depth=0`);
    known.set(key, r.status !== 404);
  }
  return known.get(key) ? unplaced() : `no ${t.collection} document "${t.id}"`;
}

export interface ScreenCheckOptions {
  /** The project's config: its screens are read from its component slots. */
  config: MockConfig;
  /** Where the data comes from. */
  backend: ScreenBackend;
  /** Who to draw the screens as (emails in the auth collection), all with `password`. */
  users: string[];
  password: string;
  /** The auth collection (default `users`). */
  collection?: string;
  /** The REST API's route (default `/api`). */
  apiRoute?: string;
  /** Only these screens (by name), e.g. while fixing one. */
  only?: string[];
}

/** Every screen drawn as every user: who, which screen, its blocks, and what went wrong drawing it. */
async function* drawn(options: ScreenCheckOptions) {
  const { config, backend } = options;
  const collection = options.collection ?? "users";
  const ctx: Ctx = { backend, config, api: options.apiRoute ?? "/api" };
  const screens = screensOf(config).filter((s) => !options.only || options.only.includes(s.name));
  for (const email of options.users) {
    const login = await backend.login(email, options.password, collection);
    if (login.status !== 200) {
      yield {
        who: email,
        screen: undefined,
        blocks: [] as ViewBlock[],
        problems: [`${email}: can't sign in (${login.status})`],
        ctx,
      };
      continue;
    }
    const me = (await backend.call("GET", `${ctx.api}/${collection}/me`)).body.user;
    const who = email.split("@")[0]!;
    for (const screen of screens) {
      let doc: WidgetScope["doc"];
      if (screen.docOf) {
        const first = await backend.call("GET", `${ctx.api}/${screen.docOf}?limit=1&depth=0`);
        const id = first.status === 200 ? first.body.docs?.[0]?.id : undefined;
        if (id === undefined) continue;
        doc = { id: String(id), slug: screen.docOf };
      }
      const scope: WidgetScope = { user: me, doc, params: { ...screen.page.params } };
      const { blocks, problems, tiles } = await draw(ctx, screen.page, scope, screen.name);
      yield { who, screen, blocks, tiles, problems, ctx };
    }
  }
}

/**
 * Every screen as every user, checked with `designProblems` and for links that lead nowhere
 * (`links()` builds them; this checks the data they're built from): one line per problem,
 * "<user> · <screen> › <widget>: <what's wrong>". Empty when the screens follow the design.
 */
export async function screenDesignProblems(options: ScreenCheckOptions): Promise<string[]> {
  const out = new Set<string>();
  /** Documents looked up by links, by `<collection>/<id>`: whether they exist. */
  const known = new Map<string, boolean>();
  for await (const { who, screen, blocks, tiles, problems, ctx } of drawn(options)) {
    if (!screen) {
      problems.forEach((p) => out.add(p));
      continue;
    }
    const links: string[] = [];
    for (const href of hrefsIn(blocks)) {
      const broken = await brokenLink(ctx, href, known);
      if (broken) links.push(`${screen.name}: link ${href} leads nowhere (${broken})`);
    }
    // The same problem for several users is one line, named for the first.
    for (const p of [...problems, ...links, ...designProblems(blocks, screen.name, tiles)])
      if (![...out].some((x) => x.endsWith(` · ${p}`))) out.add(`${who} · ${p}`);
  }
  return [...out];
}
