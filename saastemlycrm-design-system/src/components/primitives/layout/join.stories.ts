import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./join.ts";
import "./box.ts";
import "../actions/button.ts";
import "../actions/icon-button.ts";

const sample = { options: ["Day", "Week", "Month", "Quarter", "Year", "All time"] };

const meta = preview.type<{ args: { count: number; onClick: () => void } }>().meta({
  title: "Primitives/Layout/Join",
  component: "ui-join",
  args: {
    count: 3,
    label: "Period",
    as: "div",
    direction: "horizontal",
    surface: undefined,
    equal: false,
    onClick: fn(),
  },
  argTypes: {
    count: { control: { type: "number", min: 1, max: 6, step: 1 }, description: "How many joined buttons to show." },
    label: { control: "text" },
    as: { control: "inline-radio", options: ["div", "nav"] },
    direction: { control: "inline-radio", options: ["horizontal", "vertical"] },
    surface: { control: "inline-radio", options: ["base-100", "base-200", "base-300"] },
    onClick: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-box width="md">
      <ui-join
        label=${ifDefined(args.label || undefined)}
        as=${ifDefined(args.as)}
        direction=${ifDefined(args.direction)}
        surface=${ifDefined(args.surface)}
        ?equal=${args.equal}
        @click=${args.onClick}
      >
        ${sample.options.slice(0, args.count).map((o) => html`<ui-button variant="outlined">${o}</ui-button>`)}
      </ui-join>
    </ui-box>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the join; count sets how many buttons it joins." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const group = canvas.getByRole("group", { name: "Period" });
    const buttons = canvas.getAllByRole("button");
    await expect(buttons).toHaveLength(3);
    for (const b of buttons) await expect(group).toContainElement(b);
    const [day, week] = buttons.map((b) => b.getBoundingClientRect());
    await expect(Math.abs(day!.top - week!.top)).toBeLessThan(1);
    await userEvent.click(canvas.getByRole("button", { name: "Week" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
});

export const StackedVertically = meta.story({
  name: "Stacked vertically",
  args: { direction: "vertical", label: "Sort" },
  play: async ({ canvas }) => {
    const [first, second] = canvas.getAllByRole("button").map((b) => b.getBoundingClientRect());
    await expect(second!.top).toBeGreaterThanOrEqual(first!.bottom - 1);
  },
});

export const SharedEqually = meta.story({
  name: "Shared equally",
  args: { equal: true, count: 3 },
  play: async ({ canvas }) => {
    const widths = canvas.getAllByRole("button").map((b) => Math.round(b.getBoundingClientRect().width));
    await expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
  },
});

export const NavigationLandmark = meta.story({
  name: "Navigation landmark",
  args: { as: "nav", label: "Pages" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Pages" })).toContainElement(
      canvas.getByRole("button", { name: "Day" }),
    );
  },
});

export const Unlabelled = meta.story({
  name: "Unlabelled",
  args: { label: "" },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("group")).not.toBeInTheDocument();
    await expect(canvas.getAllByRole("button")).toHaveLength(3);
  },
});

export const Horizontal = meta.story({
  name: "Horizontal",
  parameters: {
    docs: { description: { story: "Joined items share their inner borders and only the ends keep rounded corners." } },
  },
  render: () => html`
    <ui-join label="Period">
      <ui-button variant="outlined">Day</ui-button>
      <ui-button variant="outlined">Week</ui-button>
      <ui-button variant="outlined">Month</ui-button>
    </ui-join>
    <ui-join label="Order actions">
      <ui-button variant="tonal">Edit</ui-button>
      <ui-button variant="tonal">Duplicate</ui-button>
      <ui-button variant="tonal" color="error">Cancel</ui-button>
    </ui-join>
  `,
});

export const Vertical = meta.story({
  name: "Vertical",
  render: () => html`
    <ui-join direction="vertical" label="Sort">
      <ui-button variant="outlined">Newest first</ui-button>
      <ui-button variant="outlined">Oldest first</ui-button>
      <ui-button variant="outlined">Highest total</ui-button>
    </ui-join>
  `,
});

export const IconButtons = meta.story({
  name: "Icon buttons",
  render: () => html`
    <ui-join label="Zoom">
      <ui-icon-button icon="minus" label="Zoom out" variant="outlined" shape="square" no-tooltip></ui-icon-button>
      <ui-icon-button icon="search" label="Reset zoom" variant="outlined" shape="square" no-tooltip></ui-icon-button>
      <ui-icon-button icon="plus" label="Zoom in" variant="outlined" shape="square" no-tooltip></ui-icon-button>
    </ui-join>
  `,
});

export const IconButtonsWithTooltips = meta.story({
  name: "Icon buttons with tooltips",
  parameters: {
    docs: {
      description: { story: "Labelled icon buttons keep their tooltip; the join still squares the inner corners." },
    },
  },
  render: () => html`
    <ui-join label="Zoom">
      <ui-icon-button icon="minus" label="Zoom out" variant="outlined" shape="square"></ui-icon-button>
      <ui-icon-button icon="search" label="Reset zoom" variant="outlined" shape="square"></ui-icon-button>
      <ui-icon-button icon="plus" label="Zoom in" variant="outlined" shape="square"></ui-icon-button>
    </ui-join>
  `,
  play: async ({ canvas }) => {
    const first = getComputedStyle(canvas.getByRole("button", { name: "Zoom out" }));
    const middle = getComputedStyle(canvas.getByRole("button", { name: "Reset zoom" }));
    const last = getComputedStyle(canvas.getByRole("button", { name: "Zoom in" }));
    await expect(first.borderStartEndRadius).toBe("0px");
    await expect(first.borderStartStartRadius).not.toBe("0px");
    await expect(middle.borderStartStartRadius).toBe("0px");
    await expect(middle.borderEndEndRadius).toBe("0px");
    await expect(last.borderStartStartRadius).toBe("0px");
    await expect(last.borderEndEndRadius).not.toBe("0px");
  },
});

export const EqualWidths = meta.story({
  name: "Equal widths",
  parameters: {
    docs: { description: { story: "Equal items split the row between them, whatever their label length." } },
    canvas: "column",
  },
  render: () => html`
    <ui-box width="md">
      <ui-join equal label="View">
        <ui-button variant="outlined">List</ui-button>
        <ui-button variant="outlined">Board</ui-button>
        <ui-button variant="outlined">Calendar view</ui-button>
      </ui-join>
    </ui-box>
  `,
});

export const Surfaces = meta.story({
  name: "Surfaces",
  render: () => html`
    <ui-join surface="base-100" label="Base 100">
      <ui-button variant="text">One</ui-button>
      <ui-button variant="text">Two</ui-button>
    </ui-join>
    <ui-join surface="base-200" label="Base 200">
      <ui-button variant="text">One</ui-button>
      <ui-button variant="text">Two</ui-button>
    </ui-join>
    <ui-join surface="base-300" label="Base 300">
      <ui-button variant="text">One</ui-button>
      <ui-button variant="text">Two</ui-button>
    </ui-join>
  `,
});

export const AsNavigation = meta.story({
  name: "As navigation",
  render: () => html`
    <ui-join as="nav" label="Pages">
      <ui-button href="#" variant="outlined">Previous</ui-button>
      <ui-button href="#" variant="outlined">1</ui-button>
      <ui-button href="#" variant="outlined">2</ui-button>
      <ui-button href="#" variant="outlined">Next</ui-button>
    </ui-join>
  `,
});
