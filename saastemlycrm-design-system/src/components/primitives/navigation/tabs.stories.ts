import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn, waitFor } from "storybook/test";
import "./tabs.ts";
import "../typography/text.ts";
import { iconSvg } from "../media/icon.ts";
import type { TabItem } from "./tabs.ts";

const panel = (text: string) => html`<ui-text variant="body-md">${text}</ui-text>`;

const sections: TabItem[] = [
  { label: "Overview", content: panel("Invoice INV-0042 for Ana Silva, 1,240.00, due on Friday.") },
  { label: "Activity", content: panel("Sent on 3 November, opened twice, reminder scheduled.") },
  { label: "Files", content: panel("Two attachments: the signed order and a delivery note.") },
  { label: "Audit log", disabled: true },
];

const labels: TabItem[] = [{ label: "Day" }, { label: "Week" }, { label: "Month" }, { label: "Quarter" }];

const withIcons: TabItem[] = [
  { label: "Inbox", icon: iconSvg("inbox"), content: panel("4 unread messages.") },
  { label: "Calendar", icon: iconSvg("calendar"), content: panel("2 meetings today.") },
  { label: "Settings", icon: iconSvg("settings"), content: panel("Workspace preferences.") },
];

const links: TabItem[] = [
  { label: "Profile", href: "#" },
  { label: "Billing", href: "#" },
  { label: "Members", href: "#" },
];

const linkSections: TabItem[] = [
  { label: "Profile", href: "#profile" },
  { label: "Billing", href: "#billing" },
  { label: "Audit log", href: "#audit", disabled: true },
];

const locked: TabItem[] = [{ label: "Draft", disabled: true }];

const many: TabItem[] = [
  "Overview",
  "Deals",
  "Invoices",
  "Contacts",
  "Companies",
  "Reports",
  "Files",
  "Notes",
  "Settings",
].map((label) => ({ label, content: panel(`${label} for this workspace.`) }));

const meta = preview.type<{ args: { onChange: (e: Event) => void } }>().meta({
  title: "Primitives/Navigation/Tabs",
  component: "ui-tabs",
  args: {
    items: sections,
    active: 0,
    mode: "tabs",
    variant: "primary",
    size: "md",
    name: "invoice-tabs",
    padding: "md",
    surface: true,
    scrollArea: undefined,
    activeColor: "primary",
    label: "Invoice sections",
    onChange: fn(),
  },
  argTypes: {
    items: { control: "object" },
    active: { control: { type: "number", min: 0, max: 8, step: 1 } },
    mode: { control: "inline-radio", options: ["tabs", "radio"] },
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    name: { control: "text" },
    padding: { control: "inline-radio", options: ["md", "lg", "top", "none"] },
    surface: { control: "boolean" },
    scrollArea: { control: "inline-radio", options: [undefined, "xs", "sm", "md", "lg", "full"] },
    activeColor: { control: "inline-radio", options: [undefined, "primary"] },
    label: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-tabs
      .items=${args.items ?? []}
      active=${ifDefined(args.active)}
      mode=${ifDefined(args.mode)}
      variant=${ifDefined(args.variant)}
      size=${ifDefined(args.size)}
      name=${ifDefined(args.name)}
      padding=${ifDefined(args.padding)}
      surface=${args.surface === false ? "false" : "true"}
      scroll-area=${ifDefined(args.scrollArea)}
      active-color=${ifDefined(args.activeColor)}
      label=${ifDefined(args.label)}
      @ui-change=${args.onChange}
    ></ui-tabs>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the tabs; arrow keys, Home and End move the selection." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("tablist", { name: "Invoice sections" })).toBeVisible();
    const overview = canvas.getByRole("tab", { name: "Overview" });
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Overview" })).toHaveTextContent("Invoice INV-0042");
    await userEvent.click(canvas.getByRole("tab", { name: "Activity" }));
    await expect(canvas.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Activity" })).toHaveTextContent("Sent on 3 November");
    await expect(args.onChange).toHaveBeenCalledOnce();
    await userEvent.keyboard("{ArrowRight}");
    const files = canvas.getByRole("tab", { name: "Files" });
    await waitFor(() => expect(files).toHaveFocus());
    await expect(files).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(overview).toHaveFocus());
    await userEvent.keyboard("{End}");
    await waitFor(() => expect(files).toHaveFocus());
    await userEvent.keyboard("{Home}");
    await waitFor(() => expect(overview).toHaveFocus());
    await expect(canvas.getByRole("tab", { name: "Audit log" })).toBeDisabled();
  },
});

