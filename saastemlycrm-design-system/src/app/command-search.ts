/**
 * Search behind the command palette: ranks actions, pages and records for a query by
 *
 * - **fuzzy** matching on titles — exact / prefix / word-start substrings, characters in order
 *   (`cpo` → "Customer POs"), and one typo per word (`invoce` → "Invoices"), with the matched
 *   character ranges for highlighting;
 * - **semantic** matching on what an entry is about — stemmed words plus a thesaurus of
 *   business words, so "bill" finds invoices, "vendor" finds suppliers, "money owed" finds
 *   receivables. A project adds its own words (`admin.custom.search.synonyms`), passed as
 *   `synonyms`.
 *
 * Runs in the browser over an index the palette builds when it opens (no server needed). A real
 * deployment could swap `semanticScore` for embeddings without changing the palette.
 */

export type EntryKind = "action" | "page" | "record";

export interface SearchEntry {
  id: string;
  kind: EntryKind;
  title: string;
  /** Where it lives, shown before the title ("Sales › Orders"). */
  group: string;
  description?: string;
  /** Extra searchable words (field values, synonyms…). */
  keywords?: string[];
  href?: string;
  /** Runs instead of following `href`. */
  run?: () => void;
}

/** `[start, end)` character ranges of `title` that matched. */
export type Range = [number, number];

export interface SearchHit {
  entry: SearchEntry;
  score: number;
  /** Matched ranges of `title` and of `description`. */
  ranges: Range[];
  descriptionRanges: Range[];
  /** Found only through meaning (no literal match): shown as "related". */
  related: boolean;
}

// ---------------------------------------------------------------- words

const WORD = /[\p{L}\p{N}]+/gu;
export const words = (text: string) => text.toLowerCase().match(WORD) ?? [];

/** A light English stemmer: enough to match "invoices" / "invoicing" / "invoiced" to "invoice". */
export function stem(word: string): string {
  let w = word.toLowerCase();
  if (w.length <= 3) return w;
  for (const [suffix, repl] of [
    ["ies", "y"],
    ["ing", ""],
    ["ed", ""],
    ["es", ""],
    ["s", ""],
  ] as const) {
    if (w.endsWith(suffix) && w.length - suffix.length >= 3) {
      w = w.slice(0, -suffix.length) + repl;
      break;
    }
  }
  return w.replace(/e$/, "");
}

/** Business thesaurus: words in a group mean (roughly) the same thing. */
const THESAURUS: string[][] = [
  ["invoice", "bill", "billing", "receivable", "owed", "owe", "debtor", "collection"],
  ["payment", "pay", "paid", "remittance", "settle", "settlement", "transfer", "money", "cash"],
  ["supplier", "vendor", "seller", "manufacturer", "maker"],
  ["customer", "client", "buyer", "company"],
  ["quotation", "quote", "proposal", "estimate", "pricing", "price"],
  ["offer", "bid", "response"],
  ["request", "inquiry", "enquiry"],
  ["purchase", "order", "po", "procure", "procurement", "buy"],
  ["delivery", "shipment", "shipping", "dispatch", "logistics", "freight", "courier", "fulfilment", "fulfillment"],
  ["stock", "inventory", "warehouse", "receipt", "goods", "store"],
  ["product", "item", "catalogue", "catalog", "sku", "part", "spare", "equipment", "material"],
  ["task", "todo", "reminder", "followup", "follow", "chase", "work"],
  ["approval", "approve", "signoff", "authorize", "authorise", "permission"],
  ["user", "team", "staff", "employee", "member", "people", "colleague", "account"],
  ["setting", "config", "configuration", "preference", "option", "setup"],
  ["report", "analytic", "kpi", "dashboard", "metric", "chart", "stat", "overview", "insight"],
  ["exception", "error", "problem", "issue", "alert", "failure", "mismatch", "warning"],
  ["message", "email", "mail", "inbox", "chat"],
  ["create", "new", "add", "make", "start", "open"],
  ["opportunity", "lead", "prospect", "deal", "growth", "pipeline", "crm"],
  ["margin", "profit", "markup", "cost"],
  ["deadline", "due", "late", "overdue", "urgent"],
  ["bookmark", "favourite", "favorite", "save", "pin"],
  ["logout", "signout", "exit", "leave"],
  ["mock", "seed", "demo", "data", "backup", "export", "import", "reset"],
];
/** Each word's stem → the stems it's related to, from the thesaurus plus a project's groups. */
function relatedMap(extra: string[][] = []) {
  const related = new Map<string, Set<string>>();
  for (const group of [...THESAURUS, ...extra]) {
    const stems = group.flatMap((g) => words(g)).map(stem);
    for (const s of stems) {
      const set = related.get(s) ?? new Set<string>();
      for (const other of stems) if (other !== s) set.add(other);
      related.set(s, set);
    }
  }
  return related;
}
const RELATED = relatedMap();
const relatedCache = new WeakMap<string[][], Map<string, Set<string>>>();
/** The related words with a project's synonyms (built once per list). */
function relatedWith(synonyms?: string[][]) {
  if (!synonyms?.length) return RELATED;
  let map = relatedCache.get(synonyms);
  if (!map) relatedCache.set(synonyms, (map = relatedMap(synonyms)));
  return map;
}

