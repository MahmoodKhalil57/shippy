import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { fieldsetField, type FieldsetVariants } from "./fieldset.ts";
import { label as labelRecipe } from "./label.ts";

/**
 * Textarea: Multi-line text entry.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/textarea/
 */
export const textarea = rcva("textarea min-w-0", {
  variants: {
    color: {
      neutral: "textarea-neutral",
      primary: "textarea-primary",
      secondary: "textarea-secondary",
      accent: "textarea-accent",
      info: "textarea-info",
      success: "textarea-success",
      warning: "textarea-warning",
      error: "textarea-error",
    },
    variant: {
      ghost: "textarea-ghost",
    },
    size: {
      xs: "textarea-xs",
      sm: "textarea-sm",
      md: "textarea-md",
      lg: "textarea-lg",
      xl: "textarea-xl",
    },
    validator: { true: "validator" },
    /** Code and JSON: monospaced, no wrapping, tab-sized indents. */
    mono: {
      true: "font-mono text-body-md [tab-size:2] whitespace-pre overflow-x-auto min-w-0 [overflow-wrap:anywhere]",
    },
    width: {
      auto: "w-auto",
      "64": "w-64 max-w-full",
      xs: "w-xs max-w-full",
      sm: "w-sm max-w-full",
      md: "w-md max-w-full",
      lg: "w-lg max-w-full",
      full: "w-full",
    },
    /** Fixed height (the docs' "Your bio" example uses `h-24`). */
    height: {
      "16": "h-16",
      "24": "h-24",
      "32": "h-32",
      "48": "h-48",
      "64": "h-64",
    },
  },
});

export type TextareaVariants = VariantProps<typeof textarea>;

/**
 * @example <ui-textarea placeholder="Bio" color="primary"></ui-textarea>
 * @example <ui-textarea legend="Your bio" hint="Optional" placeholder="Bio" height="24"></ui-textarea>
 * @example <ui-textarea size="xs sm:sm md:md lg:lg xl:xl" floating label="Textarea" placeholder="Textarea"></ui-textarea>
 * @example <ui-textarea floating label="Bio" placeholder="Bio"></ui-textarea>
 *
 * Native `input` / `change` events bubble out; `value` stays in sync.
 */
@customElement("ui-textarea")
export class UiTextarea extends LightElement {
  @property() color: TextareaVariants["color"];
  @property() variant: TextareaVariants["variant"];
  @property() size: TextareaVariants["size"];
  @property() width: TextareaVariants["width"];
  @property() height: TextareaVariants["height"];
  @property({ converter: responsiveBoolean }) validator: Responsive<boolean> = false;
  /** Code and JSON (monospaced). */
  @property({ type: Boolean }) mono = false;

  @property() name?: string;
  @property() value = "";
  @property() placeholder?: string;
  @property({ type: Number }) rows?: number;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) readonly = false;
  @property() autocomplete?: string;

  @property() legend: Renderable = "";
  @property() label: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "validator-hint" }) validatorHint: Renderable = "";
  @property({ type: Boolean, attribute: "hint-on-invalid" }) hintOnInvalid = false;
  @property({ type: Boolean }) floating = false;
  /** Look of the wrapping fieldset (rendered when legend / label / hint are set). */
  @property({ attribute: "field-surface" }) fieldSurface: FieldsetVariants["surface"];
  @property({ attribute: "field-width" }) fieldWidth: FieldsetVariants["width"];
  @property({ attribute: "input-id" }) inputId = uid("textarea");

  @query("textarea") textarea!: HTMLTextAreaElement;

  connectedCallback() {
    super.connectedCallback();
    // Authored text content is the initial value, like a native <textarea>.
    if (!this.value && this.hasContent)
      this.value = this.contentNodes
        .map((n) => n.textContent)
        .join("")
        .trim();
  }

  focus(options?: FocusOptions) {
    this.textarea?.focus(options);
  }
  checkValidity() {
    return this.textarea?.checkValidity() ?? true;
  }
  reportValidity() {
    return this.textarea?.reportValidity() ?? true;
  }

  render() {
    let control = html`<textarea
      id=${this.inputId}
      class=${textarea({
        color: this.color,
        variant: this.variant,
        size: this.size,
        width: this.width,
        height: this.height,
        validator: this.validator,
        mono: this.mono,
      })}
      name=${ifDefined(this.name)}
      .value=${live(this.value)}
      placeholder=${ifDefined(this.placeholder)}
      rows=${ifDefined(this.rows)}
      minlength=${ifDefined(this.minlength)}
      maxlength=${ifDefined(this.maxlength)}
      autocomplete=${ifDefined(this.autocomplete)}
      ?disabled=${this.disabled}
      ?required=${this.required}
      ?readonly=${this.readonly}
      aria-label=${ifDefined(!this.label && !this.legend ? this.placeholder : undefined)}
      @input=${(e: Event) => (this.value = (e.target as HTMLTextAreaElement).value)}
    ></textarea>`;

    if (this.floating) {
      control = html`<label class=${labelRecipe({ variant: "floating" })}
        ><span>${this.label || this.placeholder}</span>${control}</label
      >`;
    }

    return fieldsetField(
      {
        legend: this.legend,
        label: this.floating ? "" : this.label,
        hint: this.hint,
        validatorHint: this.validatorHint,
        hintOnInvalid: this.hintOnInvalid,
        controlId: this.inputId,
        surface: this.fieldSurface,
        width: this.fieldWidth,
      },
      control,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-textarea": UiTextarea;
  }
}
