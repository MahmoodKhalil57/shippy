import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "../layout/grid.ts";
import "./choice-tile.ts";

const swatch = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="160" height="100" fill="url(#g)"/></svg>`,
  )}`;

const images = {
  dawn: swatch("#f6d365", "#fda085"),
  ocean: swatch("#4facfe", "#00f2fe"),
  forest: swatch("#43e97b", "#38f9d7"),
  dusk: swatch("#a18cd1", "#fbc2eb"),
};

const meta = preview.type<{ args: { onClick: (e: Event) => void } }>().meta({
  title: "Primitives/Forms/Choice tile",
  component: "ui-choice-tile",
  args: {
    label: "Light",
    icon: "sun",
    image: undefined,
    selected: false,
    dashed: false,
    onClick: fn(),
  },
  argTypes: {
    label: { control: "text" },
    icon: { control: "select", options: ["sun", "moon", "contrast", "upload", "no-image"] },
    image: {
      control: "select",
      options: [undefined, ...Object.values(images)],
      description: "Image URL; when set it replaces the icon.",
    },
    onClick: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-grid fit="xs" gap="3" role="group" aria-label="Theme">
      <ui-choice-tile
        label=${ifDefined(args.label)}
        icon=${ifDefined(args.icon)}
        .image=${args.image}
        ?selected=${args.selected}
        ?dashed=${args.dashed}
        @click=${args.onClick}
      ></ui-choice-tile>
    </ui-grid>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the tile; a click or Enter calls onClick." } } },
  play: async ({ canvas, userEvent, args }) => {
    const tile = canvas.getByRole("button", { name: "Light" });
    await expect(tile).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(tile);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(tile).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
});

export const Selected = meta.story({
  name: "Selected",
  args: { selected: true, label: "Dark", icon: "moon" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  },
});

export const WithImage = meta.story({
  name: "With image",
  args: { image: images.ocean, label: "Ocean", icon: undefined },
  play: async ({ canvas, userEvent, args }) => {
    const tile = canvas.getByRole("button", { name: "Ocean" });
    await expect(tile.querySelector("img")).toHaveAttribute("src", images.ocean);
    await userEvent.click(tile);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
});

export const Dashed = meta.story({
  name: "Dashed",
  args: { dashed: true, icon: "upload", label: "Upload an image" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Upload an image" })).toHaveAttribute("aria-pressed", "false");
  },
});

export const ImageTiles = meta.story({
  name: "Image tiles",
  parameters: {
    docs: {
      description: {
        story:
          "Each tile is a toggle button that reports aria-pressed; the selected one carries a check and a primary ring.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-grid fit="xs" gap="3" role="group" aria-label="Background">
      <ui-choice-tile icon="no-image" label="None"></ui-choice-tile>
      <ui-choice-tile .image=${images.dawn} label="Dawn" selected></ui-choice-tile>
      <ui-choice-tile .image=${images.ocean} label="Ocean"></ui-choice-tile>
      <ui-choice-tile .image=${images.forest} label="Forest"></ui-choice-tile>
      <ui-choice-tile .image=${images.dusk} label="Dusk"></ui-choice-tile>
    </ui-grid>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("option")).toHaveLength(0);
    await expect(canvas.getByRole("button", { name: "Dawn" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Ocean" })).toHaveAttribute("aria-pressed", "false");
  },
});

export const IconTiles = meta.story({
  name: "Icon tiles",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-grid fit="xs" gap="3" role="group" aria-label="Theme">
      <ui-choice-tile icon="sun" label="Light"></ui-choice-tile>
      <ui-choice-tile icon="moon" label="Dark" selected></ui-choice-tile>
      <ui-choice-tile icon="contrast" label="System"></ui-choice-tile>
    </ui-grid>
  `,
});

export const DashedUploadTile = meta.story({
  name: "Dashed upload tile",
  parameters: {
    docs: {
      description: { story: "Dashed marks an action tile such as an upload; it drops the dashes once selected." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-grid fit="xs" gap="3" role="group" aria-label="Custom background">
      <ui-choice-tile icon="upload" label="Upload an image" dashed></ui-choice-tile>
      <ui-choice-tile icon="upload" label="Replace image" dashed selected></ui-choice-tile>
    </ui-grid>
  `,
});

export const LivePreviewContent = meta.story({
  name: "Live preview content",
  parameters: {
    docs: {
      description: {
        story:
          "Children are drawn as the tile's preview behind the label, for backgrounds rendered live rather than from an image.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-grid fit="xs" gap="3" role="group" aria-label="Pattern">
      <ui-choice-tile label="Stripes"
        ><svg viewBox="0 0 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <rect width="160" height="100" fill="#e0e7ff" />
          <path
            d="M0 100 L100 0 M40 100 L140 0 M80 100 L180 0 M-40 100 L60 0"
            stroke="#6366f1"
            stroke-width="12"
          /></svg
      ></ui-choice-tile>
      <ui-choice-tile label="Dots" selected
        ><svg viewBox="0 0 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <rect width="160" height="100" fill="#fef3c7" />
          <circle cx="30" cy="30" r="10" fill="#f59e0b" />
          <circle cx="80" cy="60" r="10" fill="#f59e0b" />
          <circle cx="130" cy="30" r="10" fill="#f59e0b" /></svg
      ></ui-choice-tile>
    </ui-grid>
  `,
});

export const LabelOnly = meta.story({
  name: "Label only",
  parameters: { docs: { description: { story: "A tile with neither image, icon nor content shows just its label." } } },
  render: (args) => html`<ui-choice-tile label="No background" @click=${args.onClick}></ui-choice-tile>`,
  play: async ({ canvas, userEvent, args }) => {
    const tile = canvas.getByRole("button", { name: "No background" });
    await expect(tile).toHaveAttribute("aria-pressed", "false");
    await expect(tile.querySelector("svg, img")).toBeNull();
    await userEvent.click(tile);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
});
