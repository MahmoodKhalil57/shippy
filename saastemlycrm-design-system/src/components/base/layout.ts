import { m } from "../../i18n/index.ts";
/**
 * Layout audit: what breaks a fluid layout at the current width, on the page and in every open
 * floating layer (`auditLayers`: menus, dialogs, the helper's panel). Apple's HIG (Layout) asks to test
 * "the largest and smallest layouts … to check for clipping and other layout issues"; M3 (Lists)
 * says the content slot "must be the largest-width slot". Run by `<ui-contrast-audit>` (`?audit`,
 * or "Check contrast and layout" in the command palette) next to the contrast check; resize the
 * window (or use a phone width) and run it again.
 *
 * - `escapes`: an element sticks out of its box (a card, a list row, a dialog: anything drawn
 *   with a background, a border or clipping) instead of wrapping or shrinking. Content inside a
 *   horizontal scroller (a table) may be wider: the scroller is its box.
 * - `squeezed`: text that truncates or clamps has been squeezed to almost nothing, so something
 *   beside it doesn't shrink (a trailing slot full of tags).
 * - `cramped`: text wrapped into a column too narrow to read (three lines or more in under 7rem):
 *   nothing overflows, but a word or two per line, broken mid-word, is a layout that didn't adapt.
 * - `page-scroll`: the page itself scrolls sideways.
 */

export type LayoutIssueKind = "escapes" | "squeezed" | "cramped" | "page-scroll";

export interface LayoutIssue {
  kind: LayoutIssueKind;
  element: Element;
  /** What's wrong, in a few words ("12px past its card"). */
  detail: string;
}

/** Narrower than this, truncated text says almost nothing (about four characters). */
export const MIN_TEXT_WIDTH = 40;
/** Narrower than this (7rem), wrapped text reads a word or two per line. */
export const MIN_COLUMN_WIDTH = 112;
/** Lines of text in a column that narrow before it's cramped. */
const CRAMPED_LINES = 3;
/** Rounding slack, in pixels. */
const SLACK = 1;

/** Skipped: the audit's own UI, floating layers (they're placed on purpose), hidden things. */
const SKIP = "ui-contrast-audit, script, style, template, [popover], dialog:not([open]), [hidden], [inert]";

const visible = (e: Element, s: CSSStyleDeclaration) => {
  if (s.display === "none" || s.visibility === "hidden" || s.display === "contents") return false;
  const r = e.getBoundingClientRect();
  // Text with height but no width isn't hidden, it's collapsed (a size container in a content-sized
  // parent): the worst case of `cramped`, so it's measured like anything else.
  return r.height > 0 && (r.width > 0 || ownText(e).length > 0);
};

const clipsX = (s: CSSStyleDeclaration) => s.overflowX !== "visible";
const scrollsX = (s: CSSStyleDeclaration) => s.overflowX === "auto" || s.overflowX === "scroll";
const floats = (s: CSSStyleDeclaration) =>
  s.position === "fixed" || s.position === "absolute" || s.position === "sticky";

/** Drawn as a box: a background, a border or clipping (where escaping shows). */
function isBox(s: CSSStyleDeclaration) {
  const bg = s.backgroundColor;
  const hasBg = bg !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(bg) && bg !== "rgba(0, 0, 0, 0)";
  const hasBorder =
    (parseFloat(s.borderLeftWidth) > 0 && s.borderLeftStyle !== "none") ||
    (parseFloat(s.borderRightWidth) > 0 && s.borderRightStyle !== "none");
  return hasBg || hasBorder || clipsX(s) || s.backdropFilter !== "none";
}

