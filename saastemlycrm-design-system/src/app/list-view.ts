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

/**
 * A collection's documents as a data table, built on Payload's REST query parameters
 * (payloadcms.com/docs/rest-api/overview):
 * - `where`: the search box (the title field, also in English when typed in Arabic) and the
 *   filter builder's conditions;
 * - `sort`: the column headers (Shift-click sorts by several);
 * - `limit` / `page`: rows per page and the pager;
 * - `select`: only the columns on screen (and the title) come back;
 * - `depth` + `populate`: related documents come back with just their title;
 * - `joins`: join columns (a customer's orders) come back as counts.
 * The table's state lives in the URL (`?q=…&sort=…&filters[0][field]=…`), so a filtered view can be
 * bookmarked, shared, and survives a reload; the columns someone picks are remembered per collection.
 *
 * - **Rows are one line** (`<ui-table lines="one">`): 44px, cut with "…", a person as an avatar and
 *   name.
 * - **A record opens in a sheet over the list** (`<ui-sheet>` around the edit page's own form,
 *   `<dashboard-edit-view embedded>`), from a row, a card or a board card. The URL says which
 *   (`?open=<id>`), so it can be shared and Back closes it; "Open full page" and a new tab go to
 *   the record's own page, which stays as it was.
 * - **The board moves records**: a card dragged to another column (or sent there from its menu)
 *   changes at once, is saved with a PATCH, and the snackbar's Undo sends it back; a refused save
 *   returns the card and says why. Only for people who may update the collection.
 */

/** Field types a table cell can show. */
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
  label: name === "createdAt" ? "Created" : "Updated",
});
const labelOf = (f: FieldLike) =>
  typeof f.label === "string" ? f.label : f.name![0]!.toUpperCase() + f.name!.slice(1).replace(/([A-Z])/g, " $1");
const relatedSlug = (f: FieldLike) =>
  (f.type === "relationship" || f.type === "upload") && typeof f.relationTo === "string" ? f.relationTo : undefined;
/** A field that names one person: a relationship to a collection people sign in to. */
const isPerson = (f: FieldLike) => {
  const target = relatedSlug(f);
  return !!target && !f.hasMany && !!collectionOf(target)?.auth;
};
/** The URL's query, parsed (nested: `?cases[q]=…`). */
const urlQuery = () =>
  parse(location.search, { ignoreQueryPrefix: true, depth: 6, arrayLimit: 200 }) as Record<string, unknown>;
/** This list's part of the URL: everything under its key (`?cases[q]=…`), or the whole query without one. */
const ownQuery = (key: string): Record<string, unknown> | undefined => {
  const raw = urlQuery();
  if (!key) return raw;
  const own = raw[key];
  return own && typeof own === "object" ? (own as Record<string, unknown>) : undefined;
};
/** The record the URL says is open in the sheet (`?<key>[open]=<id>`). */
const readOpen = (key: string) => {
  const open = ownQuery(key)?.open;
  return typeof open === "string" ? open : "";
};
/** How long the sheet takes to leave (its form stays in it meanwhile). */
const SHEET_LEAVES = 300;

/** Every column the collection's table can show: its listable fields, then the timestamps. */
function allColumns(c: CollectionConfig): FieldLike[] {
  const fields = dataFields(formFields(c)).filter((f) => LISTABLE.has(f.type) && !f.hidden && !f.admin?.hidden);
  const stamps = c.timestamps === false ? [] : ["createdAt", "updatedAt"].map(pseudo);
  const seen = new Set<string>();
  return [...columnsOf(c), ...fields, ...stamps].filter((f) => !seen.has(f.name!) && seen.add(f.name!));
}

/** The column that links to the record: the title, else the first column. It stays first. */
function linkColumnOf(c: CollectionConfig) {
  const title = useAsTitle(c);
  const all = allColumns(c);
  return all.some((f) => f.name === title) ? title : all[0]?.name;
}

/** Every column in the order someone arranged them (`preferences.listColumnOrder`), link column first. */
function orderedColumns(c: CollectionConfig, order: readonly string[] = []): FieldLike[] {
  const link = linkColumnOf(c);
  return orderColumns(
    allColumns(c).map((f) => ({ key: f.name!, fixed: f.name === link, f })),
    order,
  ).map((x) => x.f);
}

