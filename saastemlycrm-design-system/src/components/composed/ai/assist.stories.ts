import preview from "#.storybook/preview";
import { html, type ReactiveElement } from "lit";
import { expect, fn, mocked, waitFor, within, type Mock } from "storybook/test";
import "./assist.ts";
import {
  availability,
  check,
  classify,
  detectLanguage,
  extract,
  proofread,
  quickReplies,
  readMedia,
  rewrite,
  summarize,
  supported,
  transcribe,
  translate,
  write,
  type BuiltInApi,
  type CheckAnswer,
  type ExtractField,
  type SummaryType,
} from "../../../lib/agent/built-in-ai.ts";
import { AI_CHANGE, usingLocalModel } from "../../../lib/agent/ai-polyfill.ts";
import { getLocale, overwriteGetLocale } from "../../../lib/i18n/paraglide/runtime.js";

const sample = {
  message: "Hello, the last delivery arrived two days late.\nPlease confirm the next date.\n\n  \n\nThank you.",
  firstLine: "Hello, the last delivery arrived two days late.",
  secondLine: "Please confirm the next date.",
  closing: "Thank you.",
  arabic: "مرحبا، وصلت الشحنة متأخرة يومين.",
  english: "Hello, the shipment arrived two days late.",
  inArabic: "مرحبا، تأخرت الشحنة يومين.",
  inFrench: "Bonjour, la livraison est en retard.",
  keyPoints: "- The delivery was late\n- A new date is needed",
  tldr: "A customer asks for a new delivery date.",
  draft: "Thank you for your message. We are checking the delivery date now.",
  reply: "pls confirm the delivry date",
  formal: "Kindly confirm the delivery date.",
  friendly: "Could you let us know the delivery date?",
  firm: "Please confirm the delivery date today.",
  shorter: "Confirm the date, please.",
  corrected: "Please confirm the delivery date.",
  brief: "Reply to a late delivery",
  context: "A reply to a customer",
  failure: "The model is busy",
  read: "2 pallets of tiles\n\nReference 4471",
  transcript: "Send two pallets on Monday.",
  replies: ["Thanks, we will check today.", "Sorry for the delay, a new date follows."],
  pasted: "Sam Lee wants 12 boxes.",
  flag: "Is this the same request as an earlier one?",
  flagHeading: "Possible repeat request",
  flagNote: "Compare it with the earlier messages.",
  speech: "Your order has shipped.",
};

const categories = ["Complaint", "Question", "Order"];

const questions = [
  { id: "date", prompt: "Does it give a date?", yes: "Gives a date", no: "No date given" },
  { id: "polite", prompt: "Is it polite?", yes: "Polite", no: "Could be more polite" },
  { id: "price", prompt: "Does it quote a price?", yes: "Quotes a price", no: "No price quoted" },
];

const answers: CheckAnswer[] = [
  { id: "date", yes: true, confidence: 0.9 },
  { id: "polite", yes: false },
];

const fields: ExtractField[] = [
  { id: "name", label: "Name" },
  { id: "qty", label: "Quantity", type: "number" },
  { id: "city", label: "City" },
  { id: "date", label: "Date" },
  { id: "ref", label: "Reference" },
];

const extracted = { name: "Sam Lee", qty: 12, city: "", date: null };

const deferred = <T>() => {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
};

const only =
  (...apis: BuiltInApi[]) =>
  (api: BuiltInApi) =>
    apis.includes(api);

const but =
  (...apis: BuiltInApi[]) =>
  (api: BuiltInApi) =>
    !apis.includes(api);

const picked = (value: unknown) => expect.objectContaining({ detail: value });

const choose = (file: File | null | "cancel") => {
  const original = HTMLInputElement.prototype.click;
  const accepts: string[] = [];
  HTMLInputElement.prototype.click = function (this: HTMLInputElement) {
    if (this.type !== "file") return original.call(this);
    accepts.push(this.accept);
    if (file === "cancel") return void this.dispatchEvent(new Event("cancel"));
    const dt = new DataTransfer();
    if (file) dt.items.add(file);
    this.files = dt.files;
    this.dispatchEvent(new Event("change"));
  };
  return { accepts, restore: () => (HTMLInputElement.prototype.click = original) };
};

const hide = (target: object, key: string) => {
  let owner: object | null = target;
  while (owner && !Object.getOwnPropertyDescriptor(owner, key)) owner = Object.getPrototypeOf(owner);
  const at = owner!;
  const descriptor = Object.getOwnPropertyDescriptor(at, key)!;
  delete (at as Record<string, unknown>)[key];
  return () => Object.defineProperty(at, key, descriptor);
};

const files = {
  photo: () => new File(["png"], "quote.png", { type: "image/png" }),
  voice: () => new File(["ogg"], "note.ogg", { type: "audio/ogg" }),
};

type Args = {
  text: string;
  translatable: boolean;
  summarizable: boolean;
  alternate: string;
  summaryType: SummaryType;
  summaryLabel: string;
  context: string;
  auto: boolean;
  value: string;
  brief: string;
  tools: string;
  options: string[];
  what: string;
  classifyLabel: string;
  pickable: boolean;
  questions: typeof questions;
  checkLabel: string;
  fields: ExtractField[];
  source: "paste" | "file" | "text";
  extractLabel: string;
  placeholder: string;
  useLabel: string;
  question: string;
  heading: string;
  tone: "warning" | "error" | "info";
  note: string;
  threshold: number;
  readLabel: string;
  imagePrompt: string;
  audioPrompt: string;
  dictateLabel: string;
  speakLabel: string;
  lang: string;
  onChange: Mock<(e: CustomEvent) => void>;
  onSelect: Mock<(e: CustomEvent) => void>;
};

