import type { DocumentSpec } from "../../components/base/document-spec.ts";
import type { IconName } from "../../components/primitives/media/icon-names.ts";
import { intl, m } from "../../i18n/index.ts";

export type Tone = "neutral" | "primary" | "info" | "success" | "warning" | "error";

export interface NumberFormat {
  unit?: "count" | "pct" | "days" | "minutes" | "hours" | "money";
  currency?: string;
  compact?: boolean;
  decimals?: number;
}

export function formatNumber(v: number, f: NumberFormat = {}): string {
  const d = f.decimals;
  const fixed = (n: number, places: number) =>
    intl.number({ minimumFractionDigits: places, maximumFractionDigits: places, useGrouping: false }).format(n);
  switch (f.unit) {
    case "pct":
      return m.number_pct({ value: fixed(v, d ?? 1) });
    case "days":
      return m.number_days({ value: fixed(v, d ?? 1) });
    case "hours":
      return m.number_hours({ value: fixed(v, d ?? 1) });
    case "minutes":
      return m.number_minutes({ value: fixed(Math.round(v), 0) });
    case "money": {
      if (f.compact) {
        const amount = fixed(v / 1000, d ?? (Math.abs(v) < 10_000 ? 1 : 0));
        return f.currency ? m.number_money_compact({ currency: f.currency, amount }) : m.number_thousands({ amount });
      }
      const amount = intl.number({ minimumFractionDigits: d ?? 0, maximumFractionDigits: d ?? 0 }).format(v);
      return f.currency ? m.number_money({ currency: f.currency, amount }) : amount;
    }
    default:
      return d === undefined ? intl.number({ maximumFractionDigits: 0 }).format(Math.round(v)) : fixed(v, d);
  }
}

export interface Tag {
  label: string;
  tone?: Tone;
  icon?: IconName;
}

export type Cell = string | number | null | undefined | TextCell | TagCell | PersonCell | SwitchCell;

export interface TextCell {
  text: string;
  tone?: Tone;
  href?: string;
  dot?: Tone;
  mono?: boolean;
  strong?: boolean;
  gauge?: { value: number; max: number; tone?: Tone; label?: string };
  actions?: Action[];
  tags?: Tag[];
  marks?: { text: string; tone?: Tone }[];
  tag?: never;
  switch?: never;
  person?: never;
}

export interface TagCell {
  text: string;
  tag: true;
  tone?: Tone;
  hue?: number;
  switch?: never;
  person?: never;
}

export interface PersonCell {
  text: string;
  person: true;
  href?: string;
  tag?: never;
  switch?: never;
  tone?: never;
}

export interface SwitchCell {
  text: string;
  switch: { value: boolean; call?: Action["call"]; done?: string };
  tag?: never;
  tone?: never;
  person?: never;
}

export interface PromptField {
  type: string;
  name: string;
  label?: string;
  required?: boolean;
  defaultValue?: unknown;
  options?: (string | { label: string; value: string })[];
  admin?: { description?: string; placeholder?: string; rows?: number; width?: string };
  [key: string]: unknown;
}

export type Action = ActionBase & Emphasis & Reversal;
export type Emphasis = { main?: false; tone?: "error" } | { main?: boolean; tone?: never };

export type UndoCall = NonNullable<ActionBase["call"]> & { done?: string };

export type Reversal = { confirm?: ActionBase["confirm"]; undo?: never } | { confirm?: never; undo?: UndoCall };

interface ActionBase {
  label: string;
  icon?: IconName;
  main?: boolean;
  tone?: "error";
  href?: string;
  call?: { method?: "POST" | "PATCH" | "DELETE"; path: string; body?: Record<string, unknown> };
  confirm?: { heading: string; text?: string; label: string; tone?: "primary" | "error" };
  prefill?: { when: string; into: string; from?: string; call: { path: string; body?: Record<string, unknown> } };
  fields?: PromptField[];
  prompt?: string;
  done?: string;
  reply?: boolean;
  undo?: UndoCall;
  assist?: { field: string; tools: string };
  extract?: {
    label: string;
    what: string;
    source?: "paste" | "file";
    placeholder?: string;
    fields: { id: string; label: string; hint?: string; type?: "string" | "number" }[];
    into: Record<string, { field: string; append?: boolean }>;
  };
  print?: boolean;
  disabled?: boolean;
  reason?: string;
}

export interface Stat {
  label: string;
  value: string;
  note?: string;
  tone?: "success" | "warning" | "error";
  href?: string;
  trend?: { labels: string[]; values: number[]; format?: NumberFormat };
  delta?: { text: string; dir: "up" | "down" | "flat"; good?: boolean };
  main?: boolean;
  share?: { value: number; text?: string };
}

export interface Column {
  key: string;
  label: string;
  align?: "start" | "end";
  supporting?: string;
}

export type Row = Record<string, Cell> & { href?: string };

