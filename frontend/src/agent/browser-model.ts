import type { AgentTool, JsonSchema } from "./webmcp.ts";

/**
 * "AIbrowser": the helper on the browser's own on-device model, through Chrome's Prompt API
 * (https://developer.chrome.com/docs/ai/prompt-api) — no key, nothing leaves the machine.
 *
 * The Prompt API has no automatic tool calling (its `tools` option isn't in Chrome yet), so the
 * model drives the same WebMCP tools through a small protocol: every step it answers with JSON —
 * constrained by `responseConstraint` to `{ action: "tool", tool, arguments }` or
 * `{ action: "answer", answer }` — and the caller runs the tool and sends back its result. The
 * context is small and varies by device: the brief shrinks to fit, and tool results are cut to
 * the room left.
 *
 * No waiting: `warmUp()` (when the page loads, with AIbrowser chosen) prepares a session with the
 * brief in the background. If Chrome still has to download the model (once per device; Chrome
 * keeps it), the download starts at the person's first click or key press — Chrome only starts
 * it after a user action. Each conversation is a copy (`clone()`) of that prepared session, so a
 * new chat is instant too.
 */

interface PromptSession {
  prompt(input: string, options?: { responseConstraint?: JsonSchema; signal?: AbortSignal }): Promise<string>;
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

const languageModel = () => (globalThis as { LanguageModel?: LanguageModelApi }).LanguageModel;

/** English in and out: the languages the on-device model is asked to support. */
const LANGUAGES = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

/** One step's reply: call a tool, or answer the person. */
export type BrowserStep =
  | { action: "tool"; tool: string; arguments: Record<string, unknown> }
  | { action: "answer"; answer: string };

/**
 * The tools for the system prompt, in three sizes: the on-device model's context is small and
 * varies by device, so `#open` tries the fullest that fits.
 */
const params = (t: AgentTool) => Object.keys((t.inputSchema.properties as object | undefined) ?? {}).join(", ");
const CATALOGUES: ((tools: readonly AgentTool[]) => string)[] = [
  // Name, parameters and what it does.
  (tools) => tools.map((t) => `- ${t.name}(${params(t)}): ${t.description.split(/(?<=\.)\s/)[0]}`).join("\n"),
  // Name and parameters.
  (tools) => tools.map((t) => `${t.name}(${params(t)})`).join("; "),
  // Only the core: seeing, moving, reading, asking.
  (tools) =>
    tools
      .filter((t) => CORE.includes(t.name))
      .map((t) => `${t.name}(${params(t)})`)
      .join("; "),
];
const CORE = ["get_screen", "list_pages", "navigate", "find_documents", "get_document", "get_my_work", "ask_assistant"];

/** The protocol, briefly (the on-device model gets a short brief, not the full instructions). */
const BRIEF = `You are the Golden Sea helper inside the Golden Sea platform (marine supply). You see and act only through tools; start with get_screen. Only state what tools return. Answer briefly.
Reply with JSON only: {"action":"tool","tool":"<name>","arguments":{...}} to use one tool (you then get its result), or {"action":"answer","answer":"<reply>"} to answer the person.`;

const tooLarge = (e: unknown) =>
  e instanceof Error && (e.name === "QuotaExceededError" || /too large/i.test(e.message));

const NO_API =
  "This browser has no built-in AI model. AIbrowser uses Chrome's Prompt API (Chrome 148 or later on desktop).";
const UNAVAILABLE =
  "Chrome's built-in model isn't available on this device (it needs about 22 GB of free disk space and a GPU with more than 4 GB of memory, or 16 GB of RAM).";

export class BrowserModelChat {
  /** The prepared session: the brief only, never prompted (each conversation is a copy). */
  #base: Promise<PromptSession> | null = null;
  /** This conversation's session. */
  #session: PromptSession | null = null;
  /** Where download progress goes (the chat, while a message waits for it). */
  #status: (text: string) => void = () => {};
  #awaitingActivation = false;

  /** A session with the fullest brief that fits the device's context. */
  async #create(instructions: string, tools: readonly AgentTool[]) {
    const api = languageModel();
    if (!api) throw new Error(NO_API);
    const protocol = BRIEF.split("\n")[1]!;
    const briefs = [
      `${instructions}\n\nYou use the platform through these tools:\n${CATALOGUES[0]!(tools)}\n\n${protocol}`,
      ...CATALOGUES.slice(1).map((list) => `${BRIEF}\nTools: ${list(tools)}`),
    ];
    for (const [i, brief] of briefs.entries()) {
      try {
        return await api.create({
          ...LANGUAGES,
          initialPrompts: [{ role: "system", content: brief }],
          monitor: (m: DownloadMonitor) =>
            m.addEventListener("downloadprogress", (e) =>
              this.#status(`Downloading Chrome's built-in model… ${Math.round(e.loaded * 100)}%`),
            ),
        });
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
        // Downloading needs a user action: start at the next one, wherever it lands.
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
      if (availability !== "available") onStatus("Downloading Chrome's built-in model (once per device)…");
    }
    this.#status = onStatus;
    try {
      const base = await this.#prepare(instructions, tools);
      if (base.clone) this.#session = await base.clone();
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
    const s = this.#session;
    const room = s?.contextWindow ? (s.contextWindow - (s.contextUsage ?? 0) - 300) * 4 : 3000;
    const max = Math.max(400, Math.min(3000, room));
    return text.length > max ? `${text.slice(0, max)}… (cut)` : text;
  }

  /** Send the person's message or a tool's result; returns the model's next step. */
  async step(
    input: string,
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
    const session = this.#session ?? (await this.#open(instructions, tools, onStatus));
    const raw = await session.prompt(this.#fit(input), {
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
    let reply: Partial<{ action: string; tool: string; arguments: unknown; answer: string }>;
    try {
      reply = JSON.parse(raw) as typeof reply;
    } catch {
      throw new Error(`Chrome's built-in model didn't reply in the expected format: "${raw.slice(0, 160)}…"`);
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
    this.#session?.destroy();
    this.#session = null;
  }
}