const meta = preview.type<{ args: Args }>().meta({
  title: "Composed/Ai/Assist",
  component: "ui-ai-text",
  args: {
    text: sample.message,
    translatable: true,
    summarizable: true,
    alternate: "ar",
    summaryType: "key-points",
    summaryLabel: "Catch me up",
    context: sample.context,
    auto: false,
    value: sample.reply,
    brief: sample.brief,
    tools: "draft formal friendly firm shorter proofread translate",
    options: categories,
    what: "messages",
    classifyLabel: "Looks like",
    pickable: true,
    questions,
    checkLabel: "Check with AI",
    fields,
    source: "paste",
    extractLabel: "Fill from text",
    placeholder: "Paste the message here…",
    useLabel: "Use these",
    question: sample.flag,
    heading: sample.flagHeading,
    tone: "warning",
    note: sample.flagNote,
    threshold: 0.6,
    readLabel: "Read a photo or voice note",
    imagePrompt: "List every item on the photo.",
    audioPrompt: "Transcribe the voice note.",
    dictateLabel: "Dictate",
    speakLabel: "Read aloud",
    lang: "en-GB",
    onChange: fn(),
    onSelect: fn(),
  },
  argTypes: {
    text: { control: "text", description: "The message every assistant reads." },
    translatable: { control: "boolean", table: { category: "ui-ai-text" } },
    summarizable: { control: "boolean", table: { category: "ui-ai-text" } },
    alternate: { control: "text", table: { category: "ui-ai-text" }, description: "Language to translate English to." },
    summaryType: {
      control: "inline-radio",
      options: ["key-points", "tldr", "headline", "teaser"],
      table: { category: "ui-ai-summary" },
    },
    summaryLabel: { control: "text", table: { category: "ui-ai-summary" } },
    context: { control: "text", table: { category: "ui-ai-summary" } },
    auto: { control: "boolean", table: { category: "ui-ai-summary" } },
    value: { control: "text", table: { category: "ui-ai-tools" } },
    brief: { control: "text", table: { category: "ui-ai-tools" } },
    tools: { control: "text", table: { category: "ui-ai-tools" } },
    options: { control: "object", table: { category: "ui-ai-classify" } },
    what: { control: "text", table: { category: "ui-ai-classify" } },
    classifyLabel: { control: "text", table: { category: "ui-ai-classify" } },
    pickable: { control: "boolean", description: "Offers a button that picks the result." },
    questions: { control: "object", table: { category: "ui-ai-check" } },
    checkLabel: { control: "text", table: { category: "ui-ai-check" } },
    fields: { control: "object", table: { category: "ui-ai-extract" } },
    source: { control: "inline-radio", options: ["paste", "file", "text"], table: { category: "ui-ai-extract" } },
    extractLabel: { control: "text", table: { category: "ui-ai-extract" } },
    placeholder: { control: "text", table: { category: "ui-ai-extract" } },
    useLabel: { control: "text", table: { category: "ui-ai-extract" } },
    question: { control: "text", table: { category: "ui-ai-flag" } },
    heading: { control: "text", table: { category: "ui-ai-flag" } },
    tone: { control: "inline-radio", options: ["warning", "error", "info"], table: { category: "ui-ai-flag" } },
    note: { control: "text", table: { category: "ui-ai-flag" } },
    threshold: { control: { type: "range", min: 0, max: 1, step: 0.05 }, table: { category: "ui-ai-flag" } },
    readLabel: { control: "text", table: { category: "ui-ai-read-file" } },
    imagePrompt: { control: "text", table: { category: "ui-ai-read-file" } },
    audioPrompt: { control: "text", table: { category: "ui-ai-read-file" } },
    dictateLabel: { control: "text", table: { category: "ui-ai-dictate" } },
    speakLabel: { control: "text", table: { category: "ui-speak" } },
    lang: { control: "text", table: { category: "ui-speak" } },
    onChange: { table: { category: "events" } },
    onSelect: { table: { category: "events" } },
  },
  parameters: { canvas: "column" },
  beforeEach: () => {
    mocked(supported).mockReturnValue(true);
    mocked(availability).mockResolvedValue("available");
    mocked(usingLocalModel).mockReturnValue(false);
    mocked(detectLanguage).mockResolvedValue({ language: "en", confidence: 0.9 });
    mocked(translate).mockImplementation(async (_t, _from, to) =>
      to === "en" ? sample.english : to === "fr" ? sample.inFrench : sample.inArabic,
    );
    mocked(summarize).mockImplementation(async (_t, o) => (o?.type === "key-points" ? sample.keyPoints : sample.tldr));
    mocked(write).mockResolvedValue(sample.draft);
    mocked(rewrite).mockImplementation(async (_t, o) =>
      o?.length === "shorter"
        ? sample.shorter
        : o?.tone === "more-casual"
          ? sample.friendly
          : o?.context?.startsWith("Firmer")
            ? sample.firm
            : sample.formal,
    );
    mocked(proofread).mockResolvedValue({ text: sample.corrected, fixes: 2 });
    mocked(classify).mockResolvedValue({ category: "Complaint", confidence: 0.82 });
    mocked(check).mockResolvedValue(answers);
    mocked(readMedia).mockResolvedValue(sample.read);
    mocked(extract).mockResolvedValue(extracted);
    mocked(quickReplies).mockResolvedValue(sample.replies);
    mocked(transcribe).mockResolvedValue(sample.transcript);
  },
  render: (args) =>
    html`<ui-ai-text
        text=${args.text}
        ?translatable=${args.translatable}
        ?summarizable=${args.summarizable}
        alternate=${args.alternate}
      ></ui-ai-text>
      <ui-ai-summary
        text=${args.text}
        type=${args.summaryType}
        label=${args.summaryLabel}
        context=${args.context}
        ?auto=${args.auto}
      ></ui-ai-summary>
      <ui-ai-tools
        value=${args.value}
        brief=${args.brief}
        context=${args.context}
        tools=${args.tools}
        @ui-change=${args.onChange}
      ></ui-ai-tools>
      <ui-ai-classify
        text=${args.text}
        .options=${args.options}
        what=${args.what}
        label=${args.classifyLabel}
        ?pickable=${args.pickable}
        @ui-select=${args.onSelect}
      ></ui-ai-classify>
      <ui-ai-check text=${args.text} .questions=${args.questions} label=${args.checkLabel}></ui-ai-check>
      <ui-ai-extract
        source=${args.source}
        .fields=${args.fields}
        text=${args.text}
        label=${args.extractLabel}
        placeholder=${args.placeholder}
        use-label=${args.useLabel}
        ?pickable=${args.pickable}
        @ui-select=${args.onSelect}
      ></ui-ai-extract>
      <ui-ai-flag
        text=${args.text}
        question=${args.question}
        heading=${args.heading}
        tone=${args.tone}
        note=${args.note}
        threshold=${args.threshold}
      ></ui-ai-flag>
      <ui-ai-read-file
        label=${args.readLabel}
        image-prompt=${args.imagePrompt}
        audio-prompt=${args.audioPrompt}
        ?pickable=${args.pickable}
        @ui-select=${args.onSelect}
      ></ui-ai-read-file>
      <ui-ai-replies text=${args.text} @ui-select=${args.onSelect}></ui-ai-replies>
      <ui-ai-dictate label=${args.dictateLabel} @ui-select=${args.onSelect}></ui-ai-dictate>
      <ui-speak text=${args.text} label=${args.speakLabel} lang=${args.lang}></ui-speak>`,
});

const el = <K extends keyof HTMLElementTagNameMap>(root: HTMLElement, tag: K) => root.querySelector(tag)!;

const settle = async (node: ReactiveElement) => {
  node.requestUpdate();
  await node.updateComplete;
};

export const Playground = meta.story({
  name: "Playground",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const text = within(el(canvasElement, "ui-ai-text"));
    await expect(await text.findByText("English")).toBeVisible();
    await expect(text.getByRole("button", { name: "Translate to Arabic" })).toBeEnabled();
    await expect(text.getByRole("button", { name: "Catch me up" })).toBeEnabled();
    await expect(await canvas.findByText("Looks like: Complaint · 82%")).toBeVisible();
    await expect(await canvas.findByRole("alert")).toHaveTextContent(`${sample.flagHeading} · 90%`);
    const tools = within(el(canvasElement, "ui-ai-tools"));
    await userEvent.click(tools.getByRole("button", { name: "More formal" }));
    await expect(await tools.findByText("Made more formal")).toBeVisible();
    await expect(args.onChange).toHaveBeenLastCalledWith(picked({ value: sample.formal }));
    await userEvent.click(canvas.getByRole("button", { name: "Use this" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith(picked({ value: "Complaint" }));
    await expect(canvas.getByRole("button", { name: "Read aloud" })).toBeVisible();
  },
});

export const DetectsTheLanguage = meta.story({
  name: "Detects the language",
  render: () => html`<ui-ai-language text=${sample.arabic}></ui-ai-language>`,
  play: async ({ canvas, canvasElement }) => {
    const badge = el(canvasElement, "ui-ai-language");
    mocked(detectLanguage).mockResolvedValue({ language: "ar", confidence: 0.95 });
    badge.text = `${sample.arabic} `;
    await expect(await canvas.findByText("Arabic")).toBeVisible();
    mocked(detectLanguage).mockRejectedValue(new Error(sample.failure));
    badge.text = sample.english;
    await waitFor(() => expect(canvas.queryByText("Arabic")).not.toBeInTheDocument());
    mocked(detectLanguage).mockResolvedValue({ language: "en", confidence: 0.9 });
    badge.text = sample.firstLine;
    await expect(await canvas.findByText("English")).toBeVisible();
    mocked(detectLanguage).mockResolvedValue(null);
    badge.text = sample.secondLine;
    await waitFor(() => expect(canvas.queryByText("English")).not.toBeInTheDocument());
  },
});

export const LanguageWaitsForTheModel = meta.story({
  name: "Language waits for the model",
  beforeEach: () => {
    mocked(supported).mockImplementation(but("LanguageDetector"));
  },
  render: () =>
    html`<ui-ai-language text=${sample.english}></ui-ai-language><ui-ai-language text="  "></ui-ai-language>`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll("ui-tag")).toHaveLength(0);
    mocked(supported).mockReturnValue(true);
    mocked(availability).mockResolvedValue("downloadable");
    window.dispatchEvent(new Event(AI_CHANGE));
    await waitFor(() => expect(availability).toHaveBeenCalledWith("LanguageDetector"));
    await expect(canvasElement.querySelectorAll("ui-tag")).toHaveLength(0);
    mocked(availability).mockResolvedValue("available");
    window.dispatchEvent(new Event(AI_CHANGE));
    await expect(await canvas.findByText("English")).toBeVisible();
    await expect(canvasElement.querySelectorAll("ui-tag")).toHaveLength(1);
    await expect(detectLanguage).toHaveBeenCalledOnce();
    await expect(detectLanguage).toHaveBeenCalledWith(sample.english);
  },
});

