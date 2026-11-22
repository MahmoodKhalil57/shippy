import type { Tone } from "../components/primitives/data/tag.ts";
import type { IconName } from "../components/primitives/media/icon.ts";
import { text } from "../payload/util.ts";
import type { CollectionConfig, GlobalConfig } from "payload";
import { API_ROUTE, DASHBOARD_ROUTE, api, withBase } from "../api/client.ts";
import { bookmarks, type Bookmark } from "../stores/index.ts";
import { projectOf } from "./config.ts";
import type { CollectionSettings, DashboardSettings, Doc, FieldLike, RootView } from "../contracts/config.ts";
import { parse } from "qs-esm";
import { matchPath, pathParams, placeOf, placesOf, viewWidgets, type Places } from "./widgets/places.ts";
import { formatNumber } from "./widgets/schema.ts";
import { setToday } from "./widgets/widget.ts";

/** Shared helpers for the dashboard (src/app). */

/** The project's Payload config (handed to `startDashboard`). */
export const config = projectOf().config;
// Relative dates in widget queries count from the project's day, if it sets one.
setToday((config.admin?.custom as DashboardSettings | undefined)?.today);

export const userSlug = config.admin?.user ?? config.collections.find((c) => c.auth)?.slug ?? "users";

export const humanize = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

export function collectionOf(slug: string): CollectionConfig | undefined {
  return config.collections.find((c) => c.slug === slug);
}

export function globalOf(slug: string): GlobalConfig | undefined {
  return config.globals?.find((g) => g.slug === slug);
}

export function labels(c: CollectionConfig) {
  const singular =
    typeof c.labels?.singular === "string"
      ? c.labels.singular
      : humanize(c.slug.replace(/ies$/, "y").replace(/s$/, ""));
  const plural = typeof c.labels?.plural === "string" ? c.labels.plural : humanize(c.slug);
  return { singular, plural };
}

export const globalLabel = (g: GlobalConfig) => (typeof g.label === "string" ? g.label : humanize(g.slug));

export const fieldsOf = (owner: CollectionConfig | GlobalConfig) => owner.fields as unknown as FieldLike[];

/** Fields that hold data, with layout fields flattened (for columns and sorting). */
export function dataFields(fields: FieldLike[]): FieldLike[] {
  return fields.flatMap((f) => {
    if (f.type === "row" || f.type === "collapsible") return dataFields(f.fields ?? []);
    if (f.type === "tabs") return (f.tabs ?? []).flatMap((t) => (t.name ? [] : dataFields(t.fields)));
    return f.name && f.type !== "ui" ? [f] : [];
  });
}

/** Form fields for a collection: Payload adds `email` to auth collections. */
export function formFields(c: CollectionConfig): FieldLike[] {
  const own = fieldsOf(c);
  if (c.auth && !dataFields(own).some((f) => f.name === "email")) {
    return [{ name: "email", type: "email", required: true }, ...own];
  }
  return own;
}

/** Split into main and `admin.position: "sidebar"` fields (top level only, as in Payload). */
export function splitSidebar(fields: FieldLike[]) {
  return {
    main: fields.filter((f) => f.admin?.position !== "sidebar"),
    sidebar: fields.filter((f) => f.admin?.position === "sidebar"),
  };
}

export const useAsTitle = (c: CollectionConfig) => c.admin?.useAsTitle ?? "id";

export function titleOf(c: CollectionConfig, doc: Doc | Record<string, unknown> | null | undefined): string {
  if (!doc) return "";
  const v = doc[useAsTitle(c)];
  return v == null || v === "" ? text(doc.id ?? "Untitled") : text(v);
}

