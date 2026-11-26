import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn, waitFor } from "storybook/test";
import "./kanban.ts";
import "./tag.ts";
import type { KanbanColumn, KanbanItem, UiKanban } from "./kanban.ts";

const deals: KanbanColumn[] = [
  {
    key: "new",
    label: "New",
    items: [
      {
        key: "d1",
        headline: "Office furniture refresh",
        supporting: "40 desks and chairs for the second floor",
        person: { name: "Account owner A", initials: "AO" },
      },
      { key: "d2", headline: "Fleet servicing contract", supporting: "12 vans, yearly plan" },
    ],
  },
  {
    key: "proposal",
    label: "Proposal",
    items: [
      {
        key: "d3",
        headline: "Warehouse shelving",
        supporting: "Quote sent, awaiting sign-off from facilities",
        person: { name: "Account owner B", initials: "BO" },
        trailing: html`<ui-tag tone="info" label="$18k"></ui-tag>`,
      },
    ],
  },
  {
    key: "negotiation",
    label: "Negotiation",
    items: [
      {
        key: "d4",
        headline: "Software licences renewal",
        supporting: "Asking for a three-year discount",
        trailing: html`<ui-tag tone="warning" label="$42k"></ui-tag>`,
      },
      {
        key: "d5",
        headline: "Packaging supplies",
        person: { name: "Account owner A", initials: "AO" },
        trailing: html`<ui-tag tone="info" label="$6k"></ui-tag>`,
      },
    ],
  },
  {
    key: "won",
    label: "Won",
    items: [
      {
        key: "d6",
        headline: "Printer leasing",
        supporting: "Signed for 24 months",
        trailing: html`<ui-tag tone="success" label="$9k"></ui-tag>`,
      },
    ],
  },
];

const linked: KanbanColumn[] = [
  {
    key: "todo",
    label: "To do",
    items: [
      { key: "t1", headline: "Reconcile February statements", href: "#t1", supporting: "Three accounts left" },
      { key: "t2", headline: "Chase overdue invoice INV-20391", href: "#t2" },
    ],
  },
  {
    key: "doing",
    label: "In progress",
    items: [{ key: "t3", headline: "Prepare quarterly sales report", href: "#t3", supporting: "Draft due Friday" }],
  },
  { key: "done", label: "Done", items: [] },
];

const move = (e: Event) => {
  const board = e.currentTarget as UiKanban;
  const { key, from, to } = (e as CustomEvent<{ key: string; from: string; to: string }>).detail;
  const card = board.columns.find((c) => c.key === from)?.items.find((i) => i.key === key);
  if (!card) return;
  board.columns = board.columns.map((c): KanbanColumn => {
    const items: KanbanItem[] = c.items.filter((i) => i.key !== key);
    return { ...c, items: c.key === to ? [...items, card] : items };
  });
};

const centre = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { clientX: r.left + r.width / 2, clientY: r.top + Math.min(r.height / 2, 24) };
};

const drag = async (card: Element, to: Element) => {
  const from = centre(card);
  const end = centre(to);
  await fireEvent.pointerDown(card, { button: 0, pointerId: 1, pointerType: "mouse", ...from });
  await fireEvent.pointerMove(window, {
    pointerId: 1,
    pointerType: "mouse",
    clientX: from.clientX + 10,
    clientY: from.clientY,
  });
  await fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", ...end });
};

