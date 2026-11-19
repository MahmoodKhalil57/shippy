import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Message: one turn of an AI conversation — the person's (a bubble, at the end) or the
 * assistant's (open text, full width), with its actions under it.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Message")
 *
 * Actions (each opt-in): copy the message (`copy-text`; the icon turns into a tick for 2 s),
 * rate it (`rateable`: good / bad, toggles), retry it (`retryable`), edit it (`editable`).
 */
export const message = rcva("group/message flex flex-col gap-1", {
  variants: {
    from: {
      user: "items-end",
      assistant: "items-start",
    },
  },
  defaultVariants: { from: "assistant" },
});
export const messageBody = rcva("text-sm", {
  variants: {
    from: {
      user: "max-w-[85%] rounded-box rounded-ee-field bg-base-200 px-3.5 py-2 [overflow-wrap:anywhere] whitespace-pre-line",
      assistant: "w-full",
    },
  },
  defaultVariants: { from: "assistant" },
});
/** The actions row: shown on hover / focus for the person's turns, always for the assistant's. */
export const messageActions = rcva("flex items-center gap-0.5 text-base-content/75", {
  variants: {
    from: {
      user: "opacity-0 transition-opacity duration-(--duration-effects) group-hover/message:opacity-100 group-focus-within/message:opacity-100 motion-reduce:transition-none",
      assistant: "",
    },
  },
});
export const messageAction = rcva("tooltip tooltip-bottom", {
  variants: { pressed: { true: "text-primary-ink" } },
});

export type MessageFrom = "user" | "assistant";
export type MessageRating = "good" | "bad" | "";

/**
 * @example <ui-message from="user" copy-text="Who owes us money?" editable>Who owes us money?</ui-message>
 * @example
 * <ui-message from="assistant" .copyText=${answer} rateable retryable
 *   @ui-rate=${(e) => …} @ui-retry=${() => …}>
 *   <ui-markdown .text=${answer}></ui-markdown>
 * </ui-message>
 *
 * Events: `ui-rate` { rating }, `ui-retry`, `ui-edit` (all bubble).
 */
@customElement("ui-message")
export class UiMessage extends LightElement {
  @property() from: MessageFrom = "assistant";
  /** Text the copy action copies (no copy action without it). */
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
    } catch {
      /* clipboard refused (not focused / no permission) */
    }
  }

  private _rate(rating: Exclude<MessageRating, "">) {
    this.rating = this.rating === rating ? "" : rating;
    this._fire("ui-rate", { rating: this.rating });
  }

  private _action(label: string, icon: IconName, onClick: () => void, pressed?: boolean) {
    return html`<span class=${messageAction({ pressed })} data-tip=${label}>
      <button
        type="button"
        class=${button({ variant: "ghost", size: "xs", shape: "square" })}
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
        ? this._action(this._copied ? "Copied" : "Copy", this._copied ? "check" : "copy", () => void this._copy())
        : nothing,
      this.editable ? this._action("Edit", "edit", () => this._fire("ui-edit")) : nothing,
      this.rateable
        ? html`${this._action("Good response", "thumb-up", () => this._rate("good"), this.rating === "good")}
          ${this._action("Bad response", "thumb-down", () => this._rate("bad"), this.rating === "bad")}`
        : nothing,
      this.retryable ? this._action("Retry", "retry", () => this._fire("ui-retry")) : nothing,
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
