import type { Endpoint, PayloadRequest } from "payload";
import { TODAY } from "../collections/shared.ts";
import { fail, meOf } from "./insights-shared.ts";

/**
 * The service behind the platform, counted (GET /api/usage): this month's use of each measure in
 * the service-usage global's plan, from where the platform keeps it (the AI log, the inbox, the
 * support log, the change requests) plus what was counted earlier this month, against the plan at
 * full use and on pace for the month's end. Also what that work saved Golden Sea: the documents
 * the AI read instead of a person typing them, and the replies it matched. Units only: no prices.
 */
export interface UsageLine {
  line: string;
  measure: string;
  used: number;
  fullUse: number;
  /** Where the month ends at this month's pace so far. */
  pace: number;
}
export interface UsageView {
  /** "November 2026". */
  month: string;
  day: number;
  days: number;
  lines: UsageLine[];
  measured: {
    documents: number;
    /** Documents read a month at full use (the plan). */
    documentsFullUse: number;
    /** AI calls this month, all tasks. */
    calls: number;
    /** Replies matched without a person (of `repliesMatched`). */
    repliesAutomatic: number;
    /** Hours of typing the documents read would have taken a person. */
    hoursSaved: number;
    /** The minutes a person takes to type one document's lines (the assumption behind `hoursSaved`). */
    minutesPerDocument: number;
    repliesMatched: number;
    reviewed: number;
    waitingForReview: number;
  };
}

/** Minutes a person takes to type one RFQ document's lines into a system (the proposal's assumption). */
export const MINUTES_PER_DOCUMENT = 12;

const READING = ["Read an email", "Read an attachment"];

type Row = Record<string, unknown>;
const text = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

async function count(req: PayloadRequest, collection: string, where: Record<string, unknown>) {
  const r = await req.payload.count({ collection: collection as never, where: where as never });
  return r.totalDocs;
}

export async function usage(req: PayloadRequest): Promise<UsageView> {
  const start = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth(), 1));
  const days = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + 1, 0)).getUTCDate();
  const day = TODAY.getUTCDate();
  const since = { greater_than_equal: start.toISOString() };
  const inMonth = (v: unknown) => typeof v === "string" && new Date(v) >= start;
  const g = (await req.payload.findGlobal({ slug: "service-usage" as never, depth: 0 })) as Row;
  const ai = (tasks: string[], extra: Record<string, unknown> = {}) =>
    count(req, "ai-calls", { at: since, task: { in: tasks }, ...extra });
  const support = ((g.support as Row[] | undefined) ?? []).filter((s) => inMonth(s.date));
  const changes = ((g.changes as Row[] | undefined) ?? []).filter((c) => inMonth(c.requestedAt));
  const [reading, questions, briefings, emails, replies, repliesAuto, reviewed, waiting, calls] = await Promise.all([
    ai(READING),
    ai(["Answer a question"]),
    ai(["Write the briefing"]),
    count(req, "intake-messages", { receivedAt: since }),
    ai(["Match a reply"]),
    ai(["Match a reply"], { outcome: { equals: "Applied automatically" } }),
    count(req, "ai-calls", { at: since, reviewedBy: { exists: true } }),
    count(req, "ai-calls", { at: since, outcome: { equals: "Waiting for review" } }),
    count(req, "ai-calls", { at: since }),
  ]);
  const live: Record<string, number> = {
    "AI log: reading": reading,
    "AI log: questions": questions,
    "AI log: briefings": briefings,
    Inbox: emails,
    "Support log": support.reduce((t, s) => t + num(s.hours), 0),
    "Change requests": changes.length,
  };
  const lines = ((g.plan as Row[] | undefined) ?? []).map((p): UsageLine => {
    const used = num(p.earlier) + (live[text(p.source)] ?? 0);
    return {
      line: text(p.line),
      measure: text(p.measure),
      used,
      fullUse: num(p.fullUse),
      pace: Math.round((used / Math.max(1, day)) * days),
    };
  });
  const docs = lines.find((l) => l.measure === "Documents read");
  const documents = docs?.used ?? reading;
  return {
    month: TODAY.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }),
    day,
    days,
    lines,
    measured: {
      documents,
      documentsFullUse: docs?.fullUse ?? 0,
      calls,
      repliesAutomatic: repliesAuto,
      hoursSaved: Math.round((documents * MINUTES_PER_DOCUMENT) / 60),
      minutesPerDocument: MINUTES_PER_DOCUMENT,
      repliesMatched: replies,
      reviewed,
      waitingForReview: waiting,
    },
  };
}

export const serviceEndpoints: Endpoint[] = [
  {
    path: "/usage",
    method: "get",
    handler: async (req) => {
      if (!meOf(req)) return fail(401, "Please sign in.");
      return Response.json(await usage(req));
    },
  },
];
