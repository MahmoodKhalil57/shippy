import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./indicator.ts";
import "./box.ts";
import "../people/avatar.ts";
import "../data/badge.ts";
import "../actions/icon-button.ts";
import type { IndicatorItem, IndicatorItemVariants } from "./indicator.ts";

const target = (label: string) =>
  html`<ui-box surface="base-200" border rounded="box" padding="6" width="52" center>${label}</ui-box>`;

const horizontals: NonNullable<IndicatorItemVariants["horizontal"]>[] = ["start", "center", "end"];
const verticals: NonNullable<IndicatorItemVariants["vertical"]>[] = ["top", "middle", "bottom"];

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Layout/Indicator",
  component: "ui-indicator",
  args: {
    text: "Inbox",
    item: "3",
    badge: "secondary",
    horizontal: "end",
    vertical: "top",
    size: undefined,
    items: [],
  },
  argTypes: {
    text: { control: "text", description: "The content the indicator sits on." },
    item: { control: "text", description: "The badge text; empty for none." },
    badge: {
      control: "select",
      options: ["plain", "neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    horizontal: { control: "inline-radio", options: horizontals },
    vertical: { control: "inline-radio", options: verticals },
    size: { control: "inline-radio", options: ["xs"] },
    items: { control: "object", description: "Several placed items, each with its own content, badge and place." },
  },
  render: (args) => html`
    <ui-indicator
      item=${ifDefined(args.item)}
      badge=${ifDefined(args.badge)}
      horizontal=${ifDefined(args.horizontal)}
      vertical=${ifDefined(args.vertical)}
      size=${ifDefined(args.size)}
      .items=${args.items}
      >${target(args.text)}</ui-indicator
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the indicator and its badge." } } },
  play: async ({ canvas }) => {
    const badge = canvas.getByText("3");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass("badge-secondary", "indicator-end", "indicator-top");
    const box = canvas.getByText("Inbox").getBoundingClientRect();
    const mark = badge.getBoundingClientRect();
    await expect(mark.left + mark.width / 2).toBeGreaterThan(box.left + box.width / 2);
    await expect(mark.top).toBeLessThan(box.top + box.height / 2);
  },
});

export const BottomStart = meta.story({
  name: "Bottom start",
  args: { horizontal: "start", vertical: "bottom", item: "New", badge: "primary" },
  play: async ({ canvas }) => {
    const badge = canvas.getByText("New");
    await expect(badge).toHaveClass("badge-primary", "indicator-start", "indicator-bottom");
    const box = canvas.getByText("Inbox").getBoundingClientRect();
    const mark = badge.getBoundingClientRect();
    await expect(mark.left + mark.width / 2).toBeLessThan(box.left + box.width / 2);
    await expect(mark.bottom).toBeGreaterThan(box.top + box.height / 2);
  },
});

export const Counter = meta.story({
  name: "Counter",
  args: { item: "12", badge: "error", size: "xs" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("12")).toHaveClass("badge-error", "badge-xs");
  },
});

export const WithoutAnItem = meta.story({
  name: "Without an item",
  args: { item: "" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Inbox")).toBeVisible();
    await expect(canvasElement.querySelector(".indicator-item")).toBeNull();
  },
});

export const SeveralItems = meta.story({
  name: "Several items",
  args: {
    item: "",
    items: [
      { content: "Draft", badge: "neutral", horizontal: "start", vertical: "top" },
      { content: "2", badge: "error", horizontal: "end", vertical: "top" },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Draft")).toHaveClass("badge-neutral", "indicator-start");
    await expect(canvas.getByText("2")).toHaveClass("badge-error", "indicator-end");
  },
});

export const BadgeColours = meta.story({
  name: "Badge colours",
  parameters: {
    docs: { description: { story: "A text or number item becomes a secondary badge unless another colour is set." } },
  },
  render: () => html`
    <ui-indicator item="3">${target("Default")}</ui-indicator>
    <ui-indicator item="New" badge="primary">${target("Primary")}</ui-indicator>
    <ui-indicator item="2" badge="neutral">${target("Neutral")}</ui-indicator>
    <ui-indicator item="Sale" badge="accent">${target("Accent")}</ui-indicator>
    <ui-indicator item="1" badge="info">${target("Info")}</ui-indicator>
    <ui-indicator item="Paid" badge="success">${target("Success")}</ui-indicator>
    <ui-indicator item="Late" badge="warning">${target("Warning")}</ui-indicator>
    <ui-indicator item="9" badge="error">${target("Error")}</ui-indicator>
    <ui-indicator item="Plain" badge="plain">${target("Plain")}</ui-indicator>
  `,
});

export const Placement = meta.story({
  name: "Placement",
  render: () =>
    html`${verticals.flatMap((vertical) =>
      horizontals.map(
        (horizontal) =>
          html`<ui-indicator item="1" horizontal=${horizontal} vertical=${vertical}
            >${target(`${vertical} ${horizontal}`)}</ui-indicator
          >`,
      ),
    )}`,
});

export const SmallCounter = meta.story({
  name: "Small counter",
  render: () => html`
    <ui-indicator item="4" badge="error" size="xs">
      <ui-icon-button icon="bell" label="Notifications" variant="tonal"></ui-icon-button>
    </ui-indicator>
    <ui-indicator item="12" badge="primary" size="xs">
      <ui-icon-button icon="mail" label="Messages" variant="tonal"></ui-icon-button>
    </ui-indicator>
  `,
});

export const SlottedAndSeveralItems = meta.story({
  name: "Slotted and several items",
  parameters: {
    docs: {
      description: {
        story: "Any element can be the item through the item slot, and an items list places several at once.",
      },
    },
  },
  render: () => html`
    <ui-indicator horizontal="end" vertical="bottom">
      <ui-badge slot="item" dot tone="success" label="Online"></ui-badge>
      <ui-avatar initials="JD" size="sm"></ui-avatar>
    </ui-indicator>
    <ui-indicator
      .items=${
        [
          { content: "Draft", badge: "neutral", horizontal: "start", vertical: "top" },
          { content: "2", badge: "error", horizontal: "end", vertical: "top" },
        ] satisfies IndicatorItem[]
      }
      >${target("Two items")}</ui-indicator
    >
  `,
});

export const ItemKinds = meta.story({
  name: "Item kinds",
  parameters: {
    docs: {
      description: {
        story:
          "A number item becomes a secondary badge like text does; a rendered item keeps its own look and gets no badge.",
      },
    },
  },
  render: () => html`
    <ui-indicator .item=${7}>${target("Number")}</ui-indicator>
    <ui-indicator .item=${html`<ui-badge dot tone="success" label="Online"></ui-badge>`}
      >${target("Rendered")}</ui-indicator
    >
  `,
  play: async ({ canvas }) => {
    const number = canvas.getByText("7");
    await expect(number).toHaveClass("indicator-item", "badge", "badge-secondary");
    const rendered = canvas.getByText("Rendered").closest("ui-indicator")!.querySelector(".indicator-item")!;
    await expect(rendered.querySelector("ui-badge")).not.toBeNull();
    await expect(rendered).not.toHaveClass("badge");
    await expect(canvas.getByLabelText("Online")).toBeInTheDocument();
  },
});