const meta = preview.type<{ args: { onMove: (e: Event) => void } }>().meta({
  title: "Primitives/Data/Kanban",
  component: "ui-kanban",
  parameters: { canvas: "column" },
  args: {
    columns: deals,
    movable: true,
    label: "Deals",
    onMove: fn(),
  },
  argTypes: {
    columns: { control: "object" },
    movable: { control: "boolean" },
    label: { control: "text" },
    onMove: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-kanban
      .columns=${args.columns}
      ?movable=${args.movable}
      label=${ifDefined(args.label)}
      @ui-move=${(e: Event) => {
        args.onMove(e);
        move(e);
      }}
    ></ui-kanban>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the board; dragging a card to another column fires ui-move." },
    },
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("group", { name: "Deals" })).toBeInTheDocument();
    await expect(canvas.getByRole("region", { name: "New, 2 cards" })).toBeInTheDocument();
    const won = canvas.getByRole("region", { name: "Won, 1 card" });
    const card = canvas.getByText("Office furniture refresh").closest("[role=listitem]")!;
    await drag(card, won);
    await expect(await canvas.findByText(/^Dragging Office furniture refresh\./)).toBeInTheDocument();
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse", ...centre(won) });
    await expect(args.onMove).toHaveBeenCalledOnce();
    await expect(args.onMove).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { key: "d1", from: "new", to: "won" } }),
    );
    await expect(await canvas.findByText("Moved to Won.")).toBeInTheDocument();
    const after = await canvas.findByRole("region", { name: "Won, 2 cards" });
    await expect(after).toHaveTextContent("Office furniture refresh");
    await expect(canvas.getByRole("region", { name: "New, 1 card" })).not.toHaveTextContent("Office furniture refresh");
  },
});

export const EscapeCancels = meta.story({
  name: "Escape cancels a drag",
  play: async ({ canvas, userEvent, args }) => {
    const card = canvas.getByText("Fleet servicing contract").closest("[role=listitem]")!;
    await drag(card, canvas.getByRole("region", { name: "Proposal, 1 card" }));
    await expect(await canvas.findByText(/^Dragging Fleet servicing contract\./)).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(await canvas.findByText("Not moved.")).toBeInTheDocument();
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse" });
    await expect(args.onMove).not.toHaveBeenCalled();
    await expect(canvas.getByRole("region", { name: "New, 2 cards" })).toHaveTextContent("Fleet servicing contract");
  },
});

export const KeyboardMove = meta.story({
  name: "Move a card by keyboard",
  parameters: {
    docs: {
      description: {
        story:
          "A movable card is a tab stop: Space or Enter picks it up, the arrow keys choose a column, Space or Enter drops it and Escape cancels.",
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const card = canvas.getByText("Office furniture refresh").closest<HTMLElement>("[role=listitem]")!;
    await userEvent.tab();
    await expect(card).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(await canvas.findByText(/^Dragging Office furniture refresh\./)).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("Proposal, 2 cards")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    await expect(await canvas.findByText("Won, 2 cards")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(await canvas.findByText("Negotiation, 3 cards")).toBeInTheDocument();
    await expect(args.onMove).not.toHaveBeenCalled();
    await userEvent.keyboard("{Enter}");
    await expect(args.onMove).toHaveBeenCalledOnce();
    await expect(args.onMove).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { key: "d1", from: "new", to: "negotiation" } }),
    );
    await expect(await canvas.findByText("Moved to Negotiation.")).toBeInTheDocument();
    const moved = canvas.getByRole("region", { name: "Negotiation, 3 cards" });
    await expect(moved).toHaveTextContent("Office furniture refresh");
    await expect(canvas.getByText("Office furniture refresh").closest("[role=listitem]")).toHaveFocus();
    await userEvent.keyboard("{Enter}{ArrowLeft}{Escape}");
    await expect(await canvas.findByText("Not moved.")).toBeInTheDocument();
    await expect(args.onMove).toHaveBeenCalledOnce();
    await expect(canvas.getByRole("region", { name: "Negotiation, 3 cards" })).toHaveTextContent(
      "Office furniture refresh",
    );
  },
});

export const NotMovableByKeyboard = meta.story({
  name: "Not movable by keyboard",
  args: { movable: false },
  play: async ({ canvas, args }) => {
    const card = canvas.getByText("Printer leasing").closest("[role=listitem]")!;
    await expect(card).not.toHaveAttribute("tabindex");
    await expect(args.onMove).not.toHaveBeenCalled();
  },
});

