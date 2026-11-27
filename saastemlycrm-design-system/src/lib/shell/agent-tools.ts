import type { Where } from "payload";
import { parse } from "qs-esm";
import { text } from "../payload/util.ts";
import type { Doc, FieldLike } from "../contracts/config.ts";
import type { AgentTool } from "../agent/webmcp.ts";
import { intl, m } from "../i18n/index.ts";
import type { Access, Address, Dashboard } from "../dashboard/context.ts";
import {
  collectionSettings,
  columnsOf,
  componentOf,
  dataFields,
  editTabs,
  fieldsOf,
  formFields,
  globalLabel,
  labels,
  titleOf,
  useAsTitle,
  type Route,
} from "../dashboard/project.ts";
import { viewWidgets } from "../widgets/places.ts";
import { leaves, loadSource } from "../widgets/load.ts";
import { fill } from "../widgets/widget.ts";
import type { ViewBlock } from "../widgets/schema.ts";
import { blocksText, headerText } from "../widgets/text.ts";
import { eachTiles, type Source, type WidgetPage, type WidgetScope } from "../widgets/widget.ts";
import { fold } from "./command-search.ts";
import { asideCounts } from "./aside-counts.ts";
import { loadBookmarks, startTour, toggleBookmark } from "./stores.ts";

export type { Access };

export type { Address };

export interface AgentHost {
  user(): (Doc & { collection: string }) | null;
  access(): Access | null;
  title(): string;
  address(): Address;
  navigation(): { label: string; items: { label: string; href?: string }[] }[];
  switchUser(id: string): Promise<boolean>;
  setPanel(panel: "nav" | "aside", open: boolean): Promise<void>;
  appearance(): Record<Appearance, { selected: string; choices: { id: string; label: string }[] }>;
  setAppearance(kind: Appearance, id: string): Promise<boolean>;
}

export type Appearance = "theme" | "scheme" | "background";

interface Ctx {
  d: Dashboard;
  host: AgentHost;
}

export function trim(value: unknown, depth = 0): unknown {
  if (typeof value === "string") return value.length > 600 ? `${value.slice(0, 600)}… (${value.length} chars)` : value;
  if (Array.isArray(value)) {
    const items = value.slice(0, 25).map((v) => trim(v, depth + 1));
    return value.length > 25 ? [...items, `… ${value.length - 25} more`] : items;
  }
  if (value && typeof value === "object") {
    if (depth > 8) return "…";
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, trim(v, depth + 1)]));
  }
  return value;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const object = (v: unknown) =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;
const limitOf = (v: unknown) => Math.max(1, Math.min(50, Number(v) || 10));

function requireCollection({ d }: Ctx, slug: unknown) {
  const c = d.project.collectionOf(str(slug));
  if (!c) throw new Error(`Unknown collection "${str(slug)}". Call describe_schema for the list.`);
  return c;
}

function describeField(f: FieldLike): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries({
      name: f.name,
      type: f.type,
      label: f.label ? text(f.label) : undefined,
      required: f.required || undefined,
      hasMany: f.hasMany || undefined,
      readOnly: f.admin?.readOnly || undefined,
      relationTo: f.relationTo,
      options: f.options?.map((o) => (typeof o === "string" ? o : o.value)),
      fields: f.fields ? dataFields(f.fields).map(describeField) : undefined,
      blocks: f.blocks?.map((b) => ({ slug: b.slug, fields: dataFields(b.fields).map(describeField) })),
    }).filter(([, v]) => v !== undefined),
  );
}

const scopeOf = (x: Ctx, user: Doc, page: WidgetPage, doc?: { id: string; slug: string }): WidgetScope => ({
  user: user as WidgetScope["user"],
  doc,
  params: { ...page.params, ...Object.fromEntries(new URLSearchParams(x.host.address().search)) },
});

async function widgetData(
  x: Ctx,
  component: unknown,
  doc?: { id: string; slug: string },
): Promise<Record<string, unknown> | undefined> {
  const c = componentOf(component);
  const user = x.host.user();
  if (c?.tag !== "app-widgets" || !user) return undefined;
  const page = c.props.page as WidgetPage;
  const scope = scopeOf(x, user, page, doc);
  const bySource = new Map<string, { titles: string[]; source: Source }>();
  for (const w of leaves(page.widgets, scope, x.d.project)) {
    if (!w.source) continue;
    const source = fill(w.source, scope);
    const key = JSON.stringify(source);
    const entry = bySource.get(key) ?? { titles: [], source };
    if (w.title) entry.titles.push(w.title);
    bySource.set(key, entry);
  }
  const parts = await Promise.all(
    [...bySource.values()].map(async ({ titles, source }) => ({
      shownIn: titles.length ? titles : undefined,
      data: trim(await loadSource(source, scope, x.d.data).catch((e: Error) => ({ error: e.message }))),
    })),
  );
  return { widgets: parts };
}

const asBlocks = (b: ViewBlock | ViewBlock[] | null | undefined): ViewBlock[] =>
  b ? (Array.isArray(b) ? b : [b]) : [];