export const TranslatesAndBack = meta.story({
  name: "Translates and back",
  render: () => html`<ui-ai-text text=${sample.message} translatable></ui-ai-text>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const host = el(canvasElement, "ui-ai-text");
    await expect(await canvas.findByText("English")).toBeVisible();
    const body = canvas.getByText(sample.closing).closest("[dir]")!;
    await expect(body).toHaveAttribute("lang", "en");
    await expect(body).toHaveAttribute("dir", "auto");
    await expect(body.querySelectorAll("ui-text")).toHaveLength(2);
    await expect(body.querySelectorAll("br")).toHaveLength(1);
    await expect(body).toHaveTextContent(sample.secondLine);
    const job = deferred<string>();
    let report: (f: number) => void = () => {};
    mocked(translate).mockImplementation((_t, _from, _to, p) => {
      report = p!;
      return job.promise;
    });
    const button = canvas.getByRole("button", { name: "Translate to Arabic" });
    await userEvent.click(button);
    await expect(await canvas.findByText("Translating to Arabic…")).toBeVisible();
    await expect(translate).toHaveBeenCalledWith(sample.message, "en", "ar", expect.any(Function));
    await expect(button).toBeDisabled();
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    report(0.25);
    await expect(await canvas.findByText("Getting the on-device model… 25%")).toBeVisible();
    report(1);
    await expect(await canvas.findByText("Translating to Arabic…")).toBeVisible();
    job.resolve(sample.inArabic);
    const translated = await canvas.findByText(sample.inArabic);
    const box = translated.closest("[dir]")!;
    await expect(box).toHaveAttribute("lang", "ar");
    await expect(box).toHaveAttribute("dir", "rtl");
    await expect(
      canvas.getByText("Translated on this device — check names and figures against the original."),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Show original" }));
    await expect(await canvas.findByText(sample.closing)).toBeVisible();
    await expect(canvas.queryByText(sample.inArabic)).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Translate to Arabic" })).toBeEnabled();
    await expect(translate).toHaveBeenCalledOnce();
    await expect(host.text).toBe(sample.message);
  },
});

export const TranslatesToEnglishThenSummarises = meta.story({
  name: "Translates to English, then summarises it",
  beforeEach: () => {
    mocked(availability).mockResolvedValue("downloadable");
    mocked(detectLanguage).mockResolvedValue({ language: "ar", confidence: 0.95 });
  },
  render: () => html`<ui-ai-text text=${sample.arabic} translatable summarizable></ui-ai-text>`,
  play: async ({ canvas, userEvent }) => {
    await waitFor(() => expect(availability).toHaveBeenCalledWith("LanguageDetector"));
    await expect(detectLanguage).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Translate to Arabic" }));
    await expect(await canvas.findByText(sample.english)).toBeVisible();
    await expect(translate).toHaveBeenCalledWith(sample.arabic, "ar", "en", expect.any(Function));
    await expect(canvas.getByText("Arabic")).toBeVisible();
    const box = canvas.getByText(sample.english).closest("[dir]")!;
    await expect(box).toHaveAttribute("lang", "en");
    await userEvent.click(canvas.getByRole("button", { name: "Catch me up" }));
    await expect(await canvas.findByText("Key points · on this device")).toBeVisible();
    await expect(summarize).toHaveBeenCalledWith(sample.english, { type: "key-points" }, expect.any(Function));
    await expect(canvas.getByText("The delivery was late")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Hide summary" }));
    await waitFor(() => expect(canvas.queryByText("Key points · on this device")).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole("button", { name: "Show original" }));
    await expect(await canvas.findByRole("button", { name: "Translate to English" })).toBeEnabled();
  },
});

export const TranslationFallsBack = meta.story({
  name: "Translation falls back and fails",
  beforeEach: () => {
    mocked(supported).mockImplementation(but("LanguageDetector", "Summarizer"));
    mocked(detectLanguage).mockRejectedValue(new Error(sample.failure));
    mocked(translate).mockRejectedValue(new Error(""));
  },
  render: () => html`<ui-ai-text text=${sample.english} translatable summarizable alternate="fr"></ui-ai-text>`,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole("button", { name: "Catch me up" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Translate to French" }));
    await expect(await canvas.findByText("The on-device model couldn't do this.")).toBeVisible();
    await expect(translate).toHaveBeenCalledWith(sample.english, "en", "fr", expect.any(Function));
    await expect(canvas.getByText(sample.english)).toBeVisible();
    await expect(canvas.getByText("English")).toBeVisible();
    mocked(translate).mockResolvedValue(sample.inFrench);
    await userEvent.click(canvas.getByRole("button", { name: "Translate to French" }));
    const translated = await canvas.findByText(sample.inFrench);
    await expect(translated.closest("[dir]")).toHaveAttribute("dir", "auto");
    await expect(translated.closest("[dir]")).toHaveAttribute("lang", "fr");
    await expect(canvas.queryByText("The on-device model couldn't do this.")).not.toBeInTheDocument();
  },
});

export const SummarisesTheOriginal = meta.story({
  name: "Summarises the original and resets on new text",
  render: () => html`<ui-ai-text text=${sample.english} translatable summarizable></ui-ai-text>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const host = el(canvasElement, "ui-ai-text");
    await expect(await canvas.findByText("English")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Translate to Arabic" }));
    await expect(await canvas.findByText(sample.inArabic)).toBeVisible();
    const job = deferred<string>();
    mocked(summarize).mockReturnValue(job.promise);
    await userEvent.click(canvas.getByRole("button", { name: "Catch me up" }));
    await expect(await canvas.findByText("Reading…")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Show original" })).toBeDisabled();
    job.resolve(sample.keyPoints);
    await expect(await canvas.findByText("Key points · on this device")).toBeVisible();
    await expect(summarize).toHaveBeenCalledWith(sample.english, { type: "key-points" }, expect.any(Function));
    mocked(summarize).mockRejectedValue(new Error(sample.failure));
    await userEvent.click(canvas.getByRole("button", { name: "Hide summary" }));
    await userEvent.click(canvas.getByRole("button", { name: "Catch me up" }));
    await expect(await canvas.findByText(sample.failure)).toBeVisible();
    await expect(canvas.queryByText("Key points · on this device")).not.toBeInTheDocument();
    host.text = sample.firstLine;
    await expect(await canvas.findByText(sample.firstLine)).toBeVisible();
    await expect(canvas.queryByText(sample.inArabic)).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Translate to Arabic" })).toBeEnabled();
  },
});

export const PlainText = meta.story({
  name: "Plain text without a model",
  beforeEach: () => {
    mocked(supported).mockReturnValue(false);
  },
  render: () => html`<ui-ai-text text=${sample.message} translatable summarizable></ui-ai-text>`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText(sample.closing)).toBeVisible();
    await expect(canvas.queryAllByRole("button")).toHaveLength(0);
    const body = canvas.getByText(sample.closing).closest("[dir]")!;
    await expect(body).not.toHaveAttribute("lang");
    await expect(canvasElement.querySelector("ui-tag")).toBeNull();
  },
});

