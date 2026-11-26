import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../../.storybook/fixtures/widgets.ts";
import { renderBlocks } from "../registry.ts";
import "./settings.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

const call = { path: "/settings/set", body: { key: "notifications" } };

export const Settings = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [
        {
          type: "settings",
          items: [
            { label: "Email when paid", supporting: "Sent to the account owner", value: true, call, done: "Saved" },
            {
              label: "Digest",
              value: "daily",
              options: [
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
              ],
              call,
            },
            { label: "Text reminders", value: false, disabled: true, call },
            {
              label: "Language",
              value: "en",
              options: [{ label: "English", value: "en" }],
              disabled: true,
              call,
            },
            { label: "Currency", value: "usd", options: [{ label: "US dollar", value: "usd" }] },
            { label: "Region", supporting: "Set by your plan", value: "eu" },
          ],
        },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("Sent to the account owner")).toBeVisible();
    await expect(canvas.getByRole("switch", { name: "Text reminders" })).toBeDisabled();
    await expect(canvas.getByRole("combobox", { name: "Currency" })).toBeDisabled();
    await expect(canvas.getByRole("combobox", { name: "Language" })).toBeDisabled();
    await expect(canvas.getByRole("combobox", { name: "Region" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("switch", { name: "Email when paid" }));
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Digest" }), "weekly");
    await expect(args.run).toHaveBeenCalledTimes(2);
    await expect(args.run).toHaveBeenNthCalledWith(1, {
      label: "Email when paid",
      call: { ...call, body: { key: "notifications", value: false } },
      done: "Saved",
      reply: true,
      undo: { ...call, body: { key: "notifications", value: true } },
    });
    await expect(args.run).toHaveBeenNthCalledWith(2, {
      label: "Digest",
      call: { ...call, body: { key: "notifications", value: "weekly" } },
      done: undefined,
      reply: true,
      undo: { ...call, body: { key: "notifications", value: "daily" } },
    });
    canvas.getByRole("combobox", { name: "Currency" }).dispatchEvent(new Event("change", { bubbles: true }));
    await expect(args.run).toHaveBeenCalledTimes(2);
  },
});