/** The layout problems on screen inside `root` (default: the page's `main`). */
export function auditLayout(root: Element | null = document.querySelector("main") ?? document.body): LayoutIssue[] {
  if (!root) return [];
  const out: LayoutIssue[] = [];
  const rootStyle = getComputedStyle(root);
  // The page scrolls sideways only when it may: a clipping page hides it (that's `escapes`).
  const pageScrolls = rootStyle.overflowX === "visible" || scrollsX(rootStyle);
  if (pageScrolls && root.scrollWidth > root.clientWidth + SLACK)
    out.push({
      kind: "page-scroll",
      element: root,
      detail: m.layout_page_scroll({ px: root.scrollWidth - root.clientWidth }),
    });

  /** Elements already reported: their descendants escape with them, so say it once. */
  const reported = new Set<Element>();
  const walk = (el: Element, box: { el: Element; rect: DOMRect } | null) => {
    for (const child of el.children) {
      if (child.matches(SKIP)) continue;
      const s = getComputedStyle(child);
      if (s.display === "contents") {
        walk(child, box);
        continue;
      }
      if (!visible(child, s)) {
        // A box collapsed to no width that doesn't clip still shows what's in it (a size container
        // in a content-sized parent): look inside. One that clips (a closed column) hides it.
        const shown = s.display !== "none" && s.visibility !== "hidden" && !clipsX(s);
        if (shown && child.getBoundingClientRect().height > 0) walk(child, box);
        continue;
      }
      if (floats(s) && s.position !== "sticky") continue; // placed on purpose (menus, badges, tooltips)
      // Mid-animation (a page sliding in): where it is now isn't where it will be.
      if (child.getAnimations().some((a) => a.playState === "running")) {
        walk(child, null);
        continue;
      }
      const r = child.getBoundingClientRect();
      if (box && !reported.has(box.el)) {
        const past = Math.max(r.right - box.rect.right, box.rect.left - r.left);
        if (past > SLACK) {
          out.push({
            kind: "escapes",
            element: child,
            detail: m.layout_escapes({ px: Math.round(past), ...boxName(box.el) }),
          });
          reported.add(child);
          continue;
        }
      }
      // Text that is actually cut (its full text is wider, or taller, than its box) and narrow.
      const truncates = s.textOverflow === "ellipsis" || s.webkitLineClamp !== "none";
      const cut = child.scrollWidth > child.clientWidth + SLACK || child.scrollHeight > child.clientHeight + SLACK;
      if (truncates && cut && (child.textContent ?? "").trim().length > 3 && r.width < MIN_TEXT_WIDTH)
        out.push({ kind: "squeezed", element: child, detail: m.layout_squeezed({ px: Math.round(r.width) }) });
      // Text wrapped into a sliver: its own text (not its children's) on many lines, narrow.
      // An inline element is only as wide as its longest line: measure the block it flows in.
      if (columnWidth(child, s, r) < MIN_COLUMN_WIDTH && ownText(child).length > 20) {
        const lineHeight = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.4;
        const lines = Math.round(r.height / lineHeight);
        if (lines >= CRAMPED_LINES && s.whiteSpace !== "nowrap")
          out.push({ kind: "cramped", element: child, detail: m.layout_cramped({ lines, px: Math.round(r.width) }) });
      }
      // Inside a horizontal scroller, wider content is meant to scroll: its children start afresh.
      if (scrollsX(s)) walk(child, null);
      else walk(child, isBox(s) ? { el: child, rect: r } : box);
    }
  };
  walk(root, { el: root, rect: root.getBoundingClientRect() });
  return out;
}

/** The width text in `e` can use: its own, or for inline text, the content box of the block it flows in. */
function columnWidth(e: Element, s: CSSStyleDeclaration, r: DOMRect) {
  if (s.display !== "inline") return r.width;
  let block = e.parentElement;
  // Component hosts are `display: contents` (no box): skip them as well as inline boxes.
  while (block && ["inline", "contents"].includes(getComputedStyle(block).display)) block = block.parentElement;
  if (!block) return r.width;
  const b = getComputedStyle(block);
  return block.clientWidth - parseFloat(b.paddingLeft) - parseFloat(b.paddingRight);
}

/** The text directly inside an element (not in its child elements). */
function ownText(e: Element) {
  let t = "";
  for (const n of e.childNodes) if (n.nodeType === Node.TEXT_NODE) t += n.textContent ?? "";
  return t.trim();
}

/** What a box is, for the audit's messages (`layout_escapes`): a kind, or a component's tag name. */
function boxName(e: Element): { box: string; name: string } {
  const tag = e.tagName.toLowerCase();
  if (e.closest("[data-list-row]") === e) return { box: "list_row", name: "" };
  if (e.classList.contains("card") || e.closest(".card") === e) return { box: "card", name: "" };
  if (e.matches("main")) return { box: "page", name: "" };
  if (e.matches("dialog")) return { box: "dialog", name: "" };
  return tag.startsWith("ui-") ? { box: "component", name: tag } : { box: "box", name: "" };
}

/** Open floating layers: popovers, dialogs and dialog panels (the helper's), each audited on its own. */
function floatingLayers(): Element[] {
  const open = [...document.querySelectorAll(":popover-open, dialog[open], [role=dialog]")].filter((e) => {
    if (e.closest("ui-contrast-audit")) return false;
    const s = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
  });
  // A layer inside another is audited with it.
  return open.filter((e) => !open.some((o) => o !== e && o.contains(e)));
}

/**
 * The page (`main`) and every open floating layer: a menu, a sheet, a dialog, the helper's panel.
 * They sit outside `main`, so `auditLayout()` alone never sees them.
 */
export function auditLayers(): LayoutIssue[] {
  return [auditLayout(), ...floatingLayers().map((layer) => auditLayout(layer))].flat();
}
