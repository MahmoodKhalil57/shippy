import preview from "#.storybook/preview";
import { html, render } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor, within } from "storybook/test";
import "./pagination.ts";
import "../../primitives/layout/box.ts";
import type { UiBox } from "../../primitives/layout/box.ts";
import type { PaginationMode } from "./pagination.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

type PaginationArgs = {
  page: number;
  total: number;
  siblings: number;
  mode: PaginationMode;
  direction?: "horizontal" | "vertical";
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "neutral";
  variant?: "solid" | "outline" | "soft" | "ghost" | "text";
  prevNext: boolean;
  prevLabel: string;
  nextLabel: string;
  name?: string;
  label?: LocalizedString;
  onChange: (detail: { page: number }) => void;
};

const changed = (args: PaginationArgs) => (e: CustomEvent<{ page: number }>) => args.onChange(e.detail);

const localized = (text: string) => text as LocalizedString;

const words = { previous: "Previous", next: "Next", results: localized("Search results"), sheets: localized("Sheets") };

const meta = preview.type<{ args: PaginationArgs }>().meta({
  title: "Composed/Navigation/Pagination",
  component: "ui-pagination",
  args: {
    page: 1,
    total: 20,
    siblings: 1,
    mode: "numbers",
    direction: undefined,
    size: undefined,
    color: "primary",
    variant: undefined,
    prevNext: false,
    prevLabel: "",
    nextLabel: "",
    name: undefined,
    label: undefined,
    onChange: fn(),
  },
  argTypes: {
    page: { control: { type: "number", min: 1, max: 50, step: 1 }, description: "The current page." },
    total: { control: { type: "number", min: 0, max: 50, step: 1 }, description: "How many pages there are." },
    siblings: { control: { type: "number", min: 0, max: 3, step: 1 }, description: "Pages shown either side." },
    mode: { control: "inline-radio", options: ["numbers", "radio", "prev-next"] },
    direction: { control: "inline-radio", options: [undefined, "horizontal", "vertical"] },
    size: { control: "inline-radio", options: [undefined, "xs", "sm", "md", "lg"] },
    color: { control: "inline-radio", options: [undefined, "primary", "secondary", "neutral"] },
    variant: { control: "inline-radio", options: [undefined, "solid", "outline", "soft", "ghost", "text"] },
    prevNext: { control: "boolean", description: "Adds previous and next arrows around the numbers." },
    prevLabel: { control: "text", description: "Text in place of the previous arrow." },
    nextLabel: { control: "text", description: "Text in place of the next arrow." },
    name: { control: "text", description: "The radio group name in radio mode." },
    label: { control: "text", description: "The accessible name of the pagination." },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-pagination
      .page=${args.page}
      .total=${args.total}
      .siblings=${args.siblings}
      mode=${ifDefined(args.mode)}
      direction=${ifDefined(args.direction)}
      size=${ifDefined(args.size)}
      color=${ifDefined(args.color)}
      variant=${ifDefined(args.variant)}
      ?prev-next=${args.prevNext}
      prev-label=${args.prevLabel}
      next-label=${args.nextLabel}
      name=${ifDefined(args.name)}
      label=${ifDefined(args.label)}
      @ui-change=${changed(args)}
    ></ui-pagination>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the pagination; a page button moves to that page." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const nav = canvas.getByRole("navigation", { name: "Pagination" });
    await expect(nav).toBeVisible();
    const first = canvas.getByRole("button", { name: "1" });
    await expect(first).toHaveAttribute("aria-current", "page");
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(canvas.getByRole("button", { name: "3" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 3 });
    await expect(canvas.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("button", { name: "1" })).not.toHaveAttribute("aria-current");
    await expect(canvas.getByRole("button", { name: "1" })).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(canvas.getByRole("button", { name: "3" }));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "20" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 20 });
    await expect(canvas.getByRole("button", { name: "Pages 2 to 15" })).toBeVisible();
  },
});

export const Ellipsis = meta.story({
  name: "Ellipsis jumps",
  args: { page: 10 },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("button", { name: "10" })).toHaveAttribute("aria-current", "page");
    const before = canvas.getByRole("button", { name: "Pages 2 to 8" });
    await expect(before).toHaveTextContent("…");
    await expect(canvas.getByRole("button", { name: "Pages 12 to 19" })).toBeVisible();
    await userEvent.click(before);
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 5 });
    await expect(canvas.getByRole("button", { name: "5" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByRole("button", { name: "Pages 7 to 19" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 13 });
  },
});

