import preview from "#.storybook/preview";
import { html, render } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "./box.ts";
import { overflows, scrollFocus } from "../../base/scroll-focus.ts";
import "./flex.ts";

const filler = (label: string) => html`<ui-box surface="primary-soft" rounded="field" padding="2">${label}</ui-box>`;

const longText = Array.from(
  { length: 8 },
  (_, i) => html`<p>Line ${i + 1}: the order was packed, labelled and handed to the carrier for delivery.</p>`,
);

const inner = (el: HTMLElement) => el.querySelector<HTMLElement>("ui-box > *")!;

const padding = ["fluid", "0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"];
const widths = [
  "auto",
  "full",
  "fit",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "96",
  "80",
  "64",
  "52",
];

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Layout/Box",
  component: "ui-box",
  args: {
    text: "A box holds its content on a surface.",
    as: "div",
    surface: "base-200",
    border: false,
    rounded: "box",
    elevation: "0",
    padding: "4",
    width: "md",
    max: undefined,
    maxHeight: undefined,
    height: undefined,
    overflow: undefined,
    center: false,
    backdrop: false,
    basis: "",
    grow: false,
  },
  argTypes: {
    text: { control: "text", description: "The box's content." },
    as: { control: "select", options: ["div", "section", "article", "aside", "header", "footer", "figure"] },
    surface: { control: "select", options: ["base-100", "base-200", "base-300", "primary", "primary-soft"] },
    rounded: { control: "inline-radio", options: ["none", "field", "selector", "box", "full"] },
    elevation: { control: "inline-radio", options: ["0", "1", "2", "3"] },
    padding: { control: "select", options: padding },
    width: { control: "select", options: widths },
    max: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    maxHeight: { control: "inline-radio", options: ["56", "72", "96"] },
    height: { control: "select", options: ["32", "48", "64", "80", "96", "full", "screen"] },
    overflow: { control: "inline-radio", options: ["auto", "hidden", "x-auto"] },
    basis: { control: "text", description: "A flex basis such as 16rem; empty for none." },
  },
  render: (args) => html`
    <ui-box
      as=${ifDefined(args.as)}
      surface=${ifDefined(args.surface)}
      ?border=${args.border}
      rounded=${ifDefined(args.rounded)}
      elevation=${ifDefined(args.elevation)}
      padding=${ifDefined(args.padding)}
      width=${ifDefined(args.width)}
      max=${ifDefined(args.max)}
      max-height=${ifDefined(args.maxHeight)}
      height=${ifDefined(args.height)}
      overflow=${ifDefined(args.overflow)}
      ?center=${args.center}
      ?backdrop=${args.backdrop}
      basis=${ifDefined(args.basis || undefined)}
      ?grow=${args.grow}
      >${args.text}</ui-box
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the box." } } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("A box holds its content on a surface.")).toBeVisible();
    const style = getComputedStyle(inner(canvasElement));
    await expect(style.paddingTop).toBe("16px");
    await expect(style.borderTopWidth).toBe("0px");
    await expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThan(0);
    await expect(inner(canvasElement).getBoundingClientRect().width).toBeLessThanOrEqual(448);
  },
});

export const Bordered = meta.story({
  name: "Bordered",
  args: { border: true, surface: "base-100", rounded: "none" },
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(inner(canvasElement));
    await expect(style.borderTopWidth).toBe("0px");
    await expect(style.boxShadow).toMatch(/ 0px 0px 0px 1px inset/);
    await expect(style.borderTopLeftRadius).toBe("0px");
  },
});

export const CentredContent = meta.story({
  name: "Centred content",
  args: { center: true, height: "32", width: "64", text: "Centred" },
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(inner(canvasElement));
    await expect(style.display).toBe("grid");
    await expect(style.placeItems).toBe("center");
    await expect(style.height).toBe("128px");
  },
});

export const Scrolling = meta.story({
  name: "Scrolling",
  args: { height: "32", overflow: "auto", width: "64" },
  render: (args) =>
    html`<ui-box
      border
      rounded="box"
      padding="3"
      width=${ifDefined(args.width)}
      height=${ifDefined(args.height)}
      overflow=${ifDefined(args.overflow)}
      >${longText}</ui-box
    >`,
  play: async ({ canvasElement }) => {
    const box = inner(canvasElement);
    await expect(getComputedStyle(box).overflowY).toBe("auto");
    await expect(box.scrollHeight).toBeGreaterThan(box.clientHeight);
    await waitFor(() => expect(box).toHaveAttribute("tabindex", "0"));
    box.focus();
    await expect(box).toHaveFocus();
  },
});

export const AsAnArticle = meta.story({
  name: "As an article",
  args: { as: "article" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("article")).toHaveTextContent("A box holds its content on a surface.");
  },
});

export const Surfaces = meta.story({
  name: "Surfaces",
  parameters: {
    docs: { description: { story: "Each surface sets its matching text colour, so content stays readable on it." } },
  },
  render: () => html`
    <ui-box surface="base-100" border rounded="box" padding="4">Base 100</ui-box>
    <ui-box surface="base-200" rounded="box" padding="4">Base 200</ui-box>
    <ui-box surface="base-300" rounded="box" padding="4">Base 300</ui-box>
    <ui-box surface="primary-soft" rounded="box" padding="4">Primary soft</ui-box>
    <ui-box surface="primary" rounded="box" padding="4">Primary</ui-box>
  `,
});

export const BorderAndCorners = meta.story({
  name: "Border and corners",
  render: () => html`
    <ui-box border rounded="none" padding="4">None</ui-box>
    <ui-box border rounded="selector" padding="4">Selector</ui-box>
    <ui-box border rounded="field" padding="4">Field</ui-box>
    <ui-box border rounded="box" padding="4">Box</ui-box>
    <ui-box border rounded="full" padding="4">Full</ui-box>
  `,
});

export const Elevation = meta.story({
  name: "Elevation",
  render: () => html`
    <ui-box surface="base-100" rounded="box" elevation="0" padding="6">Level 0</ui-box>
    <ui-box surface="base-100" rounded="box" elevation="1" padding="6">Level 1</ui-box>
    <ui-box surface="base-100" rounded="box" elevation="2" padding="6">Level 2</ui-box>
    <ui-box surface="base-100" rounded="box" elevation="3" padding="6">Level 3</ui-box>
  `,
});

export const Padding = meta.story({
  name: "Padding",
  parameters: {
    docs: {
      description: {
        story: "Horizontal padding gives way first, so a narrow box never squeezes its content below 7rem.",
      },
    },
  },
  render: () => html`
    <ui-box surface="base-300" rounded="box" padding="0">${filler("0")}</ui-box>
    <ui-box surface="base-300" rounded="box" padding="2">${filler("2")}</ui-box>
    <ui-box surface="base-300" rounded="box" padding="4">${filler("4")}</ui-box>
    <ui-box surface="base-300" rounded="box" padding="8">${filler("8")}</ui-box>
    <ui-box surface="base-300" rounded="box" padding="16">${filler("16")}</ui-box>
    <ui-box surface="base-300" rounded="box" padding="fluid">${filler("Fluid")}</ui-box>
  `,
});

export const WidthAndMaxWidth = meta.story({
  name: "Width and max width",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-box surface="base-200" rounded="field" padding="2" width="fit">Fit</ui-box>
    <ui-box surface="base-200" rounded="field" padding="2" width="52">52</ui-box>
    <ui-box surface="base-200" rounded="field" padding="2" width="xs">Extra small</ui-box>
    <ui-box surface="base-200" rounded="field" padding="2" width="md">Medium</ui-box>
    <ui-box surface="base-200" rounded="field" padding="2" width="2xl">2xl</ui-box>
    <ui-box surface="base-200" rounded="field" padding="2" width="full" max="lg">Full, capped at large</ui-box>
    <ui-box surface="base-200" rounded="field" padding="2" width="full">Full</ui-box>
  `,
});

