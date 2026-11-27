import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./timeline.ts";
import "../layout/box.ts";
import { auditLayout } from "../../../lib/base/layout.ts";
import "../media/icon.ts";
import type { TimelineItem } from "./timeline.ts";

const order: TimelineItem[] = [
  { start: "2 Mar", end: "Order placed", done: true, box: "end" },
  { start: "3 Mar", end: "Payment received", done: true, box: "end" },
  { start: "4 Mar", end: "Packed", done: true, box: "end" },
  { start: "5 Mar", end: "Shipped", box: "end" },
  { start: "7 Mar", end: "Delivered", box: "end" },
];

const history: TimelineItem[] = [
  {
    end: { time: "09:12", heading: "Quote sent", text: "Quote Q-3381 for 40 desks, valid for 14 days." },
    done: true,
  },
  {
    end: { time: "11:40", heading: "Discount approved", text: "Finance approved an 8% volume discount." },
    done: true,
  },
  {
    end: { time: "15:05", heading: "Purchase order received", text: "PO-2026-0184 matched to the quote." },
    done: true,
  },
  { end: { time: "Pending", heading: "Invoice", text: "Raised once the goods ship." } },
];

const meta = preview.meta({
  title: "Primitives/Data/Timeline",
  component: "ui-timeline",
  parameters: { canvas: "column" },
  args: {
    items: history,
    direction: "vertical",
    snapIcon: true,
    compact: true,
    spaced: false,
    startAlign: undefined,
    noIcons: false,
  },
  argTypes: {
    items: { control: "object" },
    direction: { control: "inline-radio", options: ["horizontal", "vertical"] },
    snapIcon: { control: "boolean" },
    compact: { control: "boolean" },
    spaced: { control: "boolean" },
    startAlign: { control: "inline-radio", options: [undefined, "start", "end"] },
    noIcons: { control: "boolean" },
  },
  render: (args) => html`
    <ui-timeline
      .items=${args.items}
      direction=${ifDefined(args.direction)}
      ?snap-icon=${args.snapIcon}
      ?compact=${args.compact}
      ?spaced=${args.spaced}
      start-align=${ifDefined(args.startAlign)}
      ?no-icons=${args.noIcons}
    ></ui-timeline>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the timeline; edit items to change the events." } },
  },
  play: async ({ canvas, canvasElement }) => {
    const rows = canvas.getAllByRole("listitem");
    await expect(rows).toHaveLength(4);
    await expect(rows[0]).toHaveTextContent("Quote sent");
    await expect(rows[0]).toHaveTextContent("Quote Q-3381 for 40 desks, valid for 14 days.");
    await expect(canvas.getByText("09:12").tagName).toBe("TIME");
    await expect(rows[3]).toHaveTextContent("Invoice");
    await expect(canvasElement.querySelectorAll("li svg")).toHaveLength(4);
  },
});

export const HorizontalOrder = meta.story({
  name: "Horizontal order",
  args: { items: order, direction: "horizontal", compact: false, snapIcon: false },
  play: async ({ canvas, canvasElement }) => {
    const rows = canvas.getAllByRole("listitem");
    await expect(rows).toHaveLength(5);
    await expect(rows[0]).toHaveTextContent("2 Mar");
    await expect(rows[4]).toHaveTextContent("Delivered");
    await expect(canvasElement.querySelectorAll("hr")).toHaveLength(8);
  },
});

export const WithoutIcons = meta.story({
  name: "Without icons",
  args: { items: order, noIcons: true, compact: false },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(5);
    await expect(canvasElement.querySelector("li svg")).toBeNull();
  },
});

export const SingleItem = meta.story({
  name: "Single item",
  args: { items: [{ start: "Today", end: "Account opened", done: true, box: "end" }], compact: false },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("listitem")).toHaveTextContent("Account opened");
    await expect(canvasElement.querySelector("hr")).toBeNull();
  },
});

export const Horizontal = meta.story({
  name: "Horizontal",
  parameters: {
    docs: { description: { story: "Done steps colour their icon and the line between two done steps." } },
    canvas: "column",
  },
  render: () => html`<ui-timeline direction="horizontal" .items=${order}></ui-timeline>`,
});

export const Vertical = meta.story({
  name: "Vertical",
  parameters: { canvas: "column" },
  render: () => html`<ui-timeline direction="vertical" .items=${order}></ui-timeline>`,
});

export const Events = meta.story({
  name: "Events",
  parameters: {
    docs: {
      description: { story: "An event object gives a time, a heading and text; compact puts every item on one side." },
    },
    canvas: "column",
  },
  render: () => html`<ui-timeline direction="vertical" compact snap-icon .items=${history}></ui-timeline>`,
});

export const BothSides = meta.story({
  name: "Both sides",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-timeline
      direction="vertical"
      spaced
      start-align="end"
      .items=${[
        {
          start: { time: "Q1", heading: "Pilot" },
          end: "Two warehouses on the new system",
          box: "end",
          done: true,
        },
        { start: { time: "Q2", heading: "Rollout" }, end: "All regions migrated", box: "both", done: true },
        { start: { time: "Q3", heading: "Review" }, end: "Measure picking times", box: "start" },
      ]}
    ></ui-timeline>
  `,
});

