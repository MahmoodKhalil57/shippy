import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, spyOn } from "storybook/test";
import "./message.ts";
import "./markdown.ts";

const text = {
  question: "Where is my order 10482? It was supposed to arrive yesterday.",
  reply: `Order **10482** left the warehouse on Monday and is with the carrier now.

- Expected delivery: **Thursday**, between 9am and 1pm.
- The delay came from a missed connection at the sorting hub.`,
  plain: "Order 10482 is with the carrier and should arrive on Thursday morning.",
};

const rated = (rating: string) => expect.objectContaining({ detail: { rating } });

const meta = preview
  .type<{
    args: {
      text: string;
      onRate: (e: CustomEvent<{ rating: string }>) => void;
      onRetry: () => void;
      onEdit: () => void;
    };
  }>()
  .meta({
    title: "Primitives/Ai/Message",
    component: "ui-message",
    args: {
      text: text.plain,
      from: "assistant",
      copyText: text.plain,
      rateable: true,
      rating: "",
      retryable: true,
      editable: false,
      onRate: fn(),
      onRetry: fn(),
      onEdit: fn(),
    },
    argTypes: {
      text: { control: "text", description: "The message (its content)." },
      from: { control: "inline-radio", options: ["user", "assistant"] },
      copyText: { control: "text", description: "Text the copy action copies; empty hides it." },
      rating: { control: "inline-radio", options: ["", "good", "bad"] },
      onRate: { table: { category: "events" } },
      onRetry: { table: { category: "events" } },
      onEdit: { table: { category: "events" } },
    },
    render: (args) =>
      html`<ui-message
        from=${args.from}
        copy-text=${args.copyText}
        ?rateable=${args.rateable}
        rating=${args.rating}
        ?retryable=${args.retryable}
        ?editable=${args.editable}
        @ui-rate=${args.onRate}
        @ui-retry=${args.onRetry}
        @ui-edit=${args.onEdit}
        >${args.text}</ui-message
      >`,
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the message; rating, retry and edit fire their events." } },
    canvas: "column",
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText(text.plain)).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Copy" })).toBeVisible();
    const good = canvas.getByRole("button", { name: "Good response" });
    const bad = canvas.getByRole("button", { name: "Bad response" });
    await expect(good).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(good);
    await expect(args.onRate).toHaveBeenLastCalledWith(rated("good"));
    await expect(good).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(bad);
    await expect(args.onRate).toHaveBeenLastCalledWith(rated("bad"));
    await expect(bad).toHaveAttribute("aria-pressed", "true");
    await expect(good).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(bad);
    await expect(args.onRate).toHaveBeenLastCalledWith(rated(""));
    await expect(bad).toHaveAttribute("aria-pressed", "false");
    await expect(args.onRate).toHaveBeenCalledTimes(3);
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
    await expect(canvas.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
  },
});

export const CopyToClipboard = meta.story({
  name: "Copy to clipboard",
  args: { rateable: false, retryable: false },
  parameters: {
    docs: { description: { story: "Copy writes the copy text and shows Copied until its timing animation ends." } },
    canvas: "column",
  },
  play: async ({ canvas, userEvent, canvasElement }) => {
    const write = spyOn(navigator.clipboard, "writeText");
    try {
      write.mockResolvedValue(undefined);
      await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
      await expect(write).toHaveBeenCalledWith(text.plain);
      await expect(await canvas.findByRole("button", { name: "Copied" })).toBeVisible();
      for (const a of canvasElement.querySelector("ui-message")!.getAnimations()) a.finish();
      await expect(await canvas.findByRole("button", { name: "Copy" })).toBeVisible();
      write.mockRejectedValue(new Error("denied"));
      await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
      await expect(write).toHaveBeenCalledTimes(2);
      await expect(canvas.getByRole("button", { name: "Copy" })).toBeVisible();
      await expect(canvas.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
    } finally {
      write.mockRestore();
    }
  },
});

export const FromThePerson = meta.story({
  name: "From the person",
  args: {
    from: "user",
    text: text.question,
    copyText: text.question,
    rateable: false,
    retryable: false,
    editable: true,
  },
  parameters: { canvas: "column" },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.queryByRole("button", { name: "Good response" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
    await expect(args.onEdit).toHaveBeenCalledOnce();
  },
});

export const NoActions = meta.story({
  name: "No actions",
  args: { copyText: "", rateable: false, retryable: false },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(text.plain)).toBeVisible();
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
});

export const RatedGood = meta.story({
  name: "Rated good",
  args: { rating: "good", retryable: false },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Good response" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Bad response" })).toHaveAttribute("aria-pressed", "false");
  },
});

export const FromThePersonAndTheAssistant = meta.story({
  name: "From the person and the assistant",
  parameters: {
    docs: {
      description: { story: "The person's messages sit at the end in a bubble; the assistant's take the full width." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-message from="user">${text.question}</ui-message>
    <ui-message from="assistant"><ui-markdown .text=${text.reply}></ui-markdown></ui-message>
  `,
});

export const AssistantActions = meta.story({
  name: "Assistant actions",
  parameters: {
    docs: { description: { story: "Copy, rate and retry appear only when set; pressing a rating again clears it." } },
    canvas: "column",
  },
  render: () => html`
    <ui-message copy-text=${text.plain} rateable retryable>${text.plain}</ui-message>
    <ui-message copy-text=${text.plain} rateable rating="good">${text.plain}</ui-message>
    <ui-message copy-text=${text.plain} rateable rating="bad" retryable>${text.plain}</ui-message>
  `,
});

export const PersonSActions = meta.story({
  name: "Person's actions",
  parameters: {
    docs: {
      description: {
        story: "On the person's messages the actions stay hidden until the message is hovered or focused.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-message from="user" copy-text=${text.question} editable>${text.question}</ui-message>`,
});
