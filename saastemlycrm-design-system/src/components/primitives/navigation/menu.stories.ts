import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor } from "storybook/test";
import "./menu.ts";
import "../typography/text.ts";
import { iconSvg } from "../media/icon.ts";
import { menuFoldTween, type MenuItem } from "./menu.ts";

const basic: MenuItem[] = [
  { label: "Dashboard", icon: iconSvg("home"), href: "#", active: true },
  { label: "Invoices", icon: iconSvg("file"), href: "#", badge: "12", badgeColor: "primary" },
  { label: "Contacts", icon: iconSvg("users"), href: "#" },
  { label: "Reports", icon: iconSvg("chart"), href: "#", focus: true },
  { label: "Billing", icon: iconSvg("banknotes"), disabled: true },
];

const grouped: MenuItem[] = [
  { label: "Sales", heading: true },
  { label: "Deals", icon: iconSvg("briefcase"), href: "#" },
  { label: "Invoices", icon: iconSvg("file"), href: "#", active: true },
  { label: "Workspace", heading: true },
  { label: "Members", icon: iconSvg("users"), href: "#" },
  { label: "Settings", icon: iconSvg("settings"), href: "#", badge: "New", badgeColor: "success" },
];

const nested: MenuItem[] = [
  { label: "Dashboard", icon: iconSvg("home"), href: "#" },
  {
    label: "Reports",
    icon: iconSvg("chart"),
    open: true,
    children: [
      { label: "Quarterly report", href: "#", active: true },
      { label: "Revenue by region", href: "#" },
      { label: "Pipeline", href: "#" },
    ],
  },
  {
    label: "Contacts",
    icon: iconSvg("users"),
    children: [
      { label: "People", href: "#" },
      { label: "Companies", href: "#" },
    ],
  },
];

const cards: MenuItem[] = [
  {
    label: "Invoice INV-0042",
    card: true,
    icon: iconSvg("file"),
    description: "Ana Silva, 1,240.00, due Friday",
    badge: "Overdue",
    badgeColor: "error",
    href: "#",
  },
  {
    label: "Invoice INV-0043",
    card: true,
    icon: iconSvg("file"),
    description: "Omar Haddad, 860.00, paid on 2 November with a card ending 4242",
    oneLine: true,
    badge: "Paid",
    badgeColor: "success",
    href: "#",
    active: true,
  },
];

const horizontal: MenuItem[] = [
  { label: "Overview", href: "#", active: true },
  { label: "Activity", href: "#" },
  { label: "Files", href: "#", badge: "3" },
  { label: "Settings", href: "#" },
];

const icons: MenuItem[] = [
  { label: "Dashboard", icon: iconSvg("home"), href: "#", active: true },
  { label: "Inbox", icon: iconSvg("inbox"), href: "#" },
  { label: "Calendar", icon: iconSvg("calendar"), href: "#" },
  { label: "Settings", icon: iconSvg("settings"), href: "#" },
];

const navItems: MenuItem[] = [
  { label: "Main", heading: true },
  { label: "Dashboard", icon: iconSvg("home"), href: "#" },
  { label: "Inbox", icon: iconSvg("inbox"), href: "#", badge: "4", badgeColor: "primary" },
  {
    label: "Reports",
    icon: iconSvg("chart"),
    open: true,
    iconAction: { label: "Pin reports", pressed: true },
    children: [
      { label: "Quarterly report", href: "#", active: true },
      { label: "Revenue by region", href: "#" },
    ],
  },
  { label: "Settings", icon: iconSvg("settings"), href: "#" },
];

const withContent: MenuItem[] = [
  { label: "Notifications", icon: iconSvg("bell"), href: "#" },
  {
    label: "Storage",
    icon: iconSvg("database"),
    open: true,
    children: [
      {
        content: html`<ui-text variant="body-sm"
          >7.2 GB of 10 GB used. Older files move to the archive after a year.</ui-text
        >`,
      },
    ],
  },
];

