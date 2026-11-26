import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./ring.ts";
import type { RingPart } from "./ring.ts";

const channels: RingPart[] = [
  { label: "Direct", value: 42800, valueText: "$42.8k" },
  { label: "Partners", value: 27300, valueText: "$27.3k" },
  { label: "Online store", value: 18900, valueText: "$18.9k" },
  { label: "Marketplace", value: 9400, valueText: "$9.4k" },
];

const regions: RingPart[] = [
  { label: "North", value: 310, href: "#north" },
  { label: "South", value: 240, href: "#south" },
  { label: "East", value: 190, href: "#east" },
  { label: "West", value: 150, href: "#west" },
  { label: "Central", value: 90, href: "#central" },
  { label: "Coastal", value: 60, href: "#coastal" },
  { label: "Islands", value: 25, href: "#islands" },
  { label: "Overseas", value: 15, href: "#overseas" },
];

const meta = preview.meta({
  title: "Primitives/Data/Ring",
  component: "ui-ring",
  parameters: { canvas: "column" },
  args: {
    parts: channels,
    label: "Revenue by channel",
    centerLabel: "Revenue",
    totalText: "$98.4k",
    max: undefined,
  },
  argTypes: {
    parts: { control: "object" },
    label: { control: "text" },
    centerLabel: { control: "text" },
    totalText: { control: "text" },
    max: { control: { type: "number", min: 0, step: 1 } },
  },
  render: (args) => html`
    <ui-ring
      .parts=${args.parts}
      label=${ifDefined(args.label)}
      center-label=${ifDefined(args.centerLabel)}
      total-text=${ifDefined(args.totalText)}
      max=${ifDefined(args.max)}
    ></ui-ring>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the ring; Tab through the legend to read each part." } },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const legend = canvas.getByRole("list", { name: "Revenue by channel" });
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
    await expect(legend).toHaveTextContent("43%");
    await expect(canvas.getByText("$98.4k")).toBeInTheDocument();
    await userEvent.tab();
    const direct = canvas.getByText("Direct").closest("[tabindex]");
    await expect(direct).toHaveFocus();
    await expect(await canvas.findByText("Direct · 43%")).toBeInTheDocument();
    const partners = canvas.getByText("Partners").closest("[tabindex]")!;
    await expect(partners.firstElementChild).toHaveClass("opacity-30");
    await expect(partners.className).not.toMatch(/opacity/);
    await userEvent.tab();
    await expect(await canvas.findByText("Partners · 28%")).toBeInTheDocument();
    (document.activeElement as HTMLElement).blur();
    await canvasElement.querySelector("ui-ring")?.updateComplete;
    await expect(canvas.getByText("Revenue")).toBeInTheDocument();
    await expect(partners.firstElementChild).not.toHaveClass("opacity-30");
    // End with a part focused, so the accessibility check reads the dimmed legend's contrast.
    await userEvent.tab();
    await expect(await canvas.findByText("Direct · 43%")).toBeInTheDocument();
  },
});

export const FoldsIntoOther = meta.story({
  name: "Folds into other",
  args: { parts: regions, label: "Orders by region", centerLabel: "Orders", totalText: "" },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(6);
    await expect(canvas.getAllByRole("link")).toHaveLength(5);
    await expect(canvas.getByText("Other")).toBeInTheDocument();
    await expect(canvas.getByText("1,080")).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: /North/ })).toHaveFocus();
    await expect(await canvas.findByText("North · 29%")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: /South/ }).firstElementChild).toHaveClass("opacity-30");
  },
});

export const AgainstMax = meta.story({
  name: "Share of max",
  args: {
    parts: [{ label: "Assigned", value: 29 }],
    label: "Seats",
    centerLabel: "of 40 seats",
    totalText: "",
    max: 40,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list", { name: "Seats" })).toHaveTextContent("73%");
    await expect(canvas.getAllByText("29")).toHaveLength(2);
  },
});

export const NoParts = meta.story({
  name: "No parts",
  args: { parts: [], totalText: "", centerLabel: "Nothing yet" },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
    await expect(canvas.getByText("0")).toBeInTheDocument();
  },
});

export const NonPositiveParts = meta.story({
  name: "Zero and negative parts",
  args: {
    parts: [
      { label: "Paid", value: 64 },
      { label: "Disputed", value: 0 },
      { label: "Written off", value: -3 },
    ],
    label: "Payment status",
    centerLabel: "Invoices",
    totalText: "",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.queryByText("Disputed")).toBeNull();
    await expect(canvas.getByRole("list", { name: "Payment status" })).toHaveTextContent("100%");
  },
});

export const PartsOfAWhole = meta.story({
  name: "Parts of a whole",
  parameters: {
    docs: {
      description: { story: "Hovering a slice or focusing a legend row puts its amount and share in the middle." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-ring label="Revenue by channel" center-label="Revenue" total-text="$98.4k" .parts=${channels}></ui-ring>
  `,
});

