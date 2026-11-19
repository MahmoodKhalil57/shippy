/**
 * Prominence audit: a screen has one main action, two at most (Apple HIG, Buttons: "one or two
 * prominent buttons per view"; M3's filled button is "for the most important, final action").
 * Every other action is tonal (`variant="soft"`), outlined or plain, so the eye lands on the right
 * one. Run by `<ui-contrast-audit>` (`?audit`, or "Check colour contrast" in the command palette)
 * next to the contrast check.
 *
 * Counted per surface: the page (`main`) and each open dialog, sheet or popover count apart, so a
 * dialog's own Save doesn't compete with the page's. A button counts when it's filled (a daisyUI
 * colour, not ghost / soft / outline / dash / link) and visible.
 */

export const MAX_PROMINENT = 2;

const FILLED = /\bbtn-(?:primary|secondary|accent|neutral|info|success|warning|error)\b/;
const QUIET = /\bbtn-(?:ghost|soft|outline|dash|link)\b/;
const SURFACE = "dialog[open], [popover]:popover-open, main";

export interface ProminenceIssue {
  /** The page or the dialog, sheet or popover the buttons are on. */
  surface: Element;
  /** Its filled buttons, in document order. */
  buttons: Element[];
}

const visible = (e: Element) => {
  const r = e.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
};

/** Surfaces with more filled buttons than `max`. */
export function auditProminence(root: Element = document.body, max = MAX_PROMINENT): ProminenceIssue[] {
  const bySurface = new Map<Element, Element[]>();
  for (const b of root.querySelectorAll(".btn")) {
    const cls = b.getAttribute("class") ?? "";
    if (!FILLED.test(cls) || QUIET.test(cls) || !visible(b)) continue;
    const surface = b.closest(SURFACE);
    if (!surface) continue;
    bySurface.set(surface, [...(bySurface.get(surface) ?? []), b]);
  }
  return [...bySurface]
    .filter(([, buttons]) => buttons.length > max)
    .map(([surface, buttons]) => ({ surface, buttons }));
}
