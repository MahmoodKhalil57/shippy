import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { floating, floatingHeight, inset, row, stack } from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../lib/i18n/index.ts";
import { iconButton } from "./icon-button.ts";

export const fab = rcva(
  "btn max-w-full touch-target border-transparent p-0 shadow-elevation-3 hover:shadow-elevation-4 [&_svg]:size-6",
  {
    variants: {
      color: {
        primary: "btn-primary",
        tonal: "bg-primary-container text-on-primary-container state-layer",
      },
      size: {
        md: "size-14 rounded-lg",
        lg: "size-24 max-w-full rounded-xl [&_svg]:size-9",
      },
    },
    defaultVariants: { color: "primary", size: "md" },
  },
);

export const fabDock = rcva(`${stack} items-end gap-3`, {
  variants: {
    position: {
      fixed: "fixed end-4 bottom-4 z-[60] pointer-events-none [&>*]:pointer-events-auto",
      inline: "relative w-fit max-w-full",
    },
  },
  defaultVariants: { position: "fixed" },
});
export const fabPanel = rcva(
  `liquid-glass ${stack} ${floating["8"]} ${floatingHeight.panel} overflow-hidden [--clips:surface] rounded-box origin-bottom-right starting:scale-50 starting:opacity-0 motion-reduce:scale-100`,
  {
    variants: {
      hidden: {
        true: "hidden scale-50 opacity-0 [transition:opacity_var(--duration-short3)_var(--ease-emphasized-accelerate),scale_var(--duration-short4)_var(--ease-emphasized-accelerate),display_var(--duration-short4)_allow-discrete]",
        false:
          "[transition:opacity_var(--duration-short4)_var(--ease-emphasized-decelerate),scale_var(--duration-medium4)_var(--ease-emphasized),display_var(--duration-medium4)_allow-discrete]",
      },
    },
  },
);
export const fabPanelHead = rcva(`${row} ${inset["4"]} items-center gap-2 border-b border-outline-variant py-2.5`);
export const fabPanelTitle = rcva("min-w-0 flex-1 truncate text-title-sm");
export const fabPanelBody = rcva(
  `${stack} ${inset["4"]} min-h-0 flex-1 gap-3 overflow-y-auto overscroll-contain py-3 [--scrollbar-inset:var(--radius-box)]`,
);
export const fabPanelFooter = rcva(`${inset["3"]} border-t border-outline-variant py-2.5`);

export type FabVariants = VariantProps<typeof fab>;
export type FabPosition = "fixed" | "inline";

@customElement("ui-fab")
export class UiFab extends LightElement {
  @property() trigger: Renderable = "";
  @property({ attribute: "trigger-label" }) triggerLabel?: string;
  @property() color: FabVariants["color"];
  @property() size: FabVariants["size"];
  @property({ type: Boolean }) panel = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading: Renderable = "";
  @property({ reflect: true }) position: FabPosition = "fixed";

  private _toggle(open = !this.open) {
    this.open = open;
    this.dispatchEvent(new CustomEvent("ui-toggle", { detail: { open }, bubbles: true }));
  }

  render() {
    const trigger = this.hasSlotted("trigger") ? this.slotted("trigger") : this.trigger;
    const cls = fab({ color: this.color, size: this.size });
    if (!this.panel)
      return html`<div class=${fabDock({ position: this.position })}>
        <button
          type="button"
          class=${cls}
          aria-label=${ifDefined(this.triggerLabel)}
          @click=${() => this.dispatchEvent(new CustomEvent("ui-main", { detail: {}, bubbles: true }))}
        >
          ${trigger}
        </button>
      </div>`;
    return html`<div class=${fabDock({ position: this.position })}>
      <section class=${fabPanel({ hidden: !this.open })} role="dialog" aria-label=${ifDefined(this.triggerLabel)}>
        <header class=${fabPanelHead()}>
          <span class=${fabPanelTitle()}>${this.heading}</span>
          <button
            type="button"
            class=${iconButton({ size: "xs" })}
            aria-label=${m.fab_close()}
            @click=${() => this._toggle(false)}
          >
            ${iconSvg("x", { size: "sm" })}
          </button>
        </header>
        <div class=${fabPanelBody()}>${this.slotted()}</div>
        ${this.hasSlotted("footer") ? html`<footer class=${fabPanelFooter()}>${this.slotted("footer")}</footer>` : nothing}
      </section>
      <button
        type="button"
        class=${cls}
        aria-label=${ifDefined(this.triggerLabel)}
        aria-expanded=${this.open ? "true" : "false"}
        @click=${() => this._toggle()}
      >
        ${trigger}
      </button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-fab": UiFab;
  }
}
