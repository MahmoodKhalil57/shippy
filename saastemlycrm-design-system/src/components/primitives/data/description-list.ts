import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

export const descriptionList = rcva("m-0", {
  variants: {
    layout: {
      stacked: "grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-x-6 gap-y-4",
      inline:
        "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-4 [&_dd]:mb-3 @min-[24rem]:grid-cols-[minmax(min(8rem,40%),max-content)_minmax(0,1fr)] @min-[24rem]:items-baseline @min-[24rem]:gap-y-2 @min-[24rem]:[&_dd]:mb-0",
    },
  },
  defaultVariants: { layout: "stacked" },
});
export const descriptionItem = rcva("min-w-0", {
  variants: { layout: { stacked: "flex flex-col gap-0.5", inline: "contents" } },
});
export const descriptionBox = rcva("@container w-full");
export const descriptionLabel = rcva("text-label-md text-on-surface-variant");
export const descriptionValue = rcva("m-0 min-w-0 [overflow-wrap:anywhere]", {
  variants: {
    size: { sm: "text-body-md", md: "text-title-md", lg: "text-headline-sm tabular-nums" },
    tone: {
      neutral: "text-on-surface",
      success: "text-success-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
    },
  },
  defaultVariants: { size: "sm", tone: "neutral" },
});
export const descriptionNote = rcva("block min-w-0 [overflow-wrap:anywhere] text-body-sm text-on-surface-variant", {
  variants: {
    tone: { neutral: "", success: "text-success-ink!", warning: "text-warning-ink!", error: "text-error-ink!" },
  },
});

export type DescriptionListVariants = VariantProps<typeof descriptionList>;
type Tone = "neutral" | "success" | "warning" | "error";

export interface DescriptionItem {
  label: Renderable;
  value: Renderable;
  note?: Renderable;
  tone?: Tone;
  noteTone?: Tone;
}

@customElement("ui-description-list")
export class UiDescriptionList extends LightElement {
  @property({ attribute: false }) items: DescriptionItem[] = [];
  @property() layout: DescriptionListVariants["layout"];
  @property() size: "sm" | "md" | "lg" = "sm";

  render() {
    const layout = this.layout ?? "stacked";
    return html`<div class=${descriptionBox()}>
      <dl class=${descriptionList({ layout })}>
        ${this.items.map(
          (i) =>
            html`<div class=${descriptionItem({ layout })}>
              <dt class=${descriptionLabel()}>${i.label}</dt>
              <dd class=${descriptionValue({ size: this.size, tone: i.tone })}>
                ${i.value}${i.note ? html`<span class=${descriptionNote({ tone: i.noteTone })}>${i.note}</span>` : nothing}
              </dd>
            </div>`,
        )}
      </dl>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-description-list": UiDescriptionList;
  }
}
