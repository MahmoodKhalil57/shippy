import type { DocumentSpec } from "../../components/base/document-spec.ts";
/**
 * The block vocabulary: what a widget draws, as plain data.
 *
 * A widget's `render` (./widget.ts) turns its data into these blocks, and the app draws them with
 * the design system (./blocks.ts, ./blocks/*.ts). The app never knows what a case or an invoice
 * is, and the project never knows how a card looks.
 *
 * Everything here is pure data: the config that builds blocks also runs in the service worker. A
 * project adds its own block types the same way the built-in ones are declared: augment
 * `ViewBlocks` and register a renderer with `defineBlock` (./registry.ts).
 */

export type Tone = "neutral" | "primary" | "info" | "success" | "warning" | "error";

/** How a number reads. `money` needs a `currency`; `compact` gives "USD 12k". */
export interface NumberFormat {
  unit?: "count" | "pct" | "days" | "minutes" | "hours" | "money";
  currency?: string;
  compact?: boolean;
  decimals?: number;
}

export function formatNumber(v: number, f: NumberFormat = {}): string {
  const d = f.decimals;
  switch (f.unit) {
    case "pct":
      return `${v.toFixed(d ?? 1)}%`;
    case "days":
      return `${v.toFixed(d ?? 1)} d`;
    case "hours":
      return `${v.toFixed(d ?? 1)} h`;
    case "minutes":
      return `${Math.round(v)} min`;
    case "money": {
      const cur = f.currency ? `${f.currency} ` : "";
      if (f.compact) return `${cur}${(v / 1000).toFixed(d ?? (Math.abs(v) < 10_000 ? 1 : 0))}k`;
      return `${cur}${v.toLocaleString("en-US", { minimumFractionDigits: d ?? 0, maximumFractionDigits: d ?? 0 })}`;
    }
    default:
      return d === undefined ? Math.round(v).toLocaleString("en-US") : v.toFixed(d);
  }
}

/** A word on a thing: status, category. */
export interface Tag {
  label: string;
  tone?: Tone;
  icon?: string;
}

/**
 * A value in a table cell, a list's trailing slot or a description list. A string is plain
 * text; the object form adds a tone, a link, a tag look, a dot, a monospaced or emphasised look.
 */
export type Cell =
  | string
  | number
  | null
  | undefined
  | {
      text: string;
      tone?: Tone;
      href?: string;
      /** Draw it as a tag. */
      tag?: boolean;
      /** A status dot before the text. */
      dot?: Tone;
      mono?: boolean;
      strong?: boolean;
      /** A bar under the text: `value` of `max`. */
      gauge?: { value: number; max: number; tone?: Tone; label?: string };
      /** Buttons after the text (in a table, a row's own actions); `text` may be empty. */
      actions?: Action[];
      /** Tags after the text; `text` may be empty. */
      tags?: Tag[];
      /** Short lines under the text, each with a status dot (checks, flags). */
      marks?: { text: string; tone?: Tone }[];
      /**
       * A switch that applies at once, named by `text` (not shown): flipping it sends `call` with
       * `value: true | false` added to the body, then reloads. Without `call` it's read-only.
       */
      switch?: { value: boolean; call?: Action["call"]; done?: string };
    };

/** A form field for an action's prompt: Payload's field config (JSON parts only). */
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

/**
 * Something a person can do. `href` navigates. `call` sends a request to the API, after
 * `confirm` (a dialog naming the verb) or `fields` (a small form whose values join the body),
 * then shows `done` and reloads the view.
 */
