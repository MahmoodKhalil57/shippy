import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import postcss, { type AtRule, type ChildNode, type Container, type Root, type Rule } from "postcss";

export const DAISY_BASES: Set<string> = (() => {
  try {
    const dir = path.join(path.dirname(createRequire(import.meta.url).resolve("daisyui/package.json")), "components");
    const bases = new Set<string>();
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".css"))) {
      const classes = [
        ...readFileSync(path.join(dir, file), "utf8").matchAll(/(?:^|[{}\s,(])\.([a-z][a-z0-9-]*)(?=[\s{,):])/g),
      ].map((m) => m[1]!);
      const base = classes.sort((a, b) => a.length - b.length)[0];
      if (base) bases.add(base);
    }
    return bases;
  } catch {
    return new Set();
  }
})();

const isDaisyBase = (selector: string) => {
  const m = /^(?::where\()?\.([a-z][a-z0-9-]*)\)?$/.exec(selector.trim());
  return !!m && DAISY_BASES.has(m[1]!);
};

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
  return /\\:/.test(rule.selector) ? "v-variants" : null;
}

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

function insideUtilities(rule: Rule): boolean {
  for (
    let p = rule.parent as ChildNode | Root | undefined;
    p && p.type !== "root";
    p = p.parent as ChildNode | Root | undefined
  ) {
    if (p.type === "rule") return false;
    if (
      p.type === "atrule" &&
      (p as AtRule).name === "layer" &&
      (p as AtRule).params.trim() === "utilities" &&
      p.parent?.type === "root"
    )
      return true;
  }
  return false;
}

export function layerVariantsCss(css: string): string {
  const root = postcss.parse(css);
  const targets = new Map<string, AtRule>();
  const moves: [Rule, string][] = [];
  root.walkRules((rule) => {
    const layer = layerOf(rule) ?? (isDaisyBase(rule.selector) && insideUtilities(rule) ? "components" : null);
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
  root.walkAtRules((at) => {
    if (at.nodes && at.nodes.length === 0) at.remove();
  });
  for (const layer of ["components", ...VARIANT_LAYERS]) if (targets.has(layer)) root.append(targets.get(layer)!);
  root.prepend(postcss.parse(LAYER_ORDER));
  return root.toString();
}

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
