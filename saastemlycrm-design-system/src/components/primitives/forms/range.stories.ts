import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn } from "storybook/test";
import "./field.ts";
import "./range.ts";

const format = {
  percent: (v: number) => `${v}%`,
  money: (v: number) => `$${v.toLocaleString("en-US")}`,
  days: (v: number) => (v === 1 ? "1 day" : `${v} days`),
};

const volume = ["Quiet", "Loud"];

const tones = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"];
const surfaces = [...tones, "base-100", "base-200", "base-300", "base-content"];

type FieldArgs = { fieldLabel: string; hintText: string; error: string; onChange: (e: CustomEvent) => void };

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Range",
  component: "ui-range",
  args: {
    fieldLabel: "Deal probability",
    hintText: "",
    error: "",
    label: "Deal probability",
    value: 65,
    min: 0,
    max: 100,
    step: 5,
    name: "probability",
    color: "primary",
    size: "md",
    direction: "horizontal",
    width: "full",
    unfilled: false,
    disabled: false,
    ticks: false,
    bubble: false,
    labels: [],
    format: format.percent,
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    hintText: { control: "text", description: "Hint of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    label: { control: "text", description: "Accessible name of the slider." },
    value: { control: { type: "number", min: 0, max: 100, step: 1 } },
    min: { control: { type: "number", step: 1 } },
    max: { control: { type: "number", step: 1 } },
    step: { control: { type: "number", min: 1, step: 1 } },
    name: { control: "text" },
    color: { control: "select", options: tones },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    direction: { control: "inline-radio", options: ["horizontal", "vertical"] },
    width: { control: "inline-radio", options: ["xs", "sm", "md", "full"] },
    fillColor: { control: "select", options: surfaces },
    trackColor: { control: "select", options: surfaces },
    thumbColor: { control: "select", options: surfaces },
    labels: { control: "object" },
    format: { control: false },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field label=${ifDefined(args.fieldLabel)} hint=${ifDefined(args.hintText)} error=${ifDefined(args.error)}>
      <ui-range
        label=${ifDefined(args.label)}
        value=${ifDefined(args.value)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        step=${ifDefined(args.step)}
        name=${ifDefined(args.name)}
        color=${ifDefined(args.color)}
        size=${ifDefined(args.size)}
        direction=${ifDefined(args.direction)}
        width=${ifDefined(args.width)}
        fill-color=${ifDefined(args.fillColor)}
        track-color=${ifDefined(args.trackColor)}
        thumb-color=${ifDefined(args.thumbColor)}
        .labels=${args.labels ?? []}
        .format=${args.format}
        ?unfilled=${args.unfilled}
        ?disabled=${args.disabled}
        ?ticks=${args.ticks}
        ?bubble=${args.bubble}
        @ui-change=${args.onChange}
      ></ui-range>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the slider; moving it updates aria-valuetext and fires ui-change." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const slider = canvas.getByRole("slider", { name: "Deal probability" });
    await expect(slider).toHaveValue("65");
    await expect(slider).toHaveAttribute("aria-valuetext", "65%");
    await userEvent.click(slider);
    await expect(slider).toHaveFocus();
    await fireEvent.input(slider, { target: { value: "70" } });
    await expect(slider).toHaveAttribute("aria-valuetext", "70%");
    await expect(args.onChange).not.toHaveBeenCalled();
    await fireEvent.change(slider);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 70 } }));
    await fireEvent.input(slider, { target: { value: "100" } });
    await fireEvent.change(slider);
    await expect(slider).toHaveAttribute("aria-valuetext", "100%");
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 100 } }));
  },
});

