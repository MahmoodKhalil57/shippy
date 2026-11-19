import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";
import {
  filterComplete,
  filterWhere,
  type FilterCondition,
  type FilterField,
  type FilterFieldType,
  type FilterMatch,
  type FilterOperator,
  type FilterValue,
} from "../../base/filter-query.ts";

export * from "../../base/filter-query.ts";

/**
 * Filter builder: narrows a data table with conditions, shown as chips ("Stage is any of Won,
 * Lost"), each editable and removable, combined with "all" or "any". Its output is a Payload
 * `where` query (payloadcms.com/docs/queries/overview), ready for the REST API.
 *
 * Purpose: Data & metrics · Kind: primitive (Shippy)
 *
 * The fields to filter on come from the page (`fields`): each with a type that picks its
 * operators and value control —
 * - `text`: contains / doesn't contain / is / is not
 * - `number`: = ≠ > ≥ < ≤
 * - `date`: after / before (whole days)
 * - `select` (with `options`, also for relationships): is any of / is none of, as checkboxes
 * - `boolean`: is yes / is no
 * and every type: is set / is empty.
 * `ui-change` carries `{ value, match, where }` whenever the conditions change.
 */
export const filterBar = rcva("flex flex-wrap items-center gap-2");
export const filterChip = rcva(
  "inline-flex max-w-full items-center rounded-field border border-base-content/15 bg-base-100/70 text-sm [transition:border-color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:border-base-content/30",
);
export const filterChipBody = rcva(
  "flex min-w-0 items-baseline gap-1 truncate rounded-s-field py-1 ps-2.5 pe-1 text-start hover:bg-base-content/5 focus-visible:outline-2 focus-visible:outline-primary",
);
export const filterChipOperator = rcva("text-base-content/70");
export const filterChipValue = rcva("truncate font-medium");
export const filterChipRemove = rcva(
  "grid size-7 shrink-0 place-items-center rounded-e-field text-base-content/70 hover:bg-base-content/5 hover:text-base-content focus-visible:outline-2 focus-visible:outline-primary",
);
export const filterTrigger = rcva("flex items-center gap-1");
export const filterEditor = rcva("flex w-full flex-col gap-3");
export const filterOptions = rcva(
  "flex max-h-56 flex-col gap-1 overflow-y-auto overscroll-contain pe-1 [--scrollbar-inset:var(--radius-field)]",
);
export const filterActions = rcva("flex items-center justify-end gap-2");

interface OperatorChoice {
  operator: FilterOperator;
  label: string;
  /** Fixed value (`exists`: true / false); no value control. */
  value?: boolean;
}
const SET: OperatorChoice[] = [
  { operator: "exists", label: "is set", value: true },
  { operator: "exists", label: "is empty", value: false },
];
const OPERATORS: Record<FilterFieldType, OperatorChoice[]> = {
  text: [
    { operator: "like", label: "contains" },
    { operator: "not_like", label: "doesn't contain" },
    { operator: "equals", label: "is" },
    { operator: "not_equals", label: "is not" },
    ...SET,
  ],
  number: [
    { operator: "equals", label: "=" },
    { operator: "not_equals", label: "≠" },
    { operator: "greater_than", label: ">" },
    { operator: "greater_than_equal", label: "≥" },
    { operator: "less_than", label: "<" },
    { operator: "less_than_equal", label: "≤" },
    ...SET,
  ],
  date: [{ operator: "greater_than", label: "after" }, { operator: "less_than", label: "before" }, ...SET],
  select: [{ operator: "in", label: "is any of" }, { operator: "not_in", label: "is none of" }, ...SET],
  boolean: [
    { operator: "equals", label: "is yes", value: true },
    { operator: "equals", label: "is no", value: false },
  ],
};
const choiceKey = (c: OperatorChoice) => (c.value === undefined ? c.operator : `${c.operator}:${String(c.value)}`);
const choiceOf = (type: FilterFieldType, c: FilterCondition) =>
  OPERATORS[type].find((o) => o.operator === c.operator && (o.value === undefined || o.value === c.value)) ??
  OPERATORS[type][0]!;

