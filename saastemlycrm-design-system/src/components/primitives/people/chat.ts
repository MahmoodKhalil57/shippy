import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

export const chat = rcva("chat", {
  variants: {
    placement: {
      start: "chat-start",
      end: "chat-end",
    },
  },
  defaultVariants: { placement: "start" },
});

export const chatBubble = rcva("chat-bubble", {
  variants: {
    color: {
      neutral: "chat-bubble-neutral",
      primary: "chat-bubble-primary",
      secondary: "chat-bubble-secondary",
      accent: "chat-bubble-accent",
      info: "chat-bubble-info",
      success: "chat-bubble-success",
      warning: "chat-bubble-warning",
      error: "chat-bubble-error",
    },
  },
});

export const chatImage = rcva("chat-image avatar");
export const chatHeader = rcva("chat-header");
export const chatFooter = rcva("chat-footer opacity-50");
export const chatAvatar = rcva("w-10 rounded-full");
export const chatTime = rcva("min-w-0 [overflow-wrap:anywhere] text-body-sm text-on-surface-variant");
export const chatLog = rcva("w-full");

export type ChatVariants = VariantProps<typeof chat> & VariantProps<typeof chatBubble>;

export interface ChatMessage {
  text: Renderable;
  placement?: ChatVariants["placement"];
  color?: ChatVariants["color"];
  author?: Renderable;
  time?: string;
  avatar?: string;
  footer?: Renderable;
}

export const chatTemplate = (m: ChatMessage) =>
  html`<div class=${chat({ placement: m.placement })}>
    ${
      m.avatar
        ? html`<div class=${chatImage()}>
            <div class=${chatAvatar()}><img alt="" src=${m.avatar} /></div>
          </div>`
        : nothing
    }
    ${
      m.author || m.time
        ? html`<div class=${chatHeader()}>
            ${m.author ? html`<bdi>${m.author}</bdi>` : nothing}
            ${m.time ? html`<time class=${chatTime()}>${m.time}</time>` : nothing}
          </div>`
        : nothing
    }
    <div class=${chatBubble({ color: m.color })}>${m.text}</div>
    ${m.footer ? html`<div class=${chatFooter()}>${m.footer}</div>` : nothing}
  </div>`;

@customElement("ui-chat")
export class UiChat extends LightElement {
  @property({ attribute: false }) messages: ChatMessage[] = [];
  @property() placement: ChatVariants["placement"];
  @property() color: ChatVariants["color"];
  @property() author: Renderable = "";
  @property() time?: string;
  @property() avatar?: string;
  @property() footer: Renderable = "";

  render() {
    if (this.messages.length) {
      return html`<div class=${chatLog()} role="log" aria-live="polite">
        ${repeat(
          this.messages,
          (_, i) => i,
          (m) => chatTemplate(m),
        )}
      </div>`;
    }
    return html`<div class=${chat({ placement: this.placement })}>
      ${
        this.hasSlotted("image")
          ? html`<div class=${chatImage()}>${this.slotted("image")}</div>`
          : this.avatar
            ? html`<div class=${chatImage()}>
                <div class=${chatAvatar()}><img alt="" src=${this.avatar} /></div>
              </div>`
            : nothing
      }
      ${
        this.hasSlotted("header")
          ? html`<div class=${chatHeader()}>${this.slotted("header")}</div>`
          : this.author || this.time
            ? html`<div class=${chatHeader()}>
                ${this.author ? html`<bdi>${this.author}</bdi>` : nothing}
                ${this.time ? html`<time class=${chatTime()}>${this.time}</time>` : nothing}
              </div>`
            : nothing
      }
      <div class=${chatBubble({ color: this.color })}>${this.slotted()}</div>
      ${
        this.hasSlotted("footer")
          ? html`<div class=${chatFooter()}>${this.slotted("footer")}</div>`
          : this.footer
            ? html`<div class=${chatFooter()}>${this.footer}</div>`
            : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-chat": UiChat;
  }
}
