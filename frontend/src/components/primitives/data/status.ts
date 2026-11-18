import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { isOn, rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Status: Small icon showing an element's status (online, offline, error, etc.).
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/status/
 *
 * All variants are responsive (e.g. `size="sm lg:lg"`, `bounce="md"`).
 */
export const status = rcva("status", {
  variants: {
    color: {
      neutral: "status-neutral",
      primary: "status-primary",
      secondary: "status-secondary",
      accent: "status-accent",
      info: "status-info",
      success: "status-success",
      warning: "status-warning",
      error: "status-error",
    },
    size: {
      xs: "status-xs",
      sm: "status-sm",
      md: "status-md",
      lg: "status-lg",
      xl: "status-xl",
    },
    /** Bounce animation ("Unread messages"). */
    bounce: { true: "animate-bounce" },
  },
});

/** Stack used for the ping effect: a pinging copy layered under the dot. */
export const statusPingStack = rcva("inline-grid *:[grid-area:1/1]");
/** The pinging copy; `ping` is responsive (e.g. `ping="lg"` pings from lg up). */
export const statusPing = rcva("", {
  variants: { ping: { true: "animate-ping" } },
  defaultVariants: { ping: true },
});

export type StatusVariants = VariantProps<typeof status>;

/**
 * @example <ui-status color="success" label="online"></ui-status>
 * @example <ui-status color="error" ping>Server is down</ui-status>
 * @example <ui-status color="info" bounce>Unread messages</ui-status>
 * @example <ui-status color="success" size="sm md:lg"></ui-status>
 *
 * Authored children are rendered as a text label after the dot.
 */
@customElement("ui-status")
export class UiStatus extends LightElement {
  @property() color: StatusVariants["color"];
  @property() size: StatusVariants["size"];
  @property({ converter: responsiveBoolean }) ping: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) bounce: Responsive<boolean> = false;
  /** Accessible name of the dot (defaults to the colour, or "status"). */
  @property() label?: string;

  render() {
    const label = this.label ?? this.color ?? "status";
    const dot = (extra = "") =>
      html`<div
        role=${extra ? nothing : "status"}
        aria-label=${extra ? nothing : label}
        aria-hidden=${extra ? "true" : nothing}
        class=${status({ color: this.color, size: this.size, bounce: this.bounce, class: extra })}
      ></div>`;
    const indicator = isOn(this.ping)
      ? html`<div class=${statusPingStack()}>${dot(statusPing({ ping: this.ping }))}${dot()}</div>`
      : dot();
    return this.hasContent ? html`${indicator} ${this.content}` : indicator;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-status": UiStatus;
  }
}
