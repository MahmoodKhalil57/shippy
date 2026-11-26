import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./steps.ts";
import "../layout/box.ts";
import type { StepItem } from "./steps.ts";

const checkout: StepItem[] = [
  { label: "Customer" },
  { label: "Line items" },
  { label: "Payment terms" },
  { label: "Review and send" },
];

const onboarding: StepItem[] = [
  { label: "Create workspace", supporting: "Name and currency" },
  { label: "Import contacts", supporting: "Skipped for now", state: "skipped" },
  { label: "Invite team", supporting: "3 people invited", state: "done" },
  { label: "Send first invoice", supporting: "About 2 minutes" },
];

const long: StepItem[] = [
  { label: "Upload file" },
  { label: "Map columns" },
  { label: "Check duplicates" },
  { label: "Choose owners" },
  { label: "Tag contacts" },
  { label: "Review" },
  { label: "Import" },
];

const meta = preview.type<{ args: { onChange: (e: Event) => void } }>().meta({
  title: "Primitives/Navigation/Steps",
  component: "ui-steps",
  args: {
    items: checkout,
    current: 1,
    direction: "horizontal",
    tone: "primary",
    clickable: false,
    scrollable: false,
    onChange: fn(),
  },
  argTypes: {
    items: { control: "object" },
    current: { control: { type: "number", min: 0, max: 6, step: 1 } },
    direction: { control: "inline-radio", options: ["horizontal", "vertical"] },
    tone: { control: "inline-radio", options: ["primary", "warning", "error"] },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-steps
      .items=${args.items ?? []}
      current=${ifDefined(args.current)}
      direction=${ifDefined(args.direction)}
      tone=${ifDefined(args.tone)}
      ?clickable=${args.clickable}
      ?scrollable=${args.scrollable}
      @ui-change=${args.onChange}
    ></ui-steps>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the steps; the current step reports aria-current." } },
  },
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole("listitem");
    await expect(items).toHaveLength(4);
    await expect(items[1]).toHaveAttribute("aria-current", "step");
    await expect(items[0]).toHaveTextContent("(done)");
    await expect(items[2]).not.toHaveAttribute("aria-current");
    await expect(canvas.queryByRole("button")).toBeNull();
  },
});

export const ClickToMove = meta.story({
  name: "Click to move",
  args: { clickable: true, current: 0 },
  play: async ({ canvas, userEvent, args }) => {
    const [first, second, third] = canvas.getAllByRole("button");
    await userEvent.click(third!);
    await expect(third).toHaveAttribute("aria-current", "step");
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ index: 2 }) }),
    );
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
    second!.focus();
    await userEvent.keyboard("{Enter}");
    await expect(second).toHaveAttribute("aria-current", "step");
    first!.focus();
    await userEvent.keyboard(" ");
    await expect(first).toHaveAttribute("aria-current", "step");
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await userEvent.keyboard(" ");
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
});

export const ExplicitStates = meta.story({
  name: "Explicit states",
  args: { items: onboarding, current: 3, direction: "vertical", tone: "warning" },
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole("listitem");
    await expect(items[1]).toHaveTextContent("(skipped)");
    await expect(items[2]).toHaveTextContent("(done)");
    await expect(items[3]).toHaveAttribute("aria-current", "step");
  },
});

export const Progress = meta.story({
  name: "Progress",
  parameters: {
    docs: {
      description: {
        story: "Steps before current are done and marked with a check; the current step has aria-current.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-steps .items=${checkout} current="0"></ui-steps>
    <ui-steps .items=${checkout} current="2"></ui-steps>
    <ui-steps .items=${checkout} current="3"></ui-steps>
  `,
});

export const Tones = meta.story({
  name: "Tones",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-steps .items=${checkout} current="2" tone="primary"></ui-steps>
    <ui-steps .items=${checkout} current="2" tone="warning"></ui-steps>
    <ui-steps .items=${checkout} current="2" tone="error"></ui-steps>
  `,
});

export const ExplicitStatesAndSupportingText = meta.story({
  name: "Explicit states and supporting text",
  parameters: {
    docs: { description: { story: "A step's own state overrides its position: skipped shows a dash, done a check." } },
    canvas: "column",
  },
  render: () => html`<ui-steps .items=${onboarding} current="3"></ui-steps>`,
});

export const Vertical = meta.story({
  name: "Vertical",
  render: () => html`
    <ui-steps direction="vertical" .items=${checkout} current="1"></ui-steps>
    <ui-steps direction="vertical" .items=${onboarding} current="3"></ui-steps>
  `,
});

export const Clickable = meta.story({
  name: "Clickable",
  parameters: {
    docs: {
      description: {
        story: "Clickable steps are buttons: click or press Enter or Space to jump, which fires ui-change.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-steps clickable .items=${checkout} current="1"></ui-steps>`,
});

export const Scrollable = meta.story({
  name: "Scrollable",
  parameters: {
    docs: {
      description: { story: "In a narrow space a scrollable list scrolls sideways instead of squeezing its steps." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-box width="80">
      <ui-steps scrollable label="Onboarding steps" .items=${long} current="4"></ui-steps>
    </ui-box>
  `,
  play: async ({ canvas }) => {
    const region = await canvas.findByRole("region", { name: "Onboarding steps" });
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    region.focus();
    await expect(region).toHaveFocus();
  },
});

export const ScrollableWithoutLabel = meta.story({
  name: "Scrollable without label",
  parameters: { docs: { description: { story: "Without a label the scrolling region stays unnamed." } } },
  render: () => html`<ui-steps scrollable .items=${checkout} current="1"></ui-steps>`,
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list");
    await expect(list.parentElement).not.toHaveAttribute("aria-label");
    await expect(canvas.getAllByRole("listitem")).toHaveLength(checkout.length);
  },
});
