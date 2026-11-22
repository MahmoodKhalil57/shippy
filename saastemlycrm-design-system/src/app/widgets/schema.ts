import type { DocumentSpec } from "../../components/base/document-spec.ts";
import type { IconName } from "../../components/primitives/media/icon-names.ts";
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
  icon?: IconName;
}

/**
 * A value in a table cell, a list's trailing slot or a description list. A string is plain
 * text; the object form adds a tone, a link, a tag look, a dot, a monospaced or emphasised look.
 */
export type Cell = string | number | null | undefined | TextCell | TagCell | PersonCell | SwitchCell;

/** Text with an optional tone, link, dot, gauge, tags, marks or buttons. */
export interface TextCell {
  text: string;
  tone?: Tone;
  href?: string;
  /** A status dot before the text. */
  dot?: Tone;
  mono?: boolean;
  strong?: boolean;
  /** A bar under the text: `value` of `max`. */
  gauge?: { value: number; max: number; tone?: Tone; label?: string };
  /**
   * Buttons after the text; `text` may be empty. In a table these are the row's own actions: put
   * the one thing to do with a row in its last column. They are never drawn filled there (a list
   * of rows has no single main action: a link is a text button, anything else tonal).
   */
  actions?: Action[];
  /** Tags after the text; `text` may be empty. */
  tags?: Tag[];
  /** Short lines under the text, each with a status dot (checks, flags). */
  marks?: { text: string; tone?: Tone }[];
  tag?: never;
  switch?: never;
  person?: never;
}

/** The value drawn as a tag (a status, in its tone; a category, in its hue). */
export interface TagCell {
  text: string;
  tag: true;
  tone?: Tone;
  /** A category's hue slot (its option's place in its field). */
  hue?: number;
  switch?: never;
  person?: never;
}

/** A person (an owner, a requester): their avatar, from their initials, and their name on one line. */
export interface PersonCell {
  text: string;
  person: true;
  href?: string;
  tag?: never;
  switch?: never;
  tone?: never;
}

/**
 * A switch that applies at once, named by `text` (not shown): flipping it sends `call` with
 * `value: true | false` added to the body, then reloads; the snackbar's Undo sends the value it
 * had. Without `call` it's read-only.
 */
export interface SwitchCell {
  text: string;
  switch: { value: boolean; call?: Action["call"]; done?: string };
  tag?: never;
  tone?: never;
  person?: never;
}

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
 * then shows `done` in the snackbar, with Undo when there is a way back, and refreshes the view.
 */
/**
 * The main action can't be destructive (HIG Buttons: "Don't assign the primary role to a button
 * that performs a destructive action"): `main` and `tone: "error"` don't go together.
 */
export type Action = ActionBase & Emphasis & Reversal;
/** Main, or destructive, or neither: never both. */
export type Emphasis = { main?: false; tone?: "error" } | { main?: boolean; tone?: never };

/**
 * The call that takes an action back, offered as **Undo** in the snackbar: `path` and `body`
 * like an action's `call`. `done` is what the snackbar says once it's undone (else the undo
 * endpoint's `message`, else "Undone").
 */
export type UndoCall = NonNullable<ActionBase["call"]> & { done?: string };

/**
 * **Undo, or a dialog first: never both.** An action is one of two kinds, and the kind decides:
 *
 * - **Reversible and internal** (a decision recorded, a line moved to another state, a setting,
 *   a draft removed, a message filed): it happens at once and the snackbar offers Undo. No "are
 *   you sure?". HIG Alerts: "Avoid displaying alerts for common, undoable actions, even when
 *   they're destructive"; M3 Snackbar: "To allow users to amend choices, display an 'Undo'
 *   action"; M3 content design: "Tell users what will happen if they take an action and how they
 *   can undo it".
 * - **Outward or irreversible** (an email, an order or a reminder sent, money paid or recorded as
 *   paid, a document filed with an authority, something deleted for good): `confirm`, a dialog
 *   naming the verb, and no undo. HIG Alerts: "when people take an uncommon destructive action
 *   that they can't undo, it's important to display an alert"; M3 Dialogs: "Basic dialogs can give
 *   people the ability to provide confirmation of a choice before committing to it".
 *
 * So an action that declares `undo` can't also `confirm` (this type), and an endpoint that sends
 * or pays never answers with one. A dialog that asks for something (`fields`: a reason, an
 * amount) is a form, not a confirmation; it stays whichever kind the action is, and its endpoint
 * may still answer with an `undo`.
 *
 * (Local copies of the guidelines: material-web/.apple-specs/pages/alerts.md,
 * material-web/.m3-specs/pages/components/snackbar.md and …/foundations/content-design/style-guide.md.)
 */
