import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "./waffle.ts";
import type { WafflePart } from "./waffle.ts";

const tickets: WafflePart[] = [
  { label: "Resolved", value: 412 },
  { label: "In progress", value: 136 },
  { label: "Waiting on customer", value: 74 },
  { label: "Escalated", value: 18 },
];

const meta = preview.meta({
  title: "Primitives/Data/Waffle",
  component: "ui-waffle",
  parameters: { canvas: "column" },
  args: {
    parts: tickets,
    value: 73,
    max: 100,
    label: "Support tickets",
    valueText: "",
    caption: "All tickets this month",
  },
  argTypes: {
    parts: { control: "object", description: "Clear it to show the single value as a meter." },
    value: { control: { type: "number", min: 0, step: 1 } },
    max: { control: { type: "number", min: 1, step: 1 } },
    label: { control: "text" },
    valueText: { control: "text" },
    caption: { control: "text" },
  },
  render: (args) => html`
    <ui-waffle
      .parts=${args.parts}
      value=${ifDefined(args.value)}
      max=${ifDefined(args.max)}
      label=${ifDefined(args.label)}
      value-text=${ifDefined(args.valueText)}
      caption=${ifDefined(args.caption)}
    ></ui-waffle>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the waffle; focusing a legend row shows that part's amount." },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const legend = canvas.getByRole("list", { name: "Support tickets" });
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
    await expect(legend).toHaveTextContent("64%");
    await expect(canvas.getByText("100%")).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByText("Resolved").closest("[tabindex]")).toHaveFocus();
    await expect(canvas.getByText("Resolved · 64%")).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByText("In progress · 21%")).toBeInTheDocument();
    const resolved = canvas.getByText("Resolved").closest("[tabindex]")!;
    await expect(resolved.firstElementChild).toHaveClass("opacity-30");
    await expect(resolved.className).not.toMatch(/opacity/);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByText("All tickets this month")).toBeInTheDocument();
    await expect(resolved.firstElementChild).not.toHaveClass("opacity-30");
    // End with a part focused, so the accessibility check reads the dimmed legend's contrast.
    await userEvent.tab({ shift: true });
    await expect(await canvas.findByText(/^Escalated · /)).toBeInTheDocument();
  },
});

export const SingleMeter = meta.story({
  name: "Single value meter",
  args: { parts: undefined, label: "", caption: "Orders shipped on time" },
  play: async ({ canvas, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Orders shipped on time" });
    await expect(meter).toHaveAttribute("aria-valuenow", "73");
    await expect(meter).toHaveAttribute("aria-valuemax", "100");
    await expect(meter).toHaveAttribute("aria-valuetext", "73% Orders shipped on time");
    await userEvent.tab();
    await expect(meter).toHaveFocus();
    await expect(canvas.getByText("Orders shipped on time · 73%")).toBeInTheDocument();
  },
});

export const ValueText = meta.story({
  name: "Value text",
  args: { parts: undefined, label: "", value: 18, max: 40, valueText: "18 of 40", caption: "Seats in use" },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Seats in use" });
    await expect(meter).toHaveAttribute("aria-valuetext", "18 of 40 Seats in use");
  },
});

export const Zero = meta.story({
  name: "Zero",
  args: { parts: undefined, label: "", value: 0, caption: "Refunds issued" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("meter", { name: "Refunds issued" })).toHaveAttribute(
      "aria-valuetext",
      "0% Refunds issued",
    );
  },
});

export const SingleValue = meta.story({
  name: "Single value",
  parameters: {
    docs: { description: { story: "With one value the grid is a meter; each square is one percent of max." } },
    canvas: "column",
  },
  render: () => html`
    <ui-waffle value="73" caption="Orders shipped on time"></ui-waffle>
    <ui-waffle value="18" max="40" value-text="18 of 40" caption="Seats in use"></ui-waffle>
  `,
});

export const Parts = meta.story({
  name: "Parts",
  parameters: {
    docs: { description: { story: "Hovering a square or a legend row picks that part and shows its amount." } },
    canvas: "column",
  },
  render: () =>
    html`<ui-waffle label="Support tickets" caption="All tickets this month" .parts=${tickets}></ui-waffle>`,
});

export const PartsOfALargerWhole = meta.story({
  name: "Parts of a larger whole",
  parameters: {
    docs: { description: { story: "With max above the sum, the empty squares are what is left." } },
    canvas: "column",
  },
  render: () => html`
    <ui-waffle
      label="Warehouse space"
      caption="Pallet spaces used"
      max="1000"
      .parts=${[
        { label: "Finished goods", value: 380, valueText: "380 pallets" },
        { label: "Raw materials", value: 210, valueText: "210 pallets" },
        { label: "Returns", value: 45, valueText: "45 pallets" },
      ]}
    ></ui-waffle>
  `,
});

export const ManyParts = meta.story({
  name: "Many parts",
  parameters: {
    docs: { description: { story: "Past six parts the rest fold into a muted Other." } },
    canvas: "column",
  },
  render: () => html`
    <ui-waffle
      label="Orders by region"
      caption="Share of orders"
      .parts=${[
        { label: "North", value: 31 },
        { label: "South", value: 22 },
        { label: "East", value: 17 },
        { label: "West", value: 12 },
        { label: "Central", value: 8 },
        { label: "Coastal", value: 5 },
        { label: "Islands", value: 3 },
        { label: "Overseas", value: 2 },
      ]}
    ></ui-waffle>
  `,
});

export const Limits = meta.story({
  name: "Limits",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-waffle value="0" caption="Refunds issued"></ui-waffle>
    <ui-waffle value="100" caption="Accounts migrated"></ui-waffle>
  `,
});

