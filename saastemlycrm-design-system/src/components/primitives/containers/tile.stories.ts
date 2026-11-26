import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor } from "storybook/test";
import "./tile.ts";
import "../actions/icon-button.ts";
import "../layout/box.ts";
import "../typography/text.ts";

const invoices = [
  "INV-0042, Ana Silva, 1,240.00",
  "INV-0043, Omar Haddad, 860.00",
  "INV-0044, Mei Tanaka, 2,100.00",
  "INV-0045, Lucas Moreau, 415.50",
  "INV-0046, Priya Nair, 3,020.00",
  "INV-0047, Jonas Berg, 99.00",
  "INV-0048, Sofia Rossi, 1,780.00",
  "INV-0049, Daniel Okafor, 640.00",
];

const list = () => invoices.map((line) => html`<ui-text variant="body-md">${line}</ui-text>`);

const meta = preview
  .type<{
    args: {
      text: string;
      onStep: (e: Event) => void;
      onHide: (e: Event) => void;
      onResizeStep: (e: Event) => void;
      onHeight: (e: Event) => void;
    };
  }>()
  .meta({
    title: "Primitives/Containers/Tile",
    component: "ui-tile",
    args: {
      heading: "Overdue invoices",
      subhead: "More than 30 days late",
      text: "Three invoices are more than 30 days late.",
      count: 3,
      countTone: "error",
      size: "s",
      kind: undefined,
      emphasis: undefined,
      loading: false,
      bare: false,
      scrolls: false,
      onStep: fn(),
      onHide: fn(),
      onResizeStep: fn(),
      onHeight: fn(),
    },
    argTypes: {
      heading: { control: "text" },
      subhead: { control: "text" },
      text: { control: "text", description: "The tile's content." },
      count: { control: { type: "number", min: 0, step: 1 } },
      countTone: { control: "select", options: ["neutral", "primary", "info", "success", "warning", "error"] },
      size: { control: "inline-radio", options: ["s", "m", "l", "full"] },
      kind: { control: "select", options: [undefined, "stats", "text", "card", "table", "list", "chart", "entries"] },
      emphasis: { control: "inline-radio", options: [undefined, "inverse", "tinted"] },
      onStep: { table: { category: "events" } },
      onHide: { table: { category: "events" } },
      onResizeStep: { table: { category: "events" } },
      onHeight: { table: { category: "events" } },
    },
    render: (args) => html`
      <ui-box width="80">
        <ui-tile
          heading=${ifDefined(args.heading as string | undefined)}
          subhead=${ifDefined(args.subhead as string | undefined)}
          .count=${args.count}
          count-tone=${ifDefined(args.countTone)}
          size=${ifDefined(args.size)}
          kind=${ifDefined(args.kind)}
          emphasis=${ifDefined(args.emphasis)}
          ?loading=${args.loading}
          ?bare=${args.bare}
          ?scrolls=${args.scrolls}
          @ui-tile-height=${args.onHeight}
        >
          <ui-text variant="body-md">${args.text}</ui-text>
        </ui-tile>
      </ui-box>
    `,
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the tile." } } },
  play: async ({ canvas, args }) => {
    await waitFor(() => expect(args.onHeight).toHaveBeenCalled());
    const { height } = (args.onHeight as ReturnType<typeof fn>).mock.calls.at(-1)![0].detail as { height: number };
    await expect(height).toBeGreaterThan(0);
    await expect(canvas.getByRole("heading", { level: 2, name: "Overdue invoices" })).toBeVisible();
    await expect(canvas.getByText("3")).toBeVisible();
    await expect(canvas.getByText("More than 30 days late")).toBeVisible();
    await waitFor(() => expect(canvas.getByText("Three invoices are more than 30 days late.")).toBeVisible());
  },
});

export const LoadingIsBusy = meta.story({
  name: "Loading",
  args: { loading: true },
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvasElement.querySelector("[aria-busy='true']")).not.toBeNull();
    await expect(args.onHeight).not.toHaveBeenCalled();
    await expect(canvas.getByText("Three invoices are more than 30 days late.")).not.toBeVisible();
  },
});

export const BareTile = meta.story({
  name: "Bare",
  args: { bare: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("heading")).toBeNull();
    await waitFor(() => expect(canvas.getByText("Three invoices are more than 30 days late.")).toBeVisible());
  },
});

