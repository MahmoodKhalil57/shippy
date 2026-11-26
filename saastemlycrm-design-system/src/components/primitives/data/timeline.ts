import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";
import { text } from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";

export const timeline = rcva("timeline", {
  variants: {
    direction: {
      horizontal: "timeline-horizontal",
      vertical: "timeline-vertical",
    },
    snapIcon: { true: "timeline-snap-icon" },
    compact: { true: "timeline-compact" },
  },
});

export const timelineStart = rcva("timeline-start", {
  variants: {
    box: { true: "timeline-box" },
    spaced: { true: "mb-10" },
    align: { start: "text-start", end: "text-end" },
  },
});
export const timelineMiddle = rcva("timeline-middle");
export const timelineEnd = rcva("timeline-end", {
  variants: {
    box: { true: "timeline-box" },
    spaced: { true: "mb-10" },
  },
});

export const timelineLine = rcva("", {
  variants: { done: { true: "bg-primary" } },
});

export const timelineIcon = rcva("h-5 w-5", {
  variants: { done: { true: "text-primary" } },
});

export const timelineTime = rcva("font-mono italic");
export const timelineHeading = rcva(`${text.label} text-title-md`);

export type TimelineVariants = VariantProps<typeof timeline>;
export type TimelineStartVariants = VariantProps<typeof timelineStart>;

export interface TimelineEvent {
  time?: Renderable;
  heading?: Renderable;
  text?: Renderable;
}

export interface TimelineItem {
  start?: Renderable | TimelineEvent;
  end?: Renderable | TimelineEvent;
  icon?: Renderable;
  box?: "start" | "end" | "both" | "none";
  done?: boolean;
}

const isEvent = (v: unknown): v is TimelineEvent =>
  typeof v === "object" && v !== null && !("_$litType$" in v) && ("heading" in v || "time" in v || "text" in v);

const checkIcon = (done: boolean) => iconSvg("success", {}, { class: timelineIcon({ done }) });

@customElement("ui-timeline")
export class UiTimeline extends LightElement {
  @property({ attribute: false }) items: TimelineItem[] = [];
  @property() direction: TimelineVariants["direction"];
  @property({ converter: responsiveBoolean, attribute: "snap-icon" }) snapIcon: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) compact: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) spaced: Responsive<boolean> = false;
  @property({ attribute: "start-align" }) startAlign: TimelineStartVariants["align"];
  @property({ type: Boolean, attribute: "no-icons" }) noIcons = false;

  private _side(v: Renderable | TimelineEvent) {
    if (!isEvent(v)) return v;
    return html`${v.time != null ? html`<time class=${timelineTime()}>${v.time}</time>` : nothing}
    ${v.heading != null ? html`<div class=${timelineHeading()}>${v.heading}</div>` : nothing} ${v.text ?? nothing}`;
  }

  private _item(item: TimelineItem, i: number) {
    const last = i === this.items.length - 1;
    const nextDone = !!this.items[i + 1]?.done;
    const box = item.box ?? "none";
    const icon = this.noIcons || item.icon === false ? nothing : (item.icon ?? checkIcon(!!item.done));
    return html`<li>
      ${i > 0 ? html`<hr class=${timelineLine({ done: !!item.done }) || nothing} />` : nothing}
      ${
        item.start !== undefined
          ? html`<div
              class=${timelineStart({ box: box === "start" || box === "both", spaced: this.spaced, align: this.startAlign })}
            >
              ${this._side(item.start)}
            </div>`
          : nothing
      }
      ${icon === nothing ? nothing : html`<div class=${timelineMiddle()}>${icon}</div>`}
      ${
        item.end !== undefined
          ? html`<div class=${timelineEnd({ box: box === "end" || box === "both", spaced: this.spaced })}>
              ${this._side(item.end)}
            </div>`
          : nothing
      }
      ${last ? nothing : html`<hr class=${timelineLine({ done: !!item.done && nextDone }) || nothing} />`}
    </li>`;
  }

  render() {
    const cls = timeline({
      direction: this.direction,
      snapIcon: this.snapIcon,
      compact: this.compact,
    });
    return html`<ul class=${cls}>
      ${this.items.length ? this.items.map((it, i) => this._item(it, i)) : this.content}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-timeline": UiTimeline;
  }
}
