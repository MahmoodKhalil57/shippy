import { html, nothing, type TemplateResult } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { CODEX_MODELS, CodexConversation, codexConfig, type CodexEvent } from "../../agent/codex.ts";
import { agentContext, agentTools, type AgentTool } from "../../agent/webmcp.ts";
import { AI_CHANGE, localAiState, useLocalModel, type LocalAiState } from "../../agent/ai-polyfill.ts";
import { LightElement } from "../../components/base/light-element.ts";
import type { ConfirmationState } from "../../components/primitives/ai/confirmation.ts";
import type { MessageRating } from "../../components/primitives/ai/message.ts";
import type { ModelGroup } from "../../components/composed/ai/model-selector.ts";
import type { Source } from "../../components/primitives/ai/sources.ts";
import type { TraceStatus } from "../../components/primitives/ai/trace.ts";
import "../../components/index.ts";

/**
 * The Golden Sea helper (bottom right): a chat with a model that sees and uses the platform only
 * through its WebMCP tools (src/agent/codex.ts, ./agent-tools.ts) — so it knows the screen, the
 * records and the workflows the way the person's role does, without the DOM.
 *
 * Built from the AI primitives (src/components/primitives/ai): the thread scrolls with the reply;
 * each turn shows what the agent did as a trace (thinking, each tool with its input and result);
 * actions that change something wait in a confirmation card for the person's Allow; answers are
 * formatted, list the records they came from, and can be copied, rated or retried. The person
 * picks the model; the API key is in index.html, and a missing key shows OpenAI's own error.
 */

type Item =
  | { kind: "user"; text: string }
  | { kind: "assistant"; text: string; sources: Source[]; rating: MessageRating }
  | { kind: "thinking"; started: number; seconds?: number; notes?: string[] }
  | {
      kind: "tool";
      title: string;
      input: Record<string, unknown>;
      status: TraceStatus;
      output?: string;
    }
  | { kind: "progress"; text: string }
  | {
      kind: "approval";
      title: string;
      input: Record<string, unknown>;
      state: ConfirmationState;
      answer?: (ok: boolean) => void;
    }
  | { kind: "error"; text: string };

/** Questions to start with: the same two for everyone, then two for the person's role. */
const SUGGESTIONS = ["What am I looking at?", "What's waiting for me today?"];
const ROLE_SUGGESTIONS: Record<string, string[]> = {
  "supply-chain": ["Which suppliers are late?", "Status of Aurora Crest"],
  sales: ["Which quotations are waiting for the customer?", "Status of Aurora Crest"],
  management: ["What needs my approval?", "How is the growth pipeline?"],
  "finance-director": ["Who owes us money?", "Go to receivables"],
  operations: ["Which deliveries are coming up?", "Go to purchase orders"],
  "office-admin": ["Go to the inbox", "How does the inbox work?"],
};
const suggestions = () => [
  ...SUGGESTIONS,
  ...(ROLE_SUGGESTIONS[agentContext()?.roleId ?? ""] ?? [
    "Who owes us money?",
    "Take me to the offer comparison for Aurora Crest",
  ]),
];

const MODEL_GROUPS: ModelGroup[] = [
  {
    label: "OpenAI · API key",
    models: CODEX_MODELS.filter((m) => m.id !== "aibrowser").map((m) => ({ id: m.id, label: m.label, icon: "cloud" })),
  },
  {
    label: "On this device",
    models: CODEX_MODELS.filter((m) => m.id === "aibrowser").map((m) => ({
      id: m.id,
      label: m.label,
      icon: "device",
    })),
  },
];

