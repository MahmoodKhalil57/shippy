import { html } from "lit";
import type { FieldLike } from "../../../lib/contracts/config.ts";
import { yieldToMain } from "../../../lib/base/work-queue.ts";
import { defineBlock, type ViewContext } from "../registry.ts";
import type { ViewBlocks } from "../../../lib/widgets/schema.ts";
import { m } from "../../../lib/i18n/index.ts";

type Value = Record<string, unknown>;
const isObject = (v: unknown): v is Value => typeof v === "object" && v !== null && !Array.isArray(v);

function changes(before: Value, after: Value): Value {
  const out: Value = {};
  for (const [k, v] of Object.entries(after)) {
    const was = before[k];
    if (isObject(v) && isObject(was)) {
      const inner = changes(was, v);
      if (Object.keys(inner).length) out[k] = inner;
    } else if (JSON.stringify(v) !== JSON.stringify(was)) out[k] = v;
  }
  return out;
}

const pending = new Map<string, Value>();
const running = new Set<string>();

async function save(b: ViewBlocks["form"], ctx: ViewContext) {
  const key = b.save.path;
  running.add(key);
  let saved = false;
  await yieldToMain();
  for (let value = pending.get(key); value; value = pending.get(key)) {
    pending.delete(key);
    const patch = changes(b.value, value);
    if (!Object.keys(patch).length) continue;
    try {
      await ctx.dashboard.data.call(b.save.method ?? "POST", b.save.path, patch);
      saved = true;
    } catch (e) {
      ctx.dashboard.notify((e as Error).message || m.widget_save_failed(), "error");
    }
  }
  running.delete(key);
  if (saved) ctx.reload();
}

defineBlock("form", (b, ctx) => {
  const send = (value: Value) => {
    pending.set(b.save.path, value);
    if (!running.has(b.save.path)) void save(b, ctx);
  };
  return html`<ui-doc-form
    .fields=${b.fields as unknown as FieldLike[]}
    .value=${b.value}
    @ui-change=${(e: CustomEvent<{ value: Value }>) => {
      if (e.target === e.currentTarget) send(e.detail.value);
    }}
  ></ui-doc-form>`;
});
