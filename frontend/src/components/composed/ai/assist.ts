import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/ai/markdown.ts";
import "../../primitives/data/badge.ts";
import "../../primitives/feedback/alert.ts";
import "../../primitives/feedback/loading.ts";
import "../../primitives/forms/textarea.ts";
import "../../primitives/layout/box.ts";
import "../../primitives/layout/flex.ts";
import type { IconName } from "../../primitives/media/icon.ts";
import "../../primitives/media/icon.ts";
import "../../primitives/typography/text.ts";
import {
  availability,
  check,
  classify,
  extract,
  quickReplies,
  transcribe,
  type ExtractField,
  type Extracted,
  detectLanguage,
  languageName,
  proofread,
  rewrite,
  summarize,
  supported,
  translate,
  write,
  readMedia,
  type BuiltInApi,
  type CheckAnswer,
  type CheckQuestion,
  type Classification,
  type MediaKind,
  type SummaryType,
} from "../../../agent/built-in-ai.ts";
import { AI_CHANGE, usingLocalModel } from "../../../agent/ai-polyfill.ts";

/**
 * On-device AI assists: small, reviewable jobs on the text a person is looking at, run by
 * Chrome's built-in models (src/agent/built-in-ai.ts) — nothing leaves the machine.
 *
 * Purpose: AI · Kind: composed (Button / Badge / Box / Alert / Textarea / Markdown / Text / Icon / Loading)
 *
 * - `<ui-ai-language>`: the language a text is in, as a badge.
 * - `<ui-ai-text>`: a message's text, with Translate (and back to the original) and "Catch me up".
 * - `<ui-ai-summary>`: a summary of a text — key points on request, or a one-line headline on its own.
 * - `<ui-ai-tools>`: a writing toolbar for a text field — draft it, change its tone or length,
 *   proofread it, translate it — always into the field, for the person to edit; Undo goes back.
 * - `<ui-ai-classify>`: a suggested category for a text, for the person to confirm.
 * - `<ui-ai-check>`: yes / no checks of a text (an offer against its request, a PO against its
 *   quotation), shown as things to look at — a person decides.
 * - `<ui-ai-read-file>`: read a photo or a voice note the person picks, on the device.
 * - `<ui-ai-extract>`: fill named fields from pasted text, a photo or a recording.
 * - `<ui-ai-flag>`: one yes / no question asked on its own; a warning only when the answer is yes.
 * - `<ui-ai-replies>`: three short replies to a message, copied on a click.
 * - `<ui-ai-dictate>`: speak instead of typing.
 * - `<ui-speak>`: read a text aloud (the browser's own voice).
 *
 * Each shows only what this browser supports. A model that still has to download starts at a
 * click and shows its progress; features that run on their own wait until the model is there.
 */
const RTL = new Set(["ar", "he", "fa", "ur"]);

/** The AI elements; when AI APIs appear later (the downloadable model loaded), they look again. */
const AI_TAGS =
  "ui-ai-language, ui-ai-text, ui-ai-summary, ui-ai-tools, ui-ai-classify, ui-ai-check, ui-ai-read-file, ui-ai-extract, ui-ai-flag, ui-ai-replies, ui-ai-dictate";
addEventListener(AI_CHANGE, () => {
  for (const el of document.querySelectorAll<LightElement>(AI_TAGS)) el.requestUpdate("text");
});

const aiButton = (icon: IconName, label: string, onClick: () => void, disabled = false) =>
  html`<ui-button variant="text" size="xs" ?disabled=${disabled} @click=${onClick}
    ><ui-icon name=${icon} size="xs"></ui-icon>${label}</ui-button
  >`;

/** A short line about the assist (what it did, what it's doing): an icon and small text. */
const aiNote = (icon: IconName | "loading", text: unknown, color: "muted" | "error" = "muted") =>
  html`<ui-flex inline gap="1" align="center">
    ${icon === "loading" ? html`<ui-loading size="sm"></ui-loading>` : html`<ui-icon name=${icon} size="xs"></ui-icon>`}
    <ui-text as="span" variant="body-sm" color=${color}>${text}</ui-text>
  </ui-flex>`;

/** A row of assist buttons and notes. */
const aiBar = (content: unknown) => html`<ui-flex wrap gap="1" align="center">${content}</ui-flex>`;

