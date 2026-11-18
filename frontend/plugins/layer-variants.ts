import postcss, { type AtRule, type ChildNode, type Container, type Root, type Rule } from "postcss";

/**
 * Restores Tailwind's "variants beat base utilities" ordering across the
 * per-component stylesheets (see ./component-css.ts).
 *
 * In one Tailwind build, `md:flex-row` is emitted after `flex-col`, so it
 * wins at md+. With a stylesheet per component, `flex-col` may live in a sheet
 * that loads *later* than the one holding `md:flex-row` and silently win
 * (same specificity, later in source order). Same for state variants, e.g.
 * `peer-checked:block` vs another sheet's `hidden`.
 *
 * Fix: every variant rule moves into a cascade layer declared after
 * `utilities`, in Tailwind's variant order:
 *
 *   utilities < v-variants (hover:, peer-checked:, [&>*]: …)
 *             < v-max-2xl < … < v-max-sm < v-sm < v-md < v-lg < v-xl < v-2xl
 *
 * Layer order is decided by first mention, so every sheet starts with the
 * full `@layer …;` statement; the order is then the same whichever loads first.
 */

export const BREAKPOINT_REM: Record<string, string> = {
  "40rem": "sm",
  "48rem": "md",
  "64rem": "lg",
  "80rem": "xl",
  "96rem": "2xl",
};
export const VARIANT_LAYERS = [
  "v-variants",
  "v-max-2xl",
  "v-max-xl",
  "v-max-lg",
  "v-max-md",
  "v-max-sm",
  "v-sm",
  "v-md",
  "v-lg",
  "v-xl",
  "v-2xl",
];
export const LAYER_ORDER = `@layer theme, base, components, utilities, ${VARIANT_LAYERS.join(", ")};`;

/** Which variant layer a rule belongs to, or null for base utilities / component CSS. */
function layerOf(rule: Rule): string | null {
  for (
    let p: Container | undefined = rule.parent as Container | undefined;
    p && p.type !== "root";
    p = p.parent as Container | undefined
  ) {
    if (p.type !== "atrule" || (p as AtRule).name !== "media") continue;
    const m = /\(width\s*(>=|<)\s*([\d.]+rem)\)/.exec((p as AtRule).params);
    const bp = m && BREAKPOINT_REM[m[2]];
    if (bp && /\\:/.test(rule.selector)) return m[1] === ">=" ? `v-${bp}` : `v-max-${bp}`;
  }
  // A class with an escaped colon is a Tailwind variant (`hover\:x`, `\[\&\>\*\]\:join-item`).
  return /\\:/.test(rule.selector) ? "v-variants" : null;
}

/** The at-rules between a rule and the top-level `@layer utilities` (outermost first). */
function wrappers(rule: Rule): AtRule[] {
  const chain: AtRule[] = [];
  for (
    let p = rule.parent as ChildNode | Root | undefined;
    p && p.type !== "root";
    p = p.parent as ChildNode | Root | undefined
  ) {
    if (p.type !== "atrule") continue;
    const at = p as AtRule;
    const topUtilities = at.name === "layer" && at.params.trim() === "utilities" && at.parent?.type === "root";
    if (!topUtilities) chain.unshift(at);
  }
  return chain;
}

export function layerVariantsCss(css: string): string {
  const root = postcss.parse(css);
  const targets = new Map<string, AtRule>();
  const moves: [Rule, string][] = [];
  root.walkRules((rule) => {
    const layer = layerOf(rule);
    if (layer) moves.push([rule, layer]);
  });
  if (!moves.length) return css;

  for (const [rule, layer] of moves) {
    let target = targets.get(layer);
    if (!target) {
      target = postcss.atRule({ name: "layer", params: layer });
      targets.set(layer, target);
    }
    let parent: Container = target;
    for (const w of wrappers(rule)) {
      const existing = parent.nodes?.find(
        (n): n is AtRule => n.type === "atrule" && n.name === w.name && n.params === w.params,
      );
      parent = existing ?? (parent.append(postcss.atRule({ name: w.name, params: w.params })).last as AtRule);
    }
    parent.append(rule.clone());
    rule.remove();
  }
  // Drop at-rules left empty by the moves.
  root.walkAtRules((at) => {
    if (at.nodes && at.nodes.length === 0) at.remove();
  });
  for (const layer of VARIANT_LAYERS) if (targets.has(layer)) root.append(targets.get(layer)!);
  root.prepend(postcss.parse(LAYER_ORDER));
  return root.toString();
}

/** Vite plugin: applies `layerVariantsCss` to the generated component stylesheets. Place after tailwindcss(). */
export default function layerVariants() {
  return {
    name: "shippy:layer-variants",
    transform(code: string, id: string) {
      const file = id.split("?")[0];
      if (!file.endsWith(".ui.css") || /^\s*(import|export)\b/.test(code)) return null;
      return { code: layerVariantsCss(code), map: null };
    },
  };
}