/** What the URL holds. */
interface ListQuery {
  q: string;
  sort: string;
  page: number;
  limit: string;
  filters: FilterCondition[];
  match: FilterMatch;
  /** Set only when the URL says (a shared link); otherwise the person's own choice applies. */
  view?: ListLayout;
  /** The calendar's month (YYYY-MM), when the URL says. */
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
/** Layouts that show the whole collection (as filtered) at once: no pages. */
const WHOLE: ListLayout[] = ["calendar", "timeline", "heatmap", "chart", "ranking", "treemap", "scatter"];
const DAY_MS = 86_400_000;
/** A name that is a code (GS-RFQ-0141, INV/2026/0371): its monogram comes from whom it's for. */
const CODE = /^[\p{Lu}\d]+[-/][\p{Lu}\d]/u;
const dayLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const DEFAULTS: ListQuery = { q: "", sort: "", page: 1, limit: "10", filters: [], match: "and" };

/** What the URL says for this list, else what its widget starts with (`CollectionViewSpec`). */
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

/** Pages already fetched this session, by collection and query (`DashboardListView._load`). */
const listCache = new Map<string, PaginatedDocs>();

@customElement("dashboard-list-view")
export class DashboardListView extends LightElement {
  @property() slug = "";
  /**
   * Its name in the URL: its state lives under it (`?cases[q]=…&cases[page]=2`), so several lists
   * share a page. Empty: the whole query.
   */
  @property() stateKey = "";
  /** What its widget says (./widgets/widget.ts `CollectionViewSpec`): presets, a fixed `where`, parts to hide. */
  @property({ attribute: false }) spec: CollectionViewSpec | null = null;
  /**
   * On a screen of widgets: the screen's action runner and scope, so cards, rows and the record
   * in focus carry what people can do to each record (its collection's `custom.actions`), as a
   * `records` widget's entries do. After an action the list reloads.
   */
  @property({ attribute: false }) ctx: ViewContext | null = null;
  @property({ attribute: false }) scope: WidgetScope | null = null;
  /**
   * In a `collection` widget's tile (./widgets/host.ts): only the list itself; the tile has the
   * heading and the count (`dashboard-list-count`, after each load), Create sits in the toolbar,
   * and the widgets around the list are tiles of the board beside it.
   */
  @property({ type: Boolean }) tile = false;
  /** Its heading and the line under it, when its widget names them (`title`, `subhead`): the collection's otherwise. */
  @property() heading = "";
  @property() subhead = "";
  @property({ attribute: false }) access!: Access;
  /** Who is signed in (the open record's form reads it). */
  @property({ attribute: false }) user: (Doc & { collection: string }) | null = null;
  @state() private result: PaginatedDocs | null = null;
  @state() private loading = false;
  @state() private query: ListQuery = { ...DEFAULTS };
  /** The search box as typed (the query follows after a pause). */
  @state() private typed = "";
  @state() private selected: number[] = [];
  /** Every document matching the filters is selected, not just this page's. */
  @state() private allMatching = false;
  @state() private confirming = false;
  /** Choices for relationship filters, by field. */
  @state() private relatedOptions: Record<string, { label: string; value: string }[]> = {};
  /** The record open in the sheet (the URL's `open`). */
  @state() private openId = "";
  /** The record whose form the sheet holds: it stays while the sheet slides out. */
  @state() private sheetId = "";
  /** What the open record's form says: its title, unsaved changes, saving. */
  @state() private doc: DocState | null = null;
  /** What to do once the open record's unsaved changes are let go (the question is on screen). */
  @state() private leaving: (() => void) | null = null;
  #prefs = new StoreController(this, preferences);
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
      // Another collection: nothing of this one's rows applies. The same collection set up anew:
      // its rows stay until the new ones are in (`_load`).
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

  /** Changes the query: back to page 1 unless the page itself changed; mirrored in the URL. */
  private _set(next: Partial<ListQuery>) {
    this.query = { ...this.query, ...("page" in next ? {} : { page: 1 }), ...next };
    this.selected = [];
    this.allMatching = false;
    history.replaceState(history.state, "", this._url());
  }

  /**
   * This list's address for its current state, with `open` as the record in the sheet: its own part
   * of the query (under its key), the rest of the URL as it is (other lists, the screen's parameters).
   */
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

  // ---------------------------------------------------------------- the record in the sheet

  /** Runs `then`; when the open record has unsaved changes, only after asking. */
  private _leave(then: () => void) {
    if (this.openId && this.doc?.dirty) this.leaving = then;
    else then();
  }

  /** Opens a record in the sheet: a new history entry, so Back closes it (another record replaces it). */
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

  /** The sheet is closed: the URL says so again (Back, when opening it added the entry), and its form goes. */
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

