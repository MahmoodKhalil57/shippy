export const MAX_PROMINENT = 2;

const FILLED = /\bbtn-(?:primary|secondary|accent|neutral|info|success|warning|error)\b/;
const QUIET = /\bbtn-(?:ghost|soft|outline|dash|link)\b/;
const SURFACE = "dialog[open], [popover]:popover-open, main";

export interface ProminenceIssue {
  surface: Element;
  buttons: Element[];
}

const visible = (e: Element) => {
  const r = e.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
};

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
