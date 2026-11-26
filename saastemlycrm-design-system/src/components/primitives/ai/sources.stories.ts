import preview from "#.storybook/preview";
import { html } from "lit";
import { expect } from "storybook/test";
import "./sources.ts";
import "../layout/box.ts";
import type { Source } from "./sources.ts";

const sources: Source[] = [
  { label: "Order 10482", href: "/orders/10482" },
  { label: "Shipment tracking", href: "/shipments/58213" },
  { label: "Carrier delivery times", href: "https://example.com/delivery-times" },
  { label: "Returns policy", href: "https://example.com/help/returns" },
];

const withDuplicates: Source[] = [
  ...sources.slice(0, 2),
  { label: "Order 10482 (again)", href: "/orders/10482" },
  { label: "Shipment tracking (again)", href: "/shipments/58213" },
];

const longLabel: Source[] = [
  {
    label: "Delivery times for parcels sent to rural addresses during public holidays and peak season",
    href: "https://example.com/help/delivery-times-rural-holidays",
  },
];

const panel = (content: unknown) => html`<ui-box width="80">${content}</ui-box>`;

const disclosure = (el: HTMLElement) => el.querySelector<HTMLDetailsElement>("ui-sources details")!;

const meta = preview.meta({
  title: "Primitives/Ai/Sources",
  component: "ui-sources",
  args: {
    items: sources,
    open: false,
  },
  argTypes: {
    items: { control: "object", description: "Sources with a label and href; duplicates by href are shown once." },
  },
  render: (args) => panel(html`<ui-sources ?open=${args.open} .items=${args.items}></ui-sources>`),
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the sources; the summary opens and closes the list." } },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const details = disclosure(canvasElement);
    const summary = canvas.getByText("Used 4 sources");
    await expect(details.open).toBe(false);
    await expect(canvas.getByText("Returns policy")).not.toBeVisible();
    await userEvent.click(summary);
    await expect(details.open).toBe(true);
    const external = canvas.getByText("Returns policy").closest("a")!;
    await expect(external).toBeVisible();
    await expect(external).toHaveAttribute("target", "_blank");
    await expect(external).toHaveAttribute("rel", "noreferrer noopener");
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
    await expect(canvas.getByText("Order 10482").closest("a")).toHaveAttribute("target", "_self");
    await userEvent.click(summary);
    await expect(details.open).toBe(false);
    await expect(canvas.getByText("Returns policy")).not.toBeVisible();
  },
});

export const FocusableSummary = meta.story({
  name: "Focusable summary",
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByText("Used 4 sources").closest("summary")).toHaveFocus();
  },
});

export const Deduplicated = meta.story({
  name: "Deduplicated",
  args: { items: withDuplicates },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Used 2 sources")).toBeVisible();
    await expect(canvas.getByRole("list", { hidden: true }).querySelectorAll("a")).toHaveLength(2);
    await expect(canvas.getAllByRole("listitem", { hidden: true })).toHaveLength(2);
    const links = canvas.getByRole("list", { hidden: true }).querySelectorAll("a");
    await expect(links[0]).toHaveTextContent("Order 10482");
    await expect(links[0]).not.toHaveTextContent("(again)");
    await expect(links[1]).toHaveTextContent("Shipment tracking");
    await expect(links[1]).not.toHaveTextContent("(again)");
  },
});

export const NoSources = meta.story({
  name: "No sources",
  args: { items: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-sources details")).toBeNull();
  },
});

export const CollapsedAndOpen = meta.story({
  name: "Collapsed and open",
  parameters: {
    docs: {
      description: {
        story: "In-app pages open in place and are marked with a link icon; other sites open in a new tab.",
      },
    },
  },
  render: () => html`
    ${panel(html`<ui-sources .items=${sources}></ui-sources>`)}
    ${panel(html`<ui-sources open .items=${sources}></ui-sources>`)}
  `,
});

export const Duplicates = meta.story({
  name: "Duplicates",
  parameters: {
    docs: {
      description: { story: "Sources with the same address are listed once, so this shows two rather than four." },
    },
  },
  render: () => panel(html`<ui-sources open .items=${withDuplicates}></ui-sources>`),
});

export const LongLabels = meta.story({
  name: "Long labels",
  parameters: { docs: { description: { story: "A long label is cut to one line." } } },
  render: () => panel(html`<ui-sources open .items=${longLabel}></ui-sources>`),
});
