import { html } from "lit";
import { api } from "../../../mock/client.ts";
import type { AskAnswer } from "../schema.ts";
import { defineBlock } from "../registry.ts";

/**
 * Questions answered from the records, drawn by `<ui-ask>` (src/components/composed/ai/ask.ts):
 * questions go to the block's `endpoint`, suggestions come with it or from their own endpoint.
 */
const loaded = new Map<string, Promise<string[]>>();
const suggestionsFrom = (endpoint: string) => {
  let p = loaded.get(endpoint);
  if (!p) {
    p = api
      .get<{ suggestions?: string[] }>(endpoint)
      .then((r) => r.suggestions ?? [])
      .catch(() => []);
    loaded.set(endpoint, p);
  }
  return p;
};

defineBlock("ask", (b) => {
  const s = b.suggestions;
  return html`<ui-ask
    .ask=${(question: string) => api.post<AskAnswer>(b.endpoint, { question })}
    .suggestions=${Array.isArray(s) ? s : []}
    .loadSuggestions=${s && !Array.isArray(s) ? () => suggestionsFrom(s.endpoint) : undefined}
    .question=${b.question ?? ""}
    .name=${b.name ?? "Assistant"}
    .placeholder=${b.placeholder ?? "Ask a question…"}
    .intro=${b.intro ?? ""}
    .reading=${b.reading ?? "Reading the records…"}
    .footnote=${b.footnote ?? ""}
  ></ui-ask>`;
});
