import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { afterNextPaint } from "../../base/work-queue.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconButton } from "../actions/icon-button.ts";
import { floating, floatingHeight, inset, row, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../i18n/index.ts";

export const modal = rcva("modal data-closing:invisible data-closing:backdrop:invisible", {
  variants: {
    placement: {
      middle: "modal-middle",
      spotlight: "items-start pt-[clamp(0.5rem,12dvh_-_3rem,7rem)]",
    },
  },
});

export const modalBox = rcva(
  `modal-box liquid-glass shadow-elevation-3 max-w-none ${floatingHeight.fit} motion-reduce:transition-none`,
  {
    variants: {
      width: {
        default: floating["10"],
        wide: floating["18"],
        palette: floating["12"],
      },
      sections: {
        true: `flex ${floatingHeight.dialog} flex-col overflow-hidden [--clips:surface] p-0`,
      },
    },
    defaultVariants: { width: "default" },
  },
);
export const modalHeader = rcva("border-b border-outline-variant");
export const modalBody = rcva(`${inset["2"]} min-h-0 flex-1 overflow-y-auto overscroll-contain py-2`);
export const modalFooter = rcva(`${inset["4"]} border-t border-outline-variant py-2.5`);
export const modalHeading = rcva(`${text.label} text-title-lg`);
export const modalAction = rcva("modal-action");
export const modalActionForm = rcva(`${row} gap-2`);
export const modalBackdrop = rcva("modal-backdrop");
export const modalToggle = rcva("modal-toggle");
export const modalClose = rcva("absolute top-2 end-2");

export type ModalVariants = VariantProps<typeof modal>;

@customElement("ui-modal")
export class UiModal extends LightElement {
  @property() placement: ModalVariants["placement"];
  @property() width: VariantProps<typeof modalBox>["width"];
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading: Renderable = "";
  @property({ converter: booleanAttribute, attribute: "backdrop-close" }) backdropClose = true;
  @property({ type: Boolean, attribute: "close-button" }) closeButton = false;
  @property({ type: Boolean }) sections = false;
  @property({ attribute: "confirm-label" }) confirmLabel = "";
  @property({ attribute: "confirm-tone" }) confirmTone: "primary" | "error" = "primary";
  @property({ type: Boolean, attribute: "confirm-disabled" }) confirmDisabled = false;
  @property({ attribute: "cancel-label" }) cancelLabel = m.modal_cancel();

  @query("dialog") private _dialog!: HTMLDialogElement;

  show() {
    this.open = true;
  }

  close(returnValue?: string) {
    if (this._dialog && returnValue !== undefined) this._dialog.returnValue = returnValue;
    this.open = false;
  }

  #opening = 0;

  protected updated(changed: PropertyValues<this>) {
    if (!changed.has("open") || !this._dialog) return;
    if (this.open && !this._dialog.open) {
      const ticket = ++this.#opening;
      void afterNextPaint().then(() => {
        if (ticket !== this.#opening || !this.open || !this._dialog || this._dialog.open) return;
        this._dialog.showModal();
        this.dispatchEvent(new CustomEvent("ui-open", { bubbles: true }));
      });
    } else if (!this.open && this._dialog.open) {
      const ticket = ++this.#opening;
      this._dialog.toggleAttribute("data-closing", true);
      void afterNextPaint().then(() => {
        const dialog = this._dialog;
        if (ticket !== this.#opening || !dialog) return;
        dialog.removeAttribute("data-closing");
        if (!this.open && dialog.open) dialog.close();
      });
    }
  }

  private _onDialogClick(e: MouseEvent) {
    if (this.backdropClose && this.#pressedOutside && e.target === e.currentTarget) this.close();
  }

  #pressedOutside = false;

  private _onClose() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("ui-close", { detail: { returnValue: this._dialog.returnValue }, bubbles: true }),
    );
  }

  render() {
    const heading = this.hasSlotted("heading") ? this.slotted("heading") : this.heading;
    return html`<dialog
      class=${modal({ placement: this.placement })}
      aria-label=${typeof this.heading === "string" && this.heading ? this.heading : nothing}
      @close=${this._onClose}
      @pointerdown=${(e: PointerEvent) => (this.#pressedOutside = e.target === e.currentTarget)}
      @click=${this._onDialogClick}
    >
      <div class=${modalBox({ width: this.width, sections: this.sections })}>
        ${
          this.closeButton
            ? html`<form method="dialog" class=${modalClose()}>
                <button class=${iconButton({ size: "xs" })} aria-label=${m.modal_close()}>
                  ${iconSvg("x", { size: "sm" })}
                </button>
              </form>`
            : nothing
        }
        ${heading ? html`<h3 class=${modalHeading()}>${heading}</h3>` : nothing}
        ${
          this.sections
            ? html`${this.hasSlotted("header") ? html`<div class=${modalHeader()}>${this.slotted("header")}</div>` : nothing}
                <div class=${modalBody()}>${this.slotted()}</div>
                ${this.hasSlotted("footer") ? html`<div class=${modalFooter()}>${this.slotted("footer")}</div>` : nothing}`
            : this.slotted()
        }
        ${
          this.hasSlotted("actions")
            ? html`<div class=${modalAction()}>
                <form method="dialog" class=${modalActionForm()}>${this.slotted("actions")}</form>
              </div>`
            : this.confirmLabel
              ? html`<div class=${modalAction()}>
                  <form method="dialog" class=${modalActionForm()}>
                    <button class=${button({ variant: "text" })}>${this.cancelLabel}</button>
                  </form>
                  <button
                    type="button"
                    class=${button({ color: this.confirmTone, variant: "filled" })}
                    ?disabled=${this.confirmDisabled}
                    @click=${() => this.dispatchEvent(new CustomEvent("ui-confirm", { bubbles: true }))}
                  >
                    ${this.confirmLabel}
                  </button>
                </div>`
              : nothing
        }
      </div>
      ${
        this.backdropClose
          ? html`<form method="dialog" class=${modalBackdrop()}><button>${m.modal_close()}</button></form>`
          : nothing
      }
    </dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-modal": UiModal;
  }
}
