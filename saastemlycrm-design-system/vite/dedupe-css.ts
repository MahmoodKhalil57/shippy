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

/** The property names a rule body sets (`a:1;b:url(x;y)` → a, b), ignoring nesting in brackets. */
function propertiesOf(body: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i <= body.length; i++) {
    const c = body[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if ((c === ";" || i === body.length) && depth === 0) {
      const decl = body.slice(start, i);
      const colon = decl.indexOf(":");
      if (colon > 0) out.push(decl.slice(0, colon).trim());
      start = i + 1;
    }
  }
  return out;
}

/**
 * A fallback that lands after its own enhancement overrides it. Within one block, once an
 * `@supports` enhancement has set properties for a selector, a later plain rule for the same
 * selector that sets only those properties is that fallback, out of order: drop it. (The
 * minifier can merge one sheet's enhancement into a combined selector, so keeping last copies
 * alone doesn't keep every pair in order.)
 */
function dropLateFallbacks(nodes: Node[]): Node[] {
  const enhanced = new Map<string, Set<string>>();
  const out: Node[] = [];
  for (const n of nodes) {
    if (n.children) {
      if (/^@supports\b/.test(n.prelude.trim()))
        for (const c of n.children)
          if (c.body !== undefined)
            for (const sel of c.prelude.split(",")) {
              const set = enhanced.get(sel.trim()) ?? new Set<string>();
              for (const p of propertiesOf(c.body)) set.add(p);
              enhanced.set(sel.trim(), set);
            }
      out.push({ ...n, children: dropLateFallbacks(n.children) });
      continue;
    }
    if (n.body !== undefined) {
      const set = enhanced.get(n.prelude.trim());
      const props = propertiesOf(n.body);
      if (set && props.length && props.every((p) => set.has(p))) continue;
    }
    out.push(n);
  }
  return out;
}

export function dedupeCssRules(css: string): string {
  return stringify(dropLateFallbacks(dedupe(parse(css), "", new Set())));
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
      // Only a file's content changes, never its name: Vite names it from its inputs, and this
      // pass is deterministic, so a name maps to one output for as long as this file is unchanged.
      for (const asset of Object.values(bundle)) {
        if (asset.type !== "asset" || !asset.fileName.endsWith(".css")) continue;
        const src = typeof asset.source === "string" ? asset.source : new TextDecoder().decode(asset.source);
        asset.source = dedupeCssRules(src);
      }
    },
  };
}
