import { toEnglish } from "../../agent/built-in-ai.ts";
import { text } from "../../cms/runtime/util.ts";
import { LightElement } from "../../components/base/light-element.ts";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CollectionConfig, Where } from "payload";
import { parse, stringify } from "qs-esm";
import { api, type FindOptions } from "../../cms/client.ts";
import type { Select } from "../../cms/runtime/select.ts";
import type { Doc, FieldLike, PaginatedDocs } from "../../cms/types.ts";
import "../../components/index.ts";
import type { PickerColumn } from "../../components/primitives/data/column-picker.ts";
import {
  filterWhere,
  type FilterCondition,
  type FilterField,
  type FilterMatch,
} from "../../components/base/filter-query.ts";
import type { TableColumn } from "../../components/primitives/data/table.ts";
import { preferences, StoreController } from "../../stores/index.ts";
import type { Access } from "./app.ts";
import {
  cellText,
  collectionOf,
  columnsOf,
  dashboardPath,
  dataFields,
  formFields,
  labels,
  titleOf,
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
 * - `joins`: join columns (a customer's vessels) come back as counts.
 * The table's state lives in the URL (`?q=…&sort=…&filters[0][field]=…`), so a filtered view can be
 * bookmarked, shared, and survives a reload; the columns someone picks are remembered per collection.
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

/** Every column the collection's table can show: its listable fields, then the timestamps. */
function allColumns(c: CollectionConfig): FieldLike[] {
  const fields = dataFields(formFields(c)).filter((f) => LISTABLE.has(f.type) && !f.hidden && !f.admin?.hidden);
  const stamps = c.timestamps === false ? [] : ["createdAt", "updatedAt"].map(pseudo);
  const seen = new Set<string>();
  return [...columnsOf(c), ...fields, ...stamps].filter((f) => !seen.has(f.name!) && seen.add(f.name!));
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
  view?: "table" | "cards";
}
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
    view: raw.view === "cards" || raw.view === "table" ? raw.view : undefined,
  };
}

@customElement("dashboard-list-view")
export class DashboardListView extends LightElement {
  @property() slug = "";
  @property({ attribute: false }) access!: Access;
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
  #prefs = new StoreController(this, preferences);
  #request = 0;
  #typing?: ReturnType<typeof setTimeout>;

