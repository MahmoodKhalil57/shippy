import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Confirmation: an agent asks before it acts — what it wants to do, the details, Allow / Don't.
 * Once answered it stays in the thread as a record of the decision.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Confirmation")
 */
export const confirmation = rcva("flex flex-col gap-2 rounded-box border p-3 text-body-md", {
  variants: {
    state: {
      requested: "border-warning/50 bg-warning/10",
      approved: "border-outline-variant",
      denied: "border-outline-variant",
    },
  },
});
export const confirmationHead = rcva("flex items-start gap-2");
export const confirmationIcon = rcva("mt-0.5 shrink-0", {
  variants: {
    state: { requested: "text-warning-ink", approved: "text-success-ink", denied: "text-on-surface-variant" },
  },
});
export const confirmationTitle = rcva("font-semibold");
export const confirmationDescription = rcva("text-body-sm text-on-surface-variant");
export const confirmationDetails = rcva("text-body-sm");
export const confirmationActions = rcva("flex justify-end gap-2");
export const confirmationOutcome = rcva("text-label-md", {
  variants: { state: { requested: "", approved: "text-success-ink", denied: "text-on-surface-variant" } },
});

export type ConfirmationState = "requested" | "approved" | "denied";

/**
 * @example
 * <ui-confirmation label="Update a record?" description="Case GS-RFQ-0142" state="requested"
 *   @ui-approve=${…} @ui-deny=${…}>…details…</ui-confirmation>
 *
 * Children are the details (what exactly will change). `ui-approve` / `ui-deny` bubble.
 */
@customElement("ui-confirmation")
export class UiConfirmation extends LightElement {
  @property() label: Renderable = "";
  @property() description: Renderable = "";
  @property() state: ConfirmationState = "requested";
  @property({ attribute: "approve-label" }) approveLabel = "Allow";
  @property({ attribute: "deny-label" }) denyLabel = "Don't";

  private _answer(approved: boolean) {
    this.dispatchEvent(new CustomEvent(approved ? "ui-approve" : "ui-deny", { bubbles: true }));
  }

  render() {
    const requested = this.state === "requested";
    return html`<div
      class=${confirmation({ state: this.state })}
      role=${requested ? "alertdialog" : "group"}
      aria-label="Confirmation"
    >
      <div class=${confirmationHead()}>
        <span class=${confirmationIcon({ state: this.state })}
          >${iconSvg(requested ? "shield" : this.state === "approved" ? "check" : "block", { size: "sm" })}</span
        >
        <div>
          <div class=${confirmationTitle()}>${this.label}</div>
          ${this.description ? html`<div class=${confirmationDescription()}>${this.description}</div>` : nothing}
        </div>
      </div>
      ${this.hasContent ? html`<div class=${confirmationDetails()}>${this.content}</div>` : nothing}
      ${
        requested
          ? html`<div class=${confirmationActions()}>
              <button
                type="button"
                class=${button({ variant: "ghost", size: "sm" })}
                @click=${() => this._answer(false)}
              >
                ${this.denyLabel}
              </button>
              <button
                type="button"
                class=${button({ color: "primary", size: "sm" })}
                @click=${() => this._answer(true)}
              >
                ${this.approveLabel}
              </button>
            </div>`
          : html`<div class=${confirmationOutcome({ state: this.state })}>
              ${this.state === "approved" ? "Allowed" : "Not allowed"}
            </div>`
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-confirmation": UiConfirmation;
  }
}