export interface Action {
  label: string;
  icon?: string;
  variant?: "filled" | "tonal" | "outlined" | "text";
  /** `error` for a destructive action. */
  tone?: "primary" | "error";
  href?: string;
  call?: { method?: "POST" | "PATCH" | "DELETE"; path: string; body?: Record<string, unknown> };
  confirm?: { heading: string; text?: string; label: string; tone?: "primary" | "error" };
  /**
   * Fill a field from the server while the dialog is open: when `when` changes, POST `call` with
   * `{ [when]: value }` and put the answer's `from` (default `into`) into the field `into` (an
   * AI-drafted note for the person picked, a price for the product chosen).
   */
  prefill?: { when: string; into: string; from?: string; call: { path: string; body?: Record<string, unknown> } };
  /** Ask for these before calling; the values are merged into `call.body`. */
  fields?: PromptField[];
  /** Dialog heading when `fields` are asked for (default: the label). */
  prompt?: string;
  /** Snackbar message when it worked. */
  done?: string;
  /**
   * The endpoint answers for itself: its `message` is the snackbar (when there's no `done`) and
   * its `href`, if any, is where the person goes next (e.g. the new record it created).
   */
  reply?: boolean;
  /** AI writing tools (`ui-ai-tools`, e.g. "formal shorter proofread translate") under the field `field`. */
  assist?: { field: string; tools: string };
  /**
   * Fill the dialog's fields with on-device AI from pasted text (`source: "paste"`, the default)
   * or a photo (`"file"`): `into` maps a read value to a field (`append` adds a line).
   */
  extract?: {
    label: string;
    what: string;
    source?: "paste" | "file";
    placeholder?: string;
    fields: { id: string; label: string; hint?: string; type?: "string" | "number" }[];
    into: Record<string, { field: string; append?: boolean }>;
  };
  /** Print the page (the browser's print dialog) instead of navigating or calling. */
  print?: boolean;
  disabled?: boolean;
  /** Why it's disabled, shown under it. */
  reason?: string;
}

export interface Stat {
  label: string;
  value: string;
  note?: string;
  tone?: Tone;
  href?: string;
  trend?: { labels: string[]; values: number[]; format?: NumberFormat };
}

export interface Column {
  key: string;
  label: string;
  align?: "start" | "end";
  /** The key of the second line under each value. */
  supporting?: string;
}

export type Row = Record<string, Cell> & { href?: string };

export interface ListItem {
  headline: string;
  supporting?: string;
  overline?: string;
  /** Status dot at the start. */
  dot?: Tone;
  icon?: string;
  href?: string;
  trailing?: Cell;
  tags?: Tag[];
  actions?: Action[];
  selected?: boolean;
  /**
   * Clicking the row selects it: sets the screen parameter `param` to `value` (master–detail: a
   * detail widget's source reads `$param.<param>`). It shows selected while the parameter says so.
   */
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
}

/** Card-like container fields shared by `card`. */
export interface CardBlock {
  type: "card";
  heading?: string;
  subhead?: string;
  count?: number;
  countTone?: Tone;
  variant?: "outlined" | "filled" | "elevated";
  tags?: Tag[];
  actions?: Action[];
  blocks: ViewBlock[];
  /** Open by default? Present = the card folds (a disclosure). */
  open?: boolean;
}

/**
 * The built-in blocks. A project adds its own by augmenting this interface:
 * `declare module "…/app/widgets/schema.ts" { interface ViewBlocks { "gs-matrix": MatrixBlock } }`.
 */