  private get collection() {
    return collectionOf(this.slug)!;
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("slug")) {
      this.query = readQuery();
      this.typed = this.query.q;
      this.selected = [];
      this.allMatching = false;
      this.result = null;
      this.relatedOptions = {};
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
      },
      { addQueryPrefix: true, encodeValuesOnly: true },
    );
    history.replaceState(history.state, "", `${location.pathname}${qs}`);
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

  private get visible() {
    const hidden = new Set(this.hiddenKeys);
    return allColumns(this.collection).filter((f) => !hidden.has(f.name!));
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
    const visible = this.visible;
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

  // ---------------------------------------------------------------- view

  /** Table or cards: the URL's `view` if it says, else what this person last chose for the collection. */
  private get view(): "table" | "cards" {
    return this.query.view ?? this.#prefs.value.listView[this.slug] ?? "table";
  }

  private _view(view: "table" | "cards") {
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
    const fields = this.visible.filter((f) => f.name !== title);
    return html`<ui-grid fit="sm" gap="4">
      ${r.docs.map(
        (doc) =>
          html`<ui-card
            variant="border"
            size="sm"
            href=${dashboardPath("collections", this.slug, String(doc.id))}
            .heading=${titleOf(c, doc)}
          >
            <ui-grid cols="2" gap="3">
              ${fields.map(
                (f) =>
                  html`<ui-flex direction="col" gap="0">
                    <ui-text size="xs" color="muted">${labelOf(f)}</ui-text>
                    <ui-text size="sm">${this._cellText(f, doc)}</ui-text>
                  </ui-flex>`,
              )}
            </ui-grid>
          </ui-card>`,
      )}
    </ui-grid>`;
  }

  private _columns(): TableColumn<Doc>[] {
    const c = this.collection;
    const title = useAsTitle(c);
    const linkColumn = allColumns(c).some((f) => f.name === title) ? title : allColumns(c)[0]?.name;
    return allColumns(c).map((f) => {
      const target = relatedSlug(f);
      return {
        key: f.name!,
        label: labelOf(f),
        align: f.type === "number" || isJoin(f) ? "end" : undefined,
        nowrap: f.name === linkColumn || !!target,
        sortable: !isJoin(f) && !f.hasMany && f.type !== "relationship" && f.type !== "upload",
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
          return this._cellText(f, doc);
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
      <ui-text weight="semibold">No ${plural.toLowerCase()} ${filtered ? "match" : "yet"}</ui-text>
      ${
        filtered
          ? html`<ui-button
              size="sm"
              variant="ghost"
              @click=${() => {
                this.typed = "";
                this._set({ q: "", filters: [] });
              }}
              >Clear search and filters</ui-button
            >`
          : html`<ui-text size="sm" color="muted">Create the first one.</ui-text>`
      }
    </ui-flex>`;
    const pickerColumns: PickerColumn[] = all.map((f) => ({
      key: f.name!,
      label: labelOf(f),
      required: f.name === title,
    }));

    return html`<ui-flex direction="col" gap="5">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1">
          <ui-breadcrumbs .items=${[{ label: "Dashboard", href: dashboardPath() }, { label: plural }]}></ui-breadcrumbs>
          <ui-heading level="1" size="page">${plural}</ui-heading>
          ${
            typeof c.admin?.description === "string"
              ? html`<ui-text color="muted">${c.admin.description}</ui-text>`
              : nothing
          }
        </ui-flex>
        ${
          perms?.create.permission
            ? html`<ui-button color="primary" href=${dashboardPath("collections", this.slug, "create")}
                >+ Create new ${singular}</ui-button
              >`
            : nothing
        }
      </ui-flex>

      <ui-flex direction="col" gap="3">
        <ui-flex justify="between" align="center" gap="2" wrap>
          <ui-filter-builder
            .fields=${this._filterFields()}
            .value=${filters}
            .match=${match}
            @ui-change=${(e: CustomEvent<{ value: FilterCondition[]; match: FilterMatch }>) =>
              this._set({ filters: e.detail.value, match: e.detail.match })}
          ></ui-filter-builder>
          <ui-flex gap="1" align="center" wrap>
            ${
              view === "cards"
                ? html`<ui-select
                    size="sm"
                    width="auto"
                    leading="Sort"
                    .options=${this._sortOptions()}
                    .value=${sort}
                    @change=${(e: Event) => this._set({ sort: (e.target as HTMLSelectElement).value })}
                  ></ui-select>`
                : nothing
            }
            <ui-join label="View">
              <ui-button
                size="sm"
                variant="ghost"
                label="Table view"
                ?active=${view === "table"}
                @click=${() => this._view("table")}
                ><ui-icon name="table" size="sm"></ui-icon> Table</ui-button
              >
              <ui-button
                size="sm"
                variant="ghost"
                label="Card view"
                ?active=${view === "cards"}
                @click=${() => this._view("cards")}
                ><ui-icon name="grid" size="sm"></ui-icon> Cards</ui-button
              >
            </ui-join>
            <ui-column-picker
              .columns=${pickerColumns}
              .hiddenColumns=${this.hiddenKeys}
              .defaults=${this.hiddenDefaults}
              @ui-change=${(e: CustomEvent<{ hidden: string[] }>) => {
                preferences.set((p) => ({ listColumns: { ...p.listColumns, [this.slug]: e.detail.hidden } }));
                void this._load();
              }}
            ></ui-column-picker>
            <ui-button size="sm" variant="ghost" ?disabled=${!r?.totalDocs} @click=${() => void this._export()}
              ><ui-icon name="upload" size="sm"></ui-icon> Export CSV</ui-button
            >
          </ui-flex>
        </ui-flex>
        <ui-text-input
          icon="search"
          type="search"
          width="full"
          placeholder=${`Search by ${titleLabel.toLowerCase()}`}
          .value=${this.typed}
          @input=${(e: Event) => {
            this.typed = (e.target as HTMLInputElement).value;
            clearTimeout(this.#typing);
            this.#typing = setTimeout(() => this._set({ q: this.typed.trim() }), SEARCH_DELAY);
          }}
        ></ui-text-input>
      </ui-flex>

      ${
        count
          ? html`<ui-flex gap="3" align="center" wrap>
              <ui-text size="sm" weight="semibold">${count} selected</ui-text>
              ${
                !this.allMatching && r && this.selected.length === pageRows && r.totalDocs > pageRows
                  ? html`<ui-button size="sm" variant="ghost" @click=${() => (this.allMatching = true)}
                      >Select all ${r.totalDocs} ${filtered ? "matching" : plural.toLowerCase()}</ui-button
                    >`
                  : nothing
              }
              ${
                perms?.delete.permission
                  ? html`<ui-button size="sm" color="error" variant="soft" @click=${() => (this.confirming = true)}
                      >Delete ${count}</ui-button
                    >`
                  : nothing
              }
              <ui-button
                size="sm"
                variant="ghost"
                @click=${() => {
                  this.selected = [];
                  this.allMatching = false;
                }}
                >Clear selection</ui-button
              >
            </ui-flex>`
          : nothing
      }
      ${
        view === "cards"
          ? this._cards(empty)
          : html`<ui-table
              size="md"
              nowrap="max-lg"
              bordered
              hover
              ?selectable=${perms?.delete.permission}
              .columns=${this._columns()}
              .hiddenColumns=${this.hiddenKeys}
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
                <ui-text size="sm" color="muted"
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

      <ui-modal
        heading=${`Delete ${count} ${count === 1 ? singular : plural}?`}
        .open=${this.confirming}
        @ui-close=${() => (this.confirming = false)}
      >
        <ui-text>This can't be undone.</ui-text>
        <ui-flex slot="actions" gap="2">
          <ui-button variant="ghost" @click=${() => (this.confirming = false)}>Cancel</ui-button>
          <ui-button color="error" @click=${() => this._deleteSelected()}>Delete</ui-button>
        </ui-flex>
      </ui-modal>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-list-view": DashboardListView;
  }
}
