import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inlineRow, row, stack, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Date input: a day (or a day and a time), with the days people mean most a tap away, and the
 * date said back in words.
 *
 * Purpose: Forms & input · Kind: primitive
 *
 * The browser's own date field (its picker, its keyboard entry), quick picks under it (Today,
 * Tomorrow, In a week, Clear) as chips, and a line saying what the date is to today: "Tue 24 Nov ·
 * in 7 days", "3 days ago", in the warning ink when a date that should come (`future`) has passed.
 * Today is `today` (an ISO date; the app's demo clock), else the device's. Fires `ui-change`
 * { value } with the field's own string (`YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with `time`).
 */
export const dateInput = rcva(`${stack} gap-2`);
export const dateInputField = rcva("input w-full tabular-nums");
export const dateInputPicks = rcva(`${row} items-center gap-1.5`);
export const dateInputPick = rcva(
  `${inlineRow} touch-target state-layer cursor-pointer items-center gap-1 rounded-full border border-outline-variant px-3 py-1 text-label-md text-on-surface-variant [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),border-color_var(--duration-effects-fast)_var(--ease-effects-fast)] disabled:cursor-default disabled:opacity-40`,
  { variants: { on: { true: "border-transparent bg-secondary-container text-on-secondary-container" } } },
);
export const dateInputSaid = rcva(
  `${row} ${text.label} items-center gap-1.5 text-label-md [transition:color_var(--duration-effects)_var(--ease-effects)]`,
  { variants: { late: { true: "text-warning-ink", false: "text-on-surface-variant" } } },
);

const DAY = 86_400_000;
const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const pad = (n: number) => String(n).padStart(2, "0");

/** Whole days from `today` to `day` (both `YYYY-MM-DD`), negative in the past. */
export function daysBetween(today: string, day: string): number {
  return Math.round(
    (Date.parse(`${day.slice(0, 10)}T00:00:00Z`) - Date.parse(`${today.slice(0, 10)}T00:00:00Z`)) / DAY,
  );
}

/** "today", "tomorrow", "in 3 days", "yesterday", "5 days ago". */
export function relativeDay(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

/**
 * @example <ui-date-input label="Quote deadline" .value=${"2026-11-18"} today="2026-11-17" future></ui-date-input>
 */
@customElement("ui-date-input")
export class UiDateInput extends LightElement {
  /** `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with `time`. */
  @property() value = "";
  /** A day and a time. */
  @property({ type: Boolean }) time = false;
  /** Today (`YYYY-MM-DD`); else the device's. */
  @property() today = "";
  /** It should be ahead of today (a deadline, an arrival): a past date says so. */
  @property({ type: Boolean }) future = false;
  @property() min?: string;
  @property() max?: string;
  @property() label = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ attribute: "input-id" }) inputId?: string;

  private _set(v: string) {
    if (v === this.value) return;
    this.value = v;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: v }, bubbles: true }));
  }

  /** A quick pick: `days` from today, keeping the time already set (else 09:00). */
  private _pick(days: number) {
    const base = this.today || isoDay(new Date());
    const day = isoDay(new Date(Date.parse(`${base}T00:00:00Z`) + days * DAY));
    const t = this.time ? `T${this.value.slice(11, 16) || "09:00"}` : "";
    this._set(`${day}${t}`);
  }

  render() {
    const today = this.today || isoDay(new Date());
    const day = this.value.slice(0, 10);
    const days = day ? daysBetween(today, day) : undefined;
    const d = day ? new Date(`${day}T00:00:00Z`) : undefined;
    const said = d
      ? `${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}${
          this.time && this.value.length > 10 ? ` ${this.value.slice(11, 16)}` : ""
        } · ${relativeDay(days!)}`
      : "";
    const picks: [string, number][] = [
      ["Today", 0],
      ["Tomorrow", 1],
      ["In a week", 7],
    ];
    return html`<div class=${dateInput()}>
      <input
        id=${this.inputId ?? nothing}
        class=${dateInputField()}
        type=${this.time ? "datetime-local" : "date"}
        aria-label=${this.label || nothing}
        .value=${live(this.value)}
        min=${this.min ?? nothing}
        max=${this.max ?? nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        @input=${(e: Event) => this._set((e.target as HTMLInputElement).value)}
      />
      ${
        this.disabled
          ? nothing
          : html`<div
              class=${dateInputPicks()}
              role="group"
              aria-label=${`Quick picks${this.label ? ` for ${this.label}` : ""}`}
            >
              ${picks.map(
                ([name, n]) =>
                  html`<button type="button" class=${dateInputPick({ on: days === n })} @click=${() => this._pick(n)}>
                    ${name}
                  </button>`,
              )}
              ${
                this.value && !this.required
                  ? html`<button type="button" class=${dateInputPick()} @click=${() => this._set("")}>
                      ${iconSvg("x", { size: "xs" })}Clear
                    </button>`
                  : nothing
              }
            </div>`
      }
      ${
        said
          ? html`<p class=${dateInputSaid({ late: this.future && days! < 0 })}>
              ${iconSvg(this.future && days! < 0 ? "warning" : "calendar", { size: "xs" })}${said}
            </p>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-date-input": UiDateInput;
  }
}

export { pad as _pad };
