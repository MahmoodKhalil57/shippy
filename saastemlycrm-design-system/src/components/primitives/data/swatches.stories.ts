import preview from "#.storybook/preview";
import { html } from "lit";
import { expect } from "storybook/test";
import "./swatches.ts";

const meta = preview.meta({
  title: "Primitives/Data/Swatches",
  component: "ui-swatches",
  args: {
    colors: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"],
  },
  argTypes: {
    colors: { control: "object" },
  },
  render: (args) => html`<ui-swatches .colors=${args.colors}></ui-swatches>`,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Edit the colours array to change the swatches." } } },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector("ui-swatches > span");
    await expect(group).toHaveAttribute("aria-hidden", "true");
    await expect(group?.children).toHaveLength(4);
    await expect(group?.children[0]?.getAttribute("style")).toContain("var(--chart-1)");
  },
});

export const Single = meta.story({
  name: "Single colour",
  args: { colors: ["#1f6feb"] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-swatches > span")?.children).toHaveLength(1);
  },
});

export const NoColours = meta.story({
  name: "No colours",
  args: { colors: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-swatches > span")?.children).toHaveLength(0);
  },
});

export const ThemeColours = meta.story({
  name: "Theme colours",
  parameters: {
    docs: {
      description: {
        story: "Swatches are decorative and hidden from assistive tech; name the colours in nearby text.",
      },
    },
  },
  render: () => html`
    <ui-swatches .colors=${["var(--color-primary)", "var(--color-secondary)", "var(--color-accent)"]}></ui-swatches>
    <ui-swatches
      .colors=${["var(--color-success)", "var(--color-warning)", "var(--color-error)", "var(--color-info)"]}
    ></ui-swatches>
  `,
});

export const ChartPalette = meta.story({
  name: "Chart palette",
  render: () => html`
    <ui-swatches
      .colors=${["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"]}
    ></ui-swatches>
  `,
});

export const Counts = meta.story({
  name: "Counts",
  render: () => html`
    <ui-swatches .colors=${["#1f6feb"]}></ui-swatches>
    <ui-swatches .colors=${["#1f6feb", "#e3b341"]}></ui-swatches>
    <ui-swatches .colors=${["#1f6feb", "#e3b341", "#2da44e", "#cf222e", "#8250df"]}></ui-swatches>
  `,
});
