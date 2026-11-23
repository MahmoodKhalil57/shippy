import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { MINUTE_MS, timeLeft } from "../../base/countdown.ts";
import { m } from "../../../i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";
import { inlineRow, row, rowLine, stack, text } from "../layout/algebra.ts";

/**
 * Countdown: deadlines, soonest first, each with the time left in words and a bar of its run
 * draining as it goes, live.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The rules it follows:
 * - **One measure, one hue:** every bar is `chart-1` on the highest container colour; a deadline
 *   that has passed reads in the error tone with an icon ("overdue 5 h"), so status is never colour
 *   alone, and its track turns `error-container`.
 * - **Words before bars:** the time left is whole units rounded down ("2 h 14 min left", "3 d left";
 *   `timeLeft`, src/components/base/countdown.ts, proved by tests/countdown.test.ts); text stays in
 *   text colours.
 * - **The bar is the run:** from `from` (when its clock started) to `due`; without `from`, the
 *   longest wait in the list is a full bar, so the bars compare.
 * - **Alive, with no timers:** each bar drains by a CSS transition (from `@starting-style`) whose
 *   duration is exactly the time left, linear, so it reaches empty at the deadline; the words are
 *   read again each minute, on the `animationiteration` of a hidden, minute-long infinite animation
 *   aligned to the clock's minute. The drain isn't an entrance, so it isn't queued; with Reduce
 *   motion the bar doesn't move and shows the share left, re-read each minute.
 * - A list for assistive tech (`label` names it); a deadline passing is announced (a live region).
 *   A row with `href` is a link.
 *
 * @example <ui-countdown label="Due next" now="2026-11-17T09:00:00Z" .items=${[{ label: "Quote Q-142", due: "2026-11-17T17:00:00Z", from: "2026-11-14T09:00:00Z", href: "#/quotes/142" }]}></ui-countdown>
 */
export const countdown = rcva(`${stack} relative w-full gap-1`);
export const countdownList = rcva(`${stack} gap-1`);
export const countdownItem = rcva(`${stack} gap-1 rounded-field px-1 py-1`, {
  variants: { link: { true: "cursor-pointer hover:underline", false: "" } },
});
export const countdownHead = rcva(`${row} items-baseline gap-x-2`);
export const countdownLabel = rcva(`${rowLine} text-body-md text-on-surface`);
export const countdownLeft = rcva(`${inlineRow} ${text.label} items-center gap-1 text-label-lg tabular-nums`, {
  variants: { overdue: { true: "text-error-ink", false: "text-on-surface-variant" } },
});
export const countdownSupporting = rcva(`${text.line} text-body-sm text-on-surface-variant`);
export const countdownTrack = rcva("h-1 w-full overflow-hidden [--clips:bar] rounded-full", {
  variants: { overdue: { true: "bg-error-container", false: "bg-surface-container-highest" } },
});
/** The part of the run left: `--left` wide as it's drawn, drained to nothing over `--drain`. */
export const countdownFill = rcva(
  "block h-full w-0 max-w-full rounded-full bg-chart-1 starting:w-(--left) [transition:width_var(--drain)_linear] motion-reduce:w-(--left) motion-reduce:[transition:none]",
);
/** Never seen: its minute-long loop's `animationiteration` re-reads the time left. */
export const countdownTick = rcva(
  "pointer-events-none invisible absolute size-0 [animation:m3-pulse_var(--tick)_linear_infinite]",
);
export const countdownSr = rcva("sr-only");

export interface CountdownItem {
  label: string;
  /** When it's due (ISO). */
  due: string;
  /** When its clock started (ISO), for the bar. */
  from?: string;
  supporting?: string;
  href?: string;
}

/**
 * @example <ui-countdown label="Due next" .items=${[{ label: "Quote Q-142", due: "2026-11-17T17:00:00Z" }]}></ui-countdown>
 */
