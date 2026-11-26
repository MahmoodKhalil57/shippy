import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import "./prompt-input.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";
import "../layout/box.ts";
import "../actions/icon-button.ts";
import "../actions/button.ts";

const field = (content: unknown) => html`<ui-box width="full" max="xl">${content}</ui-box>`;

const localized = (text: string) => text as LocalizedString;

const sample = { question: "Where is my parcel?", first: "Line one", second: "Line two" };

const meta = preview
  .type<{ args: { onSubmit: (e: CustomEvent<{ value: string }>) => void; onStop: () => void } }>()
  .meta({
    title: "Primitives/Ai/Prompt input",
    component: "ui-prompt-input",
    args: {
      value: "",
      placeholder: "Ask about an order",
      status: "ready",
      label: localized("Message the assistant"),
      onSubmit: fn(),
      onStop: fn(),
    },
    argTypes: {
      value: { control: "text" },
      placeholder: { control: "text" },
      status: { control: "inline-radio", options: ["ready", "busy"] },
      label: { control: "text", description: "The field's accessible name." },
      onSubmit: { table: { category: "events" } },
      onStop: { table: { category: "events" } },
    },
    render: (args) =>
      field(
        html`<ui-prompt-input
          value=${args.value}
          placeholder=${args.placeholder}
          status=${args.status}
          label=${args.label}
          @ui-submit=${args.onSubmit}
          @ui-stop=${args.onStop}
        ></ui-prompt-input>`,
      ),
  });

const submitted = (value: string) => expect.objectContaining({ detail: { value } });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the field; Enter and the send button submit its text." } },
    canvas: "column",
  },
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole("textbox", { name: "Message the assistant" });
    const send = canvas.getByRole("button", { name: "Send" });
    await expect(send).toBeDisabled();
    await userEvent.type(box, sample.question);
    await expect(send).toBeEnabled();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    await expect(args.onSubmit).toHaveBeenLastCalledWith(submitted(sample.question));
    await expect(box).toHaveValue("");
    await expect(send).toBeDisabled();
    await userEvent.type(box, sample.first);
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    await userEvent.type(box, sample.second);
    await expect(box).toHaveValue(`${sample.first}\n${sample.second}`);
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    await userEvent.click(send);
    await expect(args.onSubmit).toHaveBeenCalledTimes(2);
    await expect(args.onSubmit).toHaveBeenLastCalledWith(submitted(`${sample.first}\n${sample.second}`));
    await expect(box).toHaveValue("");
    await expect(args.onStop).not.toHaveBeenCalled();
  },
});

export const BlankDoesNotSend = meta.story({
  name: "Blank does not send",
  parameters: { canvas: "column" },
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole("textbox", { name: "Message the assistant" });
    await userEvent.type(box, "   {Enter}");
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
});

export const BusyCanStop = meta.story({
  name: "Busy can stop",
  args: { status: "busy", value: sample.question },
  parameters: { canvas: "column" },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();
    const box = canvas.getByRole("textbox", { name: "Message the assistant" });
    box.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(box).toHaveValue(sample.question);
    await userEvent.click(canvas.getByRole("button", { name: "Stop" }));
    await expect(args.onStop).toHaveBeenCalledOnce();
  },
});

export const Empty = meta.story({
  name: "Empty",
  parameters: {
    docs: {
      description: {
        story: "Send stays disabled until there is something to send; Enter sends and Shift+Enter adds a line.",
      },
    },
    canvas: "column",
  },
  render: () => field(html`<ui-prompt-input placeholder="Ask about an order"></ui-prompt-input>`),
});

export const WithADraft = meta.story({
  name: "With a draft",
  parameters: {
    docs: { description: { story: "The field grows with its text up to a few lines, then scrolls." } },
    canvas: "column",
  },
  render: () =>
    field(
      html`<ui-prompt-input
        placeholder="Ask about an order"
        value="Can you check whether order 10482 can still be sent to a different address?"
      ></ui-prompt-input>`,
    ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Message" })).toHaveValue(
      "Can you check whether order 10482 can still be sent to a different address?",
    );
    await expect(canvas.getByRole("button", { name: "Send" })).toBeEnabled();
  },
});

export const Busy = meta.story({
  name: "Busy",
  parameters: {
    docs: { description: { story: "While the assistant is answering, send becomes stop and new messages wait." } },
    canvas: "column",
  },
  render: () => field(html`<ui-prompt-input placeholder="Working on it" status="busy"></ui-prompt-input>`),
});

export const WithTools = meta.story({
  name: "With tools",
  parameters: { canvas: "column" },
  render: () =>
    field(
      html`<ui-prompt-input placeholder="Ask about an order" label="Message the assistant">
        <ui-icon-button slot="tools" icon="upload" label="Attach a file" size="xs"></ui-icon-button>
        <ui-icon-button slot="tools" icon="mic" label="Dictate" size="xs"></ui-icon-button>
        <ui-button slot="tools" variant="text" size="xs">Order 10482</ui-button>
      </ui-prompt-input>`,
    ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Message the assistant" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Attach a file" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Dictate" })).toBeVisible();
  },
});

export const FocusMethod = meta.story({
  name: "Focus method",
  parameters: { docs: { description: { story: "focus() moves focus into the field." } }, canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    const box = canvas.getByRole("textbox", { name: "Message the assistant" });
    await expect(box).not.toHaveFocus();
    canvasElement.querySelector("ui-prompt-input")!.focus();
    await expect(box).toHaveFocus();
    const unrendered = document.createElement("ui-prompt-input");
    await expect(() => unrendered.focus()).not.toThrow();
  },
});
