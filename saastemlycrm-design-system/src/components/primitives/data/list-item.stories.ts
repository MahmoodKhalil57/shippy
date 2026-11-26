import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./list-item.ts";
import "./badge.ts";
import "./tag.ts";
import "../media/icon.ts";
import "../people/avatar.ts";

const meta = preview
  .type<{
    args: {
      headline: string;
      supporting: string;
      overline: string;
      trailingText: string;
      leadingText: string;
      lines: "1" | "2" | "3";
      href?: string;
      action: boolean;
      selected: boolean;
      disabled: boolean;
      onClick: () => void;
    };
  }>()
  .meta({
    title: "Primitives/Data/List item",
    component: "ui-list",
    parameters: { canvas: "column" },
    args: {
      variant: "divided",
      label: "Recent invoices",
      headline: "INV-20418",
      supporting: "Office supplies, 24 line items",
      overline: "Due 2 April",
      trailingText: "$1,284.00",
      leadingText: "",
      lines: "2",
      href: undefined,
      action: true,
      selected: false,
      disabled: false,
      onClick: fn(),
    },
    argTypes: {
      variant: { control: "inline-radio", options: ["divided", "separated"] },
      label: { control: "text" },
      headline: { control: "text", description: "The first item's headline." },
      supporting: { control: "text" },
      overline: { control: "text" },
      trailingText: { control: "text" },
      leadingText: { control: "text" },
      lines: { control: "inline-radio", options: ["1", "2", "3"] },
      href: { control: "text" },
      action: { control: "boolean" },
      selected: { control: "boolean" },
      disabled: { control: "boolean" },
      onClick: { table: { category: "events" } },
    },
    render: (args) => html`
      <ui-list variant=${ifDefined(args.variant)} label=${ifDefined(args.label)}>
        <ui-list-item
          headline=${args.headline}
          supporting=${args.supporting}
          overline=${args.overline}
          trailing-text=${args.trailingText}
          leading-text=${args.leadingText}
          lines=${args.lines}
          href=${ifDefined(args.href)}
          ?action=${args.action}
          ?selected=${args.selected}
          ?disabled=${args.disabled}
          @click=${args.onClick}
        ></ui-list-item>
        <ui-list-item
          headline="INV-20417"
          supporting="Quarterly maintenance contract"
          trailing-text="$4,950.00"
        ></ui-list-item>
      </ui-list>
    `,
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "The controls drive the list and its first item; an action item is a button." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("list", { name: "Recent invoices" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
    const row = canvas.getByRole("button", { name: /INV-20418/ });
    await expect(row).toHaveTextContent("Due 2 April");
    await expect(row).toHaveTextContent("$1,284.00");
    await expect(row).not.toHaveAttribute("aria-current");
    await userEvent.click(row);
    await expect(args.onClick).toHaveBeenCalledOnce();
    row.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
});

export const SelectedLink = meta.story({
  name: "Selected link",
  args: { action: false, href: "#inv-20418", selected: true, variant: "separated" },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: /INV-20418/ });
    await expect(link).toHaveAttribute("href", "#inv-20418");
    await expect(link).toHaveAttribute("aria-current", "true");
  },
});

export const DisabledAction = meta.story({
  name: "Disabled action",
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("button", { name: /INV-20418/ })).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
});

export const DisabledLink = meta.story({
  name: "Disabled link",
  args: { action: false, href: "#closed", disabled: true, headline: "Closed accounts", supporting: "Archived" },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("link", { name: /Closed accounts/ })).toBeNull();
    await expect(canvas.getAllByRole("listitem")[0]).toHaveTextContent("Closed accounts");
  },
});

export const StaticRow = meta.story({
  name: "Static row",
  args: { action: false, leadingText: "09:00", overline: "Call", headline: "Renewal review", trailingText: "" },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button")).toBeNull();
    await expect(canvas.getAllByRole("listitem")[0]).toHaveTextContent("09:00");
    await expect(canvas.getAllByRole("listitem")[0]).toHaveTextContent("Renewal review");
  },
});

