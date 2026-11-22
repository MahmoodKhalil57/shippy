import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { chip, chipRemove } from "../data/chip.ts";
import { floating, floatingHeight, inset, row, rowEnd, stack, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { fieldsetField, type FieldsetVariants } from "./fieldset.ts";

/**
 * Combobox: a searchable select. Type to narrow the options; pick one, or several (`multiple`,
 * shown as chips); `creatable` also accepts what was typed (free values: tags, numbers).
 *
 * Purpose: Forms & input · Kind: primitive (Shippy; WAI-ARIA combobox with a listbox popup)
 *
 * Keyboard: ↓ / ↑ move through the options, Enter picks, Escape closes, Backspace in an empty
 * box removes the last chip. The list is a popover anchored under the field, so a scrolling
 * panel or card around it never clips it. `ui-change` carries `{ value }`: a string, or an
 * array of strings with `multiple`.
 */
export const combobox = rcva(
  "input h-auto min-h-(--size) min-w-0 cursor-text max-w-full flex-wrap items-center gap-1 py-1 [anchor-scope:--combobox]",
  {
    variants: {
      color: { error: "input-error" },
      size: { sm: "input-sm", md: "input-md" },
      width: { full: "w-full", auto: "w-auto" },
      disabled: { true: "cursor-not-allowed opacity-70" },
    },
    defaultVariants: { width: "full" },
  },
);
export const comboboxInput = rcva("min-w-[min(100%,5rem)] flex-1 bg-transparent outline-none");
// layout: fixed (the clear and open icon buttons)
export const comboboxIcon = rcva(`${row} ${rowEnd} items-center gap-0.5 text-on-surface-variant`);
export const comboboxClear = rcva(
  "touch-target grid size-6 place-items-center rounded-full state-layer hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary",
);
/** The options: a glass popover under the field, growing down from it (M3 enter / exit). */
export const comboboxList = rcva(
  `${text.label} liquid-glass [--outer-radius:var(--radius-box)] [--outer-padding:var(--space-50)] shadow-elevation-2 m-0 mt-1 ${floatingHeight.fit} ${floatingHeight.list} ${floating.anchor} origin-top overflow-y-auto overscroll-contain rounded-box p-1 text-body-md [position-area:bottom_span-right] [position-try-fallbacks:flip-block] scale-y-90 opacity-0 open:scale-y-100 open:opacity-100 [transition:opacity_var(--duration-short2)_var(--ease-emphasized-accelerate),scale_var(--duration-short3)_var(--ease-emphasized-accelerate),display_var(--duration-short3)_allow-discrete,overlay_var(--duration-short3)_allow-discrete] open:[transition:opacity_var(--duration-short3)_var(--ease-emphasized-decelerate),scale_var(--duration-medium1)_var(--ease-emphasized-decelerate),display_var(--duration-medium1)_allow-discrete,overlay_var(--duration-medium1)_allow-discrete] starting:open:scale-y-90 starting:open:opacity-0 motion-reduce:scale-y-100 [--scrollbar-inset:var(--radius-box)]`,
);
export const comboboxGroup = rcva(`${inset["3"]} pt-2 pb-1 text-label-md text-on-surface-variant`);
export const comboboxOption = rcva(
  `${row} ${inset["3"]} cursor-pointer items-start gap-2 rounded-inner py-1.5 [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast)]`,
  {
    variants: {
      active: { true: "bg-on-surface/(--state-focus)" },
      selected: { true: "font-semibold" },
    },
  },
);
export const comboboxOptionText = rcva(`${stack} min-w-0 flex-1`);
export const comboboxOptionDescription = rcva(`${text.label} text-body-sm font-normal text-on-surface-variant`);
export const comboboxCheck = rcva("mt-0.5 size-4 shrink-0 text-primary", {
  variants: { shown: { true: "", false: "invisible" } },
});
export const comboboxEmpty = rcva(`${inset["3"]} py-2 text-on-surface-variant`);

export type ComboboxVariants = VariantProps<typeof combobox>;

export interface ComboboxOption {
  value: string;
  label: string;
  /** A second line under the label. */
  description?: string;
  /** Options with the same group are listed under that heading. */
  group?: string;
}

/** Options rendered at once; typing narrows a longer list. */
const SHOWN = 200;

/**
 * @example
 * <ui-combobox legend="Customer" .options=${customers} value="atlas"
 *   @ui-change=${(e) => (customer = e.detail.value)}></ui-combobox>
 * @example <ui-combobox legend="Approvers" multiple .options=${users} .value=${["ky", "sa"]}></ui-combobox>
 * @example <ui-combobox legend="Tags" multiple creatable .value=${["urgent"]}></ui-combobox>
 */
@customElement("ui-combobox")
export class UiCombobox extends LightElement {
  @property({ attribute: false }) options: ComboboxOption[] = [];
  /** The picked value (or values, with `multiple`). */
  @property({ attribute: false }) value: string | string[] = "";
  @property({ type: Boolean }) multiple = false;
  /** Accept typed values that aren't among the options. */
  @property({ type: Boolean }) creatable = false;
  /** A ✕ that empties the field. */
  @property({ type: Boolean }) clearable = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property() placeholder = "";
  @property() color: ComboboxVariants["color"];
  @property() size: ComboboxVariants["size"];
  @property() legend: Renderable = "";
  @property() label: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "field-width" }) fieldWidth: FieldsetVariants["width"];
  /** Read when the options are values typed by people (numbers): `inputmode` for the box. */
  @property() inputmode?: string;

  @state() private _query = "";
  @state() private _open = false;
  @state() private _active = 0;
  @query("input") private _input?: HTMLInputElement;
  @query("[popover]") private _list?: HTMLElement;

  private _id = uid("combobox");

  private get _values(): string[] {
    return Array.isArray(this.value) ? this.value : this.value ? [this.value] : [];
  }

  private _labelOf(value: string) {
    return this.options.find((o) => o.value === value)?.label ?? value;
  }

  /** Options matching what's typed (every word, any order), then "Add …" when creatable. */
  private get _matches(): (ComboboxOption & { create?: boolean })[] {
    const words = this._query.toLowerCase().split(/\s+/).filter(Boolean);
    const hit = (o: ComboboxOption) => {
      const hay = `${o.label} ${o.description ?? ""} ${o.group ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    };
    const list = this.options.filter(hit).slice(0, SHOWN);
    const typed = this._query.trim();
    const exists = this.options.some((o) => o.label.toLowerCase() === typed.toLowerCase());
    return this.creatable && typed && !exists && !this._values.includes(typed)
      ? [...list, { value: typed, label: `Add “${typed}”`, create: true }]
      : list;
  }

  private _show() {
    if (this.disabled || this.readonly || this._open) return;
    this._open = true;
    this._active = Math.max(
      0,
      this._matches.findIndex((o) => this._values.includes(o.value)),
    );
    void this.updateComplete.then(() => this._list?.showPopover?.());
  }

  private _hide() {
    if (!this._open) return;
    this._open = false;
    this._query = "";
    if (this._list?.matches(":popover-open")) this._list.hidePopover();
  }

  private _emit(values: string[]) {
    this.value = this.multiple ? values : (values[0] ?? "");
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: this.value }, bubbles: true }));
  }

  private _pick(option: ComboboxOption) {
    const values = this._values;
    if (this.multiple) {
      this._emit(values.includes(option.value) ? values.filter((v) => v !== option.value) : [...values, option.value]);
      this._query = "";
      this._input?.focus();
    } else {
      this._emit([option.value]);
      this._hide();
    }
  }

  private _remove(value: string) {
    this._emit(this._values.filter((v) => v !== value));
    this._input?.focus();
  }

  private _keydown(e: KeyboardEvent) {
    const matches = this._matches;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!this._open) return this._show();
      const step = e.key === "ArrowDown" ? 1 : -1;
      this._active = (this._active + step + matches.length) % Math.max(1, matches.length);
      void this.updateComplete.then(() =>
        this.querySelector(`#${this._id}-${this._active}`)?.scrollIntoView({ block: "nearest" }),
      );
    } else if (e.key === "Enter") {
      if (!this._open) return;
      e.preventDefault();
      const option = matches[this._active];
      if (option) this._pick(option);
    } else if (e.key === "Escape") {
      if (this._open) e.stopPropagation();
      this._hide();
    } else if (e.key === "Backspace" && !this._query && this.multiple && this._values.length) {
      this._remove(this._values.at(-1)!);
    } else if (e.key === "Tab") {
      this._hide();
    }
  }

  private _focusout = (e: FocusEvent) => {
    if (!this.contains(e.relatedTarget as Node | null)) this._hide();
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("focusout", this._focusout);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("focusout", this._focusout);
  }

  render() {
    const values = this._values;
    const matches = this._open ? this._matches : [];
    const listId = `${this._id}-list`;
    const locked = this.disabled || this.readonly;
    const single = !this.multiple && values[0] ? this._labelOf(values[0]) : "";
    let lastGroup: string | undefined;
    const control = html`<div
        class=${combobox({ color: this.color, size: this.size, disabled: this.disabled })}
        style=${`anchor-name:--${this._id}`}
        @click=${() => {
          this._input?.focus();
          this._show();
        }}
      >
        ${
          this.multiple
            ? values.map(
                (v) =>
                  html`<span class=${chip({ variant: "input", size: "sm", removable: !locked })}
                    >${this._labelOf(v)}${
                      locked
                        ? nothing
                        : html`<button
                            type="button"
                            class=${chipRemove({ variant: "input" })}
                            aria-label=${`Remove ${this._labelOf(v)}`}
                            @click=${(e: Event) => {
                              e.stopPropagation();
                              this._remove(v);
                            }}
                          >
                            ${iconSvg("x", { size: "xs" })}
                          </button>`
                    }</span
                  >`,
              )
            : nothing
        }
        <input
          id=${this._id}
          class=${comboboxInput()}
          role="combobox"
          autocomplete="off"
          inputmode=${ifDefined(this.inputmode)}
          aria-expanded=${this._open ? "true" : "false"}
          aria-controls=${listId}
          aria-autocomplete="list"
          aria-activedescendant=${ifDefined(this._open && matches.length ? `${this._id}-${this._active}` : undefined)}
          placeholder=${this.multiple && values.length ? "" : this.placeholder || (this.multiple ? "Choose…" : "—")}
          .value=${this._open || this.multiple ? this._query : single}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @focus=${() => this._show()}
          @input=${(e: Event) => {
            this._query = (e.target as HTMLInputElement).value;
            this._active = 0;
            this._show();
          }}
          @keydown=${(e: KeyboardEvent) => this._keydown(e)}
        />
        <span class=${comboboxIcon()}>
          ${
            this.clearable && values.length && !locked
              ? html`<button
                  type="button"
                  class=${comboboxClear()}
                  aria-label="Clear"
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this._emit([]);
                  }}
                >
                  ${iconSvg("x", { size: "xs" })}
                </button>`
              : nothing
          }
          ${locked ? nothing : iconSvg("unfold", { size: "sm" })}
        </span>
      </div>
      <ul
        id=${listId}
        popover="manual"
        role="listbox"
        aria-multiselectable=${this.multiple ? "true" : "false"}
        class=${comboboxList()}
        style=${`position-anchor:--${this._id}`}
        @mousedown=${(e: Event) => e.preventDefault()}
      >
        ${
          this._open && !matches.length
            ? html`<li class=${comboboxEmpty()} role="presentation">
                ${this.options.length ? "No matches" : this.creatable ? "Type to add" : "Nothing to choose from"}
              </li>`
            : nothing
        }
        ${matches.map((o, i) => {
          const heading =
            o.group && o.group !== lastGroup
              ? html`<li class=${comboboxGroup()} role="presentation">${o.group}</li>`
              : nothing;
          lastGroup = o.group;
          const selected = values.includes(o.value);
          return html`${heading}
            <li
              id=${`${this._id}-${i}`}
              role="option"
              aria-selected=${selected ? "true" : "false"}
              class=${comboboxOption({ active: i === this._active, selected })}
              @mouseenter=${() => (this._active = i)}
              @click=${() => this._pick(o)}
            >
              <span class=${comboboxCheck({ shown: selected })}>${iconSvg("check", { size: "sm" })}</span>
              <span class=${comboboxOptionText()}>
                <span>${o.label}</span>
                ${o.description ? html`<span class=${comboboxOptionDescription()}>${o.description}</span>` : nothing}
              </span>
            </li>`;
        })}
      </ul>`;
    return fieldsetField(
      { legend: this.legend, label: this.label, hint: this.hint, controlId: this._id, width: this.fieldWidth },
      control,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-combobox": UiCombobox;
  }
}
