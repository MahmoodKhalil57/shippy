import type { Where } from "payload";
import { api, withBase } from "../../cms/client.ts";
import type { Answer } from "../../cms/endpoints/assistant.ts";
import { text } from "../../cms/runtime/util.ts";
import type { Doc, FieldLike } from "../../cms/types.ts";
import type { AgentTool } from "../../agent/webmcp.ts";
import { bookmarks, notifications, preferences, startTour, tour } from "../../stores/index.ts";
import { roleWidgets } from "./aside.ts";
import { roleLabel, roleLogins } from "./demo-users.ts";
import { TOURS, tourCast } from "./tours.ts";
import {
  cellText,
  collectionOf,
  columnsOf,
  config,
  dashboardPath,
  dataFields,
  editTabs,
  fieldsOf,
  formFields,
  globalLabel,
  globalOf,
  labels,
  loadBookmarks,
  navigate,
  parseRoute,
  rootViews,
  titleOf,
  toggleBookmark,
  useAsTitle,
  type Route,
} from "./shared.ts";

/**
 * The dashboard's WebMCP tools (registered by `<dashboard-app>` through src/agent/webmcp.ts): an
 * agent's eyes and hands on the platform, built on what the UI itself is built on — the Payload
 * config (schema, navigation, custom views), the REST API (as the signed-in user, so access
 * control is the backend's, exactly as on screen), the custom endpoints behind each screen, and
 * the app's stores (side panel, tours, preferences). Nothing here reads the DOM: "what's on
 * screen" is the route plus the data the screen is drawn from.
 *
 * Read-only tools are marked `readOnlyHint`; anything that changes records, sends something or
 * changes who's signed in is `consequentialHint` (an agent should confirm with the user first).
 */

export type Access = Awaited<ReturnType<typeof api.access>>;

/** What the tools need from the running app (`<dashboard-app>` implements it). */
export interface AgentHost {
  user(): (Doc & { collection: string }) | null;
  access(): Access | null;
  /** The current page's title, as in the browser tab. */
  title(): string;
  /** The navigation as the user sees it (groups of pages, filtered by their access). */
  navigation(): { label: string; items: { label: string; href?: string }[] }[];
  /** Demo: sign in as another seeded user (by id). */
  switchUser(id: string): Promise<boolean>;
  /** Open or close a side column. */
  setPanel(panel: "nav" | "aside", open: boolean): Promise<void>;
  appearance(): Record<Appearance, { selected: string; choices: { id: string; label: string }[] }>;
  setAppearance(kind: Appearance, id: string): Promise<boolean>;
}

export type Appearance = "theme" | "scheme" | "background";

/* ---------------------------------------------------------------- helpers */

