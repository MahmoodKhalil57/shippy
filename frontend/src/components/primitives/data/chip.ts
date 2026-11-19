import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Chip: a compact, removable value — a picked option, a tag, an active filter.
 *
 * Purpose: Data & metrics · Kind: primitive (Shippy; M3 input / filter chip on daisyUI's badge)
 *
 * - `variant="soft"` (default): a tinted pill, for values inside a field (`<ui-combobox multiple>`).
 * - `variant="outline"`: a bordered chip on the page, e.g. an active filter.
 * `pressable` makes its content a button (`ui-press` when pressed, e.g. to edit a filter);
 * `removable` adds a ✕ (`ui-remove`). Both events bubble; the ✕ never fires `ui-press`.
 * The recipes are exported for primitives that draw chips inside their own markup.
 */
export const chip = rcva("inline-flex max-w-full items-center", {
  variants: {
    variant: {
      soft: "badge badge-soft h-auto gap-1 py-0.5 whitespace-normal [overflow-wrap:anywhere]",
      outline:
        "rounded-field border border-base-content/15 bg-base-100/70 [transition:border-color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:border-base-content/30",
    },
    size: { sm: "text-xs", md: "text-sm" },
    /** Room for the ✕ at the end. */
    removable: { true: "" },
  },
  compoundVariants: [
    { variant: "soft", size: "sm", class: "badge-sm" },
    { variant: "soft", removable: true, class: "pe-0.5" },
  ],
  defaultVariants: { variant: "soft", size: "sm" },
});
/** The chip's content when it's pressable. */
export const chipBody = rcva(
  "flex min-w-0 items-baseline gap-1 truncate text-start focus-visible:outline-2 focus-visible:outline-primary",
  {
    variants: {
      variant: {
        soft: "rounded-full",
        outline: "rounded-s-field py-1 ps-2.5 pe-1 hover:bg-base-content/5",
      },
    },
  },
);
/** The content when it isn't a button. */
export const chipLabel = rcva("min-w-0", {
  variants: { variant: { soft: "", outline: "truncate py-1 ps-2.5 pe-1" } },
});
export const chipRemove = rcva(
  "grid shrink-0 place-items-center text-base-content/70 hover:text-base-content focus-visible:outline-2 focus-visible:outline-primary",
  {
    variants: {
      variant: {
        soft: "size-4 rounded-full hover:bg-base-content/15",
        outline: "size-7 rounded-e-field hover:bg-base-content/5",
      },
    },
  },
);

export type ChipVariants = VariantProps<typeof chip>;

/**
 * @example <ui-chip removable @ui-remove=${() => drop(tag)}>urgent</ui-chip>
 * @example
 * <ui-chip variant="outline" size="md" pressable removable remove-label="Remove filter: Stage"
 *   @ui-press=${edit} @ui-remove=${remove}>Stage is any of Won</ui-chip>
 */
@customElement("ui-chip")
export class UiChip extends LightElement {
  @property() variant: NonNullable<ChipVariants["variant"]> = "soft";
  @property() size: ChipVariants["size"];
  @property({ type: Boolean }) pressable = false;
  @property({ type: Boolean }) removable = false;
  /** The ✕'s accessible name (default: "Remove"). */
  @property({ attribute: "remove-label" }) removeLabel = "Remove";
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
