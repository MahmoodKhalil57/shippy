import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inset } from "../layout/algebra.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

export const choiceTile = rcva(
  "group/tile relative isolate grid aspect-[16/10] w-full cursor-pointer place-items-center overflow-hidden [--clips:media] rounded-field bg-surface-container text-on-surface-variant ring-1 ring-outline-variant [transition:box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast),scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] hover:ring-2 hover:ring-primary/50 active:scale-[0.96] motion-reduce:transition-none",
  {
    variants: {
      selected: { true: "ring-2 ring-primary hover:ring-primary" },
      dashed: { true: "border-2 border-dashed border-outline-variant bg-transparent ring-0" },
    },
  },
);
export const choiceTileImage = rcva("absolute inset-0 -z-10 size-full object-cover");
export const choiceTilePreview = rcva("absolute inset-0 -z-10 overflow-hidden [--clips:media]");
export const choiceTileLabel = rcva(
  `${inset["2"]} absolute inset-x-0 bottom-0 bg-neutral/65 py-1 text-start text-label-md text-neutral-content`,
);
export const choiceTileEmpty = rcva("flex flex-col items-center gap-1 text-label-md");
export const choiceTileCheck = rcva(
  "absolute top-1.5 end-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-content",
);

@customElement("ui-choice-tile")
export class UiChoiceTile extends LightElement {
  @property() image?: string;
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
          : this.hasContent
            ? html`<span class=${choiceTilePreview()} aria-hidden="true">${this.content}</span>
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