/** Something the on-device model produced, to check: a tinted box under a small heading. */
const aiBox = (heading: unknown, content: unknown) =>
  html`<ui-box surface="primary-soft" rounded="field" padding="3">
    <ui-flex direction="col" gap="2">
      <ui-flex gap="1" align="center">
        <ui-icon name="sparkles" size="xs" color="primary"></ui-icon>
        <ui-text as="span" variant="label-md" emphasized color="primary">${heading}</ui-text>
      </ui-flex>
      ${content}
    </ui-flex>
  </ui-box>`;

/** A small label about the text (its language, a suggested category). */
const aiBadge = (icon: IconName, text: unknown) =>
  html`<ui-tag><ui-icon name=${icon} size="xs"></ui-icon>${text}</ui-tag>`;

/** Paragraphs and line breaks of plain text. */
const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map(
      (p) =>
        html`<ui-text variant="body-md"
          >${p.split("\n").map((l, i) => html`${i ? html`<br />` : nothing}${l}`)}</ui-text
        >`,
    );

/** Asks the person for a photo or a recording (the browser's file picker; nothing is uploaded). */
function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.addEventListener("change", () => resolve(input.files?.[0] ?? null), { once: true });
    input.addEventListener("cancel", () => resolve(null), { once: true });
    input.click();
  });
}

/** What a running job shows: a spinner and what it's doing, or the download's progress. */
abstract class AssistElement extends LightElement {
  @state() protected working = "";
  @state() protected progress: number | null = null;
  @state() protected error = "";

  /** Run `job`, showing `label` meanwhile (and download progress); errors show under it. */
  protected async run<T>(label: string, job: (onProgress: (f: number) => void) => Promise<T>): Promise<T | undefined> {
    this.working = label;
    this.error = "";
    this.progress = null;
    try {
      return await job((f) => (this.progress = f));
    } catch (e) {
      this.error = (e as Error).message || "The on-device model couldn't do this.";
      return undefined;
    } finally {
      this.working = "";
      this.progress = null;
    }
  }

  protected status() {
    if (this.working)
      return aiNote(
        "loading",
        this.progress != null && this.progress < 1
          ? `Getting the on-device model… ${Math.round(this.progress * 100)}%`
          : this.working,
      );
    if (this.error) return aiNote("error", this.error, "error");
    return nothing;
  }
}

/* ---------------------------------------------------------------- language badge */

/**
 * @example <ui-ai-language .text=${message.body}></ui-ai-language>
 * Runs on its own when the language detector is on the device; shows nothing otherwise.
 */
@customElement("ui-ai-language")
export class UiAiLanguage extends LightElement {
  @property() text = "";
  @state() private language = "";

  protected async updated(changed: PropertyValues) {
    if (!changed.has("text") || !this.text.trim() || !supported("LanguageDetector")) return;
    if ((await availability("LanguageDetector")) !== "available") return;
    this.language = (await detectLanguage(this.text).catch(() => null))?.language ?? "";
  }

  render() {
    return this.language ? aiBadge("globe", languageName(this.language)) : nothing;
  }
}

/* ---------------------------------------------------------------- text with translate / catch me up */

/**
 * @example <ui-ai-text .text=${message.body} translatable summarizable></ui-ai-text>
 *
 * Translate: from the detected language to English (English text: to `alternate`, Arabic by
 * default); "Show original" goes back. Catch me up: key points above the text.
 */
@customElement("ui-ai-text")
export class UiAiText extends AssistElement {
  @property() text = "";
  @property({ type: Boolean }) translatable = false;
  @property({ type: Boolean }) summarizable = false;
  /** The language English text translates to. */
  @property() alternate = "ar";
  @state() private language = "";
  @state() private translated: { text: string; to: string } | null = null;
  @state() private summary = "";

  protected async updated(changed: PropertyValues) {
    if (!changed.has("text")) return;
    this.translated = null;
    this.summary = "";
    if (this.text.trim() && supported("LanguageDetector") && (await availability("LanguageDetector")) === "available")
      this.language = (await detectLanguage(this.text).catch(() => null))?.language ?? "";
  }

  private async _translate() {
    if (this.translated) return void (this.translated = null);
    const from = this.language || (await detectLanguage(this.text).catch(() => null))?.language || "en";
    this.language = from;
    const to = from === "en" ? this.alternate : "en";
    const text = await this.run(`Translating to ${languageName(to)}…`, (p) => translate(this.text, from, to, p));
    if (text) this.translated = { text, to };
  }

