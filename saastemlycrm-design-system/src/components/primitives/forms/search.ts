import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { inset, row, rowLine } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { kbd, kbdKeys } from "../showcase/kbd.ts";

/**
 * Search: the one search field (M3 search bar; Apple search field).
 *
 * Purpose: Forms & input · Kind: primitive
 *
 * A magnifying glass, the field and a clear button once something is typed. Escape clears it
 * first. `label` names it and is the placeholder ("Search cases"), so every search field has a
 * name. Typing fires the native `input` event from the inner `<input>` (read `e.target.value`);
 * clearing fires it too, with an empty value.
 *
 * `launcher` draws the same field as a button that opens a search somewhere else (the app
 * header's command palette), with the `shortcut` hint at the end. In a container narrower than
 * 13rem it folds to the magnifying glass alone.
 */
export const search = rcva(
  `input ${row} min-w-0 items-center gap-2 [&_input::-webkit-search-cancel-button]:appearance-none [&_input]:min-w-0 [&_input]:basis-0 [&_input]:grow`,
  {
    variants: {
      size: { sm: "input-sm", md: "input-md", lg: "input-lg" },
      /** `bare`: no border or fill, for a search that heads a dialog (the command palette). */
      variant: { field: "", bare: "input-ghost" },
      width: {
        /** Grows to fill a wrapping row, never narrower than 16rem (or the row). */
        fill: "min-w-[min(100%,16rem)] flex-1",
        full: "w-full",
        auto: "w-auto",
      },
    },
    defaultVariants: { size: "md", variant: "field", width: "full" },
  },
);
export const searchIcon = rcva("size-[1.1em] shrink-0 text-on-surface-variant");
export const searchLauncher = rcva(
  `${inset["4"]} btn btn-ghost touch-target liquid-glass-clear h-11 max-w-xl justify-start gap-2 rounded-full border-transparent font-normal text-on-surface-variant hover:bg-surface/60 hover:text-on-surface @max-[13rem]:me-auto @max-[13rem]:size-10 @max-[13rem]:justify-center @max-[13rem]:px-0 @max-[13rem]:[&>[data-search-text]]:hidden @max-[13rem]:[&>[data-search-keys]]:hidden`,
);
export const searchLauncherText = rcva(`${rowLine} text-start text-body-md`);
export const searchShortcut = rcva("ms-auto");

export type SearchVariants = VariantProps<typeof search>;

/**
 * @example
 * <ui-search label="Search cases" .value=${q} @input=${(e) => (q = e.target.value)}></ui-search>
 * @example <ui-search launcher label="Search actions, pages, records…" shortcut="Ctrl+K" @click=${open}></ui-search>
 */
@customElement("ui-search")
export class UiSearch extends LightElement {
  /** The field's name and placeholder: "Search cases", "Search by name". */
  @property() label = "Search";
  @property() value = "";
  @property() size: SearchVariants["size"];
  @property() variant: SearchVariants["variant"];
  @property() width: SearchVariants["width"];
  /** A button that opens search elsewhere, drawn as the field. */
  @property({ type: Boolean }) launcher = false;
  /** Keyboard shortcut shown at the end of a launcher ("Ctrl+K"). */
  @property() shortcut?: string;
  @property() autocomplete?: string;
  @property() name?: string;

  @query("input") input?: HTMLInputElement;

  focus(options?: FocusOptions) {
    (this.input ?? this.querySelector("button"))?.focus(options);
  }

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }

  private _clear() {
    if (!this.input) return;
    this.input.value = this.value = "";
    this.input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    this.input.focus();
  }

  private _onKey(e: KeyboardEvent) {
    if (e.key === "Escape" && this.value) {
      e.preventDefault();
      e.stopPropagation();
      this._clear();
    }
  }

  render() {
    if (this.launcher)
      return html`<button type="button" class=${searchLauncher()} aria-label=${this.label}>
        ${iconSvg("search", { size: "sm" })}
        <span class=${searchLauncherText()} data-search-text>${this.label}</span>
        ${
          this.shortcut
            ? html`<span class=${kbdKeys({ class: searchShortcut() })} data-search-keys
                >${this.shortcut
                  .split("+")
                  .map(
                    (k, i) => html`${i ? html`<span>+</span>` : ""}<kbd class=${kbd({ size: "xs" })}>${k}</kbd>`,
                  )}</span
              >`
            : nothing
        }
      </button>`;
    return html`<label role="search" class=${search({ size: this.size, variant: this.variant, width: this.width })}>
      ${iconSvg("search", {}, { class: searchIcon() })}
      <input
        type="search"
        name=${ifDefined(this.name)}
        autocomplete=${ifDefined(this.autocomplete)}
        placeholder=${this.label}
        aria-label=${this.label}
        .value=${live(this.value)}
        @input=${this._onInput}
        @keydown=${this._onKey}
      />
      ${
        this.value
          ? html`<button
              type="button"
              class=${iconButton({ size: "xs" })}
              aria-label="Clear search"
              @click=${this._clear}
            >
              ${iconSvg("x", { size: "sm" })}
            </button>`
          : nothing
      }
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-search": UiSearch;
  }
}
