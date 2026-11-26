import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import {
  fixed,
  floatingFit,
  floatingHeight,
  inset,
  padEnd,
  padStart,
  row,
  rowFill,
  text,
} from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { m as t } from "../../../lib/i18n/index.ts";

export const snackbar = rcva(
  `${row} ${inset["4"]} pointer-events-none fixed inset-x-0 top-auto bottom-[calc(var(--space-900)+var(--space-100))] z-[65] m-0 justify-center overflow-visible border-0 bg-transparent py-0 md:bottom-10`,
);
export const snackbarBody = rcva(
  `${row} ${padStart["4"]} ${text.label} liquid-glass shadow-elevation-3 min-h-(--tile-h) ${floatingFit["11In"]} ${floatingHeight.fit} items-center gap-2 rounded-xl py-1.5 pe-1.5 text-body-md text-on-surface`,
  {
    variants: {
      leaving: {
        false:
          "pointer-events-auto starting:translate-y-4 starting:opacity-0 [transition:opacity_var(--duration-short4)_var(--ease-emphasized-decelerate),translate_var(--duration-medium2)_var(--ease-emphasized-decelerate)] motion-reduce:starting:translate-y-0",
        true: "pointer-events-none translate-y-2 opacity-0 [transition:opacity_var(--duration-short3)_var(--ease-emphasized-accelerate),translate_var(--duration-short4)_var(--ease-emphasized-accelerate)] motion-reduce:translate-y-0",
      },
    },
    defaultVariants: { leaving: false },
  },
);
export const snackbarIcon = rcva(fixed["5"], {
  variants: { tone: { success: "text-success-ink", error: "text-error-ink" } },
});
export const snackbarText = rcva(`${rowFill} py-1.5`, { variants: { last: { true: padEnd["3"], false: "" } } });
export const snackbarAction = rcva(
  "btn btn-ghost btn-sm max-w-full state-layer touch-target rounded-full border-transparent bg-transparent text-primary-ink",
);

export interface SnackbarOptions {
  action?: { label: string; onClick: () => void; undo?: boolean };
  tone?: "neutral" | "success" | "error";
  timeout?: number;
}

interface Message extends SnackbarOptions {
  id: number;
  message: Renderable;
}

const readingTime = (message: Renderable) =>
  Math.min(
    10_000,
    4000 + Math.max(0, Math.ceil(((typeof message === "string" ? message.length : 0) - 40) / 20)) * 1000,
  );

const lifetime = (m: Message) =>
  m.action || m.tone === "error" ? 0 : m.timeout !== undefined ? m.timeout : readingTime(m.message);

const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

@customElement("ui-snackbar")
export class UiSnackbar extends LightElement {
  @state() private _shown: Message | null = null;
  @state() private _leaving: Message | null = null;
  private _next = 0;
  /** The dismissal timer: an effect-less Web Animation whose `finished` promise ends the message's lifetime. */
  #timer?: Animation;

  push(message: Renderable, options: SnackbarOptions = {}): number {
    const id = ++this._next;
    const before = this._shown;
    this._leaving = null;
    this._shown = { id, message, ...options };
    if (before) this.dispatchEvent(new CustomEvent("ui-close", { detail: { id: before.id }, bubbles: true }));
    this._arm(this._shown);
    return id;
  }

  dismiss(id = this._shown?.id) {
    const m = this._shown;
    if (!m || m.id !== id) return;
    this.#stop();
    this._shown = null;
    this._leaving = m;
    this.dispatchEvent(new CustomEvent("ui-close", { detail: { id }, bubbles: true }));
  }

  #stop = () => {
    this.#timer?.cancel();
    this.#timer = undefined;
  };

  private _arm(m: Message) {
    this.#stop();
    const ms = lifetime(m);
    if (ms <= 0 || !this.isConnected) return;
    const timer = this.animate([], { duration: ms });
    this.#timer = timer;
    timer.finished.then(
      () => this.#timer === timer && this.dismiss(m.id),
      () => undefined,
    );
  }

  private _act(m: Message) {
    this.dismiss(m.id);
    m.action?.onClick();
  }

  private _onKey = (e: KeyboardEvent) => {
    const m = this._shown;
    if (!m?.action || e.defaultPrevented) return;
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "g") {
      e.preventDefault();
      this.querySelector<HTMLButtonElement>("[data-action]")?.focus();
    } else if (m.action.undo && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "z") {
      if (typing(e.target) || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      this._act(m);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
    if (this._shown) {
      this._arm(this._shown);
      this.requestUpdate();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
    this.#stop();
  }

  #raised = 0;

  protected updated() {
    const box = this.querySelector<HTMLElement>("[data-snackbar]")!;
    const open = box.matches(":popover-open");
    if (!(this._shown ?? this._leaving)) {
      if (open) box.hidePopover();
      return;
    }
    if (this._shown && this._shown.id !== this.#raised) {
      this.#raised = this._shown.id;
      if (open) box.hidePopover();
      box.showPopover();
    } else if (!open) box.showPopover();
  }

  private _body(m: Message, leaving: boolean) {
    const tone = m.tone ?? "neutral";
    return html`<div
      class=${snackbarBody({ leaving })}
      ?inert=${leaving}
      @pointerenter=${leaving ? undefined : this.#stop}
      @pointerleave=${leaving ? undefined : () => this._arm(m)}
      @focusin=${leaving ? undefined : this.#stop}
      @focusout=${leaving ? undefined : () => this._arm(m)}
      @keydown=${(e: KeyboardEvent) => e.key === "Escape" && this.dismiss(m.id)}
      @transitionend=${leaving ? (e: Event) => e.target === e.currentTarget && (this._leaving = null) : undefined}
      @transitioncancel=${leaving ? (e: Event) => e.target === e.currentTarget && (this._leaving = null) : undefined}
    >
      ${
        tone === "neutral"
          ? nothing
          : iconSvg(tone === "success" ? "check" : "error", {}, { class: snackbarIcon({ tone }) })
      }
      <span class=${snackbarText({ last: !m.action && lifetime(m) !== 0 })}>${m.message}</span>
      ${
        m.action
          ? html`<button type="button" data-action class=${snackbarAction()} @click=${() => this._act(m)}>
              ${m.action.label}
            </button>`
          : nothing
      }
      ${
        lifetime(m) === 0
          ? html`<button
              type="button"
              class=${iconButton({ size: "xs" })}
              aria-label=${t.snackbar_dismiss()}
              @click=${() => this.dismiss(m.id)}
            >
              ${iconSvg("x", { size: "sm" })}
            </button>`
          : nothing
      }
    </div>`;
  }

  render() {
    const m = this._shown ?? this._leaving;
    return html`<div
      class=${snackbar()}
      popover="manual"
      data-snackbar
      aria-live=${m?.tone === "error" ? "assertive" : "polite"}
      role="status"
    >
      ${m ? keyed(m.id, this._body(m, m !== this._shown)) : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-snackbar": UiSnackbar;
  }
}
