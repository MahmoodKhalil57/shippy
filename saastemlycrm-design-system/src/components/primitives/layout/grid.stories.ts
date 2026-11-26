import preview from "#.storybook/preview";
import { html, type TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./grid.ts";
import "./box.ts";
import type { GridItem } from "./grid.ts";

const cell = (label: string) => html`<ui-box surface="primary-soft" rounded="field" padding="3">${label}</ui-box>`;
const cells = (n: number) => Array.from({ length: n }, (_, i) => cell(`Item ${i + 1}`));

const sized = (label: string) =>
  html`<ui-box surface="primary-soft" rounded="field" padding="3" width="fit">${label}</ui-box>`;

const measured = (content: TemplateResult) =>
  html`<ui-grid balance="2" .items=${[{ content, span: "full" }] satisfies GridItem[]}></ui-grid>`;

const track = (el: HTMLElement) => {
  const hosts = el.querySelectorAll<HTMLElement>("ui-grid");
  const first = hosts[hosts.length - 1]!.firstElementChild as HTMLElement;
  return first.classList.contains("@container") ? (first.firstElementChild as HTMLElement) : first;
};

const steps = ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"];
const counts = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const meta = preview.type<{ args: { count: number } }>().meta({
  title: "Primitives/Layout/Grid",
  component: "ui-grid",
  args: {
    count: 6,
    fit: "xs",
    cols: undefined,
    balance: undefined,
    sidebar: false,
    rows: undefined,
    gap: "2",
    align: undefined,
    justify: undefined,
    flow: undefined,
    padding: undefined,
    items: [],
  },
  argTypes: {
    count: { control: { type: "number", min: 1, max: 12, step: 1 }, description: "How many filler cells to lay out." },
    fit: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    cols: { control: "select", options: counts },
    balance: { control: "inline-radio", options: ["2", "3", "4", "5", "6"] },
    rows: { control: "inline-radio", options: ["1", "2", "3", "4", "5", "6"] },
    gap: { control: "select", options: steps },
    align: { control: "inline-radio", options: ["start", "center", "end", "stretch"] },
    justify: { control: "inline-radio", options: ["start", "center", "end", "stretch"] },
    flow: { control: "inline-radio", options: ["row", "dense"] },
    padding: { control: "select", options: steps },
    items: { control: "object", description: "Cells with a span or role; when set they replace the children." },
  },
  render: (args) =>
    measured(
      html`<ui-grid
        fit=${ifDefined(args.fit)}
        cols=${ifDefined(args.cols)}
        balance=${ifDefined(args.balance)}
        ?sidebar=${args.sidebar}
        rows=${ifDefined(args.rows)}
        gap=${ifDefined(args.gap)}
        align=${ifDefined(args.align)}
        justify=${ifDefined(args.justify)}
        flow=${ifDefined(args.flow)}
        padding=${ifDefined(args.padding)}
        .items=${args.items}
        >${cells(args.count)}</ui-grid
      >`,
    ),
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the grid; count sets how many cells it arranges." } },
    canvas: "column",
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByText(/^Item \d+$/)).toHaveLength(6);
    const style = getComputedStyle(track(canvasElement));
    await expect(style.display).toBe("grid");
    await expect(style.columnGap).toBe("8px");
    await expect(style.rowGap).toBe("8px");
  },
});

export const OneColumn = meta.story({
  name: "One column",
  args: { fit: undefined, cols: "1", count: 3, gap: "4" },
  parameters: { canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    await expect(getComputedStyle(track(canvasElement)).gridTemplateColumns.split(" ")).toHaveLength(1);
    const one = canvas.getByText("Item 1").getBoundingClientRect();
    const two = canvas.getByText("Item 2").getBoundingClientRect();
    await expect(two.top).toBeGreaterThan(one.bottom);
  },
});

export const FromItems = meta.story({
  name: "From items",
  args: {
    count: 0,
    items: [
      { content: "First item", span: "full" },
      { content: "Second item", span: "1" },
    ],
  },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("First item")).toBeVisible();
    await expect(canvas.getByText("Second item")).toBeVisible();
  },
});

export const ItemsReplaceChildren = meta.story({
  name: "Items replace children",
  parameters: {
    docs: { description: { story: "When items are set they are what the grid shows; its children are not rendered." } },
    canvas: "column",
  },
  render: () =>
    html`<ui-grid cols="2" gap="2" .items=${[{ content: cell("From items") }] satisfies GridItem[]}
      >${cell("Child")}</ui-grid
    >`,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("From items")).toBeVisible();
    await expect(canvas.queryByText("Child")).not.toBeVisible();
  },
});

export const ColumnsStandalone = meta.story({
  name: "Columns standalone",
  parameters: {
    docs: {
      description: {
        story: "With no container above it, a grid with cols or spans provides its own, so the columns still apply.",
      },
    },
    layout: "fullscreen",
  },
  render: () => html`<ui-grid cols="3" gap="2">${cells(3)}</ui-grid>`,
  play: async ({ canvasElement }) => {
    await expect(getComputedStyle(track(canvasElement)).gridTemplateColumns.split(" ")).toHaveLength(3);
  },
});

export const SidebarFlow = meta.story({
  name: "Sidebar flow",
  args: { fit: undefined, sidebar: true, count: 2 },
  parameters: { canvas: "column" },
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(track(canvasElement));
    await expect(style.display).toBe("flex");
    await expect(style.flexWrap).toBe("wrap");
  },
});

