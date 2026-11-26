import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../../.storybook/fixtures/widgets.ts";
import { renderBlocks } from "../registry.ts";
import "./gantt.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

export const Schedule = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [
        {
          type: "gantt",
          label: "Job",
          periods: ["Mon", "Tue", "Wed"],
          rows: [
            { label: "Refit", supporting: "Crew A", from: 0, to: 1, tone: "info", tag: "Start" },
            { label: "Paint", from: 1, to: 2, tag: "Next" },
          ],
        },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByText("Refit")).toBeVisible();
    await expect(canvas.getByText("Crew A")).toBeVisible();
    await expect(canvas.getByText("Start").closest("ui-tag")!.tone).toBe("info");
    await expect(canvas.getByText("Next").closest("ui-tag")!.tone).toBe("neutral");
    const badges = [...canvasElement.querySelectorAll("ui-badge")].map((b) => [b.label, b.tone]);
    await expect(badges).toEqual([
      ["Refit, Tue", "info"],
      ["Paint, Wed", "neutral"],
    ]);
    const table = canvasElement.querySelector("ui-table")!;
    const [label] = table.columns;
    const [refit, paint] = table.rows;
    await expect(label!.supporting!(refit!, 0)).toBe("Crew A");
    await expect(label!.supporting!(paint!, 1)).toBe("");
  },
});
