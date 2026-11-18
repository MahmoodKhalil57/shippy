import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Validator: Changes form element colors to error or success based on validation rules.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/validator/
 *
 * `validator` goes on an input/select/textarea/checkbox/toggle; it turns green or
 * red after the user interacts (`:user-valid` / `:user-invalid`, or
 * `aria-invalid`). A following sibling `validator-hint` shows only when invalid.
 * Style variants are responsive (e.g. `width="full md:xs"`).
 */
export const validator = rcva("validator", {
  variants: {
    control: {
      input: "input",
      select: "select",
      textarea: "textarea",
      checkbox: "checkbox",
      toggle: "toggle",
    },
    /** Tabular figures (the docs' phone number example). */
    numeric: { true: "tabular-nums" },
  },
  defaultVariants: { control: "input" },
});

/**
 * Plain wrapper used when only `width` is set (the docs wrap each example in
 * `w-full max-w-xs`). Options are written inline so the CSS plugin can read
 * them for responsive values.
 */
export const validatorWrapper = rcva("", {
  variants: { width: { xs: "w-full max-w-xs", sm: "w-full max-w-sm", md: "w-full max-w-md", full: "w-full" } },
});

/** Labelled field ("Form requirement validator"): `fieldset` + `label`. */
export const validatorField = rcva("fieldset", {
  variants: { width: { xs: "w-full max-w-xs", sm: "w-full max-w-sm", md: "w-full max-w-md", full: "w-full" } },
});
export const validatorLabel = rcva("label");

/**
 * Hint shown only while invalid. `collapse` (daisyUI's `hidden` modifier) is a
 * plain boolean: daisyUI reveals `.validator-hint.hidden` itself, so a
 * breakpoint-prefixed `hidden` would not be revealed.
 */
export const validatorHint = rcva("validator-hint", {
  variants: {
    /** Take no space at all until invalid (instead of a reserved, invisible line). */
    collapse: { true: "hidden" },
  },
});

export type ValidatorVariants = VariantProps<typeof validator>;

export interface ValidatorOption {
  label: string;
  value?: string;
  disabled?: boolean;
}

/**
 * @example <ui-validator type="email" required placeholder="mail@site.com" hint="Enter valid email address"></ui-validator>
 * @example <ui-validator type="password" required minlength="8"
 *   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" hint-title="8+ chars incl. number, lower and upper case">
 *   <span slot="hint">Must be more than 8 characters…</span>
 * </ui-validator>
 * @example <ui-validator control="select" required placeholder="Choose:" .options=${[{ label: "Tabs" }, { label: "Spaces" }]} hint="Required"></ui-validator>
 * @example <ui-validator control="toggle" required hint="Required"></ui-validator>
 * @example <ui-validator type="tel" numeric width="xs" required pattern="[0-9]*" minlength="10" maxlength="10" hint="Must be 10 digits"></ui-validator>
 * @example <ui-validator type="email" field-label="Email" collapse-hint required hint="Required"></ui-validator>
 * @example Multi-line hint: `.hint=${["Must be 3 to 30 characters", "containing only letters, numbers or dash"]}`
 *
 * Native `input`/`change`/`invalid` events bubble out. `ui-change` carries
 * `{ value, valid }` (`value` is a boolean for checkbox/toggle). Set `invalid`
 * to force the error state (e.g. server-side validation) via `aria-invalid`.
 */
@customElement("ui-validator")
export class UiValidator extends LightElement {
  @property() control: ValidatorVariants["control"] = "input";
  /** `type` of the input when `control="input"` (email, password, tel, url, date, number…). */
  @property() type = "text";
  @property() name?: string;
  @property() value = "";
  @property({ type: Boolean }) checked = false;
  @property() placeholder?: string;
  @property() pattern?: string;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property() min?: string;
  @property() max?: string;
  @property() step?: string;
  @property() autocomplete?: string;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  /** Force the invalid state (sets `aria-invalid="true"`). */
  @property({ type: Boolean }) invalid = false;
  /** Native tooltip / validation message (the `title` attribute in the docs). */
  @property({ attribute: "hint-title" }) hintTitle?: string;
  /** Hint shown when invalid: text, an array of lines, or `slot="hint"` children. */
  @property() hint: Renderable | Renderable[] = "";
  /** Tabular figures. */
  @property({ converter: responsiveBoolean }) numeric: Responsive<boolean> = false;
  /** Field width. */
  @property() width: VariantProps<typeof validatorWrapper>["width"];
  /** Label above the control; renders the docs' `fieldset` + `label` field. */
  @property({ attribute: "field-label" }) fieldLabel: Renderable = "";
  @property({ type: Boolean, attribute: "collapse-hint" }) collapseHint = false;
  @property({ attribute: false }) options: ValidatorOption[] = [];
  @property() label?: string;

