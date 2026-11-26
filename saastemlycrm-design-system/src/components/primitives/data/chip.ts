import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { m } from "../../../lib/i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { inlineRow, row, text } from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";

export const chip = rcva(`${inlineRow} ${text.label} items-center`, {
  variants: {
    variant: {
      input: "badge badge-soft h-auto gap-1 py-0.5 whitespace-normal [overflow-wrap:break-word]",
      filter:
        "rounded-field border border-outline-variant bg-surface/70 [transition:border-color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:border-outline",
    },
    size: { sm: "text-body-sm", md: "text-body-md" },
    removable: { true: "" },
  },
  compoundVariants: [
    { variant: "input", size: "sm", class: "badge-sm" },
    { variant: "input", removable: true, class: "pe-0.5" },
  ],
  defaultVariants: { variant: "input", size: "sm" },
});
export const chipBody = rcva(`${row} touch-target min-w-0 items-baseline gap-1 truncate text-start`, {
  variants: {
    variant: {
      input: "rounded-full",
      filter: "touch-target rounded-s-field py-1 ps-[min(12px,max(0px,calc(100%_-_7rem)))] pe-1 state-layer",
    },
  },
});
export const chipLabel = rcva("min-w-0", {
  variants: { variant: { input: "", filter: "truncate py-1 ps-[min(12px,max(0px,calc(100%_-_7rem)))] pe-1" } },
});
export const chipRemove = rcva("touch-target grid place-items-center text-on-surface-variant hover:text-on-surface", {
  variants: {
    variant: {
      input: "touch-target size-4 shrink-0 rounded-full state-layer",
      filter: "touch-target size-7 shrink-0 rounded-e-field state-layer",
    },
  },
});

export type ChipVariants = VariantProps<typeof chip>;

@customElement("ui-chip")
export class UiChip extends LightElement {
  @property() variant: NonNullable<ChipVariants["variant"]> = "input";
  @property() size: ChipVariants["size"];
  @property({ type: Boolean }) pressable = false;
  @property({ type: Boolean }) removable = false;
  @property({ attribute: "remove-label" }) removeLabel = m.chip_remove();
  @property({ type: Boolean }) disabled = false;

  render() {
    const body = this.pressable
      ? html`<button
          type="button"
          class=${chipBody({ variant: this.variant })}
          ?disabled=${this.disabled}
          @click=${() => this.dispatchEvent(new CustomEvent("ui-press", { bubbles: true }))}
        >
          ${this.content}
        </button>`
      : html`<span class=${chipLabel({ variant: this.variant })}>${this.content}</span>`;
    return html`<span class=${chip({ variant: this.variant, size: this.size, removable: this.removable })}
      >${body}${
        this.removable && !this.disabled
          ? html`<button
              type="button"
              class=${chipRemove({ variant: this.variant })}
              aria-label=${this.removeLabel}
              @click=${(e: Event) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent("ui-remove", { bubbles: true }));
              }}
            >
              ${iconSvg("x", { size: "xs" })}
            </button>`
          : nothing
      }</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-chip": UiChip;
  }
}
