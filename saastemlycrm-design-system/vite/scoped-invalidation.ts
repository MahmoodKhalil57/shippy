import postcss from "postcss";

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
