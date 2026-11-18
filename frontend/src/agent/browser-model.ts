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
 */

interface PromptSession {
  prompt(input: string, options?: { responseConstraint?: JsonSchema; signal?: AbortSignal }): Promise<string>;
  destroy(): void;
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

export class BrowserModelChat {
  #session: PromptSession | null = null;

  async #open(instructions: string, tools: readonly AgentTool[], onStatus: (text: string) => void) {
    const api = languageModel();
    if (!api)
      throw new Error(
        "This browser has no built-in AI model. AIbrowser uses Chrome's Prompt API (Chrome 148 or later on desktop).",
      );
    const availability = await api.availability(LANGUAGES);
    if (availability === "unavailable")
      throw new Error(
        "Chrome's built-in model isn't available on this device (it needs about 22 GB of free disk space and a GPU with more than 4 GB of memory, or 16 GB of RAM).",
      );
    if (availability !== "available") onStatus("Downloading Chrome's built-in model (once per device)…");
    // The fullest brief that fits the device's context: full instructions and tool summaries,
    // then shorter ones.
    const protocol = BRIEF.split("\n")[1]!;
    const briefs = [
      `${instructions}\n\nYou use the platform through these tools:\n${CATALOGUES[0]!(tools)}\n\n${protocol}`,
      ...CATALOGUES.slice(1).map((list) => `${BRIEF}\nTools: ${list(tools)}`),
    ];
    for (const [i, brief] of briefs.entries()) {
      try {
        this.#session = await api.create({
          ...LANGUAGES,
          initialPrompts: [{ role: "system", content: brief }],
          monitor(m: DownloadMonitor) {
            m.addEventListener("downloadprogress", (e) =>
              onStatus(`Downloading Chrome's built-in model… ${Math.round(e.loaded * 100)}%`),
            );
          },
        });
        return this.#session;
      } catch (e) {
        if (!tooLarge(e) || i === briefs.length - 1) throw e;
      }
    }
    throw new Error("Chrome's built-in model has too little room for the helper on this device.");
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

  /** Forget the conversation. */
  reset() {
    this.#session?.destroy();
    this.#session = null;
  }
}
