import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * File Input: Input field for uploading files.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/file-input/
 *
 * `legend` / `hint` render the docs' "With fieldset and label" markup. All
 * variants are responsive (e.g. `size="sm lg:lg"`).
 */
export const fileInput = rcva("file-input", {
  variants: {
    variant: {
      ghost: "file-input-ghost",
    },
    color: {
      neutral: "file-input-neutral",
      primary: "file-input-primary",
      secondary: "file-input-secondary",
      accent: "file-input-accent",
      info: "file-input-info",
      success: "file-input-success",
      warning: "file-input-warning",
      error: "file-input-error",
    },
    size: {
      xs: "file-input-xs",
      sm: "file-input-sm",
      md: "file-input-md",
      lg: "file-input-lg",
      xl: "file-input-xl",
    },
  },
});

/** "With fieldset and label" parts. */
export const fileInputFieldset = rcva("fieldset");
export const fileInputLegend = rcva("fieldset-legend");
export const fileInputHint = rcva("label");

export type FileInputVariants = VariantProps<typeof fileInput>;

/**
 * @example <ui-file-input name="avatar" accept="image/*" color="primary"></ui-file-input>
 * @example <ui-file-input legend="Pick a file" hint="Max size 2MB"></ui-file-input>
 *
 * Native `change` bubbles out; `ui-change` carries `{ files }`. Read the
 * current selection from the `files` property.
 */
@customElement("ui-file-input")
export class UiFileInput extends LightElement {
  @property() variant: FileInputVariants["variant"];
  @property() color: FileInputVariants["color"];
  @property() size: FileInputVariants["size"];
  @property() name?: string;
  @property() accept?: string;
  @property() capture?: string;
  @property() label?: string;
  /** Fieldset legend above the input. */
  @property() legend: Renderable = "";
  /** Hint under the input. */
  @property() hint: Renderable = "";
  @property({ type: Boolean }) multiple = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;

  /** The currently selected files. */
  files: FileList | null = null;

  private _onChange(e: Event) {
    this.files = (e.target as HTMLInputElement).files;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { files: this.files }, bubbles: true }));
  }

  render() {
    const input = html`<input
      type="file"
      class=${fileInput({ variant: this.variant, color: this.color, size: this.size })}
      name=${ifDefined(this.name)}
      accept=${ifDefined(this.accept)}
      capture=${ifDefined(this.capture)}
      aria-label=${ifDefined(this.label)}
      ?multiple=${this.multiple}
      ?required=${this.required}
      ?disabled=${this.disabled}
      @change=${this._onChange}
    />`;
    if (!this.legend && !this.hint) return input;
    return html`<fieldset class=${fileInputFieldset()}>
      ${this.legend ? html`<legend class=${fileInputLegend()}>${this.legend}</legend>` : nothing} ${input}
      ${this.hint ? html`<label class=${fileInputHint()}>${this.hint}</label>` : nothing}
    </fieldset>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-file-input": UiFileInput;
  }
}