  private async _summarize() {
    if (this.summary) return void (this.summary = "");
    const source = this.translated?.to === "en" ? this.translated.text : this.text;
    this.summary = (await this.run("Reading…", (p) => summarize(source, { type: "key-points" }, p))) ?? "";
  }

  render() {
    const shown = this.translated?.text ?? this.text;
    const lang = this.translated?.to ?? this.language;
    const canTranslate = this.translatable && supported("Translator");
    const canSummarize = this.summarizable && supported("Summarizer");
    const target = (this.language || "en") === "en" ? languageName(this.alternate) : "English";
    return html`<ui-flex direction="col" gap="2">
      ${
        canTranslate || canSummarize || this.language
          ? aiBar(
              html` ${this.language ? aiBadge("globe", languageName(this.language)) : nothing}
              ${canTranslate ? aiButton("translate", this.translated ? "Show original" : `Translate to ${target}`, () => void this._translate(), !!this.working) : nothing}
              ${canSummarize ? aiButton("sparkles", this.summary ? "Hide summary" : "Catch me up", () => void this._summarize(), !!this.working) : nothing}
              ${this.status()}`,
            )
          : nothing
      }
      ${this.summary ? aiBox("Key points · on this device", html`<ui-markdown .text=${this.summary}></ui-markdown>`) : nothing}
      <ui-flex direction="col" gap="2" lang=${lang || nothing} dir=${RTL.has(lang) ? "rtl" : "auto"}>
        ${paragraphs(shown)}
      </ui-flex>
      ${this.translated ? aiNote("translate", "Translated on this device — check names and figures against the original.") : nothing}
    </ui-flex>`;
  }
}

/* ---------------------------------------------------------------- summary */

/**
 * @example <ui-ai-summary .text=${caseHistory} label="Catch me up" context="A ship-supply case."></ui-ai-summary>
 * @example <ui-ai-summary .text=${approvalFacts} type="headline" auto></ui-ai-summary>
 *
 * Key points on a click; `auto` with `type="headline"` / `"tldr"` writes one line on its own
 * (only when the model is already on the device).
 */
@customElement("ui-ai-summary")
export class UiAiSummary extends AssistElement {
  @property() text = "";
  @property() type: SummaryType = "key-points";
  @property() label = "Catch me up";
  @property() context = "";
  @property({ type: Boolean }) auto = false;
  @state() private summary = "";

  protected async updated(changed: PropertyValues) {
    if (!changed.has("text")) return;
    this.summary = "";
    if (this.auto && this.text.trim() && supported("Summarizer") && (await availability("Summarizer")) === "available")
      this.summary =
        (await summarize(this.text, { type: this.type, context: this.context || undefined }).catch(() => "")) ?? "";
  }

  private async _run() {
    if (this.summary) return void (this.summary = "");
    this.summary =
      (await this.run("Reading…", (p) =>
        summarize(this.text, { type: this.type, context: this.context || undefined }, p),
      )) ?? "";
  }

  render() {
    if (!supported("Summarizer") || !this.text.trim()) return nothing;
    if (this.auto && this.type !== "key-points")
      return this.summary
        ? html`<ui-flex gap="1" align="start" title="Summarised on this device">
            <ui-icon name="sparkles" size="xs" color="primary"></ui-icon>
            <ui-text variant="body-sm" color="muted">${this.summary}</ui-text>
          </ui-flex>`
        : nothing;
    return html`<ui-flex direction="col" gap="2">
      ${aiBar(
        html`${aiButton("sparkles", this.summary ? "Hide summary" : this.label, () => void this._run(), !!this.working)}
        ${this.status()}`,
      )}
      ${this.summary ? aiBox("Summary · on this device", html`<ui-markdown .text=${this.summary}></ui-markdown>`) : nothing}
    </ui-flex>`;
  }
}

/* ---------------------------------------------------------------- writing tools */

type ToolKey = "draft" | "formal" | "friendly" | "firm" | "shorter" | "proofread" | "translate";

/**
 * @example
 * <ui-ai-tools .value=${body} brief="A polite payment reminder for invoice INV/2026/0371."
 *   .context=${facts} @ui-change=${(e) => (body = e.detail.value)}></ui-ai-tools>
 *
 * Put it under the field it works on. `brief` (what to write) turns on Draft; `tools` limits the
 * buttons (default: all this browser supports). Every result goes into the field (`ui-change`
 * { value }) for the person to edit; Undo puts the previous text back.
 */