export const CustomIconsAndNone = meta.story({
  name: "Custom icons and none",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-timeline
      direction="horizontal"
      .items=${[
        { start: "Ordered", icon: html`<ui-icon name="clipboard" color="primary"></ui-icon>`, done: true },
        { start: "Shipped", icon: html`<ui-icon name="truck" color="primary"></ui-icon>`, done: true },
        { start: "Delivered", icon: html`<ui-icon name="home"></ui-icon>` },
      ]}
    ></ui-timeline>
    <ui-timeline direction="horizontal" no-icons .items=${order}></ui-timeline>
  `,
});

export const PartialEvents = meta.story({
  name: "Partial events",
  parameters: { docs: { description: { story: "An event may give only a time or only text." } }, canvas: "column" },
  args: {
    items: [
      { end: { time: "08:30", text: "Picking started." }, done: true },
      { end: { text: "Waiting on the carrier." } },
    ],
    compact: true,
  },
  play: async ({ canvas, canvasElement }) => {
    const [first, second] = canvas.getAllByRole("listitem");
    await expect(first).toHaveTextContent("08:30");
    await expect(first).toHaveTextContent("Picking started.");
    await expect(canvas.getByText("08:30").tagName).toBe("TIME");
    await expect(second).toHaveTextContent("Waiting on the carrier.");
    await expect(second!.querySelector("time")).toBeNull();
    await expect(canvasElement.querySelectorAll("li .text-title-md")).toHaveLength(0);
  },
});

export const MarkupItems = meta.story({
  name: "Markup items",
  parameters: { docs: { description: { story: "Without items the timeline renders its own list items." } } },
  render: () => html`
    <ui-timeline direction="vertical">
      <li><div class="timeline-end timeline-box">Draft saved</div></li>
      <li><div class="timeline-end timeline-box">Sent for review</div></li>
    </ui-timeline>
  `,
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list");
    const rows = canvas.getAllByRole("listitem");
    await expect(rows).toHaveLength(2);
    await expect(rows[0]!.parentElement).toBe(list);
    await expect(rows[1]).toHaveTextContent("Sent for review");
  },
});

export const NarrowKeepsTheText = meta.story({
  name: "Narrow box keeps each entry readable",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => {
    const entries = html`<ui-timeline
      direction="vertical"
      snap-icon
      compact
      .items=${[
        { end: { heading: "Reassigned from the sales desk to the buying desk" }, box: "end", done: true },
        { end: { heading: "Agent update: arrival moved by one day, delivery unchanged" }, box: "end" },
      ]}
    ></ui-timeline>`;
    return html`<ui-box padding="16" width="full"><ui-box padding="3" width="full">${entries}</ui-box></ui-box>
      <ui-box padding="16" width="full"><ui-box padding="16" width="full">${entries}</ui-box></ui-box>`;
  },
  play: async ({ canvasElement }) => {
    await expect(auditLayout(canvasElement).map((i) => `${i.kind} ${i.detail}`)).toEqual([]);
  },
});
