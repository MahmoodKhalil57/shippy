import { business, org } from "./identity.ts";
import { intlTag, locale } from "../i18n/index.ts";

export type BuiltInApi =
  | "LanguageDetector"
  | "Translator"
  | "Summarizer"
  | "Writer"
  | "Rewriter"
  | "Proofreader"
  | "LanguageModel"
  | "DecisionModel";
export type Availability = "unavailable" | "downloadable" | "downloading" | "available";
export type Progress = (fraction: number) => void;

interface Factory {
  availability(options?: object): Promise<Availability>;
  create(options?: object): Promise<unknown>;
}

const factory = (api: BuiltInApi) => (globalThis as unknown as Record<string, Factory | undefined>)[api];

export const supported = (api: BuiltInApi) => typeof factory(api)?.create === "function";

export async function availability(api: BuiltInApi, options: object = {}): Promise<Availability> {
  try {
    return (await factory(api)?.availability(options)) ?? "unavailable";
  } catch {
    return "unavailable";
  }
}

const sessions = new Map<string, Promise<unknown>>();
let listeners: Progress[] = [];

function session<T>(api: BuiltInApi, options: object, onProgress?: Progress): Promise<T> {
  if (onProgress) listeners.push(onProgress);
  const key = `${api}:${JSON.stringify(options)}`;
  let s = sessions.get(key);
  if (!s) {
    const f = factory(api);
    if (!f) return Promise.reject(new Error(`This browser has no ${api}.`));
    s = f
      .create({
        ...options,
        monitor: (m: EventTarget) =>
          m.addEventListener("downloadprogress", (e) => {
            const loaded = (e as Event & { loaded: number }).loaded;
            for (const l of listeners) l(loaded);
          }),
      })
      .finally(() => {
        listeners = [];
      });
    s.catch(() => sessions.delete(key));
    sessions.set(key, s);
  }
  return s as Promise<T>;
}

const names = new Map<string, Intl.DisplayNames>();
export const languageName = (code: string) => {
  const tag = intlTag();
  let n = names.get(tag);
  if (!n) names.set(tag, (n = new Intl.DisplayNames([tag], { type: "language" })));
  try {
    return n.of(code) ?? code;
  } catch {
    return code;
  }
};

export async function detectLanguage(
  text: string,
  onProgress?: Progress,
): Promise<{ language: string; confidence: number } | null> {
  const detector = await session<{ detect(t: string): Promise<{ detectedLanguage: string; confidence: number }[]> }>(
    "LanguageDetector",
    {},
    onProgress,
  );
  const [top] = await detector.detect(text);
  return top && top.detectedLanguage !== "und" && top.confidence > 0.5
    ? { language: top.detectedLanguage, confidence: top.confidence }
    : null;
}

export async function translate(text: string, sourceLanguage: string, targetLanguage: string, onProgress?: Progress) {
  const translator = await session<{ translate(t: string): Promise<string> }>(
    "Translator",
    { sourceLanguage, targetLanguage },
    onProgress,
  );
  return translator.translate(text);
}

export type SummaryType = "key-points" | "tldr" | "headline" | "teaser";

export async function summarize(
  text: string,
  {
    type = "key-points",
    length = "short",
    context,
  }: { type?: SummaryType; length?: "short" | "medium" | "long"; context?: string } = {},
  onProgress?: Progress,
) {
  const summarizer = await session<{ summarize(t: string, o?: { context?: string }): Promise<string> }>(
    "Summarizer",
    { type, length, format: type === "key-points" ? "markdown" : "plain-text", outputLanguage: "en" },
    onProgress,
  );
  return (await summarizer.summarize(text, context ? { context } : undefined)).trim();
}

export type WriteTone = "formal" | "neutral" | "casual";

export async function write(
  task: string,
  { tone = "formal", context }: { tone?: WriteTone; context?: string } = {},
  onProgress?: Progress,
) {
  const writer = await session<{ write(t: string, o?: { context?: string }): Promise<string> }>(
    "Writer",
    {
      tone,
      format: "plain-text",
      length: "medium",
      sharedContext: `${org()}, ${business()}.`,
    },
    onProgress,
  );
  return (await writer.write(task, context ? { context } : undefined)).trim();
}