async function pageText(x: Ctx, page: WidgetPage, doc?: { id: string; slug: string }): Promise<string[]> {
  const scope = scopeOf(x, x.host.user()!, page, doc);
  const cache = new Map<string, Promise<unknown>>();
  const load = (s: Source) => {
    const source = fill(s, scope);
    const key = JSON.stringify(source);
    if (!cache.has(key)) cache.set(key, loadSource(source, scope, x.d.data));
    return cache.get(key)!;
  };
  const out: string[] = [];
  const h = page.header;
  try {
    if (h && "render" in h) out.push(...headerText(h.render(h.source ? await load(h.source) : null, scope)));
    else out.push(...headerText(h));
  } catch {}
  const parts = await Promise.all(
    leaves(page.widgets, scope, x.d.project).map(async (w) => {
      try {
        if (w.header) {
          const hw = w.header;
          return "render" in hw
            ? headerText(hw.render(hw.source ? await load(hw.source) : null, scope))
            : headerText(hw);
        }
        const data = w.source ? await load(w.source) : null;
        if (w.empty?.when?.(data as never, scope))
          return [w.title ? `${w.title}: ${w.empty.heading}` : w.empty.heading];
        if (w.each)
          return eachTiles(w, data as never, scope).flatMap(({ widget: t }) => [
            `${t.title}:`,
            ...blocksText(asBlocks(t.render(null as never, scope))).slice(0, 8),
          ]);
        const lines = blocksText(asBlocks(w.render?.(data as never, scope)));
        const head = w.title ? w.head?.(data as never, scope) : undefined;
        const title = w.title
          ? `${[w.title, ...(head?.tags ?? []).map((t) => t.label)].join(" · ")}${head?.count == null ? "" : ` (${head.count})`}:`
          : "";
        return [title, ...lines.slice(0, 8)].filter(Boolean);
      } catch {
        return [];
      }
    }),
  );
  return [...out, ...parts.flat()];
}

function widgetText(x: Ctx, component: unknown, doc?: { id: string; slug: string }) {
  const c = componentOf(component);
  return c?.tag === "app-widgets" ? pageText(x, c.props.page as WidgetPage, doc) : Promise.resolve([]);
}

async function recordText(x: Ctx, slug: string, id: string, tab: string | undefined, budget: number) {
  const c = x.d.project.collectionOf(slug)!;
  const doc = { id, slug };
  const sections: { label?: string; lines: () => Promise<string[]> }[] = [];
  const before = collectionSettings(c).edit?.before;
  if (before?.length && !tab) sections.push({ lines: () => pageText(x, { widgets: before }, doc) });
  for (const t of editTabs(c))
    if (!tab || t.key === tab)
      sections.push({
        label: t.label,
        lines: () => widgetText(x, { path: t.Component, clientProps: t.props }, doc),
      });
  const out: string[] = [];
  for (const s of sections) {
    if (out.join("\n").length >= budget) break;
    const lines = await s.lines();
    if (lines.length) out.push(...(s.label && !tab ? [`[${s.label} tab]`] : []), ...lines);
  }
  return out;
}

function row(x: Ctx, slug: string, doc: Doc) {
  const c = x.d.project.collectionOf(slug)!;
  return {
    id: doc.id,
    title: titleOf(c, doc),
    ...Object.fromEntries(columnsOf(c).map((f) => [f.name!, x.d.project.cellText(f, doc[f.name!])])),
  };
}

const routeOf = (x: Ctx) => {
  const { pathname, search } = x.host.address();
  return pageOf(x, x.d.project.parseRoute(pathname, search));
};

async function screen(x: Ctx) {
  const { d, host } = x;
  const user = host.user();
  const { pathname, search } = host.address();
  const prefs = d.stores.preferences.get();
  return trim({
    url: pathname + search,
    title: host.title(),
    signedInAs: user
      ? {
          id: user.id,
          name: text(user.name ?? user.email),
          email: user.email,
          role: d.project.roleLabel(text(user.role)),
        }
      : null,
    content: await screenContent(x, routeOf(x)),
    layout: {
      navigationOpen: prefs.navOpen,
      sidePanelOpen: prefs.asideOpen,
      unreadNotifications: d.stores.notifications.get().unread,
      runningTour: d.stores.tour.get().active,
    },
  });
}

type Page =
  | Route
  | { name: "list"; slug: string }
  | { name: "create"; slug: string }
  | { name: "edit"; slug: string; id: string; tab?: string }
  | { name: "global"; slug: string; tab?: string };

function pageOf(x: Ctx, route: Route): Page {
  if (route.name !== "view") return route;
  const view = x.d.project.rootViews().find((v) => v.key === route.key)!;
  const shown = viewWidgets(view);
  if (shown.length !== 1) return route;
  const w = shown[0]!;
  const own = (key: string) => {
    const search = x.host.address().search;
    const q = (parse(search, { ignoreQueryPrefix: true, depth: 3 }) as Record<string, unknown>)[key];
    return q && typeof q === "object" ? (q as { tab?: string }) : {};
  };
  if (w.collection) return { name: "list", slug: w.collection.collection };
  if (w.document) {
    const d = w.document;
    const param = /^\$param\.(\w+)$/.exec(d.id)?.[1];
    const id = param ? (route.params[param] ?? "") : d.id;
    if (!id || id === "create") return { name: "create", slug: d.collection };
    return { name: "edit", slug: d.collection, id, tab: own(d.key ?? d.collection).tab ?? d.tab };
  }
  if (w.global) return { name: "global", slug: w.global.global, tab: own(w.global.key ?? w.global.global).tab };
  return route;
}

