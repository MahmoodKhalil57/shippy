import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { CodexConversation, codexConfig, codexReady, type CodexEvent } from "../../agent/codex.ts";
import type { AgentTool } from "../../agent/webmcp.ts";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";

/**
 * The Golden Sea helper (bottom right): a chat with an OpenAI Codex model that sees and uses the
 * platform only through its WebMCP tools (src/agent/codex.ts, ./agent-tools.ts) — so it knows the
 * screen, the records and the workflows the way the person's role does, without the DOM. Actions
 * that change something wait for the person's "Allow". Needs an API key in index.html.
 */

type Line =
  | { kind: "you"; text: string }
  | { kind: "helper"; text: string }
  | { kind: "tool"; title: string; status: Extract<CodexEvent, { type: "tool" }>["status"] }
  | { kind: "error"; text: string };

const SUGGESTIONS = [
  "What am I looking at?",
  "What's waiting for me today?",
  "Take me to the offer comparison for Aurora Crest",
  "Who owes us money?",
];

const STATUS = { running: "…", done: "✓", declined: "declined", failed: "failed" } as const;

@customElement("dashboard-agent")
export class DashboardAgent extends LightElement {
  @state() private open = false;
  @state() private lines: Line[] = [];
  @state() private draft = "";
  @state() private busy = false;
  @state() private pending: { tool: AgentTool; input: Record<string, unknown>; answer: (ok: boolean) => void } | null =
    null;
  #conversation = new CodexConversation();
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
          else if (e.status === "running")
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
      case "error":
        return html`<ui-alert color="error" variant="soft">${l.text}</ui-alert>`;
    }
  }

  private _body() {
    if (!codexReady())
      return html`<ui-alert color="info" variant="soft">
        <ui-flex direction="col" gap="1">
          <ui-text size="sm" weight="semibold">The helper needs an OpenAI API key</ui-text>
          <ui-text size="sm"
            >Add it to <strong>index.html</strong>:
            <strong>&lt;meta name="openai-api-key" content="sk-…"&gt;</strong> (model: ${codexConfig().model}). Only on
            your machine — the published site is public.</ui-text
          >
        </ui-flex>
      </ui-alert>`;
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

  render() {
    return html`<ui-fab
      panel
      .open=${this.open}
      heading="Golden Sea helper"
      trigger-label="Open the Golden Sea helper"
      @ui-toggle=${(e: CustomEvent<{ open: boolean }>) => (this.open = e.detail.open)}
    >
      <ui-icon slot="trigger" name="sparkles"></ui-icon>
      ${this._body()}
      ${
        codexReady()
          ? html`<ui-flex slot="footer" gap="2" align="center">
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
                  : html`<ui-button size="sm" color="primary" label="Send" @click=${() => void this._send()}
                      ><ui-icon name="send" size="sm"></ui-icon
                    ></ui-button>`
              }
              ${
                this.lines.length && !this.busy
                  ? html`<ui-button size="sm" variant="ghost" @click=${() => this._restart()}>New</ui-button>`
                  : nothing
              }
            </ui-flex>`
          : nothing
      }
    </ui-fab>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-agent": DashboardAgent;
  }
}
