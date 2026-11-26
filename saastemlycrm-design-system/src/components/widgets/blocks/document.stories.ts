import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../../.storybook/fixtures/widgets.ts";
import { renderBlocks } from "../registry.ts";
import "../../index.ts";
import "./document.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

export const Quote = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [
        {
          type: "document",
          issuer: { name: "Main office" },
          title: "Quote",
          meta: [],
          columns: [{ key: "item", label: "Item" }],
          lines: [{ item: "Shelving, oak" }],
        },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector("ui-document")!.doc).toMatchObject({ title: "Quote" });
    await expect(await canvas.findByText("Shelving, oak")).toBeVisible();
    await expect(canvas.getByText("Main office")).toBeVisible();
  },
});
