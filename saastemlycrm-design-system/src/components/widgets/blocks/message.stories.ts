import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../../.storybook/fixtures/widgets.ts";
import { renderBlocks } from "../registry.ts";
import "./message.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

export const Assisted = meta.story({
  name: "Assisted, right to left",
  render: (args) =>
    html`${renderBlocks(
      [
        {
          type: "message",
          meta: ["From Riverside Bakery"],
          subject: "طلب إضافي",
          body: "نحتاج صندوقين إضافيين يوم الخميس.",
          dir: "rtl",
          lang: "ar",
          assist: true,
        },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("From Riverside Bakery")).toBeVisible();
    const window = canvasElement.querySelector("ui-mockup-window")!;
    await expect(window.querySelector("ui-flex")!.getAttribute("dir")).toBe("rtl");
    await expect(window.querySelector("ui-ai-text")!.text).toBe("نحتاج صندوقين إضافيين يوم الخميس.");
  },
});

export const Plain = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [{ type: "message", subject: "Order 1042", body: "Two more boxes on Thursday, please." }],
      blockContext(args),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Two more boxes on Thursday, please.")).toBeVisible();
    const flex = canvasElement.querySelector("ui-mockup-window ui-flex")!;
    await expect(flex.getAttribute("lang")).toBe("en");
    await expect(flex.getAttribute("dir")).toBe("ltr");
  },
});
