import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { monthWeeks, readMonth, weekdayOrder, type WeekStart } from "../../base/month.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, grid, row, rowLine, stack, text } from "../layout/algebra.ts";

/**
 * Month: a month's calendar with what's due each day: a dot a thing, and the day chosen listing
 * its things under the grid.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The rules it follows:
 * - **A week a row** (`grid.month`), from `week-start` (0 Sunday, 1 Monday; the weeks from
 *   src/components/base/month.ts, proved for every month of 2024–2030 by tests/month.test.ts),
 *   the days outside the month blank, the weekdays named above.
 * - **Dots, not words, in the grid:** up to three a day, in the event's tone (`warning`, `error`,
 *   `success`; `neutral` in the variant ink) or else `chart-1`, then "+N"; the words are in the
 *   list under it, so colour is never alone. Today is ringed in `primary`; the chosen day is
 *   `primary-container`.
 * - **Alive:** the days come in a week at a time as it enters (`cell-in`, theme.css; ambient
 *   motion, none with Reduce motion); a day with something on it rises a level when pointed at.
 *   A day is a button: click it, or move with the arrow keys (one roving tab stop; ←→ a day, ↑↓ a
 *   week, Home / End the month's ends) and press Enter, and its things are listed under the grid,
 *   as links where they have `href`. The list is a live region; the first choice is today, or the
 *   first day with something on it.
 * - Each day's button says its date and how many things are due; `label` names the whole.
 *
 * @example <ui-month label="Due in November" month="2026-11" today="2026-11-17" .events=${[{ date: "2026-11-20", label: "Quote Q-142", tone: "warning", href: "#/quotes/142" }]}></ui-month>
 */
export const month = rcva(`${stack} w-full gap-2`);
export const monthGrid = rcva(`${grid.month}`);
export const monthWeekday = rcva(`${text.line} pb-1 text-center text-label-sm text-on-surface-variant`);
export const monthDay = rcva(
  `${stack} touch-target state-layer relative min-h-10 items-center gap-0.5 overflow-hidden rounded-sm py-1 text-label-md tabular-nums outline-none [animation:cell-in_var(--duration-medium2)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(var(--c)*var(--duration-short1))] focus-visible:outline-2 focus-visible:outline-primary motion-reduce:[animation:none]`,
  {
    variants: {
      chosen: { true: "bg-primary-container text-on-primary-container", false: "text-on-surface" },
      today: { true: "ring-2 ring-inset ring-primary", false: "" },
      busy: {
        true: "cursor-pointer [transition:box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:shadow-elevation-1",
        false: "",
      },
    },
  },
);
export const monthDots = rcva(`${row} min-h-2 items-center justify-center gap-0.5`);
export const monthDot = rcva(`${fixed["2"]} rounded-full`, {
  variants: {
    tone: {
      none: "bg-chart-1",
      neutral: "bg-on-surface-variant",
      warning: "bg-warning",
      error: "bg-error",
      success: "bg-success",
    },
  },
});
export const monthMore = rcva(`${text.label} text-label-sm leading-none text-on-surface-variant`);
export const monthAgenda = rcva(`${stack} gap-1`);
export const monthAgendaHead = rcva(`${text.label} text-title-sm text-on-surface`);
export const monthAgendaItem = rcva(
  `${row} ${text.label} items-center gap-2 rounded-field px-1 py-0.5 text-body-md text-on-surface outline-none focus-visible:outline-2 focus-visible:outline-primary`,
  { variants: { link: { true: "cursor-pointer hover:underline", false: "" } } },
);
export const monthAgendaLabel = rcva(`${rowLine}`);
export const monthEmpty = rcva(`${text.label} text-body-sm text-on-surface-variant`);

export type MonthTone = "neutral" | "warning" | "error" | "success";

export interface MonthEvent {
  /** The day (YYYY-MM-DD). */
  date: string;
  label: string;
  href?: string;
  tone?: MonthTone;
}

/** Dots shown in a day before "+N". */
const DOTS = 3;

/**
 * @example <ui-month label="Due in November" month="2026-11" today="2026-11-17" week-start="1" .events=${events}></ui-month>
 */
@customElement("ui-month")
export class UiMonth extends LightElement {
  /** The month shown ("2026-11"). */
  @property() month = "";
  /** Today ("2026-11-17"), ringed; left out, none. */
  @property() today?: string;
  @property({ attribute: false }) events: MonthEvent[] = [];
  /** The whole, for screen readers ("Due in November"). */
  @property() label = "";
  /** The week's first day: 0 Sunday, 1 Monday. */
  @property({ attribute: "week-start", type: Number }) weekStart: WeekStart = 0;
  /** The day chosen (its things listed), 0 for none. */
  @state() private _chosen = 0;
  /** The day holding the tab stop. */
  @state() private _focus = 1;
  #revealed = false;

