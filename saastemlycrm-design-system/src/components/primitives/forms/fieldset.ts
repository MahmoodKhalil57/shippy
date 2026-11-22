import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { tiles } from "../layout/algebra.ts";

/**
 * Fieldset: Container for grouping related form elements.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/fieldset/
 */
// `min-w-0`: a fieldset is `min-width: min-content` by default, so it would refuse to shrink; its
// one column is `minmax(0, 1fr)`, as a plain `1fr` is at least as wide as its widest line.
export const fieldset = rcva("fieldset min-w-0 grid-cols-[minmax(0,1fr)]", {
  variants: {
    /** Box look used in the daisyUI examples (background + border + padding). */
    surface: {
      "base-100":
        "bg-surface border-outline-variant rounded-box border px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
      "base-200":
        "bg-surface-container border-outline-variant rounded-box border px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
    },
    /** Docs examples use `w-xs` (fieldset) and `w-64` (checkbox / toggle). */
    width: {
      auto: "w-auto",
      // Whole tiles (`tiles.*`): 5, 6, 7, 8, 10 (the old 16, 20, 24, 28, 32rem, to the nearest tile).
      "64": tiles["5"],
      xs: tiles["6"],
      sm: tiles["7"],
      md: tiles["8"],
      lg: tiles["10"],
      full: "w-full",
    },
  },
});

/** Title of the fieldset (`<legend>`). */
export const fieldsetLegend = rcva("fieldset-legend");
/** Label / helper text inside a fieldset (`label` component class); it wraps (daisyUI's never does). */
export const fieldsetLabel = rcva("label whitespace-normal", {
  variants: {
    /** Label wrapping a checkbox / radio / toggle: the whole row is clickable. */
    control: { true: "cursor-pointer touch-target" },
  },
});
/** Buttons at the end of a form (the docs' login button with `mt-4`). */
export const fieldsetActions = rcva("mt-4 grid gap-2");
/** Validation hint, a sibling of the `.validator` control. */
export const fieldsetValidatorHint = rcva("validator-hint", {
  variants: {
    /** Takes no space until the field is invalid (the docs' `validator-hint hidden`). */
    collapsed: { true: "hidden" },
  },
});

export type FieldsetVariants = VariantProps<typeof fieldset>;

/** Field chrome shared by the form controls (`ui-text-input`, `ui-select`, …). */
export interface FieldsetFieldOptions {
  /** Renders a `<fieldset>` with this `<legend>`. */
  legend?: Renderable;
  /** Renders `<label class="label" for=…>` before the control. */
  label?: Renderable;
  /** Helper text under the control (`<p class="label">`). */
  hint?: Renderable;
  /** Validation hint (`<p class="validator-hint">`), shown by the `validator` class. */
  validatorHint?: Renderable;
  /** Only show the validator hint while the field is invalid. */
  hintOnInvalid?: boolean;
  /** id of the control, for `<label for>`. */
  controlId?: string;
  /** Look of the wrapping `<fieldset>` (only rendered when legend / label / hint are set). */
  surface?: FieldsetVariants["surface"];
  width?: FieldsetVariants["width"];
}

const has = (v: Renderable) => v !== undefined && v !== null && v !== "" && v !== false;

/**
 * Wraps a control in the daisyUI fieldset pattern when any chrome is requested:
 * `fieldset > legend + label + control + hint + validator-hint`.
 * Returns the control untouched (plus validator hint, which must stay a sibling
 * of the `.validator` element) when no chrome is set.
 */
export function fieldsetField(o: FieldsetFieldOptions, control: TemplateResult): TemplateResult {
  const vhint = has(o.validatorHint)
    ? html`<p class=${fieldsetValidatorHint({ collapsed: o.hintOnInvalid })}>${o.validatorHint}</p>`
    : nothing;
  if (!has(o.legend) && !has(o.label) && !has(o.hint)) {
    return has(o.validatorHint) ? html`${control}${vhint}` : control;
  }
  return html`<fieldset class=${fieldset({ surface: o.surface, width: o.width })}>
    ${has(o.legend) ? html`<legend class=${fieldsetLegend()}>${o.legend}</legend>` : nothing}
    ${has(o.label) ? html`<label class=${fieldsetLabel()} for=${o.controlId ?? nothing}>${o.label}</label>` : nothing}
    ${control} ${vhint} ${has(o.hint) ? html`<p class=${fieldsetLabel()}>${o.hint}</p>` : nothing}
  </fieldset>`;
}

/**
 * @example
 * <ui-fieldset legend="Page title" hint="You can edit page title later on from settings" surface="base-200" width="xs">
 *   <ui-text-input placeholder="My awesome page"></ui-text-input>
 * </ui-fieldset>
 * @example
 * <ui-fieldset legend="Login" surface="base-200" width="xs">
 *   <ui-text-input type="email" label="Email" placeholder="Email"></ui-text-input>
 *   <ui-text-input type="password" label="Password" placeholder="Password"></ui-text-input>
 *   <ui-button slot="actions" color="neutral">Login</ui-button>
 * </ui-fieldset>
 *
 * Children render between the legend and the hint (component hosts are
 * `display: contents`, so `ui-*` children sit directly in the fieldset grid).
 * `slot="legend"`: rich legend. `slot="actions"`: buttons after the fields,
 * spaced like the docs' login form.
 */
@customElement("ui-fieldset")
export class UiFieldset extends LightElement {
  @property() legend: Renderable = "";
  @property() hint: Renderable = "";
  @property() surface: FieldsetVariants["surface"];
  @property() width: FieldsetVariants["width"];
  @property({ type: Boolean }) disabled = false;
  @property() name?: string;

  render() {
    const legend = this.hasSlotted("legend") ? this.slotted("legend") : this.legend;
    return html`<fieldset
      class=${fieldset({ surface: this.surface, width: this.width })}
      ?disabled=${this.disabled}
      name=${this.name ?? nothing}
    >
      ${
        has(legend) && (!Array.isArray(legend) || legend.length)
          ? html`<legend class=${fieldsetLegend()}>${legend}</legend>`
          : nothing
      }
      ${this.slotted()} ${has(this.hint) ? html`<p class=${fieldsetLabel()}>${this.hint}</p>` : nothing}
      ${this.hasSlotted("actions") ? html`<div class=${fieldsetActions()}>${this.slotted("actions")}</div>` : nothing}
    </fieldset>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-fieldset": UiFieldset;
  }
}
