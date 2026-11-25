export type JsonSchema = Record<string, unknown>;

export interface AgentTool<I extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  title?: string;
  description: string;
  inputSchema: JsonSchema;
  annotations?: {
    readOnlyHint?: boolean;
    consequentialHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute(input: I, signal?: AbortSignal): Promise<unknown>;
  simple?: boolean;
}

export interface ToolResult {
  content: { type: "text"; text: string }[];
  structuredContent?: unknown;
  isError?: boolean;
}

interface ModelContext {
  registerTool(tool: Record<string, unknown>, options?: { signal?: AbortSignal }): unknown;
  unregisterTool?(name: string): void;
}

const modelContext = (): ModelContext | undefined =>
  (document as Document & { modelContext?: ModelContext }).modelContext ??
  (navigator as Navigator & { modelContext?: ModelContext }).modelContext;

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
            } catch {}
          },
          { once: true },
        );
    }
  }
  window.dispatchEvent(new Event("agent-tools-change"));
}

export interface AgentContext {
  name: string;
  role: string;
  roleId: string;
  page: string;
  path: string;
}
let context: () => AgentContext | null = () => null;

export const provideAgentContext = (fn: () => AgentContext | null) => {
  context = fn;
};
export const agentContext = () => context();

export const agentTools = (): readonly AgentTool[] => tools;

export async function callAgentTool(name: string, input: Record<string, unknown> = {}, signal?: AbortSignal) {
  const tool = tools.find((t) => t.name === name);
  return tool ? run(tool, input, signal) : toolResult(`Error: no tool named ${name}`, true);
}
