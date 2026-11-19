import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { agentTools, callAgentTool, provideTools, type AgentTool } from "../src/agent/webmcp.ts";

/** A browser's `document.modelContext` (WebMCP), as the spec has it: register with an AbortSignal. */
function fakeModelContext() {
  const registered = new Map<string, { execute: (input: unknown, o: { signal: AbortSignal }) => Promise<unknown> }>();
  return {
    registered,
    registerTool(tool: { name: string; execute: never }, options: { signal?: AbortSignal } = {}) {
      if (registered.has(tool.name)) throw new DOMException(`${tool.name} is registered`, "InvalidStateError");
      registered.set(tool.name, tool);
      options.signal?.addEventListener("abort", () => registered.delete(tool.name));
      return Promise.resolve();
    },
  };
}

const tool = (name: string, execute: AgentTool["execute"] = async () => ({ ok: name })): AgentTool => ({
  name,
  description: `${name} tool`,
  inputSchema: { type: "object", properties: {} },
  execute,
});

describe("WebMCP tools", () => {
  afterEach(() => vi.unstubAllGlobals());

  function stub(context?: object) {
    vi.stubGlobal("document", context ? { modelContext: context } : {});
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("window", { dispatchEvent: () => true });
  }

  it("registers the tools with the browser, and replaces the whole set on the next call", async () => {
    const context = fakeModelContext();
    stub(context);
    provideTools([tool("get_screen"), tool("navigate")]);
    expect([...context.registered.keys()]).toEqual(["get_screen", "navigate"]);
    // A new user: the previous set is unregistered first, so the same names register again.
    provideTools([tool("get_screen")]);
    expect([...context.registered.keys()]).toEqual(["get_screen"]);
    const result = await context.registered.get("get_screen")!.execute({}, { signal: new AbortController().signal });
    expect(result).toEqual({
      content: [{ type: "text", text: JSON.stringify({ ok: "get_screen" }, null, 1) }],
      structuredContent: { ok: "get_screen" },
    });
  });

  it("keeps the tools for an in-page assistant when the browser has no WebMCP", async () => {
    stub();
    provideTools([tool("echo", async (input) => input)]);
    expect(agentTools().map((t) => t.name)).toEqual(["echo"]);
    expect((await callAgentTool("echo", { a: 1 })).structuredContent).toEqual({ a: 1 });
  });

  it("returns errors as results an agent can read", async () => {
    stub();
    provideTools([
      tool("fails", async () => {
        throw new Error("No page at /nope");
      }),
    ]);
    expect(await callAgentTool("fails")).toEqual({
      content: [{ type: "text", text: "Error: No page at /nope" }],
      isError: true,
    });
    expect((await callAgentTool("missing")).isError).toBe(true);
  });
});
