import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./progress.ts";

const meta = preview.meta({
  title: "Primitives/Data/Progress",
  component: "ui-progress",
  parameters: { canvas: "column" },
  args: {
    value: 18,
    max: 24,
    indeterminate: false,
    width: "full",
    label: "Invoices sent",
  },
  argTypes: {
    value: { control: { type: "number", min: 0, step: 1 } },
    max: { control: { type: "number", min: 1, step: 1 } },
    indeterminate: { control: "boolean" },
    width: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "full"] },
    label: { control: "text" },
  },
  render: (args) => html`
    <ui-progress
      value=${ifDefined(args.value)}
      max=${ifDefined(args.max)}
      ?indeterminate=${args.indeterminate}
      width=${ifDefined(args.width)}
      label=${ifDefined(args.label)}
    ></ui-progress>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the bar." } } },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Invoices sent" });
    await expect(bar).toHaveAttribute("value", "18");
    await expect(bar).toHaveAttribute("max", "24");
  },
});

export const Empty = meta.story({
  name: "Empty",
  args: { value: 0, max: 100, label: "Orders packed" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: "Orders packed" })).toHaveAttribute("value", "0");
  },
});

export const Complete = meta.story({
  name: "Complete",
  args: { value: 100, max: 100, label: "Orders packed" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: "Orders packed" })).toHaveAttribute("value", "100");
  },
});

export const IndeterminateArgs = meta.story({
  name: "Indeterminate with a value",
  args: { indeterminate: true, value: 40, label: "Syncing contacts" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: "Syncing contacts" })).not.toHaveAttribute("value");
  },
});

export const Values = meta.story({
  name: "Values",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-progress value="0" label="Orders packed"></ui-progress>
    <ui-progress value="35" label="Orders packed"></ui-progress>
    <ui-progress value="72" label="Orders packed"></ui-progress>
    <ui-progress value="100" label="Orders packed"></ui-progress>
  `,
});

export const CustomMax = meta.story({
  name: "Custom max",
  parameters: {
    docs: { description: { story: "The bar reads value against max, here 18 of 24 invoices sent." } },
    canvas: "column",
  },
  render: () => html`<ui-progress value="18" max="24" label="Invoices sent"></ui-progress>`,
});

export const Widths = meta.story({
  name: "Widths",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-progress width="xs" value="60" label="Import"></ui-progress>
    <ui-progress width="sm" value="60" label="Import"></ui-progress>
    <ui-progress width="md" value="60" label="Import"></ui-progress>
    <ui-progress width="lg" value="60" label="Import"></ui-progress>
    <ui-progress width="full" value="60" label="Import"></ui-progress>
  `,
});

export const Indeterminate = meta.story({
  name: "Indeterminate",
  parameters: {
    docs: { description: { story: "Indeterminate drops the value, so the bar animates and has no reading." } },
    canvas: "column",
  },
  render: () => html`
    <ui-progress indeterminate label="Syncing contacts"></ui-progress>
    <ui-progress width="sm" indeterminate value="40" label="Syncing contacts"></ui-progress>
  `,
});
