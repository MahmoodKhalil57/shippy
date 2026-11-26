import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "./message-scroller.ts";
import "./message.ts";
import "./suggestions.ts";
import "../layout/box.ts";
import "../layout/flex.ts";
import "../actions/button.ts";
import "../media/icon.ts";
import "../typography/text.ts";

const thread = [
  ["user", "Hi, I'd like to check on order 10482."],
  ["assistant", "Of course. Order 10482 was placed on Monday and paid by card."],
  ["user", "Has it shipped yet?"],
  ["assistant", "Yes, it left the warehouse yesterday afternoon and is with the carrier now."],
  ["user", "When will it arrive?"],
  ["assistant", "The carrier expects to deliver it on Thursday, between 9am and 1pm."],
  ["user", "Can I change the delivery address?"],
  [
    "assistant",
    "Not any more, because the parcel is already on its way. I can ask the carrier to hold it at a nearby pickup point instead.",
  ],
  ["user", "Yes, please do that."],
  ["assistant", "Done. You'll get a message with the pickup point's address and opening hours once it arrives there."],
] as const;

const replies = [
  "Is there anything else I can help with?",
  "The pickup point holds parcels for seven days.",
  "You'll need the code from the message to collect it.",
];

const messages = () => thread.map(([from, text]) => html`<ui-message from=${from}>${text}</ui-message>`);

const bounded = (content: unknown) =>
  html`<ui-box border rounded="box" height="80" padding="3">
    <ui-flex direction="col" full-height>${content}</ui-flex>
  </ui-box>`;

let replied = 0;
const addReply = (e: Event) => {
  const content = (e.currentTarget as Element).parentElement?.querySelector("[data-content]");
  const message = document.createElement("ui-message");
  message.textContent = replies[replied++ % replies.length]!;
  content?.append(message);
};

const sample = { reply: "Your refund is on its way and should reach the card within five days." };

const appendReply = (e: Event) => {
  const content = (e.currentTarget as Element).parentElement?.querySelector("[data-content]");
  const message = document.createElement("ui-message");
  message.textContent = sample.reply;
  content?.append(message);
};

const atEnd = (log: HTMLElement) => log.scrollHeight - log.scrollTop - log.clientHeight < 2;

const meta = preview.type<{ args: { count: number } }>().meta({
  title: "Primitives/Ai/Message scroller",
  component: "ui-message-scroller",
  args: {
    count: 10,
    busy: false,
    empty: false,
  },
  argTypes: {
    count: { control: { type: "number", min: 0, max: 10, step: 1 }, description: "How many messages the thread has." },
  },
  render: (args) => html`
    <ui-flex direction="col" gap="2">
      ${bounded(
        html`<ui-message-scroller ?busy=${args.busy} ?empty=${args.empty}>
          <ui-text slot="empty" color="muted">No messages yet.</ui-text>
          ${messages().slice(0, args.count)}
        </ui-message-scroller>`,
      )}
      <ui-button variant="tonal" @click=${appendReply}>Add a reply</ui-button>
    </ui-flex>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the scroller; adding a reply keeps the newest in view." } },
    canvas: "column",
  },
  play: async ({ canvas, userEvent }) => {
    const log = canvas.getByRole("log");
    await expect(log).toHaveAttribute("aria-live", "polite");
    await expect(log).toHaveAttribute("aria-busy", "false");
    await waitFor(() => expect(atEnd(log)).toBe(true));
    await userEvent.click(canvas.getByRole("button", { name: "Add a reply" }));
    const reply = await canvas.findByText(sample.reply);
    await expect(log).toContainElement(reply);
    await waitFor(() => expect(atEnd(log)).toBe(true));
    const box = log.getBoundingClientRect();
    const own = reply.getBoundingClientRect();
    await expect(own.bottom).toBeLessThanOrEqual(box.bottom + 1);
    await expect(own.top).toBeGreaterThanOrEqual(box.top - 1);
  },
});

export const JumpToLatest = meta.story({
  name: "Jump to latest",
  parameters: { canvas: "column" },
  play: async ({ canvas, userEvent }) => {
    const log = canvas.getByRole("log");
    await waitFor(() => expect(atEnd(log)).toBe(true));
    await expect(canvas.queryByRole("button", { name: "Jump to latest" })).not.toBeInTheDocument();
    await waitFor(() => expect(log).toHaveAttribute("tabindex", "0"));
    log.focus();
    await expect(log).toHaveFocus();
    log.scrollTop = 0;
    const jump = await canvas.findByRole("button", { name: "Jump to latest" });
    await userEvent.click(jump);
    await waitFor(() => expect(atEnd(log)).toBe(true));
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Jump to latest" })).not.toBeInTheDocument());
  },
});

export const BusyLog = meta.story({
  name: "Busy log",
  args: { busy: true, count: 3 },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("log")).toHaveAttribute("aria-busy", "true");
  },
});

export const NoMessages = meta.story({
  name: "No messages",
  args: { empty: true, count: 0 },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No messages yet.")).toBeVisible();
    await expect(canvas.getByRole("log")).not.toHaveAttribute("tabindex");
    const unrendered = document.createElement("ui-message-scroller");
    await expect(() => unrendered.scrollToEnd()).not.toThrow();
    await expect(unrendered.childElementCount).toBe(0);
  },
});

export const Conversation = meta.story({
  name: "Conversation",
  parameters: {
    docs: {
      description: {
        story: "It opens at the newest message and follows new ones; scroll up and a button jumps back down.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-flex direction="col" gap="2">
      ${bounded(html`<ui-message-scroller>${messages()}</ui-message-scroller>`)}
      <ui-button variant="tonal" @click=${addReply}>Add a reply</ui-button>
    </ui-flex>
  `,
});

export const Busy = meta.story({
  name: "Busy",
  parameters: {
    docs: {
      description: { story: "Busy marks the log as still being written, so screen readers wait for the full answer." },
    },
    canvas: "column",
  },
  render: () => bounded(html`<ui-message-scroller busy>${messages().slice(0, 3)}</ui-message-scroller>`),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("log")).toHaveAttribute("aria-busy", "true");
  },
});

export const Empty = meta.story({
  name: "Empty",
  parameters: { canvas: "column" },
  render: () =>
    bounded(
      html`<ui-message-scroller empty>
        <ui-flex slot="empty" direction="col" align="center" gap="3">
          <ui-icon name="assistant" size="xl" color="primary"></ui-icon>
          <ui-text emphasized>Ask about an order</ui-text>
          <ui-text variant="body-md" color="muted" align="center"
            >Check where a parcel is, change a delivery or start a return.</ui-text
          >
          <ui-suggestions wrap .items=${["Where is my order?", "Start a return", "Change my address"]}></ui-suggestions>
        </ui-flex>
      </ui-message-scroller>`,
    ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ask about an order")).toBeVisible();
    await expect(canvas.getByRole("group", { name: "Suggestions" })).toBeVisible();
  },
});
