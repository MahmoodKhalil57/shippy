import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Where } from "payload";
import { matches } from "../../../lib/payload/query.ts";
import type { FieldLike } from "../../../lib/contracts/config.ts";
import { fieldError, inputOf } from "../../../lib/contracts/fields.ts";
import type { DropdownItem } from "../../primitives/actions/dropdown.ts";
import { LightElement } from "../../base/light-element.ts";
import { AI_CHANGE } from "../../../lib/agent/ai-polyfill.ts";
import { suggest, supported, type SuggestField } from "../../../lib/agent/built-in-ai.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/actions/dropdown.ts";
import "../../primitives/data/table.ts";
import "../../primitives/forms/combobox.ts";
import "../../primitives/media/icon.ts";
import "../../primitives/navigation/link.ts";
import "../../primitives/containers/card.ts";
import "../../primitives/containers/collapse.ts";
import "../../primitives/data/badge.ts";
import "../../primitives/data/tag.ts";
import "../../primitives/feedback/empty-state.ts";
import "../../primitives/forms/checkbox.ts";
import "../../primitives/actions/button-group.ts";
import "../../primitives/forms/date-input.ts";
import "../../primitives/forms/field.ts";
import "../../primitives/forms/range.ts";
import "../../primitives/forms/rating.ts";
import "../../primitives/forms/scale.ts";
import "../../primitives/forms/stepper.ts";
import "../../primitives/forms/switch.ts";
import "../../primitives/forms/fieldset.ts";
import "../../primitives/forms/radio.ts";
import "../../primitives/forms/select.ts";
import "../../primitives/forms/text-input.ts";
import "../../primitives/forms/textarea.ts";
import "../ai/assist.ts";
import "../../primitives/layout/box.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/layout/grid.ts";
import "../../primitives/navigation/tabs.ts";
import "../../primitives/typography/text.ts";
import { intl, m } from "../../../lib/i18n/index.ts";
import { setIn } from "../../../lib/base/set-in.ts";

type Data = Record<string, unknown>;
type Path = (string | number)[];

export interface DocFormChange {
  value: Data;
  path: Path;
  fieldValue: unknown;
}

export interface RelationOption {
  value: string;
  label: string;
  description?: string;
  doc?: Data;
  image?: string;
}

export interface JoinView {
  columns: { key: string; label: string }[];
  rows: { id: string; href?: string; cells: Record<string, string> }[];
  total: number;
  createHref?: string;
}

const humanize = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const labelOf = (f: FieldLike) =>
  typeof f.label === "string" ? f.label : f.label === false ? "" : humanize(f.name ?? "");

const textOf = (v: unknown) => (typeof v === "string" ? v : undefined);

const text = (v: unknown): string =>
  typeof v === "string"
    ? v
    : typeof v === "number" || typeof v === "boolean"
      ? String(v)
      : v == null
        ? ""
        : JSON.stringify(v);

const isObj = (v: unknown): v is Data => typeof v === "object" && v !== null && !Array.isArray(v);

const newId = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");

const DATE_INPUT = { dayOnly: "date", dayAndTime: "datetime-local", timeOnly: "time", monthOnly: "month" } as const;
type DateAppearance = keyof typeof DATE_INPUT;
const appearanceOf = (f: FieldLike): DateAppearance => {
  const a = f.admin?.date?.pickerAppearance;
  return a && a in DATE_INPUT ? (a as DateAppearance) : "dayOnly";
};