export const HeightAndScrolling = meta.story({
  name: "Height and scrolling",
  parameters: {
    docs: { description: { story: "A max height scrolls its content inside the box instead of growing past it." } },
  },
  render: () => html`
    <ui-box border rounded="box" padding="3" width="64" height="32" overflow="auto" label="Fixed height notes"
      >${longText}</ui-box
    >
    <ui-box border rounded="box" padding="3" width="64" max-height="56">${longText}</ui-box>
    <ui-box border rounded="box" padding="3" width="64" height="32" overflow="hidden">${longText}</ui-box>
    <ui-box border rounded="box" padding="3" width="64" height="32" overflow="auto" label="Short note"
      >Fits without scrolling.</ui-box
    >
  `,
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("region", { name: "Fixed height notes" })).toHaveAttribute("tabindex", "0");
    await expect(canvas.getByText("Fits without scrolling.").closest("div")).not.toHaveAttribute("tabindex");
    await expect(canvas.queryByRole("region", { name: "Short note" })).toBeNull();
  },
});

export const Centred = meta.story({
  name: "Centred",
  render: () => html`
    <ui-box surface="base-200" rounded="box" width="64" height="32" center>${filler("Centred")}</ui-box>
    <ui-box surface="base-200" rounded="box" width="64" height="32">${filler("Not centred")}</ui-box>
  `,
});