export type RewriteTone = "more-formal" | "as-is" | "more-casual";

export async function rewrite(
  text: string,
  {
    tone = "as-is",
    length = "as-is",
    context,
  }: { tone?: RewriteTone; length?: "shorter" | "as-is" | "longer"; context?: string } = {},
  onProgress?: Progress,
) {
  const rewriter = await session<{ rewrite(t: string, o?: { context?: string }): Promise<string> }>(
    "Rewriter",
    { tone, length, format: "plain-text" },
    onProgress,
  );
  return (await rewriter.rewrite(text, context ? { context } : undefined)).trim();
}

export async function proofread(text: string, onProgress?: Progress) {
  const proofreader = await session<{
    proofread(t: string): Promise<{ correctedInput?: string; corrected?: string; corrections?: unknown[] }>;
  }>("Proofreader", { expectedInputLanguages: ["en"] }, onProgress);
  const result = await proofreader.proofread(text);
  return { text: result.correctedInput ?? result.corrected ?? text, fixes: result.corrections?.length ?? 0 };
}

const PREDICTABLE = { samplingMode: "most-predictable" };

const ENGLISH = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

type DecisionQuestion =
  | { id: string; type: "boolean"; prompt: string }
  | { id: string; type: "choice"; prompt: string; options: { label: string; description?: string }[] };
type DecisionResult = Record<string, { label: string; confidence?: number } | undefined>;

async function decide(questions: DecisionQuestion[], text: string, onProgress?: Progress): Promise<DecisionResult> {
  const schema = { expectedInputs: [{ type: "text", languages: ["en"] }], questions };
  const model = await session<{ decide(input: string): Promise<DecisionResult> }>("DecisionModel", schema, onProgress);
  return model.decide(text.slice(0, 4000));
}

interface PromptLike {
  prompt(t: unknown, o?: object): Promise<string>;
  clone?(): Promise<PromptLike>;
  destroy(): void;
}

async function promptJson<T>(system: string, input: string, schema: object, onProgress?: Progress): Promise<T> {
  const model = await session<PromptLike>(
    "LanguageModel",
    { ...ENGLISH, ...PREDICTABLE, initialPrompts: [{ role: "system", content: system }] },
    onProgress,
  );
  const s = typeof model.clone === "function" ? await model.clone() : model;
  try {
    return parseAnswer<T>(await s.prompt(input, { responseConstraint: schema }));
  } finally {
    if (s !== model) s.destroy();
  }
}

export interface Classification {
  category: string;
  confidence?: number;
}

export async function classify(
  text: string,
  options: readonly string[],
  what: string,
  onProgress?: Progress,
): Promise<Classification | null> {
  if (supported("DecisionModel")) {
    const r = await decide(
      [
        {
          id: "category",
          type: "choice",
          prompt: `Which category fits these ${what} best?`,
          options: options.map((label) => ({ label })),
        },
      ],
      text,
      onProgress,
    );
    const answer = r.category;
    return answer && options.includes(answer.label) ? { category: answer.label, confidence: answer.confidence } : null;
  }
  const r = await promptJson<{ category?: string }>(
    `You sort ${what}. Reply with one of the given categories only.`,
    `Categories: ${options.join("; ")}.\n\nText:\n${text.slice(0, 2500)}`,
    { type: "object", properties: { category: { type: "string", enum: options } }, required: ["category"] },
    onProgress,
  );
  return r.category && options.includes(r.category) ? { category: r.category } : null;
}

export interface CheckQuestion {
  id: string;
  prompt: string;
}
export interface CheckAnswer {
  id: string;
  yes: boolean;
  confidence?: number;
}

