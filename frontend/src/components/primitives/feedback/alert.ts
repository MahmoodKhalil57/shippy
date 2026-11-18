import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";

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
      outline: "alert-outline",
      dash: "alert-dash",
      soft: "alert-soft",
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
export const alertDescription = rcva("text-xs");
export const alertActions = rcva("flex gap-2");
export const alertDismiss = rcva("btn btn-sm btn-ghost btn-circle");

const ICON_PATHS: Record<NonNullable<AlertVariants["color"]> | "default", string> = {
  default: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
};

/** Default status icon for an alert colour (the same SVGs as the daisyUI docs). */
export const alertIconSvg = (color: AlertVariants["color"]) =>
  html`<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class=${alertIcon({ neutral: !color })}
    aria-hidden="true"
  >
    ${svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d=${ICON_PATHS[color ?? "default"]}></path>`}
  </svg>`;

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
