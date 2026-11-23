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

/**
 * Field: one question on a form, around whatever answers it (a text box, a segmented choice, a
 * scale, a date…), the same anatomy for every input so a long form reads as a rhythm.
 *
 * Purpose: Forms & input · Kind: primitive
 *
 * - **The label**, with where it stands at a glance: a "Required" pill while a required field is
 *   empty, a check that pops in once it holds a good value, a warning mark while it doesn't.
 * - **The hint, on request**: a "?" beside the label opens it (`hint`, what goes in) and the longer
 *   story under it (`about`) in a small glass panel anchored to the "?" (the Popover API: a click
 *   outside or Escape closes it, and it rises over everything, clipped by nothing). The form stays
 *   a column of labels and answers; the help is one tap away, and the "?" is filled while it's
 *   open. Screen readers hear the hint as the field's description whether it's open or not.
 * - **The answer** (its content), with an accent bar at its start that grows while it has focus
 *   and the label taking the primary colour: where you are is never in doubt.
 * - **What's wrong, as you go** (`error`): under the answer, sliding in with a short shake (none
 *   with Reduce motion), in words, announced politely; and a running count against a limit
 *   (`count` / `max`) that turns amber near it and red past it.
 * Nothing moves when a hint, error or count comes and goes beyond the line it takes.
 */