@customElement("ui-ai-tools")
export class UiAiTools extends AssistElement {
  @property() value = "";
  /** What to write, for Draft (e.g. "A polite payment reminder for invoice …"). */
  @property() brief = "";
  /** Facts the draft or a rewrite should use. */
  @property() context = "";
  /** Which tools to offer, space-separated (default: all). */
  @property() tools = "draft formal friendly firm shorter proofread translate";
  @state() private previous: string | null = null;
  @state() private done = "";

  private _set(value: string, done: string) {
    this.previous = this.value;
    this.done = done;
    this.value = value;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value }, bubbles: true }));
  }

  private _undo() {
    if (this.previous == null) return;
    const value = this.previous;
    this.previous = null;
    this.done = "";
    this.value = value;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value }, bubbles: true }));
  }

  private async _do(key: ToolKey) {
    const text = this.value;
    const ctx = this.context || undefined;
    const jobs: Record<ToolKey, [string, (p: (f: number) => void) => Promise<string>, string]> = {
      draft: ["Drafting…", (p) => write(this.brief, { tone: "formal", context: ctx }, p), "Drafted"],
      formal: ["Rewriting…", (p) => rewrite(text, { tone: "more-formal", context: ctx }, p), "Made more formal"],
      friendly: [
        "Rewriting…",
        (p) => rewrite(text, { tone: "more-casual", context: "Warmer and friendlier, still professional." }, p),
        "Made friendlier",
      ],
      firm: [
        "Rewriting…",
        (p) =>
          rewrite(
            text,
            { tone: "more-formal", context: "Firmer and more direct, still polite. Keep every figure and date." },
            p,
          ),
        "Made firmer",
      ],
      shorter: ["Shortening…", (p) => rewrite(text, { length: "shorter", context: ctx }, p), "Shortened"],
      proofread: [
        "Proofreading…",
        async (p) => {
          const r = await proofread(text, p);
          this.done = r.fixes ? `${r.fixes} fix${r.fixes === 1 ? "" : "es"}` : "No fixes needed";
          return r.text;
        },
        "",
      ],
      translate: [
        "Translating…",
        async (p) => {
          const from = (await detectLanguage(text, p).catch(() => null))?.language ?? "en";
          const to = from === "en" ? "ar" : "en";
          this.done = `Translated to ${languageName(to)}`;
          return translate(text, from, to, p);
        },
        "",
      ],
    };
    const [label, job, done] = jobs[key];
    const result = await this.run(label, job);
    if (result != null && result !== text) this._set(result, done || this.done);
    else if (result === text && key === "proofread") this.done = "No fixes needed";
  }

  render() {
    const want = new Set(this.tools.split(/\s+/));
    const api: Record<ToolKey, BuiltInApi> = {
      draft: "Writer",
      formal: "Rewriter",
      friendly: "Rewriter",
      firm: "Rewriter",
      shorter: "Rewriter",
      proofread: "Proofreader",
      translate: "Translator",
    };
    const show = (k: ToolKey) => want.has(k) && supported(api[k]) && (k !== "draft" || !!this.brief);
    const empty = !this.value.trim();
    const items: [ToolKey, IconName, string][] = [
      ["draft", "sparkles", "Draft with AI"],
      ["formal", "edit", "More formal"],
      ["friendly", "heart", "Friendlier"],
      ["firm", "flag", "Firmer"],
      ["shorter", "minus", "Shorter"],
      ["proofread", "check", "Proofread"],
      ["translate", "translate", "Translate"],
    ];
    const buttons = items.filter(([k]) => show(k));
    if (!buttons.length) return nothing;
    return aiBar(
      html` ${buttons.map(([k, icon, label]) => aiButton(icon, label, () => void this._do(k), !!this.working || (k !== "draft" && empty)))}
      ${
        this.working || this.error
          ? this.status()
          : this.done
            ? html`${aiNote("check", this.done)}
              ${this.previous != null ? aiButton("retry", "Undo", () => this._undo()) : nothing}`
            : nothing
      }`,
    );
  }
}

/* ---------------------------------------------------------------- classification */

/** The model behind classification and checks: the Decisions API, else the Prompt API. */
const decisionApi = (): BuiltInApi | null =>
  supported("DecisionModel") ? "DecisionModel" : supported("LanguageModel") ? "LanguageModel" : null;
