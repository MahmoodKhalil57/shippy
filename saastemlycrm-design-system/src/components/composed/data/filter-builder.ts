import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/actions/dropdown.ts";
import "../../primitives/data/chip.ts";
import "../../primitives/forms/checkbox.ts";
import "../../primitives/forms/search.ts";
import "../../primitives/forms/select.ts";
import "../../primitives/forms/text-input.ts";
import "../../primitives/layout/box.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/media/icon.ts";
import "../../primitives/typography/text.ts";
import { intl, m } from "../../../lib/i18n/index.ts";
import {
  filterComplete,
  filterWhere,
  type FilterCondition,
  type FilterField,
  type FilterFieldType,
  type FilterMatch,
  type FilterOperator,
  type FilterValue,
} from "../../../lib/base/filter-query.ts";

export * from "../../../lib/base/filter-query.ts";

interface OperatorChoice {
  operator: FilterOperator;
  label: () => string;
  value?: boolean;
}
const SET: OperatorChoice[] = [
  { operator: "exists", label: () => m.filter_builder_op_is_set(), value: true },
  { operator: "exists", label: () => m.filter_builder_op_is_empty(), value: false },
];
const OPERATORS: Record<FilterFieldType, OperatorChoice[]> = {
  text: [
    { operator: "like", label: () => m.filter_builder_op_contains() },
    { operator: "not_like", label: () => m.filter_builder_op_not_contains() },
    { operator: "equals", label: () => m.filter_builder_op_is() },
    { operator: "not_equals", label: () => m.filter_builder_op_is_not() },
    ...SET,
  ],
  number: [
    { operator: "equals", label: () => "=" },
    { operator: "not_equals", label: () => "≠" },
    { operator: "greater_than", label: () => ">" },
    { operator: "greater_than_equal", label: () => "≥" },
    { operator: "less_than", label: () => "<" },
    { operator: "less_than_equal", label: () => "≤" },
    ...SET,
  ],
  date: [
    { operator: "greater_than", label: () => m.filter_builder_op_after() },
    { operator: "less_than", label: () => m.filter_builder_op_before() },
    ...SET,
  ],
  select: [
    { operator: "in", label: () => m.filter_builder_op_any_of() },
    { operator: "not_in", label: () => m.filter_builder_op_none_of() },
    ...SET,
  ],
  boolean: [
    { operator: "equals", label: () => m.filter_builder_op_yes(), value: true },
    { operator: "equals", label: () => m.filter_builder_op_no(), value: false },
  ],
};
const choiceKey = (c: OperatorChoice) => (c.value === undefined ? c.operator : `${c.operator}:${String(c.value)}`);
const choiceOf = (type: FilterFieldType, c: FilterCondition) =>
  OPERATORS[type].find((o) => o.operator === c.operator && (o.value === undefined || o.value === c.value)) ??
  OPERATORS[type][0]!;

@customElement("ui-filter-builder")
export class UiFilterBuilder extends LightElement {
  @property({ attribute: false }) fields: FilterField[] = [];
  @property({ attribute: false }) value: FilterCondition[] = [];
  @property() match: FilterMatch = "and";

  @state() private _draft?: FilterCondition;
  @state() private _editing = -1;
  @state() private _search = "";

  private _field(name: string) {
    return this.fields.find((f) => f.name === name) ?? this.fields[0]!;
  }

  private _fresh(name = this.fields[0]!.name): FilterCondition {
    const field = this._field(name);
    const first = OPERATORS[field.type][0]!;
    return { field: name, operator: first.operator, value: first.value ?? (field.type === "select" ? [] : "") };
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
    const draft = this._draft!;
    if (!filterComplete(draft)) return;
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
    const choice = choiceOf(field.type, c);
    if (choice.value !== undefined) return "";
    const values = Array.isArray(c.value) ? c.value : [c.value];
    const labels = values.map((v) => field.options?.find((o) => o.value === v)?.label ?? String(v));
    const list = intl.list({ type: "disjunction" });
    return labels.length > 2
      ? m.filter_builder_values_more({ values: list.format(labels.slice(0, 2)), count: labels.length - 2 })
      : list.format(labels);
  }

