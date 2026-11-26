import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import {
  blockContext,
  mountElement,
  stagedCalls,
  stagedDashboard,
  type BlockArgs,
} from "../../../../.storybook/fixtures/widgets.ts";
import { frames } from "../../../lib/dashboard/tiling.ts";
import { m } from "../../../lib/i18n/index.ts";
import type { ViewBlocks } from "../../../lib/widgets/schema.ts";
import { renderBlocks } from "../registry.ts";
import "../../index.ts";
import "./form.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

const office = (path: string, method?: "POST" | "PATCH"): ViewBlocks["form"] => ({
  type: "form",
  fields: [{ type: "text", name: "name", label: "Name" }],
  value: { name: "Main office", deep: { a: 1, b: 2 } },
  save: { path, method },
});

const saves = () => stagedCalls().filter((c) => c.method === "call");
const change = (root: HTMLElement, value: object, at?: Element | null) =>
  (at ?? root.querySelector("ui-doc-form")!).dispatchEvent(
    new CustomEvent("ui-change", { detail: { value }, bubbles: true }),
  );

export const SavesChanges = meta.story({
  name: "Saves only what changed",
  render: (args) =>
    html`${renderBlocks(
      [office("/settings/save")],
      blockContext(args, { data: { endpoints: { "POST /settings/save": () => ({ ok: true }) } } }),
    )}`,
  play: async ({ canvasElement, args }) => {
    change(canvasElement, { name: "Main", deep: { a: 1, b: 2 } });
    change(canvasElement, { name: "Main office 2", deep: { a: 1, b: 3 }, extra: [1] });
    await waitFor(() => expect(args.reload).toHaveBeenCalledTimes(1));
    await expect(saves()).toHaveLength(1);
    await expect(saves()[0]!.args).toEqual([
      "POST",
      "/settings/save",
      { name: "Main office 2", deep: { b: 3 }, extra: [1] },
    ]);
    change(canvasElement, { name: "Main office", deep: { a: 1, b: 2 } });
    await frames(2);
    await expect(saves()).toHaveLength(1);
    await expect(args.reload).toHaveBeenCalledTimes(1);
    change(canvasElement, { name: "x" }, canvasElement.querySelector("ui-doc-form")!.firstElementChild);
    await frames(2);
    await expect(saves()).toHaveLength(1);
  },
});

export const Typing = meta.story({
  name: "Saves while typing",
  render: (args) =>
    html`${renderBlocks(
      [office("/settings/name")],
      blockContext(args, { data: { endpoints: { "POST /settings/name": () => ({ ok: true }) } } }),
    )}`,
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(await canvas.findByRole("textbox", { name: "Name" }), " West");
    await waitFor(() => expect(saves().at(-1)!.args[2]).toEqual({ name: "Main office West" }));
    await waitFor(() => expect(args.reload).toHaveBeenCalled());
  },
});

export const SaveFails = meta.story({
  name: "Says when saving fails",
  render: (args) =>
    html`${renderBlocks(
      [office("/settings/office", "PATCH"), office("/settings/missing")],
      blockContext(args, {
        data: { endpoints: { "PATCH /settings/office": () => Promise.reject(new Error("")) } },
      }),
    )}`,
  play: async ({ canvasElement, args }) => {
    const [failing, missing] = [...canvasElement.querySelectorAll("ui-doc-form")];
    change(canvasElement, { name: "Head office" }, failing);
    await waitFor(() =>
      expect(stagedDashboard().notices).toEqual([
        { message: m.widget_save_failed(), tone: "error", action: undefined },
      ]),
    );
    change(canvasElement, { name: "Branch" }, missing);
    await waitFor(() =>
      expect(stagedDashboard().notices.at(-1)).toMatchObject({ message: "Not Found", tone: "error" }),
    );
    await expect(args.reload).not.toHaveBeenCalled();
  },
});
