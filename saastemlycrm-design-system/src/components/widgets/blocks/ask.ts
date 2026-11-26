import { html } from "lit";
import type { DataPort } from "../../../lib/dashboard/context.ts";
import type { AskAnswer } from "../../../lib/widgets/schema.ts";
import { defineBlock } from "../registry.ts";
import { m } from "../../../lib/i18n/index.ts";

const loaded = new WeakMap<DataPort, Map<string, Promise<string[]>>>();
const suggestionsFrom = (data: DataPort, endpoint: string) => {
  const mine = loaded.get(data) ?? new Map<string, Promise<string[]>>();
  loaded.set(data, mine);
  let p = mine.get(endpoint);
  if (!p) {
    p = data
      .get<{ suggestions?: string[] }>(endpoint)
      .then((r) => r.suggestions ?? [])
      .catch(() => []);
    mine.set(endpoint, p);
  }
  return p;
};

defineBlock("ask", (b, ctx) => {
  const s = b.suggestions;
  const data = ctx.dashboard.data;
  return html`<ui-ask
    .ask=${(question: string) => data.post<AskAnswer>(b.endpoint, { question })}
    .suggestions=${Array.isArray(s) ? s : []}
    .loadSuggestions=${s && !Array.isArray(s) ? () => suggestionsFrom(data, s.endpoint) : undefined}
    .question=${b.question ?? ""}
    .name=${b.name ?? "Assistant"}
    .placeholder=${b.placeholder ?? m.widget_ask_placeholder()}
    .intro=${b.intro ?? ""}
    .reading=${b.reading ?? m.widget_ask_reading()}
    .footnote=${b.footnote ?? ""}
  ></ui-ask>`;
});
