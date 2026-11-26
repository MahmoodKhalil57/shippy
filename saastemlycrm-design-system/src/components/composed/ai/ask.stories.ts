import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor, type Mock } from "storybook/test";
import "./ask.ts";
import type { AskAnswer } from "../../../lib/base/ask-spec.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const sample = {
  question: "Which orders are late?",
  answer: "Two orders are past their delivery date.",
  points: ["Order 1042 is three days late", "Order 1057 is one day late"],
  sources: [
    { label: "Order 1042", href: "#order-1042" },
    { label: "Order 1057", href: "#order-1057" },
  ],
  refusal: "I can only answer questions about your records.",
  offTopic: "What is the weather tomorrow?",
  failure: "The records could not be read",
  suggestions: ["Who owes the most?", "What shipped today?"],
  intro: "Ask anything about your orders and customers.",
  footnote: "Answers come from your records only.",
  reading: "Looking through the orders…",
};

const answered = (question: string): AskAnswer => ({
  question,
  answer: sample.answer,
  points: sample.points,
  sources: sample.sources,
});

const slow = { timeout: 4000 };

const localized = (text: string) => text as LocalizedString;

type Args = {
  ask: Mock<(question: string) => Promise<AskAnswer>>;
  suggestions: string[];
  question: string;
  name: LocalizedString;
  placeholder: LocalizedString;
  intro: string;
  reading: LocalizedString;
  footnote: string;
};

const meta = preview.type<{ args: Args }>().meta({
  title: "Composed/Ai/Ask",
  component: "ui-ask",
  args: {
    ask: fn(async (question: string) => answered(question)),
    suggestions: sample.suggestions,
    question: "",
    name: localized("Assistant"),
    placeholder: localized("Ask a question…"),
    intro: sample.intro,
    reading: localized(sample.reading),
    footnote: sample.footnote,
  },
  argTypes: {
    ask: { table: { category: "callbacks" }, description: "Answers a question; rejects with an error to show." },
    suggestions: { control: "object" },
    question: { control: "text" },
    name: { control: "text", description: "The assistant's name on its replies." },
    placeholder: { control: "text" },
    intro: { control: "text", description: "Shown before the first question." },
    reading: { control: "text", description: "Shown while an answer is on its way." },
    footnote: { control: "text" },
  },
  parameters: { canvas: "column" },
  render: (args) =>
    html`<ui-ask
      .ask=${args.ask}
      .suggestions=${args.suggestions}
      question=${args.question}
      name=${args.name}
      placeholder=${args.placeholder}
      intro=${args.intro}
      reading=${args.reading}
      footnote=${args.footnote}
    ></ui-ask>`,
});

export const Playground = meta.story({
  name: "Playground",
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText(sample.intro)).toBeVisible();
    await expect(canvas.getByText(sample.footnote)).toBeVisible();
    const box = canvas.getByRole("textbox", { name: "Question" });
    await expect(box).toHaveAttribute("placeholder", "Ask a question…");
    await userEvent.type(box, `  ${sample.question}  `);
    await userEvent.keyboard("{Enter}");
    await expect(args.ask).toHaveBeenCalledOnce();
    await expect(args.ask).toHaveBeenCalledWith(sample.question);
    await expect(box).toHaveValue("");
    await expect(canvas.getByRole("status", { name: "Reading" })).toBeInTheDocument();
    await expect(canvas.getByText(sample.reading)).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Ask" })).toBeDisabled();
    for (const s of sample.suggestions) await expect(canvas.getByRole("button", { name: s })).toBeDisabled();
    await expect(canvas.queryByText(sample.intro)).not.toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText(sample.answer)).toBeVisible(), slow);
    await expect(canvas.queryByRole("status", { name: "Reading" })).not.toBeInTheDocument();
    await expect(canvas.getByText(sample.question)).toBeVisible();
    for (const p of sample.points) await expect(canvas.getByText(`· ${p}`)).toBeVisible();
    await expect(canvas.getByText("Sources:")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Order 1042" })).toHaveAttribute("href", "#order-1042");
    await expect(canvas.getByRole("link", { name: "Order 1057" })).toHaveAttribute("href", "#order-1057");
    await expect(canvas.getByRole("button", { name: "Ask" })).toBeEnabled();
  },
});

