import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import "./suggestions.ts";
import "../layout/box.ts";

const items = [
  "Where is my order?",
  "Change the delivery address",
  "Start a return",
  "Download an invoice",
  "Update my payment card",
  "Talk to a person",
];

const narrow = (content: unknown) => html`<ui-box width="96" border rounded="box" padding="3">${content}</ui-box>`;

const picked = (value: string) => expect.objectContaining({ detail: { value } });

const meta = preview.type<{ args: { onSelect: (e: CustomEvent<{ value: string }>) => void } }>().meta({
  title: "Primitives/Ai/Suggestions",
  component: "ui-suggestions",
  args: {
    items: items.slice(0, 4),
    wrap: false,
    disabled: false,
    onSelect: fn(),
  },
  argTypes: {
    items: { control: "object", description: "The suggestions, in order." },
    onSelect: { table: { category: "events" } },
  },
  render: (args) =>
    narrow(
      html`<ui-suggestions
        .items=${args.items}
        ?wrap=${args.wrap}
        ?disabled=${args.disabled}
        @ui-select=${args.onSelect}
      ></ui-suggestions>`,
    ),
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the suggestions; picking one fires ui-select." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const group = canvas.getByRole("group", { name: "Suggestions" });
    await expect(group.querySelectorAll("button")).toHaveLength(4);
    await userEvent.click(canvas.getByRole("button", { name: "Start a return" }));
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(args.onSelect).toHaveBeenLastCalledWith(picked("Start a return"));
    canvas.getByRole("button", { name: "Where is my order?" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith(picked("Where is my order?"));
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Change the delivery address" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(args.onSelect).toHaveBeenLastCalledWith(picked("Change the delivery address"));
    await expect(args.onSelect).toHaveBeenCalledTimes(3);
  },
});

export const Wrapped = meta.story({
  name: "Wrapped",
  args: { wrap: true, items },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole("group", { name: "Suggestions" })).flexWrap).toBe("wrap");
    const first = canvas.getByRole("button", { name: items[0] }).getBoundingClientRect();
    const last = canvas.getByRole("button", { name: items[items.length - 1] }).getBoundingClientRect();
    await expect(last.top).toBeGreaterThan(first.top);
  },
});

export const DisabledDoesNotPick = meta.story({
  name: "Disabled does not pick",
  args: { disabled: true, wrap: true },
  play: async ({ canvas, args }) => {
    for (const b of canvas.getAllByRole("button")) await expect(b).toBeDisabled();
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
});

export const OneScrollingRow = meta.story({
  name: "One scrolling row",
  parameters: {
    docs: {
      description: { story: "By default suggestions stay on one line and scroll sideways, fading out at the edge." },
    },
  },
  render: () => narrow(html`<ui-suggestions .items=${items}></ui-suggestions>`),
});

export const Wrapping = meta.story({
  name: "Wrapping",
  render: () => narrow(html`<ui-suggestions wrap .items=${items}></ui-suggestions>`),
});

export const Disabled = meta.story({
  name: "Disabled",
  parameters: { docs: { description: { story: "Disable suggestions while the assistant is still answering." } } },
  render: () => narrow(html`<ui-suggestions wrap disabled .items=${items.slice(0, 3)}></ui-suggestions>`),
});
