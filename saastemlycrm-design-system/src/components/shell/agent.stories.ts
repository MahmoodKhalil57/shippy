import preview from "#.storybook/preview";
import type { Decorator } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { withDashboard } from "../../../.storybook/dashboard.ts";
import type { LocalAiState } from "../../lib/agent/ai-polyfill.ts";
import type { AgentTool } from "../../lib/agent/webmcp.ts";
import "./agent.ts";
import { fakeAi, shell, site, type Shell, type Turn } from "../../../.storybook/fixtures/shell.ts";

let current: Shell;
const withShell: Decorator = (story, context) => {
  const { model, local, turn, saved, role, quiet } = context.parameters as {
    model?: string;
    local?: LocalAiState;
    turn?: Turn;
    saved?: string;
    role?: string;
    quiet?: boolean;
  };
  try {
    if (saved) localStorage.setItem("saastemly:helper-model-v2", saved);
    else localStorage.removeItem("saastemly:helper-model-v2");
  } catch {}
  const own = site();
  current = shell({
    ai: fakeAi({ model, local }),
    site: quiet ? { ...own, assistant: { ...own.assistant!, suggestions: [], roleNotes: [] } } : own,
  });
  current.dashboard.ai.webmcp.provideAgentContext(() =>
    role ? { name: "Maya Patel", role: "Manager", roleId: role, page: "Invoices", path: "/" } : null,
  );
  if (turn) current.ai.setTurn(turn);
  return withDashboard(() => current.dashboard)(story, context);
};

const tool = (name: string, consequential = false): AgentTool => ({
  name,
  title: name.replace(/_/g, " "),
  description: name,
  inputSchema: {},
  annotations: consequential ? { consequentialHint: true } : { readOnlyHint: true },
  execute: () => Promise.resolve(null),
});

const meta = preview.meta({
  title: "Shell/Agent",
  component: "dashboard-agent",
  decorators: [withShell],
  parameters: { layout: "fullscreen" },
  render: () => html`<dashboard-agent></dashboard-agent>`,
});

const open = async (
  canvas: { findByRole: (r: string, o: object) => Promise<HTMLElement> },
  click: (e: HTMLElement) => Promise<void>,
) => {
  await click(await canvas.findByRole("button", { name: "Open the Helper" }));
  return canvas.findByRole("textbox", { name: "Message" });
};

export const Playground = meta.story({
  play: async ({ canvas, userEvent }) => {
    await open(canvas, (e) => userEvent.click(e));
    await waitFor(() => expect(canvas.getByText("How can I help?")).toBeVisible());
    await waitFor(() => expect(canvas.getByRole("button", { name: "Which invoices are overdue?" })).toBeVisible());
  },
});

export const Chat = meta.story({
  name: "A chat with tool calls",
  parameters: {
    turn: (async (_message, { onEvent }) => {
      onEvent({ type: "thought", text: "Look at the invoices first." });
      onEvent({ type: "status", text: "Reading the list" });
      onEvent({ type: "status", text: "Reading the list again" });
      onEvent({
        type: "tool",
        name: "find_documents",
        title: "Find records",
        input: { collection: "invoices" },
        status: "running",
      });
      onEvent({
        type: "tool",
        name: "find_documents",
        title: "Find records",
        input: { collection: "invoices" },
        status: "done",
        output: JSON.stringify({ sources: [{ label: "INV-1001", href: "/collections/invoices/i1" }, { label: 3 }] }),
      });
      onEvent({
        type: "tool",
        name: "get_document",
        title: "Open record",
        input: {},
        status: "failed",
        output: "x".repeat(1600),
      });
      onEvent({ type: "text", text: "Checking one more thing." });
      return "INV-1001 is **overdue**.";
    }) satisfies Turn,
  },
  play: async ({ canvas, userEvent }) => {
    const input = await open(canvas, (e) => userEvent.click(e));
    await userEvent.type(input, "Which invoices are late?{Enter}");
    await waitFor(() => expect(canvas.getByText("overdue")).toBeVisible());
    await expect(canvas.getByText("Which invoices are late?")).toBeVisible();
    await expect(canvas.getByRole("link", { name: /INV-1001/ })).toHaveAttribute("href", "/collections/invoices/i1");
    await expect(canvas.getByText("Find records")).toBeVisible();
    await expect(current.ai.turns).toEqual([{ message: "Which invoices are late?", model: "luna" }]);
  },
});