export interface ListItem {
  headline: string;
  supporting?: string;
  overline?: string;
  lead?: string;
  dot?: Tone;
  icon?: IconName;
  href?: string;
  value?: Cell;
  trailing?: Cell;
  tags?: Tag[];
  actions?: Action[];
  selected?: boolean;
  select?: { param: string; value: string };
}

export interface ChartSpec {
  kind: "bars" | "line";
  labels: string[];
  series: { name: string; values: number[] }[];
  format?: NumberFormat;
  target?: number;
  targetLabel?: string;
  highlightLast?: boolean;
  stacked?: boolean;
  ranges?: { label: string; points: number }[];
  range?: number;
}

export interface Entry {
  id?: string;
  heading: string;
  href?: string;
  meta?: string[];
  status?: Tag;
  tags?: Tag[];
  summary?: { context: string; text: string };
  text?: string;
  facts?: { label: string; value: Cell; note?: string }[];
  people?: { name: string; state?: "done" | "declined" | "waiting"; note?: string }[];
  notes?: string[];
  notice?: { tone?: "info" | "success" | "warning" | "error"; text: string };
  actions?: Action[];
  attach?: Omit<ViewBlocks["attach"], "type">;
}

export interface CardBlock {
  type: "card";
  heading?: string;
  subhead?: string;
  count?: number;
  countTone?: Tone;
  tags?: Tag[];
  actions?: Action[];
  blocks: ViewBlock[];
  open?: boolean;
}

export interface ViewBlocks {
  card: CardBlock;
  entries: { type: "entries"; items: Entry[]; empty?: string };
  grid: { type: "grid"; blocks: ViewBlock[] };
  split: { type: "split"; main: ViewBlock[]; side: ViewBlock[] };
  stats: {
    type: "stats";
    items: Stat[];
    size?: "sm" | "md" | "lg";
    mini?: boolean;
  };
  text: {
    type: "text";
    text: string;
    muted?: boolean;
    speak?: boolean | string;
  };
  heading: { type: "heading"; text: string };
  table: {
    type: "table";
    columns: Column[];
    rows: Row[];
    empty?: string;
    size?: "sm" | "md";
    totals?: boolean;
  };
  list: { type: "list"; items: ListItem[]; empty?: string; variant?: "divided" | "separated" };
  details: {
    type: "details";
    items: { label: string; value: Cell; note?: string; noteTone?: Tone }[];
    layout?: "stacked" | "inline";
  };
  gauges: {
    type: "gauges";
    items: {
      label: string;
      value: number;
      max: number;
      tone?: Tone;
      valueText?: string;
      href?: string;
      a11y?: string;
      note?: string;
    }[];
  };
  steps: {
    type: "steps";
    items: { label: string; supporting?: string; state?: "done" | "skipped" }[];
    current: number;
    tone?: "primary" | "warning" | "error";
    direction?: "horizontal" | "vertical";
  };
  chart: {
    type: "chart";
    title?: string;
    subhead?: string;
    chart: ChartSpec;
    label?: string;
  };
  ring: {
    type: "ring";
    parts: { label: string; value: number; valueText?: string; href?: string }[];
    max?: number;
    total?: string;
    center?: string;
    label?: string;
  };
  funnel: {
    type: "funnel";
    stages: { label: string; value: number; valueText?: string; href?: string }[];
    step?: string;
    label?: string;
  };
  heatmap: {
    type: "heatmap";
    days: { label: string; value: number; valueText?: string }[];
    summary?: string;
    label?: string;
  };
  bullet: {
    type: "bullet";
    items: {
      label: string;
      value: number;
      max: number;
      min?: number;
      target?: number;
      bands?: number[];
      valueText?: string;
      targetText?: string;
      lowerIsBetter?: boolean;
    }[];
  };
  dial: {
    type: "dial";
    value: number;
    min?: number;
    max: number;
    valueText?: string;
    caption?: string;
    label?: string;
    zones?: { to: number; tone: "success" | "warning" | "error" }[];
  };
  waffle: {
    type: "waffle";
    value?: number;
    max?: number;
    valueText?: string;
    caption?: string;
    label?: string;
    parts?: { label: string; value: number; href?: string }[];
  };
  share: {
    type: "share";
    parts: { label: string; value: number; valueText?: string; href?: string }[];
    total?: string;
    label?: string;
  };
  treemap: {
    type: "treemap";
    items: { label: string; value: number; valueText?: string; href?: string }[];
    total?: string;
    label?: string;
  };
  waterfall: {
    type: "waterfall";
    steps: { label: string; value: number; valueText?: string; total?: boolean }[];
    format?: NumberFormat;
    fit?: boolean;
    label?: string;
  };
  quadrant: {
    type: "quadrant";
    points: { label: string; x: number; y: number; valueText?: string; href?: string; size?: number }[];
    xLabel: string;
    yLabel: string;
    xMid?: number;
    yMid?: number;
    xDomain?: [number, number];
    yDomain?: [number, number];
    quadrants?: [string, string, string, string];
    invertY?: boolean;
    label?: string;
  };
  countdown: {
    type: "countdown";
    items: { label: string; due: string; from?: string; supporting?: string; href?: string }[];
    now?: string;
    label?: string;
  };
  month: {
    type: "month";
    month: string;
    today?: string;
    events: { date: string; label: string; href?: string; tone?: "neutral" | "warning" | "error" | "success" }[];
    weekStart?: 0 | 1;
    label?: string;
  };
  whatif: {
    type: "whatif";
    inputs: {
      key: string;
      label: string;
      min: number;
      max: number;
      step: number;
      value: number;
      format?: NumberFormat;
    }[];
    compute: (values: Record<string, number>) => {
      label: string;
      value: string;
      tone?: "success" | "warning" | "error";
      note?: string;
    }[];
    label?: string;
  };
  alert: {
    type: "alert";
    tone?: "info" | "success" | "warning" | "error";
    heading?: string;
    text: string;
    actions?: Action[];
  };
  empty: { type: "empty"; heading: string; description?: string; icon?: IconName; tone?: "neutral" | "error" };
  tags: { type: "tags"; items: Tag[] };
  actions: { type: "actions"; items: Action[] };
  choice: {
    type: "choice";
    param: string;
    label: string;
    value: string;
    options: { value: string; label: string; icon?: IconName }[];
  };
  timeline: {
    type: "timeline";
    items: { time?: string; heading?: string; text?: string; done?: boolean; icon?: IconName; tone?: Tone }[];
  };
  divider: { type: "divider" };
  custom: {
    type: "custom";
    element: AssistElement;
    props?: Record<string, unknown>;
    key?: string;
  };
  attach: {
    type: "attach";
    action: Pick<ActionBase, "label" | "icon" | "disabled" | "reason"> & Emphasis;
    text?: string;
    heading: string;
    intro?: string;
    file: {
      name: string;
      legend: string;
      hint?: string;
      accept?: string;
      required?: boolean;
      upload: { collection: string; data?: Record<string, unknown> };
      sample?: { filename: string; lines: string[]; label?: string };
    };
    fields?: PromptField[];
    dictate?: { label: string; field: string };
    extract?: {
      label: string;
      what: string;
      fields: { id: string; label: string; hint?: string }[];
      into: Record<string, { field: string; append?: boolean }>;
    };
    missing?: string;
    call: NonNullable<Action["call"]>;
    confirmLabel: string;
    done?: string;
  };
  form: {
    type: "form";
    fields: PromptField[];
    value: Record<string, unknown>;
    save: { method?: "POST" | "PATCH"; path: string };
  };
  gantt: {
    type: "gantt";
    label: string;
    periods: string[];
    rows: { label: string; supporting?: string; from: number; to: number; tone?: Tone; tag?: string }[];
  };
  message: {
    type: "message";
    meta?: string[];
    subject: string;
    body: string;
    dir?: "ltr" | "rtl";
    lang?: string;
    assist?: boolean;
  };
  settings: {
    type: "settings";
    items: {
      label: string;
      supporting?: string;
      value: boolean | string;
      options?: { label: string; value: string }[];
      disabled?: boolean;
      call?: Action["call"];
      done?: string;
    }[];
  };
  tiles: {
    type: "tiles";
    items: {
      overline?: string;
      heading: string;
      text?: string;
      tags?: Tag[];
      actions?: Action[];
      filled?: boolean;
    }[];
    look?: "plain" | "card";
    figure?: boolean;
    fit?: "xs" | "sm" | "md";
  };
  document: { type: "document" } & DocumentSpec;
  ask: {
    type: "ask";
    endpoint: string;
    suggestions?: string[] | { endpoint: string };
    question?: string;
    name?: string;
    placeholder?: string;
    intro?: string;
    reading?: string;
    footnote?: string;
  };
}

