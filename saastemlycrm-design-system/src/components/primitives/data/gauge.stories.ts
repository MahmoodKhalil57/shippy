import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./gauge.ts";

const meta = preview.meta({
  title: "Primitives/Data/Gauge",
  component: "ui-gauge",
  args: {
    value: 68,
    min: 0,
    max: 100,
    tone: "primary",
    width: "full",
    label: "",
    heading: "Quarterly sales target",
    valueText: "68%",
  },
  argTypes: {
    value: { control: { type: "number", step: 1 } },
    min: { control: { type: "number", step: 1 } },
    max: { control: { type: "number", step: 1 } },
    tone: { control: "select", options: ["neutral", "primary", "info", "success", "warning", "error"] },
    width: { control: "inline-radio", options: ["xs", "sm", "full"] },
    label: { control: "text" },
    heading: { control: "text" },
    valueText: { control: "text" },
  },
  render: (args) => html`
    <ui-gauge
      value=${ifDefined(args.value)}
      min=${ifDefined(args.min)}
      max=${ifDefined(args.max)}
      tone=${ifDefined(args.tone)}
      width=${ifDefined(args.width)}
      label=${ifDefined(args.label)}
      heading=${ifDefined(args.heading)}
      value-text=${ifDefined(args.valueText)}
    ></ui-gauge>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the gauge." } }, canvas: "column" },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Quarterly sales target" });
    await expect(meter).toHaveAttribute("aria-valuenow", "68");
    await expect(meter).toHaveAttribute("aria-valuemin", "0");
    await expect(meter).toHaveAttribute("aria-valuemax", "100");
    await expect(meter).toHaveAttribute("aria-valuetext", "68 of 100");
    await expect(canvas.getByText("68%")).toBeInTheDocument();
  },
});

export const CustomRange = meta.story({
  name: "Custom range",
  args: { heading: "Credit score", valueText: "720", value: 720, min: 300, max: 850 },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Credit score" });
    await expect(meter).toHaveAttribute("aria-valuemin", "300");
    await expect(meter).toHaveAttribute("aria-valuemax", "850");
    await expect(meter).toHaveAttribute("aria-valuetext", "720 of 850");
  },
});

export const Empty = meta.story({
  name: "Empty",
  args: { heading: "Nothing collected yet", valueText: "0%", value: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Nothing collected yet" })).toHaveAttribute("aria-valuenow", "0");
  },
});

export const Over = meta.story({
  name: "Over the maximum",
  args: { heading: "Over budget", valueText: "134%", value: 134, tone: "error" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Over budget" })).toHaveAttribute("aria-valuenow", "134");
  },
});

export const Unnamed = meta.story({
  name: "Default name",
  args: { heading: "", valueText: "", value: 30 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Gauge" })).toHaveAttribute("aria-valuetext", "30 of 100");
  },
});

export const LabelledValue = meta.story({
  name: "Label names it, value text reads the value",
  args: { label: "Seats used", heading: "", valueText: "", value: 42, max: 50 },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Seats used" });
    await expect(meter).toHaveAttribute("aria-valuetext", "42 of 50");
    await expect(meter).toHaveAttribute("aria-valuenow", "42");
  },
});

export const HeadingAndValue = meta.story({
  name: "Heading and value",
  parameters: {
    docs: { description: { story: "The track is a meter; without a label its name comes from the heading." } },
    canvas: "column",
  },
  render: () => html`
    <ui-gauge heading="Quarterly sales target" value-text="68%" value="68"></ui-gauge>
    <ui-gauge heading="Storage used" value-text="41 of 50 GB" value="41" max="50" tone="warning"></ui-gauge>
    <ui-gauge heading="Invoices collected" value-text="112 of 120" value="112" max="120" tone="success"></ui-gauge>
  `,
});

export const Tones = meta.story({
  name: "Tones",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-gauge heading="Neutral" value="55" tone="neutral" value-text="55%"></ui-gauge>
    <ui-gauge heading="Primary" value="55" tone="primary" value-text="55%"></ui-gauge>
    <ui-gauge heading="Info" value="55" tone="info" value-text="55%"></ui-gauge>
    <ui-gauge heading="Success" value="55" tone="success" value-text="55%"></ui-gauge>
    <ui-gauge heading="Warning" value="55" tone="warning" value-text="55%"></ui-gauge>
    <ui-gauge heading="Error" value="55" tone="error" value-text="55%"></ui-gauge>
  `,
});

export const Widths = meta.story({
  name: "Widths",
  render: () => html`
    <ui-gauge width="xs" value="30" label="Seats used"></ui-gauge>
    <ui-gauge width="sm" value="30" label="Seats used"></ui-gauge>
    <ui-gauge width="sm" heading="Seats" value-text="12 of 40" value="12" max="40"></ui-gauge>
  `,
});

export const RangeAndLimits = meta.story({
  name: "Range and limits",
  parameters: {
    docs: { description: { story: "Values outside min and max are clamped to an empty or full track." } },
    canvas: "column",
  },
  render: () => html`
    <ui-gauge heading="Credit score" value-text="720" value="720" min="300" max="850"></ui-gauge>
    <ui-gauge heading="Nothing collected yet" value-text="0%" value="0"></ui-gauge>
    <ui-gauge heading="Over budget" value-text="134%" value="134" tone="error"></ui-gauge>
    <ui-gauge heading="Below minimum" value-text="−5" value="-5"></ui-gauge>
  `,
});

export const TrackOnly = meta.story({
  name: "Track only",
  parameters: { canvas: "column" },
  render: () => html`<ui-gauge value="80" label="Profile completeness"></ui-gauge>`,
});

export const SlottedHeadingNoRange = meta.story({
  name: "Slotted heading, empty range",
  parameters: {
    docs: { description: { story: "A slotted or rich heading names the meter; an empty range draws no fill." } },
    canvas: "column",
  },
  render: () => html`
    <ui-gauge value="10" min="10" max="10"><strong slot="heading">Seats</strong></ui-gauge>
    <ui-gauge value="25" .heading=${html`<em>Storage</em>`} label=""></ui-gauge>
  `,
  play: async ({ canvas, canvasElement }) => {
    const seats = canvas.getByRole("meter", { name: "Seats" });
    const storage = canvas.getByRole("meter", { name: "Storage" });
    await expect(canvas.getByText("Seats")).toBeInTheDocument();
    await expect(seats).toHaveAttribute("aria-valuetext", "10 of 10");
    await expect(seats.firstElementChild).toHaveAttribute("style", "--fill:0%");
    const head = canvasElement.querySelector("ui-gauge [aria-hidden]")!;
    await expect(head.children).toHaveLength(1);
    await expect(canvas.getByText("Storage").tagName).toBe("EM");
    await expect(storage).toHaveAttribute("aria-valuenow", "25");
    await expect(storage.firstElementChild).toHaveAttribute("style", "--fill:25%");
  },
});
