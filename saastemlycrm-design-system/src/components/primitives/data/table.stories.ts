import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn, waitFor } from "storybook/test";
import "./table.ts";
import "./tag.ts";
import "../layout/container.ts";
import "../actions/button.ts";
import type { TableColumn, TableGroup, TableRowData, UiTable } from "./table.ts";
import { COLUMN_MIN_WIDTH } from "../../../lib/base/columns.ts";
import { auditLayout } from "../../../lib/base/layout.ts";
import type { Tone } from "./tag.ts";

const money = new Intl.NumberFormat("en", { style: "currency", currency: "USD" });

interface Invoice extends TableRowData {
  number: string;
  customer: string;
  initials: string;
  region: string;
  issued: string;
  due: string;
  amount: number;
  status: "Paid" | "Due" | "Overdue" | "Draft";
}

const TONE: Record<Invoice["status"], Tone> = { Paid: "success", Due: "info", Overdue: "error", Draft: "neutral" };

const invoices: Invoice[] = [
  {
    number: "INV-20418",
    customer: "Account 1041",
    initials: "A1",
    region: "North",
    issued: "2026-03-03",
    due: "2026-04-02",
    amount: 1284,
    status: "Due",
  },
  {
    number: "INV-20417",
    customer: "Account 1052",
    initials: "A2",
    region: "South",
    issued: "2026-03-01",
    due: "2026-03-31",
    amount: 4950,
    status: "Paid",
  },
  {
    number: "INV-20416",
    customer: "Account 1077",
    initials: "A3",
    region: "West",
    issued: "2026-02-26",
    due: "2026-03-28",
    amount: 312.4,
    status: "Paid",
  },
  {
    number: "INV-20415",
    customer: "Account 1083",
    initials: "A4",
    region: "East",
    issued: "2026-01-19",
    due: "2026-02-18",
    amount: 2760,
    status: "Overdue",
  },
  {
    number: "INV-20414",
    customer: "Account 1090",
    initials: "A5",
    region: "North",
    issued: "2026-02-14",
    due: "2026-03-16",
    amount: 18420,
    status: "Due",
  },
  {
    number: "INV-20413",
    customer: "Account 1102",
    initials: "A6",
    region: "Central",
    issued: "2026-02-10",
    due: "2026-03-12",
    amount: 640,
    status: "Draft",
  },
];

const as = (r: TableRowData) => r as Invoice;

const columns: TableColumn[] = [
  {
    key: "number",
    label: "Invoice",
    render: (r) => html`<a href=${`#${as(r).number}`}>${as(r).number}</a>`,
    sortable: true,
  },
  {
    key: "customer",
    label: "Customer",
    avatar: (r) => ({ initials: as(r).initials }),
    supporting: (r) => `${as(r).region} region`,
    sortable: true,
  },
  { key: "issued", label: "Issued", sortable: true },
  {
    key: "due",
    label: "Due",
    sortable: true,
    supporting: (r) => (as(r).status === "Overdue" ? { text: "Over 30 days late", tone: "error" } : ""),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => html`<ui-tag tone=${TONE[as(r).status]} label=${as(r).status}></ui-tag>`,
  },
  { key: "amount", label: "Amount", align: "end", render: (r) => money.format(as(r).amount), sortable: true },
];

const plain: TableColumn[] = [
  { key: "number", label: "Invoice" },
  { key: "customer", label: "Customer" },
  { key: "region", label: "Region" },
  { key: "amount", label: "Amount", align: "end", render: (r) => money.format(as(r).amount) },
];

const sortRows = (e: Event) => {
  const table = e.currentTarget as UiTable;
  const keys = (e as CustomEvent<{ sort: string }>).detail.sort
    .split(",")
    .filter(Boolean)
    .map((s) => ({ key: s.replace(/^-/, "") as keyof Invoice, desc: s.startsWith("-") }));
  table.rows = [...invoices].sort((a, b) => {
    for (const { key, desc } of keys) {
      const x = a[key];
      const y = b[key];
      const d = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      if (d) return desc ? -d : d;
    }
    return 0;
  });
};

const select = (e: Event) => {
  (e.currentTarget as UiTable).selected = (e as CustomEvent<{ selected: number[] }>).detail.selected;
};

const groups: TableGroup[] = [
  { label: "Overdue", rows: invoices.filter((r) => r.status === "Overdue") },
  { label: "Due", rows: invoices.filter((r) => r.status === "Due") },
  { label: "Paid", rows: invoices.filter((r) => r.status === "Paid") },
];

const many: Invoice[] = Array.from({ length: 24 }, (_, i) => ({
  ...invoices[i % invoices.length]!,
  number: `INV-${20400 - i}`,
  amount: Math.round(400 + ((i * 2741) % 9000)),
}));

const products: TableRowData[] = [
  { sku: "SKU-1001", item: { text: "Standing desk", badge: "Bestseller" }, stock: 42, reorder: "Reorder" },
  { sku: "SKU-1002", item: { text: "Office chair" }, stock: 8, reorder: "Reorder" },
  { sku: "SKU-1003", item: { text: "Monitor arm", badge: "New" }, stock: 120, reorder: "Reorder" },
];

const sortedBy = (rows: TableRowData[] = [], sort = "") => {
  const keys = sort
    .split(",")
    .filter(Boolean)
    .map((s) => ({ key: s.replace(/^-/, ""), desc: s.startsWith("-") }));
  return [...rows].sort((a, b) => {
    for (const { key, desc } of keys) {
      const x = a[key];
      const y = b[key];
      const d = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      if (d) return desc ? -d : d;
    }
    return 0;
  });
};

const NOTE = "Split delivery requested before month end";
const noted: TableColumn[] = [...columns, { key: "note", label: "Note" }];
const notes: TableRowData[] = invoices.map((r) => ({ ...r, note: NOTE }));

const cellsOf = (row: Element) => [...row.querySelectorAll("th, td")].map((c) => c.textContent?.trim());

const firstCells = (rows: HTMLElement[]) => rows.slice(1).map((r) => r.querySelector("td")?.textContent?.trim());

type Handler = (e: CustomEvent) => void;

