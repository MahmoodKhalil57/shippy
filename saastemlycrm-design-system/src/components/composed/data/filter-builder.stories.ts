import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor, within } from "storybook/test";
import "./filter-builder.ts";
import type { FilterCondition, FilterField, FilterMatch } from "./filter-builder.ts";

const regions = ["North", "South", "East", "West", "Central", "Coastal", "Highland", "Valley", "Metro", "Rural"];

const fields: FilterField[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "amount", label: "Amount", type: "number" },
  { name: "due", label: "Due date", type: "date" },
  {
    name: "stage",
    label: "Stage",
    type: "select",
    options: [
      { label: "Open", value: "open" },
      { label: "Won", value: "won" },
      { label: "Lost", value: "lost" },
    ],
  },
  {
    name: "region",
    label: "Region",
    type: "select",
    options: regions.map((r) => ({ label: r, value: r.toLowerCase() })),
  },
  { name: "tags", label: "Tags", type: "select" },
  { name: "active", label: "Active", type: "boolean" },
];

const samples = {
  two: [
    { field: "title", operator: "like", value: "report" },
    { field: "amount", operator: "greater_than", value: "100" },
  ] satisfies FilterCondition[],
  labels: [
    { field: "stage", operator: "in", value: ["open", "won", "lost"] },
    { field: "stage", operator: "not_in", value: "won" },
    { field: "region", operator: "in", value: ["north", "unknown"] },
    { field: "title", operator: "exists", value: true },
    { field: "title", operator: "in", value: "draft" },
    { field: "archived", operator: "equals", value: "yes" },
    { field: "active", operator: "equals", value: false },
  ] satisfies FilterCondition[],
};

type Change = { value: FilterCondition[]; match: FilterMatch; where?: Record<string, unknown> };

const meta = preview
  .type<{
    args: {
      fields: FilterField[];
      value: FilterCondition[];
      match: FilterMatch;
      onChange: (e: CustomEvent<Change>) => void;
    };
  }>()
  .meta({
    title: "Composed/Data/Filter Builder",
    component: "ui-filter-builder",
    args: { fields, value: [], match: "and", onChange: fn() },
    argTypes: {
      fields: { control: "object", description: "Filterable fields with their type and, for selects, options." },
      value: { control: "object", description: "The current conditions, one chip each." },
      match: {
        control: "inline-radio",
        options: ["and", "or"],
        description: "Whether all or any condition must hold.",
      },
      onChange: { table: { category: "events" } },
    },
    render: (args) =>
      html`<ui-filter-builder
        .fields=${args.fields}
        .value=${args.value}
        match=${args.match}
        @ui-change=${args.onChange}
      ></ui-filter-builder>`,
  });

const changed = (spy: unknown, call = 0) => (spy as ReturnType<typeof fn>).mock.calls[call]![0].detail as Change;

const open = async (canvas: ReturnType<typeof within>, userEvent: { click: (el: Element) => Promise<void> }) => {
  await userEvent.click(await canvas.findByRole("button", { name: "Add filter" }));
  const panel = await canvas.findByRole("dialog", { name: "Add filter" });
  await waitFor(() => expect(panel).toBeVisible());
  return within(panel);
};

export const Playground = meta.story({
  name: "Playground",
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.queryByRole("button", { name: "Clear filters" })).toBeNull();
    const panel = await open(canvas, userEvent);
    await expect(panel.getByRole("combobox", { name: "Field" })).toHaveValue("title");
    await expect(panel.getByRole("combobox", { name: "Is" })).toHaveValue("like");
    const add = panel.getByRole("button", { name: "Add filter" });
    await expect(add).toBeDisabled();
    await expect(panel.queryByRole("button", { name: "Remove" })).toBeNull();
    const input = panel.getByRole("textbox", { name: "Value" });
    await expect(input).toHaveAttribute("placeholder", "Value");
    await userEvent.type(input, "report");
    await waitFor(() => expect(add).toBeEnabled());
    await userEvent.click(add);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(changed(args.onChange)).toEqual({
      value: [{ field: "title", operator: "like", value: "report" }],
      match: "and",
      where: { title: { like: "report" } },
    });
    await waitFor(() => expect(canvas.getByRole("dialog", { hidden: true })).not.toBeVisible());
    const chip = await canvas.findByRole("button", { name: /Title\s*contains\s*report/ });
    await expect(chip).toBeVisible();
    await expect(canvas.queryByRole("combobox", { name: "Match" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }));
    await expect(changed(args.onChange, 1)).toEqual({ value: [], match: "and", where: undefined });
    await waitFor(() => expect(canvas.queryByRole("button", { name: /Title\s*contains/ })).toBeNull());
  },
});

