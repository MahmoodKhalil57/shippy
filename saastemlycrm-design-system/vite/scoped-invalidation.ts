import postcss from "postcss";

/**
 * Keeps a class change from restyling everything under it.
 *
 * Chrome restyles only what a change can affect: a class added to an element re-checks the rules
 * that name that class. A selector that reads an ancestor's whole `class` attribute
 * (`[class~="not-prose"] *`) can't be narrowed that way, so any class change on any element marks
 * every element under it for a restyle. daisyUI's button writes one such rule into every sheet
 * that uses `btn`, for Tailwind Typography's `.prose`:
 *
 *   .prose :where(a.btn:not(.btn-link)):not(:where([class~="not-prose"], [class~="not-prose"] *))
 *
 * The app has no `.prose`, so the rule never matched, yet with it a class change on the main
 * panel's box restyled the dashboard under it (42ms), and one on the frame's root the whole app
 * (73ms): every column opening or closing paid that before its first frame. Without it, 0.4ms.
 * This pass drops every selector that matches on `not-prose`, in each stylesheet as it's compiled
 * (dev and build), after Tailwind.
 */
export function scopedInvalidationCss(css: string): string {
  if (!css.includes("not-prose")) return css;
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    if (!rule.selector.includes("not-prose")) return;
    const kept = rule.selectors.filter((s) => !s.includes("not-prose"));
    if (kept.length) rule.selectors = kept;
    else rule.remove();
  });
  return root.toString();
}

export default function scopedInvalidation() {
  return {
    name: "shippy:scoped-invalidation",
    transform(code: string, id: string) {
      const file = id.split("?")[0]!;
      if (!file.endsWith(".css") || /^\s*(import|export)\b/.test(code)) return null;
      const out = scopedInvalidationCss(code);
      return out === code ? null : { code: out, map: null };
    },
  };
}
