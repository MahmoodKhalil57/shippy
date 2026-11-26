import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./page-header.ts";
import "../actions/button.ts";
import "../data/tag.ts";
import "../navigation/breadcrumbs.ts";
import type { BreadcrumbItem } from "../navigation/breadcrumbs.ts";

const trail: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Orders", href: "#" },
  { label: "Order 10482" },
];

const meta = preview.meta({
  title: "Primitives/Layout/Page header",
  component: "ui-page-header",
  args: {
    heading: "Orders",
    eyebrow: "Sales",
    subtitle: "Every order placed in the last 90 days, newest first.",
    loading: false,
  },
  argTypes: {
    heading: { control: "text" },
    eyebrow: { control: "text" },
    subtitle: { control: "text" },
  },
  render: (args) => html`
    <ui-page-header
      heading=${ifDefined(args.heading)}
      eyebrow=${ifDefined(args.eyebrow)}
      subtitle=${ifDefined(args.subtitle)}
      ?loading=${args.loading}
    ></ui-page-header>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the header." } }, canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Orders" })).toBeVisible();
    await expect(canvas.getByText("Sales")).toBeVisible();
    await expect(canvas.getByText("Every order placed in the last 90 days, newest first.")).toBeVisible();
    await expect(canvas.getByRole("banner")).not.toHaveAttribute("aria-busy");
  },
});

export const NoEyebrowOrSubtitle = meta.story({
  name: "No eyebrow or subtitle",
  args: { eyebrow: "", subtitle: "" },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    const header = canvas.getByRole("banner");
    await expect(canvas.getByRole("heading", { level: 1, name: "Orders" })).toBeVisible();
    await expect(header.querySelectorAll("p")).toHaveLength(0);
  },
});

export const HeadingOnly = meta.story({
  name: "Heading only",
  parameters: { canvas: "column" },
  render: () => html`<ui-page-header heading="Orders"></ui-page-header>`,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Orders" })).toBeVisible();
  },
});

export const EyebrowAndSubtitle = meta.story({
  name: "Eyebrow and subtitle",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-page-header
      eyebrow="Sales"
      heading="Orders"
      subtitle="Every order placed in the last 90 days, newest first. Filter by status or customer to narrow the list."
    ></ui-page-header>
  `,
});

export const BreadcrumbsStatusAndActions = meta.story({
  name: "Breadcrumbs, status and actions",
  parameters: {
    docs: {
      description: { story: "Actions sit beside the heading and wrap underneath it when the row runs out of room." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-page-header heading="Order 10482" subtitle="Placed on 12 March, paid by card, shipping to a home address.">
      <ui-breadcrumbs slot="breadcrumbs" .items=${trail}></ui-breadcrumbs>
      <ui-tag slot="status" tone="success" label="Shipped"></ui-tag>
      <ui-button slot="actions" variant="outlined">Print invoice</ui-button>
      <ui-button slot="actions" color="primary">Track parcel</ui-button>
    </ui-page-header>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Order 10482" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Track parcel" })).toBeVisible();
    await expect(canvas.getByRole("navigation")).toBeVisible();
  },
});

export const Loading = meta.story({
  name: "Loading",
  parameters: {
    docs: {
      description: {
        story: "While loading, placeholders keep the header's height so the page doesn't jump when it arrives.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-page-header loading></ui-page-header>`,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("header")).toHaveAttribute("aria-busy", "true");
    await expect(canvasElement.querySelector("h1")).toHaveAccessibleName("Loading");
  },
});

export const SlottedText = meta.story({
  name: "Slotted text",
  parameters: {
    docs: {
      description: { story: "The heading, eyebrow and subtitle slots take rich content in place of the plain text." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-page-header heading="Ignored heading" eyebrow="Ignored eyebrow" subtitle="Ignored subtitle">
      <span slot="eyebrow">Sales <strong>region</strong></span>
      <span slot="heading">Order <em>10482</em></span>
      <span slot="subtitle">Paid by <strong>card</strong>.</span>
    </ui-page-header>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Order 10482" })).toBeVisible();
    await expect(canvas.getByText("region").closest("p")).toHaveTextContent("Sales region");
    await expect(canvas.getByText("card").closest("p")).toHaveTextContent("Paid by card.");
    await expect(canvas.queryByText(/Ignored/)).toBeNull();
  },
});

export const LoadingWithHeading = meta.story({
  name: "Loading with a heading",
  args: { loading: true, heading: "Orders" },
  parameters: {
    docs: { description: { story: "A known heading is still announced while the placeholders show." } },
    canvas: "column",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("banner")).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveAccessibleName("Orders");
    await expect(canvas.queryByText("Sales")).toBeNull();
  },
});
