import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Button group: choose one (or several) of a few closely related options — a view, a currency,
 * a language, a period (M3 connected button group, which replaces segmented buttons; Apple
 * segmented control).
 *
 * Purpose: Actions · Kind: primitive
 *
 * 2–5 options (M3), short noun labels, all the same kind (text or icon + text), never mixed with
 * actions. The selected option takes the primary container, M3's full corners and a check, so
 * its state isn't carried by colour alone. Keyboard: one tab stop; ← / → move and select (single)
 * or move (multi; Space toggles). `select="single"` is a radio group (`ui-change` { value });
 * `select="multi"` is a set of toggles (`ui-change` { values }). To switch a page's main view,
 * use tabs instead (Apple).
 */
export const buttonGroup = rcva("inline-flex max-w-full flex-wrap items-center gap-0.5");
export const buttonGroupItem = rcva(
  "btn btn-ghost max-w-full h-auto min-h-(--size) whitespace-normal [text-wrap:balance] touch-target state-layer gap-1 border-transparent bg-surface-container-highest text-on-surface [transition:border-radius_var(--duration-spatial-fast)_var(--ease-spatial-fast),background-color_var(--duration-effects-fast)_var(--ease-effects-fast)] rounded-sm first:rounded-s-full last:rounded-e-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
  {
    variants: {
      size: { xs: "btn-sm", sm: "btn-md" },
      selected: { true: "rounded-full! bg-primary-container! text-on-primary-container!" },
    },
    defaultVariants: { size: "sm" },
  },
);

export type ButtonGroupVariants = VariantProps<typeof buttonGroupItem>;

export interface ButtonGroupOption {
  value: string;
  label: Renderable;
  icon?: IconName;
  disabled?: boolean;
}

/**
 * @example
 * <ui-button-group label="View" .value=${view} .options=${[
 *   { value: "table", label: "Table", icon: "table" }, { value: "cards", label: "Cards", icon: "grid" },
 * ]} @ui-change=${(e) => (view = e.detail.value)}></ui-button-group>
 * @example <ui-button-group select="multi" label="Show" .values=${shown} .options=${…}></ui-button-group>
 */
@customElement("ui-button-group")
export class UiButtonGroup extends LightElement {
  @property({ attribute: false }) options: ButtonGroupOption[] = [];
  /** Single select: the chosen value. */
  @property() value = "";
  /** Multi select: the chosen values. */
  @property({ attribute: false }) values: string[] = [];
  @property() select: "single" | "multi" = "single";
  /** The group's accessible name ("View", "Currency"). */
  @property() label = "";
  @property() size: ButtonGroupVariants["size"];

  private _on(o: ButtonGroupOption) {
    return this.select === "multi" ? this.values.includes(o.value) : o.value === this.value;
  }

  private _pick(o: ButtonGroupOption) {
    if (o.disabled) return;
    if (this.select === "multi") {
      this.values = this._on(o) ? this.values.filter((v) => v !== o.value) : [...this.values, o.value];
      this.dispatchEvent(new CustomEvent("ui-change", { detail: { values: this.values }, bubbles: true }));
    } else if (o.value !== this.value) {
      this.value = o.value;
      this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: this.value }, bubbles: true }));
    }
  }

  private _key(e: KeyboardEvent, i: number) {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const rtl = getComputedStyle(this).direction === "rtl" && (e.key === "ArrowLeft" || e.key === "ArrowRight");
    const n = this.options.length;
    let j = i;
    do j = (j + (rtl ? -dir : dir) + n) % n;
    while (this.options[j]!.disabled && j !== i);
    const buttons = this.querySelectorAll<HTMLButtonElement>("[data-group-item]");
    buttons[j]?.focus();
    if (this.select === "single") this._pick(this.options[j]!);
  }

  render() {
    const single = this.select === "single";
    const focusIndex = Math.max(0, single ? this.options.findIndex((o) => this._on(o)) : 0);
    return html`<div class=${buttonGroup()} role=${single ? "radiogroup" : "group"} aria-label=${this.label}>
      ${this.options.map((o, i) => {
        const on = this._on(o);
        return html`<button
          type="button"
          data-group-item
          class=${buttonGroupItem({ size: this.size, selected: on })}
          role=${single ? "radio" : nothing}
          aria-checked=${single ? String(on) : nothing}
          aria-pressed=${single ? nothing : String(on)}
          tabindex=${!single || i === focusIndex ? "0" : "-1"}
          ?disabled=${!!o.disabled}
          @click=${() => this._pick(o)}
          @keydown=${(e: KeyboardEvent) => this._key(e, i)}
        >
          ${on ? iconSvg("check", { size: "sm" }) : o.icon ? iconSvg(o.icon, { size: "sm" }) : nothing}${o.label}
        </button>`;
      })}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-button-group": UiButtonGroup;
  }
}
