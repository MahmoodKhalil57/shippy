import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";

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
    /** Vertical placement. daisyUI default: middle. */
    placement: {
      top: "modal-top",
      middle: "modal-middle",
      bottom: "modal-bottom",
    },
    /** Horizontal placement. */
    align: {
      start: "modal-start",
      end: "modal-end",
    },
    /** Force open; for the checkbox/anchor methods. `<dialog>` uses its `open` state instead. */
    open: { true: "modal-open" },
  },
});

export const modalBox = rcva("modal-box", {
  variants: {
    /** Box width ("dialog modal with custom width"). Default: daisyUI's. */
    width: {
      wide: "w-11/12 max-w-5xl",
    },
  },
});
export const modalHeading = rcva("text-lg font-bold");
export const modalAction = rcva("modal-action");
/** Form wrapping the action buttons so any of them closes the dialog. */
export const modalActionForm = rcva("flex gap-2");
/** Full-screen layer behind the box; a click on it closes the modal. */
export const modalBackdrop = rcva("modal-backdrop");
/** Hidden checkbox for the CSS-only "modal using checkbox" method. */
export const modalToggle = rcva("modal-toggle");
export const modalClose = rcva("btn btn-sm btn-circle btn-ghost absolute right-2 top-2");

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
 * @example <ui-modal placement="bottom sm:middle" heading="Responsive">…</ui-modal>
 * @example <ui-modal width="wide" heading="Wide">…</ui-modal>
 *
 * Slots: `heading`, `actions` (rendered in `modal-action`, inside a
 * `<form method="dialog">` so any button closes the modal).
 * Events: `ui-open`, `ui-close` (detail: `{ returnValue }`).
 */
@customElement("ui-modal")
export class UiModal extends LightElement {
  @property() placement: ModalVariants["placement"];
  @property() align: ModalVariants["align"];
  @property() width: VariantProps<typeof modalBox>["width"];
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading: Renderable = "";
  /** Close when the backdrop is clicked. */
  @property({ converter: booleanAttribute, attribute: "backdrop-close" }) backdropClose = true;
  /** Show a ✕ button in the corner. */
  @property({ type: Boolean, attribute: "close-button" }) closeButton = false;

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

  private _onClose() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("ui-close", { detail: { returnValue: this._dialog.returnValue }, bubbles: true }),
    );
  }

  render() {
    const heading = this.hasSlotted("heading") ? this.slotted("heading") : this.heading;
    return html`<dialog
      class=${modal({ placement: this.placement, align: this.align })}
      aria-label=${typeof this.heading === "string" && this.heading ? this.heading : nothing}
      @close=${this._onClose}
    >
      <div class=${modalBox({ width: this.width })}>
        ${
          this.closeButton
            ? html`<form method="dialog"><button class=${modalClose()} aria-label="Close">✕</button></form>`
            : nothing
        }
        ${heading ? html`<h3 class=${modalHeading()}>${heading}</h3>` : nothing} ${this.slotted()}
        ${
          this.hasSlotted("actions")
            ? html`<div class=${modalAction()}>
                <form method="dialog" class=${modalActionForm()}>${this.slotted("actions")}</form>
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
