import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./badge.ts";

const meta = preview.meta({
  title: "Primitives/Data/Badge",
  component: "ui-badge",
  args: {
    count: 12,
    max: 99,
    showZero: false,
    dot: false,
    tone: "primary",
    label: "12 unread messages",
  },
  argTypes: {
    count: { control: { type: "number", min: 0, step: 1 } },
    max: { control: { type: "number", min: 1, step: 1 } },
    showZero: { control: "boolean" },
    dot: { control: "boolean" },
    tone: { control: "select", options: ["neutral", "primary", "info", "success", "warning", "error"] },
    label: { control: "text" },
  },
  render: (args) => html`
    <ui-badge
      count=${ifDefined(args.count)}
      max=${ifDefined(args.max)}
      ?show-zero=${args.showZero}
      ?dot=${args.dot}
      tone=${ifDefined(args.tone)}
      label=${ifDefined(args.label)}
    ></ui-badge>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the badge." } } },
  play: async ({ canvas }) => {
    const badge = canvas.getByLabelText("12 unread messages");
    await expect(badge).toHaveTextContent("12");
  },
});

export const OverMax = meta.story({
  name: "Over max",
  args: { count: 1250, max: 999, label: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("999+")).toHaveTextContent("999+");
  },
});

export const ZeroHidden = meta.story({
  name: "Zero hidden",
  args: { count: 0, label: undefined },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-badge span")).toBeNull();
  },
});

export const ZeroShown = meta.story({
  name: "Zero shown",
  args: { count: 0, showZero: true, label: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("0")).toHaveTextContent("0");
  },
});

export const DotStatus = meta.story({
  name: "Dot",
  args: { dot: true, tone: "success", label: "Paid" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Paid" })).toBeInTheDocument();
  },
});

export const Tones = meta.story({
  name: "Tones",
  render: () => html`
    <ui-badge count="3"></ui-badge>
    <ui-badge count="3" tone="primary"></ui-badge>
    <ui-badge count="3" tone="info"></ui-badge>
    <ui-badge count="3" tone="success"></ui-badge>
    <ui-badge count="3" tone="warning"></ui-badge>
    <ui-badge count="3" tone="error"></ui-badge>
  `,
});

export const Counts = meta.story({
  name: "Counts",
  parameters: {
    docs: {
      description: {
        story:
          "Above max the count reads as max followed by a plus sign; zero renders nothing unless show-zero is set.",
      },
    },
  },
  render: () => html`
    <ui-badge count="7" tone="primary"></ui-badge>
    <ui-badge count="42" tone="primary"></ui-badge>
    <ui-badge count="128" tone="primary"></ui-badge>
    <ui-badge count="1250" max="999" tone="primary"></ui-badge>
    <ui-badge count="0" tone="neutral"></ui-badge>
    <ui-badge count="0" show-zero tone="neutral"></ui-badge>
  `,
});

export const Dots = meta.story({
  name: "Dots",
  parameters: { docs: { description: { story: "A dot is an image with its label as the accessible name." } } },
  render: () => html`
    <ui-badge dot label="Draft"></ui-badge>
    <ui-badge dot tone="primary" label="Active"></ui-badge>
    <ui-badge dot tone="info" label="Scheduled"></ui-badge>
    <ui-badge dot tone="success" label="Paid"></ui-badge>
    <ui-badge dot tone="warning" label="Due soon"></ui-badge>
    <ui-badge dot tone="error" label="Overdue"></ui-badge>
  `,
});

export const AccessibleLabel = meta.story({
  name: "Accessible label",
  render: () => html`
    <ui-badge count="5" tone="error" label="5 overdue invoices"></ui-badge>
    <ui-badge count="12" tone="info" label="12 unread messages"></ui-badge>
  `,
});

export const DotDefaultLabel = meta.story({
  name: "Dot default label",
  args: { dot: true, tone: "warning", label: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Status" })).toBeInTheDocument();
  },
});

export const NotANumber = meta.story({
  name: "Not a number",
  args: { count: Number.NaN, label: undefined },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-badge span")).toBeNull();
  },
});
