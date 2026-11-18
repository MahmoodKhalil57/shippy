import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Code mockup: Block of code in a box that looks like a code editor.
 *
 * Purpose: Showcase & docs · Kind: primitive
 * Docs: https://daisyui.com/components/mockup-code/
 *
 * Each line is `<pre data-prefix="$"><code>…</code></pre>`; long lines scroll.
 */
export const mockupCode = rcva("mockup-code w-full", {
  variants: {
    /** Whole-block colour. */
    color: {
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      secondary: "bg-secondary text-secondary-content",
      accent: "bg-accent text-accent-content",
      info: "bg-info text-info-content",
      success: "bg-success text-success-content",
      warning: "bg-warning text-warning-content",
      error: "bg-error text-error-content",
    },
  },
});

/** One line. `color` tints the text; `highlight` fills the line background. */
export const mockupCodeLine = rcva("", {
  variants: {
    color: {
      neutral: "text-neutral",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
    highlight: {
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      secondary: "bg-secondary text-secondary-content",
      accent: "bg-accent text-accent-content",
      info: "bg-info text-info-content",
      success: "bg-success text-success-content",
      warning: "bg-warning text-warning-content",
      error: "bg-error text-error-content",
    },
  },
});

export type MockupCodeVariants = VariantProps<typeof mockupCode>;
export type MockupCodeLineVariants = VariantProps<typeof mockupCodeLine>;

export interface MockupCodeLine extends MockupCodeLineVariants {
  code: string;
  /** Overrides the element-level `linePrefix` for this line ("" for none). */
  prefix?: string;
}

/**
 * @example
 * <ui-mockup-code prefix="$" .lines=${[
 *   "npm i daisyui",
 *   { code: "installing...", prefix: ">", color: "warning" },
 *   { code: "Done!", prefix: ">", color: "success" },
 * ]}></ui-mockup-code>
 * @example <ui-mockup-code numbered .lines=${["a", { code: "Error!", highlight: "warning" }]}></ui-mockup-code>
 *
 * Without `lines`, authored `<pre>` children are used.
 */
@customElement("ui-mockup-code")
export class UiMockupCode extends LightElement {
  @property({ attribute: false }) lines: (string | MockupCodeLine)[] = [];
  @property() color: MockupCodeVariants["color"];
  /** Default prefix for every line, e.g. "$". */
  @property({ attribute: "prefix" }) linePrefix?: string;
  /** Use line numbers as the prefix. */
  @property({ type: Boolean }) numbered = false;

  private _line(raw: string | MockupCodeLine, i: number) {
    const line = typeof raw === "string" ? { code: raw } : raw;
    const prefix = line.prefix ?? (this.numbered ? String(i + 1) : this.linePrefix);
    return html`<pre
      class=${mockupCodeLine({ color: line.color, highlight: line.highlight })}
      data-prefix=${ifDefined(prefix || undefined)}
    ><code>${line.code}</code></pre>`;
  }

  render() {
    return html`<div class=${mockupCode({ color: this.color })}>
      ${this.lines.length ? this.lines.map((l, i) => this._line(l, i)) : this.content}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-mockup-code": UiMockupCode;
  }
}
