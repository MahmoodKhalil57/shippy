import { html } from "lit";
import "../../../components/index.ts";
import { defineBlock } from "../registry.ts";

defineBlock(
  "message",
  (b) =>
    html`<ui-mockup-window>
      <ui-flex direction="col" gap="3" padding="4" dir=${b.dir ?? "ltr"} lang=${b.lang ?? "en"}>
        <ui-flex direction="col" gap="0">
          ${(b.meta ?? []).map((m) => html`<ui-text variant="body-sm" color="muted">${m}</ui-text>`)}
          <ui-text variant="title-sm">${b.subject}</ui-text>
        </ui-flex>
        <ui-divider></ui-divider>
        ${
          b.assist
            ? html`<ui-ai-text .text=${b.body} translatable summarizable></ui-ai-text>`
            : html`<ui-text variant="body-md" leading="relaxed" pre-line>${b.body}</ui-text>`
        }
      </ui-flex>
    </ui-mockup-window>`,
);