export async function check(
  text: string,
  questions: readonly CheckQuestion[],
  onProgress?: Progress,
): Promise<CheckAnswer[]> {
  if (supported("DecisionModel")) {
    const r = await decide(
      questions.map((q) => ({ id: q.id, type: "boolean" as const, prompt: q.prompt })),
      text,
      onProgress,
    );
    return questions.flatMap((q) => {
      const a = r[q.id];
      return a ? [{ id: q.id, yes: a.label === "true", confidence: a.confidence }] : [];
    });
  }
  const r = await promptJson<Record<string, boolean>>(
    "You check business documents carefully. Answer each question about the text with true or false.",
    `${questions.map((q) => `${q.id}: ${q.prompt}`).join("\n")}\n\nText:\n${text.slice(0, 3000)}`,
    {
      type: "object",
      properties: Object.fromEntries(questions.map((q) => [q.id, { type: "boolean" }])),
      required: questions.map((q) => q.id),
    },
    onProgress,
  );
  return questions.flatMap((q) => (typeof r[q.id] === "boolean" ? [{ id: q.id, yes: r[q.id]! }] : []));
}

export type MediaKind = "image" | "audio";

export async function readMedia(file: Blob, kind: MediaKind, instruction: string, onProgress?: Progress) {
  const model = await session<PromptLike>(
    "LanguageModel",
    {
      expectedInputs: [{ type: "text", languages: ["en"] }, { type: kind }],
      expectedOutputs: [{ type: "text", languages: ["en"] }],
      ...PREDICTABLE,
    },
    onProgress,
  );
  const s = typeof model.clone === "function" ? await model.clone() : model;
  try {
    const reply = await s.prompt([
      {
        role: "user",
        content: [
          { type: "text", value: instruction },
          { type: kind, value: file },
        ],
      },
    ]);
    return String(reply).trim();
  } finally {
    if (s !== model) s.destroy();
  }
}

export interface ExtractField {
  id: string;
  label: string;
  type?: "string" | "number";
  hint?: string;
}
export type Extracted = Record<string, string | number | null>;

export async function extract(
  source: string | { file: Blob; kind: MediaKind },
  fields: readonly ExtractField[],
  what: string,
  onProgress?: Progress,
): Promise<Extracted> {
  const schema = {
    type: "object",
    properties: Object.fromEntries(
      fields.map((f) => [f.id, { type: [f.type === "number" ? "number" : "string", "null"] }]),
    ),
    required: fields.map((f) => f.id),
  };
  const ask = `From this ${what}, fill in: ${fields
    .map((f) => `${f.id} (${f.label}${f.hint ? `; ${f.hint}` : ""})`)
    .join(", ")}. Use null for anything that isn't there. Never guess.`;
  const kind = typeof source === "string" ? null : source.kind;
  const model = await session<PromptLike>(
    "LanguageModel",
    {
      expectedInputs: [{ type: "text", languages: ["en"] }, ...(kind ? [{ type: kind }] : [])],
      expectedOutputs: [{ type: "text", languages: ["en"] }],
      ...PREDICTABLE,
    },
    onProgress,
  );
  const s = typeof model.clone === "function" ? await model.clone() : model;
  try {
    const input =
      typeof source === "string"
        ? `${ask}\n\n${source.slice(0, 4000)}`
        : [
            {
              role: "user",
              content: [
                { type: "text", value: ask },
                { type: source.kind, value: source.file },
              ],
            },
          ];
    return parseAnswer<Extracted>(await s.prompt(input, { responseConstraint: schema }));
  } finally {
    if (s !== model) s.destroy();
  }
}

export interface SuggestField {
  label: string;
  hint?: string;
  type: "string" | "number" | "boolean";
  options?: readonly string[];
  format?: "date" | "email" | "paragraph";
}