export const EditAndRemove = meta.story({
  name: "Edit and remove",
  args: { value: samples.two },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    await expect(await canvas.findByRole("combobox", { name: "Match" })).toHaveValue("and");
    await userEvent.click(canvas.getByRole("button", { name: /Amount\s*>\s*100/ }));
    const dialog = canvas.getByRole("dialog", { hidden: true });
    await waitFor(() => expect(dialog).toBeVisible());
    const panel = within(dialog);
    await expect(panel.getByRole("combobox", { name: "Field" })).toHaveValue("amount");
    await expect(panel.getByRole("spinbutton", { name: "Value" })).toHaveValue(100);
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Is" }), "less_than_equal");
    await expect(panel.getByRole("spinbutton", { name: "Value" })).toHaveValue(100);
    await userEvent.click(panel.getByRole("button", { name: "Update" }));
    await expect(changed(args.onChange)).toEqual({
      value: [samples.two[0], { field: "amount", operator: "less_than_equal", value: "100" }],
      match: "and",
      where: { and: [{ title: { like: "report" } }, { amount: { less_than_equal: 100 } }] },
    });
    await waitFor(() => expect(dialog).not.toBeVisible());
    await userEvent.click(await canvas.findByRole("button", { name: /Title\s*contains\s*report/ }));
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(panel.getByRole("button", { name: "Remove" }));
    await expect(changed(args.onChange, 1).value).toEqual([
      { field: "amount", operator: "less_than_equal", value: "100" },
    ]);
    await waitFor(() => expect(dialog).not.toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("combobox", { name: "Match" })).toBeNull());
    await userEvent.click(canvas.getByRole("button", { name: "Remove filter: Amount" }));
    await expect(changed(args.onChange, 2)).toEqual({ value: [], match: "and", where: undefined });
    await expect(canvasElement.querySelector("ui-chip")).toBeNull();
  },
});

export const MatchAny = meta.story({
  name: "Match any",
  args: { value: samples.two },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.selectOptions(await canvas.findByRole("combobox", { name: "Match" }), "or");
    await expect(changed(args.onChange)).toEqual({
      value: samples.two,
      match: "or",
      where: { or: [{ title: { like: "report" } }, { amount: { greater_than: 100 } }] },
    });
  },
});

export const KeyboardOpensAFreshFilter = meta.story({
  name: "Keyboard opens a fresh filter",
  args: { value: samples.two },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByRole("button", { name: /Title\s*contains\s*report/ }));
    const dialog = canvas.getByRole("dialog", { hidden: true });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByRole("button", { name: "Update" })).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Update" }));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await waitFor(() => expect(dialog).not.toBeVisible());
    const trigger = canvas.getByRole("button", { name: "Add filter" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(dialog).toBeVisible());
    const panel = within(dialog);
    await expect(panel.getByRole("button", { name: "Add filter" })).toBeDisabled();
    await expect(panel.queryByRole("button", { name: "Remove" })).toBeNull();
    await expect(panel.getByRole("textbox", { name: "Value" })).toHaveValue("");
  },
});

export const TextOperators = meta.story({
  name: "Text operators",
  play: async ({ canvas, userEvent, args }) => {
    const panel = await open(canvas, userEvent);
    const input = panel.getByRole("textbox", { name: "Value" });
    await userEvent.type(input, "{Enter}");
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.type(input, "draft");
    const op = panel.getByRole("combobox", { name: "Is" });
    await userEvent.selectOptions(op, "not_like");
    await expect(panel.getByRole("textbox", { name: "Value" })).toHaveValue("draft");
    await userEvent.selectOptions(op, "exists:true");
    await expect(panel.queryByRole("textbox", { name: "Value" })).toBeNull();
    await expect(panel.getByRole("button", { name: "Add filter" })).toBeEnabled();
    await userEvent.selectOptions(op, "exists:false");
    await expect(op).toHaveValue("exists:false");
    await userEvent.selectOptions(op, "equals");
    const cleared = panel.getByRole("textbox", { name: "Value" });
    await expect(cleared).toHaveValue("");
    await userEvent.type(cleared, "Quarterly{Enter}");
    await expect(changed(args.onChange)).toEqual({
      value: [{ field: "title", operator: "equals", value: "Quarterly" }],
      match: "and",
      where: { title: { equals: "Quarterly" } },
    });
    await expect(await canvas.findByRole("button", { name: /Title\s*is\s*Quarterly/ })).toBeVisible();
  },
});

