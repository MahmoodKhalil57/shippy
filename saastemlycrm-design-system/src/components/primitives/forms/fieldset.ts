import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { tiles } from "../../../styles/algebra.ts";

export const fieldset = rcva("fieldset min-w-0 grid-cols-[minmax(0,1fr)]", {
  variants: {
    surface: {
      "base-100":
        "bg-surface border-outline-variant rounded-box border px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
      "base-200":
        "bg-surface-container border-outline-variant rounded-box border px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
    },
    width: {
      auto: "w-auto",
      "64": tiles["5"],
      xs: tiles["6"],
      sm: tiles["7"],
      md: tiles["8"],
      lg: tiles["10"],
      full: "w-full",
    },
  },
});

export const fieldsetLegend = rcva("fieldset-legend");
export const fieldsetLabel = rcva("label whitespace-normal", {
  variants: {
    control: { true: "cursor-pointer touch-target text-on-surface", false: "text-on-surface-variant" },
  },
  defaultVariants: { control: false },
});
export const fieldsetActions = rcva("mt-4 grid gap-2");
export const fieldsetValidatorHint = rcva("validator-hint", {
  variants: {
    collapsed: { true: "hidden" },
  },
});

export type FieldsetVariants = VariantProps<typeof fieldset>;

export interface FieldsetFieldOptions {
  legend?: Renderable;
  label?: Renderable;
  hint?: Renderable;
  validatorHint?: Renderable;
  hintOnInvalid?: boolean;
  controlId?: string;
  surface?: FieldsetVariants["surface"];
  width?: FieldsetVariants["width"];
}

const has = (v: Renderable) => v !== undefined && v !== null && v !== "" && v !== false;

export const legendId = (controlId: string) => `${controlId}-legend`;

export function legendLabel(o: { legend?: Renderable; label?: Renderable; controlId: string }) {
  return has(o.legend) && !has(o.label) ? legendId(o.controlId) : undefined;
}

export const fieldLabelId = (controlId: string) => `${controlId}-label`;

export function groupName(
  host: Element,
  o: { ariaLabel?: string; label?: Renderable; legend?: Renderable; controlId: string },
): { label?: string; labelledby?: string } {
  if (o.ariaLabel) return { label: o.ariaLabel };
  if (typeof o.label === "string" && o.label) return { label: o.label };
  if (has(o.legend)) return { labelledby: legendId(o.controlId) };
  if (fieldLabels(host, o.controlId)) return { labelledby: fieldLabelId(o.controlId) };
  return {};
}

export function fieldLabels(host: Element, controlId: string) {
  const field = host.closest("ui-field") as (Element & { label?: Renderable; controlId?: string }) | null;
  if (!field) return false;
  const label = field.label ?? field.getAttribute("label");
  return has(label) && (field.controlId ?? field.getAttribute("control-id")) === controlId;
}

export function fieldsetField(o: FieldsetFieldOptions, control: TemplateResult): TemplateResult {
  const vhint = has(o.validatorHint)
    ? html`<p class=${fieldsetValidatorHint({ collapsed: o.hintOnInvalid })}>${o.validatorHint}</p>`
    : nothing;
  if (!has(o.legend) && !has(o.label) && !has(o.hint)) {
    return has(o.validatorHint) ? html`${control}${vhint}` : control;
  }
  return html`<fieldset class=${fieldset({ surface: o.surface, width: o.width })}>
    ${
      has(o.legend)
        ? html`<legend class=${fieldsetLegend()} id=${o.controlId ? legendId(o.controlId) : nothing}>
            ${o.legend}
          </legend>`
        : nothing
    }
    ${has(o.label) ? html`<label class=${fieldsetLabel()} for=${o.controlId ?? nothing}>${o.label}</label>` : nothing}
    ${control} ${vhint} ${has(o.hint) ? html`<p class=${fieldsetLabel()}>${o.hint}</p>` : nothing}
  </fieldset>`;
}

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
