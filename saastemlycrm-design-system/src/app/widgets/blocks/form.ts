import { html } from "lit";
import { api } from "../../../api/client.ts";
import type { FieldLike } from "../../../contracts/config.ts";
import { toast } from "../../shared.ts";
import { defineBlock } from "../registry.ts";
import { m } from "../../../i18n/index.ts";

/**
 * Settings that apply as they are edited: a small form (Payload field configs) whose changes are
 * sent to `save` a moment after the last keystroke, then the view reloads. Only what changed is
 * sent (one level deep: a group sends only its changed sub-fields), so untouched values keep
 * whatever default the server gives them.
 */

type Value = Record<string, unknown>;
const isObject = (v: unknown): v is Value => typeof v === "object" && v !== null && !Array.isArray(v);

/** What differs from `before`, one level of nesting deep. */
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

const timers = new Map<string, ReturnType<typeof setTimeout>>();

defineBlock("form", (b, ctx) => {
  const send = (value: Value) => {
    const key = b.save.path;
    clearTimeout(timers.get(key));
    timers.set(
      key,
      setTimeout(async () => {
        timers.delete(key);
        const patch = changes(b.value, value);
        if (!Object.keys(patch).length) return;
        try {
          await api.call(b.save.method ?? "POST", b.save.path, patch);
          ctx.reload();
        } catch (e) {
          toast((e as Error).message || m.widget_save_failed(), "error");
        }
      }, 700),
    );
  };
  return html`<ui-doc-form
    .fields=${b.fields as unknown as FieldLike[]}
    .value=${b.value}
    @ui-change=${(e: CustomEvent<{ value: Value }>) => {
      if (e.target === e.currentTarget) send(e.detail.value);
    }}
  ></ui-doc-form>`;
});
