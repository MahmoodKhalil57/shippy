/**
 * Build-only plugin: removes duplicate CSS rules from emitted stylesheets.
 *
 * Every component compiles its own Tailwind/daisyUI CSS (see
 * src/components/<group>/<name>.css), so only imported components ship styles.
 * The cost is that two components using the same class (e.g. `btn`) each emit
 * that rule. This pass keeps the LAST copy of every rule and drops earlier
 * identical copies that sit under the same at-rule path
 * (`@layer` / `@media` / `@supports` ...).
 *
 * Why the last: Tailwind writes some utilities as a pair — a fallback, then an
 * `@supports` enhancement (`bg-primary/20`: solid primary, then the 20% color-mix).
 * The minifier may merge one sheet's fallback into a combined selector, so that
 * copy no longer looks like a duplicate. Keeping first copies then left a later
 * sheet's lone fallback *after* the surviving enhancement, overriding it (solid
 * highlights in production). Keeping last copies keeps each sheet's pair in order.
 */

interface Node {
  /** Text before `{`, or the whole statement for `@import ...;`-style rules. */
  prelude: string;
  /** Children for at-rule blocks; `undefined` for leaf rules and statements. */
  children?: Node[];
  /** Raw text of a leaf rule body (between the braces). */
  body?: string;
}

/** Parse a minified stylesheet into at-rule blocks and opaque leaf rules. */
function parse(css: string, start = 0, end = css.length): Node[] {
  const nodes: Node[] = [];
  let i = start;
  while (i < end) {
    const s = i;
    let quote = "";
    // Find the next `{` or `;` at this level, skipping strings and comments.
    while (i < end) {
      const c = css[i];
      if (c === "\\") i++; // escaped char, inside or outside a string (e.g. `.a\'b`)
      else if (quote) {
        if (c === quote) quote = "";
      } else if (c === '"' || c === "'") quote = c;
      else if (c === "/" && css[i + 1] === "*") {
        const close = css.indexOf("*/", i + 2);
        i = close === -1 ? end : close + 1;
      } else if (c === "{" || c === ";") break;
      i++;
    }
    const prelude = css.slice(s, i).trim();
    if (i >= end) {
      if (prelude) nodes.push({ prelude });
      break;
    }
    if (css[i] === ";") {
      if (prelude) nodes.push({ prelude: prelude + ";" });
      i++;
      continue;
    }
    // Matching close brace.
    const open = i;
    let depth = 0;
    quote = "";
    for (; i < end; i++) {
      const c = css[i];
      if (c === "\\") i++;
      else if (quote) {
        if (c === quote) quote = "";
      } else if (c === '"' || c === "'") quote = c;
      else if (c === "{") depth++;
      else if (c === "}" && --depth === 0) break;
    }
    const bare = prelude.replace(/^(\/\*[\s\S]*?\*\/\s*)+/, "");
    const isContainer = /^@(layer|media|supports|container|scope|starting-style)\b/.test(bare);
    nodes.push(
      isContainer ? { prelude, children: parse(css, open + 1, i) } : { prelude, body: css.slice(open + 1, i) },
    );
    i++;
  }
  return nodes;
}

/** Walks the tree from the end, so the last copy of a rule is the one kept. */
function dedupe(nodes: Node[], path: string, seen: Set<string>): Node[] {
  const out: Node[] = [];
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]!;
    if (n.children) {
      const children = dedupe(n.children, `${path}\u0000${n.prelude}`, seen);
      // Keep empty `@layer` blocks: they still declare layer order.
      if (children.length || /@layer\b/.test(n.prelude)) out.push({ ...n, children });
      continue;
    }
    // Comments and charset/import statements pass through untouched.
    const key = `${path}\u0000${n.prelude}{${n.body ?? ""}}`;
    if (n.body !== undefined && seen.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out.reverse();
}

function stringify(nodes: Node[]): string {
  return nodes
    .map((n) =>
      n.children
        ? `${n.prelude}{${stringify(n.children)}}`
        : n.body !== undefined
          ? `${n.prelude}{${n.body}}`
          : n.prelude,
    )
    .join("");
}

export function dedupeCssRules(css: string): string {
  return stringify(dedupe(parse(css), "", new Set()));
}

export default function dedupeCss() {
  return {
    name: "shippy:dedupe-css",
    apply: "build" as const,
    enforce: "post" as const,
    generateBundle(
      _: unknown,
      bundle: Record<string, { type: string; fileName: string; source?: string | Uint8Array }>,
    ) {
      for (const asset of Object.values(bundle)) {
        if (asset.type !== "asset" || !asset.fileName.endsWith(".css")) continue;
        const src = typeof asset.source === "string" ? asset.source : new TextDecoder().decode(asset.source);
        asset.source = dedupeCssRules(src);
      }
    },
  };
}
