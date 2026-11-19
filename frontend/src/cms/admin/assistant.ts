import type { AssistantSettings } from "../types.ts";

/** How the platform works, in short sections a small model can look up (and quote). */
const GUIDE: AssistantSettings["guide"] = [
  {
    topic: "The flow of a case",
    keywords: "case flow rfq process stages lifecycle how it works",
    text: "Every customer RFQ is one case, from the first email to the last payment: intake (the inbox reads the RFQ) → supplier RFQs → offers compared → pricing → quotation approved and sent → customer PO checked → supplier POs → delivery to the vessel → invoice → payment → close. Lines can move in stages; a case only completes when every line does. Each case has an owner, a deadline and a next action.",
  },
  {
    topic: "The inbox",
    keywords: "inbox email whatsapp message intake new rfq read extract",
    text: 'Inbox (Sourcing desk → Inbox): every mailbox and WhatsApp in one list. Open a message and use "Read it into a draft case": AI reads the email and attachments into a draft with a confidence per field; low-confidence values go to review. A person creates the case. Translate, Catch me up, and Read a photo or voice note help with each message.',
  },
  {
    topic: "Supplier RFQs and reminders",
    keywords: "supplier rfq request quote reminder late chase reply",
    text: "On a case's Supplier RFQs tab: draft RFQs per supplier (the client's name is always removed), send them, and track replies. Reminders go after 24 h and 48 h, then the case owner is alerted. \"Remind now\" sends one by hand. Replies are matched even when the subject changes.",
  },
  {
    topic: "Comparing offers",
    keywords: "compare offers best price deviation select split supplier",
    text: "On a case's Compare offers tab: each offer is checked against the requested line (brand, unit, pack size) and normalised to the base unit, with landed cost in EGP. Deviations are flagged; the best fit is recommended; a person selects. A wrong offer gets a correction request to the supplier.",
  },
  {
    topic: "Pricing and quotations",
    keywords: "price pricing margin quotation quote send approve version",
    text: "On a case's Pricing tab, prices follow the pricing policy and FX rates. Below-policy margins need approval. The quotation (EGP or USD, English or Arabic) is previewed, approved, then sent; every change is a new version. Sales never sees costs or margins.",
  },
  {
    topic: "Approvals",
    keywords: "approval approve reject decide two-person margin exception payment bank",
    text: "Approvals queue (Commercial → Approvals queue): every request that needs a named person — margin exceptions, quotations, payments, alternative items, bank-detail changes (two people: Finance and the CEO). Approve, or return with a reason; decisions are recorded under your name.",
  },
  {
    topic: "Customer PO and orders",
    keywords: "customer po purchase order mismatch amendment order confirm supplier po",
    text: "On a case's Order & purchasing tab: the customer's PO is checked line by line against the approved quotation; any mismatch blocks commitment until the customer agrees in writing. Then the sales order is confirmed and supplier POs are prepared, re-checked and approved.",
  },
  {
    topic: "Delivery",
    keywords: "delivery vessel eta port proof signed note shortage damage",
    text: "On a case's Delivery tab: drop-ship or warehouse routes, ETA changes, the port agent, and proof of delivery (the signed note). Shortages or damage noted on board become claims.",
  },
  {
    topic: "Invoices and collection",
    keywords: "invoice payment owe overdue collect reminder receivable payable e-invoice cash",
    text: 'Finance → Receivables & payables: what customers owe (by age) and what we owe suppliers. "Draft reminder" writes a collection email that respects each customer\'s contact rule; a person reviews and sends it. Invoices are issued from delivery, with Egyptian e-invoicing.',
  },
  {
    topic: "Insights",
    keywords: "dashboard control room briefing profit report kpi management",
    text: "Insights → Control room: the business live, with a 07:00 AI briefing. Each case's Profit tab shows actual against expected profit, FX differences and claims; a case closes only when everything reconciles.",
  },
  {
    topic: "Finding things",
    keywords: "search find where look up record command palette",
    text: "Press Ctrl+K (or /) for the search palette: pages, actions and records. Bookmarks, notifications, widgets and guided tours are in the side panel on the right.",
  },
];

/** What each role mostly does here (the helper's sense of who it's talking to). */
const ROLE_GUIDE: AssistantSettings["roles"] = {
  "supply-chain":
    "Supply chain & customer service: reads the inbox, creates cases, sends supplier RFQs and chases replies, compares offers, prices lines and prepares quotations.",
  sales:
    "Sales: owns customer relationships and quotations, follows customer decisions and POs, and grows accounts. Sales never sees costs or margins.",
  management:
    "Management approver: decides approvals (margin exceptions, payments, bank-detail changes), watches the control room, and steers by blockers, cash and profit.",
  "finance-director":
    "Finance: receivables and payables, collection reminders, payment approvals and bank-detail checks, invoices and e-invoicing.",
  operations: "Operations: supplier POs, receiving, deliveries to vessels, proof of delivery and claims.",
  "office-admin": "Office admin: the inbox, contacts, vendor registrations and documents.",
};

/** The in-app helper: its name, the business it works for, the platform guide and the roles. */
export const assistant: AssistantSettings = {
  name: "Golden Sea helper",
  business: "a ship chandler",
  guide: GUIDE,
  roles: ROLE_GUIDE,
  ask: "/ask",
};