  private _chip(c: FilterCondition, i: number) {
    const field = this._field(c.field);
    const choice = choiceOf(field.type, c);
    const value = this._valueLabel(c);
    return html`<ui-chip
      variant="filter"
      size="md"
      pressable
      removable
      .removeLabel=${m.filter_builder_remove_filter({ field: field.label })}
      @ui-press=${() => this._edit(i)}
      @ui-remove=${() => this._remove(i)}
    >
      <span>${field.label}</span>
      <ui-text as="span" color="muted">${choice.label()}</ui-text>
      ${value ? html`<ui-text emphasized as="span">${value}</ui-text>` : nothing}
    </ui-chip>`;
  }

  private _valueControl(draft: FilterCondition, field: FilterField) {
    const choice = choiceOf(field.type, draft);
    if (choice.value !== undefined) return nothing;
    const set = (value: FilterValue) => (this._draft = { ...draft, value });
    if (field.type === "select") {
      const picked = Array.isArray(draft.value) ? (draft.value as string[]) : [];
      const options = (field.options ?? []).filter((o) =>
        o.label.toLocaleLowerCase().includes(this._search.toLocaleLowerCase()),
      );
      return html`${
          (field.options?.length ?? 0) > 8
            ? html`<ui-search
                size="sm"
                .label=${m.filter_builder_search_options({ field: field.label })}
                .value=${this._search}
                @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)}
              ></ui-search>`
            : nothing
        }
        <ui-box max-height="56"
          ><ui-flex direction="col" gap="1">
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
          </ui-flex></ui-box
        >`;
    }
    return html`<ui-text-input
      size="sm"
      width="full"
      .leading=${m.filter_builder_value()}
      type=${field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      placeholder=${field.type === "text" ? m.filter_builder_value() : ""}
      .value=${String(draft.value)}
      @input=${(e: Event) => set((e.target as HTMLInputElement).value)}
      @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._apply()}
    ></ui-text-input>`;
  }

  private _editor() {
    const draft = this._draft ?? this._fresh();
    const field = this._field(draft.field);
    const choices = OPERATORS[field.type];
    return html`<ui-flex direction="col" gap="3" full-width>
      <ui-select
        size="sm"
        width="full"
        .leading=${m.filter_builder_field()}
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
        .leading=${m.filter_builder_is()}
        .options=${choices.map((c) => ({ label: c.label(), value: choiceKey(c) }))}
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
      <ui-flex justify="end" align="center" gap="2">
        ${
          this._editing >= 0
            ? html`<ui-button size="xs" variant="text" color="error" @click=${() => this._remove(this._editing)}
                >${m.filter_builder_remove()}</ui-button
              >`
            : nothing
        }
        <ui-button size="xs" color="primary" ?disabled=${!filterComplete(draft)} @click=${() => this._apply()}
          >${this._editing >= 0 ? m.filter_builder_update() : m.filter_builder_add_filter()}</ui-button
        >
      </ui-flex>
    </ui-flex>`;
  }

  render() {
    if (!this.fields.length) return nothing;
    return html`<ui-flex wrap gap="2" align="center">
      ${this.value.map((c, i) => this._chip(c, i))}
      ${
        this.value.length > 1
          ? html`<ui-select
              size="sm"
              .leading=${m.filter_builder_match()}
              .options=${[
                { label: m.filter_builder_match_all(), value: "and" },
                { label: m.filter_builder_match_any(), value: "or" },
              ]}
              .value=${this.match}
              @change=${(e: Event) => this._emit(this.value, (e.target as HTMLSelectElement).value as FilterMatch)}
            ></ui-select>`
          : nothing
      }
      <ui-dropdown
        mode="popover"
        panel="card"
        panel-width="6"
        trigger-variant="text"
        trigger-size="xs"
        .label=${m.filter_builder_add_filter()}
        @click=${(e: Event) => (e.target as Element).closest("[data-trigger]") && this._edit(-1)}
      >
        <span slot="trigger"><ui-icon name="filter" size="sm"></ui-icon> ${m.filter_builder_filter()}</span>
        ${this._editor()}
      </ui-dropdown>
      ${
        this.value.length
          ? html`<ui-button size="xs" variant="text" @click=${() => this._emit([])}
              >${m.filter_builder_clear()}</ui-button
            >`
          : nothing
      }
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-filter-builder": UiFilterBuilder;
  }
}
