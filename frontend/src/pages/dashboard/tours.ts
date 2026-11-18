/**
 * Guided tours: one per demo scenario, started from the side panel's Tours section and played by
 * `<dashboard-tour>` (./tour.ts). A step can sign in as another user first (`as`), so one tour can
 * show how people hand work to each other — the buyer prepares, the CEO approves, sales sends.
 */

/** What to spotlight: the smallest element matching `sel` (default: a card) whose text includes `text`. */
export interface TourTarget {
  text: string;
  sel?: string;
}

export interface TourStep {
  /** Sign in as this seeded user (id, e.g. "kb") before the step. */
  as?: string;
  /** Go to this dashboard path before the step. */
  go?: string;
  /** Open a side column first (its sections hold the target). */
  open?: "aside" | "nav";
  /** Click the button or link whose text includes this, then wait for the page to react. */
  click?: string;
  /** Milliseconds to wait after the click (default 900: AI steps "read" for about a second). */
  wait?: number;
  target?: TourTarget;
  title: string;
  body: string;
}

export interface Tour {
  id: string;
  title: string;
  /** One line under the title in the Tours section. */
  summary: string;
  steps: TourStep[];
}

const card = (text: string): TourTarget => ({ text });
/** A table row containing `text`. */
export const row = (text: string): TourTarget => ({ text, sel: "tr" });

