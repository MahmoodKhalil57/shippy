import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { blockContext, mountElement, stagedCalls, type BlockArgs } from "../../../../.storybook/fixtures/widgets.ts";
import type { MemoryData } from "../../../lib/dashboard/memory.ts";
import { m } from "../../../lib/i18n/index.ts";
import type { AskAnswer } from "../../../lib/widgets/schema.ts";
import { renderBlocks } from "../registry.ts";
import "../../index.ts";
import "./ask.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

const data: MemoryData = {
  endpoints: {
    "POST /ask": (body): AskAnswer => ({
      question: (body as { question: string }).question,
      answer: "Two customers are late: Harbor Logistics and Riverside Bakery.",
      points: [],
      sources: [],
    }),
    "GET /ask/hints": () => ({ suggestions: ["Who is late?"] }),
    "GET /ask/bare": () => ({}),
  },
};

const asks = (root: HTMLElement) => [...root.querySelectorAll("ui-ask")];
const hintsLoaded = (endpoint: string) =>
  stagedCalls().filter((c) => c.method === "get" && c.args[0] === endpoint).length;

export const Ask = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [
        {
          type: "ask",
          endpoint: "/ask",
          suggestions: { endpoint: "/ask/hints" },
          name: "Helper",
          intro: "Ask me about orders",
        },
      ],
      blockContext(args, { data }),
    )}`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(asks(canvasElement)[0]).toMatchObject({
      name: "Helper",
      intro: "Ask me about orders",
      placeholder: m.widget_ask_placeholder(),
    });
    await userEvent.click(await canvas.findByRole("button", { name: "Who is late?" }));
    await expect(
      await canvas.findByText("Two customers are late: Harbor Logistics and Riverside Bakery.", {}, { timeout: 3000 }),
    ).toBeVisible();
    await expect(stagedCalls().filter((c) => c.method === "post")).toHaveLength(1);
    await expect(stagedCalls().find((c) => c.method === "post")!.args).toEqual(["/ask", { question: "Who is late?" }]);
  },
});

export const SharedSuggestions = meta.story({
  name: "Suggestions loaded once",
  render: (args) =>
    html`${renderBlocks(
      [
        { type: "ask", endpoint: "/ask", suggestions: { endpoint: "/ask/hints" } },
        { type: "ask", endpoint: "/ask", suggestions: { endpoint: "/ask/hints" } },
      ],
      blockContext(args, { data }),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() => expect(canvas.getAllByRole("button", { name: "Who is late?" })).toHaveLength(2));
    await expect(hintsLoaded("/ask/hints")).toBe(1);
    const [first, second] = asks(canvasElement);
    await expect(await first!.loadSuggestions!()).toEqual(["Who is late?"]);
    await expect(await second!.loadSuggestions!()).toEqual(["Who is late?"]);
    await expect(hintsLoaded("/ask/hints")).toBe(1);
  },
});

export const NoSuggestions = meta.story({
  name: "Suggestions that fail to load",
  render: (args) =>
    html`${renderBlocks(
      [
        { type: "ask", endpoint: "/ask", suggestions: { endpoint: "/ask/bare" } },
        { type: "ask", endpoint: "/ask", suggestions: { endpoint: "/ask/missing" } },
      ],
      blockContext(args, { data }),
    )}`,
  play: async ({ canvasElement }) => {
    const [bare, missing] = asks(canvasElement);
    await expect(await bare!.loadSuggestions!()).toEqual([]);
    await expect(await missing!.loadSuggestions!()).toEqual([]);
    await expect(bare!.suggestions).toEqual([]);
  },
});

export const FixedSuggestions = meta.story({
  name: "Fixed suggestions",
  render: (args) =>
    html`${renderBlocks(
      [{ type: "ask", endpoint: "/ask", suggestions: ["Which invoices are late?"] }],
      blockContext(args, { data }),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "Which invoices are late?" })).toBeVisible();
    await expect(asks(canvasElement)[0]!.loadSuggestions).toBeUndefined();
  },
});

export const Defaults = meta.story({
  render: (args) => html`${renderBlocks([{ type: "ask", endpoint: "/ask" }], blockContext(args, { data }))}`,
  play: async ({ canvasElement }) => {
    await expect(asks(canvasElement)[0]).toMatchObject({
      name: "Assistant",
      suggestions: [],
      loadSuggestions: undefined,
      placeholder: m.widget_ask_placeholder(),
      reading: m.widget_ask_reading(),
    });
  },
});
