import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./label.ts";
import "./text-input.ts";

const meta = preview.type<{ args: { content: string } }>().meta({
  title: "Primitives/Forms/Label",
  component: "ui-label",
  args: {
    content: "Purchase order reference",
    variant: "text",
    as: "label",
    for: "label-playground",
    text: "Purchase order reference",
  },
  argTypes: {
    content: { control: "text", description: "The label's content (its children)." },
    variant: { control: "inline-radio", options: ["text", "floating"] },
    as: { control: "inline-radio", options: ["label", "span", "p"] },
    for: { control: "text" },
    text: { control: "text", description: "Text shown by the floating variant." },
  },
  render: (args) => html`
    <ui-label
      variant=${ifDefined(args.variant)}
      as=${ifDefined(args.as)}
      for=${ifDefined(args.for)}
      text=${ifDefined(args.text)}
      >${args.content}</ui-label
    >
    <ui-text-input input-id="label-playground" width="full" placeholder="PO-0000"></ui-text-input>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the label; clicking it focuses the input it points at." } },
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Purchase order reference");
    await expect(input).toHaveAttribute("id", "label-playground");
    await userEvent.click(canvas.getByText("Purchase order reference"));
    await expect(input).toHaveFocus();
    await userEvent.type(input, "PO-4821");
    await expect(input).toHaveValue("PO-4821");
  },
});

export const AsSpan = meta.story({
  name: "As span",
  args: { as: "span", content: "Optional", for: undefined },
  play: async ({ canvas, userEvent }) => {
    const text = canvas.getByText("Optional");
    await expect(text.tagName).toBe("SPAN");
    await userEvent.click(text);
    await expect(canvas.getByRole("textbox", { name: "PO-0000" })).not.toHaveFocus();
  },
});

export const AsParagraph = meta.story({
  name: "As paragraph",
  args: { as: "p", content: "Prices include sales tax where it applies.", for: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Prices include sales tax where it applies.").tagName).toBe("P");
  },
});

export const TextLabel = meta.story({
  name: "Text label",
  parameters: {
    docs: { description: { story: "A text label points at its control with for, so clicking it focuses the input." } },
    canvas: "column",
  },
  render: () => html`
    <ui-label for="lb-reference">Purchase order reference</ui-label>
    <ui-text-input input-id="lb-reference" width="full" placeholder="PO-0000"></ui-text-input>
  `,
});

export const AsSpanOrParagraph = meta.story({
  name: "As span or paragraph",
  parameters: {
    docs: {
      description: {
        story: "When nothing is being labelled, render it as a span or a paragraph so it isn't announced as a label.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-label as="span">Optional</ui-label>
    <ui-label as="p">Prices include sales tax where it applies.</ui-label>
  `,
});

export const Floating = meta.story({
  name: "Floating",
  parameters: {
    docs: {
      description: {
        story:
          "A floating label shows its text inside the empty control and lifts it above once the control has a value or focus.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-label variant="floating" text="Company name">
      <ui-text-input width="full" placeholder="Company name"></ui-text-input>
    </ui-label>
    <ui-label variant="floating" text="City">
      <ui-text-input width="full" placeholder="City" value="Riverside"></ui-text-input>
    </ui-label>
  `,
});

export const WithoutFor = meta.story({
  name: "Without for",
  parameters: {
    docs: { description: { story: "Without for the label wraps its own control instead of pointing at one." } },
  },
  render: () => html`<ui-label><input type="checkbox" /> Send me a copy</ui-label>`,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: "Send me a copy" })).toBeInTheDocument();
    await expect(canvas.getByText("Send me a copy").closest("label")).not.toHaveAttribute("for");
  },
});