export const Approval = meta.story({
  name: "A change asks Allow",
  parameters: {
    turn: (async (_message, { confirm, onEvent }) => {
      onEvent({ type: "thought", text: "Planning." });
      const ok = await confirm(tool("delete_document", true), { collection: "invoices", id: "i2" });
      onEvent({
        type: "tool",
        name: "delete_document",
        title: "delete document",
        input: {},
        status: ok ? "done" : "declined",
      });
      return ok ? "Deleted INV-1002." : "";
    }) satisfies Turn,
  },
  play: async ({ canvas, userEvent }) => {
    const input = await open(canvas, (e) => userEvent.click(e));
    await userEvent.type(input, "Delete the draft{Enter}");
    await waitFor(() => expect(canvas.getByText("Allow: delete document?")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Allow" }));
    await waitFor(() => expect(canvas.getByText("Deleted INV-1002.")).toBeVisible());
  },
});

export const Declined = meta.story({
  name: "A change declined",
  parameters: Approval.input.parameters,
  play: async ({ canvas, userEvent }) => {
    const input = await open(canvas, (e) => userEvent.click(e));
    await userEvent.type(input, "Delete the draft{Enter}");
    await userEvent.click(await canvas.findByRole("button", { name: "Don’t" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "New chat" })).toBeVisible());
    await expect(canvas.queryByText("Deleted INV-1002.")).toBeNull();
  },
});

export const ErrorState = meta.story({
  name: "Error",
  parameters: { turn: (() => Promise.reject(new Error("The model is offline."))) satisfies Turn },
  play: async ({ canvas, userEvent }) => {
    const input = await open(canvas, (e) => userEvent.click(e));
    await userEvent.type(input, "Hello{Enter}");
    await waitFor(() => expect(canvas.getByText("The model is offline.")).toBeVisible());
  },
});

export const Stopped = meta.story({
  name: "Stopped while working",
  parameters: {
    turn: ((_message, { confirm, signal }) =>
      new Promise<string>((_resolve, reject) => {
        void confirm(tool("send_reminder", true), { id: "i1" });
        signal!.addEventListener("abort", () => reject(new DOMException("Stopped", "AbortError")));
      })) satisfies Turn,
  },
  play: async ({ canvas, userEvent }) => {
    const input = await open(canvas, (e) => userEvent.click(e));
    await userEvent.type(input, "Remind them{Enter}");
    await waitFor(() => expect(canvas.getByText("Allow: send reminder?")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Stop" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "New chat" })).toBeVisible());
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
});

export const LocalModel = meta.story({
  name: "Local model to download",
  parameters: { model: "aibrowser", local: "off" },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, (e) => userEvent.click(e));
    await userEvent.click(await canvas.findByRole("button", { name: "Download the AI model (about 800 MB)" }));
    await waitFor(() => expect(canvas.queryByRole("button", { name: /Download the AI model/ })).toBeNull());
    await expect(current.ai.changes).toBe(1);
  },
});

export const LocalModelFails = meta.story({
  name: "Local model fails to load",
  parameters: { model: "aibrowser", local: "off" },
  play: async ({ canvas, userEvent }) => {
    current.ai.failDownload("No GPU");
    await open(canvas, (e) => userEvent.click(e));
    await userEvent.click(await canvas.findByRole("button", { name: "Download the AI model (about 800 MB)" }));
    await waitFor(() => expect(canvas.getByText("Couldn't load the model: No GPU")).toBeVisible());
  },
});

export const RoleSuggestions = meta.story({
  name: "Suggestions for the signed-in role",
  parameters: { role: "manager" },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, (e) => userEvent.click(e));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Which invoices should I approve?" })).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Which invoices should I approve?" }));
    await waitFor(() =>
      expect(current.ai.turns).toEqual([{ message: "Which invoices should I approve?", model: "luna" }]),
    );
  },
});

