import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { alert, alertDismiss, alertIconSvg, type AlertVariants } from "./alert.ts";

/**
 * Toast: Wrapper that stacks elements in a page corner.
 *
 * Purpose: Feedback & system status · Kind: primitive (renders Alerts)
 * Docs: https://daisyui.com/components/toast/
 *
 * daisyUI defaults to `toast-end toast-bottom`.
 */
/**
 * Toasts float above everything, so each one is liquid glass (src/styles/theme.css) with its
 * status shown by the icon's colour rather than a solid fill.
 */
export const toast = rcva(
  "toast z-50 [&>.alert]:liquid-glass [&>.alert]:shadow-elevation-3 [&>.alert]:border-transparent [&>.alert]:text-on-surface [&>.alert>svg]:text-(--alert-color)",
  {
    variants: {
      /** Horizontal placement. */
      align: {
        start: "toast-start",
        center: "toast-center",
        end: "toast-end",
      },
      /** Vertical placement. */
      position: {
        top: "toast-top",
        middle: "toast-middle",
        bottom: "toast-bottom",
      },
    },
  },
);

export type ToastVariants = VariantProps<typeof toast>;

export interface ToastOptions {
  color?: AlertVariants["color"];
  variant?: AlertVariants["variant"];
  /** Auto-dismiss after this many ms. 0 keeps it until dismissed. Default 4000. */
  timeout?: number;
  /** Show a close button. Default true when `timeout` is 0. */
  dismissible?: boolean;
  /** Show the default status icon. Default true. */
  icon?: boolean;
}

export interface ToastMessage extends ToastOptions {
  id: number;
  message: Renderable;
}

/**
 * @example
 * <ui-toast id="toaster" align="end" position="top"></ui-toast>
 * document.querySelector("ui-toast")!.push("Message sent.", { color: "success" });
 *
 * Authored children (e.g. static `alert` markup) are rendered above pushed toasts.
 * Fires `ui-close` with `{ id }` when a toast is removed.
 */
@customElement("ui-toast")
export class UiToast extends LightElement {
  @property() align: ToastVariants["align"];
  @property() position: ToastVariants["position"];
  /** Maximum toasts shown at once; oldest are dropped first. 0 = unlimited. */
  @property({ type: Number }) max = 5;

  @state() private _messages: ToastMessage[] = [];
  private _next = 0;
  private _timers = new Map<number, ReturnType<typeof setTimeout>>();

  /** Show a toast. Returns its id, which can be passed to `dismiss`. */
  push(message: Renderable, options: ToastOptions = {}): number {
    const id = ++this._next;
    const timeout = options.timeout ?? 4000;
    let list = [...this._messages, { id, message, ...options, timeout }];
    if (this.max > 0 && list.length > this.max) {
      list.slice(0, list.length - this.max).forEach((m) => this._clearTimer(m.id));
      list = list.slice(-this.max);
    }
    this._messages = list;
    if (timeout > 0)
      this._timers.set(
        id,
        setTimeout(() => this.dismiss(id), timeout),
      );
    return id;
  }

  /** Remove one toast. */
  dismiss(id: number) {
    this._clearTimer(id);
    if (!this._messages.some((m) => m.id === id)) return;
    this._messages = this._messages.filter((m) => m.id !== id);
    this.dispatchEvent(new CustomEvent("ui-close", { detail: { id }, bubbles: true }));
  }

  /** Remove every pushed toast. */
  clear() {
    [...this._messages].forEach((m) => this.dismiss(m.id));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._timers.forEach((t) => clearTimeout(t));
    this._timers.clear();
  }

  private _clearTimer(id: number) {
    clearTimeout(this._timers.get(id));
    this._timers.delete(id);
  }

  render() {
    return html`<div
      class=${toast({ align: this.align, position: this.position })}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      ${this.content}
      ${repeat(
        this._messages,
        (m) => m.id,
        (m) =>
          html`<div role="status" class=${alert({ color: m.color, variant: m.variant })}>
            ${m.icon === false ? nothing : alertIconSvg(m.color)}
            <span>${m.message}</span>
            ${
              (m.dismissible ?? m.timeout === 0)
                ? html`<button
                    type="button"
                    class=${alertDismiss()}
                    aria-label="Dismiss"
                    @click=${() => this.dismiss(m.id)}
                  >
                    ✕
                  </button>`
                : nothing
            }
          </div>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-toast": UiToast;
  }
}