async function screenContent(x: Ctx, route: Page): Promise<Record<string, unknown>> {
  const { d, host } = x;
  const { project, data } = d;
  const safe = <T>(p: Promise<T>) => p.catch((e: Error) => ({ error: e.message }));
  switch (route.name) {
    case "dashboard":
      return {
        kind: "dashboard",
        description: "The home page: the signed-in user's day.",
        ...(await widgetData(x, project.dashboardView()?.Component)),
      };
    case "list": {
      const c = project.collectionOf(route.slug)!;
      const result = await safe(data.find(route.slug, { limit: 25, depth: 0 }));
      return {
        kind: "list",
        collection: route.slug,
        label: labels(c).plural,
        description: str(c.admin?.description),
        columns: columnsOf(c).map((f) => f.name),
        ...("docs" in result
          ? {
              totalDocs: result.totalDocs,
              rows: result.docs.map((doc) => row(x, route.slug, doc)),
              note: "First page, default order.",
            }
          : result),
      };
    }
    case "create": {
      const c = project.collectionOf(route.slug)!;
      return {
        kind: "create form",
        collection: route.slug,
        label: labels(c).singular,
        fields: dataFields(formFields(c)).map(describeField),
      };
    }
    case "edit": {
      const c = project.collectionOf(route.slug)!;
      const tabs = editTabs(c);
      const tab = tabs.find((t) => t.key === route.tab);
      return {
        kind: tab ? `record (${tab.label} tab)` : "record",
        collection: route.slug,
        id: route.id,
        tabs: [{ label: "Details", path: "" }, ...tabs.map((t) => ({ label: t.label, path: t.path }))],
        document: await safe(data.findByID(route.slug, route.id, { depth: 1 })),
        ...(tab
          ? {
              tabData: await widgetData(
                x,
                { path: tab.Component, clientProps: tab.props },
                { id: route.id, slug: route.slug },
              ),
            }
          : {}),
      };
    }
    case "view": {
      const view = project.rootViews().find((v) => v.key === route.key)!;
      return {
        kind: "screen",
        screen: route.key,
        title: view.meta?.title,
        description: view.meta?.description,
        ...(await widgetData(x, view.Component)),
      };
    }
    case "global": {
      const g = project.globalOf(route.slug)!;
      return {
        kind: "settings",
        global: route.slug,
        label: globalLabel(g),
        data: await safe(data.findGlobal(route.slug)),
      };
    }
    case "account":
      return { kind: "account", user: host.user() };
    case "login":
    case "create-first-user":
      return { kind: route.name, description: "Signed out. A demo user can be signed in with switch_user." };
    default:
      return { kind: "not found" };
  }
}

const workflowEndpoints = ({ d }: Ctx) =>
  (d.project.config.endpoints ?? []).flatMap((e) =>
    e && typeof e === "object" && "path" in e ? [{ method: e.method, path: e.path }] : [],
  );

function matchEndpoint(x: Ctx, method: string, path: string) {
  return workflowEndpoints(x).find((e) => {
    if (e.method !== method) return false;
    const pattern = new RegExp(`^${e.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/:\w+/g, "[^/]+")}$`);
    return pattern.test(path);
  });
}

const words = (s: string) =>
  fold(s)
    .text.replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const singular = (w: string) => w.replace(/ies$/, "y").replace(/(?<!s)s$/, "");
const same = (a: string, b: string) =>
  a === b || a.split(" ").map(singular).join(" ") === b.split(" ").map(singular).join(" ");

const FILLER = new Set([
  ..."go to open show me take the a an my page screen view please navigate visit bring up list of all".split(" "),
  ...words("افتح اذهب إلى انتقل خذني اعرض لي صفحة شاشة من فضلك قائمة كل").split(" "),
]);
const request = (s: string) =>
  words(s)
    .split(" ")
    .filter((w) => !FILLER.has(w))
    .join(" ") || words(s);

export function nameScore(query: string, name: string) {
  const q = request(query);
  const n = words(name);
  if (!q || !n) return 0;
  if (same(q, n)) return 100;
  if (n.length > 2 && (n.startsWith(q) || q.startsWith(n) || n.includes(q))) return 75;
  const qw = new Set(q.split(" ").map(singular));
  const nw = n.split(" ").map(singular);
  const common = nw.filter((w) => qw.has(w)).length;
  return common ? Math.round((60 * common) / Math.max(qw.size, nw.length)) : 0;
}

interface PageEntry {
  label: string;
  path: string;
  names: string[];
  screen?: boolean;
}

function pageIndex({ d, host }: Ctx): PageEntry[] {
  const { project } = d;
  const { dashboardPath, config } = project;
  const pages: PageEntry[] = [
    {
      label: m.app_nav_dashboard(),
      path: dashboardPath(),
      names: ["home", "dashboard", "index", "start", "my day", "main page", m.app_nav_dashboard(), m.app_nav_home()],
    },
    {
      label: m.app_title_account(),
      path: dashboardPath("account"),
      names: ["account", "my account", "profile", "me", m.app_title_account()],
    },
  ];
  for (const g of host.navigation())
    for (const i of g.items)
      if (i.href && i.href !== dashboardPath())
        pages.push({ label: i.label, path: i.href, names: [i.label, `${g.label} ${i.label}`] });
  for (const v of project.rootViews())
    if (!v.path.includes(":"))
      pages.push({
        label: str(v.meta?.title) || v.key,
        path: dashboardPath(...v.path.slice(1).split("/")),
        names: [v.key, v.path, str(v.meta?.title), project.navOf(v)?.label ?? ""],
        screen: true,
      });
  const access = host.access()!;
  for (const c of config.collections)
    if (access.collections[c.slug]?.read.permission && project.addressOf(`/collections/${c.slug}`))
      pages.push({
        label: labels(c).plural,
        path: dashboardPath("collections", c.slug),
        names: [c.slug, labels(c).plural, labels(c).singular],
      });
  for (const g of config.globals ?? [])
    if (access.globals[g.slug]?.read.permission && project.addressOf(`/globals/${g.slug}`))
      pages.push({ label: globalLabel(g), path: dashboardPath("globals", g.slug), names: [g.slug, globalLabel(g)] });
  return pages;
}

