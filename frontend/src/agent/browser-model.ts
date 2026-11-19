import type { AgentTool, JsonSchema } from "./webmcp.ts";

/**
 * "Saastama-Micro-3.5" (id `aibrowser`): the helper on the browser's own on-device model, through Chrome's Prompt API
 * (https://developer.chrome.com/docs/ai/prompt-api) — no key, nothing leaves the machine.
 *
 * Tools, two ways:
 * - **Native tool calling** (Prompt API Tool Use, open loop): the session is created with the
 *   WebMCP tools; a reply can be a `tool-call`, and its result goes back as a `tool-response`
 *   (`LanguageModelToolSuccess`). Used when the browser has it.
 * - **JSON steps** otherwise: every step answers with JSON — constrained by `responseConstraint`
 *   to `{ action: "tool", tool, arguments }` or `{ action: "answer", answer }` — and the caller
 *   runs the tool and sends back its result.
 * Sessions ask for `samplingMode: "most-predictable"` (steady tool steps; with speculative
 * decoding on, the fast greedy path); browsers without it ignore the option. The context is
 * small and varies by device: the brief / tool list shrinks to fit, and tool results are cut to
 * the room left.
 *
 * No waiting: `warmUp()` (when the page loads, with Saastama-Micro-3.5 chosen) prepares a session in the
 * background. If Chrome still has to download the model (once per device; Chrome keeps it), the
 * download starts at the person's first click or key press — Chrome only starts it after a user
 * action. Each conversation is a copy (`clone()`) of that prepared session.
 */

type Content = { type: string; value: unknown };
interface PromptSession {
  prompt(
    input: string | { role: string; content: Content[] }[],
    options?: { responseConstraint?: JsonSchema; signal?: AbortSignal },
  ): Promise<string | Content[]>;
  destroy(): void;
  /** A copy of the session (its prompts so far), to start a conversation from. */
  clone?(): Promise<PromptSession>;
  /** Tokens the session can hold, and how many it holds now. */
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

/** English in and out: the languages the on-device model is asked to support. */
const LANGUAGES = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};
/** Steady, repeatable steps (and the greedy path speculative decoding speeds up). */
const PREDICTABLE = { samplingMode: "most-predictable" };

/** One step's reply: call a tool, or answer the person. */
export type BrowserStep =
  | { action: "tool"; tool: string; arguments: Record<string, unknown>; callId?: string }
  | { action: "answer"; answer: string };

/** What goes to the model next: the person's message, or the result of the tool it called. */
export type BrowserInput =
  | { text: string }
  | { result: { tool: string; callId?: string; text: string; error?: boolean } };

const params = (t: AgentTool) => Object.keys((t.inputSchema.properties as object | undefined) ?? {}).join(", ");
const CORE = ["get_screen", "list_pages", "navigate", "find_documents", "get_document", "get_my_work", "ask_assistant"];
/** The tool list for a JSON-steps brief, in three sizes (the fullest that fits is used). */
const CATALOGUES: ((tools: readonly AgentTool[]) => string)[] = [
  (tools) => tools.map((t) => `- ${t.name}(${params(t)}): ${t.description.split(/(?<=\.)\s/)[0]}`).join("\n"),
  (tools) => tools.map((t) => `${t.name}(${params(t)})`).join("; "),
  (tools) =>
    tools
      .filter((t) => CORE.includes(t.name))
      .map((t) => `${t.name}(${params(t)})`)
      .join("; "),
];

/** The brief for a small context (the full instructions don't fit every device). */
const BRIEF =
  "You are the Golden Sea helper inside the Golden Sea platform (marine supply). You see and act only through tools; start with get_screen. Only state what tools return. Answer briefly.";
const JSON_PROTOCOL =
  'Reply with JSON only: {"action":"tool","tool":"<name>","arguments":{...}} to use one tool (you then get its result), or {"action":"answer","answer":"<reply>"} to answer the person.';

const tooLarge = (e: unknown) =>
  e instanceof Error && (e.name === "QuotaExceededError" || /too large/i.test(e.message));

const NO_API =
  'This browser has no built-in AI model. Saastama-Micro-3.5 needs Chrome\'s on-device AI or the downloadable model: see "Turn on on-device AI" on the login page.';
const UNAVAILABLE =
  "Chrome's built-in model isn't available on this device (it needs about 22 GB of free disk space and a GPU with more than 4 GB of memory, or 16 GB of RAM).";

/** A tool as the Prompt API's tool use takes it. */
const asTool = (t: AgentTool) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema });

interface Prepared {
  session: PromptSession;
  /** Tool calls are native (tool-call / tool-response), not JSON steps. */
  native: boolean;
}