export const CatchUpWithoutTranslation = meta.story({
  name: "Catch up without translation",
  beforeEach: () => {
    mocked(detectLanguage).mockRejectedValue(new Error(sample.failure));
  },
  render: () =>
    html`<ui-ai-text text=${sample.message} summarizable></ui-ai-text>
      <ui-ai-summary text=${sample.english} label="Summarise the reply"></ui-ai-summary>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const host = el(canvasElement, "ui-ai-text");
    await waitFor(() => expect(detectLanguage).toHaveBeenCalledWith(sample.message));
    await expect(canvas.queryByRole("button", { name: /Translate/ })).not.toBeInTheDocument();
    await expect(canvas.queryByText("English")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Catch me up" })).toBeEnabled();
    mocked(detectLanguage).mockResolvedValue(null);
    host.text = sample.english;
    await waitFor(() => expect(detectLanguage).toHaveBeenLastCalledWith(sample.english));
    await expect(canvas.queryByText("English")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Summarise the reply" }));
    await expect(await canvas.findByText("Summary · on this device")).toBeVisible();
    await expect(summarize).toHaveBeenCalledWith(
      sample.english,
      { type: "key-points", context: undefined },
      expect.any(Function),
    );
  },
});

export const SummaryOnRequest = meta.story({
  name: "Summary on request",
  render: (args) =>
    html`<ui-ai-summary text=${sample.message} label="Summarise the thread" context=${args.context}></ui-ai-summary>`,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Summarise the thread" }));
    await expect(await canvas.findByText("Summary · on this device")).toBeVisible();
    await expect(summarize).toHaveBeenCalledWith(
      sample.message,
      { type: "key-points", context: sample.context },
      expect.any(Function),
    );
    await expect(canvas.getByText("A new date is needed")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Hide summary" }));
    await expect(await canvas.findByRole("button", { name: "Summarise the thread" })).toBeEnabled();
    await expect(canvas.queryByText("Summary · on this device")).not.toBeInTheDocument();
    mocked(summarize).mockRejectedValue(new Error(sample.failure));
    await userEvent.click(canvas.getByRole("button", { name: "Summarise the thread" }));
    await expect(await canvas.findByText(sample.failure)).toBeVisible();
    await expect(canvas.queryByText("Summary · on this device")).not.toBeInTheDocument();
  },
});

export const SummaryByItself = meta.story({
  name: "Summary by itself",
  render: () =>
    html`<ui-ai-summary text=${sample.message} type="tldr" auto></ui-ai-summary>
      <ui-ai-summary text=${sample.english} auto></ui-ai-summary>`,
  play: async ({ canvas, canvasElement }) => {
    const [line, points] = canvasElement.querySelectorAll("ui-ai-summary");
    const tldr = await canvas.findByText(sample.tldr);
    await expect(tldr.closest("[title]")).toHaveAttribute("title", "Summarised on this device");
    await expect(summarize).toHaveBeenCalledWith(sample.message, { type: "tldr", context: undefined });
    await expect(await within(points!).findByText("Summary · on this device")).toBeVisible();
    await expect(within(points!).getByRole("button", { name: "Hide summary" })).toBeEnabled();
    await expect(within(line!).queryByRole("button")).not.toBeInTheDocument();
    mocked(summarize).mockRejectedValue(new Error(sample.failure));
    line!.text = sample.firstLine;
    await waitFor(() => expect(canvas.queryByText(sample.tldr)).not.toBeInTheDocument());
    await expect(line!.childElementCount).toBe(0);
    mocked(summarize).mockResolvedValue(sample.tldr);
    mocked(availability).mockResolvedValue("downloadable");
    line!.text = sample.secondLine;
    await waitFor(() => expect(availability).toHaveBeenCalledWith("Summarizer"));
    await expect(canvas.queryByText(sample.tldr)).not.toBeInTheDocument();
    line!.text = " ";
    await settle(line!);
    await expect(line!.childElementCount).toBe(0);
    mocked(supported).mockReturnValue(false);
    await settle(points!);
    await expect(points!.childElementCount).toBe(0);
  },
});

export const RewritesAReply = meta.story({
  name: "Rewrites a reply",
  render: (args) =>
    html`<ui-ai-tools
      value=${sample.reply}
      brief=${sample.brief}
      context=${args.context}
      @ui-change=${args.onChange}
    ></ui-ai-tools>`,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const tools = el(canvasElement, "ui-ai-tools");
    const steps: [string, string, string][] = [
      ["Draft with AI", sample.draft, "Drafted"],
      ["More formal", sample.formal, "Made more formal"],
      ["Friendlier", sample.friendly, "Made friendlier"],
      ["Firmer", sample.firm, "Made firmer"],
      ["Shorter", sample.shorter, "Shortened"],
    ];
    for (const [name, value, done] of steps) {
      await userEvent.click(canvas.getByRole("button", { name }));
      await expect(await canvas.findByText(done)).toBeVisible();
      await expect(args.onChange).toHaveBeenLastCalledWith(picked({ value }));
      await expect(tools.value).toBe(value);
    }
    await expect(write).toHaveBeenCalledWith(
      sample.brief,
      { tone: "formal", context: sample.context },
      expect.any(Function),
    );
    await expect(rewrite).toHaveBeenCalledWith(
      sample.draft,
      { tone: "more-formal", context: sample.context },
      expect.any(Function),
    );
    await expect(rewrite).toHaveBeenCalledWith(
      sample.formal,
      { tone: "more-casual", context: "Warmer and friendlier, still professional." },
      expect.any(Function),
    );
    await expect(rewrite).toHaveBeenCalledWith(
      sample.firm,
      { length: "shorter", context: sample.context },
      expect.any(Function),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }));
    await expect(args.onChange).toHaveBeenLastCalledWith(picked({ value: sample.firm }));
    await expect(tools.value).toBe(sample.firm);
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Undo" })).not.toBeInTheDocument());
    await expect(canvas.queryByText("Shortened")).not.toBeInTheDocument();
    await expect(args.onChange).toHaveBeenCalledTimes(6);
  },
});

export const ProofreadsAndTranslates = meta.story({
  name: "Proofreads and translates",
  render: (args) =>
    html`<ui-ai-tools value=${sample.reply} tools="proofread translate" @ui-change=${args.onChange}></ui-ai-tools>`,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const tools = el(canvasElement, "ui-ai-tools");
    await expect(canvas.getAllByRole("button")).toHaveLength(2);
    await userEvent.click(canvas.getByRole("button", { name: "Proofread" }));
    await expect(await canvas.findByText("2 fixes")).toBeVisible();
    await expect(args.onChange).toHaveBeenLastCalledWith(picked({ value: sample.corrected }));
    mocked(proofread).mockResolvedValue({ text: sample.corrected, fixes: 0 });
    await userEvent.click(canvas.getByRole("button", { name: "Proofread" }));
    await expect(await canvas.findByText("No fixes needed")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Undo" })).toBeVisible();
    await expect(args.onChange).toHaveBeenCalledOnce();
    tools.value = sample.reply;
    mocked(proofread).mockResolvedValue({ text: sample.formal, fixes: 0 });
    await userEvent.click(canvas.getByRole("button", { name: "Proofread" }));
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(picked({ value: sample.formal })));
    await expect(canvas.getByText("No fixes needed")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Translate" }));
    await expect(await canvas.findByText("Translated to Arabic")).toBeVisible();
    await expect(detectLanguage).toHaveBeenCalledWith(sample.formal, expect.any(Function));
    await expect(translate).toHaveBeenLastCalledWith(sample.formal, "en", "ar", expect.any(Function));
    await expect(tools.value).toBe(sample.inArabic);
    mocked(detectLanguage).mockResolvedValue({ language: "ar", confidence: 0.9 });
    await userEvent.click(canvas.getByRole("button", { name: "Translate" }));
    await expect(await canvas.findByText("Translated to English")).toBeVisible();
    await expect(translate).toHaveBeenLastCalledWith(sample.inArabic, "ar", "en", expect.any(Function));
    mocked(detectLanguage).mockRejectedValue(new Error(sample.failure));
    await userEvent.click(canvas.getByRole("button", { name: "Translate" }));
    await waitFor(() => expect(translate).toHaveBeenLastCalledWith(sample.english, "en", "ar", expect.any(Function)));
    await expect(await canvas.findByText("Translated to Arabic")).toBeVisible();
    mocked(detectLanguage).mockResolvedValue(null);
    await userEvent.click(canvas.getByRole("button", { name: "Translate" }));
    await waitFor(() => expect(translate).toHaveBeenLastCalledWith(sample.inArabic, "en", "ar", expect.any(Function)));
  },
});

export const ToolsKeepTheTextWhenNothingChanges = meta.story({
  name: "Tools keep the text when nothing changes",
  render: (args) => html`<ui-ai-tools value=${sample.formal} tools="formal" @ui-change=${args.onChange}></ui-ai-tools>`,
  play: async ({ canvas, userEvent, args }) => {
    const job = deferred<string>();
    mocked(rewrite).mockReturnValue(job.promise);
    const button = canvas.getByRole("button", { name: "More formal" });
    await userEvent.click(button);
    await expect(await canvas.findByText("Rewriting…")).toBeVisible();
    await expect(button).toBeDisabled();
    await expect(rewrite).toHaveBeenCalledWith(
      sample.formal,
      { tone: "more-formal", context: undefined },
      expect.any(Function),
    );
    job.resolve(sample.formal);
    await waitFor(() => expect(canvas.queryByText("Rewriting…")).not.toBeInTheDocument());
    await expect(button).toBeEnabled();
    await expect(canvas.queryByRole("button", { name: "Undo" })).not.toBeInTheDocument();
    mocked(rewrite).mockRejectedValue(new Error(sample.failure));
    await userEvent.click(button);
    await expect(await canvas.findByText(sample.failure)).toBeVisible();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const ToolsNeedText = meta.story({
  name: "Tools need text",
  render: () =>
    html`<ui-ai-tools value=" "></ui-ai-tools
      ><ui-ai-tools value=" " brief=${sample.brief} tools="draft"></ui-ai-tools>`,
  play: async ({ canvas, canvasElement }) => {
    const [plain] = canvasElement.querySelectorAll("ui-ai-tools");
    await expect(canvas.getByRole("button", { name: "Draft with AI" })).toBeEnabled();
    for (const name of ["More formal", "Friendlier", "Firmer", "Shorter", "Proofread", "Translate"])
      await expect(canvas.getByRole("button", { name })).toBeDisabled();
    await expect(within(plain!).queryByRole("button", { name: "Draft with AI" })).not.toBeInTheDocument();
    mocked(supported).mockImplementation(only("Writer"));
    await settle(plain!);
    await expect(plain!.childElementCount).toBe(0);
  },
});

export const ClassifiesByItself = meta.story({
  name: "Classifies by itself",
  render: (args) =>
    html`<ui-ai-classify
      text=${sample.message}
      .options=${categories}
      what="customer messages"
      pickable
      @ui-select=${args.onSelect}
    ></ui-ai-classify>`,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(await canvas.findByText("Looks like: Complaint · 82%")).toBeVisible();
    await expect(classify).toHaveBeenCalledOnce();
    await expect(classify).toHaveBeenCalledWith(sample.message, categories, "customer messages");
    await expect(availability).toHaveBeenCalledWith("DecisionModel", {
      questions: [{ id: "ok", type: "boolean", prompt: "Is this text?" }],
    });
    await userEvent.click(canvas.getByRole("button", { name: "Use this" }));
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(args.onSelect).toHaveBeenCalledWith(picked({ value: "Complaint" }));
    mocked(classify).mockRejectedValue(new Error(sample.failure));
    el(canvasElement, "ui-ai-classify").text = sample.english;
    await expect(await canvas.findByRole("button", { name: "Suggest a category" })).toBeEnabled();
    await expect(canvas.queryByText(/Complaint/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(sample.failure)).not.toBeInTheDocument();
  },
});

export const ClassifiesOnRequest = meta.story({
  name: "Classifies on request",
  beforeEach: () => {
    mocked(supported).mockImplementation(but("DecisionModel"));
    mocked(availability).mockResolvedValue("downloadable");
  },
  render: () => html`<ui-ai-classify text=${sample.message} .options=${categories} label="Category"></ui-ai-classify>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const host = el(canvasElement, "ui-ai-classify");
    await waitFor(() => expect(availability).toHaveBeenCalledWith("LanguageModel", {}));
    await expect(classify).not.toHaveBeenCalled();
    const job = deferred<{ category: string } | null>();
    mocked(classify).mockReturnValue(job.promise);
    await userEvent.click(canvas.getByRole("button", { name: "Suggest a category" }));
    await expect(await canvas.findByText("Reading…")).toBeVisible();
    await expect(classify).toHaveBeenCalledWith(sample.message, categories, "messages", expect.any(Function));
    job.resolve({ category: "Question" });
    await expect(await canvas.findByText("Category: Question")).toBeVisible();
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    host.text = sample.english;
    await expect(await canvas.findByRole("button", { name: "Suggest a category" })).toBeEnabled();
    mocked(classify).mockRejectedValue(new Error(sample.failure));
    await userEvent.click(canvas.getByRole("button", { name: "Suggest a category" }));
    await expect(await canvas.findByText(sample.failure)).toBeVisible();
    mocked(classify).mockResolvedValue({ category: "Order", confidence: 0.7 });
    await userEvent.click(canvas.getByRole("button", { name: "Suggest a category" }));
    await expect(await canvas.findByText("Category: Order · 70%")).toBeVisible();
    await expect(canvas.queryByText(sample.failure)).not.toBeInTheDocument();
    mocked(classify).mockResolvedValue(null);
    host.text = sample.firstLine;
    mocked(availability).mockResolvedValue("available");
    host.text = sample.secondLine;
    await expect(await canvas.findByRole("button", { name: "Suggest a category" })).toBeEnabled();
    await waitFor(() => expect(classify).toHaveBeenLastCalledWith(sample.secondLine, categories, "messages"));
  },
});

