import { text } from "../payload/util.ts";
import { intl, m } from "../i18n/index.ts";
import { LightElement } from "../components/base/light-element.ts";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api, ApiError } from "../api/client.ts";
import { parse, stringify } from "qs-esm";
import { todayIso, type DocumentViewSpec, type GlobalViewSpec } from "./widgets/widget.ts";
import type { Doc, FieldLike } from "../contracts/config.ts";
import {
  setIn,
  type DocFormChange,
  type JoinView,
  type RelationOption,
} from "../components/composed/forms/doc-form.ts";
import "../components/index.ts";
import type { Access } from "./app.ts";
import { viewElement } from "./views.ts";
import {
  cellText,
  columnsOf,
  addressOf,
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
  collectionSettings,
  toneOf,
  isToned,
} from "./shared.ts";
import type { RecordFact, RecordLink } from "../components/primitives/data/record.ts";
import type { Tone } from "../components/primitives/data/tag.ts";

type Data = Record<string, unknown>;

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
  const [value, unit, digits] =
    n < 1024 ? [n, "byte", 0] : n < 1024 ** 2 ? [n / 1024, "kilobyte", 0] : [n / 1024 ** 2, "megabyte", 1];
  return intl.number({ style: "unit", unit, unitDisplay: "short", maximumFractionDigits: digits }).format(value);
};

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

export interface DocState {
  title: string;
  loading: boolean;
  saving: boolean;
  dirty: boolean;
  canSave: boolean;
  found: boolean;
}

@customElement("dashboard-edit-view")
export class DashboardEditView extends LightElement {
  @property() slug = "";
  @property() docId = "";
  @property() globalSlug = "";
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user: (Doc & { collection: string }) | null = null;
  @property() tab = "";
  @property({ type: Boolean }) embedded = false;
  @property({ type: Boolean }) tile = false;
  @property() stateKey = "";
  @property({ attribute: false }) spec: DocumentViewSpec | GlobalViewSpec | null = null;
  @state() private urlTab = "";

