import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { floating, inset, row, rowFill, stack, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Sheet: a panel from the end side, over the page, for one thing looked at or edited without
 * leaving the page behind it (M3 modal side sheet; Apple sheets).
 *
 * Purpose: Content containers & disclosure · Kind: primitive
 *
 * - **Anatomy** (M3 side sheets): a headline with a close button, a `trailing` slot beside it for
 *   a link or a tag, the content, which scrolls, and `actions` pinned at the bottom, at the start
 *   (M3: "bottom actions alignment: left"). 24dp at the start and end of each part.
 * - **Size:** `md` is M3's 400dp side sheet (26rem); `lg` (32rem) is for a form. Never wider than
 *   the window less 1rem a side (layout/algebra.ts `floating`). It is detached: 16dp from the
 *   window's edges with a 16dp corner (M3). On a compact window (under 640px) it is the whole
 *   screen, square (M3: full-screen on compact).
 * - **A floating layer:** glass at elevation +1 over the 32% scrim (AGENTS.md). It slides in from
 *   the end edge on M3's emphasized easing and leaves quicker (daisyUI's `modal-end`, retimed in
 *   src/styles/daisy-motion.css); with Reduce motion it only fades.
 * - **Closing:** Escape, the scrim and the close button all ask first: they fire a cancelable
 *   `ui-dismiss`. Unless the page calls `preventDefault()` (unsaved changes: it asks, then sets
 *   `open` itself), the sheet closes and fires `ui-close`.
 *
 * A native `<dialog>` opened with `showModal()`: focus stays inside, the page behind is inert.
 */
export const sheet = rcva(`modal modal-end ${inset["4"]} py-4 max-sm:px-0 max-sm:py-0`);
export const sheetBox = rcva(
  `modal-box liquid-glass-surface shadow-elevation-1 ${stack} h-full max-h-full overflow-hidden rounded-lg p-0 max-sm:w-full max-sm:rounded-none motion-reduce:transition-none`,
  {
    variants: {
      size: {
        md: floating.md,
        lg: floating.lg,
      },
    },
    defaultVariants: { size: "md" },
  },
);
export const sheetHeader = rcva(`${row} ${inset["6"]} items-center gap-x-3 gap-y-1 pt-4 pb-3`);
/** The headline and its supporting line: the part that takes the room. */
export const sheetHeadings = rcva(`${stack} ${rowFill} gap-0.5`);
export const sheetHeading = rcva(`${text.label} text-title-lg`);
export const sheetSubhead = rcva(`${text.label} text-body-sm text-on-surface-variant`);
export const sheetTrailing = rcva(`${row} items-center gap-2`);
export const sheetBody = rcva(`${inset["6"]} min-h-0 flex-1 overflow-y-auto overscroll-contain pt-1 pb-6`);
export const sheetActions = rcva(`${row} ${inset["6"]} items-center gap-2 border-t border-outline-variant pt-4 pb-6`);
/** The scrim behind the box; a click on it asks to close. */
export const sheetBackdrop = rcva("modal-backdrop");

export type SheetVariants = VariantProps<typeof sheetBox>;

/**
 * @example
 * <ui-sheet heading="GS-RFQ-0142" subhead="Case" size="lg" .open=${open} @ui-close=${() => (open = false)}>
 *   <ui-button slot="trailing" variant="text" size="xs" href="/collections/cases/c1">Open full page</ui-button>
 *   …the form…
 *   <ui-button slot="actions" color="primary">Save</ui-button>
 * </ui-sheet>
 *
 * Slots: `trailing` (beside the headline), `actions` (pinned at the bottom); the rest is the
 * content. Events: `ui-open`, `ui-dismiss` (cancelable: someone asked to close it), `ui-close`.
 */
@customElement("ui-sheet")
export class UiSheet extends LightElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading: Renderable = "";
  /** A quiet line under the headline (what kind of thing it is). */
  @property() subhead: Renderable = "";
  @property() size: SheetVariants["size"];
  /** The close button's name. */
  @property({ attribute: "close-label" }) closeLabel = "Close";

  @query("dialog") private _dialog!: HTMLDialogElement;
  /** The press started on the dialog itself (not a drag that began inside the box). */
  #pressedOutside = false;

  show() {
    this.open = true;
  }

  /** Close without asking. */
  close() {
    this.open = false;
  }

  /** Someone asked to close it (Escape, the scrim, the close button): the page may refuse. */
  dismiss() {
    if (this.dispatchEvent(new CustomEvent("ui-dismiss", { bubbles: true, cancelable: true }))) this.open = false;
  }

  protected updated(changed: PropertyValues<this>) {
    if (!changed.has("open") || !this._dialog) return;
    if (this.open && !this._dialog.open) {
      this._dialog.showModal();
      this.dispatchEvent(new CustomEvent("ui-open", { bubbles: true }));
    } else if (!this.open && this._dialog.open) {
      this._dialog.close();
    }
  }

  /** Escape: the browser would close the dialog; ask instead. */
  private _onCancel(e: Event) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    this.dismiss();
  }

  private _onClose(e: Event) {
    if (e.target !== e.currentTarget) return;
    this.open = false;
    this.dispatchEvent(new CustomEvent("ui-close", { bubbles: true }));
  }

  render() {
    const label = typeof this.heading === "string" && this.heading ? this.heading : nothing;
    return html`<dialog
      class=${sheet()}
      aria-label=${label}
      @cancel=${this._onCancel}
      @close=${this._onClose}
      @pointerdown=${(e: PointerEvent) => (this.#pressedOutside = e.target === e.currentTarget)}
      @click=${(e: MouseEvent) => this.#pressedOutside && e.target === e.currentTarget && this.dismiss()}
    >
      <div class=${sheetBox({ size: this.size })}>
        <header class=${sheetHeader()}>
          <div class=${sheetHeadings()}>
            <h2 class=${sheetHeading()}>${this.heading}</h2>
            ${this.subhead ? html`<p class=${sheetSubhead()}>${this.subhead}</p>` : nothing}
          </div>
          ${this.hasSlotted("trailing") ? html`<div class=${sheetTrailing()}>${this.slotted("trailing")}</div>` : nothing}
          <button
            type="button"
            class=${iconButton({ size: "xs" })}
            aria-label=${this.closeLabel}
            @click=${() => this.dismiss()}
          >
            ${iconSvg("x", { size: "sm" })}
          </button>
        </header>
        <div class=${sheetBody()}>${this.slotted()}</div>
        ${this.hasSlotted("actions") ? html`<footer class=${sheetActions()}>${this.slotted("actions")}</footer>` : nothing}
      </div>
      <div class=${sheetBackdrop()} @click=${() => this.dismiss()}></div>
    </dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-sheet": UiSheet;
  }
}