/** The last model picked (remembered per browser), else index.html's default. */
function savedModel(): string {
  try {
    const saved = localStorage.getItem("gs:helper-model-v2");
    if (saved && CODEX_MODELS.some((m) => m.id === saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return codexConfig().model;
}

/** Records an answer drew on: `sources` in a tool's result (e.g. ask_assistant), or a record path. */
function sourcesIn(output: string): Source[] {
  try {
    const value = JSON.parse(output) as { sources?: unknown; path?: unknown; document?: { id?: unknown } };
    const list = Array.isArray(value.sources) ? value.sources : [];
    const found = list.flatMap((s) => {
      const o = s as { label?: unknown; href?: unknown };
      return typeof o.label === "string" && typeof o.href === "string" ? [{ label: o.label, href: o.href }] : [];
    });
    if (typeof value.path === "string" && value.document)
      found.push({ label: typeof value.document.id === "string" ? value.document.id : value.path, href: value.path });
    return found;
  } catch {
    return [];
  }
}

/** A tool's input in a few words (the trace line's description). */
const gist = (input: Record<string, unknown>) =>
  Object.values(input)
    .filter((v): v is string => typeof v === "string")
    .join(" · ")
    .slice(0, 60);

const fenced = (label: string, text: string) => `**${label}**\n\`\`\`\n${text}\n\`\`\``;

@customElement("dashboard-agent")
export class DashboardAgent extends LightElement {
  @state() private open = false;
  @state() private items: Item[] = [];
  @state() private draft = "";
  @state() private busy = false;
  @state() private model = savedModel();
  @query("ui-message-scroller") private _scroller?: HTMLElementTagNameMap["ui-message-scroller"];
  @query("ui-prompt-input") private _input?: HTMLElementTagNameMap["ui-prompt-input"];
  #conversation = new CodexConversation();
  #abort: AbortController | null = null;
  #sources: Source[] = [];

  /**
   * Have the chosen model ready before the first message: once the tools exist (signed in) and
   * whenever the model is picked (the on-device model prepares, or downloads at the next click).
   */
  private _warmUp = () => {
    if (agentTools().length > 3) this.#conversation.warmUp(this.model);
  };

  /** Whether Saastama-Micro-3.5 can run here: Chrome's own AI, the downloaded model, or neither yet. */
  @state() private localAi: LocalAiState = "native";
  @state() private localAiError = "";

  private _checkLocalAi = async () => {
    const before = this.localAi;
    this.localAi = await localAiState();
    // Now on the downloaded model: whatever was prepared on the old API is dropped.
    if (this.localAi === "local" && before !== "local") this.#conversation.modelChanged();
    this._warmUp();
  };

  private async _downloadModel() {
    this.localAi = "loading";
    this.localAiError = "";
    try {
      await useLocalModel();
    } catch (e) {
      this.localAiError = `Couldn't load the model: ${(e as Error).message}`;
    }
    await this._checkLocalAi();
  }

  /** Saastama-Micro-3.5 is chosen but can't run here yet: offer the downloadable model. */
  private _setup() {
    if (this.model !== "aibrowser" || this.localAi === "native" || this.localAi === "local") return nothing;
    return html`<ui-alert color="info" variant="soft">
      <ui-flex direction="col" gap="2">
        <ui-text variant="title-sm">Saastama-Micro-3.5 runs on this computer</ui-text>
        <ui-text variant="body-md"
          >This browser doesn't have Chrome's on-device AI switched on. Download the model once (about 800 MB, kept by
          the browser — not in private windows) to use it here — nothing you type leaves this computer. Or turn on
          Chrome's own (faster) with the steps on the login page.</ui-text
        >
        ${this.localAiError ? html`<ui-text variant="body-sm" color="error">${this.localAiError}</ui-text>` : nothing}
        <ui-flex gap="2" align="center" wrap>
          <ui-button
            size="sm"
            color="primary"
            ?disabled=${this.localAi === "loading"}
            @click=${() => void this._downloadModel()}
            >${this.localAi === "loading" ? "Loading…" : "Download the AI model (about 800 MB)"}</ui-button
          >
        </ui-flex>
      </ui-flex>
    </ui-alert>`;
  }

  connectedCallback() {
    super.connectedCallback();
    addEventListener(AI_CHANGE, this._checkLocalAi);
    void this._checkLocalAi();
    addEventListener("agent-tools-change", this._warmUp);
    // Once the page has settled (an idle moment), not during its first paint.
    if ("requestIdleCallback" in window) requestIdleCallback(this._warmUp);
    else setTimeout(this._warmUp, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener("agent-tools-change", this._warmUp);
    removeEventListener(AI_CHANGE, this._checkLocalAi);
  }

  private _pickModel(id: string) {
    this.model = id;
    this._warmUp();
    try {
      localStorage.setItem("gs:helper-model-v2", id);
    } catch {
      /* storage unavailable */
    }
  }

  /* ---------------------------------------------------------------- the thread */

  #push(item: Item) {
    this.items = [...this.items, item];
  }

  #replace(i: number, item: Item) {
    this.items = this.items.map((x, j) => (j === i ? item : x));
  }

  /** The agent is working out its next step. */
  #think() {
    this.#push({ kind: "thinking", started: Date.now() });
  }

  /** Close the running "thinking" line with how long it took. */
  #settle() {
    const i = this.items.findLastIndex((x) => x.kind === "thinking" && x.seconds == null);
    if (i < 0) return;
    const t = this.items[i] as Extract<Item, { kind: "thinking" }>;
    // Nothing was decided (the answer came straight from a tool): no line to show.
    if (!t.notes?.length) {
      this.items = this.items.filter((_, j) => j !== i);
      return;
    }
    this.#replace(i, { ...t, seconds: Math.max(1, Math.round((Date.now() - t.started) / 1000)) });
  }

  private _onEvent = (e: CodexEvent) => {
    if (e.type === "thought") {
      // Goes with the thinking line it explains (the latest one).
      const i = this.items.findLastIndex((x) => x.kind === "thinking");
      if (i >= 0) {
        const t = this.items[i] as Extract<Item, { kind: "thinking" }>;
        this.#replace(i, { ...t, notes: [...(t.notes ?? []), e.text] });
      }
      return;
    }
    if (e.type === "status") {
      const last = this.items.at(-1);
      if (last?.kind === "progress") this.#replace(this.items.length - 1, { kind: "progress", text: e.text });
      else this.#push({ kind: "progress", text: e.text });
      return;
    }
    if (e.type === "text") {
      this.#settle();
      this.#push({ kind: "assistant", text: e.text, sources: [], rating: "" });
      return;
    }
    if (e.status === "running") {
      this.#settle();
      this.#push({ kind: "tool", title: e.title, input: e.input, status: "running" });
      return;
    }
    if (e.status === "declined") {
      this.#push({ kind: "tool", title: e.title, input: e.input, status: "denied" });
      this.#think();
      return;
    }
    const i = this.items.findLastIndex((x) => x.kind === "tool" && x.status === "running");
    const tool: Item = {
      kind: "tool",
      title: e.title,
      input: e.input,
      status: e.status === "failed" ? "error" : "done",
      output: e.output,
    };
    if (i < 0) this.#push(tool);
    else this.#replace(i, tool);
    if (e.output && e.status === "done") this.#sources.push(...sourcesIn(e.output));
    this.#think();
  };

  private _confirm = (tool: AgentTool, input: Record<string, unknown>) =>
    new Promise<boolean>((resolve) => {
      this.#settle();
      const index = this.items.length;
      this.#push({
        kind: "approval",
        title: tool.title ?? tool.name,
        input,
        state: "requested",
        answer: (ok) => {
          const item = this.items[index] as Extract<Item, { kind: "approval" }>;
          this.#replace(index, { ...item, state: ok ? "approved" : "denied", answer: undefined });
          resolve(ok);
        },
      });
    });

  private async _send(text: string) {
    const message = text.trim();
    if (!message || this.busy) return;
    this.#push({ kind: "user", text: message });
    this.#think();
    this._scroller?.scrollToEnd();
    this.busy = true;
    this.#sources = [];
    this.#abort = new AbortController();
    try {
      const answer = await this.#conversation.send(message, {
        model: this.model,
        signal: this.#abort.signal,
        confirm: this._confirm,
        onEvent: this._onEvent,
      });
      this.#settle();
      if (answer) this.#push({ kind: "assistant", text: answer, sources: this.#sources, rating: "" });
    } catch (e) {
      this.#settle();
      if ((e as Error).name !== "AbortError") this.#push({ kind: "error", text: (e as Error).message });
    } finally {
      // An unanswered confirmation (stopped mid-way) counts as declined.
      for (const item of this.items) if (item.kind === "approval" && item.answer) item.answer(false);
      this.busy = false;
      this.#abort = null;
    }
  }

  private _stop() {
    for (const item of this.items) if (item.kind === "approval" && item.answer) item.answer(false);
    this.#abort?.abort();
  }

  private _restart() {
    this._stop();
    this.#conversation.reset();
    this.items = [];
  }

  /** Retry: send the person's last message again. */
  private _retry() {
    const last = this.items.findLast((x) => x.kind === "user");
    if (last?.kind === "user") void this._send(last.text);
  }

  /* ---------------------------------------------------------------- rendering */

  private _traceLine(item: Item): TemplateResult | typeof nothing {
    switch (item.kind) {
      case "thinking":
        return html`<ui-trace-line
          icon="thinking"
          status=${item.seconds == null ? "running" : "done"}
          .label=${item.seconds == null ? "Thinking…" : `Thought for ${item.seconds} s`}
          >${item.notes?.length ? html`<ui-markdown .text=${item.notes.join("\n\n")}></ui-markdown>` : nothing}</ui-trace-line
        >`;
      case "progress":
        return html`<ui-trace-line icon="device" status="running" .label=${item.text}></ui-trace-line>`;
      case "tool":
        return html`<ui-trace-line
          icon="tool"
          status=${item.status}
          .label=${item.title}
          .description=${gist(item.input)}
        >
          <ui-markdown
            .text=${[
              Object.keys(item.input).length ? fenced("Input", JSON.stringify(item.input, null, 1)) : "",
              item.output
                ? fenced("Result", item.output.length > 1500 ? `${item.output.slice(0, 1500)}…` : item.output)
                : "",
            ]
              .filter(Boolean)
              .join("\n\n")}
          ></ui-markdown>
        </ui-trace-line>`;
      default:
        return nothing;
    }
  }

  private _item(item: Item, i: number, lastAssistant: number) {
    switch (item.kind) {
      case "user":
        return html`<ui-message
          from="user"
          .copyText=${item.text}
          editable
          @ui-edit=${() => {
            this.draft = item.text;
            this._input?.focus();
          }}
          >${item.text}</ui-message
        >`;
      case "assistant":
        return html`<ui-message
          from="assistant"
          .copyText=${item.text}
          rateable
          .rating=${item.rating}
          ?retryable=${i === lastAssistant && !this.busy}
          @ui-rate=${(e: CustomEvent<{ rating: MessageRating }>) => this.#replace(i, { ...item, rating: e.detail.rating })}
          @ui-retry=${() => this._retry()}
        >
          <ui-markdown .text=${item.text}></ui-markdown>
          ${item.sources.length ? html`<ui-sources .items=${item.sources}></ui-sources>` : nothing}
        </ui-message>`;
      case "approval":
        return html`<ui-confirmation
          .label=${`Allow: ${item.title}?`}
          description="The helper wants to make this change for you."
          state=${item.state}
          @ui-approve=${() => item.answer?.(true)}
          @ui-deny=${() => item.answer?.(false)}
        >
          <ui-markdown .text=${fenced("Details", JSON.stringify(item.input, null, 1))}></ui-markdown>
        </ui-confirmation>`;
      case "error":
        return html`<ui-alert color="error" variant="soft">${item.text}</ui-alert>`;
      default:
        return nothing;
    }
  }

  /** The thread: consecutive steps (thinking, tools, progress) share one trace. */
  private _thread() {
    const out: unknown[] = [];
    const lastAssistant = this.items.findLastIndex((x) => x.kind === "assistant");
    let steps: TemplateResult[] = [];
    const flush = () => {
      if (steps.length) out.push(html`<ui-trace>${steps}</ui-trace>`);
      steps = [];
    };
    this.items.forEach((item, i) => {
      const line = this._traceLine(item);
      if (line !== nothing) steps.push(line as TemplateResult);
      else {
        flush();
        out.push(this._item(item, i, lastAssistant));
      }
    });
    flush();
    return out;
  }

  render() {
    return html`<ui-fab
      panel
      .open=${this.open}
      heading="Golden Sea helper"
      trigger-label="Open the Golden Sea helper"
      @ui-toggle=${(e: CustomEvent<{ open: boolean }>) => (this.open = e.detail.open)}
    >
      <ui-icon slot="trigger" name="assistant" size="lg"></ui-icon>
      <ui-message-scroller ?busy=${this.busy} ?empty=${!this.items.length}>
        <ui-flex slot="empty" direction="col" align="center" gap="3">
          <ui-icon name="assistant" size="xl" color="primary"></ui-icon>
          <ui-text emphasized>How can I help?</ui-text>
          <ui-text variant="body-md" color="muted" align="center"
            >I see the screen you're on, find records, explain what's waiting for you, take you anywhere and, with your
            OK, do things for you.</ui-text
          >
          ${this._setup()}
          <ui-suggestions
            wrap
            .items=${suggestions()}
            @ui-select=${(e: CustomEvent<{ value: string }>) => void this._send(e.detail.value)}
          ></ui-suggestions>
        </ui-flex>
        ${this._thread()}
      </ui-message-scroller>
      <ui-prompt-input
        slot="footer"
        placeholder=${this.busy ? "Working…" : "Ask or tell the helper…"}
        status=${this.busy ? "busy" : "ready"}
        .value=${this.draft}
        @input=${(e: Event) => (this.draft = (e.target as HTMLTextAreaElement).value ?? "")}
        @ui-submit=${(e: CustomEvent<{ value: string }>) => {
          this.draft = "";
          void this._send(e.detail.value);
        }}
        @ui-stop=${() => this._stop()}
      >
        <ui-model-selector
          slot="tools"
          .groups=${MODEL_GROUPS}
          .value=${this.model}
          ?disabled=${this.busy}
          @ui-change=${(e: CustomEvent<{ value: string }>) => this._pickModel(e.detail.value)}
        ></ui-model-selector>
        ${
          this.items.length && !this.busy
            ? html`<ui-button slot="tools" size="xs" variant="ghost" @click=${() => this._restart()}
                >New chat</ui-button
              >`
            : nothing
        }
      </ui-prompt-input>
    </ui-fab>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-agent": DashboardAgent;
  }
}
