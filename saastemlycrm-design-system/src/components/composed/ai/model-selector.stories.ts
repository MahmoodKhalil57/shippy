import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor, type Mock } from "storybook/test";
import "./model-selector.ts";
import type { ModelGroup } from "./model-selector.ts";

const groups: ModelGroup[] = [
  {
    label: "Cloud",
    models: [
      { id: "fast", label: "Fast", icon: "cloud", description: "Quick answers for everyday questions" },
      { id: "deep", label: "Deep", icon: "cloud" },
    ],
  },
  { label: "On this device", models: [{ id: "local", label: "Local", icon: "device" }] },
];

const plain: ModelGroup[] = [{ label: "Models", models: [{ id: "basic", label: "Basic" }] }];

type Args = { groups: ModelGroup[]; value: string; disabled: boolean; onChange: Mock<(e: CustomEvent) => void> };

const changed = (call: unknown[] = []) => (call[0] as CustomEvent<{ value: string }>).detail.value;

const meta = preview.type<{ args: Args }>().meta({
  title: "Composed/Ai/Model selector",
  component: "ui-model-selector",
  args: { groups, value: "fast", disabled: false, onChange: fn() },
  argTypes: {
    groups: { control: "object", description: "Model groups, each with a heading and its models." },
    value: { control: "inline-radio", options: ["fast", "deep", "local", ""] },
    disabled: { control: "boolean", description: "Ignores picks while the assistant is busy." },
    onChange: { table: { category: "events" } },
  },
  parameters: { layout: "centered" },
  render: (args) =>
    html`<ui-model-selector
      .groups=${args.groups}
      value=${args.value}
      ?disabled=${args.disabled}
      @ui-change=${args.onChange}
    ></ui-model-selector>`,
});

export const Playground = meta.story({
  name: "Playground",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Model: Fast" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    const panel = canvas.getByRole("dialog", { name: "Model: Fast" });
    await waitFor(() => expect(panel).toBeVisible());
    await expect(canvas.getByRole("heading", { name: "Cloud" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "On this device" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /^Fast/ })).toHaveTextContent(
      "Quick answers for everyday questions",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Deep" }));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(changed(args.onChange.mock.calls[0])).toBe("deep");
    await waitFor(() => expect(panel).not.toBeVisible());
    const selector = canvasElement.querySelector("ui-model-selector")!;
    await expect(selector.value).toBe("deep");
    await waitFor(() => expect(canvas.getByRole("button", { name: "Model: Deep" })).toBeInTheDocument());
  },
});

export const MarksTheCurrentModel = meta.story({
  name: "Marks the current model",
  args: { value: "local" },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Model: Local" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    await expect(canvas.getByRole("button", { name: "Local" })).toHaveClass("menu-active");
    await expect(canvas.getByRole("button", { name: "Deep" })).not.toHaveClass("menu-active");
  },
});

export const UnknownValueShowsTheFirst = meta.story({
  name: "Unknown value shows the first",
  args: { value: "retired" },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Model: Fast" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    await expect(canvas.getByRole("button", { name: /^Fast/ })).toHaveClass("menu-active");
    await expect(canvas.getByRole("button", { name: "Local" })).not.toHaveClass("menu-active");
  },
});

export const Disabled = meta.story({
  name: "Disabled ignores picks",
  args: { disabled: true },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Model: Fast" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    await userEvent.click(canvas.getByRole("button", { name: "Local" }));
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvasElement.querySelector("ui-model-selector")!.value).toBe("fast");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(canvas.getByRole("dialog", { name: "Model: Fast" })).toBeVisible());
  },
});

export const WithoutIcons = meta.story({
  name: "Without icons",
  args: { groups: plain, value: "basic" },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Model: Basic" });
    await expect(trigger.querySelectorAll("ui-icon")).toHaveLength(1);
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    const basic = canvas.getByRole("button", { name: "Basic" });
    await expect(basic.querySelector("ui-icon")).toBeNull();
    await userEvent.click(basic);
    await expect(changed(args.onChange.mock.calls[0])).toBe("basic");
    await expect(canvasElement.querySelector("ui-model-selector")!.value).toBe("basic");
  },
});

export const NoModels = meta.story({
  name: "No models",
  args: { groups: [], value: "" },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Model:" });
    await expect(trigger).toHaveTextContent("");
  },
});
