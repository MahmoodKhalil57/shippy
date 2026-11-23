import { api } from "../api/client.ts";
import type { Doc, Tour } from "../contracts/config.ts";
import { m } from "../i18n/index.ts";

/**
 * The dashboard's own content, read from the project's data rather than code: the `branding`
 * global (read before sign-in too), the `assistant` global, and the `tours` and `guide-topics`
 * collections. `loadSite()` runs at start and after each sign-in; the rest load when first asked.
 * Nothing here names a business: an empty project gets neutral defaults.
 */

export interface Branding {
  name: string;
  icon: string;
  loginIntro?: string;
  poweredBy?: string;
  backgrounds: { path: string; label: string }[];
  backgroundCredit?: string;
}

/** The kinds of request the helper's simple tools answer (an example question is one of these). */
export const REQUEST_KINDS = [
  "open_page",
  "what_is_on_screen",
  "my_day",
  "record_status",
  "find",
  "ask_records",
  "platform_guide",
] as const;
export type RequestKind = (typeof REQUEST_KINDS)[number];

export interface AssistantInfo {
  name: string;
  business: string;
  ask: string;
  /** What each role does, and the questions its helper offers to start with. */
  roleNotes: { role: string; note: string; suggestions: string[] }[];
  /** Starter questions for a role without its own. */
  suggestions: string[];
  /** The collection people ask "the status of …" about (its records' fields and tabs answer it). */
  mainRecord?: string;
  /** What record numbers look like, as a regular expression's source ("ORD-\d+"). */
  recordPattern?: string;
  /** Words (or their starts) that make a message a business question for the records. */
  businessKeywords: string[];
  /** Example questions per kind of request, for the small model's brief (`argument`: what the tool gets). */
  examples: { question: string; kind: RequestKind; argument?: string }[];
}

let branding: Branding = { name: m.site_default_name(), icon: "grid", backgrounds: [] };
const NO_ASSISTANT: AssistantInfo = {
  name: m.site_assistant_name(),
  business: "a business",
  ask: "/ask",
  roleNotes: [],
  suggestions: [],
  businessKeywords: [],
  examples: [],
};
let assistant: AssistantInfo = NO_ASSISTANT;

export const site = () => ({ branding, assistant });

const text = (v: unknown, fallback = "") => (typeof v === "string" && v ? v : fallback);

/** Read the branding (always) and the assistant (when signed in). */
export async function loadSite() {
  const b = await api.findGlobal<Doc>("branding").catch(() => null);
  if (b)
    branding = {
      name: text(b.name, branding.name),
      icon: text(b.icon, "grid"),
      loginIntro: text(b.loginIntro) || undefined,
      poweredBy: text(b.poweredBy) || undefined,
      backgrounds: ((b.backgrounds as { path?: string; label?: string }[] | undefined) ?? []).flatMap((x) =>
        x.path ? [{ path: x.path, label: text(x.label, x.path) }] : [],
      ),
      backgroundCredit: text(b.backgroundCredit) || undefined,
    };
  const a = await api.findGlobal<Doc>("assistant").catch(() => null);
  if (a)
    assistant = {
      name: text(a.name, NO_ASSISTANT.name),
      business: text(a.business, NO_ASSISTANT.business),
      ask: text(a.ask, NO_ASSISTANT.ask),
      roleNotes: list<{ role?: string; note?: string; suggestions?: unknown }>(a.roleNotes).flatMap((x) =>
        x.role && x.note ? [{ role: x.role, note: x.note, suggestions: strings(x.suggestions) }] : [],
      ),
      suggestions: strings(a.suggestions),
      mainRecord: text(a.mainRecord) || undefined,
      recordPattern: text(a.recordPattern) || undefined,
      businessKeywords: strings(a.businessKeywords),
      examples: list<{ question?: string; kind?: string; argument?: string }>(a.examples).flatMap((x) => {
        const kind = REQUEST_KINDS.find((k) => k === x.kind);
        return x.question && kind ? [{ question: x.question, kind, argument: text(x.argument) || undefined }] : [];
      }),
    };
}

const list = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
/** A `hasMany` text field: its non-empty strings. */
const strings = (v: unknown): string[] =>
  list<unknown>(v).flatMap((s) => (typeof s === "string" && s.trim() ? [s] : []));

let tours: Promise<Tour[]> | null = null;
/** The guided tours (`tours` collection), loaded once per sign-in. */
export function loadTours(): Promise<Tour[]> {
  tours ??= api
    .find<Doc>("tours", { limit: 0, depth: 0, sort: "createdAt" })
    .then((r) =>
      r.docs.map((d) => ({
        id: String(d.id),
        title: text(d.title),
        summary: text(d.summary),
        steps: ((d.steps as Tour["steps"] | undefined) ?? []).map((s) => {
          // Empty optional fields come back as null or "": drop them, so "no target" stays absent.
          const clean = Object.fromEntries(Object.entries(s).filter(([k, v]) => k !== "id" && v !== null && v !== ""));
          const target = clean.target as { text?: string; sel?: string } | undefined;
          return {
            ...clean,
            target: target?.text ? { text: target.text, sel: target.sel || undefined } : undefined,
          } as Tour["steps"][number];
        }),
      })),
    )
    .catch(() => {
      tours = null;
      return [];
    });
  return tours;
}

let guide: Promise<{ topic: string; keywords: string; text: string }[]> | null = null;
/** The platform guide the helper quotes (`guide-topics` collection). */
export function loadGuide() {
  guide ??= api
    .find<Doc>("guide-topics", { limit: 0, depth: 0 })
    .then((r) => r.docs.map((d) => ({ topic: text(d.topic), keywords: text(d.keywords), text: text(d.text) })))
    .catch(() => {
      guide = null;
      return [];
    });
  return guide;
}

/** Forget what was loaded for the previous user (after a sign-in or sign-out). */
export function resetSite() {
  tours = null;
  guide = null;
}
