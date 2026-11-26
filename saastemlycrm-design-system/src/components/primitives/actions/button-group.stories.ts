import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./button-group.ts";
import type { ButtonGroupOption } from "./button-group.ts";

const periods: ButtonGroupOption[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
];

const views: ButtonGroupOption[] = [
  { value: "list", label: "List", icon: "list" },
  { value: "board", label: "Board", icon: "columns" },
  { value: "calendar", label: "Calendar", icon: "calendar" },
  { value: "timeline", label: "Timeline", icon: "timeline" },
];

const statuses: ButtonGroupOption[] = [
  { value: "draft", label: "Draft", tone: "neutral" },
  { value: "sent", label: "Sent", tone: "info" },
  { value: "paid", label: "Paid", tone: "success" },
  { value: "overdue", label: "Overdue", tone: "warning" },
  { value: "void", label: "Void", tone: "error" },
];

const stages: ButtonGroupOption[] = [
  { value: "new", label: "New leads", hue: 0 },
  { value: "qualified", label: "Qualified", hue: 1 },
  { value: "proposal", label: "Proposal", hue: 2 },
  { value: "won", label: "Won", hue: 3 },
];

const formats: ButtonGroupOption[] = [
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Spreadsheet", disabled: true },
  { value: "json", label: "JSON" },
];

const channels: ButtonGroupOption[] = [
  { value: "mail", label: "Email", icon: "mail" },
  { value: "phone", label: "Phone", icon: "phone" },
  { value: "chat", label: "Chat", icon: "chat", disabled: true },
];

const meta = preview.type<{ args: { onChange: (e: Event) => void } }>().meta({
  title: "Primitives/Actions/Button group",
  component: "ui-button-group",
  args: {
    label: "Period",
    select: "single",
    value: "week",
    values: ["week"],
    size: "sm",
    options: periods,
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    select: { control: "inline-radio", options: ["single", "multi"] },
    value: { control: "text" },
    values: { control: "object" },
    size: { control: "inline-radio", options: ["xs", "sm"] },
    options: { control: "object" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-button-group
      label=${ifDefined(args.label)}
      select=${ifDefined(args.select)}
      value=${ifDefined(args.value)}
      size=${ifDefined(args.size)}
      .values=${args.values ?? []}
      .options=${args.options ?? []}
      @ui-change=${args.onChange}
    ></ui-button-group>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the group; picking an option calls onChange." } } },
  play: async ({ canvas, userEvent, args }) => {
    const week = canvas.getByRole("radio", { name: "Week" });
    await expect(week).toHaveAttribute("aria-checked", "true");
    await userEvent.click(canvas.getByRole("radio", { name: "Month" }));
    await expect(canvas.getByRole("radio", { name: "Month" })).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledOnce();
    await userEvent.keyboard("{ArrowRight}");
    const quarter = canvas.getByRole("radio", { name: "Quarter" });
    await expect(quarter).toHaveFocus();
    await expect(quarter).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: "quarter" } }));
    await userEvent.click(quarter);
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await userEvent.keyboard("{ArrowUp}");
    const month = canvas.getByRole("radio", { name: "Month" });
    await expect(month).toHaveFocus();
    await expect(month).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowDown}");
    await expect(quarter).toHaveFocus();
    await expect(args.onChange).toHaveBeenCalledTimes(4);
    await userEvent.keyboard("{Home}");
    await expect(quarter).toHaveFocus();
    await expect(args.onChange).toHaveBeenCalledTimes(4);
  },
});

export const MultiToggle = meta.story({
  name: "Multi toggle",
  args: { label: "Invoice status", select: "multi", value: "", values: ["sent"], options: statuses },
  play: async ({ canvas, userEvent, args }) => {
    const sent = canvas.getByRole("button", { name: "Sent" });
    const paid = canvas.getByRole("button", { name: "Paid" });
    await expect(sent).toHaveAttribute("aria-pressed", "true");
    await expect(paid).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(paid);
    await expect(paid).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(sent);
    await expect(sent).toHaveAttribute("aria-pressed", "false");
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { values: ["paid"] } }));
    await userEvent.keyboard("{ArrowRight}");
    await expect(paid).toHaveFocus();
    await expect(sent).toHaveAttribute("aria-pressed", "false");
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
});

export const SkipsDisabled = meta.story({
  name: "Skips disabled",
  args: { label: "Export format", value: "csv", values: [], options: formats },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("radio", { name: "Spreadsheet" })).toBeDisabled();
    canvas.getByRole("radio", { name: "CSV" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    const json = canvas.getByRole("radio", { name: "JSON" });
    await expect(json).toHaveFocus();
    await expect(json).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const SingleSelect = meta.story({
  name: "Single select",
  parameters: {
    docs: {
      description: {
        story: "A radiogroup with one tab stop: arrow keys move the selection, and the selected item shows a check.",
      },
    },
  },
  render: () => html`
    <ui-button-group label="Period" value="week" .options=${periods}></ui-button-group>
    <ui-button-group label="View" value="board" .options=${views}></ui-button-group>
  `,
});

export const MultiSelect = meta.story({
  name: "Multi select",
  parameters: {
    docs: { description: { story: "Each item is a toggle button reporting aria-pressed, and any number can be on." } },
  },
  render: () => html`
    <ui-button-group
      label="Invoice status"
      select="multi"
      .values=${["sent", "overdue"]}
      .options=${statuses}
    ></ui-button-group>
    <ui-button-group
      label="Pipeline stage"
      select="multi"
      .values=${["qualified"]}
      .options=${stages}
    ></ui-button-group>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-button-group label="Period, extra small" size="xs" value="day" .options=${periods}></ui-button-group>
    <ui-button-group label="Period, small" size="sm" value="day" .options=${periods}></ui-button-group>
  `,
});

export const DisabledOptions = meta.story({
  name: "Disabled options",
  parameters: { docs: { description: { story: "Arrow keys skip disabled options." } } },
  render: () => html`
    <ui-button-group label="Export format" value="pdf" .options=${formats}></ui-button-group>
    <ui-button-group label="Channels" select="multi" .values=${["mail"]} .options=${channels}></ui-button-group>
  `,
});
