import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inlineRow, row, text } from "../layout/algebra.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { m } from "../../../i18n/index.ts";

export const message = rcva("group/message flex flex-col gap-1", {
  variants: {
    from: {
      user: "items-end",
      assistant: "items-start",
    },
  },
  defaultVariants: { from: "assistant" },
});
export const messageBody = rcva(`${text.label} text-body-md`, {
  variants: {
    from: {
      user: "w-fit max-w-[85%] rounded-box rounded-ee-field bg-surface-container px-3 py-2 whitespace-pre-line",
      assistant: "w-full",
    },
  },
  defaultVariants: { from: "assistant" },
});
export const messageActions = rcva(`${row} items-center gap-0.5 text-on-surface-variant`, {
  variants: {
    from: {
      user: "opacity-0 transition-opacity duration-(--duration-effects-fast) ease-effects-fast group-hover/message:opacity-100 group-focus-within/message:opacity-100 motion-reduce:transition-none",
      assistant: "",
    },
  },
});
export const messageAction = rcva(inlineRow, {
  variants: { pressed: { true: "text-primary-ink" } },
});

export type MessageFrom = "user" | "assistant";
export type MessageRating = "good" | "bad" | "";

@customElement("ui-message")
export class UiMessage extends LightElement {
  @property() from: MessageFrom = "assistant";
  @property({ attribute: "copy-text" }) copyText = "";
  @property({ type: Boolean }) rateable = false;
  @property() rating: MessageRating = "";
  @property({ type: Boolean }) retryable = false;
  @property({ type: Boolean }) editable = false;
  @state() private _copied = false;

  private _fire(name: string, detail: object = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }

  private async _copy() {
    try {
      await navigator.clipboard.writeText(this.copyText);
      this._copied = true;
      setTimeout(() => (this._copied = false), 2000);
    } catch {}
  }

  private _rate(rating: Exclude<MessageRating, "">) {
    this.rating = this.rating === rating ? "" : rating;
    this._fire("ui-rate", { rating: this.rating });
  }

  private _action(label: string, icon: IconName, onClick: () => void, pressed?: boolean) {
    return html`<span class=${messageAction({ pressed })} data-tip=${label} data-tip-side="bottom">
      <button
        type="button"
        class=${iconButton({ size: "xs", shape: "square" })}
        aria-label=${label}
        aria-pressed=${pressed === undefined ? nothing : pressed ? "true" : "false"}
        @click=${onClick}
      >
        ${iconSvg(icon, { size: "sm" })}
      </button>
    </span>`;
  }

  render() {
    const actions = [
      this.copyText
        ? this._action(
            this._copied ? m.message_copied() : m.message_copy(),
            this._copied ? "check" : "copy",
            () => void this._copy(),
          )
        : nothing,
      this.editable ? this._action(m.message_edit(), "edit", () => this._fire("ui-edit")) : nothing,
      this.rateable
        ? html`${this._action(m.message_good_response(), "thumb-up", () => this._rate("good"), this.rating === "good")}
          ${this._action(m.message_bad_response(), "thumb-down", () => this._rate("bad"), this.rating === "bad")}`
        : nothing,
      this.retryable ? this._action(m.message_retry(), "retry", () => this._fire("ui-retry")) : nothing,
    ];
    const hasActions = !!(this.copyText || this.editable || this.rateable || this.retryable);
    return html`<div class=${message({ from: this.from })}>
      <div class=${messageBody({ from: this.from })}>${this.content}</div>
      ${hasActions ? html`<div class=${messageActions({ from: this.from })}>${actions}</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-message": UiMessage;
  }
}
