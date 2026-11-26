import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { inlineStart } from "../../../lib/base/inline-start.ts";
import { LightElement } from "../../base/light-element.ts";
import { afterNextPaint, whenIdle } from "../../../lib/base/work-queue.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { floating, floatingHeight, inset, pad, row, scrollRoom, stack, text } from "../../../styles/algebra.ts";
import { auditContrast, type ContrastIssue } from "../../../lib/base/contrast.ts";
import { auditProminence, type ProminenceIssue } from "../../../lib/base/prominence.ts";
import { auditLayers, type LayoutIssue } from "../../../lib/base/layout.ts";
import { intl, m } from "../../../lib/i18n/index.ts";

export { auditContrast, type ContrastIssue } from "../../../lib/base/contrast.ts";
export { auditLayers, auditLayout, type LayoutIssue } from "../../../lib/base/layout.ts";

export const contrastAuditBox = rcva(
  "pointer-events-none fixed z-[70] rounded-xs ring-2 ring-offset-1 ring-offset-base-100 top-(--top) start-(--left) h-(--h) w-(--w) max-w-full",
  {
    variants: {
      focus: { true: "ring-4 animate-pulse motion-reduce:animate-none" },
      kind: { contrast: "ring-error", prominence: "ring-warning", layout: "ring-info" },
    },
    defaultVariants: { kind: "contrast" },
  },
);
export const contrastAuditLabel = rcva(
  `${floating.fit} ${text.line} absolute -top-2 start-0 -translate-y-full rounded-xs bg-error px-1 text-label-sm font-semibold text-error-content`,
);
export const contrastAuditPanel = rcva(
  `${stack} ${floating["8"]} ${floatingHeight.tool} ${pad["3"]} ${text.label} liquid-glass fixed bottom-4 start-4 z-[71] gap-2 rounded-box py-3 text-body-md`,
);
export const contrastAuditHead = rcva(`${row} items-center justify-between gap-2`);
export const contrastAuditTitle = rcva("font-semibold");
export const contrastAuditSummary = rcva(`${text.prose} text-body-sm text-on-surface-variant`);
export const contrastAuditList = rcva(
  `${stack} ${scrollRoom} min-h-0 overflow-y-auto [--scrollbar-inset:var(--radius-box)]`,
);
export const contrastAuditItem = rcva(
  `${row} ${inset["2"]} touch-target items-center gap-2 rounded-field py-1 text-start state-layer`,
);
export const contrastAuditRatio = rcva("w-14 shrink-0 font-mono text-label-md", {
  variants: { kind: { contrast: "text-error-ink", prominence: "text-warning-ink", layout: "text-info-ink" } },
  defaultVariants: { kind: "contrast" },
});
export const contrastAuditText = rcva("min-w-0 flex-1 truncate");
export const contrastAuditSwatch = rcva("size-4 shrink-0 rounded-full ring-1 ring-outline-variant bg-(--swatch)");
export const contrastAuditButton = rcva("btn btn-xs max-w-full", {
  variants: { kind: { ghost: "btn-ghost", primary: "btn-primary" } },
});

const KIND: Record<LayoutIssue["kind"], () => string> = {
  escapes: () => m.contrast_audit_kind_escapes(),
  squeezed: () => m.contrast_audit_kind_squeezed(),
  cramped: () => m.contrast_audit_kind_cramped(),
  "page-scroll": () => m.contrast_audit_kind_page_scroll(),
};

@customElement("ui-contrast-audit")
export class UiContrastAudit extends LightElement {
  @state() private issues: ContrastIssue[] | null = null;
  @state() private prominence: ProminenceIssue[] = [];
  @state() private layout: LayoutIssue[] = [];
  @state() private selected = -1;
  @state() private _tick = 0;
  #frame = 0;