const meta = preview
  .type<{
    args: { onSort: Handler; onSelect: Handler; onRowClick: Handler; onCellAction: Handler; onColumns: Handler };
  }>()
  .meta({
    title: "Primitives/Data/Table",
    component: "ui-table",
    parameters: { canvas: "column" },
    args: {
      columns,
      rows: invoices,
      groups: [],
      zebra: false,
      pinRows: false,
      pinCols: false,
      size: "sm",
      density: "0",
      lines: "wrap",
      nowrap: false,
      surface: false,
      bordered: true,
      height: undefined,
      width: undefined,
      hover: false,
      activeRow: -1,
      indexColumn: false,
      selectable: false,
      footer: false,
      selected: [],
      sort: "",
      hiddenColumns: [],
      loading: false,
      skeletonRows: 5,
      minRows: 0,
      empty: "No invoices match these filters.",
      reorderable: false,
      resizable: false,
      columnOrder: [],
      columnWidths: {},
      onSort: fn(),
      onSelect: fn(),
      onRowClick: fn(),
      onCellAction: fn(),
      onColumns: fn(),
    },
    argTypes: {
      columns: { control: "object" },
      rows: { control: "object" },
      groups: { control: "object" },
      zebra: { control: "boolean" },
      pinRows: { control: "boolean" },
      pinCols: { control: "boolean" },
      size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
      density: { control: "inline-radio", options: ["0", "-1", "-2"] },
      lines: { control: "inline-radio", options: ["wrap", "one"] },
      nowrap: { control: "boolean" },
      surface: { control: "boolean" },
      bordered: { control: "boolean" },
      height: { control: "inline-radio", options: [undefined, "sm", "md", "lg"] },
      width: { control: "inline-radio", options: [undefined, "md", "lg", "full"] },
      hover: { control: "boolean" },
      activeRow: { control: { type: "number", min: -1, step: 1 } },
      indexColumn: { control: "boolean" },
      selectable: { control: "boolean" },
      footer: { control: "boolean" },
      selected: { control: "object" },
      sort: { control: "text", description: "Comma-separated keys; a leading minus sorts descending." },
      hiddenColumns: { control: "object" },
      loading: { control: "boolean" },
      skeletonRows: { control: { type: "number", min: 0, step: 1 } },
      minRows: { control: { type: "number", min: 0, step: 1 } },
      empty: { control: "text" },
      reorderable: { control: "boolean" },
      resizable: { control: "boolean" },
      columnOrder: { control: "object" },
      columnWidths: { control: "object" },
      onSort: { table: { category: "events" } },
      onSelect: { table: { category: "events" } },
      onRowClick: { table: { category: "events" } },
      onCellAction: { table: { category: "events" } },
      onColumns: { table: { category: "events" } },
    },
    render: (args) => html`
      <ui-table
        .columns=${args.columns}
        .rows=${sortedBy(args.rows, args.sort)}
        .groups=${args.groups}
        ?zebra=${args.zebra}
        ?pin-rows=${args.pinRows}
        ?pin-cols=${args.pinCols}
        size=${ifDefined(args.size)}
        density=${ifDefined(args.density)}
        lines=${ifDefined(args.lines)}
        ?nowrap=${args.nowrap}
        ?surface=${args.surface}
        ?bordered=${args.bordered}
        height=${ifDefined(args.height)}
        width=${ifDefined(args.width)}
        ?hover=${args.hover}
        active-row=${ifDefined(args.activeRow)}
        ?index-column=${args.indexColumn}
        ?selectable=${args.selectable}
        ?footer=${args.footer}
        .selected=${args.selected}
        sort=${ifDefined(args.sort)}
        .hiddenColumns=${args.hiddenColumns}
        ?loading=${args.loading}
        skeleton-rows=${ifDefined(args.skeletonRows)}
        min-rows=${ifDefined(args.minRows)}
        .empty=${args.empty}
        ?reorderable=${args.reorderable}
        ?resizable=${args.resizable}
        .columnOrder=${args.columnOrder}
        .columnWidths=${args.columnWidths}
        @ui-sort=${(e: CustomEvent<{ sort: string }>) => {
          args.onSort(e);
          (e.currentTarget as UiTable).rows = sortedBy(args.rows, e.detail.sort);
        }}
        @ui-select=${args.onSelect}
        @ui-row-click=${args.onRowClick}
        @ui-cell-action=${args.onCellAction}
        @ui-columns=${args.onColumns}
      ></ui-table>
    `,
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story:
          "Every control drives the table; header buttons sort by click or keyboard, Shift adds a key, and a row click fires ui-row-click.",
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("table")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(7);
    await expect(canvas.getAllByRole("columnheader").map((h) => h.textContent?.trim())).toEqual([
      "Invoice",
      "Customer",
      "Issued",
      "Due",
      "Status",
      "Amount",
    ]);
    await userEvent.click(canvas.getByText("West region"));
    await expect(args.onRowClick).toHaveBeenCalledOnce();
    await expect(args.onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ index: 2, row: invoices[2] }) }),
    );
    const amount = canvas.getByRole("columnheader", { name: "Amount" });
    await expect(amount).toHaveAttribute("aria-sort", "none");
    await userEvent.click(canvas.getByRole("button", { name: "Amount" }));
    await expect(args.onSort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { sort: "amount" } }));
    await expect(amount).toHaveAttribute("aria-sort", "ascending");
    await expect(firstCells(canvas.getAllByRole("row"))[0]).toBe("INV-20416");
    await userEvent.click(canvas.getByRole("button", { name: "Amount" }));
    await expect(amount).toHaveAttribute("aria-sort", "descending");
    await expect(args.onSort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { sort: "-amount" } }));
    await expect(firstCells(canvas.getAllByRole("row"))[0]).toBe("INV-20414");
    await userEvent.click(canvas.getByRole("button", { name: "Amount" }));
    await expect(amount).toHaveAttribute("aria-sort", "none");
    await expect(args.onSort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { sort: "" } }));
    canvas.getByRole("button", { name: "Issued" }).focus();
    await userEvent.keyboard("{Enter}");
    const issued = canvas.getByRole("columnheader", { name: "Issued" });
    await expect(issued).toHaveAttribute("aria-sort", "ascending");
    await expect(firstCells(canvas.getAllByRole("row"))[0]).toBe("INV-20415");
    await userEvent.keyboard(" ");
    await expect(issued).toHaveAttribute("aria-sort", "descending");
    await expect(firstCells(canvas.getAllByRole("row"))[0]).toBe("INV-20418");
    await userEvent.keyboard(" ");
    await userEvent.click(canvas.getByRole("button", { name: "Customer" }));
    await userEvent.keyboard("{Shift>}");
    await userEvent.click(canvas.getByRole("button", { name: "Amount" }));
    await userEvent.keyboard("{/Shift}");
    await expect(args.onSort).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { sort: "customer,amount" } }),
    );
    await expect(canvas.getByRole("columnheader", { name: /Customer/ })).toHaveAttribute("aria-sort", "ascending");
    await expect(canvas.getByRole("columnheader", { name: /Amount/ })).toHaveAttribute("aria-sort", "ascending");
    await expect(canvas.getByRole("button", { name: /Amount/ })).toHaveTextContent("2");
    await expect(args.onRowClick).toHaveBeenCalledOnce();
  },
});