  /** Back and forward: the URL is the state (which record is open, the filters). */
  private _onPop = () => {
    if (!this.isConnected) return;
    const open = readOpen(this.stateKey);
    if (this.openId && open !== this.openId && this.doc?.dirty) {
      // Back with unsaved changes: stay on the record, and ask.
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

  /**
   * A click on one of this collection's records (a row, a card, a board card) opens it in the
   * sheet instead of its page; with a modifier key or the middle button it goes where links go.
   * Inside the sheet, a link that leaves the page asks first when there are unsaved changes.
   */
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
    // One of this collection's records (its canonical address) in this list: it opens in the sheet.
    const target = linkTarget(a.pathname.slice(DASHBOARD_ROUTE.length) || "/");
    if (target.kind !== "doc" || target.collection !== this.slug || target.tab) return;
    if (a.closest("dashboard-list-view") !== this) return;
    e.preventDefault();
    this._open(target.id);
  };

  /** The open record's form (it saves itself; the sheet's Save asks it to). */
  private get _form() {
    return this.querySelector<HTMLElementTagNameMap["dashboard-edit-view"]>("ui-sheet dashboard-edit-view");
  }

  /** The widgets around the list count its records: they load again after a change. */
  private _refreshAround() {
    for (const el of this.#around.values()) (el as { reload?: () => void }).reload?.();
  }

  // ---------------------------------------------------------------- columns and filters

  /**
   * Where this person's choices (columns, their order and widths, the layout) are kept: the
   * collection's, for its home list; for a list placed elsewhere with its own setup, that list's.
   */
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

  /** The shown columns, in the person's order (the table, the cards and the CSV export agree). */
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

  /** Relationship filters offer the related documents by title (`select` keeps it to the title). */
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

  // ---------------------------------------------------------------- loading

  /** The REST query for the current state (without paging when `all`). */
  private async _options(all = false): Promise<FindOptions> {
    const c = this.collection;
    const field = useAsTitle(c);
    const { q, sort, page, limit, filters, match } = this.query;
    // A name typed in Arabic (or another language) is also searched in English: "أطلس" finds Atlas.
    const english = q ? await toEnglish(q).catch(() => q) : "";
    const search: Where | undefined = !q
      ? undefined
      : english && english !== q
        ? { or: [{ [field]: { like: q } }, { [field]: { like: english } }] }
        : { [field]: { like: q } };
    const filtersWhere = filterWhere(filters, match, this._filterFields()) as Where | undefined;
    // The widget's own `where` is always applied, under what people search and filter.
    const fixed = this.spec?.where as Where | undefined;
    const parts = [fixed, search, filtersWhere].filter((w): w is Where => !!w);
    // The columns on screen, plus what cards and the board show (their field and card fields).
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
    // A calendar holds its month's records, all of them.
    const cal = this.view === "calendar" ? this.calendarField : undefined;
    if (cal) {
      const [y, m] = this._month.split("-").map(Number) as [number, number];
      const start = new Date(Date.UTC(y, m - 1, 1)).toISOString();
      const end = new Date(Date.UTC(y, m, 1)).toISOString();
      parts.push({ [cal.name!]: { greater_than_equal: start, less_than: end } } as Where);
    }
    const visible = [...new Set([...this.visible, ...shown])];
    // Records with actions come whole: an action's `when` and its `$row` paths read any field.
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

  /**
   * Loads the page the query asks for, stale while it revalidates: rows already fetched for this
   * exact query (`listCache`, kept for the session) show at once, the rows on screen stay while the
   * request runs (the skeleton only when there's nothing to show), and the answer replaces them
   * only if it differs.
   */
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

  // ---------------------------------------------------------------- actions

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

  /** Every matching document (all pages), visible columns only, as a CSV download. */
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
      const { singular, plural } = related ? labels(related) : { singular: "item", plural: "items" };
      return `${count} ${(count === 1 ? singular : plural).toLowerCase()}`;
    }
    return cellText(f, v, doc);
  }

  /**
   * A status or stage (a single select named `status`, `stage` or `…Status`) shows as a badge
   * coloured by its meaning: problems red, waiting amber, in progress blue, done green.
   */
  private _status(f: FieldLike, doc: Doc) {
    if (!isToned(f)) {
      // A category (a channel, a type): a chip in its option's hue, so the table isn't grey words.
      if (f.type !== "select" || f.hasMany) return undefined;
      const at = (f.options ?? []).findIndex((o) => (typeof o === "string" ? o : o.value) === String(doc[f.name!]));
      return at < 0 ? undefined : html`<ui-tag .hue=${at}>${this._cellText(f, doc)}</ui-tag>`;
    }
    const label = this._cellText(f, doc);
    if (!label || label === "—") return undefined;
    return html`<ui-tag .tone=${toneOf(f, doc[f.name!], label)}>${label}</ui-tag>`;
  }

  // ---------------------------------------------------------------- view

  /** The select field a board groups by (the collection's `custom.list.board`), if any. */
  private get boardField(): FieldLike | undefined {
    const name = collectionSettings(this.collection).list?.board;
    return name ? dataFields(formFields(this.collection)).find((f) => f.name === name) : undefined;
  }

  /** Table, cards or board: the URL's `view` if it says, else what this person last chose. */
  private get view(): ListLayout {
    const v = (this.query.view ??
      this.#prefs.value.listView[this.prefKey] ??
      this.spec?.layout ??
      "table") as ListLayout;
    return this._layouts().some((l) => l.value === v) ? v : "table";
  }

  /** The number fields a scatter plots (`custom.list.scatter`, else the first two number fields). */
  private _scatterFields(): FieldLike[] {
    const all = dataFields(formFields(this.collection));
    const spec = this.spec?.scatter;
    const named = spec?.x && spec.y ? [spec.x, spec.y] : collectionSettings(this.collection).list?.scatter;
    const numbers = all.filter((f) => f.type === "number");
    const pick = named ? named.flatMap((n) => numbers.filter((f) => f.name === n)) : numbers.slice(0, 2);
    return pick.length === 2 ? pick : [];
  }

  /** The date field a calendar lays records out by (the collection's `custom.list.calendar`), if any. */
  private get calendarField(): FieldLike | undefined {
    const name = collectionSettings(this.collection).list?.calendar;
    return name ? dataFields(formFields(this.collection)).find((f) => f.name === name && f.type === "date") : undefined;
  }

  /** The calendar's month: the URL's, else the month of the dashboard's today. */
  private get _month() {
    return this.query.month ?? todayIso().slice(0, 7);
  }

  /**
   * What a card or a row shows besides its facts: its status (the `list.status` field, else the
   * board's, else the first toned select), its figure (`list.figure`, else the first money field),
   * the person on it and the field over its title (`list.eyebrow`).
   */
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

  /** Whether cards and rows draw actions here: a screen's list, a collection with actions, not a table. */
  private _acting() {
    return (
      !!this.ctx &&
      !!this.scope &&
      this.view !== "table" &&
      !!(collectionSettings(this.collection) as { actions?: unknown[] }).actions?.length
    );
  }

  /** The screen's runner, reloading this list once an action is done. */
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

  /** A document as a card or a row: its title, status, figure, person and up to four facts. */
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
      // A record named by a code (an invoice, a case) takes the monogram of whom it's for: the
      // related record over its title, else the first related record among its facts.
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

  /** What people can do to this record, as its buttons (only where the list draws them). */
  private _actionsOf(doc: Doc) {
    if (!this._acting()) return undefined;
    const list = actionsFor(this.slug, doc, this.scope!);
    return list.length ? actionBar(list, this._runner!) : undefined;
  }

  /** The layouts this collection can take: a board and a calendar only where it names their fields. */
  private _layouts() {
    const { status, figure } = this._recordParts();
    const when = (ok: unknown, value: ListLayout, label: string) => (ok ? [{ value, label }] : []);
    return [
      { value: "table", label: "Table" },
      { value: "cards", label: "Cards" },
      { value: "list", label: "List" },
      { value: "compact", label: "Compact" },
      { value: "focus", label: "Focus, one at a time" },
      ...when(status, "groups", `Grouped by ${(status ? labelOf(status) : "").toLowerCase()}`),
      ...when(this.boardField, "board", "Board"),
      ...when(this.calendarField, "calendar", "Calendar"),
      ...when(this.calendarField, "timeline", "Timeline"),
      ...when(this.calendarField, "heatmap", "Heatmap"),
      ...when(this._chartParts().by, "chart", `Chart by ${this._chartParts().title}`),
      ...when(figure, "ranking", `Ranking by ${(figure ? labelOf(figure) : "").toLowerCase()}`),
      ...when(figure, "treemap", "Treemap"),
      ...when(this._scatterFields().length, "scatter", "Scatter"),
    ] as { value: ListLayout; label: string }[];
  }

  private _view(view: ListLayout) {
    preferences.set((p) => ({ listView: { ...p.listView, [this.prefKey]: view } }));
    this.selected = [];
    this.allMatching = false;
    this._set({ view, page: this.query.page });
  }

  /** Cards have no headers to sort by: the sortable columns, each way. */
  private _sortOptions() {
    return [
      { label: "Default order", value: "" },
      ...this._columns()
        .filter((c) => c.sortable && !this.hiddenKeys.includes(c.key))
        .flatMap((c) => [
          { label: `${text(c.label)} ↑`, value: c.key },
          { label: `${text(c.label)} ↓`, value: `-${c.key}` },
        ]),
    ];
  }

  /** The fields a card or board item shows under its title (`custom.list.cardFields`, else the visible columns). */
  private _cardFields(): FieldLike[] {
    const title = useAsTitle(this.collection);
    const names = collectionSettings(this.collection).list?.cardFields;
    const all = dataFields(formFields(this.collection));
    return names ? names.flatMap((n) => all.filter((f) => f.name === n)) : this.visible.filter((f) => f.name !== title);
  }

  /** The board's columns: the board field's options, by value. */
  private _boardOptions() {
    return (this.boardField?.options ?? []).map((o) =>
      typeof o === "string" ? { value: o, label: o } : { value: o.value, label: text(o.label) },
    );
  }

  /**
   * Moves a record to another column of the board: at once on screen, then saved (a PATCH of the
   * board field). The snackbar says where it went, with Undo, which sends it back the same way.
   * A refused save returns the card and says why.
   */
  private async _move(id: string, to: string, undoable = true) {
    const f = this.boardField;
    const doc = this.result?.docs.find((d) => String(d.id) === id);
    if (!f || !doc) return;
    const options = this._boardOptions();
    const none = `no ${labelOf(f).toLowerCase()}`;
    const label = (column: string) => options.find((o) => o.value === column)?.label ?? none;
    // Where it is now (src/components/base/kanban.ts: a value the board has no column for is in none).
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
        `${title} → ${label(to)}`,
        "success",
        undoable ? { label: "Undo", undo: true, onClick: () => void this._move(id, from, false) } : undefined,
      );
      this._refreshAround();
    } catch (e) {
      put(from);
      toast(`${title} stays in ${label(from)}: ${(e as Error).message}`, "error");
    }
  }

