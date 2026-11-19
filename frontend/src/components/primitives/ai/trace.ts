import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Trace: what an agent did on its way to an answer — one line per step (thinking, a tool call,
 * the sources it read), on a thin rail. A line with details opens to show them.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Tool", "Reasoning", "Sources")
 *
 * Status: `running` (spinner, the title shimmers), `done`, `error`, `denied`, `waiting` (for the
 * person, e.g. an approval).
 */
export const trace = rcva("flex flex-col gap-0.5 border-s-2 border-base-content/10 ps-3");

export const traceLine = rcva("group/trace text-xs");
export const traceSummary = rcva(
  "flex min-h-7 items-center gap-2 rounded-field px-1.5 py-1 -ms-1.5 list-none [&::-webkit-details-marker]:hidden",
  {
    variants: {
      interactive: {
        true: "cursor-pointer hover:bg-base-content/5 focus-visible:outline-2 focus-visible:outline-primary",
      },
    },
  },
);
export const traceIcon = rcva("grid size-4 shrink-0 place-items-center", {
  variants: {
    status: {
      running: "text-base-content/80",
      done: "text-base-content/75",
      error: "text-error-ink",
      denied: "text-base-content/75",
      waiting: "text-warning-ink",
    },
  },
});
export const traceSpinner = rcva("loading loading-spinner loading-xs");
export const traceTitle = rcva("min-w-0 truncate font-medium", {
  variants: {
    status: {
      running: "shimmer",
      done: "",
      error: "text-error-ink",
      denied: "line-through decoration-base-content/40",
      waiting: "",
    },
  },
});
export const traceDescription = rcva("min-w-0 truncate text-base-content/75");
export const traceChevron = rcva(
  "ms-auto shrink-0 text-base-content/75 transition-transform duration-(--duration-spatial-fast) ease-spatial-fast group-open/trace:rotate-180 motion-reduce:transition-none",
);
export const traceContent = rcva("mt-1 mb-2 ms-6 flex flex-col gap-1.5");

export type TraceStatus = "running" | "done" | "error" | "denied" | "waiting";

const STATUS_ICON: Record<Exclude<TraceStatus, "running">, IconName | null> = {
  done: null,
  error: "error",
  denied: "block",
  waiting: "warning",
};

/**
 * @example
 * <ui-trace>
 *   <ui-trace-line icon="thinking" status="done" label="Thought for 2 s"></ui-trace-line>
 *   <ui-trace-line icon="tool" status="running" label="Finding records" description="cases"></ui-trace-line>
 *   <ui-trace-line icon="tool" status="done" label="Read a record">…details…</ui-trace-line>
 * </ui-trace>
 */
@customElement("ui-trace")
export class UiTrace extends LightElement {
  render() {
    return html`<div class=${trace()} role="list">${this.content}</div>`;
  }
}

/** One step. Children are its details (input, output…): the line opens to show them. */
@customElement("ui-trace-line")
export class UiTraceLine extends LightElement {
  @property() status: TraceStatus = "done";
  /** The step's kind, as an icon (shown when done; a spinner while running). */
  @property() icon: IconName = "check";
  @property() label: Renderable = "";
  @property() description: Renderable = "";
  /** Open the details from the start. */
  @property({ type: Boolean }) open = false;

  render() {
    const icon =
      this.status === "running"
        ? html`<span class=${traceSpinner()}></span>`
        : iconSvg(STATUS_ICON[this.status] ?? this.icon, { size: "sm" });
    const summary = (interactive: boolean) =>
      html` <span class=${traceIcon({ status: this.status })}>${icon}</span>
        <span class=${traceTitle({ status: this.status })}>${this.label}</span>
        ${this.description ? html`<span class=${traceDescription()}>${this.description}</span>` : nothing}
        ${interactive ? html`<span class=${traceChevron()}>${iconSvg("chevron-down", { size: "xs" })}</span>` : nothing}`;
    return this.hasContent
      ? html`<details class=${traceLine()} role="listitem" ?open=${this.open}>
          <summary class=${traceSummary({ interactive: true })}>${summary(true)}</summary>
          <div class=${traceContent()}>${this.content}</div>
        </details>`
      : html`<div class=${traceLine()} role="listitem"><div class=${traceSummary()}>${summary(false)}</div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-trace": UiTrace;
    "ui-trace-line": UiTraceLine;
  }
}