export type Reversal = { confirm?: ActionBase["confirm"]; undo?: never } | { confirm?: never; undo?: UndoCall };

interface ActionBase {
  label: string;
  icon?: IconName;
  /**
   * The one thing to do here: drawn filled and placed last. One per group; the design system
   * draws a second one as a plain button. Everything else is drawn by its kind: a link (`href`
   * only) as a text button, any other action as a tonal one.
   */
  main?: boolean;
  /** `error` for a destructive action (never the main one). */
  tone?: "error";
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
  /**
   * How to take it back, when the screen already knows (the call with the value it had). An
   * endpoint that knows better answers with its own: a reply's `undo: { path, body }` wins over
   * this one, and is honoured with or without `reply`; a reply's `undo: null` withdraws it (the
   * thing has already moved on). The endpoint behind an undo checks access as the signed-in
   * user and refuses once what it would take back has been built on. See `Reversal`.
   */
  undo?: UndoCall;
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
  /** Only when the figure means something (good, needs attention, wrong). */
  tone?: "success" | "warning" | "error";
  href?: string;
  trend?: { labels: string[]; values: number[]; format?: NumberFormat };
  /**
   * How the figure moved against the previous period, as a chip under it: `text` is the change in
   * words ("+21%", "−0.4 d"), `dir` the way it went (the chip's arrow), and `good` whether that is
   * good news (the chip's ink: success when true, error when false, neutral when left out: fewer
   * days is good, fewer orders is not, and the design system can't know which).
   */
  delta?: { text: string; dir: "up" | "down" | "flat"; good?: boolean };
  /** The figure the row is about: drawn tinted. One per `stats` block (the first wins). */
  main?: boolean;
  /**
   * Its part of a whole or its way to a target, 0 to 1, drawn as a bar under it, with its words
   * (`text`: "3 of 10 cases"; else the percentage).
   */
  share?: { value: number; text?: string };
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
  /**
   * The time or date the item is due ("14:00", "17 Nov", "Wed 10:00"), in a leading column: the
   * list reads as an agenda. Such a row keeps its supporting text to one line and, when it links
   * somewhere and has nothing else at its end, shows a chevron there.
   */
  lead?: string;
  /** Status dot at the start. */
  dot?: Tone;
  icon?: IconName;
  href?: string;
  /** A short value (a count, a date) at the end of the headline's line, on it however narrow the list. */
  value?: Cell;
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

/**
 * A chart over one x axis (`<ui-chart>`): the design system draws the gridlines, round ticks,
 * thinned x labels, the tooltip, the legend's chips and the colours (series take the chart
 * palette in the order given, so a series keeps its colour). A screen says only what the data is.
 */
export interface ChartSpec {
  /** `line`: a trend (one series gets a soft area under it). `bars`: amounts per period or category. */
  kind: "bars" | "line";
  labels: string[];
  /** Up to six, each as long as `labels`. Give the longest history: `ranges` cuts it. */
  series: { name: string; values: number[] }[];
  format?: NumberFormat;
  /** A reference value (a target, a policy minimum): a dashed line, with `targetLabel` on it. */
  target?: number;
  targetLabel?: string;
  /** Bars of one series: the latest in colour with its value over it, the history muted. */
  highlightLast?: boolean;
  /** The series are parts of a whole: stacked bars, or stacked areas for lines. */
  stacked?: boolean;
  /**
   * A range switch in the chart's header: each choice shows the last `points` of every series
   * (`{ label: "4 w", points: 4 }`), cut in the browser. Shortest first; the first is shown at
   * first unless `range` names another's `points`. Ranges longer than the data are left out.
   */
  ranges?: { label: string; points: number }[];
  range?: number;
}

/**
 * One of a set of like things (a request, a next step, a delivery), always drawn with the same
 * anatomy, so every set reads the same way: a header (heading, meta line, status and tags), then
 * what it's about (summary, text, facts), who stands where (people), quiet notes, a notice, and
 * the actions (links first, the main action last, at most one filled).
 */
export interface Entry {
  /** Tells entries apart across reloads (keeps its AI summary). */
  id?: string;
  heading: string;
  /** The heading links here. */
  href?: string;
  /** Short facts under the heading, in one line joined with " · " (who, when, where). */
  meta?: string[];
  /** Its state: the first tag in the header. */
  status?: Tag;
  tags?: Tag[];
  /** An on-device AI line saying what it's about and what matters: `text` summarised with `context`. */
  summary?: { context: string; text: string };
  text?: string;
  /** Label and value pairs, one per row. */
  facts?: { label: string; value: Cell; note?: string }[];
  /** People and where they stand (sign-offs, attendees); `note` is what they said. */
  people?: { name: string; state?: "done" | "declined" | "waiting"; note?: string }[];
  /** Quiet lines (the rule that applies, history). */
  notes?: string[];
  /** Something the reader must know before acting (why they can't). */
  notice?: { tone?: "info" | "success" | "warning" | "error"; text: string };
  actions?: Action[];
  /** An action that asks for a file (proof, a signed note): the `attach` block, next to the actions. */
  attach?: Omit<ViewBlocks["attach"], "type">;
}

/** Card-like container fields shared by `card`. */
/** A card around content. Inside another card it is drawn as a filled panel, never a card in a card. */
export interface CardBlock {
  type: "card";
  heading?: string;
  subhead?: string;
  count?: number;
  countTone?: Tone;
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
  /**
   * A set of like things, each drawn the same way (`Entry`). On its own (or as a titled widget's
   * content, which then becomes a section, not a card) each entry is a card; inside a card they
   * are rows between dividers. With no items it is one quiet line (`empty`).
   */
  entries: { type: "entries"; items: Entry[]; empty?: string };
  /**
   * Blocks side by side, as many columns as fit. The column width follows what's in it: charts,
   * tables, lists and cards get wide columns, anything else narrow ones.
   */
  grid: { type: "grid"; blocks: ViewBlock[] };
  /** A main column and a narrower side column. */
  split: { type: "split"; main: ViewBlock[]; side: ViewBlock[] };
  /** `size`: `sm` the figure on one line (a tile one row high), `md` a tile's, `lg` a page's headline. */
  stats: {
    type: "stats";
    items: Stat[];
    size?: "sm" | "md" | "lg";
    /**
     * A mini version's figure (src/app/widgets/mini.ts): the first item at its own height, its
     * sparkline beside the value, never filling its tile (the tile fits it).
     */
    mini?: boolean;
  };
  /** A paragraph. `muted` makes it a quiet note (prefer `note(text)`). Headings are `heading` blocks. */
  text: {
    type: "text";
    text: string;
    muted?: boolean;
    /** Offer "Read aloud" (the browser's voice); a string is the language ("en-GB"). */
    speak?: boolean | string;
  };
  /** A heading for the blocks after it, inside a card (one level under the card's own heading). */
  heading: { type: "heading"; text: string };
  /**
   * Rows of records, one line each (about 44px): a value that doesn't fit its column ends in "…",
   * and a column's `supporting` key adds a second, quieter line (two lines at most). A person is
   * a `person` cell (avatar and name), a status a `dot` or `tag` cell, and a row's own action
   * goes in its last column (`actions`).
   */
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
  /**
   * Parts of a whole as a donut (`<ui-ring>`): up to six parts in the chart palette's order (more
   * fold into "Other"), what they add up to in the middle (`total`, named by `center`), the parts
   * listed beside it with their shares. With `max`, one reading of a known most (a progress ring).
   * Pointing at a part brings it forward; a part with `href` opens it.
   */
  ring: {
    type: "ring";
    parts: { label: string; value: number; valueText?: string; href?: string }[];
    max?: number;
    total?: string;
    center?: string;
    /** Its accessible name. */
    label?: string;
  };
  /**
   * Stages one after another (`<ui-funnel>`): each a bar as long as its share of the first, the
   * share that went on between two, and the whole funnel's in its caption.
   */
  funnel: {
    type: "funnel";
    stages: { label: string; value: number; valueText?: string; href?: string }[];
    /** What a step's share says ("went on", "quoted"). */
    step?: string;
    label?: string;
  };
  /**
   * How much happened each day (`<ui-heatmap>`): the days oldest first, a week a column, each as
   * deep as its amount; the line under it reads the day pointed at, else `summary`.
   */
  heatmap: {
    type: "heatmap";
    days: { label: string; value: number; valueText?: string }[];
    summary?: string;
    label?: string;
  };
  /**
   * Readings against targets (`<ui-bullet>` each): a bar on qualitative bands with a target tick,
   * one per line ("Win rate 27% of a 30% target").
   */
  bullet: {
    type: "bullet";
    items: {
      label: string;
      value: number;
      max: number;
      min?: number;
      target?: number;
      /** Ascending thresholds splitting the track into poor / fair / good. */
      bands?: number[];
      valueText?: string;
      targetText?: string;
      lowerIsBetter?: boolean;
    }[];
  };
  /** One reading on a half-circle gauge with a needle (`<ui-dial>`), its arc coloured by `zones`. */
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
  /** A share as a 10 × 10 grid of cells (`<ui-waffle>`), or several parts filling it in turn. */
  waffle: {
    type: "waffle";
    value?: number;
    max?: number;
    valueText?: string;
    caption?: string;
    label?: string;
    parts?: { label: string; value: number; href?: string }[];
  };
  /** Parts of a whole as one 100% bar with its legend (`<ui-share-bar>`): a ring for a small tile. */
  share: {
    type: "share";
    parts: { label: string; value: number; valueText?: string; href?: string }[];
    total?: string;
    label?: string;
  };
  /** Parts of a whole as rectangles sized by value (`<ui-treemap>`): where the weight is. */
  treemap: {
    type: "treemap";
    items: { label: string; value: number; valueText?: string; href?: string }[];
    total?: string;
    label?: string;
  };
  /**
   * A bridge (`<ui-waterfall>`): a start, steps up and down, and totals (`total: true`, drawn from
   * zero to the running total), so it shows how one figure becomes another.
   */
  waterfall: {
    type: "waterfall";
    steps: { label: string; value: number; valueText?: string; total?: boolean }[];
    format?: NumberFormat;
    /** Span the levels it moves through, not zero: small changes next to large totals. */
    fit?: boolean;
    label?: string;
  };
  /** A scatter split into four quadrants (`<ui-quadrant>`): who's where on two measures. */
  quadrant: {
    type: "quadrant";
    points: { label: string; x: number; y: number; valueText?: string; href?: string; size?: number }[];
    xLabel: string;
    yLabel: string;
    xMid?: number;
    yMid?: number;
    xDomain?: [number, number];
    yDomain?: [number, number];
    /** Corner captions: top start, top end, bottom start, bottom end. */
    quadrants?: [string, string, string, string];
    invertY?: boolean;
    label?: string;
  };
  /** Deadlines with the time left, live, each bar draining as it runs out (`<ui-countdown>`). */
  countdown: {
    type: "countdown";
    items: { label: string; due: string; from?: string; supporting?: string; href?: string }[];
    /** The moment to count from (a demo's fixed today); left out, the clock. */
    now?: string;
    label?: string;
  };
  /** A month's calendar with what's due each day (`<ui-month>`); a day chosen lists its items. */
  month: {
    type: "month";
    /** "2026-11". */
    month: string;
    today?: string;
    events: { date: string; label: string; href?: string; tone?: "neutral" | "warning" | "error" | "success" }[];
    weekStart?: 0 | 1;
    label?: string;
  };
  /** A live what-if (`<ui-whatif>`): sliders in, figures out, recomputed as they move. */
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
  /**
   * A choice that changes what the view shows (period, basis, filter). It sets the query
   * parameter `param` and the view reloads with it: the endpoint decides what changes.
   */
  choice: {
    type: "choice";
    param: string;
    label: string;
    value: string;
    options: { value: string; label: string; icon?: IconName }[];
  };
  timeline: {
    type: "timeline";
    /** `icon` and `tone` replace the default tick (e.g. who or what made the entry). */
    items: { time?: string; heading?: string; text?: string; done?: boolean; icon?: IconName; tone?: Tone }[];
  };
  divider: { type: "divider" };
  /** A design-system element placed as it is (the `ui-ai-*` assists): `props` set on it, `key` tells instances apart. */
  custom: {
    type: "custom";
    element: AssistElement;
    props?: Record<string, unknown>;
    /** Tells several instances of the same element apart (one per line, per row…). */
    key?: string;
  };
  // drawn by ./blocks/attach.ts
  attach: {
    type: "attach";
    /** The button that opens the dialog. */
    action: Pick<ActionBase, "label" | "icon" | "disabled" | "reason"> & Emphasis;
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
export type { IconName } from "../../components/primitives/media/icon-names.ts";
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

/** The design system's on-device AI assists (src/components/composed/ai/assist.ts), the only elements a `custom` block places. */
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

/** An on-device AI assist as a block: `key` tells several of the same element apart. */
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

/** A quiet line of supporting text (what a section is for, a rule, a footnote). */
export const note = (text: string): ViewBlocks["text"] => ({ type: "text", text, muted: true });

/** Narrowing helper for builders: `block("card", { heading, blocks })`. */
export const block = <K extends keyof ViewBlocks>(type: K, b: Omit<ViewBlocks[K], "type">): ViewBlocks[K] =>
  ({ type, ...b }) as ViewBlocks[K];