export const NeutralSuggestions = meta.story({
  name: "Suggestions without a configured assistant",
  parameters: { quiet: true },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, (e) => userEvent.click(e));
    await waitFor(() => expect(canvas.getByRole("button", { name: "How does this page work?" })).toBeVisible());
  },
});

let release = () => {};
export const Controls = meta.story({
  name: "Rate, retry, edit, switch model and start over",
  parameters: {
    saved: "luna",
    model: "aibrowser",
    turn: (async (message, { confirm, onEvent }) => {
      if (message === "Wait") return new Promise<string>((resolve) => (release = () => resolve("Waited.")));
      onEvent({ type: "text", text: "Looking." });
      onEvent({ type: "thought", text: "Late thought." });
      await confirm({ ...tool("send_reminder", true), title: undefined }, { id: "i1" });
      const done = (output: string) =>
        onEvent({ type: "tool", name: "t", title: "Read", input: {}, status: "done", output });
      done(JSON.stringify({ path: "/collections/invoices/i1", document: { id: "INV-1001" } }));
      done(JSON.stringify({ path: "/collections/invoices/i2", document: { id: 2 } }));
      done(JSON.stringify({ path: "/collections/invoices/i3" }));
      done("not json");
      return "All set.";
    }) satisfies Turn,
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const input = await open(canvas, (e) => userEvent.click(e));
    await userEvent.type(input, "Remind them{Enter}");
    await userEvent.click(await canvas.findByRole("button", { name: "Allow" }));
    await waitFor(() => expect(canvas.getByText("All set.")).toBeVisible());
    await expect(canvas.getByRole("link", { name: "INV-1001" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "/collections/invoices/i2" })).toBeInTheDocument();
    await userEvent.click(canvas.getAllByRole("button", { name: "Good response" }).at(-1)!);
    await userEvent.click(canvas.getAllByRole("button", { name: "Retry" }).at(-1)!);
    await waitFor(() => expect(current.ai.turns.map((t) => t.message)).toEqual(["Remind them", "Remind them"]));
    await userEvent.click(await canvas.findByRole("button", { name: "Allow" }));
    await waitFor(() => expect(canvas.getAllByText("All set.")).toHaveLength(2));
    await userEvent.click(canvas.getAllByRole("button", { name: "Edit" })[0]!);
    await waitFor(() => expect(input).toHaveValue("Remind them"));
    const prompt = canvasElement.querySelector("ui-prompt-input")!;
    await userEvent.clear(input);
    await userEvent.type(input, "Wait{Enter}");
    prompt.dispatchEvent(new CustomEvent("ui-submit", { detail: { value: "Again" } }));
    prompt.dispatchEvent(new CustomEvent("ui-submit", { detail: { value: "   " } }));
    release();
    await waitFor(() => expect(canvas.getByText("Waited.")).toBeVisible());
    await expect(current.ai.turns.map((t) => t.model)).toEqual(["luna", "luna", "luna"]);
    canvasElement
      .querySelector("ui-model-selector")!
      .dispatchEvent(new CustomEvent("ui-change", { detail: { value: "aibrowser" } }));
    await waitFor(() => expect(current.ai.warmed).toEqual([]));
    await userEvent.click(canvas.getByRole("button", { name: "New chat" }));
    await expect(current.ai.resets).toBe(1);
    await waitFor(() => expect(canvas.getByText("How can I help?")).toBeVisible());
  },
});

export const LocalModelChanges = meta.story({
  name: "The browser switches to the local model",
  parameters: { local: "off" },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, (e) => userEvent.click(e));
    current.ai.setLocal("local");
    window.dispatchEvent(new Event("test-ai-change"));
    await waitFor(() => expect(current.ai.changes).toBe(1));
  },
});
