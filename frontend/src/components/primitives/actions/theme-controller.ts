import { cva, type VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { button } from "./button.ts";
import { dropdown, dropdownContent, dropdownPanel } from "./dropdown.ts";
import { swap, swapOff, swapOn } from "./swap.ts";
import { checkbox } from "../forms/checkbox.ts";
import { fieldset, fieldsetLabel } from "../forms/fieldset.ts";
import { radio } from "../forms/radio.ts";
import { toggle } from "../forms/toggle.ts";
import { join, joinItem } from "../layout/join.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Theme Controller: Sets the page theme from a checked checkbox or radio input.
 *
 * Purpose: Actions · Kind: primitive
 * Docs: https://daisyui.com/components/theme-controller/
 *
 * A primitive because `theme-controller` has to sit on the native input
 * itself: daisyUI's theme CSS switches themes from
 * `:root:has(input.theme-controller:checked)`. The input is dressed with the
 * Toggle / Checkbox / Swap / Radio / Button / Join / Dropdown / Fieldset recipes.
 *
 * The app header's theme button, colour-scheme menu and background picker are `<ui-appearance>`
 * (src/components/composed/actions/appearance.ts).
 *
 * Pure CSS: when an `input.theme-controller` with `value="<theme>"` is checked,
 * daisyUI applies that theme to the page via `:has()`. Only themes enabled in
 * the daisyUI plugin config exist (default: `light`, `dark`), so enable more in
 * `src/styles/theme.css` (e.g. `@plugin "daisyui" { themes: light --default, dark --prefersdark, synthwave; }`).
 */
export const themeController = cva("theme-controller", {
  variants: {
    /** Which control carries the `theme-controller` class. */
    as: {
      toggle: toggle(),
      checkbox: checkbox(),
      swap: "",
      radio: radio({ size: "sm" }),
      buttons: button({ class: joinItem() }),
      dropdown: button({ size: "sm", block: true, variant: "ghost", justify: "start" }),
    },
  },
  defaultVariants: { as: "toggle" },
});

export type ThemeControllerVariants = VariantProps<typeof themeController>;
export type ThemeControllerAs = NonNullable<ThemeControllerVariants["as"]>;

const STORAGE_KEY = "ui-theme";

/**
 * @example <ui-theme-controller theme="dark"></ui-theme-controller>          <!-- toggle -->
 * @example <ui-theme-controller as="swap" theme="dark" persist></ui-theme-controller>
 * @example <ui-theme-controller as="toggle" theme="dark" off-label="Light" on-label="Dark"></ui-theme-controller>
 * @example <ui-theme-controller as="radio" .themes=${["light", "dark", "cupcake"]}></ui-theme-controller>
 * @example <ui-theme-controller as="dropdown" label="Theme" .themes=${["light", "dark"]}></ui-theme-controller>
 *
 * - `toggle` / `checkbox` / `swap`: one input, checked = `theme`, unchecked = page default.
 * - `radio` / `buttons` / `dropdown`: one input per entry in `themes`; `value` is the selected one.
 * `persist` remembers the choice in localStorage. `ui-change` (detail: { theme }) fires on change.
 */
@customElement("ui-theme-controller")
export class UiThemeController extends LightElement {
  @property() as: ThemeControllerAs = "toggle";
  /** Theme applied while checked (single-input modes). */
  @property() theme = "dark";
  /** Themes offered by the multi-choice modes ("default" = page default). */
  @property({ attribute: false }) themes: string[] = ["default", "light", "dark"];
  /** Selected theme (multi-choice modes) or "" for the page default. */
  @property() value = "";
  @property({ type: Boolean }) checked = false;
  @property() name = uid("theme");
  /** Remember the selection in localStorage. */
  @property({ type: Boolean }) persist = false;

  /** Text before / after the toggle. */
  @property({ attribute: "off-label" }) offLabel: Renderable = "";
  @property({ attribute: "on-label" }) onLabel: Renderable = "";
  /** Dropdown trigger text. */
  @property() label: Renderable = "Theme";

  connectedCallback() {
    super.connectedCallback();
    if (!this.persist) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(this._key);
    } catch {
      /* storage unavailable */
    }
    if (saved == null) return;
    if (this._multi) this.value = saved;
    else this.checked = saved === this.theme;
  }

  private get _key() {
    return STORAGE_KEY;
  }

  private get _multi() {
    return this.as === "radio" || this.as === "buttons" || this.as === "dropdown";
  }

  private _changed(theme: string) {
    if (this.persist) {
      try {
        localStorage.setItem(this._key, theme);
      } catch {
        /* storage unavailable */
      }
    }
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { theme }, bubbles: true }));
  }

  private _single() {
    return html`<input
      type="checkbox"
      class=${themeController({ as: this.as })}
      value=${this.theme}
      aria-label="Toggle ${this.theme} theme"
      .checked=${this.checked}
      @change=${(e: Event) => {
        this.checked = (e.target as HTMLInputElement).checked;
        this._changed(this.checked ? this.theme : "");
      }}
    />`;
  }

  private _choice(theme: string, labelled: boolean) {
    const input = html`<input
      type="radio"
      name=${this.name}
      class=${themeController({ as: this.as })}
      value=${theme}
      aria-label=${theme}
      .checked=${this.value === theme}
      @change=${() => {
        this.value = theme;
        this._changed(theme);
      }}
    />`;
    return labelled ? html`<label class=${fieldsetLabel({ control: true })}>${input} ${theme}</label>` : input;
  }

  render() {
    switch (this.as) {
      case "checkbox":
        return this._single();
      case "swap":
        return html`<label class=${swap({ variant: "rotate" })}>
          ${this._single()}
          <span class=${swapOff()}>${iconSvg("sun", { size: "2xl" })}</span>
          <span class=${swapOn()}>${iconSvg("moon", { size: "2xl" })}</span>
        </label>`;
      case "radio":
        return html`<fieldset class=${fieldset()}>${this.themes.map((t) => this._choice(t, true))}</fieldset>`;
      case "buttons":
        return html`<div class=${join({ direction: "vertical" })}>
          ${this.themes.map((t) => this._choice(t, false))}
        </div>`;
      case "dropdown":
        return html`<div class=${dropdown()}>
          <div tabindex="0" role="button" class=${button()}>
            ${this.label} ${iconSvg("chevron-down", { size: "xs" })}
          </div>
          <ul
            tabindex="-1"
            class=${dropdownContent({
              class: dropdownPanel({ surface: "base-300", rounded: true, width: "52", padding: "2", shadow: "2xl" }),
            })}
          >
            ${this.themes.map((t) => html`<li>${this._choice(t, false)}</li>`)}
          </ul>
        </div>`;
      default: {
        const sw = this._single();
        return this.offLabel || this.onLabel
          ? html`<label class=${fieldsetLabel({ control: true })}>
              ${this.offLabel ? html`<span>${this.offLabel}</span>` : nothing} ${sw}
              ${this.onLabel ? html`<span>${this.onLabel}</span>` : nothing}
            </label>`
          : sw;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-theme-controller": UiThemeController;
  }
}