export const WithArrows = meta.story({
  name: "With arrows",
  args: { prevNext: true, page: 2, total: 3, siblings: 2 },
  play: async ({ canvas, userEvent, args }) => {
    const previous = canvas.getByRole("button", { name: "Previous page" });
    const next = canvas.getByRole("button", { name: "Next page" });
    await expect(previous).toBeEnabled();
    await userEvent.click(next);
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 3 });
    await expect(next).toBeDisabled();
    await userEvent.click(previous);
    await userEvent.click(canvas.getByRole("button", { name: "Previous page" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 1 });
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await expect(canvas.getAllByRole("button")).toHaveLength(5);
  },
});

export const PrevNext = meta.story({
  name: "Previous and next only",
  args: {
    mode: "prev-next",
    page: 1,
    total: 2,
    prevLabel: words.previous,
    nextLabel: words.next,
    label: words.results,
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("navigation", { name: words.results })).toBeVisible();
    const next = canvas.getByRole("button", { name: "Next page" });
    await expect(next).toHaveTextContent(words.next);
    await expect(canvas.getByRole("button", { name: "Previous page" })).toHaveTextContent(words.previous);
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await userEvent.click(next);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith({ page: 2 });
    await expect(next).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeEnabled();
  },
});

export const Radio = meta.story({
  name: "Radio",
  args: { mode: "radio", total: 4, page: 2, name: "sheet", label: words.sheets, direction: "vertical" },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("group", { name: words.sheets })).toBeVisible();
    await expect(canvas.getAllByRole("radio")).toHaveLength(4);
    await expect(canvas.getByRole("radio", { name: "2" })).toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: "4" }));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith({ page: 4 });
    await expect(canvas.getByRole("radio", { name: "4" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "2" })).not.toBeChecked();
    await expect(canvas.getByRole("radio", { name: "1" })).toHaveAttribute("name", "sheet");
  },
});

export const NoPages = meta.story({
  name: "No pages",
  args: { total: 0, mode: "radio" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("radio")).toHaveLength(1);
    await expect(canvas.getByRole("radio", { name: "1" })).toBeChecked();
  },
});

export const Narrow = meta.story({
  name: "Narrow",
  args: { prevNext: true, page: 4, total: 20 },
  render: (args) => html`
    <ui-box width="52">
      <ui-pagination .page=${args.page} .total=${args.total} ?prev-next=${args.prevNext} @ui-change=${changed(args)}>
      </ui-pagination>
    </ui-box>
  `,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const current = await canvas.findByRole("button", { name: "Page 4 of 20" });
    await expect(current).toHaveTextContent("4 / 20");
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(canvas.getAllByRole("button")).toHaveLength(3);
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 5 });
    await expect(canvas.getByRole("button", { name: "Page 5 of 20" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Page 5 of 20" }));
    await expect(args.onChange).toHaveBeenCalledOnce();
    const box = canvasElement.querySelector<UiBox>("ui-box")!;
    box.width = "full";
    await expect(await canvas.findByRole("button", { name: "Pages 2 to 3" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "5" })).toHaveAttribute("aria-current", "page");
    box.width = "52";
    await expect(await canvas.findByRole("button", { name: "Page 5 of 20" })).toBeVisible();
  },
});

export const InShadowRoot = meta.story({
  name: "At a shadow root",
  parameters: {
    docs: { description: { story: "With no parent element to measure it keeps every number." } },
  },
  render: (args) => {
    const host = document.createElement("div");
    render(
      html`<ui-pagination .page=${args.page} .total=${7} @ui-change=${changed(args)}></ui-pagination>`,
      host.attachShadow({ mode: "open" }),
    );
    return host;
  },
  play: async ({ canvasElement, userEvent, args }) => {
    const host = [...canvasElement.querySelectorAll("div")].find((d) => d.shadowRoot)!;
    const shadow = within(host.shadowRoot as unknown as HTMLElement);
    await expect(shadow.getByRole("navigation", { name: "Pagination" })).toBeVisible();
    await userEvent.click(shadow.getByRole("button", { name: "6" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ page: 6 });
    await userEvent.click(shadow.getByRole("button", { name: "2" }));
    await waitFor(() => expect(shadow.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page"));
    await expect(shadow.getAllByRole("button")).toHaveLength(7);
  },
});
