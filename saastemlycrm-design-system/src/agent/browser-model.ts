import type { AgentTool, JsonSchema } from "./webmcp.ts";
import { answerIn, business, helper, org } from "./identity.ts";
import { intl, m } from "../i18n/index.ts";

type Content = { type: string; value: unknown };
interface PromptSession {
  prompt(
    input: string | { role: string; content: Content[] }[],
    options?: { responseConstraint?: JsonSchema; signal?: AbortSignal },
  ): Promise<string | Content[]>;
  destroy(): void;
  clone?(): Promise<PromptSession>;
  contextWindow?: number;
  contextUsage?: number;
}
interface DownloadMonitor {
  addEventListener(type: "downloadprogress", listener: (e: Event & { loaded: number }) => void): void;
}
interface LanguageModelApi {
  availability(options?: object): Promise<"unavailable" | "downloadable" | "downloading" | "available">;
  create(options?: object): Promise<PromptSession>;
}
type ToolSuccessCtor = new (init: { callId: string; name: string; result: Content[] }) => unknown;
type ToolErrorCtor = new (init: { callId: string; name: string; errorMessage: string }) => unknown;

const languageModel = () => (globalThis as { LanguageModel?: LanguageModelApi }).LanguageModel;
const toolApi = () => {
  const g = globalThis as { LanguageModelToolSuccess?: ToolSuccessCtor; LanguageModelToolError?: ToolErrorCtor };
  return typeof g.LanguageModelToolSuccess === "function"
    ? { success: g.LanguageModelToolSuccess, error: g.LanguageModelToolError }
    : null;
};

const LANGUAGES = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};
const PREDICTABLE = { samplingMode: "most-predictable" };

export type BrowserStep = (
  | { action: "tool"; tool: string; arguments: Record<string, unknown>; callId?: string }
  | { action: "answer"; answer: string }
) & {
  raw?: string;
};

export type BrowserInput =
  | { text: string }
  | { result: { tool: string; callId?: string; text: string; error?: boolean } };

const params = (t: AgentTool) => Object.keys((t.inputSchema.properties as object | undefined) ?? {}).join(", ");
const CORE = ["get_screen", "list_pages", "navigate", "find_documents", "get_document", "get_my_work", "ask_assistant"];
const CATALOGUES: ((tools: readonly AgentTool[]) => string)[] = [
  (tools) => tools.map((t) => `- ${t.name}(${params(t)}): ${t.description.split(/(?<=\.)\s/)[0]}`).join("\n"),
  (tools) => tools.map((t) => `${t.name}(${params(t)})`).join("; "),
  (tools) =>
    tools
      .filter((t) => CORE.includes(t.name))
      .map((t) => `${t.name}(${params(t)})`)
      .join("; "),
];

const brief = () =>
  `You are the ${helper()} inside the ${org()} platform (${org()} is ${business()}). You see and act only through tools; start with get_screen. Only state what tools return. Answer briefly. ${answerIn()}`;
const JSON_PROTOCOL =
  'Reply with JSON only: {"action":"tool","tool":"<name>","arguments":{...}} to use one tool (you then get its result), or {"action":"answer","answer":"<reply>"} to answer the person.';

const tooLarge = (e: unknown) =>
  e instanceof Error && (e.name === "QuotaExceededError" || /too large/i.test(e.message));

const NO_API = () => m.agent_no_builtin_model({ model: "Saastama-Micro-3.5" });
const UNAVAILABLE = () => m.agent_builtin_unavailable();

const asTool = (t: AgentTool) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema });

interface Prepared {
  session: PromptSession;
  native: boolean;
}

export class BrowserModelChat {
  #base: Promise<Prepared> | null = null;
  #session: Prepared | null = null;
  #status: (text: string) => void = () => {};
  #awaitingActivation = false;

  #monitor = (monitor: DownloadMonitor) =>
    monitor.addEventListener("downloadprogress", (e) =>
      this.#status(m.agent_downloading_progress({ percent: intl.number({ style: "percent" }).format(e.loaded) })),
    );