export const ArrangeWithKeys = meta.story({
  name: "Arrange with keys",
  parameters: {
    docs: {
      description: { story: "Arrow keys on the grip step the tile; Delete hides it; arrows on the corner resize." },
    },
  },
  render: (args) => html`
    <ui-box width="80">
      <ui-tile-arrange
        label="Revenue"
        resizable
        @ui-step=${args.onStep}
        @ui-hide=${args.onHide}
        @ui-resize-step=${args.onResizeStep}
      >
        <ui-tile heading="Revenue" subhead="This quarter">
          <ui-text variant="headline-md">48,200.00</ui-text>
        </ui-tile>
      </ui-tile-arrange>
    </ui-box>
  `,
  play: async ({ canvas, userEvent, args }) => {
    const grip = canvas.getByRole("button", { name: "Move Revenue" });
    await expect(grip).toHaveAttribute("aria-haspopup", "menu");
    grip.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(args.onStep).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { to: "later" } }));
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onStep).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { to: "earlier" } }));
    await userEvent.keyboard("{Delete}");
    await expect(args.onHide).toHaveBeenCalledOnce();
    canvas.getByRole("button", { name: "Resize Revenue" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onResizeStep).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { span: 1, rows: 0 } }));
    await userEvent.keyboard("{ArrowLeft}");
    await expect(args.onResizeStep).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { span: -1, rows: 0 } }),
    );
  },
});

export const Header = meta.story({
  name: "Header",
  parameters: {
    docs: {
      description: { story: "A dashboard tile: heading, an optional count badge and subhead, and trailing actions." },
    },
  },
  render: () => html`
    <ui-box width="80">
      <ui-tile heading="Revenue" subhead="This quarter">
        <ui-text variant="headline-md">48,200.00</ui-text>
      </ui-tile>
    </ui-box>
    <ui-box width="80">
      <ui-tile heading="Overdue invoices" .count=${3} count-tone="error">
        <ui-icon-button slot="trailing" icon="filter" label="Filter" size="xs"></ui-icon-button>
        <ui-text variant="body-md">Three invoices are more than 30 days late.</ui-text>
      </ui-tile>
    </ui-box>
    <ui-box width="80">
      <ui-tile heading="New leads" .count=${12} count-tone="primary" subhead="Since Monday">
        <ui-text variant="body-md">Most came from the pricing page.</ui-text>
      </ui-tile>
    </ui-box>
  `,
});

export const Emphasis = meta.story({
  name: "Emphasis",
  render: () => html`
    <ui-box width="80">
      <ui-tile heading="Default" subhead="The outlined card surface">
        <ui-text variant="body-md">Plain dashboard content.</ui-text>
      </ui-tile>
    </ui-box>
    <ui-box width="80">
      <ui-tile heading="Inverse" emphasis="inverse" subhead="Dark on light, light on dark">
        <ui-text variant="body-md">Draws the eye to one figure on a board.</ui-text>
      </ui-tile>
    </ui-box>
    <ui-box width="80">
      <ui-tile heading="Tinted" emphasis="tinted" subhead="A primary-tinted surface">
        <ui-text variant="body-md">A softer highlight than inverse.</ui-text>
      </ui-tile>
    </ui-box>
  `,
});

export const LoadingAndBare = meta.story({
  name: "Loading and bare",
  parameters: {
    docs: {
      description: {
        story:
          "While loading the content is hidden behind a skeleton and marked aria-busy; a bare tile drops the card around it.",
      },
    },
  },
  render: () => html`
    <ui-box width="80">
      <ui-tile heading="Pipeline" loading>
        <ui-text variant="body-md">Hidden until loading ends.</ui-text>
      </ui-tile>
    </ui-box>
    <ui-box width="80">
      <ui-tile bare>
        <ui-text variant="title-md">Bare tile</ui-text>
        <ui-text variant="body-md">No surface, heading or padding of its own.</ui-text>
      </ui-tile>
    </ui-box>
  `,
});

