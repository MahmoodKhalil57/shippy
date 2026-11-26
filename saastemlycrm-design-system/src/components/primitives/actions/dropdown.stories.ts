import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn, waitFor } from "storybook/test";
import "./dropdown.ts";
import "./button.ts";
import "../media/icon.ts";
import "../typography/text.ts";
import "../navigation/menu.ts";
import type { DropdownItem } from "./dropdown.ts";

const actions: DropdownItem[] = [
  { label: "Edit invoice", icon: "edit", shortcut: "E" },
  { label: "Duplicate", icon: "copy", shortcut: "Ctrl+D" },
  { label: "Download PDF", icon: "file", description: "Invoice INV-0042, 2 pages" },
  { label: "Send reminder", icon: "mail", disabled: true, description: "Available once the invoice is overdue" },
  { label: "Archive", icon: "archive", separator: true },
  { label: "Delete invoice", icon: "trash", destructive: true },
];

const columns: DropdownItem[] = [
  { label: "Customer", checked: true },
  { label: "Amount", checked: true },
  { label: "Due date", checked: false },
  { label: "Owner", checked: true },
];

const simple: DropdownItem[] = [
  { label: "Rename", icon: "edit" },
  { label: "Move to folder", icon: "archive" },
  { label: "Share link", icon: "link" },
];

const archived: DropdownItem[] = [{ label: "Restore", icon: "archive", disabled: true }];

const destinations = [{ label: "Orders" }, { label: "Customers" }];