/**
 * @example
 * <ui-filter-builder .fields=${[
 *   { name: "stage", label: "Stage", type: "select", options: [{ label: "Won", value: "won" }] },
 *   { name: "value", label: "Value", type: "number" },
 * ]} @ui-change=${(e) => load({ where: e.detail.where })}></ui-filter-builder>
 */
@customElement("ui-filter-builder")
export class UiFilterBuilder extends LightElement {
  @property({ attribute: false }) fields: FilterField[] = [];
  @property({ attribute: false }) value: FilterCondition[] = [];
  /** Conditions must all match (`and`) or any one (`or`). */
  @property() match: FilterMatch = "and";

  /** The condition being edited, and which one it replaces (-1: a new one). */
  @state() private _draft?: FilterCondition;
  @state() private _editing = -1;
  @state() private _search = "";

  private _field(name: string) {
    return this.fields.find((f) => f.name === name) ?? this.fields[0];
  }

  private _fresh(name = this.fields[0]?.name ?? ""): FilterCondition {
    const field = this._field(name);
    const first = OPERATORS[field?.type ?? "text"][0]!;
    return { field: name, operator: first.operator, value: first.value ?? (field?.type === "select" ? [] : "") };
  }

  private _emit(value: FilterCondition[], match = this.match) {
    this.value = value;
    this.match = match;
    this.dispatchEvent(
      new CustomEvent("ui-change", {
        detail: { value, match, where: filterWhere(value, match, this.fields) },
        bubbles: true,
      }),
    );
  }

  private get _dropdown() {
    return this.querySelector("ui-dropdown");
  }

  private _edit(index: number) {
    this._editing = index;
    this._draft = index >= 0 ? { ...this.value[index]! } : this._fresh();
    this._search = "";
    if (index >= 0) this._dropdown?.show();
  }

  private _apply() {
    const draft = this._draft;
    if (!draft || !filterComplete(draft)) return;
    const next = [...this.value];
    if (this._editing >= 0) next[this._editing] = draft;
    else next.push(draft);
    this._emit(next);
    this._dropdown?.hide();
  }

  private _remove(index: number) {
    this._emit(this.value.filter((_, i) => i !== index));
    this._dropdown?.hide();
  }

  private _valueLabel(c: FilterCondition) {
    const field = this._field(c.field);
    const choice = choiceOf(field?.type ?? "text", c);
    if (choice.value !== undefined) return "";
    const values = Array.isArray(c.value) ? c.value : [c.value];
    const labels = values.map((v) => field?.options?.find((o) => o.value === v)?.label ?? String(v));
    return labels.length > 2 ? `${labels.slice(0, 2).join(", ")} +${labels.length - 2}` : labels.join(", ");
  }

  private _chip(c: FilterCondition, i: number) {
    const field = this._field(c.field);
    const choice = choiceOf(field?.type ?? "text", c);
    const value = this._valueLabel(c);
    return html`<span class=${filterChip()}>
      <button type="button" class=${filterChipBody()} @click=${() => this._edit(i)}>
        <span>${field?.label ?? c.field}</span>
        <span class=${filterChipOperator()}>${choice.label}</span>
        ${value ? html`<span class=${filterChipValue()}>${value}</span>` : nothing}
      </button>
      <button
        type="button"
        class=${filterChipRemove()}
        aria-label=${`Remove filter: ${field?.label ?? c.field}`}
        @click=${() => this._remove(i)}
      >
        ${iconSvg("x", { size: "xs" })}
      </button>
    </span>`;
  }

