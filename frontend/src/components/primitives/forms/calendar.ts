import "cally";
import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Calendar: Styles for different calendar libraries.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/calendar/
 *
 * daisyUI ships no calendar logic, only styles for third-party calendars:
 * - `cally` (default): the Cally web component (`<calendar-date>`), registered
 *   by the `import "cally"` above; this element renders Cally's markup.
 * - `vc`: Vanilla Calendar Pro. Rendered as an empty `div.vc`; call
 *   `new Calendar(el.calendarRoot).init()` yourself.
 * - `react-day-picker`: React only; the recipe is exported for completeness.
 *
 * `framed` is responsive (e.g. `framed="md"`).
 */
export const calendar = rcva("", {
  variants: {
    library: {
      cally: "cally",
      "react-day-picker": "react-day-picker",
      vc: "vc",
    },
    /** Card look from the docs' inline example. */
    framed: { true: "bg-base-100 border border-base-300 shadow-lg rounded-box" },
  },
  defaultVariants: { library: "cally" },
});

/** Popover panel holding the calendar in date-picker mode. */
export const calendarPopover = rcva("dropdown liquid-glass rounded-box");

/** Date-picker trigger button (styled like an input, as in the docs). */
export const calendarTrigger = rcva("input");

/** The month navigation buttons' icons (cally's `previous` / `next` slots). */
export const calendarNavIcon = rcva("inline-grid place-items-center");

export type CalendarVariants = VariantProps<typeof calendar>;

const prevIcon = html`<span slot="previous" class=${calendarNavIcon()}
  >${iconSvg("chevron-left", { size: "sm" }, { label: "Previous" })}</span
>`;
const nextIcon = html`<span slot="next" class=${calendarNavIcon()}
  >${iconSvg("chevron-right", { size: "sm" }, { label: "Next" })}</span
>`;

/**
 * @example <ui-calendar value="2025-06-01" framed></ui-calendar>
 * @example <ui-calendar picker name="due" placeholder="Pick a date"></ui-calendar>
 *
 * `ui-change` carries `{ value }` (ISO `YYYY-MM-DD`). In `picker` mode a hidden
 * input named `name` carries the value into the surrounding form.
 */
@customElement("ui-calendar")
export class UiCalendar extends LightElement {
  @property() library: CalendarVariants["library"] = "cally";
  @property({ converter: responsiveBoolean }) framed: Responsive<boolean> = false;
  /** Show a button that opens the calendar in a popover (date picker). */
  @property({ type: Boolean }) picker = false;
  @property() placeholder = "Pick a date";
  @property() value = "";
  @property() min?: string;
  @property() max?: string;
  @property() locale?: string;
  /** 0 = Sunday … 6 = Saturday. */
  @property({ type: Number, attribute: "first-day-of-week" }) firstDayOfWeek?: number;
  /** Number of months shown side by side. */
  @property({ type: Number }) months = 1;
  @property() name?: string;

  /** The element the calendar library is mounted on (`div.vc` for Vanilla Calendar Pro). */
  @query("[data-calendar-root]") calendarRoot!: HTMLElement;

  private _id = uid("calendar");

  private _onChange(e: Event) {
    this.value = (e.target as HTMLElement & { value: string }).value;
    if (this.picker) this.querySelector<HTMLElement>("[popover]")?.hidePopover();
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: this.value }, bubbles: true }));
  }

  private _calendar(cls: string) {
    if (this.library !== "cally") {
      return html`<div data-calendar-root class=${cls}>${this.content}</div>`;
    }
    return html`<calendar-date
      data-calendar-root
      class=${cls}
      .value=${this.value}
      min=${ifDefined(this.min)}
      max=${ifDefined(this.max)}
      locale=${ifDefined(this.locale)}
      first-day-of-week=${ifDefined(this.firstDayOfWeek)}
      months=${this.months > 1 ? this.months : nothing}
      @change=${this._onChange}
    >
      ${prevIcon}${nextIcon}
      ${Array.from(
        { length: this.months },
        (_, i) => html`<calendar-month offset=${i > 0 ? i : nothing}></calendar-month>`,
      )}
    </calendar-date>`;
  }

  render() {
    if (!this.picker) {
      return this._calendar(calendar({ library: this.library, framed: this.framed }));
    }
    const popover = `${this._id}-popover`;
    return html`
      <button type="button" popovertarget=${popover} class=${calendarTrigger()} style=${`anchor-name:--${this._id}`}>
        ${this.value || this.placeholder}
      </button>
      <div popover id=${popover} class=${calendarPopover()} style=${`position-anchor:--${this._id}`}>
        ${this._calendar(calendar({ library: this.library }))}
      </div>
      ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-calendar": UiCalendar;
  }
}