export const SelectRows = meta.story({
  name: "Select rows",
  args: { selectable: true, columns: plain },
  play: async ({ canvas, userEvent, args }) => {
    const rows = () => canvas.getAllByRole("row").slice(1);
    await expect(rows().every((r) => r.getAttribute("aria-selected") === "false")).toBe(true);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select row 2" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { selected: [1] } }));
    await expect(rows()[1]).toHaveAttribute("aria-selected", "true");
    await expect(args.onRowClick).not.toHaveBeenCalled();
    canvas.getByRole("checkbox", { name: "Select row 4" }).focus();
    await userEvent.keyboard(" ");
    await expect(args.onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { selected: [1, 3] } }));
    await expect(rows()[3]).toHaveAttribute("aria-selected", "true");
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select row 2" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { selected: [3] } }));
    await expect(rows()[1]).toHaveAttribute("aria-selected", "false");
    const all = canvas.getByRole("checkbox", { name: "Select all" });
    await userEvent.click(all);
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { selected: [0, 1, 2, 3, 4, 5] } }),
    );
    await expect(all).toBeChecked();
    await expect(rows().every((r) => r.getAttribute("aria-selected") === "true")).toBe(true);
    await userEvent.click(all);
    await expect(args.onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { selected: [] } }));
    await expect(all).not.toBeChecked();
  },
});

export const ReorderAndResizeByKeyboard = meta.story({
  name: "Reorder and resize by keyboard",
  args: {
    reorderable: true,
    resizable: true,
    columns: columns.map((c) => (c.key === "number" ? { ...c, fixed: true } : c)),
    columnWidths: { customer: 220 },
  },
  play: async ({ canvas, userEvent, args }) => {
    const customer = canvas.getByRole("button", { name: "Customer" });
    customer.focus();
    await userEvent.keyboard("{Control>}{Shift>}{ArrowRight}{/Shift}{/Control}");
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: { order: ["number", "issued", "customer", "due", "status", "amount"], widths: { customer: 220 } },
      }),
    );
    await expect(await canvas.findByText("Customer moved to column 3 of 6")).toBeInTheDocument();
    await expect(canvas.getAllByRole("columnheader").map((h) => h.textContent?.trim())[2]).toBe("Customer");
    await expect(canvas.getByRole("button", { name: "Customer" })).toHaveFocus();
    canvas.getByRole("button", { name: "Issued" }).focus();
    await userEvent.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}");
    await expect(canvas.getAllByRole("columnheader").map((h) => h.textContent?.trim())[1]).toBe("Issued");
    const handle = canvas.getByRole("separator", { name: "Resize Customer column" });
    await expect(handle).toHaveAttribute("aria-valuenow", "220");
    const status = canvas.getByRole("separator", { name: "Resize Status column" });
    const th = canvas.getByRole("columnheader", { name: /^Status/ });
    await waitFor(() => expect(status).toHaveAttribute("aria-valuenow", String(Math.round(th.offsetWidth))));
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(handle).toHaveAttribute("aria-valuenow", "228");
    await expect(await canvas.findByText("Customer 228 pixels wide")).toBeInTheDocument();
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await expect(handle).toHaveAttribute("aria-valuenow", "180");
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ widths: { customer: 180 } }) }),
    );
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByText("Customer fits its content")).toBeInTheDocument();
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ widths: {} }) }),
    );
    const fitted = canvas.getAllByRole("columnheader")[2]!;
    await waitFor(() => expect(handle).toHaveAttribute("aria-valuenow", String(Math.round(fitted.offsetWidth))));
  },
});

export const CellAction = meta.story({
  name: "Cell action",
  args: {
    columns: [
      { key: "sku", label: "SKU", header: true },
      { key: "item", label: "Item", kind: "text-badge" },
      { key: "stock", label: "In stock", align: "end" },
      { key: "reorder", label: "Action", kind: "button" },
    ],
    rows: products,
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("SKU-1002").tagName).toBe("TH");
    await expect(canvas.getByText("Bestseller")).toBeInTheDocument();
    const buttons = canvas.getAllByRole("button", { name: "Reorder" });
    await userEvent.click(buttons[1]!);
    await expect(args.onCellAction).toHaveBeenCalledOnce();
    await expect(args.onCellAction).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { row: products[1], index: 1, key: "reorder" } }),
    );
    await expect(args.onRowClick).not.toHaveBeenCalled();
    buttons[2]!.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onCellAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ index: 2 }) }),
    );
  },
});

export const HiddenAndOrderedArgs = meta.story({
  name: "Hidden and ordered columns",
  args: { hiddenColumns: ["issued", "due"], columnOrder: ["customer", "number", "amount", "status"] },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("columnheader").map((h) => h.textContent?.trim())).toEqual([
      "Customer",
      "Invoice",
      "Amount",
      "Status",
    ]);
  },
});

export const LoadingSkeleton = meta.story({
  name: "Loading skeleton",
  args: { rows: [], loading: true, skeletonRows: 3, columns: plain, selectable: true, indexColumn: true },
  play: async ({ canvas }) => {
    const groups = canvas.getAllByRole("rowgroup");
    await expect(groups[1]).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getAllByRole("row")).toHaveLength(4);
    await expect(canvas.getAllByRole("columnheader")).toHaveLength(6);
    await expect(canvas.getAllByRole("cell")).toHaveLength(18);
  },
});

