import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inset, row, stack, text } from "../layout/algebra.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Prompt input: where the person writes to an agent — a box that grows with the text, its tools
 * underneath (e.g. the model), and Send, which becomes Stop while the agent works.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Prompt Input")
 *
 * Enter sends, Shift+Enter starts a new line. `ui-submit` { value } fires on send (the box then
 * empties), `ui-stop` on Stop.
 */
export const promptInput = rcva(
  `${stack} ${inset["1.5"]} gap-1 rounded-box border border-outline-variant bg-surface py-1.5 transition-[border-color,box-shadow] duration-(--duration-effects) ease-effects has-[>textarea:focus]:border-primary has-[>textarea:focus]:inset-ring has-[>textarea:focus]:inset-ring-primary motion-reduce:transition-none`,
);
export const promptInputText = rcva(
  `${inset["2"]} ${text.label} max-h-40 min-h-10 resize-none bg-transparent py-1.5 text-body-md caret-primary outline-none [--focus:field] [field-sizing:content] placeholder:text-on-surface-variant disabled:cursor-not-allowed`,
);
export const promptInputBar = rcva(`${row} items-center gap-1`);
export const promptInputTools = rcva(`${row} min-w-0 flex-1 items-center gap-1`);

export type PromptInputStatus = "ready" | "busy";

/**
 * @example
 * <ui-prompt-input placeholder="Ask…" status=${busy ? "busy" : "ready"}
 *   @ui-submit=${(e) => send(e.detail.value)} @ui-stop=${stop}>
 *   <ui-model-selector slot="tools" …></ui-model-selector>
 * </ui-prompt-input>
 */
@customElement("ui-prompt-input")
export class UiPromptInput extends LightElement {
  @property() value = "";
  @property() placeholder = "";
  @property() status: PromptInputStatus = "ready";
  @property() label = "Message";
  @query("textarea") private _field?: HTMLTextAreaElement;

  focus() {
    this._field?.focus();
  }

  private _submit() {
    const value = this.value.trim();
    if (!value || this.status === "busy") return;
    this.value = "";
    this.dispatchEvent(new CustomEvent("ui-submit", { detail: { value }, bubbles: true }));
  }

  private _onKey(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      this._submit();
    }
  }

  render() {
    const busy = this.status === "busy";
    return html`<div class=${promptInput()}>
      <textarea
        class=${promptInputText()}
        rows="1"
        aria-label=${this.label}
        placeholder=${this.placeholder}
        .value=${this.value}
        @input=${(e: Event) => (this.value = (e.target as HTMLTextAreaElement).value)}
        @keydown=${this._onKey}
      ></textarea>
      <div class=${promptInputBar()}>
        <div class=${promptInputTools()}>${this.slotted("tools")}</div>
        ${
          busy
            ? html`<button
                type="button"
                class=${iconButton({ variant: "tonal", size: "xs", shape: "square" })}
                aria-label="Stop"
                @click=${() => this.dispatchEvent(new CustomEvent("ui-stop", { bubbles: true }))}
              >
                ${iconSvg("stop", { size: "md" })}
              </button>`
            : html`<button
                type="button"
                class=${iconButton({ variant: "filled", size: "xs", shape: "square" })}
                aria-label="Send"
                ?disabled=${!this.value.trim()}
                @click=${() => this._submit()}
              >
                ${iconSvg("send", { size: "md" })}
              </button>`
        }
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-prompt-input": UiPromptInput;
  }
}
