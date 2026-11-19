import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Alert: Informs users about important events.
 *
 * Purpose: Feedback & system status · Kind: primitive
 * Docs: https://daisyui.com/components/alert/
 *
 * Every variant is responsive, e.g. the docs' responsive alert (stacked on
 * small screens, side by side from `sm`): `direction="vertical sm:horizontal"`.
 */
export const alert = rcva("alert", {
  variants: {
    color: {
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning",
      error: "alert-error",
    },
    variant: {
      /** Outline, dash and soft draw text in the alert's colour: mixed toward the ink so it reads at AA. */
      outline:
        "alert-outline [color:color-mix(in_oklab,var(--alert-color,var(--color-base-content))_35%,var(--color-base-content))]",
      dash: "alert-dash [color:color-mix(in_oklab,var(--alert-color,var(--color-base-content))_35%,var(--color-base-content))]",
      soft: "alert-soft [color:color-mix(in_oklab,var(--alert-color,var(--color-base-content))_35%,var(--color-base-content))]",
    },
    direction: {
      vertical: "alert-vertical",
      horizontal: "alert-horizontal",
    },
  },
});

export type AlertVariants = VariantProps<typeof alert>;

/** Icon colour for the neutral (no `color`) alert, matching the docs examples. */
export const alertIcon = rcva("h-6 w-6 shrink-0 stroke-current", {
  variants: {
    neutral: { true: "text-info", false: "" },
  },
});

export const alertHeading = rcva("font-bold");
export const alertDescription = rcva("text-body-sm");
export const alertActions = rcva("flex gap-2");
export const alertDismiss = rcva("btn btn-sm btn-ghost btn-circle");

const ALERT_ICONS = {
  default: "info",
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
} as const satisfies Record<NonNullable<AlertVariants["color"]> | "default", IconName>;

/** Default status icon for an alert colour. */
export const alertIconSvg = (color: AlertVariants["color"]) =>
  iconSvg(ALERT_ICONS[(color ?? "default") as keyof typeof ALERT_ICONS], {}, { class: alertIcon({ neutral: !color }) });

/**
 * @example <ui-alert color="success" variant="soft">Your purchase has been confirmed!</ui-alert>
 * @example
 * <ui-alert direction="vertical sm:horizontal" heading="New message!" description="You have 1 unread message" dismissible>
 *   <ui-button slot="actions" size="sm">See</ui-button>
 * </ui-alert>
 *
 * Children become the message (unless `heading`/`description` are given). `slot="icon"`
 * replaces the default icon and `slot="actions"` adds buttons at the end.
 * `dismissible` adds a close button; it fires a cancelable `ui-close` and hides the alert.
 */
@customElement("ui-alert")
export class UiAlert extends LightElement {
  @property() color: AlertVariants["color"];
  @property() variant: AlertVariants["variant"];
  @property() direction: AlertVariants["direction"];
  @property() heading: Renderable = "";
  @property() description: Renderable = "";
  /** Show the default status icon for `color`. */
  @property({ converter: booleanAttribute }) icon = true;
  @property({ type: Boolean }) dismissible = false;
  @property({ type: Boolean, reflect: true }) dismissed = false;

  private _dismiss() {
    const ev = new CustomEvent("ui-close", { bubbles: true, cancelable: true });
    if (this.dispatchEvent(ev)) this.dismissed = true;
  }

  render() {
    if (this.dismissed) return nothing;
    const icon = this.hasSlotted("icon") ? this.slotted("icon") : this.icon ? alertIconSvg(this.color) : nothing;
    const body =
      this.heading || this.description
        ? html`<div>
            ${this.heading ? html`<h3 class=${alertHeading()}>${this.heading}</h3>` : nothing}
            ${this.description ? html`<div class=${alertDescription()}>${this.description}</div>` : nothing}
            ${this.slotted()}
          </div>`
        : html`<span>${this.slotted()}</span>`;

    return html`<div
      role=${this.color === "error" || this.color === "warning" ? "alert" : "status"}
      class=${alert({ color: this.color, variant: this.variant, direction: this.direction })}
    >
      ${icon} ${body}
      ${
        this.hasSlotted("actions") || this.dismissible
          ? html`<div class=${alertActions()}>
              ${this.slotted("actions")}
              ${
                this.dismissible
                  ? html`<button type="button" class=${alertDismiss()} aria-label="Dismiss" @click=${this._dismiss}>
                      ✕
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