export const field = rcva(
  `${stack} ${padStart["3"]} relative gap-1 rounded-field py-1 [transition:background-color_var(--duration-effects)_var(--ease-effects)] before:absolute before:inset-y-1.5 before:start-0 before:w-1 before:rounded-full before:bg-primary before:scale-y-0 before:[transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:before:transition-none`,
  {
    variants: {
      state: {
        idle: "",
        valid: "",
        invalid: "before:bg-error before:scale-y-100",
      },
      /** A value to read: focus in it isn't editing it, so no accent bar grows. */
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
/** "Required" while empty: a quiet pill, not a red star. */
export const fieldRequired = rcva(
  "badge badge-sm rounded-full border-0 bg-surface-container-highest text-label-sm text-on-surface-variant",
);
/** A good value: a check that pops in (from nothing, on M3's spatial spring). */
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
/** The "?" beside the label: a small round button, filled while its help is open. */
export const fieldHelp = rcva(
  `${inlineRow} ${fixed["6"]} touch-target state-layer cursor-pointer items-center justify-center rounded-full text-on-surface-variant [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:text-primary-ink`,
  { variants: { open: { true: "bg-primary-container text-on-primary-container" } } },
);
/**
 * The help panel: glass (it floats), its content's width in whole tiles up to 6, above the "?"
 * (under it when there's no room above; Floating UI places it), growing from it as it opens (M3's enter: a quick fade and a
 * short expand on the emphasized decelerate curve; none with Reduce motion).
 */
export const fieldHelpPanel = rcva(
  `${floatingFit["6"]} ${floatMotion} liquid-glass shadow-elevation-2 rounded-box p-3`,
);
/** The panel's words (the panel itself keeps the popover's own display: hidden until it opens). */
export const fieldHelpBody = rcva(`${stack} gap-2`);
export const fieldHint = rcva(`${text.prose} text-body-md text-on-surface`);
export const fieldAboutText = rcva(`${text.prose} text-body-sm text-on-surface-variant`);
/** The hint for screen readers, always there (the panel is only in the tree while it's open). */
export const fieldHintSr = rcva("sr-only");
/**
 * "Suggest" beside the "?": sparkles, filled while a suggestion shows, a spinner while one is on
 * its way.
 */
export const fieldSuggest = rcva(
  `${inlineRow} ${fixed["6"]} touch-target state-layer cursor-pointer items-center justify-center rounded-full text-primary-ink [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast)] aria-disabled:cursor-progress`,
  { variants: { open: { true: "bg-primary-container text-on-primary-container" } } },
);
export const fieldSuggestSpinner = rcva("loading loading-spinner loading-xs");
/** The answer's cell: the control, and over it a suggestion while there is one. */
export const fieldBody = rcva(`${layers.box} pt-0.5`);
export const fieldControl = rcva(layers.cell, {
  variants: { covered: { true: "invisible", false: "" } },
  defaultVariants: { covered: false },
});
/**
 * A suggestion: the third thing a field can show, after its placeholder and its value. It takes
 * the control's place and size, dashed in primary like an answer not yet given, the AI's sparkles
 * at its start and "Use" at its end; a press (or Enter) takes it, × or Escape leaves it. It grows
 * in from the control (M3's enter: a fade and a short expand on the emphasized decelerate curve).
 */
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
/** Why no suggestion came (nothing on the form points to one, or the model failed), in a line. */
export const fieldSuggestNote = rcva(`${rowGrow} ${text.prose} text-body-sm text-on-surface-variant`);
/** What's wrong: slides in under the answer with a short shake (`field-shake`, theme.css). */
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

/**
 * @example
 * <ui-field label="Vessel" required .valid=${!!vessel} hint="The ship the stores go to." about="We deliver alongside at…">
 *   <ui-text-input .value=${vessel} placeholder="e.g. MV Nordic Tern"></ui-text-input>
 * </ui-field>
 * @example <ui-field label="Subject" .error=${"At most 120 characters."} .count=${131} .max=${120}>…</ui-field>
 */
@customElement("ui-field")
export class UiField extends LightElement {
  @property() label: Renderable = "";
  /** Shows "Required" until it holds a value (`filled`). */
  @property({ type: Boolean }) required = false;
  /** It holds a value (a required field stops saying "Required"). */
  @property({ type: Boolean }) filled = false;
  /** It holds a value and nothing is wrong with it: the check. */
  @property({ type: Boolean }) valid = false;
  /** One line: what goes in. */
  @property() hint: Renderable = "";
  /** The longer story, behind "More". */
  @property() about = "";
  /** What's wrong, in words (empty: nothing). */
  @property() error = "";
  /** A running count against `max` (characters, rows). */
  @property({ type: Number }) count?: number;
  @property({ type: Number }) max?: number;
  /** Its value is read here, not edited: focus in it draws no accent bar and no label colour. */
  @property({ type: Boolean }) readonly = false;
  /** The control's id, for the label's `for`. */
  @property({ attribute: "control-id" }) controlId?: string;
  /** Shows "Suggest" (sparkles) beside the "?": a press asks for a suggestion (`ui-suggest`). */
  @property({ type: Boolean }) suggestable = false;
  /** A suggestion is on its way (the sparkles turn to a spinner). */
  @property({ type: Boolean }) suggesting = false;
  /**
   * A suggested answer, as it reads (empty: none). While there is one it stands in the control's
   * place; taking it or leaving it fires `ui-suggestion` (`{ accept }`).
   */
  @property() suggestion = "";
  /** Why no suggestion came, in a line under the answer (empty: nothing). */
  @property({ attribute: "suggest-note" }) suggestNote = "";

  #hintId = uid("field-hint");
  #helpId = uid("field-help");
  /** Whether the help panel is open (the "?" is filled). */
  @state() private _help = false;

  #ask = () => {
    if (!this.suggesting) this.dispatchEvent(new CustomEvent("ui-suggest", { bubbles: true, composed: true }));
  };
  #answer(accept: boolean) {
    // Focus stays in the field: on the sparkles once the suggestion is gone.
    const back = this.querySelector<HTMLElement>("[data-suggest]");
    this.dispatchEvent(new CustomEvent("ui-suggestion", { detail: { accept }, bubbles: true, composed: true }));
    if (!accept) back?.focus();
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated?.(changed);
    // A suggestion asked for from the sparkles takes the focus, so Enter takes it and Escape leaves it.
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
