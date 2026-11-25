import { api } from "../api/client.ts";
import type { Doc, Tour } from "../contracts/config.ts";
import { m } from "../i18n/index.ts";

export interface Branding {
  name: string;
  icon: string;
  loginIntro?: string;
  poweredBy?: string;
  backgrounds: { path: string; label: string }[];
  backgroundCredit?: string;
}

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
  roleNotes: { role: string; note: string; suggestions: string[] }[];
  suggestions: string[];
  mainRecord?: string;
  recordPattern?: string;
  businessKeywords: string[];
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
const strings = (v: unknown): string[] =>
  list<unknown>(v).flatMap((s) => (typeof s === "string" && s.trim() ? [s] : []));

let tours: Promise<Tour[]> | null = null;
export function loadTours(): Promise<Tour[]> {
  tours ??= api
    .find<Doc>("tours", { limit: 0, depth: 0, sort: "createdAt" })
    .then((r) =>
      r.docs.map((d) => ({
        id: String(d.id),
        title: text(d.title),
        summary: text(d.summary),
        steps: ((d.steps as Tour["steps"] | undefined) ?? []).map((s) => {
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

export function resetSite() {
  tours = null;
  guide = null;
}
