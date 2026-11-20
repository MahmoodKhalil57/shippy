import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { fixed, inset, padEnd, padStart, row, rowFill, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Snackbar: a brief message about something the app just did ("Saved", "Message sent"), at the
 * bottom centre of the screen (M3 snackbar).
 *
 * Purpose: Feedback & system status · Kind: primitive
 *
 * The rules, each from M3's snackbar page (material-web/.m3-specs/pages/components/snackbar.md):
 * - **One at a time, never stacked** ("Only one snackbar may be displayed at a time"; "Don't stack
 *   snackbars on top of one another"). A newer message takes the place of the one on screen at
 *   once ("a snackbar with updated information can immediately replace an outdated snackbar"), so
 *   what just happened is never waiting behind what happened before.
 * - **One action** ("A snackbar can contain a single action"), a text button in the primary ink
 *   ("text buttons should display colored text"; "Don't use a filled or elevated button").
 *   "To allow users to amend choices, display an 'Undo' action": an action marked `undo` also
 *   answers Ctrl / ⌘ + Z (HIG Undo and redo: people expect the standard shortcut) while the
 *   person isn't typing in a field.
 * - **How long it stays.** With an action, or an error: until it's used, dismissed or replaced
 *   ("Snackbars with actions should remain on the screen until the user takes an action on the
 *   snackbar, or dismisses it"; "Actionable snackbars shouldn't auto-dismiss"; WCAG 2.2.1), so it
 *   shows no countdown and has a close button. Without one: 4 to 10 seconds by its length
 *   ("common acceptable durations are 4–10 seconds"; "long enough to read the information"),
 *   and the time starts again while the pointer or the focus is on it.
 * - **Focus:** it never takes it ("announce the message but don't move focus"); Alt + G moves
 *   focus to its action (M3's own example of the shortcut the web needs), Escape dismisses it
 *   while focus is inside.
 * - **A tick for "it worked", nothing else.** M3 says to "avoid adding icons to snackbars"; the
 *   one exception here is the success tick (and the error mark), so the result reads without
 *   reading the sentence. No other icon is offered. The mark carries the tone; the words stay
 *   in the surface's ink ("The text label shouldn't share the same color as the text button").
 *
 * Floating, so it's glass at elevation +3, as wide as its message (at most 36rem, or the window).
 * In a window too narrow to pass beside the FAB (under 768px) it sits above it, 8dp clear
 * ("Snackbars should appear above FABs"; "Don't place a snackbar in front of a FAB").
 * It enters upwards from the bottom edge on M3's emphasized-decelerate and leaves, quicker, on
 * emphasized-accelerate. Status messages are announced politely; errors assertively. Put one
 * `<ui-snackbar>` near the app root and call `push`.
 */
export const snackbar = rcva(
  `${row} ${inset["4"]} pointer-events-none fixed inset-x-0 top-auto bottom-[calc(var(--space-900)+var(--space-100))] z-[65] m-0 justify-center overflow-visible border-0 bg-transparent py-0 md:bottom-10`,
);
export const snackbarBody = rcva(
  `${row} ${padStart["4"]} ${text.label} liquid-glass shadow-elevation-3 min-h-12 w-fit max-w-[min(36rem,100%)] items-center gap-2 rounded-xl py-1.5 pe-1.5 text-body-md text-on-surface`,
  {
    variants: {
      /** On screen, or on its way out (kept only until its exit has played). */
      leaving: {
        false:
          "pointer-events-auto starting:translate-y-4 starting:opacity-0 [transition:opacity_var(--duration-short4)_var(--ease-emphasized-decelerate),translate_var(--duration-medium2)_var(--ease-emphasized-decelerate)] motion-reduce:starting:translate-y-0",
        true: "pointer-events-none translate-y-2 opacity-0 [transition:opacity_var(--duration-short3)_var(--ease-emphasized-accelerate),translate_var(--duration-short4)_var(--ease-emphasized-accelerate)] motion-reduce:translate-y-0",
      },
    },
    defaultVariants: { leaving: false },
  },
);
/** The result's mark: a tick (it worked) or the error mark. */
export const snackbarIcon = rcva(fixed["5"], {
  variants: { tone: { success: "text-success-ink", error: "text-error-ink" } },
});
/** The message; when nothing follows it (no action, no dismiss button) it keeps the pill's end margin itself. */
export const snackbarText = rcva(`${rowFill} py-1.5`, { variants: { last: { true: padEnd["3"], false: "" } } });
export const snackbarAction = rcva(
  "btn btn-ghost btn-sm max-w-full state-layer touch-target rounded-full border-transparent bg-transparent text-primary-ink",
);

export interface SnackbarOptions {
  /**
   * One action ("Undo", "View"); the snackbar then stays until it's used, dismissed or replaced.
   * `undo` marks it as taking the last thing back: Ctrl / ⌘ + Z runs it too.
   */
  action?: { label: string; onClick: () => void; undo?: boolean };
  /** `success` adds the tick; `error` adds its mark, stays until dismissed and is announced assertively. */
  tone?: "neutral" | "success" | "error";
  /** Override the time on screen (ms); 0 stays until dismissed. Ignored with an action (M3). */
  timeout?: number;
}

interface Message extends SnackbarOptions {
  id: number;
  message: Renderable;
}

/** Reading time for a message with no action: 4s, a second more per 20 characters past 40, at most 10s. */
const readingTime = (message: Renderable) =>
  Math.min(
    10_000,
    4000 + Math.max(0, Math.ceil(((typeof message === "string" ? message.length : 0) - 40) / 20)) * 1000,
  );

/** How long a message stays (ms); 0 is until it's dismissed. */
const lifetime = (m: Message) =>
  m.action || m.tone === "error" ? 0 : m.timeout !== undefined ? m.timeout : readingTime(m.message);

const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * @example
 * <ui-snackbar></ui-snackbar>
 * document.querySelector("ui-snackbar")!.push("Message sent.", { tone: "success" });
 * document.querySelector("ui-snackbar")!.push("Line removed.", { action: { label: "Undo", onClick: undo, undo: true } });
 *
 * Fires `ui-close` with `{ id }` when a message goes.
 */
@customElement("ui-snackbar")
export class UiSnackbar extends LightElement {
  /** The message on screen. */
  @state() private _shown: Message | null = null;
  /** The one that was just dismissed, until its exit has played. */
  @state() private _leaving: Message | null = null;
  private _next = 0;
  private _timer?: ReturnType<typeof setTimeout>;

  /** Show a message, in place of the one on screen. Returns its id (for `dismiss`). */
  push(message: Renderable, options: SnackbarOptions = {}): number {
    const id = ++this._next;
    const before = this._shown;
    this._leaving = null;
    this._shown = { id, message, ...options };
    if (before) this.dispatchEvent(new CustomEvent("ui-close", { detail: { id: before.id }, bubbles: true }));
    this._arm();
    return id;
  }

  /** Dismiss the message on screen (or the one with this id, if it still is). */
  dismiss(id = this._shown?.id) {
    const m = this._shown;
    if (!m || m.id !== id) return;
    clearTimeout(this._timer);
    this._shown = null;
    this._leaving = m;
    this.dispatchEvent(new CustomEvent("ui-close", { detail: { id }, bubbles: true }));
  }

  private _arm() {
    clearTimeout(this._timer);
    const m = this._shown;
    const ms = m ? lifetime(m) : 0;
    if (m && ms > 0) this._timer = setTimeout(() => this.dismiss(m.id), ms);
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
      // In a field, the shortcut is the field's own undo.
      if (typing(e.target) || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      this._act(m);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
    clearTimeout(this._timer);
  }

  /** The message last raised to the top layer. */
  #raised = 0;

  /**
   * The message is drawn in the top layer (a manual popover), raised again for each new message:
   * a sheet or dialog opened before it would otherwise cover it and dim it with its scrim.
   */
  protected updated() {
    const box = this.querySelector<HTMLElement>("[data-snackbar]");
    if (!box || typeof box.showPopover !== "function") return;
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
      @pointerenter=${leaving ? undefined : () => clearTimeout(this._timer)}
      @pointerleave=${leaving ? undefined : () => this._arm()}
      @focusin=${leaving ? undefined : () => clearTimeout(this._timer)}
      @focusout=${leaving ? undefined : () => this._arm()}
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
              aria-label="Dismiss"
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
