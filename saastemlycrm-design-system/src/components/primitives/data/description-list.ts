import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Description list: facts about one thing, as label and value pairs (a `<dl>`: Apple labels;
 * screen readers announce each value with its label).
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * - `layout="stacked"` (default): the label above its value, in as many columns as fit (a
 *   record's details: port, ETA, agent).
 * - `layout="inline"`: the label beside its value, one pair per row (evidence for a decision).
 * `size` sets the value's role: `sm` body text, `md` a title (small figures), `lg` a headline
 * (figures that are the point: invoiced, received, balance). A `tone` colours a value when it
 * means something; a `note` adds a quieter line under it.
 */
export const descriptionList = rcva("m-0", {
  variants: {
    layout: {
      stacked: "grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-x-6 gap-y-4",
      /**
       * Label beside value when the list's own width has room for both (a container query: 24rem),
       * else the label above its value, so a narrow card never squeezes the values into a sliver.
       */
      inline:
        "grid grid-cols-1 gap-x-4 [&_dd]:mb-3 @sm:grid-cols-[minmax(min(8rem,40%),max-content)_minmax(0,1fr)] @sm:items-baseline @sm:gap-y-2 @sm:[&_dd]:mb-0",
    },
  },
  defaultVariants: { layout: "stacked" },
});
// The layouts set `display` themselves: a base `flex` would beat `contents` (Tailwind's order),
// turning each inline pair into one grid cell.
export const descriptionItem = rcva("min-w-0", {
  variants: { layout: { stacked: "flex flex-col gap-0.5", inline: "contents" } },
});
/** The box the list measures (its layout follows its own width, not the window's). */
export const descriptionBox = rcva("@container");
export const descriptionLabel = rcva("text-label-md text-on-surface-variant");
export const descriptionValue = rcva("m-0 min-w-0 [overflow-wrap:break-word]", {
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
export const descriptionNote = rcva("block text-body-sm text-on-surface-variant", {
  variants: {
    tone: { neutral: "", success: "text-success-ink!", warning: "text-warning-ink!", error: "text-error-ink!" },
  },
});

export type DescriptionListVariants = VariantProps<typeof descriptionList>;
type Tone = "neutral" | "success" | "warning" | "error";

export interface DescriptionItem {
  label: Renderable;
  value: Renderable;
  /** A quieter line under the value. */
  note?: Renderable;
  tone?: Tone;
  noteTone?: Tone;
}

/**
 * @example
 * <ui-description-list .items=${[
 *   { label: "Delivery", value: "18 Nov, 06:00" },
 *   { label: "Balance", value: "USD 12,400", tone: "warning" },
 * ]}></ui-description-list>
 * @example <ui-description-list layout="inline" .items=${evidence}></ui-description-list>
 */
@customElement("ui-description-list")
export class UiDescriptionList extends LightElement {
  @property({ attribute: false }) items: DescriptionItem[] = [];
  @property() layout: DescriptionListVariants["layout"];
  /** The values' type role. */
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
