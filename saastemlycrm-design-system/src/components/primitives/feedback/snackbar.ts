import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Snackbar: a brief message about something the app just did ("Saved", "Message sent"), at the
 * bottom of the screen (M3 snackbar).
 *
 * Purpose: Feedback & system status · Kind: primitive
 *
 * One at a time (later ones wait their turn), no icons, never takes focus. Plain messages go
 * after 4 seconds. A message with an action ("Undo", "View") or an error stays until it's
 * dismissed, so it can be read and acted on (M3; WCAG 2.2.1). Floating, so it's glass at
 * elevation +3. Status messages are announced politely; errors assertively. Put one
 * `<ui-snackbar>` near the app root and call `push`.
 */
export const snackbar = rcva("pointer-events-none fixed inset-x-0 bottom-4 z-[65] flex justify-center px-4");
export const snackbarBody = rcva(
  "liquid-glass shadow-elevation-3 pointer-events-auto flex min-h-12 w-full max-w-[min(36rem,100%)] items-center gap-2 rounded-md py-1.5 ps-4 pe-1.5 text-body-md text-on-surface starting:translate-y-4 starting:opacity-0 [transition:opacity_var(--duration-short4)_var(--ease-emphasized-decelerate),translate_var(--duration-medium2)_var(--ease-emphasized-decelerate)] motion-reduce:translate-y-0",
  { variants: { tone: { neutral: "", error: "text-error-ink" } } },
);
export const snackbarText = rcva("min-w-0 flex-1 py-1.5");
export const snackbarAction = rcva(
  "btn btn-ghost btn-sm max-w-full state-layer touch-target border-transparent bg-transparent text-primary-ink",
);

export interface SnackbarOptions {
  /** One action ("Undo", "View"); the snackbar then stays until dismissed. */
  action?: { label: string; onClick: () => void };
  /** `error` keeps it until dismissed and announces it assertively. */
  tone?: "neutral" | "error";
  /** Override the time on screen (ms); 0 stays until dismissed. */
  timeout?: number;
}

interface Message extends SnackbarOptions {
  id: number;
  message: Renderable;
}

/**
 * @example
 * <ui-snackbar></ui-snackbar>
 * document.querySelector("ui-snackbar")!.push("Message sent.");
 * document.querySelector("ui-snackbar")!.push("Line removed.", { action: { label: "Undo", onClick: undo } });
 *
 * Fires `ui-close` with `{ id }` when a message goes.
 */
@customElement("ui-snackbar")
export class UiSnackbar extends LightElement {
  @state() private _queue: Message[] = [];
  private _next = 0;
  private _timer?: ReturnType<typeof setTimeout>;

  /** Queue a message. Returns its id (for `dismiss`). */
  push(message: Renderable, options: SnackbarOptions = {}): number {
    const id = ++this._next;
    this._queue = [...this._queue, { id, message, ...options }];
    if (this._queue.length === 1) this._arm();
    return id;
  }

  dismiss(id = this._queue[0]?.id) {
    if (id === undefined || !this._queue.some((m) => m.id === id)) return;
    const first = this._queue[0]?.id === id;
    this._queue = this._queue.filter((m) => m.id !== id);
    this.dispatchEvent(new CustomEvent("ui-close", { detail: { id }, bubbles: true }));
    if (first) this._arm();
  }

  private _arm() {
    clearTimeout(this._timer);
    const m = this._queue[0];
    if (!m) return;
    const timeout = m.timeout ?? (m.action || m.tone === "error" ? 0 : 4000);
    if (timeout > 0) this._timer = setTimeout(() => this.dismiss(m.id), timeout);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._timer);
  }

  render() {
    const m = this._queue[0];
    const persistent = !!m && (m.timeout ?? (m.action || m.tone === "error" ? 0 : 4000)) === 0;
    return html`<div class=${snackbar()} aria-live=${m?.tone === "error" ? "assertive" : "polite"} role="status">
      ${
        m
          ? html`<div class=${snackbarBody({ tone: m.tone ?? "neutral" })}>
              <span class=${snackbarText()}>${m.message}</span>
              ${
                m.action
                  ? html`<button
                      type="button"
                      class=${snackbarAction()}
                      @click=${() => {
                        m.action!.onClick();
                        this.dismiss(m.id);
                      }}
                    >
                      ${m.action.label}
                    </button>`
                  : nothing
              }
              ${
                persistent
                  ? html`<button
                      type="button"
                      class=${iconButton({ size: "xs" })}
                      aria-label="Dismiss"
                      @click=${() => this.dismiss(m.id)}
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
    "ui-snackbar": UiSnackbar;
  }
}
