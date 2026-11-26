import type { CollectionConfig, GlobalConfig } from "payload";
import { parse } from "qs-esm";
import type {
  CollectionSettings,
  DashboardSettings,
  Doc,
  FieldLike,
  MockConfig,
  RootView,
} from "../contracts/config.ts";
import { intl, m } from "../i18n/index.ts";
import { text } from "../payload/util.ts";
import type { Tone } from "../../components/primitives/data/tag.ts";
import type { IconName } from "../../components/primitives/media/icon.ts";
import { matchPath, pathParams, placeOf, placesOf, viewWidgets, type Places } from "../widgets/places.ts";
import { formatNumber } from "../widgets/schema.ts";

export interface SeedUser {
  id: string;
  name?: string;
  initials?: string;
  email: string;
  password: string;
  role?: string;
}

export type Route =
  | { name: "dashboard" }
  | { name: "login" }
  | { name: "create-first-user" }
  | { name: "view"; key: string; params: Record<string, string> }
  | { name: "address"; href: string; to: string | null }
  | { name: "account" }
  | { name: "not-found" };

export interface EditTab {
  key: string;
  Component: string;
  props: Record<string, unknown>;
  path: string;
  label: string;
}

export const humanize = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

export const fieldsOf = (owner: CollectionConfig | GlobalConfig) => owner.fields as unknown as FieldLike[];

export function dataFields(fields: FieldLike[]): FieldLike[] {
  return fields.flatMap((f) => {
    if (f.type === "row" || f.type === "collapsible") return dataFields(f.fields ?? []);
    if (f.type === "tabs") return (f.tabs ?? []).flatMap((t) => (t.name ? [] : dataFields(t.fields)));
    return f.name && f.type !== "ui" ? [f] : [];
  });
}

export function formFields(c: CollectionConfig): FieldLike[] {
  const own = fieldsOf(c);
  if (c.auth && !dataFields(own).some((f) => f.name === "email")) {
    return [{ name: "email", type: "email", required: true }, ...own];
  }
  return own;
}

export function splitSidebar(fields: FieldLike[]) {
  return {
    main: fields.filter((f) => f.admin?.position !== "sidebar"),
    sidebar: fields.filter((f) => f.admin?.position === "sidebar"),
  };
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

export const useAsTitle = (c: CollectionConfig) => c.admin?.useAsTitle ?? "id";

export function titleOf(c: CollectionConfig, doc: Doc | Record<string, unknown> | null | undefined): string {
  if (!doc) return "";
  const v = doc[useAsTitle(c)];
  return v == null || v === "" ? text(doc.id ?? m.shared_untitled()) : text(v);
}

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

const DATE_TIME: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};
const DAY: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
const DAY_UTC: Intl.DateTimeFormatOptions = { ...DAY, timeZone: "UTC" };
export const formatDate = (v: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return intl.date(DAY_UTC).format(d);
  return intl.date(d.getHours() === 0 && d.getMinutes() === 0 ? DAY : DATE_TIME).format(d);
};

export function numberText(f: FieldLike, v: number, doc?: Record<string, unknown>): string {
  const n = f.custom?.number;
  if (!n) return intl.number().format(v);
  const currency = n.currencyField ? text(doc?.[n.currencyField]) || undefined : n.currency;
  return formatNumber(v, { ...n, currency });
}

export function componentOf(c: unknown): { tag: string; props: Record<string, unknown> } | null {
  if (typeof c === "string") return { tag: c, props: {} };
  if (c && typeof c === "object" && typeof (c as { path?: unknown }).path === "string") {
    const { path, clientProps } = c as { path: string; clientProps?: Record<string, unknown> };
    return { tag: path, props: clientProps ?? {} };
  }
  return null;
}

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

export const collectionSettings = (c: CollectionConfig | GlobalConfig): CollectionSettings =>
  (c.custom ?? {}) as CollectionSettings;

export const groupOf = (c: CollectionConfig) =>
  typeof c.admin?.group === "string" ? c.admin.group : m.shared_collections();

export const isToned = (f: FieldLike) =>
  f.type === "select" && !f.hasMany && (!!f.custom?.tones || /status|stage/i.test(f.name ?? ""));

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

const LIST_STATE = new Set(["q", "sort", "page", "limit", "filters", "match", "view", "open"]);

export type Project = ReturnType<typeof createProject>;