const cellsOf = (grid: Element) => [...grid.querySelectorAll<HTMLElement>(":scope > div > span")];

export const MeterPointer = meta.story({
  name: "Meter with a pointer",
  parameters: {
    docs: { description: { story: "An unnamed meter is called Share; pointing at the filled squares reads them." } },
  },
  args: { parts: undefined, label: "", caption: "", value: 40 },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const meter = canvas.getByRole("meter", { name: "Share" });
    await expect(meter).toHaveAttribute("aria-valuetext", "40%");
    const reading = canvasElement.querySelector("ui-waffle [aria-hidden='true']:not([role])")!;
    await expect(reading.children).toHaveLength(1);
    const cells = cellsOf(meter);
    await userEvent.hover(cells[0]!);
    await expect(reading).toHaveTextContent("40%");
    await expect(reading.children).toHaveLength(2);
    await expect(reading.lastElementChild).toHaveTextContent(/^40%$/);
    await expect(cells[99]).toHaveClass("opacity-30");
    await expect(cells[0]).not.toHaveClass("opacity-30");
    await userEvent.click(cells[0]!);
    await userEvent.hover(cells[99]!);
    await expect(reading.children).toHaveLength(1);
    await expect(cells[99]).not.toHaveClass("opacity-30");
    await expect(meter).toHaveFocus();
    meter.blur();
    meter.focus();
    await waitFor(() => expect(reading.children).toHaveLength(2));
    await userEvent.hover(cells[1]!);
    await expect(reading.children).toHaveLength(2);
    await userEvent.unhover(meter);
    await expect(reading.children).toHaveLength(1);
  },
});

export const LinkedParts = meta.story({
  name: "Linked parts",
  parameters: {
    docs: { description: { story: "Clicking a square of a linked part follows its legend link." } },
  },
  render: () => html`
    <ui-waffle
      .parts=${[
        { label: "Paid", value: 30, href: "#paid" },
        { label: "Open", value: 20 },
      ]}
    ></ui-waffle>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
    const link = canvas.getByRole("link", { name: /Paid/ });
    await expect(link).toHaveAttribute("href", "#paid");
    const followed: string[] = [];
    link.addEventListener("click", (e) => {
      e.preventDefault();
      followed.push(link.getAttribute("href")!);
    });
    const grid = canvasElement.querySelector("ui-waffle [aria-hidden='true']")!;
    const cells = cellsOf(grid);
    await userEvent.click(cells[0]!);
    await expect(followed).toEqual(["#paid"]);
    await expect(await canvas.findByText("Paid · 30%")).toBeInTheDocument();
    await userEvent.click(cells[40]!);
    await expect(await canvas.findByText("Open · 20%")).toBeInTheDocument();
    await userEvent.click(cells[80]!);
    await expect(followed).toEqual(["#paid"]);
    await userEvent.unhover(grid);
    await expect(canvas.queryByText(/ · /)).toBeNull();
  },
});

export const NotANumber = meta.story({
  name: "Not a number",
  args: { parts: undefined, label: "", caption: "Refunds", value: Number.NaN, max: 0 },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Refunds" });
    await expect(meter).toHaveAttribute("aria-valuetext", "0% Refunds");
    await expect(meter).toHaveAttribute("aria-valuenow", "0");
    await expect(cellsOf(meter).every((c) => c.className === cellsOf(meter)[0]!.className)).toBe(true);
  },
});

export const TinyShareAndBadMax = meta.story({
  name: "Tiny share and a bad max",
  parameters: {
    docs: {
      description: { story: "A share too small for one square fills none; a max that is not a number counts as 100." },
    },
  },
  render: () => html`
    <ui-waffle value="0.2" max="1000" caption="Disputes"></ui-waffle>
    <ui-waffle value="30" max="lots" caption="Returns"></ui-waffle>
  `,
  play: async ({ canvas }) => {
    const tiny = canvas.getByRole("meter", { name: "Disputes" });
    await expect(new Set(cellsOf(tiny).map((c) => c.className)).size).toBe(1);
    await expect(tiny).toHaveAttribute("aria-valuetext", "0% Disputes");
    const returns = canvas.getByRole("meter", { name: "Returns" });
    await expect(returns).toHaveAttribute("aria-valuemax", "100");
    await expect(returns).toHaveAttribute("aria-valuetext", "30% Returns");
    const cells = cellsOf(returns);
    await expect(cells.filter((c) => c.className === cells[0]!.className)).toHaveLength(30);
  },
});
