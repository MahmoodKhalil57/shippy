import { toEnglish } from "../agent/built-in-ai.ts";
import { text } from "../payload/util.ts";
import { LightElement } from "../components/base/light-element.ts";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CollectionConfig, Where } from "payload";
import { parse, stringify } from "qs-esm";
import { DASHBOARD_ROUTE, api, withBase, type FindOptions } from "../api/client.ts";
import { todayIso, type CollectionViewSpec, type WidgetScope } from "./widgets/widget.ts";
import type { ViewContext } from "./widgets/registry.ts";
import { actionsFor } from "./widgets/data.ts";
import { actionBar } from "./widgets/blocks.ts";
import { formatNumber } from "./widgets/schema.ts";
import { intl, m } from "../i18n/index.ts";
import type { RecordItem } from "../components/primitives/data/record.ts";
import type { MonthEvent } from "../components/primitives/data/month.ts";
import { linkTarget } from "./widgets/links.ts";
import type { Select } from "../payload/select.ts";
import type { Doc, FieldLike, PaginatedDocs } from "../contracts/config.ts";
import "../components/index.ts";
import type { PickerColumn } from "../components/composed/data/column-picker.ts";
import {
  filterWhere,
  type FilterCondition,
  type FilterField,
  type FilterMatch,
} from "../components/base/filter-query.ts";
import { orderColumns } from "../components/base/columns.ts";
import { byColumn, columnOf, moved, NONE, valueOf } from "../components/base/kanban.ts";
import type { KanbanColumn } from "../components/primitives/data/kanban.ts";
import type { TableColumn } from "../components/primitives/data/table.ts";
import { preferences, StoreController } from "../stores/index.ts";
import type { Access } from "./app.ts";
import type { DocState } from "./edit-view.ts";
import { initialsOf } from "./widgets/blocks.ts";
import {
  cellText,
  collectionOf,
  columnsOf,
  addressOf,
  dashboardPath,
  dataFields,
  formFields,
  labels,
  collectionSettings,
  componentOf,
  isToned,
  navigate,
  parseRoute,
  titleOf,
  toneOf,
  toast,
  useAsTitle,
} from "./shared.ts";

const LISTABLE = new Set([
  "text",
  "email",
  "textarea",
  "number",
  "date",
  "select",
  "radio",
  "checkbox",
  "relationship",
  "upload",
  "join",
  "point",
  "code",
]);
const SEARCH_DELAY = 250;

type JoinField = FieldLike & { collection: string };
const isJoin = (f: FieldLike): f is JoinField => f.type === "join";
const pseudo = (name: string): FieldLike => ({
  name,
  type: "date",
  label: name === "createdAt" ? m.list_view_created() : m.list_view_updated(),
});
const labelOf = (f: FieldLike) =>
  typeof f.label === "string" ? f.label : f.name![0]!.toUpperCase() + f.name!.slice(1).replace(/([A-Z])/g, " $1");
const relatedSlug = (f: FieldLike) =>
  (f.type === "relationship" || f.type === "upload") && typeof f.relationTo === "string" ? f.relationTo : undefined;
const isPerson = (f: FieldLike) => {
  const target = relatedSlug(f);
  return !!target && !f.hasMany && !!collectionOf(target)?.auth;
};
const urlQuery = () =>
  parse(location.search, { ignoreQueryPrefix: true, depth: 6, arrayLimit: 200 }) as Record<string, unknown>;
const ownQuery = (key: string): Record<string, unknown> | undefined => {
  const raw = urlQuery();
  if (!key) return raw;
  const own = raw[key];
  return own && typeof own === "object" ? (own as Record<string, unknown>) : undefined;
};
const readOpen = (key: string) => {
  const open = ownQuery(key)?.open;
  return typeof open === "string" ? open : "";
};
const SHEET_LEAVES = 300;

function allColumns(c: CollectionConfig): FieldLike[] {
  const fields = dataFields(formFields(c)).filter((f) => LISTABLE.has(f.type) && !f.hidden && !f.admin?.hidden);
  const stamps = c.timestamps === false ? [] : ["createdAt", "updatedAt"].map(pseudo);
  const seen = new Set<string>();
  return [...columnsOf(c), ...fields, ...stamps].filter((f) => !seen.has(f.name!) && seen.add(f.name!));
}

function linkColumnOf(c: CollectionConfig) {
  const title = useAsTitle(c);
  const all = allColumns(c);
  return all.some((f) => f.name === title) ? title : all[0]?.name;
}

function orderedColumns(c: CollectionConfig, order: readonly string[] = []): FieldLike[] {
  const link = linkColumnOf(c);
  return orderColumns(
    allColumns(c).map((f) => ({ key: f.name!, fixed: f.name === link, f })),
    order,
  ).map((x) => x.f);
}

interface ListQuery {
  q: string;
  sort: string;
  page: number;
  limit: string;
  filters: FilterCondition[];
  match: FilterMatch;
  view?: ListLayout;
  month?: string;
}
type ListLayout =
  | "table"
  | "cards"
  | "list"
  | "compact"
  | "focus"
  | "groups"
  | "board"
  | "calendar"
  | "timeline"
  | "heatmap"
  | "chart"
  | "ranking"
  | "treemap"
  | "scatter";
const LAYOUTS: ListLayout[] = [
  "table",
  "cards",
  "list",
  "compact",
  "focus",
  "groups",
  "board",
  "calendar",
  "timeline",
  "heatmap",
  "chart",
  "ranking",
  "treemap",
  "scatter",
];
const WHOLE: ListLayout[] = ["calendar", "timeline", "heatmap", "chart", "ranking", "treemap", "scatter"];
const DAY_MS = 86_400_000;
const CODE = /^[\p{Lu}\d]+[-/][\p{Lu}\d]/u;
const DAY_LABEL: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" };
const LONG_DATE: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" };
const countOf = (count: number, singular: string, plural: string) =>
  m.list_view_count_of({ count, singular: singular.toLowerCase(), plural: plural.toLowerCase() });
const DEFAULTS: ListQuery = { q: "", sort: "", page: 1, limit: "10", filters: [], match: "and" };

function readQuery(key: string, spec: CollectionViewSpec | null): ListQuery {
  const own = ownQuery(key);
  const raw: Record<string, unknown> = own ?? {
    sort: spec?.sort,
    limit: spec?.limit !== undefined ? String(spec.limit) : undefined,
    filters: spec?.filters,
    view: spec?.layout,
  };
  const filters = Array.isArray(raw.filters)
    ? (raw.filters as Record<string, unknown>[]).flatMap((f): FilterCondition[] =>
        typeof f?.field === "string" && typeof f.operator === "string"
          ? [
              {
                field: f.field,
                operator: f.operator as FilterCondition["operator"],
                value:
                  f.value === "true"
                    ? true
                    : f.value === "false"
                      ? false
                      : ((f.value as FilterCondition["value"]) ?? ""),
              },
            ]
          : [],
      )
    : [];
  return {
    q: typeof raw.q === "string" ? raw.q : "",
    sort: typeof raw.sort === "string" ? raw.sort : "",
    page: Math.max(1, Number(raw.page) || 1),
    limit: ["10", "25", "50", "100"].includes(String(raw.limit)) ? String(raw.limit) : "10",
    filters,
    match: raw.match === "or" ? "or" : "and",
    view: LAYOUTS.includes(raw.view as ListLayout) ? (raw.view as ListLayout) : undefined,
    month: typeof raw.month === "string" && /^\d{4}-\d{2}$/.test(raw.month) ? raw.month : undefined,
  };
}

const listCache = new Map<string, PaginatedDocs>();

