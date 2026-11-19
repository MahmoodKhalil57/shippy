import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { CODEX_MODELS, CodexConversation, codexConfig, type CodexEvent } from "../../agent/codex.ts";
import type { AgentTool } from "../../agent/webmcp.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";

/**
 * The Golden Sea helper (bottom right): a chat with an OpenAI Codex model that sees and uses the
 * platform only through its WebMCP tools (src/agent/codex.ts, ./agent-tools.ts) — so it knows the
 * screen, the records and the workflows the way the person's role does, without the DOM. Actions
 * that change something wait for the person's "Allow". The person picks the model; the API key is
 * in index.html, and nothing is checked before sending: a missing key shows OpenAI's own error.
 */

type Line =
  | { kind: "you"; text: string }
  | { kind: "helper"; text: string }
  | { kind: "tool"; title: string; status: Extract<CodexEvent, { type: "tool" }>["status"] }
  | { kind: "status"; text: string }
  | { kind: "error"; text: string };

const SUGGESTIONS = [
  "What am I looking at?",
  "What's waiting for me today?",
  "Take me to the offer comparison for Aurora Crest",
  "Who owes us money?",
];

/** The last model picked (remembered per browser), else index.html's default. */
function savedModel(): string {
  try {
    const saved = localStorage.getItem("gs:helper-model");
    if (saved && CODEX_MODELS.some((m) => m.id === saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return codexConfig().model;
}

const STATUS = { running: "…", done: "✓", declined: "declined", failed: "failed" } as const;

@customElement("dashboard-agent")
export class DashboardAgent extends LightElement {
  @state() private open = false;
  @state() private lines: Line[] = [];
  @state() private draft = "";
  @state() private busy = false;
  @state() private model = savedModel();
  @state() private pending: { tool: AgentTool; input: Record<string, unknown>; answer: (ok: boolean) => void } | null =
    null;
  #conversation = new CodexConversation();

  private _pickModel(id: string) {
    this.model = id;
    try {
      localStorage.setItem("gs:helper-model", id);
    } catch {
      /* storage unavailable */
    }
  }
  #abort: AbortController | null = null;

  private async _send(text = this.draft) {
    const message = text.trim();
    if (!message || this.busy) return;
    this.draft = "";
    this.lines = [...this.lines, { kind: "you", text: message }];
    this.busy = true;
    this.#abort = new AbortController();
    try {
      const answer = await this.#conversation.send(message, {
        model: this.model,
        signal: this.#abort.signal,
        confirm: (tool, input) =>
          new Promise<boolean>((resolve) => {
            this.pending = {
              tool,
              input,
              answer: (ok) => {
                this.pending = null;
                resolve(ok);
              },
            };
          }),
        onEvent: (e) => {
          if (e.type === "text") this.lines = [...this.lines, { kind: "helper", text: e.text }];
          else if (e.type === "status") {
            // One progress line, updated in place.
            const last = this.lines.at(-1);
            const line: Line = { kind: "status", text: e.text };
            this.lines = last?.kind === "status" ? [...this.lines.slice(0, -1), line] : [...this.lines, line];
          } else if (e.status === "running")
            this.lines = [...this.lines, { kind: "tool", title: e.title, status: e.status }];
          else {
            // Update the running line of this tool (or add one: declined calls never ran).
            const i = this.lines.findLastIndex(
              (l) => l.kind === "tool" && l.title === e.title && l.status === "running",
            );
            const line: Line = { kind: "tool", title: e.title, status: e.status };
            this.lines = i < 0 ? [...this.lines, line] : this.lines.map((l, j) => (j === i ? line : l));
          }
        },
      });
      if (answer) this.lines = [...this.lines, { kind: "helper", text: answer }];
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        this.lines = [...this.lines, { kind: "error", text: (e as Error).message }];
    } finally {
      this.busy = false;
      this.pending = null;
      this.#abort = null;
    }
  }

  private _stop() {
    this.pending?.answer(false);
    this.#abort?.abort();
  }

  private _restart() {
    this._stop();
    this.#conversation.reset();
    this.lines = [];
  }

  private _line(l: Line) {
    switch (l.kind) {
      case "you":
        return html`<ui-chat placement="end">${l.text}</ui-chat>`;
      case "helper":
        return html`<ui-chat author="Helper"><ui-text size="sm" pre-line>${l.text}</ui-text></ui-chat>`;
      case "tool":
        return html`<ui-flex gap="2" align="center">
          ${l.status === "running" ? html`<ui-loading variant="dots" size="xs" label="Working"></ui-loading>` : nothing}
          <ui-text size="xs" color="muted">${l.title} ${l.status === "running" ? "" : STATUS[l.status]}</ui-text>
        </ui-flex>`;
      case "status":
        return html`<ui-text size="xs" color="muted">${l.text}</ui-text>`;
      case "error":
        return html`<ui-alert color="error" variant="soft">${l.text}</ui-alert>`;
    }
  }

  private _body() {
    return html`${
      this.lines.length
        ? this.lines.map((l) => this._line(l))
        : html`<ui-text size="sm" color="muted"
              >I can see the screen you're on, find records, explain what's waiting for you, take you anywhere and, with
              your OK, do things for you.</ui-text
            >
            <ui-flex gap="1" wrap>
              ${SUGGESTIONS.map(
                (s) => html`<ui-button size="xs" variant="soft" @click=${() => void this._send(s)}>${s}</ui-button>`,
              )}
            </ui-flex>`
    }
    ${
      this.pending
        ? html`<ui-alert color="warning" variant="soft">
            <ui-flex direction="col" gap="2">
              <ui-text size="sm" weight="semibold"
                >Allow: ${this.pending.tool.title ?? this.pending.tool.name}?</ui-text
              >
              <ui-text size="xs" pre-line>${JSON.stringify(this.pending.input, null, 1)}</ui-text>
              <ui-flex gap="2">
                <ui-button size="sm" color="primary" @click=${() => this.pending?.answer(true)}>Allow</ui-button>
                <ui-button size="sm" variant="ghost" @click=${() => this.pending?.answer(false)}>Don't</ui-button>
              </ui-flex>
            </ui-flex>
          </ui-alert>`
        : nothing
    }`;
  }

  /**
   * The model, as a small chip (its icon and name) that opens a menu: the OpenAI models, and the
   * browser's own on-device one. Opens upward, out of the panel (a popover isn't clipped by it).
   */
  private _modelPicker() {
    const current = CODEX_MODELS.find((m) => m.id === this.model) ?? CODEX_MODELS[0];
    const onDevice = (id: string) => id === "aibrowser";
    const item = (m: (typeof CODEX_MODELS)[number]): MenuItem => ({
      label: m.label,
      icon: html`<ui-icon name=${onDevice(m.id) ? "device" : "cloud"} size="sm"></ui-icon>`,
      active: m.id === this.model,
      value: m.id,
      ...(onDevice(m.id) ? { card: true, description: "Chrome's built-in model · private, no key" } : {}),
    });
    const items: MenuItem[] = [
      { heading: true, label: "OpenAI · API key", children: CODEX_MODELS.filter((m) => !onDevice(m.id)).map(item) },
      { heading: true, label: "On this device", children: CODEX_MODELS.filter((m) => onDevice(m.id)).map(item) },
    ];
    return html`<ui-dropdown
      mode="popover"
      side="top"
      align="start"
      panel="card"
      panel-width="64"
      panel-shadow="lg"
      trigger-variant="ghost"
      trigger-size="xs"
      trigger-spaced="false"
      .label=${`Model: ${current.label}`}
    >
      <ui-flex slot="trigger" gap="1" align="center">
        <ui-icon name=${onDevice(current.id) ? "device" : "cloud"} size="sm"></ui-icon>
        <ui-text as="span" size="xs" weight="semibold">${current.label}</ui-text>
        <ui-icon name="unfold" size="sm"></ui-icon>
      </ui-flex>
      <ui-menu
        width="full"
        surface="false"
        .items=${items}
        @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
          if (typeof e.detail.item.value === "string" && !this.busy) this._pickModel(e.detail.item.value);
        }}
      ></ui-menu>
    </ui-dropdown>`;
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
      ${this._body()}
      <ui-flex slot="footer" direction="col" gap="2">
        <ui-flex gap="2" align="center">
          <ui-text-input
            width="fill"
            size="sm"
            autocomplete="off"
            placeholder=${this.busy ? "Working…" : "Ask or tell the helper…"}
            .value=${this.draft}
            ?disabled=${this.busy}
            @input=${(e: Event) => (this.draft = (e.target as HTMLInputElement).value)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter") void this._send();
            }}
          ></ui-text-input>
          ${
            this.busy
              ? html`<ui-button size="sm" variant="ghost" @click=${() => this._stop()}>Stop</ui-button>`
              : html`<ui-button size="sm" shape="square" color="primary" label="Send" @click=${() => void this._send()}
                  ><ui-icon name="send" size="md"></ui-icon
                ></ui-button>`
          }
        </ui-flex>
        <ui-flex gap="2" align="center" justify="between">
          ${this._modelPicker()}
          ${
            this.lines.length && !this.busy
              ? html`<ui-button size="xs" variant="ghost" @click=${() => this._restart()}>New chat</ui-button>`
              : nothing
          }
        </ui-flex>
      </ui-flex>
    </ui-fab>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-agent": DashboardAgent;
  }
}
