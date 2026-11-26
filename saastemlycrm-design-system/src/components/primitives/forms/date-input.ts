import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { inlineRow, row, stack, text } from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { intl, m } from "../../../lib/i18n/index.ts";

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

export function daysBetween(today: string, day: string): number {
  return Math.round(
    (Date.parse(`${day.slice(0, 10)}T00:00:00Z`) - Date.parse(`${today.slice(0, 10)}T00:00:00Z`)) / DAY,
  );
}

export function relativeDay(days: number): string {
  return intl.relative({ numeric: "auto" }).format(days, "day");
}

@customElement("ui-date-input")
export class UiDateInput extends LightElement {
  @property() value = "";
  @property({ type: Boolean }) time = false;
  @property() today = "";
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
    const date = d ? intl.date({ weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(d) : "";
    const said = d
      ? this.time && this.value.length > 10
        ? m.date_input_said_time({ date, time: this.value.slice(11, 16), relative: relativeDay(days!) })
        : m.date_input_said({ date, relative: relativeDay(days!) })
      : "";
    const picks: [string, number][] = [
      [m.date_input_today(), 0],
      [m.date_input_tomorrow(), 1],
      [m.date_input_in_a_week(), 7],
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
              aria-label=${this.label ? m.date_input_picks_for({ label: this.label }) : m.date_input_picks()}
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
                      ${iconSvg("x", { size: "xs" })}${m.date_input_clear()}
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