export const MoreThanSixParts = meta.story({
  name: "More than six parts",
  parameters: {
    docs: { description: { story: "Past six parts the smallest fold into one muted Other slice." } },
    canvas: "column",
  },
  render: () => html`<ui-ring label="Orders by region" center-label="Orders" .parts=${regions}></ui-ring>`,
});

export const AgainstAMax = meta.story({
  name: "Against a max",
  parameters: {
    docs: { description: { story: "With max set, shares are of max and the unused rest shows as empty track." } },
    canvas: "column",
  },
  render: () => html`
    <ui-ring
      label="Marketing budget"
      center-label="of $50k spent"
      total-text="$36k"
      max="50000"
      .parts=${[
        { label: "Events", value: 16000, valueText: "$16k" },
        { label: "Advertising", value: 12500, valueText: "$12.5k" },
        { label: "Content", value: 7500, valueText: "$7.5k" },
      ]}
    ></ui-ring>
    <ui-ring label="Seats" center-label="of 40 seats" max="40" .parts=${[{ label: "Assigned", value: 29 }]}></ui-ring>
  `,
});

export const SinglePartAndZeros = meta.story({
  name: "Single part and zeros",
  parameters: {
    docs: { description: { story: "Parts with zero or negative values are left out." } },
    canvas: "column",
  },
  render: () => html`
    <ui-ring
      label="Payment status"
      center-label="Invoices"
      .parts=${[
        { label: "Paid", value: 64 },
        { label: "Disputed", value: 0 },
        { label: "Written off", value: -3 },
      ]}
    ></ui-ring>
  `,
});

export const ArcPointer = meta.story({
  name: "Pointer on the arc",
  parameters: {
    docs: {
      description: { story: "Pointing at the arc reads that part; clicking a linked part follows its legend link." },
    },
  },
  render: () => html`
    <ui-ring
      max="100"
      .parts=${[
        { label: "Paid", value: 50, href: "#paid" },
        { label: "Open", value: 25 },
      ]}
    ></ui-ring>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
    const arc = canvasElement.querySelector<HTMLElement>("ui-ring [aria-hidden]")!;
    const middle = canvasElement.querySelector<HTMLElement>("ui-ring [aria-hidden] + [aria-hidden]")!;
    const link = canvas.getByRole("link", { name: /Paid/ });
    const followed: string[] = [];
    link.addEventListener("click", (e) => {
      e.preventDefault();
      followed.push(link.getAttribute("href")!);
    });
    const at = (deg: number, reach: number) => {
      const r = arc.getBoundingClientRect();
      const radius = (reach * r.width) / 2;
      const a = (deg * Math.PI) / 180;
      return {
        target: arc,
        coords: {
          clientX: r.left + r.width / 2 + radius * Math.sin(a),
          clientY: r.top + r.height / 2 - radius * Math.cos(a),
        },
      };
    };
    await expect(middle).toHaveTextContent("75");
    await userEvent.pointer(at(90, 0.85));
    await expect(middle).toHaveTextContent("Paid · 50%");
    await userEvent.pointer(at(100, 0.9));
    await expect(middle).toHaveTextContent("Paid · 50%");
    await userEvent.pointer(at(225, 0.85));
    await expect(middle).toHaveTextContent("Open · 25%");
    await userEvent.pointer(at(315, 0.85));
    await expect(middle).toHaveTextContent("75");
    await userEvent.pointer(at(90, 0.3));
    await expect(middle).toHaveTextContent("75");
    await userEvent.pointer([{ ...at(90, 0.85), keys: "[MouseLeft]" }]);
    await expect(followed).toEqual(["#paid"]);
    await userEvent.pointer([{ ...at(225, 0.85), keys: "[MouseLeft]" }]);
    await userEvent.pointer([{ ...at(90, 0.3), keys: "[MouseLeft]" }]);
    await expect(followed).toEqual(["#paid"]);
    await userEvent.unhover(arc);
    await expect(middle).toHaveTextContent("75");
  },
});