// ---------------------------------------------------------------- fuzzy

/** Edit distance, stopping early once it exceeds `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j]! + 1, row[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, row[j]!);
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length]!;
}

const isWordStart = (text: string, i: number) => i === 0 || !/[\p{L}\p{N}]/u.test(text[i - 1]!);

/** How well one query token matches `text`; the ranges it covers. */
function matchToken(token: string, text: string): { score: number; ranges: Range[] } | null {
  const lower = text.toLowerCase();
  // 1. substring, preferring one at a word start
  let at = -1;
  for (let i = lower.indexOf(token); i !== -1; i = lower.indexOf(token, i + 1)) {
    if (isWordStart(lower, i)) {
      at = i;
      break;
    }
    if (at === -1) at = i;
  }
  if (at !== -1) {
    const score = (at === 0 ? 1 : isWordStart(lower, at) ? 0.92 : 0.75) * (0.85 + 0.15 * Math.min(1, token.length / 4));
    return { score, ranges: [[at, at + token.length]] };
  }
  // 2. the word's stem starting a word ("vendors" → "Vendor registrations")
  const root = stem(token);
  if (root.length >= 3 && root !== token) {
    for (const m of lower.matchAll(WORD)) {
      if (m[0].startsWith(root)) return { score: 0.85, ranges: [[m.index, m.index + root.length]] };
    }
  }
  // 3. characters in order, rewarding word starts and runs ("cpo" → Customer POs)
  const ranges: Range[] = [];
  let i = 0;
  let gaps = 0;
  let starts = 0;
  /** Characters that neither start a word nor continue the previous match. */
  let loose = 0;
  for (const ch of token) {
    let found = -1;
    for (let j = i; j < lower.length; j++) {
      if (lower[j] === ch) {
        // prefer a later word start over a mid-word match if one comes soon
        if (!isWordStart(lower, j)) {
          const ahead = lower.indexOf(ch, j + 1);
          if (ahead !== -1 && ahead - j < 6 && isWordStart(lower, ahead)) continue;
        }
        found = j;
        break;
      }
    }
    if (found === -1) {
      ranges.length = 0;
      break;
    }
    const last = ranges.at(-1);
    if (isWordStart(lower, found)) starts++;
    else if (!(last && last[1] === found)) loose++;
    if (last && last[1] === found) last[1]++;
    else {
      if (ranges.length) gaps++;
      ranges.push([found, found + 1]);
    }
    i = found + 1;
  }
  // ...but only acronym-like (word starts and runs: "cpo") or within a short stretch, so "case"
  // doesn't match "Create new Stock item"
  const span = ranges.length ? ranges.at(-1)![1] - ranges[0]![0] : 0;
  const compact = loose === 0 || span <= token.length + 2;
  if (ranges.length && token.length >= 2 && compact) {
    const score = 0.35 + 0.35 * (starts / token.length) + 0.15 / (1 + gaps);
    return { score: Math.min(score, 0.8), ranges };
  }
  // 4. one typo in a word ("invoce" → "invoice")
  if (token.length >= 4) {
    const max = token.length >= 7 ? 2 : 1;
    for (const m of lower.matchAll(WORD)) {
      const w = m[0];
      const candidate = w.slice(0, Math.max(token.length, Math.min(w.length, token.length + 1)));
      if (distance(token, candidate, max) <= max)
        return { score: 0.6, ranges: [[m.index, m.index + candidate.length]] };
    }
  }
  return null;
}

