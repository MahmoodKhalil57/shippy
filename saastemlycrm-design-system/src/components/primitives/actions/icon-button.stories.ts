import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./icon-button.ts";
import { ICON_NAMES } from "../../../lib/base/icon-names.ts";

const meta = preview.type<{ args: { onClick: () => void } }>().meta({
  title: "Primitives/Actions/Icon button",
  component: "ui-icon-button",
  args: {
    icon: "edit",
    label: "Edit",
    variant: "standard",
    color: undefined,
    size: "sm",
    shape: "round",
    toggle: false,
    selected: false,
    disabled: false,
    href: undefined,
    type: "button",
    noTooltip: false,
    onClick: fn(),
  },
  argTypes: {
    icon: { control: "select", options: ICON_NAMES },
    label: { control: "text" },
    variant: { control: "select", options: ["standard", "tonal", "outlined", "filled"] },
    color: { control: "inline-radio", options: [undefined, "primary", "error"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md"] },
    shape: { control: "inline-radio", options: ["round", "square"] },
    href: { control: "text" },
    type: { control: "inline-radio", options: ["button", "submit"] },
    onClick: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-icon-button
      icon=${ifDefined(args.icon)}
      label=${ifDefined(args.label)}
      variant=${ifDefined(args.variant)}
      color=${ifDefined(args.color)}
      size=${ifDefined(args.size)}
      shape=${ifDefined(args.shape)}
      href=${ifDefined(args.href)}
      type=${ifDefined(args.type)}
      ?toggle=${args.toggle}
      ?selected=${args.selected}
      ?disabled=${args.disabled}
      ?no-tooltip=${args.noTooltip}
      @click=${args.onClick}
    ></ui-icon-button>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the icon button; a click calls onClick." } } },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Edit" });
    await expect(button).not.toHaveAttribute("aria-pressed");
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    button.focus();
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
});

export const DisabledDoesNotClick = meta.story({
  name: "Disabled",
  args: { disabled: true, icon: "archive", label: "Archive" },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("button", { name: "Archive" })).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
});

export const TogglePressed = meta.story({
  name: "Toggle pressed",
  args: { toggle: true, selected: true, icon: "star", label: "Starred" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Starred" })).toHaveAttribute("aria-pressed", "true");
  },
});

export const AsLink = meta.story({
  name: "As link",
  args: { href: "#", icon: "external", label: "Open in a new view" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Open in a new view" })).toHaveAttribute("href", "#");
  },
});

export const Variants = meta.story({
  name: "Variants",
  parameters: {
    docs: {
      description: { story: "The label names the button for assistive tech and shows as a tooltip on hover or focus." },
    },
  },
  render: () => html`
    <ui-icon-button icon="edit" label="Edit" variant="standard"></ui-icon-button>
    <ui-icon-button icon="copy" label="Duplicate" variant="tonal"></ui-icon-button>
    <ui-icon-button icon="filter" label="Filter" variant="outlined"></ui-icon-button>
    <ui-icon-button icon="plus" label="New invoice" variant="filled"></ui-icon-button>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-icon-button icon="send" label="Send" variant="filled" color="primary"></ui-icon-button>
    <ui-icon-button icon="trash" label="Delete" variant="filled" color="error"></ui-icon-button>
    <ui-icon-button icon="trash" label="Delete" color="error"></ui-icon-button>
  `,
});

export const SizesAndShapes = meta.story({
  name: "Sizes and shapes",
  render: () => html`
    <ui-icon-button icon="settings" label="Settings, extra small" variant="tonal" size="xs"></ui-icon-button>
    <ui-icon-button icon="settings" label="Settings, small" variant="tonal" size="sm"></ui-icon-button>
    <ui-icon-button icon="settings" label="Settings, medium" variant="tonal" size="md"></ui-icon-button>
    <ui-icon-button icon="bell" label="Notifications, round" variant="outlined" shape="round"></ui-icon-button>
    <ui-icon-button icon="bell" label="Notifications, square" variant="outlined" shape="square"></ui-icon-button>
    <ui-icon-button
      icon="bell"
      label="Notifications, square and medium"
      variant="filled"
      shape="square"
      size="md"
    ></ui-icon-button>
  `,
});

export const Toggle = meta.story({
  name: "Toggle",
  parameters: {
    docs: {
      description: { story: "A toggle reports aria-pressed; selected, it fills with primary and squares its corners." },
    },
  },
  render: () => html`
    <ui-icon-button icon="star" label="Starred" toggle selected></ui-icon-button>
    <ui-icon-button icon="star" label="Not starred" toggle></ui-icon-button>
    <ui-icon-button icon="heart" label="Favourite" variant="outlined" toggle selected></ui-icon-button>
    <ui-icon-button icon="heart" label="Not a favourite" variant="outlined" toggle></ui-icon-button>
  `,
});

export const StatesAndLinks = meta.story({
  name: "States and links",
  parameters: {
    docs: {
      description: {
        story: "With href it renders a link; no-tooltip keeps the accessible name but drops the hover tip.",
      },
    },
  },
  render: () => html`
    <ui-icon-button icon="archive" label="Archive" disabled></ui-icon-button>
    <ui-icon-button icon="archive" label="Archive" variant="filled" disabled></ui-icon-button>
    <ui-icon-button icon="external" label="Open in a new view" href="#"></ui-icon-button>
    <ui-icon-button icon="print" label="Print" no-tooltip></ui-icon-button>
  `,
});

export const SlottedIcon = meta.story({
  name: "Slotted icon",
  parameters: { docs: { description: { story: "Without an icon name the button shows its own content." } } },
  render: (args) => html`
    <ui-icon-button label="Mark as read" @click=${args.onClick}><span aria-hidden="true">R</span></ui-icon-button>
  `,
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Mark as read" });
    await expect(button).toHaveTextContent("R");
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
});