export function createProject({
  config,
  seedUsers = [],
  base = "",
  apiRoute = `${base}/api`,
}: {
  config: MockConfig;
  seedUsers?: SeedUser[];
  base?: string;
  apiRoute?: string;
}) {
  const settings: DashboardSettings = config.admin?.custom ?? {};
  const userSlug = config.admin?.user ?? config.collections.find((c) => c.auth)?.slug ?? "users";
  const collectionOf = (slug: string): CollectionConfig | undefined => config.collections.find((c) => c.slug === slug);
  const globalOf = (slug: string): GlobalConfig | undefined => config.globals?.find((g) => g.slug === slug);

  const cellText = (f: FieldLike, v: unknown, doc?: Record<string, unknown>): string => {
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
        return v ? m.shared_yes() : m.shared_no();
      case "number":
        return typeof v === "number" ? numberText(f, v, doc) : text(v);
      case "array":
      case "blocks":
        return Array.isArray(v) ? m.shared_rows({ count: v.length }) : "—";
      case "group":
      case "json":
        return JSON.stringify(v);
      default:
        return Array.isArray(v) ? v.map(one).join(", ") : one(v);
    }
  };

  const dashboardPath = (...parts: string[]) =>
    [base, ...parts.map(encodeURIComponent)].join("/").replace(/\/+$/, "") || "/";
  const withBase = (path: string) =>
    !base || !path.startsWith("/") || path === base || path.startsWith(`${base}/`) ? path : `${base}${path}`;

  const isDashboardPath = (pathname: string) =>
    (pathname === (base || "/") || pathname.startsWith(`${base}/`)) &&
    !pathname.startsWith(`${apiRoute}/`) &&
    pathname !== apiRoute &&
    !/\.\w+$/.test(pathname);

  const rootViews = () =>
    Object.entries(config.admin?.components?.views ?? {})
      .filter(([key]) => key !== "dashboard")
      .map(([key, v]) => ({ key, ...v }));

  let placed: Places | undefined;
  const places = () => (placed ??= placesOf(config.admin?.components?.views ?? {}));
  const addressOf = (href: string) => placeOf(href, places());

  const parseRoute = (pathname: string, search = ""): Route => {
    if (!isDashboardPath(pathname)) return { name: "not-found" };
    const parts = pathname.slice(base.length).split("/").filter(Boolean).map(decodeURIComponent);
    const [a, b] = parts;
    if (!a) return { name: "dashboard" };
    if (a === "login" && !b) return { name: "login" };
    if (a === "create-first-user" && !b) return { name: "create-first-user" };
    if (a === "account" && !b) return { name: "account" };
    const path = `/${parts.join("/")}`;
    const address = (a === "collections" && b && collectionOf(b)) || (a === "globals" && b && globalOf(b));
    const href = `/${parts.map(encodeURIComponent).join("/")}${search}`;
    const views = rootViews().sort((x, y) => pathParams(x.path).length - pathParams(y.path).length);
    for (const v of views) {
      const params = matchPath(v.path, path);
      if (!params) continue;
      const unkeyed = Object.keys(parse(search, { ignoreQueryPrefix: true })).some((k) => LIST_STATE.has(k));
      if (address && unkeyed) return { name: "address", href, to: addressOf(href) };
      return { name: "view", key: v.key, params };
    }
    if (address) return { name: "address", href, to: addressOf(href) };
    return { name: "not-found" };
  };

  const navOf = (v: { nav?: RootView["nav"]; Component?: unknown; path: string }) => {
    if (v.nav !== "auto") return v.nav;
    for (const w of viewWidgets(v)) {
      const c = w.collection ? collectionOf(w.collection.collection) : undefined;
      if (c) return { group: groupOf(c), label: labels(c).plural };
      const g = w.global ? globalOf(w.global.global) : undefined;
      if (g)
        return {
          group: typeof g.admin?.group === "string" ? g.admin.group : m.shared_configuration(),
          label: globalLabel(g),
        };
    }
    return undefined;
  };

  const titleOfView = (v: {
    key: string;
    meta?: { title: string };
    nav?: RootView["nav"];
    Component?: unknown;
    path: string;
  }) => {
    if (v.meta?.title) return v.meta.title;
    const nav = navOf(v);
    if (nav) return nav.label;
    for (const w of viewWidgets(v)) {
      const c = w.document ? collectionOf(w.document.collection) : undefined;
      if (c) return labels(c).singular;
    }
    return humanize(v.key);
  };

  const groupIcon = (group: string): IconName =>
    ((settings.nav?.groups ?? []).find((g) => g.label === group)?.icon as IconName | undefined) ?? "grid";

  const statusPatterns = STATUS_WORDS.map(([tone, words]) => {
    const all = [
      ...(settings.statusWords?.[tone as keyof NonNullable<DashboardSettings["statusWords"]>] ?? []),
      ...words,
    ];
    return [tone, new RegExp(all.map(escapeWord).join("|"), "i")] as [Tone, RegExp];
  });
  const statusTone = (status: string): Tone | undefined => {
    for (const [tone, re] of statusPatterns) if (re.test(status)) return tone;
    return undefined;
  };
  const statusColor = (status = ""): Tone => statusTone(status) ?? "neutral";
  const toneOf = (f: FieldLike, value: unknown, label: string): Tone =>
    (f.custom?.tones?.[String(value)] as Tone | undefined) ??
    statusTone(label) ??
    statusTone((typeof value === "string" ? value : "").replace(/[-_]/g, " ")) ??
    "neutral";

  const logins = seedUsers.filter((u) => u.email && u.password);
  const users = collectionOf(userSlug);
  const roleField = users ? dataFields(fieldsOf(users)).find((f) => f.name === "role") : undefined;

  const today = settings.today;
  return {
    config,
    settings,
    today,
    todayIso: () => (today ? new Date(today) : new Date()).toISOString().slice(0, 10),
    base,
    apiRoute,
    userSlug,
    seedUsers: logins,
    collectionOf,
    globalOf,
    cellText,
    dashboardPath,
    withBase,
    isDashboardPath,
    parseRoute,
    rootViews,
    places,
    addressOf,
    navOf,
    titleOfView,
    groupIcon,
    statusColor,
    toneOf,
    dashboardView: () => config.admin?.components?.views?.dashboard,
    roleLabel: (role?: string) => (roleField && role ? cellText(roleField, role) : (role ?? "")),
    roleLogins: logins.filter((u, i, all) => u.role && all.findIndex((x) => x.role === u.role) === i),
    defaultLogin: logins[0],
    demoPassword: (email: string) =>
      logins.find((u) => u.email.toLowerCase() === email.toLowerCase())?.password ?? "demo1234",
  };
}