export async function suggest(
  field: SuggestField,
  what: string,
  known: Readonly<Record<string, string>>,
  today: string,
  onProgress?: Progress,
): Promise<string | number | boolean | null> {
  const choices = field.options?.length ? [...field.options, NO_ANSWER] : undefined;
  const value = choices ? { type: "string", enum: choices } : { type: [field.type, "null"] };
  const schema = { type: "object", properties: { value }, required: ["value"] };
  const lines = Object.entries(known).map(([k, v]) => `- ${k}: ${v.slice(0, 200)}`);
  const shape =
    field.format === "date"
      ? " Answer a date as YYYY-MM-DD."
      : field.format === "paragraph"
        ? " Answer in one to three plain sentences."
        : field.type === "string"
          ? " Answer in a few words, as a person would type it."
          : "";
  const r = await promptJson<{ value?: string | number | boolean | null }>(
    `You help someone at ${business() || org()} fill in a ${what}. Suggest the most likely value for one field, ` +
      `from the rest of the form. Use what the form says; don't make up names, numbers, dates or references ` +
      `it gives no ground for: answer ${choices ? `"${NO_ANSWER}"` : "null"} instead. Today is ${today}.${shape} ` +
      `Write text in the language the form is written in${locale() === "ar" ? " (Arabic when unsure)" : ""}.`,
    `The form so far:\n${lines.join("\n") || "(empty)"}\n\nSuggest: ${field.label}${field.hint ? ` (${field.hint})` : ""}`,
    schema,
    onProgress,
  );
  const v = r.value;
  if (v == null || v === "") return null;
  if (field.options?.length) return typeof v === "string" && field.options.includes(v) ? v : null;
  if (field.type === "number") return typeof v === "number" && Number.isFinite(v) ? v : null;
  if (field.type === "boolean") return typeof v === "boolean" ? v : null;
  if (typeof v !== "string") return null;
  if (field.format === "date") return /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? v.trim() : null;
  return v.trim().slice(0, field.format === "paragraph" ? 600 : 120) || null;
}
const NO_ANSWER = "(no answer)";

export async function score(text: string, question: string, onProgress?: Progress): Promise<number | null> {
  if (supported("DecisionModel")) {
    const model = await session<{
      decide(input: string): Promise<Record<string, { label: string; expectedScore?: number } | undefined>>;
    }>(
      "DecisionModel",
      {
        expectedInputs: [{ type: "text", languages: ["en"] }],
        questions: [{ id: "score", type: "score", prompt: question }],
      },
      onProgress,
    );
    const r = (await model.decide(text.slice(0, 3000))).score;
    const n = r?.expectedScore ?? Number(r?.label);
    return Number.isFinite(n) ? Math.round(n) : null;
  }
  const r = await promptJson<{ score?: number }>(
    "You rate business messages. Reply with a whole number from 1 to 5.",
    `${question} (1 = not at all, 5 = extremely)\n\n${text.slice(0, 2500)}`,
    { type: "object", properties: { score: { type: "integer", minimum: 1, maximum: 5 } }, required: ["score"] },
    onProgress,
  );
  return typeof r.score === "number" ? r.score : null;
}

export async function quickReplies(text: string, onProgress?: Progress): Promise<string[]> {
  const r = await promptJson<{ replies?: string[] }>(
    `You suggest replies for staff of ${org()}, ${business()}. Each reply is one or two short, polite, professional sentences, in the message's own language. Never promise prices, dates or quantities that aren't in the message.`,
    `Suggest three different short replies to this message:\n\n${text.slice(0, 2500)}`,
    {
      type: "object",
      properties: { replies: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 } },
      required: ["replies"],
    },
    onProgress,
  );
  return (r.replies ?? []).map((x) => x.trim()).filter(Boolean);
}

export const transcribe = (audio: Blob, onProgress?: Progress) =>
  readMedia(
    audio,
    "audio",
    "Transcribe this voice note exactly, as plain sentences. Keep numbers, quantities, names and units as said.",
    onProgress,
  );

export async function toEnglish(text: string): Promise<string> {
  if (!supported("Translator") || !supported("LanguageDetector")) return text;
  const lang = (await detectLanguage(text).catch(() => null))?.language;
  return lang && lang !== "en" ? translate(text, lang, "en") : text;
}

export async function decisionsReady(): Promise<boolean> {
  if (supported("DecisionModel"))
    return (
      (await availability("DecisionModel", { questions: [{ id: "ok", type: "boolean", prompt: "Is this text?" }] })) ===
      "available"
    );
  return (
    supported("LanguageModel") &&
    (await availability("LanguageModel", { expectedOutputs: [{ type: "text", languages: ["en"] }] })) === "available"
  );
}

function parseAnswer<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("The on-device model's answer wasn't in the expected form — try again.");
  }
}
