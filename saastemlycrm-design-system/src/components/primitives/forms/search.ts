import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { inset, row, rowLine, tileCap } from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { kbd, kbdKeys } from "../showcase/kbd.ts";
import { m } from "../../../lib/i18n/index.ts";

export const search = rcva(
  `input ${row} min-w-0 items-center gap-2 [&_input::-webkit-search-cancel-button]:appearance-none [&_input]:min-w-0 [&_input]:basis-0 [&_input]:grow`,
  {
    variants: {
      size: { sm: "input-sm", md: "input-md", lg: "input-lg" },
      variant: { field: "", bare: "input-ghost" },
      width: {
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
  `${inset["4"]} ${tileCap["11"]} btn btn-ghost touch-target liquid-glass-clear h-[calc(var(--tile-h)*0.75)] justify-start gap-2 rounded-full border-transparent font-normal text-on-surface-variant hover:bg-surface/60 hover:text-on-surface @max-[13rem]:justify-center @max-[13rem]:px-0 @max-[13rem]:[&>[data-search-text]]:sr-only @max-[13rem]:[&>[data-search-keys]]:sr-only`,
);
export const searchLauncherText = rcva(`${rowLine} text-start text-body-md`);
export const searchShortcut = rcva("ms-auto");

export type SearchVariants = VariantProps<typeof search>;

const KEY_NAMES: Record<string, string> = { ctrl: "Control", cmd: "Meta", "⌘": "Meta", opt: "Alt", option: "Alt" };
const keyShortcut = (s: string) =>
  s
    .split("+")
    .map((k) => KEY_NAMES[k.toLowerCase()] ?? k)
    .join("+");

@customElement("ui-search")
export class UiSearch extends LightElement {
  @property() label = m.search_label();
  @property() value = "";
  @property() size: SearchVariants["size"];
  @property() variant: SearchVariants["variant"];
  @property() width: SearchVariants["width"];
  @property({ type: Boolean }) launcher = false;
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
    const input = this.input!;
    input.value = this.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.focus();
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
      return html`<button
        type="button"
        class=${searchLauncher()}
        aria-keyshortcuts=${ifDefined(this.shortcut ? keyShortcut(this.shortcut) : undefined)}
      >
        ${iconSvg("search", { size: "sm" })}
        <span class=${searchLauncherText()} data-search-text>${this.label}</span>
        ${
          this.shortcut
            ? html`<span class=${kbdKeys({ class: searchShortcut() })} data-search-keys dir="ltr"
                >${this.shortcut
                  .split("+")
                  .map(
                    (k, i) => html`${i ? html`<span>+</span>` : ""}<kbd class=${kbd({ size: "xs" })}>${k}</kbd>`,
                  )}</span
              >`
            : nothing
        }
      </button>`;
    return html`<label class=${search({ size: this.size, variant: this.variant, width: this.width })}>
      ${iconSvg("search", {}, { class: searchIcon() })}
      <input
        type="search"
        name=${ifDefined(this.name)}
        autocomplete=${ifDefined(this.autocomplete)}
        placeholder=${this.label}
        aria-label=${this.label}
        dir="auto"
        .value=${live(this.value)}
        @input=${this._onInput}
        @keydown=${this._onKey}
      />
      ${
        this.value
          ? html`<button
              type="button"
              class=${iconButton({ size: "xs" })}
              aria-label=${m.search_clear()}
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
