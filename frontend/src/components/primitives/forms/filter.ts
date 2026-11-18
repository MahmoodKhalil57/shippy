import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, uid } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button, type ButtonVariants } from "../actions/button.ts";

/**
 * Filter: Group of radio buttons; choosing one hides the others and shows a reset button.
 *
 * Purpose: Forms & input · Kind: primitive (uses the Button recipe for its options)
 * Docs: https://daisyui.com/components/filter/
 *
 * With checkboxes (`multiple`) nothing is hidden; the reset button appears once
 * anything is checked. Button `size` / `color` / `variant` are responsive.
 */
export const filter = rcva("filter");

/** Reset radio used when the filter can't be a `<form>` (shows "×" via CSS). */
export const filterReset = rcva("filter-reset");

export type FilterVariants = VariantProps<typeof filter>;

export interface FilterOption {
  label: string;
  value?: string;
}

/**
 * @example <ui-filter name="framework" .options=${[{ label: "Svelte" }, { label: "Vue" }, { label: "React" }]}></ui-filter>
 * @example <ui-filter multiple .options=${[...]} ></ui-filter>
 * @example <ui-filter no-form reset-label="All" .options=${[...]}></ui-filter>
 *
 * `ui-change` carries `{ value }` (radio mode; "" after reset) or `{ values }` (multiple).
 */
@customElement("ui-filter")
export class UiFilter extends LightElement {
  @property({ attribute: false }) options: FilterOption[] = [];
  @property() name = uid("filter");
  /** Checkboxes instead of radios: several options can be picked. */
  @property({ type: Boolean }) multiple = false;
  /**
   * Render a `<div>` with a `filter-reset` radio instead of a `<form>` with a
   * reset button. Use it when the filter sits inside another form.
   */
  @property({ type: Boolean, attribute: "no-form" }) noForm = false;
  /** aria-label of the `filter-reset` radio in `no-form` mode. */
  @property({ attribute: "reset-label" }) resetLabel = "All";
  @property() size: ButtonVariants["size"];
  @property() color: ButtonVariants["color"];
  @property() variant: ButtonVariants["variant"];
  @property() value = "";
  @property({ attribute: false }) values: string[] = [];

  private _val(o: FilterOption) {
    return o.value ?? o.label;
  }

  private _emit() {
    const detail = this.multiple ? { values: this.values } : { value: this.value };
    this.dispatchEvent(new CustomEvent("ui-change", { detail, bubbles: true }));
  }

  private _pick(o: FilterOption, checked: boolean) {
    const v = this._val(o);
    if (this.multiple) {
      this.values = checked ? [...this.values, v] : this.values.filter((x) => x !== v);
    } else {
      this.value = v;
    }
    this._emit();
  }

  private _reset() {
    this.value = "";
    this.values = [];
    this._emit();
  }

  render() {
    const btn = button({ size: this.size, color: this.color, variant: this.variant });
    const options = this.options.map(
      (o) =>
        html`<input
          class=${btn}
          type=${this.multiple ? "checkbox" : "radio"}
          name=${this.name}
          value=${this._val(o)}
          autocomplete="off"
          aria-label=${o.label}
          .checked=${this.multiple ? this.values.includes(this._val(o)) : this.value === this._val(o)}
          @change=${(e: Event) => this._pick(o, (e.target as HTMLInputElement).checked)}
        />`,
    );

    if (this.noForm) {
      return html`<div class=${filter()}>
        <input
          class=${button({ size: this.size, variant: this.variant, class: filterReset() })}
          type="radio"
          name=${this.name}
          autocomplete="off"
          aria-label=${this.resetLabel}
          .checked=${!this.value}
          @change=${this._reset}
        />
        ${options}
      </div>`;
    }

    const reset = html`<input
      class=${button({ size: this.size, variant: this.variant, shape: "square" })}
      type="reset"
      value="×"
      aria-label="Reset"
    />`;
    return html`<form class=${filter()} @reset=${this._reset}>
      ${this.multiple ? [options, reset] : [reset, options]}
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-filter": UiFilter;
  }
}