/** Its model is on the device (so it can run without a click). */
const decisionReady = async () => {
  const api = decisionApi();
  if (!api) return false;
  // The Decisions API checks availability per schema: ask with the smallest one.
  const options =
    api === "DecisionModel" ? { questions: [{ id: "ok", type: "boolean", prompt: "Is this text?" }] } : {};
  return (await availability(api, options)) === "available";
};
const pct = (c?: number) => (c == null ? "" : ` · ${Math.round(c * 100)}%`);

/**
 * @example <ui-ai-classify .text=${message.body} .options=${["New RFQ", "Supplier offer", …]} what="incoming emails to a ship chandler"></ui-ai-classify>
 *
 * The Decisions API when the browser has it (with its confidence), else the Prompt API. Runs on
 * its own when the model is there; otherwise a "Suggest a category" button. With `pickable`,
 * "Use this" fires `ui-select` { value }.
 */
@customElement("ui-ai-classify")
export class UiAiClassify extends AssistElement {
  @property() text = "";
  @property({ attribute: false }) options: string[] = [];
  @property() what = "messages";
  @property() label = "Looks like";
  /** Offer "Use this" (fires `ui-select`); without it the suggestion is for information. */
  @property({ type: Boolean }) pickable = false;
  @state() private result: Classification | null = null;

  protected async updated(changed: PropertyValues) {
    if (!changed.has("text")) return;
    this.result = null;
    if (this.text.trim() && (await decisionReady()))
      this.result = await classify(this.text, this.options, this.what).catch(() => null);
  }

  private async _run() {
    this.result = (await this.run("Reading…", (p) => classify(this.text, this.options, this.what, p))) ?? null;
  }

  render() {
    if (!decisionApi() || !this.text.trim() || !this.options.length) return nothing;
    const r = this.result;
    return aiBar(
      html` ${
        r
          ? html`${aiBadge("sparkles", `${this.label}: ${r.category}${pct(r.confidence)}`)}
            ${
              this.pickable
                ? aiButton("check", "Use this", () =>
                    this.dispatchEvent(new CustomEvent("ui-select", { detail: { value: r.category }, bubbles: true })),
                  )
                : nothing
            }`
          : this.working || this.error
            ? this.status()
            : aiButton("sparkles", "Suggest a category", () => void this._run())
      }`,
    );
  }
}

/* ---------------------------------------------------------------- checks */

/**
 * @example
 * <ui-ai-check .text=${`Requested: …\nOffer: …`} .questions=${[
 *   { id: "brand", prompt: "Does the offer match the requested brand?", yes: "Same brand", no: "Different brand" },
 * ]}></ui-ai-check>
 *
 * Yes / no checks a person reads before deciding (the Decisions API with its confidence, else the
 * Prompt API). A "no" is shown as something to look at, never as a verdict. Runs on a click.
 */
@customElement("ui-ai-check")
export class UiAiCheck extends AssistElement {
  @property() text = "";
  @property({ attribute: false }) questions: (CheckQuestion & { yes: string; no: string })[] = [];
  @property() label = "Check with AI";
  @state() private answers: CheckAnswer[] | null = null;

  protected updated(changed: PropertyValues) {
    if (changed.has("text")) this.answers = null;
  }

  private async _run() {
    this.answers = (await this.run("Checking…", (p) => check(this.text, this.questions, p))) ?? null;
  }

  render() {
    if (!decisionApi() || !this.text.trim() || !this.questions.length) return nothing;
    const answers = this.answers;
    return html`<ui-flex direction="col" gap="2">
      ${aiBar(
        html`${aiButton("sparkles", answers ? "Check again" : this.label, () => void this._run(), !!this.working)}
        ${this.status()}`,
      )}
      ${
        answers
          ? aiBox(
              "Checked on this device — a person decides",
              html`<ui-flex direction="col" gap="1">
                ${this.questions.map((q) => {
                  const a = answers.find((x) => x.id === q.id);
                  if (!a) return nothing;
                  return html`<ui-flex gap="1" align="start">
                    <ui-icon
                      name=${a.yes ? "check" : "warning"}
                      size="xs"
                      color=${a.yes ? "success" : "warning"}
                    ></ui-icon>
                    <ui-text variant="body-sm" color=${a.yes ? "success" : "warning"}
                      >${a.yes ? q.yes : q.no}${pct(a.confidence)}</ui-text
                    >
                  </ui-flex>`;
                })}
              </ui-flex>`,
            )
          : nothing
      }
    </ui-flex>`;
  }
}

