import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { auditContrast, type ContrastIssue } from "../../base/contrast.ts";

export { auditContrast, type ContrastIssue } from "../../base/contrast.ts";

/**
 * Contrast audit: finds text on screen that fails WCAG contrast (AA: 4.5:1, or 3:1 for large text)
 * — including text over the app's background image, which generic checkers can't judge.
 *
 * Purpose: Feedback & quality · Kind: primitive (Shippy)
 *
 * For every visible text node it composes the backgrounds actually behind it (each ancestor's
 * background colour, alpha-blended, down to the page — or to the app shell's background image
 * under its scrim, sampled behind the text), then compares the text colour. Failures are outlined
 * on the page with their ratio, listed in a panel (click one to scroll to it) and logged with
 * `console.table`. Open it with `window.dispatchEvent(new Event("ui-contrast-audit"))` (the
 * command palette's "Check colour contrast"), or by adding `?audit` to the URL.
 */
export const contrastAuditBox = rcva(
  "pointer-events-none fixed z-[70] rounded-xs ring-2 ring-error ring-offset-1 ring-offset-base-100 top-(--top) left-(--left) h-(--h) w-(--w)",
  { variants: { focus: { true: "ring-4 animate-pulse motion-reduce:animate-none" } } },
);
export const contrastAuditLabel = rcva(
  "absolute -top-2 left-0 -translate-y-full rounded-xs bg-error px-1 text-[0.625rem] leading-4 font-semibold whitespace-nowrap text-error-content",
);
export const contrastAuditPanel = rcva(
  "liquid-glass fixed bottom-4 left-4 z-[71] flex max-h-[min(28rem,60dvh)] w-[min(26rem,calc(100vw-2rem))] flex-col gap-2 rounded-box p-3 text-sm",
);
export const contrastAuditHead = rcva("flex items-center justify-between gap-2");
export const contrastAuditTitle = rcva("font-semibold");
export const contrastAuditSummary = rcva("text-xs text-base-content/70");
export const contrastAuditList = rcva(
  "-mx-1 flex min-h-0 flex-col overflow-y-auto px-1 [--scrollbar-inset:var(--radius-box)]",
);
export const contrastAuditItem = rcva(
  "flex items-center gap-2 rounded-field px-2 py-1 text-start hover:bg-base-content/10 focus-visible:outline-2 focus-visible:outline-primary",
);
export const contrastAuditRatio = rcva("w-14 shrink-0 font-mono text-xs font-semibold text-error");
export const contrastAuditText = rcva("min-w-0 flex-1 truncate");
export const contrastAuditSwatch = rcva("size-4 shrink-0 rounded-full ring-1 ring-base-content/20 bg-(--swatch)");
export const contrastAuditButton = rcva("btn btn-xs", {
  variants: { kind: { ghost: "btn-ghost", primary: "btn-primary" } },
});

/**
 * @example <ui-contrast-audit></ui-contrast-audit>  <!-- once, near the app root -->
 * window.dispatchEvent(new Event("ui-contrast-audit"));  // run / close
 */
@customElement("ui-contrast-audit")
export class UiContrastAudit extends LightElement {
  @state() private issues: ContrastIssue[] | null = null;
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
    if (new URLSearchParams(location.search).has("audit")) setTimeout(() => this.run(), 1500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener("ui-contrast-audit", this.#toggle);
    removeEventListener("scroll", this.#reflow, { capture: true });
    removeEventListener("resize", this.#reflow);
    cancelAnimationFrame(this.#frame);
  }

  /** Audit the page without showing anything (for code, e.g. an agent's tool): the failures, worst first. */
  measure(): ContrastIssue[] {
    return auditContrast();
  }

  /** Audit the page now (closes any open dialog-free overlay first). */
  run() {
    this.issues = null;
    this.selected = -1;
    requestAnimationFrame(() => {
      const issues = auditContrast();
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

  render() {
    const issues = this.issues;
    if (!issues) return nothing;
    void this._tick;
    const overImage = issues.filter((i) => i.overImage).length;
    return html`${issues.slice(0, 200).map((issue, i) => {
        const r = issue.element.getBoundingClientRect();
        if (!r.width || r.bottom < 0 || r.top > innerHeight) return nothing;
        return html`<div
          class=${contrastAuditBox({ focus: i === this.selected })}
          style=${styleMap({ "--top": `${r.top}px`, "--left": `${r.left}px`, "--h": `${r.height}px`, "--w": `${r.width}px` })}
        >
          <span class=${contrastAuditLabel()}>${issue.ratio.toFixed(1)}:1</span>
        </div>`;
      })}
      <div class=${contrastAuditPanel()} role="dialog" aria-label="Contrast audit">
        <div class=${contrastAuditHead()}>
          <div>
            <div class=${contrastAuditTitle()}>Contrast audit</div>
            <div class=${contrastAuditSummary()}>
              ${
                issues.length
                  ? `${issues.length} text ${issues.length === 1 ? "element fails" : "elements fail"} WCAG AA${overImage ? ` · ${overImage} over the background image` : ""}`
                  : "Everything on screen passes WCAG AA (4.5:1, large text 3:1)."
              }
            </div>
          </div>
          <div>
            <button type="button" class=${contrastAuditButton({ kind: "ghost" })} @click=${() => this.run()}>
              Re-run
            </button>
            <button type="button" class=${contrastAuditButton({ kind: "primary" })} @click=${() => this.close()}>
              Close
            </button>
          </div>
        </div>
        <div class=${contrastAuditList()}>
          ${issues.map(
            (issue, i) =>
              html`<button
                type="button"
                class=${contrastAuditItem()}
                title=${`${issue.color} on ${issue.background} — needs ${issue.required}:1`}
                @click=${() => this._show(i)}
              >
                <span class=${contrastAuditRatio()}>${issue.ratio.toFixed(2)}</span>
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
