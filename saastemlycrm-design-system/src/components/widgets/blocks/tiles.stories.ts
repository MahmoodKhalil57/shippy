import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../../.storybook/fixtures/widgets.ts";
import { renderBlocks } from "../registry.ts";
import "./tiles.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

export const Cards = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [
        {
          type: "tiles",
          look: "card",
          figure: true,
          fit: "md",
          items: [
            {
              overline: "This week",
              heading: "12",
              text: "orders",
              tags: [{ label: "Up" }],
              actions: [{ label: "Open orders" }],
              filled: true,
            },
            { heading: "3" },
          ],
        },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const grid = canvasElement.querySelector("ui-grid")!;
    await expect(grid.fit).toBe("md");
    await expect([...grid.querySelectorAll("ui-card")].map((c) => c.variant)).toEqual(["filled", undefined]);
    await expect(canvas.getByText("12").closest("ui-text")!.variant).toBe("headline-md");
    await expect(canvas.getByText("orders").closest("ui-text")!.color).toBeUndefined();
    await userEvent.click(canvas.getByRole("button", { name: "Open orders" }));
    await expect(args.run).toHaveBeenCalledWith({ label: "Open orders" });
  },
});

export const Plain = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [{ type: "tiles", items: [{ heading: "Invoices", text: "Send and chase" }] }],
      blockContext(args),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector("ui-grid")!.fit).toBe("sm");
    await expect(canvasElement.querySelector("ui-card")).toBeNull();
    await expect(canvas.getByText("Invoices").closest("ui-text")!.variant).toBe("title-sm");
    await expect(canvas.getByText("Send and chase").closest("ui-text")!.color).toBe("muted");
  },
});
