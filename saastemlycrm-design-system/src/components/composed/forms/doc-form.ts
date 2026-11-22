import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Where } from "payload";
import { matches } from "../../../payload/query.ts";
import type { FieldLike } from "../../../contracts/config.ts";
import type { DropdownItem } from "../../primitives/actions/dropdown.ts";
import { LightElement } from "../../base/light-element.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/actions/dropdown.ts";
import "../../primitives/data/table.ts";
import "../../primitives/forms/combobox.ts";
import "../../primitives/media/icon.ts";
import "../../primitives/navigation/link.ts";
import "../../primitives/containers/card.ts";
import "../../primitives/containers/collapse.ts";
import "../../primitives/data/badge.ts";
import "../../primitives/forms/checkbox.ts";
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

/**
 * Doc form: Edits a document described by Payload fields.
 *
 * Purpose: Forms & input · Kind: composed (Text input / Textarea / Select /
 * Checkbox / Radio / Fieldset / Collapse / Tabs / Grid / Box / Button)
 *
 * Renders every Payload field type (payloadcms.com/docs/fields/overview) the way Payload's Admin
 * Panel does:
 * - text / email (`hasMany` as chips), textarea (`admin.rows`, a counter with `maxLength`), code
 *   and json (monospaced; JSON checked as it's typed), number (`admin.step`, `min` / `max`,
 *   `hasMany` as chips), date (`admin.date.pickerAppearance`: dayOnly, dayAndTime, timeOnly,
 *   monthOnly; `minDate` / `maxDate`), checkbox, point.
 * - select, relationship and upload as a searchable combobox (`hasMany` as chips, polymorphic
 *   `relationTo` grouped by collection, `admin.isClearable`); relationships link to the related
 *   document and offer creating one (`admin.allowEdit` / `admin.allowCreate`); uploads preview
 *   the picked file. radio (`admin.layout`).
 * - array and blocks as collapsible rows (`admin.initCollapsed`) labelled by their first value,
 *   with a menu to move, duplicate and remove (`admin.isSortable`), `minRows` / `maxRows`, and
 *   blocks added from a menu; group (`admin.hideGutter`), row, collapsible (`initCollapsed`),
 *   tabs (named and unnamed, with a count of the errors inside each tab).
 * - join: the related documents as a table (`admin.defaultColumns`), given by the page in `joins`.
 * Every field honours `label`, `required`, `admin.description`, `admin.placeholder`,
 * `admin.readOnly`, `admin.hidden`, `admin.condition` and `admin.width` (its share of a row, or
 * its width alone), and shows its error in place. `filterOptions` narrows what's offered:
 * relationships and uploads to the related documents matching a `where` (or a function's
 * `where`), selects to the options a function returns, blocks to the slugs it allows.
 * `richText` is edited as plain text.
 *
 * Works on a copy: every edit fires `ui-change` with the whole new value.
 * Inner primitives fire their own `ui-change` too (e.g. ui-tabs `{ index }`),
 * so listeners check `e.target === e.currentTarget`.
 */

type Data = Record<string, unknown>;
type Path = (string | number)[];

/**
 * `ui-change` detail. Several forms can edit parts of one document (e.g. main
 * and sidebar fields): apply `setIn(doc, path, fieldValue)` to your own copy
 * rather than taking `value`, so changes from different forms don't overwrite
 * each other.
 */
export interface DocFormChange {
  value: Data;
  path: Path;
  fieldValue: unknown;
}

export interface RelationOption {
  value: string;
  label: string;
  /** A second line in the picker (e.g. a file's type and size). */
  description?: string;
  /** The related document itself, for `filterOptions` (a `where` it must match). */
  doc?: Data;
  /** Uploads: a preview image of the file. */
  image?: string;
}