export const Overflow = meta.story({
  name: "Overflow",
  parameters: {
    docs: {
      description: {
        story:
          "In a fixed height, overflowing content fades out behind a Show all button; with scrolls it scrolls instead.",
      },
    },
  },
  render: () => html`
    <ui-box width="80" height="64">
      <ui-tile heading="Open invoices" .count=${invoices.length}>${list()}</ui-tile>
    </ui-box>
    <ui-box width="80" height="64">
      <ui-tile heading="Open invoices, scrolling" scrolls>${list()}</ui-tile>
    </ui-box>
  `,
  play: async ({ canvas }) => {
    const region = await canvas.findByRole("region", { name: "Open invoices, scrolling" });
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
    region.focus();
    await expect(region).toHaveFocus();
    await expect(canvas.queryByRole("region", { name: "Open invoices" })).toBeNull();
  },
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: {
    docs: {
      description: {
        story: "Outside a board, size sets the tile's width in tiles: s is 6, m is 12, l is 18, full fills.",
      },
    },
  },
  render: () => html`
    <ui-tile size="s" heading="Small"><ui-text variant="body-md">6 tiles wide.</ui-text></ui-tile>
    <ui-tile size="m" heading="Medium"><ui-text variant="body-md">12 tiles wide.</ui-text></ui-tile>
    <ui-tile size="full" heading="Full"><ui-text variant="body-md">The whole row.</ui-text></ui-tile>
  `,
  play: async ({ canvas }) => {
    const width = (name: string) =>
      canvas.getByRole("heading", { name }).closest<HTMLElement>("[data-tile-root]")!.getBoundingClientRect().width;
    const tileW = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.3125;
    await expect(Math.round(width("Small"))).toBe(Math.round(6 * tileW));
    await expect(width("Medium")).toBeGreaterThan(width("Small"));
    await expect(width("Full")).toBeGreaterThanOrEqual(width("Medium"));
  },
});

export const Arrangeable = meta.story({
  name: "Arrangeable",
  parameters: {
    docs: {
      description: {
        story:
          "On a board each tile sits in a tile-arrange: drag or arrow-key the grip at the top to move it, press it for a Remove menu, and drag the corner to resize.",
      },
    },
  },
  render: () => html`
    <ui-box width="80">
      <ui-tile-arrange label="Revenue">
        <ui-tile heading="Revenue" subhead="This quarter">
          <ui-text variant="headline-md">48,200.00</ui-text>
        </ui-tile>
      </ui-tile-arrange>
    </ui-box>
    <ui-box width="80">
      <ui-tile-arrange label="New leads" resizable>
        <ui-tile heading="New leads" .count=${12} count-tone="primary">
          <ui-text variant="body-md">Hover the tile to see its grip and resize corner.</ui-text>
        </ui-tile>
      </ui-tile-arrange>
    </ui-box>
  `,
});

const press = (el: Element, type: string, x: number, y: number, init: PointerEventInit = {}) =>
  el.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 5,
      button: 0,
      isPrimary: true,
      ...init,
    }),
  );

const listen = (el: Element, type: string) => {
  const heard = fn();
  el.addEventListener(type, (e) => heard((e as CustomEvent).detail));
  return heard;
};

const keyOn = (el: Element, key: string) => {
  const e = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  el.dispatchEvent(e);
  return e.defaultPrevented;
};

const arranged = (label = "Revenue") => html`
  <ui-box width="80">
    <ui-tile-arrange label=${label} resizable>
      <ui-tile heading="Revenue" subhead="This quarter">
        <ui-text variant="headline-md">48,200.00</ui-text>
      </ui-tile>
    </ui-tile-arrange>
  </ui-box>
`;