const playground: MenuItem[] = [
  { label: "Dashboard", icon: iconSvg("home"), href: "#", active: true },
  {
    label: "Reports",
    icon: iconSvg("chart"),
    children: [
      { label: "Quarterly report", href: "#" },
      { label: "Revenue by region", href: "#" },
    ],
  },
  { label: "Archive", icon: iconSvg("archive") },
  { label: "Billing", icon: iconSvg("banknotes"), disabled: true },
];

const folding: MenuItem[] = [
  { label: "Dashboard", icon: iconSvg("home"), href: "#", active: true },
  { icon: iconSvg("inbox", {}, { label: "Inbox" }), href: "#" },
  {
    label: "Team",
    heading: true,
    children: [{ label: "Members", icon: iconSvg("users"), href: "#", badge: "8" }],
  },
  {
    label: "Reports",
    icon: iconSvg("chart"),
    open: true,
    iconAction: { label: "Pin reports" },
    children: [
      { label: "Quarterly report", href: "#" },
      { label: "Regions", open: true, children: [{ label: "North", href: "#" }] },
    ],
  },
  {
    label: "Archive",
    icon: iconSvg("archive"),
    children: [{ label: "Last year", href: "#" }],
  },
];

const bareCards: MenuItem[] = [
  { card: true, description: "Draft, not sent yet" },
  { card: true, label: "Invoice INV-0044" },
];

const railButtons: MenuItem[] = [
  { label: "Dashboard", icon: iconSvg("home"), href: "#" },
  { label: "Compose", icon: iconSvg("edit") },
];

const meta = preview
  .type<{
    args: {
      onSelect: (e: Event) => void;
      onToggle: (e: Event) => void;
      onIconAction: (e: Event) => void;
      onClick: (e: Event) => void;
    };
  }>()
  .meta({
    title: "Primitives/Navigation/Menu",
    component: "ui-menu",
    args: {
      items: playground,
      size: "md",
      direction: "vertical",
      width: "sm",
      iconSize: "md",
      submenu: "details",
      layout: "list",
      tooltip: "right",
      iconOnly: false,
      panes: false,
      paged: false,
      nowrap: false,
      surface: true,
      rounded: true,
      flush: false,
      onSelect: fn(),
      onToggle: fn(),
      onIconAction: fn(),
      onClick: fn((e: Event) => {
        if ((e.target as Element).closest("a")) e.preventDefault();
      }),
    },
    argTypes: {
      items: { control: "object" },
      size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
      direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
      width: { control: "select", options: [undefined, "sm", "xs", "full", "grow", "auto", "max"] },
      iconSize: { control: "inline-radio", options: ["sm", "md"] },
      submenu: { control: "inline-radio", options: ["static", "details", "js"] },
      layout: { control: "inline-radio", options: ["list", "nav", "rail"] },
      tooltip: { control: "inline-radio", options: ["top", "right", "bottom", "none"] },
      paged: { control: "boolean" },
      nowrap: { control: "boolean" },
      surface: { control: "boolean" },
      rounded: { control: "boolean" },
      flush: { control: "boolean" },
      onSelect: { table: { category: "events" } },
      onToggle: { table: { category: "events" } },
      onIconAction: { table: { category: "events" } },
      onClick: {
        table: { category: "events" },
        description: "Called on click; the story keeps the page from navigating.",
      },
    },
    render: (args) => html`
      <ui-menu
        .items=${args.items ?? []}
        size=${ifDefined(args.size)}
        direction=${ifDefined(args.direction)}
        width=${ifDefined(args.width)}
        icon-size=${ifDefined(args.iconSize)}
        submenu=${ifDefined(args.submenu)}
        layout=${ifDefined(args.layout)}
        tooltip=${ifDefined(args.tooltip)}
        ?icon-only=${args.iconOnly}
        ?panes=${args.panes}
        paged=${args.paged === true ? "true" : "false"}
        nowrap=${args.nowrap === true ? "true" : "false"}
        surface=${args.surface === false ? "false" : "true"}
        rounded=${args.rounded === false ? "false" : "true"}
        flush=${args.flush === true ? "true" : "false"}
        @ui-select=${args.onSelect}
        @ui-toggle=${args.onToggle}
        @ui-icon-action=${args.onIconAction}
        @click=${args.onClick}
      ></ui-menu>
    `,
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the menu; choosing an item calls onSelect, a group calls onToggle." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("button", { name: "Billing" })).toBeDisabled();
    const group = canvas.getByRole("group");
    await expect(group).not.toHaveAttribute("open");
    await userEvent.click(canvas.getByText("Reports"));
    await expect(group).toHaveAttribute("open");
    await waitFor(() => expect(args.onToggle).toHaveBeenCalledOnce());
    await userEvent.click(canvas.getByRole("link", { name: "Quarterly report" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ path: [1, 0] }) }),
    );
    canvas.getByRole("button", { name: "Archive" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenCalledTimes(2);
    await userEvent.click(canvas.getByText("Reports"));
    await expect(group).not.toHaveAttribute("open");
    await waitFor(() => expect(args.onToggle).toHaveBeenCalledTimes(2));
    await expect(args.onToggle).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ path: [1], open: false }) }),
    );
  },
});

