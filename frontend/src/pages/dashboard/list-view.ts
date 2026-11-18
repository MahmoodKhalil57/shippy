import { text } from "../../cms/runtime/util.ts";
import { LightElement } from "../../components/base/light-element.ts";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Where } from "payload";
import { api } from "../../cms/client.ts";
import type { Doc, PaginatedDocs } from "../../cms/types.ts";
import "../../components/index.ts";
import type { TableColumn } from "../../components/primitives/data/table.ts";
import type { Access } from "./app.ts";
import { dashboardPath, cellText, collectionOf, columnsOf, labels, toast, useAsTitle } from "./shared.ts";

/** A collection's documents: search, sort, paginate, select and delete. */
@customElement("dashboard-list-view")
export class DashboardListView extends LightElement {
  @property() slug = "";
  @property({ attribute: false }) access!: Access;
  @state() private result: PaginatedDocs | null = null;
  @state() private search = "";
  @state() private sort = "";
  @state() private page = 1;
  @state() private limit = "10";
  @state() private selected: number[] = [];
  @state() private confirming = false;

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("slug")) {
      this.search = "";
      this.sort = "";
      this.page = 1;
      this.selected = [];
      this.result = null;
    }
  }

  protected updated(changed: PropertyValues<this>) {
    const keys = ["slug", "search", "sort", "page", "limit"];
    if (keys.some((k) => (changed as Map<PropertyKey, unknown>).has(k))) void this._load();
  }

  private async _load() {
    const c = collectionOf(this.slug)!;
    const where: Where | undefined = this.search ? { [useAsTitle(c)]: { like: this.search } } : undefined;
    this.result = await api.find(this.slug, {
      where,
      sort: this.sort || undefined,
      page: this.page,
      limit: Number(this.limit),
      depth: 1,
    });
    this.selected = [];
  }

  private async _deleteSelected() {
    const ids = this.selected.map((i) => this.result!.docs[i].id);
    this.confirming = false;
    try {
      const { message, errors } = await api.deleteMany(this.slug, { id: { in: ids } });
      toast(message, errors.length ? "warning" : "success");
    } catch (e) {
      toast((e as Error).message, "error");
    }
    await this._load();
  }

  render() {
    const c = collectionOf(this.slug)!;
    const perms = this.access.collections[this.slug];
    const { singular, plural } = labels(c);
    const columns = columnsOf(c);
    const title = useAsTitle(c);
    const titleField = columns.find((f) => f.name === title);
    const titleLabel = typeof titleField?.label === "string" ? titleField.label : title === "id" ? "ID" : title;
    const tableColumns: TableColumn<Doc>[] = columns.map((f) => ({
      key: f.name!,
      label:
        typeof f.label === "string"
          ? f.label
          : f.name === "updatedAt"
            ? "Updated"
            : f.name![0].toUpperCase() + f.name!.slice(1),
      render: (doc: Doc) =>
        f.name === title || (f === columns[0] && !columns.some((x) => x.name === title))
          ? html`<ui-link href=${dashboardPath("collections", this.slug, doc.id)} color="primary"
              >${cellText(f, doc[f.name!])}</ui-link
            >`
          : html`<ui-text size="sm">${cellText(f, doc[f.name!])}</ui-text>`,
    }));
    const sortOptions = [
      { label: "Default order", value: "" },
      ...columns.flatMap((f) => [
        { label: `${text(f.label ?? f.name)} ↑`, value: f.name! },
        { label: `${text(f.label ?? f.name)} ↓`, value: `-${f.name}` },
      ]),
    ];
    const r = this.result;

    return html`<ui-flex direction="col" gap="6">
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

      <ui-flex gap="3" align="center" wrap>
        <ui-text-input
          icon="search"
          type="search"
          width="fill"
          placeholder=${`Search by ${titleLabel.toLowerCase()}`}
          .value=${this.search}
          @input=${(e: Event) => {
            this.search = (e.target as HTMLInputElement).value;
            this.page = 1;
          }}
        ></ui-text-input>
        <ui-select
          leading="Sort"
          .options=${sortOptions}
          .value=${this.sort}
          @change=${(e: Event) => (this.sort = (e.target as HTMLSelectElement).value)}
        ></ui-select>
        <ui-select
          leading="Per page"
          .options=${["10", "25", "50", "100"]}
          .value=${this.limit}
          @change=${(e: Event) => {
            this.limit = (e.target as HTMLSelectElement).value;
            this.page = 1;
          }}
        ></ui-select>
        ${
          this.selected.length && perms?.delete.permission
            ? html`<ui-button color="error" variant="soft" @click=${() => (this.confirming = true)}>
                Delete ${this.selected.length} selected
              </ui-button>`
            : nothing
        }
      </ui-flex>

      ${
        !r
          ? html`<ui-flex justify="center" padding="8"><ui-loading></ui-loading></ui-flex>`
          : r.totalDocs === 0
            ? html`<ui-box border rounded="box" padding="8">
                <ui-flex direction="col" align="center" gap="2">
                  <ui-text weight="semibold">No ${plural.toLowerCase()} found</ui-text>
                  <ui-text size="sm" color="muted"
                    >${this.search ? "Try a different search." : "Create the first one."}</ui-text
                  >
                </ui-flex>
              </ui-box>`
            : html`<ui-table
                  size="sm"
                  nowrap="max-lg"
                  bordered
                  ?selectable=${perms?.delete.permission}
                  .columns=${tableColumns}
                  .rows=${r.docs}
                  @ui-select=${(e: CustomEvent<{ selected: number[] }>) => (this.selected = e.detail.selected)}
                ></ui-table>
                <ui-flex justify="between" align="center" gap="4" wrap>
                  <ui-text size="sm" color="muted">
                    ${r.pagingCounter}–${r.pagingCounter + r.docs.length - 1} of ${r.totalDocs}
                  </ui-text>
                  ${
                    r.totalPages > 1
                      ? html`<ui-pagination
                          size="sm"
                          prev-next
                          .page=${r.page}
                          .total=${r.totalPages}
                          @ui-change=${(e: CustomEvent<{ page: number }>) => (this.page = e.detail.page)}
                        ></ui-pagination>`
                      : nothing
                  }
                </ui-flex>`
      }

      <ui-modal
        heading=${`Delete ${this.selected.length} ${this.selected.length === 1 ? singular : plural}?`}
        .open=${this.confirming}
        @ui-close=${() => (this.confirming = false)}
      >
        <ui-text>This can't be undone (except by resetting the mock data to its seed).</ui-text>
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