async function findRecordPage(x: Ctx, query: string): Promise<string | null> {
  const token = query.match(/[A-Za-z0-9]+(?:[-/][A-Za-z0-9]+)*\d[A-Za-z0-9-/]*/)?.[0];
  if (!token) return null;
  const { project, data } = x.d;
  const access = x.host.access()!;
  const searchable = project.config.collections.filter(
    (c) => useAsTitle(c) !== "id" && access.collections[c.slug]?.read.permission,
  );
  const hits = await Promise.all(
    searchable.map(async (c) => {
      const r = await data
        .find(c.slug, { where: { [useAsTitle(c)]: { like: token } }, limit: 1, depth: 0 })
        .catch(() => ({ docs: [] as Doc[] }));
      return r.docs[0] ? { c, doc: r.docs[0] } : null;
    }),
  );
  const hit = hits.find(Boolean);
  if (!hit) return null;
  const rest = query.replace(token, "");
  const tab = editTabs(hit.c)
    .map((t) => ({ t, score: Math.max(nameScore(rest, t.label), nameScore(rest, t.path)) }))
    .sort((a, b) => b.score - a.score)[0];
  const base = project.dashboardPath("collections", hit.c.slug, hit.doc.id);
  return tab && tab.score >= 50 ? `${base}${tab.t.path}` : base;
}

async function resolvePage(x: Ctx, query: string): Promise<string> {
  const { project } = x.d;
  const q = query.trim() || "/";
  if (q.startsWith("/")) {
    const to = project.withBase(q);
    const [path, search] = to.split("?");
    const r = project.parseRoute(path!, search == null ? "" : `?${search}`);
    if (r.name !== "not-found" && !(r.name === "address" && !r.to)) return to;
  }
  if (/\d/.test(q)) {
    const record = await findRecordPage(x, q);
    if (record) return record;
  }
  const ranked = pageIndex(x)
    .map((p) => ({ p, score: Math.max(...p.names.map((n) => nameScore(q, n))) }))
    .sort((a, b) => b.score - a.score || Number(!!b.p.screen) - Number(!!a.p.screen));
  if (ranked[0]!.score >= 50) return ranked[0]!.p.path;
  const closest = [...new Set(ranked.filter((r) => r.score > 0).map((r) => `${r.p.label} (${r.p.path})`))].slice(0, 5);
  throw new Error(
    `No page matches "${query}".${closest.length ? ` Closest: ${closest.join(", ")}.` : ""} Call list_pages for all of them.`,
  );
}

const READ = { readOnlyHint: true } as const;
const ACT = { consequentialHint: true } as const;
const schema = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: "object",
  properties,
  required,
  additionalProperties: false,
});
const whereSchema = {
  type: "object",
  description:
    'Payload "where" query, e.g. {"status":{"equals":"Open"}} or {"and":[{"owner":{"equals":"u1"}},{"value":{"greater_than":5000}}]}. Operators: equals, not_equals, in, not_in, like, contains, greater_than, less_than, exists…',
};

const frame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));