export const EmptyMessage = meta.story({
  name: "Empty message",
  args: { rows: [], columns: plain, minRows: 3 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("cell", { name: "No invoices match these filters." })).toHaveAttribute(
      "colspan",
      "4",
    );
    await expect(canvas.getAllByRole("row")).toHaveLength(2);
    await expect(canvas.getAllByRole("rowgroup")[1]).toHaveAttribute("aria-busy", "false");
  },
});

export const GroupedArgs = meta.story({
  name: "Grouped rows",
  args: { groups, rows: [], selectable: true },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("columnheader", { name: "Overdue" })).toHaveAttribute("colspan", "7");
    await expect(canvas.getByRole("columnheader", { name: "Paid" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("link")).toHaveLength(5);
    await expect(cellsOf(canvas.getAllByRole("row")[0]!)).toEqual([
      "",
      "Invoice",
      "Customer",
      "Issued",
      "Due",
      "Status",
      "Amount",
    ]);
    await userEvent.click(canvas.getByRole("button", { name: "Amount" }));
    await expect(args.onSort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { sort: "amount" } }));
    await expect(canvas.getByRole("columnheader", { name: "Amount" })).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select all" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { selected: [0, 1, 2, 3, 4] } }),
    );
    await expect(canvas.getByRole("checkbox", { name: "Select all" })).toBeChecked();
  },
});

