import { html, nothing } from "lit";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import { defineBlock } from "../registry.ts";
import type { Tone } from "../schema.ts";

/**
 * `gantt`: rows over a run of periods (weeks, months), each row spanning `from` to `to`
 * (indexes into `periods`, inclusive). The first period of a row shows its `tag`, the rest a dot
 * in the row's tone.
 */

type GanttRow = { label: string; supporting?: string; from: number; to: number; tone?: Tone; tag?: string };

defineBlock("gantt", (b) => {
  const columns: TableColumn<GanttRow & Record<string, unknown>>[] = [
    {
      key: "label",
      label: b.label,
      render: (r) => html`<ui-text variant="title-sm">${r.label}</ui-text>`,
      supporting: (r) => r.supporting ?? "",
    },
    ...b.periods.map((p, i): TableColumn<GanttRow & Record<string, unknown>> => ({
      key: `p${i}`,
      label: p,
      render: (r) =>
        i < r.from || i > r.to
          ? nothing
          : i === r.from && r.tag
            ? html`<ui-tag .tone=${r.tone ?? "neutral"}>${r.tag}</ui-tag>`
            : html`<ui-badge dot .tone=${r.tone ?? "neutral"} .label=${`${r.label}, ${p}`}></ui-badge>`,
    })),
  ];
  return html`<ui-table
    size="xs"
    nowrap
    .columns=${columns}
    .rows=${b.rows as (GanttRow & Record<string, unknown>)[]}
  ></ui-table>`;
});