export const AsksASuggestion = meta.story({
  name: "Asks a suggestion",
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: sample.suggestions[1] }));
    await expect(args.ask).toHaveBeenCalledOnce();
    await expect(args.ask).toHaveBeenCalledWith(sample.suggestions[1]);
    await waitFor(() => expect(canvas.getByText(sample.answer)).toBeVisible(), slow);
    await userEvent.click(canvas.getByRole("button", { name: sample.suggestions[0] }));
    await waitFor(() => expect(canvas.getAllByText(sample.answer)).toHaveLength(2), slow);
    await expect(args.ask).toHaveBeenLastCalledWith(sample.suggestions[0]);
  },
});

export const LoadsSuggestions = meta.story({
  name: "Loads suggestions",
  args: { suggestions: [] },
  render: (args) =>
    html`<ui-ask .ask=${args.ask} .loadSuggestions=${async () => sample.suggestions} intro=${args.intro}></ui-ask>`,
  play: async ({ canvas }) => {
    for (const s of sample.suggestions) await expect(await canvas.findByRole("button", { name: s })).toBeEnabled();
    await expect(canvas.queryByText(sample.footnote)).not.toBeInTheDocument();
  },
});

export const Refused = meta.story({
  name: "Refused",
  args: {
    ask: fn(async (question: string) => ({
      question,
      answer: sample.refusal,
      points: [],
      sources: [],
      refused: true,
    })),
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Question" }), `${sample.offTopic}{Enter}`);
    await expect(args.ask).toHaveBeenCalledOnce();
    await expect(args.ask).toHaveBeenCalledWith(sample.offTopic);
    await waitFor(() => expect(canvas.getByText(sample.refusal)).toBeVisible(), slow);
    await expect(canvas.queryByText("Sources:")).not.toBeInTheDocument();
    await expect(canvas.queryAllByRole("link")).toHaveLength(0);
  },
});

export const Failed = meta.story({
  name: "Failed keeps the question",
  args: { ask: fn(async () => Promise.reject(new Error(sample.failure))) },
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole("textbox", { name: "Question" });
    await userEvent.type(box, sample.question);
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await expect(args.ask).toHaveBeenCalledOnce();
    const alert = await canvas.findByRole("alert", {}, slow);
    await expect(alert).toHaveTextContent(sample.failure);
    await expect(box).toHaveValue(sample.question);
    await expect(canvas.getByText(sample.intro)).toBeVisible();
    args.ask.mockImplementation(async (question: string) => answered(question));
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText(sample.answer)).toBeVisible(), slow);
  },
});

export const IgnoresBlankAndBusy = meta.story({
  name: "Ignores blank and repeated questions",
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole("textbox", { name: "Question" });
    await userEvent.type(box, "   {Enter}");
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await expect(args.ask).not.toHaveBeenCalled();
    await userEvent.type(box, `${sample.question}{Enter}`);
    await expect(canvas.getByRole("status", { name: "Reading" })).toBeInTheDocument();
    await userEvent.type(box, `${sample.offTopic}{Enter}`);
    await expect(args.ask).toHaveBeenCalledOnce();
    await expect(args.ask).toHaveBeenCalledWith(sample.question);
    await expect(box).toHaveValue(sample.offTopic);
    await waitFor(() => expect(canvas.getByText(sample.answer)).toBeVisible(), slow);
    await expect(canvas.getAllByText(sample.answer)).toHaveLength(1);
  },
});

export const WithoutAnAnswerer = meta.story({
  name: "Without an answerer",
  args: { intro: "", footnote: "", suggestions: [] },
  render: (args) => html`<ui-ask question=${sample.question} intro=${args.intro}></ui-ask>`,
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole("textbox", { name: "Question" });
    await expect(box).toHaveValue(sample.question);
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await expect(box).toHaveValue(sample.question);
    await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
    await expect(canvas.queryByText(sample.intro)).not.toBeInTheDocument();
  },
});
