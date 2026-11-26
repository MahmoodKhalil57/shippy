import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./search.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const say = (text: string) => text as LocalizedString;

const meta = preview.type<{ args: { onInput: (e: Event) => void; onClick: (e: Event) => void } }>().meta({
  title: "Primitives/Forms/Search",
  component: "ui-search",
  args: {
    label: say("Search orders"),
    value: "",
    size: "md",
    variant: "field",
    width: "full",
    launcher: false,
    shortcut: "",
    name: "q",
    autocomplete: "off",
    onInput: fn(),
    onClick: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: { control: "inline-radio", options: ["field", "bare"] },
    width: { control: "inline-radio", options: ["fill", "full", "auto"] },
    shortcut: { control: "text", description: "Keyboard shortcut shown on a launcher, keys joined with +." },
    name: { control: "text" },
    autocomplete: { control: "text" },
    onInput: { table: { category: "events" } },
    onClick: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-search
      label=${ifDefined(args.label)}
      value=${ifDefined(args.value)}
      size=${ifDefined(args.size)}
      variant=${ifDefined(args.variant)}
      width=${ifDefined(args.width)}
      shortcut=${ifDefined(args.shortcut || undefined)}
      name=${ifDefined(args.name)}
      autocomplete=${ifDefined(args.autocomplete)}
      ?launcher=${args.launcher}
      @input=${args.onInput}
      @click=${args.onClick}
    ></ui-search>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Type to search; Escape or the clear button empties the box and keeps focus." } },
  },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const box = canvas.getByRole("searchbox", { name: "Search orders" });
    await expect(box).toHaveAttribute("placeholder", "Search orders");
    await expect(canvas.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    await userEvent.type(box, "ORD-48");
    await expect(box).toHaveValue("ORD-48");
    await expect(canvasElement.querySelector("ui-search")?.value).toBe("ORD-48");
    await expect(args.onInput).toHaveBeenCalledTimes(6);
    await userEvent.keyboard("{Escape}");
    await expect(box).toHaveValue("");
    await expect(box).toHaveFocus();
    await expect(args.onInput).toHaveBeenCalledTimes(7);
    await userEvent.paste("Morgan");
    await expect(box).toHaveValue("Morgan");
    await userEvent.click(await canvas.findByRole("button", { name: "Clear search" }));
    await expect(box).toHaveValue("");
    await expect(box).toHaveFocus();
    await expect(canvas.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    box.blur();
    canvasElement.querySelector("ui-search")!.focus();
    await expect(box).toHaveFocus();
    const unrendered = document.createElement("ui-search");
    await expect(() => unrendered.focus()).not.toThrow();
  },
});

export const Filled = meta.story({
  name: "Filled",
  args: { label: say("Search customers"), value: "Morgan" },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole("searchbox", { name: "Search customers" });
    await expect(box).toHaveValue("Morgan");
    await userEvent.click(box);
    await userEvent.keyboard("{End} Lee");
    await expect(box).toHaveValue("Morgan Lee");
    await userEvent.clear(box);
    await expect(box).toHaveValue("");
    await expect(canvas.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  },
});

export const LauncherButton = meta.story({
  name: "Launcher button",
  args: { launcher: true, label: say("Search everything"), shortcut: "Ctrl+K" },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const button = canvas.getByRole("button", { name: /^Search everything/ });
    await expect(button).toHaveAccessibleName(expect.stringMatching(/^Search everything Ctrl ?\+ ?K$/));
    await expect(button).toHaveAttribute("aria-keyshortcuts", "Control+K");
    await expect(canvas.queryByRole("searchbox")).not.toBeInTheDocument();
    await expect(canvas.getByText("Ctrl")).toBeInTheDocument();
    await expect(canvas.getByText("K")).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    button.blur();
    canvasElement.querySelector("ui-search")!.focus();
    await expect(button).toHaveFocus();
  },
});

export const Field = meta.story({
  name: "Field",
  parameters: {
    docs: {
      description: {
        story: "The label doubles as placeholder and name; with a value, Escape or the clear button empties it.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-search label="Search orders"></ui-search>
    <ui-search label="Search customers" value="Morgan"></ui-search>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("search")).not.toBeInTheDocument();
    await expect(canvas.getByRole("searchbox", { name: "Search orders" })).toHaveValue("");
    await expect(canvas.getByRole("searchbox", { name: "Search customers" })).toHaveValue("Morgan");
  },
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-search size="sm" label="Small"></ui-search>
    <ui-search size="md" label="Medium"></ui-search>
    <ui-search size="lg" label="Large"></ui-search>
  `,
});

export const BareAndWidths = meta.story({
  name: "Bare and widths",
  parameters: {
    docs: { description: { story: "Bare drops the border for use inside toolbars; fill grows to share a row." } },
  },
  render: () => html`
    <ui-search variant="bare" width="auto" label="Filter this list"></ui-search>
    <ui-search width="fill" label="Search products"></ui-search>
    <ui-search width="fill" label="Search invoices"></ui-search>
  `,
});

export const Launcher = meta.story({
  name: "Launcher",
  parameters: {
    docs: {
      description: {
        story:
          "A launcher is a button that opens a search elsewhere, with its keyboard shortcut shown beside the label.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-search launcher label="Search everything" shortcut="Ctrl+K"></ui-search>
    <ui-search launcher label="Jump to a record"></ui-search>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /^Search everything Ctrl/ })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Jump to a record" })).not.toHaveAttribute("aria-keyshortcuts");
  },
});
