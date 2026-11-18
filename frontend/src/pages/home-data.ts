/**
 * Illustrative data for the home page ("My day"), taken from the Golden Sea
 * sourcing-desk demo (docs/data.js). The demo is pinned to one morning so the
 * deadlines read the same every time.
 */

export const NOW = new Date("2026-11-18T09:00");

export type UserId = "ky" | "kb" | "sa" | "ah";

export const USERS: Record<UserId, { name: string; initials: string; role: string }> = {
  ky: { name: "Karim Youssef", initials: "KY", role: "Supply chain & customer service" },
  kb: { name: "Karim Balbaa", initials: "KB", role: "Management approver" },
  sa: { name: "Soaad Amer", initials: "SA", role: "Sales" },
  ah: { name: "Ahmedy", initials: "AH", role: "Operations & finance" },
};

/** The person viewing the page. */
export const ME: UserId = "ky";

export type Tone = "danger" | "warn" | "info" | "ok" | "neutral";

export interface Case {
  id: string;
  customer: string;
  vessel: string;
  port: string;
  eta: string;
  deadline: string;
  stage: string;
  wait: string;
  tone: Tone;
  owner: UserId;
  next: string;
  blocker: string;
  /** Lines: [ready, waiting, blocked, no offer]. */
  lines: [number, number, number, number];
  value: number;
  urgent?: boolean;
}

export const CASES: Case[] = [
  {
    id: "GS-RFQ-0142",
    customer: "Nordvik Ship Management",
    vessel: "MV Aurora Crest",
    port: "Port Said",
    eta: "2026-11-21",
    deadline: "2026-11-18T14:00",
    stage: "Comparing offers",
    wait: "Awaiting supplier",
    tone: "info",
    owner: "ky",
    next: "Select offers & price lines 1–5",
    blocker: "Line 6 awaiting customer clarification",
    lines: [3, 1, 1, 1],
    value: 7480,
  },
  {
    id: "GS-RFQ-0141",
    customer: "Helios Bulk Carriers",
    vessel: "MV Helios Star",
    port: "Suez",
    eta: "2026-11-19",
    deadline: "2026-11-18T16:00",
    stage: "Awaiting supplier",
    wait: "Awaiting supplier",
    tone: "warn",
    owner: "sa",
    next: "Chase 2 pump-seal suppliers",
    blocker: "Deadline today 16:00",
    lines: [2, 4, 0, 0],
    value: 12900,
    urgent: true,
  },
  {
    id: "GS-RFQ-0140",
    customer: "Mare Nostrum Shipping",
    vessel: "MV Corallo",
    port: "Damietta",
    eta: "2026-11-27",
    deadline: "2026-11-19T12:00",
    stage: "Awaiting corrected offer",
    wait: "Awaiting corrected offer",
    tone: "warn",
    owner: "ky",
    next: "Supplier to correct paint colour code (RAL 7035 → 7038)",
    blocker: "1 line blocked from pricing",
    lines: [5, 1, 0, 0],
    value: 8800,
  },
  {
    id: "GS-RFQ-0139",
    customer: "Atlas Tankers",
    vessel: "MT Atlas Pearl",
    port: "Alexandria",
    eta: "2026-11-28",
    deadline: "2026-11-12T12:00",
    stage: "Awaiting customer decision",
    wait: "Awaiting customer decision",
    tone: "info",
    owner: "ky",
    next: "Internal reminder only — do not chase",
    blocker: "Customer rule: no status requests",
    lines: [8, 0, 0, 0],
    value: 21650,
  },
  {
    id: "GS-RFQ-0137",
    customer: "Mare Nostrum Shipping",
    vessel: "MV Corallo",
    port: "Damietta",
    eta: "2026-11-25",
    deadline: "2026-11-18T10:00",
    stage: "Awaiting management approval",
    wait: "Awaiting internal approval",
    tone: "warn",
    owner: "sa",
    next: "Karim Balbaa: margin exception (12.4%)",
    blocker: "Below 15% minimum margin",
    lines: [6, 0, 0, 0],
    value: 9340,
  },
  {
    id: "GS-RFQ-0136",
    customer: "Nordvik Ship Management",
    vessel: "MV Nordic Tern",
    port: "Port Said",
    eta: "2026-11-18",
    deadline: "2026-11-14T12:00",
    stage: "Won — PO mismatch",
    wait: "Awaiting customer decision",
    tone: "danger",
    owner: "ky",
    next: "Customer PO uses expired v1 price on line 3",
    blocker: "Commitment blocked",
    lines: [5, 0, 0, 0],
    value: 6120,
  },
  {
    id: "GS-RFQ-0135",
    customer: "Delta Offshore Services",
    vessel: "Rig support · DOS Falcon",
    port: "Abu Qir",
    eta: "2026-12-02",
    deadline: "2026-11-11T12:00",
    stage: "Revision requested",
    wait: "Awaiting internal approval",
    tone: "info",
    owner: "sa",
    next: "Prepare v2 with ESAB alternative",
    blocker: "",
    lines: [7, 2, 0, 0],
    value: 15400,
  },
  {
    id: "GS-RFQ-0133",
    customer: "Delta Offshore Services",
    vessel: "Rig support · DOS Falcon",
    port: "Abu Qir",
    eta: "2026-11-21",
    deadline: "2026-11-09T12:00",
    stage: "Delivering (drop 1 of 2)",
    wait: "Awaiting delivery or payment",
    tone: "ok",
    owner: "ah",
    next: "Collect signed delivery note drop 1",
    blocker: "ETA moved +1 day",
    lines: [9, 0, 0, 0],
    value: 18400,
  },
  {
    id: "GS-RFQ-0131",
    customer: "Helios Bulk Carriers",
    vessel: "MV Helios Dawn",
    port: "Suez",
    eta: "2026-11-10",
    deadline: "2026-11-03T12:00",
    stage: "Invoiced — partially paid",
    wait: "Awaiting delivery or payment",
    tone: "ok",
    owner: "ah",
    next: "Balance USD 4,200 due 30 Nov",
    blocker: "",
    lines: [7, 0, 0, 0],
    value: 14200,
  },
  {
    id: "GS-RFQ-0130",
    customer: "Atlas Tankers",
    vessel: "MT Atlas Wave",
    port: "Alexandria",
    eta: "2026-12-10",
    deadline: "2026-11-05T12:00",
    stage: "On hold",
    wait: "Awaiting customer decision",
    tone: "neutral",
    owner: "sa",
    next: "Customer paused — vessel drydock moved",
    blocker: "",
    lines: [4, 0, 0, 0],
    value: 5200,
  },
];

