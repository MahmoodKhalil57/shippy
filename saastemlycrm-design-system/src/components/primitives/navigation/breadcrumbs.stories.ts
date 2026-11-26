import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./breadcrumbs.ts";
import { iconSvg } from "../media/icon.ts";
import type { BreadcrumbItem } from "./breadcrumbs.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const localized = (text: string) => text as LocalizedString;

const trail: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Invoices", href: "#" },
  { label: "Invoice INV-0042" },
];

const iconTrail: BreadcrumbItem[] = [
  { label: "Home", href: "#", icon: iconSvg("home") },
  { label: "Contacts", href: "#", icon: iconSvg("users") },
  { label: "Ana Silva", icon: iconSvg("user") },
];

const longTrail: BreadcrumbItem[] = [
  { label: "Workspace", href: "#" },
  { label: "Reports", href: "#" },
  { label: "Finance", href: "#" },
  { label: "Quarterly", href: "#" },
  { label: "Revenue by region and product line, third quarter" },
];

const unlinked: BreadcrumbItem[] = [{ label: "Archive" }, { label: "2025", href: "#" }, { label: "Fourth quarter" }];

const meta = preview.type<{ args: { onSelect: (e: Event) => void; onClick: (e: Event) => void } }>().meta({
  title: "Primitives/Navigation/Breadcrumbs",
  component: "ui-breadcrumbs",
  args: {
    items: trail,
    size: "sm",
    width: undefined,
    label: localized("Breadcrumb"),
    onSelect: fn(),
    onClick: fn((e: Event) => e.preventDefault()),
  },
  argTypes: {
    items: { control: "object" },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    width: { control: "inline-radio", options: [undefined, "xs", "sm", "md", "full"] },
    label: { control: "text" },
    onSelect: { table: { category: "events" } },
    onClick: {
      table: { category: "events" },
      description: "Called on click; the story keeps the page from navigating.",
    },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-breadcrumbs
      .items=${args.items ?? []}
      size=${ifDefined(args.size)}
      width=${ifDefined(args.width)}
      label=${ifDefined(args.label)}
      @ui-select=${args.onSelect}
      @click=${args.onClick}
    ></ui-breadcrumbs>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the trail; following a link calls onSelect." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(canvas.getByText("Invoice INV-0042")).toHaveAttribute("aria-current", "page");
    await expect(canvas.queryByRole("link", { name: "Invoice INV-0042" })).toBeNull();
    await userEvent.click(canvas.getByRole("link", { name: "Invoices" }));
    await expect(args.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ index: 1 }) }),
    );
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Invoices" })).not.toHaveFocus();
  },
});

export const KeyboardFollow = meta.story({
  name: "Keyboard follow",
  args: { items: iconTrail, label: localized("Contact location"), size: "md" },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("navigation", { name: "Contact location" })).toBeVisible();
    await userEvent.tab();
    const home = canvas.getByRole("link", { name: "Home" });
    await expect(home).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(canvas.getByText("Ana Silva").closest("[aria-current]")).toHaveAttribute("aria-current", "page");
  },
});

export const Trail = meta.story({
  name: "Trail",
  parameters: {
    docs: {
      description: {
        story:
          "The last item is the current page (aria-current) and is never a link. Several trails on one page each get their own label.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-breadcrumbs label="Invoice location" .items=${trail}></ui-breadcrumbs>
    <ui-breadcrumbs label="Settings location" .items=${iconTrail}></ui-breadcrumbs>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Invoice location" })).toBeVisible();
    await expect(canvas.getByRole("navigation", { name: "Settings location" })).toBeVisible();
  },
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-breadcrumbs size="xs" label="Extra small trail" .items=${trail}></ui-breadcrumbs>
    <ui-breadcrumbs size="sm" label="Small trail" .items=${trail}></ui-breadcrumbs>
    <ui-breadcrumbs size="md" label="Medium trail" .items=${trail}></ui-breadcrumbs>
    <ui-breadcrumbs size="lg" label="Large trail" .items=${trail}></ui-breadcrumbs>
  `,
});

export const Width = meta.story({
  name: "Width",
  parameters: {
    docs: { description: { story: "A capped width wraps a long trail onto more lines instead of scrolling." } },
    canvas: "column",
  },
  render: () => html`
    <ui-breadcrumbs width="xs" label="Narrow trail" .items=${longTrail}></ui-breadcrumbs>
    <ui-breadcrumbs width="md" label="Medium trail" .items=${longTrail}></ui-breadcrumbs>
    <ui-breadcrumbs width="full" label="Full-width trail" .items=${longTrail}></ui-breadcrumbs>
  `,
});

export const CustomLabel = meta.story({
  name: "Custom label",
  parameters: {
    docs: { description: { story: "label names the nav landmark; it defaults to Breadcrumbs." } },
    canvas: "column",
  },
  render: () => html`<ui-breadcrumbs label="Report location" .items=${longTrail}></ui-breadcrumbs>`,
});

export const UnlinkedStepAndOwnContent = meta.story({
  name: "Unlinked step and own content",
  parameters: {
    docs: {
      description: {
        story:
          "An earlier item without href is plain text, not the current page; without items the trail shows its own list content.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-breadcrumbs label="Archive location" .items=${unlinked}></ui-breadcrumbs>
    <ui-breadcrumbs label="Help location"
      ><li><a href="#">Help</a></li>
      <li>Billing</li></ui-breadcrumbs
    >
  `,
  play: async ({ canvas }) => {
    const archive = canvas.getByText("Archive");
    await expect(archive.tagName).toBe("SPAN");
    await expect(archive).not.toHaveAttribute("aria-current");
    await expect(canvas.getByText("Fourth quarter")).toHaveAttribute("aria-current", "page");
    const help = canvas.getByRole("navigation", { name: "Help location" });
    await expect(help).toHaveTextContent("Billing");
    await expect(canvas.getByRole("link", { name: "Help" })).toBeVisible();
  },
});