export const BasisAndGrow = meta.story({
  name: "Basis and grow",
  parameters: {
    docs: {
      description: { story: "Boxes with a basis share a row and wrap once the row can't fit them at that width." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-flex gap="2">
      <ui-box surface="base-200" rounded="field" padding="3" basis="16rem">16rem</ui-box>
      <ui-box surface="base-200" rounded="field" padding="3" basis="16rem">16rem</ui-box>
      <ui-box surface="base-200" rounded="field" padding="3" basis="16rem">16rem</ui-box>
    </ui-flex>
    <ui-flex gap="2">
      <ui-box surface="base-200" rounded="field" padding="3" basis="12rem">12rem</ui-box>
      <ui-box surface="primary-soft" rounded="field" padding="3" basis="12rem" grow>12rem, grows</ui-box>
      <ui-box surface="base-200" rounded="field" padding="3" basis="12rem">12rem</ui-box>
    </ui-flex>
  `,
});

export const Backdrop = meta.story({
  name: "Backdrop",
  render: () => html`
    <ui-box backdrop rounded="box" padding="8" width="96">The app's background wash, tinted by the theme.</ui-box>
  `,
});

export const UnknownTagFallsBack = meta.story({
  name: "Unknown tag falls back",
  args: { as: "nav" as never },
  parameters: {
    docs: {
      description: { story: "A tag outside the allowed set renders a plain div instead of an arbitrary element." },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("A box holds its content on a surface.")).toBeVisible();
    await expect(inner(canvasElement).tagName).toBe("DIV");
    await expect(canvas.queryByRole("navigation")).toBeNull();
  },
});

export const ScrollFocusFollowsContent = meta.story({
  name: "Scroll focus follows content",
  parameters: {
    docs: {
      description: {
        story:
          "A scrolling box is focusable and named only while its content overflows, keeps a role it was given, and keeps tracking after it moves.",
      },
    },
  },
  render: () => html`
    <ui-box border rounded="box" padding="3" width="64" max-height="56" label="Delivery notes"
      >${longText}${longText}</ui-box
    >
    <ui-box border rounded="box" padding="3" width="64" overflow="x-auto"
      ><p style="white-space: nowrap">
        ${"A single long line that runs past the edge of its box and scrolls sideways. ".repeat(4)}
      </p></ui-box
    >
  `,
  play: async ({ canvas, canvasElement }) => {
    const region = await canvas.findByRole("region", { name: "Delivery notes" });
    await expect(region).toHaveAttribute("tabindex", "0");
    const notes = region.parentElement as HTMLElement & { label?: string };
    notes.label = "Shipping notes";
    await waitFor(() => expect(region).toHaveAccessibleName("Shipping notes"));
    await expect(canvas.getByRole("region", { name: "Shipping notes" })).toBe(region);
    notes.label = "Delivery notes";
    await waitFor(() => expect(region).toHaveAccessibleName("Delivery notes"));
    const extra = [...region.querySelectorAll("p")].slice(1);
    extra.forEach((p) => p.remove());
    await waitFor(() => expect(region).not.toHaveAttribute("tabindex"));
    await expect(region).not.toHaveAttribute("role");
    await expect(region).not.toHaveAttribute("aria-label");
    region.setAttribute("role", "group");
    region.append(...extra);
    await waitFor(() => expect(region).toHaveAttribute("tabindex", "0"));
    await expect(region).toHaveAttribute("role", "group");
    await expect(region).toHaveAccessibleName("Delivery notes");
    extra.forEach((p) => p.remove());
    await waitFor(() => expect(region).not.toHaveAttribute("aria-label"));
    await expect(region).toHaveAttribute("role", "group");
    region.removeAttribute("role");
    const host = region.parentElement!;
    const parent = host.parentElement!;
    host.remove();
    region.append(...extra);
    parent.prepend(host);
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(canvas.getByRole("region", { name: "Delivery notes" })).toBe(region);
    extra.forEach((p) => p.remove());
    await waitFor(() => expect(region).not.toHaveAttribute("tabindex"));
    const sideways = canvas.getByText(/A single long line/).parentElement!;
    await expect(sideways.scrollWidth).toBeGreaterThan(sideways.clientWidth);
    await expect(sideways).toHaveAttribute("tabindex", "0");
    await expect(sideways).not.toHaveAttribute("role");
    sideways.style.overflowX = "scroll";
    await expect(overflows(sideways)).toBe(true);
    sideways.style.overflowX = "hidden";
    await expect(overflows(sideways)).toBe(false);
    sideways.style.overflowX = "";
    const misplaced = () => render(html`<div class=${scrollFocus()}></div>`, document.createElement("div"));
    await expect(misplaced).toThrow("scrollFocus() goes on the scroll container itself.");
    await expect(canvasElement.querySelectorAll("[role=region]")).toHaveLength(0);
  },
});

export const BorderKeepsTheMeasure = meta.story({
  name: "A border keeps the content measure",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () =>
    html`<ui-box padding="16" width="full"
      ><ui-box padding="16" width="full"
        ><ui-box border padding="6" width="full"
          ><p data-measure>Valid until 30 November; may be renewed.</p></ui-box
        ></ui-box
      ></ui-box
    >`,
  play: async ({ canvasElement }) => {
    const p = canvasElement.querySelector("[data-measure]")!;
    await expect(p.getBoundingClientRect().width).toBeGreaterThanOrEqual(7 * 16);
  },
});