/** Columns for the list view: `admin.defaultColumns`, else the title and the next few simple fields. */
export function columnsOf(c: CollectionConfig): FieldLike[] {
  const fields = dataFields(formFields(c));
  const byName = new Map(fields.map((f) => [f.name!, f]));
  const pseudo = (name: string): FieldLike => ({ name, type: name.endsWith("At") ? "date" : "text" });
  if (c.admin?.defaultColumns?.length) return c.admin.defaultColumns.map((n) => byName.get(n) ?? pseudo(n));
  const title = useAsTitle(c);
  const simple = fields.filter(
    (f) => f.name !== title && !["array", "blocks", "group", "json", "richText", "textarea", "code"].includes(f.type),
  );
  return [byName.get(title) ?? pseudo(title), ...simple.slice(0, 3), pseudo("updatedAt")];
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const dayUtcFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
/** A date for display; a date with no time of day (midnight) shows as just the day. */
export const formatDate = (v: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  // A date with no time of day (stored as midnight UTC, as a day-only picker saves it): the day.
  if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return dayUtcFmt.format(d);
  return d.getHours() === 0 && d.getMinutes() === 0 ? dayFmt.format(d) : dateFmt.format(d);
};

/** Plain-text cell value for a field. */
/**
 * A number as its field reads it (`custom.number`): money in the currency its document holds in
 * `currencyField` (or a fixed one), a share, days. Plain otherwise.
 */
export function numberText(f: FieldLike, v: number, doc?: Record<string, unknown>): string {
  const n = f.custom?.number;
  if (!n) return v.toLocaleString("en-US");
  const currency = n.currencyField ? text(doc?.[n.currencyField]) || undefined : n.currency;
  return formatNumber(v, { ...n, currency });
}

/** A value as text, the way its field reads (`doc`: the document it's from, for a money field's currency). */
export function cellText(f: FieldLike, v: unknown, doc?: Record<string, unknown>): string {
  if (v == null || v === "") return "—";
  const one = (x: unknown): string => {
    if (typeof x === "object" && x !== null) {
      const o = x as Record<string, unknown>;
      if ("relationTo" in o && "value" in o) return one(o.value);
      const target = typeof f.relationTo === "string" ? collectionOf(f.relationTo) : undefined;
      return target ? titleOf(target, o) : text(o.id ?? JSON.stringify(o));
    }
    const option = f.options?.find((opt) => typeof opt !== "string" && opt.value === x);
    if (option && typeof option !== "string") return text(option.label);
    return text(x);
  };
  switch (f.type) {
    case "date":
      return formatDate(v);
    case "checkbox":
      return v ? "Yes" : "No";
    case "number":
      return typeof v === "number" ? numberText(f, v, doc) : text(v);
    case "array":
    case "blocks":
      return Array.isArray(v) ? `${v.length} ${v.length === 1 ? "row" : "rows"}` : "—";
    case "group":
    case "json":
      return JSON.stringify(v);
    default:
      return Array.isArray(v) ? v.map(one).join(", ") : one(v);
  }
}

// ---------------------------------------------------------------- routing

export type Route =
  | { name: "dashboard" }
  | { name: "login" }
  | { name: "create-first-user" }
  /** A root view; its path's parameters (`/cases/:id`). */
  | { name: "view"; key: string; params: Record<string, string> }
  /**
   * A canonical address (`links()`: a collection, a document, a global) and where it's placed: the
   * app opens `to` in its place (./widgets/places.ts). Nothing at `to`: not found.
   */
  | { name: "address"; href: string; to: string | null }
  | { name: "account" }
  | { name: "not-found" };

/** `/collections/cases/123` style URLs (Payload's admin URLs, at the site root). */
export const dashboardPath = (...parts: string[]) =>
  [DASHBOARD_ROUTE, ...parts.map(encodeURIComponent)].join("/").replace(/\/+$/, "") || "/";

/** A dashboard page (not the API, not a file such as /icons/icon.svg). */
export const isDashboardPath = (pathname: string) =>
  (pathname === (DASHBOARD_ROUTE || "/") || pathname.startsWith(`${DASHBOARD_ROUTE}/`)) &&
  !pathname.startsWith(`${API_ROUTE}/`) &&
  pathname !== API_ROUTE &&
  !/\.\w+$/.test(pathname);

/** What a list keeps in the URL (./list-view.ts), unkeyed in an address `links()` wrote. */
const LIST_STATE = new Set(["q", "sort", "page", "limit", "filters", "match", "view", "open"]);

export function parseRoute(pathname: string, search = ""): Route {
  if (!isDashboardPath(pathname)) return { name: "not-found" };
  const parts = pathname.slice(DASHBOARD_ROUTE.length).split("/").filter(Boolean).map(decodeURIComponent);
  const [a, b] = parts;
  if (!a) return { name: "dashboard" };
  if (a === "login" && !b) return { name: "login" };
  if (a === "create-first-user" && !b) return { name: "create-first-user" };
  if (a === "account" && !b) return { name: "account" };
  const path = `/${parts.join("/")}`;
  // A collection's, document's or global's address (what `links()` writes).
  const address = (a === "collections" && b && collectionOf(b)) || (a === "globals" && b && globalOf(b));
  const href = `/${parts.map(encodeURIComponent).join("/")}${search}`;
  // A view at this path (fixed paths before ones with parameters: `/cases/board` before `/cases/:id`).
  const views = rootViews().sort((x, y) => pathParams(x.path).length - pathParams(y.path).length);
  for (const v of views) {
    const params = matchPath(v.path, path);
    if (!params) continue;
    // A collection's page at its own address, reached by a link with its state unkeyed
    // (`?filters[0]…`): once, the state goes under the widget's key (`?cases[filters][0]…`).
    const unkeyed = Object.keys(parse(search, { ignoreQueryPrefix: true })).some((k) => LIST_STATE.has(k));
    if (address && unkeyed) return { name: "address", href, to: placeOf(href, places()) };
    return { name: "view", key: v.key, params };
  }
  // Otherwise it opens where it's placed.
  if (address) return { name: "address", href, to: placeOf(href, places()) };
  return { name: "not-found" };
}

// ---------------------------------------------------------------- custom views (Payload admin.components.views)

/** A collection's custom edit tabs (`admin.components.views.edit`), e.g. the case workspace. */
export interface EditTab {
  key: string;
  /** The element's name, and the props to set on it (Payload `clientProps`). */
  Component: string;
  props: Record<string, unknown>;
  path: string;
  label: string;
}

/** A Payload component reference (`"tag"` or `{ path, clientProps }`) as an element name and props. */
export function componentOf(c: unknown): { tag: string; props: Record<string, unknown> } | null {
  if (typeof c === "string") return { tag: c, props: {} };
  if (c && typeof c === "object" && typeof (c as { path?: unknown }).path === "string") {
    const { path, clientProps } = c as { path: string; clientProps?: Record<string, unknown> };
    return { tag: path, props: clientProps ?? {} };
  }
  return null;
}
/**
 * A document's custom views (Payload `admin.components.views.edit`), its tabs beside "Details": a
 * collection's documents, or a global (Payload's Document views, which globals have too).
 */
export function editTabs(c: CollectionConfig | GlobalConfig): EditTab[] {
  const edit = (c.admin?.components?.views?.edit ?? {}) as Record<string, unknown>;
  return Object.entries(edit).flatMap(([key, v]) => {
    const view = v as { Component?: unknown; path?: string; tab?: { label?: unknown } } | undefined;
    const comp = componentOf(view?.Component);
    return comp && view?.path
      ? [{ key, Component: comp.tag, props: comp.props, path: view.path, label: text(view.tab?.label ?? key) }]
      : [];
  });
}

/** The custom root views (`admin.components.views`), with their keys. */
export const rootViews = () =>
  Object.entries(config.admin?.components?.views ?? {})
    .filter(([key]) => key !== "dashboard")
    .map(([key, v]) => ({ key, ...v }));

let placed: Places | undefined;
/** Where each collection, document and global is placed (./widgets/places.ts), read once. */
export const places = () => (placed ??= placesOf(config.admin?.components?.views ?? {}));

/** The dashboard URL a canonical address opens (`/collections/cases?…` → `/cases?cases[…]`), or null. */
export const addressOf = (href: string) => placeOf(href, places());

/**
 * A view's navigation link: what it says, or for `auto` its collection's group and plural label
 * (a global's: Configuration and its label), from the first collection or global widget on it.
 */
export function navOf(v: { nav?: RootView["nav"]; Component?: unknown; path: string }) {
  if (v.nav !== "auto") return v.nav;
  for (const w of viewWidgets(v)) {
    const c = w.collection ? collectionOf(w.collection.collection) : undefined;
    if (c) return { group: groupOf(c), label: labels(c).plural };
    const g = w.global ? globalOf(w.global.global) : undefined;
    if (g) return { group: "Configuration", label: globalLabel(g) };
  }
  return undefined;
}

/** A view's title: its `meta.title`, else its navigation label (a list's, a global's), else a document page's collection's singular name. */
export function titleOfView(v: {
  key: string;
  meta?: { title: string };
  nav?: RootView["nav"];
  Component?: unknown;
  path: string;
}) {
  if (v.meta?.title) return v.meta.title;
  const nav = navOf(v);
  if (nav) return nav.label;
  // A document's page (`documentPage`): its collection's name for one record ("Customer").
  for (const w of viewWidgets(v)) {
    const c = w.document ? collectionOf(w.document.collection) : undefined;
    if (c) return labels(c).singular;
  }
  return humanize(v.key);
}

/** The project's dashboard settings (`admin.custom`: brand, navigation, widgets, tours, assistant). */
export const settings: DashboardSettings = config.admin?.custom ?? {};

/** The dashboard's home (Payload `admin.components.views.dashboard`), when the project sets one. */
export const dashboardView = () => config.admin?.components?.views?.dashboard;

/** Client-side navigation inside the dashboard (listened to by `<dashboard-app>`). */
export function navigate(to: string, replace = false) {
  const path = withBase(to);
  if (replace) history.replaceState(null, "", path);
  else history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// ---------------------------------------------------------------- feedback

/**
 * A snackbar about what just happened, in place of the one on screen (`<ui-snackbar>`). `success`
 * (the default) shows the tick and `error` its mark; `info` and `warning` are plain. A message
 * with an `action` or an error stays until it's used, dismissed or replaced; the rest go by
 * themselves. An action that takes the thing back is `{ label: "Undo", onClick, undo: true }`:
 * `undo` lets Ctrl / ⌘ + Z run it too. Returns the message's id.
 */
export function toast(
  message: string,
  tone: "success" | "info" | "warning" | "error" = "success",
  action?: { label: string; onClick: () => void; undo?: boolean },
) {
  return document
    .querySelector("ui-snackbar")
    ?.push(message, { tone: tone === "success" || tone === "error" ? tone : "neutral", action });
}

// ---------------------------------------------------------------- bookmarks

/** Loads the signed-in user's bookmarks (their `bookmarks` documents) into the store. */
export async function loadBookmarks() {
  const { docs } = await api.find("bookmarks", { limit: 0, depth: 0, sort: "createdAt" }).catch(() => ({ docs: [] }));
  bookmarks.set({ items: docs.map((d) => ({ id: d.id, href: withBase(text(d.href)), label: text(d.label) })) });
}

/** Adds the page to the signed-in user's bookmarks, or removes it. */
export async function toggleBookmark(b: Bookmark) {
  const existing = bookmarks.get().items.find((x) => x.href === b.href);
  try {
    if (existing?.id) await api.delete("bookmarks", existing.id);
    else await api.create("bookmarks", { href: b.href, label: b.label });
  } catch (e) {
    toast(`Couldn't update bookmarks: ${(e as Error).message}`, "error");
  }
  await loadBookmarks();
}

// ---------------------------------------------------------------- icons

/** A navigation group's icon (`admin.custom.nav.groups`). */
export const groupIcon = (group: string): IconName =>
  ((settings.nav?.groups ?? []).find((g) => g.label === group)?.icon as IconName | undefined) ?? "grid";

/** A collection's group (`admin.group`), as shown in the navigation. */
export const groupOf = (c: CollectionConfig) => (typeof c.admin?.group === "string" ? c.admin.group : "Collections");

/** A collection's dashboard settings (its `custom`: board, card fields, steps, summary). */
export const collectionSettings = (c: CollectionConfig | GlobalConfig): CollectionSettings =>
  (c.custom ?? {}) as CollectionSettings;

/** A select field that has tones per value (`custom.tones`), or reads like a status or stage. */
export const isToned = (f: FieldLike) =>
  f.type === "select" && !f.hasMany && (!!f.custom?.tones || /status|stage/i.test(f.name ?? ""));

/** A select value's tag tone: the field's `custom.tones`, else read from the label's words. */
export const toneOf = (f: FieldLike, value: unknown, label: string): Tone =>
  (f.custom?.tones?.[String(value)] as Tone | undefined) ?? statusColor(label);

/** Status words by tone, checked in this order: ended, problem, waiting, in progress, done. */
const STATUS_WORDS: [Tone, string[]][] = [
  ["neutral", ["expired", "cancelled", "skipped", "ignored", "archived"]],
  [
    "error",
    [
      "blocked",
      "mismatch",
      "rejected",
      "invalid",
      "declined",
      "no response",
      "on hold",
      "held",
      "overdue",
      "wrong",
      "missing",
      "late",
      "failed",
      "reversed",
      "lost",
    ],
  ],
  [
    "warning",
    [
      "awaiting",
      "waiting",
      "pending",
      "partial",
      "planned",
      "rescheduled",
      "draft",
      "submitted",
      "open",
      "due",
      "needs review",
      "requested",
      "revision",
      "returned",
      "under review",
    ],
  ],
  ["info", ["new", "sent", "scheduled", "ready", "in progress", "processing"]],
  [
    "success",
    [
      "valid",
      "matched",
      "confirmed",
      "ok",
      "paid",
      "received",
      "delivered",
      "approved",
      "closed",
      "settled",
      "acknowledged",
      "reconciled",
      "recorded",
      "done",
      "resolved",
      "won",
      "active",
      "linked",
      "created",
      "replied",
      "selected",
      "ordered",
      "invoiced",
      "released",
      "completed",
    ],
  ],
];
const escapeWord = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** The generic words plus the project's (`admin.custom.statusWords`), one pattern per tone. */
let statusPatterns: [Tone, RegExp][] | undefined;
const patternsOf = () =>
  (statusPatterns ??= STATUS_WORDS.map(([tone, words]) => {
    const all = [
      ...(settings.statusWords?.[tone as keyof NonNullable<DashboardSettings["statusWords"]>] ?? []),
      ...words,
    ];
    return [tone, new RegExp(all.map(escapeWord).join("|"), "i")] as [Tone, RegExp];
  }));

/**
 * The badge colour for a status or stage, from its words: ended grey, problems red, waiting amber,
 * in progress blue, done green, unknown grey. A project adds its own status words (its domain's
 * "on board", "customs") with `admin.custom.statusWords`; a select field's `custom.tones` wins.
 */
export function statusColor(status = ""): Tone {
  for (const [tone, re] of patternsOf()) if (re.test(status)) return tone;
  return "neutral";
}
