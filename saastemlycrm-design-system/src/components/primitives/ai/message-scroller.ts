import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { scrollFocus } from "../../base/scroll-focus.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../lib/i18n/index.ts";

export const messageScroller = rcva("relative flex min-h-0 flex-1 flex-col");
export const messageScrollerViewport = rcva(
  "flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain py-1 [--scrollbar-inset:var(--radius-box)]",
);
export const messageScrollerContent = rcva("flex flex-col gap-4 py-1");
export const messageScrollerEmpty = rcva("m-auto flex max-w-xs flex-col items-center gap-2 py-6 text-center", {
  variants: { hidden: { true: "hidden" } },
});
export const messageScrollerJump = rcva(
  "absolute inset-x-0 bottom-2 mx-auto w-fit shadow-elevation-3 [transition:opacity_var(--duration-short3)_var(--ease-emphasized-decelerate),translate_var(--duration-medium1)_var(--ease-emphasized-decelerate)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none",
);

const EDGE = 48;

@customElement("ui-message-scroller")
export class UiMessageScroller extends LightElement {
  @property({ type: Boolean }) busy = false;
  @property({ type: Boolean }) empty = false;
  @state() private _away = false;
  @query("[data-viewport]") private _viewport?: HTMLElement;
  #follow = true;
  #resize = new ResizeObserver(() => this.#keepUp());
  #mutations = new MutationObserver(() => this.#keepUp());

  #keepUp() {
    if (this.#follow) this.scrollToEnd("instant");
  }

  scrollToEnd(behavior: ScrollBehavior = "smooth") {
    const v = this._viewport;
    if (!v) return;
    this.#follow = true;
    this._away = false;
    v.scrollTo({ top: v.scrollHeight, behavior });
  }

  private _onScroll = () => {
    const v = this._viewport!;
    const atEdge = v.scrollHeight - v.scrollTop - v.clientHeight < EDGE;
    this.#follow = atEdge;
    this._away = !atEdge;
  };

  protected firstUpdated() {
    const content = this.querySelector("[data-content]")!;
    this.#resize.observe(content);
    this.#mutations.observe(content, { childList: true, subtree: true, characterData: true });
    this.scrollToEnd("instant");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
    this.#mutations.disconnect();
  }

  render() {
    return html`<div class=${messageScroller()}>
      <div
        class=${messageScrollerViewport()}
        data-viewport
        role="log"
        aria-live="polite"
        aria-busy=${this.busy ? "true" : "false"}
        ${scrollFocus()}
        @scroll=${this._onScroll}
      >
        <div class=${messageScrollerContent()} data-content>
          <div class=${messageScrollerEmpty({ hidden: !this.empty })}>${this.slotted("empty")}</div>
          ${this.content}
        </div>
      </div>
      ${
        this._away
          ? html`<button
              type="button"
              class=${iconButton({ variant: "tonal", size: "xs", class: messageScrollerJump() })}
              aria-label=${m.message_scroller_jump()}
              @click=${() => this.scrollToEnd()}
            >
              ${iconSvg("arrow-down", { size: "sm" })}
            </button>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-message-scroller": UiMessageScroller;
  }
}
