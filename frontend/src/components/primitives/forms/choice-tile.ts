import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Choice tile: one visual option to pick — a picture with its name over it (a background image,
 * a layout, a template), or an icon and a line of text (No image, Upload your own).
 *
 * Purpose: Forms & input · Kind: primitive (Shippy)
 *
 * A button with `role="option"`: put tiles in a grid inside a `role="listbox"` group
 * (`<ui-grid cols="2" gap="2">`). Picked, it has a primary ring and a ✓; `dashed` draws an
 * empty slot (an upload). It presses in on a spring when clicked. Fires a plain `click`.
 */
export const choiceTile = rcva(
  "group/tile relative isolate grid aspect-[16/10] w-full cursor-pointer place-items-center overflow-hidden rounded-field bg-base-200 text-base-content/70 ring-1 ring-base-content/10 [transition:box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast),scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] hover:ring-2 hover:ring-primary/50 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
  {
    variants: {
      selected: { true: "ring-2 ring-primary hover:ring-primary" },
      dashed: { true: "border-2 border-dashed border-base-content/20 bg-transparent ring-0" },
    },
  },
);
export const choiceTileImage = rcva("absolute inset-0 -z-10 size-full object-cover");
export const choiceTileLabel = rcva(
  "absolute inset-x-0 bottom-0 bg-neutral/65 px-2 py-1 text-start text-xs font-medium text-neutral-content",
);
export const choiceTileEmpty = rcva("flex flex-col items-center gap-1 text-xs font-medium");
export const choiceTileCheck = rcva(
  "absolute top-1.5 end-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-content",
);

/**
 * @example <ui-choice-tile image="/thumbs/harbour.jpg" label="Harbour" selected></ui-choice-tile>
 * @example <ui-choice-tile icon="upload" label="Upload your own" dashed></ui-choice-tile>
 */
@customElement("ui-choice-tile")
export class UiChoiceTile extends LightElement {
  /** A picture filling the tile (the label then sits over its bottom edge). */
  @property() image?: string;
  /** Without an image: an icon above the label. */
  @property() icon?: IconName;
  @property() label = "";
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean }) dashed = false;

  render() {
    return html`<button
      type="button"
      role="option"
      aria-selected=${this.selected ? "true" : "false"}
      class=${choiceTile({ selected: this.selected, dashed: this.dashed && !this.selected })}
    >
      ${
        this.image
          ? html`<img class=${choiceTileImage()} src=${this.image} alt="" loading="lazy" />
              <span class=${choiceTileLabel()}>${this.label}</span>`
          : html`<span class=${choiceTileEmpty()}
              >${this.icon ? iconSvg(this.icon, { size: "lg" }) : nothing}${this.label}</span
            >`
      }
      ${this.selected ? html`<span class=${choiceTileCheck()}>${iconSvg("check", { size: "xs" })}</span>` : nothing}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-choice-tile": UiChoiceTile;
  }
}
