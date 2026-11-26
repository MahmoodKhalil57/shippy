import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "./treemap.ts";
import type { TreemapItem } from "./treemap.ts";
import { squarify } from "../../../lib/base/treemap.ts";

const k = (v: number) => `$${(v / 1000).toFixed(1)}k`;

const categories: TreemapItem[] = [
  { label: "Furniture", value: 148000 },
  { label: "Computers", value: 96000 },
  { label: "Printing", value: 52000 },
  { label: "Stationery", value: 31000 },
  { label: "Lighting", value: 18000 },
  { label: "Cleaning", value: 9500 },
].map((x) => ({ ...x, valueText: k(x.value) }));

const regions: TreemapItem[] = [
  { label: "North", value: 312, href: "#north" },
  { label: "South", value: 241, href: "#south" },
  { label: "East", value: 188, href: "#east" },
  { label: "West", value: 164, href: "#west" },
  { label: "Central", value: 97, href: "#central" },
  { label: "Coastal", value: 61, href: "#coastal" },
  { label: "Islands", value: 22, href: "#islands" },
  { label: "Mountain", value: 14, href: "#mountain" },
  { label: "Overseas", value: 6, href: "#overseas" },
];

const meta = preview.meta({
  title: "Primitives/Data/Treemap",
  component: "ui-treemap",
  parameters: { canvas: "column" },
  args: {
    items: categories,
    label: "Spend by category",
    total: "$354.5k",
  },
  argTypes: {
    items: { control: "object" },
    label: { control: "text" },
    total: { control: "text" },
  },
  render: (args) => html`
    <ui-treemap .items=${args.items} label=${ifDefined(args.label)} total=${ifDefined(args.total)}></ui-treemap>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the treemap; Tab moves through the tiles from largest to smallest." },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole("list", { name: "Spend by category" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(6);
    await expect(canvas.getByText("Spend by category · $354.5k")).toBeInTheDocument();
    await userEvent.tab();
    const furniture = canvas.getByRole("listitem", { name: "Furniture, $148.0k, 42%" });
    await expect(furniture).toHaveFocus();
    await expect(await canvas.findByText("Furniture · $148.0k · 42%")).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole("listitem", { name: "Computers, $96.0k, 27%" })).toHaveFocus();
    await expect(await canvas.findByText("Computers · $96.0k · 27%")).toBeInTheDocument();
    await userEvent.tab({ shift: true });
    await expect(furniture).toHaveFocus();
    const computers = canvas.getByRole("listitem", { name: "Computers, $96.0k, 27%" });
    await expect(computers.firstElementChild).toHaveClass("opacity-10");
    await expect(computers.className).not.toMatch(/opacity/);
    await expect(furniture.firstElementChild).toHaveClass("opacity-55");
    furniture.blur();
    await canvasElement.querySelector("ui-treemap")?.updateComplete;
    await expect(canvas.getByText("Spend by category · $354.5k")).toBeInTheDocument();
    await expect(computers.firstElementChild).toHaveClass("opacity-30");
    // End with a tile focused, so the accessibility check reads the dimmed tiles' text contrast.
    await userEvent.tab();
    await expect(await canvas.findByText("Furniture · $148.0k · 42%")).toBeInTheDocument();
  },
});

export const LinkedTiles = meta.story({
  name: "Linked tiles",
  args: { items: regions, label: "Orders by region", total: undefined },
  play: async ({ canvas, userEvent }) => {
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(9);
    await expect(canvas.getByText("Orders by region · 1,105")).toBeInTheDocument();
    await userEvent.tab();
    const north = canvas.getByRole("link", { name: "North, 312, 28%" });
    await expect(north).toHaveFocus();
    await expect(north).toHaveAttribute("href", "#north");
    await expect(canvas.getByRole("link", { name: /^South, / }).firstElementChild).toHaveClass("opacity-10");
  },
});

export const ZerosAndNegatives = meta.story({
  name: "Zero and negative items",
  args: {
    items: [
      { label: "Damaged", value: 48 },
      { label: "Changed mind", value: 0 },
      { label: "Adjustment", value: -4 },
    ],
    label: "Returns by reason",
    total: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.getByRole("listitem", { name: "Damaged, 48, 100%" })).toBeInTheDocument();
    await expect(canvas.queryByText("Changed mind")).toBeNull();
  },
});

export const NoItems = meta.story({
  name: "No items",
  args: { items: [], label: "Nothing spent", total: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
    await expect(canvas.getByText("Nothing spent · 0")).toBeInTheDocument();
  },
});

export const SpendByCategory = meta.story({
  name: "Spend by category",
  parameters: {
    docs: {
      description: {
        story:
          "Each tile is focusable and named with its amount and share; tiles too small for text drop the name, then the amount.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-treemap label="Spend by category" total="$354.5k" .items=${categories}></ui-treemap>`,
});

