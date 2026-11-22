import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { inlineStart } from "../../base/inline-start.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { floating, floatingHeight, inset, pad, row, stack, text } from "../layout/algebra.ts";
import { auditContrast, type ContrastIssue } from "../../base/contrast.ts";
import { auditProminence, type ProminenceIssue } from "../../base/prominence.ts";
import { auditLayers, type LayoutIssue } from "../../base/layout.ts";

export { auditContrast, type ContrastIssue } from "../../base/contrast.ts";
export { auditLayers, auditLayout, type LayoutIssue } from "../../base/layout.ts";

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
 * command palette's "Check contrast and layout"), or by adding `?audit` to the URL.
 *
 * It also checks the layout at the current width (base/layout.ts): elements that escape their
 * card or row, text squeezed to nothing, a page that scrolls sideways. Run it at a phone width
 * and at a wide one.
 */
export const contrastAuditBox = rcva(
  "pointer-events-none fixed z-[70] rounded-xs ring-2 ring-offset-1 ring-offset-base-100 top-(--top) start-(--left) h-(--h) w-(--w) max-w-full",
  {
    variants: {
      focus: { true: "ring-4 animate-pulse motion-reduce:animate-none" },
      /** Contrast failures in error, extra prominent buttons in warning. */
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
export const contrastAuditList = rcva(`${stack} min-h-0 overflow-y-auto [--scrollbar-inset:var(--radius-box)]`);
export const contrastAuditItem = rcva(
  `${row} ${inset["2"]} touch-target items-center gap-2 rounded-field py-1 text-start state-layer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary`,
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

/**
 * @example <ui-contrast-audit></ui-contrast-audit>  <!-- once, near the app root -->
 * window.dispatchEvent(new Event("ui-contrast-audit"));  // run / close
 */
@customElement("ui-contrast-audit")
export class UiContrastAudit extends LightElement {
  @state() private issues: ContrastIssue[] | null = null;
  /** Surfaces with more filled buttons than one or two (Apple HIG; base/prominence.ts). */
  @state() private prominence: ProminenceIssue[] = [];
  /** What breaks the fluid layout at this width (base/layout.ts). */
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

  /** The layout problems at the current width, without showing anything. */
  measureLayout(): LayoutIssue[] {
    return auditLayers();
  }

  /** Audit the page now (closes any open dialog-free overlay first). */
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
    const issues = this.issues;
    if (!issues) return nothing;
    void this._tick;
    const overImage = issues.filter((i) => i.overImage).length;
    const prominent = this.prominence.flatMap((p) => p.buttons);
    return html`${issues
        .slice(0, 200)
        .map((issue, i) => this._box(issue.element, "contrast", `${issue.ratio.toFixed(1)}:1`, i === this.selected))}
      ${prominent.map((b) => this._box(b, "prominence", "filled"))}
      ${this.layout.map((l) => this._box(l.element, "layout", l.kind))}
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
              ${
                this.prominence.length
                  ? html`<br />${this.prominence
                        .map(
                          (p) =>
                            `${p.buttons.length} filled buttons on ${p.surface.matches("main") ? "the page" : "a dialog"}`,
                        )
                        .join(" · ")}:
                      keep one or two, make the rest tonal (variant="soft").`
                  : nothing
              }
              ${
                this.layout.length
                  ? html`<br />${this.layout.length} layout ${this.layout.length === 1 ? "problem" : "problems"} at
                      ${innerWidth}px: let it wrap or shrink.`
                  : nothing
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
          ${this.layout.map(
            (l) =>
              html`<button
                type="button"
                class=${contrastAuditItem()}
                title=${l.detail}
                @click=${() => l.element.scrollIntoView({ block: "center", behavior: "smooth" })}
              >
                <span class=${contrastAuditRatio({ kind: "layout" })}>${l.kind}</span>
                <span class=${contrastAuditText()}>${l.detail} · ${l.element.textContent?.trim().slice(0, 60)}</span>
              </button>`,
          )}
          ${prominent.map(
            (b) =>
              html`<button
                type="button"
                class=${contrastAuditItem()}
                title="A filled button: keep one or two per screen"
                @click=${() => b.scrollIntoView({ block: "center", behavior: "smooth" })}
              >
                <span class=${contrastAuditRatio({ kind: "prominence" })}>filled</span>
                <span class=${contrastAuditText()}>${b.textContent?.trim() || b.getAttribute("aria-label")}</span>
              </button>`,
          )}
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