/** A join field's related documents, ready to show (the page fetches them with `joins`). */
export interface JoinView {
  columns: { key: string; label: string }[];
  rows: { id: string; href?: string; cells: Record<string, string> }[];
  /** All related documents (the rows may be the first page). */
  total: number;
  /** Where "Create new" goes (absent: no creating). */
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

/** Any value as text (objects as JSON). */
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

/** Immutably sets `value` at `path` (e.g. `["lines", "ready"]`, `["quoteLines", 0, "qty"]`). */
export function setIn(root: Data, path: Path, value: unknown): Data {
  const [head, ...rest] = path;
  const copy: Data | unknown[] = Array.isArray(root) ? [...(root as unknown[])] : { ...root };
  const current = (copy as Record<string | number, unknown>)[head];
  (copy as Record<string | number, unknown>)[head] = rest.length
    ? setIn((current ?? (typeof rest[0] === "number" ? [] : {})) as Data, rest, value)
    : value;
  return copy as Data;
}

/** Payload's date picker appearances, as `<input>` types. */
const DATE_INPUT = { dayOnly: "date", dayAndTime: "datetime-local", timeOnly: "time", monthOnly: "month" } as const;
type DateAppearance = keyof typeof DATE_INPUT;
const appearanceOf = (f: FieldLike): DateAppearance => {
  const a = f.admin?.date?.pickerAppearance;
  return a && a in DATE_INPUT ? (a as DateAppearance) : "dayOnly";
};

/** ISO string <-> the `<input>` value for an appearance, in local time. */
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
    // A time on the day the value already had (or today).
    const day = typeof previous === "string" && previous ? new Date(previous) : new Date();
    const [h, m] = v.split(":").map(Number);
    day.setHours(h ?? 0, m ?? 0, 0, 0);
    return day.toISOString();
  }
  return new Date(appearance === "monthOnly" ? `${v}-01T00:00` : v).toISOString();
};

/** Fields holding a value, with layout fields flattened (for row labels). */
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

/**
 * @example
 * <ui-doc-form .fields=${collection.fields} .value=${doc} .errors=${{ title: "This field is required." }}
 *   .relations=${{ customers: [{ value: "c1", label: "Acme" }] }}
 *   @ui-change=${(e) => (draft = e.detail.value)}></ui-doc-form>
 */
@customElement("ui-doc-form")
export class UiDocForm extends LightElement {
  @property({ attribute: false }) fields: FieldLike[] = [];
  @property({ attribute: false }) value: Data = {};
  /** Error messages by dotted path (`lines.0.qty`), e.g. from a Payload ValidationError. */
  @property({ attribute: false }) errors: Record<string, string> = {};
  /** Options for relationship / upload fields, by collection slug. */
  @property({ attribute: false }) relations: Record<string, RelationOption[]> = {};
  @property({ type: Boolean }) readonly = false;
  /** Join fields' related documents, by field name. */
  @property({ attribute: false }) joins: Record<string, JoinView> = {};
  /** Links to related documents: `(slug, id)` opens one, `(slug)` creates one. Absent: no links. */
  @property({ attribute: false }) relationHref?: (slug: string, id?: string) => string;
  /** The signed-in user, for `filterOptions` functions (`{ user }`). */
  @property({ attribute: false }) user: Data | null = null;

  /** Array / block rows folded or unfolded by hand, by row id (the rest follow `initCollapsed`). */
  @state() private _folded = new Map<string, boolean>();
  /** JSON fields whose text doesn't parse (kept as typed), by path. */
  @state() private _badJson = new Map<string, string>();

  private _set(path: Path, v: unknown) {
    this.value = setIn(this.value, path, v);
    const detail: DocFormChange = { value: this.value, path, fieldValue: v };
    this.dispatchEvent(new CustomEvent("ui-change", { detail, bubbles: true }));
  }

  private _error(path: Path) {
    const msg = this.errors[path.join(".")];
    return msg ? html`<ui-text variant="body-md" color="error">${msg}</ui-text>` : nothing;
  }

  private _hasError(path: Path) {
    return !!this.errors[path.join(".")];
  }