export const TOURS: Tour[] = [
  {
    id: "morning",
    title: "One morning, four people",
    summary: "The buyer, sales, the CEO and finance start their day — each sees only what needs them.",
    steps: [
      {
        as: "ky",
        go: "/",
        title: "Every role has its own day",
        body: "This is Karim Youssef, supply chain. Golden Sea's dashboard is built for the person signed in: his waiting states, his queue, his follow-ups.",
      },
      {
        target: card("My queue"),
        title: "A queue sorted by risk",
        body: "Every live case has an owner, a deadline and a next action. Blocked and at-risk cases come first, then the nearest deadline.",
      },
      {
        target: card("Daily briefing"),
        title: "Briefed at 07:00",
        body: "What changed overnight and what needs him today: deadlines, a PO mismatch, a supplier that hasn't replied, failed integrations.",
      },
      {
        as: "sa",
        go: "/",
        target: card("My queue"),
        title: "Sales sees the same cases — without costs",
        body: "Soaad Amer signs in. Her queue has no values, costs or margins: sales never sees what Golden Sea pays its suppliers.",
      },
      {
        as: "kb",
        go: "/",
        target: card("Waiting for your decision"),
        title: "The CEO starts with decisions",
        body: "Karim Balbaa sees what waits for him first — a margin exception from Soaad, a supplier deposit, an FX rate, and a bank change that already has one of its two approvals.",
      },
      {
        as: "mh",
        go: "/",
        target: card("Waiting for your decision"),
        title: "Finance approves payments",
        body: "Mohamed Helmy only sees payments and deposits. He already approved the bank change after a call-back; it now waits for the CEO — two people, always.",
      },
      {
        as: "ky",
        go: "/",
        open: "aside",
        target: { text: "Notifications", sel: "dashboard-aside li" },
        title: "Everyone's own notifications",
        body: "Notifications, bookmarks and the counters in this panel belong to the person signed in. Back as Karim Youssef — his are about his cases.",
      },
    ],
  },
  {
    id: "rfq-to-case",
    title: "Any format in, one case out",
    summary: "An RFQ email with Excel, PDF and a photo becomes one clean case — AI reads, a person decides.",
    steps: [
      {
        as: "ky",
        go: "/inbox",
        target: card("Connected channels"),
        title: "One inbox for every channel",
        body: "Outlook, Gmail, the website quick-quote form and WhatsApp all land in one list — nothing lives in someone's personal mailbox.",
      },
      {
        click: "Simulate new email",
        target: card("Original message"),
        title: "The original is kept",
        body: "A new RFQ for MV Aurora Crest arrives with an Excel list, a PDF and a WhatsApp photo. The email and every file stay with the case.",
      },
      {
        click: "Extract with AI",
        wait: 1800,
        target: card("Draft lines"),
        title: "AI reads, people decide",
        body: "Every line gets its IMPA code, quantity, unit and the file it came from, with a confidence. The 62% photo line is flagged for a person.",
      },
      {
        target: card("Missing or unclear"),
        title: "Nothing is guessed",
        body: "Missing details become a drafted clarification to the customer — drafted, not sent.",
      },
      {
        target: card("Owner, backup and deadline"),
        title: "Owner, backup, deadline",
        body: "Assignment rules suggest who owns it and who backs them up; the deadline comes from the customer's request.",
      },
      {
        target: card("Create the case"),
        title: "One click to a case",
        body: "Confirming creates the case with its lines, links the email and sends one branded acknowledgement.",
      },
    ],
  },
  {
    id: "replies",
    title: "Every reply matched, every price remembered",
    summary: "Supplier RFQs go out without the client's name; replies are matched even with new subjects.",
    steps: [
      {
        as: "ky",
        go: "/collections/cases/gs-rfq-0142/rfqs",
        target: card("Supplier RFQs"),
        title: "The client stays hidden",
        body: "Lines are split by category and each supplier sees only its lines — never the customer or the vessel.",
      },
      {
        click: "Simulate replies",
        wait: 2500,
        target: card("Replies arriving"),
        title: "Matched by reference",
        body: "Replies arrive with changed subjects; each is matched to its RFQ by its reference, and reminders stop for that supplier.",
      },
      {
        target: card("New suppliers saved"),
        title: "Remembered without an order",
        body: "A supplier Golden Sea never bought from replied. It's created automatically, with its price, date and validity.",
      },
      {
        target: card("Needs a person"),
        title: "A person confirms the uncertain",
        body: "An unclear price unit isn't used until someone confirms it.",
      },
      {
        as: "kb",
        go: "/inbox-history",
        target: card("Import approval"),
        title: "Years of email, organised",
        body: "The same engine reads the old inboxes into customers, vessels, suppliers and dated prices. Nothing is saved until Karim Balbaa approves.",
      },
    ],
  },
  {
    id: "quote",
    title: "From offers to an approved quotation",
    summary: "The buyer compares and prices, the CEO approves, the customer gets Golden Sea's own layout.",
    steps: [
      {
        as: "ky",
        go: "/collections/cases/gs-rfq-0142/compare",
        click: "Landed cost",
        target: card("How offers are compared"),
        title: "Cheapest isn't always cheapest on board",
        body: "Every offer is normalised to EGP per base unit. Switch to landed cost and freight to Port Said re-ranks them.",
      },
      {
        target: card("L2 · LOCTITE 243"),
        title: "The wrong part is caught",
        body: "242 was offered for an exact-part 243 line, so the line is blocked from pricing. v1 is kept for the record; the corrected v2 is used.",
      },
      {
        target: card("L5 · Safety helmet"),
        title: "Own stock and split sourcing",
        body: "Alexandria stock is cheapest per unit but dearest delivered. The proposal splits 10 + 5 across two suppliers, both before the vessel's ETA.",
      },
      {
        go: "/collections/cases/gs-rfq-0142/pricing",
        target: card("Margin vs markup"),
        title: "Margin, not markup",
        body: "Shared charges are spread over the lines; policy is checked on margin, and every line shows cost, charges and profit.",
      },
      {
        target: card("Approval"),
        title: "A person approves",
        body: "The quotation and its exceptions go to Karim Balbaa with one click. AI never prices on its own.",
      },
      {
        as: "kb",
        go: "/approvals",
        target: card("Waiting for you"),
        title: "Evidence first",
        body: "Karim Balbaa sees what he's deciding and why — the margin, the FX rate, the deposit, and the bank change Mohamed Helmy already approved.",
      },
      {
        go: "/collections/quotations/q-0142-v1/preview",
        click: "العربية",
        target: card("Decision state"),
        title: "Their layout, their language",
        body: "The same quotation in Golden Sea's own layout, in English or Arabic, in EGP or USD. Nothing goes to the customer until a person confirms the email.",
      },
    ],
  },
  {
    id: "po-check",
    title: "The PO doesn't match the quote",
    summary: "A customer PO with an old price and the wrong quantity is caught before anything is ordered.",
    steps: [
      {
        as: "ky",
        go: "/collections/cases/gs-rfq-0136/order",
        target: card("Customer PO check"),
        title: "The PO is checked line by line",
        body: "Nordvik's PO is matched to the approved quotation version. An old pack size, an expired v1 price and 15 instead of 10 helmets block the commitment until the customer agrees in writing.",
      },
      {
        target: card("Partial award"),
        title: "Partial awards, never silent",
        body: "Lines the customer didn't order stay open for a revision or close with a recorded reason.",
      },
      {
        target: card("Supplier purchase orders"),
        title: "Purchase orders per supplier",
        body: "Once the PO is agreed, supplier POs are prepared — drop-shipped or through the warehouse — and each is re-checked against the latest offer first.",
      },
      {
        target: card("Supplier bills"),
        title: "Three-way match",
        body: "Each supplier bill is matched to its PO and the goods received; a duplicate bill is refused.",
      },
      {
        as: "kb",
        target: card("Supplier purchase orders"),
        title: "Karim Balbaa confirms",
        body: "Signed in as the CEO: a flagged price change on a supplier PO is shown before he commits, and deposits wait for a payment approval.",
      },
    ],
  },
  {
    id: "delivery-to-cash",
    title: "From the quay to the bank",
    summary: "An ETA change re-plans the delivery, proof of delivery unlocks the invoice, finance collects and pays.",
    steps: [
      {
        as: "ah",
        go: "/collections/cases/gs-rfq-0133/delivery",
        target: card("Vessel delivery plan"),
        title: "The vessel moves, the plan follows",
        body: "Port, ETA, agent, truck, boarding staff and launch in one plan. When the agent moves the ETA, drop 2 is re-planned and the owner is alerted.",
      },
      {
        target: card("Drops & proof of delivery"),
        title: 'No evidence, no "Delivered"',
        body: "Two drops for one order. A drop counts as delivered only with the signed delivery note from the vessel.",
      },
      {
        target: card("Customer invoices & payments"),
        title: "Invoice what was delivered, then e-invoice",
        body: "Only delivered quantities are invoiced, each invoice goes to the Egyptian tax authority, and rejections or outages get a safe retry.",
      },
      {
        as: "mh",
        go: "/cash",
        target: card("Payments needing approval"),
        title: "A person approves, finance pays",
        body: "Receivables and payables side by side. Supplier payments wait for the Financial Director or the CEO.",
      },
      {
        as: "kb",
        go: "/cash",
        target: card("Bank-detail change"),
        title: "Two different people, always",
        body: "A supplier's new bank account needs a call-back on the number on file and two approvers — Finance and the CEO.",
      },
    ],
  },
  {
    id: "handover",
    title: "Handover without losing anything",
    summary: "One case from first email to last payment, and a handover AI drafts for a person to confirm.",
    steps: [
      {
        as: "ky",
        go: "/collections/cases/gs-rfq-0142/overview",
        target: card("Lifecycle"),
        title: "One case, sixteen steps",
        body: "From the first email to the last payment, everything happens on one case. GS-RFQ-0142 is comparing offers.",
      },
      {
        target: card("Line progress"),
        title: "Never complete too early",
        body: "Three of six lines are ready and one is blocked by a clarification — a case only looks done when every line is.",
      },
      {
        target: card("Owner & backup"),
        title: "AI drafts the handover",
        body: "Reassigning asks AI for a handover note — open questions, tasks, the customer's contact rule. A person edits and confirms it.",
      },
      {
        target: card("Activity timeline"),
        title: "Every step logged",
        body: "Automatic steps name the rule that fired; human steps name the person. That's the audit trail.",
      },
    ],
  },
  {
    id: "exceptions",
    title: "Nothing fails silently",
    summary: "A failed mailbox and a low-confidence AI result, handled safely; urgent RFQs reach the on-duty person.",
    steps: [
      {
        as: "kb",
        go: "/automations",
        target: card("Exception queue"),
        title: "Failures are visible",
        body: "An expired Outlook token and an unreachable e-invoice signing service sit in a queue with an owner — not in a log nobody reads.",
      },
      {
        target: card("AI review queue"),
        title: "Low confidence waits for a person",
        body: "Uncertain AI results are never applied automatically; someone reviews them here.",
      },
      {
        target: card("Rule registry"),
        title: "Every automation is explicit",
        body: "Trigger, owner, due time, approval, retry behaviour and stop condition for each rule — switched on and off by management, and logged.",
      },
      {
        go: "/roles",
        target: card("After-hours routing"),
        title: "Urgent RFQs after hours",
        body: "Outside Sunday–Thursday office hours, urgent RFQs go to the on-duty person, with a backup if nobody answers.",
      },
    ],
  },
  {
    id: "close",
    title: "Settle and close a case",
    summary: "Estimates become actuals, FX and claims are accounted for, and only green checks close the case.",
    steps: [
      {
        as: "mh",
        go: "/collections/cases/gs-rfq-0131/profit",
        target: card("Expected vs actual"),
        title: "Estimates become actuals",
        body: "The profit promised at quotation against the real result: the launch cost more than estimated once it was billed.",
      },
      {
        target: card("FX differences"),
        title: "FX is real money",
        body: "USD 10,000 arrived at 48.80 against the quoted 48.60 — a gain of EGP 2,000, on the case where it happened.",
      },
      {
        target: card("Claims"),
        title: "Claims settle against credit notes",
        body: "Two helmets cracked in transit; the supplier's credit note settles the claim.",
      },
      {
        target: card("Close checklist"),
        title: "Only green closes",
        body: "Bills matched, deliveries signed, invoices accepted by the tax authority and paid, claims settled — then the case can close.",
      },
    ],
  },
  {
    id: "control-room",
    title: "The business, live — briefed at 07:00",
    summary: "The CEO's control room and Ask Golden Sea — and what Sales is never told.",
    steps: [
      {
        as: "kb",
        go: "/control-room",
        target: card("daily AI briefing"),
        title: "Briefed before coffee",
        body: "Written at 07:00 from live records, with links to its sources.",
      },
      {
        click: "Who owes us money?",
        wait: 1600,
        target: card("Ask Golden Sea"),
        title: "Ask anything",
        body: "Questions are answered from the live data, and every answer cites the records it used.",
      },
      {
        target: card("Margin by store"),
        title: "Policy in the numbers",
        body: "Margin by store against the 15% minimum, plus pipeline, speed, cash and supplier performance.",
      },
      {
        as: "sa",
        go: "/control-room",
        target: card("Ask Golden Sea"),
        title: "Sales never sees margins",
        body: "Signed in as Soaad Amer, the same assistant declines questions about costs and margins.",
      },
    ],
  },
  {
    id: "growth",
    title: "Growing the customer base",
    summary: "Prospects, fleets and vendor registrations — with what to say on the next call.",
    steps: [
      {
        as: "sa",
        go: "/growth",
        target: card("Prospects by stage"),
        title: "A pipeline beyond RFQs",
        body: "Ship managers from first introduction to active account; stalled prospects are flagged.",
      },
      {
        target: card("Sales next steps"),
        title: "Know what to say",
        body: "Each next step has a short script. Recording the outcome plans the next one.",
      },
      {
        target: card("Vendor registrations"),
        title: "Registrations tracked",
        body: "Documents and committee dates for getting onto each ship manager's approved-vendor list.",
      },
    ],
  },
];

/** A tour's steps that change user, as names for the Tours list ("ky → kb → mh"). */
export const tourCast = (t: Tour) => [...new Set(t.steps.map((s) => s.as).filter((x): x is string => !!x))];
