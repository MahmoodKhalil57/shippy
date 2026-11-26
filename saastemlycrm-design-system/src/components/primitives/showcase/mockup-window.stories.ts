import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./mockup-window.ts";
import "../typography/text.ts";
import "../typography/heading.ts";
import "../actions/button.ts";

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Showcase/Mockup window",
  component: "ui-mockup-window",
  args: { text: "Revenue grew 12% against the previous quarter.", variant: "bordered", centered: true, height: "sm" },
  argTypes: {
    text: { control: "text", description: "The window's content." },
    variant: { control: "inline-radio", options: ["bordered", "filled"] },
    centered: { control: "boolean" },
    height: { control: "inline-radio", options: [undefined, "sm", "md", "lg", "xl"] },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-mockup-window
      variant=${ifDefined(args.variant)}
      centered=${args.centered === true ? "true" : "false"}
      height=${ifDefined(args.height)}
    >
      <ui-text variant="body-md">${args.text}</ui-text>
    </ui-mockup-window>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the window frame." } } },
  play: async ({ canvas }) => {
    const text = canvas.getByText("Revenue grew 12% against the previous quarter.");
    await expect(text).toBeVisible();
    await expect(text.closest(".mockup-window")).not.toBeNull();
  },
});

export const FilledFitsContent = meta.story({
  name: "Filled, fits content",
  args: { variant: "filled", centered: false, height: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Revenue grew 12% against the previous quarter.")).toBeVisible();
  },
});

export const Variants = meta.story({
  name: "Variants",
  parameters: {
    docs: { description: { story: "A decorative browser-window frame for showing a screen inside a page." } },
    canvas: "column",
  },
  render: () => html`
    <ui-mockup-window variant="bordered" centered height="sm">
      <ui-text variant="body-md">Bordered: a rule under the title bar.</ui-text>
    </ui-mockup-window>
    <ui-mockup-window variant="filled" centered height="sm">
      <ui-text variant="body-md">Filled: the whole window on the surface colour.</ui-text>
    </ui-mockup-window>
  `,
});

export const Heights = meta.story({
  name: "Heights",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-mockup-window centered height="sm"><ui-text variant="label-lg">Small</ui-text></ui-mockup-window>
    <ui-mockup-window centered height="md"><ui-text variant="label-lg">Medium</ui-text></ui-mockup-window>
    <ui-mockup-window centered height="lg"><ui-text variant="label-lg">Large</ui-text></ui-mockup-window>
    <ui-mockup-window centered height="xl"><ui-text variant="label-lg">Extra large</ui-text></ui-mockup-window>
  `,
});

export const Content = meta.story({
  name: "Content",
  parameters: {
    docs: { description: { story: "Without centered or a height the window fits its content." } },
    canvas: "column",
  },
  render: () => html`
    <ui-mockup-window>
      <ui-heading level="3">Quarterly report</ui-heading>
      <ui-text variant="body-md" color="muted">Revenue grew 12% against the previous quarter.</ui-text>
      <ui-button color="primary" size="xs">Open report</ui-button>
    </ui-mockup-window>
  `,
});
