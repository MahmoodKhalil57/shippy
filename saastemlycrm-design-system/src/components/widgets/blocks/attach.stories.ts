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
import type { MemoryData } from "../../../lib/dashboard/memory.ts";
import { m } from "../../../lib/i18n/index.ts";
import type { ViewBlocks } from "../../../lib/widgets/schema.ts";
import { renderBlocks } from "../registry.ts";
import "./attach.ts";

type Spec = Omit<ViewBlocks["attach"], "type">;

const spec: Spec = {
  action: { label: "Attach proof" },
  text: "PDF or photo",
  heading: "Attach proof of delivery",
  intro: "Add the signed delivery note.",
  file: {
    name: "proof",
    legend: "Proof of delivery",
    hint: "A PDF",
    accept: ".pdf",
    required: true,
    upload: { collection: "files", data: { kind: "proof" } },
    sample: { filename: "proof.pdf", lines: ["Delivered to {who}", "Ref {ref}"], label: "Use a sample" },
  },
  fields: [
    { type: "text", name: "who", label: "Signed by", required: true },
    { type: "text", name: "ref", required: true },
    { type: "text", name: "note", label: "Note", defaultValue: "" },
  ],
  dictate: { label: "Dictate a note", field: "note" },
  extract: {
    label: "Read the note",
    what: "a delivery note",
    fields: [{ id: "signer", label: "Signer" }],
    into: { signer: { field: "who" }, extra: { field: "note", append: true } },
  },
  missing: "No proof yet",
  call: { path: "/proof", body: { order: "o1" } },
  confirmLabel: "Attach",
  done: "Proof attached",
};

const quiet: Spec = { ...spec, done: undefined, fields: undefined, dictate: undefined, extract: undefined };

const meta = preview.type<{ args: BlockArgs & { spec: Spec; data: MemoryData } }>().meta({
  args: {
    run: fn(),
    setParam: fn(),
    reload: fn(),
    mount: fn(mountElement),
    spec,
    data: {},
  },
  render: ({ spec, data, ...args }) =>
    html`${renderBlocks(
      [{ type: "attach", ...spec }],
      blockContext(args, {
        data: { ...data, endpoints: { "POST /proof": (body) => ({ ok: body }), ...data.endpoints } },
      }),
    )}`,
});

const modal = (root: HTMLElement) => root.querySelector("ui-modal")!;
const attach = (root: HTMLElement) => root.querySelector("app-attach")!;
const draft = (root: HTMLElement) => root.querySelector("ui-doc-form")!.value;
const confirm = async (root: HTMLElement) => {
  modal(root).dispatchEvent(new CustomEvent("ui-confirm", { cancelable: true }));
  await attach(root).updateComplete;
};
const pdf = () => new File(["%PDF"], "note.pdf", { type: "application/pdf" });

export const Closed = meta.story({
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "Attach proof" })).toBeEnabled();
    await expect(canvas.getByText("PDF or photo")).toBeVisible();
    await expect(modal(canvasElement).open).toBe(false);
  },
});

export const Open = meta.story({
  name: "Open dialog",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await waitFor(() => expect(canvas.getByRole("dialog", { name: "Attach proof of delivery" })).toBeVisible());
    await expect(modal(canvasElement).confirmDisabled).toBe(true);
    await expect(canvas.getByRole("button", { name: "Attach" })).toBeDisabled();
    await waitFor(() => expect(canvas.getByText("Add the signed delivery note.")).toBeVisible());
    await expect(canvas.getByText("No proof yet")).toBeVisible();
    await expect(canvasElement.querySelector("ui-ai-dictate")).toBeTruthy();
    await expect(canvasElement.querySelector("ui-ai-extract")).toBeTruthy();
    await userEvent.click(canvas.getByRole("button", { name: m.modal_cancel() }));
    await waitFor(() => expect(modal(canvasElement).open).toBe(false));
  },
});

export const FillDraft = meta.story({
  name: "Fill the draft",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await userEvent.type(await canvas.findByRole("textbox", { name: /^Signed by/ }), "Maya");
    await waitFor(() => expect(draft(canvasElement)).toEqual({ who: "Maya", note: "" }));
    canvasElement
      .querySelector("ui-doc-form")!
      .firstElementChild!.dispatchEvent(
        new CustomEvent("ui-change", { detail: { value: { who: "x" } }, bubbles: true }),
      );
    await attach(canvasElement).updateComplete;
    await expect(draft(canvasElement)).toEqual({ who: "Maya", note: "" });
    const dictate = canvasElement.querySelector("ui-ai-dictate")!;
    dictate.dispatchEvent(new CustomEvent("ui-select", { detail: { value: "Left at the door" } }));
    dictate.dispatchEvent(new CustomEvent("ui-select", { detail: { value: "Rang twice" } }));
    const extract = canvasElement.querySelector("ui-ai-extract")!;
    extract.dispatchEvent(
      new CustomEvent("ui-select", { detail: { values: { signer: "Jordan", extra: 3, gone: "x" } } }),
    );
    extract.dispatchEvent(new CustomEvent("ui-select", { detail: { values: { signer: "" } } }));
    await waitFor(() =>
      expect(draft(canvasElement)).toEqual({ who: "Jordan", note: "Left at the door\nRang twice\n3" }),
    );
  },
});

