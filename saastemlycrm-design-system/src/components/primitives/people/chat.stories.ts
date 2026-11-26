import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./chat.ts";
import "./avatar.ts";
import type { ChatMessage } from "./chat.ts";

const photos = {
  ana: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M0 0H64V64H0Z' fill='%23c9d6f2'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%236d7fc4'/%3E%3Cpath d='M10 64C12 46 52 46 54 64Z' fill='%236d7fc4'/%3E%3C/svg%3E",
  omar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M0 0H64V64H0Z' fill='%23f2dcc9'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%23b4774a'/%3E%3Cpath d='M10 64C12 46 52 46 54 64Z' fill='%23b4774a'/%3E%3C/svg%3E",
};

const thread: ChatMessage[] = [
  { author: "Ana Silva", time: "09:12", avatar: photos.ana, text: "Hi, could you resend Invoice INV-0042?" },
  {
    author: "Omar Haddad",
    time: "09:14",
    avatar: photos.omar,
    placement: "end",
    color: "primary",
    text: "Of course, it is on its way now.",
    footer: "Delivered",
  },
  { author: "Ana Silva", time: "09:20", avatar: photos.ana, text: "Got it, thanks. Paying it today." },
  { placement: "end", color: "primary", text: "Great, have a good day.", footer: "Seen at 09:21" },
];

const partial: ChatMessage[] = [
  { author: "Ana Silva", text: "Is the order on its way?" },
  { time: "09:31", placement: "end", text: "Yes, it left this morning." },
];

const colours: NonNullable<ChatMessage["color"]>[] = [
  "neutral",
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
];

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/People/Chat",
  component: "ui-chat",
  args: {
    text: "Could we move the call to Thursday?",
    author: "Ana Silva",
    time: "10:02",
    avatar: undefined,
    footer: "",
    placement: "start",
    color: undefined,
    messages: [],
  },
  argTypes: {
    text: { control: "text", description: "The bubble's text (its content)." },
    author: { control: "text" },
    time: { control: "text" },
    avatar: { control: "text" },
    footer: { control: "text" },
    placement: { control: "inline-radio", options: ["start", "end"] },
    color: {
      control: "select",
      options: [undefined, "neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    messages: { control: "object" },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-chat
      author=${ifDefined(args.author as string | undefined)}
      time=${ifDefined(args.time)}
      avatar=${ifDefined(args.avatar)}
      footer=${ifDefined(args.footer as string | undefined)}
      placement=${ifDefined(args.placement)}
      color=${ifDefined(args.color)}
      .messages=${args.messages ?? []}
      >${args.text}</ui-chat
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the bubble; given messages, it renders a log." } },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Could we move the call to Thursday?")).toBeVisible();
    await expect(canvas.getByText("Ana Silva")).toBeVisible();
    await expect(canvas.getByText("10:02").tagName).toBe("TIME");
    await expect(canvas.queryByRole("log")).toBeNull();
  },
});

export const WithFooter = meta.story({
  name: "With footer",
  args: { footer: "Sent" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Sent")).toBeVisible();
  },
});

export const SentBubble = meta.story({
  name: "Sent bubble",
  args: { placement: "end", color: "secondary", author: "Omar Haddad", time: "10:05", text: "Thursday works for me." },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Thursday works for me.")).toBeVisible();
    await expect(canvas.getByText("Omar Haddad")).toBeVisible();
  },
});

export const MessageLog = meta.story({
  name: "Message log",
  args: { messages: thread, text: "" },
  play: async ({ canvas }) => {
    const log = canvas.getByRole("log");
    await expect(log).toHaveAttribute("aria-live", "polite");
    await expect(log).toHaveTextContent("Hi, could you resend Invoice INV-0042?");
    await expect(log).toHaveTextContent("Seen at 09:21");
  },
});

export const Conversation = meta.story({
  name: "Conversation",
  parameters: {
    docs: {
      description: { story: "Given messages, the chat renders as a polite live log, so new messages are announced." },
    },
    canvas: "column",
  },
  render: () => html`<ui-chat .messages=${thread}></ui-chat>`,
});

export const BubbleColours = meta.story({
  name: "Bubble colours",
  parameters: { canvas: "column" },
  render: () =>
    html`<ui-chat
      .messages=${colours.map((color, i): ChatMessage => ({
        color,
        placement: i % 2 ? "end" : "start",
        text: `A ${color} bubble.`,
      }))}
    ></ui-chat>`,
});

export const SingleMessage = meta.story({
  name: "Single message",
  parameters: {
    docs: {
      description: {
        story: "Without messages, one chat element is a single bubble built from its attributes and slots.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-chat author="Ana Silva" time="10:02" avatar=${photos.ana} footer="Sent">
      Could we move the call to Thursday?
    </ui-chat>
    <ui-chat placement="end" color="secondary" author="Omar Haddad" time="10:05">Thursday works for me.</ui-chat>
    <ui-chat>
      <ui-avatar slot="image" size="xs" initials="MT" alt="Mei Tanaka"></ui-avatar>
      <span slot="header">Mei Tanaka, typing in the quarterly report thread</span>
      I added the revenue chart.
      <span slot="footer">Edited</span>
    </ui-chat>
  `,
});

export const PartialHeaders = meta.story({
  name: "Partial headers",
  parameters: {
    docs: {
      description: {
        story: "The header shows only what is set: an author, a time, or nothing at all.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-chat .messages=${partial}></ui-chat>
    <ui-chat author="Omar Haddad">Thanks for the update.</ui-chat>
    <ui-chat placement="end" time="09:40">You are welcome.</ui-chat>
    <ui-chat>No header on this one.</ui-chat>
  `,
  play: async ({ canvas, canvasElement }) => {
    const log = canvas.getByRole("log");
    const [authorOnly, timeOnly] = log.querySelectorAll(".chat-header");
    await expect(authorOnly).toHaveTextContent("Ana Silva");
    await expect(authorOnly!.querySelector("time")).toBeNull();
    await expect(timeOnly!.querySelector("bdi")).toBeNull();
    await expect(timeOnly!.querySelector("time")).toHaveTextContent("09:31");
    const [, author, time, bare] = canvasElement.querySelectorAll("ui-chat");
    await expect(author!.querySelector("time")).toBeNull();
    await expect(author!.querySelector("bdi")).toHaveTextContent("Omar Haddad");
    await expect(time!.querySelector("bdi")).toBeNull();
    await expect(time!.querySelector("time")).toHaveTextContent("09:40");
    await expect(bare!.querySelector(".chat-header")).toBeNull();
    await expect(bare).toHaveTextContent("No header on this one.");
  },
});
