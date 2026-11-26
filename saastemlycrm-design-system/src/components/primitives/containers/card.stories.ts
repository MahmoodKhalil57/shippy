import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./card.ts";
import "../actions/button.ts";
import "../actions/icon-button.ts";
import "../layout/box.ts";
import "../typography/text.ts";

const images = {
  chart:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 160'%3E%3Cpath d='M0 0H320V160H0Z' fill='%23dfe3f1'/%3E%3Cpath d='M0 120L60 96L120 108L180 64L240 72L320 32V160H0Z' fill='%236d7fc4'/%3E%3C/svg%3E",
};

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Containers/Card",
  component: "ui-card",
  args: {
    text: "Three invoices are due in the next 30 days.",
    variant: "outlined",
    size: "md",
    heading: "Open invoices",
    subhead: "Due this month",
    count: 3,
    countTone: "warning",
    href: undefined,
    imageSrc: undefined,
    imageAlt: "",
  },
  argTypes: {
    text: { control: "text", description: "The card's body (its content)." },
    variant: { control: "inline-radio", options: ["outlined", "filled", "elevated"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md"] },
    heading: { control: "text" },
    subhead: { control: "text" },
    count: { control: { type: "number", min: 0, step: 1 } },
    countTone: { control: "select", options: ["neutral", "primary", "info", "success", "warning", "error"] },
    href: { control: "text" },
    imageSrc: { control: "text" },
    imageAlt: { control: "text" },
  },
  render: (args) => html`
    <ui-box width="96">
      <ui-card
        variant=${ifDefined(args.variant)}
        size=${ifDefined(args.size)}
        heading=${ifDefined(args.heading as string | undefined)}
        subhead=${ifDefined(args.subhead as string | undefined)}
        .count=${args.count}
        count-tone=${ifDefined(args.countTone)}
        href=${ifDefined(args.href)}
        image-src=${ifDefined(args.imageSrc)}
        image-alt=${ifDefined(args.imageAlt)}
        >${args.text}</ui-card
      >
    </ui-box>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the card." } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "Open invoices" })).toBeVisible();
    await expect(canvas.getByText("3")).toBeVisible();
    await expect(canvas.getByText("Due this month")).toBeVisible();
    await expect(canvas.getByText("Three invoices are due in the next 30 days.")).toBeVisible();
    await expect(canvas.queryByRole("link")).not.toBeInTheDocument();
  },
});

export const AsLink = meta.story({
  name: "As a link",
  args: { href: "#", heading: "Customer portal", subhead: "Let customers pay online.", count: undefined },
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole("link", { name: /Customer portal/ });
    await expect(link).toHaveAttribute("href", "#");
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
});

export const WithImage = meta.story({
  name: "With image",
  args: { imageSrc: images.chart, imageAlt: "Revenue trending upward", heading: "Quarterly report", count: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Revenue trending upward" })).toBeVisible();
  },
});

export const NoHeader = meta.story({
  name: "Without a header",
  args: { heading: "", subhead: "", count: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("heading")).not.toBeInTheDocument();
    await expect(canvas.getByText("Three invoices are due in the next 30 days.")).toBeVisible();
  },
});

export const CountWithoutHeading = meta.story({
  name: "Count without a heading",
  args: { heading: "", subhead: "", count: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("heading")).not.toBeInTheDocument();
    await expect(canvas.getByText("0")).toBeVisible();
  },
});

export const SlottedHeading = meta.story({
  name: "Slotted heading",
  render: () => html`
    <ui-box width="96">
      <ui-card subhead="Due this month">
        <span slot="heading">Open <em>invoices</em></span>
        Three invoices are due in the next 30 days.
      </ui-card>
    </ui-box>
  `,
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { level: 2, name: "Open invoices" });
    await expect(heading).toContainElement(canvas.getByText("invoices"));
  },
});

export const Variants = meta.story({
  name: "Variants",
  render: () => html`
    <ui-box width="80">
      <ui-card variant="outlined" heading="Outlined" subhead="The default: a border on the surface."></ui-card>
    </ui-box>
    <ui-box width="80">
      <ui-card variant="filled" heading="Filled" subhead="The highest container tone, no border."></ui-card>
    </ui-box>
    <ui-box width="80">
      <ui-card variant="elevated" heading="Elevated" subhead="A low container tone lifted by a shadow."></ui-card>
    </ui-box>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-box width="64">
      <ui-card size="xs" heading="Extra small" subhead="Tight padding for dense lists."></ui-card>
    </ui-box>
    <ui-box width="64">
      <ui-card size="sm" heading="Small" subhead="Compact padding."></ui-card>
    </ui-box>
    <ui-box width="64">
      <ui-card size="md" heading="Medium" subhead="Padding scales with the card's width."></ui-card>
    </ui-box>
  `,
});

export const HeaderBodyAndActions = meta.story({
  name: "Header, body and actions",
  parameters: {
    docs: {
      description: {
        story: "The count renders as a badge beside the heading; trailing content sits at the header's end.",
      },
    },
  },
  render: () => html`
    <ui-box width="96">
      <ui-card heading="Open invoices" .count=${7} count-tone="warning" subhead="Due in the next 30 days">
        <ui-icon-button slot="trailing" icon="filter" label="Filter invoices" size="xs"></ui-icon-button>
        <ui-text variant="body-md">Invoice INV-0042 for Ana Silva, 1,240.00, is due on Friday.</ui-text>
        <ui-button slot="actions" variant="text">View all</ui-button>
        <ui-button slot="actions" color="primary">Send reminders</ui-button>
      </ui-card>
    </ui-box>
    <ui-box width="80">
      <ui-card heading="Team" .count=${12} count-tone="neutral">
        <ui-text variant="body-md">Twelve people can see this workspace.</ui-text>
      </ui-card>
    </ui-box>
    <ui-box width="80">
      <ui-card heading="Failed payments" .count=${2} count-tone="error">
        <ui-text variant="body-md">Two card payments were declined this week.</ui-text>
      </ui-card>
    </ui-box>
  `,
});

export const Image = meta.story({
  name: "Image",
  render: () => html`
    <ui-box width="80">
      <ui-card image-src=${images.chart} image-alt="Revenue trending upward" heading="Quarterly report">
        <ui-text variant="body-md">Revenue grew 12% against the previous quarter.</ui-text>
      </ui-card>
    </ui-box>
    <ui-box width="80">
      <ui-card variant="filled" heading="Figure slot" subhead="Any content can fill the figure.">
        <img slot="figure" src=${images.chart} alt="Revenue trending upward" />
      </ui-card>
    </ui-box>
  `,
});

export const LinkCard = meta.story({
  name: "Link card",
  parameters: {
    docs: {
      description: {
        story: "With href the whole card is one link that lifts on hover and shows an arrow on hover or focus.",
      },
    },
  },
  render: () => html`
    <ui-box width="80">
      <ui-card href="#" heading="Customer portal" subhead="Let customers pay and download invoices."></ui-card>
    </ui-box>
    <ui-box width="80">
      <ui-card
        href="#"
        variant="elevated"
        heading="Import contacts"
        subhead="Bring people in from a CSV file."
      ></ui-card>
    </ui-box>
  `,
});