export const RadioTabs = meta.story({
  name: "Radio tabs",
  args: { mode: "radio", items: labels, active: 1, label: undefined },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("radio", { name: "Week" })).toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: "Quarter" }));
    await expect(canvas.getByRole("radio", { name: "Quarter" })).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const SecondarySmall = meta.story({
  name: "Secondary, small",
  args: { variant: "secondary", size: "sm", items: withIcons, active: 2, padding: "top", surface: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("tab", { name: "Settings" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tab", { name: "Inbox" })).toHaveAttribute("tabindex", "-1");
  },
});

export const WithPanels = meta.story({
  name: "With panels",
  parameters: {
    docs: {
      description: {
        story:
          "Arrow keys, Home and End move between tabs and skip disabled ones; the active tab's content shows in a tabpanel.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-tabs label="Invoice sections" .items=${sections}></ui-tabs>`,
});

export const VariantsAndSizes = meta.story({
  name: "Variants and sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-tabs label="Period" variant="primary" .items=${labels} active="1"></ui-tabs>
    <ui-tabs label="Period" variant="secondary" .items=${labels} active="1"></ui-tabs>
    <ui-tabs label="Period" size="sm" .items=${labels} active="2"></ui-tabs>
    <ui-tabs label="Period" size="md" .items=${labels} active="2"></ui-tabs>
  `,
});

export const IconsAndLinks = meta.story({
  name: "Icons and links",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-tabs label="Workspace" .items=${withIcons}></ui-tabs>
    <ui-tabs label="Account" .items=${links} active="1"></ui-tabs>
  `,
});

export const PanelOptions = meta.story({
  name: "Panel options",
  parameters: {
    docs: {
      description: { story: "padding and surface style the panel; surface false leaves it on the page background." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-tabs label="Large padding" padding="lg" .items=${sections}></ui-tabs>
    <ui-tabs label="Top padding, no surface" padding="top" surface="false" .items=${sections}></ui-tabs>
    <ui-tabs label="No padding" padding="none" .items=${sections}></ui-tabs>
  `,
});

export const RadioMode = meta.story({
  name: "Radio mode",
  parameters: {
    docs: {
      description: {
        story: "Radio mode renders native radio inputs, so the tabs work without script and share a name.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-tabs mode="radio" .items=${sections}></ui-tabs>
    <ui-tabs mode="radio" .items=${withIcons} active="1"></ui-tabs>
  `,
});

export const ScrollArea = meta.story({
  name: "Scroll area",
  parameters: {
    docs: {
      description: {
        story: "In either mode, scroll-area caps the tab strip's width and lets it scroll sideways.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-tabs mode="radio" scroll-area="sm" .items=${many} active="5"></ui-tabs>
    <ui-tabs label="Sections" scroll-area="sm" .items=${many} active="5"></ui-tabs>
  `,
  play: async ({ canvas }) => {
    const list = canvas.getByRole("tablist", { name: "Sections" });
    const scroller = list.parentElement!;
    await expect(getComputedStyle(scroller).overflowX).toBe("auto");
    await expect(scroller.getBoundingClientRect().width).toBeLessThanOrEqual(24 * 16);
    await expect(list.getBoundingClientRect().width).toBeLessThanOrEqual(24 * 16 + 1);
  },
});

export const LinkTabsAndGuards = meta.story({
  name: "Link tabs and guards",
  args: { items: linkSections, label: "Account" },
  render: (args) => html`
    <ui-tabs
      label=${ifDefined(args.label)}
      .items=${args.items ?? []}
      @ui-change=${args.onChange}
      @click=${(e: Event) => e.preventDefault()}
    ></ui-tabs>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Link tabs select on click; choosing the active tab, a disabled tab or a missing index does nothing, and keys other than arrows, Home and End pass through.",
      },
    },
  },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const billing = canvas.getByRole("tab", { name: "Billing" });
    await userEvent.click(billing);
    await expect(billing).toHaveAttribute("aria-selected", "true");
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ index: 1 }) }),
    );
    await userEvent.click(billing);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(canvas.getByRole("tab", { name: "Audit log" })).toHaveAttribute("aria-disabled", "true");
    const host = canvasElement.querySelector("ui-tabs")!;
    host.select(2);
    host.select(9);
    await expect(host.active).toBe(1);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(await fireEvent.keyDown(canvas.getByRole("tablist", { name: "Account" }), { key: "a" })).toBe(true);
    await expect(billing).toHaveAttribute("aria-selected", "true");
  },
});

export const AllDisabledAndOwnTabs = meta.story({
  name: "All disabled and own tabs",
  parameters: {
    docs: {
      description: {
        story: "With every tab disabled the arrow keys do nothing; without items the tablist shows its own tabs.",
      },
    },
  },
  render: () => html`
    <ui-tabs label="Locked" .items=${locked}></ui-tabs>
    <ui-tabs><button type="button" role="tab" aria-selected="true">Overview</button></ui-tabs>
  `,
  play: async ({ canvas }) => {
    const lockedList = canvas.getByRole("tablist", { name: "Locked" });
    await expect(await fireEvent.keyDown(lockedList, { key: "ArrowRight" })).toBe(true);
    await expect(canvas.getByRole("tab", { name: "Draft" })).toBeDisabled();
    await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  },
});
