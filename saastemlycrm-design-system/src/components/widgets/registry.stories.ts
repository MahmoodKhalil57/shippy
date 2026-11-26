import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../.storybook/fixtures/widgets.ts";
import { inCard, renderBlock, renderBlocks } from "./registry.ts";
import "./blocks.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

export const UnknownBlock = meta.story({
  name: "Unknown block",
  render: (args) => html`${renderBlock({ type: "kanban" } as never, blockContext(args))}`,
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("Unknown block")).toBeVisible();
    await expect(canvas.getByText('No renderer for "kanban".')).toBeVisible();
  },
});

export const Blocks = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [
        { type: "heading", text: "This week" },
        { type: "text", text: "Three vans leave before nine." },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("heading", { name: "This week" })).toBeVisible();
    await expect(canvas.getByText("Three vans leave before nine.")).toBeVisible();
  },
});

export const InCard = meta.story({
  name: "In a card",
  render: (args) => {
    const ctx = blockContext(args, { params: { period: "week" } });
    return html`${renderBlocks([{ type: "stats", items: [{ label: "Paid this week", value: "$4,200" }] }], inCard(ctx))}`;
  },
  play: async ({ canvasElement, args }) => {
    const ctx = blockContext(args, { params: { period: "week" } });
    const card = inCard(ctx);
    await expect(card.inCard).toBe(true);
    await expect(card.params).toEqual(ctx.params);
    await expect(inCard(card)).toBe(card);
    const stat = canvasElement.querySelector("ui-stat")!;
    await expect(stat.outlined).toBe(false);
    await expect(stat.fill).toBe(false);
  },
});