  /**
   * A board: one column per option of the board field, each record a card in its column. People
   * who may update the collection move a card by dragging it, or from its menu ("Move to …").
   */
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
      key === NONE ? `No ${labelOf(f).toLowerCase()}` : (options.find((o) => o.value === key)?.label ?? key);
    const movable = !!this.access.collections[this.slug]?.update.permission;
    const menu = (id: string, title: string, at: string) =>
      html`<ui-dropdown
        mode="popover"
        align="end"
        trigger-variant="text"
        trigger-size="xs"
        trigger-shape="round"
        trigger-spaced="false"
        .triggerLabel=${`Move ${title}`}
        .items=${options.filter((o) => o.value !== at).map((o) => ({ label: `Move to ${o.label}`, value: o.value }))}
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
      .label=${`${labels(c).plural} by ${labelOf(f).toLowerCase()}`}
      .columns=${items}
      @ui-move=${(e: CustomEvent<{ key: string; to: string }>) => void this._move(e.detail.key, e.detail.to)}
    ></ui-kanban>`;
  }

  #around = new Map<string, HTMLElement>();

  /** Payload's `admin.components.beforeList` / `afterList`: screens of widgets or elements around the list. */
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

  /** Each document as a card: its title, then the visible columns as label / value pairs. */
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

  /** Each document as a rich row: its monogram, name, facts, status and figure. */
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

  /** The records, or the loading or empty state, for the layouts drawn from them. */
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

  /** The record in focus (`focus`), its place among the records on screen. */
  @state() private focusAt = 0;

  /**
   * One record at a time, large (its summary), stepped through with the buttons or ← → (Home and
   * End for the ends; mirrored right to left): for going through a queue one by one.
   */
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
          label="Previous"
          size="sm"
          ?disabled=${at === 0}
          @click=${() => go(at - 1)}
        ></ui-icon-button>
        <ui-text variant="title-sm">${at + 1} of ${n}</ui-text>
        <ui-icon-button
          icon="chevron-right"
          label="Next"
          size="sm"
          ?disabled=${at === n - 1}
          @click=${() => go(at + 1)}
        ></ui-icon-button>
        ${rec.href ? html`<ui-button size="xs" variant="tonal" href=${rec.href}>Open</ui-button>` : nothing}
      </ui-flex>
      <ui-progress .value=${((at + 1) / n) * 100} max="100" label=${`${at + 1} of ${n}`}></ui-progress>
      <ui-record-hero
        .record=${rec}
        .figures=${[...(rec.figure ? [rec.figure] : []), ...(rec.facts ?? [])]}
        .meta=${rec.person ? `With ${rec.person}` : ""}
      ></ui-record-hero>
    </ui-flex>`;
  }

  /** The records under their status, in the field's own order, each group with its count. */
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
        const label = k ? this._cellText(f, rows[0]!) : `No ${labelOf(f).toLowerCase()}`;
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

  /** The records along their date (the calendar field), newest first, each with its status. */
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
        const when = longDate.format(new Date(String(d[f.name!])));
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

  /** How many records fall on each day (the calendar field), 12 weeks to the later of today and the last. */
  private _heatmap(docs: Doc[]) {
    const f = this.calendarField!;
    const counts = new Map<string, number>();
    for (const d of docs) {
      const v = d[f.name!];
      if (typeof v === "string") counts.set(v.slice(0, 10), (counts.get(v.slice(0, 10)) ?? 0) + 1);
    }
    const last = [todayIso(), ...counts.keys()].sort().at(-1)!;
    const end = Date.parse(`${last}T00:00:00Z`);
    // Twelve whole weeks, Sunday to Saturday, the last one holding `last`.
    const start = end - (new Date(end).getUTCDay() + 7 * 11) * DAY_MS;
    const days = Math.round((end - start) / DAY_MS) + 7 - new Date(end).getUTCDay();
    const { plural, singular } = labels(this.collection);
    const cells = Array.from({ length: days }, (_, i) => {
      const t = start + i * DAY_MS;
      const n = counts.get(new Date(t).toISOString().slice(0, 10)) ?? 0;
      return {
        label: dayLabel.format(new Date(t)).replace(",", ""),
        value: n,
        valueText: `${n} ${(n === 1 ? singular : plural).toLowerCase()}`,
      };
    });
    const total = cells.reduce((t, c) => t + c.value, 0);
    return html`<ui-heatmap
      .label=${`${plural} per day by ${labelOf(f).toLowerCase()}`}
      .summary=${`${total} ${plural.toLowerCase()} in 12 weeks by ${labelOf(f).toLowerCase()}`}
      .cells=${cells}
    ></ui-heatmap>`;
  }

  /**
   * What the `chart` layout charts: its widget's `chart` set-up, else the records by their calendar
   * date (by day), else by their status.
   */
  private _chartParts() {
    const spec = this.spec?.chart ?? {};
    const all = dataFields(formFields(this.collection));
    const named = (n?: string) => (n ? all.find((f) => f.name === n) : undefined);
    const by = named(spec.by) ?? this.calendarField ?? this._recordParts().status;
    const sum = named(spec.sum);
    const bucket = spec.bucket ?? "day";
    const title = by ? `${labelOf(by).toLowerCase()}${by.type === "date" && !spec.days ? `, by ${bucket}` : ""}` : "";
    return { by, sum, bucket, title, fields: [by, sum].filter((f): f is FieldLike => !!f) };
  }

  /**
   * How many records (or how much of `sum`) per day, week or month of a date, or per value of a
   * select or relationship; with `days`, every day from today, empty or not. Values read in the
   * summed field's format.
   */
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
        // Every bucket from the first to the last, empty ones too, at most 60.
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
          ? new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" })
          : new Intl.DateTimeFormat("en-GB", {
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
      sum && number ? formatNumber(v, { ...number, currencyField: undefined } as never) : v.toLocaleString("en-GB");
    return html`<ui-chart
      .kind=${spec.kind ?? "bars"}
      .label=${`${sum ? labelOf(sum) : plural} by ${labelOf(f).toLowerCase()}`}
      .labels=${keys.map(label)}
      .series=${[{ name: sum ? labelOf(sum) : plural, values: keys.map((k) => totals.get(k) ?? 0) }]}
      .format=${format}
    ></ui-chart>`;
  }

  /** The records by their figure: as bars, largest first (`ranking`), or as a treemap. */
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
        .label=${`${plural} by ${labelOf(f).toLowerCase()}`}
        .items=${valued.map(({ d, v }) => {
          const rec = this._record(d);
          return { label: rec.title, value: v, valueText: rec.figure?.value ?? String(v), href: rec.href };
        })}
      ></ui-treemap>`;
    return html`<ui-record-list
      .label=${`${plural} by ${labelOf(f).toLowerCase()}`}
      .records=${valued.map(({ d, v }) => ({ ...this._record(d), progress: v / most }))}
    ></ui-record-list>`;
  }

  /** The records on two of their numbers, split at the medians; pointing at one reads it. */
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
      .label=${`${labels(this.collection).plural}: ${labelOf(x).toLowerCase()} and ${labelOf(y).toLowerCase()}`}
      .xLabel=${labelOf(x)}
      .yLabel=${labelOf(y)}
      .xMid=${set.xMid}
      .yMid=${set.yMid}
      ?invert-y=${!!set.invertY}
      .quadrants=${set.quadrants}
      .points=${points}
    ></ui-quadrant>`;
  }

  /** A month of the records, each on its day (the calendar field's), its status as its dot. */
  private _calendar() {
    const f = this.calendarField!;
    const month = this._month;
    const [y, m] = month.split("-").map(Number) as [number, number];
    const shift = (n: number) => new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
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
    const name = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(
      new Date(Date.UTC(y, m - 1, 1)),
    );
    const today = todayIso();
    return html`<ui-flex direction="col" gap="3">
      <ui-flex align="center" gap="2" wrap>
        <ui-icon-button
          icon="chevron-left"
          label="Previous month"
          size="xs"
          @click=${() => this._set({ month: shift(-1) })}
        ></ui-icon-button>
        <ui-text variant="title-sm">${name}</ui-text>
        <ui-icon-button
          icon="chevron-right"
          label="Next month"
          size="xs"
          @click=${() => this._set({ month: shift(1) })}
        ></ui-icon-button>
        ${
          month !== today.slice(0, 7)
            ? html`<ui-button size="xs" variant="text" @click=${() => this._set({ month: today.slice(0, 7) })}
                >This month</ui-button
              >`
            : nothing
        }
        <ui-text variant="body-sm" color="muted">${events.length} by ${labelOf(f).toLowerCase()}</ui-text>
      </ui-flex>
      <ui-month
        .label=${`${labels(this.collection).plural} by ${labelOf(f).toLowerCase()}, ${name}`}
        .month=${month}
        .today=${today}
        .events=${events}
      ></ui-month>
    </ui-flex>`;
  }

  /**
   * The open record, in a sheet over the list: the edit page's own form, Save, and a link to its
   * full page. Closing it (Escape, the scrim, ✕, Back) asks first when there are unsaved changes.
   */
  private _sheet() {
    const c = this.collection;
    const id = this.sheetId;
    const s = this.doc;
    const row = this.result?.docs.find((d) => String(d.id) === id);
    const heading = s?.title || (row ? titleOf(c, row) : labels(c).singular);
    const own = (e: Event) => e.target === e.currentTarget;
    // Named once: the record's own summary (its badge, kind and title) leads the sheet, so the
    // sheet's header holds only its tools (unsaved, open full page) and the close button.
    return html`<ui-sheet
        size="lg"
        .label=${heading}
        .open=${!!this.openId}
        @ui-dismiss=${(e: Event) => {
          // Only the sheet's own question: unsaved changes are asked about before it closes.
          if (!own(e) || !this.doc?.dirty) return;
          e.preventDefault();
          this.leaving = () => this._closed();
        }}
        @ui-close=${(e: Event) => own(e) && this._closed()}
      >
        <span slot="trailing"
          >${s?.dirty ? html`<ui-tag tone="warning">Unsaved changes</ui-tag>` : nothing}${
            id
              ? html`<ui-icon-button
                  icon="external"
                  label="Open full page"
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
                    >${s.saving ? "Saving…" : s.dirty ? "Save" : "Saved"}</ui-button
                  >`
                : html`<ui-tag variant="outline">Read only</ui-tag>`
          }
        </ui-flex>
      </ui-sheet>
      <ui-modal
        heading="Discard unsaved changes?"
        .open=${!!this.leaving}
        confirm-label="Discard"
        confirm-tone="error"
        cancel-label="Keep editing"
        @ui-confirm=${() => {
          const then = this.leaving;
          this.leaving = null;
          // Let go: nothing asks again on the way out.
          if (this.doc) this.doc = { ...this.doc, dirty: false };
          then?.();
        }}
        @ui-close=${() => (this.leaving = null)}
      >
        <ui-text>What you changed in ${heading} hasn't been saved.</ui-text>
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
        // A person (the owner, the requester): their avatar before their name.
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
    // What its widget leaves out (`CollectionViewSpec.hide`).
    const hide = new Set(this.spec?.hide ?? []);
    const shows = (part: NonNullable<CollectionViewSpec["hide"]>[number]) => !hide.has(part);
    // Create only where a new record has somewhere to open (a document page holds this collection).
    const creatable =
      !!perms?.create.permission &&
      shows("create") &&
      !!addressOf(`/collections/${encodeURIComponent(this.slug)}/create`);
    const { singular, plural } = labels(c);
    const title = useAsTitle(c);
    const all = allColumns(c);
    const titleField = all.find((f) => f.name === title);
    const titleLabel = titleField ? labelOf(titleField) : title === "id" ? "ID" : title;
    const r = this.result;
    const { q, sort, limit, filters, match } = this.query;
    const filtered = !!q || filters.length > 0;
    const pageRows = r?.docs.length ?? 0;
    const count = this.allMatching ? (r?.totalDocs ?? 0) : this.selected.length;
    const view = this.view;
    const empty = html`<ui-flex direction="col" align="center" gap="2">
      <ui-text emphasized>No ${plural.toLowerCase()} ${filtered ? "match" : "yet"}</ui-text>
      ${
        filtered
          ? html`<ui-button
              size="xs"
              variant="text"
              @click=${() => {
                this.typed = "";
                this._set({ q: "", filters: [] });
              }}
              >Clear search and filters</ui-button
            >`
          : html`<ui-text variant="body-md" color="muted">Create the first one.</ui-text>`
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
        // Breadcrumbs on the collection's own page; a list placed among others is a part of its page.
        !this.spec || this.spec.home
          ? html`<ui-breadcrumbs
              slot="breadcrumbs"
              .items=${[{ label: "Dashboard", href: dashboardPath() }, { label: plural }]}
            ></ui-breadcrumbs>`
          : nothing
      }
      <ui-flex slot="actions" gap="2" wrap
        >${
          creatable
            ? html`<ui-button color="primary" href=${dashboardPath("collections", this.slug, "create")}
                >+ Create new ${singular}</ui-button
              >`
            : nothing
        }</ui-flex
      >
    </ui-page-header>`;
    // One board, everything on it: the header, the widgets around the list (boards of their own,
    // flush so their tiles lie on this one's) and the list, each the whole tiles that hold it.
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
    // The list itself: its toolbar, search, the records and the pager (a page draws it in a bare
    // tile under its header; a `collection` widget's tile holds it as its body: `tile`).
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
                        leading="Sort"
                        .options=${this._sortOptions()}
                        .value=${sort}
                        @change=${(e: Event) => this._set({ sort: (e.target as HTMLSelectElement).value })}
                      ></ui-select>`
                    : nothing
                }
                ${
                  !shows("layouts")
                    ? nothing
                    : // The layouts this collection can take, as one menu (up to 13: more than a row of buttons holds).
                      html`<ui-select
                        slot="end"
                        size="sm"
                        width="auto"
                        leading="View"
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
                        >+ New ${singular.toLowerCase()}</ui-button
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
                        ><ui-icon name="upload" size="sm"></ui-icon> Export CSV</ui-button
                      >`
                    : nothing
                }
              </ui-toolbar>`
        }
        ${
          shows("search")
            ? html`<ui-search
                label=${`Search by ${titleLabel.toLowerCase()}`}
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
          ? html`<ui-toolbar label="Selection">
              <ui-text variant="title-sm">${count} selected</ui-text>
              ${
                !this.allMatching && r && this.selected.length === pageRows && r.totalDocs > pageRows
                  ? html`<ui-button size="xs" variant="text" @click=${() => (this.allMatching = true)}
                      >Select all ${r.totalDocs} ${filtered ? "matching" : plural.toLowerCase()}</ui-button
                    >`
                  : nothing
              }
              ${
                perms?.delete.permission
                  ? html`<ui-button size="xs" color="error" variant="tonal" @click=${() => (this.confirming = true)}
                      >Delete ${count}</ui-button
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
                >Clear selection</ui-button
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
        // The paging row, the same in every state (loading, one page, many, none), so the
        // list is the same height whatever it holds: the count, the rows per page and the
        // pages (one page shows as page 1 of 1).
        // A calendar holds its whole month, and the whole-collection layouts everything: no pages.
        !shows("pager") || WHOLE.includes(view)
          ? nothing
          : html`<ui-flex justify="between" align="center" gap="4" wrap>
              <ui-flex gap="3" align="center" wrap>
                <ui-text variant="body-md" color="muted"
                  >${
                    !r
                      ? "Loading…"
                      : r.totalDocs
                        ? `${r.pagingCounter}–${r.pagingCounter + r.docs.length - 1} of ${r.totalDocs}`
                        : "No records"
                  }</ui-text
                >
                <ui-select
                  size="sm"
                  leading="Rows"
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
        heading=${`Delete ${count} ${count === 1 ? singular : plural}?`}
        .open=${this.confirming}
        confirm-label="Delete"
        confirm-tone="error"
        @ui-confirm=${() => this._deleteSelected()}
        @ui-close=${() => (this.confirming = false)}
      >
        <ui-text>This can't be undone.</ui-text>
      </ui-modal>`;
    // In a widget's tile: the tile has the heading and the count; the list is its body.
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
            // The page's main content: a bare tile, so no rows hide behind a height cap.
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