@customElement("ui-countdown")
export class UiCountdown extends LightElement {
  @property({ attribute: false }) items: CountdownItem[] = [];
  /** The moment to count from (ISO; a demo's fixed "today"); it runs on from there. Left out, the clock. */
  @property() now?: string;
  /** The whole list, for screen readers ("Due next"). */
  @property() label = "";
  /** Bumped each minute: the words are read again. */
  @state() private _tick = 0;
  /** What was last announced ("Quote Q-142 is overdue"). */
  @state() private _said = "";
  /** Added to the real clock so it reads `now` at the moment `now` was given. */
  #offset = 0;
  /** Bumped when the list or the start moment change: each bar is drawn again from its share. */
  #epoch = 0;
  /** Without `from`, a full bar is this long (the longest wait when the list was given). */
  #span = 0;
  #overdue = new Set<string>();
  /** The minute loop's start, aligned to the clock's minute when it was (re)drawn. */
  #tickDelay = 0;

  #clock() {
    return Date.now() + this.#offset;
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has("now")) {
      const at = this.now ? Date.parse(this.now) : Number.NaN;
      this.#offset = Number.isFinite(at) ? at - Date.now() : 0;
    }
    if (changed.has("now") || changed.has("items")) {
      this.#epoch++;
      const t = this.#clock();
      this.#tickDelay = -(t % MINUTE_MS);
      this.#span = Math.max(0, ...this.items.map((x) => Date.parse(x.due) - t).filter(Number.isFinite));
      this.#overdue = new Set(this.items.filter((x) => Date.parse(x.due) < t).map((x) => x.due + x.label));
      this._said = "";
    }
  }

  #onTick = () => {
    const t = this.#clock();
    const passed = this.items.filter((x) => Date.parse(x.due) < t && !this.#overdue.has(x.due + x.label));
    for (const x of passed) this.#overdue.add(x.due + x.label);
    if (passed.length) this._said = passed.map((x) => m.countdown_overdue({ what: x.label })).join(" ");
    this._tick++;
  };

  render() {
    const t = this.#clock();
    const rows = this.items
      .map((x) => ({ x, due: Date.parse(x.due), from: x.from ? Date.parse(x.from) : Number.NaN }))
      .filter((r) => Number.isFinite(r.due))
      .sort((a, b) => a.due - b.due);
    return html`<div class=${countdown()} data-tick=${this._tick}>
      ${keyed(
        this.#epoch,
        html`<span
          class=${countdownTick()}
          aria-hidden="true"
          style=${styleMap({ "--tick": `${MINUTE_MS}ms`, "animation-delay": `${this.#tickDelay}ms` })}
          @animationiteration=${this.#onTick}
        ></span>`,
      )}
      <ul class=${countdownList()} aria-label=${this.label || nothing}>
        ${rows.map(({ x, due, from }) => {
          const left = timeLeft(due, t, Number.isFinite(from) ? from : due - this.#span);
          const body = html`<span class=${countdownHead()}>
              <span class=${countdownLabel()}>${x.label}</span>
              <span class=${countdownLeft({ overdue: left.overdue })}
                >${left.overdue ? iconSvg("warning", { size: "sm" }) : nothing}${left.text}</span
              >
            </span>
            ${x.supporting ? html`<span class=${countdownSupporting()}>${x.supporting}</span>` : nothing}
            <span class=${countdownTrack({ overdue: left.overdue })} aria-hidden="true">
              ${
                left.overdue
                  ? nothing
                  : keyed(
                      this.#epoch,
                      html`<span
                        class=${countdownFill()}
                        style=${styleMap({
                          "--left": `${left.share * 100}%`,
                          "--drain": `${Math.max(0, due - t)}ms`,
                        })}
                      ></span>`,
                    )
              }
            </span>`;
          return html`<li>
            ${
              x.href
                ? html`<a class=${countdownItem({ link: true })} href=${x.href}>${body}</a>`
                : html`<div class=${countdownItem({ link: false })}>${body}</div>`
            }
          </li>`;
        })}
      </ul>
      <p class=${countdownSr()} aria-live="polite">${this._said}</p>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-countdown": UiCountdown;
  }
}
