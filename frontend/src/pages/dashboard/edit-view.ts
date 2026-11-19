import { text } from "../../cms/runtime/util.ts";
import { LightElement } from "../../components/base/light-element.ts";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api, ApiError } from "../../cms/client.ts";
import type { Doc, FieldLike } from "../../cms/types.ts";
import {
  setIn,
  type DocFormChange,
  type JoinView,
  type RelationOption,
} from "../../components/composed/forms/doc-form.ts";
import "../../components/index.ts";
import type { Access } from "./app.ts";
import { viewElement } from "./views.ts";
import {
  cellText,
  columnsOf,
  dashboardPath,
  collectionOf,
  dataFields,
  fieldsOf,
  formatDate,
  formFields,
  globalLabel,
  editTabs,
  globalOf,
  humanize,
  labels,
  navigate,
  splitSidebar,
  titleOf,
  toast,
  userSlug,
} from "./shared.ts";

type Data = Record<string, unknown>;

/** Relationship targets anywhere in a field tree. */
function relationTargets(fields: FieldLike[], out = new Set<string>()): Set<string> {
  for (const f of fields) {
    if (f.type === "relationship" || f.type === "upload") {
      for (const slug of Array.isArray(f.relationTo) ? f.relationTo : [f.relationTo]) if (slug) out.add(slug);
    }
    relationTargets(f.fields ?? [], out);
    for (const t of f.tabs ?? []) relationTargets(t.fields, out);
    for (const b of f.blocks ?? []) relationTargets(b.fields, out);
  }
  return out;
}

/** The collection's top-level join fields (shown as tables of the documents pointing at this one). */
function joinFieldsOf(fields: FieldLike[]): (FieldLike & { collection: string })[] {
  return fields.flatMap((f): (FieldLike & { collection: string })[] => {
    if (f.type === "join" && f.name) return [f as FieldLike & { collection: string }];
    if (f.type === "row" || f.type === "collapsible") return joinFieldsOf(f.fields ?? []);
    if (f.type === "tabs") return (f.tabs ?? []).flatMap((t) => (t.name ? [] : joinFieldsOf(t.fields)));
    return [];
  });
}

