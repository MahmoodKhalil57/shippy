import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./share-bar.ts";
import type { SharePart } from "./share-bar.ts";

const pipeline: SharePart[] = [
  { label: "Won", value: 184000, valueText: "$184k" },
  { label: "Open", value: 126000, valueText: "$126k" },
  { label: "Stalled", value: 48000, valueText: "$48k" },
  { label: "Lost", value: 31000, valueText: "$31k" },
];

const products: SharePart[] = [
  { label: "Hardware", value: 3400, href: "#hardware" },
  { label: "Software", value: 2900, href: "#software" },
  { label: "Services", value: 1800, href: "#services" },
  { label: "Support", value: 1100, href: "#support" },
  { label: "Training", value: 700, href: "#training" },
  { label: "Licensing", value: 450, href: "#licensing" },
  { label: "Shipping", value: 240, href: "#shipping" },
  { label: "Other fees", value: 90, href: "#fees" },
];

const meta = preview.meta({
  title: "Primitives/Data/Share bar",
  component: "ui-share-bar",
  parameters: { canvas: "column" },
  args: {
    parts: pipeline,
    label: "Pipeline by stage",
    total: "$389k",
  },
  argTypes: {
    parts: { control: "object" },
    label: { control: "text" },
    total: { control: "text" },
  },
  render: (args) => html`
    <ui-share-bar .parts=${args.parts} label=${ifDefined(args.label)} total=${ifDefined(args.total)}></ui-share-bar>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the bar; Tab through the legend to read each part." } },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const legend = canvas.getByRole("list", { name: "Pipeline by stage" });
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
    await expect(legend).toHaveTextContent("47%");
    await expect(canvas.getByText("$389k")).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByText("Won").closest("[tabindex]")).toHaveFocus();
    await expect(await canvas.findByText("Won · 47%")).toBeInTheDocument();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(await canvas.findByText("Lost · 8%")).toBeInTheDocument();
    const won = canvas.getByText("Won").closest("[tabindex]")!;
    await expect(won.firstElementChild).toHaveClass("opacity-30");
    await expect(won.className).not.toMatch(/opacity/);
    (document.activeElement as HTMLElement).blur();
    await canvasElement.querySelector("ui-share-bar")?.updateComplete;
    await expect(canvas.getByText("Pipeline by stage")).toBeInTheDocument();
    await expect(won.firstElementChild).not.toHaveClass("opacity-30");
    // End with a part focused, so the accessibility check reads the dimmed legend's contrast.
    await userEvent.tab();
    await expect(await canvas.findByText("Won · 47%")).toBeInTheDocument();
  },
});

export const FoldedLinks = meta.story({
  name: "Folded links",
  args: { parts: products, label: "Revenue by product", total: undefined },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(6);
    await expect(canvas.getAllByRole("link")).toHaveLength(5);
    await expect(canvas.getByRole("link", { name: /Hardware/ })).toHaveAttribute("href", "#hardware");
    await expect(canvas.getByText("Other")).toBeInTheDocument();
    await expect(canvas.getByText("780")).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: /Hardware/ })).toHaveFocus();
    await expect(await canvas.findByText("Hardware · 32%")).toBeInTheDocument();
    await expect(canvas.getByText("Other").closest("[tabindex]")!.firstElementChild).toHaveClass("opacity-30");
  },
});

export const SinglePart = meta.story({
  name: "Single part",
  args: { parts: [{ label: "Paid", value: 64 }], label: "Invoices", total: "64" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list", { name: "Invoices" })).toHaveTextContent("100%");
  },
});

export const NoParts = meta.story({
  name: "No parts",
  args: { parts: [], label: "Nothing to share", total: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
    await expect(canvas.getByText("Nothing to share")).toBeInTheDocument();
  },
});

export const ZeroAndNegative = meta.story({
  name: "Zero and negative parts",
  args: {
    parts: [
      { label: "Kept", value: 30 },
      { label: "Refunded", value: 0 },
      { label: "Adjusted", value: -5 },
    ],
    label: "Orders",
    total: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.queryByText("Refunded")).toBeNull();
  },
});

export const Shares = meta.story({
  name: "Shares",
  parameters: {
    docs: { description: { story: "Percentages are rounded so they always add up to 100." } },
    canvas: "column",
  },
  render: () => html`<ui-share-bar label="Pipeline by stage" total="$389k" .parts=${pipeline}></ui-share-bar>`,
});

export const LinkedAndFolded = meta.story({
  name: "Linked and folded",
  parameters: {
    docs: {
      description: {
        story: "Past six parts the rest fold into Other; parts with an href link from the legend and the bar.",
      },
    },
    canvas: "column",
  },
  render: () =>
    html`<ui-share-bar label="Sales by product line" total="10,680 units" .parts=${products}></ui-share-bar>`,
});

export const TwoParts = meta.story({
  name: "Two parts",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-share-bar
      label="Invoices"
      total="248"
      .parts=${[
        { label: "Paid on time", value: 211 },
        { label: "Paid late", value: 37 },
      ]}
    ></ui-share-bar>
  `,
});

export const ASliver = meta.story({
  name: "A sliver",
  parameters: {
    docs: { description: { story: "A very small part keeps a minimum width so it stays visible." } },
    canvas: "column",
  },
  render: () => html`
    <ui-share-bar
      label="Order outcomes"
      total="5,120"
      .parts=${[
        { label: "Delivered", value: 5080 },
        { label: "Returned", value: 36 },
        { label: "Lost in transit", value: 4 },
      ]}
    ></ui-share-bar>
  `,
});

export const SegmentPointer = meta.story({
  name: "Segment pointer",
  parameters: {
    docs: {
      description: { story: "Pointing at a segment reads it; clicking a linked segment follows its legend link." },
    },
  },
  render: () => html`
    <ui-share-bar
      .parts=${[
        { label: "Online", value: 60, href: "#online" },
        { label: "Retail", value: 40 },
      ]}
    ></ui-share-bar>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
    const track = canvasElement.querySelector<HTMLElement>("ui-share-bar [aria-hidden]")!;
    const [online, retail] = [...track.children] as HTMLElement[];
    const link = canvas.getByRole("link", { name: /Online/ });
    const followed: string[] = [];
    link.addEventListener("click", (e) => {
      e.preventDefault();
      followed.push(link.getAttribute("href")!);
    });
    link.focus();
    await expect(await canvas.findByText("Online · 60%")).toBeInTheDocument();
    await userEvent.hover(online!);
    await expect(canvas.getByText("Online · 60%")).toBeInTheDocument();
    await userEvent.click(online!);
    await expect(followed).toEqual(["#online"]);
    await userEvent.hover(retail!);
    await expect(await canvas.findByText("Retail · 40%")).toBeInTheDocument();
    await userEvent.click(retail!);
    await expect(followed).toEqual(["#online"]);
    await userEvent.unhover(track);
    await expect(canvas.queryByText(/ · /)).toBeNull();
  },
});
