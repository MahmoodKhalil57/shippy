import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor } from "storybook/test";
import { tileW } from "../../../lib/base/tiles.ts";
import "./frame.ts";
import "./container.ts";
import "./page-header.ts";
import "./grid.ts";
import "./box.ts";
import "../navigation/menu.ts";
import "../actions/icon-button.ts";
import "../actions/button.ts";
import "../typography/text.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { ICON_NAMES } from "../../../lib/base/icon-names.ts";
import type { MenuItem } from "../navigation/menu.ts";
import type { UiFrameColumn, UiFrameMain } from "./frame.ts";

const entry = (label: string, icon: IconName, active = false): MenuItem => ({
  label,
  icon: iconSvg(icon, { size: "md" }),
  href: "#",
  active,
});

const nav: MenuItem[] = [
  entry("Home", "home", true),
  entry("Orders", "clipboard"),
  entry("Shipments", "truck"),
  entry("Customers", "users"),
  entry("Reports", "chart"),
];

const aside: MenuItem[] = [entry("Notifications", "bell"), entry("Messages", "chat"), entry("History", "history")];

const sync = (frame: Element | null) => {
  const main = frame?.querySelector<UiFrameMain>("ui-frame-main");
  if (!frame || !main) return;
  const start = frame.querySelector<UiFrameColumn>('ui-frame-column[side="start"]');
  const end = frame.querySelector<UiFrameColumn>('ui-frame-column[side="end"]');
  main.pushStart = !!start?.open;
  main.pushEnd = !!end?.open && !end.merged;
};

const onToggle = (e: CustomEvent<{ open: boolean }>) => {
  const column = e.currentTarget as UiFrameColumn;
  column.open = e.detail.open;
  sync(column.closest("ui-frame"));
};

const onDrag = (e: CustomEvent<{ side: "start" | "end"; open: boolean }>) => {
  const frame = (e.currentTarget as Element).closest("ui-frame");
  const column = frame?.querySelector<UiFrameColumn>(`ui-frame-column[side="${e.detail.side}"]`);
  if (column) column.open = e.detail.open;
  sync(frame ?? null);
};

const page = () => html`
  <ui-container width="full" padding-x="slack" padding-y="half">
    <ui-page-header
      eyebrow="Overview"
      heading="Good morning"
      subtitle="Twelve orders are waiting to be packed and three shipments are running late."
    >
      <ui-button slot="actions" color="primary">New order</ui-button>
    </ui-page-header>
    <ui-grid fit="sm" gap="4">
      <ui-box surface="base-100" border rounded="box" padding="4" height="32">Orders to pack</ui-box>
      <ui-box surface="base-100" border rounded="box" padding="4" height="32">Late shipments</ui-box>
      <ui-box surface="base-100" border rounded="box" padding="4" height="32">Open returns</ui-box>
    </ui-grid>
  </ui-container>
`;

const frame = (options: { navOpen?: boolean; asideOpen?: boolean; compact?: boolean; embedded?: boolean } = {}) => html`
  <ui-frame ?compact=${options.compact} ?embedded=${options.embedded}>
    <ui-frame-header brand="Workspace" brand-icon="cube" brand-href="#">
      <ui-icon-button slot="actions" icon="search" label="Search"></ui-icon-button>
      <ui-icon-button slot="actions" icon="settings" label="Settings"></ui-icon-button>
    </ui-frame-header>
    <ui-frame-column side="start" label="Navigation" ?open=${options.navOpen} @ui-column-toggle=${onToggle}>
      <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${nav}></ui-menu>
      <ui-menu slot="rail" layout="rail" surface="false" .items=${nav}></ui-menu>
      <ui-text slot="footer" variant="body-sm" color="muted">Signed in as a guest</ui-text>
    </ui-frame-column>
    <ui-frame-main
      ?compact=${options.compact}
      start-label="Navigation"
      end-label="Activity"
      ?push-start=${options.navOpen}
      ?push-end=${options.asideOpen && !options.compact}
      @ui-frame-drag=${onDrag}
      >${page()}</ui-frame-main
    >
    <ui-frame-column
      side="end"
      label="Activity"
      ?open=${options.asideOpen}
      ?merged=${options.compact}
      @ui-column-toggle=${onToggle}
    >
      <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${aside}></ui-menu>
      <ui-menu slot="rail" layout="rail" surface="false" .items=${aside}></ui-menu>
    </ui-frame-column>
  </ui-frame>
`;