export const ScriptedSubmenu = meta.story({
  name: "Scripted submenu",
  args: { submenu: "js" },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("button", { name: "Reports" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    toggle.focus();
    await userEvent.keyboard("{Enter}");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard(" ");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  },
});

export const IconOnlyRail = meta.story({
  name: "Icon-only rail",
  args: { items: icons, layout: "rail", width: undefined },
  play: async ({ canvas, userEvent, args }) => {
    const inbox = canvas.getByRole("link", { name: "Inbox" });
    await expect(inbox).toHaveAttribute("data-tip", "Inbox");
    await userEvent.click(inbox);
    await expect(args.onSelect).toHaveBeenCalledOnce();
  },
});

export const PinAction = meta.story({
  name: "Pin action",
  args: { items: navItems, layout: "nav" },
  play: async ({ canvas, userEvent, args }) => {
    const pin = canvas.getByRole("button", { name: "Pin reports" });
    await expect(pin).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(pin);
    await expect(args.onIconAction).toHaveBeenCalledOnce();
  },
});

export const List = meta.story({
  name: "List",
  parameters: {
    docs: {
      description: {
        story:
          "Active marks the current item; focus highlights an item as keyboard-focused; disabled items can't be chosen.",
      },
    },
  },
  render: () => html`
    <ui-menu width="sm" .items=${basic}></ui-menu>
    <ui-menu width="sm" .items=${grouped}></ui-menu>
  `,
});

export const CurrentChoice = meta.story({
  name: "Current choice",
  parameters: {
    docs: {
      description: {
        story: "An active button item is announced as current, like an active link is announced as the current page.",
      },
    },
  },
  render: () => html`
    <ui-menu
      width="sm"
      .items=${[
        { id: "compact", label: "Compact" },
        { id: "comfortable", label: "Comfortable", active: true },
        { id: "spacious", label: "Spacious" },
      ]}
    ></ui-menu>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Comfortable" })).toHaveAttribute("aria-current", "true");
    await expect(canvas.getByRole("button", { name: "Compact" })).not.toHaveAttribute("aria-current");
    await expect(canvas.getByRole("button", { name: "Spacious" })).not.toHaveAttribute("aria-current");
  },
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-menu size="xs" .items=${icons}></ui-menu>
    <ui-menu size="sm" .items=${icons}></ui-menu>
    <ui-menu size="md" .items=${icons}></ui-menu>
    <ui-menu size="lg" .items=${icons}></ui-menu>
    <ui-menu size="xl" icon-size="sm" .items=${icons}></ui-menu>
  `,
});

export const Submenus = meta.story({
  name: "Submenus",
  parameters: {
    docs: {
      description: {
        story: "details (default) uses native disclosures, js toggles with a button, and static always shows children.",
      },
    },
  },
  render: () => html`
    <ui-menu width="sm" submenu="details" .items=${nested}></ui-menu>
    <ui-menu width="sm" submenu="js" .items=${nested}></ui-menu>
    <ui-menu width="sm" submenu="static" .items=${nested}></ui-menu>
  `,
});

export const CardsAndContent = meta.story({
  name: "Cards and content",
  render: () => html`
    <ui-menu width="xs" .items=${cards}></ui-menu>
    <ui-menu width="sm" .items=${withContent}></ui-menu>
  `,
});

export const Horizontal = meta.story({
  name: "Horizontal",
  render: () => html`
    <ui-menu direction="horizontal" .items=${horizontal}></ui-menu>
    <ui-menu direction="horizontal" icon-only tooltip="bottom" .items=${icons}></ui-menu>
  `,
});

export const IconOnly = meta.story({
  name: "Icon only",
  parameters: {
    docs: {
      description: {
        story: "Icon-only items take the label as their accessible name and show it as a tooltip on the chosen side.",
      },
    },
  },
  render: () => html`
    <ui-menu icon-only .items=${icons}></ui-menu>
    <ui-menu icon-only tooltip="top" .items=${icons}></ui-menu>
    <ui-menu icon-only tooltip="none" .items=${icons}></ui-menu>
  `,
});

export const NavigationLayouts = meta.story({
  name: "Navigation layouts",
  parameters: {
    docs: {
      description: {
        story:
          "nav is the sidebar layout with a sliding highlight on the active item; rail shows icons only with tooltips.",
      },
    },
  },
  render: () => html`
    <ui-menu layout="nav" width="sm" .items=${navItems}></ui-menu>
    <ui-menu layout="rail" .items=${navItems}></ui-menu>
  `,
  play: async ({ canvasElement }) => {
    const highlight = canvasElement.querySelector("[data-menu-highlight]")!;
    await expect(highlight).toHaveAttribute("aria-hidden", "true");
    await expect(highlight).not.toHaveAttribute("role");
    for (const summary of canvasElement.querySelectorAll("ui-menu[layout='rail'] summary"))
      await expect(summary).toHaveAccessibleName();
  },
});

export const SurfaceOptions = meta.story({
  name: "Surface options",
  render: () => html`
    <ui-menu width="sm" surface="false" .items=${basic}></ui-menu>
    <ui-menu width="sm" rounded="false" .items=${basic}></ui-menu>
    <ui-menu width="sm" flush .items=${basic}></ui-menu>
    <ui-menu width="max" nowrap .items=${cards}></ui-menu>
  `,
});

export const FoldingNav = meta.story({
  name: "Folding nav",
  parameters: {
    docs: {
      description: {
        story:
          "A heading with children is a titled group; openGroup opens a group by path; menuFoldTween scrubs and follows the fold of the labels, badges, chevrons and highlight.",
      },
    },
  },
  args: { items: folding, layout: "nav" },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    await expect(canvas.getByRole("heading", { name: "Team" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("link", { name: "Inbox" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Pin reports" })).toHaveAttribute("aria-pressed", "false");
    const host = canvasElement.querySelector("ui-menu")!;
    const archive = canvasElement.querySelector<HTMLDetailsElement>('details[data-menu-path="4"]')!;
    await userEvent.click(canvas.getByText("Reports", { selector: "span" }));
    await waitFor(() =>
      expect(args.onToggle).toHaveBeenLastCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ path: [3], open: false }) }),
      ),
    );
    host.openGroup([4]);
    await expect(archive.open).toBe(true);
    host.openGroup([4]);
    await expect(archive.open).toBe(true);
    host.openGroup([0]);
    await expect(canvasElement.querySelector('details[data-menu-path="0"]')).toBeNull();
    const highlight = canvasElement.querySelector<HTMLElement>("[data-menu-highlight]")!;
    await waitFor(() => expect(highlight.style.marginTop).toBe(""), { timeout: 3000 });

    const list = host.querySelector("ul")!;
    const before = list.getAnimations({ subtree: true }).length;
    const fold = menuFoldTween(list);
    const parts = list.getAnimations({ subtree: true }).slice(before);
    const label = canvas.getByText("Dashboard");
    const nestedLabel = canvas.getByText("North");
    await expect(label.getAnimations()).toHaveLength(1);
    await expect(nestedLabel.getAnimations()).toHaveLength(0);
    await expect(highlight.getAnimations()).toHaveLength(1);
    fold.seek(0.5);
    for (const a of parts) await expect(a.currentTime).toBe(500);
    await expect(Number(getComputedStyle(label).opacity)).toBeCloseTo(0.5, 1);
    fold.seek(2);
    await expect(Number(getComputedStyle(label).opacity)).toBe(1);

    const running = highlight.animate([], { duration: 400 });
    await running.ready;
    fold.follow(running, 0);
    await expect(parts[0]!.startTime).toBe(running.startTime);
    fold.seek(0);
    await expect(Number(getComputedStyle(label).opacity)).toBe(0);

    const held = highlight.animate([], { duration: 400 });
    held.pause();
    fold.follow(held, 1);
    await held.ready;
    await expect(parts[0]!.startTime).toBeNull();

    const pending = highlight.animate([], { duration: 400 });
    fold.follow(pending, 1);
    fold.seek(1);
    await pending.ready;
    await expect(parts[0]!.startTime).toBeNull();

    const cancelled = highlight.animate([], { duration: 400 });
    const ready = cancelled.ready;
    fold.follow(cancelled, 0);
    cancelled.cancel();
    await expect(ready).rejects.toThrow();

    fold.follow(new Animation(), 0.25);
    for (const a of parts) await expect(a.currentTime).toBe(250);
    fold.cancel();
    await expect(label.getAnimations()).toHaveLength(0);
  },
});