export function dashboardTools(d: Dashboard, host: AgentHost): AgentTool[] {
  const x: Ctx = { d, host };
  const { project, data, stores } = d;
  const user = host.user();
  const can = (slug: string, op: "read" | "create" | "update" | "delete") =>
    host.access()?.collections[slug]?.[op].permission === true;

  const always: AgentTool[] = [
    {
      name: "get_screen",
      title: m.agent_tool_get_screen(),
      description:
        "What the user is looking at right now, as data: the page (URL, title, kind), who is signed in and their role, and the content the screen is drawn from (the list's rows, the record and its tab, the screen's data, the settings…), plus whether the side columns are open. Start here.",
      inputSchema: schema({}),
      annotations: { ...READ, untrustedContentHint: true },
      execute: () => screen(x),
    },
    {
      name: "list_demo_users",
      title: m.agent_tool_list_demo_users(),
      description: "The demo's people, one per role, that switch_user can sign in as.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () =>
        project.roleLogins.map((u) => ({
          id: u.id,
          name: u.name ?? u.email,
          role: project.roleLabel(u.role),
          current: u.email === host.user()?.email,
        })),
    },
    {
      name: "switch_user",
      title: m.agent_tool_switch_user(),
      description:
        "Sign in as another demo user (an id from list_demo_users), to see the platform as that role sees it. Every screen, list and tool then shows what that person may see and do.",
      inputSchema: schema({ id: { type: "string", description: "Demo user id, from list_demo_users" } }, ["id"]),
      annotations: ACT,
      execute: async ({ id }) => {
        if (!(await host.switchUser(str(id)))) throw new Error(`No demo user "${str(id)}" (see list_demo_users).`);
        return screen(x);
      },
    },
  ];
  if (!user) return always;

  return [
    ...always,
    ...simpleTools(x, user),
    {
      name: "list_pages",
      title: m.agent_tool_list_pages(),
      description:
        "Every page the user can open, grouped as in the navigation (paths for navigate), plus the tabs of records that have them (e.g. a record's Overview, History…).",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => ({
        home: "/",
        groups: host.navigation().map((g) => ({
          group: g.label,
          pages: g.items.map((i) => ({ label: i.label, path: i.href })),
        })),
        screens: project
          .rootViews()
          .map((v) => ({ path: v.path, title: v.meta?.title, description: v.meta?.description })),
        recordTabs: project.config.collections
          .filter((c) => editTabs(c).length)
          .map((c) => ({
            collection: c.slug,
            path: `/collections/${c.slug}/{id}/{tab}`,
            tabs: editTabs(c).map((t) => ({ tab: t.path.slice(1), label: t.label })),
          })),
        account: "/account",
      }),
    },
    {
      name: "navigate",
      title: m.agent_tool_navigate(),
      description:
        'Open a page in the app, as clicking a link would. Give a path (e.g. /collections/invoices) or simply what the person called it: a page or screen name ("home", "invoices", "approvals"), or a record and optionally its tab ("ORD-0136", "ORD-0142 history"). Returns the new screen (as get_screen).',
      inputSchema: schema({ path: { type: "string", description: "A path, or the page / record the person named" } }, [
        "path",
      ]),
      execute: async ({ path }) => {
        d.navigate(await resolvePage(x, str(path)));
        await frame();
        return screen(x);
      },
    },
    {
      name: "set_layout",
      title: m.agent_tool_set_layout(),
      description:
        "Open or close the navigation column (nav) or the side panel (aside: notifications, bookmarks, widgets, tours).",
      inputSchema: schema({ panel: { type: "string", enum: ["nav", "aside"] }, open: { type: "boolean" } }, [
        "panel",
        "open",
      ]),
      execute: async ({ panel, open }) => {
        await host.setPanel(panel === "aside" ? "aside" : "nav", open === true);
        const prefs = stores.preferences.get();
        return { navigationOpen: prefs.navOpen, sidePanelOpen: prefs.asideOpen };
      },
    },
    {
      name: "get_appearance",
      title: m.agent_tool_get_appearance(),
      description: "The theme (system, dark, light), colour scheme and background image, each with its choices.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => host.appearance(),
    },
    {
      name: "set_appearance",
      title: m.agent_tool_set_appearance(),
      description: "Change the theme, colour scheme or background image (an id from get_appearance's choices).",
      inputSchema: schema(
        { kind: { type: "string", enum: ["theme", "scheme", "background"] }, id: { type: "string" } },
        ["kind", "id"],
      ),
      execute: async ({ kind, id }) => {
        const k = (["theme", "scheme", "background"] as const).find((x) => x === kind);
        if (!k || !(await host.setAppearance(k, str(id))))
          throw new Error(`"${str(id)}" isn't a ${str(kind)} choice (see get_appearance).`);
        return host.appearance()[k];
      },
    },
    {
      name: "check_accessibility",
      title: m.agent_tool_check_accessibility(),
      description:
        "Check every text on screen against WCAG AA contrast (4.5:1, large text 3:1), including text over the background image. Returns the failures, worst first.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => {
        const audit = document.querySelector("ui-contrast-audit");
        if (!audit) throw new Error("The contrast checker isn't on this page.");
        const issues = audit.measure();
        return {
          passes: issues.length === 0,
          failures: issues.slice(0, 30).map((i) => ({
            text: i.text,
            ratio: Number(i.ratio.toFixed(2)),
            required: i.required,
            color: i.color,
            background: i.background,
            overBackgroundImage: i.overImage,
          })),
        };
      },
    },
    {
      name: "describe_schema",
      title: m.agent_tool_describe_schema(),
      description:
        "The platform's data model: every collection (records) and global (settings) the user can read — slug, labels, group, description, fields (types, options, relations) — and what the user may do with each (create, update, delete). Pass `collection` for one in full.",
      inputSchema: schema({ collection: { type: "string", description: "Optional: one collection slug, in full" } }),
      annotations: READ,
      execute: async ({ collection }) => {
        if (collection) {
          const c = requireCollection(x, collection);
          return {
            slug: c.slug,
            ...labels(c),
            description: str(c.admin?.description),
            titleField: useAsTitle(c),
            fields: dataFields(formFields(c)).map(describeField),
            tabs: editTabs(c).map((t) => t.label),
            permissions: host.access()?.collections[c.slug],
          };
        }
        return {
          collections: project.config.collections
            .filter((c) => can(c.slug, "read"))
            .map((c) => ({
              slug: c.slug,
              label: labels(c).plural,
              group: typeof c.admin?.group === "string" ? c.admin.group : undefined,
              description: str(c.admin?.description) || undefined,
              fields: dataFields(formFields(c)).map((f) => f.name),
              canCreate: can(c.slug, "create"),
              canUpdate: can(c.slug, "update"),
              canDelete: can(c.slug, "delete"),
            })),
          globals: (project.config.globals ?? [])
            .filter((g) => host.access()?.globals[g.slug]?.read.permission)
            .map((g) => ({
              slug: g.slug,
              label: globalLabel(g),
              fields: dataFields(fieldsOf(g)).map((f) => f.name),
              canUpdate: host.access()?.globals[g.slug]?.update.permission === true,
            })),
        };
      },
    },
    {
      name: "find_documents",
      title: m.agent_tool_find_documents(),
      description:
        "Query a collection (Payload REST, as the signed-in user): filter with `where`, `sort` by a field (prefix - for descending), page through. Returns the records (depth 0: relations as ids) and the total.",
      inputSchema: schema(
        {
          collection: { type: "string" },
          where: whereSchema,
          sort: { type: "string", description: "e.g. -updatedAt" },
          limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
          page: { type: "integer", minimum: 1, default: 1 },
        },
        ["collection"],
      ),
      annotations: { ...READ, untrustedContentHint: true },
      execute: async ({ collection, where, sort, limit, page }) => {
        const c = requireCollection(x, collection);
        const r = await data.find(c.slug, {
          where: object(where) as Where | undefined,
          sort: str(sort) || undefined,
          limit: limitOf(limit),
          page: Number(page) || 1,
          depth: 0,
        });
        return trim({ totalDocs: r.totalDocs, page: r.page, totalPages: r.totalPages, docs: r.docs });
      },
    },
    {
      name: "count_documents",
      title: m.agent_tool_count_documents(),
      description: "How many records of a collection match `where` (all of them without it).",
      inputSchema: schema({ collection: { type: "string" }, where: whereSchema }, ["collection"]),
      annotations: READ,
      execute: async ({ collection, where }) =>
        data.count(requireCollection(x, collection).slug, object(where) as Where | undefined),
    },
    {
      name: "get_document",
      title: m.agent_tool_get_document(),
      description: "One record in full, with its relations one level deep, and the path that opens it.",
      inputSchema: schema({ collection: { type: "string" }, id: { type: "string" } }, ["collection", "id"]),
      annotations: { ...READ, untrustedContentHint: true },
      execute: async ({ collection, id }) => {
        const c = requireCollection(x, collection);
        const doc = await data.findByID(c.slug, str(id), { depth: 1 });
        return trim({ path: `/collections/${c.slug}/${encodeURIComponent(str(id))}`, document: doc });
      },
    },
    {
      name: "create_document",
      title: m.agent_tool_create_document(),
      description:
        "Create a record (fields as in describe_schema). Validation, hooks and access rules apply as in the app.",
      inputSchema: schema({ collection: { type: "string" }, data: { type: "object" } }, ["collection", "data"]),
      annotations: ACT,
      execute: async ({ collection, data: body }) =>
        data.create(requireCollection(x, collection).slug, object(body) ?? {}),
    },
    {
      name: "update_document",
      title: m.agent_tool_update_document(),
      description: "Change some fields of a record (only the fields given). Validation, hooks and access rules apply.",
      inputSchema: schema({ collection: { type: "string" }, id: { type: "string" }, data: { type: "object" } }, [
        "collection",
        "id",
        "data",
      ]),
      annotations: ACT,
      execute: async ({ collection, id, data: body }) =>
        data.update(requireCollection(x, collection).slug, str(id), object(body) ?? {}),
    },
    {
      name: "delete_document",
      title: m.agent_tool_delete_document(),
      description: "Delete a record. This can't be undone.",
      inputSchema: schema({ collection: { type: "string" }, id: { type: "string" } }, ["collection", "id"]),
      annotations: ACT,
      execute: async ({ collection, id }) => data.delete(requireCollection(x, collection).slug, str(id)),
    },
    {
      name: "get_settings",
      title: m.agent_tool_get_settings(),
      description: "A global (settings document, e.g. a pricing policy): slugs from describe_schema.",
      inputSchema: schema({ global: { type: "string" } }, ["global"]),
      annotations: READ,
      execute: async ({ global }) => {
        if (!project.globalOf(str(global))) throw new Error(`Unknown global "${str(global)}".`);
        return trim(await data.findGlobal(str(global)));
      },
    },
    {
      name: "update_settings",
      title: m.agent_tool_update_settings(),
      description: "Change some fields of a global (settings document).",
      inputSchema: schema({ global: { type: "string" }, data: { type: "object" } }, ["global", "data"]),
      annotations: ACT,
      execute: async ({ global, data: body }) => {
        if (!project.globalOf(str(global))) throw new Error(`Unknown global "${str(global)}".`);
        return data.updateGlobal(str(global), object(body) ?? {});
      },
    },
    {
      name: "list_workflows",
      title: m.agent_tool_list_workflows(),
      description:
        "The platform's workflow endpoints behind its screens (what each screen's buttons do), as METHOD and path with :params. GETs read a screen's data; POSTs perform its actions. Use with call_workflow.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => workflowEndpoints(x),
    },
    {
      name: "call_workflow",
      title: m.agent_tool_call_workflow(),
      description:
        "Call a workflow endpoint from list_workflows (fill the :params). GET reads data; POST performs the action the matching button would (sending, approving, creating orders…), with the same access rules. When a reply has `undo` ({ path, body }), that is the POST that takes the action back while it still can be (what the screen's Undo sends); a reply without one can't be undone.",
      inputSchema: schema(
        {
          method: { type: "string", enum: ["get", "post"] },
          path: { type: "string", description: "e.g. /orders/ord-0142/approve" },
          body: { type: "object", description: "POST body" },
        },
        ["method", "path"],
      ),
      annotations: { ...ACT, untrustedContentHint: true },
      execute: async ({ method, path, body }) => {
        const verb = method === "post" ? "post" : "get";
        const p = str(path);
        if (!matchEndpoint(x, verb, p)) throw new Error(`No ${verb.toUpperCase()} ${p} workflow (see list_workflows).`);
        return trim(verb === "get" ? await data.get(p) : await data.post(p, object(body) ?? {}));
      },
    },
    {
      name: "ask_assistant",
      title: m.agent_tool_ask_assistant(),
      description:
        "Ask the platform's own assistant a question about the business (a record's status, what's waiting for approval, who owes money, deadlines). It answers from the live records, as the signed-in user may see them, and cites them.",
      inputSchema: schema({ question: { type: "string" } }, ["question"]),
      annotations: READ,
      execute: async ({ question }) => data.post<Answer>(d.site.assistant.ask, { question: str(question) }),
    },
    {
      name: "get_my_work",
      title: m.agent_tool_get_my_work(),
      description:
        "The side panel's counters for the signed-in user's role (what they steer by, e.g. decisions waiting for them, invoices to collect) with counts, and their unread notifications.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => {
        const widgets = await Promise.all(
          asideCounts(d, user)
            .filter((w) => can(w.collection, "read"))
            .map(async (w) => ({
              label: w.label,
              count: (await data.count(w.collection, w.where as Where).catch(() => ({ totalDocs: 0 }))).totalDocs,
              needsAttention: w.tone === "warning" || undefined,
              collection: w.collection,
              where: w.where,
            })),
        );
        const unread = can("notifications", "read")
          ? (await data.find("notifications", { where: { read: { equals: false } }, sort: "-at", limit: 20, depth: 0 }))
              .docs
          : [];
        return trim({ widgets, unreadNotifications: unread });
      },
    },
    {
      name: "mark_notification_read",
      title: m.agent_tool_mark_notification_read(),
      description: "Mark one of the user's notifications (id from get_my_work) as read.",
      inputSchema: schema({ id: { type: "string" } }, ["id"]),
      execute: async ({ id }) => data.update("notifications", str(id), { read: true }),
    },
    {
      name: "get_bookmarks",
      title: m.agent_tool_get_bookmarks(),
      description: "The user's bookmarked pages.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => {
        await loadBookmarks(d);
        return stores.bookmarks.get().items;
      },
    },
    {
      name: "toggle_bookmark",
      title: m.agent_tool_toggle_bookmark(),
      description: "Add a page to the user's bookmarks, or remove it if it's there (default: the current page).",
      inputSchema: schema({ path: { type: "string" }, label: { type: "string" } }),
      execute: async ({ path, label }) => {
        await toggleBookmark(d, {
          href: project.withBase(str(path) || host.address().pathname),
          label: str(label) || host.title(),
        });
        return stores.bookmarks.get().items;
      },
    },
    {
      name: "list_tours",
      title: m.agent_tool_list_tours(),
      description: "The guided tours of the platform (some switch between users to show how roles work together).",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () =>
        (await d.site.tours()).map((t) => ({
          id: t.id,
          title: t.title,
          summary: t.summary,
          steps: t.steps.length,
          cast: [...new Set(t.steps.map((s) => s.as).filter((a): a is string => !!a))],
          done: stores.tour.get().completed.includes(t.id),
        })),
    },
    {
      name: "start_tour",
      title: m.agent_tool_start_tour(),
      description:
        "Start a guided tour for the user (an id from list_tours). It walks them through the screens with coachmarks.",
      inputSchema: schema({ id: { type: "string" } }, ["id"]),
      execute: async ({ id }) => {
        const t = (await d.site.tours()).find((a) => a.id === str(id));
        if (!t) throw new Error(`No tour "${str(id)}" (see list_tours).`);
        startTour(d, t.id);
        return { started: t.title, steps: t.steps.map((s) => s.title) };
      },
    },
  ];
}