/** Keeps results agent-sized: long lists and texts are cut, with a note of what was cut. */
function trim(value: unknown, depth = 0): unknown {
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
const limitOf = (v: unknown, max = 50, fallback = 10) => Math.max(1, Math.min(max, Number(v) || fallback));

function requireCollection(slug: unknown) {
  const c = collectionOf(str(slug));
  if (!c) throw new Error(`Unknown collection "${str(slug)}". Call describe_schema for the list.`);
  return c;
}

/** A field as an agent needs it: name, type, label, constraints, options, relations, sub-fields. */
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

/** The backend endpoint each custom screen is drawn from (GET), by view key / edit-tab key. */
const VIEW_DATA: Record<string, string> = {
  inbox: "/inbox",
  history: "/inbox-history",
  approvals: "/commercial/approvals",
  cash: "/operations/cash",
  controlRoom: "/control-room",
  growth: "/growth",
  automations: "/automations",
  roles: "/roles",
  integrations: "/integrations/status",
  project: "/project",
};
const TAB_DATA: Record<string, (id: string) => string> = {
  overview: (id) => `/case-overview/${id}`,
  rfqs: (id) => `/sourcing/cases/${id}`,
  compare: (id) => `/commercial/cases/${id}/compare`,
  pricing: (id) => `/commercial/cases/${id}/pricing`,
  order: (id) => `/operations/case/${id}`,
  delivery: (id) => `/operations/case/${id}`,
  profit: (id) => `/case-profit/${id}`,
  preview: (id) => `/commercial/quotations/${id}`,
};

/** One list row as the table shows it: the list columns, formatted. */
function row(slug: string, doc: Doc) {
  const c = collectionOf(slug)!;
  return {
    id: doc.id,
    title: titleOf(c, doc),
    ...Object.fromEntries(columnsOf(c).map((f) => [f.name!, cellText(f, doc[f.name!])])),
  };
}

/** What the current screen shows, as data: the route, who's looking, and the data it's drawn from. */
async function screen(host: AgentHost) {
  const route = parseRoute(location.pathname);
  const user = host.user();
  return trim({
    url: location.pathname + location.search,
    title: host.title(),
    signedInAs: user
      ? { id: user.id, name: text(user.name ?? user.email), email: user.email, role: roleLabel(text(user.role)) }
      : null,
    content: await screenContent(route, host),
    layout: {
      navigationOpen: preferences.get().navOpen,
      sidePanelOpen: preferences.get().asideOpen,
      unreadNotifications: notifications.get().unread,
      runningTour: tour.get().active,
    },
  });
}

async function screenContent(route: Route, host: AgentHost): Promise<Record<string, unknown>> {
  const safe = <T>(p: Promise<T>) => p.catch((e: Error) => ({ error: e.message }));
  switch (route.name) {
    case "dashboard":
      return {
        kind: "dashboard",
        description: "The signed-in user's day: queue, KPIs and charts.",
        data: await safe(api.get("/home")),
      };
    case "list": {
      const c = collectionOf(route.slug)!;
      const result = await safe(api.find(route.slug, { limit: 25, depth: 0 }));
      return {
        kind: "list",
        collection: route.slug,
        label: labels(c).plural,
        description: str(c.admin?.description),
        columns: columnsOf(c).map((f) => f.name),
        ...("docs" in result
          ? {
              totalDocs: result.totalDocs,
              rows: result.docs.map((d) => row(route.slug, d)),
              note: "First page, default order.",
            }
          : result),
      };
    }
    case "create": {
      const c = collectionOf(route.slug)!;
      return {
        kind: "create form",
        collection: route.slug,
        label: labels(c).singular,
        fields: dataFields(formFields(c)).map(describeField),
      };
    }
    case "edit": {
      const c = collectionOf(route.slug)!;
      const tabs = editTabs(c);
      const tab = tabs.find((t) => t.key === route.tab);
      return {
        kind: tab ? `record (${tab.label} tab)` : "record",
        collection: route.slug,
        id: route.id,
        tabs: [{ label: "Details", path: "" }, ...tabs.map((t) => ({ label: t.label, path: t.path }))],
        document: await safe(api.findByID(route.slug, route.id, { depth: 1 })),
        ...(tab && TAB_DATA[tab.key]
          ? { tabData: await safe(api.get(TAB_DATA[tab.key]!(encodeURIComponent(route.id)))) }
          : {}),
      };
    }
    case "view": {
      const view = rootViews().find((v) => v.key === route.key);
      const endpoint = VIEW_DATA[route.key];
      return {
        kind: "screen",
        screen: route.key,
        title: view?.meta?.title,
        description: view?.meta?.description,
        ...(endpoint ? { data: await safe(api.get(endpoint)) } : {}),
      };
    }
    case "global": {
      const g = globalOf(route.slug)!;
      return {
        kind: "settings",
        global: route.slug,
        label: globalLabel(g),
        data: await safe(api.findGlobal(route.slug)),
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

/** The custom endpoints (the platform's workflows), as `METHOD /path` with `:params`. */
const workflowEndpoints = () =>
  (config.endpoints ?? []).flatMap((e) =>
    e && typeof e === "object" && "path" in e ? [{ method: e.method, path: e.path }] : [],
  );

function matchEndpoint(method: string, path: string) {
  return workflowEndpoints().find((e) => {
    if (e.method !== method) return false;
    const pattern = new RegExp(`^${e.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/:\w+/g, "[^/]+")}$`);
    return pattern.test(path);
  });
}

/* ---------------------------------------------------------------- finding a page by name */

/** Lower-case words only: "/Collections/Supplier-RFQs " → "collections supplier rfqs". */
const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const singular = (w: string) => w.replace(/ies$/, "y").replace(/(?<!s)s$/, "");
const same = (a: string, b: string) =>
  a === b || a.split(" ").map(singular).join(" ") === b.split(" ").map(singular).join(" ");

/** Words around a page's name in a request ("go to the invoices page"). */
const FILLER = new Set(
  "go to open show me take the a an my page screen view please navigate visit bring up list of all".split(" "),
);
const request = (s: string) =>
  words(s)
    .split(" ")
    .filter((w) => !FILLER.has(w))
    .join(" ") || words(s);

/** How well what someone said (`query`) names `name`: 100 exact … 0 unrelated. */
function nameScore(query: string, name: string) {
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
  /** A purpose-built screen: wins a tie with a raw list ("approvals" means the Approvals queue). */
  screen?: boolean;
}

/** Every page the user can open, under all the names people use for it. */
function pageIndex(host: AgentHost): PageEntry[] {
  const pages: PageEntry[] = [
    {
      label: "Dashboard",
      path: dashboardPath(),
      names: ["home", "dashboard", "index", "start", "my day", "main page"],
    },
    { label: "Account", path: dashboardPath("account"), names: ["account", "my account", "profile", "me"] },
  ];
  for (const g of host.navigation())
    for (const i of g.items)
      if (i.href && i.href !== dashboardPath())
        pages.push({ label: i.label, path: i.href, names: [i.label, `${g.label} ${i.label}`] });
  for (const v of rootViews())
    pages.push({
      label: str(v.meta?.title) || v.key,
      path: dashboardPath(v.path.slice(1)),
      names: [v.key, v.path, str(v.meta?.title), v.nav?.label ?? ""],
      screen: true,
    });
  for (const c of config.collections)
    if (host.access()?.collections[c.slug]?.read.permission)
      pages.push({
        label: labels(c).plural,
        path: dashboardPath("collections", c.slug),
        names: [c.slug, labels(c).plural, labels(c).singular],
      });
  for (const g of config.globals ?? [])
    if (host.access()?.globals[g.slug]?.read.permission)
      pages.push({ label: globalLabel(g), path: dashboardPath("globals", g.slug), names: [g.slug, globalLabel(g)] });
  return pages;
}

/** A record named by its number or title (e.g. "GS-RFQ-0136"), with a tab if one is named too. */
async function findRecordPage(query: string, host: AgentHost): Promise<string | null> {
  const token = query.match(/[A-Za-z0-9]+(?:[-/][A-Za-z0-9]+)*\d[A-Za-z0-9-/]*/)?.[0];
  if (!token) return null;
  const searchable = config.collections.filter(
    (c) => useAsTitle(c) !== "id" && host.access()?.collections[c.slug]?.read.permission,
  );
  const hits = await Promise.all(
    searchable.map(async (c) => {
      const r = await api
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
  const base = dashboardPath("collections", hit.c.slug, hit.doc.id);
  return tab && tab.score >= 50 ? `${base}${tab.t.path}` : base;
}

/**
 * Where to go for what someone asked: a path as is; else a record ("GS-RFQ-0136 pricing"); else
 * the page whose name fits best ("home", "invoices", "pricing policy"). No good fit: an error
 * naming the closest pages, so the agent can pick one.
 */
async function resolvePage(query: string, host: AgentHost): Promise<string> {
  const q = query.trim() || "/";
  if (q.startsWith("/")) {
    const to = withBase(q);
    if (parseRoute(to.split("?")[0]!).name !== "not-found") return to;
  }
  if (/\d/.test(q)) {
    const record = await findRecordPage(q, host);
    if (record) return record;
  }
  const ranked = pageIndex(host)
    .map((p) => ({ p, score: Math.max(...p.names.map((n) => nameScore(q, n))) }))
    .sort((a, b) => b.score - a.score || Number(!!b.p.screen) - Number(!!a.p.screen));
  if (ranked[0] && ranked[0].score >= 50) return ranked[0].p.path;
  const closest = [...new Set(ranked.filter((r) => r.score > 0).map((r) => `${r.p.label} (${r.p.path})`))].slice(0, 5);
  throw new Error(
    `No page matches "${query}".${closest.length ? ` Closest: ${closest.join(", ")}.` : ""} Call list_pages for all of them.`,
  );
}

/* ---------------------------------------------------------------- tools */

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
    'Payload "where" query, e.g. {"stage":{"equals":"Awaiting supplier"}} or {"and":[{"owner":{"equals":"kb"}},{"value":{"greater_than":5000}}]}. Operators: equals, not_equals, in, not_in, like, contains, greater_than, less_than, exists…',
};

/** All tools, for the signed-in user (`host`). Signed out: only what's needed to look and sign in. */
export function dashboardTools(host: AgentHost): AgentTool[] {
  const user = host.user();
  const can = (slug: string, op: "read" | "create" | "update" | "delete") =>
    host.access()?.collections[slug]?.[op].permission === true;

  const always: AgentTool[] = [
    {
      name: "get_screen",
      title: "What's on screen",
      description:
        "What the user is looking at right now, as data: the page (URL, title, kind), who is signed in and their role, and the content the screen is drawn from (the list's rows, the record and its tab, the screen's data, the settings…), plus whether the side columns are open. Start here.",
      inputSchema: schema({}),
      annotations: { ...READ, untrustedContentHint: true },
      execute: () => screen(host),
    },
    {
      name: "list_demo_users",
      title: "Demo users",
      description: "The demo's people, one per role, that switch_user can sign in as.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () =>
        roleLogins.map((u) => ({
          id: u.id,
          name: u.name ?? u.email,
          role: roleLabel(u.role),
          current: u.email === host.user()?.email,
        })),
    },
    {
      name: "switch_user",
      title: "Switch user (demo)",
      description:
        "Sign in as another demo user (an id from list_demo_users), to see the platform as that role sees it. Every screen, list and tool then shows what that person may see and do.",
      inputSchema: schema({ id: { type: "string", description: "Demo user id, e.g. kb" } }, ["id"]),
      annotations: ACT,
      execute: async ({ id }) => {
        if (!(await host.switchUser(str(id)))) throw new Error(`No demo user "${str(id)}" (see list_demo_users).`);
        return screen(host);
      },
    },
  ];
  if (!user) return always;

  return [
    ...always,
    {
      name: "list_pages",
      title: "Pages",
      description:
        "Every page the user can open, grouped as in the navigation (paths for navigate), plus the tabs of records that have them (e.g. a case's Overview, Supplier RFQs, Compare offers, Pricing…).",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => ({
        home: "/",
        groups: host.navigation().map((g) => ({
          group: g.label,
          pages: g.items.map((i) => ({ label: i.label, path: i.href })),
        })),
        screens: rootViews().map((v) => ({ path: v.path, title: v.meta?.title, description: v.meta?.description })),
        recordTabs: config.collections
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
      title: "Go to a page",
      description:
        'Open a page in the app, as clicking a link would. Give a path (e.g. /inbox, /collections/invoices) or simply what the person called it: a page or screen name ("home", "invoices", "approvals", "pricing policy"), or a record and optionally its tab ("GS-RFQ-0136", "GS-RFQ-0142 compare offers"). Returns the new screen (as get_screen).',
      inputSchema: schema({ path: { type: "string", description: "A path, or the page / record the person named" } }, [
        "path",
      ]),
      execute: async ({ path }) => {
        const to = await resolvePage(str(path), host);
        navigate(to);
        await new Promise((r) => setTimeout(r, 50));
        return screen(host);
      },
    },
    {
      name: "set_layout",
      title: "Open or close a side column",
      description:
        "Open or close the navigation column (nav) or the side panel (aside: notifications, bookmarks, widgets, tours).",
      inputSchema: schema({ panel: { type: "string", enum: ["nav", "aside"] }, open: { type: "boolean" } }, [
        "panel",
        "open",
      ]),
      execute: async ({ panel, open }) => {
        await host.setPanel(panel === "aside" ? "aside" : "nav", open === true);
        return { navigationOpen: preferences.get().navOpen, sidePanelOpen: preferences.get().asideOpen };
      },
    },
    {
      name: "get_appearance",
      title: "Appearance",
      description: "The theme (system, dark, light), colour scheme and background image, each with its choices.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => host.appearance(),
    },
    {
      name: "set_appearance",
      title: "Change appearance",
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
      title: "Check colour contrast",
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
      title: "Data model",
      description:
        "The platform's data model: every collection (records) and global (settings) the user can read — slug, labels, group, description, fields (types, options, relations) — and what the user may do with each (create, update, delete). Pass `collection` for one in full.",
      inputSchema: schema({ collection: { type: "string", description: "Optional: one collection slug, in full" } }),
      annotations: READ,
      execute: async ({ collection }) => {
        if (collection) {
          const c = requireCollection(collection);
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
          collections: config.collections
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
          globals: (config.globals ?? [])
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
      title: "Find records",
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
        const c = requireCollection(collection);
        const r = await api.find(c.slug, {
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
      title: "Count records",
      description: "How many records of a collection match `where` (all of them without it).",
      inputSchema: schema({ collection: { type: "string" }, where: whereSchema }, ["collection"]),
      annotations: READ,
      execute: async ({ collection, where }) =>
        api.count(requireCollection(collection).slug, object(where) as Where | undefined),
    },
    {
      name: "get_document",
      title: "Read a record",
      description: "One record in full, with its relations one level deep, and the path that opens it.",
      inputSchema: schema({ collection: { type: "string" }, id: { type: "string" } }, ["collection", "id"]),
      annotations: { ...READ, untrustedContentHint: true },
      execute: async ({ collection, id }) => {
        const c = requireCollection(collection);
        const doc = await api.findByID(c.slug, str(id), { depth: 1 });
        return trim({ path: `/collections/${c.slug}/${encodeURIComponent(str(id))}`, document: doc });
      },
    },
    {
      name: "create_document",
      title: "Create a record",
      description:
        "Create a record (fields as in describe_schema). Validation, hooks and access rules apply as in the app.",
      inputSchema: schema({ collection: { type: "string" }, data: { type: "object" } }, ["collection", "data"]),
      annotations: ACT,
      execute: async ({ collection, data }) => api.create(requireCollection(collection).slug, object(data) ?? {}),
    },
    {
      name: "update_document",
      title: "Update a record",
      description: "Change some fields of a record (only the fields given). Validation, hooks and access rules apply.",
      inputSchema: schema({ collection: { type: "string" }, id: { type: "string" }, data: { type: "object" } }, [
        "collection",
        "id",
        "data",
      ]),
      annotations: ACT,
      execute: async ({ collection, id, data }) =>
        api.update(requireCollection(collection).slug, str(id), object(data) ?? {}),
    },
    {
      name: "delete_document",
      title: "Delete a record",
      description: "Delete a record. This can't be undone.",
      inputSchema: schema({ collection: { type: "string" }, id: { type: "string" } }, ["collection", "id"]),
      annotations: ACT,
      execute: async ({ collection, id }) => api.delete(requireCollection(collection).slug, str(id)),
    },
    {
      name: "get_settings",
      title: "Read settings",
      description:
        "A global (settings document, e.g. pricing-policy, approval-rules, fx-rates): slugs from describe_schema.",
      inputSchema: schema({ global: { type: "string" } }, ["global"]),
      annotations: READ,
      execute: async ({ global }) => {
        if (!globalOf(str(global))) throw new Error(`Unknown global "${str(global)}".`);
        return trim(await api.findGlobal(str(global)));
      },
    },
    {
      name: "update_settings",
      title: "Change settings",
      description: "Change some fields of a global (settings document).",
      inputSchema: schema({ global: { type: "string" }, data: { type: "object" } }, ["global", "data"]),
      annotations: ACT,
      execute: async ({ global, data }) => {
        if (!globalOf(str(global))) throw new Error(`Unknown global "${str(global)}".`);
        return api.updateGlobal(str(global), object(data) ?? {});
      },
    },
    {
      name: "list_workflows",
      title: "Workflows",
      description:
        "The platform's workflow endpoints behind its screens (inbox triage, supplier RFQs, offer comparison, pricing, approvals, purchase orders, delivery, invoicing, cash, automations…), as METHOD and path with :params. GETs read a screen's data; POSTs perform its actions. Use with call_workflow.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => workflowEndpoints(),
    },
    {
      name: "call_workflow",
      title: "Run a workflow",
      description:
        "Call a workflow endpoint from list_workflows (fill the :params). GET reads data; POST performs the action the matching button would (sending, approving, creating orders…), with the same access rules.",
      inputSchema: schema(
        {
          method: { type: "string", enum: ["get", "post"] },
          path: { type: "string", description: "e.g. /commercial/cases/gs-rfq-0142/compare" },
          body: { type: "object", description: "POST body" },
        },
        ["method", "path"],
      ),
      annotations: { ...ACT, untrustedContentHint: true },
      execute: async ({ method, path, body }) => {
        const m = method === "post" ? "post" : "get";
        const p = str(path);
        if (!matchEndpoint(m, p)) throw new Error(`No ${m.toUpperCase()} ${p} workflow (see list_workflows).`);
        return trim(m === "get" ? await api.get(p) : await api.post(p, object(body) ?? {}));
      },
    },
    {
      name: "ask_assistant",
      title: "Ask Golden Sea",
      description:
        "Ask the platform's own assistant a question about the business (a case's status, approvals, who owes money, late suppliers, pipeline, margin). It answers from the live records, as the signed-in user may see them, and cites them.",
      inputSchema: schema({ question: { type: "string" } }, ["question"]),
      annotations: READ,
      execute: async ({ question }) => api.post<Answer>("/ask", { question: str(question) }),
    },
    {
      name: "get_my_work",
      title: "My work",
      description:
        "The side panel's counters for the signed-in user's role (what they steer by, e.g. decisions waiting for them, invoices to collect) with counts, and their unread notifications.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => {
        const widgets = await Promise.all(
          roleWidgets(text(user.role), user.id)
            .filter((w) => can(w.slug, "read"))
            .map(async (w) => ({
              label: w.label,
              count: (await api.count(w.slug, w.where).catch(() => ({ totalDocs: 0 }))).totalDocs,
              needsAttention: w.alert || undefined,
              collection: w.slug,
              where: w.where,
            })),
        );
        const unread = can("notifications", "read")
          ? (await api.find("notifications", { where: { read: { equals: false } }, sort: "-at", limit: 20, depth: 0 }))
              .docs
          : [];
        return trim({ widgets, unreadNotifications: unread });
      },
    },
    {
      name: "mark_notification_read",
      title: "Mark notification read",
      description: "Mark one of the user's notifications (id from get_my_work) as read.",
      inputSchema: schema({ id: { type: "string" } }, ["id"]),
      execute: async ({ id }) => api.update("notifications", str(id), { read: true }),
    },
    {
      name: "get_bookmarks",
      title: "Bookmarks",
      description: "The user's bookmarked pages.",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () => {
        await loadBookmarks();
        return bookmarks.get().items;
      },
    },
    {
      name: "toggle_bookmark",
      title: "Bookmark a page",
      description: "Add a page to the user's bookmarks, or remove it if it's there (default: the current page).",
      inputSchema: schema({ path: { type: "string" }, label: { type: "string" } }),
      execute: async ({ path, label }) => {
        await toggleBookmark({ href: withBase(str(path) || location.pathname), label: str(label) || host.title() });
        return bookmarks.get().items;
      },
    },
    {
      name: "list_tours",
      title: "Guided tours",
      description: "The guided tours of the platform (some switch between users to show how roles work together).",
      inputSchema: schema({}),
      annotations: READ,
      execute: async () =>
        TOURS.map((t) => ({
          id: t.id,
          title: t.title,
          summary: t.summary,
          steps: t.steps.length,
          cast: tourCast(t),
          done: tour.get().completed.includes(t.id),
        })),
    },
    {
      name: "start_tour",
      title: "Start a tour",
      description:
        "Start a guided tour for the user (an id from list_tours). It walks them through the screens with coachmarks.",
      inputSchema: schema({ id: { type: "string" } }, ["id"]),
      execute: async ({ id }) => {
        const t = TOURS.find((x) => x.id === str(id));
        if (!t) throw new Error(`No tour "${str(id)}" (see list_tours).`);
        startTour(t.id);
        return { started: t.title, steps: t.steps.map((s) => s.title) };
      },
    },
  ];
}