  private _valueControl(draft: FilterCondition, field: FilterField) {
    const choice = choiceOf(field.type, draft);
    if (choice.value !== undefined) return nothing;
    const set = (value: FilterValue) => (this._draft = { ...draft, value });
    if (field.type === "select") {
      const picked = Array.isArray(draft.value) ? (draft.value as string[]) : [];
      const options = (field.options ?? []).filter((o) => o.label.toLowerCase().includes(this._search.toLowerCase()));
      return html`${
          (field.options?.length ?? 0) > 8
            ? html`<ui-text-input
                type="search"
                icon="search"
                size="sm"
                width="full"
                placeholder=${`Search ${field.label.toLowerCase()}`}
                .value=${this._search}
                @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)}
              ></ui-text-input>`
            : nothing
        }
        <div class=${filterOptions()} role="group" aria-label=${field.label}>
          ${options.map(
            (o) =>
              html`<ui-checkbox
                size="sm"
                .label=${o.label}
                .checked=${picked.includes(o.value)}
                @change=${(e: Event) => {
                  const on = (e.target as HTMLInputElement).checked;
                  set(on ? [...picked, o.value] : picked.filter((v) => v !== o.value));
                }}
              ></ui-checkbox>`,
          )}
        </div>`;
    }
    return html`<ui-text-input
      size="sm"
      width="full"
      aria-label="Value"
      type=${field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      placeholder=${field.type === "text" ? "Value" : ""}
      .value=${draft.value == null ? "" : String(draft.value)}
      @input=${(e: Event) => set((e.target as HTMLInputElement).value)}
      @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._apply()}
    ></ui-text-input>`;
  }

  private _editor() {
    const draft = this._draft ?? this._fresh();
    const field = this._field(draft.field);
    if (!field) return nothing;
    const choices = OPERATORS[field.type];
    return html`<div class=${filterEditor()}>
      <ui-select
        size="sm"
        width="full"
        leading="Field"
        .options=${this.fields.map((f) => ({ label: f.label, value: f.name }))}
        .value=${draft.field}
        @change=${(e: Event) => {
          this._draft = this._fresh((e.target as HTMLSelectElement).value);
          this._search = "";
        }}
      ></ui-select>
      <ui-select
        size="sm"
        width="full"
        leading="Is"
        .options=${choices.map((c) => ({ label: c.label, value: choiceKey(c) }))}
        .value=${choiceKey(choiceOf(field.type, draft))}
        @change=${(e: Event) => {
          const c = choices.find((x) => choiceKey(x) === (e.target as HTMLSelectElement).value)!;
          const keep = c.value === undefined && choiceOf(field.type, draft).value === undefined;
          this._draft = {
            ...draft,
            operator: c.operator,
            value: c.value ?? (keep ? draft.value : field.type === "select" ? [] : ""),
          };
        }}
      ></ui-select>
      ${this._valueControl(draft, field)}
      <div class=${filterActions()}>
        ${
          this._editing >= 0
            ? html`<ui-button size="sm" variant="ghost" color="error" @click=${() => this._remove(this._editing)}
                >Remove</ui-button
              >`
            : nothing
        }
        <ui-button size="sm" color="primary" ?disabled=${!filterComplete(draft)} @click=${() => this._apply()}
          >${this._editing >= 0 ? "Update" : "Add filter"}</ui-button
        >
      </div>
    </div>`;
  }

  render() {
    if (!this.fields.length) return nothing;
    return html`<div class=${filterBar()} role="group" aria-label="Filters">
      ${this.value.map((c, i) => this._chip(c, i))}
      ${
        this.value.length > 1
          ? html`<ui-select
              size="sm"
              aria-label="Match"
              .options=${[
                { label: "Match all", value: "and" },
                { label: "Match any", value: "or" },
              ]}
              .value=${this.match}
              @change=${(e: Event) => this._emit(this.value, (e.target as HTMLSelectElement).value as FilterMatch)}
            ></ui-select>`
          : nothing
      }
      <ui-dropdown
        mode="popover"
        panel="card"
        panel-width="80"
        trigger-variant="ghost"
        trigger-size="sm"
        .label=${"Add filter"}
      >
        <span slot="trigger" class=${filterTrigger()} @click=${() => this._edit(-1)}
          >${iconSvg("filter", { size: "sm" })} Filter</span
        >
        ${this._editor()}
      </ui-dropdown>
      ${
        this.value.length
          ? html`<ui-button size="sm" variant="ghost" @click=${() => this._emit([])}>Clear filters</ui-button>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-filter-builder": UiFilterBuilder;
  }
}