const clip = (s: string, max = 1500) => (s.length > max ? `${s.slice(0, max)}…` : s);
const line = (...parts: unknown[]) =>
  parts
    .filter((p) => p != null && p !== "")
    .map(String)
    .join(" · ");

async function screenText(x: Ctx, user: Doc): Promise<string> {
  const { d, host } = x;
  const route = routeOf(x);
  const out: string[] = [
    m.agent_screen_page({ title: host.title(), path: host.address().pathname }),
    m.agent_screen_signed_in({ name: text(user.name ?? user.email), role: d.project.roleLabel(text(user.role)) }),
  ];
  const c = await screenContent(x, route);
  if (c.description) out.push(m.agent_screen_about({ description: str(c.description) }));
  if (route.name === "dashboard") out.push(await myDayText(x));
  else if (route.name === "list") {
    const rows = (c.rows as Record<string, unknown>[] | undefined) ?? [];
    out.push(
      m.agent_screen_list({
        label: str(c.label),
        count: typeof c.totalDocs === "number" ? c.totalDocs : rows.length,
      }),
    );
    for (const r of rows.slice(0, 8)) out.push(`- ${line(...Object.values(r).slice(1, 6))}`);
  } else if (route.name === "edit") {
    const doc = c.document as Record<string, unknown>;
    const col = d.project.collectionOf(route.slug)!;
    out.push(m.agent_screen_record({ singular: labels(col).singular.toLowerCase(), title: titleOf(col, doc as Doc) }));
    for (const f of columnsOf(col).slice(0, 8))
      out.push(`- ${text(f.label ?? f.name)}: ${d.project.cellText(f, doc[f.name!])}`);
    out.push(...(await recordText(x, route.slug, route.id, route.tab, 700)));
    out.push(
      m.agent_screen_tabs({
        tabs: intl.list({ type: "unit" }).format((c.tabs as { label: string }[]).map((t) => t.label)),
      }),
    );
  } else if (route.name === "view") out.push(m.agent_screen_view({ title: str(c.title) }));
  else if (route.name === "global") out.push(m.agent_screen_settings({ label: str(c.label) }));
  return clip(out.join("\n"));
}