  private _emit(e: Event) {
    const el = e.target as HTMLInputElement;
    const isCheck = this.control === "checkbox" || this.control === "toggle";
    if (isCheck) this.checked = el.checked;
    else this.value = el.value;
    this.dispatchEvent(
      new CustomEvent("ui-change", {
        detail: { value: isCheck ? el.checked : el.value, valid: el.checkValidity() },
        bubbles: true,
      }),
    );
  }

  private _control() {
    const cls = validator({ control: this.control, numeric: this.numeric });
    const ariaInvalid = this.invalid ? "true" : nothing;
    switch (this.control) {
      case "select":
        return html`<select
          class=${cls}
          name=${ifDefined(this.name)}
          title=${ifDefined(this.hintTitle)}
          aria-label=${ifDefined(this.label)}
          aria-invalid=${ariaInvalid}
          ?required=${this.required}
          ?disabled=${this.disabled}
          @change=${this._emit}
        >
          ${
            this.placeholder
              ? html`<option disabled value="" ?selected=${!this.value}>${this.placeholder}</option>`
              : nothing
          }
          ${this.options.map(
            (o) =>
              html`<option
                value=${o.value ?? o.label}
                ?disabled=${o.disabled}
                ?selected=${(o.value ?? o.label) === this.value}
              >
                ${o.label}
              </option>`,
          )}
        </select>`;
      case "textarea":
        return html`<textarea
          class=${cls}
          name=${ifDefined(this.name)}
          placeholder=${ifDefined(this.placeholder)}
          minlength=${ifDefined(this.minlength)}
          maxlength=${ifDefined(this.maxlength)}
          title=${ifDefined(this.hintTitle)}
          aria-label=${ifDefined(this.label)}
          aria-invalid=${ariaInvalid}
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          @input=${this._emit}
        ></textarea>`;
      case "checkbox":
      case "toggle":
        return html`<input
          type="checkbox"
          class=${cls}
          name=${ifDefined(this.name)}
          title=${ifDefined(this.hintTitle)}
          aria-label=${ifDefined(this.label)}
          aria-invalid=${ariaInvalid}
          .checked=${this.checked}
          ?required=${this.required}
          ?disabled=${this.disabled}
          @change=${this._emit}
        />`;
      default:
        return html`<input
          type=${this.type}
          class=${cls}
          name=${ifDefined(this.name)}
          placeholder=${ifDefined(this.placeholder)}
          pattern=${ifDefined(this.pattern)}
          minlength=${ifDefined(this.minlength)}
          maxlength=${ifDefined(this.maxlength)}
          min=${ifDefined(this.min)}
          max=${ifDefined(this.max)}
          step=${ifDefined(this.step)}
          autocomplete=${ifDefined(this.autocomplete)}
          title=${ifDefined(this.hintTitle)}
          aria-label=${ifDefined(this.label)}
          aria-invalid=${ariaInvalid}
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          @input=${this._emit}
        />`;
    }
  }

  private _hint() {
    if (this.hasSlotted("hint")) return this.slotted("hint");
    if (Array.isArray(this.hint)) return this.hint.map((line, i) => (i ? html`<br />${line}` : line));
    return this.hint;
  }

  render() {
    const hint = this._hint();
    const core = html`${this._control()}${
      hint ? html`<p class=${validatorHint({ collapse: this.collapseHint })}>${hint}</p>` : nothing
    }`;
    if (this.fieldLabel) {
      return html`<fieldset class=${validatorField({ width: this.width })}>
        <label class=${validatorLabel()}>${this.fieldLabel}</label>
        ${core}
      </fieldset>`;
    }
    return this.width ? html`<div class=${validatorWrapper({ width: this.width })}>${core}</div>` : core;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-validator": UiValidator;
  }
}
