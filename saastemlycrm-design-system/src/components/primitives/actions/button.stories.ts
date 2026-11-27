import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./button.ts";
import ownSheet from "./button.ui.css?inline";
import plainSheet from "../forms/form.ui.css?inline";

const meta = preview.type<{ args: { text: string; onClick: () => void } }>().meta({
  title: "Primitives/Actions/Button",
  component: "ui-button",
  args: {
    text: "Save changes",
    variant: "filled",
    color: "primary",
    size: "sm",
    disabled: false,
    loading: false,
    toggle: false,
    selected: false,
    wide: false,
    block: false,
    multiline: false,
    onClick: fn(),
  },
  argTypes: {
    text: { control: "text", description: "The button's label (its content)." },
    variant: { control: "select", options: ["filled", "tonal", "outlined", "text", "elevated"] },
    color: { control: "select", options: ["primary", "secondary", "error"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md"] },
    justify: { control: "inline-radio", options: ["start", "center", "end"] },
    onClick: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-button
      variant=${ifDefined(args.variant)}
      color=${ifDefined(args.color)}
      size=${ifDefined(args.size)}
      justify=${ifDefined(args.justify)}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?toggle=${args.toggle}
      ?selected=${args.selected}
      ?wide=${args.wide}
      ?block=${args.block}
      ?multiline=${args.multiline}
      @click=${args.onClick}
      >${args.text}</ui-button
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the button; a click calls onClick." } } },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Save changes" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    button.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
});

export const DisabledDoesNotClick = meta.story({
  name: "Disabled",
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("button", { name: "Save changes" })).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
});

export const LoadingIsBusy = meta.story({
  name: "Loading",
  args: { loading: true, text: "Saving" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Saving" });
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toBeDisabled();
  },
});

export const TogglePressed = meta.story({
  name: "Toggle",
  args: { toggle: true, selected: true, variant: "outlined", color: undefined, text: "Bold" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  },
});

export const Variants = meta.story({
  name: "Variants",
  parameters: { docs: { description: { story: "Without a colour a button is tonal; with one it is filled." } } },
  render: () => html`
    <ui-button variant="filled">Filled</ui-button>
    <ui-button variant="tonal">Tonal</ui-button>
    <ui-button variant="outlined">Outlined</ui-button>
    <ui-button variant="text">Text</ui-button>
    <ui-button variant="elevated">Elevated</ui-button>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-button color="primary">Primary</ui-button>
    <ui-button color="secondary">Secondary</ui-button>
    <ui-button color="error">Delete</ui-button>
    <ui-button variant="tonal" color="primary">Primary</ui-button>
    <ui-button variant="tonal" color="secondary">Secondary</ui-button>
    <ui-button variant="tonal" color="error">Delete</ui-button>
    <ui-button variant="outlined" color="error">Delete</ui-button>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-button color="primary" size="xs">Extra small</ui-button>
    <ui-button color="primary" size="sm">Small</ui-button>
    <ui-button color="primary" size="md">Medium</ui-button>
  `,
});

export const States = meta.story({
  name: "States",
  parameters: {
    docs: {
      description: { story: "A toggle reports aria-pressed; a loading button is busy and can't be pressed again." },
    },
  },
  render: () => html`
    <ui-button toggle selected variant="outlined">Selected</ui-button>
    <ui-button toggle variant="outlined">Not selected</ui-button>
    <ui-button color="primary" loading>Saving</ui-button>
    <ui-button color="primary" disabled>Disabled</ui-button>
    <ui-button variant="outlined" disabled>Disabled</ui-button>
  `,
});

export const LinksAndWidth = meta.story({
  name: "Links and width",
  render: () => html`
    <ui-button href="#" variant="text">Link</ui-button>
    <ui-button href="#" variant="outlined" disabled>Disabled link</ui-button>
    <ui-button color="primary" wide>Wide</ui-button>
    <ui-button variant="tonal" multiline justify="start"
      >A multiline label, aligned to the start: it wraps when the row runs out of room</ui-button
    >
  `,
});

export const ChoiceInputsAndDefaultTone = meta.story({
  name: "Choice inputs and default tone",
  parameters: {
    docs: {
      description: {
        story:
          "type checkbox or radio renders a native input styled as a button whose checked follows the input, including radios turned off by a sibling; with neither colour nor variant a button is tonal.",
      },
    },
  },
  render: () => html`
    <ui-button type="checkbox" label="Bold" name="format" value="bold"></ui-button>
    <ui-button type="radio" label="Left" name="align" value="left" checked></ui-button>
    <ui-button type="radio" label="Right" name="align" value="right"></ui-button>
    <ui-button>Save draft</ui-button>
  `,
  play: async ({ canvas, userEvent, canvasElement }) => {
    const [bold, left, right] = canvasElement.querySelectorAll("ui-button");
    const box = canvas.getByRole("checkbox", { name: "Bold" });
    await expect(box).toHaveAttribute("value", "bold");
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await expect(bold!.checked).toBe(true);
    await expect(canvas.getByRole("radio", { name: "Left" })).toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: "Right" }));
    await expect(right!.checked).toBe(true);
    await expect(canvas.getByRole("radio", { name: "Left" })).not.toBeChecked();
    await expect(left!.checked).toBe(false);
    await userEvent.click(canvas.getByRole("radio", { name: "Left" }));
    await expect(left!.checked).toBe(true);
    await expect(right!.checked).toBe(false);
    await expect(bold!.checked).toBe(true);
    await expect(canvas.getByRole("button", { name: "Save draft" })).toHaveClass("bg-secondary-container");
  },
});

export const OwnSheetKeepsLayerOrder = meta.story({
  name: "Own sheet keeps the layer order",
  parameters: {
    docs: {
      description: {
        story:
          "Component sheets load in import order. A sheet without daisyUI or variant rules, loaded first, still declares the layer order, so a filled button keeps its on-colour ink.",
      },
    },
  },
  render: () => html`<div data-own-sheet></div>`,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector<HTMLElement>("[data-own-sheet]")!;
    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [plainSheet, ownSheet].map((css) => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      return sheet;
    });
    root.innerHTML = '<a class="btn btn-primary" href="#">Continue</a>';
    const probe = document.createElement("span");
    probe.style.color = "var(--color-primary-content)";
    canvasElement.append(probe);
    const ink = getComputedStyle(probe).color;
    probe.remove();
    await expect(getComputedStyle(root.querySelector("a")!).color).toBe(ink);
  },
});
