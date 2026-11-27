import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./bullet.ts";
import type { UiBullet } from "./bullet.ts";
import { auditLayout } from "../../../lib/base/layout.ts";

const meta = preview.meta({
  title: "Primitives/Data/Bullet",
  component: "ui-bullet",
  parameters: { canvas: "column" },
  args: {
    heading: "Quarterly revenue",
    label: "",
    value: 412,
    min: 0,
    max: 600,
    target: 500,
    bands: [250, 450],
    valueText: "$412k",
    targetText: "$500k",
    lowerIsBetter: false,
  },
  argTypes: {
    heading: { control: "text" },
    label: { control: "text" },
    value: { control: { type: "number", step: 1 } },
    min: { control: { type: "number", step: 1 } },
    max: { control: { type: "number", step: 1 } },
    target: { control: { type: "number", step: 1 } },
    bands: { control: "object", description: "One or two thresholds between min and max." },
    valueText: { control: "text" },
    targetText: { control: "text" },
    lowerIsBetter: { control: "boolean" },
  },
  render: (args) => html`
    <ui-bullet
      heading=${ifDefined(args.heading)}
      label=${ifDefined(args.label)}
      value=${ifDefined(args.value)}
      min=${ifDefined(args.min)}
      max=${ifDefined(args.max)}
      target=${ifDefined(args.target)}
      .bands=${args.bands}
      value-text=${ifDefined(args.valueText)}
      target-text=${ifDefined(args.targetText)}
      ?lower-is-better=${args.lowerIsBetter}
    ></ui-bullet>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the bullet; arrow keys, Home and End step through the bands." },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Quarterly revenue" });
    await expect(meter).toHaveAttribute("aria-valuenow", "412");
    await expect(meter).toHaveAttribute("aria-valuemax", "600");
    await expect(meter).toHaveAttribute("aria-valuetext", "$412k of $500k · 82% of target");
    await expect(canvas.getByText("Target $500k")).toBeInTheDocument();
    await userEvent.tab();
    await expect(meter).toHaveFocus();
    await expect(await canvas.findByText("$412k of $500k · 82% of target")).toBeInTheDocument();
    await userEvent.keyboard("{Home}");
    await expect(await canvas.findByText("Poor: 0–250 · $412k of $500k · 82% of target")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("OK: 250–450 · $412k of $500k · 82% of target")).toBeInTheDocument();
    await userEvent.keyboard("{End}");
    await expect(await canvas.findByText("Good: 450–600 · $412k of $500k · 82% of target")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("Good: 450–600 · $412k of $500k · 82% of target")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(await canvas.findByText("OK: 250–450 · $412k of $500k · 82% of target")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(await canvas.findByText("$412k of $500k · 82% of target")).toBeInTheDocument();
    await userEvent.tab();
    await expect(await canvas.findByText("Target $500k")).toBeInTheDocument();
  },
});

export const LowerIsBetterArgs = meta.story({
  name: "Lower is better bands",
  args: {
    heading: "Average days to pay",
    value: 34,
    max: 90,
    target: 30,
    bands: [30, 60],
    valueText: "34 days",
    targetText: "30 days",
    lowerIsBetter: true,
  },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Average days to pay" });
    await expect(meter).toHaveAttribute("aria-valuetext", "34 days of 30 days · 113% of target");
    meter.focus();
    await userEvent.keyboard("{Home}");
    await expect(await canvas.findByText("Good: 0–30 · 34 days of 30 days · 113% of target")).toBeInTheDocument();
    await userEvent.keyboard("{End}");
    await expect(await canvas.findByText("Poor: 60–90 · 34 days of 30 days · 113% of target")).toBeInTheDocument();
    const r = meter.getBoundingClientRect();
    await userEvent.pointer({ target: meter, coords: { clientX: r.left + r.width * 0.1, clientY: r.top + 2 } });
    await expect(await canvas.findByText("Good: 0–30 · 34 days of 30 days · 113% of target")).toBeInTheDocument();
    await userEvent.pointer({ target: meter, coords: { clientX: r.right + 4, clientY: r.top + 2 } });
    await expect(await canvas.findByText("Poor: 60–90 · 34 days of 30 days · 113% of target")).toBeInTheDocument();
  },
});

export const NoTarget = meta.story({
  name: "No target",
  args: {
    heading: "Warehouse capacity",
    value: 6400,
    max: 8000,
    target: undefined,
    bands: undefined,
    valueText: "6,400 pallets",
    targetText: "",
  },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Warehouse capacity" });
    await expect(meter).toHaveAttribute("aria-valuetext", "6,400 pallets · 80% of 8,000");
    meter.focus();
    await userEvent.keyboard("{Home}");
    await expect(await canvas.findByText("6,400 pallets · 80% of 8,000")).toBeInTheDocument();
  },
});

export const ZeroTarget = meta.story({
  name: "Zero target",
  args: {
    heading: "Refunds",
    value: 4,
    max: 20,
    target: 0,
    bands: [5, 10],
    valueText: "",
    targetText: "",
    lowerIsBetter: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Refunds" })).toHaveAttribute("aria-valuetext", "4 of 0");
  },
});

export const DefaultName = meta.story({
  name: "Default name",
  args: { heading: "", valueText: "", targetText: "", value: 72, max: 100, target: 80 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Bullet graph" })).toHaveAttribute(
      "aria-valuetext",
      "72 of 80 · 90% of target",
    );
  },
});

export const AgainstATarget = meta.story({
  name: "Against a target",
  parameters: {
    docs: { description: { story: "The bar is a focusable meter; its reading compares the value with the target." } },
    canvas: "column",
  },
  render: () => html`
    <ui-bullet
      heading="Quarterly revenue"
      value="412"
      max="600"
      target="500"
      value-text="$412k"
      target-text="$500k"
      .bands=${[250, 450]}
    ></ui-bullet>
    <ui-bullet
      heading="New customers"
      value="138"
      max="160"
      target="120"
      target-text="120 customers"
      .bands=${[80, 110]}
    ></ui-bullet>
  `,
});

export const QualityBands = meta.story({
  name: "Quality bands",
  parameters: {
    docs: {
      description: {
        story:
          "Two thresholds give poor, ok and good; one gives poor and good. Arrow keys step through the bands, Escape leaves them.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-bullet heading="Three bands" value="72" target="80" .bands=${[40, 70]}></ui-bullet>
    <ui-bullet heading="Two bands" value="72" target="80" .bands=${[60]}></ui-bullet>
    <ui-bullet heading="No bands" value="72" target="80"></ui-bullet>
  `,
});

