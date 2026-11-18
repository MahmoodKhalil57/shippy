import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Breakpoint, type Responsive } from "../../base/variants.ts";

/**
 * Tooltip: Shows a message when hovering over an element.
 *
 * Purpose: Feedback & system status · Kind: primitive
 * Docs: https://daisyui.com/components/tooltip/
 *
 * Every variant is responsive, e.g. the docs' responsive position:
 * `align="start md:center" placement="md:right"`.
 */
export const tooltip = rcva("", {
  variants: {
    /**
     * The tooltip itself. Responsive, so it can be enabled only from a
     * breakpoint ("only show for large screen": `lg:tooltip`).
     */
    enabled: { true: "tooltip" },
    /** Side the tooltip appears on. daisyUI default: top. */
    placement: {
      top: "tooltip-top",
      bottom: "tooltip-bottom",
      left: "tooltip-left",
      right: "tooltip-right",
    },
    /** Alignment along that side. */
    align: {
      start: "tooltip-start",
      center: "tooltip-center",
      end: "tooltip-end",
    },
    color: {
      primary: "tooltip-primary",
      secondary: "tooltip-secondary",
      accent: "tooltip-accent",
      info: "tooltip-info",
      success: "tooltip-success",
      warning: "tooltip-warning",
      error: "tooltip-error",
    },
    /** Force open. */
    open: { true: "tooltip-open" },
  },
  defaultVariants: { enabled: true },
});

export const tooltipContent = rcva("tooltip-content");

export type TooltipVariants = VariantProps<typeof tooltip>;

/**
 * @example <ui-tooltip tip="hello" placement="bottom" color="primary"><ui-button>Hover me</ui-button></ui-tooltip>
 * @example
 * <ui-tooltip>
 *   <span slot="tip">Wow!</span>
 *   <ui-button>Hover me</ui-button>
 * </ui-tooltip>
 * @example <ui-tooltip tip="hello" from="lg"><ui-button>Only a tooltip on large screens</ui-button></ui-tooltip>
 * @example <ui-tooltip tip="hello" align="start md:center" placement="md:right">…</ui-tooltip>
 *
 * Children are the trigger. Plain text goes in `tip` (`data-tip`); rich content goes
 * in a `slot="tip"` child, rendered as `tooltip-content`.
 */
@customElement("ui-tooltip")
export class UiTooltip extends LightElement {
  @property() tip?: string;
  @property() placement: TooltipVariants["placement"];
  @property() align: TooltipVariants["align"];
  @property() color: TooltipVariants["color"];
  @property({ converter: responsiveBoolean }) open: Responsive<boolean> = false;
  /** Only be a tooltip from this breakpoint up. */
  @property() from?: Breakpoint;

  render() {
    const rich = this.hasSlotted("tip");
    return html`<div
      class=${tooltip({
        placement: this.placement,
        align: this.align,
        color: this.color,
        open: this.open,
        enabled: this.from ? `false ${this.from}` : true,
      })}
      data-tip=${ifDefined(rich ? undefined : this.tip)}
    >
      ${rich ? html`<div class=${tooltipContent()} role="tooltip">${this.slotted("tip")}</div>` : nothing}
      ${this.slotted()}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-tooltip": UiTooltip;
  }
}
