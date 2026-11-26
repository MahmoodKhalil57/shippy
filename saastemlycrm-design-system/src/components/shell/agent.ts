import { consume } from "@lit/context";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import type { CodexConversation, CodexEvent } from "../../lib/agent/codex.ts";
import type { AgentTool } from "../../lib/agent/webmcp.ts";
import type { LocalAiState } from "../../lib/agent/ai-polyfill.ts";
import { LightElement } from "../base/light-element.ts";
import type { ConfirmationState } from "../primitives/ai/confirmation.ts";
import type { MessageRating } from "../primitives/ai/message.ts";
import type { ModelGroup } from "../composed/ai/model-selector.ts";
import type { Source } from "../primitives/ai/sources.ts";
import type { TraceStatus } from "../primitives/ai/trace.ts";
import "../index.ts";
import { m } from "../../lib/i18n/index.ts";
import { whenIdle } from "../../lib/base/work-queue.ts";
import { dashboardContext, type AiPort, type Dashboard } from "../../lib/dashboard/context.ts";

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

const MODEL_KEY = "saastemly:helper-model-v2";
const LOCAL = "aibrowser";

const suggestions = (d: Dashboard) => {
  const { roleNotes, suggestions: general } = d.site.assistant;
  const role = d.ai.webmcp.agentContext()?.roleId;
  const own = roleNotes.find((r) => r.role === role)?.suggestions ?? [];
  const neutral = [m.agent_suggest_approvals(), m.agent_suggest_page()];
  return [
    m.agent_suggest_screen(),
    m.agent_suggest_today(),
    ...(own.length ? own : general.length ? general : neutral),
  ];
};

const modelGroups = ({ CODEX_MODELS }: AiPort["codex"]): ModelGroup[] => [
  {
    label: m.agent_models_cloud(),
    models: CODEX_MODELS.filter((x) => x.id !== LOCAL).map((x) => ({ id: x.id, label: x.label, icon: "cloud" })),
  },
  {
    label: m.agent_models_device(),
    models: CODEX_MODELS.filter((x) => x.id === LOCAL).map((x) => ({ id: x.id, label: x.label, icon: "device" })),
  },
];

function savedModel({ CODEX_MODELS, codexConfig }: AiPort["codex"]): string {
  try {
    const saved = localStorage.getItem(MODEL_KEY);
    if (CODEX_MODELS.some((x) => x.id === saved)) return saved!;
  } catch {}
  return codexConfig().model;
}

