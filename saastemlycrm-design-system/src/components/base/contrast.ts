import { contrast, luminance, rgba, type Rect } from "./legibility.ts";

export interface ContrastIssue {
  element: Element;
  text: string;
  ratio: number;
  required: number;
  color: string;
  background: string;
  overImage: boolean;
}

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

    const layers: [number, number, number, number][] = [];
    let base: Rgb[] = [page];
    let overImage = false;
    let blur = 0;
    for (let e: Element | null = el; e; e = e.parentElement) {
      const shell = e.hasAttribute("data-frame") ? (e.closest("ui-app-shell") as unknown as Backdrop | null) : null;
      if (shell)
        for (const layer of [...e.querySelectorAll(":scope > [data-frame-layer]")].reverse()) {
          if (layer.hasAttribute("data-frame-shell") || layer.hasAttribute("data-frame-backdrop")) {
            const w = e.querySelector("ui-frame-main main")?.getBoundingClientRect();
            const cx = box.left + box.width / 2;
            const cy = box.top + box.height / 2;
            const inWindow = !!w && cx >= w.left && cx <= w.right && cy >= w.top && cy <= w.bottom;
            if (layer.hasAttribute("data-frame-shell") ? !inWindow : inWindow) continue;
          }
          const ls = getComputedStyle(layer);
          const frosted = /blur\(([\d.]+)px\)/.exec(ls.backdropFilter);
          if (frosted) blur = Math.max(blur, parseFloat(frosted[1]!));
          const bg = rgba(ls.backgroundColor);
          if (bg[3] > 0) layers.push(bg);
        }
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