type ShellArgs = {
  brand: string;
  brandIcon: IconName;
  navOpen: boolean;
  asideOpen: boolean;
  compact: boolean;
  cols: number;
  settling: boolean;
  scrim: string;
  windowScrim: string;
  liftStart: boolean;
  liftEnd: boolean;
  startLabel: string;
  endLabel: string;
  sheet: boolean;
  onColumnToggle: (detail: { open: boolean }) => void;
  onFrameDrag: (detail: { side: "start" | "end"; open: boolean }) => void;
};

const toggled = (args: ShellArgs) => (e: CustomEvent<{ open: boolean }>) => {
  args.onColumnToggle(e.detail);
  onToggle(e);
};

const dragged = (args: ShellArgs) => (e: CustomEvent<{ side: "start" | "end"; open: boolean }>) => {
  args.onFrameDrag(e.detail);
  onDrag(e);
};

const meta = preview.type<{ args: ShellArgs }>().meta({
  title: "Primitives/Layout/Frame",
  component: "ui-frame",
  args: {
    brand: "Workspace",
    brandIcon: "cube",
    navOpen: false,
    asideOpen: false,
    compact: false,
    cols: 6,
    settling: false,
    scrim: "",
    windowScrim: "",
    liftStart: false,
    liftEnd: false,
    startLabel: "Navigation",
    endLabel: "Activity",
    sheet: false,
    onColumnToggle: fn(),
    onFrameDrag: fn(),
  },
  argTypes: {
    brand: { control: "text", description: "The header's brand name." },
    brandIcon: { control: "select", options: ICON_NAMES, description: "The header's brand icon." },
    navOpen: { control: "boolean", description: "Whether the start column is open." },
    asideOpen: { control: "boolean", description: "Whether the end column is open." },
    compact: { control: "boolean" },
    cols: { control: { type: "number", min: 3, max: 12, step: 1 } },
    settling: { control: "boolean" },
    scrim: { control: "text", description: "A colour laid over the frame's backdrop." },
    windowScrim: { control: "text", description: "A colour laid over the window." },
    liftStart: { control: "boolean", description: "Lift the header's start into the window." },
    liftEnd: { control: "boolean", description: "Lift the header's actions into the window." },
    startLabel: { control: "text", description: "The start column's name." },
    endLabel: { control: "text", description: "The end column's name." },
    sheet: { control: "boolean", description: "Open the start column as a sheet over the window." },
    onColumnToggle: { table: { category: "events" } },
    onFrameDrag: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-frame
      ?compact=${args.compact}
      cols=${args.cols}
      ?settling=${args.settling}
      scrim=${args.scrim}
      .windowScrim=${args.windowScrim}
    >
      <ui-frame-header
        brand=${args.brand}
        brand-icon=${ifDefined(args.brandIcon)}
        brand-href="#"
        ?lift-start=${args.liftStart}
        ?lift-end=${args.liftEnd}
      >
        <ui-icon-button slot="actions" icon="search" label="Search"></ui-icon-button>
      </ui-frame-header>
      <ui-frame-column
        side="start"
        label=${args.startLabel}
        ?open=${args.navOpen}
        ?sheet=${args.sheet}
        @ui-column-toggle=${toggled(args)}
      >
        <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${nav}></ui-menu>
        <ui-menu slot="rail" layout="rail" surface="false" .items=${nav}></ui-menu>
      </ui-frame-column>
      <ui-frame-main
        ?compact=${args.compact}
        start-label=${args.startLabel}
        end-label=${args.endLabel}
        ?push-start=${args.navOpen && !args.sheet}
        ?push-end=${args.asideOpen && !args.compact}
        @ui-frame-drag=${dragged(args)}
        >${page()}</ui-frame-main
      >
      <ui-frame-column
        side="end"
        label=${args.endLabel}
        ?open=${args.asideOpen}
        ?merged=${args.compact}
        @ui-column-toggle=${toggled(args)}
      >
        <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${aside}></ui-menu>
        <ui-menu slot="rail" layout="rail" surface="false" .items=${aside}></ui-menu>
      </ui-frame-column>
    </ui-frame>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the frame; the column toggles open and close their column." } },
    canvas: "column",
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("navigation", { name: "Navigation" })).toBeInTheDocument();
    await expect(canvas.getByRole("complementary", { name: "Activity" })).toBeInTheDocument();
    const expand = canvas.getByRole("button", { name: "Expand navigation" });
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(expand);
    await expect(args.onColumnToggle).toHaveBeenLastCalledWith({ open: true });
    const collapse = await canvas.findByRole("button", { name: "Collapse navigation" });
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(collapse);
    await expect(args.onColumnToggle).toHaveBeenLastCalledWith({ open: false });
    await expect(await canvas.findByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    const activity = canvas.getByRole("button", { name: "Expand activity" });
    await userEvent.click(activity);
    await expect(await canvas.findByRole("button", { name: "Collapse activity" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Collapse activity" }));
    await expect(await canvas.findByRole("button", { name: "Expand activity" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(args.onColumnToggle).toHaveBeenCalledTimes(4);
  },
});

export const ResizeHandles = meta.story({
  name: "Resize handles",
  parameters: { canvas: "column" },
  play: async ({ canvas, userEvent, args }) => {
    for (const h of canvas.getAllByRole("separator")) await expect(h).toHaveAttribute("aria-valuenow", "0");
    canvas.getByRole("separator", { name: "Resize to open navigation" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: true });
    const close = await canvas.findByRole("separator", { name: "Resize to close navigation" });
    await expect(close).toHaveAttribute("aria-valuenow", "1");
    await expect(canvas.getByRole("button", { name: "Collapse navigation" })).toHaveAttribute("aria-expanded", "true");
    close.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: false });
    await expect(await canvas.findByRole("separator", { name: "Resize to open navigation" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  },
});

export const StartsOpen = meta.story({
  name: "Starts open",
  args: { navOpen: true },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Collapse navigation" })).toHaveAttribute("aria-expanded", "true");
  },
});

export const Rails = meta.story({
  name: "Rails",
  parameters: {
    docs: {
      description: {
        story:
          "Both columns start as icon rails; their toggles or a drag on the window's edges open them and push the window aside.",
      },
    },
    canvas: "column",
  },
  render: () => frame(),
});

export const NavigationOpen = meta.story({
  name: "Navigation open",
  parameters: { canvas: "column" },
  render: () => frame({ navOpen: true }),
});

export const BothColumnsOpen = meta.story({
  name: "Both columns open",
  parameters: { canvas: "column" },
  render: () => frame({ navOpen: true, asideOpen: true }),
});

export const Embedded = meta.story({
  name: "Embedded",
  parameters: {
    docs: {
      description: {
        story: "embedded sizes the frame to its parent instead of the viewport, for previews inside a page.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-box width="full" height="96">${frame({ embedded: true })}</ui-box>`,
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector("ui-box > div")!.getBoundingClientRect();
    const shell = canvasElement.querySelector<HTMLElement>("[data-frame]")!;
    await expect(Math.round(shell.getBoundingClientRect().height)).toBe(Math.round(box.height));
    await expect(shell.getBoundingClientRect().width).toBeLessThanOrEqual(box.width + 1);
  },
});

export const Compact = meta.story({
  name: "Compact",
  parameters: {
    docs: {
      description: {
        story: "Compact removes the gap around the window and folds the end column away, as on narrow screens.",
      },
    },
    canvas: "column",
  },
  render: () => frame({ compact: true }),
});

const handleOf = (canvasElement: HTMLElement, name: string) =>
  [...canvasElement.querySelectorAll<HTMLElement>("[role=separator]")].find(
    (h) => h.getAttribute("aria-label") === name,
  )!;

const press = (el: Element, type: string, clientX: number, init: PointerEventInit = {}) =>
  el.dispatchEvent(
    new PointerEvent(type, { bubbles: true, cancelable: true, clientX, pointerId: 7, button: 0, ...init }),
  );

const dragBy = (el: Element, dx: number) => {
  const box = el.getBoundingClientRect();
  const x = box.left + box.width / 2;
  press(el, "pointerdown", x);
  press(el, "pointermove", x + dx);
  press(el, "pointerup", x + dx);
};

const span = () => 3 * tileW(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16);

export const DragToOpenAndClose = meta.story({
  name: "Drag to open and close",
  parameters: {
    docs: {
      description: {
        story: "Dragging a window edge past half a column's width opens or closes it; a shorter drag springs back.",
      },
    },
    canvas: "column",
  },
  play: async ({ canvas, canvasElement, args }) => {
    const shell = canvasElement.querySelector("[data-frame]")!;
    const start = handleOf(canvasElement, "Resize to open navigation");
    const list = canvasElement.querySelector<HTMLElement>('ui-frame-column[side="start"] [data-frame-list]')!;
    const center = canvasElement.querySelector<HTMLElement>("ui-frame-main > div")!;
    const x = start.getBoundingClientRect().left;
    press(start, "pointerdown", x, { button: 2 });
    await expect(start).not.toHaveAttribute("data-dragging");
    press(start, "pointermove", x + 40);
    await expect(center.style.getPropertyValue("--drag-start")).toBe("");
    press(start, "pointerdown", x);
    await expect(start).toHaveAttribute("data-dragging");
    await expect(shell).toHaveAttribute("data-drag-start");
    await expect(list).toHaveAttribute("data-drag");
    press(start, "pointermove", x + 40, { pointerId: 9 });
    press(start, "pointerup", x + 40, { pointerId: 9 });
    await expect(start).toHaveAttribute("data-dragging");
    press(start, "pointermove", x + 40);
    await expect(center.style.getPropertyValue("--drag-start")).toBe("40px");
    press(start, "pointerup", x + 40);
    await expect(start).not.toHaveAttribute("data-dragging");
    await expect(shell).not.toHaveAttribute("data-drag-start");
    await expect(args.onFrameDrag).not.toHaveBeenCalled();
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"));
    await expect(center.style.getPropertyValue("--drag-start")).toBe("");
    dragBy(start, 10_000);
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: true });
    const close = await canvas.findByRole("separator", { name: "Resize to close navigation" });
    await expect(canvas.getByRole("button", { name: "Collapse navigation" })).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"));
    dragBy(close, -span() / 4);
    await expect(args.onFrameDrag).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"));
    dragBy(close, -10_000);
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: false });
    dragBy(await canvas.findByRole("separator", { name: "Resize to open navigation" }), 10_000);
    dragBy(await canvas.findByRole("separator", { name: "Resize to close navigation" }), -10_000);
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: false });
    await expect(await canvas.findByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"));
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag-done"));
    dragBy(handleOf(canvasElement, "Resize to open activity"), -10_000);
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "end", open: true });
    await expect(await canvas.findByRole("button", { name: "Collapse activity" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const endList = canvasElement.querySelector('ui-frame-column[side="end"] [data-frame-list]');
    await waitFor(() => expect(endList).not.toHaveAttribute("data-drag"));
  },
});

export const DragRightToLeft = meta.story({
  name: "Drag right to left",
  parameters: { canvas: "column" },
  play: async ({ canvas, canvasElement, args }) => {
    canvasElement.dir = "rtl";
    try {
      dragBy(handleOf(canvasElement, "Resize to open navigation"), -10_000);
      await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: true });
      await expect(await canvas.findByRole("separator", { name: "Resize to close navigation" })).toHaveAttribute(
        "aria-valuenow",
        "1",
      );
      const end = handleOf(canvasElement, "Resize to open activity");
      const toward = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
      end.dispatchEvent(toward);
      await expect(toward.defaultPrevented).toBe(true);
      await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "end", open: true });
      const away = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
      canvas.getByRole("separator", { name: "Resize to close navigation" }).dispatchEvent(away);
      await expect(away.defaultPrevented).toBe(true);
      await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: false });
    } finally {
      canvasElement.removeAttribute("dir");
    }
  },
});

