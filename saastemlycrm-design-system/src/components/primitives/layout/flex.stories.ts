import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./flex.ts";
import "./box.ts";

const item = (label: string, padding: "2" | "4" | "6" = "2") =>
  html`<ui-box surface="primary-soft" rounded="field" padding=${padding}>${label}</ui-box>`;

const three = () => html`${item("One")}${item("Two")}${item("Three")}`;

const filler = (count: number) =>
  Array.from({ length: count }, (_, i) => item(`Item ${i + 1}`, (["2", "4", "6"] as const)[i % 3]));

const frame = (label: string, content: unknown) =>
  html`<ui-box border rounded="box" padding="3">
    <ui-flex direction="col" gap="2">
      <span>${label}</span>
      ${content}
    </ui-flex>
  </ui-box>`;

const inner = (el: HTMLElement) => el.querySelector<HTMLElement>("ui-flex > *")!;

const meta = preview.type<{ args: { count: number } }>().meta({
  title: "Primitives/Layout/Flex",
  component: "ui-flex",
  args: {
    count: 3,
    as: "div",
    direction: "row",
    gap: "2",
    align: "center",
    justify: "start",
    padding: "0",
    inline: false,
    wrap: false,
    grow: false,
    shrink: false,
    fill: false,
    fullWidth: false,
    fullHeight: false,
  },
  argTypes: {
    count: {
      control: { type: "number", min: 1, max: 12, step: 1 },
      description: "How many filler children to lay out.",
    },
    as: { control: "select", options: ["div", "section", "header", "footer", "main", "nav", "aside"] },
    direction: { control: "inline-radio", options: ["row", "col", "row-reverse", "col-reverse"] },
    gap: { control: "select", options: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"] },
    align: { control: "inline-radio", options: ["start", "center", "end", "stretch", "baseline"] },
    justify: { control: "select", options: ["start", "center", "end", "between", "around", "evenly"] },
    padding: { control: "select", options: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"] },
  },
  render: (args) => html`
    <ui-box border rounded="box" height="64">
      <ui-flex
        as=${ifDefined(args.as)}
        direction=${ifDefined(args.direction)}
        gap=${ifDefined(args.gap)}
        align=${ifDefined(args.align)}
        justify=${ifDefined(args.justify)}
        padding=${ifDefined(args.padding)}
        ?inline=${args.inline}
        ?wrap=${args.wrap}
        ?grow=${args.grow}
        ?shrink=${args.shrink}
        ?fill=${args.fill}
        ?full-width=${args.fullWidth}
        ?full-height=${args.fullHeight}
        >${filler(args.count)}</ui-flex
      >
    </ui-box>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the flex; count sets how many children it arranges." } },
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByText(/^Item \d+$/)).toHaveLength(3);
    const style = getComputedStyle(inner(canvasElement));
    await expect(style.display).toBe("flex");
    await expect(style.flexDirection).toBe("row");
    await expect(style.alignItems).toBe("center");
    await expect(canvas.getByText("Item 1").getBoundingClientRect().left).toBeLessThan(
      canvas.getByText("Item 2").getBoundingClientRect().left,
    );
    await expect(style.columnGap).toBe("8px");
  },
});

export const Column = meta.story({
  name: "Column",
  args: { direction: "col", align: "stretch", gap: "4", count: 4 },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByText(/^Item \d+$/)).toHaveLength(4);
    const style = getComputedStyle(inner(canvasElement));
    await expect(style.flexDirection).toBe("column");
    await expect(style.alignItems).toBe("stretch");
    await expect(style.rowGap).toBe("16px");
  },
});

export const Reversed = meta.story({
  name: "Reversed",
  args: { direction: "row-reverse" },
  play: async ({ canvas, canvasElement }) => {
    await expect(getComputedStyle(inner(canvasElement)).flexDirection).toBe("row-reverse");
    const first = canvas.getByText("Item 1").getBoundingClientRect();
    const last = canvas.getByText("Item 3").getBoundingClientRect();
    await expect(first.left).toBeGreaterThan(last.left);
  },
});

export const SpacedBetween = meta.story({
  name: "Spaced between",
  args: { justify: "between", fullHeight: true, direction: "col" },
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(inner(canvasElement));
    await expect(style.justifyContent).toBe("space-between");
    await expect(style.flexDirection).toBe("column");
  },
});

export const AsNavigationLandmark = meta.story({
  name: "As a navigation landmark",
  args: { as: "nav", count: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toContainElement(canvas.getByText("Item 1"));
  },
});

export const Direction = meta.story({
  name: "Direction",
  parameters: { docs: { description: { story: "Rows wrap on their own when they run out of room; columns stack." } } },
  render: () => html`
    ${frame("row", html`<ui-flex direction="row" gap="2">${three()}</ui-flex>`)}
    ${frame("row-reverse", html`<ui-flex direction="row-reverse" gap="2">${three()}</ui-flex>`)}
    ${frame("col", html`<ui-flex direction="col" gap="2">${three()}</ui-flex>`)}
    ${frame("col-reverse", html`<ui-flex direction="col-reverse" gap="2">${three()}</ui-flex>`)}
  `,
});

export const RowsAlwaysWrap = meta.story({
  name: "Rows always wrap",
  parameters: {
    docs: {
      description: {
        story: "A row wraps when it runs out of room whether or not wrap is set; wrap is kept only for compatibility.",
      },
    },
  },
  render: () => html`
    <ui-box width="40">
      <ui-flex gap="2"
        >${["Draft", "Sent", "Paid", "Overdue", "Void"].map((t) => html`<ui-box padding="2" surface="primary-soft">${t}</ui-box>`)}</ui-flex
      >
    </ui-box>
    <ui-box width="40">
      <ui-flex gap="2" wrap
        >${["Draft", "Sent", "Paid", "Overdue", "Void"].map((t) => html`<ui-box padding="2" surface="primary-soft">${t}</ui-box>`)}</ui-flex
      >
    </ui-box>
  `,
  play: async ({ canvasElement }) => {
    for (const row of canvasElement.querySelectorAll<HTMLElement>("ui-flex > div")) {
      await expect(getComputedStyle(row).flexWrap).toBe("wrap");
      const boxes = [...row.children].map((c) => (c.firstElementChild as HTMLElement).getBoundingClientRect().top);
      await expect(new Set(boxes.map(Math.round)).size).toBeGreaterThan(1);
    }
  },
});

export const Gap = meta.story({
  name: "Gap",
  parameters: { canvas: "column" },
  render: () => html`
    ${frame("0", html`<ui-flex gap="0">${three()}</ui-flex>`)}
    ${frame("1", html`<ui-flex gap="1">${three()}</ui-flex>`)}
    ${frame("2", html`<ui-flex gap="2">${three()}</ui-flex>`)}
    ${frame("4", html`<ui-flex gap="4">${three()}</ui-flex>`)}
    ${frame("8", html`<ui-flex gap="8">${three()}</ui-flex>`)}
    ${frame("16", html`<ui-flex gap="16">${three()}</ui-flex>`)}
  `,
});

export const Align = meta.story({
  name: "Align",
  parameters: {
    docs: { description: { story: "Children of different heights line up along the cross axis." } },
    canvas: "column",
  },
  render: () => {
    const mixed = () => html`${item("Short")}${item("Taller", "4")}${item("Tallest", "6")}`;
    return html`
      ${frame("start", html`<ui-flex gap="2" align="start">${mixed()}</ui-flex>`)}
      ${frame("center", html`<ui-flex gap="2" align="center">${mixed()}</ui-flex>`)}
      ${frame("end", html`<ui-flex gap="2" align="end">${mixed()}</ui-flex>`)}
      ${frame("stretch", html`<ui-flex gap="2" align="stretch">${mixed()}</ui-flex>`)}
      ${frame("baseline", html`<ui-flex gap="2" align="baseline">${mixed()}</ui-flex>`)}
    `;
  },
});

export const Justify = meta.story({
  name: "Justify",
  parameters: { canvas: "column" },
  render: () => html`
    ${frame("start", html`<ui-flex gap="2" justify="start">${three()}</ui-flex>`)}
    ${frame("center", html`<ui-flex gap="2" justify="center">${three()}</ui-flex>`)}
    ${frame("end", html`<ui-flex gap="2" justify="end">${three()}</ui-flex>`)}
    ${frame("between", html`<ui-flex gap="2" justify="between">${three()}</ui-flex>`)}
    ${frame("around", html`<ui-flex gap="2" justify="around">${three()}</ui-flex>`)}
    ${frame("evenly", html`<ui-flex gap="2" justify="evenly">${three()}</ui-flex>`)}
  `,
});

export const Padding = meta.story({
  name: "Padding",
  render: () => html`
    <ui-box surface="base-300" rounded="box"><ui-flex gap="2" padding="0">${three()}</ui-flex></ui-box>
    <ui-box surface="base-300" rounded="box"><ui-flex gap="2" padding="2">${three()}</ui-flex></ui-box>
    <ui-box surface="base-300" rounded="box"><ui-flex gap="2" padding="4">${three()}</ui-flex></ui-box>
    <ui-box surface="base-300" rounded="box"><ui-flex gap="2" padding="8">${three()}</ui-flex></ui-box>
  `,
});

export const Fill = meta.story({
  name: "Fill",
  parameters: {
    docs: { description: { story: "A filling child takes the room its siblings leave; several share it equally." } },
    canvas: "column",
  },
  render: () => html`
    ${frame(
      "one fill",
      html`<ui-flex gap="2">
        ${item("Fixed")}
        <ui-flex fill><ui-box surface="base-300" rounded="field" padding="2" width="full">Fills</ui-box></ui-flex>
        ${item("Fixed")}
      </ui-flex>`,
    )}
    ${frame(
      "two fills",
      html`<ui-flex gap="2">
        <ui-flex fill><ui-box surface="base-300" rounded="field" padding="2" width="full">Fills</ui-box></ui-flex>
        <ui-flex fill><ui-box surface="base-300" rounded="field" padding="2" width="full">Fills</ui-box></ui-flex>
      </ui-flex>`,
    )}
  `,
});

export const Inline = meta.story({
  name: "Inline",
  render: () => html`
    <p>
      Status:
      <ui-flex inline gap="1" align="center">${item("Packed")}${item("Shipped")}</ui-flex>
      and waiting for delivery.
    </p>
  `,
});

export const FullWidthAndHeight = meta.story({
  name: "Full width and height",
  parameters: {
    docs: {
      description: {
        story: "Full height fills a box with a set height; full width stretches an inline flex across its row.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-box border rounded="box" height="32">
      <ui-flex direction="col" justify="between" full-height padding="3"> ${item("Top")} ${item("Bottom")} </ui-flex>
    </ui-box>
    <ui-box border rounded="box">
      <ui-flex inline justify="between" full-width padding="3">${item("Start")} ${item("End")}</ui-flex>
    </ui-box>
  `,
});

export const UnknownTagFallsBack = meta.story({
  name: "Unknown tag falls back",
  args: { as: "button" as never },
  parameters: {
    docs: {
      description: { story: "A tag outside the allowed set renders a plain div instead of an arbitrary element." },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByText(/^Item \d+$/)).toHaveLength(3);
    await expect(inner(canvasElement).tagName).toBe("DIV");
    await expect(canvas.queryByRole("button")).toBeNull();
  },
});
