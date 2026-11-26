import { m } from "../i18n/index.ts";

export type LayoutIssueKind = "escapes" | "squeezed" | "cramped" | "page-scroll";

export interface LayoutIssue {
  kind: LayoutIssueKind;
  element: Element;
  detail: string;
}

export const MIN_TEXT_WIDTH = 40;
export const MIN_COLUMN_WIDTH = 112;
const CRAMPED_LINES = 3;
const SLACK = 1;

const SKIP = "ui-contrast-audit, script, style, template, [popover], dialog:not([open]), [hidden], [inert]";

const visible = (e: Element, s: CSSStyleDeclaration) => {
  if (s.display === "none" || s.visibility === "hidden") return false;
  const r = e.getBoundingClientRect();
  return r.height > 0 && (r.width > 0 || ownText(e).length > 0);
};

const clipsX = (s: CSSStyleDeclaration) => s.overflowX !== "visible";
const scrollsX = (s: CSSStyleDeclaration) => s.overflowX === "auto" || s.overflowX === "scroll";
const floats = (s: CSSStyleDeclaration) =>
  s.position === "fixed" || s.position === "absolute" || s.position === "sticky";

function isBox(s: CSSStyleDeclaration) {
  const bg = s.backgroundColor;
  const hasBg = bg !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(bg) && bg !== "rgba(0, 0, 0, 0)";
  const hasBorder =
    (parseFloat(s.borderLeftWidth) > 0 && s.borderLeftStyle !== "none") ||
    (parseFloat(s.borderRightWidth) > 0 && s.borderRightStyle !== "none");
  return hasBg || hasBorder || clipsX(s) || s.backdropFilter !== "none";
}

export function auditLayout(root: Element | null = document.querySelector("main") ?? document.body): LayoutIssue[] {
  if (!root) return [];
  const out: LayoutIssue[] = [];
  const rootStyle = getComputedStyle(root);
  const pageScrolls = rootStyle.overflowX === "visible" || scrollsX(rootStyle);
  if (pageScrolls && root.scrollWidth > root.clientWidth + SLACK)
    out.push({
      kind: "page-scroll",
      element: root,
      detail: m.layout_page_scroll({ px: root.scrollWidth - root.clientWidth }),
    });

  const moving = new Set<Element>();
  for (const a of document.getAnimations())
    if (a.playState === "running") moving.add((a.effect as KeyframeEffect).target!);
  const walk = (el: Element, box: { el: Element; rect: DOMRect } | null) => {
    for (const child of el.children) {
      if (child.matches(SKIP)) continue;
      const s = getComputedStyle(child);
      if (s.display === "contents") {
        walk(child, box);
        continue;
      }
      if (!visible(child, s)) {
        const shown = s.display !== "none" && s.visibility !== "hidden" && !clipsX(s);
        if (shown && child.getBoundingClientRect().height > 0) walk(child, box);
        continue;
      }
      if (floats(s) && s.position !== "sticky") continue;
      if (moving.has(child)) {
        walk(child, null);
        continue;
      }
      const r = child.getBoundingClientRect();
      if (box) {
        const past = Math.max(r.right - box.rect.right, box.rect.left - r.left);
        if (past > SLACK) {
          out.push({
            kind: "escapes",
            element: child,
            detail: m.layout_escapes({ px: Math.round(past), ...boxName(box.el) }),
          });
          continue;
        }
      }
      const truncates = s.textOverflow === "ellipsis" || s.webkitLineClamp !== "none";
      const cut = child.scrollWidth > child.clientWidth + SLACK || child.scrollHeight > child.clientHeight + SLACK;
      if (truncates && cut && child.textContent!.trim().length > 3 && r.width < MIN_TEXT_WIDTH)
        out.push({ kind: "squeezed", element: child, detail: m.layout_squeezed({ px: Math.round(r.width) }) });
      if (columnWidth(child, s, r) < MIN_COLUMN_WIDTH && ownText(child).length > 20) {
        const lineHeight = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.4;
        const lines = Math.round(r.height / lineHeight);
        if (lines >= CRAMPED_LINES && s.whiteSpace !== "nowrap")
          out.push({ kind: "cramped", element: child, detail: m.layout_cramped({ lines, px: Math.round(r.width) }) });
      }
      if (scrollsX(s)) walk(child, null);
      else walk(child, isBox(s) ? { el: child, rect: r } : box);
    }
  };
  walk(root, { el: root, rect: root.getBoundingClientRect() });
  return out;
}

function columnWidth(e: Element, s: CSSStyleDeclaration, r: DOMRect) {
  if (s.display !== "inline") return r.width;
  let block = e.parentElement;
  while (block && ["inline", "contents"].includes(getComputedStyle(block).display)) block = block.parentElement;
  if (!block) return r.width;
  const b = getComputedStyle(block);
  return block.clientWidth - parseFloat(b.paddingLeft) - parseFloat(b.paddingRight);
}

function ownText(e: Element) {
  let t = "";
  for (const n of e.childNodes) if (n.nodeType === Node.TEXT_NODE) t += n.textContent!;
  return t.trim();
}

function boxName(e: Element): { box: string; name: string } {
  const tag = e.tagName.toLowerCase();
  if (e.closest("[data-list-row]") === e) return { box: "list_row", name: "" };
  if (e.classList.contains("card") || e.closest(".card") === e) return { box: "card", name: "" };
  if (e.matches("main")) return { box: "page", name: "" };
  if (e.matches("dialog")) return { box: "dialog", name: "" };
  return tag.startsWith("ui-") ? { box: "component", name: tag } : { box: "box", name: "" };
}

function floatingLayers(): Element[] {
  const open = [...document.querySelectorAll(":popover-open, dialog[open], [role=dialog]")].filter((e) => {
    if (e.closest("ui-contrast-audit")) return false;
    const s = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
  });
  return open.filter((e) => !open.some((o) => o !== e && o.contains(e)));
}

export function auditLayers(): LayoutIssue[] {
  return [auditLayout(), ...floatingLayers().map((layer) => auditLayout(layer))].flat();
}