export const AsksFirst = meta.story({
  name: "Asks for the file, then the fields",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await expect(await canvas.findByRole("button", { name: "Attach" })).toBeDisabled();
    await confirm(canvasElement);
    await waitFor(() => expect(canvas.getByText(m.widget_attach({ what: "proof of delivery" }))).toBeVisible());
    const input = canvas.getByLabelText("Proof of delivery");
    await userEvent.upload(input, pdf());
    const field = canvasElement.querySelector("ui-file-input")!;
    await waitFor(() => expect(field.hint).toBe("note.pdf"));
    await expect(canvas.queryByText("No proof yet")).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Use a sample" })).toBeNull();
    await confirm(canvasElement);
    await waitFor(() => expect(canvas.getByText(m.widget_fill_in({ fields: "Signed by and ref" }))).toBeVisible());
    field.dispatchEvent(new CustomEvent("ui-change", { detail: { files: null } }));
    await waitFor(() => expect(field.hint).toBe("A PDF"));
    await expect(stagedCalls()).toEqual([]);
  },
});

export const Upload = meta.story({
  name: "Uploads, calls, says so and reloads",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await userEvent.type(await canvas.findByRole("textbox", { name: /^Signed by/ }), "Maya");
    await userEvent.type(canvas.getByRole("textbox", { name: /^Ref/ }), "R1");
    await userEvent.type(canvas.getByRole("textbox", { name: /^Note/ }), "ok");
    await userEvent.click(canvas.getByRole("button", { name: "Use a sample" }));
    const send = canvas.getByRole("button", { name: "Attach" });
    await waitFor(() => expect(send).toBeEnabled());
    await userEvent.click(send);
    await waitFor(() => expect(args.reload).toHaveBeenCalledTimes(1));
    const [create, call] = stagedCalls();
    await expect(create!.method).toBe("create");
    await expect(create!.args.slice(0, 2)).toEqual(["files", { kind: "proof" }]);
    const file = create!.args[2] as File;
    await expect(file.name).toBe("proof.pdf");
    await expect(await file.text()).toBe("Delivered to Maya\nRef R1");
    await expect(call).toMatchObject({
      args: ["POST", "/proof", { order: "o1", who: "Maya", note: "ok", ref: "R1", proof: "doc-1" }],
    });
    await expect(stagedDashboard().notices).toEqual([
      { message: "Proof attached", tone: "success", action: undefined },
    ]);
    await waitFor(() => expect(modal(canvasElement).open).toBe(false));
  },
});

export const SampleOnly = meta.story({
  name: "Sends a sample when no file is needed",
  args: {
    spec: {
      ...quiet,
      file: {
        ...spec.file,
        required: false,
        upload: { collection: "files" },
        sample: { filename: "delivery.pdf", lines: ["{x}"] },
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Attach" }));
    await waitFor(() => expect(args.reload).toHaveBeenCalledTimes(1));
    const [create] = stagedCalls();
    await expect(create!.args.slice(0, 2)).toEqual(["files", {}]);
    await expect((create!.args[2] as File).name).toBe("delivery.pdf");
    await expect(stagedDashboard().notices).toEqual([]);
  },
});

export const NoFile = meta.story({
  name: "Sends without a file",
  args: {
    spec: {
      ...quiet,
      call: { method: "PATCH", path: "/proof" },
      file: { ...spec.file, required: false, sample: undefined },
    },
    data: { endpoints: { "PATCH /proof": () => ({}) } },
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Attach" }));
    await waitFor(() => expect(args.reload).toHaveBeenCalledTimes(1));
    await expect(stagedCalls()).toMatchObject([{ method: "call", args: ["PATCH", "/proof", { proof: null }] }]);
  },
});

const failing: Spec = { ...spec, fields: undefined, file: { ...spec.file, required: false, sample: undefined } };

export const ErrorState = meta.story({
  name: "Error",
  args: { spec: { ...failing, call: { path: "/gone" } } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Attach" }));
    await waitFor(() => expect(canvas.getByText("Not Found")).toBeVisible());
    await expect(args.reload).not.toHaveBeenCalled();
  },
});

export const BlankError = meta.story({
  name: "Error without a message",
  args: {
    spec: { ...failing, call: { path: "/blank" } },
    data: { endpoints: { "POST /blank": () => Promise.reject(new Error("")) } },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Attach proof" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Attach" }));
    await waitFor(() => expect(canvas.getByText(m.widget_failed())).toBeVisible());
  },
});

export const Disabled = meta.story({
  name: "Disabled, with a reason",
  args: {
    spec: { ...spec, text: undefined, action: { label: "Attach proof", disabled: true, reason: "Ship it first" } },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Attach proof" })).toBeDisabled();
    await expect(canvas.getAllByText("Ship it first").length).toBeGreaterThan(0);
  },
});

export const DisabledPlain = meta.story({
  name: "Disabled",
  args: { spec: { ...spec, action: { label: "Attach proof", disabled: true } } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "Attach proof" })).toBeDisabled();
    await expect(canvasElement.textContent).not.toContain("Ship it first");
  },
});