export const ShowAllAndLess = meta.story({
  name: "Show all and less",
  parameters: {
    docs: {
      description: {
        story:
          "Show all opens an overflowing tile to its full height and asks its board for the rows; Show less gives them back.",
      },
    },
  },
  render: () => html`
    <ui-box width="80" height="64">
      <ui-tile heading="Open invoices" .count=${invoices.length}>${list()}</ui-tile>
    </ui-box>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const tile = canvasElement.querySelector("ui-tile")!;
    const rows = listen(tile, "ui-tile-rows");
    const all = await canvas.findByRole("button", { name: "Show all" });
    await expect(all).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(all);
    const less = await canvas.findByRole("button", { name: "Show less" });
    await expect(less).toHaveAttribute("aria-expanded", "true");
    const opened = rows.mock.calls[0]![0] as { rows: number };
    await expect(Number.isInteger(opened.rows) && opened.rows > 0).toBe(true);
    await expect(canvasElement.querySelector("[data-tile-body]")).not.toHaveClass("grow");
    await userEvent.click(less);
    await expect(rows).toHaveBeenLastCalledWith({ rows: null });
    await expect(await canvas.findByRole("button", { name: "Show all" })).toHaveAttribute("aria-expanded", "false");
    const root = document.documentElement;
    const size = root.style.fontSize;
    root.style.fontSize = "0px";
    try {
      await userEvent.click(canvas.getByRole("button", { name: "Show all" }));
      const zero = rows.mock.calls.at(-1)![0] as { rows: number };
      await expect(Number.isFinite(zero.rows) && zero.rows > 0).toBe(true);
    } finally {
      root.style.fontSize = size;
    }
  },
});

export const HeaderVariants = meta.story({
  name: "Header variants",
  parameters: {
    docs: {
      description: {
        story:
          "A header shows for a heading, a count or trailing actions alone; rich headings and subheads render as given.",
      },
    },
  },
  render: () => html`
    <ui-box width="80">
      <ui-tile data-only="trailing">
        <ui-icon-button slot="trailing" icon="filter" label="Filter" size="xs"></ui-icon-button>
        <ui-text variant="body-md">Trailing only.</ui-text>
      </ui-tile>
    </ui-box>
    <ui-box width="80">
      <ui-tile data-only="count" .count=${0}><ui-text variant="body-md">Count only.</ui-text></ui-tile>
    </ui-box>
    <ui-box width="80" height="48">
      <ui-tile
        data-only="rich"
        scrolls
        .heading=${html`<span>Rich <em>heading</em></span>`}
        .subhead=${html`<span>Rich subhead</span>`}
        >${list()}</ui-tile
      >
    </ui-box>
    <ui-box width="80">
      <ui-tile bare kind="chart"><ui-text variant="body-md">Bare chart.</ui-text></ui-tile>
    </ui-box>
    <ui-box width="80">
      <ui-tile data-only="plain"><ui-text variant="body-md">No header.</ui-text></ui-tile>
    </ui-box>
  `,
  play: async ({ canvas, canvasElement }) => {
    const only = (name: string) => canvasElement.querySelector<HTMLElement>(`[data-only="${name}"]`)!;
    await expect(only("trailing").querySelector("h2")).toBeNull();
    await expect(canvas.getByRole("button", { name: "Filter" })).toBeVisible();
    await expect(only("count").querySelector("h2")).toBeNull();
    await expect(only("count")).toHaveTextContent("0");
    await expect(canvas.getByRole("heading", { level: 2, name: "Rich heading" })).toBeVisible();
    const sub = canvas.getByText("Rich subhead").closest("p")!;
    await expect(sub).not.toHaveAttribute("title");
    const body = only("rich").querySelector<HTMLElement>("[data-tile-body]")!;
    await waitFor(() => expect(body).toHaveAttribute("tabindex", "0"));
    await expect(body).not.toHaveAttribute("role");
    await expect(canvas.queryByRole("button", { name: "Show all" })).toBeNull();
    await expect(canvas.getByText("Bare chart.").closest("[data-tile-root]")).not.toHaveClass("card");
    await expect(only("plain").querySelector(".card-header, h2, .badge")).toBeNull();
  },
});

export const DragToMove = meta.story({
  name: "Drag to move",
  parameters: {
    docs: {
      description: {
        story:
          "Dragging the grip past a few pixels reports start, move and end; Escape, a lost capture or leaving the page cancels.",
      },
    },
  },
  render: () => arranged(),
  play: async ({ canvas, canvasElement }) => {
    const arrange = canvasElement.querySelector("ui-tile-arrange")!;
    const drags = listen(arrange, "ui-drag");
    const grip = canvas.getByRole("button", { name: "Move Revenue" });
    const box = grip.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    press(grip, "pointerdown", x, y, { button: 2 });
    press(grip, "pointerdown", x, y, { isPrimary: false });
    press(grip, "pointermove", x + 40, y);
    await expect(drags).not.toHaveBeenCalled();
    press(grip, "pointerdown", x, y);
    press(grip, "pointerdown", x + 9, y);
    press(grip, "pointermove", x + 2, y);
    press(grip, "pointermove", x + 40, y, { pointerId: 8 });
    await expect(drags).not.toHaveBeenCalled();
    press(grip, "pointermove", x + 30, y + 10);
    await expect(drags).toHaveBeenNthCalledWith(1, { phase: "start", x, y, dx: 0, dy: 0 });
    await expect(drags).toHaveBeenNthCalledWith(2, { phase: "move", x: x + 30, y: y + 10, dx: 30, dy: 10 });
    await expect(grip).toHaveAttribute("data-dragging");
    await waitFor(() => expect(arrange.querySelector(":scope > div")).toHaveClass("z-20"));
    press(grip, "pointerup", x + 30, y + 10, { pointerId: 8 });
    await expect(grip).toHaveAttribute("data-dragging");
    press(grip, "pointerup", x + 35, y + 10);
    await expect(drags).toHaveBeenLastCalledWith({ phase: "end", x: x + 35, y: y + 10, dx: 35, dy: 10 });
    await expect(grip).not.toHaveAttribute("data-dragging");
    press(grip, "pointerdown", x, y);
    press(grip, "pointermove", x, y + 20);
    await expect(keyOn(window as unknown as Element, "a")).toBe(false);
    await expect(grip).toHaveAttribute("data-dragging");
    const escape = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    window.dispatchEvent(escape);
    await expect(escape.defaultPrevented).toBe(true);
    await expect(drags).toHaveBeenLastCalledWith({ phase: "cancel", x, y: y + 20, dx: 0, dy: 20 });
    await expect(grip).not.toHaveAttribute("data-dragging");
    press(grip, "pointerdown", x, y);
    press(grip, "pointermove", x - 20, y);
    press(grip, "lostpointercapture", x - 20, y);
    await expect(drags).toHaveBeenLastCalledWith({ phase: "cancel", x: x - 20, y, dx: -20, dy: 0 });
    const calls = drags.mock.calls.length;
    press(grip, "pointerdown", x, y);
    press(grip, "pointercancel", x, y);
    await expect(drags).toHaveBeenCalledTimes(calls);
    press(grip, "pointerdown", x, y);
    press(grip, "pointermove", x, y - 25);
    arrange.remove();
    await expect(drags).toHaveBeenLastCalledWith({ phase: "cancel", x, y: y - 25, dx: 0, dy: -25 });
  },
});

export const PressForMenu = meta.story({
  name: "Press for menu",
  parameters: {
    docs: {
      description: {
        story:
          "Pressing the grip without dragging focuses it and opens a Remove menu; Enter toggles the menu from the keyboard.",
      },
    },
  },
  render: (args) => html`
    <ui-box width="80">
      <ui-tile-arrange resizable @ui-hide=${args.onHide}>
        <ui-tile heading="Unnamed"><ui-text variant="body-md">No label.</ui-text></ui-tile>
      </ui-tile-arrange>
    </ui-box>
  `,
  play: async ({ canvas, canvasElement, args }) => {
    const grip = canvas.getByRole("button", { name: "Move" });
    await expect(canvas.getByRole("button", { name: "Resize" })).toBeInTheDocument();
    const menu = canvasElement.querySelector<HTMLElement>("[popover]")!;
    grip.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await expect(menu.matches(":popover-open")).toBe(false);
    const r = grip.getBoundingClientRect();
    press(grip, "pointerdown", r.left + 2, r.top + 2);
    press(grip, "pointerup", r.left + 2, r.top + 2);
    await expect(grip).toHaveFocus();
    grip.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await expect(menu.matches(":popover-open")).toBe(true);
    press(grip, "pointerdown", r.left + 2, r.top + 2);
    press(grip, "pointerup", r.left + 2, r.top + 2);
    grip.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await expect(menu.matches(":popover-open")).toBe(true);
    grip.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
    await expect(menu.matches(":popover-open")).toBe(false);
    grip.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
    await expect(menu.matches(":popover-open")).toBe(true);
    const remove = await canvas.findByRole("menuitem", { name: "Remove" });
    remove.click();
    await expect(menu.matches(":popover-open")).toBe(false);
    await expect(args.onHide).toHaveBeenCalledOnce();
  },
});

export const DragToResize = meta.story({
  name: "Drag to resize",
  parameters: {
    docs: { description: { story: "The corner reports how far it was dragged, mirrored right to left." } },
  },
  render: () =>
    html`${arranged()}
      <div dir="rtl">${arranged("Leads")}</div>`,
  play: async ({ canvas, canvasElement }) => {
    const [ltr, rtl] = [...canvasElement.querySelectorAll("ui-tile-arrange")];
    const grows = listen(ltr!, "ui-resize");
    const corner = canvas.getByRole("button", { name: "Resize Revenue" });
    const r = corner.getBoundingClientRect();
    press(corner, "pointerdown", r.left, r.top);
    press(corner, "pointermove", r.left + 40, r.top + 20);
    press(corner, "pointerup", r.left + 40, r.top + 20);
    await expect(grows).toHaveBeenLastCalledWith({ phase: "end", x: r.left + 40, y: r.top + 20, dx: 40, dy: 20 });
    press(corner, "pointerdown", r.left, r.top);
    press(corner, "pointerup", r.left, r.top);
    await expect(corner).toHaveFocus();
    const grip = canvas.getByRole("button", { name: "Move Revenue" });
    grip.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await expect(ltr!.querySelector("[popover]")!.matches(":popover-open")).toBe(false);
    press(corner, "pointerdown", r.left, r.top);
    press(corner, "pointermove", r.left + 10, r.top);
    press(corner, "pointercancel", r.left + 10, r.top);
    await expect(grows).toHaveBeenLastCalledWith({ phase: "cancel", x: r.left + 10, y: r.top, dx: 10, dy: 0 });
    press(corner, "pointerdown", r.left, r.top);
    press(corner, "pointermove", r.left, r.top + 10);
    press(corner, "lostpointercapture", r.left, r.top + 10);
    await expect(grows).toHaveBeenLastCalledWith({ phase: "cancel", x: r.left, y: r.top + 10, dx: 0, dy: 10 });
    await expect(corner).not.toHaveAttribute("data-dragging");
    const mirrored = listen(rtl!, "ui-resize");
    const back = canvas.getByRole("button", { name: "Resize Leads" });
    const b = back.getBoundingClientRect();
    press(back, "pointerdown", b.left, b.top);
    press(back, "pointermove", b.left - 40, b.top);
    press(back, "pointerup", b.left - 40, b.top);
    await expect(mirrored).toHaveBeenLastCalledWith({ phase: "end", x: b.left - 40, y: b.top, dx: 40, dy: 0 });
  },
});

export const AutoScroll = meta.story({
  name: "Auto scroll",
  parameters: {
    docs: {
      description: {
        story: "Dragging near the top or bottom edge of a scrolling container scrolls it and keeps reporting.",
      },
    },
  },
  render: () => html`
    <ui-box width="80" height="64" overflow="auto" label="Board">
      <ui-box height="32"></ui-box>
      ${arranged()}
      <ui-box height="96"></ui-box>
    </ui-box>
  `,
  play: async ({ canvas, canvasElement }) => {
    const scroller = canvas.getByRole("region", { name: "Board" });
    const arrange = canvasElement.querySelector("ui-tile-arrange")!;
    const drags = listen(arrange, "ui-drag");
    const grip = canvas.getByRole("button", { name: "Move Revenue" });
    const g = grip.getBoundingClientRect();
    const s = scroller.getBoundingClientRect();
    press(grip, "pointerdown", g.left, g.top);
    press(grip, "pointermove", g.left, s.top + s.height / 2);
    const moved = drags.mock.calls.length;
    const t0 = Number(document.timeline.currentTime);
    await waitFor(() => expect(Number(document.timeline.currentTime)).toBeGreaterThan(t0 + 100));
    await expect(scroller.scrollTop).toBe(0);
    await expect(drags).toHaveBeenCalledTimes(moved);
    press(grip, "pointermove", g.left, s.bottom - 4);
    await waitFor(() => expect(scroller.scrollTop).toBeGreaterThan(0));
    const scrolledMoves = drags.mock.calls.filter(([d]) => (d as { phase: string }).phase === "move").length;
    await expect(scrolledMoves).toBeGreaterThan(2);
    await waitFor(() => expect(scroller.scrollTop).toBe(scroller.scrollHeight - scroller.clientHeight), {
      timeout: 3000,
    });
    press(grip, "pointermove", g.left, s.top + 4);
    await waitFor(() => expect(scroller.scrollTop).toBe(0), { timeout: 3000 });
    press(grip, "pointerup", g.left, s.top + 4);
    await expect(drags).toHaveBeenLastCalledWith(expect.objectContaining({ phase: "end" }));
  },
});

export const PageAutoScroll = meta.story({
  name: "Page auto scroll",
  parameters: { docs: { description: { story: "Outside a scrolling container the page itself is the scroller." } } },
  render: () => arranged(),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "Move Revenue" })).toBeInTheDocument();
    const loose = document.createElement("ui-tile-arrange");
    loose.label = "Loose";
    document.documentElement.append(loose);
    try {
      await loose.updateComplete;
      const drags = listen(loose, "ui-drag");
      const grip = loose.querySelector<HTMLElement>("[data-grip]")!;
      press(grip, "pointerdown", 10, 100);
      press(grip, "pointermove", 10, innerHeight - 2);
      await expect(drags).toHaveBeenCalledTimes(2);
      const t0 = Number(document.timeline.currentTime);
      await waitFor(() => expect(Number(document.timeline.currentTime)).toBeGreaterThan(t0 + 100));
      await expect(grip).toHaveAttribute("data-dragging");
      press(grip, "pointermove", 10, 2);
      press(grip, "pointerup", 10, 2);
      await expect(drags).toHaveBeenLastCalledWith(expect.objectContaining({ phase: "end", y: 2 }));
    } finally {
      loose.remove();
    }
    const host = document.createElement("div");
    canvasElement.append(host);
    const root = host.attachShadow({ mode: "open" });
    const inner = document.createElement("ui-tile-arrange");
    inner.label = "Shadowed";
    root.append(inner);
    await inner.updateComplete;
    const shadowGrip = root.querySelector<HTMLElement>("[data-grip]")!;
    const shadowDrags = listen(inner, "ui-drag");
    press(shadowGrip, "pointerdown", 10, 10);
    press(shadowGrip, "pointermove", 10, 40);
    press(shadowGrip, "pointerup", 10, 40);
    await expect(shadowDrags).toHaveBeenLastCalledWith({ phase: "end", x: 10, y: 40, dx: 0, dy: 30 });
    host.remove();
  },
});

export const KeysAndLift = meta.story({
  name: "Keys and lift",
  parameters: {
    docs: {
      description: {
        story:
          "Keys follow reading direction, Home steps to the start, and a tile asking to lift rises under the pointer.",
      },
    },
  },
  render: (args) => html`
    <div dir="rtl">
      <ui-box width="80">
        <ui-tile-arrange
          label="Revenue"
          resizable
          @ui-step=${args.onStep}
          @ui-hide=${args.onHide}
          @ui-resize-step=${args.onResizeStep}
        >
          <ui-tile heading="Revenue" data-tile-lift><ui-text variant="headline-md">48,200.00</ui-text></ui-tile>
        </ui-tile-arrange>
      </ui-box>
    </div>
  `,
  play: async ({ canvas, canvasElement, args }) => {
    const grip = canvas.getByRole("button", { name: "Move Revenue" });
    const step = (key: string) => {
      keyOn(grip, key);
      return (args.onStep as ReturnType<typeof fn>).mock.calls.at(-1)?.[0]?.detail;
    };
    await expect(step("ArrowRight")).toEqual({ to: "earlier" });
    await expect(step("ArrowLeft")).toEqual({ to: "later" });
    await expect(step("Home")).toEqual({ to: "start" });
    await expect(keyOn(grip, "Backspace")).toBe(true);
    await expect(args.onHide).toHaveBeenCalledOnce();
    await expect(keyOn(grip, "x")).toBe(false);
    await expect(args.onStep).toHaveBeenCalledTimes(3);
    const corner = canvas.getByRole("button", { name: "Resize Revenue" });
    const resize = (key: string) => {
      keyOn(corner, key);
      return (args.onResizeStep as ReturnType<typeof fn>).mock.calls.at(-1)?.[0]?.detail;
    };
    await expect(resize("ArrowLeft")).toEqual({ span: 1, rows: 0 });
    await expect(resize("ArrowRight")).toEqual({ span: -1, rows: 0 });
    await expect(resize("ArrowDown")).toEqual({ span: 0, rows: 1 });
    await expect(resize("ArrowUp")).toEqual({ span: 0, rows: -1 });
    await expect(keyOn(corner, "Enter")).toBe(false);
    await expect(args.onResizeStep).toHaveBeenCalledTimes(4);
    const box = canvasElement.querySelector<HTMLElement>("ui-tile-arrange > div")!;
    box.dispatchEvent(new PointerEvent("pointerenter"));
    await waitFor(() => expect(box).toHaveClass("-translate-y-0.5"));
    box.dispatchEvent(new PointerEvent("pointerleave"));
    await waitFor(() => expect(box).not.toHaveClass("-translate-y-0.5"));
  },
});
