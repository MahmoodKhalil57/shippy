import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Timeline: Shows a list of events in chronological order.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/timeline/
 *
 * Each `<li>` has `timeline-start` / `timeline-middle` (icon) / `timeline-end`
 * plus `<hr>` connector lines. All variants are responsive, e.g. the docs'
 * `direction="vertical lg:horizontal"` and `compact="max-md"`.
 */
export const timeline = rcva("timeline", {
  variants: {
    direction: {
      horizontal: "timeline-horizontal",
      vertical: "timeline-vertical",
    },
    /** Snap the icon to the start instead of the middle. */
    snapIcon: { true: "timeline-snap-icon" },
    /** Put all items on one side. */
    compact: { true: "timeline-compact" },
  },
});

export const timelineStart = rcva("timeline-start", {
  variants: {
    box: { true: "timeline-box" },
    /** Space below each entry (`mb-10` in the snapped-icon example). */
    spaced: { true: "mb-10" },
    /** Text alignment of start entries (the docs use `md:text-end`). */
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

/** Connector line; `done` colours it. */
export const timelineLine = rcva("", {
  variants: { done: { true: "bg-primary" } },
});

/** Default icon (check circle) colour. */
export const timelineIcon = rcva("h-5 w-5", {
  variants: { done: { true: "text-primary" } },
});

/** Parts of a structured entry (snapped-icon example). */
export const timelineTime = rcva("font-mono italic");
export const timelineHeading = rcva("text-lg font-black");

export type TimelineVariants = VariantProps<typeof timeline>;
export type TimelineStartVariants = VariantProps<typeof timelineStart>;

/** Structured entry: `<time>`, a bold heading and body text, as in the docs. */
export interface TimelineEvent {
  time?: Renderable;
  heading?: Renderable;
  text?: Renderable;
}

export interface TimelineItem {
  /** Content on the start side (top / left): any template, or a structured event. */
  start?: Renderable | TimelineEvent;
  /** Content on the end side (bottom / right): any template, or a structured event. */
  end?: Renderable | TimelineEvent;
  /** Custom icon; `false` for no icon. Defaults to a check-circle. */
  icon?: Renderable;
  /** Which side(s) get the `timeline-box` bubble. Default: none. */
  box?: "start" | "end" | "both" | "none";
  /** Colours the icon and the line leading into this item. */
  done?: boolean;
}

const isEvent = (v: unknown): v is TimelineEvent =>
  typeof v === "object" && v !== null && !("_$litType$" in v) && ("heading" in v || "time" in v || "text" in v);

const checkIcon = (done: boolean) => iconSvg("success", {}, { class: timelineIcon({ done }) });

/**
 * @example
 * <ui-timeline .items=${[
 *   { start: "1984", end: "First Macintosh computer", box: "end", done: true },
 *   { start: "1998", end: "iMac", box: "end", done: true },
 *   { start: "2001", end: "iPod", box: "end" },
 * ]}></ui-timeline>
 * @example
 * <ui-timeline direction="vertical" snap-icon compact="max-md" spaced start-align="md:end" .items=${[
 *   { start: { time: "1984", heading: "First Macintosh computer", text: "The Apple Macintosh…" } },
 *   { end: { time: "1998", heading: "iMac", text: "iMac is a family…" } },
 * ]}></ui-timeline>
 * @example <ui-timeline direction="vertical lg:horizontal" .items=${[...]}></ui-timeline>
 *
 * Without `items`, authored `<li>` children are rendered inside the `<ul>`.
 */
@customElement("ui-timeline")
export class UiTimeline extends LightElement {
  @property({ attribute: false }) items: TimelineItem[] = [];
  @property() direction: TimelineVariants["direction"];
  @property({ converter: responsiveBoolean, attribute: "snap-icon" }) snapIcon: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) compact: Responsive<boolean> = false;
  /** Space below each entry. */
  @property({ converter: responsiveBoolean }) spaced: Responsive<boolean> = false;
  /** Text alignment of start-side entries, e.g. "md:end". */
  @property({ attribute: "start-align" }) startAlign: TimelineStartVariants["align"];
  /** Hide all icons ("Timeline without icons"). */
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
