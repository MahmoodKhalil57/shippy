import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { afterNextPaint } from "../../../lib/base/work-queue.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { floating, floatingHeight, inset, row, rowFill, stack, text } from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../lib/i18n/index.ts";

export const sheet = rcva(
  `modal modal-end ${inset["4"]} py-4 max-sm:px-0 max-sm:py-0 data-closing:invisible data-closing:backdrop:invisible`,
);
export const sheetBox = rcva(
  `modal-box liquid-glass-surface shadow-elevation-1 ${stack} ${floatingHeight.sheet} max-h-full max-w-none overflow-hidden [--clips:surface] rounded-lg p-0 max-sm:h-full max-sm:w-full max-sm:rounded-none motion-reduce:transition-none`,
  {
    variants: {
      size: {
        md: floating.sheet,
        lg: floating.sheetWide,
      },
    },
    defaultVariants: { size: "md" },
  },
);
export const sheetHeader = rcva(`${row} ${inset["6"]} items-center gap-x-3 gap-y-1 pt-4`, {
  variants: {
    titled: { true: "pb-3", false: "pb-0" },
  },
  defaultVariants: { titled: true },
});
export const sheetHeadings = rcva(`${stack} ${rowFill} gap-0.5`);
export const sheetHeading = rcva(`${text.label} text-title-lg`);
export const sheetSubhead = rcva(`${text.label} text-body-sm text-on-surface-variant`);
export const sheetTrailing = rcva(`${row} items-center gap-2`);
export const sheetBody = rcva(`${inset["6"]} min-h-0 flex-1 overflow-y-auto overscroll-contain pt-1 pb-6`);
export const sheetActions = rcva(`${row} ${inset["6"]} items-center gap-2 border-t border-outline-variant pt-4 pb-6`);
export const sheetBackdrop = rcva("modal-backdrop");

export type SheetVariants = VariantProps<typeof sheetBox>;

@customElement("ui-sheet")
export class UiSheet extends LightElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading: Renderable = "";
  @property() subhead: Renderable = "";
  @property() label = "";
  @property() size: SheetVariants["size"];
  @property({ attribute: "close-label" }) closeLabel = m.sheet_close();

  @query("dialog") private _dialog!: HTMLDialogElement;
  #pressedOutside = false;
  #headingId = uid("sheet-heading");

  show() {
    this.open = true;
  }

  close() {
    this.open = false;
  }

  dismiss() {
    if (this.dispatchEvent(new CustomEvent("ui-dismiss", { bubbles: true, cancelable: true }))) this.open = false;
  }

  #opening = 0;

  protected updated(changed: PropertyValues<this>) {
    if (!changed.has("open")) return;
    if (this.open && !this._dialog.open) {
      const ticket = ++this.#opening;
      void afterNextPaint().then(() => {
        if (ticket !== this.#opening || !this.open || !this.isConnected) return;
        this._dialog.showModal();
        this.dispatchEvent(new CustomEvent("ui-open", { bubbles: true }));
      });
    } else if (!this.open && this._dialog.open) {
      const ticket = ++this.#opening;
      this._dialog.toggleAttribute("data-closing", true);
      void afterNextPaint().then(() => {
        const dialog = this._dialog;
        if (ticket !== this.#opening) return;
        dialog.removeAttribute("data-closing");
        if (!this.open && dialog.open) dialog.close();
      });
    }
  }

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
    const titled = !!(this.heading || this.subhead);
    return html`<dialog
      class=${sheet()}
      aria-labelledby=${this.heading ? this.#headingId : nothing}
      aria-label=${this.heading ? nothing : this.label || nothing}
      @cancel=${this._onCancel}
      @close=${this._onClose}
      @pointerdown=${(e: PointerEvent) => (this.#pressedOutside = e.target === e.currentTarget)}
      @click=${(e: MouseEvent) => this.#pressedOutside && e.target === e.currentTarget && this.dismiss()}
    >
      <div class=${sheetBox({ size: this.size })}>
        <header class=${sheetHeader({ titled })}>
          <div class=${sheetHeadings()}>
            ${this.heading ? html`<h2 id=${this.#headingId} class=${sheetHeading()}>${this.heading}</h2>` : nothing}
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