export const Centred = meta.story({
  name: "Centred",
  args: { align: "center", justify: "center", count: 3 },
  parameters: { canvas: "column" },
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(track(canvasElement));
    await expect(style.alignItems).toBe("center");
    await expect(style.justifyItems).toBe("center");
  },
});

export const Fit = meta.story({
  name: "Fit",
  parameters: {
    docs: {
      description: { story: "Fit fills the row with as many columns of at least the given width as fit, then wraps." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-grid fit="xs" gap="2">${cells(6)}</ui-grid>
    <ui-grid fit="sm" gap="2">${cells(6)}</ui-grid>
    <ui-grid fit="md" gap="2">${cells(6)}</ui-grid>
    <ui-grid fit="lg" gap="2">${cells(6)}</ui-grid>
  `,
});

export const Balance = meta.story({
  name: "Balance",
  parameters: {
    docs: {
      description: {
        story: "Balanced grids step through even column counts as their own width grows, so no row is left ragged.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-grid balance="2" gap="2">${cells(4)}</ui-grid>
    <ui-grid balance="3" gap="2">${cells(6)}</ui-grid>
    <ui-grid balance="4" gap="2">${cells(8)}</ui-grid>
    <ui-grid balance="6" gap="2">${cells(6)}</ui-grid>
  `,
});

export const Columns = meta.story({
  name: "Columns",
  parameters: {
    docs: {
      description: {
        story:
          "Fixed column counts answer to the nearest container's width and fall back to one column without room; here a balanced grid supplies that container.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    ${measured(html`<ui-grid cols="2" gap="2">${cells(4)}</ui-grid>`)}
    ${measured(html`<ui-grid cols="3" gap="2">${cells(6)}</ui-grid>`)}
    ${measured(html`<ui-grid cols="4" gap="2">${cells(8)}</ui-grid>`)}
    ${measured(html`<ui-grid cols="6" gap="2">${cells(6)}</ui-grid>`)}
  `,
});

export const Spans = meta.story({
  name: "Spans",
  parameters: { canvas: "column" },
  render: () =>
    measured(
      html`<ui-grid
        cols="4"
        gap="2"
        .items=${
          [
            { content: cell("Span 2"), span: "2" },
            { content: cell("Span 1"), span: "1" },
            { content: cell("Span 1"), span: "1" },
            { content: cell("Span 3"), span: "3" },
            { content: cell("Span 1"), span: "1" },
            { content: cell("Full width"), span: "full" },
          ] satisfies GridItem[]
        }
      ></ui-grid>`,
    ),
});

export const Gap = meta.story({
  name: "Gap",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-grid fit="xs" gap="0">${cells(4)}</ui-grid>
    <ui-grid fit="xs" gap="2">${cells(4)}</ui-grid>
    <ui-grid fit="xs" gap="4">${cells(4)}</ui-grid>
    <ui-grid fit="xs" gap="8">${cells(4)}</ui-grid>
  `,
});

export const Sidebar = meta.story({
  name: "Sidebar",
  parameters: {
    docs: {
      description: {
        story: "The main item keeps at least 30rem beside the side item; below that the side item drops underneath.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-grid
      sidebar
      gap="4"
      .items=${
        [
          {
            content: html`<ui-box surface="primary-soft" rounded="box" padding="4" height="48">Main</ui-box>`,
            role: "main",
          },
          {
            content: html`<ui-box surface="base-300" rounded="box" padding="4" height="32">Side</ui-box>`,
            role: "side",
          },
        ] satisfies GridItem[]
      }
    ></ui-grid>
  `,
});

export const AlignAndJustify = meta.story({
  name: "Align and justify",
  parameters: {
    docs: {
      description: {
        story: "Align places items vertically in their row; justify places them horizontally in their column.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-grid fit="xs" gap="2" align="start" justify="start">
      ${sized("Start")}<ui-box surface="base-300" rounded="field" padding="8">Tall</ui-box>${sized("Start")}
    </ui-grid>
    <ui-grid fit="xs" gap="2" align="center" justify="center">
      ${sized("Centre")}<ui-box surface="base-300" rounded="field" padding="8">Tall</ui-box>${sized("Centre")}
    </ui-grid>
    <ui-grid fit="xs" gap="2" align="end" justify="end">
      ${sized("End")}<ui-box surface="base-300" rounded="field" padding="8">Tall</ui-box>${sized("End")}
    </ui-grid>
    <ui-grid fit="xs" gap="2" align="stretch" justify="stretch">
      ${cell("Stretch")}<ui-box surface="base-300" rounded="field" padding="8">Tall</ui-box>${cell("Stretch")}
    </ui-grid>
  `,
});

export const Padding = meta.story({
  name: "Padding",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-box surface="base-300" rounded="box"><ui-grid fit="xs" gap="2" padding="0">${cells(3)}</ui-grid></ui-box>
    <ui-box surface="base-300" rounded="box"><ui-grid fit="xs" gap="2" padding="4">${cells(3)}</ui-grid></ui-box>
    <ui-box surface="base-300" rounded="box"><ui-grid fit="xs" gap="2" padding="8">${cells(3)}</ui-grid></ui-box>
  `,
});