export const DividedList = meta.story({
  name: "Divided list",
  parameters: {
    docs: {
      description: {
        story: "The list has role list and each item role listitem; a divided list draws a rule between items.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-list label="Recent invoices">
      <ui-list-item
        headline="INV-20418"
        supporting="Office supplies, 24 line items"
        trailing-text="$1,284.00"
      ></ui-list-item>
      <ui-list-item
        headline="INV-20417"
        supporting="Quarterly maintenance contract"
        trailing-text="$4,950.00"
      ></ui-list-item>
      <ui-list-item headline="INV-20416" supporting="Freight and handling" trailing-text="$312.40"></ui-list-item>
    </ui-list>
  `,
});

export const SeparatedList = meta.story({
  name: "Separated list",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-list variant="separated" label="Warehouses">
      <ui-list-item headline="North distribution centre" supporting="1,240 pallets, 82% full"></ui-list-item>
      <ui-list-item headline="Central hub" supporting="860 pallets, 64% full" selected></ui-list-item>
      <ui-list-item headline="Coastal depot" supporting="310 pallets, 41% full"></ui-list-item>
    </ui-list>
  `,
});

export const LinksActionsAndStates = meta.story({
  name: "Links, actions and states",
  parameters: {
    docs: {
      description: {
        story: "An item with href is a link and one with action is a button; selected sets aria-current.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-list label="Accounts">
      <ui-list-item href="#north" headline="North region accounts" supporting="38 active"></ui-list-item>
      <ui-list-item href="#south" selected headline="South region accounts" supporting="27 active"></ui-list-item>
      <ui-list-item action headline="Export account list" supporting="CSV, all regions"></ui-list-item>
      <ui-list-item href="#closed" disabled headline="Closed accounts" supporting="Archived"></ui-list-item>
    </ui-list>
  `,
});

export const LeadingAndTrailing = meta.story({
  name: "Leading and trailing",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-list label="Tasks">
      <ui-list-item headline="Approve purchase order" supporting="Requested for the central hub">
        <ui-icon slot="leading" name="clipboard"></ui-icon>
        <ui-badge slot="trailing" count="3" tone="primary"></ui-badge>
      </ui-list-item>
      <ui-list-item headline="Review shipping exceptions" supporting="Two parcels held at customs">
        <ui-icon slot="leading" name="truck"></ui-icon>
        <ui-tag slot="trailing" tone="warning" label="Due today"></ui-tag>
      </ui-list-item>
      <ui-list-item headline="Account manager" supporting="Eastern region, 14 accounts">
        <ui-avatar slot="leading" size="xs" initials="AM"></ui-avatar>
        <ui-icon slot="trailing" name="chevron-right"></ui-icon>
      </ui-list-item>
    </ui-list>
  `,
});

export const LeadingTextAndOverline = meta.story({
  name: "Leading text and overline",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-list label="Schedule">
      <ui-list-item
        leading-text="09:00"
        overline="Call"
        headline="Renewal review"
        supporting="Contract ends in April"
      ></ui-list-item>
      <ui-list-item
        leading-text="11:30"
        overline="Meeting"
        headline="Pricing workshop"
        supporting="Room 2"
      ></ui-list-item>
      <ui-list-item
        leading-text="14:15"
        overline="Delivery"
        headline="Stock arrives at the central hub"
        supporting="32 pallets"
      ></ui-list-item>
    </ui-list>
  `,
});

export const ExtraContentAndClamping = meta.story({
  name: "Extra content and clamping",
  parameters: {
    docs: {
      description: {
        story:
          "Supporting text clamps to the number of lines set, two by default; default slot content sits underneath.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-list label="Notes">
      <ui-list-item
        lines="1"
        headline="Delivery note"
        supporting="The customer asked for the order to be split across two deliveries, the first before the end of the month and the second once the backordered items are back in stock."
      ></ui-list-item>
      <ui-list-item
        lines="3"
        headline="Account summary"
        supporting="A long-standing wholesale account with steady monthly orders. Payment is usually on time, though two invoices last quarter went past thirty days. Volume has grown each quarter this year, mostly in hardware."
      >
        <ui-tag tone="success" label="Good standing"></ui-tag>
        <ui-tag tone="info" label="Wholesale"></ui-tag>
      </ui-list-item>
      <ui-list-item>
        <span slot="headline">Order <strong>SO-88124</strong> shipped</span>
        <span slot="supporting">Tracking number sent to the buyer</span>
      </ui-list-item>
    </ui-list>
  `,
});

export const SparseItems = meta.story({
  name: "Sparse items",
  parameters: {
    docs: { description: { story: "An unlabelled list; items render only the parts they are given." } },
    canvas: "column",
  },
  render: () => html`
    <ui-list>
      <ui-list-item trailing-text="$90.00"></ui-list-item>
      <ui-list-item overline="Pending"></ui-list-item>
    </ui-list>
  `,
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list");
    await expect(list).not.toHaveAttribute("aria-label");
    const [priced, pending] = canvas.getAllByRole("listitem");
    await expect(priced).toHaveTextContent("$90.00");
    await expect(priced!.querySelectorAll("[data-list-row] > span > span")).toHaveLength(1);
    await expect(pending).toHaveTextContent("Pending");
    await expect(pending!.querySelector("[data-list-row] > span")!.children).toHaveLength(1);
  },
});