  #toggle = () => (this.issues ? this.close() : this.run());
  #reflow = () => {
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => this._tick++);
  };

  connectedCallback() {
    super.connectedCallback();
    addEventListener("ui-contrast-audit", this.#toggle);
    addEventListener("scroll", this.#reflow, { capture: true, passive: true });
    addEventListener("resize", this.#reflow, { passive: true });
    if (new URLSearchParams(location.search).has("audit")) void this.#runWhenSettled();
  }

  /** With ?audit in the URL, audits once the page has loaded, its fonts are in and the browser is idle. */
  async #runWhenSettled() {
    if (document.readyState !== "complete")
      await new Promise<void>((done) => addEventListener("load", () => done(), { once: true }));
    await document.fonts.ready;
    await afterNextPaint();
    whenIdle(this, () => this.isConnected && this.run());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener("ui-contrast-audit", this.#toggle);
    removeEventListener("scroll", this.#reflow, { capture: true });
    removeEventListener("resize", this.#reflow);
    cancelAnimationFrame(this.#frame);
  }

  measure(): ContrastIssue[] {
    return auditContrast();
  }

  run() {
    this.issues = null;
    this.selected = -1;
    requestAnimationFrame(() => {
      const issues = auditContrast();
      this.prominence = auditProminence();
      this.layout = auditLayers();
      this.issues = issues;
      // oxlint-disable-next-line no-console
      console.table(
        issues.map((i) => ({
          ratio: i.ratio.toFixed(2),
          required: i.required,
          text: i.text,
          color: i.color,
          background: i.background,
          overImage: i.overImage,
        })),
      );
    });
  }

  close() {
    this.issues = null;
  }

  private _show(i: number) {
    this.selected = i;
    this.issues?.[i]?.element.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  private _box(element: Element, kind: "contrast" | "prominence" | "layout", label: string, focus = false) {
    const r = element.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight) return nothing;
    return html`<div
      class=${contrastAuditBox({ focus, kind })}
      style=${styleMap({ "--top": `${r.top}px`, "--left": `${inlineStart(r.left, r.width)}px`, "--h": `${r.height}px`, "--w": `${r.width}px` })}
    >
      <span class=${contrastAuditLabel()}>${label}</span>
    </div>`;
  }

  render() {
    const ratio = (v: number, digits: number) =>
      intl.number({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v);
    const kind = (k: LayoutIssue["kind"]) => KIND[k]();
    const issues = this.issues;
    if (!issues) return nothing;
    void this._tick;
    const overImage = issues.filter((i) => i.overImage).length;
    const prominent = this.prominence.flatMap((p) => p.buttons);
    return html`${issues
        .slice(0, 200)
        .map((issue, i) =>
          this._box(
            issue.element,
            "contrast",
            m.contrast_audit_ratio({ ratio: ratio(issue.ratio, 1) }),
            i === this.selected,
          ),
        )}
      ${prominent.map((b) => this._box(b, "prominence", m.contrast_audit_filled()))}
      ${this.layout.map((l) => this._box(l.element, "layout", kind(l.kind)))}
      <div class=${contrastAuditPanel()} role="dialog" aria-label=${m.contrast_audit_title()}>
        <div class=${contrastAuditHead()}>
          <div>
            <div class=${contrastAuditTitle()}>${m.contrast_audit_title()}</div>
            <div class=${contrastAuditSummary()}>
              ${
                issues.length
                  ? overImage
                    ? m.contrast_audit_fails_over_image({ count: issues.length, overImage })
                    : m.contrast_audit_fails({ count: issues.length })
                  : m.contrast_audit_passes()
              }
              ${
                this.prominence.length
                  ? html`<br />${m.contrast_audit_prominence({
                        places: intl
                          .list({ type: "unit" })
                          .format(
                            this.prominence.map((p) =>
                              p.surface.matches("main")
                                ? m.contrast_audit_filled_on_page({ count: p.buttons.length })
                                : m.contrast_audit_filled_on_dialog({ count: p.buttons.length }),
                            ),
                          ),
                      })}`
                  : nothing
              }
              ${
                this.layout.length
                  ? html`<br />${m.contrast_audit_layout({ count: this.layout.length, px: innerWidth })}`
                  : nothing
              }
            </div>
          </div>
          <div>
            <button type="button" class=${contrastAuditButton({ kind: "ghost" })} @click=${() => this.run()}>
              ${m.contrast_audit_rerun()}
            </button>
            <button type="button" class=${contrastAuditButton({ kind: "primary" })} @click=${() => this.close()}>
              ${m.contrast_audit_close()}
            </button>
          </div>
        </div>
        <div class=${contrastAuditList()}>
          ${this.layout.map(
            (l) =>
              html`<button
                type="button"
                class=${contrastAuditItem()}
                title=${l.detail}
                @click=${() => l.element.scrollIntoView({ block: "center", behavior: "smooth" })}
              >
                <span class=${contrastAuditRatio({ kind: "layout" })}>${kind(l.kind)}</span>
                <span class=${contrastAuditText()}>${l.detail} · ${l.element.textContent?.trim().slice(0, 60)}</span>
              </button>`,
          )}
          ${prominent.map(
            (b) =>
              html`<button
                type="button"
                class=${contrastAuditItem()}
                title=${m.contrast_audit_filled_hint()}
                @click=${() => b.scrollIntoView({ block: "center", behavior: "smooth" })}
              >
                <span class=${contrastAuditRatio({ kind: "prominence" })}>${m.contrast_audit_filled()}</span>
                <span class=${contrastAuditText()}>${b.textContent?.trim() || b.getAttribute("aria-label")}</span>
              </button>`,
          )}
          ${issues.map(
            (issue, i) =>
              html`<button
                type="button"
                class=${contrastAuditItem()}
                title=${m.contrast_audit_issue({ color: issue.color, background: issue.background, required: issue.required })}
                @click=${() => this._show(i)}
              >
                <span class=${contrastAuditRatio()}>${ratio(issue.ratio, 2)}</span>
                <span class=${contrastAuditSwatch()} style=${styleMap({ "--swatch": issue.background })}></span>
                <span class=${contrastAuditSwatch()} style=${styleMap({ "--swatch": issue.color })}></span>
                <span class=${contrastAuditText()}>${issue.text}</span>
              </button>`,
          )}
        </div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-contrast-audit": UiContrastAudit;
  }
}