/** Waiting states, with a note on what stands out in each. */
export const WAITS: { wait: string; note: string }[] = [
  { wait: "Awaiting supplier", note: "2 overdue · 1 escalated" },
  { wait: "Awaiting corrected offer", note: "Colour code correction" },
  { wait: "Awaiting internal approval", note: "5 items for Karim Balbaa" },
  { wait: "Awaiting customer decision", note: "1 do-not-chase account" },
  { wait: "Awaiting delivery or payment", note: "USD 4,200 due 30 Nov" },
];

export interface Briefing {
  tone: Tone;
  title: string;
  detail: string;
  caseId: string;
}

export const BRIEFING: Briefing[] = [
  {
    tone: "danger",
    title: "Helios Star quote due today 16:00",
    detail: "2 pump-seal suppliers haven't replied. Reminder drafts ready.",
    caseId: "GS-RFQ-0141",
  },
  {
    tone: "danger",
    title: "Customer PO mismatch on GS-RFQ-0136",
    detail: "PO uses expired v1 price on line 3 — commitment blocked.",
    caseId: "GS-RFQ-0136",
  },
  {
    tone: "warn",
    title: "Cairo Chem not responding (2 reminders)",
    detail: "Escalated to you on GS-RFQ-0142. Line 3 still has 2 compliant offers.",
    caseId: "GS-RFQ-0142",
  },
  {
    tone: "warn",
    title: "MV Nordic Tern ETA moved earlier (18 Nov)",
    detail: "Delivery task for GS-RFQ-0136 updated; owner notified.",
    caseId: "GS-RFQ-0136",
  },
  {
    tone: "info",
    title: "5 items awaiting Karim Balbaa",
    detail: "Margin exception, deposit, alternative, bank change, FX.",
    caseId: "GS-RFQ-0137",
  },
  {
    tone: "info",
    title: "Helios Bulk balance USD 4,200 due 30 Nov",
    detail: "Partial payment received 12 Nov. Collection draft scheduled 28 Nov.",
    caseId: "GS-RFQ-0131",
  },
];

export interface FollowUp {
  channel: "Call" | "Email" | "WhatsApp";
  who: string;
  goal: string;
  when: string;
  overdue?: boolean;
}

export const FOLLOW_UPS: FollowUp[] = [
  {
    channel: "Call",
    who: "Cairo Chem · procurement",
    goal: "Confirm whether they can still quote line 3 for GS-RFQ-0142",
    when: "Overdue",
    overdue: true,
  },
  {
    channel: "WhatsApp",
    who: "Nordvik · superintendent",
    goal: "Clarify line 6 (spec missing) on MV Aurora Crest",
    when: "10:30",
  },
  {
    channel: "Email",
    who: "Nordvik · purchasing",
    goal: "Ask for a corrected PO at the v2 price for GS-RFQ-0136",
    when: "12:00",
  },
];
