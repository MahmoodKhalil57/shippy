import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconButton } from "../actions/icon-button.ts";
import { floating, floatingHeight, inset, row, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Modal: Shows a dialog or box when a button is clicked.
 *
 * Purpose: Content containers & disclosure · Kind: primitive
 * Docs: https://daisyui.com/components/modal/
 *
 * Every variant is responsive, e.g. the docs' responsive modal (bottom sheet on
 * small screens, centred from `sm`): `placement="bottom sm:middle"`.
 */
export const modal = rcva("modal", {
  variants: {
    /**
     * Centred (M3 basic dialog), or `spotlight`: near the top, centred (command palettes), so the
     * box keeps its place as results change.
     */
    placement: {
      middle: "modal-middle",
      spotlight: "items-start pt-[clamp(0.5rem,12dvh_-_3rem,7rem)]",
    },
  },
});

/**
 * The box is glass (it floats above the page; src/styles/theme.css) and pops in on M3's
 * expressive fast spatial spring (a little bounce), fading on the effects spring.
 */
/** A dialog: M3 elevation +3, over a 32% scrim (src/styles/daisy-m3.css). */
export const modalBox = rcva(
  `modal-box liquid-glass shadow-elevation-3 max-w-none ${floatingHeight.fit} motion-reduce:transition-none`,
  {
    variants: {
      /**
       * Whole tiles across (`floating.*`): 10 (530px, M3's dialogs are 280–560dp), `wide` 18 (a
       * board's `l`), the command palette 12. daisyUI's own `max-width` is lifted (`max-w-none`).
       */
      width: {
        default: floating["10"],
        wide: floating["18"],
        /** Command palette. */
        palette: floating["12"],
      },
      /** `header` / body / `footer` sections; only the body scrolls. At most quarter tiles down. */
      sections: {
        true: `flex ${floatingHeight.dialog} flex-col overflow-hidden p-0`,
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
/** Form wrapping the action buttons so any of them closes the dialog. */
export const modalActionForm = rcva(`${row} gap-2`);
/** Full-screen layer behind the box; a click on it closes the modal. */
export const modalBackdrop = rcva("modal-backdrop");
/** Hidden checkbox for the CSS-only "modal using checkbox" method. */
export const modalToggle = rcva("modal-toggle");
export const modalClose = rcva("absolute top-2 end-2");

export type ModalVariants = VariantProps<typeof modal>;

/**
 * Wraps a native `<dialog>` (opened with `showModal()`: focus trap, Esc to close, top layer).
 *
 * @example
 * <ui-modal heading="Hello!" close-button>
 *   Press ESC key or click outside to close
 *   <ui-button slot="actions">Close</ui-button>
 * </ui-modal>
 * document.querySelector("ui-modal")!.show();
 * @example
 * <ui-modal heading="Delete 3 bills?" confirm-label="Delete" confirm-tone="error" .open=${asking}
 *   @ui-confirm=${remove} @ui-close=${() => (asking = false)}>They're removed for everyone.</ui-modal>
 * @example <ui-modal width="wide" heading="Wide">…</ui-modal>
 * @example <ui-modal placement="spotlight" width="palette" sections><ui-text-input slot="header" …></ui-text-input>…</ui-modal>
 *
 * Slots: `heading`, `actions` (rendered in `modal-action`, inside a
 * `<form method="dialog">` so any button closes the modal). With `sections`: `header` and
 * `footer` stay put and the content between them scrolls (command palettes).
 * Events: `ui-open`, `ui-close` (detail: `{ returnValue }`), `ui-confirm`.
 *
 * Confirmations (M3 dialogs; Apple alerts): `confirm-label` adds the action row itself — Cancel
 * (always there, never disabled) and the confirm action, named with a verb ("Delete", not "OK").
 * `confirm-tone="error"` for destructive ones; `confirm-disabled` until a choice is made. The
 * confirm action fires `ui-confirm`; the page closes the dialog when the work is done.
 */
@customElement("ui-modal")
export class UiModal extends LightElement {
  @property() placement: ModalVariants["placement"];
  @property() width: VariantProps<typeof modalBox>["width"];
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading: Renderable = "";
  /** Close when the backdrop is clicked. */
  @property({ converter: booleanAttribute, attribute: "backdrop-close" }) backdropClose = true;
  /** Show a ✕ button in the corner. */
  @property({ type: Boolean, attribute: "close-button" }) closeButton = false;
  /** Fixed `header` / `footer` slots around a scrolling body. */
  @property({ type: Boolean }) sections = false;
  /** A confirmation's action, a verb ("Delete", "Send"): adds Cancel + this. */
  @property({ attribute: "confirm-label" }) confirmLabel = "";
  /** `error` for a destructive confirmation. */
  @property({ attribute: "confirm-tone" }) confirmTone: "primary" | "error" = "primary";
  /** Hold the confirm action until a choice is made (Cancel never is). */
  @property({ type: Boolean, attribute: "confirm-disabled" }) confirmDisabled = false;
  @property({ attribute: "cancel-label" }) cancelLabel = "Cancel";

  @query("dialog") private _dialog!: HTMLDialogElement;

  /** Open as a modal dialog. */
  show() {
    this.open = true;
  }

  /** Close the dialog, optionally with a return value. */
  close(returnValue?: string) {
    if (this._dialog?.open) this._dialog.close(returnValue);
    this.open = false;
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

  /**
   * A click on the dialog itself — anywhere outside the box that the backdrop doesn't cover
   * (e.g. a placement's padding, like `spotlight`'s top band over the app header) — closes it too.
   */
  private _onDialogClick(e: MouseEvent) {
    if (this.backdropClose && this.#pressedOutside && e.target === e.currentTarget) this.close();
  }

  /** The press started on the dialog itself (not a drag that began inside the box). */
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
                <button class=${iconButton({ size: "xs" })} aria-label="Close">${iconSvg("x", { size: "sm" })}</button>
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
          ? html`<form method="dialog" class=${modalBackdrop()}><button aria-label="Close">close</button></form>`
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
