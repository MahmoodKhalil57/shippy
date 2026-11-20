import { toEnglish } from "../agent/built-in-ai.ts";
import { text } from "../payload/util.ts";
import { LightElement } from "../components/base/light-element.ts";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CollectionConfig, Where } from "payload";
import { parse, stringify } from "qs-esm";
import { api, withBase, type FindOptions } from "../api/client.ts";
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
/** The record the URL says is open in the sheet (`?open=<id>`). */
const readOpen = () => new URLSearchParams(location.search).get("open") ?? "";
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
}
type ListLayout = "table" | "cards" | "board";
const DEFAULTS: ListQuery = { q: "", sort: "", page: 1, limit: "10", filters: [], match: "and" };

function readQuery(): ListQuery {
  const raw = parse(location.search, { ignoreQueryPrefix: true, depth: 5, arrayLimit: 200 }) as Record<string, unknown>;
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
    view: raw.view === "cards" || raw.view === "table" || raw.view === "board" ? raw.view : undefined,
  };
}

@customElement("dashboard-list-view")
export class DashboardListView extends LightElement {
  @property() slug = "";
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
    if (changed.has("slug")) {
      this.query = readQuery();
      this.typed = this.query.q;
      this.selected = [];
      this.allMatching = false;
      this.result = null;
      this.relatedOptions = {};
      this.openId = this.sheetId = readOpen();
      this.doc = null;
      this.leaving = null;
      void this._loadRelatedOptions();
    }
  }

  protected updated(changed: PropertyValues<this>) {
    if (changed.has("slug") || (changed as Map<PropertyKey, unknown>).has("query")) void this._load();
  }

  /** Changes the query: back to page 1 unless the page itself changed; mirrored in the URL. */
  private _set(next: Partial<ListQuery>) {
    this.query = { ...this.query, ...("page" in next ? {} : { page: 1 }), ...next };
    this.selected = [];
    this.allMatching = false;
    history.replaceState(history.state, "", this._url());
  }

  /** This list's address for its current state, with `open` as the record in the sheet. */
  private _url(open = this.openId) {
    const { q, sort, page, limit, filters, match, view } = this.query;
    const qs = stringify(
      {
        q: q || undefined,
        sort: sort || undefined,
        page: page > 1 ? page : undefined,
        limit: limit !== DEFAULTS.limit ? limit : undefined,
        filters: filters.length ? filters : undefined,
        match: filters.length > 1 && match === "or" ? match : undefined,
        view,
        open: open || undefined,
      },
      { addQueryPrefix: true, encodeValuesOnly: true },
    );
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
    const route = parseRoute(location.pathname);
    if (route.name !== "list" || route.slug !== this.slug) return;
    const open = readOpen();
    if (this.openId && open !== this.openId && this.doc?.dirty) {
      // Back with unsaved changes: stay on the record, and ask.
      history.pushState({ sheet: true }, "", this._url());
      this.leaving = () => (open ? this._open(open) : this._closed());
      return;
    }
    const query = readQuery();
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
    const route = parseRoute(to);
    if (path.some((n) => n instanceof Element && n.localName === "ui-sheet")) {
      if (route.name === "not-found" || !this.doc?.dirty) return;
      e.preventDefault();
      this.leaving = () => navigate(to + a.search);
      return;
    }
    if (route.name !== "edit" || route.slug !== this.slug || route.tab) return;
    e.preventDefault();
    this._open(route.id);
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

  private get hiddenDefaults() {
    const shown = new Set(columnsOf(this.collection).map((f) => f.name));
    return allColumns(this.collection)
      .map((f) => f.name!)
      .filter((n) => !shown.has(n));
  }

  private get hiddenKeys() {
    return this.#prefs.value.listColumns[this.slug] ?? this.hiddenDefaults;
  }

  private get columnOrder() {
    return this.#prefs.value.listColumnOrder[this.slug] ?? [];
  }

  private get columnWidths() {
    return this.#prefs.value.listColumnWidths[this.slug] ?? {};
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
    const parts = [search, filtersWhere].filter((w): w is Where => !!w);
    // The columns on screen, plus what cards and the board show (their field and card fields).
    const shown =
      this.view === "table"
        ? []
        : [...this._cardFields(), ...(this.view === "board" && this.boardField ? [this.boardField] : [])];
    const visible = [...new Set([...this.visible, ...shown])];
    const select: Select = Object.fromEntries([field, ...visible.map((f) => f.name!)].map((n) => [n, true]));
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
      page: all ? 1 : page,
      limit: all ? 0 : Number(limit),
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
      const result = await api.find(this.slug, await this._options());
      if (id !== this.#request) return;
      this.result = result;
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
    return cellText(f, v);
  }

  /**
   * A status or stage (a single select named `status`, `stage` or `…Status`) shows as a badge
   * coloured by its meaning: problems red, waiting amber, in progress blue, done green.
   */
  private _status(f: FieldLike, doc: Doc) {
    if (!isToned(f)) return undefined;
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
    const v = this.query.view ?? this.#prefs.value.listView[this.slug] ?? "table";
    return v === "board" && !this.boardField ? "table" : v;
  }

  private _view(view: ListLayout) {
    preferences.set((p) => ({ listView: { ...p.listView, [this.slug]: view } }));
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
    if (!r?.docs.length) return this.loading || !r ? html`<ui-empty-state loading></ui-empty-state>` : empty;
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
      return this.loading || !r
        ? html`<ui-grid fit="sm" gap="4">
            ${Array.from({ length: 6 }, () => html`<ui-skeleton template="rectangle"></ui-skeleton>`)}
          </ui-grid>`
        : html`<ui-box border rounded="box" padding="8">${empty}</ui-box>`;
    }
    const fields = this._cardFields().filter((f) => f.name !== title);
    return html`<ui-grid fit="sm" gap="4">
      ${r.docs.map(
        (doc) =>
          html`<ui-card
            size="sm"
            href=${dashboardPath("collections", this.slug, String(doc.id))}
            .heading=${titleOf(c, doc)}
          >
            <ui-description-list
              .items=${fields.map((f) => ({ label: labelOf(f), value: this._status(f, doc) ?? this._cellText(f, doc) }))}
            ></ui-description-list>
          </ui-card>`,
      )}
    </ui-grid>`;
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
    return html`<ui-sheet
        size="lg"
        .heading=${heading}
        .subhead=${heading === labels(c).singular ? "" : labels(c).singular}
        .open=${!!this.openId}
        @ui-dismiss=${(e: Event) => {
          // Only the sheet's own question: unsaved changes are asked about before it closes.
          if (!own(e) || !this.doc?.dirty) return;
          e.preventDefault();
          this.leaving = () => this._closed();
        }}
        @ui-close=${(e: Event) => own(e) && this._closed()}
      >
        <span slot="trailing">${s?.dirty ? html`<ui-tag tone="warning">Unsaved changes</ui-tag>` : nothing}</span>
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
          ${
            id
              ? html`<ui-button variant="text" href=${dashboardPath("collections", this.slug, id)}
                  >Open full page</ui-button
                >`
              : nothing
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

    return html`<ui-flex direction="col" gap="5">
      <ui-page-header
        .heading=${plural}
        .subtitle=${typeof c.admin?.description === "string" ? c.admin.description : ""}
      >
        <ui-breadcrumbs
          slot="breadcrumbs"
          .items=${[{ label: "Dashboard", href: dashboardPath() }, { label: plural }]}
        ></ui-breadcrumbs>
        <ui-flex slot="actions" gap="2" wrap
          >${
            perms?.create.permission
              ? html`<ui-button color="primary" href=${dashboardPath("collections", this.slug, "create")}
                  >+ Create new ${singular}</ui-button
                >`
              : nothing
          }</ui-flex
        >
      </ui-page-header>
      ${this._around("beforeList")}
      <ui-board
        .items=${[
          {
            key: "list",
            size: "full",
            // The page's main content: a bare tile, so no rows hide behind a height cap.
            content: html`<ui-tile size="full" bare>
              <ui-flex direction="col" gap="5">
                <ui-flex direction="col" gap="3">
                  <ui-toolbar .label=${plural}>
                    <ui-filter-builder
                      .fields=${this._filterFields()}
                      .value=${filters}
                      .match=${match}
                      @ui-change=${(e: CustomEvent<{ value: FilterCondition[]; match: FilterMatch }>) =>
                        this._set({ filters: e.detail.value, match: e.detail.match })}
                    ></ui-filter-builder>
                    ${
                      view === "cards"
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
                    <ui-button-group
                      slot="end"
                      label="View"
                      size="xs"
                      .value=${view}
                      .options=${[
                        { value: "table", label: "Table", icon: "table" },
                        { value: "cards", label: "Cards", icon: "grid" },
                        ...(this.boardField ? [{ value: "board", label: "Board", icon: "columns" as const }] : []),
                      ]}
                      @ui-change=${(e: CustomEvent<{ value: string }>) => this._view(e.detail.value as ListLayout)}
                    ></ui-button-group>
                    <ui-column-picker
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
                        const slug = this.slug;
                        preferences.set((p) => ({
                          listColumns: { ...p.listColumns, [slug]: hidden },
                          listColumnOrder: { ...p.listColumnOrder, [slug]: order },
                          listColumnWidths: reset ? { ...p.listColumnWidths, [slug]: {} } : p.listColumnWidths,
                        }));
                        void this._load();
                      }}
                    ></ui-column-picker>
                    <ui-button
                      slot="end"
                      size="xs"
                      variant="text"
                      ?disabled=${!r?.totalDocs}
                      @click=${() => void this._export()}
                      ><ui-icon name="upload" size="sm"></ui-icon> Export CSV</ui-button
                    >
                  </ui-toolbar>
                  <ui-search
                    label=${`Search by ${titleLabel.toLowerCase()}`}
                    .value=${this.typed}
                    @input=${(e: Event) => {
                      this.typed = (e.target as HTMLInputElement).value;
                      clearTimeout(this.#typing);
                      this.#typing = setTimeout(() => this._set({ q: this.typed.trim() }), SEARCH_DELAY);
                    }}
                  ></ui-search>
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
                            ? html`<ui-button
                                size="xs"
                                color="error"
                                variant="tonal"
                                @click=${() => (this.confirming = true)}
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
                    : view === "board"
                      ? this._board(empty)
                      : html`<ui-table
                          size="md"
                          lines="one"
                          density=${this.#prefs.value.listDensity}
                          bordered
                          hover
                          ?selectable=${perms?.delete.permission}
                          .columns=${this._columns()}
                          .hiddenColumns=${this.hiddenKeys}
                          reorderable
                          resizable
                          .columnOrder=${this.columnOrder}
                          .columnWidths=${this.columnWidths}
                          @ui-columns=${(e: CustomEvent<{ order: string[]; widths: Record<string, number> }>) => {
                            const slug = this.slug;
                            preferences.set((p) => ({
                              listColumnOrder: { ...p.listColumnOrder, [slug]: e.detail.order },
                              listColumnWidths: { ...p.listColumnWidths, [slug]: e.detail.widths },
                            }));
                          }}
                          .rows=${r?.docs ?? []}
                          .selected=${this.selected}
                          .sort=${sort}
                          ?loading=${this.loading}
                          .empty=${empty}
                          @ui-sort=${(e: CustomEvent<{ sort: string }>) => this._set({ sort: e.detail.sort })}
                          @ui-select=${(e: CustomEvent<{ selected: number[] }>) => {
                            this.selected = e.detail.selected;
                            this.allMatching = false;
                          }}
                        ></ui-table>`
                }
                ${
                  r && r.totalDocs > 0
                    ? html`<ui-flex justify="between" align="center" gap="4" wrap>
                        <ui-flex gap="3" align="center" wrap>
                          <ui-text variant="body-md" color="muted"
                            >${r.pagingCounter}–${r.pagingCounter + r.docs.length - 1} of ${r.totalDocs}</ui-text
                          >
                          <ui-select
                            size="sm"
                            leading="Rows"
                            .options=${["10", "25", "50", "100"]}
                            .value=${limit}
                            @change=${(e: Event) => this._set({ limit: (e.target as HTMLSelectElement).value })}
                          ></ui-select>
                        </ui-flex>
                        ${
                          r.totalPages > 1
                            ? html`<ui-pagination
                                size="sm"
                                prev-next
                                .page=${r.page}
                                .total=${r.totalPages}
                                @ui-change=${(e: CustomEvent<{ page: number }>) => this._set({ page: e.detail.page })}
                              ></ui-pagination>`
                            : nothing
                        }
                      </ui-flex>`
                    : nothing
                }
              </ui-flex>
            </ui-tile>`,
          },
        ]}
      ></ui-board>
      ${this._around("afterList")} ${this._sheet()}

      <ui-modal
        heading=${`Delete ${count} ${count === 1 ? singular : plural}?`}
        .open=${this.confirming}
        confirm-label="Delete"
        confirm-tone="error"
        @ui-confirm=${() => this._deleteSelected()}
        @ui-close=${() => (this.confirming = false)}
      >
        <ui-text>This can't be undone.</ui-text>
      </ui-modal>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-list-view": DashboardListView;
  }
}
