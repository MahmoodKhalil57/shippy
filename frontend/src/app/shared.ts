import type { Tone } from "../components/primitives/data/tag.ts";
import type { IconName } from "../components/primitives/media/icon.ts";
import { text } from "../cms/runtime/util.ts";
import type { CollectionConfig, GlobalConfig } from "payload";
import { API_ROUTE, DASHBOARD_ROUTE, api, withBase } from "../cms/client.ts";
import { bookmarks, type Bookmark } from "../stores/index.ts";
import config from "../cms/config.ts";
import type { CollectionSettings, DashboardSettings, Doc, FieldLike } from "../cms/types.ts";

/** Shared helpers for the dashboard (src/app). */

export { config };

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
/** A date for display; a date with no time of day (midnight) shows as just the day. */
export const formatDate = (v: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  return d.getHours() === 0 && d.getMinutes() === 0 ? dayFmt.format(d) : dateFmt.format(d);
};

/** Plain-text cell value for a field. */
export function cellText(f: FieldLike, v: unknown): string {
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
      return typeof v === "number" ? v.toLocaleString("en-US") : text(v);
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
  | { name: "list"; slug: string }
  | { name: "create"; slug: string }
  | { name: "edit"; slug: string; id: string; tab?: string }
  | { name: "view"; key: string }
  | { name: "global"; slug: string }
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

export function parseRoute(pathname: string): Route {
  if (!isDashboardPath(pathname)) return { name: "not-found" };
  const parts = pathname.slice(DASHBOARD_ROUTE.length).split("/").filter(Boolean).map(decodeURIComponent);
  const [a, b, c] = parts;
  if (!a) return { name: "dashboard" };
  if (a === "login" && !b) return { name: "login" };
  if (a === "create-first-user" && !b) return { name: "create-first-user" };
  if (a === "account" && !b) return { name: "account" };
  if (a === "collections" && b && collectionOf(b)) {
    if (!c) return { name: "list", slug: b };
    if (c === "create" && parts.length === 3) return { name: "create", slug: b };
    if (parts.length === 3) return { name: "edit", slug: b, id: c };
    const tab = editTabs(collectionOf(b)!).find((t) => t.path === `/${parts[3]}`);
    if (parts.length === 4 && tab) return { name: "edit", slug: b, id: c, tab: tab.key };
  }
  const view = rootViews().find((v) => v.path === `/${parts.join("/")}`);
  if (view) return { name: "view", key: view.key };
  if (a === "globals" && b && globalOf(b) && !c) return { name: "global", slug: b };
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
export function editTabs(c: CollectionConfig): EditTab[] {
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
 * A snackbar about what just happened. Errors stay until dismissed; everything else goes after 4s.
 * (The tone of success / info / warning messages isn't shown: M3 snackbars carry no status icons.)
 */
export function toast(
  message: string,
  tone: "success" | "info" | "warning" | "error" = "success",
  action?: { label: string; onClick: () => void },
) {
  document.querySelector("ui-snackbar")?.push(message, { tone: tone === "error" ? "error" : "neutral", action });
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
export const collectionSettings = (c: CollectionConfig): CollectionSettings => (c.custom ?? {}) as CollectionSettings;

/** A select field that has tones per value (`custom.tones`), or reads like a status or stage. */
export const isToned = (f: FieldLike) =>
  f.type === "select" && !f.hasMany && (!!f.custom?.tones || /status|stage/i.test(f.name ?? ""));

/** A select value's tag tone: the field's `custom.tones`, else read from the label's words. */
export const toneOf = (f: FieldLike, value: unknown, label: string): Tone =>
  (f.custom?.tones?.[String(value)] as Tone | undefined) ?? statusColor(label);

/**
 * The badge colour for a status or stage, from its words: problems red, waiting amber, work in
 * progress blue, done green, ended or unknown grey. Used by the order-to-cash screens and by
 * collection lists for their status columns.
 */
export function statusColor(status = ""): Tone {
  if (/not awarded|expired|cancelled|superseded|skipped|ignored/i.test(status)) return "neutral";
  if (
    /blocked|mismatch|rejected|invalid|declined|no response|on hold|held|overdue|short|damaged|wrong|missing|late|unreachable|clarification|not sourced|lost|failed|reversed/i.test(
      status,
    )
  )
    return "error";
  if (
    /awaiting|waiting|pending|partial|planned|rescheduled|draft|submitted|approved 1|open|due|deposit to pay|needs review|requested|revision|returned|on watch|under review|documents pending/i.test(
      status,
    )
  )
    return "warning";
  if (
    /new|sent|validating|sourcing|comparing|purchasing|delivering|customs|scheduled|loading|dispatched|on board|boat transfer|trial|ready|introduced|prospect|in progress/i.test(
      status,
    )
  )
    return "info";
  if (
    /valid|matched|confirmed|ok|paid|received|delivered|approved|closed|settled|acknowledged|reconciled|recorded|done|resolved|won|active|linked|created|replied|selected|ordered|invoiced|released|first rfq/i.test(
      status,
    )
  )
    return "success";
  return "neutral";
}