export const LowerIsBetter = meta.story({
  name: "Lower is better",
  parameters: {
    docs: { description: { story: "lower-is-better reverses the bands, so the good band sits at the low end." } },
    canvas: "column",
  },
  render: () => html`
    <ui-bullet
      heading="Average days to pay"
      value="34"
      max="90"
      target="30"
      value-text="34 days"
      target-text="30 days"
      lower-is-better
      .bands=${[30, 60]}
    ></ui-bullet>
    <ui-bullet
      heading="Return rate"
      value="2"
      max="10"
      target="3"
      value-text="2%"
      target-text="3%"
      lower-is-better
      .bands=${[3, 6]}
    ></ui-bullet>
  `,
});

export const WithoutATarget = meta.story({
  name: "Without a target",
  parameters: {
    docs: { description: { story: "With no target the reading is the share of the range." } },
    canvas: "column",
  },
  render: () => html`
    <ui-bullet heading="Warehouse capacity" value="6400" max="8000" value-text="6,400 pallets"></ui-bullet>
    <ui-bullet heading="Support tickets closed" value="0" max="250" .bands=${[100, 200]}></ui-bullet>
  `,
});

export const OverTheRange = meta.story({
  name: "Over the range",
  parameters: {
    docs: { description: { story: "A value above max fills the track; the target stays where it is." } },
    canvas: "column",
  },
  render: () => html`
    <ui-bullet
      heading="Orders shipped"
      value="1240"
      max="1000"
      target="900"
      value-text="1,240"
      .bands=${[500, 800]}
    ></ui-bullet>
    <ui-bullet label="Sales calls this week" value="46" max="60" target="50" .bands=${[30, 45]}></ui-bullet>
  `,
});

export const RightToLeftPointer = meta.story({
  name: "Right to left with a pointer",
  parameters: {
    docs: { description: { story: "In right-to-left the bands run from the right, for the keys and the pointer." } },
  },
  render: (args) => html`
    <div dir="rtl">
      <ui-bullet
        heading=${args.heading}
        value=${args.value}
        max=${args.max}
        target=${ifDefined(args.target)}
        .bands=${args.bands}
        value-text=${args.valueText}
        target-text=${args.targetText}
      ></ui-bullet>
    </div>
  `,
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Quarterly revenue" });
    const reading = "$412k of $500k · 82% of target";
    meter.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText(`Good: 450–600 · ${reading}`)).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(await canvas.findByText(`Good: 450–600 · ${reading}`)).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText(`OK: 250–450 · ${reading}`)).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    meter.blur();
    const at = (share: number) => {
      const r = meter.getBoundingClientRect();
      return { target: meter, coords: { clientX: r.right - r.width * share, clientY: r.top + r.height / 2 } };
    };
    await userEvent.pointer(at(0.1));
    await expect(await canvas.findByText(`Poor: 0–250 · ${reading}`)).toBeInTheDocument();
    await userEvent.pointer(at(0.2));
    await expect(await canvas.findByText(`Poor: 0–250 · ${reading}`)).toBeInTheDocument();
    await userEvent.pointer(at(0.9));
    await expect(await canvas.findByText(`Good: 450–600 · ${reading}`)).toBeInTheDocument();
    await userEvent.unhover(meter);
    await expect(await canvas.findByText("Target $500k")).toBeInTheDocument();
  },
});

export const EmptyRangePointer = meta.story({
  name: "Empty range with a pointer",
  args: {
    heading: "Seats",
    value: 0,
    max: 0,
    target: undefined,
    bands: undefined,
    valueText: "",
    targetText: "",
  },
  render: (args) => html`
    <div style="inline-size: 0">
      <ui-bullet heading=${args.heading} value=${args.value} max=${args.max}></ui-bullet>
    </div>
  `,
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Seats" });
    await expect(meter).toHaveAttribute("aria-valuetext", "0");
    await expect(meter.getBoundingClientRect().width).toBe(0);
    await userEvent.pointer({ target: meter, coords: { clientX: 0, clientY: 0 } });
    await expect(meter.parentElement!.querySelector("[aria-live]")).toHaveTextContent("0");
    await userEvent.unhover(meter);
    await expect(meter.parentElement!.querySelector("[aria-live]")).toHaveTextContent("");
  },
});

const words = (n: number) => "$389k across every open stage this quarter ".repeat(3).slice(0, n).trim();

export const LongValueKeepsTheHeading = meta.story({
  name: "Long value keeps the heading readable",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<UiBullet>("ui-bullet")!;
    const squeezed: string[] = [];
    for (let n = 1; n <= 80; n++) {
      el.valueText = words(n);
      await el.updateComplete;
      squeezed.push(
        ...auditLayout(canvasElement)
          .filter((i) => i.kind === "squeezed")
          .map((i) => `${n}: ${i.detail}`),
      );
    }
    await expect(squeezed).toEqual([]);
  },
});
