import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { floating, floatingHeight, inset, row, stack } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../i18n/index.ts";
import { iconButton } from "./icon-button.ts";

/**
 * FAB: the screen's one most important action, floating in the bottom corner (M3 floating action
 * button).
 *
 * Purpose: Actions · Kind: primitive
 *
 * One per screen. 56dp (`size="md"`, the default) or 96dp (`lg`), rounded (M3's large corner),
 * at elevation +3 (+4 on hover). `color="primary"` (filled, the default) or `tonal` (the primary
 * container). M3 retired the speed dial; actions that belong together go in a menu instead.
 *
 * `panel` mode: the button opens a floating glass panel above it (an assistant, a help chat) that
 * stays open while the page is used, until closed — M3's FAB expanding into a sheet. Header
 * (title + close), a scrolling body (the children), and a footer (`slot="footer"`).
 */
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

export const fabDock = rcva(
  `fixed end-4 bottom-4 z-[60] ${stack} items-end gap-3 pointer-events-none [&>*]:pointer-events-auto`,
);
/**
 * Closed, the panel stays mounted but hidden, so its content (a conversation) never lands in the page.
 * It opens out of its button (M3's FAB expanding into a sheet: emphasized easing, 400ms) and folds
 * back into it on the exit curve, quicker. With Reduce motion it only fades.
 */
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
// Its height is its content's (a flex item's automatic minimum); its title truncates.
export const fabPanelHead = rcva(`${row} ${inset["4"]} items-center gap-2 border-b border-outline-variant py-2.5`);
export const fabPanelTitle = rcva("min-w-0 flex-1 truncate text-title-sm");
export const fabPanelBody = rcva(
  `${stack} ${inset["4"]} min-h-0 flex-1 gap-3 overflow-y-auto overscroll-contain py-3 [--scrollbar-inset:var(--radius-box)]`,
);
export const fabPanelFooter = rcva(`${inset["3"]} border-t border-outline-variant py-2.5`);

export type FabVariants = VariantProps<typeof fab>;

/**
 * @example <ui-fab trigger-label="New case" @ui-main=${…}><ui-icon slot="trigger" name="plus"></ui-icon></ui-fab>
 * @example
 * <ui-fab panel heading="Assistant" trigger-label="Open the assistant" .open=${open}
 *   @ui-toggle=${(e) => (open = e.detail.open)}>
 *   <ui-icon slot="trigger" name="sparkles"></ui-icon>
 *   …messages…
 *   <ui-flex slot="footer">…message box…</ui-flex>
 * </ui-fab>
 *
 * Without `panel`, a click fires `ui-main`. With `panel` the button toggles the panel (`open`;
 * `ui-toggle` with { open } on change).
 */
@customElement("ui-fab")
export class UiFab extends LightElement {
  @property() trigger: Renderable = "";
  /** The action's name (the button has only an icon). */
  @property({ attribute: "trigger-label" }) triggerLabel?: string;
  @property() color: FabVariants["color"];
  @property() size: FabVariants["size"];
  /** Panel mode: the button opens a floating panel (see `fabPanel`). */
  @property({ type: Boolean }) panel = false;
  /** Panel mode: whether the panel is open. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** Panel mode: the panel's title. */
  @property() heading: Renderable = "";

  private _toggle(open = !this.open) {
    this.open = open;
    this.dispatchEvent(new CustomEvent("ui-toggle", { detail: { open }, bubbles: true }));
  }

  render() {
    const trigger = this.hasSlotted("trigger") ? this.slotted("trigger") : this.trigger;
    const cls = fab({ color: this.color, size: this.size });
    if (!this.panel)
      return html`<div class=${fabDock()}>
        <button
          type="button"
          class=${cls}
          aria-label=${ifDefined(this.triggerLabel)}
          @click=${() => this.dispatchEvent(new CustomEvent("ui-main", { detail: {}, bubbles: true }))}
        >
          ${trigger}
        </button>
      </div>`;
    return html`<div class=${fabDock()}>
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