/* ---------------------------------------------------------------- photos & voice notes */

/**
 * @example <ui-ai-read-file></ui-ai-read-file>
 *
 * "Read a photo or voice note": the person picks an image (a handwritten RFQ, a requisition, a
 * nameplate) or a recording; the on-device model lists what's in it (Prompt API multimodal
 * input). Nothing is uploaded. `image-prompt` / `audio-prompt` say what to read for.
 */
@customElement("ui-ai-read-file")
export class UiAiReadFile extends AssistElement {
  @property({ attribute: "image-prompt" }) imagePrompt =
    "This is a photo from a customer or supplier of a ship chandler (an RFQ, a requisition, a nameplate or an invoice). List every item with its quantity and unit, one per line, then any reference numbers, vessel names and dates. Write only what you can read.";
  @property({ attribute: "audio-prompt" }) audioPrompt =
    "This is a voice note to a ship chandler. Transcribe it, then list any items with quantities and units, vessel names, ports and dates.";
  @property() label = "Read a photo or voice note";
  /** Offer "Use this" (fires `ui-select` { value } with what was read). */
  @property({ type: Boolean }) pickable = false;
  @state() private result: { name: string; kind: MediaKind; text: string } | null = null;

  private async _read() {
    const file = await pickFile("image/*,audio/*");
    if (!file) return;
    const kind: MediaKind = file.type.startsWith("audio/") ? "audio" : "image";
    const text = await this.run(kind === "audio" ? "Listening…" : "Reading the photo…", (p) =>
      readMedia(file, kind, kind === "audio" ? this.audioPrompt : this.imagePrompt, p),
    );
    if (text) this.result = { name: file.name, kind, text };
  }

  render() {
    // Photos and voice notes need Chrome's own model (the downloadable one reads text only).
    if (!supported("LanguageModel") || usingLocalModel()) return nothing;
    return html`<ui-flex direction="col" gap="2">
      ${aiBar(html`${aiButton("file", this.label, () => void this._read(), !!this.working)} ${this.status()}`)}
      ${
        this.result
          ? aiBox(
              `${this.result.kind === "audio" ? "Heard" : "Read"} from ${this.result.name} · on this device — check it`,
              html`<ui-markdown .text=${this.result.text}></ui-markdown> ${
                  this.pickable
                    ? aiBar(
                        aiButton("check", "Use this", () =>
                          this.dispatchEvent(
                            new CustomEvent("ui-select", { detail: { value: this.result!.text }, bubbles: true }),
                          ),
                        ),
                      )
                    : nothing
                }`,
            )
          : nothing
      }
    </ui-flex>`;
  }
}

/* ---------------------------------------------------------------- filling fields */

/**
 * @example
 * <ui-ai-extract source="paste" what="supplier reply" .fields=${[
 *   { id: "price", label: "Unit price", type: "number" }, { id: "currency", label: "Currency" },
 * ]} pickable @ui-select=${(e) => fill(e.detail.values)}></ui-ai-extract>
 *
 * Fills `fields` from what the person pastes (`source="paste"`), a photo or recording they pick
 * (`source="file"`), or `.text` (`source="text"`). Shows what it found (missing values say so)
 * and, with `pickable`, "Use these" fires `ui-select` { values }.
 */
@customElement("ui-ai-extract")
export class UiAiExtract extends AssistElement {
  @property() source: "paste" | "file" | "text" = "paste";
  @property({ attribute: false }) fields: ExtractField[] = [];
  /** What the input is ("supplier reply", "trade licence"), for the model. */
  @property() what = "message";
  @property() text = "";
  @property() label = "Fill from text";
  @property() placeholder = "Paste the message here…";
  @property({ type: Boolean }) pickable = false;
  @property({ attribute: "use-label" }) useLabel = "Use these";
  @state() private pasted = "";
  @state() private values: Extracted | null = null;

  private async _fromText(text: string) {
    this.values = (await this.run("Reading…", (p) => extract(text, this.fields, this.what, p))) ?? null;
  }