export const Invoices = meta.story({
  name: "Invoices",
  parameters: {
    docs: {
      description: {
        story:
          "A link in the first cell makes the whole row clickable; other links and buttons in the row stay separately reachable.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-table .columns=${columns} .rows=${invoices}></ui-table>`,
});

export const Sorting = meta.story({
  name: "Sorting",
  parameters: {
    docs: {
      description: {
        story:
          "Header buttons cycle ascending, descending and off, and set aria-sort; Shift-click adds a second key. The table fires ui-sort and the owner sorts the rows, as this story does.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-table
      bordered
      sort="-amount"
      .columns=${columns}
      .rows=${[...invoices].sort((a, b) => b.amount - a.amount)}
      @ui-sort=${sortRows}
    ></ui-table>
  `,
});

export const ZebraAndSizes = meta.story({
  name: "Zebra and sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-table zebra size="xs" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
    <ui-table zebra size="sm" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
    <ui-table zebra size="md" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
    <ui-table zebra size="lg" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
  `,
});

export const Density = meta.story({
  name: "Density",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-table bordered density="0" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
    <ui-table bordered density="-1" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
    <ui-table bordered density="-2" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
  `,
});

export const SelectionIndexAndFooter = meta.story({
  name: "Selection, index and footer",
  parameters: {
    docs: {
      description: {
        story: "Row checkboxes and the select-all box fire ui-select; selected rows report aria-selected.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-table
      bordered
      selectable
      index-column
      footer
      .selected=${[1, 3]}
      .columns=${plain}
      .rows=${invoices}
      @ui-select=${select}
    ></ui-table>
  `,
  play: async ({ canvas }) => {
    const [head, foot] = canvas.getAllByRole("rowgroup").filter((g) => g.tagName !== "TBODY");
    await expect(head!.querySelectorAll("th")).toHaveLength(6);
    await expect(canvas.getByRole("columnheader", { name: "#" })).toBeInTheDocument();
    await expect(foot!.querySelectorAll("td")).toHaveLength(2);
    await expect(foot!.querySelectorAll("th")).toHaveLength(4);
  },
});

const layer = (row: Element) => getComputedStyle(row).backgroundImage;

export const ActiveAndHoverRows = meta.story({
  name: "Active and hover rows",
  parameters: {
    docs: { description: { story: "hover gives every body row a state layer; without it plain rows stay flat." } },
    canvas: "column",
  },
  render: () => html`
    <ui-table hover active-row="2" .columns=${plain} .rows=${invoices}></ui-table>
    <ui-table .columns=${plain} .rows=${invoices.slice(0, 2)}></ui-table>
  `,
  play: async ({ canvas }) => {
    const [hover, flat] = canvas.getAllByRole("table");
    const body = (t: HTMLElement) => [...t.querySelectorAll("tbody tr")];
    await expect(
      body(hover!)
        .map(layer)
        .every((l) => l.startsWith("linear-gradient")),
    ).toBe(true);
    await expect(body(flat!).map(layer)).toEqual(["none", "none"]);
  },
});

export const Groups = meta.story({
  name: "Groups",
  parameters: { canvas: "column" },
  render: () => html`<ui-table bordered .columns=${columns} .groups=${groups}></ui-table>`,
});

export const ScrollingWithPinnedHeader = meta.story({
  name: "Scrolling with pinned header",
  parameters: {
    docs: { description: { story: "A fixed height scrolls the body while pin-rows keeps the header in view." } },
    canvas: "column",
  },
  render: () => html`<ui-table bordered pin-rows height="sm" .columns=${columns} .rows=${many}></ui-table>`,
});

export const OneLinePerRow = meta.story({
  name: "One line per row",
  parameters: {
    docs: {
      description: {
        story: "lines one truncates cells to a single line and gives a cut-off cell its full text as a tooltip.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-table
      lines="one"
      .columns=${[...plain.slice(0, 2), { key: "note", label: "Note" }, ...plain.slice(3)]}
      .rows=${invoices.map((r) => ({
        ...r,
        note: "Split delivery requested: the first half before month end and the rest once backordered items are back in stock.",
      }))}
    ></ui-table>
    <ui-table lines="one" density="-2" .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
  `,
});

export const FixedWidths = meta.story({
  name: "Fixed widths",
  parameters: {
    docs: { description: { story: "width sets the table's own width; narrower containers still win." } },
    canvas: "column",
  },
  render: () => html`
    <div style="inline-size: 60rem">
      <ui-table bordered width="md" .columns=${noted} .rows=${notes}></ui-table>
      <ui-table bordered width="lg" .columns=${noted} .rows=${notes}></ui-table>
    </div>
    <div style="inline-size: 15rem"><ui-table bordered width="lg" .columns=${noted} .rows=${notes}></ui-table></div>
  `,
  play: async ({ canvasElement }) => {
    const [md, lg, narrow] = [...canvasElement.querySelectorAll("ui-table")].map(
      (t) => t.querySelector<HTMLElement>(":scope > div")!.getBoundingClientRect().width,
    );
    await expect(Math.round(md!)).toBe(320);
    await expect(Math.round(lg!)).toBe(384);
    await expect(Math.round(narrow!)).toBe(240);
  },
});

export const NoWrapping = meta.story({
  name: "No wrapping",
  parameters: {
    docs: {
      description: {
        story: "nowrap keeps every cell on one line and scrolls the table sideways when it runs out of room.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-table nowrap bordered width="md" .columns=${noted} .rows=${notes}></ui-table>
    <ui-table bordered width="md" .columns=${noted} .rows=${notes}></ui-table>
  `,
  play: async ({ canvas }) => {
    const lines = (el: HTMLElement) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
    };
    const cells = canvas.getAllByText(NOTE);
    await expect(cells).toHaveLength(notes.length * 2);
    await expect(lines(cells[0]!)).toBe(1);
    await expect(lines(cells[notes.length]!)).toBeGreaterThan(1);
  },
});

export const ReorderAndResizeColumns = meta.story({
  name: "Reorder and resize columns",
  parameters: {
    docs: {
      description: {
        story:
          "Drag a header to move it, or press Ctrl+Shift with an arrow on a sort button; drag or arrow the edge handle to resize, Enter or double-click fits it again.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-table
      bordered
      reorderable
      resizable
      .columns=${columns.map((c) => (c.key === "number" ? { ...c, fixed: true } : c))}
      .rows=${invoices}
      .columnWidths=${{ customer: 220 }}
    ></ui-table>
  `,
});

export const HiddenColumnsAndOrder = meta.story({
  name: "Hidden columns and order",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-table
      .columns=${columns}
      .rows=${invoices}
      .hiddenColumns=${["issued", "due"]}
      .columnOrder=${["customer", "number", "amount", "status"]}
    ></ui-table>
  `,
});

export const ReattachedKeepsWidths = meta.story({
  name: "Re-attached keeps measured widths",
  parameters: {
    docs: {
      description: {
        story:
          "Moving a resizable table out of the page and back measures its columns again; unchanged widths stay as they were.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-table resizable .columns=${columns} .rows=${invoices}></ui-table>`,
  play: async ({ canvasElement, canvas }) => {
    const el = canvasElement.querySelector("ui-table")!;
    const widths = () => canvas.getAllByRole("separator").map((h) => h.getAttribute("aria-valuenow"));
    await waitFor(() => expect(widths()).not.toContain(String(COLUMN_MIN_WIDTH)));
    const before = widths();
    const parent = el.parentElement!;
    el.remove();
    parent.append(el);
    el.requestUpdate();
    await el.updateComplete;
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await expect(widths()).toEqual(before);
  },
});

export const CellKinds = meta.story({
  name: "Cell kinds",
  parameters: {
    docs: {
      description: {
        story: "A button cell fires ui-cell-action with its row; a text-badge cell puts an outline tag under the text.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-table
      .columns=${[
        { key: "sku", label: "SKU", header: true },
        { key: "item", label: "Item", kind: "text-badge" },
        { key: "stock", label: "In stock", align: "end" },
        { key: "reorder", kind: "button" },
      ]}
      .rows=${products}
    ></ui-table>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("columnheader", { name: "reorder" })).toBeInTheDocument();
  },
});

export const Loading = meta.story({
  name: "Loading",
  parameters: {
    docs: {
      description: {
        story: "With no rows a loading table shows skeleton rows; with rows it dims them and marks the body busy.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-table loading skeleton-rows="3" .columns=${plain} .rows=${[]}></ui-table>
    <ui-table loading .columns=${plain} .rows=${invoices.slice(0, 3)}></ui-table>
  `,
});

export const Empty = meta.story({
  name: "Empty",
  parameters: {
    docs: { description: { story: "min-rows pads the body with blank rows so the table keeps its height." } },
    canvas: "column",
  },
  render: () => html`
    <ui-table bordered .columns=${plain} .rows=${[]} .empty=${"No invoices match these filters."}></ui-table>
    <ui-table bordered min-rows="5" .columns=${plain} .rows=${invoices.slice(0, 2)}></ui-table>
  `,
});

const headers = (root: HTMLElement) =>
  [...root.querySelectorAll("thead tr:first-child th")].map((h) => h.textContent?.trim());

const pointAt = (el: Element, share = 0.5) => {
  const r = el.getBoundingClientRect();
  return { clientX: r.left + r.width * share, clientY: r.top + r.height / 2 };
};

const thOf = (root: HTMLElement, key: string) => root.querySelector<HTMLElement>(`thead th[data-key="${key}"]`)!;

const down = (el: Element, at: { clientX: number; clientY: number }, extra: Record<string, unknown> = {}) =>
  fireEvent.pointerDown(el, { button: 0, pointerId: 1, pointerType: "mouse", ...at, ...extra });

const moveTo = (at: { clientX: number; clientY: number }, extra: Record<string, unknown> = {}) =>
  fireEvent.pointerMove(window, { pointerId: 1, pointerType: "mouse", ...at, ...extra });

const up = (extra: Record<string, unknown> = {}, type: "pointerUp" | "pointerCancel" = "pointerUp") =>
  fireEvent[type](window, { pointerId: 1, pointerType: "mouse", ...extra });

const longNote = {
  text: "Split delivery requested: the first half before month end and the rest once backordered items are back in stock.",
};

const fixedFirst = columns.map((c) => (c.key === "number" ? { ...c, fixed: true } : c));

export const DragColumns = meta.story({
  name: "Drag columns with a pointer",
  parameters: {
    docs: {
      description: {
        story:
          "Dragging a header sideways moves the column and marks where it will land; fixed columns, other buttons, small or vertical moves and Escape leave the order alone.",
      },
    },
  },
  args: { reorderable: true, columns: fixedFirst },
  play: async ({ canvas, canvasElement, args }) => {
    const el = canvasElement.querySelector("ui-table")!;
    const live = canvasElement.querySelector("ui-table [aria-live]")!;
    const order = () => headers(canvasElement);
    const start = order();
    await down(thOf(canvasElement, "number"), pointAt(thOf(canvasElement, "number")));
    await moveTo(pointAt(thOf(canvasElement, "due")));
    await up();
    await down(thOf(canvasElement, "customer"), pointAt(thOf(canvasElement, "customer")), { button: 2 });
    await moveTo(pointAt(thOf(canvasElement, "due")));
    await up();
    await expect(order()).toEqual(start);
    await expect(args.onColumns).not.toHaveBeenCalled();

    const from = pointAt(thOf(canvasElement, "customer"));
    await down(thOf(canvasElement, "customer"), from);
    await moveTo({ clientX: from.clientX + 3, clientY: from.clientY });
    await moveTo({ clientX: from.clientX + 8, clientY: from.clientY + 30 });
    await moveTo(pointAt(thOf(canvasElement, "amount")), { pointerId: 2 });
    await el.updateComplete;
    await expect(thOf(canvasElement, "customer").style.translate).toBe("");
    await moveTo(pointAt(thOf(canvasElement, "status"), 0.8));
    await el.updateComplete;
    await expect(thOf(canvasElement, "customer").style.translate).not.toBe("");
    await expect(thOf(canvasElement, "customer")).toHaveClass("cursor-grabbing");
    await expect(thOf(canvasElement, "amount").querySelector("span[style*=height]")).not.toBeNull();
    await down(thOf(canvasElement, "issued"), pointAt(thOf(canvasElement, "issued")), { pointerId: 3 });
    await fireEvent.keyDown(window, { key: "a" });
    await up({ pointerId: 2 });
    await expect(args.onColumns).not.toHaveBeenCalled();
    await up();
    const swallowed = !canvas
      .getByRole("button", { name: "Customer" })
      .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await expect(swallowed).toBe(true);
    await expect(args.onSort).not.toHaveBeenCalled();
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: { order: ["number", "issued", "due", "status", "customer", "amount"], widths: {} },
      }),
    );
    await el.updateComplete;
    await expect(live).toHaveTextContent("Customer moved to column 5 of 6");
    await expect(order()).toEqual(["Invoice", "Issued", "Due", "Status", "Customer", "Amount"]);

    await down(thOf(canvasElement, "amount"), pointAt(thOf(canvasElement, "amount")));
    await moveTo(pointAt(thOf(canvasElement, "issued"), 0.2));
    await el.updateComplete;
    await expect(thOf(canvasElement, "issued").querySelector("span[style*=height]")).not.toBeNull();
    await up();
    await el.updateComplete;
    await expect(live).toHaveTextContent("Amount moved to column 2 of 6");
    await expect(order()).toEqual(["Invoice", "Amount", "Issued", "Due", "Status", "Customer"]);
    await expect(args.onColumns).toHaveBeenCalledTimes(2);

    const issued = pointAt(thOf(canvasElement, "issued"));
    await down(thOf(canvasElement, "issued"), issued);
    await up();
    await expect(thOf(canvasElement, "issued").style.translate).toBe("");
    await down(thOf(canvasElement, "issued"), issued);
    await moveTo({ clientX: issued.clientX - 10, clientY: issued.clientY });
    await up();
    await down(thOf(canvasElement, "issued"), issued);
    await moveTo({ clientX: issued.clientX + 10, clientY: issued.clientY });
    await up();
    await expect(args.onColumns).toHaveBeenCalledTimes(2);

    await down(thOf(canvasElement, "due"), pointAt(thOf(canvasElement, "due")));
    await moveTo(pointAt(thOf(canvasElement, "customer"), 0.9));
    await el.updateComplete;
    await expect(thOf(canvasElement, "customer").querySelector("span[style*=height]")).not.toBeNull();
    await fireEvent.keyDown(window, { key: "Escape" });
    await up();
    await down(thOf(canvasElement, "status"), pointAt(thOf(canvasElement, "status")));
    await fireEvent.keyDown(window, { key: "Escape" });
    await moveTo(pointAt(thOf(canvasElement, "issued")));
    await down(thOf(canvasElement, "status"), pointAt(thOf(canvasElement, "status")));
    await moveTo(pointAt(thOf(canvasElement, "issued"), 0.1));
    await up({}, "pointerCancel");
    await down(thOf(canvasElement, "customer"), pointAt(thOf(canvasElement, "customer")));
    await moveTo(pointAt(thOf(canvasElement, "amount"), 0.2));
    el.hiddenColumns = ["customer"];
    await el.updateComplete;
    await up();
    await expect(args.onColumns).toHaveBeenCalledTimes(2);
    await expect(order()).toEqual(["Invoice", "Amount", "Issued", "Due", "Status"]);
  },
});

export const DragAutoScroll = meta.story({
  name: "Drag scrolls a wide table",
  parameters: {
    docs: { description: { story: "Holding a dragged header near the side of a scrolling table scrolls it." } },
  },
  args: { reorderable: true, nowrap: true, width: "md", columns: noted, rows: notes },
  play: async ({ canvasElement }) => {
    const wrap = canvasElement.querySelector<HTMLElement>("ui-table > div")!;
    const r = wrap.getBoundingClientRect();
    const th = thOf(canvasElement, "customer");
    const at = pointAt(th);
    await down(th, at);
    await moveTo({ clientX: at.clientX + 20, clientY: at.clientY });
    await moveTo({ clientX: r.right - 4, clientY: at.clientY });
    await waitFor(() => expect(wrap.scrollLeft).toBeGreaterThan(40));
    await moveTo({ clientX: r.left + r.width / 2, clientY: at.clientY });
    const held = wrap.scrollLeft;
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await expect(wrap.scrollLeft).toBe(held);
    await moveTo({ clientX: r.left + 4, clientY: at.clientY });
    await waitFor(() => expect(wrap.scrollLeft).toBe(0));
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await expect(wrap.scrollLeft).toBe(0);
    await fireEvent.keyDown(window, { key: "Escape" });
    await up();
  },
});

export const TouchHoldColumn = meta.story({
  name: "Touch press and hold a header",
  parameters: {
    docs: { description: { story: "On touch a header lifts after a press and hold; moving first cancels the hold." } },
  },
  args: { reorderable: true, columns: plain },
  play: async ({ canvasElement, args }) => {
    const el = canvasElement.querySelector("ui-table")!;
    const region = thOf(canvasElement, "region");
    const at = pointAt(region);
    await down(region, at, { pointerType: "touch", pointerId: 4 });
    await moveTo({ clientX: at.clientX, clientY: at.clientY + 20 }, { pointerType: "touch", pointerId: 4 });
    await up({ pointerType: "touch", pointerId: 4 });
    const customer = thOf(canvasElement, "customer");
    const from = pointAt(customer);
    await down(customer, from, { pointerType: "touch", pointerId: 5 });
    await moveTo({ clientX: from.clientX + 3, clientY: from.clientY }, { pointerType: "touch", pointerId: 5 });
    await waitFor(() => expect(thOf(canvasElement, "customer")).toHaveClass("cursor-grabbing"), { timeout: 3000 });
    await expect(thOf(canvasElement, "region")).not.toHaveClass("cursor-grabbing");
    await moveTo(pointAt(thOf(canvasElement, "amount"), 0.9), { pointerType: "touch", pointerId: 5 });
    await up({ pointerType: "touch", pointerId: 5 });
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { order: ["number", "region", "amount", "customer"], widths: {} } }),
    );
    await el.updateComplete;
    await expect(headers(canvasElement)).toEqual(["Invoice", "Region", "Amount", "Customer"]);
  },
});

export const ResizeWithPointer = meta.story({
  name: "Resize with a pointer",
  parameters: {
    docs: {
      description: {
        story:
          "Dragging a header's edge sets its width; a press without moving, another pointer and other keys change nothing, and a column without a text label is named by its key.",
      },
    },
  },
  args: {
    reorderable: true,
    resizable: true,
    columns: [...plain.slice(0, 3), { key: "amount", label: html`<em>Amount</em>`, align: "end" }],
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const el = canvasElement.querySelector("ui-table")!;
    const handle = canvas.getByRole("separator", { name: "Resize Customer column" });
    const th = thOf(canvasElement, "customer");
    const width = th.getBoundingClientRect().width;
    const at = pointAt(handle);
    await down(handle, at, { button: 2 });
    await moveTo({ clientX: at.clientX + 40, clientY: at.clientY });
    await up();
    await expect(args.onColumns).not.toHaveBeenCalled();
    await down(handle, at);
    await up();
    await expect(args.onColumns).not.toHaveBeenCalled();
    await down(handle, at);
    await moveTo({ clientX: at.clientX + 300, clientY: at.clientY }, { pointerId: 2 });
    await moveTo({ clientX: at.clientX + 40, clientY: at.clientY });
    await up({ pointerId: 2 });
    await expect(args.onColumns).not.toHaveBeenCalled();
    await waitFor(() => expect(el.columnWidths.customer).toBe(Math.round(width + 40)));
    await up();
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ widths: { customer: Math.round(width + 40) } }) }),
    );
    await expect(handle).toHaveAttribute("aria-valuenow", String(Math.round(width + 40)));
    const outside = fn();
    canvasElement.addEventListener("click", outside);
    await userEvent.click(handle);
    canvasElement.removeEventListener("click", outside);
    await expect(outside).not.toHaveBeenCalled();
    handle.focus();
    await userEvent.keyboard("a");
    await expect(handle).toHaveAttribute("aria-valuenow", String(Math.round(width + 40)));
    await userEvent.dblClick(handle);
    await expect(await canvas.findByText("Customer fits its content")).toBeInTheDocument();
    await expect(el.columnWidths).toEqual({});
    const calls = (args.onColumns as ReturnType<typeof fn>).mock.calls.length;
    await userEvent.keyboard("{Enter}");
    await userEvent.dblClick(handle);
    await expect((args.onColumns as ReturnType<typeof fn>).mock.calls.length).toBe(calls);
    const amount = canvas.getByRole("separator", { name: "Resize amount column" });
    amount.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText(/^amount \d+ pixels wide$/)).toBeInTheDocument();
  },
});

export const RightToLeftColumns = meta.story({
  name: "Right to left columns",
  parameters: {
    docs: {
      description: {
        story: "In right-to-left, dragging, resizing and the arrow keys all follow the mirrored columns.",
      },
    },
  },
  render: (args) => html`
    <div dir="rtl">
      <ui-table reorderable resizable .columns=${fixedFirst} .rows=${invoices} @ui-columns=${args.onColumns}></ui-table>
    </div>
  `,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const el = canvasElement.querySelector("ui-table")!;
    canvas.getByRole("button", { name: "Issued" }).focus();
    await userEvent.keyboard("{Control>}{Shift>}{ArrowRight}{/Shift}{/Control}");
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: { order: ["number", "issued", "customer", "due", "status", "amount"], widths: {} },
      }),
    );
    await el.updateComplete;
    canvas.getByRole("button", { name: "Issued" }).focus();
    await userEvent.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}");
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: { order: ["number", "customer", "issued", "due", "status", "amount"], widths: {} },
      }),
    );
    await el.updateComplete;
    const customer = thOf(canvasElement, "customer");
    const from = pointAt(customer);
    await down(customer, from);
    await moveTo({ clientX: from.clientX - 10, clientY: from.clientY });
    await moveTo(pointAt(thOf(canvasElement, "due"), 0.1));
    await up();
    await expect(args.onColumns).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: { order: ["number", "issued", "due", "customer", "status", "amount"], widths: {} },
      }),
    );
    await el.updateComplete;
    const handle = canvas.getByRole("separator", { name: "Resize Status column" });
    const width = Math.round(thOf(canvasElement, "status").getBoundingClientRect().width);
    const at = pointAt(handle);
    await down(handle, at);
    await moveTo({ clientX: at.clientX - 30, clientY: at.clientY });
    await waitFor(() => expect(el.columnWidths.status).toBe(width + 30));
    await up();
    handle.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.columnWidths.status).toBe(width + 38);
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.columnWidths.status).toBe(width + 30);
  },
});

export const SortPaths = meta.story({
  name: "Sort paths and several keys",
  parameters: {
    docs: {
      description: {
        story:
          "A column can sort by another field; Shift-click on a sorted column cycles it while keeping the others, and a plain click starts over.",
      },
    },
  },
  args: {
    columns: [
      { key: "customer", label: "Customer", sortable: "region" },
      { key: "issued", label: "Issued", sortable: true },
      { key: "amount", label: "Amount", sortable: true, align: "end" },
      { key: "region" },
    ],
  },
  play: async ({ canvas, userEvent, args }) => {
    const customer = canvas.getByRole("columnheader", { name: "Customer" });
    await userEvent.click(canvas.getByRole("button", { name: "Customer" }));
    await expect(args.onSort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { sort: "region" } }));
    await expect(customer).toHaveAttribute("aria-sort", "ascending");
    await userEvent.keyboard("{Shift>}");
    await userEvent.click(canvas.getByRole("button", { name: "Amount" }));
    await userEvent.click(canvas.getByRole("button", { name: /^Customer/ }));
    await userEvent.keyboard("{/Shift}");
    await expect(args.onSort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { sort: "-region,amount" } }));
    await expect(customer).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(canvas.getByRole("button", { name: "Issued" }));
    await expect(args.onSort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { sort: "issued" } }));
  },
});

export const FooterHeadings = meta.story({
  name: "Footer headings",
  parameters: { docs: { description: { story: "The footer repeats the headings without drag or resize hooks." } } },
  args: {
    columns: [
      { key: "customer", label: "Customer", sortable: "region" },
      { key: "amount", label: "Amount", sortable: true, align: "end" },
      { key: "region" },
    ],
    footer: true,
    sort: "region",
  },
  play: async ({ canvasElement }) => {
    const foot = canvasElement.querySelector("tfoot tr")!;
    await expect(cellsOf(foot)).toEqual(["Customer", "Amount", "region"]);
    const [customer, amount, region] = [...foot.querySelectorAll("th")];
    await expect(customer).not.toHaveAttribute("data-key");
    await expect(customer).not.toHaveAttribute("class");
    await expect(customer).toHaveAttribute("aria-sort", "ascending");
    await expect(amount).toHaveAttribute("aria-sort", "none");
    await expect(amount).toHaveClass("text-end");
    await expect(region).not.toHaveAttribute("class");
  },
});

export const PhotosAndBlankEmpty = meta.story({
  name: "Photos and a blank empty state",
  parameters: {
    docs: {
      description: { story: "An avatar can be a photo; with no rows and no message the table keeps its filler rows." },
    },
  },
  render: () => html`
    <ui-table
      .columns=${[
        { key: "customer", label: "Customer", avatar: () => ({ src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=" }) },
        { key: "region", label: "Region", avatar: () => ({}) },
      ]}
      .rows=${invoices.slice(0, 1)}
    ></ui-table>
    <ui-table selectable index-column min-rows="2" .columns=${plain} .rows=${[]} .empty=${""}></ui-table>
  `,
  play: async ({ canvasElement }) => {
    const [photos, blank] = [...canvasElement.querySelectorAll("ui-table")];
    const img = photos!.querySelector("tbody img")!;
    await expect(img).toHaveAttribute("alt", "");
    await expect(img.parentElement).not.toHaveAttribute("aria-hidden");
    const plainAvatar = photos!.querySelectorAll("tbody td")[1]!.querySelector("span")!;
    await expect(plainAvatar).toHaveAttribute("aria-hidden", "true");
    await expect(plainAvatar).toHaveTextContent(/^$/);
    const filler = [...blank!.querySelectorAll("tbody tr")];
    await expect(filler).toHaveLength(2);
    await expect(filler[0]).toHaveAttribute("aria-hidden", "true");
    await expect(filler[0]!.querySelector("td")).toHaveAttribute("colspan", "6");
  },
});

export const CutOffHints = meta.story({
  name: "Cut-off cell hints",
  parameters: {
    docs: {
      description: {
        story: "With one line per row, a cell cut off by its set width gets its full text as a title on hover.",
      },
    },
  },
  args: {
    lines: "one",
    columns: [{ key: "number", label: "Invoice", header: true }, { key: "note", label: "Note" }, plain[3]!],
    rows: invoices.map((r) => ({ ...r, note: longNote.text })),
    columnWidths: { note: 120 },
  },
  play: async ({ canvas, userEvent }) => {
    const note = canvas.getAllByText(longNote.text)[0]!.closest("td")!;
    await expect(note).not.toHaveAttribute("title");
    await userEvent.hover(note);
    await expect(note).toHaveAttribute("title", longNote.text);
    const amount = canvas.getByText("$1,284.00").closest("td")!;
    amount.title = "stale";
    await userEvent.hover(amount);
    await expect(amount).not.toHaveAttribute("title");
    const head = canvas.getByText("INV-20418");
    await userEvent.hover(head);
    await expect(head).not.toHaveAttribute("title");
  },
});

const people = [
  {
    title: "Spares for the Aurora Crest, with the courier waybill and the customs note",
    owner: "Leila Haddad",
    initials: "LH",
  },
  { title: "Quick quote for life jackets", owner: "Omar Farouk", initials: "OF" },
];

export const NarrowScrollingTable = meta.story({
  name: "Narrow scrolling table",
  parameters: {
    docs: {
      description: {
        story:
          "A table too wide for its box scrolls sideways and takes focus so keys can scroll it; names keep room beside their avatar, long links stay inside their cut-off cell, and an action column keeps a header name it does not show.",
      },
    },
  },
  render: () => {
    const columns = [
      { key: "title", label: "Subject", render: (r: TableRowData) => html`<a class="link" href="#">${r.title}</a>` },
      {
        key: "owner",
        label: "Owner",
        avatar: (r: TableRowData) => ({ initials: String(r.initials) }),
        render: (r: TableRowData) => html`<a class="link link-hover" href="#">${r.owner}</a>`,
      },
      { key: "open", label: "Open", hideLabel: true, render: () => html`<a class="link" href="#">Open</a>` },
      { key: "more", hideLabel: true, render: () => html`<a class="link" href="#">More</a>` },
      {
        key: "act",
        label: "Actions",
        render: (r: TableRowData) =>
          html`<ui-button size="xs">Internal reminder</ui-button>
            <ui-button size="xs">Record payment for ${r.owner}</ui-button>`,
      },
    ];
    return html`<ui-container width="sm" .centered=${false}>
      <ui-table nowrap .columns=${columns} .rows=${people}></ui-table>
      <ui-table lines="one" .columns=${columns} .rows=${people}></ui-table>
      <ui-table lines="one" .columnWidths=${{ title: 160 }} .columns=${columns} .rows=${people}></ui-table>
    </ui-container>`;
  },
  play: async ({ canvas, canvasElement }) => {
    for (const head of canvas.getAllByRole("columnheader", { name: "Open" }))
      await expect(head.querySelector(".sr-only")).toHaveTextContent("Open");
    await expect(canvas.getAllByRole("columnheader", { name: "more" })).toHaveLength(3);
    const scrolling = canvasElement.querySelector("ui-table > div");
    await waitFor(() => expect(scrolling).toHaveAttribute("tabindex", "0"));
    await expect(auditLayout(canvasElement).map((i) => `${i.kind} ${i.detail}`)).toEqual([]);
  },
});
