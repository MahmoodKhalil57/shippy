interface Node {
  prelude: string;
  children?: Node[];
  body?: string;
}

function parse(css: string, start = 0, end = css.length): Node[] {
  const nodes: Node[] = [];
  let i = start;
  while (i < end) {
    const s = i;
    let quote = "";
    while (i < end) {
      const c = css[i];
      if (c === "\\") i++;
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

function dedupe(nodes: Node[], path: string, seen: Set<string>): Node[] {
  const out: Node[] = [];
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]!;
    if (n.children) {
      const children = dedupe(n.children, `${path}\u0000${n.prelude}`, seen);
      if (children.length || /@layer\b/.test(n.prelude)) out.push({ ...n, children });
      continue;
    }
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
      for (const asset of Object.values(bundle)) {
        if (asset.type !== "asset" || !asset.fileName.endsWith(".css")) continue;
        const src = typeof asset.source === "string" ? asset.source : new TextDecoder().decode(asset.source);
        asset.source = dedupeCssRules(src);
      }
    },
  };
}