  private async _fromFile() {
    const file = await pickFile("image/*,audio/*");
    if (!file) return;
    const kind: MediaKind = file.type.startsWith("audio/") ? "audio" : "image";
    this.values =
      (await this.run(kind === "audio" ? "Listening…" : "Reading the photo…", (p) =>
        extract({ file, kind }, this.fields, this.what, p),
      )) ?? null;
  }

  render() {
    if (!supported("LanguageModel") || !this.fields.length) return nothing;
    if (this.source === "file" && usingLocalModel()) return nothing; // photos need Chrome's own model
    const values = this.values;
    const trigger =
      this.source === "paste"
        ? html`<ui-textarea
              size="sm"
              width="full"
              .label=${this.label}
              .rows=${3}
              .placeholder=${this.placeholder}
              .value=${this.pasted}
              @input=${(e: Event) => (this.pasted = (e.target as HTMLTextAreaElement).value)}
            ></ui-textarea>
            ${aiBar(
              html`${aiButton("sparkles", this.label, () => void this._fromText(this.pasted), !!this.working || !this.pasted.trim())}
              ${this.status()}`,
            )}`
        : this.source === "file"
          ? aiBar(html`${aiButton("file", this.label, () => void this._fromFile(), !!this.working)} ${this.status()}`)
          : aiBar(
              html`${aiButton("sparkles", this.label, () => void this._fromText(this.text), !!this.working || !this.text.trim())}
              ${this.status()}`,
            );
    return html`<ui-flex direction="col" gap="2">
      ${trigger}
      ${
        values
          ? aiBox(
              "Found on this device — check before using",
              html`<ui-flex direction="col" gap="1">
                  ${this.fields.map((f) => {
                    const v = values[f.id];
                    const missing = v == null || v === "";
                    return html`<ui-flex gap="2" align="baseline" wrap>
                      <ui-text as="span" variant="body-sm" color="muted">${f.label}</ui-text>
                      ${
                        missing
                          ? html`<ui-text as="span" variant="body-md" color="muted" italic>not found</ui-text>`
                          : html`<ui-text as="span" variant="label-lg">${String(v)}</ui-text>`
                      }
                    </ui-flex>`;
                  })}
                </ui-flex>
                ${
                  this.pickable
                    ? aiBar(
                        aiButton("check", this.useLabel, () =>
                          this.dispatchEvent(new CustomEvent("ui-select", { detail: { values }, bubbles: true })),
                        ),
                      )
                    : nothing
                }`,
            )
          : nothing
      }
    </ui-flex>`;
  }
}

/* ---------------------------------------------------------------- flags */

/**
 * @example
 * <ui-ai-flag .text=${email} question="Does this email ask to change bank or payment details?"
 *   heading="Asks to change bank details" tone="error" note="Two people (Finance and the CEO) must confirm…"></ui-ai-flag>
 *
 * Asks one yes / no question about `text` on its own (when the model is already on the device)
 * and shows a warning only when the answer is yes — nothing otherwise. `note` says what to do. Uses the Decisions API when there is one (its confidence must be at least `threshold`).
 */
@customElement("ui-ai-flag")
export class UiAiFlag extends LightElement {
  @property() text = "";
  @property() question = "";
  @property() heading = "";
  @property() tone: "warning" | "error" | "info" = "warning";
  /** What to do about it, under the heading. */
  @property() note = "";
  @property({ type: Number }) threshold = 0.6;
  @state() private hit: CheckAnswer | null = null;

  protected async updated(changed: PropertyValues) {
    if (!changed.has("text") && !changed.has("question")) return;
    this.hit = null;
    if (!this.text.trim() || !this.question || !(await decisionReady())) return;
    const [a] = await check(this.text, [{ id: "flag", prompt: this.question }]).catch(() => []);
    this.hit = a?.yes && (a.confidence ?? 1) >= this.threshold ? a : null;
  }

  render() {
    if (!this.hit) return nothing;
    return html`<ui-alert
      tone=${this.tone}
      .heading=${`${this.heading}${pct(this.hit.confidence)}`}
      .description=${`${this.note} Spotted on this device — it can be wrong.`}
    ></ui-alert>`;
  }
}

/* ---------------------------------------------------------------- quick replies */

/**
 * @example <ui-ai-replies .text=${message.body}></ui-ai-replies>
 * Three short replies to the message; clicking one copies it (and fires `ui-select` { value }).
 */
@customElement("ui-ai-replies")
export class UiAiReplies extends AssistElement {
  @property() text = "";
  @state() private replies: string[] = [];
  @state() private copied = -1;