export const DropOnOwnColumn = meta.story({
  name: "Drop on its own column",
  play: async ({ canvas, args }) => {
    const proposal = canvas.getByRole("region", { name: "Proposal, 1 card" });
    const card = canvas.getByText("Warehouse shelving").closest("[role=listitem]")!;
    await drag(card, proposal);
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse", ...centre(proposal) });
    await expect(await canvas.findByText("Not moved.")).toBeInTheDocument();
    await expect(args.onMove).not.toHaveBeenCalled();
  },
});

export const NotMovable = meta.story({
  name: "Not movable",
  args: { movable: false },
  play: async ({ canvas, args }) => {
    const card = canvas.getByText("Printer leasing").closest("[role=listitem]")!;
    await drag(card, canvas.getByRole("region", { name: "New, 2 cards" }));
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse" });
    await expect(args.onMove).not.toHaveBeenCalled();
    await expect(canvas.queryByText(/^Dragging/)).toBeNull();
    await expect(canvas.getByRole("region", { name: "Won, 1 card" })).toHaveTextContent("Printer leasing");
  },
});

export const LinkedArgs = meta.story({
  name: "Linked cards",
  args: { columns: linked, movable: false, label: "Finance tasks" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("region", { name: "Done, 0 cards" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Reconcile February statements" })).toHaveAttribute("href", "#t1");
    await expect(canvas.getAllByRole("link")).toHaveLength(3);
  },
});

export const NoColumns = meta.story({
  name: "No columns",
  args: { columns: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("region")).toHaveLength(0);
  },
});

export const Board = meta.story({
  name: "Board",
  parameters: {
    docs: { description: { story: "Each column is a labelled region with its card count in a badge." } },
    canvas: "column",
  },
  render: () => html`<ui-kanban label="Deals" .columns=${deals}></ui-kanban>`,
});

export const UnderPageHeading = meta.story({
  name: "Under the page heading",
  parameters: {
    docs: { description: { story: "Directly under a page's h1, the column headings are h2 (level 2)." } },
    canvas: "column",
  },
  render: () =>
    html`<h1>Deals</h1>
      <ui-kanban level="2" label="Deals" .columns=${deals}></ui-kanban>`,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(deals.length);
    await expect(canvas.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  },
});

export const Movable = meta.story({
  name: "Movable",
  parameters: {
    docs: {
      description: {
        story:
          "Drag a card to another column (on touch, press and hold first); Escape cancels. The board fires ui-move and the owner moves the card, as this story does.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-kanban movable label="Deals" .columns=${deals} @ui-move=${move}></ui-kanban>`,
});

export const LinkedCardsAndAnEmptyColumn = meta.story({
  name: "Linked cards and an empty column",
  parameters: {
    docs: { description: { story: "A card with an href is a link covering the whole card." } },
    canvas: "column",
  },
  render: () => html`<ui-kanban label="Finance tasks" .columns=${linked}></ui-kanban>`,
});

export const CustomColumnHeadings = meta.story({
  name: "Custom column headings",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-kanban
      label="Orders"
      .columns=${[
        {
          key: "hold",
          label: "On hold",
          heading: html`<ui-tag tone="warning" icon="warning" label="On hold"></ui-tag>`,
          items: [{ key: "o1", headline: "SO-88130", supporting: "Waiting for stock" }],
        },
        {
          key: "ship",
          label: "Shipped",
          heading: html`<ui-tag tone="success" icon="truck" label="Shipped"></ui-tag>`,
          items: [
            { key: "o2", headline: "SO-88124", supporting: "Delivered tomorrow" },
            { key: "o3", headline: "SO-88119", supporting: "In transit" },
          ],
        },
      ]}
    ></ui-kanban>
  `,
});

const cardOf = (canvasElement: HTMLElement, key: string) =>
  canvasElement.querySelector<HTMLElement>(`[data-kanban-card="${key}"]`)!;

const announced = (canvasElement: HTMLElement) => canvasElement.querySelector("ui-kanban [aria-live]")!;

export const ClickAfterDrag = meta.story({
  name: "Click after a drag",
  parameters: {
    docs: { description: { story: "The click that ends a pointer drag is swallowed; later clicks go through." } },
  },
  play: async ({ canvas, canvasElement, args }) => {
    const clicks = fn();
    canvasElement.addEventListener("click", clicks);
    const card = cardOf(canvasElement, "d2");
    const proposal = canvas.getByRole("region", { name: "Proposal, 1 card" });
    await drag(card, proposal);
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse", ...centre(proposal) });
    const dropped = cardOf(canvasElement, "d2");
    const swallowed = !dropped.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await expect(swallowed).toBe(true);
    await expect(clicks).not.toHaveBeenCalled();
    await expect(args.onMove).toHaveBeenCalledOnce();
    await waitFor(() => {
      cardOf(canvasElement, "d2").click();
      return expect(clicks).toHaveBeenCalled();
    });
    canvasElement.removeEventListener("click", clicks);
  },
});

export const PointerEdges = meta.story({
  name: "Pointer edges",
  parameters: {
    docs: {
      description: {
        story:
          "A press on a card's trailing content, a click without moving, a small wobble, another pointer and other keys never start or end a drag.",
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const live = announced(canvasElement);
    const shelving = cardOf(canvasElement, "d3");
    const tag = shelving.querySelector("[data-kanban-trailing] ui-tag")!;
    const won = canvas.getByRole("region", { name: "Won, 1 card" });
    await fireEvent.pointerDown(tag, { button: 0, pointerId: 1, pointerType: "mouse", ...centre(tag) });
    await fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", ...centre(won) });
    await expect(live).toHaveTextContent(/^$/);
    const card = cardOf(canvasElement, "d1");
    const at = centre(card);
    await fireEvent.pointerDown(card, { button: 2, pointerId: 1, pointerType: "mouse", ...at });
    await fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", ...centre(won) });
    await expect(live).toHaveTextContent(/^$/);
    await fireEvent.pointerDown(card, { button: 0, pointerId: 1, pointerType: "mouse", ...at });
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse", ...at });
    await expect(live).toHaveTextContent(/^$/);
    await fireEvent.pointerDown(card, { button: 0, pointerId: 1, pointerType: "mouse", ...at });
    await fireEvent.pointerMove(window, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: at.clientX + 3,
      clientY: at.clientY,
    });
    await fireEvent.pointerMove(window, { pointerId: 2, pointerType: "mouse", ...centre(won) });
    await expect(live).toHaveTextContent(/^$/);
    await fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", ...centre(won) });
    await expect(await canvas.findByText(/^Dragging Office furniture refresh\./)).toBeInTheDocument();
    card.focus();
    await userEvent.keyboard("{ArrowRight}a");
    await expect(live).toHaveTextContent(/^Dragging Office furniture refresh\./);
    await fireEvent.pointerUp(window, { pointerId: 2, pointerType: "mouse", ...centre(won) });
    await expect(args.onMove).not.toHaveBeenCalled();
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse", ...centre(won) });
    await expect(args.onMove).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { key: "d1", from: "new", to: "won" } }),
    );
    const other = cardOf(canvasElement, "d4");
    await fireEvent.pointerDown(other, { button: 0, pointerId: 1, pointerType: "mouse", ...centre(other) });
    await userEvent.keyboard("{Escape}");
    await fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", ...centre(won) });
    await expect(live).toHaveTextContent("Moved to Won.");
  },
});

export const TouchHold = meta.story({
  name: "Touch press and hold",
  parameters: {
    docs: {
      description: {
        story:
          "On touch a card lifts after a press and hold; moving first scrolls instead, and the page menu and touch scrolling are held back while lifted.",
      },
    },
  },
  play: async ({ canvas, canvasElement, args }) => {
    const live = announced(canvasElement);
    const fleet = cardOf(canvasElement, "d2");
    const start = centre(fleet);
    await fireEvent.pointerDown(fleet, { button: 0, pointerId: 5, pointerType: "touch", ...start });
    await fireEvent.pointerMove(window, {
      pointerId: 5,
      pointerType: "touch",
      clientX: start.clientX,
      clientY: start.clientY + 30,
    });
    await fireEvent.pointerUp(window, { pointerId: 5, pointerType: "touch" });
    const card = cardOf(canvasElement, "d1");
    const at = centre(card);
    await fireEvent.pointerDown(card, { button: 0, pointerId: 7, pointerType: "touch", ...at });
    await fireEvent.pointerMove(window, {
      pointerId: 7,
      pointerType: "touch",
      clientX: at.clientX + 3,
      clientY: at.clientY,
    });
    const early = new TouchEvent("touchmove", { cancelable: true });
    window.dispatchEvent(early);
    await expect(early.defaultPrevented).toBe(false);
    const menu = new MouseEvent("contextmenu", { cancelable: true });
    window.dispatchEvent(menu);
    await expect(menu.defaultPrevented).toBe(true);
    await waitFor(() => expect(live).toHaveTextContent(/^Dragging Office furniture refresh\./), { timeout: 3000 });
    await expect(live).not.toHaveTextContent("Fleet servicing contract");
    const lifted = new TouchEvent("touchmove", { cancelable: true });
    window.dispatchEvent(lifted);
    await expect(lifted.defaultPrevented).toBe(true);
    const proposal = canvas.getByRole("region", { name: "Proposal, 1 card" });
    await fireEvent.pointerMove(window, { pointerId: 7, pointerType: "touch", ...centre(proposal) });
    await fireEvent.pointerCancel(window, { pointerId: 7, pointerType: "touch" });
    await expect(await canvas.findByText("Not moved.")).toBeInTheDocument();
    await expect(args.onMove).not.toHaveBeenCalled();
    const after = new MouseEvent("contextmenu", { cancelable: true });
    window.dispatchEvent(after);
    await expect(after.defaultPrevented).toBe(false);
  },
});

export const PageEdgeWhileDragging = meta.story({
  name: "Page edge while dragging",
  parameters: {
    docs: {
      description: {
        story:
          "With no scrolling container the page scrolls instead; at the top of the page it can't go further, and the card keeps following the pointer.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const page = document.scrollingElement!;
    page.scrollTop = 0;
    const card = cardOf(canvasElement, "d2");
    const at = centre(card);
    await fireEvent.pointerDown(card, { button: 0, pointerId: 1, pointerType: "mouse", ...at });
    await fireEvent.pointerMove(window, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: at.clientX + 10,
      clientY: at.clientY,
    });
    await fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", clientX: at.clientX, clientY: 4 });
    const dragged = cardOf(canvasElement, "d2");
    await waitFor(() => expect(dragged.style.translate).not.toBe(""));
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await expect(page.scrollTop).toBe(0);
    await expect(dragged.getBoundingClientRect().top).toBeLessThan(at.clientY);
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse" });
    await expect(dragged.style.translate).toBe("");
  },
});

export const ScrollWhileDragging = meta.story({
  name: "Scroll while dragging",
  parameters: {
    docs: { description: { story: "Holding a card near the edge of a scrolling container scrolls it." } },
  },
  render: (args) => html`
    <div style="block-size: 240px; overflow: auto" data-testid="scroller">
      <ui-kanban .columns=${args.columns} movable label="Deals" @ui-move=${args.onMove}></ui-kanban>
      <div style="block-size: 600px"></div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector<HTMLElement>("[data-testid=scroller]")!;
    const r = box.getBoundingClientRect();
    const card = cardOf(canvasElement, "d2");
    const at = centre(card);
    await fireEvent.pointerDown(card, { button: 0, pointerId: 1, pointerType: "mouse", ...at });
    await fireEvent.pointerMove(window, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: at.clientX + 10,
      clientY: at.clientY,
    });
    await fireEvent.pointerMove(window, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: at.clientX,
      clientY: r.bottom - 8,
    });
    await waitFor(() => expect(box.scrollTop).toBeGreaterThan(40));
    const card2 = cardOf(canvasElement, "d2");
    await expect(card2.style.translate).not.toBe("");
    const middle = box.getBoundingClientRect();
    await fireEvent.pointerMove(window, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: at.clientX,
      clientY: (middle.top + middle.bottom) / 2,
    });
    const held = box.scrollTop;
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await expect(box.scrollTop).toBe(held);
    await fireEvent.pointerMove(window, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: at.clientX,
      clientY: box.getBoundingClientRect().top + 8,
    });
    await waitFor(() => expect(box.scrollTop).toBe(0));
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse" });
    await expect(card2.style.translate).toBe("");
  },
});