async function myDayText(x: Ctx): Promise<string> {
  const { project } = x.d;
  let lines = await widgetText(x, project.dashboardView()?.Component);
  if (!lines.length) lines = await pageText(x, { widgets: project.settings.aside ?? [] });
  return clip(lines.join("\n") || m.agent_my_day_empty());
}

function mainCollection({ d, host }: Ctx) {
  const readable = (slug: string) => host.access()?.collections[slug]?.read.permission === true;
  const named = d.site.assistant.mainRecord;
  if (named && d.project.collectionOf(named) && readable(named)) return named;
  return d.project.config.collections.find((c) => editTabs(c).length && readable(c.slug))?.slug;
}

async function recordStatusText(x: Ctx, query: string): Promise<string> {
  const main = mainCollection(x);
  const hit = (main ? (await findRecords(x, query, 1, [main]))[0] : undefined) ?? (await findRecords(x, query, 1))[0];
  if (!hit) throw new Error(`No record matches "${query}". Try find, or a record number.`);
  const { project, data } = x.d;
  const c = project.collectionOf(hit.slug)!;
  const doc = await data.findByID(hit.slug, hit.id, { depth: 1 });
  const title = useAsTitle(c);
  return clip(
    [
      `${titleOf(c, doc)} (${labels(c).singular.toLowerCase()})`,
      ...columnsOf(c)
        .filter((f) => f.name !== title)
        .map((f) => `- ${text(f.label ?? f.name)}: ${project.cellText(f, doc[f.name!])}`),
      ...(await recordText(x, hit.slug, hit.id, undefined, 1200)),
      m.agent_record_page({ path: hit.path }),
    ].join("\n"),
  );
}