export const ClassifyNeedsAModel = meta.story({
  name: "Classify needs a model, text and options",
  beforeEach: () => {
    mocked(supported).mockReturnValue(false);
  },
  render: () =>
    html`<ui-ai-classify text=${sample.message} .options=${categories}></ui-ai-classify>
      <ui-ai-classify text=" " .options=${categories}></ui-ai-classify>
      <ui-ai-classify text=${sample.message}></ui-ai-classify>`,
  play: async ({ canvasElement }) => {
    const all = [...canvasElement.querySelectorAll("ui-ai-classify")];
    await expect(all.every((x) => x.childElementCount === 0)).toBe(true);
    mocked(supported).mockImplementation(only("DecisionModel"));
    for (const x of all) await settle(x);
    await expect(all.map((x) => x.childElementCount)).toEqual([1, 0, 0]);
    await expect(availability).not.toHaveBeenCalled();
  },
});

export const ChecksAMessage = meta.story({
  name: "Checks a message",
  render: () => html`<ui-ai-check text=${sample.message} .questions=${questions}></ui-ai-check>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const host = el(canvasElement, "ui-ai-check");
    const job = deferred<CheckAnswer[]>();
    mocked(check).mockReturnValue(job.promise);
    const button = canvas.getByRole("button", { name: "Check with AI" });
    await userEvent.click(button);
    await expect(await canvas.findByText("Checking…")).toBeVisible();
    await expect(button).toBeDisabled();
    await expect(check).toHaveBeenCalledWith(sample.message, questions, expect.any(Function));
    job.resolve(answers);
    await expect(await canvas.findByText("Checked on this device — a person decides")).toBeVisible();
    await expect(canvas.getByText("Gives a date · 90%")).toBeVisible();
    await expect(canvas.getByText("Could be more polite")).toBeVisible();
    await expect(canvas.queryByText("Quotes a price")).not.toBeInTheDocument();
    await expect(canvas.queryByText("No price quoted")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Check again" })).toBeEnabled();
    host.text = sample.english;
    await expect(await canvas.findByRole("button", { name: "Check with AI" })).toBeEnabled();
    await expect(canvas.queryByText("Gives a date · 90%")).not.toBeInTheDocument();
    mocked(check).mockRejectedValue(new Error(sample.failure));
    await userEvent.click(canvas.getByRole("button", { name: "Check with AI" }));
    await expect(await canvas.findByText(sample.failure)).toBeVisible();
    await expect(canvas.queryByText("Checked on this device — a person decides")).not.toBeInTheDocument();
  },
});

export const CheckNeedsAModel = meta.story({
  name: "Check needs a model, text and questions",
  render: () =>
    html`<ui-ai-check text=" " .questions=${questions}></ui-ai-check>
      <ui-ai-check text=${sample.message}></ui-ai-check>
      <ui-ai-check text=${sample.message} .questions=${questions} label="Review"></ui-ai-check>`,
  play: async ({ canvas, canvasElement }) => {
    const all = [...canvasElement.querySelectorAll("ui-ai-check")];
    await expect(all.map((x) => x.childElementCount)).toEqual([0, 0, 1]);
    await expect(canvas.getByRole("button", { name: "Review" })).toBeEnabled();
    mocked(supported).mockReturnValue(false);
    await settle(all[2]!);
    await expect(all[2]!.childElementCount).toBe(0);
  },
});

export const ReadsAPhoto = meta.story({
  name: "Reads a photo",
  render: (args) =>
    html`<ui-ai-read-file
      image-prompt=${args.imagePrompt}
      audio-prompt=${args.audioPrompt}
      pickable
      @ui-select=${args.onSelect}
    ></ui-ai-read-file>`,
  play: async ({ canvas, userEvent, args }) => {
    const photo = files.photo();
    const picker = choose(photo);
    try {
      const job = deferred<string>();
      mocked(readMedia).mockReturnValue(job.promise);
      await userEvent.click(canvas.getByRole("button", { name: "Read a photo or voice note" }));
      await expect(await canvas.findByText("Reading the photo…")).toBeVisible();
      await expect(picker.accepts).toEqual(["image/*,audio/*"]);
      await expect(readMedia).toHaveBeenCalledWith(photo, "image", args.imagePrompt, expect.any(Function));
      job.resolve(sample.read);
    } finally {
      picker.restore();
    }
    await expect(await canvas.findByText("Read from quote.png · on this device — check it")).toBeVisible();
    await expect(canvas.getByText("Reference 4471")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Use this" }));
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(args.onSelect).toHaveBeenCalledWith(picked({ value: sample.read }));
  },
});

export const ReadsAVoiceNote = meta.story({
  name: "Reads a voice note",
  render: (args) => html`<ui-ai-read-file audio-prompt=${args.audioPrompt} label="Attach"></ui-ai-read-file>`,
  play: async ({ canvas, userEvent, args }) => {
    const voice = files.voice();
    const picker = choose(voice);
    try {
      mocked(readMedia).mockResolvedValue(sample.transcript);
      await userEvent.click(canvas.getByRole("button", { name: "Attach" }));
      await expect(await canvas.findByText("Heard from note.ogg · on this device — check it")).toBeVisible();
      await expect(readMedia).toHaveBeenCalledWith(voice, "audio", args.audioPrompt, expect.any(Function));
      await expect(canvas.getByText(sample.transcript)).toBeVisible();
      await expect(canvas.queryByRole("button", { name: "Use this" })).not.toBeInTheDocument();
    } finally {
      picker.restore();
    }
  },
});

export const ReadingCanBeCancelled = meta.story({
  name: "Reading can be cancelled or fail",
  render: () => html`<ui-ai-read-file></ui-ai-read-file>`,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Read a photo or voice note" });
    for (const file of ["cancel", null] as const) {
      const picker = choose(file);
      try {
        await userEvent.click(button);
        await expect(picker.accepts).toHaveLength(1);
      } finally {
        picker.restore();
      }
    }
    await expect(readMedia).not.toHaveBeenCalled();
    await expect(canvas.queryByText(/on this device/)).not.toBeInTheDocument();
    mocked(readMedia).mockRejectedValue(new Error(sample.failure));
    const picker = choose(files.photo());
    try {
      await userEvent.click(button);
      await expect(await canvas.findByText(sample.failure)).toBeVisible();
    } finally {
      picker.restore();
    }
    await expect(canvas.queryByText(/Read from/)).not.toBeInTheDocument();
  },
});

export const FilesNeedTheBrowserModel = meta.story({
  name: "Files need the browser's own model",
  beforeEach: () => {
    mocked(usingLocalModel).mockReturnValue(true);
  },
  render: () =>
    html`<ui-ai-read-file></ui-ai-read-file><ui-ai-dictate></ui-ai-dictate
      ><ui-ai-extract source="file" .fields=${fields}></ui-ai-extract>`,
  play: async ({ canvasElement }) => {
    const all = [...canvasElement.querySelectorAll("ui-ai-read-file, ui-ai-dictate, ui-ai-extract")] as (
      | HTMLElementTagNameMap["ui-ai-read-file"]
      | HTMLElementTagNameMap["ui-ai-dictate"]
      | HTMLElementTagNameMap["ui-ai-extract"]
    )[];
    await expect(all.map((x) => x.childElementCount)).toEqual([0, 0, 0]);
    mocked(usingLocalModel).mockReturnValue(false);
    mocked(supported).mockImplementation(but("LanguageModel"));
    for (const x of all) await settle(x);
    await expect(all.map((x) => x.childElementCount)).toEqual([0, 0, 0]);
    mocked(supported).mockReturnValue(true);
    for (const x of all) await settle(x);
    await expect(all.map((x) => x.childElementCount)).toEqual([1, 1, 1]);
  },
});

export const FillsFromPastedText = meta.story({
  name: "Fills from pasted text",
  render: (args) =>
    html`<ui-ai-extract
      .fields=${fields}
      what="enquiry"
      pickable
      use-label="Fill the form"
      @ui-select=${args.onSelect}
    ></ui-ai-extract>`,
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole("textbox", { name: "Fill from text" });
    await expect(box).toHaveAttribute("placeholder", "Paste the message here…");
    const button = canvas.getByRole("button", { name: "Fill from text" });
    await expect(button).toBeDisabled();
    await userEvent.type(box, "   ");
    await expect(button).toBeDisabled();
    await userEvent.clear(box);
    await userEvent.type(box, sample.pasted);
    await expect(button).toBeEnabled();
    const job = deferred<typeof extracted>();
    mocked(extract).mockReturnValue(job.promise);
    await userEvent.click(button);
    await expect(await canvas.findByText("Reading…")).toBeVisible();
    await expect(button).toBeDisabled();
    await expect(extract).toHaveBeenCalledWith(sample.pasted, fields, "enquiry", expect.any(Function));
    job.resolve(extracted);
    await expect(await canvas.findByText("Found on this device — check before using")).toBeVisible();
    await expect(canvas.getByText("Sam Lee")).toBeVisible();
    await expect(canvas.getByText("12")).toBeVisible();
    await expect(canvas.getAllByText("not found")).toHaveLength(3);
    await userEvent.click(canvas.getByRole("button", { name: "Fill the form" }));
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(args.onSelect).toHaveBeenCalledWith(picked({ values: extracted }));
  },
});

export const FillsFromGivenText = meta.story({
  name: "Fills from given text",
  render: () =>
    html`<ui-ai-extract source="text" text=${sample.pasted} .fields=${fields} label="Read the message"></ui-ai-extract>
      <ui-ai-extract source="text" text=" " .fields=${fields} label="Nothing to read"></ui-ai-extract>`,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("button", { name: "Nothing to read" })).toBeDisabled();
    mocked(extract).mockRejectedValue(new Error(sample.failure));
    await userEvent.click(canvas.getByRole("button", { name: "Read the message" }));
    await expect(await canvas.findByText(sample.failure)).toBeVisible();
    await expect(extract).toHaveBeenCalledWith(sample.pasted, fields, "message", expect.any(Function));
    await expect(canvas.queryByText("Found on this device — check before using")).not.toBeInTheDocument();
    mocked(extract).mockResolvedValue(extracted);
    await userEvent.click(canvas.getByRole("button", { name: "Read the message" }));
    await expect(await canvas.findByText("Found on this device — check before using")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Use these" })).not.toBeInTheDocument();
  },
});

export const FillsFromAFile = meta.story({
  name: "Fills from a file",
  render: () => html`<ui-ai-extract source="file" .fields=${fields} label="Fill from a file"></ui-ai-extract>`,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Fill from a file" });
    const cancel = choose("cancel");
    try {
      await userEvent.click(button);
      await expect(cancel.accepts).toEqual(["image/*,audio/*"]);
    } finally {
      cancel.restore();
    }
    await expect(extract).not.toHaveBeenCalled();
    const voice = files.voice();
    const job = deferred<typeof extracted>();
    mocked(extract).mockReturnValue(job.promise);
    const heard = choose(voice);
    try {
      await userEvent.click(button);
      await expect(await canvas.findByText("Listening…")).toBeVisible();
      await expect(extract).toHaveBeenCalledWith(
        { file: voice, kind: "audio" },
        fields,
        "message",
        expect.any(Function),
      );
      job.resolve(extracted);
      await expect(await canvas.findByText("Sam Lee")).toBeVisible();
    } finally {
      heard.restore();
    }
    const photo = files.photo();
    mocked(extract).mockRejectedValue(new Error(sample.failure));
    const seen = choose(photo);
    try {
      await userEvent.click(button);
      await expect(await canvas.findByText(sample.failure)).toBeVisible();
      await expect(extract).toHaveBeenLastCalledWith(
        { file: photo, kind: "image" },
        fields,
        "message",
        expect.any(Function),
      );
      await expect(canvas.queryByText("Sam Lee")).not.toBeInTheDocument();
    } finally {
      seen.restore();
    }
  },
});

export const ExtractNeedsFields = meta.story({
  name: "Extract needs fields and a model",
  render: () => html`<ui-ai-extract></ui-ai-extract><ui-ai-extract .fields=${fields}></ui-ai-extract>`,
  play: async ({ canvasElement }) => {
    const [none, some] = canvasElement.querySelectorAll("ui-ai-extract");
    await expect(none!.childElementCount).toBe(0);
    await expect(some!.childElementCount).toBe(1);
    mocked(supported).mockReturnValue(false);
    await settle(some!);
    await expect(some!.childElementCount).toBe(0);
  },
});

export const FlagsAConcern = meta.story({
  name: "Flags a concern",
  beforeEach: () => {
    mocked(check).mockResolvedValue([{ id: "flag", yes: true, confidence: 0.8 }]);
  },
  render: (args) =>
    html`<ui-ai-flag
      text=${sample.message}
      question=${sample.flag}
      heading=${sample.flagHeading}
      note=${args.note}
    ></ui-ai-flag>`,
  play: async ({ canvas, canvasElement }) => {
    const flag = el(canvasElement, "ui-ai-flag");
    const alert = await canvas.findByRole("alert");
    await expect(alert).toHaveTextContent(`${sample.flagHeading} · 80%`);
    await expect(alert).toHaveTextContent(`${sample.flagNote} Spotted on this device — it can be wrong.`);
    await expect(check).toHaveBeenCalledOnce();
    await expect(check).toHaveBeenCalledWith(sample.message, [{ id: "flag", prompt: sample.flag }]);
    flag.tone = "info";
    await expect(await canvas.findByRole("status")).toHaveTextContent(sample.flagHeading);
    await expect(check).toHaveBeenCalledOnce();
    mocked(check).mockResolvedValue([{ id: "flag", yes: true, confidence: 0.5 }]);
    flag.text = sample.english;
    await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
    mocked(check).mockResolvedValue([{ id: "flag", yes: true }]);
    flag.question = `${sample.flag} `;
    const unsure = await canvas.findByRole("status");
    await expect(unsure).toHaveTextContent(sample.flagHeading);
    await expect(unsure).not.toHaveTextContent("%");
    mocked(check).mockResolvedValue([{ id: "flag", yes: false, confidence: 0.9 }]);
    flag.text = sample.firstLine;
    await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
    mocked(check).mockResolvedValue([{ id: "flag", yes: true, confidence: 0.4 }]);
    flag.threshold = 0.3;
    flag.text = sample.secondLine;
    await expect(await canvas.findByRole("status")).toHaveTextContent(`${sample.flagHeading} · 40%`);
    mocked(check).mockRejectedValue(new Error(sample.failure));
    flag.text = sample.closing;
    await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
  },
});

export const FlagStaysQuiet = meta.story({
  name: "Flag stays quiet without a question or model",
  render: () =>
    html`<ui-ai-flag text=${sample.message}></ui-ai-flag>
      <ui-ai-flag text=" " question=${sample.flag}></ui-ai-flag>
      <ui-ai-flag text=${sample.message} question=${sample.flag}></ui-ai-flag>`,
  beforeEach: () => {
    mocked(supported).mockReturnValue(false);
  },
  play: async ({ canvasElement }) => {
    const flags = [...canvasElement.querySelectorAll("ui-ai-flag")];
    for (const x of flags) await x.updateComplete;
    await expect(flags.every((x) => x.childElementCount === 0)).toBe(true);
    await expect(check).not.toHaveBeenCalled();
    mocked(supported).mockReturnValue(true);
    mocked(availability).mockResolvedValue("downloading");
    flags[2]!.text = sample.english;
    await waitFor(() => expect(availability).toHaveBeenCalledWith("DecisionModel", expect.any(Object)));
    await expect(check).not.toHaveBeenCalled();
    await expect(flags[2]!.childElementCount).toBe(0);
  },
});

export const SuggestsReplies = meta.story({
  name: "Suggests replies",
  render: (args) => html`<ui-ai-replies text=${sample.message} @ui-select=${args.onSelect}></ui-ai-replies>`,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const host = el(canvasElement, "ui-ai-replies");
    const written: string[] = [];
    const clipboard = navigator.clipboard;
    const original = clipboard.writeText;
    clipboard.writeText = async (value: string) => void written.push(value);
    try {
      const job = deferred<string[]>();
      mocked(quickReplies).mockReturnValue(job.promise);
      const button = canvas.getByRole("button", { name: "Suggest replies" });
      await userEvent.click(button);
      await expect(await canvas.findByText("Writing replies…")).toBeVisible();
      await expect(button).toBeDisabled();
      await expect(quickReplies).toHaveBeenCalledWith(sample.message, expect.any(Function));
      job.resolve(sample.replies);
      const first = await canvas.findByRole("button", { name: sample.replies[0] });
      await expect(canvas.getByRole("button", { name: "Other replies" })).toBeEnabled();
      await userEvent.click(first);
      await expect(args.onSelect).toHaveBeenLastCalledWith(picked({ value: sample.replies[0] }));
      await expect(written).toEqual([sample.replies[0]]);
      await expect(await canvas.findByRole("button", { name: `${sample.replies[0]} · Copied` })).toBeVisible();
      clipboard.writeText = async () => Promise.reject(new Error(sample.failure));
      await userEvent.click(canvas.getByRole("button", { name: sample.replies[1] }));
      await expect(args.onSelect).toHaveBeenLastCalledWith(picked({ value: sample.replies[1] }));
      await expect(canvas.getByRole("button", { name: sample.replies[1] })).not.toHaveTextContent("Copied");
      await expect(canvas.getByRole("button", { name: `${sample.replies[0]} · Copied` })).toBeVisible();
      mocked(quickReplies).mockRejectedValue(new Error(sample.failure));
      await userEvent.click(canvas.getByRole("button", { name: "Other replies" }));
      await expect(await canvas.findByText(sample.failure)).toBeVisible();
      await expect(canvas.queryByRole("button", { name: sample.replies[0] })).not.toBeInTheDocument();
      mocked(quickReplies).mockResolvedValue(sample.replies);
      await userEvent.click(canvas.getByRole("button", { name: "Suggest replies" }));
      await expect(await canvas.findByRole("button", { name: sample.replies[0] })).toBeVisible();
      host.text = sample.english;
      await waitFor(() => expect(canvas.queryByRole("button", { name: sample.replies[0] })).not.toBeInTheDocument());
      await expect(canvas.getByRole("button", { name: "Suggest replies" })).toBeEnabled();
      mocked(supported).mockReturnValue(false);
      await settle(host);
      await expect(host.childElementCount).toBe(0);
    } finally {
      clipboard.writeText = original;
    }
  },
});

class Recorder {
  static type = "audio/ogg";
  mimeType = Recorder.type;
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  stream: MediaStream;
  constructor(stream: MediaStream) {
    this.stream = stream;
  }
  start() {}
  stop() {
    this.ondataavailable?.({ data: new Blob(["voice"]) });
    this.onstop?.();
  }
}

const microphone = (stream: () => Promise<MediaStream>) => {
  const devices = navigator.mediaDevices;
  const original = devices.getUserMedia;
  const recorder = window.MediaRecorder;
  devices.getUserMedia = stream;
  window.MediaRecorder = Recorder as unknown as typeof MediaRecorder;
  return () => {
    devices.getUserMedia = original;
    window.MediaRecorder = recorder;
  };
};

export const DictatesAVoiceNote = meta.story({
  name: "Dictates a voice note",
  render: (args) => html`<ui-ai-dictate @ui-select=${args.onSelect}></ui-ai-dictate>`,
  play: async ({ canvas, userEvent, args }) => {
    const track = { stop: fn() };
    const restore = microphone(async () => ({ getTracks: () => [track] }) as unknown as MediaStream);
    try {
      await userEvent.click(canvas.getByRole("button", { name: "Dictate" }));
      const stop = await canvas.findByRole("button", { name: "Stop and write it down" });
      await expect(canvas.getByText("Listening…")).toBeVisible();
      const job = deferred<string>();
      mocked(transcribe).mockReturnValue(job.promise);
      await userEvent.click(stop);
      await expect(await canvas.findByText("Writing it down…")).toBeVisible();
      await expect(track.stop).toHaveBeenCalledOnce();
      const [audio] = mocked(transcribe).mock.calls[0]!;
      await expect(audio.type).toBe("audio/ogg");
      await expect(audio.size).toBe(5);
      await expect(canvas.getByRole("button", { name: "Dictate" })).toBeDisabled();
      job.resolve(sample.transcript);
      await waitFor(() => expect(args.onSelect).toHaveBeenCalledWith(picked({ value: sample.transcript })));
      await expect(args.onSelect).toHaveBeenCalledOnce();
      await expect(canvas.getByRole("button", { name: "Dictate" })).toBeEnabled();
      Recorder.type = "";
      mocked(transcribe).mockResolvedValue("");
      await userEvent.click(canvas.getByRole("button", { name: "Dictate" }));
      await userEvent.click(await canvas.findByRole("button", { name: "Stop and write it down" }));
      await waitFor(() => expect(transcribe).toHaveBeenCalledTimes(2));
      await expect(mocked(transcribe).mock.calls[1]![0].type).toBe("audio/webm");
      await expect(await canvas.findByRole("button", { name: "Dictate" })).toBeEnabled();
      await expect(args.onSelect).toHaveBeenCalledOnce();
    } finally {
      Recorder.type = "audio/ogg";
      restore();
    }
  },
});

export const DictationWithoutAMicrophone = meta.story({
  name: "Dictation without a microphone",
  render: () => html`<ui-ai-dictate label="Speak"></ui-ai-dictate>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const host = el(canvasElement, "ui-ai-dictate");
    const restore = microphone(async () => Promise.reject(new Error("denied")));
    try {
      await userEvent.click(canvas.getByRole("button", { name: "Speak" }));
      await expect(
        await canvas.findByText("The microphone isn't available (check the browser's permission)."),
      ).toBeVisible();
      await expect(canvas.getByRole("button", { name: "Speak" })).toBeEnabled();
    } finally {
      restore();
    }
    const show = hide(navigator, "mediaDevices");
    try {
      await settle(host);
      await expect(host.childElementCount).toBe(0);
    } finally {
      show();
    }
    await settle(host);
    await expect(canvas.getByRole("button", { name: "Speak" })).toBeVisible();
  },
});