  protected updated(changed: PropertyValues) {
    if (changed.has("text")) {
      this.replies = [];
      this.copied = -1;
    }
  }

  private async _pick(i: number) {
    const value = this.replies[i]!;
    try {
      await navigator.clipboard.writeText(value);
      this.copied = i;
    } catch {
      /* no clipboard: the event still carries the text */
    }
    this.dispatchEvent(new CustomEvent("ui-select", { detail: { value }, bubbles: true }));
  }

  render() {
    if (!supported("LanguageModel") || !this.text.trim()) return nothing;
    return html`<ui-flex direction="col" gap="2">
      ${aiBar(
        html` ${aiButton(
          "chat",
          this.replies.length ? "Other replies" : "Suggest replies",
          async () => {
            this.replies = (await this.run("Writing replies…", (p) => quickReplies(this.text, p))) ?? [];
            this.copied = -1;
          },
          !!this.working,
        )}
        ${this.status()}`,
      )}
      ${this.replies.map(
        (r, i) =>
          html`<ui-button
            variant="outlined"
            size="xs"
            multiline
            block
            justify="start"
            @click=${() => void this._pick(i)}
          >
            ${r}${this.copied === i ? html` · ${aiNote("check", "Copied")}` : nothing}
          </ui-button>`,
      )}
    </ui-flex>`;
  }
}

/* ---------------------------------------------------------------- dictation */

/**
 * @example <ui-ai-dictate @ui-select=${(e) => (note += e.detail.value)}></ui-ai-dictate>
 * Speak instead of typing: records from the microphone, then the on-device model writes it down
 * (`ui-select` { value }). Click again to stop.
 */
@customElement("ui-ai-dictate")
export class UiAiDictate extends AssistElement {
  @property() label = "Dictate";
  @state() private recording = false;
  #recorder: MediaRecorder | null = null;

  private async _toggle() {
    if (this.recording) return this.#recorder?.stop();
    this.error = "";
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      this.error = "The microphone isn't available (check the browser's permission).";
      return;
    }
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream);
    this.#recorder = recorder;
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      this.recording = false;
      const audio = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      const value = await this.run("Writing it down…", (p) => transcribe(audio, p));
      if (value) this.dispatchEvent(new CustomEvent("ui-select", { detail: { value }, bubbles: true }));
    };
    recorder.start();
    this.recording = true;
  }

  render() {
    if (!supported("LanguageModel") || usingLocalModel() || !("mediaDevices" in navigator)) return nothing;
    return aiBar(
      html` ${aiButton(this.recording ? "stop" : "mic", this.recording ? "Stop and write it down" : this.label, () => void this._toggle(), !!this.working)}
      ${this.recording ? aiNote("loading", "Listening…") : this.status()}`,
    );
  }
}

/* ---------------------------------------------------------------- read aloud */

/**
 * @example <ui-speak .text=${briefing}></ui-speak>
 * Reads `text` aloud with the browser's own voice (speech synthesis); click again to stop.
 */
@customElement("ui-speak")
export class UiSpeak extends LightElement {
  @property() text = "";
  @property() label = "Read aloud";
  @property() lang = "en-GB";
  @state() private speaking = false;

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.speaking) speechSynthesis.cancel();
  }

  private _toggle() {
    if (this.speaking) {
      speechSynthesis.cancel();
      this.speaking = false;
      return;
    }
    const u = new SpeechSynthesisUtterance(this.text);
    u.lang = this.lang;
    u.onend = u.onerror = () => (this.speaking = false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    this.speaking = true;
  }

  render() {
    if (!("speechSynthesis" in window) || !this.text.trim()) return nothing;
    return aiButton(this.speaking ? "stop" : "play", this.speaking ? "Stop" : this.label, () => this._toggle());
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-ai-language": UiAiLanguage;
    "ui-ai-text": UiAiText;
    "ui-ai-summary": UiAiSummary;
    "ui-ai-tools": UiAiTools;
    "ui-ai-classify": UiAiClassify;
    "ui-ai-check": UiAiCheck;
    "ui-ai-read-file": UiAiReadFile;
    "ui-ai-extract": UiAiExtract;
    "ui-ai-flag": UiAiFlag;
    "ui-ai-replies": UiAiReplies;
    "ui-ai-dictate": UiAiDictate;
    "ui-speak": UiSpeak;
  }
}
