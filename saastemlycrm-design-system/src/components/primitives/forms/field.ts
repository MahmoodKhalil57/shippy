import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { floating } from "../../base/floating.ts";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import {
  fixed,
  floatingFit,
  floatMotion,
  inlineRow,
  layers,
  padStart,
  row,
  rowEnd,
  rowGrow,
  stack,
  text,
} from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { formatInt, m } from "../../../i18n/index.ts";

export const field = rcva(
  `${stack} ${padStart["3"]} relative gap-1 rounded-field py-1 [transition:background-color_var(--duration-effects)_var(--ease-effects)] before:absolute before:inset-y-1.5 before:start-0 before:w-1 before:rounded-full before:bg-primary before:scale-y-0 before:[transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:before:transition-none`,
  {
    variants: {
      state: {
        idle: "",
        valid: "",
        invalid: "before:bg-error before:scale-y-100",
      },
      readonly: { true: "", false: "focus-within:before:scale-y-100" },
    },
    defaultVariants: { state: "idle", readonly: false },
  },
);
export const fieldTop = rcva(`${row} items-center gap-x-2 gap-y-1`);
export const fieldLabel = rcva(
  `${text.label} text-label-lg text-on-surface [transition:color_var(--duration-effects-fast)_var(--ease-effects-fast)]`,
  {
    variants: { readonly: { true: "", false: "[[data-field]:focus-within_&]:text-primary-ink" } },
    defaultVariants: { readonly: false },
  },
);
export const fieldRequired = rcva(
  "badge badge-sm rounded-full border-0 bg-surface-container-highest text-label-sm text-on-surface-variant",
);
export const fieldMark = rcva(
  `${inlineRow} ${fixed["5"]} items-center justify-center rounded-full [transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast),opacity_var(--duration-effects-fast)_var(--ease-effects-fast)] starting:scale-0 starting:opacity-0 motion-reduce:transition-none`,
  {
    variants: {
      tone: {
        success: "bg-success-container text-on-success-container",
        error: "bg-error-container text-on-error-container",
      },
    },
  },
);
export const fieldHelp = rcva(
  `${inlineRow} ${fixed["6"]} touch-target state-layer cursor-pointer items-center justify-center rounded-full text-on-surface-variant [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:text-primary-ink`,
  { variants: { open: { true: "bg-primary-container text-on-primary-container" } } },
);
export const fieldHelpPanel = rcva(
  `${floatingFit["6"]} ${floatMotion} liquid-glass shadow-elevation-2 rounded-box p-3`,
);
export const fieldHelpBody = rcva(`${stack} gap-2`);
export const fieldHint = rcva(`${text.prose} text-body-md text-on-surface`);
export const fieldAboutText = rcva(`${text.prose} text-body-sm text-on-surface-variant`);
export const fieldHintSr = rcva("sr-only");
export const fieldSuggest = rcva(
  `${inlineRow} ${fixed["6"]} touch-target state-layer cursor-pointer items-center justify-center rounded-full text-primary-ink [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast)] aria-disabled:cursor-progress`,
  { variants: { open: { true: "bg-primary-container text-on-primary-container" } } },
);
export const fieldSuggestSpinner = rcva("loading loading-spinner loading-xs");
export const fieldBody = rcva(`${layers.box} pt-0.5`);
export const fieldControl = rcva(layers.cell, {
  variants: { covered: { true: "invisible", false: "" } },
  defaultVariants: { covered: false },
});
export const fieldSuggestion = rcva(
  `${layers.cell} ${row} items-stretch gap-1 rounded-field border border-dashed border-primary bg-primary-container/40 [transition:opacity_var(--duration-short3)_var(--ease-emphasized-decelerate),scale_var(--duration-medium1)_var(--ease-emphasized-decelerate)] starting:scale-98 starting:opacity-0 motion-reduce:transition-none`,
);
export const fieldSuggestionTake = rcva(
  `${rowGrow} ${row} ${padStart["3"]} touch-target state-layer min-h-10 cursor-pointer items-center gap-2 rounded-field py-2 text-start text-on-surface`,
);
export const fieldSuggestionIcon = rcva(`${inlineRow} text-primary-ink`);
export const fieldSuggestionText = rcva(`${rowGrow} ${text.prose} text-body-lg`);
export const fieldSuggestionUse = rcva(
  `${inlineRow} ${text.line} items-center rounded-full bg-primary px-2 py-0.5 text-label-md text-on-primary`,
);
export const fieldSuggestionDismiss = rcva(
  `${inlineRow} ${fixed["10"]} touch-target state-layer cursor-pointer items-center justify-center self-center rounded-full text-on-surface-variant`,
);
export const fieldSuggestNote = rcva(`${rowGrow} ${text.prose} text-body-sm text-on-surface-variant`);
export const fieldMessage = rcva(
  `${row} ${text.label} items-start gap-1.5 text-body-sm text-error-ink [transition:opacity_var(--duration-effects)_var(--ease-effects),translate_var(--duration-effects)_var(--ease-effects)] starting:-translate-y-1 starting:opacity-0 [animation:field-shake_var(--duration-medium2)_var(--ease-standard)] motion-reduce:animate-none motion-reduce:transition-none [&>svg]:mt-0.5`,
);
export const fieldFoot = rcva(`${row} items-start gap-2`);
export const fieldMessageText = rcva(`${rowGrow} ${text.prose}`);
export const fieldCount = rcva(
  `${rowEnd} ${text.line} text-label-sm tabular-nums [transition:color_var(--duration-effects)_var(--ease-effects)]`,
  {
    variants: {
      level: {
        ok: "text-on-surface-variant",
        near: "text-warning-ink",
        over: "text-error-ink",
      },
    },
    defaultVariants: { level: "ok" },
  },
);

