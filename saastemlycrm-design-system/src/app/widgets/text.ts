import { formatNumber, type Cell, type ViewBlock, type ViewHeader } from "./schema.ts";

/**
 * Blocks as a few lines of plain text, for an agent (src/app/agent-tools.ts): what a screen shows,
 * in the block vocabulary's own terms, so it works for any project. Key figures read
 * "label: value", lists and tables give their first entries, explanatory (muted) text and
 * controls (actions, forms, choices, custom elements) are left out.
 */

export interface TextLimits {
  /** Table rows, list items and timeline entries per block. */
  rows?: number;
  /** Characters per line. */
  width?: number;
}

const cut = (s: string, width: number) => (s.length > width ? `${s.slice(0, width - 1)}…` : s);
const joined = (...parts: (string | undefined | null)[]) => parts.filter((p) => p && p.trim()).join(" · ");

/** A cell's words: its text, or its tags when it has no text. */
export function cellWords(c: Cell): string {
  if (c == null) return "";
  if (typeof c === "string" || typeof c === "number") return String(c);
  return joined(c.text, ...(c.tags ?? []).map((t) => t.label));
}

/** A screen's header: its heading and subtitle. */
export function headerText(h: ViewHeader | null | undefined): string[] {
  return h ? [h.heading, h.subtitle ?? ""].filter(Boolean) : [];
}

/** Blocks as lines of text (nested blocks flattened in reading order). */
export function blocksText(blocks: ViewBlock[], limits: TextLimits = {}): string[] {
  const rows = limits.rows ?? 5;
  const width = limits.width ?? 200;
  const out: string[] = [];
  const more = (n: number) => n > rows && out.push(`… ${n - rows} more`);
  const item = (s: string) => s && out.push(`- ${cut(s, width)}`);
  const walk = (b: ViewBlock) => {
    switch (b.type) {
      case "card":
        if (b.heading || b.tags?.length)
          out.push(
            cut(
              `${joined(b.heading, ...(b.tags ?? []).map((t) => t.label))}${b.count == null ? "" : ` (${b.count})`}:`,
              width,
            ),
          );
        b.blocks.forEach(walk);
        break;
      case "grid":
        b.blocks.forEach(walk);
        break;
      case "split":
        [...b.main, ...b.side].forEach(walk);
        break;
      case "stats":
        for (const s of b.items) item(`${s.label}: ${s.value}${s.note ? ` (${s.note})` : ""}`);
        break;
      case "text":
        if (!b.muted && b.text.trim()) out.push(cut(b.text.trim(), width));
        break;
      case "table":
        if (!b.rows.length && b.empty) out.push(b.empty);
        for (const r of b.rows.slice(0, rows))
          item(
            joined(...b.columns.flatMap((c) => [cellWords(r[c.key]), c.supporting ? cellWords(r[c.supporting]) : ""])),
          );
        more(b.rows.length);
        break;
      case "list":
        if (!b.items.length && b.empty) out.push(b.empty);
        for (const i of b.items.slice(0, rows))
          item(
            joined(i.overline, i.headline, i.supporting, cellWords(i.trailing), ...(i.tags ?? []).map((t) => t.label)),
          );
        more(b.items.length);
        break;
      case "details":
        for (const d of b.items) item(`${d.label}: ${joined(cellWords(d.value), d.note)}`);
        break;
      case "gauges":
        for (const g of b.items) item(`${g.label}: ${g.valueText ?? `${g.value} of ${g.max}`}`);
        break;
      case "steps": {
        const step = b.items[b.current];
        if (step) out.push(`Step ${b.current + 1} of ${b.items.length}: ${step.label}`);
        break;
      }
      case "chart": {
        const c = b.chart;
        const last = c.labels.length - 1;
        const values = c.series
          .filter((s) => s.values[last] !== undefined)
          .map((s) => `${s.name} ${formatNumber(s.values[last]!, c.format)}`);
        if (values.length)
          item(`${b.title ?? b.label ?? "Chart"}, ${c.labels[last] ?? "latest"}: ${values.join(", ")}`);
        break;
      }
      case "alert":
        out.push(cut(`${b.heading ? `${b.heading}: ` : ""}${b.text}`, width));
        break;
      case "empty":
        out.push(joined(b.heading, b.description));
        break;
      case "tags":
        if (b.items.length) out.push(b.items.map((t) => t.label).join(" · "));
        break;
      case "timeline":
        for (const t of b.items.slice(0, rows)) item(joined(t.time, t.heading, t.text));
        more(b.items.length);
        break;
      case "tiles":
        for (const t of b.items.slice(0, rows)) item(joined(t.overline, t.heading, t.text));
        more(b.items.length);
        break;
      case "gantt":
        for (const r of b.rows.slice(0, rows))
          item(`${r.label}: ${joined(b.periods[r.from], b.periods[r.to])}${r.tag ? ` (${r.tag})` : ""}`);
        more(b.rows.length);
        break;
      case "settings":
        for (const s of b.items)
          item(`${s.label}: ${typeof s.value === "boolean" ? (s.value ? "on" : "off") : s.value}`);
        break;
      case "message":
        out.push(cut(joined(...(b.meta ?? []), b.subject), width));
        break;
      default:
        // Controls and things drawn by elements (actions, forms, choices, documents, custom…).
        break;
    }
  };
  blocks.forEach(walk);
  return out;
}
