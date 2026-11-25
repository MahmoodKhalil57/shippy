import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inset, padStart, row, stack, text } from "../layout/algebra.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

export const trace = rcva(`${stack} ${padStart["1"]} gap-0.5 border-s-2 border-outline-variant`);

export const traceLine = rcva(`${text.label} group/trace text-body-sm`);
export const traceSummary = rcva(
  `touch-target ${row} ${inset["2"]} min-h-7 items-center gap-2 rounded-field py-1 list-none [&::-webkit-details-marker]:hidden`,
  {
    variants: {
      interactive: {
        true: "touch-target cursor-pointer state-layer",
      },
    },
  },
);
export const traceIcon = rcva("grid size-4 shrink-0 place-items-center", {
  variants: {
    status: {
      running: "text-on-surface-variant",
      done: "text-on-surface-variant",
      error: "text-error-ink",
      denied: "text-on-surface-variant",
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
      denied: "line-through decoration-outline",
      waiting: "",
    },
  },
});
export const traceDescription = rcva("min-w-0 truncate text-on-surface-variant");
export const traceChevron = rcva(
  "ms-auto text-on-surface-variant transition-transform duration-(--duration-spatial-fast) ease-spatial-fast group-open/trace:rotate-180 motion-reduce:transition-none",
);
export const traceContent = rcva(`${stack} ${padStart["8"]} mt-1 mb-2 gap-1.5`);

export type TraceStatus = "running" | "done" | "error" | "denied" | "waiting";

const STATUS_ICON: Record<Exclude<TraceStatus, "running">, IconName | null> = {
  done: null,
  error: "error",
  denied: "block",
  waiting: "warning",
};

@customElement("ui-trace")
export class UiTrace extends LightElement {
  render() {
    return html`<div class=${trace()} role="list">${this.content}</div>`;
  }
}

@customElement("ui-trace-line")
export class UiTraceLine extends LightElement {
  @property() status: TraceStatus = "done";
  @property() icon: IconName = "check";
  @property() label: Renderable = "";
  @property() description: Renderable = "";
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