@customElement("dashboard-list-view")
export class DashboardListView extends LightElement {
  @property() slug = "";
  @property() stateKey = "";
  @property({ attribute: false }) spec: CollectionViewSpec | null = null;
  @property({ attribute: false }) ctx: ViewContext | null = null;
  @property({ attribute: false }) scope: WidgetScope | null = null;
  @property({ type: Boolean }) tile = false;
  @property() heading = "";
  @property() subhead = "";
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user: (Doc & { collection: string }) | null = null;
  @state() private result: PaginatedDocs | null = null;
  @state() private loading = false;
  @state() private query: ListQuery = { ...DEFAULTS };
  @state() private typed = "";
  @state() private selected: number[] = [];
  @state() private allMatching = false;
  @state() private confirming = false;
  @state() private relatedOptions: Record<string, { label: string; value: string }[]> = {};
  @state() private openId = "";
  @state() private sheetId = "";
  @state() private doc: DocState | null = null;
  @state() private leaving: (() => void) | null = null;
  #prefs = new StoreController(this, preferences, undefined, {
    changed: (s, p) =>
      s.listDensity !== p.listDensity ||
      (["listColumns", "listColumnOrder", "listColumnWidths", "listView"] as const).some(
        (k) => s[k][this.prefKey] !== p[k][this.prefKey],
      ),
  });
  #request = 0;
  #typing?: ReturnType<typeof setTimeout>;
  #emptying?: ReturnType<typeof setTimeout>;

  private get collection() {
    return collectionOf(this.slug)!;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._onClick);
    window.addEventListener("popstate", this._onPop);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    window.removeEventListener("popstate", this._onPop);
    clearTimeout(this.#emptying);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("slug") || changed.has("stateKey") || changed.has("spec")) {
      this.query = readQuery(this.stateKey, this.spec);
      this.typed = this.query.q;
      this.selected = [];
      this.allMatching = false;
      if (changed.has("slug")) this.result = null;
      this.relatedOptions = {};
      this.openId = this.sheetId = readOpen(this.stateKey);
      this.doc = null;
      this.leaving = null;
      void this._loadRelatedOptions();
    }
  }

  protected updated(changed: PropertyValues<this>) {
    if (changed.has("slug") || changed.has("spec") || (changed as Map<PropertyKey, unknown>).has("query"))
      void this._load();
  }

  private _set(next: Partial<ListQuery>) {
    this.query = { ...this.query, ...("page" in next ? {} : { page: 1 }), ...next };
    this.selected = [];
    this.allMatching = false;
    history.replaceState(history.state, "", this._url());
  }

  private _url(open = this.openId) {
    const { q, sort, page, limit, filters, match, view, month } = this.query;
    const mine = Object.fromEntries(
      Object.entries({
        q: q || undefined,
        sort: sort || undefined,
        page: page > 1 ? page : undefined,
        limit: limit !== DEFAULTS.limit ? limit : undefined,
        filters: filters.length ? filters : undefined,
        match: filters.length > 1 && match === "or" ? match : undefined,
        view,
        month,
        open: open || undefined,
      }).filter(([, v]) => v !== undefined),
    );
    const all = this.stateKey ? { ...urlQuery(), [this.stateKey]: Object.keys(mine).length ? mine : undefined } : mine;
    const qs = stringify(all, { addQueryPrefix: true, encodeValuesOnly: true });
    return `${location.pathname}${qs}`;
  }

  private _leave(then: () => void) {
    if (this.openId && this.doc?.dirty) this.leaving = then;
    else then();
  }

  private _open(id: string) {
    if (id === this.openId) return;
    this._leave(() => {
      clearTimeout(this.#emptying);
      const replace = !!this.openId && !!(history.state as { sheet?: boolean } | null)?.sheet;
      this.openId = this.sheetId = id;
      this.doc = null;
      if (replace) history.replaceState({ sheet: true }, "", this._url());
      else history.pushState({ sheet: true }, "", this._url());
    });
  }

  private _closed() {
    if (this.openId) {
      this.openId = "";
      if ((history.state as { sheet?: boolean } | null)?.sheet) history.back();
      else history.replaceState(history.state, "", this._url());
    }
    this.doc = null;
    clearTimeout(this.#emptying);
    this.#emptying = setTimeout(() => !this.openId && (this.sheetId = ""), SHEET_LEAVES);
  }

  private _onPop = () => {
    if (!this.isConnected) return;
    const open = readOpen(this.stateKey);
    if (this.openId && open !== this.openId && this.doc?.dirty) {
      history.pushState({ sheet: true }, "", this._url());
      this.leaving = () => (open ? this._open(open) : this._closed());
      return;
    }
    const query = readQuery(this.stateKey, this.spec);
    if (JSON.stringify(query) !== JSON.stringify(this.query)) {
      this.query = query;
      this.typed = query.q;
    }
    if (open === this.openId) return;
    clearTimeout(this.#emptying);
    this.openId = open;
    this.doc = null;
    if (open) this.sheetId = open;
    else this.#emptying = setTimeout(() => !this.openId && (this.sheetId = ""), SHEET_LEAVES);
  };

  private _onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const path = e.composedPath();
    const a = path.find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.origin !== location.origin) return;
    const to = withBase(a.pathname);
    if (path.some((n) => n instanceof Element && n.localName === "ui-sheet")) {
      if (parseRoute(to).name === "not-found" || !this.doc?.dirty) return;
      e.preventDefault();
      this.leaving = () => navigate(to + a.search);
      return;
    }
    const target = linkTarget(a.pathname.slice(DASHBOARD_ROUTE.length) || "/");
    if (target.kind !== "doc" || target.collection !== this.slug || target.tab) return;
    if (a.closest("dashboard-list-view") !== this) return;
    e.preventDefault();
    this._open(target.id);
  };

  private get _form() {
    return this.querySelector<HTMLElementTagNameMap["dashboard-edit-view"]>("ui-sheet dashboard-edit-view");
  }

  private _refreshAround() {
    for (const el of this.#around.values()) (el as { reload?: () => void }).reload?.();
  }

  private get prefKey() {
    return this.spec && !this.spec.home ? `${this.slug}@${location.pathname}#${this.stateKey}` : this.slug;
  }

  private get hiddenDefaults() {
    const shown = new Set(this.spec?.columns ?? columnsOf(this.collection).map((f) => f.name));
    return allColumns(this.collection)
      .map((f) => f.name!)
      .filter((n) => !shown.has(n));
  }

  private get hiddenKeys() {
    return this.#prefs.value.listColumns[this.prefKey] ?? this.hiddenDefaults;
  }

  private get columnOrder() {
    return this.#prefs.value.listColumnOrder[this.prefKey] ?? [];
  }

  private get columnWidths() {
    return this.#prefs.value.listColumnWidths[this.prefKey] ?? {};
  }

  private get visible() {
    const hidden = new Set(this.hiddenKeys);
    return orderedColumns(this.collection, this.columnOrder).filter((f) => !hidden.has(f.name!));
  }

  private _filterFields(): FilterField[] {
    return allColumns(this.collection).flatMap((f): FilterField[] => {
      const base = { name: f.name!, label: labelOf(f) };
      const options = (f.options ?? []).map((o) =>
        typeof o === "string" ? { label: o, value: o } : { label: text(o.label), value: o.value },
      );
      switch (f.type) {
        case "text":
        case "email":
        case "textarea":
        case "code":
          return [{ ...base, type: "text" }];
        case "number":
          return [{ ...base, type: "number" }];
        case "date":
          return [{ ...base, type: "date" }];
        case "checkbox":
          return [{ ...base, type: "boolean" }];
        case "select":
        case "radio":
          return [{ ...base, type: "select", options }];
        case "relationship":
        case "upload":
          return this.relatedOptions[f.name!]
            ? [{ ...base, type: "select", options: this.relatedOptions[f.name!] }]
            : [];
        default:
          return [];
      }
    });
  }

  private async _loadRelatedOptions() {
    const slug = this.slug;
    const entries = await Promise.all(
      allColumns(this.collection).map(async (f) => {
        const target = relatedSlug(f);
        const related = target ? collectionOf(target) : undefined;
        if (!target || !related) return undefined;
        const title = useAsTitle(related);
        const { docs } = await api
          .find(target, { limit: 200, depth: 0, sort: title, select: { [title]: true } })
          .catch(() => ({ docs: [] as Doc[] }));
        return [f.name!, docs.map((d) => ({ label: titleOf(related, d), value: String(d.id) }))] as const;
      }),
    );
    if (slug === this.slug) this.relatedOptions = Object.fromEntries(entries.filter((e) => e != null));
  }

  private async _options(all = false): Promise<FindOptions> {
    const c = this.collection;
    const field = useAsTitle(c);
    const { q, sort, page, limit, filters, match } = this.query;
    const english = q ? await toEnglish(q).catch(() => q) : "";
    const search: Where | undefined = !q
      ? undefined
      : english && english !== q
        ? { or: [{ [field]: { like: q } }, { [field]: { like: english } }] }
        : { [field]: { like: q } };
    const filtersWhere = filterWhere(filters, match, this._filterFields()) as Where | undefined;
    const fixed = this.spec?.where as Where | undefined;
    const parts = [fixed, search, filtersWhere].filter((w): w is Where => !!w);
    const shown =
      this.view === "table"
        ? []
        : [
            ...this._cardFields(),
            ...(this.view === "board" && this.boardField ? [this.boardField] : []),
            ...this._recordParts().fields,
            ...(this.calendarField ? [this.calendarField] : []),
            ...this._scatterFields(),
            ...this._chartParts().fields,
          ];
    const cal = this.view === "calendar" ? this.calendarField : undefined;
    if (cal) {
      const [y, m] = this._month.split("-").map(Number) as [number, number];
      const start = new Date(Date.UTC(y, m - 1, 1)).toISOString();
      const end = new Date(Date.UTC(y, m, 1)).toISOString();
      parts.push({ [cal.name!]: { greater_than_equal: start, less_than: end } } as Where);
    }
    const visible = [...new Set([...this.visible, ...shown])];
    const select: Select | undefined = this._acting()
      ? undefined
      : Object.fromEntries([field, ...visible.map((f) => f.name!)].map((n) => [n, true]));
    const populate = Object.fromEntries(
      visible.flatMap((f) => {
        const target = relatedSlug(f);
        const related = target ? collectionOf(target) : undefined;
        return target && related ? [[target, { [useAsTitle(related)]: true }]] : [];
      }),
    );
    const joins = Object.fromEntries(visible.filter(isJoin).map((f) => [f.name!, { count: true, limit: 1 }]));
    return {
      where: parts.length > 1 ? { and: parts } : parts[0],
      sort: sort || undefined,
      page: all || cal || WHOLE.includes(this.view) ? 1 : page,
      limit: all || cal || WHOLE.includes(this.view) ? 0 : Number(limit),
      depth: 1,
      select,
      populate,
      joins: Object.keys(joins).length ? joins : false,
    };
  }

  private async _load() {
    const id = ++this.#request;
    this.loading = true;
    try {
      const options = await this._options();
      const cacheKey = `${this.slug} ${JSON.stringify(options)}`;
      const cached = listCache.get(cacheKey);
      if (cached && id === this.#request) this.result = cached;
      const result = await api.find(this.slug, options);
      if (id !== this.#request) return;
      listCache.set(cacheKey, result);
      if (JSON.stringify(result) !== JSON.stringify(this.result)) this.result = result;
      this.dispatchEvent(new CustomEvent("dashboard-list-count", { detail: { count: result.totalDocs } }));
    } catch (e) {
      if (id === this.#request) toast((e as Error).message, "error");
    } finally {
      if (id === this.#request) this.loading = false;
    }
  }

  private async _deleteSelected() {
    this.confirming = false;
    try {
      const where = this.allMatching
        ? ((await this._options(true)).where ?? { id: { exists: true } })
        : { id: { in: this.selected.map((i) => this.result!.docs[i]!.id) } };
      const { message, errors } = await api.deleteMany(this.slug, where);
      toast(message, errors.length ? "warning" : "success");
    } catch (e) {
      toast((e as Error).message, "error");
    }
    this.selected = [];
    this.allMatching = false;
    await this._load();
  }

  private async _export() {
    const { docs } = await api.find(this.slug, await this._options(true));
    const columns = this.visible;
    const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const rows = [
      columns.map((f) => cell(labelOf(f))).join(","),
      ...docs.map((d) => columns.map((f) => cell(this._cellText(f, d))).join(",")),
    ];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    Object.assign(document.createElement("a"), { href: url, download: `${this.slug}.csv` }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private _cellText(f: FieldLike, doc: Doc) {
    const v = doc[f.name!];
    if (isJoin(f)) {
      const count = (v as { totalDocs?: number } | undefined)?.totalDocs ?? 0;
      const related = collectionOf(f.collection);
      const { singular, plural } = related
        ? labels(related)
        : { singular: m.list_view_item(), plural: m.list_view_items() };
      return countOf(count, singular, plural);
    }
    return cellText(f, v, doc);
  }

  private _status(f: FieldLike, doc: Doc) {
    if (!isToned(f)) {
      if (f.type !== "select" || f.hasMany) return undefined;
      const at = (f.options ?? []).findIndex((o) => (typeof o === "string" ? o : o.value) === String(doc[f.name!]));
      return at < 0 ? undefined : html`<ui-tag .hue=${at}>${this._cellText(f, doc)}</ui-tag>`;
    }
    const label = this._cellText(f, doc);
    if (!label || label === "—") return undefined;
    return html`<ui-tag .tone=${toneOf(f, doc[f.name!], label)}>${label}</ui-tag>`;
  }

  private get boardField(): FieldLike | undefined {
    const name = collectionSettings(this.collection).list?.board;
    return name ? dataFields(formFields(this.collection)).find((f) => f.name === name) : undefined;
  }

  private get view(): ListLayout {
    const v = (this.query.view ??
      this.#prefs.value.listView[this.prefKey] ??
      this.spec?.layout ??
      "table") as ListLayout;
    return this._layouts().some((l) => l.value === v) ? v : "table";
  }

  private _scatterFields(): FieldLike[] {
    const all = dataFields(formFields(this.collection));
    const spec = this.spec?.scatter;
    const named = spec?.x && spec.y ? [spec.x, spec.y] : collectionSettings(this.collection).list?.scatter;
    const numbers = all.filter((f) => f.type === "number");
    const pick = named ? named.flatMap((n) => numbers.filter((f) => f.name === n)) : numbers.slice(0, 2);
    return pick.length === 2 ? pick : [];
  }

  private get calendarField(): FieldLike | undefined {
    const name = collectionSettings(this.collection).list?.calendar;
    return name ? dataFields(formFields(this.collection)).find((f) => f.name === name && f.type === "date") : undefined;
  }

  private get _month() {
    return this.query.month ?? todayIso().slice(0, 7);
  }

  private _recordParts() {
    const settings = collectionSettings(this.collection).list ?? {};
    const all = dataFields(formFields(this.collection));
    const named = (n?: string) => (n ? all.find((f) => f.name === n) : undefined);
    const status = named(settings.status) ?? this.boardField ?? all.find(isToned);
    const figure =
      named(this.spec?.figure) ??
      named(settings.figure) ??
      all.find(
        (f) =>
          f.type === "number" && (f.custom as { number?: { unit?: string } } | undefined)?.number?.unit === "money",
      );
    const person = all.find(isPerson);
    const eyebrow = named(settings.eyebrow);
    return {
      status,
      figure,
      person,
      eyebrow,
      fields: [status, figure, person, eyebrow].filter((f): f is FieldLike => !!f),
    };
  }

  private _acting() {
    return (
      !!this.ctx &&
      !!this.scope &&
      this.view !== "table" &&
      !!(collectionSettings(this.collection) as { actions?: unknown[] }).actions?.length
    );
  }

  #ctx?: ViewContext;
  private get _runner(): ViewContext | undefined {
    const ctx = this.ctx;
    if (!ctx) return undefined;
    if (this.#ctx && this.#ctxOf === ctx) return this.#ctx;
    this.#ctxOf = ctx;
    this.#ctx = {
      ...ctx,
      run: (a) => {
        const done = ctx.run(a);
        if (done) void done.then(() => this._load());
        return done;
      },
    };
    return this.#ctx;
  }
  #ctxOf?: ViewContext;

  private _record(doc: Doc): RecordItem {
    const c = this.collection;
    const { status, figure, person, eyebrow } = this._recordParts();
    const title = useAsTitle(c);
    const said = (f: FieldLike | undefined) => {
      const t = f ? this._cellText(f, doc) : "";
      return t && t !== "—" ? t : "";
    };
    const statusLabel = said(status);
    const used = new Set([title, status?.name, figure?.name, person?.name, eyebrow?.name]);
    const facts = this._cardFields()
      .filter((f) => !used.has(f.name))
      .map((f) => ({ label: labelOf(f), value: said(f) }))
      .filter((f) => f.value)
      .slice(0, 4);
    const figureText = said(figure);
    return {
      key: String(doc.id),
      title: titleOf(c, doc),
      href: dashboardPath("collections", this.slug, String(doc.id)),
      eyebrow: said(eyebrow) || undefined,
      monogram:
        eyebrow && relatedSlug(eyebrow) && said(eyebrow)
          ? said(eyebrow)
          : CODE.test(titleOf(c, doc))
            ? said(this._cardFields().find((f) => relatedSlug(f) && !isPerson(f) && !CODE.test(said(f)) && said(f))) ||
              undefined
            : undefined,
      status:
        status && statusLabel
          ? { label: statusLabel, tone: toneOf(status, doc[status.name!], statusLabel) }
          : undefined,
      figure: figure && figureText ? { label: labelOf(figure), value: figureText } : undefined,
      person: said(person) || undefined,
      facts,
      actions: this._actionsOf(doc),
    };
  }

  private _actionsOf(doc: Doc) {
    if (!this._acting()) return undefined;
    const list = actionsFor(this.slug, doc, this.scope!);
    return list.length ? actionBar(list, this._runner!) : undefined;
  }

  private _layouts() {
    const { status, figure } = this._recordParts();
    const when = (ok: unknown, value: ListLayout, label: string) => (ok ? [{ value, label }] : []);
    return [
      { value: "table", label: m.list_view_layout_table() },
      { value: "cards", label: m.list_view_layout_cards() },
      { value: "list", label: m.list_view_layout_list() },
      { value: "compact", label: m.list_view_layout_compact() },
      { value: "focus", label: m.list_view_layout_focus() },
      ...when(status, "groups", m.list_view_layout_groups({ field: (status ? labelOf(status) : "").toLowerCase() })),
      ...when(this.boardField, "board", m.list_view_layout_board()),
      ...when(this.calendarField, "calendar", m.list_view_layout_calendar()),
      ...when(this.calendarField, "timeline", m.list_view_layout_timeline()),
      ...when(this.calendarField, "heatmap", m.list_view_layout_heatmap()),
      ...when(this._chartParts().by, "chart", m.list_view_layout_chart({ field: this._chartParts().title })),
      ...when(figure, "ranking", m.list_view_layout_ranking({ field: (figure ? labelOf(figure) : "").toLowerCase() })),
      ...when(figure, "treemap", m.list_view_layout_treemap()),
      ...when(this._scatterFields().length, "scatter", m.list_view_layout_scatter()),
    ] as { value: ListLayout; label: string }[];
  }

  private _view(view: ListLayout) {
    preferences.set((p) => ({ listView: { ...p.listView, [this.prefKey]: view } }));
    this.selected = [];
    this.allMatching = false;
    this._set({ view, page: this.query.page });
  }

  private _sortOptions() {
    return [
      { label: m.list_view_sort_default(), value: "" },
      ...this._columns()
        .filter((c) => c.sortable && !this.hiddenKeys.includes(c.key))
        .flatMap((c) => [
          { label: `${text(c.label)} ↑`, value: c.key },
          { label: `${text(c.label)} ↓`, value: `-${c.key}` },
        ]),
    ];
  }

  private _cardFields(): FieldLike[] {
    const title = useAsTitle(this.collection);
    const names = collectionSettings(this.collection).list?.cardFields;
    const all = dataFields(formFields(this.collection));
    return names ? names.flatMap((n) => all.filter((f) => f.name === n)) : this.visible.filter((f) => f.name !== title);
  }

  private _boardOptions() {
    return (this.boardField?.options ?? []).map((o) =>
      typeof o === "string" ? { value: o, label: o } : { value: o.value, label: text(o.label) },
    );
  }

  private async _move(id: string, to: string, undoable = true) {
    const f = this.boardField;
    const doc = this.result?.docs.find((d) => String(d.id) === id);
    if (!f || !doc) return;
    const options = this._boardOptions();
    const none = m.list_view_none_inline({ field: labelOf(f).toLowerCase() });
    const label = (column: string) => options.find((o) => o.value === column)?.label ?? none;
    const from = columnOf(
      doc[f.name!],
      options.map((o) => o.value),
    );
    if (from === to) return;
    const put = (column: string) => {
      if (!this.result) return;
      const docs = moved(
        this.result.docs,
        (d) => String(d.id) === id,
        column,
        (d, value) => ({ ...d, [f.name!]: value }),
      );
      this.result = { ...this.result, docs };
    };
    const title = titleOf(this.collection, doc);
    put(to);
    try {
      await api.update(this.slug, id, { [f.name!]: valueOf(to) });
      toast(
        m.list_view_moved({ title, column: label(to) }),
        "success",
        undoable
          ? { label: m.list_view_undo(), undo: true, onClick: () => void this._move(id, from, false) }
          : undefined,
      );
      this._refreshAround();
    } catch (e) {
      put(from);
      toast(m.list_view_move_failed({ title, column: label(from), error: (e as Error).message }), "error");
    }
  }

  private _board(empty: unknown) {
    const c = this.collection;
    const f = this.boardField!;
    const r = this.result;
    if (!r?.docs.length) return !r ? html`<ui-empty-state loading></ui-empty-state>` : empty;
    const shown = this._cardFields().filter((x) => x.name !== f.name);
    const person = shown.find(isPerson);
    const fields = shown.filter((x) => x !== person);
    const options = this._boardOptions();
    const columns = byColumn(
      r.docs,
      (d) => d[f.name!],
      options.map((o) => o.value),
    );
    const labelOfColumn = (key: string) =>
      key === NONE
        ? m.list_view_none_column({ field: labelOf(f).toLowerCase() })
        : (options.find((o) => o.value === key)?.label ?? key);
    const movable = !!this.access.collections[this.slug]?.update.permission;
    const menu = (id: string, title: string, at: string) =>
      html`<ui-dropdown
        mode="popover"
        align="end"
        trigger-variant="text"
        trigger-size="xs"
        trigger-shape="round"
        trigger-spaced="false"
        .triggerLabel=${m.list_view_move_menu({ title })}
        .items=${options.filter((o) => o.value !== at).map((o) => ({ label: m.list_view_move_to({ column: o.label }), value: o.value }))}
        @ui-select=${(e: CustomEvent<{ item: { value: string } }>) => {
          e.stopPropagation();
          this.querySelector("ui-kanban")?.land(id);
          void this._move(id, e.detail.item.value);
        }}
        ><span slot="trigger">⋯</span></ui-dropdown
      >`;
    const items: KanbanColumn[] = columns.map((o) => ({
      key: o.key,
      label: labelOfColumn(o.key),
      heading: html`<ui-tag .tone=${toneOf(f, o.key, labelOfColumn(o.key))}>${labelOfColumn(o.key)}</ui-tag>`,
      items: o.items.map((d) => {
        const id = String(d.id);
        const title = titleOf(c, d);
        const who = person ? this._cellText(person, d) : "";
        return {
          key: id,
          headline: title,
          supporting: fields
            .map((x) => this._cellText(x, d))
            .filter((t) => t && t !== "—")
            .join(" · "),
          href: dashboardPath("collections", this.slug, id),
          person: who && who !== "—" ? { name: who, initials: initialsOf(who) } : undefined,
          trailing: movable ? menu(id, title, o.key) : undefined,
        };
      }),
    }));
    return html`<ui-kanban
      ?movable=${movable}
      .label=${m.list_view_by({ things: labels(c).plural, field: labelOf(f).toLowerCase() })}
      .columns=${items}
      @ui-move=${(e: CustomEvent<{ key: string; to: string }>) => void this._move(e.detail.key, e.detail.to)}
    ></ui-kanban>`;
  }

  #around = new Map<string, HTMLElement>();

  private _around(where: "beforeList" | "afterList") {
    const list = (this.collection.admin?.components as Record<string, unknown> | undefined)?.[where];
    return (Array.isArray(list) ? list : []).map((c, i) => {
      const comp = componentOf(c);
      if (!comp) return nothing;
      const key = `${this.slug}|${where}|${i}`;
      let el = this.#around.get(key);
      if (!el) {
        el = document.createElement(comp.tag);
        this.#around.set(key, el);
      }
      Object.assign(el, comp.props, { slug: this.slug, access: this.access });
      return el;
    });
  }

  private _cards(empty: unknown) {
    const c = this.collection;
    const title = useAsTitle(c);
    const r = this.result;
    if (!r?.docs.length) {
      return !r
        ? html`<ui-grid fit="sm" gap="4">
            ${Array.from({ length: 6 }, () => html`<ui-skeleton template="rectangle"></ui-skeleton>`)}
          </ui-grid>`
        : html`<ui-box border rounded="box" padding="8">${empty}</ui-box>`;
    }
    void title;
    return html`<ui-record-cards
      .label=${labels(c).plural}
      .records=${r.docs.map((d) => this._record(d))}
    ></ui-record-cards>`;
  }

  private _rows(empty: unknown) {
    const r = this.result;
    if (!r?.docs.length) {
      return !r
        ? html`<ui-flex direction="col" gap="2">
            ${Array.from({ length: 6 }, () => html`<ui-skeleton template="rectangle"></ui-skeleton>`)}
          </ui-flex>`
        : html`<ui-box border rounded="box" padding="8">${empty}</ui-box>`;
    }
    return html`<ui-record-list
      .label=${labels(this.collection).plural}
      .records=${r.docs.map((d) => this._record(d))}
    ></ui-record-list>`;
  }

  private _visual(view: ListLayout, empty: unknown) {
    const r = this.result;
    if (!r?.docs.length)
      return !r
        ? html`<ui-skeleton template="rectangle"></ui-skeleton>`
        : html`<ui-box border rounded="box" padding="8">${empty}</ui-box>`;
    const plural = labels(this.collection).plural;
    const records = r.docs.map((d) => this._record(d));
    switch (view) {
      case "compact":
        return html`<ui-record-chips .label=${plural} .records=${records}></ui-record-chips>`;
      case "focus":
        return this._focus(records);
      case "groups":
        return this._groups(r.docs);
      case "timeline":
        return this._timeline(r.docs);
      case "heatmap":
        return this._heatmap(r.docs);
      case "chart":
        return this._chart(r.docs);
      case "ranking":
      case "treemap":
        return this._ranked(view, r.docs);
      case "scatter":
        return this._scatter(r.docs);
      default:
        return nothing;
    }
  }

  @state() private focusAt = 0;

  private _focus(records: RecordItem[]) {
    const n = records.length;
    const at = Math.min(this.focusAt, n - 1);
    const rec = records[at]!;
    const go = (i: number) => (this.focusAt = Math.min(n - 1, Math.max(0, i)));
    const key = (e: KeyboardEvent) => {
      const rtl = getComputedStyle(this).direction === "rtl";
      const step: Record<string, number> = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 };
      if (e.key in step) go(at + step[e.key]!);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(n - 1);
      else return;
      e.preventDefault();
    };
    return html`<ui-flex direction="col" gap="4" @keydown=${key}>
      <ui-flex align="center" gap="2" wrap>
        <ui-icon-button
          icon="chevron-left"
          label=${m.list_view_previous()}
          size="sm"
          ?disabled=${at === 0}
          @click=${() => go(at - 1)}
        ></ui-icon-button>
        <ui-text variant="title-sm">${m.list_view_position({ at: at + 1, total: n })}</ui-text>
        <ui-icon-button
          icon="chevron-right"
          label=${m.list_view_next()}
          size="sm"
          ?disabled=${at === n - 1}
          @click=${() => go(at + 1)}
        ></ui-icon-button>
        ${rec.href ? html`<ui-button size="xs" variant="tonal" href=${rec.href}>${m.list_view_open()}</ui-button>` : nothing}
      </ui-flex>
      <ui-progress
        .value=${((at + 1) / n) * 100}
        max="100"
        label=${m.list_view_position({ at: at + 1, total: n })}
      ></ui-progress>
      <ui-record-hero
        .record=${rec}
        .figures=${[...(rec.figure ? [rec.figure] : []), ...(rec.facts ?? [])]}
        .meta=${rec.person ? m.list_view_with({ person: rec.person }) : ""}
      ></ui-record-hero>
    </ui-flex>`;
  }

  private _groups(docs: Doc[]) {
    const f = this._recordParts().status!;
    const order = (f.options ?? []).map((o) => (typeof o === "string" ? o : o.value));
    const groups = new Map<string, Doc[]>();
    for (const d of docs) {
      const v = d[f.name!];
      const key = typeof v === "string" ? v : "";
      groups.set(key, [...(groups.get(key) ?? []), d]);
    }
    const keys = [...groups.keys()].sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });
    return html`<ui-flex direction="col" gap="5">
      ${keys.map((k) => {
        const rows = groups.get(k)!;
        const label = k ? this._cellText(f, rows[0]!) : m.list_view_none_column({ field: labelOf(f).toLowerCase() });
        return html`<ui-flex direction="col" gap="2">
          <ui-flex align="center" gap="2">
            <ui-tag .tone=${toneOf(f, k, label)}>${label}</ui-tag>
            <ui-text variant="body-sm" color="muted">${rows.length}</ui-text>
          </ui-flex>
          <ui-record-list
            .label=${label}
            .records=${rows.map((d) => ({ ...this._record(d), status: undefined }))}
          ></ui-record-list>
        </ui-flex>`;
      })}
    </ui-flex>`;
  }

  private _timeline(docs: Doc[]) {
    const f = this.calendarField!;
    const dated = docs
      .filter((d) => typeof d[f.name!] === "string")
      .sort((a, b) => String(b[f.name!]).localeCompare(String(a[f.name!])));
    return html`<ui-timeline
      direction="vertical"
      compact
      snap-icon
      .items=${dated.map((d) => {
        const rec = this._record(d);
        const when = intl.date(LONG_DATE).format(new Date(String(d[f.name!])));
        const under = [rec.status?.label, rec.figure?.value, ...(rec.facts ?? []).slice(0, 2).map((x) => x.value)]
          .filter(Boolean)
          .join(" · ");
        return {
          start: when,
          end: {
            heading: rec.href ? html`<ui-link href=${rec.href}>${rec.title}</ui-link>` : rec.title,
            text: under,
          },
          box: "end",
        };
      })}
    ></ui-timeline>`;
  }

  private _heatmap(docs: Doc[]) {
    const f = this.calendarField!;
    const counts = new Map<string, number>();
    for (const d of docs) {
      const v = d[f.name!];
      if (typeof v === "string") counts.set(v.slice(0, 10), (counts.get(v.slice(0, 10)) ?? 0) + 1);
    }
    const last = [todayIso(), ...counts.keys()].sort().at(-1)!;
    const end = Date.parse(`${last}T00:00:00Z`);
    const start = end - (new Date(end).getUTCDay() + 7 * 11) * DAY_MS;
    const days = Math.round((end - start) / DAY_MS) + 7 - new Date(end).getUTCDay();
    const { plural, singular } = labels(this.collection);
    const cells = Array.from({ length: days }, (_, i) => {
      const t = start + i * DAY_MS;
      const n = counts.get(new Date(t).toISOString().slice(0, 10)) ?? 0;
      return {
        label: intl.date(DAY_LABEL).format(new Date(t)).replace(",", ""),
        value: n,
        valueText: countOf(n, singular, plural),
      };
    });
    const total = cells.reduce((t, c) => t + c.value, 0);
    return html`<ui-heatmap
      .label=${m.list_view_heatmap_label({ things: plural, field: labelOf(f).toLowerCase() })}
      .summary=${m.list_view_heatmap_summary({ total, things: plural.toLowerCase(), field: labelOf(f).toLowerCase() })}
      .cells=${cells}
    ></ui-heatmap>`;
  }

  private _chartParts() {
    const spec = this.spec?.chart ?? {};
    const all = dataFields(formFields(this.collection));
    const named = (n?: string) => (n ? all.find((f) => f.name === n) : undefined);
    const by = named(spec.by) ?? this.calendarField ?? this._recordParts().status;
    const sum = named(spec.sum);
    const bucket = spec.bucket ?? "day";
    const field = by ? labelOf(by).toLowerCase() : "";
    const title = by && by.type === "date" && !spec.days ? m.list_view_chart_bucket({ field, bucket }) : field;
    return { by, sum, bucket, title, fields: [by, sum].filter((f): f is FieldLike => !!f) };
  }

  private _chart(docs: Doc[]) {
    const { by, sum, bucket } = this._chartParts();
    const f = by!;
    const spec = this.spec?.chart ?? {};
    const { plural } = labels(this.collection);
    const amount = (d: Doc) => (sum ? Number(d[sum.name!]) || 0 : 1);
    const totals = new Map<string, number>();
    const add = (key: string, d: Doc) => totals.set(key, (totals.get(key) ?? 0) + amount(d));
    let keys: string[] = [];
    let label: (k: string) => string = (k) => k;
    if (f.type === "date") {
      const keyOf = (iso: string) => {
        const t = Date.parse(iso);
        const day = new Date(t).toISOString().slice(0, 10);
        if (bucket === "month") return day.slice(0, 7);
        if (bucket === "week") return new Date(t - new Date(t).getUTCDay() * DAY_MS).toISOString().slice(0, 10);
        return day;
      };
      for (const d of docs) if (typeof d[f.name!] === "string") add(keyOf(String(d[f.name!])), d);
      if (spec.days && bucket === "day") {
        const start = Date.parse(`${todayIso()}T00:00:00Z`);
        keys = Array.from({ length: spec.days }, (_, i) => new Date(start + i * DAY_MS).toISOString().slice(0, 10));
      } else {
        const have = [...totals.keys()].sort();
        if (have.length) {
          const step = (k: string) => {
            if (bucket === "month") {
              const [y, m] = k.split("-").map(Number) as [number, number];
              return new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7);
            }
            return new Date(Date.parse(`${k}T00:00:00Z`) + (bucket === "week" ? 7 : 1) * DAY_MS)
              .toISOString()
              .slice(0, 10);
          };
          for (let k = have[0]!; k <= have.at(-1)! && keys.length < 60; k = step(k)) keys.push(k);
        }
      }
      const fmt =
        bucket === "month"
          ? intl.date({ month: "short", year: "2-digit", timeZone: "UTC" })
          : intl.date({
              weekday: bucket === "day" ? "short" : undefined,
              day: "numeric",
              month: bucket === "week" ? "short" : undefined,
              timeZone: "UTC",
            });
      label = (k) => fmt.format(new Date(bucket === "month" ? `${k}-01T00:00:00Z` : `${k}T00:00:00Z`));
    } else {
      const names = new Map<string, string>();
      for (const d of docs) {
        const text = this._cellText(f, d);
        if (!text || text === "—") continue;
        names.set(text, text);
        add(text, d);
      }
      const order = (f.options ?? []).map((o) => (typeof o === "string" ? o : String(o.label)));
      keys = [...names.keys()].sort((a, b) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        return ia >= 0 && ib >= 0 ? ia - ib : (totals.get(b) ?? 0) - (totals.get(a) ?? 0);
      });
    }
    const number = (sum?.custom as { number?: Record<string, unknown> } | undefined)?.number;
    const format = (v: number) =>
      sum && number ? formatNumber(v, { ...number, currencyField: undefined } as never) : intl.number().format(v);
    return html`<ui-chart
      .kind=${spec.kind ?? "bars"}
      .label=${m.list_view_by({ things: sum ? labelOf(sum) : plural, field: labelOf(f).toLowerCase() })}
      .labels=${keys.map(label)}
      .series=${[{ name: sum ? labelOf(sum) : plural, values: keys.map((k) => totals.get(k) ?? 0) }]}
      .format=${format}
    ></ui-chart>`;
  }

  private _ranked(view: "ranking" | "treemap", docs: Doc[]) {
    const f = this._recordParts().figure!;
    const valued = docs
      .map((d) => ({ d, v: Number(d[f.name!]) }))
      .filter((x) => Number.isFinite(x.v) && x.v > 0)
      .sort((a, b) => b.v - a.v);
    const most = valued[0]?.v ?? 1;
    const plural = labels(this.collection).plural;
    if (view === "treemap")
      return html`<ui-treemap
        .label=${m.list_view_by({ things: plural, field: labelOf(f).toLowerCase() })}
        .items=${valued.map(({ d, v }) => {
          const rec = this._record(d);
          return { label: rec.title, value: v, valueText: rec.figure?.value ?? String(v), href: rec.href };
        })}
      ></ui-treemap>`;
    return html`<ui-record-list
      .label=${m.list_view_by({ things: plural, field: labelOf(f).toLowerCase() })}
      .records=${valued.map(({ d, v }) => ({ ...this._record(d), progress: v / most }))}
    ></ui-record-list>`;
  }

  private _scatter(docs: Doc[]) {
    const [x, y] = this._scatterFields() as [FieldLike, FieldLike];
    const points = docs.flatMap((d) => {
      const vx = Number(d[x.name!]);
      const vy = Number(d[y.name!]);
      if (d[x.name!] == null || d[y.name!] == null || !Number.isFinite(vx) || !Number.isFinite(vy)) return [];
      const rec = this._record(d);
      return [
        {
          label: rec.title,
          x: vx,
          y: vy,
          valueText: `${labelOf(x)} ${this._cellText(x, d)} · ${labelOf(y)} ${this._cellText(y, d)}`,
          href: rec.href,
        },
      ];
    });
    const set = this.spec?.scatter ?? {};
    return html`<ui-quadrant
      .label=${m.list_view_scatter_label({
        things: labels(this.collection).plural,
        x: labelOf(x).toLowerCase(),
        y: labelOf(y).toLowerCase(),
      })}
      .xLabel=${labelOf(x)}
      .yLabel=${labelOf(y)}
      .xMid=${set.xMid}
      .yMid=${set.yMid}
      ?invert-y=${!!set.invertY}
      .quadrants=${set.quadrants}
      .points=${points}
    ></ui-quadrant>`;
  }

  private _calendar() {
    const f = this.calendarField!;
    const month = this._month;
    const [y, mo] = month.split("-").map(Number) as [number, number];
    const shift = (n: number) => new Date(Date.UTC(y, mo - 1 + n, 1)).toISOString().slice(0, 7);
    const toneFor = (t: string | undefined): MonthEvent["tone"] =>
      t === "warning" || t === "error" || t === "success" || t === "neutral" ? t : undefined;
    const events: MonthEvent[] = (this.result?.docs ?? []).flatMap((d) => {
      const v = d[f.name!];
      if (typeof v !== "string") return [];
      const rec = this._record(d);
      return [
        {
          date: v.slice(0, 10),
          label: rec.status ? `${rec.title} · ${rec.status.label}` : rec.title,
          href: rec.href,
          tone: toneFor(rec.status?.tone),
        },
      ];
    });
    const name = intl
      .date({ month: "long", year: "numeric", timeZone: "UTC" })
      .format(new Date(Date.UTC(y, mo - 1, 1)));
    const today = todayIso();
    return html`<ui-flex direction="col" gap="3">
      <ui-flex align="center" gap="2" wrap>
        <ui-icon-button
          icon="chevron-left"
          label=${m.list_view_previous_month()}
          size="xs"
          @click=${() => this._set({ month: shift(-1) })}
        ></ui-icon-button>
        <ui-text variant="title-sm">${name}</ui-text>
        <ui-icon-button
          icon="chevron-right"
          label=${m.list_view_next_month()}
          size="xs"
          @click=${() => this._set({ month: shift(1) })}
        ></ui-icon-button>
        ${
          month !== today.slice(0, 7)
            ? html`<ui-button size="xs" variant="text" @click=${() => this._set({ month: today.slice(0, 7) })}
                >${m.list_view_this_month()}</ui-button
              >`
            : nothing
        }
        <ui-text variant="body-sm" color="muted"
          >${m.list_view_calendar_count({ count: events.length, field: labelOf(f).toLowerCase() })}</ui-text
        >
      </ui-flex>
      <ui-month
        .label=${m.list_view_calendar_label({ things: labels(this.collection).plural, field: labelOf(f).toLowerCase(), month: name })}
        .month=${month}
        .today=${today}
        .events=${events}
      ></ui-month>
    </ui-flex>`;
  }

  private _sheet() {
    const c = this.collection;
    const id = this.sheetId;
    const s = this.doc;
    const row = this.result?.docs.find((d) => String(d.id) === id);
    const heading = s?.title || (row ? titleOf(c, row) : labels(c).singular);
    const own = (e: Event) => e.target === e.currentTarget;
    return html`<ui-sheet
        size="lg"
        .label=${heading}
        .open=${!!this.openId}
        @ui-dismiss=${(e: Event) => {
          if (!own(e) || !this.doc?.dirty) return;
          e.preventDefault();
          this.leaving = () => this._closed();
        }}
        @ui-close=${(e: Event) => own(e) && this._closed()}
      >
        <span slot="trailing"
          >${s?.dirty ? html`<ui-tag tone="warning">${m.list_view_unsaved()}</ui-tag>` : nothing}${
            id
              ? html`<ui-icon-button
                  icon="external"
                  label=${m.list_view_open_full()}
                  size="xs"
                  href=${dashboardPath("collections", this.slug, id)}
                ></ui-icon-button>`
              : nothing
          }</span
        >
        ${
          id
            ? html`<dashboard-edit-view
                embedded
                .slug=${this.slug}
                .docId=${id}
                .access=${this.access}
                .user=${this.user}
                @dashboard-doc-state=${(e: CustomEvent<DocState>) => (this.doc = e.detail)}
                @dashboard-doc-saved=${() => {
                  void this._load();
                  this._refreshAround();
                }}
              ></dashboard-edit-view>`
            : nothing
        }
        <ui-flex slot="actions" gap="2" align="center" wrap>
          ${
            !s || s.loading || !s.found
              ? nothing
              : s.canSave
                ? html`<ui-button
                    color="primary"
                    title="Ctrl + S"
                    .disabled=${s.saving || !s.dirty}
                    @click=${() => this._form?.save()}
                    >${s.saving ? m.list_view_saving() : s.dirty ? m.list_view_save() : m.list_view_saved()}</ui-button
                  >`
                : html`<ui-tag variant="outline">${m.list_view_read_only()}</ui-tag>`
          }
        </ui-flex>
      </ui-sheet>
      <ui-modal
        heading=${m.list_view_discard_heading()}
        .open=${!!this.leaving}
        confirm-label=${m.list_view_discard()}
        confirm-tone="error"
        cancel-label=${m.list_view_keep_editing()}
        @ui-confirm=${() => {
          const then = this.leaving;
          this.leaving = null;
          if (this.doc) this.doc = { ...this.doc, dirty: false };
          then?.();
        }}
        @ui-close=${() => (this.leaving = null)}
      >
        <ui-text>${m.list_view_discard_text({ title: heading })}</ui-text>
      </ui-modal>`;
  }

  private _columns(): TableColumn<Doc>[] {
    const c = this.collection;
    const linkColumn = linkColumnOf(c);
    return allColumns(c).map((f) => {
      const target = relatedSlug(f);
      return {
        key: f.name!,
        label: labelOf(f),
        fixed: f.name === linkColumn,
        align: f.type === "number" || isJoin(f) ? "end" : undefined,
        sortable: !isJoin(f) && !f.hasMany && f.type !== "relationship" && f.type !== "upload",
        avatar: isPerson(f)
          ? (doc: Doc) => {
              const name = this._cellText(f, doc);
              return name && name !== "—" ? { initials: initialsOf(name) } : undefined;
            }
          : undefined,
        render: (doc: Doc) => {
          if (f.name === linkColumn)
            return html`<ui-link href=${dashboardPath("collections", this.slug, String(doc.id))}
              >${this._cellText(f, doc)}</ui-link
            >`;
          const v = doc[f.name!];
          if (target && v && typeof v === "object" && !Array.isArray(v) && "id" in v)
            return html`<ui-link variant="hover" href=${dashboardPath("collections", target, String(v.id))}
              >${this._cellText(f, doc)}</ui-link
            >`;
          return this._status(f, doc) ?? this._cellText(f, doc);
        },
      };
    });
  }

  render() {
    const c = this.collection;
    const perms = this.access.collections[this.slug];
    const hide = new Set(this.spec?.hide ?? []);
    const shows = (part: NonNullable<CollectionViewSpec["hide"]>[number]) => !hide.has(part);
    const creatable =
      !!perms?.create.permission &&
      shows("create") &&
      !!addressOf(`/collections/${encodeURIComponent(this.slug)}/create`);
    const { singular, plural } = labels(c);
    const title = useAsTitle(c);
    const all = allColumns(c);
    const titleField = all.find((f) => f.name === title);
    const titleLabel = titleField ? labelOf(titleField) : title === "id" ? m.list_view_id() : title;
    const r = this.result;
    const { q, sort, limit, filters, match } = this.query;
    const filtered = !!q || filters.length > 0;
    const pageRows = r?.docs.length ?? 0;
    const count = this.allMatching ? (r?.totalDocs ?? 0) : this.selected.length;
    const view = this.view;
    const empty = html`<ui-flex direction="col" align="center" gap="2">
      <ui-text emphasized
        >${filtered ? m.list_view_empty_filtered({ things: plural.toLowerCase() }) : m.list_view_empty({ things: plural.toLowerCase() })}</ui-text
      >
      ${
        filtered
          ? html`<ui-button
              size="xs"
              variant="text"
              @click=${() => {
                this.typed = "";
                this._set({ q: "", filters: [] });
              }}
              >${m.list_view_clear_filters()}</ui-button
            >`
          : html`<ui-text variant="body-md" color="muted">${m.list_view_create_first()}</ui-text>`
      }
    </ui-flex>`;
    const link = linkColumnOf(c);
    const ordered = orderedColumns(c, this.columnOrder);
    const pickerColumns: PickerColumn[] = ordered.map((f) => ({
      key: f.name!,
      label: labelOf(f),
      required: f.name === link,
    }));
    const arranged =
      Object.keys(this.columnWidths).length > 0 ||
      ordered.map((f) => f.name).join() !==
        orderedColumns(c)
          .map((f) => f.name)
          .join();

    const header = html`<ui-page-header
      .heading=${this.heading || plural}
      .subtitle=${this.subhead || (typeof c.admin?.description === "string" ? c.admin.description : "")}
    >
      ${
        !this.spec || this.spec.home
          ? html`<ui-breadcrumbs
              slot="breadcrumbs"
              .items=${[{ label: m.list_view_dashboard(), href: dashboardPath() }, { label: plural }]}
            ></ui-breadcrumbs>`
          : nothing
      }
      <ui-flex slot="actions" gap="2" wrap
        >${
          creatable
            ? html`<ui-button color="primary" href=${dashboardPath("collections", this.slug, "create")}
                >${m.list_view_create_new({ singular })}</ui-button
              >`
            : nothing
        }</ui-flex
      >
    </ui-page-header>`;
    const around = (where: "beforeList" | "afterList") =>
      (shows("around") ? this._around(where) : []).flatMap((el, i) =>
        el === nothing
          ? []
          : [
              {
                key: `${where}.${i}`,
                size: "full" as const,
                rows: "fit" as const,
                flush: true,
                remember: `list|${this.slug}|${where}.${i}`,
                content: el,
              },
            ],
      );
    const list = html`<ui-flex direction="col" gap="5">
      <ui-flex direction="col" gap="3">
        ${
          ["filters", "layouts", "columns", "export"].every((p) => hide.has(p as never)) &&
          view !== "cards" &&
          !(this.tile && creatable)
            ? nothing
            : html`<ui-toolbar .label=${plural}>
                ${
                  shows("filters")
                    ? html`<ui-filter-builder
                        .fields=${this._filterFields()}
                        .value=${filters}
                        .match=${match}
                        @ui-change=${(e: CustomEvent<{ value: FilterCondition[]; match: FilterMatch }>) =>
                          this._set({ filters: e.detail.value, match: e.detail.match })}
                      ></ui-filter-builder>`
                    : nothing
                }
                ${
                  ["cards", "list", "compact", "focus", "groups"].includes(view) && shows("filters")
                    ? html`<ui-select
                        slot="end"
                        size="sm"
                        width="auto"
                        leading=${m.list_view_sort()}
                        .options=${this._sortOptions()}
                        .value=${sort}
                        @change=${(e: Event) => this._set({ sort: (e.target as HTMLSelectElement).value })}
                      ></ui-select>`
                    : nothing
                }
                ${
                  !shows("layouts")
                    ? nothing
                    : html`<ui-select
                        slot="end"
                        size="sm"
                        width="auto"
                        leading=${m.list_view_view()}
                        .options=${this._layouts()}
                        .value=${view}
                        @change=${(e: Event) => this._view((e.target as HTMLSelectElement).value as ListLayout)}
                      ></ui-select>`
                }
                ${
                  shows("columns")
                    ? html`<ui-column-picker
                        slot="end"
                        .columns=${pickerColumns}
                        .hiddenColumns=${this.hiddenKeys}
                        .defaults=${this.hiddenDefaults}
                        ?customized=${arranged}
                        .density=${view === "table" ? this.#prefs.value.listDensity : undefined}
                        @ui-density=${(e: CustomEvent<{ density: "0" | "-1" | "-2" }>) =>
                          preferences.set({ listDensity: e.detail.density })}
                        @ui-change=${(e: CustomEvent<{ hidden: string[]; order: string[]; reset: boolean }>) => {
                          const { hidden, order, reset } = e.detail;
                          const slug = this.prefKey;
                          preferences.set((p) => ({
                            listColumns: { ...p.listColumns, [slug]: hidden },
                            listColumnOrder: { ...p.listColumnOrder, [slug]: order },
                            listColumnWidths: reset ? { ...p.listColumnWidths, [slug]: {} } : p.listColumnWidths,
                          }));
                          void this._load();
                        }}
                      ></ui-column-picker>`
                    : nothing
                }
                ${
                  this.tile && creatable
                    ? html`<ui-button
                        slot="end"
                        size="xs"
                        variant="tonal"
                        href=${dashboardPath("collections", this.slug, "create")}
                        >${m.list_view_new({ singular: singular.toLowerCase() })}</ui-button
                      >`
                    : nothing
                }
                ${
                  shows("export")
                    ? html`<ui-button
                        slot="end"
                        size="xs"
                        variant="text"
                        ?disabled=${!r?.totalDocs}
                        @click=${() => void this._export()}
                        ><ui-icon name="upload" size="sm"></ui-icon> ${m.list_view_export_csv()}</ui-button
                      >`
                    : nothing
                }
              </ui-toolbar>`
        }
        ${
          shows("search")
            ? html`<ui-search
                label=${m.list_view_search_by({ field: titleLabel.toLowerCase() })}
                .value=${this.typed}
                @input=${(e: Event) => {
                  this.typed = (e.target as HTMLInputElement).value;
                  clearTimeout(this.#typing);
                  this.#typing = setTimeout(() => this._set({ q: this.typed.trim() }), SEARCH_DELAY);
                }}
              ></ui-search>`
            : nothing
        }
      </ui-flex>

      ${
        count
          ? html`<ui-toolbar label=${m.list_view_selection()}>
              <ui-text variant="title-sm">${m.list_view_selected({ count })}</ui-text>
              ${
                !this.allMatching && r && this.selected.length === pageRows && r.totalDocs > pageRows
                  ? html`<ui-button size="xs" variant="text" @click=${() => (this.allMatching = true)}
                      >${
                        filtered
                          ? m.list_view_select_all_matching({ total: r.totalDocs })
                          : m.list_view_select_all({ total: r.totalDocs, things: plural.toLowerCase() })
                      }</ui-button
                    >`
                  : nothing
              }
              ${
                perms?.delete.permission
                  ? html`<ui-button size="xs" color="error" variant="tonal" @click=${() => (this.confirming = true)}
                      >${m.list_view_delete_count({ count })}</ui-button
                    >`
                  : nothing
              }
              <ui-button
                size="xs"
                variant="text"
                @click=${() => {
                  this.selected = [];
                  this.allMatching = false;
                }}
                >${m.list_view_clear_selection()}</ui-button
              >
            </ui-toolbar>`
          : nothing
      }
      ${
        view === "cards"
          ? this._cards(empty)
          : view === "list"
            ? this._rows(empty)
            : view === "calendar"
              ? this._calendar()
              : view !== "table" && view !== "board"
                ? this._visual(view, empty)
                : view === "board"
                  ? this._board(empty)
                  : html`<ui-table
                      size="md"
                      lines="one"
                      density=${this.#prefs.value.listDensity}
                      bordered
                      hover
                      ?selectable=${perms?.delete.permission && shows("select")}
                      .columns=${this._columns()}
                      .hiddenColumns=${this.hiddenKeys}
                      reorderable
                      resizable
                      .columnOrder=${this.columnOrder}
                      .columnWidths=${this.columnWidths}
                      @ui-columns=${(e: CustomEvent<{ order: string[]; widths: Record<string, number> }>) => {
                        const slug = this.prefKey;
                        preferences.set((p) => ({
                          listColumnOrder: { ...p.listColumnOrder, [slug]: e.detail.order },
                          listColumnWidths: { ...p.listColumnWidths, [slug]: e.detail.widths },
                        }));
                      }}
                      .rows=${r?.docs ?? []}
                      .selected=${this.selected}
                      .sort=${sort}
                      ?loading=${this.loading && !r}
                      skeleton-rows=${limit}
                      min-rows=${limit}
                      .empty=${empty}
                      @ui-sort=${(e: CustomEvent<{ sort: string }>) => this._set({ sort: e.detail.sort })}
                      @ui-select=${(e: CustomEvent<{ selected: number[] }>) => {
                        this.selected = e.detail.selected;
                        this.allMatching = false;
                      }}
                    ></ui-table>`
      }
      ${
        !shows("pager") || WHOLE.includes(view)
          ? nothing
          : html`<ui-flex justify="between" align="center" gap="4" wrap>
              <ui-flex gap="3" align="center" wrap>
                <ui-text variant="body-md" color="muted"
                  >${
                    !r
                      ? m.list_view_loading()
                      : r.totalDocs
                        ? m.list_view_range({
                            from: r.pagingCounter,
                            to: r.pagingCounter + r.docs.length - 1,
                            total: r.totalDocs,
                          })
                        : m.list_view_no_records()
                  }</ui-text
                >
                <ui-select
                  size="sm"
                  leading=${m.list_view_rows()}
                  .options=${["10", "25", "50", "100"]}
                  .value=${limit}
                  ?disabled=${!r?.totalDocs}
                  @change=${(e: Event) => this._set({ limit: (e.target as HTMLSelectElement).value })}
                ></ui-select>
              </ui-flex>
              <ui-pagination
                size="sm"
                prev-next
                .page=${r?.page ?? 1}
                .total=${Math.max(1, r?.totalPages ?? 1)}
                @ui-change=${(e: CustomEvent<{ page: number }>) => this._set({ page: e.detail.page })}
              ></ui-pagination>
            </ui-flex>`
      }
    </ui-flex>`;
    const dialogs = html`${this._sheet()}
      <ui-modal
        heading=${m.list_view_delete_heading({ count, singular, plural })}
        .open=${this.confirming}
        confirm-label=${m.list_view_delete()}
        confirm-tone="error"
        @ui-confirm=${() => this._deleteSelected()}
        @ui-close=${() => (this.confirming = false)}
      >
        <ui-text>${m.list_view_cannot_undo()}</ui-text>
      </ui-modal>`;
    if (this.tile) return html`${list}${dialogs}`;
    return html`<ui-flex direction="col" gap="0">
      <ui-board
        .items=${[
          ...(shows("header")
            ? [{ key: "header", size: "full", rows: "fit", remember: `list|${this.slug}|header`, content: header }]
            : []),
          ...around("beforeList"),
          {
            key: "list",
            size: "full",
            rows: "fit",
            remember: `list|${this.slug}|list|${this.query.limit}|${this.query.view ?? ""}`,
            content: html`<ui-tile size="full" bare>${list}</ui-tile>`,
          },
          ...around("afterList"),
        ]}
      ></ui-board>
      ${dialogs}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-list-view": DashboardListView;
  }
}
