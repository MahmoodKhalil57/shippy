import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Message scroller: the scrolling thread of an AI conversation.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Conversation")
 *
 * Follows the newest content while the reader is at the live edge (a reply streaming in, a tool
 * line appearing), and leaves them where they are once they scroll up — then a "Jump to latest"
 * button appears. With `empty` (no messages yet) it shows its `slot="empty"` content (a welcome).
 */
export const messageScroller = rcva("relative flex min-h-0 flex-1 flex-col");
export const messageScrollerViewport = rcva(
  "flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain [--scrollbar-inset:var(--radius-box)]",
);
export const messageScrollerContent = rcva("flex flex-col gap-4 py-1");
/** The welcome; kept mounted (hidden) once there are messages. */
export const messageScrollerEmpty = rcva("m-auto flex max-w-xs flex-col items-center gap-2 py-6 text-center", {
  variants: { hidden: { true: "hidden" } },
});
export const messageScrollerJump = rcva(
  "absolute bottom-2 left-1/2 -translate-x-1/2 shadow-md [transition:opacity_var(--duration-short3)_var(--ease-emphasized-decelerate),translate_var(--duration-medium1)_var(--ease-emphasized-decelerate)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none",
);

/** How close to the bottom (px) still counts as "at the live edge". */
const EDGE = 48;

/**
 * @example
 * <ui-message-scroller>
 *   <div slot="empty">Ask me anything</div>
 *   <ui-message from="user">Hi</ui-message>
 *   <ui-message from="assistant"><ui-markdown .text=${reply}></ui-markdown></ui-message>
 * </ui-message-scroller>
 *
 * `busy` marks the thread as still being written (`aria-busy`). `scrollToEnd()` jumps to the
 * newest content (e.g. after the person sends a message).
 */
@customElement("ui-message-scroller")
export class UiMessageScroller extends LightElement {
  /** The conversation is still being written (a reply on its way). */
  @property({ type: Boolean }) busy = false;
  /** No messages yet: show the `slot="empty"` content. */
  @property({ type: Boolean }) empty = false;
  @state() private _away = false;
  @query("[data-viewport]") private _viewport?: HTMLElement;
  #follow = true;
  #resize = new ResizeObserver(() => this.#keepUp());
  #mutations = new MutationObserver(() => this.#keepUp());

  #keepUp() {
    if (this.#follow) this.scrollToEnd("instant");
  }

  /** Jump to the newest content and follow it again. */
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
    const content = this.querySelector("[data-content]");
    if (content) {
      this.#resize.observe(content);
      this.#mutations.observe(content, { childList: true, subtree: true, characterData: true });
    }
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
              class=${button({ size: "sm", shape: "circle", class: messageScrollerJump() })}
              aria-label="Jump to latest"
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