  async #create(instructions: string, tools: readonly AgentTool[]): Promise<Prepared> {
    const api = languageModel();
    if (!api) throw new Error(NO_API());
    if (toolApi()) {
      for (const list of [tools, tools.filter((t) => CORE.includes(t.name))]) {
        try {
          const session = await api.create({
            expectedInputs: [{ type: "text", languages: ["en"] }, { type: "tool-response" }],
            expectedOutputs: [{ type: "text", languages: ["en"] }, { type: "tool-call" }],
            tools: list.map(asTool),
            ...PREDICTABLE,
            initialPrompts: [
              { role: "system", content: `${instructions}\n\nUse your tools (one at a time); start with get_screen.` },
            ],
            monitor: this.#monitor,
          });
          return { session, native: true };
        } catch (e) {
          if (!tooLarge(e)) break;
        }
      }
    }
    const briefs = [
      `${instructions}\n\nYou use the platform through these tools:\n${CATALOGUES[0]!(tools)}\n\n${JSON_PROTOCOL}`,
      ...CATALOGUES.slice(1).map((list) => `${brief()}\n${JSON_PROTOCOL}\nTools: ${list(tools)}`),
    ];
    for (const [i, brief] of briefs.entries()) {
      try {
        const session = await api.create({
          ...LANGUAGES,
          ...PREDICTABLE,
          initialPrompts: [{ role: "system", content: brief }],
          monitor: this.#monitor,
        });
        return { session, native: false };
      } catch (e) {
        if (!tooLarge(e) || i === briefs.length - 1) throw e;
      }
    }
    throw new Error(m.agent_builtin_too_small());
  }

  #prepare(instructions: string, tools: readonly AgentTool[]) {
    this.#base ??= this.#create(instructions, tools).catch((e: unknown) => {
      this.#base = null;
      throw e;
    });
    this.#base.catch(() => undefined);
    return this.#base;
  }

  warmUp(instructions: string, tools: readonly AgentTool[]) {
    const api = languageModel();
    if (!api || this.#base || this.#awaitingActivation) return;
    void api
      .availability(LANGUAGES)
      .then((availability) => {
        if (availability === "available") return void this.#prepare(instructions, tools);
        if (availability === "unavailable") return;
        if ((navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation?.isActive)
          return void this.#prepare(instructions, tools);
        this.#awaitingActivation = true;
        const start = () => {
          removeEventListener("pointerdown", start, true);
          removeEventListener("keydown", start, true);
          this.#awaitingActivation = false;
          void this.#prepare(instructions, tools);
        };
        addEventListener("pointerdown", start, true);
        addEventListener("keydown", start, true);
      })
      .catch(() => undefined);
  }

  async #open(instructions: string, tools: readonly AgentTool[], onStatus: (text: string) => void) {
    const api = languageModel();
    if (!api) throw new Error(NO_API());
    if (!this.#base) {
      const availability = await api.availability(LANGUAGES);
      if (availability === "unavailable") throw new Error(UNAVAILABLE());
      if (availability !== "available") onStatus(m.agent_downloading());
    }
    this.#status = onStatus;
    try {
      const base = await this.#prepare(instructions, tools);
      if (base.session.clone) this.#session = { session: await base.session.clone(), native: base.native };
      else {
        this.#session = base;
        this.#base = null;
        void this.#prepare(instructions, tools);
      }
      return this.#session;
    } finally {
      this.#status = () => {};
    }
  }

  #fit(text: string) {
    const s = this.#session?.session;
    const room = s?.contextWindow ? (s.contextWindow - (s.contextUsage ?? 0) - 300) * 4 : 3000;
    const max = Math.max(400, Math.min(3000, room));
    return text.length > max ? `${text.slice(0, max)}… (cut)` : text;
  }

  async step(
    input: BrowserInput,
    {
      instructions,
      tools,
      onStatus,
      signal,
    }: {
      instructions: string;
      tools: readonly AgentTool[];
      onStatus: (text: string) => void;
      signal?: AbortSignal;
    },
  ): Promise<BrowserStep> {
    const { session, native } = this.#session ?? (await this.#open(instructions, tools, onStatus));
    return native ? this.#nativeStep(session, input, signal) : this.#jsonStep(session, input, tools, signal);
  }

  async #nativeStep(session: PromptSession, input: BrowserInput, signal?: AbortSignal): Promise<BrowserStep> {
    let message: Parameters<PromptSession["prompt"]>[0];
    if ("text" in input) message = input.text;
    else {
      const api = toolApi()!;
      const { tool, callId = "", text, error } = input.result;
      const value =
        error && api.error
          ? new api.error({ callId, name: tool, errorMessage: this.#fit(text) })
          : new api.success({ callId, name: tool, result: [{ type: "text", value: this.#fit(text) }] });
      message = [{ role: "user", content: [{ type: "tool-response", value }] }];
    }
    const reply = await session.prompt(message, { signal });
    if (typeof reply === "string") return { action: "answer", answer: reply.trim() || "…", raw: reply };
    const raw = JSON.stringify(reply, null, 1);
    const call = reply.find((c) => c.type === "tool-call")?.value as
      | { callId?: string; name?: string; arguments?: unknown }
      | undefined;
    if (call?.name) {
      let args = call.arguments;
      if (typeof args === "string") {
        try {
          args = JSON.parse(args) as unknown;
        } catch {
          args = {};
        }
      }
      return {
        action: "tool",
        tool: call.name,
        callId: call.callId,
        arguments: args && typeof args === "object" ? (args as Record<string, unknown>) : {},
        raw,
      };
    }
    const text = reply
      .filter((c) => c.type === "text")
      .map((c) => String(c.value))
      .join("")
      .trim();
    return { action: "answer", answer: text || "…", raw };
  }

  async #jsonStep(
    session: PromptSession,
    input: BrowserInput,
    tools: readonly AgentTool[],
    signal?: AbortSignal,
  ): Promise<BrowserStep> {
    const text = "text" in input ? input.text : `Result of ${input.result.tool}:\n${input.result.text}`;
    const raw = await session.prompt(this.#fit(text), {
      signal,
      responseConstraint: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["tool", "answer"] },
          tool: { type: "string", enum: tools.map((t) => t.name) },
          arguments: { type: "object" },
          answer: { type: "string" },
        },
        required: ["action"],
      },
    });
    const rawText = typeof raw === "string" ? raw : raw.map((c) => String(c.value)).join("");
    let reply: Partial<{ action: string; tool: string; arguments: unknown; answer: string }>;
    try {
      reply = JSON.parse(rawText) as typeof reply;
    } catch {
      throw new Error(`Chrome's built-in model didn't reply in the expected format: "${rawText.slice(0, 160)}…"`);
    }
    if (reply.action === "tool" && reply.tool) {
      const args =
        reply.arguments && typeof reply.arguments === "object" ? (reply.arguments as Record<string, unknown>) : {};
      return { action: "tool", tool: reply.tool, arguments: args, raw: rawText };
    }
    return { action: "answer", answer: reply.answer?.trim() || "…", raw: rawText };
  }

  reset() {
    this.#session?.session.destroy();
    this.#session = null;
  }

  forget() {
    this.reset();
    void this.#base?.then((b) => b.session.destroy()).catch(() => undefined);
    this.#base = null;
    this.#awaitingActivation = false;
  }
}
