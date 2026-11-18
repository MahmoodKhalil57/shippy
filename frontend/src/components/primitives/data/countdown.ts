import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Countdown: Transition effect when a number from 0 to 999 changes.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/countdown/
 *
 * Each number is a `<span style="--value:N">` inside `.countdown`; changing
 * `--value` animates the digits. `--digits` pads to a minimum digit count.
 * Text size / monospace come from the `size` / `mono` variants (the docs use
 * `font-mono text-2xl` … `text-6xl`). All variants are responsive.
 */
export const countdown = rcva("countdown", {
  variants: {
    size: {
      sm: "text-2xl",
      md: "text-4xl",
      lg: "text-5xl",
      xl: "text-6xl",
    },
    mono: { true: "font-mono" },
  },
});

/** Layout of a multi-unit countdown (days / hours / min / sec). */
export const countdownGroup = rcva("", {
  variants: {
    layout: {
      /** One `.countdown` with inline labels or a separator: `10h 24m 59s` / `10:24:59`. */
      inline: "",
      /** Units side by side, label after each number. */
      labels: "flex gap-5",
      /** Units side by side, label under each number. */
      "labels-under": "grid auto-cols-max grid-flow-col gap-5 text-center",
      /** Each unit in a filled box, label underneath. */
      boxes: "grid auto-cols-max grid-flow-col gap-5 text-center",
    },
  },
  defaultVariants: { layout: "inline" },
});

/** Wrapper of one unit (number + label) in the non-inline layouts. */
export const countdownUnit = rcva("", {
  variants: {
    layout: {
      inline: "",
      labels: "",
      "labels-under": "flex flex-col",
      boxes: "bg-neutral rounded-box text-neutral-content flex flex-col p-2",
    },
  },
  defaultVariants: { layout: "inline" },
});

export type CountdownVariants = VariantProps<typeof countdownGroup> & VariantProps<typeof countdown>;

export interface CountdownSegment {
  value: number;
  /** Minimum digits, e.g. 2 → "05". */
  digits?: number;
  label?: string;
}

const UNIT_SECONDS = { days: 86400, hours: 3600, minutes: 60, seconds: 1 } as const;
type Unit = keyof typeof UNIT_SECONDS;
const UNIT_LABELS: Record<Unit, [short: string, long: string]> = {
  days: ["d", "days"],
  hours: ["h", "hours"],
  minutes: ["m", "min"],
  seconds: ["s", "sec"],
};

/**
 * @example <ui-countdown value="59" digits="2" size="xl" mono></ui-countdown>
 * @example <ui-countdown separator=":" size="sm" mono .segments=${[{ value: 10 }, { value: 24, digits: 2 }, { value: 59, digits: 2 }]}></ui-countdown>
 * @example <ui-countdown until="2026-12-31T23:59:59" layout="boxes" size="lg" mono></ui-countdown>
 *
 * With `until`, the element ticks every second and fires `ui-complete` at zero.
 */
@customElement("ui-countdown")
export class UiCountdown extends LightElement {
  /** Single number mode (0–999). Ignored when `segments` or `until` is set. */
  @property({ type: Number }) value = 0;
  @property({ type: Number }) digits?: number;
  @property({ attribute: false }) segments: CountdownSegment[] = [];
  /** Text between segments in the inline layout (e.g. ":"). Otherwise labels are used. */
  @property() separator?: string;
  /** Structure, not a style variant: not responsive. */
  @property() layout: "inline" | "labels" | "labels-under" | "boxes" = "inline";
  @property() size: CountdownVariants["size"];
  @property({ converter: responsiveBoolean }) mono: Responsive<boolean> = false;
  /** Target date/time (anything `Date` parses). Drives live segments. */
  @property() until?: string;
  /** Units shown in `until` mode, largest first. */
  @property({ attribute: false }) units: Unit[] = ["days", "hours", "minutes", "seconds"];

  private _timer?: ReturnType<typeof setInterval>;
  private _done = false;

  connectedCallback() {
    super.connectedCallback();
    this._schedule();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("until")) this._schedule();
  }

  private _schedule() {
    clearInterval(this._timer);
    this._done = false;
    if (this.until) this._timer = setInterval(() => this.requestUpdate(), 1000);
  }

  private _fromUntil(): CountdownSegment[] {
    let left = Math.max(0, Math.floor((new Date(this.until!).getTime() - Date.now()) / 1000));
    if (left === 0 && !this._done) {
      this._done = true;
      clearInterval(this._timer);
      queueMicrotask(() => this.dispatchEvent(new CustomEvent("ui-complete", { bubbles: true })));
    }
    const inline = this.layout === "inline" || !this.layout;
    return this.units.map((u, i) => {
      const v = Math.floor(left / UNIT_SECONDS[u]);
      left -= v * UNIT_SECONDS[u];
      return { value: Math.min(v, 999), digits: i > 0 ? 2 : undefined, label: UNIT_LABELS[u][inline ? 0 : 1] };
    });
  }

  private _num(s: CountdownSegment) {
    const v = Math.max(0, Math.min(999, Math.round(s.value)));
    const vars: Record<string, string> = { "--value": String(v) };
    if (s.digits) vars["--digits"] = String(s.digits);
    return html`<span style=${styleMap(vars)} aria-live="polite" aria-label=${v}>${v}</span>`;
  }

  render() {
    const segs = this.until
      ? this._fromUntil()
      : this.segments.length
        ? this.segments
        : [{ value: this.value, digits: this.digits }];
    const cls = countdown({ size: this.size, mono: this.mono });
    const layout = this.layout ?? "inline";

    if (layout === "inline") {
      return html`<span class=${cls}>
        ${segs.map(
          (s, i) =>
            html`${this.separator !== undefined && i > 0 ? this.separator : nothing}${this._num(s)}${
              this.separator === undefined && s.label ? s.label : nothing
            }`,
        )}
      </span>`;
    }

    return html`<div class=${countdownGroup({ layout })}>
      ${segs.map(
        (s) =>
          html`<div class=${countdownUnit({ layout }) || nothing}>
            <span class=${cls}>${this._num(s)}</span>
            ${s.label ?? nothing}
          </div>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-countdown": UiCountdown;
  }
}
