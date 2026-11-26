import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./divider.ts";
import "./flex.ts";
import "./box.ts";

const block = (label: string) =>
  html`<ui-box surface="base-200" rounded="field" padding="4" width="full">${label}</ui-box>`;

const tall = (label: string) => html`<ui-box surface="base-200" rounded="field" padding="8">${label}</ui-box>`;

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Layout/Divider",
  component: "ui-divider",
  args: {
    text: "Or continue with",
    direction: "vertical",
    placement: "center",
  },
  argTypes: {
    text: { control: "text", description: "An optional label inside the line (its content)." },
    direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
    placement: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  render: (args) => html`
    <ui-flex direction=${args.direction === "horizontal" ? "row" : "col"}>
      ${tall("Before")}
      <ui-divider direction=${ifDefined(args.direction)} placement=${ifDefined(args.placement)}
        >${args.text}</ui-divider
      >
      ${tall("After")}
    </ui-flex>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the divider and the content around it." } } },
  play: async ({ canvas }) => {
    const separator = canvas.getByRole("separator");
    await expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    await expect(separator).toHaveTextContent("Or continue with");
  },
});

export const Upright = meta.story({
  name: "Upright",
  args: { direction: "horizontal", text: "or" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  },
});

export const Unlabelled = meta.story({
  name: "Unlabelled",
  args: { text: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("separator")).toHaveTextContent(/^\s*$/);
  },
});

export const BetweenStackedContent = meta.story({
  name: "Between stacked content",
  parameters: {
    docs: { description: { story: "By default the line runs across, separating content above from content below." } },
    canvas: "column",
  },
  render: () => html`
    <ui-flex direction="col">${block("Order details")}<ui-divider></ui-divider>${block("Delivery address")}</ui-flex>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
  },
});

export const WithALabel = meta.story({
  name: "With a label",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-flex direction="col">
      <ui-divider placement="start">Start</ui-divider>
      <ui-divider>Or continue with</ui-divider>
      <ui-divider placement="end">End</ui-divider>
    </ui-flex>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("separator")).toHaveLength(3);
  },
});

export const BetweenSideBySideContent = meta.story({
  name: "Between side-by-side content",
  parameters: {
    docs: {
      description: { story: "The horizontal direction lays content out in a row, so the line itself stands upright." },
    },
  },
  render: () => html`
    <ui-flex>${tall("Shipped")}<ui-divider direction="horizontal"></ui-divider>${tall("Delivered")}</ui-flex>
    <ui-flex>${tall("Card")}<ui-divider direction="horizontal">or</ui-divider>${tall("Transfer")}</ui-flex>
  `,
  play: async ({ canvas }) => {
    for (const separator of canvas.getAllByRole("separator")) {
      await expect(separator).toHaveAttribute("aria-orientation", "vertical");
    }
  },
});
