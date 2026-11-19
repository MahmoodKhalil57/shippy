import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Alert: an inline message about the thing it sits beside — a warning before an action, why
 * something is blocked, what just happened (Apple: show status inline, next to what it's about).
 *
 * Purpose: Feedback & system status · Kind: primitive
 *
 * It isn't a dialog (that interrupts) and isn't a snackbar (that passes). Use it only when it
 * says something people need; plain explanations are text (Apple: "avoid an alert merely to
 * provide information"). `tone`: info (default), success, warning, error — filled with the
 * tone's container colour and its readable ink, with the matching icon. An optional `heading`,
 * the message (children or `description`), and at most two actions (`slot="actions"`).
 * `dismissible` adds a close button (a cancelable `ui-close`).
 */
export const alert = rcva(
  "grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 rounded-box px-4 py-3 text-body-md",
  {
    variants: {
      tone: {
        info: "bg-info-container text-on-info-container",
        success: "bg-success-container text-on-success-container",
        warning: "bg-warning-container text-on-warning-container",
        error: "bg-error-container text-on-error-container",
      },
    },
    defaultVariants: { tone: "info" },
  },
);
export const alertIcon = rcva("mt-0.5 size-5 shrink-0");
export const alertBody = rcva("flex min-w-0 flex-col gap-0.5");
export const alertHeading = rcva("text-title-sm");
export const alertActions = rcva("col-start-2 flex flex-wrap items-center gap-2");

export type AlertVariants = VariantProps<typeof alert>;
export type AlertTone = NonNullable<AlertVariants["tone"]>;

const ALERT_ICONS: Record<AlertTone, IconName> = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

/**
 * @example <ui-alert tone="success">Your purchase has been confirmed.</ui-alert>
 * @example
 * <ui-alert tone="warning" heading="Token expired" description="purchasing@ stopped syncing at 06:10.">
 *   <ui-button slot="actions" size="xs" variant="tonal">Reconnect</ui-button>
 * </ui-alert>
 */
@customElement("ui-alert")
export class UiAlert extends LightElement {
  @property() tone: AlertVariants["tone"];
  @property() heading: Renderable = "";
  @property() description: Renderable = "";
  /** Show the tone's icon. */
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
    return html`<div role=${tone === "error" || tone === "warning" ? "alert" : "status"} class=${alert({ tone })}>
      ${icon}
      <div class=${alertBody()}>
        ${this.heading ? html`<p class=${alertHeading()}>${this.heading}</p>` : nothing}
        ${this.description ? html`<p>${this.description}</p>` : nothing} ${this.slotted()}
      </div>
      ${
        this.hasSlotted("actions") || this.dismissible
          ? html`<div class=${alertActions()}>
              ${this.slotted("actions")}
              ${
                this.dismissible
                  ? html`<button
                      type="button"
                      class=${iconButton({ size: "xs" })}
                      aria-label="Dismiss"
                      @click=${this._dismiss}
                    >
                      ${iconSvg("x", { size: "sm" })}
                    </button>`
                  : nothing
              }
            </div>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-alert": UiAlert;
  }
}