export const KeyboardToggles = meta.story({
  name: "Keyboard toggles",
  parameters: {
    docs: {
      description: { story: "Enter or Space toggles a column from its edge; arrows open toward it and close away." },
    },
    canvas: "column",
  },
  play: async ({ canvas, userEvent, args }) => {
    canvas.getByRole("separator", { name: "Resize to open navigation" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: true });
    (await canvas.findByRole("separator", { name: "Resize to close navigation" })).focus();
    await userEvent.keyboard(" ");
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: false });
    const open = await canvas.findByRole("separator", { name: "Resize to open navigation" });
    const away = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true });
    open.dispatchEvent(away);
    const other = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    open.dispatchEvent(other);
    await expect(away.defaultPrevented).toBe(false);
    await expect(other.defaultPrevented).toBe(false);
    await expect(args.onFrameDrag).toHaveBeenCalledTimes(2);
  },
});

export const UnnamedHandles = meta.story({
  name: "Unnamed handles",
  args: { startLabel: "", endLabel: "" },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    const handles = canvas.getAllByRole("separator", { name: "Resize" });
    await expect(handles).toHaveLength(2);
    for (const h of handles) await expect(h).toHaveAttribute("title", "");
  },
});

export const Sheet = meta.story({
  name: "Sheet",
  args: { sheet: true, navOpen: true },
  parameters: {
    docs: { description: { story: "A sheet opens over the window behind a scrim that closes it when clicked." } },
    canvas: "column",
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const column = canvasElement.querySelector<UiFrameColumn>('ui-frame-column[side="start"]')!;
    const panel = column.querySelector<HTMLElement>("[data-frame-panel]")!;
    await expect(getComputedStyle(panel).position).toBe("fixed");
    const scrim = column.querySelector<HTMLElement>(":scope > div")!;
    await expect(getComputedStyle(scrim).position).toBe("fixed");
    await userEvent.click(scrim);
    await expect(args.onColumnToggle).toHaveBeenLastCalledWith({ open: false });
    await expect(await canvas.findByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(column.querySelector(":scope > div")).toBeNull();
    const widths = () =>
      panel.getAnimations().filter((a) => a instanceof CSSTransition && a.transitionProperty === "width");
    await waitFor(() => expect(widths().length).toBeGreaterThan(0));
    column.prepareSheet();
    await expect(widths()).toHaveLength(0);
    await expect(() => document.createElement("ui-frame-column").prepareSheet()).not.toThrow();
  },
});

const groups: MenuItem[] = [
  entry("Home", "home", true),
  {
    label: "Settings",
    icon: iconSvg("settings", { size: "md" }),
    children: [entry("Team", "users"), entry("Billing", "chart")],
  },
];

export const OpenGroups = meta.story({
  name: "Open groups",
  parameters: {
    docs: {
      description: {
        story: "An open group marks its column and frame, and closing the column leaves the group to fold on its own.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-frame>
      <ui-frame-column side="start" label="Navigation" open @ui-column-toggle=${onToggle}>
        <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${groups}></ui-menu>
        <ui-menu slot="rail" layout="rail" surface="false" .items=${groups}></ui-menu>
      </ui-frame-column>
      <ui-frame-main push-start start-label="Navigation">${page()}</ui-frame-main>
    </ui-frame>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Navigation" });
    const shell = canvasElement.querySelector("[data-frame]")!;
    const list = nav.querySelector<HTMLElement>("[data-frame-list]")!;
    await expect(nav).not.toHaveAttribute("data-groups-open");
    await userEvent.click(list.querySelector("summary")!);
    await waitFor(() => expect(nav).toHaveAttribute("data-groups-open"));
    await expect(shell).toHaveAttribute("data-start-groups-open");
    await userEvent.click(canvas.getByRole("button", { name: "Collapse navigation" }));
    await expect(await canvas.findByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(list).not.toHaveAttribute("data-drag");
    await expect(nav.querySelector("[data-frame-rail]")).not.toHaveAttribute("data-drag");
  },
});

export const ExtraRail = meta.story({
  name: "Extra rail",
  parameters: {
    docs: {
      description: { story: "A closed column with extra rail icons swaps between its own icons and the extra set." },
    },
    canvas: "column",
  },
  render: () => {
    const text = (t: string) => Object.assign(document.createElement("span"), { textContent: t });
    const swap = (e: CustomEvent<{ view: "own" | "extra" }>) => {
      (e.currentTarget as UiFrameColumn).railView = e.detail.view;
    };
    return html`
      <ui-frame>
        <ui-frame-column
          side="start"
          label="Navigation"
          extra-label="Tools"
          .extraRailNodes=${[text("Extra tools")]}
          @ui-rail-switch=${swap}
        >
          <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${nav}></ui-menu>
          <span slot="rail">Own icons</span>
        </ui-frame-column>
        <ui-frame-main start-label="Navigation" end-label="Activity">${page()}</ui-frame-main>
        <ui-frame-column
          side="end"
          label="Activity"
          extra-label="Gadgets"
          rail-view="extra"
          .railNodes=${[text("Activity icons")]}
          .extraRailNodes=${[text("Gadget icons")]}
        ></ui-frame-column>
        <ui-frame-column
          side="end"
          label="Notes"
          .railNodes=${[text("Note icons")]}
          .extraRailNodes=${[]}
        ></ui-frame-column>
      </ui-frame>
    `;
  },
  play: async ({ canvas, userEvent }) => {
    const own = canvas.getByText("Own icons").parentElement!;
    const extra = canvas.getByText("Extra tools").parentElement!;
    await expect(own).not.toHaveAttribute("inert");
    await expect(extra).toHaveAttribute("inert");
    await userEvent.click(canvas.getByRole("button", { name: "Show tools icons" }));
    await waitFor(() => expect(extra).not.toHaveAttribute("inert"));
    await expect(own).toHaveAttribute("inert");
    await userEvent.click(canvas.getByRole("button", { name: "Show navigation icons" }));
    await waitFor(() => expect(extra).toHaveAttribute("inert"));
    await expect(canvas.getByText("Activity icons").parentElement).toHaveAttribute("inert");
    await expect(canvas.getByText("Gadget icons").parentElement).not.toHaveAttribute("inert");
    await expect(canvas.getByRole("button", { name: "Show activity icons" })).toBeVisible();
    await expect(canvas.getByText("Note icons").parentElement).toHaveAttribute("data-frame-rail");
    await expect(canvas.getByRole("button", { name: "Expand notes" })).toHaveAttribute("aria-expanded", "false");
  },
});

export const LiveBackground = meta.story({
  name: "Live background",
  parameters: {
    docs: {
      description: {
        story:
          "A live background sits behind the frame, and the shell is cut around the window until the window leaves.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-box width="full" height="96">
      <ui-frame embedded .background=${html`<p>Drifting clouds</p>`}>
        <ui-frame-header brand="Workspace"></ui-frame-header>
        <ui-frame-main start-label="Navigation" end-label="Activity">
          ${page()}
          <ui-text slot="footer" variant="body-sm">Version 2</ui-text>
        </ui-frame-main>
      </ui-frame>
    </ui-box>
  `,
  play: async ({ canvas, canvasElement }) => {
    const loose = document.createElement("ui-frame");
    await expect(() => loose.watchWindow(canvas.getByText("Version 2"))).not.toThrow();
    await expect(loose.querySelector("[data-frame-shell]")).toBeNull();
    const live = canvasElement.querySelector("[data-frame-live]")!;
    await expect(live).toHaveAttribute("aria-hidden", "true");
    await expect(live).toHaveTextContent("Drifting clouds");
    const brand = canvas.getByText("Workspace").closest("a")!;
    await expect(brand.querySelector("svg")).toBeNull();
    await expect(brand).not.toHaveAttribute("href");
    await expect(canvas.getByRole("contentinfo")).toHaveTextContent("Version 2");
    const shell = canvasElement.querySelector<HTMLElement>("[data-frame-shell]")!;
    const backdrop = canvasElement.querySelector<HTMLElement>("[data-frame-backdrop]")!;
    await waitFor(() => expect(shell.style.clipPath).toMatch(/^path\("M \d/));
    await expect(backdrop.style.clipPath).toMatch(/^path\(evenodd, "M 0 0 H \d/);
    const handle = canvas.getByRole("separator", { name: "Resize to open navigation" });
    const down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    handle.dispatchEvent(down);
    await expect(down.defaultPrevented).toBe(true);
    canvasElement.querySelector("ui-frame-main")!.remove();
    canvasElement.querySelector<HTMLElement>("ui-box > div")!.style.height = "300px";
    await waitFor(() => expect(shell.style.clipPath).toBe(""));
    await expect(backdrop.style.clipPath).toBe("");
  },
});

export const WithoutABrand = meta.story({
  name: "Without a brand",
  args: { brand: "" },
  parameters: { canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    const header = canvasElement.querySelector("ui-frame-header")!;
    await expect(header.querySelector("a")).toBeNull();
    await expect(canvas.getByRole("button", { name: "Search" })).toBeVisible();
  },
});

export const PageTransitions = meta.story({
  name: "Page transitions",
  parameters: {
    docs: {
      description: {
        story: "A new page fades in, slides in from the side it came from, or only fades when motion is reduced.",
      },
    },
    canvas: "column",
  },
  play: async ({ canvasElement }) => {
    const main = canvasElement.querySelector<UiFrameMain>("ui-frame-main")!;
    const content = main.querySelector<HTMLElement>("main > div")!;
    const first = () => {
      const running = content.getAnimations();
      return { count: running.length, frame: (running.at(-1)!.effect as KeyframeEffect).getKeyframes()[0]! };
    };
    main.pageTransition("top-level");
    await expect(first().frame.opacity).toBe("0");
    await expect(first().frame.translate).toBeUndefined();
    const slides = [
      ["forward", /^30px/],
      ["backward", /^-30px/],
      ["lateral-forward", /^120px/],
      ["lateral-backward", /^-120px/],
    ] as const;
    for (const [kind, x] of slides) {
      main.pageTransition(kind);
      await expect(first().count).toBe(1);
      await expect(String(first().frame.translate)).toMatch(x);
    }
    canvasElement.dir = "rtl";
    try {
      main.pageTransition("forward");
      await expect(String(first().frame.translate)).toMatch(/^-30px/);
    } finally {
      canvasElement.removeAttribute("dir");
    }
    const root = document.documentElement;
    const dir = root.getAttribute("dir");
    root.removeAttribute("dir");
    try {
      main.pageTransition("backward");
      await expect(String(first().frame.translate)).toMatch(/^-30px/);
    } finally {
      if (dir !== null) root.setAttribute("dir", dir);
    }
    const media = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: true, media: query }) as MediaQueryList) as typeof matchMedia;
    try {
      main.pageTransition("lateral-forward");
      await expect(first().frame.translate).toBeUndefined();
      await expect(first().frame.opacity).toBe("0");
    } finally {
      window.matchMedia = media;
    }
    await expect(() => document.createElement("ui-frame-main").pageTransition("forward")).not.toThrow();
  },
});

export const BoardsExpectTheWindow = meta.story({
  name: "Boards expect the window",
  parameters: {
    docs: {
      description: {
        story: "When a column pushes the window, the outermost boards in the page hear how far it will move.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-frame>
      <ui-frame-column side="start" label="Navigation" @ui-column-toggle=${onToggle}>
        <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${nav}></ui-menu>
        <ui-menu slot="rail" layout="rail" surface="false" .items=${nav}></ui-menu>
      </ui-frame-column>
      <ui-frame-main start-label="Navigation">
        <ui-board data-outer><ui-board data-inner></ui-board></ui-board>
        <ui-board data-plain></ui-board>
      </ui-frame-main>
    </ui-frame>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    type Board = HTMLElement & { expectWidth?: (...a: unknown[]) => void };
    const outer = canvasElement.querySelector<Board>("[data-outer]")!;
    const inner = canvasElement.querySelector<Board>("[data-inner]")!;
    const plain = canvasElement.querySelector<Board>("[data-plain]")!;
    const heard = fn();
    const nested = fn();
    Object.defineProperty(outer, "expectWidth", { value: heard, configurable: true });
    Object.defineProperty(inner, "expectWidth", { value: nested, configurable: true });
    Object.defineProperty(plain, "expectWidth", { value: undefined, configurable: true });
    await userEvent.click(canvas.getByRole("button", { name: "Expand navigation" }));
    await waitFor(() => expect(heard).toHaveBeenCalledTimes(1));
    const [delta, settled, timing] = heard.mock.calls[0]! as [number, Promise<unknown>, { duration: number }];
    await expect(delta).toBeGreaterThan(0);
    await expect(settled).toBeInstanceOf(Promise);
    await expect(timing.duration).toBeGreaterThan(0);
    const center = canvasElement.querySelector<HTMLElement>("ui-frame-main > div")!;
    await Promise.all(center.getAnimations().map((a) => a.finished));
    await userEvent.click(canvas.getByRole("button", { name: "Collapse navigation" }));
    await waitFor(() => expect(heard).toHaveBeenCalledTimes(2));
    await expect(heard.mock.calls[1]![0]).toBeLessThan(0);
    await expect(nested).not.toHaveBeenCalled();
  },
});

export const WindowOnItsOwn = meta.story({
  name: "Window on its own",
  parameters: {
    docs: { description: { story: "A window outside a frame still reports drags and pushes from its edges." } },
    canvas: "column",
  },
  render: (args) => html`
    <ui-box width="full" height="80">
      <ui-frame-main start-label="Navigation" end-label="Activity" @ui-frame-drag=${dragged(args)}
        >${page()}</ui-frame-main
      >
    </ui-box>
  `,
  play: async ({ canvas, canvasElement, args }) => {
    const main = canvasElement.querySelector<UiFrameMain>("ui-frame-main")!;
    dragBy(canvas.getByRole("separator", { name: "Resize to open navigation" }), 10_000);
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: true });
    main.pushStart = true;
    await expect(await canvas.findByRole("separator", { name: "Resize to close navigation" })).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
    dragBy(canvas.getByRole("separator", { name: "Resize to close navigation" }), -10_000);
    await expect(args.onFrameDrag).toHaveBeenLastCalledWith({ side: "start", open: false });
  },
});

export const ToggleMidSpring = meta.story({
  name: "Toggle mid spring",
  parameters: {
    docs: {
      description: { story: "Toggling a column again while it is still springing hands its menu back cleanly." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-frame>
      <ui-frame-column side="start" label="Navigation" open @ui-column-toggle=${onToggle}>
        <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${groups}></ui-menu>
        <ui-menu slot="rail" layout="rail" surface="false" .items=${groups}></ui-menu>
      </ui-frame-column>
      <ui-frame-main push-start start-label="Navigation" @ui-frame-drag=${onDrag}>${page()}</ui-frame-main>
    </ui-frame>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const list = canvasElement.querySelector<HTMLElement>("[data-frame-list]")!;
    await userEvent.click(list.querySelector("summary")!);
    await waitFor(() => expect(canvas.getByRole("navigation")).toHaveAttribute("data-groups-open"));
    await userEvent.click(canvas.getByRole("button", { name: "Collapse navigation" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Expand navigation" }));
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"));
    await userEvent.click(await canvas.findByRole("button", { name: "Collapse navigation" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Expand navigation" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Collapse navigation" }));
    dragBy(await canvas.findByRole("separator", { name: "Resize to open navigation" }), 10_000);
    await userEvent.click(await canvas.findByRole("button", { name: "Collapse navigation" }));
    dragBy(await canvas.findByRole("separator", { name: "Resize to open navigation" }), 10_000);
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"));
    await userEvent.click(await canvas.findByRole("button", { name: "Collapse navigation" }));
    await expect(await canvas.findByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"));
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag-done"));
  },
});

export const DragWhileSpringing = meta.story({
  name: "Drag while springing",
  parameters: {
    docs: {
      description: {
        story:
          "A drag caught again mid spring keeps the column, and a toggle mid spring retargets it; the menu settles either way.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-frame>
      <ui-frame-column side="start" label="Navigation" style="--frame-nav: 30rem" @ui-column-toggle=${onToggle}>
        <ui-menu slot="list" layout="nav" width="full" surface="false" .items=${groups}></ui-menu>
        <ui-menu slot="rail" layout="rail" surface="false" .items=${groups}></ui-menu>
      </ui-frame-column>
      <ui-frame-main start-label="Navigation" @ui-frame-drag=${onDrag}>${page()}</ui-frame-main>
    </ui-frame>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Navigation" });
    const list = nav.querySelector<HTMLElement>("[data-frame-list]")!;
    const widths = () => nav.getAnimations().filter((a) => a instanceof CSSTransition);
    const handle = canvas.getByRole("separator", { name: "Resize to open navigation" });
    dragBy(handle, 10_000);
    await waitFor(() => expect(Number(widths()[0]?.currentTime ?? 0)).toBeGreaterThan(60));
    const x = handle.getBoundingClientRect().left;
    press(handle, "pointerdown", x);
    await expect(handle).toHaveAttribute("data-dragging");
    await waitFor(() => expect(widths()).toHaveLength(0), { timeout: 3000 });
    await userEvent.hover(handle);
    await userEvent.unhover(handle);
    await expect(list).toHaveAttribute("data-drag");
    press(handle, "pointerup", x);
    await expect(handle).toHaveAttribute("aria-valuenow", "1");
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"), { timeout: 3000 });
    await userEvent.click(list.querySelector("summary")!);
    await waitFor(() => expect(nav).toHaveAttribute("data-groups-open"));
    dragBy(handle, -10_000);
    await waitFor(() => expect(Number(widths()[0]?.currentTime ?? 0)).toBeGreaterThan(30));
    await userEvent.click(canvas.getByRole("button", { name: "Expand navigation" }));
    await expect(handle).toHaveAttribute("aria-valuenow", "1");
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"), { timeout: 3000 });
    dragBy(handle, -10_000);
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"), { timeout: 3000 });
    await waitFor(() =>
      expect(list.getAnimations({ subtree: true }).some((a) => a instanceof CSSTransition)).toBe(true),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Expand navigation" }));
    await expect(await canvas.findByRole("button", { name: "Collapse navigation" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"), { timeout: 3000 });
    await expect(canvasElement.querySelector("[data-drag-done]")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Collapse navigation" }));
    await waitFor(() => expect(widths()).toHaveLength(0), { timeout: 3000 });
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"), { timeout: 3000 });
    dragBy(handle, 10_000);
    await waitFor(() => expect(handle).toHaveAttribute("aria-valuenow", "1"));
    await waitFor(() => expect(widths()).toHaveLength(0), { timeout: 3000 });
    await waitFor(() => expect(list).not.toHaveAttribute("data-drag"), { timeout: 3000 });
    await expect(nav.getBoundingClientRect().width).toBeGreaterThan(400);
  },
});
