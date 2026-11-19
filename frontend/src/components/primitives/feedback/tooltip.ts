import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, type Breakpoint } from "../../base/variants.ts";

/**
 * Tooltip: a short description of what something is or does, on hover and keyboard focus
 * (M3 tooltips; Apple: help tags).
 *
 * Purpose: Feedback & system status · Kind: primitive
 *
 * - `plain` (default): a few words naming the control ("Bookmark this page"). Icon buttons have
 *   one built in (`<ui-icon-button label>`), so most tooltips are those.
 * - `rich`: a title, a sentence or two and at most one action (`slot="action"`), for something
 *   that needs explaining. Never the only place important information lives (M3).
 * The tip is a real element, linked to the first focusable child with `aria-describedby`, so it's
 * read out and shows on keyboard focus too. Always the clear glass (the floating layer).
 * `placement` / `align` are responsive; `from` makes it a tooltip only from a breakpoint up.
 */
export const TOOLTIP_GLASS =
  "[&::before]:liquid-glass-clear [&::before]:text-on-surface [&>.tooltip-content]:liquid-glass-clear [&>.tooltip-content]:text-on-surface [&::after]:invisible";

export const tooltip = rcva(TOOLTIP_GLASS, {
  variants: {
    enabled: { true: "tooltip" },
    placement: {
      top: "tooltip-top",
      bottom: "tooltip-bottom",
      left: "tooltip-left",
      right: "tooltip-right",
    },
    align: {
      start: "tooltip-start",
      center: "tooltip-center",
      end: "tooltip-end",
    },
  },
  defaultVariants: { enabled: true },
});

export const tooltipContent = rcva("tooltip-content", {
  variants: {
    variant: {
      plain: "text-body-sm",
      rich: "flex max-w-80 flex-col items-start gap-1 rounded-md p-3 text-start text-body-md text-on-surface-variant",
    },
  },
  defaultVariants: { variant: "plain" },
});
export const tooltipHeading = rcva("text-title-sm text-on-surface");

export type TooltipVariants = VariantProps<typeof tooltip>;

let ids = 0;

/**
 * @example <ui-tooltip tip="Bookmark this page"><ui-button …>…</ui-button></ui-tooltip>
 * @example
 * <ui-tooltip variant="rich" heading="Landed cost" tip="Supplier price plus freight, duty and handling, per unit.">
 *   <ui-link slot="action" href="/globals/pricing-policy">Pricing policy</ui-link>
 *   <ui-text>Landed</ui-text>
 * </ui-tooltip>
 *
 * Children are the trigger.
 */
@customElement("ui-tooltip")
export class UiTooltip extends LightElement {
  @property() tip: Renderable = "";
  @property() heading: Renderable = "";
  @property() variant: "plain" | "rich" = "plain";
  @property() placement: TooltipVariants["placement"];
  @property() align: TooltipVariants["align"];
  /** Only be a tooltip from this breakpoint up. */
  @property() from?: Breakpoint;

  private _id = `ui-tip-${++ids}`;

  protected updated(changed: PropertyValues) {
    super.updated?.(changed);
    const target = this.querySelector<HTMLElement>(
      ":scope > div > :is(a, button, input, select, textarea, [tabindex]), :scope > div :is(a, button, input, select, textarea, [tabindex]):not([role=tooltip] *)",
    );
    if (target && !target.getAttribute("aria-describedby")?.includes(this._id))
      target.setAttribute("aria-describedby", `${target.getAttribute("aria-describedby") ?? ""} ${this._id}`.trim());
  }

  render() {
    const rich = this.variant === "rich";
    return html`<div
      class=${tooltip({
        placement: this.placement,
        align: this.align,
        enabled: this.from ? `false ${this.from}` : true,
      })}
    >
      <div class=${tooltipContent({ variant: this.variant })} role="tooltip" id=${this._id}>
        ${rich && this.heading ? html`<span class=${tooltipHeading()}>${this.heading}</span>` : nothing}
        <span>${this.tip}</span>
        ${rich ? this.slotted("action") : nothing}
      </div>
      ${this.slotted()}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-tooltip": UiTooltip;
  }
}
