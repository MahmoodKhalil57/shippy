import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./icon.ts";
import "../layout/flex.ts";
import "../layout/grid.ts";
import { ICON_NAMES } from "../../../lib/base/icon-names.ts";
import type { IconVariants } from "./icon.ts";
import rocket from "~icons/material-symbols/rocket-launch-outline";
import leaf from "~icons/material-symbols/eco-outline";
import checklist from "~icons/line-md/check-list-3-twotone";

const sizes: NonNullable<IconVariants["size"]>[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
const colors: NonNullable<IconVariants["color"]>[] = [
  "current",
  "base-content",
  "muted",
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
];

const custom = (icon: typeof rocket, uid: string) =>
  html`<svg xmlns="http://www.w3.org/2000/svg" viewBox=${icon.viewBox}>${icon.body(uid)}</svg>`;

const meta = preview.meta({
  title: "Primitives/Media/Icon",
  component: "ui-icon",
  args: {
    name: "truck",
    size: "lg",
    color: "primary",
    label: "",
    pop: false,
  },
  argTypes: {
    name: { control: "select", options: ICON_NAMES },
    size: { control: "inline-radio", options: [...sizes, "em"] },
    color: { control: "select", options: colors },
    label: { control: "text", description: "An accessible name; empty leaves the icon decorative." },
  },
  render: (args) =>
    html`<ui-icon
      name=${ifDefined(args.name)}
      size=${ifDefined(args.size)}
      color=${ifDefined(args.color)}
      label=${ifDefined(args.label || undefined)}
      ?pop=${args.pop}
    ></ui-icon>`,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the icon." } } },
  play: async ({ canvas, canvasElement }) => {
    const svg = canvasElement.querySelector("ui-icon svg")!;
    await expect(svg).toHaveAttribute("aria-hidden", "true");
    await expect(svg).not.toHaveAttribute("role");
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
    await expect(svg.getBoundingClientRect().width).toBe(24);
  },
});

export const Labelled = meta.story({
  name: "Labelled",
  args: { name: "warning", color: "warning", label: "Delivery delayed" },
  play: async ({ canvas }) => {
    const img = canvas.getByRole("img", { name: "Delivery delayed" });
    await expect(img).not.toHaveAttribute("aria-hidden");
  },
});

export const ExtraLarge = meta.story({
  name: "Extra large",
  args: { size: "2xl", name: "star-filled", color: "accent" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-icon svg")!.getBoundingClientRect().width).toBe(40);
  },
});

export const NamedIcons = meta.story({
  name: "Named icons",
  parameters: {
    docs: { description: { story: "Animated icons draw themselves in once, when they first scroll into view." } },
    canvas: "column",
  },
  render: () => html`
    <ui-grid fit="xs" gap="2">
      ${ICON_NAMES.map(
        (name) => html`<ui-flex gap="2" align="center"><ui-icon name=${name}></ui-icon><span>${name}</span></ui-flex>`,
      )}
    </ui-grid>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () =>
    html`${sizes.map(
      (size) =>
        html`<ui-flex direction="col" align="center" gap="1"
          ><ui-icon name="truck" size=${size}></ui-icon><span>${size}</span></ui-flex
        >`,
    )}`,
});

export const RelativeToText = meta.story({
  name: "Relative to text",
  parameters: { docs: { description: { story: "The em size follows the surrounding font size." } } },
  render: () => html`
    <p><ui-icon name="info" size="em"></ui-icon> Small print</p>
    <h3><ui-icon name="info" size="em"></ui-icon> A larger heading</h3>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () =>
    html`${colors.map(
      (color) =>
        html`<ui-flex direction="col" align="center" gap="1"
          ><ui-icon name="star-filled" size="lg" color=${color}></ui-icon><span>${color}</span></ui-flex
        >`,
    )}`,
});

export const LabelledAndDecorative = meta.story({
  name: "Labelled and decorative",
  parameters: {
    docs: {
      description: {
        story: "With a label the icon is announced as an image; without one it is hidden from assistive technology.",
      },
    },
  },
  render: () => html`
    <ui-icon name="warning" size="lg" color="warning" label="Delivery delayed"></ui-icon>
    <ui-icon name="check" size="lg" color="success"></ui-icon>
  `,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("img")).toHaveLength(1);
    await expect(canvas.getByRole("img", { name: "Delivery delayed" })).toBeVisible();
    await expect(canvasElement.querySelectorAll("ui-icon svg")[1]).toHaveAttribute("aria-hidden", "true");
  },
});

export const PopIn = meta.story({
  name: "Pop in",
  parameters: {
    docs: { description: { story: "Pop scales and turns the icon in as it appears, for a status that just changed." } },
  },
  render: () => html`<ui-icon name="success" size="xl" color="success" pop></ui-icon>`,
});

export const CustomIcons = meta.story({
  name: "Custom icons",
  parameters: {
    docs: {
      description: {
        story: "Without a name the icon wraps its own content, such as an icon imported from an allowed collection.",
      },
    },
  },
  render: () => html`
    <ui-icon size="lg" color="primary">${custom(rocket, "story-rocket")}</ui-icon>
    <ui-icon size="lg" color="success">${custom(leaf, "story-leaf")}</ui-icon>
    <ui-icon size="xl" color="secondary">${custom(checklist, "story-checklist")}</ui-icon>
  `,
  play: async ({ canvasElement }) => {
    const wrappers = canvasElement.querySelectorAll("ui-icon > span");
    await expect(wrappers).toHaveLength(3);
    for (const w of wrappers) {
      await expect(w).toHaveAttribute("aria-hidden", "true");
      await expect(w.querySelector("svg")).not.toBeNull();
    }
  },
});

export const LabelledCustomIcon = meta.story({
  name: "Labelled custom icon",
  render: () =>
    html`<ui-icon size="lg" color="primary" label="Launch">${custom(rocket, "story-rocket-labelled")}</ui-icon>`,
  play: async ({ canvas }) => {
    const wrapper = canvas.getByRole("img", { name: "Launch" });
    await expect(wrapper.tagName).toBe("SPAN");
    await expect(wrapper).not.toHaveAttribute("aria-hidden");
    await expect(wrapper.querySelector("svg")).not.toBeNull();
  },
});
