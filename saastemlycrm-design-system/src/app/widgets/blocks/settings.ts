import { html } from "lit";
import "../../../components/index.ts";
import { defineBlock } from "../registry.ts";

defineBlock("settings", (b, ctx) => {
  type Item = (typeof b.items)[number];
  const send = (i: Item, value: boolean | string) =>
    i.call &&
    ctx.run({
      label: i.label,
      call: { ...i.call, body: { ...i.call.body, value } },
      done: i.done,
      reply: true,
      undo: { ...i.call, body: { ...i.call.body, value: i.value } },
    });
  return html`<ui-flex direction="col" gap="3"
    >${b.items.map((i) =>
      typeof i.value === "boolean"
        ? html`<ui-switch
            .label=${i.label}
            .hint=${i.supporting ?? ""}
            .checked=${i.value}
            ?disabled=${i.disabled || !i.call}
            @change=${(e: Event) => send(i, (e.target as HTMLInputElement).checked)}
          ></ui-switch>`
        : html`<ui-select
            width="full"
            .legend=${i.label}
            .hint=${i.supporting ?? ""}
            .options=${i.options ?? []}
            .value=${i.value}
            ?disabled=${i.disabled || !i.call}
            @change=${(e: Event) => send(i, (e.target as HTMLSelectElement).value)}
          ></ui-select>`,
    )}</ui-flex
  >`;
});