async function findRecords(x: Ctx, query: string, limit = 6, only?: string[]) {
  const q = query.trim();
  if (!q) return [];
  const { project, data } = x.d;
  const access = x.host.access()!;
  const searchable = project.config.collections.filter(
    (c) =>
      (!only || only.includes(c.slug)) &&
      useAsTitle(c) !== "id" &&
      c.admin?.hidden !== true &&
      access.collections[c.slug]?.read.permission,
  );
  const fields = (c: (typeof searchable)[number]) =>
    [useAsTitle(c), ...(c.admin?.listSearchableFields ?? [])].filter((v, i, a) => a.indexOf(v) === i);
  const hits = await Promise.all(
    searchable.map(async (c) => {
      const where = { or: fields(c).map((f) => ({ [f]: { like: q } })) } as Where;
      const r = await data.find(c.slug, { where, limit: 3, depth: 0 }).catch(() => ({ docs: [] as Doc[] }));
      return r.docs.map((doc) => ({
        slug: c.slug,
        id: doc.id,
        title: titleOf(c, doc),
        kind: labels(c).singular,
        path: `/collections/${c.slug}/${encodeURIComponent(doc.id)}`,
      }));
    }),
  );
  return hits.flat().slice(0, limit);
}

interface Answer {
  answer: string;
  points: string[];
  sources: { label: string; href: string }[];
  refused?: boolean;
}

async function guideText({ d }: Ctx, topic: string, roleId: string) {
  const guide = await d.site.guide();
  const ranked = guide
    .map((g) => ({ g, score: Math.max(nameScore(topic, g.topic), nameScore(topic, g.keywords)) }))
    .sort((a, b) => b.score - a.score);
  const picked = ranked.slice(0, 2).filter((r) => r.score > 0);
  const role = d.site.assistant.roleNotes.find((r) => r.role === roleId)?.note;
  return clip(
    [
      ...(picked.length
        ? picked.map((r) => `${r.g.topic}: ${r.g.text}`)
        : [`Topics: ${guide.map((g) => g.topic).join("; ")}.`]),
      role ? `Your role — ${role}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  );
}

function simpleTools(x: Ctx, user: Doc): AgentTool[] {
  const { d, host } = x;
  return [
    {
      name: "what_is_on_screen",
      title: m.agent_tool_what_is_on_screen(),
      description:
        "What the person is looking at now, in a few lines: the page, who they are, and the main things on it.",
      inputSchema: schema({}),
      annotations: READ,
      simple: true,
      execute: () => screenText(x, user),
    },
    {
      name: "open_page",
      title: m.agent_tool_open_page(),
      description:
        'Open a page for the person. "page" is what they called it: "home", "invoices", "approvals", or a record number like "ORD-0142" (add a tab: "ORD-0142 history").',
      inputSchema: schema({ page: { type: "string", description: "The page or record the person named" } }, ["page"]),
      simple: true,
      execute: async ({ page }) => {
        d.navigate(await resolvePage(x, str(page)));
        await frame();
        return m.agent_opened({ title: host.title(), path: host.address().pathname });
      },
    },
    {
      name: "my_day",
      title: m.agent_tool_my_day(),
      description:
        "What's waiting for the signed-in person today, as their home page shows it: their key figures, their queue and their lists.",
      inputSchema: schema({}),
      annotations: READ,
      simple: true,
      execute: () => myDayText(x),
    },
    {
      name: "record_status",
      title: m.agent_tool_record_status(),
      description:
        'Where a record stands: its main fields and what its pages say (stage, owner, deadline, next action, what blocks it…). "record" is its number or a name the person used for it.',
      inputSchema: schema({ record: { type: "string", description: "A record number or name" } }, ["record"]),
      annotations: READ,
      simple: true,
      execute: async ({ record }) => recordStatusText(x, str(record)),
    },
    {
      name: "find",
      title: m.agent_tool_find(),
      description:
        "Find records by what the person typed: a record number or a name (a customer, a company, a person…). Returns the matches with the page each opens.",
      inputSchema: schema({ query: { type: "string" } }, ["query"]),
      annotations: { ...READ, untrustedContentHint: true },
      simple: true,
      execute: async ({ query }) => {
        const hits = await findRecords(x, str(query));
        return hits.length
          ? hits.map((h) => `- ${h.title} (${h.kind}) → ${h.path}`).join("\n")
          : m.agent_find_nothing({ query: str(query) });
      },
    },
    {
      name: "ask_records",
      title: m.agent_tool_ask_records(),
      description:
        "Business questions answered from the live records: what's waiting for approval, who owes us money, what's late, deadlines, totals and trends.",
      inputSchema: schema({ question: { type: "string" } }, ["question"]),
      annotations: READ,
      simple: true,
      execute: async ({ question }) => {
        const a = await d.data.post<Answer>(d.site.assistant.ask, { question: str(question) });
        return clip(
          [
            a.answer,
            ...a.points.map((p) => `- ${p}`),
            a.sources.length
              ? m.agent_sources({
                  sources: intl.list({ type: "unit" }).format(a.sources.map((s) => `${s.label} (${s.href})`)),
                })
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
        );
      },
    },
    {
      name: "platform_guide",
      title: m.agent_tool_platform_guide(),
      description:
        'How the platform works and where things are: "topic" like "approvals", "how to add a customer", "invoices".',
      inputSchema: schema({ topic: { type: "string" } }, ["topic"]),
      annotations: READ,
      simple: true,
      execute: async ({ topic }) => guideText(x, str(topic), text(user.role)),
    },
  ];
}