const fileSize = (bytes: unknown) => {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return "";
  return n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`;
};

/** Populated relationships (depth 1) back to ids, so the form edits plain values. */
function unpopulate(fields: FieldLike[], data: Data): Data {
  const out: Data = { ...data };
  const id = (v: unknown): unknown => {
    if (typeof v !== "object" || v === null) return v;
    const o = v as Data;
    if ("relationTo" in o && "value" in o) return { relationTo: o.relationTo, value: id(o.value) };
    return "id" in o ? o.id : v;
  };
  for (const f of fields) {
    if (f.type === "row" || f.type === "collapsible") Object.assign(out, unpopulate(f.fields ?? [], out));
    else if (f.type === "tabs") {
      for (const t of f.tabs ?? []) {
        if (t.name && typeof out[t.name] === "object" && out[t.name])
          out[t.name] = unpopulate(t.fields, out[t.name] as Data);
        else if (!t.name) Object.assign(out, unpopulate(t.fields, out));
      }
    } else if (!f.name) continue;
    else if (f.type === "relationship" || f.type === "upload") {
      const v = out[f.name];
      out[f.name] = Array.isArray(v) ? v.map(id) : id(v);
    } else if (f.type === "group" && typeof out[f.name] === "object" && out[f.name]) {
      out[f.name] = unpopulate(f.fields ?? [], out[f.name] as Data);
    } else if (f.type === "array" && Array.isArray(out[f.name])) {
      out[f.name] = (out[f.name] as Data[]).map((row) => unpopulate(f.fields ?? [], row));
    } else if (f.type === "blocks" && Array.isArray(out[f.name])) {
      out[f.name] = (out[f.name] as Data[]).map((row) =>
        unpopulate(f.blocks?.find((b) => b.slug === row.blockType)?.fields ?? [], row),
      );
    }
  }
  return out;
}

/**
 * Create / edit a document (`slug` + optional `docId`), or edit a global
 * (`globalSlug`). Sidebar fields go in a side column, as in Payload.
 */
@customElement("dashboard-edit-view")
export class DashboardEditView extends LightElement {
  @property() slug = "";
  @property() docId = "";
  @property() globalSlug = "";
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user: (Doc & { collection: string }) | null = null;
  /** A custom edit tab (`admin.components.views.edit.<key>`) to show instead of the form. */
  @property() tab = "";

  @state() private doc: Doc | null = null;
  @state() private value: Data = {};
  @state() private errors: Record<string, string> = {};
  @state() private relations: Record<string, RelationOption[]> = {};
  @state() private joins: Record<string, JoinView> = {};
  @state() private loading = true;
  @state() private saving = false;
  @state() private dirty = false;
  @state() private file: File | null = null;
  @state() private password = "";
  @state() private confirmDelete = false;

  protected updated(changed: PropertyValues<this>) {
    if (changed.has("slug") || changed.has("docId") || changed.has("globalSlug")) void this._load();
  }

  private get _fields(): FieldLike[] {
    if (this.globalSlug) return fieldsOf(globalOf(this.globalSlug)!);
    return formFields(collectionOf(this.slug)!);
  }

  private async _load() {
    this.loading = true;
    this.errors = {};
    this.file = null;
    this.password = "";
    this.dirty = false;
    try {
      const targets = [...relationTargets(this._fields)];
      const lists = await Promise.all(
        targets.map(async (slug) => {
          const c = collectionOf(slug);
          if (!c || this.access.collections[slug]?.read.permission === false) return [slug, []] as const;
          const { docs } = await api.find(slug, { limit: 0, depth: 0 });
          return [
            slug,
            docs.map((d): RelationOption => {
              // Uploads: the file's type and size under its name, and a preview when it's an image.
              const image = c.upload && text(d.mimeType ?? "").startsWith("image/") ? text(d.url ?? "") : "";
              const description = c.upload
                ? [text(d.mimeType ?? ""), fileSize(d.filesize)].filter(Boolean).join(" · ")
                : "";
              return {
                value: d.id,
                label: titleOf(c, d),
                doc: d,
                ...(description ? { description } : {}),
                ...(image ? { image } : {}),
              };
            }),
          ] as const;
        }),
      );
      this.relations = Object.fromEntries(lists);
      if (this.globalSlug) {
        const doc = (await api.findGlobal(this.globalSlug, { depth: 0 })) as Doc;
        this.doc = doc;
        this.value = unpopulate(this._fields, doc);
      } else if (this.docId) {
        const doc = await api.findByID(this.slug, this.docId, { depth: 0, joins: false });
        this.doc = doc;
        this.value = unpopulate(this._fields, doc);
        this.joins = await this._loadJoins();
      } else {
        this.doc = null;
        this.value = {};
      }
    } catch (e) {
      toast((e as Error).message, "error");
      this.doc = null;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Join fields: the related documents (`joins[<field>][count]`, depth 1 so they come as
   * documents), shown with the join's `admin.defaultColumns`.
   */
  private async _loadJoins(): Promise<Record<string, JoinView>> {
    const fields = joinFieldsOf(this._fields);
    if (!fields.length) return {};
    const doc = await api.findByID(this.slug, this.docId, {
      depth: 1,
      select: Object.fromEntries(fields.map((f) => [f.name!, true])),
      joins: Object.fromEntries(fields.map((f) => [f.name!, { count: true, limit: 10 }])),
    });
    return Object.fromEntries(
      fields.flatMap((f) => {
        const related = collectionOf(f.collection);
        const value = doc[f.name!] as { docs?: Doc[]; totalDocs?: number } | undefined;
        if (!related || !value) return [];
        const relatedFields = dataFields(formFields(related));
        const byName = new Map(relatedFields.map((x) => [x.name!, x]));
        const names = f.admin?.defaultColumns?.length
          ? f.admin.defaultColumns
          : columnsOf(related)
              .map((x) => x.name!)
              .slice(0, 4);
        const columns = names
          // The join's own field (pointing back here) says nothing on this page.
          .filter((n) => n !== (f as { on?: string }).on)
          .map((n) => {
            const field = byName.get(n);
            return { key: n, label: typeof field?.label === "string" ? field.label : humanize(n) };
          });
        const cell = (n: string, d: Doc) => {
          const field = byName.get(n) ?? { name: n, type: "text" };
          const v = d[n];
          const rel = typeof field.relationTo === "string" ? field.relationTo : undefined;
          if (rel && typeof v === "string") return this.relations[rel]?.find((o) => o.value === v)?.label ?? v;
          return cellText(field, v);
        };
        const view: JoinView = {
          columns,
          total: value.totalDocs ?? value.docs?.length ?? 0,
          rows: (value.docs ?? []).map((d) => ({
            id: String(d.id),
            href: dashboardPath("collections", related.slug, String(d.id)),
            cells: Object.fromEntries(columns.map((c) => [c.key, cell(c.key, d)])),
          })),
          ...(this.access.collections[related.slug]?.create.permission
            ? { createHref: dashboardPath("collections", related.slug, "create") }
            : {}),
        };
        return [[f.name!, view] as const];
      }),
    );
  }

  /** Related documents open in the dashboard; `create` makes a new one. */
  private _relationHref = (slug: string, id?: string) => dashboardPath("collections", slug, id ?? "create");

  /** Ctrl/⌘ + S saves, as in Payload. */
  private _keydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && !this.tab) {
      e.preventDefault();
      if (!this.saving && !this.loading) void this._save();
    }
  };

  /** Leaving with unsaved changes asks first (closing the tab or reloading). */
  private _beforeUnload = (e: BeforeUnloadEvent) => {
    if (this.dirty) e.preventDefault();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydown);
    window.addEventListener("beforeunload", this._beforeUnload);
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this._keydown);
    window.removeEventListener("beforeunload", this._beforeUnload);
    super.disconnectedCallback();
  }

  private async _save() {
    this.saving = true;
    this.errors = {};
    try {
      if (this.globalSlug) {
        const { message } = await api.updateGlobal(this.globalSlug, this.value);
        toast(message);
        await this._load();
        return;
      }
      const data: Data = { ...this.value };
      if (this.password) data.password = this.password;
      if (this.docId) {
        const { message } = await api.update(this.slug, this.docId, data, this.file);
        toast(message);
        await this._load();
      } else {
        const { doc, message } = await api.create(this.slug, data, this.file);
        toast(message);
        navigate(dashboardPath("collections", this.slug, doc.id), true);
      }
    } catch (e) {
      if (e instanceof ApiError) this.errors = e.fieldErrors;
      toast((e as Error).message, "error");
    } finally {
      this.saving = false;
    }
  }

  private async _delete() {
    this.confirmDelete = false;
    try {
      const { message } = await api.delete(this.slug, this.docId);
      toast(message);
      navigate(dashboardPath("collections", this.slug), true);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private _change = (e: CustomEvent<DocFormChange>) => {
    if (e.target !== e.currentTarget) return; // a primitive's own ui-change (e.g. tabs)
    this.value = setIn(this.value, e.detail.path, e.detail.fieldValue);
    this.dirty = true;
  };

  private _form(fields: FieldLike[], readonly: boolean) {
    return html`<ui-doc-form
      .fields=${fields}
      .value=${this.value}
      .errors=${this.errors}
      .relations=${this.relations}
      .joins=${this.joins}
      .relationHref=${this._relationHref}
      .user=${this.user}
      ?readonly=${readonly}
      @ui-change=${this._change}
    ></ui-doc-form>`;
  }

  private _upload() {
    const url = typeof this.doc?.url === "string" ? this.doc.url : "";
    const isImage = text(this.doc?.mimeType ?? "").startsWith("image/");
    return html`<ui-flex direction="col" gap="3">
      ${
        url && isImage
          ? html`<ui-card image-src=${url} .imageAlt=${text(this.doc?.alt ?? "")} variant="border" size="sm">
              <ui-text size="sm">${text(this.doc?.filename)}</ui-text>
            </ui-card>`
          : url
            ? html`<ui-link href=${url} external>${text(this.doc?.filename)}</ui-link>`
            : nothing
      }
      <ui-file-input
        .legend=${this.doc ? "Replace file" : "File *"}
        @ui-change=${(e: CustomEvent<{ files: FileList | null }>) => {
          this.file = e.detail.files?.[0] ?? null;
          this.dirty = true;
        }}
      ></ui-file-input>
      ${
        this.doc
          ? html`<ui-text size="xs" color="muted"
              >${text(this.doc.mimeType)} · ${Number(this.doc.filesize).toLocaleString("en-US")} bytes
              ${this.doc.width ? html`· ${this.doc.width}×${this.doc.height}` : nothing}</ui-text
            >`
          : nothing
      }
    </ui-flex>`;
  }

  render() {
    if (this.loading) return html`<ui-flex justify="center" padding="8"><ui-loading></ui-loading></ui-flex>`;
    const g = this.globalSlug ? globalOf(this.globalSlug) : undefined;
    const c = this.globalSlug ? undefined : collectionOf(this.slug)!;
    const collectionPerms = c ? this.access.collections[c.slug] : undefined;
    const canSave = g
      ? this.access.globals[g.slug]?.update.permission
      : this.docId
        ? collectionPerms?.update.permission
        : collectionPerms?.create.permission;
    const isAccount = c?.slug === userSlug && location.pathname.endsWith("/account");

    if (this.docId && !this.doc) {
      return html`<ui-alert color="warning" heading="Not found"
        >This document doesn't exist or you can't read it.</ui-alert
      >`;
    }

    const { main, sidebar } = splitSidebar(this._fields);
    const readonly = !canSave;
    const heading = g ? globalLabel(g) : this.docId ? titleOf(c!, this.doc) : `Create new ${labels(c!).singular}`;
    const crumbs = g
      ? [{ label: "Dashboard", href: dashboardPath() }, { label: heading }]
      : isAccount
        ? [{ label: "Dashboard", href: dashboardPath() }, { label: "Account" }]
        : [
            { label: "Dashboard", href: dashboardPath() },
            { label: labels(c!).plural, href: dashboardPath("collections", this.slug) },
            { label: heading },
          ];

    // Custom edit tabs (e.g. the case workspace): "Details" is the form, the rest are views.
    const tabs = c && this.docId ? editTabs(c) : [];
    const base = c && this.docId ? dashboardPath("collections", c.slug, this.docId) : "";
    const tabBar = tabs.length
      ? html`<ui-tabs
          variant="border"
          label=${`${heading} sections`}
          .active=${this.tab ? tabs.findIndex((t) => t.key === this.tab) + 1 : 0}
          .items=${[{ label: "Details", href: base }, ...tabs.map((t) => ({ label: t.label, href: `${base}${t.path}` }))]}
        ></ui-tabs>`
      : nothing;
    const active = tabs.find((t) => t.key === this.tab);
    if (active && this.user) {
      const el = viewElement(active.Component, {
        access: this.access,
        user: this.user,
        slug: c!.slug,
        docId: this.docId,
      });
      return html`<ui-flex direction="col" gap="6">
        <ui-flex direction="col" gap="1">
          <ui-breadcrumbs .items=${crumbs}></ui-breadcrumbs>
          <ui-heading level="1" size="page">${heading}</ui-heading>
        </ui-flex>
        ${tabBar} ${el ?? html`<ui-alert color="info" heading=${active.label}>This screen is loading.</ui-alert>`}
      </ui-flex>`;
    }

    const side = html`<ui-flex direction="col" gap="4">
      ${c?.upload ? this._upload() : nothing} ${sidebar.length ? this._form(sidebar, readonly) : nothing}
      ${
        c?.auth
          ? html`<ui-text-input
                .legend=${this.docId ? "New password" : "Password *"}
                hint=${this.docId ? "Leave empty to keep the current password." : ""}
                type="password"
                autocomplete="new-password"
                field-width="full"
                width="full"
                .value=${this.password}
                ?readonly=${readonly}
                @input=${(e: Event) => {
                  this.password = (e.target as HTMLInputElement).value;
                  this.dirty = true;
                }}
              ></ui-text-input>
              ${this.errors.password ? html`<ui-text size="sm" color="error">${this.errors.password}</ui-text>` : nothing}`
          : nothing
      }
      ${
        this.doc
          ? html`<ui-box surface="base-200" rounded="box" padding="4">
              <ui-flex direction="col" gap="1">
                ${this.doc.id ? html`<ui-text size="xs" color="muted">ID <ui-text as="span" size="xs" mono>${this.doc.id}</ui-text></ui-text>` : nothing}
                ${this.doc.updatedAt ? html`<ui-text size="xs" color="muted">Updated ${formatDate(this.doc.updatedAt)}</ui-text>` : nothing}
                ${this.doc.createdAt ? html`<ui-text size="xs" color="muted">Created ${formatDate(this.doc.createdAt)}</ui-text>` : nothing}
              </ui-flex>
            </ui-box>`
          : nothing
      }
    </ui-flex>`;

    return html`<ui-form label=${heading} @ui-submit=${() => this._save()}>
      <ui-flex direction="col" gap="6">
        <ui-flex justify="between" align="end" gap="4" wrap>
          <ui-flex direction="col" gap="1">
            <ui-breadcrumbs .items=${crumbs}></ui-breadcrumbs>
            <ui-flex align="center" gap="3" wrap>
              <ui-heading level="1" size="page">${heading}</ui-heading>
              ${this.dirty ? html`<ui-badge color="warning" variant="soft" size="sm">Unsaved changes</ui-badge>` : nothing}
            </ui-flex>
          </ui-flex>
          <ui-flex gap="2" wrap>
            ${
              this.docId && !isAccount && collectionPerms?.delete.permission
                ? html`<ui-button variant="ghost" color="error" size="sm" @click=${() => (this.confirmDelete = true)}
                    >Delete</ui-button
                  >`
                : nothing
            }
            ${
              canSave
                ? html`<ui-button
                    type="submit"
                    color="primary"
                    .disabled=${this.saving || (!this.dirty && !!(this.docId || g))}
                    title="Ctrl + S"
                  >
                    ${this.saving ? "Saving…" : this.docId || g ? (this.dirty ? "Save" : "Saved") : "Create"}
                  </ui-button>`
                : html`<ui-badge variant="outline">Read only</ui-badge>`
            }
          </ui-flex>
        </ui-flex>

        ${
          c?.admin?.description && typeof c.admin.description === "string"
            ? html`<ui-text color="muted">${c.admin.description}</ui-text>`
            : nothing
        }
        ${tabBar}
        ${
          Object.keys(this.errors).length
            ? html`<ui-alert
                color="error"
                variant="soft"
                heading=${`${Object.keys(this.errors).length} ${Object.keys(this.errors).length === 1 ? "field needs" : "fields need"} attention`}
                >${Object.entries(this.errors)
                  .slice(0, 3)
                  .map(
                    ([path, message]) =>
                      `${humanize(
                        path
                          .split(".")
                          .filter((p) => !/^\d+$/.test(p))
                          .pop() ?? path,
                      )}: ${message}`,
                  )
                  .join(" ")}${Object.keys(this.errors).length > 3 ? " …" : ""}</ui-alert
              >`
            : nothing
        }
        <ui-grid
          sidebar
          gap="8"
          .items=${[
            { content: this._form(main, readonly), role: "main" },
            { content: side, role: "side" },
          ]}
        ></ui-grid>
      </ui-flex>

      <ui-modal
        heading=${`Delete ${heading}?`}
        .open=${this.confirmDelete}
        @ui-close=${() => (this.confirmDelete = false)}
      >
        <ui-text>This can't be undone.</ui-text>
        <ui-flex slot="actions" gap="2">
          <ui-button variant="ghost" @click=${() => (this.confirmDelete = false)}>Cancel</ui-button>
          <ui-button color="error" @click=${() => this._delete()}>Delete</ui-button>
        </ui-flex>
      </ui-modal>
    </ui-form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-edit-view": DashboardEditView;
  }
}