export const NumberDateAndBoolean = meta.story({
  name: "Number, date and boolean",
  play: async ({ canvas, userEvent, args }) => {
    let panel = await open(canvas, userEvent);
    const field = panel.getByRole("combobox", { name: "Field" });
    await userEvent.selectOptions(field, "amount");
    await expect(panel.getByRole("combobox", { name: "Is" })).toHaveValue("equals");
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Is" }), "greater_than");
    const amount = panel.getByRole("spinbutton", { name: "Value" });
    await expect(amount).not.toHaveAttribute("placeholder", "Value");
    await userEvent.type(amount, "250");
    await userEvent.click(panel.getByRole("button", { name: "Add filter" }));
    await expect(changed(args.onChange).where).toEqual({ amount: { greater_than: 250 } });

    panel = await open(canvas, userEvent);
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Field" }), "due");
    await expect(panel.getByRole("combobox", { name: "Is" })).toHaveValue("greater_than");
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Is" }), "less_than");
    const date = canvas.getByLabelText("Value", { selector: "input[type=date]" });
    await userEvent.type(date, "2026-03-05");
    await expect(date).toHaveValue("2026-03-05");
    await userEvent.click(panel.getByRole("button", { name: "Add filter" }));
    await expect(changed(args.onChange, 1).where).toEqual({
      and: [{ amount: { greater_than: 250 } }, { due: { less_than: new Date(2026, 2, 5).toISOString() } }],
    });
    await expect(await canvas.findByRole("button", { name: /Due date\s*before\s*2026-03-05/ })).toBeVisible();

    panel = await open(canvas, userEvent);
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Field" }), "active");
    const op = panel.getByRole("combobox", { name: "Is" });
    await expect(op).toHaveValue("equals:true");
    await expect(panel.queryByRole("textbox")).toBeNull();
    await userEvent.selectOptions(op, "equals:false");
    await userEvent.click(panel.getByRole("button", { name: "Add filter" }));
    await expect(changed(args.onChange, 2).value[2]).toEqual({ field: "active", operator: "equals", value: false });
    await expect(await canvas.findByRole("button", { name: /^Active\s*is no$/ })).toBeVisible();
  },
});

export const SelectOptions = meta.story({
  name: "Select options",
  play: async ({ canvas, userEvent, args }) => {
    let panel = await open(canvas, userEvent);
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Field" }), "stage");
    await expect(panel.getByRole("combobox", { name: "Is" })).toHaveValue("in");
    await expect(panel.queryByRole("searchbox")).toBeNull();
    const add = panel.getByRole("button", { name: "Add filter" });
    await expect(add).toBeDisabled();
    await userEvent.click(panel.getByRole("checkbox", { name: "Open" }));
    await userEvent.click(panel.getByRole("checkbox", { name: "Won" }));
    await userEvent.click(panel.getByRole("checkbox", { name: "Lost" }));
    await userEvent.click(panel.getByRole("checkbox", { name: "Lost" }));
    await expect(panel.getByRole("checkbox", { name: "Lost" })).not.toBeChecked();
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Is" }), "not_in");
    await expect(panel.getByRole("checkbox", { name: "Won" })).toBeChecked();
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Is" }), "exists:true");
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Is" }), "in");
    await expect(panel.getByRole("checkbox", { name: "Open" })).not.toBeChecked();
    await userEvent.click(panel.getByRole("checkbox", { name: "Open" }));
    await userEvent.click(panel.getByRole("checkbox", { name: "Won" }));
    await userEvent.click(add);
    await expect(changed(args.onChange).where).toEqual({ stage: { in: ["open", "won"] } });
    await expect(await canvas.findByRole("button", { name: /Stage\s*is any of\s*Open or Won/ })).toBeVisible();

    panel = await open(canvas, userEvent);
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Field" }), "region");
    const search = panel.getByRole("searchbox", { name: "Search Region" });
    await expect(panel.getAllByRole("checkbox")).toHaveLength(10);
    await userEvent.type(search, "st");
    await waitFor(() => expect(panel.getAllByRole("checkbox")).toHaveLength(3));
    await expect(panel.getByRole("checkbox", { name: "Coastal" })).toBeVisible();
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Field" }), "tags");
    await expect(panel.queryByRole("searchbox")).toBeNull();
    await expect(panel.queryByRole("checkbox")).toBeNull();
    await userEvent.selectOptions(panel.getByRole("combobox", { name: "Field" }), "region");
    await expect(panel.getByRole("searchbox", { name: "Search Region" })).toHaveValue("");
    await expect(panel.getAllByRole("checkbox")).toHaveLength(10);
  },
});

export const ChipLabels = meta.story({
  name: "Chip labels",
  args: { value: samples.labels, match: "or" },
  play: async ({ canvas, userEvent }) => {
    await expect(await canvas.findByRole("combobox", { name: "Match" })).toHaveValue("or");
    await expect(canvas.getByRole("button", { name: /^Stage\s*is any of\s*Open or Won \+1$/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /^Stage\s*is none of\s*Won$/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /^Region\s*is any of\s*North or unknown$/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /^Title\s*is set$/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /^Title\s*contains\s*draft$/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /^Title\s*is\s*yes$/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /^Active\s*is no$/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: /^Stage\s*is none of\s*Won$/ }));
    const dialog = canvas.getByRole("dialog", { hidden: true });
    await waitFor(() => expect(dialog).toBeVisible());
    const panel = within(dialog);
    await expect(panel.getByRole("combobox", { name: "Is" })).toHaveValue("not_in");
    await expect(panel.getByRole("checkbox", { name: "Won" })).not.toBeChecked();
    await expect(panel.getByRole("button", { name: "Update" })).toBeEnabled();
  },
});

export const NoFields = meta.story({
  name: "No fields",
  args: { fields: [], value: samples.two },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector("ui-filter-builder")!;
    await expect(el).toBeInTheDocument();
    await expect(el.childElementCount).toBe(0);
  },
});