  #readTab = () => {
    if (!this.stateKey) return;
    const own = (parse(location.search, { ignoreQueryPrefix: true, depth: 3 }) as Record<string, unknown>)[
      this.stateKey
    ];
    const tab = own && typeof own === "object" ? (own as { tab?: unknown }).tab : undefined;
    this.urlTab = typeof tab === "string" ? tab : "";
  };

  private get _tab() {
    return this.tab || this.urlTab || this.spec?.tab || "";
  }

  private _shows(part: string) {
    return !(this.spec?.hide as string[] | undefined)?.includes(part);
  }

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
    this._report();
  }

  #reported = "";
  private _report() {
    if (!this.embedded && !this.tile) return;
    const c = collectionOf(this.slug);
    const detail: DocState = {
      title:
        c && this.doc
          ? titleOf(c, this.doc)
          : c && !this.docId
            ? m.edit_view_new_title({ what: labels(c).singular.toLowerCase() })
            : "",
      loading: this.loading,
      saving: this.saving,
      dirty: this.dirty,
      canSave: !!this.access?.collections[this.slug]?.update.permission,
      found: !!this.doc,
    };
    const key = JSON.stringify(detail);
    if (key === this.#reported) return;
    this.#reported = key;
    this.dispatchEvent(new CustomEvent<DocState>("dashboard-doc-state", { detail }));
  }

  save() {
    if (!this.saving && !this.loading) void this._save();
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

  private _relationHref = (slug: string, id?: string) => dashboardPath("collections", slug, id ?? "create");

  private _keydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && !this._tab) {
      e.preventDefault();
      if (!this.saving && !this.loading) void this._save();
    }
  };

  private _beforeUnload = (e: BeforeUnloadEvent) => {
    if (this.dirty) e.preventDefault();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.#readTab);
    this.#readTab();
    window.addEventListener("keydown", this._keydown);
    window.addEventListener("beforeunload", this._beforeUnload);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.#readTab);
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
        this.dispatchEvent(new CustomEvent("dashboard-doc-saved", { detail: { id: this.docId } }));
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
    if (e.target !== e.currentTarget) return;
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
      .today=${todayIso()}
      .what=${this.globalSlug ? globalLabel(globalOf(this.globalSlug)!) : labels(collectionOf(this.slug)!).singular}
      .contextFields=${this._fields}
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
          ? html`<ui-card image-src=${url} .imageAlt=${text(this.doc?.alt ?? "")} size="sm">
              <ui-text variant="body-md">${text(this.doc?.filename)}</ui-text>
            </ui-card>`
          : url
            ? html`<ui-link href=${url} external>${text(this.doc?.filename)}</ui-link>`
            : nothing
      }
      <ui-file-input
        .legend=${this.doc ? m.edit_view_replace_file() : m.edit_view_file_required()}
        @ui-change=${(e: CustomEvent<{ files: FileList | null }>) => {
          this.file = e.detail.files?.[0] ?? null;
          this.dirty = true;
        }}
      ></ui-file-input>
      ${
        this.doc
          ? html`<ui-text variant="body-sm" color="muted"
              >${text(this.doc.mimeType)} ·
              ${intl.number({ style: "unit", unit: "byte", unitDisplay: "long" }).format(Number(this.doc.filesize))}
              ${this.doc.width ? html`· ${this.doc.width}×${this.doc.height}` : nothing}</ui-text
            >`
          : nothing
      }
    </ui-flex>`;
  }

  private _stage() {
    const c = this.slug ? collectionOf(this.slug) : undefined;
    const cfg = c && collectionSettings(c).edit?.steps;
    const f = cfg && dataFields(fieldsOf(c)).find((x) => x.name === cfg.field);
    if (!c || !cfg || !f || !this.doc) return nothing;
    const raw = this.doc[cfg.field];
    const value = typeof raw === "string" ? raw : "";
    const skip = cfg.skip ?? [];
    const options = (f.options ?? [])
      .map((o) => (typeof o === "string" ? { value: o, label: o } : { value: o.value, label: text(o.label) }))
      .filter((o) => !skip.includes(o.value));
    const off = skip.includes(value);
    return html`<ui-flex direction="col" gap="2">
      ${off ? html`<ui-flex><ui-tag .tone=${toneOf(f, value, value)}>${value}</ui-tag></ui-flex>` : nothing}
      <ui-steps
        scrollable
        .tone=${off ? "error" : "primary"}
        .current=${options.findIndex((o) => o.value === value)}
        .items=${options.map((o) => ({ label: o.label }))}
      ></ui-steps>
    </ui-flex>`;
  }

  private _hero() {
    if (!this._shows("summary") || !this.doc) return nothing;
    const g = this.globalSlug ? globalOf(this.globalSlug) : undefined;
    const c = g ? undefined : collectionOf(this.slug);
    if (!g && (!c || !this.docId)) return nothing;
    const doc = this.doc;
    const fields = dataFields(this._fields);
    const labelOf = (f: FieldLike) => (typeof f.label === "string" ? f.label : humanize(f.name ?? ""));
    const has = (f: FieldLike) => doc[f.name!] != null && doc[f.name!] !== "";
    const settings = c ? collectionSettings(c) : undefined;
    const statusName = settings?.list?.status ?? settings?.edit?.steps?.field;
    const toned = fields.filter((f) => isToned(f) && has(f));
    const status = (statusName ? toned.find((f) => f.name === statusName) : undefined) ?? toned[0];
    const tagOf = (f: FieldLike): { label: string; tone: Tone } => {
      const label = cellText(f, doc[f.name!]);
      return { label, tone: toneOf(f, doc[f.name!], label) };
    };
    const figures: RecordFact[] = fields
      .filter((f) => f.type === "number" && (g || (f.custom as { number?: unknown } | undefined)?.number) && has(f))
      .slice(0, 4)
      .map((f) => ({ label: labelOf(f), value: cellText(f, doc[f.name!], doc) }));
    const links: RecordLink[] = [];
    for (const f of fields) {
      if (f.type !== "relationship" || f.hasMany || typeof f.relationTo !== "string" || !has(f)) continue;
      const id = String(doc[f.name!]);
      const name = this.relations[f.relationTo]?.find((o) => String(o.value) === id)?.label;
      if (name)
        links.push({
          label: m.edit_view_link({ field: labelOf(f), name }),
          href: dashboardPath("collections", f.relationTo, id),
        });
    }
    for (const f of joinFieldsOf(this._fields)) {
      const view = this.joins[f.name!];
      const related = collectionOf(f.collection);
      const on = (f as { on?: string }).on;
      if (!view || !related) continue;
      const href = on
        ? `${dashboardPath("collections", related.slug)}${stringify(
            { filters: [{ field: on, operator: "equals", value: String(doc.id) }] },
            { addQueryPrefix: true, encodeValuesOnly: true },
          )}`
        : undefined;
      links.push({ label: labelOf(f), count: view.total, href });
    }
    const updated = doc.updatedAt ? m.edit_view_updated({ date: formatDate(doc.updatedAt) }) : "";
    const name = g ? globalLabel(g) : titleOf(c!, doc);
    return html`<ui-record-hero
      .record=${{
        key: String(doc.id ?? g?.slug),
        title: name,
        eyebrow: g ? m.edit_view_setting() : labels(c!).singular,
        supporting: g && typeof g.admin?.description === "string" ? g.admin.description : undefined,
        status: status ? tagOf(status) : undefined,
      }}
      .tags=${toned
        .filter((f) => f !== status)
        .slice(0, 3)
        .map(tagOf)}
      .figures=${figures}
      .links=${links.slice(0, 8)}
      .meta=${updated}
    ></ui-record-hero>`;
  }

  #before?: HTMLElement;
  private _summary() {
    const c = this.slug ? collectionOf(this.slug) : undefined;
    const g = this.globalSlug ? globalOf(this.globalSlug) : undefined;
    const owner = g ?? c;
    const before = owner && collectionSettings(owner).edit?.before;
    if (!before?.length || (!this.docId && !g)) return nothing;
    this.#before ??= document.createElement("app-widgets");
    Object.assign(this.#before, {
      page: { widgets: before },
      docId: this.docId,
      slug: g ? g.slug : this.slug,
      user: this.user,
    });
    return this.#before;
  }

  render() {
    if (this.loading) return html`<ui-empty-state loading></ui-empty-state>`;
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
      return html`<ui-alert tone="warning" heading=${m.edit_view_not_found()}
        >${m.edit_view_not_found_body()}</ui-alert
      >`;
    }

    const { main, sidebar } = splitSidebar(this._fields);
    const readonly = !canSave;
    const heading = g
      ? globalLabel(g)
      : this.docId
        ? titleOf(c!, this.doc)
        : m.edit_view_create_title({ what: labels(c!).singular });
    const crumbs = g
      ? [{ label: m.edit_view_dashboard(), href: dashboardPath() }, { label: heading }]
      : isAccount
        ? [{ label: m.edit_view_dashboard(), href: dashboardPath() }, { label: m.edit_view_account() }]
        : [
            { label: m.edit_view_dashboard(), href: dashboardPath() },
            {
              label: labels(c!).plural,
              href: addressOf(`/collections/${encodeURIComponent(this.slug)}`)
                ? dashboardPath("collections", this.slug)
                : undefined,
            },
            { label: heading },
          ];

    const tabs = g ? editTabs(g) : c && this.docId ? editTabs(c) : [];
    const base = g
      ? dashboardPath("globals", g.slug)
      : c && this.docId
        ? dashboardPath("collections", c.slug, this.docId)
        : "";
    const tabBar =
      tabs.length && this._shows("tabs")
        ? html`<ui-tabs
            variant="primary"
            label=${m.edit_view_sections({ what: heading })}
            .active=${this._tab ? tabs.findIndex((t) => t.key === this._tab) + 1 : 0}
            .items=${[{ label: m.edit_view_details(), href: base }, ...tabs.map((t) => ({ label: t.label, href: `${base}${t.path}` }))]}
          ></ui-tabs>`
        : nothing;
    const active = tabs.find((t) => t.key === this._tab);
    if (this.tile && active && this.user) {
      const el = viewElement(active.Component, {
        ...active.props,
        access: this.access,
        user: this.user,
        slug: g ? g.slug : c!.slug,
        docId: this.docId,
      });
      return html`<ui-flex direction="col" gap="4">${tabBar}${el ?? nothing}</ui-flex>`;
    }
    if (active && this.user) {
      const el = viewElement(active.Component, {
        ...active.props,
        access: this.access,
        user: this.user,
        slug: g ? g.slug : c!.slug,
        docId: this.docId,
      });
      return html`<ui-board
        .items=${[
          {
            key: "header",
            size: "full",
            rows: "fit",
            remember: `edit|${this.globalSlug || this.slug}|${this._tab}|header`,
            content: html`<ui-flex direction="col" gap="4">
              <ui-page-header .heading=${heading}>
                <ui-breadcrumbs slot="breadcrumbs" .items=${crumbs}></ui-breadcrumbs>
              </ui-page-header>
              ${tabBar}
            </ui-flex>`,
          },
          {
            key: "view",
            size: "full",
            rows: "fit",
            remember: `edit|${this.globalSlug || this.slug}|${this._tab}|view`,
            flush: !!el,
            content:
              el ?? html`<ui-alert tone="info" heading=${active.label}>${m.edit_view_screen_loading()}</ui-alert>`,
          },
        ]}
      ></ui-board>`;
    }

    const hasSide = !!c?.upload || sidebar.length > 0 || !!c?.auth || !!this.doc;
    const side = html`<ui-flex direction="col" gap="4">
      ${c?.upload ? this._upload() : nothing} ${sidebar.length ? this._form(sidebar, readonly) : nothing}
      ${
        c?.auth
          ? html`<ui-text-input
                .legend=${this.docId ? m.edit_view_new_password() : m.edit_view_password_required()}
                hint=${this.docId ? m.edit_view_password_hint() : ""}
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
              ${this.errors.password ? html`<ui-text variant="body-md" color="error">${this.errors.password}</ui-text>` : nothing}`
          : nothing
      }
      ${
        this.doc
          ? html`<ui-box surface="base-200" rounded="box" padding="4">
              <ui-flex direction="col" gap="1">
                ${this.doc.id ? html`<ui-text variant="body-sm" color="muted">${m.edit_view_id()} <ui-text as="span" variant="body-sm" mono dir="ltr">${this.doc.id}</ui-text></ui-text>` : nothing}
                ${this.doc.updatedAt ? html`<ui-text variant="body-sm" color="muted">${m.edit_view_updated({ date: formatDate(this.doc.updatedAt) })}</ui-text>` : nothing}
                ${this.doc.createdAt ? html`<ui-text variant="body-sm" color="muted">${m.edit_view_created({ date: formatDate(this.doc.createdAt) })}</ui-text>` : nothing}
              </ui-flex>
            </ui-box>`
          : nothing
      }
    </ui-flex>`;

    const count = Object.keys(this.errors).length;
    const problems = count
      ? html`<ui-alert tone="error" heading=${m.edit_view_problems({ count })}
          >${Object.entries(this.errors)
            .slice(0, 3)
            .map(([path, message]) =>
              m.edit_view_problem({
                field: humanize(
                  path
                    .split(".")
                    .filter((p) => !/^\d+$/.test(p))
                    .pop() ?? path,
                ),
                message,
              }),
            )
            .join(" ")}${count > 3 ? " …" : ""}</ui-alert
        >`
      : nothing;

    if (this.tile) {
      const canDelete = this.docId && !isAccount && collectionPerms?.delete.permission && this._shows("delete");
      const home = !!(this.spec as { home?: boolean } | undefined)?.home && this._shows("header");
      const top =
        home || !canSave
          ? html`<ui-flex justify=${home ? "between" : "end"} align="center" gap="2" wrap>
              ${home ? html`<ui-breadcrumbs .items=${crumbs}></ui-breadcrumbs>` : nothing}
              ${canSave ? nothing : html`<ui-tag variant="outline">${m.edit_view_read_only()}</ui-tag>`}
            </ui-flex>`
          : nothing;
      const actions =
        canSave || canDelete
          ? html`<ui-divider></ui-divider>
              <ui-flex justify="end" align="center" gap="2" wrap>
                ${this.dirty ? html`<ui-tag tone="warning">${m.edit_view_unsaved()}</ui-tag>` : nothing}
                ${
                  canDelete
                    ? html`<ui-button variant="text" color="error" size="sm" @click=${() => (this.confirmDelete = true)}
                        >${m.edit_view_delete()}</ui-button
                      >`
                    : nothing
                }
                ${
                  canSave
                    ? html`<ui-button
                        type="submit"
                        color="primary"
                        .disabled=${this.saving || (!this.dirty && !!(this.docId || g))}
                        title=${m.edit_view_save_shortcut()}
                      >
                        ${
                          this.saving
                            ? m.edit_view_saving()
                            : this.docId || g
                              ? this.dirty
                                ? m.edit_view_save()
                                : m.edit_view_saved()
                              : m.edit_view_create()
                        }
                      </ui-button>`
                    : nothing
                }
              </ui-flex>`
          : nothing;
      return html`<ui-form label=${heading} @ui-submit=${() => this._save()}>
          <ui-flex direction="col" gap="5">
            ${top} ${this._hero()} ${this._stage()} ${tabBar} ${problems} ${this._form(main, readonly)}
            ${hasSide && this._shows("sidebar") ? side : nothing} ${actions}
          </ui-flex>
        </ui-form>
        <ui-modal
          heading=${m.edit_view_delete_confirm({ what: heading })}
          .open=${this.confirmDelete}
          confirm-label=${m.edit_view_delete()}
          confirm-tone="error"
          @ui-confirm=${() => this._delete()}
          @ui-close=${() => (this.confirmDelete = false)}
        >
          <ui-text>${m.edit_view_cannot_undo()}</ui-text>
        </ui-modal>`;
    }
    if (this.embedded) {
      return html`<ui-form label=${heading} @ui-submit=${() => this._save()}>
        <ui-flex direction="col" gap="5">
          ${this._hero()} ${this._stage()} ${problems} ${this._form(main, readonly)} ${hasSide ? side : nothing}
        </ui-flex>
      </ui-form>`;
    }

    const summary = this._summary();
    return html`<ui-form label=${heading} @ui-submit=${() => this._save()}>
      <ui-board
        .items=${[
          {
            key: "header",
            size: "full",
            rows: "fit",
            remember: `edit|${this.globalSlug || this.slug}|${this._tab}|header`,
            content: html`<ui-flex direction="col" gap="4">
              <ui-page-header>
                ${
                  this._shows("header")
                    ? html`<ui-breadcrumbs slot="breadcrumbs" .items=${crumbs}></ui-breadcrumbs>
                        <span slot="heading">${heading}</span>`
                    : nothing
                }
                <span slot="status"
                  >${this.dirty ? html`<ui-tag tone="warning">${m.edit_view_unsaved()}</ui-tag>` : nothing}</span
                >
                <ui-flex slot="actions" gap="2" wrap>
                  ${
                    this.docId && !isAccount && collectionPerms?.delete.permission && this._shows("delete")
                      ? html`<ui-button
                          variant="text"
                          color="error"
                          size="xs"
                          @click=${() => (this.confirmDelete = true)}
                          >${m.edit_view_delete()}</ui-button
                        >`
                      : nothing
                  }
                  ${
                    canSave
                      ? html`<ui-button
                          type="submit"
                          color="primary"
                          .disabled=${this.saving || (!this.dirty && !!(this.docId || g))}
                          title=${m.edit_view_save_shortcut()}
                        >
                          ${
                            this.saving
                              ? m.edit_view_saving()
                              : this.docId || g
                                ? this.dirty
                                  ? m.edit_view_save()
                                  : m.edit_view_saved()
                                : m.edit_view_create()
                          }
                        </ui-button>`
                      : html`<ui-tag variant="outline">${m.edit_view_read_only()}</ui-tag>`
                  }
                </ui-flex>
              </ui-page-header>
              ${
                c?.admin?.description && typeof c.admin.description === "string"
                  ? html`<ui-text color="muted">${c.admin.description}</ui-text>`
                  : nothing
              }
              ${this._stage()} ${tabBar} ${problems}
            </ui-flex>`,
          },
          ...(summary === nothing || !this._shows("around")
            ? []
            : [
                {
                  key: "summary",
                  size: "full",
                  rows: "fit",
                  flush: true,
                  remember: `edit|${this.globalSlug || this.slug}|summary`,
                  content: summary,
                },
              ]),
          {
            key: "main",
            size: "l",
            rows: "fit",
            content: html`<ui-tile size="l" bare>${this._form(main, readonly)}</ui-tile>`,
          },
          ...(hasSide && this._shows("sidebar")
            ? [
                {
                  key: "side",
                  size: "s",
                  rows: "fit",
                  remember: `edit|${this.globalSlug || this.slug}|side`,
                  content: html`<ui-tile size="s" bare>${side}</ui-tile>`,
                },
              ]
            : []),
        ]}
      ></ui-board>

      <ui-modal
        heading=${m.edit_view_delete_confirm({ what: heading })}
        .open=${this.confirmDelete}
        confirm-label=${m.edit_view_delete()}
        confirm-tone="error"
        @ui-confirm=${() => this._delete()}
        @ui-close=${() => (this.confirmDelete = false)}
      >
        <ui-text>${m.edit_view_cannot_undo()}</ui-text>
      </ui-modal>
    </ui-form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-edit-view": DashboardEditView;
  }
}
