import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./tag.ts";

const meta = preview.meta({
  title: "Primitives/Data/Tag",
  component: "ui-tag",
  args: {
    label: "Shipped",
    tone: "success",
    variant: "soft",
    size: "md",
    icon: "check",
    hue: undefined,
  },
  argTypes: {
    label: { control: "text" },
    tone: { control: "select", options: ["neutral", "primary", "info", "success", "warning", "error"] },
    variant: { control: "inline-radio", options: ["soft", "outline"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    icon: { control: "select", options: [undefined, "check", "warning", "truck", "calendar"] },
    hue: { control: { type: "number", min: 0, max: 11, step: 1 } },
  },
  render: (args) => html`
    <ui-tag
      label=${ifDefined(args.label)}
      tone=${ifDefined(args.tone)}
      variant=${ifDefined(args.variant)}
      size=${ifDefined(args.size)}
      icon=${ifDefined(args.icon)}
      hue=${ifDefined(args.hue)}
    ></ui-tag>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the tag." } } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Shipped")).toBeVisible();
    await expect(canvasElement.querySelector("ui-tag svg")).not.toBeNull();
  },
});

export const NoIcon = meta.story({
  name: "Without icon",
  args: { icon: undefined, tone: "warning", label: "Due soon" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Due soon")).toBeVisible();
    await expect(canvasElement.querySelector("ui-tag svg")).toBeNull();
  },
});

export const WrappedHue = meta.story({
  name: "Hue wraps",
  args: { hue: 7, icon: undefined, label: "Software" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Software")).toBeVisible();
  },
});

export const Tones = meta.story({
  name: "Tones",
  render: () => html`
    <ui-tag label="Draft"></ui-tag>
    <ui-tag tone="primary" label="Active"></ui-tag>
    <ui-tag tone="info" label="Scheduled"></ui-tag>
    <ui-tag tone="success" label="Paid"></ui-tag>
    <ui-tag tone="warning" label="Due soon"></ui-tag>
    <ui-tag tone="error" label="Overdue"></ui-tag>
  `,
});

export const Outline = meta.story({
  name: "Outline",
  render: () => html`
    <ui-tag variant="outline" label="Draft"></ui-tag>
    <ui-tag variant="outline" tone="primary" label="Active"></ui-tag>
    <ui-tag variant="outline" tone="info" label="Scheduled"></ui-tag>
    <ui-tag variant="outline" tone="success" label="Paid"></ui-tag>
    <ui-tag variant="outline" tone="warning" label="Due soon"></ui-tag>
    <ui-tag variant="outline" tone="error" label="Overdue"></ui-tag>
  `,
});

export const SizesAndIcons = meta.story({
  name: "Sizes and icons",
  render: () => html`
    <ui-tag size="sm" tone="success" icon="check" label="Shipped"></ui-tag>
    <ui-tag size="md" tone="success" icon="check" label="Shipped"></ui-tag>
    <ui-tag size="sm" tone="warning" icon="warning" label="Low stock"></ui-tag>
    <ui-tag size="md" tone="warning" icon="warning" label="Low stock"></ui-tag>
    <ui-tag size="md" tone="info" icon="truck" label="In transit"></ui-tag>
    <ui-tag size="md" icon="calendar" label="Due 14 March"></ui-tag>
  `,
});

export const Hues = meta.story({
  name: "Hues",
  parameters: {
    docs: {
      description: {
        story: "A hue picks one of six chart colours and overrides the tone; it wraps, so 6 is the same as 0.",
      },
    },
  },
  render: () => html`
    <ui-tag hue="0" label="Hardware"></ui-tag>
    <ui-tag hue="1" label="Software"></ui-tag>
    <ui-tag hue="2" label="Services"></ui-tag>
    <ui-tag hue="3" label="Support"></ui-tag>
    <ui-tag hue="4" label="Training"></ui-tag>
    <ui-tag hue="5" label="Licensing"></ui-tag>
    <ui-tag hue="6" tone="error" label="Hardware again"></ui-tag>
  `,
});

export const SlottedContentAndWrapping = meta.story({
  name: "Slotted content and wrapping",
  render: () => html`
    <ui-tag tone="primary"><strong>Key account</strong></ui-tag>
    <ui-tag tone="info" size="md"
      >Awaiting approval from the finance team before the purchase order can be released</ui-tag
    >
  `,
});