export type ViewBlock = ViewBlocks[keyof ViewBlocks];

export type { DocumentSpec } from "../../components/base/document-spec.ts";
export type { IconName } from "../../components/primitives/media/icon-names.ts";
export type { AskAnswer } from "../../components/base/ask-spec.ts";

export interface ViewHeader {
  heading: string;
  eyebrow?: string;
  subtitle?: string;
  tags?: Tag[];
  actions?: Action[];
  summary?: { label: string; context: string; text: string };
}

export type AssistElement =
  | "ui-ai-language"
  | "ui-ai-text"
  | "ui-ai-summary"
  | "ui-ai-tools"
  | "ui-ai-classify"
  | "ui-ai-check"
  | "ui-ai-read-file"
  | "ui-ai-extract"
  | "ui-ai-flag"
  | "ui-ai-replies"
  | "ui-ai-dictate"
  | "ui-speak";

export const assist = (
  element: AssistElement,
  key: string,
  props: Record<string, unknown> = {},
): ViewBlocks["custom"] => ({
  type: "custom",
  element,
  key,
  props,
});

export const note = (text: string): ViewBlocks["text"] => ({ type: "text", text, muted: true });

export const block = <K extends keyof ViewBlocks>(type: K, b: Omit<ViewBlocks[K], "type">): ViewBlocks[K] =>
  ({ type, ...b }) as ViewBlocks[K];