  /** Errors at or inside `path` (for tabs and folded rows). */
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
    // A field with a width outside a row keeps that width (and still fits a narrow panel).
    if (f.admin?.width && !inRow && f.type !== "row") {
      return html`<ui-flex wrap>
        <ui-box .basis=${`calc(${f.admin.width} + 1rem)`}>${this._field(f, data, path, true)}</ui-box>
      </ui-flex>`;
    }

    switch (f.type) {
      case "row": {
        const visible = (f.fields ?? []).filter((x) => !x.hidden && !x.admin?.hidden);
        // Side by side, each taking its `admin.width` (or an equal share), wrapping when there's
        // no room for 12rem each: no breakpoints.
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
          .heading=${labelOf(f) || "Details"}
        >
          ${f.admin?.description ? html`<ui-text variant="body-md" color="muted">${f.admin.description}</ui-text>` : nothing}
          ${this._fields(f.fields ?? [], data, path)}
        </ui-collapse>`;
      case "tabs":
        // The fields under their tab row, on the form's own surface (a white box in a glass sheet
        // or a card read as a second card).
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
              // A tab with errors inside says so, so they're found without opening every tab.
              label: errors ? `${label} · ${errors} ${errors === 1 ? "error" : "errors"}` : label,
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

  /**
   * The label of an array / block row, as Payload's default row label: its first text value
   * (text, then a choice or a relationship, then a number), so rows read "Line 03 · Lincoln Omnia 46".
   */
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
    const singular = typeof labels?.singular === "string" ? labels.singular : "Row";
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
    // blocks `filterOptions`: the block types that may be added here (true: all of them).
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
        // Payload puts the copy right below the original.
        next.splice(i + 1, 0, { ...structuredClone(rows[i]!), id: newId() });
      } else if (action === "remove") next.splice(i, 1);
      this._set(at, next);
    };
    const range =
      f.minRows != null || f.maxRows != null
        ? f.minRows != null && f.maxRows != null
          ? `${f.minRows}–${f.maxRows}`
          : f.maxRows != null
            ? `up to ${f.maxRows}`
            : `at least ${f.minRows}`
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
                <ui-button size="xs" variant="text" @click=${() => fold(false)}>Collapse all</ui-button>
                <ui-button size="xs" variant="text" @click=${() => fold(true)}>Expand all</ui-button>
              </ui-flex>`
            : nothing
        }
      </ui-flex>
      ${f.admin?.description ? html`<ui-text variant="body-md" color="muted">${f.admin.description}</ui-text>` : nothing}
      ${this._error(at)}
      ${rows.length ? nothing : html`<ui-empty-state size="sm">No ${humanize(name).toLowerCase()} yet.</ui-empty-state>`}
      ${rows.map((row, i) => {
        const fields = f.type === "blocks" ? (blockOf(row)?.fields ?? []) : (f.fields ?? []);
        const open = isOpen(row, i);
        const errors = this._errorsIn([...at, i]);
        const kind = f.type === "blocks" ? blockLabel(text(row.blockType)) : singular;
        const name =
          (f.type === "blocks" && typeof row.blockName === "string" && row.blockName) ||
          // Not the row's own number again ("Line 01 · 1").
          [this._rowLabel(fields, row)].find((l) => l !== String(i + 1) && l !== text(i + 1).padStart(2, "0")) ||
          "";
        const menu: DropdownItem[] = [
          ...(sortable && i > 0 ? [{ label: "Move up", value: "up", icon: "arrow-up" as const }] : []),
          ...(sortable && i < rows.length - 1
            ? [{ label: "Move down", value: "down", icon: "arrow-down" as const }]
            : []),
          ...(full ? [] : [{ label: "Duplicate", value: "duplicate", icon: "copy" as const }]),
          ...(removable
            ? [{ label: "Remove", value: "remove", icon: "x" as const, destructive: true, separator: true }]
            : []),
        ];
        return html`<ui-box border rounded="box" padding="3">
          <ui-flex direction="col" gap="3">
            <ui-flex align="center" justify="between" gap="2" wrap>
              <ui-button
                size="xs"
                variant="text"
                .label=${`${open ? "Collapse" : "Expand"} ${kind} ${i + 1}`}
                @click=${() => (this._folded = new Map(this._folded).set(rowId(row, i), !open))}
              >
                <ui-icon name=${open ? "chevron-down" : "chevron-right"} size="sm"></ui-icon>
                <ui-text as="span" variant="title-sm">${kind} ${text(i + 1).padStart(2, "0")}</ui-text>
                ${name ? html`<ui-text as="span" variant="body-md" color="muted" truncate>${name}</ui-text>` : nothing}
              </ui-button>
              <ui-flex align="center" gap="1">
                ${errors ? html`<ui-tag tone="error">${errors} ${errors === 1 ? "error" : "errors"}</ui-tag>` : nothing}
                ${
                  this.readonly || !menu.length
                    ? nothing
                    : html`<ui-dropdown
                        mode="popover"
                        align="end"
                        trigger-variant="text"
                        trigger-size="xs"
                        trigger-shape="round"
                        .triggerLabel=${`${kind} ${i + 1} actions`}
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
                          leading="Name"
                          placeholder="Optional"
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
                >The most ${humanize(name).toLowerCase()} allowed is ${f.maxRows}.</ui-text
              >`
            : nothing
          : f.type === "blocks"
            ? html`<ui-flex>
                <ui-dropdown
                  mode="popover"
                  trigger-variant="outlined"
                  trigger-size="xs"
                  .label=${`+ Add ${singular === "Row" ? "block" : singular.toLowerCase()}`}
                  .items=${allowedBlocks.map((b) => ({ label: blockLabel(b.slug), value: b.slug }))}
                  @ui-select=${(e: CustomEvent<{ item: { value: string } }>) => {
                    e.stopPropagation();
                    add(e.detail.item.value);
                  }}
                ></ui-dropdown>
              </ui-flex>`
            : html`<ui-flex
                ><ui-button size="xs" variant="outlined" @click=${() => add()}>+ Add ${singular}</ui-button></ui-flex
              >`
      }
    </ui-flex>`;
  }

  /** A join field: the documents that point at this one, read-only, with a way to add one. */
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
            ? html`<ui-button size="xs" variant="text" href=${view.createHref}>+ Create new</ui-button>`
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
        .empty=${"None yet."}
      ></ui-table>
      ${
        view.total > view.rows.length
          ? html`<ui-text variant="body-sm" color="muted">Showing ${view.rows.length} of ${view.total}.</ui-text>`
          : nothing
      }
    </ui-flex>`;
  }

  private _input(f: FieldLike, data: Data, path: Path) {
    const name = f.name!;
    const at = [...path, name];
    const v = data[name];
    const label = labelOf(f) + (f.required ? " *" : "");
    const description = f.admin?.description ?? "";
    const color = this._hasError(at) ? ("error" as const) : undefined;
    // A running count against `maxLength` (Payload validates it; this shows it coming).
    const count =
      f.maxLength != null && typeof v === "string" && !(f.type === "text" && f.hasMany)
        ? `${v.length} / ${f.maxLength}`
        : "";
    const hint = [typeof description === "string" ? description : "", count].filter(Boolean).join(" · ") || description;
    const placeholder = textOf(f.admin?.placeholder);
    const disabled = this.readonly || !!f.admin?.readOnly;
    const set = (x: unknown) => this._set(at, x);
    const target = (e: Event) => e.target as HTMLInputElement;
    let control: TemplateResult;

    switch (f.type) {
      case "text":
      case "email":
        if (f.hasMany) {
          control = html`<ui-combobox
            .legend=${label}
            .hint=${hint || "Type a value and press Enter."}
            multiple
            creatable
            .color=${color}
            .value=${Array.isArray(v) ? v.map(text) : []}
            .placeholder=${placeholder ?? "Add…"}
            .readonly=${disabled}
            field-width="full"
            @ui-change=${(e: CustomEvent<{ value: string[] }>) => set(e.detail.value)}
          ></ui-combobox>`;
          break;
        }
        control = html`<ui-text-input
          .color=${color}
          .maxlength=${f.maxLength}
          .minlength=${f.minLength}
          autocomplete=${(f.admin?.autoComplete as string | undefined) ?? "off"}
          .legend=${label}
          .hint=${hint}
          .type=${f.type === "email" ? "email" : "text"}
          .value=${v == null ? "" : text(v)}
          .placeholder=${placeholder}
          .readonly=${disabled}
          field-width="full"
          width="full"
          @input=${(e: Event) => set(target(e).value)}
        ></ui-text-input>`;
        break;
      case "number":
        // hasMany numbers (e.g. line numbers 1, 2, 5) as chips.
        if (f.hasMany) {
          control = html`<ui-combobox
            .legend=${label}
            .hint=${hint || "Type a number and press Enter."}
            multiple
            creatable
            inputmode="decimal"
            .color=${color}
            .value=${Array.isArray(v) ? v.map(text) : []}
            .placeholder=${placeholder ?? "Add…"}
            .readonly=${disabled}
            field-width="full"
            @ui-change=${(e: CustomEvent<{ value: string[] }>) =>
              set(e.detail.value.map(Number).filter((n) => Number.isFinite(n)))}
          ></ui-combobox>`;
          break;
        }
        control = html`<ui-text-input
          .legend=${label}
          .hint=${hint}
          .color=${color}
          .placeholder=${placeholder}
          .step=${f.admin?.step == null ? "any" : text(f.admin.step)}
          inputmode="decimal"
          type="number"
          .min=${f.min == null ? undefined : text(f.min)}
          .max=${f.max == null ? undefined : text(f.max)}
          .value=${v == null ? "" : text(v)}
          .readonly=${disabled}
          field-width="full"
          width="full"
          @input=${(e: Event) => set(target(e).value === "" ? null : Number(target(e).value))}
        ></ui-text-input>`;
        break;
      case "date": {
        const appearance = appearanceOf(f);
        const bound = (d: unknown) =>
          d == null ? undefined : toInputDate(new Date(d as string).toISOString(), appearance);
        control = html`<ui-text-input
          .legend=${label}
          .hint=${hint}
          .color=${color}
          .type=${DATE_INPUT[appearance]}
          .min=${bound(f.admin?.date?.minDate)}
          .max=${bound(f.admin?.date?.maxDate)}
          .value=${toInputDate(v, appearance)}
          .readonly=${disabled}
          field-width="full"
          width="full"
          @input=${(e: Event) => set(fromInputDate(target(e).value, appearance, v))}
        ></ui-text-input>`;
        break;
      }
      case "textarea":
      case "code":
      case "richText":
        control = html`<ui-textarea
            .legend=${f.type === "code" && f.admin?.language ? `${label} · ${text(f.admin.language)}` : label}
            .hint=${hint}
            .color=${color}
            .rows=${f.admin?.rows ?? (f.type === "code" ? 8 : 3)}
            ?mono=${f.type === "code"}
            .maxlength=${f.maxLength}
            .value=${typeof v === "string" ? v : v == null ? "" : JSON.stringify(v)}
            .placeholder=${placeholder}
            .readonly=${disabled}
            field-width="full"
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
        break;
      case "json": {
        // Checked as it's typed; text that doesn't parse stays as typed (and isn't saved) until it does.
        const key = at.join(".");
        const bad = this._badJson.get(key);
        control = html`<ui-textarea
            .legend=${label}
            .hint=${hint}
            .color=${bad != null || color ? "error" : undefined}
            mono
            .rows=${f.admin?.rows ?? 8}
            .value=${bad ?? (v == null ? "" : JSON.stringify(v, null, 2))}
            .readonly=${disabled}
            field-width="full"
            width="full"
            @input=${(e: Event) => {
              const raw = (e.target as HTMLTextAreaElement).value;
              const next = new Map(this._badJson);
              try {
                const parsed: unknown = raw.trim() ? JSON.parse(raw) : null;
                next.delete(key);
                this._badJson = next;
                set(parsed);
              } catch {
                this._badJson = next.set(key, raw);
              }
            }}
          ></ui-textarea>
          ${bad != null ? html`<ui-text variant="body-md" color="error">Not valid JSON yet — it's saved once it is.</ui-text>` : nothing}`;
        break;
      }
      case "checkbox":
        control = html`<ui-checkbox
          .label=${labelOf(f)}
          .hint=${hint}
          .checked=${v === true}
          .disabled=${disabled}
          @change=${(e: Event) => set(target(e).checked)}
        ></ui-checkbox>`;
        break;
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
              next[i] = target(e).value === "" ? null : Number(target(e).value);
              set(next);
            }}
          ></ui-text-input>`;
        control = html`<ui-grid fit="xs" gap="4">${part(0, `${label} · longitude`)}${part(1, "Latitude")}</ui-grid>`;
        break;
      }
      case "select":
      case "radio":
      case "relationship":
      case "upload":
        control = this._choice(f, v, set, label, hint, disabled, color, placeholder, data);
        break;
      default:
        control = html`<ui-text variant="body-md" color="muted">${label}: unsupported field type "${f.type}"</ui-text>`;
    }
    return html`<ui-flex direction="col" gap="1">${control}${this._error(at)}</ui-flex>`;
  }

  /**
   * The choices a field offers. `filterOptions` narrows them (as Payload's does), given the
   * document, the field's siblings and the user; `keep` (the current value) always stays listed
   * so it still reads as a name. A function returning a promise is ignored here (the API still
   * checks it on save).
   */
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
    hint: unknown,
    disabled: boolean,
    color: "error" | undefined,
    placeholder: string | undefined,
    siblingData: Data,
  ) {
    const poly = Array.isArray(f.relationTo);
    // Stored value -> option value (relationships may arrive populated; polymorphic as { relationTo, value }).
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
        .legend=${label}
        .hint=${hint ?? ""}
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
        .legend=${label}
        .hint=${fieldHint ?? ""}
        .options=${options}
        .value=${picked}
        ?multiple=${!!f.hasMany}
        ?clearable=${f.admin?.isClearable ?? !f.required}
        .color=${color}
        .placeholder=${placeholder ?? (f.hasMany ? "Choose…" : "—")}
        .readonly=${disabled}
        field-width="full"
        @ui-change=${(e: CustomEvent<{ value: string | string[] }>) =>
          set(Array.isArray(e.detail.value) ? e.detail.value.map(fromOption) : fromOption(e.detail.value))}
      ></ui-combobox>`;

    if (f.type !== "relationship" && f.type !== "upload") return field(hint);

    // Relationships and uploads: open what's picked and create a new one (small links in the
    // hint line, so a row of fields stays aligned), and preview picked images.
    const ids = (Array.isArray(picked) ? picked : [picked]).filter(Boolean);
    const target = (id: string) => (poly ? id.slice(0, id.indexOf(":")) : (f.relationTo as string));
    const bare = (id: string) => (poly ? id.slice(id.indexOf(":") + 1) : id);
    const option = (id: string) => options.find((o) => o.value === id);
    const href = this.relationHref;
    const open =
      href && f.admin?.allowEdit !== false && ids.length === 1
        ? html`<ui-link href=${href(target(ids[0]!), bare(ids[0]!))}>Open</ui-link>`
        : undefined;
    const create =
      href && !poly && f.admin?.allowCreate !== false && !disabled
        ? html`<ui-link href=${href(f.relationTo as string)} target="_blank">+ New</ui-link>`
        : undefined;
    const parts = [hint || undefined, open, create].filter((x) => x != null);
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
