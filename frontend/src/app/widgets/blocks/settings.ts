import { html } from "lit";
import "../../../components/index.ts";
import { defineBlock } from "../registry.ts";

/**
 * `settings`: settings that apply as soon as they change. A `true` / `false` value is a switch,
 * a value with `options` is a select. A change sends `call` with `value` added to the body, shows
 * `done` (or the endpoint's `message`) and reloads. Without `call`, or `disabled`, it's read-only.
 */

defineBlock("settings", (b, ctx) => {
  type Item = (typeof b.items)[number];
  const send = (i: Item, value: boolean | string) =>
    i.call &&
    ctx.run({ label: i.label, call: { ...i.call, body: { ...i.call.body, value } }, done: i.done, reply: true });
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
