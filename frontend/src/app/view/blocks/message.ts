import { html } from "lit";
import "../../../components/index.ts";
import { defineBlock } from "../registry.ts";

/**
 * `message`: an email (or any message) as the recipient sees it, in a window: the header lines
 * (from, to), the subject and the body. `dir` and `lang` set the writing direction and language
 * of the message itself (an Arabic preview reads right to left).
 */

declare module "../schema.ts" {
  interface ViewBlocks {
    message: {
      type: "message";
      /** Header lines above the subject ("From: …", "To: …"). */
      meta?: string[];
      subject: string;
      body: string;
      dir?: "ltr" | "rtl";
      lang?: string;
    };
  }
}

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
        <ui-text variant="body-md" leading="relaxed" pre-line>${b.body}</ui-text>
      </ui-flex>
    </ui-mockup-window>`,
);
