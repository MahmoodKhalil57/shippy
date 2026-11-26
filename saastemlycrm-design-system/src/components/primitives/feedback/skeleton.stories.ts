import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./skeleton.ts";
import "../typography/text.ts";

const meta = preview.type<{ args: { content: string } }>().meta({
  title: "Primitives/Feedback/Skeleton",
  component: "ui-skeleton",
  args: {
    content: "Invoice INV-0042 is loading",
    text: false,
    shape: "line",
    width: "52",
    height: undefined,
    lines: 3,
    template: undefined,
  },
  argTypes: {
    content: { control: "text", description: "Slotted text, shown shimmering when text is on." },
    text: { control: "boolean" },
    shape: { control: "inline-radio", options: ["square", "circle", "line", "block"] },
    width: { control: "inline-radio", options: [undefined, "full", "20", "28", "32", "52"] },
    height: { control: "inline-radio", options: [undefined, "4", "16", "32"] },
    lines: { control: { type: "number", min: 1, max: 12, step: 1 } },
    template: { control: "inline-radio", options: [undefined, "circle", "rectangle"] },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-skeleton
      text=${args.text === true ? "true" : "false"}
      shape=${ifDefined(args.shape)}
      width=${ifDefined(args.width)}
      height=${ifDefined(args.height)}
      lines=${ifDefined(args.lines)}
      template=${ifDefined(args.template)}
      >${args.content}</ui-skeleton
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the skeleton; it stays aria-busy while shown." } },
  },
  play: async ({ canvasElement }) => {
    const busy = canvasElement.querySelector("ui-skeleton [aria-busy='true']");
    await expect(busy).not.toBeNull();
    await expect(busy!.querySelectorAll(".skeleton")).toHaveLength(3);
  },
});

export const ShimmeringText = meta.story({
  name: "Shimmering text",
  args: { text: true },
  play: async ({ canvas }) => {
    const words = canvas.getByText("Invoice INV-0042 is loading");
    await expect(words).toHaveAttribute("aria-busy", "true");
  },
});

export const CircleTemplate = meta.story({
  name: "Circle template",
  args: { template: "circle" },
  play: async ({ canvas }) => {
    const busy = canvas.getByRole("progressbar", { name: "Loading" });
    await expect(busy).toHaveAttribute("aria-busy", "true");
    await expect(busy!.querySelector(".rounded-full")).not.toBeNull();
  },
});

export const Shapes = meta.story({
  name: "Shapes",
  parameters: {
    docs: { description: { story: "Placeholders are aria-busy while content loads." } },
  },
  render: () => html`
    <ui-skeleton shape="square"></ui-skeleton>
    <ui-skeleton shape="circle"></ui-skeleton>
    <ui-skeleton shape="line" width="52"></ui-skeleton>
    <ui-skeleton shape="block" width="52"></ui-skeleton>
  `,
});

export const WidthsAndHeights = meta.story({
  name: "Widths and heights",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-skeleton shape="line" width="20"></ui-skeleton>
    <ui-skeleton shape="line" width="28"></ui-skeleton>
    <ui-skeleton shape="line" width="32"></ui-skeleton>
    <ui-skeleton shape="line" width="52"></ui-skeleton>
    <ui-skeleton shape="line" width="full"></ui-skeleton>
    <ui-skeleton shape="block" height="16"></ui-skeleton>
    <ui-skeleton shape="block" height="32"></ui-skeleton>
  `,
});

export const Lines = meta.story({
  name: "Lines",
  parameters: {
    docs: {
      description: { story: "With lines above 1 it stacks that many lines, the last one shorter, like a paragraph." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-skeleton lines="3"></ui-skeleton>
    <ui-skeleton lines="5" width="52"></ui-skeleton>
  `,
});

export const Templates = meta.story({
  name: "Templates",
  render: () => html`
    <ui-skeleton template="circle"></ui-skeleton>
    <ui-skeleton template="rectangle"></ui-skeleton>
  `,
});

export const TextShimmer = meta.story({
  name: "Text shimmer",
  parameters: { docs: { description: { story: "With text the slotted words keep their size and shimmer in place." } } },
  render: () => html`
    <ui-skeleton text><ui-text as="span" variant="title-lg">Quarterly report</ui-text></ui-skeleton>
    <ui-skeleton text>Invoice INV-0042 is loading</ui-skeleton>
  `,
});
