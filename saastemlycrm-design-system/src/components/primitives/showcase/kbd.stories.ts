import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./kbd.ts";
import "../typography/text.ts";

const keyboard = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const arrows = [["▲"], ["◀", "▼", "▶"]];

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Showcase/Keyboard key",
  component: "ui-kbd",
  args: {
    text: "Esc",
    keys: ["Ctrl", "K"],
    separator: "+",
    size: "md",
    rows: [],
    gap: "sm",
    spaced: false,
  },
  argTypes: {
    text: { control: "text", description: "A single key (the content), used when keys and rows are empty." },
    keys: { control: "object" },
    separator: { control: "text" },
    size: { control: "inline-radio", options: [undefined, "xs", "sm", "md", "lg", "xl"] },
    rows: { control: "object" },
    gap: { control: "inline-radio", options: ["none", "sm", "xl"] },
    spaced: { control: "boolean" },
  },
  render: (args) => html`
    <ui-kbd
      .keys=${args.keys ?? []}
      .rows=${args.rows ?? []}
      separator=${ifDefined(args.separator)}
      size=${ifDefined(args.size)}
      gap=${ifDefined(args.gap)}
      spaced=${args.spaced === true ? "true" : "false"}
      >${args.text}</ui-kbd
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the keys." } } },
  play: async ({ canvasElement, canvas }) => {
    const keys = [...canvasElement.querySelectorAll("kbd")].map((k) => k.textContent?.trim());
    await expect(keys).toEqual(["Ctrl", "K"]);
    await expect(canvas.getByText("+")).toBeVisible();
  },
});

export const SingleKey = meta.story({
  name: "Single key",
  args: { keys: [], size: "lg" },
  play: async ({ canvasElement }) => {
    const keys = canvasElement.querySelectorAll("kbd");
    await expect(keys).toHaveLength(1);
    await expect(keys[0]).toHaveTextContent("Esc");
    const host = canvasElement.querySelector("ui-kbd")!;
    host.setAttribute("keys", "Shift+Tab");
    await expect(host.keys).toEqual(["Shift", "Tab"]);
    host.removeAttribute("keys");
    await expect(host.keys).toEqual([]);
  },
});

export const SequenceSeparator = meta.story({
  name: "Sequence separator",
  args: { keys: ["G", "I"], separator: "then" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("then")).toBeVisible();
    await expect(canvas.queryByText("+")).toBeNull();
  },
});

export const LayoutRows = meta.story({
  name: "Layout rows",
  args: { rows: arrows, keys: [], spaced: true, gap: "xl" },
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll("ui-kbd > div");
    await expect(rows).toHaveLength(2);
    await expect(rows[1]!.querySelectorAll("kbd")).toHaveLength(3);
  },
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-kbd size="xs">Esc</ui-kbd>
    <ui-kbd size="sm">Esc</ui-kbd>
    <ui-kbd size="md">Esc</ui-kbd>
    <ui-kbd size="lg">Esc</ui-kbd>
    <ui-kbd size="xl">Esc</ui-kbd>
  `,
});

export const Shortcuts = meta.story({
  name: "Shortcuts",
  parameters: {
    docs: {
      description: {
        story: "keys takes a plus-separated combination and draws each key; separator changes or removes the joiner.",
      },
    },
  },
  render: () => html`
    <ui-kbd keys="Ctrl+K"></ui-kbd>
    <ui-kbd keys="Ctrl+Shift+P"></ui-kbd>
    <ui-kbd keys="Alt+G" size="sm"></ui-kbd>
    <ui-kbd keys="G+I" separator="then"></ui-kbd>
    <ui-kbd keys="Shift+Tab" separator=""></ui-kbd>
  `,
});

export const InText = meta.story({
  name: "In text",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-text variant="body-md"
      >Press <ui-kbd size="sm">/</ui-kbd> to search invoices, or <ui-kbd size="sm">Esc</ui-kbd> to close.</ui-text
    >
  `,
});

export const Rows = meta.story({
  name: "Rows",
  parameters: {
    docs: { description: { story: "rows draws a keyboard layout, one centred row per array." } },
    canvas: "column",
  },
  render: () => html`
    <ui-kbd .rows=${keyboard}></ui-kbd>
    <ui-kbd .rows=${arrows} size="lg" spaced></ui-kbd>
    <ui-kbd .rows=${[["Ctrl", "Alt", "Del"]]} gap="xl"></ui-kbd>
    <ui-kbd .rows=${[["F1", "F2", "F3", "F4"]]} gap="none"></ui-kbd>
  `,
});