const toInputDate = (iso: unknown, appearance: DateAppearance) => {
  if ((typeof iso !== "string" && !(iso instanceof Date)) || !iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  return {
    dayOnly: local.slice(0, 10),
    dayAndTime: local.slice(0, 16),
    timeOnly: local.slice(11, 16),
    monthOnly: local.slice(0, 7),
  }[appearance];
};
const fromInputDate = (v: string, appearance: DateAppearance, previous: unknown) => {
  if (!v) return null;
  if (appearance === "timeOnly") {
    const day = typeof previous === "string" && previous ? new Date(previous) : new Date();
    const [h, min] = v.split(":").map(Number) as [number, number];
    day.setHours(h, min, 0, 0);
    return day.toISOString();
  }
  return new Date(appearance === "monthOnly" ? `${v}-01T00:00` : v).toISOString();
};

interface SuggestSpec {
  field: SuggestField;
  toValue: (x: string | number | boolean) => unknown;
  label: (x: string | number | boolean) => string;
}
type Suggestion = { busy: true } | { value: unknown; label: string } | { note: string };
const dateLabel = (iso: string) => intl.date({ dateStyle: "medium" }).format(new Date(`${iso}T00:00`));

const valueFields = (fields: FieldLike[]): FieldLike[] =>
  fields.flatMap((f) =>
    f.type === "row" || f.type === "collapsible"
      ? valueFields(f.fields ?? [])
      : f.type === "tabs"
        ? (f.tabs ?? []).flatMap((t) => (t.name ? [] : valueFields(t.fields)))
        : f.name
          ? [f]
          : [],
  );

@customElement("ui-doc-form")
export class UiDocForm extends LightElement {
  @property({ attribute: false }) fields: FieldLike[] = [];
  @property({ attribute: false }) value: Data = {};
  @property({ attribute: false }) errors: Record<string, string> = {};
  @property({ attribute: false }) relations: Record<string, RelationOption[]> = {};
  @property({ type: Boolean }) readonly = false;
  @property({ attribute: false }) joins: Record<string, JoinView> = {};
  @property({ attribute: false }) relationHref?: (slug: string, id?: string) => string;
  @property({ attribute: false }) user: Data | null = null;

  @state() private _folded = new Map<string, boolean>();
  @state() private _badJson = new Map<string, string>();
  @state() private _touched = new Set<string>();
  @property() today = "";
  @property() what = "";
  @property({ attribute: false }) contextFields?: FieldLike[];
  @state() private _suggestions = new Map<string, Suggestion>();

  #aiChange = () => this.requestUpdate();
  override connectedCallback() {
    super.connectedCallback();
    addEventListener(AI_CHANGE, this.#aiChange);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener(AI_CHANGE, this.#aiChange);
  }

  private _suggestSpec(f: FieldLike, v: unknown, data: Data): SuggestSpec | null {
    const hint = typeof f.admin?.description === "string" ? f.admin.description : undefined;
    const base = { label: labelOf(f), hint };
    const words = (x: string | number | boolean) => String(x);
    switch (f.type) {
      case "text":
      case "email":
        if (f.hasMany) return null;
        return {
          field: { ...base, type: "string", ...(f.type === "email" ? { format: "email" as const } : {}) },
          toValue: words,
          label: words,
        };
      case "textarea":
        return { field: { ...base, type: "string", format: "paragraph" }, toValue: words, label: words };
      case "number":
        return f.hasMany ? null : { field: { ...base, type: "number" }, toValue: Number, label: words };
      case "checkbox":
        return {
          field: { ...base, type: "boolean" },
          toValue: Boolean,
          label: (x) => (x === true ? m.doc_form_yes() : m.doc_form_no()),
        };
      case "date": {
        const appearance = appearanceOf(f);
        if (appearance !== "dayOnly" && appearance !== "dayAndTime") return null;
        return {
          field: { ...base, type: "string", format: "date" },
          toValue: (x) => fromInputDate(appearance === "dayAndTime" ? `${x}T09:00` : String(x), appearance, v),
          label: (x) => dateLabel(String(x)),
        };
      }
      case "select":
      case "radio":
      case "relationship": {
        if (f.hasMany || Array.isArray(f.relationTo)) return null;
        const options =
          f.type === "relationship"
            ? this._options(f, data)
            : (f.options ?? []).map((o) =>
                typeof o === "string" ? { value: o, label: o } : { value: o.value, label: textOf(o.label) ?? o.value },
              );
        if (!options.length || options.length > 80) return null;
        const byLabel = new Map(options.map((o) => [String(o.label), o.value]));
        return {
          field: { ...base, type: "string", options: [...byLabel.keys()] },
          toValue: (x) => byLabel.get(String(x)),
          label: words,
        };
      }
      default:
        return null;
    }
  }

  private _known(skip: string): Record<string, string> {
    const out: Record<string, string> = {};
    const walk = (fields: FieldLike[], data: Data, prefix: string, at: string) => {
      for (const f of fields) {
        if (Object.keys(out).length >= 60) return;
        if (f.type === "row" || f.type === "collapsible") walk(f.fields ?? [], data, prefix, at);
        else if (f.type === "tabs")
          for (const t of f.tabs ?? [])
            if (t.name)
              walk(
                t.fields,
                isObj(data[t.name]) ? (data[t.name] as Data) : {},
                `${prefix}${t.name} · `,
                `${at}${t.name}.`,
              );
            else walk(t.fields, data, prefix, at);
        else if (f.type === "group" && f.name)
          walk(
            f.fields ?? [],
            isObj(data[f.name]) ? (data[f.name] as Data) : {},
            `${prefix}${labelOf(f)} · `,
            `${at}${f.name}.`,
          );
        else if (f.name && `${at}${f.name}` !== skip) {
          const shown = this._read(f, data[f.name], data);
          if (shown) out[`${prefix}${labelOf(f)}`] = shown;
        }
      }
    };
    walk(this.contextFields ?? this.fields, this.value, "", "");
    return out;
  }

  private _read(f: FieldLike, v: unknown, data: Data): string {
    if (v == null || v === "" || isObj(v) || Array.isArray(v)) return "";
    if (typeof v === "boolean") return f.type === "checkbox" ? (v ? m.doc_form_yes() : m.doc_form_no()) : "";
    if (f.type === "select" || f.type === "radio") {
      const o = (f.options ?? []).find((o) => (typeof o === "string" ? o : o.value) === v);
      return o == null ? text(v) : typeof o === "string" ? o : (textOf(o.label) ?? o.value);
    }
    if (f.type === "relationship") {
      if (Array.isArray(f.relationTo)) return "";
      return this._options(f, data, [text(v)]).find((o) => o.value === text(v))?.label ?? "";
    }
    if (f.type === "date") return text(v).slice(0, 10);
    return text(v);
  }

  private _suggestion(key: string, next?: Suggestion) {
    const all = new Map(this._suggestions);
    if (next) all.set(key, next);
    else all.delete(key);
    this._suggestions = all;
  }

  private async _suggest(key: string, spec: SuggestSpec) {
    this._suggestion(key, { busy: true });
    try {
      const today = this.today || new Date().toISOString().slice(0, 10);
      const x = await suggest(spec.field, this.what || "record", this._known(key), today);
      this._suggestion(
        key,
        x == null ? { note: m.doc_form_suggest_nothing() } : { value: spec.toValue(x), label: spec.label(x) },
      );
    } catch (e) {
      console.warn("Suggestion failed", e);
      this._suggestion(key, { note: m.doc_form_suggest_failed() });
    }
  }

  private _set(path: Path, v: unknown) {
    this.value = setIn(this.value, path, v);
    const detail: DocFormChange = { value: this.value, path, fieldValue: v };
    this.dispatchEvent(new CustomEvent("ui-change", { detail, bubbles: true }));
  }

  private _error(path: Path) {
    const msg = this.errors[path.join(".")];
    return msg ? html`<ui-text variant="body-md" color="error">${msg}</ui-text>` : nothing;
  }

  private _errorsIn(path: Path, fields?: FieldLike[]) {
    const prefix = path.join(".");
    const names = fields ? valueFields(fields).map((f) => f.name!) : undefined;
    return Object.keys(this.errors).filter((k) => {
      const rest = prefix ? (k === prefix || k.startsWith(`${prefix}.`) ? k.slice(prefix.length + 1) : null) : k;
      if (rest == null) return false;
      return !names || names.includes(rest.split(".")[0]!);
    }).length;
  }

  private _fields(fields: FieldLike[], data: Data, path: Path): TemplateResult {
    return html`<ui-flex direction="col" gap="4">${fields.map((f) => this._field(f, data, path))}</ui-flex>`;
  }

  private _field(f: FieldLike, data: Data, path: Path, inRow = false): TemplateResult | typeof nothing {
    if (f.hidden || f.admin?.hidden || f.admin?.disabled || f.type === "ui") return nothing;
    if (f.admin?.condition && !f.admin.condition(this.value, data)) return nothing;
    if (f.admin?.width && !inRow && f.type !== "row") {
      return html`<ui-flex wrap>
        <ui-box .basis=${`calc(${f.admin.width} + 1rem)`}>${this._field(f, data, path, true)}</ui-box>
      </ui-flex>`;
    }

    switch (f.type) {
      case "row": {
        const visible = (f.fields ?? []).filter((x) => !x.hidden && !x.admin?.hidden);
        return html`<ui-flex wrap gap="4" align="start">
          ${visible.map(
            (x) => html`<ui-box .basis=${x.admin?.width ?? "12rem"} grow>${this._field(x, data, path, true)}</ui-box>`,
          )}
        </ui-flex>`;
      }
      case "collapsible":
        return html`<ui-collapse
          mode="checkbox"
          icon="arrow"
          ?open=${!f.admin?.initCollapsed || this._errorsIn(path, f.fields) > 0}
          .heading=${labelOf(f) || m.doc_form_details()}
        >
          ${f.admin?.description ? html`<ui-text variant="body-md" color="muted">${f.admin.description}</ui-text>` : nothing}
          ${this._fields(f.fields ?? [], data, path)}
        </ui-collapse>`;
      case "tabs":
        return html`<ui-tabs
          variant="secondary"
          .surface=${false}
          padding="top"
          .items=${(f.tabs ?? []).map((tab) => {
            const at = tab.name ? [...path, tab.name] : path;
            const errors = this._errorsIn(at, tab.name ? undefined : tab.fields);
            const label = typeof tab.label === "string" ? tab.label : humanize(tab.name ?? "");
            const description = (tab as { description?: unknown }).description;
            return {
              label: errors ? m.doc_form_tab_errors({ label, count: errors }) : label,
              content: html`${typeof description === "string" ? html`<ui-text variant="body-md" color="muted">${description}</ui-text>` : nothing}
              ${
                tab.name
                  ? this._fields(tab.fields, isObj(data[tab.name]) ? (data[tab.name] as Data) : {}, at)
                  : this._fields(tab.fields, data, path)
              }`,
            };
          })}
        ></ui-tabs>`;
      case "group": {
        const name = f.name!;
        const inner = this._fields(f.fields ?? [], isObj(data[name]) ? (data[name] as Data) : {}, [...path, name]);
        if (f.admin?.hideGutter) {
          return html`<ui-flex direction="col" gap="2">
            ${labelOf(f) ? html`<ui-text emphasized>${labelOf(f)}</ui-text>` : nothing}
            ${f.admin?.description ? html`<ui-text variant="body-md" color="muted">${f.admin.description}</ui-text>` : nothing}
            ${inner}
          </ui-flex>`;
        }
        return html`<ui-fieldset .legend=${labelOf(f)} .hint=${f.admin?.description ?? ""} surface="base-200">
          ${inner}
        </ui-fieldset>`;
      }
      case "array":
      case "blocks":
        return this._rows(f, data, path);
      case "join":
        return this._join(f);
      default:
        return this._input(f, data, path);
    }
  }

  private _rowLabel(fields: FieldLike[], row: Data): string {
    const all = valueFields(fields).filter((f) => {
      const v = row[f.name!];
      return v != null && v !== "" && typeof v !== "object";
    });
    const pick = (types: string[]) => all.find((f) => types.includes(f.type));
    const f =
      pick(["text", "email", "textarea"]) ?? pick(["select", "radio", "relationship", "upload"]) ?? pick(["number"]);
    if (!f) return "";
    const v = row[f.name!];
    if (f.type === "select" || f.type === "radio" || f.type === "relationship" || f.type === "upload")
      return this._options(f, row, [text(v)]).find((o) => o.value === text(v))?.label ?? text(v);
    return text(v);
  }

  private _rows(f: FieldLike, data: Data, path: Path) {
    const name = f.name!;
    const rows = Array.isArray(data[name]) ? (data[name] as Data[]) : [];
    const at = [...path, name];
    const labels = (f as { labels?: { singular?: unknown; plural?: unknown } }).labels;
    const named = typeof labels?.singular === "string" ? labels.singular : undefined;
    const singular = named ?? m.doc_form_row();
    const plural = (
      typeof labels?.plural === "string" ? labels.plural : labelOf(f) || humanize(name)
    ).toLocaleLowerCase();
    const sortable = f.admin?.isSortable !== false;
    const full = f.maxRows != null && rows.length >= f.maxRows;
    const removable = !(f.minRows != null && rows.length <= f.minRows);
    const add = (blockType?: string) => this._set(at, [...rows, { id: newId(), ...(blockType ? { blockType } : {}) }]);
    const blockOf = (row: Data) => f.blocks?.find((b) => b.slug === row.blockType);
    const blockLabel = (slug: string) => {
      const b = f.blocks?.find((x) => x.slug === slug);
      return typeof b?.labels?.singular === "string" ? b.labels.singular : humanize(slug);
    };
    const rowId = (row: Data, i: number) => text(row.id ?? `${at.join(".")}.${i}`);
    const permitted =
      f.type === "blocks" && typeof f.filterOptions === "function"
        ? f.filterOptions({ data: this.value, siblingData: data, user: this.user })
        : true;
    const allowedBlocks = (f.blocks ?? []).filter((b) => !Array.isArray(permitted) || permitted.includes(b.slug));
    const isOpen = (row: Data, i: number) =>
      this._folded.get(rowId(row, i)) ?? (!f.admin?.initCollapsed || this._errorsIn([...at, i]) > 0);
    const fold = (open: boolean) => {
      const next = new Map(this._folded);
      rows.forEach((row, i) => next.set(rowId(row, i), open));
      this._folded = next;
    };
    const act = (i: number, action: string) => {
      const next = [...rows];
      if (action === "up" || action === "down") {
        const [row] = next.splice(i, 1);
        next.splice(i + (action === "up" ? -1 : 1), 0, row!);
      } else if (action === "duplicate") {
        next.splice(i + 1, 0, { ...structuredClone(rows[i]!), id: newId() });
      } else next.splice(i, 1);
      this._set(at, next);
    };
    const range =
      f.minRows != null || f.maxRows != null
        ? f.minRows != null && f.maxRows != null
          ? `${f.minRows}–${f.maxRows}`
          : f.maxRows != null
            ? m.doc_form_rows_up_to({ max: f.maxRows })
            : m.doc_form_rows_at_least({ min: f.minRows! })
        : "";

    return html`<ui-flex direction="col" gap="2">
      <ui-flex align="center" justify="between" gap="2" wrap>
        <ui-flex align="center" gap="2">
          <ui-text emphasized>${labelOf(f)}${f.required ? " *" : ""}</ui-text>
          <ui-tag>${rows.length}${range ? ` · ${range}` : ""}</ui-tag>
        </ui-flex>
        ${
          rows.length > 1
            ? html`<ui-flex gap="1">
                <ui-button size="xs" variant="text" @click=${() => fold(false)}>${m.doc_form_collapse_all()}</ui-button>
                <ui-button size="xs" variant="text" @click=${() => fold(true)}>${m.doc_form_expand_all()}</ui-button>
              </ui-flex>`
            : nothing
        }
      </ui-flex>
      ${f.admin?.description ? html`<ui-text variant="body-md" color="muted">${f.admin.description}</ui-text>` : nothing}
      ${this._error(at)}
      ${rows.length ? nothing : html`<ui-empty-state size="sm">${m.doc_form_rows_empty({ items: plural })}</ui-empty-state>`}
      ${rows.map((row, i) => {
        const fields = f.type === "blocks" ? (blockOf(row)?.fields ?? []) : (f.fields ?? []);
        const open = isOpen(row, i);
        const errors = this._errorsIn([...at, i]);
        const kind = f.type === "blocks" ? blockLabel(text(row.blockType)) : singular;
        const number = text(i + 1).padStart(2, "0");
        const name =
          (f.type === "blocks" && typeof row.blockName === "string" && row.blockName) ||
          [this._rowLabel(fields, row)].find((l) => l !== String(i + 1) && l !== number) ||
          "";
        const menu: DropdownItem[] = [
          ...(sortable && i > 0 ? [{ label: m.doc_form_move_up(), value: "up", icon: "arrow-up" as const }] : []),
          ...(sortable && i < rows.length - 1
            ? [{ label: m.doc_form_move_down(), value: "down", icon: "arrow-down" as const }]
            : []),
          ...(full ? [] : [{ label: m.doc_form_duplicate(), value: "duplicate", icon: "copy" as const }]),
          ...(removable
            ? [{ label: m.doc_form_remove(), value: "remove", icon: "x" as const, destructive: true, separator: true }]
            : []),
        ];
        return html`<ui-box border rounded="box" padding="3">
          <ui-flex direction="col" gap="3">
            <ui-flex align="center" justify="between" gap="2" wrap>
              <ui-button
                size="xs"
                variant="text"
                .label=${`${open ? m.doc_form_collapse_row({ kind, number }) : m.doc_form_expand_row({ kind, number })}${name ? ` ${name}` : ""}`}
                @click=${() => (this._folded = new Map(this._folded).set(rowId(row, i), !open))}
              >
                <ui-icon name=${open ? "chevron-down" : "chevron-right"} size="sm"></ui-icon>
                <ui-text as="span" variant="title-sm">${m.doc_form_row_title({ kind, number })}</ui-text>
                ${name ? html`<ui-text as="span" variant="body-md" color="muted" truncate>${name}</ui-text>` : nothing}
              </ui-button>
              <ui-flex align="center" gap="1">
                ${errors ? html`<ui-tag tone="error">${m.doc_form_errors({ count: errors })}</ui-tag>` : nothing}
                ${
                  this.readonly || !menu.length
                    ? nothing
                    : html`<ui-dropdown
                        mode="popover"
                        align="end"
                        trigger-variant="text"
                        trigger-size="xs"
                        trigger-shape="round"
                        .triggerLabel=${m.doc_form_row_actions({ kind, number: i + 1 })}
                        .items=${menu}
                        @ui-select=${(e: CustomEvent<{ item: { value: string } }>) => {
                          e.stopPropagation();
                          act(i, e.detail.item.value);
                        }}
                        ><span slot="trigger">⋯</span></ui-dropdown
                      >`
                }
              </ui-flex>
            </ui-flex>
            ${
              open
                ? html`${
                    f.type === "blocks" &&
                    !(blockOf(row) as { admin?: { disableBlockName?: boolean } } | undefined)?.admin?.disableBlockName
                      ? html`<ui-text-input
                          size="sm"
                          width="full"
                          aria-label=${m.doc_form_block_name()}
                          .leading=${m.doc_form_block_name()}
                          .placeholder=${m.doc_form_optional()}
                          .value=${typeof row.blockName === "string" ? row.blockName : ""}
                          .readonly=${this.readonly}
                          @input=${(e: Event) => this._set([...at, i, "blockName"], (e.target as HTMLInputElement).value)}
                        ></ui-text-input>`
                      : nothing
                  }${this._fields(fields, row, [...at, i])}`
                : nothing
            }
          </ui-flex>
        </ui-box>`;
      })}
      ${
        this.readonly || full
          ? full && !this.readonly
            ? html`<ui-text variant="body-md" color="muted"
                >${m.doc_form_rows_max({ items: plural, max: f.maxRows! })}</ui-text
              >`
            : nothing
          : f.type === "blocks"
            ? html`<ui-flex>
                <ui-dropdown
                  mode="popover"
                  trigger-variant="outlined"
                  trigger-size="xs"
                  .label=${named ? m.doc_form_add_named({ name: named }) : m.doc_form_add_block()}
                  .items=${allowedBlocks.map((b) => ({ label: blockLabel(b.slug), value: b.slug }))}
                  @ui-select=${(e: CustomEvent<{ item: { value: string } }>) => {
                    e.stopPropagation();
                    add(e.detail.item.value);
                  }}
                ></ui-dropdown>
              </ui-flex>`
            : html`<ui-flex
                ><ui-button size="xs" variant="outlined" @click=${() => add()}
                  >${m.doc_form_add_named({ name: singular })}</ui-button
                ></ui-flex
              >`
      }
    </ui-flex>`;
  }

  private _join(f: FieldLike) {
    const view = this.joins[f.name!];
    if (!view) return nothing;
    return html`<ui-flex direction="col" gap="2">
      <ui-flex align="center" justify="between" gap="2" wrap>
        <ui-flex align="center" gap="2">
          <ui-text emphasized>${labelOf(f)}</ui-text>
          <ui-badge .count=${view.total}></ui-badge>
        </ui-flex>
        ${
          view.createHref && f.admin?.allowCreate !== false && !this.readonly
            ? html`<ui-button size="xs" variant="text" href=${view.createHref}>${m.doc_form_create_new()}</ui-button>`
            : nothing
        }
      </ui-flex>
      ${f.admin?.description ? html`<ui-text variant="body-md" color="muted">${f.admin.description}</ui-text>` : nothing}
      <ui-table
        size="sm"
        bordered
        .columns=${view.columns.map((c, i) => ({
          key: c.key,
          label: c.label,
          render: (row: { href?: string; cells: Record<string, string> }) =>
            i === 0 && row.href ? html`<ui-link href=${row.href}>${row.cells[c.key]}</ui-link>` : row.cells[c.key],
        }))}
        .rows=${view.rows}
        .empty=${m.doc_form_none_yet()}
      ></ui-table>
      ${
        view.total > view.rows.length
          ? html`<ui-text variant="body-sm" color="muted"
              >${m.doc_form_join_showing({ shown: view.rows.length, total: view.total })}</ui-text
            >`
          : nothing
      }
    </ui-flex>`;
  }

  private _input(f: FieldLike, data: Data, path: Path) {
    const name = f.name!;
    const at = [...path, name];
    const key = at.join(".");
    const v = data[name];
    const touched = this._touched.has(key);
    const error = this.errors[key] ?? (touched ? fieldError(f, v) : undefined) ?? "";
    const filled = !(v == null || v === "" || (Array.isArray(v) && !v.length));
    const description = typeof f.admin?.description === "string" ? f.admin.description : "";
    const about = typeof f.custom?.about === "string" ? f.custom.about : "";
    const count =
      f.maxLength != null && typeof v === "string" && !(f.type === "text" && f.hasMany) ? v.length : undefined;
    const set = (x: unknown) => {
      if (!touched) this._touched = new Set(this._touched).add(key);
      if (this._suggestions.has(key)) this._suggestion(key);
      this._set(at, x);
    };
    const control = this._control(f, v, set, data, !!error);
    const locked = this.readonly || !!f.admin?.readOnly;
    const spec = !locked && supported("LanguageModel") ? this._suggestSpec(f, v, data) : null;
    const s = this._suggestions.get(key);
    return html`<ui-field
      .label=${labelOf(f)}
      ?required=${!!f.required}
      ?filled=${filled}
      ?valid=${touched && filled && !error}
      ?readonly=${this.readonly || !!f.admin?.readOnly}
      .hint=${description}
      .about=${about}
      .error=${error}
      .count=${count}
      .max=${count != null ? f.maxLength : undefined}
      ?suggestable=${!!spec}
      ?suggesting=${!!s && "busy" in s}
      .suggestion=${s && "label" in s ? s.label : ""}
      .suggestNote=${s && "note" in s ? s.note : ""}
      @ui-suggest=${() => this._suggest(key, spec!)}
      @ui-suggestion=${(e: CustomEvent<{ accept: boolean }>) => {
        const got = this._suggestions.get(key) as { value: unknown };
        this._suggestion(key);
        if (e.detail.accept) set(got.value);
      }}
      >${control}</ui-field
    >`;
  }

  private _control(f: FieldLike, v: unknown, set: (x: unknown) => void, data: Data, invalid: boolean) {
    const label = labelOf(f) || humanize(f.name!);
    const placeholder = textOf(f.admin?.placeholder);
    const disabled = this.readonly || !!f.admin?.readOnly;
    const color = invalid ? ("error" as const) : undefined;
    const target = (e: Event) => e.target as HTMLInputElement;
    const num = (x: string) => (x === "" ? null : Number(x));
    const kind = inputOf(f);
    const unit = f.custom?.number?.unit;
    const suffix = typeof f.custom?.suffix === "string" ? f.custom.suffix : undefined;
    const options = (f.options ?? []).map((o, i) =>
      typeof o === "string" ? { value: o, label: o, i } : { value: o.value, label: textOf(o.label) ?? o.value, i },
    );
    const toned = !!f.custom?.tones;

    switch (kind) {
      case "switch":
        return html`<ui-switch
          .checked=${v === true}
          .disabled=${disabled}
          aria-label=${label}
          .label=${v === true ? m.doc_form_yes() : m.doc_form_no()}
          @change=${(e: Event) => set(target(e).checked)}
        ></ui-switch>`;
      case "segmented":
      case "chips":
        return html`<ui-button-group
          .label=${label}
          select=${kind === "chips" ? "multi" : "single"}
          .value=${typeof v === "string" ? v : ""}
          .values=${Array.isArray(v) ? v.map(text) : []}
          .options=${options.map((o) => ({
            value: o.value,
            label: o.label,
            disabled,
            ...(toned ? { tone: f.custom!.tones![o.value] ?? "neutral" } : { hue: o.i }),
          }))}
          @ui-change=${(e: CustomEvent<{ value: string; values: string[] }>) =>
            set(kind === "chips" ? e.detail.values : e.detail.value)}
        ></ui-button-group>`;
      case "rating":
        return html`<ui-rating
          .label=${label}
          .max=${f.max ?? 5}
          .value=${typeof v === "number" ? v : null}
          ?required=${!!f.required}
          ?disabled=${disabled}
          .words=${Array.isArray(f.custom?.words) ? (f.custom.words as string[]) : []}
          @ui-change=${(e: CustomEvent<{ value: number | null }>) => set(e.detail.value)}
        ></ui-rating>`;
      case "scale":
        return html`<ui-scale
          .label=${label}
          .min=${f.min ?? 1}
          .max=${f.max ?? 5}
          .value=${typeof v === "number" ? v : null}
          .low=${typeof f.custom?.low === "string" ? f.custom.low : ""}
          .high=${typeof f.custom?.high === "string" ? f.custom.high : ""}
          ?disabled=${disabled}
          @ui-change=${(e: CustomEvent<{ value: number }>) => set(e.detail.value)}
        ></ui-scale>`;
      case "slider":
        return html`<ui-range
          .label=${label}
          bubble
          width="full"
          color="primary"
          .min=${f.min ?? 0}
          .max=${f.max ?? 100}
          .step=${f.admin?.step ?? ((f.max ?? 100) - (f.min ?? 0) <= 1 ? 0.01 : 1)}
          .value=${typeof v === "number" ? v : (f.min ?? 0)}
          .format=${(x: number) =>
            f.max === 1 && f.min === 0
              ? intl.number({ style: "percent" }).format(x)
              : `${intl.number().format(x)}${unit === "pct" ? "%" : (suffix ?? "")}`}
          ?disabled=${disabled}
          @input=${(e: Event) => set(Number(target(e).value))}
        ></ui-range>`;
      case "stepper":
        return html`<ui-stepper
          .label=${label}
          .value=${typeof v === "number" ? v : null}
          .min=${f.min ?? (unit === "days" ? 0 : undefined)}
          .max=${f.max ?? undefined}
          .step=${f.admin?.step ?? 1}
          .unit=${suffix ?? (unit === "days" ? m.doc_form_unit_days() : "")}
          .placeholder=${placeholder ?? ""}
          ?disabled=${disabled}
          @ui-change=${(e: CustomEvent<{ value: number | null }>) => set(e.detail.value)}
        ></ui-stepper>`;
      case "money":
      case "percent":
      case "number": {
        if (f.hasMany) break;
        const money = f.custom?.number;
        const currency =
          kind === "money"
            ? (money?.currency ?? (money?.currencyField ? text(data[money.currencyField]) : "")) || undefined
            : undefined;
        return html`<ui-text-input
          aria-label=${label}
          .color=${color}
          .placeholder=${placeholder}
          .step=${f.admin?.step == null ? "any" : text(f.admin.step)}
          inputmode="decimal"
          type="number"
          tabular
          .leading=${currency}
          .trailing=${kind === "percent" ? "%" : suffix}
          .min=${f.min == null ? undefined : text(f.min)}
          .max=${f.max == null ? undefined : text(f.max)}
          .value=${v == null ? "" : text(v)}
          .readonly=${disabled}
          width="full"
          @input=${(e: Event) => set(num(target(e).value))}
        ></ui-text-input>`;
      }
      case "date": {
        const appearance = appearanceOf(f);
        if (appearance !== "dayOnly" && appearance !== "dayAndTime") break;
        const bound = (d: unknown) =>
          d == null ? undefined : toInputDate(new Date(d as string).toISOString(), appearance);
        return html`<ui-date-input
          .label=${label}
          ?time=${appearance === "dayAndTime"}
          .today=${this.today}
          ?future=${/due|deadline|eta|arriv|expir|until|by$|valid/i.test(f.name!)}
          .min=${bound(f.admin?.date?.minDate)}
          .max=${bound(f.admin?.date?.maxDate)}
          .value=${toInputDate(v, appearance)}
          ?required=${!!f.required}
          ?disabled=${disabled}
          @ui-change=${(e: CustomEvent<{ value: string }>) => set(fromInputDate(e.detail.value, appearance, v))}
        ></ui-date-input>`;
      }
      default:
        break;
    }

    switch (f.type) {
      case "text":
      case "email":
        if (f.hasMany)
          return html`<ui-combobox
            aria-label=${label}
            multiple
            creatable
            .color=${color}
            .value=${Array.isArray(v) ? v.map(text) : []}
            .placeholder=${placeholder ?? m.doc_form_type_enter()}
            .readonly=${disabled}
            field-width="full"
            @ui-change=${(e: CustomEvent<{ value: string[] }>) => set(e.detail.value)}
          ></ui-combobox>`;
        return html`<ui-text-input
          aria-label=${label}
          .color=${color}
          .maxlength=${f.maxLength}
          .minlength=${f.minLength}
          autocomplete=${(f.admin?.autoComplete as string | undefined) ?? "off"}
          .type=${f.type === "email" ? "email" : "text"}
          .icon=${f.type === "email" ? "mail" : undefined}
          .value=${v == null ? "" : text(v)}
          .placeholder=${placeholder}
          .readonly=${disabled}
          width="full"
          @input=${(e: Event) => set(target(e).value)}
        ></ui-text-input>`;
      case "number":
        return html`<ui-combobox
          aria-label=${label}
          multiple
          creatable
          inputmode="decimal"
          .color=${color}
          .value=${Array.isArray(v) ? v.map(text) : []}
          .placeholder=${placeholder ?? m.doc_form_type_number_enter()}
          .readonly=${disabled}
          field-width="full"
          @ui-change=${(e: CustomEvent<{ value: string[] }>) =>
            set(e.detail.value.map(Number).filter((n) => Number.isFinite(n)))}
        ></ui-combobox>`;
      case "date": {
        const appearance = appearanceOf(f);
        return html`<ui-text-input
          aria-label=${label}
          .color=${color}
          .type=${DATE_INPUT[appearance]}
          .value=${toInputDate(v, appearance)}
          .readonly=${disabled}
          width="full"
          @input=${(e: Event) => set(fromInputDate(target(e).value, appearance, v))}
        ></ui-text-input>`;
      }
      case "textarea":
      case "code":
      case "richText":
        return html`<ui-textarea
            aria-label=${f.type === "code" && f.admin?.language ? `${label} · ${text(f.admin.language)}` : label}
            .color=${color}
            .rows=${f.admin?.rows ?? (f.type === "code" ? 8 : 3)}
            ?mono=${f.type === "code"}
            .maxlength=${f.maxLength}
            .value=${typeof v === "string" ? v : v == null ? "" : JSON.stringify(v)}
            .placeholder=${placeholder}
            .readonly=${disabled}
            width="full"
            @input=${(e: Event) => set((e.target as HTMLTextAreaElement).value)}
          ></ui-textarea>
          ${
            f.type !== "code" && !disabled
              ? html`<ui-ai-tools
                  tools="proofread shorter formal"
                  .value=${typeof v === "string" ? v : ""}
                  @ui-change=${(e: CustomEvent<{ value: string }>) => set(e.detail.value)}
                ></ui-ai-tools>`
              : nothing
          }`;
      case "json": {
        const k = `${f.name}`;
        const bad = this._badJson.get(k);
        return html`<ui-textarea
            aria-label=${label}
            .color=${bad != null || color ? "error" : undefined}
            mono
            .rows=${f.admin?.rows ?? 8}
            .value=${bad ?? (v == null ? "" : JSON.stringify(v, null, 2))}
            .readonly=${disabled}
            width="full"
            @input=${(e: Event) => {
              const raw = (e.target as HTMLTextAreaElement).value;
              const next = new Map(this._badJson);
              try {
                const parsed: unknown = raw.trim() ? JSON.parse(raw) : null;
                next.delete(k);
                this._badJson = next;
                set(parsed);
              } catch {
                this._badJson = next.set(k, raw);
              }
            }}
          ></ui-textarea>
          ${bad != null ? html`<ui-text variant="body-md" color="error">${m.doc_form_json_invalid()}</ui-text>` : nothing}`;
      }
      case "checkbox":
        return html`<ui-checkbox
          .label=${labelOf(f)}
          aria-label=${labelOf(f) ? nothing : label}
          .checked=${v === true}
          .disabled=${disabled}
          @change=${(e: Event) => set(target(e).checked)}
        ></ui-checkbox>`;
      case "point": {
        const p = Array.isArray(v) ? (v as (number | null)[]) : [null, null];
        const part = (i: 0 | 1, legend: string) =>
          html`<ui-text-input
            .legend=${legend}
            type="number"
            .value=${p[i] == null ? "" : text(p[i])}
            .readonly=${disabled}
            field-width="full"
            width="full"
            @input=${(e: Event) => {
              const next = [...p];
              next[i] = num(target(e).value);
              set(next);
            }}
          ></ui-text-input>`;
        return html`<ui-grid fit="xs" gap="4"
          >${part(0, m.doc_form_longitude())}${part(1, m.doc_form_latitude())}</ui-grid
        >`;
      }
      case "select":
      case "radio":
      case "relationship":
      case "upload":
        return this._choice(f, v, set, label, disabled, color, placeholder, data);
      default:
        return html`<ui-text variant="body-md" color="muted"
          >${m.doc_form_unsupported({ label, type: String(f.type) })}</ui-text
        >`;
    }
  }

  private _options(f: FieldLike, siblingData: Data = {}, keep: string[] = []): RelationOption[] {
    const filter = f.filterOptions;
    const args = { data: this.value, siblingData, id: this.value.id, user: this.user, req: { user: this.user } };
    if (f.type === "select" || f.type === "radio") {
      let options = f.options ?? [];
      if (f.type === "select" && typeof filter === "function") {
        const offered = filter({ ...args, options });
        if (Array.isArray(offered)) {
          const allowed = new Set(
            offered.map((o: unknown) => (typeof o === "string" ? o : (o as { value: string }).value)),
          );
          options = options.filter((o) => {
            const value = typeof o === "string" ? o : o.value;
            return allowed.has(value) || keep.includes(value);
          });
        }
      }
      return options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : { value: o.value, label: text(o.label) },
      );
    }
    const poly = Array.isArray(f.relationTo);
    const targets = poly ? (f.relationTo as string[]) : [(f.relationTo as string | undefined) ?? ""];
    return targets.flatMap((slug) => {
      const where = typeof filter === "function" ? filter({ ...args, relationTo: slug }) : filter;
      const allowed = (o: RelationOption) =>
        where == null ||
        where === true ||
        (where instanceof Promise ? true : where !== false && (!o.doc || matches(o.doc, where as Where)));
      return (this.relations[slug] ?? [])
        .filter((o) => allowed(o) || keep.includes(poly ? `${slug}:${o.value}` : o.value))
        .map((o) => (poly ? { ...o, value: `${slug}:${o.value}`, group: humanize(slug) } : o));
    });
  }

  private _choice(
    f: FieldLike,
    v: unknown,
    set: (x: unknown) => void,
    label: string,
    disabled: boolean,
    color: "error" | undefined,
    placeholder: string | undefined,
    siblingData: Data,
  ) {
    const poly = Array.isArray(f.relationTo);
    const toOption = (x: unknown): string => {
      if (poly && isObj(x)) return `${text(x.relationTo)}:${text(isObj(x.value) ? x.value.id : x.value)}`;
      if (isObj(x) && "id" in x) return text(x.id);
      return x == null ? "" : text(x);
    };
    const current = (Array.isArray(v) ? v : [v]).map(toOption).filter(Boolean);
    const options = this._options(f, siblingData, current);
    const fromOption = (o: string): unknown => {
      if (!o) return null;
      if (!poly) return o;
      const i = o.indexOf(":");
      return { relationTo: o.slice(0, i), value: o.slice(i + 1) };
    };

    if (f.type === "radio") {
      return html`<ui-radio
        aria-label=${label}
        direction=${f.admin?.layout === "vertical" ? "vertical" : "horizontal"}
        .options=${options}
        .value=${toOption(v)}
        .disabled=${disabled}
        @change=${(e: Event) => set(fromOption((e.target as HTMLInputElement).value))}
      ></ui-radio>`;
    }

    const picked = f.hasMany ? (Array.isArray(v) ? v.map(toOption) : []) : toOption(v);
    const field = (fieldHint: unknown) =>
      html`<ui-combobox
        aria-label=${label}
        .hint=${fieldHint}
        .options=${options}
        .value=${picked}
        ?multiple=${!!f.hasMany}
        ?clearable=${f.admin?.isClearable ?? !f.required}
        .color=${color}
        .placeholder=${placeholder ?? (f.hasMany ? m.doc_form_choose() : "—")}
        .readonly=${disabled}
        field-width="full"
        @ui-change=${(e: CustomEvent<{ value: string | string[] }>) =>
          set(Array.isArray(e.detail.value) ? e.detail.value.map(fromOption) : fromOption(e.detail.value))}
      ></ui-combobox>`;

    if (f.type !== "relationship" && f.type !== "upload") return field("");

    const ids = (Array.isArray(picked) ? picked : [picked]).filter(Boolean);
    const target = (id: string) => (poly ? id.slice(0, id.indexOf(":")) : (f.relationTo as string));
    const bare = (id: string) => (poly ? id.slice(id.indexOf(":") + 1) : id);
    const option = (id: string) => options.find((o) => o.value === id);
    const href = this.relationHref;
    const open =
      href && f.admin?.allowEdit !== false && ids.length === 1
        ? html`<ui-link href=${href(target(ids[0]!), bare(ids[0]!))}>${m.doc_form_open()}</ui-link>`
        : undefined;
    const create =
      href && !poly && f.admin?.allowCreate !== false && !disabled
        ? html`<ui-link href=${href(f.relationTo as string)} target="_blank">${m.doc_form_new()}</ui-link>`
        : undefined;
    const parts = [open, create].filter((x) => x != null);
    const fieldHint = parts.length ? html`${parts.map((x, i) => html`${i ? " · " : ""}${x}`)}` : "";
    const previews =
      f.type === "upload" ? ids.map((id) => option(id)).filter((o): o is RelationOption => !!o?.image) : [];
    if (!previews.length) return field(fieldHint);
    return html`<ui-flex direction="col" gap="2">
      ${field(fieldHint)}
      <ui-grid fit="xs" gap="2">
        ${previews.map(
          (o) =>
            html`<ui-card size="sm" image-src=${o.image!} .imageAlt=${o.label}>
              <ui-text variant="body-sm">${o.label}</ui-text>
            </ui-card>`,
        )}
      </ui-grid>
    </ui-flex>`;
  }

  render() {
    return this._fields(this.fields, this.value, []);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-doc-form": UiDocForm;
  }
}
