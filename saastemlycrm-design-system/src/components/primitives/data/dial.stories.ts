import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./dial.ts";
import type { Zone } from "../../../lib/base/visual-math.ts";

const health: Zone[] = [
  { to: 40, tone: "error", label: "At risk" },
  { to: 70, tone: "warning", label: "Watch" },
  { to: 100, tone: "success", label: "Healthy" },
];

const response: Zone[] = [
  { to: 4, tone: "success", label: "Fast" },
  { to: 12, tone: "warning", label: "Slow" },
  { to: 24, tone: "error", label: "Late" },
];

const meta = preview.meta({
  title: "Primitives/Data/Dial",
  component: "ui-dial",
  args: {
    value: 82,
    min: 0,
    max: 100,
    label: "",
    valueText: "",
    caption: "Account health",
    zones: health,
  },
  argTypes: {
    value: { control: { type: "number", step: 1 } },
    min: { control: { type: "number", step: 1 } },
    max: { control: { type: "number", step: 1 } },
    label: { control: "text" },
    valueText: { control: "text" },
    caption: { control: "text" },
    zones: { control: "object", description: "Each zone ends at `to` and has a tone and an optional label." },
  },
  render: (args) => html`
    <ui-dial
      value=${ifDefined(args.value)}
      min=${ifDefined(args.min)}
      max=${ifDefined(args.max)}
      label=${ifDefined(args.label)}
      value-text=${ifDefined(args.valueText)}
      caption=${ifDefined(args.caption)}
      .zones=${args.zones}
    ></ui-dial>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the dial; arrow keys, Home and End step through the zones." } },
  },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Account health" });
    await expect(meter).toHaveAttribute("aria-valuenow", "82");
    await expect(meter).toHaveAttribute("aria-valuetext", "82 · 82% of 0–100");
    await expect(canvas.getByText("Account health")).toBeInTheDocument();
    await userEvent.tab();
    await expect(meter).toHaveFocus();
    await expect(await canvas.findByText("82 · 82% of 0–100")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("At risk: 0–40")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowUp}");
    await expect(await canvas.findByText("Watch: 40–70")).toBeInTheDocument();
    await userEvent.keyboard("{End}");
    await expect(await canvas.findByText("Healthy: 70–100")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("Healthy: 70–100")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await canvas.findByText("Watch: 40–70")).toBeInTheDocument();
    await userEvent.keyboard("{Home}");
    await expect(await canvas.findByText("At risk: 0–40")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(await canvas.findByText("82 · 82% of 0–100")).toBeInTheDocument();
    await userEvent.tab();
    await expect(await canvas.findByText("Account health")).toBeInTheDocument();
  },
});

export const BackFromNone = meta.story({
  name: "Left arrow picks the last zone",
  args: { zones: response, value: 6.5, max: 24, valueText: "6.5 h", caption: "First response time" },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "First response time" });
    await expect(meter).toHaveAttribute("aria-valuetext", "6.5 h · 27% of 0–24");
    meter.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(await canvas.findByText("Late: 12–24")).toBeInTheDocument();
  },
});

export const NoZones = meta.story({
  name: "No zones",
  args: { zones: undefined, value: 720, min: 300, max: 850, caption: "Credit score" },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Credit score" });
    await expect(meter).toHaveAttribute("aria-valuemin", "300");
    await expect(meter).toHaveAttribute("aria-valuetext", "720 · 76% of 300–850");
    meter.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("720 · 76% of 300–850")).toBeInTheDocument();
  },
});

export const UnlabelledZones = meta.story({
  name: "Unlabelled zones",
  args: {
    zones: [
      { to: 25, tone: "success" },
      { to: 50, tone: "warning" },
    ],
    value: 30,
    valueText: "30%",
    caption: "Discount given",
  },
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole("meter", { name: "Discount given" }).focus();
    await userEvent.keyboard("{End}");
    await expect(await canvas.findByText("25–50")).toBeInTheDocument();
  },
});

export const OverMax = meta.story({
  name: "Over the maximum",
  args: { zones: undefined, value: 135, valueText: "135%", caption: "Over quota" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Over quota" })).toHaveAttribute(
      "aria-valuetext",
      "135% · 135% of 0–100",
    );
  },
});

export const DefaultName = meta.story({
  name: "Default name",
  args: { zones: undefined, value: 0, caption: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Dial" })).toHaveAttribute("aria-valuetext", "0 · 0% of 0–100");
  },
});

export const Plain = meta.story({
  name: "Plain",
  parameters: {
    docs: { description: { story: "The face is a focusable meter read as the value and its share of the range." } },
  },
  render: () => html`
    <ui-dial value="64" caption="Pipeline coverage"></ui-dial>
    <ui-dial value="18" max="40" value-text="18 of 40" caption="Seats in use"></ui-dial>
  `,
});

export const Zones = meta.story({
  name: "Zones",
  parameters: {
    docs: {
      description: { story: "Arrow keys or the pointer pick a zone, which dims the others and names its range below." },
    },
  },
  render: () => html`
    <ui-dial value="82" .zones=${health} caption="Account health"></ui-dial>
    <ui-dial value="55" .zones=${health} caption="Account health"></ui-dial>
    <ui-dial value="23" .zones=${health} caption="Account health"></ui-dial>
  `,
});

export const CustomRange = meta.story({
  name: "Custom range",
  render: () => html`
    <ui-dial value="6.5" max="24" value-text="6.5 h" .zones=${response} caption="First response time"></ui-dial>
    <ui-dial value="720" min="300" max="850" caption="Credit score"></ui-dial>
  `,
});

export const PartialZones = meta.story({
  name: "Partial zones",
  parameters: {
    docs: { description: { story: "Zones that stop short of max leave the rest of the arc as an empty track." } },
  },
  render: () => html`
    <ui-dial
      value="30"
      .zones=${[
        { to: 25, tone: "success" },
        { to: 50, tone: "warning" },
      ]}
      caption="Discount given"
      value-text="30%"
    ></ui-dial>
  `,
});

export const Limits = meta.story({
  name: "Limits",
  render: () => html`
    <ui-dial value="0" caption="Nothing booked"></ui-dial>
    <ui-dial value="100" caption="Fully booked"></ui-dial>
    <ui-dial value="135" value-text="135%" caption="Over quota"></ui-dial>
  `,
});

export const PointerZones = meta.story({
  name: "Pointer over the zones",
  parameters: { docs: { description: { story: "Pointing at the arc reads that zone; the hub reads the value." } } },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Account health" });
    const at = (share: number, reach: number) => {
      const r = meter.getBoundingClientRect();
      const angle = (1 - share) * Math.PI;
      const radius = (reach * r.width) / 2;
      return {
        target: meter,
        coords: {
          clientX: r.left + r.width / 2 + radius * Math.cos(angle),
          clientY: r.bottom - radius * Math.sin(angle),
        },
      };
    };
    await userEvent.pointer(at(0.1, 0.85));
    await expect(await canvas.findByText("At risk: 0–40")).toBeInTheDocument();
    await userEvent.pointer(at(0.2, 0.9));
    await expect(await canvas.findByText("At risk: 0–40")).toBeInTheDocument();
    await userEvent.pointer(at(0.5, 0.85));
    await expect(await canvas.findByText("Watch: 40–70")).toBeInTheDocument();
    await userEvent.pointer(at(0.9, 0.85));
    await expect(await canvas.findByText("Healthy: 70–100")).toBeInTheDocument();
    await userEvent.pointer(at(0.5, 0.3));
    await expect(await canvas.findByText("82 · 82% of 0–100")).toBeInTheDocument();
    await userEvent.pointer(at(0.2, 1.05));
    await expect(await canvas.findByText("82 · 82% of 0–100")).toBeInTheDocument();
    await userEvent.unhover(meter);
    await expect(await canvas.findByText("Account health")).toBeInTheDocument();
  },
});

export const EmptyRange = meta.story({
  name: "Empty range",
  args: { value: 5, min: 5, max: 5, zones: undefined, caption: "Seats" },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Seats" });
    await expect(meter).toHaveAttribute("aria-valuetext", "5");
  },
});

export const ZonesPastMax = meta.story({
  name: "Zones past the max",
  parameters: { docs: { description: { story: "Zones beyond max or out of order are clipped or dropped." } } },
  args: {
    value: 50,
    zones: [
      { to: 150, tone: "error", label: "Late" },
      { to: 60, tone: "success", label: "On time" },
      { to: 60, tone: "warning", label: "Tied" },
      { to: 120, tone: "warning", label: "Beyond" },
    ],
    caption: "Delivery time",
  },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Delivery time" });
    meter.focus();
    await userEvent.keyboard("{Home}");
    await expect(await canvas.findByText("On time: 0–60")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("Beyond: 60–100")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("Beyond: 60–100")).toBeInTheDocument();
  },
});