export interface ViewBlocks {
  card: CardBlock;
  /** Blocks side by side, as many columns as fit (`fit` is the narrowest column). */
  grid: { type: "grid"; fit?: "xs" | "sm" | "md" | "lg"; blocks: ViewBlock[] };
  /** A main column and a narrower side column. */
  split: { type: "split"; main: ViewBlock[]; side: ViewBlock[] };
  stats: { type: "stats"; items: Stat[]; size?: "md" | "lg" };
  text: {
    type: "text";
    text: string;
    muted?: boolean;
    variant?: "body-md" | "body-sm" | "title-md" | "label-lg";
    /** Offer "Read aloud" (the browser's voice); a string is the language ("en-GB"). */
    speak?: boolean | string;
  };
  table: {
    type: "table";
    columns: Column[];
    rows: Row[];
    empty?: string;
    size?: "sm" | "md";
    /** Show the totals row last (the final row is the total). */
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
      /** A small line under the bar. */
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
    /** Its accessible name when it has no `title` (inside a card of its own). */
    label?: string;
  };
  alert: {
    type: "alert";
    tone?: "info" | "success" | "warning" | "error";
    heading?: string;
    text: string;
    actions?: Action[];
  };
  empty: { type: "empty"; heading: string; description?: string; icon?: string; tone?: "neutral" | "error" };
  tags: { type: "tags"; items: Tag[] };
  actions: { type: "actions"; items: Action[] };
  /**
   * A choice that changes what the view shows (period, basis, filter). It sets the query
   * parameter `param` and the view reloads with it: the endpoint decides what changes.
   */
  choice: {
    type: "choice";
    param: string;
    label: string;
    value: string;
    options: { value: string; label: string; icon?: string }[];
  };
  timeline: {
    type: "timeline";
    /** `icon` and `tone` replace the default tick (e.g. who or what made the entry). */
    items: { time?: string; heading?: string; text?: string; done?: boolean; icon?: string; tone?: Tone }[];
  };
  divider: { type: "divider" };
  /** A design-system element placed as it is (the `ui-ai-*` assists): `props` set on it, `key` tells instances apart. */
  custom: {
    type: "custom";
    element: string;
    props?: Record<string, unknown>;
    /** Tells several instances of the same element apart (one per line, per row…). */
    key?: string;
  };
  // drawn by ./blocks/attach.ts
  attach: {
    type: "attach";
    /** The button that opens the dialog. */
    action: Pick<Action, "label" | "icon" | "variant" | "tone" | "disabled" | "reason">;
    /** A line next to the button. */
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
      /**
       * A stand-in file: offered on a button with this `label`, or used when nothing is picked
       * (no label). `{field}` in a line is that field's value.
       */
      sample?: { filename: string; lines: string[]; label?: string };
    };
    fields?: PromptField[];
    /** Speak into a text field (appended). */
    dictate?: { label: string; field: string };
    /** Read these values from a photo; `into` maps a value to a field (`append` adds a line). */
    extract?: {
      label: string;
      what: string;
      fields: { id: string; label: string; hint?: string }[];
      into: Record<string, { field: string; append?: boolean }>;
    };
    /** A warning shown while no file is attached. */
    missing?: string;
    call: NonNullable<Action["call"]>;
    confirmLabel: string;
    done?: string;
  };
  // drawn by ./blocks/form.ts
  form: {
    type: "form";
    fields: PromptField[];
    value: Record<string, unknown>;
    save: { method?: "POST" | "PATCH"; path: string };
  };
  // drawn by ./blocks/gantt.ts
  gantt: {
    type: "gantt";
    /** The first column's header ("Phase"). */
    label: string;
    periods: string[];
    rows: { label: string; supporting?: string; from: number; to: number; tone?: Tone; tag?: string }[];
  };
  // drawn by ./blocks/message.ts
  message: {
    type: "message";
    /** Header lines above the subject ("From: …", "To: …"). */
    meta?: string[];
    subject: string;
    body: string;
    dir?: "ltr" | "rtl";
    lang?: string;
    /** Offer Translate and "Catch me up" on the body (on-device AI, where the browser has it). */
    assist?: boolean;
  };
  // drawn by ./blocks/settings.ts
  settings: {
    type: "settings";
    items: {
      label: string;
      /** A line under it. */
      supporting?: string;
      value: boolean | string;
      options?: { label: string; value: string }[];
      disabled?: boolean;
      call?: Action["call"];
      done?: string;
    }[];
  };
  // drawn by ./blocks/tiles.ts
  tiles: {
    type: "tiles";
    items: {
      overline?: string;
      heading: string;
      text?: string;
      tags?: Tag[];
      actions?: Action[];
      /** On a card look: a filled card instead of an outlined one. */
      filled?: boolean;
    }[];
    look?: "plain" | "card";
    /** The heading is a figure (a percentage, an amount). */
    figure?: boolean;
    fit?: "xs" | "sm" | "md";
  };
  /** A printable document (a quotation, an order) in its own layout, left-to-right or right-to-left. */
  document: { type: "document" } & DocumentSpec;
  /**
   * Questions answered from the records: `endpoint` takes `{ question }` and returns an
   * `AskAnswer`; `suggestions` come as they are or from a GET endpoint (`{ suggestions }`).
   */
  ask: {
    type: "ask";
    endpoint: string;
    suggestions?: string[] | { endpoint: string };
    question?: string;
    /** Who answers ("Assistant"). */
    name?: string;
    placeholder?: string;
    intro?: string;
    /** While it reads ("Reading cases, approvals…"). */
    reading?: string;
    footnote?: string;
  };
}

export type ViewBlock = ViewBlocks[keyof ViewBlocks];

export type { DocumentSpec } from "../../components/base/document-spec.ts";
export type { AskAnswer } from "../../components/base/ask-spec.ts";

/** The top of a root screen (an edit tab's top is the document's own header). */
export interface ViewHeader {
  heading: string;
  eyebrow?: string;
  subtitle?: string;
  tags?: Tag[];
  actions?: Action[];
  /** An AI summary under the subtitle: `text` summarised with `context`. */
  summary?: { label: string; context: string; text: string };
}

/** Narrowing helper for builders: `block("card", { heading, blocks })`. */
export const block = <K extends keyof ViewBlocks>(type: K, b: Omit<ViewBlocks[K], "type">): ViewBlocks[K] =>
  ({ type, ...b }) as ViewBlocks[K];