const meta = preview.type<{ args: { onSelect: (e: Event) => void } }>().meta({
  title: "Primitives/Actions/Dropdown",
  component: "ui-dropdown",
  args: {
    label: "Actions",
    triggerLabel: undefined,
    triggerIcon: undefined,
    triggerColor: undefined,
    triggerVariant: "outlined",
    triggerSize: "sm",
    triggerShape: undefined,
    triggerSpaced: true,
    triggerRounded: undefined,
    triggerTone: undefined,
    side: "bottom",
    align: "start",
    hover: false,
    force: undefined,
    mode: "focus",
    panel: "menu",
    heading: "",
    panelRounded: undefined,
    panelWidth: undefined,
    panelPadding: undefined,
    panelElevation: undefined,
    panelOffset: undefined,
    items: actions,
    onSelect: fn(),
  },
  argTypes: {
    label: { control: "text" },
    triggerLabel: { control: "text" },
    triggerIcon: { control: "select", options: [undefined, "info"] },
    triggerColor: { control: "select", options: [undefined, "primary", "secondary", "error"] },
    triggerVariant: { control: "select", options: ["filled", "tonal", "outlined", "text", "elevated"] },
    triggerSize: { control: "inline-radio", options: ["xs", "sm", "md"] },
    triggerShape: { control: "inline-radio", options: [undefined, "round", "square"] },
    triggerSpaced: { control: "boolean" },
    triggerRounded: { control: "inline-radio", options: [undefined, "field"] },
    triggerTone: {
      control: "select",
      options: [undefined, "neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    force: { control: "inline-radio", options: [undefined, "open", "close"] },
    mode: { control: "inline-radio", options: ["focus", "details", "popover"] },
    panel: { control: "inline-radio", options: ["menu", "card", "plain"] },
    heading: { control: "text" },
    panelRounded: { control: "boolean" },
    panelWidth: { control: "inline-radio", options: [undefined, "4", "5", "6"] },
    panelPadding: { control: "inline-radio", options: [undefined, "0", "2", "4"] },
    panelElevation: { control: "inline-radio", options: [undefined, "1", "2", "3"] },
    panelOffset: { control: "inline-radio", options: [undefined, "1", "2", "4"] },
    items: { control: "object" },
    onSelect: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-dropdown
      label=${ifDefined(args.label as string | undefined)}
      trigger-label=${ifDefined(args.triggerLabel)}
      trigger-icon=${ifDefined(args.triggerIcon)}
      trigger-color=${ifDefined(args.triggerColor)}
      trigger-variant=${ifDefined(args.triggerVariant)}
      trigger-size=${ifDefined(args.triggerSize)}
      trigger-shape=${ifDefined(args.triggerShape)}
      trigger-spaced=${args.triggerSpaced === false ? "false" : "true"}
      trigger-rounded=${ifDefined(args.triggerRounded)}
      trigger-tone=${ifDefined(args.triggerTone)}
      side=${ifDefined(args.side)}
      align=${ifDefined(args.align)}
      ?hover=${args.hover}
      force=${ifDefined(args.force)}
      mode=${ifDefined(args.mode)}
      panel=${ifDefined(args.panel)}
      heading=${ifDefined(args.heading as string | undefined)}
      ?panel-rounded=${args.panelRounded === true}
      panel-width=${ifDefined(args.panelWidth)}
      panel-padding=${ifDefined(args.panelPadding)}
      panel-elevation=${ifDefined(args.panelElevation)}
      panel-offset=${ifDefined(args.panelOffset)}
      .items=${args.items ?? []}
      @ui-select=${args.onSelect}
    >
      <ui-text variant="body-md">Invoices are due 30 days after the issue date.</ui-text>
    </ui-dropdown>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the dropdown; choosing an item calls onSelect and closes the menu." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Actions" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = canvas.getByRole("menu", { name: "Actions" });
    await waitFor(() => expect(menu).toBeVisible());
    const edit = canvas.getByRole("menuitem", { name: /Edit invoice/ });
    await waitFor(() => expect(edit).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("menuitem", { name: /Duplicate/ })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByRole("menuitem", { name: /Delete invoice/ })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(edit).toHaveFocus();
    await userEvent.click(edit);
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(menu).not.toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
});

export const EscapeCloses = meta.story({
  name: "Escape closes",
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    const menu = canvas.getByRole("menu", { name: "Actions" });
    await waitFor(() => expect(menu).toBeVisible());
    await waitFor(() => expect(canvas.getByRole("menuitem", { name: /Edit invoice/ })).toHaveFocus());
    const reminder = canvas.getByRole("menuitem", { name: /Send reminder/ });
    await expect(reminder).toHaveAttribute("aria-disabled", "true");
    await userEvent.keyboard("d");
    await expect(canvas.getByRole("menuitem", { name: /Duplicate/ })).toHaveFocus();
    await userEvent.keyboard("d");
    await expect(canvas.getByRole("menuitem", { name: /Download PDF/ })).toHaveFocus();
    await userEvent.keyboard("d");
    await expect(canvas.getByRole("menuitem", { name: /Delete invoice/ })).toHaveFocus();
    await userEvent.keyboard("d");
    await expect(canvas.getByRole("menuitem", { name: /Duplicate/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    const edit = canvas.getByRole("menuitem", { name: /Edit invoice/ });
    await expect(edit).toHaveFocus();
    await userEvent.keyboard("z");
    await expect(edit).toHaveFocus();
    await expect(await fireEvent.keyDown(menu, { key: "Tab" })).toBe(true);
    await expect(await fireEvent.click(reminder)).toBe(false);
    await expect(args.onSelect).not.toHaveBeenCalled();
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    edit.focus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(menu).not.toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveFocus();
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
});

export const Checkable = meta.story({
  name: "Checkable",
  args: { label: "Columns", items: columns },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Columns" });
    await userEvent.click(trigger);
    await expect(canvas.getByRole("menuitemcheckbox", { name: "Customer" })).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByRole("menuitemcheckbox", { name: "Due date" })).toHaveAttribute("aria-checked", "false");
    await userEvent.click(canvas.getByRole("menuitemcheckbox", { name: "Amount" }));
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
});

export const CardPanel = meta.story({
  name: "Card panel",
  args: { label: "Payment terms", items: [], panel: "card", heading: "Payment terms", triggerVariant: "tonal" },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Payment terms" });
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await userEvent.click(trigger);
    const dialog = canvas.getByRole("dialog", { name: "Payment terms" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(canvas.getByRole("heading", { name: "Payment terms" })).toBeVisible();
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
});

export const MenuOpen = meta.story({
  name: "Menu, open",
  parameters: {
    docs: {
      description: {
        story:
          "Opening a menu focuses its first item; arrow keys, Home, End and type-ahead move through items, and Escape returns focus to the trigger.",
      },
    },
  },
  render: () => html`
    <ui-dropdown label="Actions" trigger-variant="outlined" force="open" .items=${actions}></ui-dropdown>
  `,
});

export const TriggerStyles = meta.story({
  name: "Trigger styles",
  parameters: {
    docs: { description: { story: "Each trigger opens its menu on click; only one dropdown is open at a time." } },
  },
  render: () => html`
    <ui-dropdown label="Filled" trigger-color="primary" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Tonal" trigger-variant="tonal" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Outlined" trigger-variant="outlined" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Text" trigger-variant="text" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Small" trigger-variant="outlined" trigger-size="xs" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Error tone" trigger-variant="text" trigger-tone="error" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Not spaced" trigger-variant="outlined" trigger-spaced="false" .items=${simple}></ui-dropdown>
  `,
});

export const IconTriggers = meta.story({
  name: "Icon triggers",
  parameters: {
    docs: { description: { story: "An icon-only trigger takes its accessible name and title from trigger-label." } },
  },
  render: () => html`
    <ui-dropdown trigger-label="More actions" trigger-shape="round" .items=${simple}>
      <ui-icon slot="trigger" name="menu"></ui-icon>
    </ui-dropdown>
    <ui-dropdown trigger-label="Settings" trigger-shape="square" trigger-variant="tonal" .items=${simple}>
      <ui-icon slot="trigger" name="settings"></ui-icon>
    </ui-dropdown>
    <ui-dropdown trigger-label="Share" trigger-shape="round" trigger-variant="outlined" .items=${simple}>
      <ui-icon slot="trigger" name="send"></ui-icon>
    </ui-dropdown>
    <ui-dropdown label="Details" trigger-icon="info" trigger-variant="text" panel="card" heading="Payment terms">
      <ui-text variant="body-md">Invoices are due 30 days after the issue date.</ui-text>
    </ui-dropdown>
  `,
});

export const CheckableItems = meta.story({
  name: "Checkable items",
  parameters: {
    docs: { description: { story: "Items with a checked value are menuitemcheckbox and show a check when on." } },
  },
  render: () => html` <ui-dropdown label="Columns" trigger-variant="outlined" .items=${columns}></ui-dropdown> `,
});

export const CardAndPlainPanels = meta.story({
  name: "Card and plain panels",
  parameters: {
    docs: {
      description: { story: "Without items the panel is a dialog: a card with an optional heading, or plain content." },
    },
  },
  render: () => html`
    <ui-dropdown label="Quarterly report" trigger-variant="tonal" panel="card" heading="Quarterly report">
      <ui-text variant="body-md">Revenue grew 12% against the previous quarter, led by renewals.</ui-text>
      <ui-button size="xs" variant="text">Open report</ui-button>
    </ui-dropdown>
    <ui-dropdown
      label="Wide card"
      trigger-variant="outlined"
      panel="card"
      panel-width="6"
      panel-elevation="3"
      heading="Ana Silva"
    >
      <ui-text variant="body-md">Account manager for 14 customers. Usually replies within a day.</ui-text>
    </ui-dropdown>
    <ui-dropdown label="Plain panel" trigger-variant="outlined" panel="plain" panel-padding="4" panel-rounded>
      <ui-text variant="body-md">Any content, with no card around it.</ui-text>
    </ui-dropdown>
  `,
});

export const Placement = meta.story({
  name: "Placement",
  parameters: { docs: { description: { story: "side and align place the panel; it flips when there is no room." } } },
  render: () => html`
    <ui-dropdown
      label="Bottom start"
      trigger-variant="outlined"
      side="bottom"
      align="start"
      .items=${simple}
    ></ui-dropdown>
    <ui-dropdown label="Bottom end" trigger-variant="outlined" side="bottom" align="end" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Top" trigger-variant="outlined" side="top" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Right" trigger-variant="outlined" side="right" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Left" trigger-variant="outlined" side="left" .items=${simple}></ui-dropdown>
    <ui-dropdown label="Offset 16" trigger-variant="outlined" panel-offset="4" .items=${simple}></ui-dropdown>
  `,
});

export const OpenOnHover = meta.story({
  name: "Open on hover",
  parameters: {
    docs: {
      description: {
        story:
          "With hover the menu opens when the pointer enters the trigger and closes when it leaves both trigger and panel.",
      },
    },
  },
  render: () => html` <ui-dropdown label="Hover me" trigger-variant="tonal" hover .items=${simple}></ui-dropdown> `,
  play: async ({ canvas, userEvent, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: "Hover me" });
    await userEvent.hover(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = canvas.getByRole("menu", { name: "Hover me" });
    await waitFor(() => expect(menu).toBeVisible());
    await fireEvent.pointerLeave(trigger, { relatedTarget: menu });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await fireEvent.pointerLeave(menu, { relatedTarget: trigger });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await fireEvent.pointerLeave(menu, { relatedTarget: canvasElement });
    await waitFor(() => expect(menu).not.toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(menu).toBeVisible());
    await fireEvent.pointerLeave(trigger);
    await waitFor(() => expect(menu).not.toBeVisible());
  },
});

export const ClickOnlyIgnoresHover = meta.story({
  name: "Click only ignores hover",
  render: () => html`<ui-dropdown label="Actions" trigger-variant="outlined" .items=${simple}></ui-dropdown>`,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Actions" });
    await userEvent.hover(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await fireEvent.pointerLeave(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
});

export const ForcedClosed = meta.story({
  name: "Forced closed",
  parameters: { docs: { description: { story: "force=close keeps the panel shut even when open is set." } } },
  render: () =>
    html`<ui-dropdown label="Actions" trigger-variant="outlined" open force="close" .items=${simple}></ui-dropdown>`,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Actions" })).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.getByRole("menu", { hidden: true })).not.toBeVisible();
  },
});

export const AllItemsDisabled = meta.story({
  name: "All items disabled",
  parameters: { docs: { description: { story: "With every item disabled, keys in the menu do nothing." } } },
  render: () => html`<ui-dropdown label="Archived" trigger-variant="outlined" .items=${archived}></ui-dropdown>`,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Archived" }));
    const menu = canvas.getByRole("menu", { name: "Archived" });
    await waitFor(() => expect(menu).toBeVisible());
    await expect(await fireEvent.keyDown(menu, { key: "ArrowDown" })).toBe(true);
    await expect(canvas.getByRole("menuitem", { name: "Restore" })).not.toHaveFocus();
  },
});

export const RichLabelAndPopoverMode = meta.story({
  name: "Rich label and popover mode",
  parameters: {
    docs: {
      description: {
        story:
          "A non-text label names the trigger by its content and leaves the panel unnamed; popover mode drops the menu's default padding; a card can go without a heading.",
      },
    },
  },
  render: () => html`
    <ui-dropdown .label=${html`<span>Filters</span>`} trigger-variant="outlined" mode="popover" .items=${simple}>
    </ui-dropdown>
    <ui-dropdown label="Help" trigger-variant="text" panel="card">
      <ui-text variant="body-md">Invoices are due 30 days after the issue date.</ui-text>
    </ui-dropdown>
  `,
  play: async ({ canvas, userEvent }) => {
    const filters = canvas.getByRole("button", { name: "Filters" });
    await expect(filters).not.toHaveAttribute("aria-label");
    await userEvent.click(filters);
    const menu = canvas.getByRole("menu");
    await waitFor(() => expect(menu).toBeVisible());
    await expect(menu).not.toHaveAttribute("aria-label");
    await expect(menu).not.toHaveClass("py-2");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(menu).not.toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Help" }));
    const dialog = canvas.getByRole("dialog", { name: "Help" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(canvas.queryByRole("heading")).not.toBeInTheDocument();
  },
});

export const NestedSelectCloses = meta.story({
  name: "Nested select closes",
  parameters: { docs: { description: { story: "A ui-select from content inside the panel closes the dropdown." } } },
  render: () => html`
    <ui-dropdown label="Jump to" trigger-variant="outlined" panel="plain">
      <ui-menu .items=${destinations}></ui-menu>
    </ui-dropdown>
  `,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Jump to" });
    await userEvent.click(trigger);
    const dialog = canvas.getByRole("dialog", { name: "Jump to" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(canvas.getByText("Customers"));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
});

export const KeyboardSelect = meta.story({
  name: "Keyboard select",
  parameters: {
    docs: {
      description: { story: "Enter or Space on an item selects it, closes the menu and returns focus to the trigger." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    const menu = canvas.getByRole("menu", { name: "Actions" });
    await waitFor(() => expect(canvas.getByRole("menuitem", { name: /Edit invoice/ })).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(menu).not.toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("menuitem", { name: /Edit invoice/ })).toHaveFocus());
    await userEvent.keyboard(" ");
    await expect(args.onSelect).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(menu).not.toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
});

export const OpenProperty = meta.story({
  name: "Open property",
  parameters: { docs: { description: { story: "Setting open shows the panel; clearing it hides the panel again." } } },
  render: () => html`<ui-dropdown label="Actions" trigger-variant="outlined" open .items=${simple}></ui-dropdown>`,
  play: async ({ canvas, canvasElement }) => {
    const menu = await canvas.findByRole("menu", { name: "Actions" });
    await waitFor(() => expect(menu).toBeVisible());
    await expect(canvas.getByRole("button", { name: "Actions" })).toHaveAttribute("aria-expanded", "true");
    canvasElement.querySelector("ui-dropdown")!.open = false;
    await waitFor(() => expect(menu).not.toBeVisible());
    await expect(canvas.getByRole("button", { name: "Actions" })).toHaveAttribute("aria-expanded", "false");
    const host = canvasElement.querySelector("ui-dropdown")!;
    host.open = true;
    await waitFor(() => expect(menu).toBeVisible());
    host.show();
    await expect(menu).toBeVisible();
    host.toggle();
    await waitFor(() => expect(menu).not.toBeVisible());
    await expect(host.open).toBe(false);
    host.hide();
    await expect(host.open).toBe(false);
    host.toggle();
    await waitFor(() => expect(menu).toBeVisible());
    await expect(host.open).toBe(true);
  },
});

export const SlottedTriggerLabel = meta.story({
  name: "Slotted trigger label",
  parameters: {
    docs: { description: { story: "A slotted trigger without trigger-label takes its accessible name from label." } },
  },
  render: () => html`
    <ui-dropdown label="Account" trigger-shape="round" .items=${simple}>
      <ui-icon slot="trigger" name="settings"></ui-icon>
    </ui-dropdown>
  `,
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("button", { name: "Account" })).toHaveAttribute("aria-haspopup", "menu");
  },
});