export const StepsWithLabels = meta.story({
  name: "Steps with labels",
  args: {
    fieldLabel: "Payment terms",
    label: "Payment terms",
    min: 0,
    max: 60,
    step: 15,
    value: 30,
    ticks: true,
    bubble: false,
    labels: ["Now", "15 days", "30 days", "45 days", "60 days"],
    format: format.days,
  },
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Payment terms" });
    await expect(slider).toHaveAttribute("aria-valuetext", "30 days");
    await expect(canvas.getByText("45 days")).toBeInTheDocument();
    await fireEvent.input(slider, { target: { value: "45" } });
    await expect(slider).toHaveValue("45");
    await expect(slider).toHaveAttribute("aria-valuetext", "45 days");
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: 25, fieldLabel: "Locked discount", label: "Locked discount" },
  play: async ({ canvas, args }) => {
    const slider = canvas.getByRole("slider", { name: "Locked discount" });
    await expect(slider).toBeDisabled();
    await expect(slider).toHaveValue("25");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const ErrorState = meta.story({
  name: "Error",
  args: { color: "error", value: 95, error: "Probability above 90% needs a signed order." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Probability above 90% needs a signed order.");
    await expect(canvas.getByRole("slider", { name: "Deal probability" })).toHaveValue("95");
  },
});

export const InAField = meta.story({
  name: "In a field",
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Deal probability" });
    await expect(slider).toHaveValue("65");
    await expect(slider).toHaveAttribute("aria-valuetext");
    await expect(canvas.getByRole("slider", { name: "Budget" })).toHaveValue("12500");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The bubble follows the thumb and grows while dragging; the formatted value is also read as aria-valuetext.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Deal probability">
      <ui-range
        label="Deal probability"
        bubble
        width="full"
        color="primary"
        value="65"
        step="5"
        .format=${format.percent}
      ></ui-range>
    </ui-field>
    <ui-field label="Budget">
      <ui-range
        label="Budget"
        bubble
        width="full"
        color="primary"
        min="0"
        max="50000"
        step="500"
        value="12500"
        .format=${format.money}
      ></ui-range>
    </ui-field>
  `,
});

export const TicksAndLabels = meta.story({
  name: "Ticks and labels",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Payment terms">
      <ui-range
        label="Payment terms"
        width="full"
        color="primary"
        min="0"
        max="60"
        step="15"
        value="30"
        ticks
        .labels=${["Now", "15 days", "30 days", "45 days", "60 days"]}
        .format=${format.days}
      ></ui-range>
    </ui-field>
    <ui-field label="Urgency">
      <ui-range
        label="Urgency"
        width="md"
        color="warning"
        min="1"
        max="3"
        step="1"
        value="2"
        .labels=${["Low", "Medium", "High"]}
      ></ui-range>
    </ui-field>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-range label="Neutral" color="neutral" width="md" value="20"></ui-range>
    <ui-range label="Primary" color="primary" width="md" value="35"></ui-range>
    <ui-range label="Secondary" color="secondary" width="md" value="45"></ui-range>
    <ui-range label="Accent" color="accent" width="md" value="55"></ui-range>
    <ui-range label="Info" color="info" width="md" value="65"></ui-range>
    <ui-range label="Success" color="success" width="md" value="75"></ui-range>
    <ui-range label="Warning" color="warning" width="md" value="85"></ui-range>
    <ui-range label="Error" color="error" width="md" value="95"></ui-range>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-range label="Extra small" size="xs" color="primary" width="md" value="40"></ui-range>
    <ui-range label="Small" size="sm" color="primary" width="md" value="40"></ui-range>
    <ui-range label="Medium" size="md" color="primary" width="md" value="40"></ui-range>
    <ui-range label="Large" size="lg" color="primary" width="md" value="40"></ui-range>
    <ui-range label="Extra large" size="xl" color="primary" width="md" value="40"></ui-range>
  `,
});

export const Widths = meta.story({
  name: "Widths",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-range label="Extra small width" width="xs" value="50"></ui-range>
    <ui-range label="Small width" width="sm" value="50"></ui-range>
    <ui-range label="Medium width" width="md" value="50"></ui-range>
    <ui-range label="Full width" width="full" value="50"></ui-range>
  `,
});

export const CustomColoursAndUnfilled = meta.story({
  name: "Custom colours and unfilled",
  parameters: {
    docs: {
      description: {
        story: "Fill, track and thumb colours can be set apart; unfilled drops the fill behind the thumb.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-range
      label="Custom colours"
      width="md"
      value="60"
      fill-color="success"
      track-color="base-300"
      thumb-color="base-100"
    ></ui-range>
    <ui-range label="Unfilled" width="md" color="primary" unfilled value="60"></ui-range>
  `,
});

export const VerticalAndDisabled = meta.story({
  name: "Vertical and disabled",
  render: () => html`
    <ui-range label="Volume" direction="vertical" color="primary" value="70"></ui-range>
    <ui-range label="Locked discount" width="sm" color="primary" disabled value="25"></ui-range>
  `,
});

export const DefaultsAndEdges = meta.story({
  name: "Defaults and edges",
  parameters: {
    docs: {
      description: {
        story:
          "Without a format the bubble shows the plain number; ticks need a step; an empty span (min equal to max) puts the thumb at the start.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-range label="Seats" bubble value="12"></ui-range>
    <ui-range label="Fixed fee" min="10" max="10" value="10" ticks></ui-range>
    <ui-range label="Volume" bubble value="30" .labels=${volume}></ui-range>
  `,
  play: async ({ canvas }) => {
    const seats = canvas.getByRole("slider", { name: "Seats" });
    const seatsBox = seats.parentElement!;
    await expect(seatsBox).toHaveClass("w-full");
    await expect(seatsBox).toHaveAttribute("style", "--p:0.12");
    await expect(seatsBox.querySelector("[aria-hidden=true]")).toHaveTextContent("12");
    const fee = canvas.getByRole("slider", { name: "Fixed fee" });
    await expect(fee).toHaveValue("10");
    await expect(fee.parentElement).toHaveAttribute("style", "--p:0");
    await expect(fee.parentElement!.querySelector("[aria-hidden=true]")).toBeNull();
    const volumeBox = canvas.getByRole("slider", { name: "Volume" }).parentElement!;
    await expect(volumeBox).toHaveClass("pt-9");
    await expect(volumeBox.querySelector("[aria-hidden=true]")).toHaveTextContent("30");
    await expect(canvas.getByText("Loud")).toBeVisible();
  },
});
