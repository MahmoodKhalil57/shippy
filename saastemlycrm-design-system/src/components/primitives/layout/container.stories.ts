import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./container.ts";
import "./box.ts";

const fill = (label: string) => html`<ui-box surface="primary-soft" rounded="field" padding="3">${label}</ui-box>`;

const well = (content: unknown) => html`<ui-box surface="base-200" rounded="box">${content}</ui-box>`;

const inner = (el: HTMLElement) => el.querySelector<HTMLElement>("ui-container > *")!;

const steps = ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"];

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Layout/Container",
  component: "ui-container",
  args: {
    text: "Page content",
    as: "div",
    width: "sm",
    centered: true,
    paddingX: "4",
    paddingY: "4",
  },
  argTypes: {
    text: { control: "text", description: "The container's content." },
    as: { control: "inline-radio", options: ["div", "main", "section", "article"] },
    width: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "prose", "full"],
    },
    paddingX: { control: "select", options: ["fluid", "slack", ...steps] },
    paddingY: { control: "select", options: ["fluid", "half", ...steps] },
  },
  render: (args) =>
    well(
      html`<ui-container
        as=${ifDefined(args.as)}
        width=${ifDefined(args.width)}
        .centered=${args.centered}
        padding-x=${ifDefined(args.paddingX)}
        padding-y=${ifDefined(args.paddingY)}
        >${fill(args.text)}</ui-container
      >`,
    ),
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the container." } }, canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Page content")).toBeVisible();
    const box = inner(canvasElement);
    const style = getComputedStyle(box);
    await expect(style.maxWidth).toBe("384px");
    await expect(style.paddingTop).toBe("16px");
    const outer = box.parentElement!.parentElement!.getBoundingClientRect();
    const own = box.getBoundingClientRect();
    await expect(Math.abs(own.left - outer.left - (outer.right - own.right))).toBeLessThan(1);
  },
});

export const AtTheStart = meta.story({
  name: "At the start",
  args: { centered: false },
  parameters: { canvas: "column" },
  play: async ({ canvasElement }) => {
    const box = inner(canvasElement);
    await expect(
      Math.abs(box.getBoundingClientRect().left - box.parentElement!.parentElement!.getBoundingClientRect().left),
    ).toBeLessThan(1);
  },
});

export const AsMain = meta.story({
  name: "As main",
  args: { as: "main", width: "prose" },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("main")).toHaveTextContent("Page content");
  },
});

export const Widths = meta.story({
  name: "Widths",
  parameters: {
    docs: { description: { story: "A container is full width up to its cap and centred by default." } },
    canvas: "column",
  },
  render: () => html`
    ${well(html`<ui-container width="sm">${fill("Small")}</ui-container>`)}
    ${well(html`<ui-container width="xl">${fill("Extra large")}</ui-container>`)}
    ${well(html`<ui-container width="prose">${fill("Prose, a comfortable reading measure")}</ui-container>`)}
    ${well(html`<ui-container width="4xl">${fill("4xl")}</ui-container>`)}
    ${well(html`<ui-container>${fill("Default, 7xl")}</ui-container>`)}
    ${well(html`<ui-container width="full">${fill("Full")}</ui-container>`)}
  `,
});

export const Centring = meta.story({
  name: "Centring",
  parameters: { canvas: "column" },
  render: () => html`
    ${well(html`<ui-container width="md">${fill("Centred")}</ui-container>`)}
    ${well(html`<ui-container width="md" centered="false">${fill("Not centred, sits at the start")}</ui-container>`)}
  `,
});

export const HorizontalPadding = meta.story({
  name: "Horizontal padding",
  parameters: {
    docs: {
      description: {
        story: "Fluid padding grows with the container; a narrow container gives up its padding before its content.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    ${well(html`<ui-container width="full" padding-x="0">${fill("0")}</ui-container>`)}
    ${well(html`<ui-container width="full" padding-x="4">${fill("4")}</ui-container>`)}
    ${well(html`<ui-container width="full" padding-x="8">${fill("8")}</ui-container>`)}
    ${well(html`<ui-container width="full" padding-x="16">${fill("16")}</ui-container>`)}
    ${well(html`<ui-container width="full" padding-x="fluid">${fill("Fluid")}</ui-container>`)}
  `,
});

export const VerticalPadding = meta.story({
  name: "Vertical padding",
  parameters: { canvas: "column" },
  render: () => html`
    ${well(html`<ui-container width="sm" padding-y="0">${fill("0")}</ui-container>`)}
    ${well(html`<ui-container width="sm" padding-y="4">${fill("4")}</ui-container>`)}
    ${well(html`<ui-container width="sm" padding-y="8">${fill("8")}</ui-container>`)}
    ${well(html`<ui-container width="sm" padding-y="half">${fill("Half a tile")}</ui-container>`)}
    ${well(html`<ui-container width="sm" padding-y="fluid">${fill("Fluid")}</ui-container>`)}
  `,
});

export const UnknownTagFallsBack = meta.story({
  name: "Unknown tag falls back",
  args: { as: "aside" as never },
  parameters: {
    docs: {
      description: { story: "A tag outside the allowed set renders a plain div instead of an arbitrary element." },
    },
    canvas: "column",
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Page content")).toBeVisible();
    await expect(inner(canvasElement).tagName).toBe("DIV");
    await expect(canvas.queryByRole("complementary")).toBeNull();
  },
});
