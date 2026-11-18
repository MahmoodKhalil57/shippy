import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { contrast, luminance, rgba, type Rect } from "../layout/legibility.ts";

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
  "pointer-events-none fixed z-[70] rounded-sm ring-2 ring-error ring-offset-1 ring-offset-base-100 top-(--top) left-(--left) h-(--h) w-(--w)",
  { variants: { focus: { true: "ring-4 animate-pulse" } } },
);
export const contrastAuditLabel = rcva(
  "absolute -top-2 left-0 -translate-y-full rounded-sm bg-error px-1 text-[0.625rem] leading-4 font-semibold whitespace-nowrap text-error-content",
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

export interface ContrastIssue {
  element: Element;
  text: string;
  ratio: number;
  required: number;
  /** Text and (worst) background colours, as CSS. */
  color: string;
  background: string;
  /** The background includes the app's background image. */
  overImage: boolean;
}

/** sRGB channel (0–255) of a grey with this relative luminance. */
const greyOf = (l: number) => {
  const s = l <= 0.0031308 ? 12.92 * l : 1.055 * l ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, s)) * 255);
};

type Rgb = [number, number, number];
const over = (top: [number, number, number, number], under: Rgb): Rgb => [
  top[3] * top[0] + (1 - top[3]) * under[0],
  top[3] * top[1] + (1 - top[3]) * under[1],
  top[3] * top[2] + (1 - top[3]) * under[2],
];
const css = ([r, g, b]: Rgb) => `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;

interface Backdrop {
  backdropAt(rect: Rect, blur?: number): number[] | null;
}

/** Audit every visible text node under `root`. */
export function auditContrast(root: Element = document.body): ContrastIssue[] {
  const issues: ContrastIssue[] = [];
  const seen = new Set<Element>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const page: Rgb = (() => {
    const [r, g, b, a] = rgba(getComputedStyle(document.documentElement).backgroundColor);
    return a > 0.5 ? [r, g, b] : [255, 255, 255];
  })();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    if (!el || seen.has(el) || !node.textContent?.trim()) continue;
    seen.add(el);
    if (el.closest("ui-contrast-audit, script, style, template, [disabled], [aria-disabled='true'], [inert]")) continue;
    const box = el.getBoundingClientRect();
    if (
      box.width * box.height < 16 ||
      box.bottom < 0 ||
      box.top > innerHeight ||
      box.right < 0 ||
      box.left > innerWidth
    )
      continue;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const style = getComputedStyle(el);
    const fg = rgba(style.color);
    if (fg[3] === 0) continue;

    // The layers behind the text, from the text outwards, until one is opaque.
    const layers: [number, number, number, number][] = [];
    let base: Rgb[] = [page];
    let overImage = false;
    // Frosted glass between the text and the image (`backdrop-filter: blur()`) evens the image out.
    let blur = 0;
    for (let e: Element | null = el; e; e = e.parentElement) {
      const shell = e.parentElement?.tagName === "UI-APP-SHELL" ? (e.parentElement as unknown as Backdrop) : null;
      const image = shell?.backdropAt(box, blur);
      if (image?.length) {
        base = image.map((l) => [greyOf(l), greyOf(l), greyOf(l)] as Rgb);
        overImage = true;
        break;
      }
      const layerStyle = getComputedStyle(e);
      const frosted = /blur\(([\d.]+)px\)/.exec(layerStyle.backdropFilter);
      if (frosted) blur = Math.max(blur, parseFloat(frosted[1]!));
      const bg = rgba(layerStyle.backgroundColor);
      if (bg[3] > 0) layers.push(bg);
      if (bg[3] >= 0.99) {
        base = [[bg[0], bg[1], bg[2]]];
        layers.pop();
        break;
      }
    }
    // Compose (outermost first) over each base sample; judge the worst.
    let worst = { ratio: Infinity, bg: page as Rgb, fg: page as Rgb };
    for (const b of base) {
      let bg = b;
      for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i]!, bg);
      const text = over(fg, bg);
      const ratio = contrast(luminance(...text), luminance(...bg));
      if (ratio < worst.ratio) worst = { ratio, bg, fg: text };
    }
    const size = parseFloat(style.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
    const required = large ? 3 : 4.5;
    if (worst.ratio < required - 0.01)
      issues.push({
        element: el,
        text: node.textContent.trim().slice(0, 80),
        ratio: worst.ratio,
        required,
        color: css(worst.fg),
        background: css(worst.bg),
        overImage,
      });
  }
  return issues.sort((a, b) => a.ratio - b.ratio);
}

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