export const RightToLeftRailAndFold = meta.story({
  name: "Right-to-left rail and fold",
  parameters: {
    docs: { description: { story: "In right-to-left pages a rail's tooltips open to the left." } },
  },
  render: () => html`
    <div dir="rtl">
      <ui-menu layout="rail" .items=${railButtons}></ui-menu>
      <ui-menu layout="nav" width="sm" .items=${icons}></ui-menu>
    </div>
  `,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "Compose" })).toHaveAttribute("data-tip-side", "left");
    await expect(canvas.getAllByRole("link", { name: "Dashboard" })[0]).toHaveAttribute("data-tip-side", "left");
    const list = canvasElement.querySelectorAll("ui-menu")[1]!.querySelector("ul")!;
    const highlight = list.querySelector<HTMLElement>("[data-menu-highlight]")!;
    const rail = canvasElement.querySelector("ui-menu")!.querySelector("ul")!;
    const railFold = menuFoldTween(rail);
    railFold.seek(0);
    await expect(rail.getAnimations({ subtree: true })).toHaveLength(0);
    const fold = menuFoldTween(list);
    fold.seek(0);
    await expect(getComputedStyle(highlight).clipPath).toMatch(/^inset\(0px 0px 0px /);
    fold.cancel();
  },
});

export const BareCardsAndSlottedContent = meta.story({
  name: "Bare cards and slotted content",
  parameters: {
    docs: {
      description: {
        story: "Cards need only a label or a description; without items the menu shows its own list content.",
      },
    },
  },
  render: () => html`
    <ui-menu width="xs" .items=${bareCards}></ui-menu>
    <ui-menu width="sm"
      ><li><a href="#">Help centre</a></li></ui-menu
    >
  `,
  play: async ({ canvas }) => {
    const draft = canvas.getByRole("button", { name: "Draft, not sent yet" });
    await expect(draft).toHaveAttribute("data-card");
    const invoice = canvas.getByRole("button", { name: "Invoice INV-0044" });
    await expect(invoice.querySelector(".badge")).toBeNull();
    await expect(canvas.getByRole("link", { name: "Help centre" })).toBeVisible();
  },
});
