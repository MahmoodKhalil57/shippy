import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { FieldLike } from "../../../cms/types.ts";
import { LightElement } from "../../base/light-element.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/containers/collapse.ts";
import "../../primitives/data/badge.ts";
import "../../primitives/forms/checkbox.ts";
import "../../primitives/forms/fieldset.ts";
import "../../primitives/forms/radio.ts";
import "../../primitives/forms/select.ts";
import "../../primitives/forms/text-input.ts";
import "../../primitives/forms/textarea.ts";
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
 * Renders Payload's field types — text, email, textarea, code, json, number,
 * date, checkbox, select (incl. hasMany), radio, relationship / upload
 * (incl. hasMany and polymorphic), point, group, array, blocks, row,
 * collapsible, tabs — honouring `label`, `required`, `admin.description`,
 * `admin.placeholder`, `admin.readOnly`, `admin.hidden`, `admin.condition`.
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

/** ISO string <-> `<input type=date|datetime-local>` value, in local time. */
const toInputDate = (iso: unknown, dayOnly: boolean) => {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  return dayOnly ? local.slice(0, 10) : local.slice(0, 16);
};
const fromInputDate = (v: string) => (v ? new Date(v).toISOString() : null);

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

  private _set(path: Path, v: unknown) {
    this.value = setIn(this.value, path, v);
    const detail: DocFormChange = { value: this.value, path, fieldValue: v };
    this.dispatchEvent(new CustomEvent("ui-change", { detail, bubbles: true }));
  }

  private _error(path: Path) {
    const msg = this.errors[path.join(".")];
    return msg ? html`<ui-text size="sm" color="error">${msg}</ui-text>` : nothing;
  }

  private _fields(fields: FieldLike[], data: Data, path: Path): TemplateResult {
    return html`<ui-flex direction="col" gap="4">${fields.map((f) => this._field(f, data, path))}</ui-flex>`;
  }

  private _field(f: FieldLike, data: Data, path: Path): TemplateResult | typeof nothing {
    if (f.hidden || f.admin?.hidden || f.type === "ui" || f.type === "join") return nothing;
    if (f.admin?.condition && !f.admin.condition(this.value, data)) return nothing;

    switch (f.type) {
      case "row": {
        const visible = (f.fields ?? []).filter((x) => !x.hidden && !x.admin?.hidden);
        // As many fields side by side as fit (each at least 12rem): no breakpoints.
        return html`<ui-grid fit="xs" gap="4">${visible.map((x) => this._field(x, data, path))}</ui-grid>`;
      }
      case "collapsible":
        return html`<ui-collapse mode="checkbox" icon="arrow" open .heading=${labelOf(f) || "Details"}>
          ${this._fields(f.fields ?? [], data, path)}
        </ui-collapse>`;
      case "tabs":
        return html`<ui-tabs
          variant="border"
          .items=${(f.tabs ?? []).map((tab) => ({
            label: typeof tab.label === "string" ? tab.label : humanize(tab.name ?? ""),
            content: tab.name
              ? this._fields(tab.fields, isObj(data[tab.name]) ? (data[tab.name] as Data) : {}, [...path, tab.name])
              : this._fields(tab.fields, data, path),
          }))}
        ></ui-tabs>`;
      case "group": {
        const name = f.name!;
        return html`<ui-fieldset .legend=${labelOf(f)} .hint=${f.admin?.description ?? ""} surface="base-200">
          ${this._fields(f.fields ?? [], isObj(data[name]) ? (data[name] as Data) : {}, [...path, name])}
        </ui-fieldset>`;
      }
      case "array":
      case "blocks":
        return this._rows(f, data, path);
      default:
        return this._input(f, data, path);
    }
  }

  private _rows(f: FieldLike, data: Data, path: Path) {
    const name = f.name!;
    const rows = Array.isArray(data[name]) ? (data[name] as Data[]) : [];
    const at = [...path, name];
    const labels = (f as { labels?: { singular?: unknown } }).labels;
    const singular = typeof labels?.singular === "string" ? labels.singular : "Row";
    const move = (i: number, by: number) => {
      const next = [...rows];
      const [row] = next.splice(i, 1);
      next.splice(i + by, 0, row);
      this._set(at, next);
    };
    const add = (blockType?: string) => this._set(at, [...rows, { id: newId(), ...(blockType ? { blockType } : {}) }]);
    const blockOf = (row: Data) => f.blocks?.find((b) => b.slug === row.blockType);
    const blockLabel = (slug: string) => {
      const b = f.blocks?.find((x) => x.slug === slug);
      return typeof b?.labels?.singular === "string" ? b.labels.singular : humanize(slug);
    };

    return html`<ui-flex direction="col" gap="2">
      <ui-flex align="center" gap="2">
        <ui-text weight="semibold">${labelOf(f)}</ui-text>
        <ui-badge size="sm" variant="soft">${rows.length}</ui-badge>
      </ui-flex>
      ${f.admin?.description ? html`<ui-text size="sm" color="muted">${f.admin.description}</ui-text>` : nothing}
      ${this._error(at)}
      ${rows.map(
        (row, i) =>
          html`<ui-box border rounded="box" padding="4">
            <ui-flex direction="col" gap="3">
              <ui-flex align="center" justify="between" gap="2">
                <ui-text size="sm" weight="semibold">
                  ${f.type === "blocks" ? blockLabel(text(row.blockType)) : singular} ${text(i + 1).padStart(2, "0")}
                </ui-text>
                ${
                  this.readonly
                    ? nothing
                    : html`<ui-flex gap="1">
                        <ui-button
                          size="xs"
                          variant="ghost"
                          label="Move up"
                          .disabled=${i === 0}
                          @click=${() => move(i, -1)}
                          >↑</ui-button
                        >
                        <ui-button
                          size="xs"
                          variant="ghost"
                          label="Move down"
                          .disabled=${i === rows.length - 1}
                          @click=${() => move(i, 1)}
                          >↓</ui-button
                        >
                        <ui-button
                          size="xs"
                          variant="ghost"
                          color="error"
                          label="Remove"
                          @click=${() =>
                            this._set(
                              at,
                              rows.filter((_, j) => j !== i),
                            )}
                          >Remove</ui-button
                        >
                      </ui-flex>`
                }
              </ui-flex>
              ${this._fields(f.type === "blocks" ? (blockOf(row)?.fields ?? []) : (f.fields ?? []), row, [...at, i])}
            </ui-flex>
          </ui-box>`,
      )}
      ${
        this.readonly
          ? nothing
          : html`<ui-flex gap="2" wrap>
              ${
                f.type === "blocks"
                  ? (f.blocks ?? []).map(
                      (b) =>
                        html`<ui-button size="sm" variant="dash" @click=${() => add(b.slug)}
                          >+ ${blockLabel(b.slug)}</ui-button
                        >`,
                    )
                  : html`<ui-button size="sm" variant="dash" @click=${() => add()}>+ Add ${singular}</ui-button>`
              }
            </ui-flex>`
      }
    </ui-flex>`;
  }

  private _input(f: FieldLike, data: Data, path: Path) {
    const name = f.name!;
    const at = [...path, name];
    const v = data[name];
    const label = labelOf(f) + (f.required ? " *" : "");
    const hint = f.admin?.description ?? "";
    const placeholder = textOf(f.admin?.placeholder);
    const disabled = this.readonly || !!f.admin?.readOnly;
    const set = (x: unknown) => this._set(at, x);
    const target = (e: Event) => e.target as HTMLInputElement;
    let control: TemplateResult;

    switch (f.type) {
      case "text":
      case "email":
        control = html`<ui-text-input
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
        // hasMany numbers (e.g. line numbers 1, 2, 5) are edited as a comma-separated list.
        if (f.hasMany) {
          control = html`<ui-text-input
            .legend=${label}
            .hint=${hint ?? "Comma-separated numbers"}
            .value=${Array.isArray(v) ? v.join(", ") : v == null ? "" : text(v)}
            .readonly=${disabled}
            field-width="full"
            width="full"
            @input=${(e: Event) =>
              set(
                target(e)
                  .value.split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map(Number),
              )}
          ></ui-text-input>`;
          break;
        }
        control = html`<ui-text-input
          .legend=${label}
          .hint=${hint}
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
        const dayOnly = f.admin?.date?.pickerAppearance === "dayOnly";
        control = html`<ui-text-input
          .legend=${label}
          .hint=${hint}
          .type=${dayOnly ? "date" : "datetime-local"}
          .value=${toInputDate(v, dayOnly)}
          .readonly=${disabled}
          field-width="full"
          width="full"
          @input=${(e: Event) => set(fromInputDate(target(e).value))}
        ></ui-text-input>`;
        break;
      }
      case "textarea":
      case "code":
      case "richText":
        control = html`<ui-textarea
          .legend=${label}
          .hint=${hint}
          .value=${typeof v === "string" ? v : v == null ? "" : JSON.stringify(v)}
          .placeholder=${placeholder}
          .readonly=${disabled}
          field-width="full"
          width="full"
          @input=${(e: Event) => set((e.target as HTMLTextAreaElement).value)}
        ></ui-textarea>`;
        break;
      case "json":
        control = html`<ui-textarea
          .legend=${label}
          .hint=${hint}
          .value=${v == null ? "" : JSON.stringify(v, null, 2)}
          .readonly=${disabled}
          field-width="full"
          width="full"
          height="48"
          @change=${(e: Event) => {
            const text = (e.target as HTMLTextAreaElement).value;
            try {
              set(text.trim() ? JSON.parse(text) : null);
            } catch {
              set(text);
            }
          }}
        ></ui-textarea>`;
        break;
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
        control = html`<ui-grid cols="2" gap="4">${part(0, `${label} · longitude`)}${part(1, "Latitude")}</ui-grid>`;
        break;
      }
      case "select":
      case "radio":
      case "relationship":
      case "upload":
        control = this._choice(f, v, set, label, hint, disabled);
        break;
      default:
        control = html`<ui-text size="sm" color="muted">${label}: unsupported field type "${f.type}"</ui-text>`;
    }
    return html`<ui-flex direction="col" gap="1">${control}${this._error(at)}</ui-flex>`;
  }

  private _options(f: FieldLike): RelationOption[] {
    if (f.type === "select" || f.type === "radio") {
      return (f.options ?? []).map((o) =>
        typeof o === "string" ? { value: o, label: o } : { value: o.value, label: text(o.label) },
      );
    }
    const targets = Array.isArray(f.relationTo) ? f.relationTo : [f.relationTo ?? ""];
    return targets.flatMap((slug) =>
      (this.relations[slug] ?? []).map((o) =>
        Array.isArray(f.relationTo) ? { value: `${slug}:${o.value}`, label: `${humanize(slug)}: ${o.label}` } : o,
      ),
    );
  }

  private _choice(
    f: FieldLike,
    v: unknown,
    set: (x: unknown) => void,
    label: string,
    hint: unknown,
    disabled: boolean,
  ) {
    const options = this._options(f);
    const poly = Array.isArray(f.relationTo);
    // Stored value -> option value (relationships may arrive populated; polymorphic as { relationTo, value }).
    const toOption = (x: unknown): string => {
      if (poly && isObj(x)) return `${text(x.relationTo)}:${text(isObj(x.value) ? x.value.id : x.value)}`;
      if (isObj(x) && "id" in x) return text(x.id);
      return x == null ? "" : text(x);
    };
    const fromOption = (o: string): unknown => {
      if (!o) return null;
      if (!poly) return o;
      const i = o.indexOf(":");
      return { relationTo: o.slice(0, i), value: o.slice(i + 1) };
    };

    if (f.hasMany) {
      const selected = new Set((Array.isArray(v) ? v : []).map(toOption));
      return html`<ui-fieldset .legend=${label} .hint=${hint ?? ""}>
        <ui-flex gap="4" wrap>
          ${
            options.length
              ? options.map(
                  (o) =>
                    html`<ui-checkbox
                      size="sm"
                      .label=${o.label}
                      .checked=${selected.has(o.value)}
                      .disabled=${disabled}
                      @change=${(e: Event) => {
                        const next = new Set(selected);
                        if ((e.target as HTMLInputElement).checked) next.add(o.value);
                        else next.delete(o.value);
                        set(options.filter((x) => next.has(x.value)).map((x) => fromOption(x.value)));
                      }}
                    ></ui-checkbox>`,
                )
              : html`<ui-text size="sm" color="muted">Nothing to choose from yet.</ui-text>`
          }
        </ui-flex>
      </ui-fieldset>`;
    }

    if (f.type === "radio") {
      return html`<ui-radio
        .legend=${label}
        .hint=${hint ?? ""}
        direction="horizontal"
        .options=${options}
        .value=${toOption(v)}
        .disabled=${disabled}
        @change=${(e: Event) => set(fromOption((e.target as HTMLInputElement).value))}
      ></ui-radio>`;
    }

    return html`<ui-select
      .legend=${label}
      .hint=${hint ?? ""}
      .options=${[{ label: "—", value: "" }, ...options]}
      .value=${toOption(v)}
      .disabled=${disabled}
      field-width="full"
      width="full"
      @change=${(e: Event) => set(fromOption((e.target as HTMLSelectElement).value))}
    ></ui-select>`;
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
