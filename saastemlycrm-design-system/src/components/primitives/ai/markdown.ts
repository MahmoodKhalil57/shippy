import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inset, padStart, scrollX, stack, text } from "../layout/algebra.ts";

export const markdown = rcva(`${stack} ${text.prose} gap-2 text-body-md leading-relaxed`);
export const markdownHeading = rcva(`${text.label} text-on-surface`, {
  variants: { level: { "1": "text-title-md", "2": "text-title-sm", "3": "text-title-sm" } },
});
export const markdownList = rcva(`${stack} ${padStart["5"]} gap-1`, {
  variants: { ordered: { true: "list-decimal", false: "list-disc" } },
});
export const markdownCode = rcva("rounded-xs bg-surface-container-highest px-1 py-0.5 font-mono text-[0.8125em]");
export const markdownPre = rcva(
  `${scrollX} ${inset["3"]} ${text.label} rounded-field bg-surface-container-highest py-3 font-mono text-body-sm leading-normal whitespace-pre [--scrollbar-inset:var(--radius-field)]`,
);
export const markdownLink = rcva("link link-hover font-medium text-primary-ink");

type Inline = TemplateResult | string;

function inline(text: string): Inline[] {
  const out: Inline[] = [];
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|_([^_\s][^_]*)_|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (let m = pattern.exec(text); m; m = pattern.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, code, bold, italic1, italic2, label, href] = m;
    if (code != null) out.push(html`<code class=${markdownCode()}>${code}</code>`);
    else if (bold != null) out.push(html`<strong>${inline(bold)}</strong>`);
    else if (italic1 != null || italic2 != null) out.push(html`<em>${inline((italic1 ?? italic2)!)}</em>`);
    else if (label != null && href != null) out.push(link(label, href));
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function link(label: string, href: string): Inline {
  const inApp = href.startsWith("/") && !href.startsWith("//");
  if (!inApp && !/^https?:\/\//i.test(href)) return label;
  return inApp
    ? html`<a class=${markdownLink()} href=${href}>${inline(label)}</a>`
    : html`<a class=${markdownLink()} href=${href} target="_blank" rel="noreferrer noopener">${inline(label)}</a>`;
}

const lines = (block: string[]) => block.map((l, i) => html`${i ? html`<br />` : nothing}${inline(l)}`);

function blocks(text: string): TemplateResult[] {
  const out: TemplateResult[] = [];
  const src = text.replace(/\r\n?/g, "\n").split("\n");
  for (let i = 0; i < src.length;) {
    const line = src[i]!;
    if (!line.trim()) {
      i++;
      continue;
    }
    if (/^\s*```/.test(line)) {
      const code: string[] = [];
      for (i++; i < src.length && !/^\s*```/.test(src[i]!); i++) code.push(src[i]!);
      i++;
      out.push(html`<pre class=${markdownPre()}><code>${code.join("\n")}</code></pre>`);
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = String(heading[1]!.length) as "1" | "2" | "3";
      out.push(
        html`<p class=${markdownHeading({ level })} role="heading" aria-level=${Number(level) + 2}>
          ${inline(heading[2]!)}
        </p>`,
      );
      i++;
      continue;
    }
    const item = /^\s*(?:[-*•]|(\d+)[.)])\s+(.*)$/;
    if (item.test(line)) {
      const ordered = !!item.exec(line)![1];
      const items: string[] = [];
      for (; i < src.length && item.test(src[i]!); i++) items.push(item.exec(src[i]!)![2]!);
      const list = items.map((t) => html`<li>${inline(t)}</li>`);
      out.push(
        ordered
          ? html`<ol class=${markdownList({ ordered: true })}>
              ${list}
            </ol>`
          : html`<ul class=${markdownList({ ordered: false })}>
              ${list}
            </ul>`,
      );
      continue;
    }
    const para: string[] = [];
    for (
      ;
      i < src.length && src[i]!.trim() && !/^\s*```/.test(src[i]!) && !/^#{1,3}\s/.test(src[i]!) && !item.test(src[i]!);
      i++
    )
      para.push(src[i]!);
    out.push(html`<p>${lines(para)}</p>`);
  }
  return out;
}

@customElement("ui-markdown")
export class UiMarkdown extends LightElement {
  @property() text = "";

  render() {
    return html`<div class=${markdown()}>${blocks(this.text)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-markdown": UiMarkdown;
  }
}