const voice = () => {
  const spoken: SpeechSynthesisUtterance[] = [];
  const cancel = fn();
  speechSynthesis.speak = (u: SpeechSynthesisUtterance) => void spoken.push(u);
  speechSynthesis.cancel = cancel;
  return {
    spoken,
    cancel,
    restore: () => {
      delete (speechSynthesis as Partial<SpeechSynthesis>).speak;
      delete (speechSynthesis as Partial<SpeechSynthesis>).cancel;
    },
  };
};

export const ReadsAloud = meta.story({
  name: "Reads aloud",
  render: () => html`<ui-speak text=${sample.speech}></ui-speak>`,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const speak = el(canvasElement, "ui-speak");
    const tts = voice();
    try {
      await userEvent.click(canvas.getByRole("button", { name: "Read aloud" }));
      await expect(tts.spoken).toHaveLength(1);
      await expect(tts.spoken[0]!.text).toBe(sample.speech);
      await expect(tts.spoken[0]!.lang).toBe("en-GB");
      await userEvent.click(await canvas.findByRole("button", { name: "Stop" }));
      await expect(tts.cancel).toHaveBeenCalledTimes(2);
      await userEvent.click(await canvas.findByRole("button", { name: "Read aloud" }));
      await expect(await canvas.findByRole("button", { name: "Stop" })).toBeVisible();
      tts.spoken[1]!.onend!(new Event("end") as SpeechSynthesisEvent);
      await expect(await canvas.findByRole("button", { name: "Read aloud" })).toBeVisible();
      await userEvent.click(canvas.getByRole("button", { name: "Read aloud" }));
      await canvas.findByRole("button", { name: "Stop" });
      tts.cancel.mockClear();
      speak.remove();
      await expect(tts.cancel).toHaveBeenCalledOnce();
      tts.cancel.mockClear();
      canvasElement.append(speak);
      tts.spoken[2]!.onerror!(new Event("error") as SpeechSynthesisErrorEvent);
      await expect(await canvas.findByRole("button", { name: "Read aloud" })).toBeVisible();
      speak.remove();
      await expect(tts.cancel).not.toHaveBeenCalled();
      canvasElement.append(speak);
    } finally {
      tts.restore();
    }
  },
});

export const ReadAloudNeedsSpeech = meta.story({
  name: "Read aloud needs text and speech",
  render: () => html`<ui-speak text=" "></ui-speak><ui-speak text=${sample.speech} label="Listen"></ui-speak>`,
  play: async ({ canvas, canvasElement }) => {
    const [blank, speak] = canvasElement.querySelectorAll("ui-speak");
    await expect(blank!.childElementCount).toBe(0);
    await expect(canvas.getByRole("button", { name: "Listen" })).toBeVisible();
    const show = hide(window, "speechSynthesis");
    try {
      await settle(speak!);
      await expect(speak!.childElementCount).toBe(0);
    } finally {
      show();
    }
    await settle(speak!);
    await expect(canvas.getByRole("button", { name: "Listen" })).toBeVisible();
    const original = getLocale;
    overwriteGetLocale(() => "ar");
    try {
      await expect(document.createElement("ui-speak").lang).toBe("ar");
    } finally {
      overwriteGetLocale(original);
    }
    await expect(document.createElement("ui-speak").lang).toBe("en-GB");
  },
});
