import { html, nothing } from "lit";
import "../../../components/index.ts";
import { action, tag } from "../blocks.ts";
import { defineBlock } from "../registry.ts";

/**
 * `tiles`: short pieces side by side, as many as fit: an overline, a heading, a line of text and
 * a button or two (milestones, principles, problem and answer, payment steps). `look: "card"`
 * puts each one on a small card (`filled` on an item stresses it); `figure` sets the heading as
 * a big number ("40%").
 */

declare module "../schema.ts" {
  interface ViewBlocks {
    tiles: {
      type: "tiles";
      items: {
        overline?: string;
        heading: string;
        text?: string;
        tags?: Tag[];
        actions?: Action[];
        /** On a card look: a filled card instead of an outlined one. */
        filled?: boolean;
      }[];
      look?: "plain" | "card";
      /** The heading is a figure (a percentage, an amount). */
      figure?: boolean;
      fit?: "xs" | "sm" | "md";
    };
  }
}

defineBlock("tiles", (b, ctx) => {
  const card = b.look === "card";
  return html`<ui-grid .fit=${b.fit ?? "sm"} gap="4"
    >${b.items.map((t) => {
      const body = html`<ui-flex direction="col" gap="1" align="start">
        ${t.overline ? html`<ui-text variant="label-md" color="muted" uppercase>${t.overline}</ui-text>` : nothing}
        ${t.tags?.length ? html`<ui-flex gap="1" wrap>${t.tags.map(tag)}</ui-flex>` : nothing}
        ${
          b.figure
            ? html`<ui-text variant="headline-md" emphasized leading="tight">${t.heading}</ui-text>`
            : html`<ui-text variant="title-sm">${t.heading}</ui-text>`
        }
        ${t.text ? html`<ui-text variant="body-md" .color=${card ? undefined : "muted"}>${t.text}</ui-text>` : nothing}
        ${t.actions?.length ? html`<ui-flex gap="2" wrap>${t.actions.map((a) => action(a, ctx))}</ui-flex>` : nothing}
      </ui-flex>`;
      return card ? html`<ui-card size="sm" .variant=${t.filled ? "filled" : undefined}>${body}</ui-card>` : body;
    })}</ui-grid
  >`;
});
