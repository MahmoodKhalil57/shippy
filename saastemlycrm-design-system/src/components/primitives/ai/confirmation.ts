import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inset, row, rowFill, stack, text } from "../layout/algebra.ts";
import { button } from "../actions/button.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../i18n/index.ts";

export const confirmation = rcva(`${stack} ${inset["3"]} ${text.label} gap-2 rounded-box border py-3 text-body-md`, {
  variants: {
    state: {
      requested: "border-warning/50 bg-warning/10",
      approved: "border-outline-variant",
      denied: "border-outline-variant",
    },
  },
});
export const confirmationHead = rcva(`${row} items-start gap-2`);
export const confirmationIcon = rcva("mt-0.5", {
  variants: {
    state: { requested: "text-warning-ink", approved: "text-success-ink", denied: "text-on-surface-variant" },
  },
});
export const confirmationText = rcva(rowFill);
export const confirmationTitle = rcva("font-semibold");
export const confirmationDescription = rcva(`${text.prose} text-body-sm text-on-surface-variant`);
export const confirmationDetails = rcva(`${text.prose} text-body-sm`);
export const confirmationActions = rcva(`${row} justify-end gap-2`);
export const confirmationOutcome = rcva("text-label-md", {
  variants: { state: { requested: "", approved: "text-success-ink", denied: "text-on-surface-variant" } },
});

export type ConfirmationState = "requested" | "approved" | "denied";

@customElement("ui-confirmation")
export class UiConfirmation extends LightElement {
  @property() label: Renderable = "";
  @property() description: Renderable = "";
  @property() state: ConfirmationState = "requested";
  @property({ attribute: "approve-label" }) approveLabel = m.confirmation_allow();
  @property({ attribute: "deny-label" }) denyLabel = m.confirmation_deny();

  private _answer(approved: boolean) {
    this.dispatchEvent(new CustomEvent(approved ? "ui-approve" : "ui-deny", { bubbles: true }));
  }

  render() {
    const requested = this.state === "requested";
    return html`<div
      class=${confirmation({ state: this.state })}
      role=${requested ? "alertdialog" : "group"}
      aria-label=${m.confirmation_label()}
    >
      <div class=${confirmationHead()}>
        <span class=${confirmationIcon({ state: this.state })}
          >${iconSvg(requested ? "shield" : this.state === "approved" ? "check" : "block", { size: "sm" })}</span
        >
        <div class=${confirmationText()}>
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
                class=${button({ variant: "text", size: "xs" })}
                @click=${() => this._answer(false)}
              >
                ${this.denyLabel}
              </button>
              <button
                type="button"
                class=${button({ color: "primary", size: "xs" })}
                @click=${() => this._answer(true)}
              >
                ${this.approveLabel}
              </button>
            </div>`
          : html`<div class=${confirmationOutcome({ state: this.state })}>
              ${this.state === "approved" ? m.confirmation_allowed() : m.confirmation_not_allowed()}
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