@customElement("ui-field")
export class UiField extends LightElement {
  @property() label: Renderable = "";
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) filled = false;
  @property({ type: Boolean }) valid = false;
  @property() hint: Renderable = "";
  @property() about = "";
  @property() error = "";
  @property({ type: Number }) count?: number;
  @property({ type: Number }) max?: number;
  @property({ type: Boolean }) readonly = false;
  @property({ attribute: "control-id" }) controlId?: string;
  @property({ type: Boolean }) suggestable = false;
  @property({ type: Boolean }) suggesting = false;
  @property() suggestion = "";
  @property({ attribute: "suggest-note" }) suggestNote = "";

  #hintId = uid("field-hint");
  #helpId = uid("field-help");
  @state() private _help = false;

  #ask = () => {
    if (!this.suggesting) this.dispatchEvent(new CustomEvent("ui-suggest", { bubbles: true, composed: true }));
  };
  #answer(accept: boolean) {
    const back = this.querySelector<HTMLElement>("[data-suggest]");
    this.dispatchEvent(new CustomEvent("ui-suggestion", { detail: { accept }, bubbles: true, composed: true }));
    if (!accept) back?.focus();
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated?.(changed);
    if (changed.has("suggestion") && this.suggestion && !changed.get("suggestion")) {
      const from = document.activeElement;
      if (from instanceof HTMLElement && from.matches("[data-suggest]") && this.contains(from))
        this.querySelector<HTMLElement>("[data-suggestion-take]")?.focus();
    }
  }

  render() {
    const state = this.error ? "invalid" : this.valid ? "valid" : "idle";
    const level =
      this.count == null || this.max == null
        ? "ok"
        : this.count > this.max
          ? "over"
          : this.count >= this.max * 0.9
            ? "near"
            : "ok";
    const mark = this.error
      ? html`<span class=${fieldMark({ tone: "error" })} aria-hidden="true"
          >${iconSvg("warning", { size: "xs" })}</span
        >`
      : this.valid
        ? html`<span class=${fieldMark({ tone: "success" })} aria-hidden="true"
            >${iconSvg("check", { size: "xs" })}</span
          >`
        : nothing;
    return html`<div
      class=${field({ state, readonly: this.readonly })}
      data-field
      aria-describedby=${this.hint ? this.#hintId : nothing}
    >
      <div class=${fieldTop()}>
        ${
          this.label
            ? html`<label class=${fieldLabel({ readonly: this.readonly })} for=${this.controlId ?? nothing}
                >${this.label}</label
              >`
            : nothing
        }
        ${this.required && !this.filled ? html`<span class=${fieldRequired()}>${m.field_required_pill()}</span>` : nothing}
        ${mark}
        ${
          this.hint || this.about
            ? html`<button
                  type="button"
                  class=${fieldHelp({ open: this._help })}
                  popovertarget=${this.#helpId}
                  aria-label=${typeof this.label === "string" && this.label ? m.field_about({ label: this.label }) : m.field_about_this()}
                  aria-expanded=${this._help ? "true" : "false"}
                >
                  ${iconSvg("live-help", { size: "xs" })}
                </button>
                <div
                  class=${fieldHelpPanel()}
                  popover
                  id=${this.#helpId}
                  ${floating({ placement: "top-start", fallbacks: ["bottom-start", "top-end", "bottom-end"], gap: 6 })}
                  @toggle=${(e: ToggleEvent) => (this._help = e.newState === "open")}
                >
                  <div class=${fieldHelpBody()}>
                    ${this.hint ? html`<p class=${fieldHint()}>${this.hint}</p>` : nothing}
                    ${this.about ? html`<p class=${fieldAboutText()}>${this.about}</p>` : nothing}
                  </div>
                </div>`
            : nothing
        }
        ${
          this.suggestable && !this.readonly
            ? html`<button
                type="button"
                data-suggest
                class=${fieldSuggest({ open: !!this.suggestion })}
                aria-label=${typeof this.label === "string" && this.label ? m.field_suggest({ label: this.label }) : m.field_suggest_answer()}
                title=${m.field_suggest_answer()}
                aria-busy=${this.suggesting ? "true" : "false"}
                aria-disabled=${this.suggesting ? "true" : "false"}
                @click=${this.#ask}
              >
                ${
                  this.suggesting
                    ? html`<span class=${fieldSuggestSpinner()} aria-hidden="true"></span>`
                    : iconSvg("assistant", { size: "xs" })
                }
              </button>`
            : nothing
        }
      </div>
      ${this.hint ? html`<p class=${fieldHintSr()} id=${this.#hintId}>${this.hint}</p>` : nothing}
      <div class=${fieldBody()}>
        <div class=${fieldControl({ covered: !!this.suggestion })} ?inert=${!!this.suggestion}>${this.slotted()}</div>
        ${
          this.suggestion
            ? html`<div class=${fieldSuggestion()}>
                <button
                  type="button"
                  data-suggestion-take
                  class=${fieldSuggestionTake()}
                  aria-label=${m.field_suggestion_use_label({ suggestion: this.suggestion })}
                  @click=${() => this.#answer(true)}
                  @keydown=${(e: KeyboardEvent) => e.key === "Escape" && (e.preventDefault(), this.#answer(false))}
                >
                  <span class=${fieldSuggestionIcon()} aria-hidden="true">${iconSvg("assistant", { size: "sm" })}</span>
                  <span class=${fieldSuggestionText()}>${this.suggestion}</span>
                  <span class=${fieldSuggestionUse()} aria-hidden="true">${m.field_suggestion_use()}</span>
                </button>
                <button
                  type="button"
                  class=${fieldSuggestionDismiss()}
                  aria-label=${m.field_suggestion_dismiss()}
                  @click=${() => this.#answer(false)}
                >
                  ${iconSvg("x", { size: "sm" })}
                </button>
              </div>`
            : nothing
        }
      </div>
      ${
        this.suggestNote && !this.suggestion && !this.error
          ? html`<div class=${fieldFoot()}>
              <div class=${fieldSuggestNote()} role="status">${this.suggestNote}</div>
            </div>`
          : nothing
      }
      ${
        this.error || this.count != null
          ? html`<div class=${fieldFoot()}>
              ${
                this.error
                  ? keyed(
                      this.error,
                      html`<div class=${fieldMessage({ class: rowGrow })} role="status" aria-live="polite">
                        ${iconSvg("error", { size: "xs" })}<span class=${fieldMessageText()}>${this.error}</span>
                      </div>`,
                    )
                  : nothing
              }
              ${
                this.count != null
                  ? html`<span class=${fieldCount({ level })}
                      >${this.max != null ? m.field_count_of({ count: formatInt(this.count), max: formatInt(this.max) }) : formatInt(this.count)}</span
                    >`
                  : nothing
              }
            </div>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-field": UiField;
  }
}