  #days(): Map<number, MonthEvent[]> {
    const byDay = new Map<number, MonthEvent[]>();
    for (const e of this.events) {
      if (e.date.slice(0, 7) !== this.month) continue;
      const d = Number(e.date.slice(8, 10));
      if (!d) continue;
      byDay.set(d, [...(byDay.get(d) ?? []), e]);
    }
    return byDay;
  }

  #todayDay(): number {
    return this.today?.slice(0, 7) === this.month ? Number(this.today.slice(8, 10)) || 0 : 0;
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has("month") || changed.has("today") || (changed.has("events") && !this._chosen)) {
      const days = readMonth(this.month)?.days ?? 0;
      const first = [...this.#days().keys()].sort((a, b) => a - b)[0] ?? 0;
      const today = this.#todayDay();
      this._chosen = today || first;
      this._focus = Math.min(days, Math.max(1, this._chosen || 1));
    }
  }

  protected updated() {
    if (!this.#revealed && this.month) {
      this.#revealed = true;
      const enter = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "cell-in",
      );
      void motion.add(enter, "ambient", this);
    }
  }

  #name(year: number, m: number, d: number, style: "long" | "short") {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      day: "numeric",
      month: style,
      timeZone: "UTC",
    }).format(Date.UTC(year, m - 1, d));
  }

  #key = async (e: KeyboardEvent) => {
    const days = readMonth(this.month)?.days ?? 0;
    if (!days) return;
    const rtl = getComputedStyle(this).direction === "rtl";
    const step: Record<string, number> = {
      ArrowLeft: rtl ? 1 : -1,
      ArrowRight: rtl ? -1 : 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    let next: number;
    if (e.key in step) next = this._focus + step[e.key]!;
    else if (e.key === "Home") next = 1;
    else if (e.key === "End") next = days;
    else return;
    e.preventDefault();
    this._focus = Math.min(days, Math.max(1, next));
    await this.updateComplete;
    this.querySelector<HTMLButtonElement>(`button[data-day="${this._focus}"]`)?.focus();
  };

  render() {
    const m = readMonth(this.month);
    if (!m) return nothing;
    const byDay = this.#days();
    const today = this.#todayDay();
    const weeks = monthWeeks(m.year, m.month, this.weekStart === 1 ? 1 : 0);
    const names = new Intl.DateTimeFormat(undefined, { weekday: "short", timeZone: "UTC" });
    // 4 Jan 1970 was a Sunday: weekday w is that day + w.
    const weekday = (w: number) => names.format(Date.UTC(1970, 0, 4 + w));
    const chosen = byDay.get(this._chosen) ?? [];
    return html`<div class=${month()}>
      <div class=${monthGrid()} role="group" aria-label=${this.label || nothing} @keydown=${this.#key}>
        ${weekdayOrder(this.weekStart === 1 ? 1 : 0).map(
          (w) => html`<span class=${monthWeekday()} aria-hidden="true">${weekday(w)}</span>`,
        )}
        ${weeks.flatMap((week, r) =>
          week.map((d) => {
            if (d === null) return html`<span aria-hidden="true"></span>`;
            const on = byDay.get(d) ?? [];
            const name = `${this.#name(m.year, m.month, d, "long")}${on.length ? `, ${on.length} due` : ""}`;
            return html`<button
              type="button"
              class=${monthDay({ chosen: d === this._chosen, today: d === today, busy: on.length > 0 })}
              style=${styleMap({ "--c": String(r) })}
              data-day=${d}
              tabindex=${d === this._focus ? 0 : -1}
              aria-label=${name}
              aria-pressed=${d === this._chosen ? "true" : "false"}
              aria-current=${d === today ? "date" : nothing}
              @click=${() => {
                this._chosen = d;
                this._focus = d;
              }}
            >
              <span aria-hidden="true">${d}</span>
              <span class=${monthDots()} aria-hidden="true">
                ${on.slice(0, DOTS).map((e) => html`<span class=${monthDot({ tone: e.tone ?? "none" })}></span>`)}
                ${on.length > DOTS ? html`<span class=${monthMore()}>+${on.length - DOTS}</span>` : nothing}
              </span>
            </button>`;
          }),
        )}
      </div>
      <div class=${monthAgenda()} aria-live="polite">
        ${
          this._chosen
            ? html`<p class=${monthAgendaHead()}>${this.#name(m.year, m.month, this._chosen, "short")}</p>
                ${
                  chosen.length
                    ? html`<ul class=${monthAgenda()}>
                        ${chosen.map((e) => {
                          const body = html`<span class=${monthDot({ tone: e.tone ?? "none" })}></span>
                            <span class=${monthAgendaLabel()}>${e.label}</span>`;
                          return html`<li>
                            ${
                              e.href
                                ? html`<a class=${monthAgendaItem({ link: true })} href=${e.href}>${body}</a>`
                                : html`<span class=${monthAgendaItem({ link: false })}>${body}</span>`
                            }
                          </li>`;
                        })}
                      </ul>`
                    : html`<p class=${monthEmpty()}>Nothing due</p>`
                }`
            : nothing
        }
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-month": UiMonth;
  }
}