export const LinkedTilesAndManyItems = meta.story({
  name: "Linked tiles and many items",
  parameters: {
    docs: { description: { story: "Past six tiles the colours turn muted; tiles with an href are links." } },
    canvas: "column",
  },
  render: () => html`<ui-treemap label="Orders by region" .items=${regions}></ui-treemap>`,
});

export const OneDominantItem = meta.story({
  name: "One dominant item",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-treemap
      label="Revenue by customer type"
      .items=${[
        { label: "Wholesale", value: 820000, valueText: "$820k" },
        { label: "Retail", value: 64000, valueText: "$64k" },
        { label: "Online", value: 21000, valueText: "$21k" },
      ]}
    ></ui-treemap>
  `,
});

export const ZerosLeftOut = meta.story({
  name: "Zeros left out",
  parameters: { docs: { description: { story: "Items at zero or below are not drawn." } }, canvas: "column" },
  render: () => html`
    <ui-treemap
      label="Returns by reason"
      .items=${[
        { label: "Damaged", value: 48 },
        { label: "Wrong item", value: 31 },
        { label: "Changed mind", value: 0 },
        { label: "Late delivery", value: 12 },
      ]}
    ></ui-treemap>
  `,
});

export const ResizeAndHover = meta.story({
  name: "Resize and hover",
  parameters: {
    docs: {
      description: { story: "Tiles re-lay out when the plot changes size; an empty size keeps the last layout." },
    },
  },
  render: () => html`<div style="inline-size: 320px"><ui-treemap .items=${categories}></ui-treemap></div>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const box = canvasElement.querySelector<HTMLElement>("div[style]")!;
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
    await expect(canvas.getByText("354,500")).toBeInTheDocument();
    const tile = () => canvas.getByRole("listitem", { name: "Furniture, $148.0k, 42%" });
    const width = () =>
      canvas
        .getAllByRole("listitem")
        .map((li) => `${li.style.getPropertyValue("--w")} ${li.style.getPropertyValue("--h")}`)
        .join();
    const values = categories.map((x) => x.value);
    const laidOut = (w: number, h: number) =>
      squarify(values, w, h)
        .map((r) => `${(r.w / w) * 100}% ${(r.h / h) * 100}%`)
        .join();
    const plot = () => canvas.getByRole("list").getBoundingClientRect();
    await waitFor(() => expect(width()).toBe(laidOut(320, Math.round(plot().height))));
    const before = width();
    box.style.inlineSize = "0px";
    await expect(plot().width).toBe(0);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await expect(width()).toBe(before);
    box.style.inlineSize = "960px";
    await waitFor(() => expect(width()).toBe(laidOut(960, Math.round(plot().height))));
    await expect(width()).not.toBe(before);
    tile().focus();
    await expect(await canvas.findByText("Furniture · $148.0k · 42%")).toBeInTheDocument();
    await userEvent.hover(tile());
    await expect(await canvas.findByText("Furniture · $148.0k · 42%")).toBeInTheDocument();
    await userEvent.hover(canvas.getByRole("listitem", { name: "Printing, $52.0k, 15%" }));
    await expect(await canvas.findByText("Printing · $52.0k · 15%")).toBeInTheDocument();
    await userEvent.unhover(canvas.getByRole("list"));
    await expect(await canvas.findByText("354,500")).toBeInTheDocument();
  },
});
