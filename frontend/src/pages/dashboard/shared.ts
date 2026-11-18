import { text } from "../../cms/runtime/util.ts";
import type { CollectionConfig, GlobalConfig } from "payload";
import { API_ROUTE, DASHBOARD_ROUTE } from "../../cms/client.ts";
import config from "../../cms/config.ts";
import type { Doc, FieldLike } from "../../cms/types.ts";
import type { AlertVariants } from "../../components/primitives/feedback/alert.ts";

/** Shared helpers for the dashboard (src/pages/dashboard). */

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
export const formatDate = (v: unknown) => (typeof v === "string" && v ? dateFmt.format(new Date(v)) : "");

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
  | { name: "edit"; slug: string; id: string }
  | { name: "global"; slug: string }
  | { name: "account" }
  | { name: "mock-data" }
  | { name: "not-found" };

/** `/collections/cases/123` style URLs (Payload's admin URLs, at the site root). */
export const dashboardPath = (...parts: string[]) =>
  [DASHBOARD_ROUTE, ...parts.map(encodeURIComponent)].join("/").replace(/\/+$/, "") || "/";

/** A dashboard page (not the API, not a file such as /favicon.svg). */
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
  if (a === "mock-data" && !b) return { name: "mock-data" };
  if (a === "collections" && b && collectionOf(b)) {
    if (!c) return { name: "list", slug: b };
    if (c === "create" && parts.length === 3) return { name: "create", slug: b };
    if (parts.length === 3) return { name: "edit", slug: b, id: c };
  }
  if (a === "globals" && b && globalOf(b) && !c) return { name: "global", slug: b };
  return { name: "not-found" };
}

/** Client-side navigation inside the dashboard (listened to by `<dashboard-app>`). */
export function navigate(path: string, replace = false) {
  if (replace) history.replaceState(null, "", path);
  else history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// ---------------------------------------------------------------- feedback

export function toast(message: string, color: AlertVariants["color"] = "success") {
  document.querySelector("ui-toast")?.push(message, { color, timeout: 4000 });
}