export const BoardEmptiedMidDrag = meta.story({
  name: "Board emptied mid-drag",
  parameters: {
    docs: { description: { story: "If the columns go away during a drag, the drop still reports the last column." } },
  },
  play: async ({ canvas, canvasElement, args }) => {
    const el = canvasElement.querySelector("ui-kanban")!;
    const card = cardOf(canvasElement, "d1");
    await drag(card, canvas.getByRole("region", { name: "Won, 1 card" }));
    el.columns = [];
    await el.updateComplete;
    await fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", clientX: 5, clientY: 5 });
    await fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse" });
    await expect(args.onMove).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { key: "d1", from: "new", to: "won" } }),
    );
    await expect(announced(canvasElement)).toHaveTextContent("Moved to won.");
  },
});

export const KeyboardEdges = meta.story({
  name: "Keyboard edges",
  parameters: {
    docs: {
      description: {
        story:
          "Modified keys and keys from inside a card do nothing; Up and Down move between columns, moving back reads the original count, and leaving the card cancels.",
      },
    },
  },
  args: {
    columns: [
      ...linked.slice(0, 2),
      {
        key: "done",
        label: "Done",
        items: [
          { key: "t4", headline: "Close January books", person: { name: "Ledger team" } },
          {
            key: "t5",
            headline: "File expense claims",
            person: { name: "Finance desk", src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=" },
          },
        ],
      },
    ],
    label: undefined,
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(canvas.getByRole("group")).not.toHaveAttribute("aria-label");
    await expect(cardOf(canvasElement, "t5").querySelector("img")).toHaveAttribute("alt", "");
    await expect(cardOf(canvasElement, "t4")).toHaveTextContent("Ledger team");
    const live = announced(canvasElement);
    const card = cardOf(canvasElement, "t1");
    card.focus();
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    await expect(live).toHaveTextContent(/^$/);
    await userEvent.keyboard("{ArrowRight}");
    await expect(live).toHaveTextContent(/^$/);
    canvas.getByRole("link", { name: "Reconcile February statements" }).focus();
    await userEvent.keyboard(" ");
    await expect(live).toHaveTextContent(/^$/);
    card.focus();
    await userEvent.keyboard("{Enter}");
    await expect(live).toHaveTextContent(/^Dragging Reconcile February statements\./);
    await userEvent.keyboard("{ArrowDown}");
    await expect(live).toHaveTextContent("In progress, 2 cards");
    await userEvent.keyboard("a");
    await expect(live).toHaveTextContent("In progress, 2 cards");
    await userEvent.keyboard("{ArrowUp}");
    await expect(live).toHaveTextContent("To do, 2 cards");
    await userEvent.keyboard("{ArrowUp}");
    await expect(live).toHaveTextContent("To do, 2 cards");
    await userEvent.keyboard("{ArrowDown}");
    card.blur();
    await expect(await canvas.findByText("Not moved.")).toBeInTheDocument();
    await expect(args.onMove).not.toHaveBeenCalled();
  },
});

export const LandedFades = meta.story({
  name: "Landed highlight fades",
  parameters: { docs: { description: { story: "A card that just landed is highlighted for a moment." } } },
  play: async ({ canvasElement, userEvent }) => {
    cardOf(canvasElement, "d6").focus();
    await userEvent.keyboard("{Enter}{ArrowLeft}{Enter}");
    await expect(announced(canvasElement)).toHaveTextContent("Moved to Negotiation.");
    await expect(cardOf(canvasElement, "d6")).toHaveClass("bg-primary-container");
    await waitFor(() => expect(cardOf(canvasElement, "d6")).not.toHaveClass("bg-primary-container"), {
      timeout: 3000,
    });
  },
});