/** Fuzzy match of a whole query against a text: every token must match. */
export function fuzzyMatch(query: string, text: string): { score: number; ranges: Range[] } | null {
  const tokens = words(query);
  if (!tokens.length) return null;
  let total = 0;
  const ranges: Range[] = [];
  for (const t of tokens) {
    const m = matchToken(t, text);
    if (!m) return null;
    total += m.score;
    ranges.push(...m.ranges);
  }
  return { score: total / tokens.length, ranges: mergeRanges(ranges) };
}

export function mergeRanges(ranges: Range[]): Range[] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: Range[] = [];
  for (const r of sorted) {
    const last = out.at(-1);
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else out.push([r[0], r[1]]);
  }
  return out;
}

// ---------------------------------------------------------------- semantic

/**
 * Share of the query's meaning found in the entry: a word itself counts 1, a related word 0.7.
 * `synonyms`: a project's own groups of words that mean the same, added to the thesaurus.
 */
export function semanticScore(query: string, entryWords: Set<string>, synonyms?: string[][]): number {
  const related = relatedWith(synonyms);
  const tokens = words(query)
    .filter((w) => w.length >= 2)
    .map(stem);
  if (!tokens.length) return 0;
  let total = 0;
  for (const t of tokens) {
    if (entryWords.has(t)) total += 1;
    else if ([...(related.get(t) ?? [])].some((r) => entryWords.has(r))) total += 0.7;
  }
  return total / tokens.length;
}

const entryWordCache = new WeakMap<SearchEntry, Set<string>>();
function entryWords(e: SearchEntry): Set<string> {
  let set = entryWordCache.get(e);
  if (!set) {
    set = new Set(words([e.title, e.group, e.description ?? "", ...(e.keywords ?? [])].join(" ")).map(stem));
    entryWordCache.set(e, set);
  }
  return set;
}

// ---------------------------------------------------------------- ranking

const KIND_BIAS: Record<EntryKind, number> = { action: 0.04, page: 0.05, record: 0 };

/** Ranks entries for a query, best first (`synonyms`: a project's own, see `semanticScore`). */
export function search(entries: SearchEntry[], query: string, limit = 40, synonyms?: string[][]): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const entry of entries) {
    const title = fuzzyMatch(q, entry.title);
    const elsewhere = title
      ? null
      : fuzzyMatch(q, [entry.group, entry.description ?? "", ...(entry.keywords ?? [])].join(" · "));
    const meaning = semanticScore(q, entryWords(entry), synonyms);
    const literal = title ? title.score : elsewhere ? elsewhere.score * 0.8 : 0;
    const score = Math.max(literal, meaning * 0.78) + (literal && meaning ? 0.08 : 0) + KIND_BIAS[entry.kind];
    if (score < 0.45) continue;
    const inDescription = title || !entry.description ? null : fuzzyMatch(q, entry.description);
    hits.push({
      entry,
      score,
      ranges: title?.ranges ?? [],
      descriptionRanges: inDescription?.ranges ?? [],
      related: !literal,
    });
  }
  return hits.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).slice(0, limit);
}

/** Splits a title into plain and matched parts, for highlighting. */
export function highlightParts(text: string, ranges: Range[]): { text: string; match: boolean }[] {
  const parts: { text: string; match: boolean }[] = [];
  let at = 0;
  for (const [a, b] of ranges) {
    if (a > at) parts.push({ text: text.slice(at, a), match: false });
    parts.push({ text: text.slice(a, b), match: true });
    at = b;
  }
  if (at < text.length) parts.push({ text: text.slice(at), match: false });
  return parts;
}