export class BrowserModelChat {
  /** The prepared session: the brief only, never prompted (each conversation is a copy). */
  #base: Promise<Prepared> | null = null;
  /** This conversation's session. */
  #session: Prepared | null = null;
  /** Where download progress goes (the chat, while a message waits for it). */
  #status: (text: string) => void = () => {};
  #awaitingActivation = false;

  #monitor = (m: DownloadMonitor) =>
    m.addEventListener("downloadprogress", (e) =>
      this.#status(`Downloading the AI model… ${Math.round(e.loaded * 100)}%`),
    );

  /**
   * A session for the device: native tool calling with all the tools, then with the core ones;
   * else JSON steps with the fullest brief that fits.
   */
  async #create(instructions: string, tools: readonly AgentTool[]): Promise<Prepared> {
    const api = languageModel();
    if (!api) throw new Error(NO_API);
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
          if (!tooLarge(e)) break; // no native tool use here after all: JSON steps
        }
      }
    }
    const briefs = [
      `${instructions}\n\nYou use the platform through these tools:\n${CATALOGUES[0]!(tools)}\n\n${JSON_PROTOCOL}`,
      ...CATALOGUES.slice(1).map((list) => `${BRIEF}\n${JSON_PROTOCOL}\nTools: ${list(tools)}`),
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
    throw new Error("Chrome's built-in model has too little room for the helper on this device.");
  }

  /** Start preparing the base session (once; a failed one is retried on the next call). */
  #prepare(instructions: string, tools: readonly AgentTool[]) {
    this.#base ??= this.#create(instructions, tools).catch((e: unknown) => {
      this.#base = null;
      throw e;
    });
    this.#base.catch(() => undefined); // a warm-up failure surfaces when a message is sent
    return this.#base;
  }

  /**
   * Get the model ready in the background, so the first message doesn't wait: prepare the session
   * now if the model is on the device, or start its download at the next click / key press.
   */
  warmUp(instructions: string, tools: readonly AgentTool[]) {
    const api = languageModel();
    if (!api || this.#base || this.#awaitingActivation) return;
    void api
      .availability(LANGUAGES)
      .then((availability) => {
        if (availability === "available") return void this.#prepare(instructions, tools);
        if (availability === "unavailable") return;
        // Downloading needs a user action: now, if the person just clicked (e.g. "Download the
        // model"); otherwise at the next one, wherever it lands.
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

  /** This conversation's session: a copy of the prepared one (prepared now if it isn't yet). */
  async #open(instructions: string, tools: readonly AgentTool[], onStatus: (text: string) => void) {
    const api = languageModel();
    if (!api) throw new Error(NO_API);
    if (!this.#base) {
      const availability = await api.availability(LANGUAGES);
      if (availability === "unavailable") throw new Error(UNAVAILABLE);
      if (availability !== "available") onStatus("Downloading the AI model (once per device)…");
    }
    this.#status = onStatus;
    try {
      const base = await this.#prepare(instructions, tools);
      if (base.session.clone) this.#session = { session: await base.session.clone(), native: base.native };
      else {
        // No copies in this browser: use the prepared session and prepare the next one.
        this.#session = base;
        this.#base = null;
        void this.#prepare(instructions, tools);
      }
      return this.#session;
    } finally {
      this.#status = () => {};
    }
  }

  /** Cut `text` to the room left in the session (about 4 characters a token, keeping some for the reply). */
  #fit(text: string) {
    const s = this.#session?.session;
    const room = s?.contextWindow ? (s.contextWindow - (s.contextUsage ?? 0) - 300) * 4 : 3000;
    const max = Math.max(400, Math.min(3000, room));
    return text.length > max ? `${text.slice(0, max)}… (cut)` : text;
  }

  /** Send the person's message or a tool's result; returns the model's next step. */
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
    if (typeof reply === "string") return { action: "answer", answer: reply.trim() || "…" };
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
      };
    }
    const text = reply
      .filter((c) => c.type === "text")
      .map((c) => String(c.value))
      .join("")
      .trim();
    return { action: "answer", answer: text || "…" };
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
      return { action: "tool", tool: reply.tool, arguments: args };
    }
    return { action: "answer", answer: reply.answer?.trim() || "…" };
  }

  /** Forget the conversation (the prepared session stays, so the next one starts at once). */
  reset() {
    this.#session?.session.destroy();
    this.#session = null;
  }

  /** The model behind the API changed (e.g. the downloadable one loaded): drop everything prepared. */
  forget() {
    this.reset();
    void this.#base?.then((b) => b.session.destroy()).catch(() => undefined);
    this.#base = null;
    this.#awaitingActivation = false;
  }
}
