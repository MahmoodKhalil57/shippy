import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./link.ts";
import "../typography/text.ts";

const meta = preview.type<{ args: { text: string; onClick: (e: Event) => void } }>().meta({
  title: "Primitives/Navigation/Link",
  component: "ui-link",
  args: {
    text: "View all invoices",
    href: "#",
    color: "primary",
    variant: undefined,
    target: undefined,
    rel: undefined,
    download: undefined,
    external: false,
    onClick: fn((e: Event) => e.preventDefault()),
  },
  argTypes: {
    text: { control: "text", description: "The link's text (its content)." },
    href: { control: "text" },
    color: {
      control: "select",
      options: [undefined, "neutral", "primary", "secondary", "accent", "success", "info", "warning", "error"],
    },
    variant: { control: "inline-radio", options: [undefined, "hover"] },
    target: { control: "text" },
    rel: { control: "text" },
    download: { control: "text" },
    onClick: {
      table: { category: "events" },
      description: "Called on click; the story keeps the page from navigating.",
    },
  },
  render: (args) => html`
    <ui-link
      href=${ifDefined(args.href)}
      color=${ifDefined(args.color)}
      variant=${ifDefined(args.variant)}
      target=${ifDefined(args.target)}
      rel=${ifDefined(args.rel)}
      download=${ifDefined(args.download)}
      ?external=${args.external}
      @click=${args.onClick}
      >${args.text}</ui-link
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the link; following it calls onClick." } } },
  play: async ({ canvas, userEvent, args }) => {
    const anchor = canvas.getByRole("link", { name: "View all invoices" });
    await expect(anchor).toHaveAttribute("href", "#");
    await expect(anchor).not.toHaveAttribute("target");
    await userEvent.click(anchor);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(anchor).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
});

export const External = meta.story({
  name: "External",
  args: { external: true, text: "Help centre" },
  play: async ({ canvas }) => {
    const anchor = canvas.getByRole("link", { name: "Help centre" });
    await expect(anchor).toHaveAttribute("target", "_blank");
    await expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
  },
});

export const Download = meta.story({
  name: "Download",
  args: { download: "invoice-inv-0042.pdf", text: "Download PDF", color: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Download PDF" })).toHaveAttribute(
      "download",
      "invoice-inv-0042.pdf",
    );
  },
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-link href="#">Default</ui-link>
    <ui-link href="#" color="neutral">Neutral</ui-link>
    <ui-link href="#" color="primary">Primary</ui-link>
    <ui-link href="#" color="secondary">Secondary</ui-link>
    <ui-link href="#" color="accent">Accent</ui-link>
    <ui-link href="#" color="info">Info</ui-link>
    <ui-link href="#" color="success">Success</ui-link>
    <ui-link href="#" color="warning">Warning</ui-link>
    <ui-link href="#" color="error">Error</ui-link>
  `,
});

export const UnderlineOnHover = meta.story({
  name: "Underline on hover",
  parameters: {
    docs: { description: { story: "The hover variant hides the underline until the pointer is over the link." } },
  },
  render: () => html`
    <ui-link href="#" variant="hover">View all invoices</ui-link>
    <ui-link href="#" variant="hover" color="primary">Open quarterly report</ui-link>
  `,
});

export const InText = meta.story({
  name: "In text",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-text variant="body-md"
      >Invoice INV-0042 was sent to Ana Silva. <ui-link href="#" color="primary">View the invoice</ui-link> or
      <ui-link href="#">change the due date</ui-link>.</ui-text
    >
  `,
});

export const ExternalAndDownload = meta.story({
  name: "External and download",
  parameters: {
    docs: {
      description: {
        story: "external opens in a new tab with noopener noreferrer; download saves the target instead of opening it.",
      },
    },
  },
  render: () => html`
    <ui-link href="#" external color="primary">Help centre</ui-link>
    <ui-link href="#" download="invoice-inv-0042.pdf">Download PDF</ui-link>
    <ui-link href="#" target="_self" rel="nofollow">Custom target and rel</ui-link>
  `,
});
