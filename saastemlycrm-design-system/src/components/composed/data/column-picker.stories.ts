import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import "./column-picker.ts";
import type { PickerColumn } from "./column-picker.ts";

type Density = "0" | "-1" | "-2";

const contacts: PickerColumn[] = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
];

const samples = {
  contacts,
  requiredBetween: [
    { key: "email", label: "Email" },
    { key: "name", label: "Name", required: true },
    { key: "phone", label: "Phone" },
  ] satisfies PickerColumn[],
  templated: [
    { key: "name", label: "Name" },
    { key: "amount", label: html`Amount due` },
  ] satisfies PickerColumn[],
};

const meta = preview
  .type<{
    args: {
      columns: PickerColumn[];
      hiddenColumns: string[];
      defaults: string[];
      customized: boolean;
      density?: Density;
      onChange: (e: CustomEvent<{ hidden: string[]; order: string[]; reset: boolean }>) => void;
      onDensity: (e: CustomEvent<{ density: Density }>) => void;
    };
  }>()
  .meta({
    title: "Composed/Data/Column Picker",
    component: "ui-column-picker",
    args: {
      columns: contacts,
      hiddenColumns: ["status"],
      defaults: ["status"],
      customized: false,
      density: undefined,
      onChange: fn(),
      onDensity: fn(),
    },
    argTypes: {
      columns: {
        control: "object",
        description: "Columns in their current order; required ones cannot be hidden or moved.",
      },
      hiddenColumns: { control: "object", description: "Keys of the hidden columns." },
      defaults: { control: "object", description: "Keys hidden by default; differing from them shows Reset." },
      customized: { control: "boolean", description: "Shows Reset even when the hidden set matches the defaults." },
      density: {
        control: "inline-radio",
        options: ["0", "-1", "-2"],
        description: "Row height; unset hides the choice.",
      },
      onChange: { table: { category: "events" } },
      onDensity: { table: { category: "events" } },
    },
    render: (args) =>
      html`<ui-column-picker
        .columns=${args.columns}
        .hiddenColumns=${args.hiddenColumns}
        .defaults=${args.defaults}
        ?customized=${args.customized}
        .density=${args.density}
        @ui-change=${args.onChange}
        @ui-density=${args.onDensity}
      ></ui-column-picker>`,
  });

const detail = (spy: unknown, call = 0) => (spy as ReturnType<typeof fn>).mock.calls[call]![0].detail;

export const Playground = meta.story({
  name: "Playground",
  play: async ({ canvas, userEvent, args }) => {
    const trigger = await canvas.findByRole("button", { name: "Columns (3 of 4 shown)" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    const panel = await canvas.findByRole("dialog", { name: "Columns (3 of 4 shown)" });
    await waitFor(() => expect(panel).toBeVisible());
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.queryByRole("button", { name: "Reset" })).toBeNull();
    await expect(canvas.queryByRole("radiogroup", { name: "Row height" })).toBeNull();
    await expect(canvas.getByRole("checkbox", { name: "Name" })).toBeDisabled();
    await expect(canvas.getByRole("checkbox", { name: "Name" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "Status" })).not.toBeChecked();
    await expect(canvas.queryByRole("button", { name: "Move Name earlier" })).toBeNull();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Email" }));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(detail(args.onChange)).toEqual({
      hidden: ["status", "email"],
      order: ["name", "email", "phone", "status"],
      reset: false,
    });
    await expect(await canvas.findByRole("button", { name: "Columns (2 of 4 shown)" })).toBeVisible();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Status" }));
    await expect(detail(args.onChange, 1)).toEqual({
      hidden: ["email"],
      order: ["name", "email", "phone", "status"],
      reset: false,
    });
    const reset = await canvas.findByRole("button", { name: "Reset" });
    await userEvent.click(reset);
    await expect(detail(args.onChange, 2)).toEqual({ hidden: ["status"], order: [], reset: true });
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Reset" })).toBeNull());
    await expect(canvas.getByRole("checkbox", { name: "Email" })).toBeChecked();
  },
});

export const Reorder = meta.story({
  name: "Reorder",
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByRole("button", { name: /^Columns/ }));
    await expect(canvas.getByRole("button", { name: "Move Email earlier" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Move Status later" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Move Phone earlier" }));
    await expect(detail(args.onChange)).toEqual({
      hidden: ["status"],
      order: ["name", "phone", "email", "status"],
      reset: false,
    });
    await userEvent.click(canvas.getByRole("button", { name: "Move Phone later" }));
    await expect(detail(args.onChange, 1).order).toEqual(["name", "email", "status", "phone"]);
    await expect(args.onDensity).not.toHaveBeenCalled();
  },
});

export const RequiredColumnBlocksMoves = meta.story({
  name: "Required column blocks moves",
  args: { columns: samples.requiredBetween, hiddenColumns: [], defaults: [] },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Columns (3 of 3 shown)" }));
    const earlier = canvas.getByRole("button", { name: "Move Email earlier" });
    await expect(earlier).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Move Email later" }));
    await userEvent.click(canvas.getByRole("button", { name: "Move Phone earlier" }));
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.queryByRole("button", { name: "Move Name later" })).toBeNull();
  },
});

export const Customized = meta.story({
  name: "Customized",
  args: { customized: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByRole("button", { name: /^Columns/ }));
    await userEvent.click(await canvas.findByRole("button", { name: "Reset" }));
    await expect(detail(args.onChange)).toEqual({ hidden: ["status"], order: [], reset: true });
  },
});

export const RowHeight = meta.story({
  name: "Row height",
  args: { density: "0" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByRole("button", { name: /^Columns/ }));
    const group = canvas.getByRole("radiogroup", { name: "Row height" });
    await waitFor(() => expect(group).toBeVisible());
    await expect(canvas.getByRole("radio", { name: "Default" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(canvas.getByRole("radio", { name: "Compact" }));
    await expect(args.onDensity).toHaveBeenCalledOnce();
    await expect((args.onDensity as ReturnType<typeof fn>).mock.calls[0]![0].detail).toEqual({ density: "-1" });
    await expect(args.onChange).not.toHaveBeenCalled();
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Compact" })).toHaveAttribute("aria-checked", "true"));
    await userEvent.click(canvas.getByRole("radio", { name: "Dense" }));
    await expect((args.onDensity as ReturnType<typeof fn>).mock.calls[1]![0].detail).toEqual({ density: "-2" });
  },
});

export const RichLabels = meta.story({
  name: "Rich labels",
  args: { columns: samples.templated, hiddenColumns: [], defaults: [] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Columns (2 of 2 shown)" }));
    await expect(canvas.getByRole("checkbox", { name: "Amount due" })).toBeChecked();
    await expect(canvas.getByRole("button", { name: "Move amount earlier" })).toBeEnabled();
    await expect(canvas.getByRole("button", { name: "Move amount later" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Move Name earlier" })).toBeDisabled();
  },
});
