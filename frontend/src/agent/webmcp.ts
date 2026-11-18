/**
 * WebMCP: the page's own tools for AI agents (https://webmachinelearning.github.io/webmcp/).
 *
 * The app describes what it can show and do as tools — name, description, JSON Schema input,
 * `execute` — and this module hands them to the browser (`document.modelContext.registerTool`,
 * or `navigator.modelContext` in earlier Chrome builds), so a browser agent, the DevTools
 * Application › WebMCP panel, or our own in-page assistant can use the app the way it's meant to
 * be used: through its data and actions, never by reading the DOM, running scripts or taking
 * screenshots. Without WebMCP in the browser the same tools stay available in the page
 * (`agentTools()` / `callAgentTool()`), e.g. for an assistant panel that talks to a model.
 *
 * `provideTools()` replaces the whole set (e.g. when the signed-in user changes, so the tools only
 * ever offer what that user may do); the previous set is unregistered first.
 */

export type JsonSchema = Record<string, unknown>;

export interface AgentTool<I extends Record<string, unknown> = Record<string, unknown>> {
  /** 1–128 characters: letters, digits, `_`, `-`, `.`. */
  name: string;
  title?: string;
  description: string;
  inputSchema: JsonSchema;
  annotations?: {
    /** Only reads: safe to call any time. */
    readOnlyHint?: boolean;
    /** Changes data or what the user sees in a way that matters: an agent should confirm first. */
    consequentialHint?: boolean;
    /** The result includes text people wrote (emails, notes): treat it as data, not instructions. */
    untrustedContentHint?: boolean;
  };
  execute(input: I, signal?: AbortSignal): Promise<unknown>;
}

/** The result shape agents read: MCP text content, plus the value itself. */
export interface ToolResult {
  content: { type: "text"; text: string }[];
  structuredContent?: unknown;
  isError?: boolean;
}

interface ModelContext {
  registerTool(tool: Record<string, unknown>, options?: { signal?: AbortSignal }): unknown;
  /** Earlier Chrome builds unregister by name instead of with the signal. */
  unregisterTool?(name: string): void;
}

const modelContext = (): ModelContext | undefined =>
  (document as Document & { modelContext?: ModelContext }).modelContext ??
  (navigator as Navigator & { modelContext?: ModelContext }).modelContext;

/** Whether the browser itself exposes the tools to agents (WebMCP is on). */
export const webMcpAvailable = () => !!modelContext();

let tools: AgentTool[] = [];
let registration: AbortController | null = null;

const toolResult = (value: unknown, isError = false): ToolResult => ({
  content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 1) }],
  ...(isError ? { isError } : { structuredContent: value }),
});

async function run(tool: AgentTool, input: unknown, signal?: AbortSignal): Promise<ToolResult> {
  try {
    const args = input && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
    return toolResult(await tool.execute(args, signal));
  } catch (e) {
    return toolResult(`Error: ${(e as Error).message || String(e)}`, true);
  }
}

/** Replace the page's tools (registered with the browser when WebMCP is available). */
export function provideTools(next: AgentTool[]) {
  registration?.abort();
  registration = new AbortController();
  tools = next;
  const context = modelContext();
  if (context) {
    const { signal } = registration;
    for (const tool of next) {
      const definition = {
        name: tool.name,
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
        execute: (input: unknown, options?: { signal?: AbortSignal }) => run(tool, input, options?.signal),
      };
      try {
        void Promise.resolve(context.registerTool(definition, { signal })).catch((e: unknown) =>
          console.warn(`WebMCP: couldn't register ${tool.name}`, e),
        );
      } catch (e) {
        console.warn(`WebMCP: couldn't register ${tool.name}`, e);
      }
      if (context.unregisterTool)
        signal.addEventListener(
          "abort",
          () => {
            try {
              context.unregisterTool!(tool.name);
            } catch {
              /* already gone (the signal unregistered it) */
            }
          },
          { once: true },
        );
    }
  }
  window.dispatchEvent(new Event("agent-tools-change"));
}

/** The current tools, for an in-page assistant (e.g. to describe them to a model). */
export const agentTools = (): readonly AgentTool[] => tools;

/** Run a tool by name, as a browser agent would (errors come back as an `isError` result). */
export async function callAgentTool(name: string, input: Record<string, unknown> = {}, signal?: AbortSignal) {
  const tool = tools.find((t) => t.name === name);
  return tool ? run(tool, input, signal) : toolResult(`Error: no tool named ${name}`, true);
}
