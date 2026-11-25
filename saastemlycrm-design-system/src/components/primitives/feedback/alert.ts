import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { fixed, inset, row, rowFill, stack, text } from "../layout/algebra.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { m } from "../../../i18n/index.ts";

export const alertBox = rcva("w-full");
export const alert = rcva(`${row} ${inset["4"]} items-start gap-x-3 gap-y-2 rounded-box py-3`, {
  variants: {
    tone: {
      info: "bg-info-container text-on-info-container",
      success: "bg-success-container text-on-success-container",
      warning: "bg-warning-container text-on-warning-container",
      error: "bg-error-container text-on-error-container",
    },
  },
  defaultVariants: { tone: "info" },
});
export const alertIcon = rcva(`mt-0.5 ${fixed["5"]}`);
export const alertBody = rcva(`${stack} ${rowFill} gap-0.5 text-body-md`);
export const alertHeading = rcva(`${text.label} text-title-sm`);
export const alertActions = rcva(`${row} mt-1.5 items-center gap-2`);

export type AlertVariants = VariantProps<typeof alert>;
export type AlertTone = NonNullable<AlertVariants["tone"]>;

const ALERT_ICONS: Record<AlertTone, IconName> = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

@customElement("ui-alert")
export class UiAlert extends LightElement {
  @property() tone: AlertVariants["tone"];
  @property() heading: Renderable = "";
  @property() description: Renderable = "";
  @property({ converter: booleanAttribute }) icon = true;
  @property({ type: Boolean }) dismissible = false;
  @property({ type: Boolean, reflect: true }) dismissed = false;

  private _dismiss() {
    const ev = new CustomEvent("ui-close", { bubbles: true, cancelable: true });
    if (this.dispatchEvent(ev)) this.dismissed = true;
  }

  render() {
    if (this.dismissed) return nothing;
    const tone = this.tone ?? "info";
    const icon = this.hasSlotted("icon")
      ? this.slotted("icon")
      : this.icon
        ? iconSvg(ALERT_ICONS[tone], {}, { class: alertIcon() })
        : html`<span></span>`;
    return html`<div class=${alertBox()}>
      <div role=${tone === "error" || tone === "warning" ? "alert" : "status"} class=${alert({ tone })}>
        ${icon}
        <div class=${alertBody()}>
          ${this.heading ? html`<p class=${alertHeading()}>${this.heading}</p>` : nothing}
          ${this.description ? html`<p>${this.description}</p>` : nothing} ${this.slotted()}
          ${
            this.hasSlotted("actions") || this.dismissible
              ? html`<div class=${alertActions()}>
                  ${this.slotted("actions")}
                  ${
                    this.dismissible
                      ? html`<button
                          type="button"
                          class=${iconButton({ size: "xs" })}
                          aria-label=${m.alert_dismiss()}
                          @click=${this._dismiss}
                        >
                          ${iconSvg("x", { size: "sm" })}
                        </button>`
                      : nothing
                  }
                </div>`
              : nothing
          }
        </div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-alert": UiAlert;
  }
}