export function sourcesIn(output: string): Source[] {
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

const gist = (input: Record<string, unknown>) =>
  Object.values(input)
    .filter((v): v is string => typeof v === "string")
    .join(" · ")
    .slice(0, 60);

const fenced = (label: string, text: string) => `**${label}**\n\`\`\`\n${text}\n\`\`\``;

@customElement("dashboard-agent")
export class DashboardAgent extends LightElement {
  @consume({ context: dashboardContext, subscribe: true }) @state() private dashboard!: Dashboard;
  @state() private open = false;
  @state() private items: Item[] = [];
  @state() private draft = "";
  @state() private busy = false;
  @state() private model = "";
  @query("ui-message-scroller") private _scroller!: HTMLElementTagNameMap["ui-message-scroller"];
  @query("ui-prompt-input") private _input!: HTMLElementTagNameMap["ui-prompt-input"];
  #conversation!: CodexConversation;
  #abort: AbortController | null = null;
  #sources: Source[] = [];

  private _warmUp = () => {
    if (this.dashboard.ai.webmcp.agentTools().length > 3) this.#conversation.warmUp(this.model);
  };

  @state() private localAi: LocalAiState = "native";
  @state() private localAiError = "";

  private _checkLocalAi = async () => {
    const before = this.localAi;
    this.localAi = await this.dashboard.ai.polyfill.localAiState();
    if (this.localAi === "local" && before !== "local") this.#conversation.modelChanged();
    this._warmUp();
  };

  private async _downloadModel() {
    this.localAi = "loading";
    this.localAiError = "";
    try {
      await this.dashboard.ai.polyfill.useLocalModel();
    } catch (e) {
      this.localAiError = m.agent_model_load_failed({ error: (e as Error).message });
    }
    await this._checkLocalAi();
  }

  private _setup() {
    if (this.model !== LOCAL || this.localAi === "native" || this.localAi === "local") return nothing;
    return html`<ui-alert tone="info">
      <ui-flex direction="col" gap="2">
        <ui-text variant="title-sm">${m.agent_local_heading({ model: "Saastama-Micro-3.5" })}</ui-text>
        <ui-text variant="body-md">${m.agent_local_body()}</ui-text>
        ${this.localAiError ? html`<ui-text variant="body-sm" color="error">${this.localAiError}</ui-text>` : nothing}
        <ui-flex gap="2" align="center" wrap>
          <ui-button
            size="xs"
            color="primary"
            ?disabled=${this.localAi === "loading"}
            @click=${() => void this._downloadModel()}
            >${this.localAi === "loading" ? m.agent_local_loading() : m.agent_local_download()}</ui-button
          >
        </ui-flex>
      </ui-flex>
    </ui-alert>`;
  }

  connectedCallback() {
    super.connectedCallback();
    const { codex, polyfill } = this.dashboard.ai;
    this.#conversation = new codex.CodexConversation();
    this.model = savedModel(codex);
    addEventListener(polyfill.AI_CHANGE, this._checkLocalAi);
    void this._checkLocalAi();
    addEventListener("agent-tools-change", this._warmUp);
    whenIdle(this._warmUp, this._warmUp);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener("agent-tools-change", this._warmUp);
    removeEventListener(this.dashboard.ai.polyfill.AI_CHANGE, this._checkLocalAi);
  }

  private _pickModel(id: string) {
    this.model = id;
    this._warmUp();
    try {
      localStorage.setItem(MODEL_KEY, id);
    } catch {}
  }

  #push(item: Item) {
    this.items = [...this.items, item];
  }

  #replace(i: number, item: Item) {
    this.items = this.items.map((x, j) => (j === i ? item : x));
  }

  #think() {
    this.#push({ kind: "thinking", started: Date.now() });
  }

  #settle() {
    const i = this.items.findLastIndex((x) => x.kind === "thinking" && x.seconds == null);
    if (i < 0) return;
    const t = this.items[i] as Extract<Item, { kind: "thinking" }>;
    if (!t.notes) {
      this.items = this.items.filter((_, j) => j !== i);
      return;
    }
    this.#replace(i, { ...t, seconds: Math.max(1, Math.round((Date.now() - t.started) / 1000)) });
  }

  private _onEvent = (e: CodexEvent) => {
    if (e.type === "thought") {
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

  #decline() {
    for (const item of this.items) if (item.kind === "approval" && item.answer) item.answer(false);
  }

  private async _send(text: string) {
    const message = text.trim();
    if (!message || this.busy) return;
    this.#push({ kind: "user", text: message });
    this.#think();
    this._scroller.scrollToEnd();
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
      this.#decline();
      this.busy = false;
      this.#abort = null;
    }
  }

  private _stop() {
    this.#decline();
    this.#abort?.abort();
  }

  private _restart() {
    this._stop();
    this.#conversation.reset();
    this.items = [];
  }

  private _retry() {
    const last = this.items.findLast((x) => x.kind === "user")!;
    void this._send(last.text);
  }

  private _traceLine(item: Extract<Item, { kind: "thinking" | "progress" | "tool" }>): TemplateResult {
    switch (item.kind) {
      case "thinking":
        return html`<ui-trace-line
          icon="thinking"
          status=${item.seconds == null ? "running" : "done"}
          .label=${item.seconds == null ? m.agent_thinking() : m.agent_thought_for({ seconds: item.seconds })}
          >${item.notes ? html`<ui-markdown .text=${item.notes.join("\n\n")}></ui-markdown>` : nothing}</ui-trace-line
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
              Object.keys(item.input).length ? fenced(m.agent_trace_input(), JSON.stringify(item.input, null, 1)) : "",
              item.output
                ? fenced(
                    m.agent_trace_result(),
                    item.output.length > 1500 ? `${item.output.slice(0, 1500)}…` : item.output,
                  )
                : "",
            ]
              .filter(Boolean)
              .join("\n\n")}
          ></ui-markdown>
        </ui-trace-line>`;
    }
  }

  private _item(item: Exclude<Item, { kind: "thinking" | "progress" | "tool" }>, i: number, lastAssistant: number) {
    switch (item.kind) {
      case "user":
        return html`<ui-message
          from="user"
          .copyText=${item.text}
          editable
          @ui-edit=${() => {
            this.draft = item.text;
            this._input.focus();
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
          .label=${m.agent_allow({ action: item.title })}
          description=${m.agent_allow_description()}
          state=${item.state}
          @ui-approve=${() => item.answer?.(true)}
          @ui-deny=${() => item.answer?.(false)}
        >
          <ui-markdown .text=${fenced(m.agent_details(), JSON.stringify(item.input, null, 1))}></ui-markdown>
        </ui-confirmation>`;
      default:
        return html`<ui-alert tone="error">${item.text}</ui-alert>`;
    }
  }

  private _thread() {
    const out: unknown[] = [];
    const lastAssistant = this.items.findLastIndex((x) => x.kind === "assistant");
    let steps: TemplateResult[] = [];
    const flush = () => {
      if (steps.length) out.push(html`<ui-trace>${steps}</ui-trace>`);
      steps = [];
    };
    this.items.forEach((item, i) => {
      if (item.kind === "thinking" || item.kind === "progress" || item.kind === "tool")
        steps.push(this._traceLine(item));
      else {
        flush();
        out.push(this._item(item, i, lastAssistant));
      }
    });
    flush();
    return out;
  }

  render() {
    const d = this.dashboard;
    const helper = d.site.assistant.name;
    return html`<ui-fab
      panel
      .open=${this.open}
      .heading=${helper}
      .triggerLabel=${m.agent_open({ helper })}
      @ui-toggle=${(e: CustomEvent<{ open: boolean }>) => (this.open = e.detail.open)}
    >
      <ui-icon slot="trigger" name="assistant" size="lg"></ui-icon>
      <ui-message-scroller ?busy=${this.busy} ?empty=${!this.items.length}>
        <ui-flex slot="empty" direction="col" align="center" gap="3">
          <ui-icon name="assistant" size="xl" color="primary"></ui-icon>
          <ui-text emphasized>${m.agent_empty_heading()}</ui-text>
          <ui-text variant="body-md" color="muted" align="center">${m.agent_empty_body()}</ui-text>
          ${this._setup()}
          <ui-suggestions
            wrap
            .items=${suggestions(d)}
            @ui-select=${(e: CustomEvent<{ value: string }>) => void this._send(e.detail.value)}
          ></ui-suggestions>
        </ui-flex>
        ${this._thread()}
      </ui-message-scroller>
      <ui-prompt-input
        slot="footer"
        placeholder=${this.busy ? m.agent_working() : m.agent_prompt_placeholder()}
        status=${this.busy ? "busy" : "ready"}
        .value=${this.draft}
        @input=${(e: Event) => (this.draft = (e.target as HTMLTextAreaElement).value)}
        @ui-submit=${(e: CustomEvent<{ value: string }>) => {
          this.draft = "";
          void this._send(e.detail.value);
        }}
        @ui-stop=${() => this._stop()}
      >
        <ui-model-selector
          slot="tools"
          .groups=${modelGroups(d.ai.codex)}
          .value=${this.model}
          ?disabled=${this.busy}
          @ui-change=${(e: CustomEvent<{ value: string }>) => this._pickModel(e.detail.value)}
        ></ui-model-selector>
        ${
          this.items.length && !this.busy
            ? html`<ui-button slot="tools" size="xs" variant="text" @click=${() => this._restart()}
                >${m.agent_new_chat()}</ui-button
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
