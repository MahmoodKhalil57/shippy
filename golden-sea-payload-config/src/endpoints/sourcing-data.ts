export interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
}

export interface ExtractedLine {
  lineNo: number;
  description: string;
  brand?: string;
  partNo?: string;
  impa?: string;
  issa?: string;
  qty: number;
  unit: string;
  store: string;
  source: string;
  confidence: number;
  brandRule: "Any" | "Preferred brand" | "Exact brand";
  flag?: string;
  originalText: string;
  product?: string;
}

export interface CaseDraft {
  caseType: "rfq" | "service";
  customer?: string;
  newCustomer?: { name: string; type: string; segment: string; country?: string; contactEmail?: string };
  vessel: string;
  vesselRecord?: string;
  port: string;
  eta?: string;
  deadline: string;
  currency: "USD" | "EGP" | "EUR";
  customerRef?: string;
  urgent?: boolean;
  owner: string;
  backup: string;
  rule: string;
  nextAction: string;
  service?: { awb: string; carrier: string; arrival: string; consolidateWith?: string };
}

export interface Scenario {
  header: ExtractedField[];
  lines: ExtractedLine[];
  missing: string[];
  clarification?: string;
  draft: CaseDraft;
  manualAck?: boolean;
  notes?: string[];
}

const NOW = Date.parse("2026-11-17T09:30:00.000Z");
const at = (hours: number) => new Date(NOW + hours * 3_600_000).toISOString();

export const SCENARIO_BY_ID: Record<string, string> = {
  "msg-helios-star": "helios-star",
  "msg-web-petro": "petro-web",
  "msg-awb": "aurora-awb",
};

export const SCENARIOS: Record<string, Scenario> = {
  "aurora-crest": {
    header: [
      { field: "Customer", value: "Nordvik Ship Management (sender domain + vessel record)", confidence: 0.97 },
      { field: "Vessel", value: "MV Aurora Crest", confidence: 0.99 },
      { field: "IMO", value: "9734512 (from the vessel record)", confidence: 0.96 },
      { field: "Port", value: "Alexandria", confidence: 0.94 },
      { field: "ETA", value: "Fri 20 Nov 2026 (“ETA Fri”, no time given)", confidence: 0.72 },
      { field: "Quote deadline", value: "Wed 18 Nov 09:30 (“within 24 h”)", confidence: 0.9 },
      { field: "Customer ref", value: "— not found in email or files", confidence: 0.2 },
      { field: "Currency", value: "USD (account default)", confidence: 0.62 },
    ],
    lines: [
      {
        lineNo: 1,
        description: "LOCTITE 243 threadlocker, medium strength, 50 ml",
        brand: "Loctite",
        partNo: "243",
        impa: "812561",
        issa: "75.112.43",
        qty: 12,
        unit: "pcs",
        store: "Engine stores",
        source: "RFQ_AuroraCrest.xlsx",
        confidence: 0.98,
        brandRule: "Exact brand",
        originalText: "LOCTITE 243 50ML (ORIGINAL ONLY) | 12 | PCS",
        product: "P2",
      },
      {
        lineNo: 2,
        description: "Coverall, flame retardant, navy, size L (EN ISO 11612)",
        impa: "190451",
        issa: "19.045.13",
        qty: 20,
        unit: "pcs",
        store: "Safety stores",
        source: "RFQ_AuroraCrest.xlsx",
        confidence: 0.95,
        brandRule: "Any",
        originalText: "COVERALL FR SIZE L | 20 | PCS",
      },
      {
        lineNo: 3,
        description: "Safety helmet EN 397, white, with chin strap",
        impa: "310102",
        issa: "31.010.21",
        qty: 15,
        unit: "pcs",
        store: "Safety stores",
        source: "deck_stores.pdf",
        confidence: 0.93,
        brandRule: "Any",
        originalText: "Safety helmet white c/w chin strap — 15 pcs",
      },
      {
        lineNo: 4,
        description: "Hydraulic oil ISO VG 46",
        impa: "450641",
        qty: 200,
        unit: "L",
        store: "Engine stores",
        source: "RFQ_AuroraCrest.xlsx",
        confidence: 0.91,
        brandRule: "Any",
        originalText: "HYD OIL VG46 | 200 | LTR",
      },
      {
        lineNo: 5,
        description: "Rope, polypropylene, 24 mm × 220 m coil",
        impa: "210624",
        issa: "21.062.40",
        qty: 4,
        unit: "coil",
        store: "Deck stores",
        source: "deck_stores.pdf",
        confidence: 0.88,
        brandRule: "Any",
        originalText: "PP rope 24mm — 4 coils",
      },
      {
        lineNo: 6,
        description: "Gasket sheet, as photo label",
        qty: 2,
        unit: "sheet",
        store: "Engine stores",
        source: "WhatsApp photo · label.jpg",
        confidence: 0.62,
        brandRule: "Any",
        flag: "Label partly unreadable: material and thickness unclear",
        originalText: "[photo of a gasket sheet label: “KLIN… 3mm? …1000×1500”]",
      },
    ],
    missing: ["Customer reference", "ETA time", "Line 6: gasket sheet material and thickness"],
    clarification:
      "Dear Purchasing desk,\n\nThank you for your RFQ for MV Aurora Crest — registered as {{caseId}}. To quote line 6 correctly, could you please confirm:\n • Gasket sheet: material (e.g. Klingersil C-4400?), thickness and sheet size — the photo label is partly unreadable.\n • Your requisition / reference number for the quotation.\n • The vessel's ETA time at Alexandria on Friday.\n\nAll other lines are being sourced now.\n\nBest regards,\n{{owner}} — Golden Sea for Trading & Marketing",
    draft: {
      caseType: "rfq",
      customer: "nordvik",
      vessel: "MV Aurora Crest",
      vesselRecord: "aurora-crest",
      port: "Alexandria",
      eta: "2026-11-20T06:00:00.000Z",
      deadline: at(24),
      currency: "USD",
      owner: "ky",
      backup: "sa",
      rule: "Nordvik Ship Management account → owner Karim Youssef, backup Soaad Amer",
      nextAction: "Send supplier RFQs (split by category) · clarify line 6",
    },
    notes: ["Lines 2 and 3 can also be checked against Alexandria stock before RFQs go out."],
  },

  "helios-star": {
    header: [
      { field: "Customer", value: "Helios Bulk Carriers", confidence: 0.99 },
      { field: "Vessel", value: "MV Helios Star", confidence: 0.98 },
      { field: "IMO", value: "9811204", confidence: 0.97 },
      { field: "Port", value: "Suez (northbound transit)", confidence: 0.93 },
      { field: "ETA", value: "19 Nov 2026", confidence: 0.9 },
      { field: "Quote deadline", value: "18 Nov 2026 12:00", confidence: 0.95 },
      { field: "Customer ref", value: "— not found", confidence: 0.2 },
      { field: "Currency", value: "— not stated (default USD)", confidence: 0.45 },
    ],
    lines: [
      {
        lineNo: 1,
        description: "Mechanical seal for main SW pump, Grundfos NB 65-200",
        brand: "Grundfos",
        partNo: "96534915",
        qty: 2,
        unit: "pcs",
        store: "Engine stores",
        source: "HeliosStar_engine_stores_RFQ.xlsx",
        confidence: 0.96,
        brandRule: "Exact brand",
        originalText: "Mechanical seal main SW pump Grundfos NB 65-200 p/n 96534915 – 2 pcs (original only)",
      },
      {
        lineNo: 2,
        description: "V-belt SPB 2360",
        partNo: "SPB2360",
        impa: "450102",
        qty: 6,
        unit: "pcs",
        store: "Engine stores",
        source: "HeliosStar_engine_stores_RFQ.xlsx",
        confidence: 0.94,
        brandRule: "Any",
        originalText: "V-belt SPB 2360 – 6 pcs",
      },
      {
        lineNo: 3,
        description: "Rags, white cotton",
        impa: "232001",
        qty: 50,
        unit: "kg",
        store: "Deck stores",
        source: "Email body",
        confidence: 0.92,
        brandRule: "Any",
        originalText: "Rags, white cotton – 50 kg",
      },
      {
        lineNo: 4,
        description: "Hand cleaner gel, 4.5 L",
        impa: "550211",
        qty: 4,
        unit: "can",
        store: "Cabin stores",
        source: "Email body",
        confidence: 0.88,
        brandRule: "Any",
        originalText: "Hand cleaner gel, 4.5 L – 4 cans",
      },
      {
        lineNo: 5,
        description: "Thermometer bi-metal 0–120 °C, 100 mm dial",
        qty: 2,
        unit: "pcs",
        store: "Engine stores",
        source: "Email body",
        confidence: 0.71,
        brandRule: "Any",
        flag: "Stem length and connection thread not given",
        originalText: "Thermometer bi-metal 0–120 °C, 100 mm dial – 2 pcs",
      },
    ],
    missing: ["Customer reference", "Currency", "Line 5: stem length and thread"],
    clarification:
      "Dear Chief Engineer,\n\nThank you for your RFQ for MV Helios Star — registered as {{caseId}}. Before we quote, please confirm:\n • Your requisition / reference number.\n • Quotation currency (we will quote USD unless advised).\n • Line 5 thermometer: stem length and connection thread.\n\nBest regards,\n{{owner}} — Golden Sea for Trading & Marketing",
    draft: {
      caseType: "rfq",
      customer: "helios",
      vessel: "MV Helios Star",
      vesselRecord: "helios-star",
      port: "Suez",
      eta: "2026-11-19T04:00:00.000Z",
      deadline: "2026-11-18T12:00:00.000Z",
      currency: "USD",
      urgent: true,
      owner: "sa",
      backup: "ky",
      rule: "Helios Bulk account → owner Soaad Amer, backup Karim Youssef · urgent: vessel arrives in 2 days",
      nextAction: "Send supplier RFQs today — Grundfos seal is exact brand",
    },
  },

  "petro-web": {
    header: [
      { field: "Customer", value: "Petro Delta (new — offshore)", confidence: 0.86 },
      { field: "Vessel", value: "Platform PD-3 (offshore Abu Qir)", confidence: 0.9 },
      { field: "IMO", value: "n/a — fixed platform", confidence: 0.95 },
      { field: "Port", value: "Abu Qir — by supply boat", confidence: 0.88 },
      { field: "ETA", value: "Delivery 24 Nov 2026", confidence: 0.92 },
      { field: "Quote deadline", value: "— not stated (set 19 Nov 12:00)", confidence: 0.3 },
      { field: "Customer ref", value: "— web form", confidence: 0.1 },
      { field: "Currency", value: "EGP (local customer)", confidence: 0.6 },
    ],
    lines: [
      {
        lineNo: 1,
        description: "SOLAS life jacket, adult, 150 N",
        brand: "Lalizas",
        partNo: "70925",
        impa: "330101",
        qty: 30,
        unit: "pcs",
        store: "Safety stores",
        source: "Website form",
        confidence: 0.93,
        brandRule: "Preferred brand",
        originalText: "30 SOLAS life jackets (Lalizas preferred)",
      },
      {
        lineNo: 2,
        description: "Lifebuoy with light & smoke signal",
        impa: "330201",
        qty: 6,
        unit: "pcs",
        store: "Safety stores",
        source: "Website form",
        confidence: 0.84,
        brandRule: "Any",
        originalText: "6 lifebuoys",
      },
    ],
    missing: ["Quote deadline", "New customer: contact details and credit terms"],
    clarification:
      "Dear Mr Hossam,\n\nThank you for your request through our website — registered as {{caseId}}. Could you please confirm by when you need our quotation, and the delivery contact for the supply boat at Abu Qir?\n\nBest regards,\n{{owner}} — Golden Sea for Trading & Marketing",
    draft: {
      caseType: "rfq",
      newCustomer: {
        name: "Petro Delta",
        type: "Offshore / oil & gas",
        segment: "Offshore",
        country: "Egypt",
        contactEmail: "purchasing@petro-delta.example",
      },
      vessel: "Platform PD-3",
      port: "Abu Qir",
      eta: "2026-11-24T08:00:00.000Z",
      deadline: "2026-11-19T12:00:00.000Z",
      currency: "EGP",
      owner: "ah",
      backup: "ky",
      rule: "New offshore customer from the website → owner Ahmedy (Alexandria office), contact created",
      nextAction: "Price life jackets from the Lalizas agency list; RFQ lifebuoys",
    },
    notes: ["Lalizas is a Golden Sea agency — life jackets are priced from the agency pricelist, no supplier RFQ."],
  },

  "baltic-word": {
    header: [
      { field: "Customer", value: "Baltic Reefer Management (prospect)", confidence: 0.97 },
      { field: "Vessel", value: "MV Polar Bay", confidence: 0.95 },
      { field: "IMO", value: "— not found", confidence: 0.1 },
      { field: "Port", value: "Alexandria", confidence: 0.92 },
      { field: "ETA", value: "≈ 26 Nov 2026", confidence: 0.66 },
      { field: "Quote deadline", value: "— not stated (set 20 Nov 12:00)", confidence: 0.2 },
      { field: "Customer ref", value: "REQ-PB-1125", confidence: 0.88 },
      { field: "Currency", value: "EUR", confidence: 0.98 },
    ],
    lines: [
      {
        lineNo: 1,
        description: "Galley detergent, 20 L",
        impa: "550612",
        qty: 6,
        unit: "can",
        store: "Cabin stores",
        source: "PolarBay_requisition_Nov.docx",
        confidence: 0.9,
        brandRule: "Any",
        originalText: "Galley detergent 20 ltr — 6 cans",
      },
      {
        lineNo: 2,
        description: "Toilet paper, 2-ply",
        impa: "150501",
        qty: 96,
        unit: "roll",
        store: "Cabin stores",
        source: "PolarBay_requisition_Nov.docx",
        confidence: 0.93,
        brandRule: "Any",
        originalText: "Toilet paper 2 ply — 96 rolls",
      },
      {
        lineNo: 3,
        description: "Cabin light bulb E27 LED 9 W",
        qty: 40,
        unit: "pcs",
        store: "Electrical stores",
        source: "PolarBay_requisition_Nov.docx",
        confidence: 0.62,
        brandRule: "Any",
        flag: "Colour temperature not stated",
        originalText: "Bulb E27 LED 9w x 40",
      },
    ],
    missing: ["IMO number", "Quote deadline", "Line 3: colour temperature"],
    clarification:
      "Dear Superintendent,\n\nThank you for requisition REQ-PB-1125 for MV Polar Bay — registered as {{caseId}}. Please confirm the vessel's IMO number, the date you need our quotation by, and the colour temperature for the E27 LED bulbs (warm / cool white).\n\nBest regards,\n{{owner}} — Golden Sea for Trading & Marketing",
    draft: {
      caseType: "rfq",
      newCustomer: { name: "Baltic Reefer Management", type: "Ship manager", segment: "Marine", country: "Latvia" },
      vessel: "MV Polar Bay",
      port: "Alexandria",
      eta: "2026-11-26T06:00:00.000Z",
      deadline: "2026-11-20T12:00:00.000Z",
      currency: "EUR",
      customerRef: "REQ-PB-1125",
      owner: "sa",
      backup: "ky",
      rule: "New prospect (Baltic Reefer, growth pipeline) → owner Soaad Amer, backup Karim Youssef",
      nextAction: "Confirm IMO & deadline; RFQ cabin stores",
    },
  },

  "atlas-whatsapp": {
    header: [
      { field: "Customer", value: "Atlas Tankers (from the sender's number)", confidence: 0.8 },
      { field: "Vessel", value: "MT Atlas Pearl", confidence: 0.9 },
      { field: "IMO", value: "9755001 (from the fleet record)", confidence: 0.85 },
      { field: "Port", value: "Alexandria", confidence: 0.9 },
      { field: "ETA", value: "28 Nov 2026", confidence: 0.84 },
      { field: "Quote deadline", value: "“asap” → set 19 Nov 12:00", confidence: 0.4 },
      { field: "Customer ref", value: "— none (WhatsApp)", confidence: 0.1 },
      { field: "Currency", value: "USD (account default)", confidence: 0.7 },
    ],
    lines: [
      {
        lineNo: 1,
        description: "Rope polypropylene 24 mm × 220 m",
        impa: "210624",
        qty: 2,
        unit: "coil",
        store: "Deck stores",
        source: "whatsapp_IMG_2207.jpg",
        confidence: 0.74,
        brandRule: "Any",
        originalText: "PP rope 24 — 2 coil",
      },
      {
        lineNo: 2,
        description: "Padlock, brass, 50 mm",
        qty: 10,
        unit: "pcs",
        store: "Deck stores",
        source: "whatsapp_IMG_2207.jpg",
        confidence: 0.58,
        brandRule: "Any",
        flag: "Handwriting: quantity could be 10 or 16",
        originalText: "padlock 50 brass — 10 (16?)",
      },
      {
        lineNo: 3,
        description: 'Paint brush 3"',
        impa: "270403",
        qty: 24,
        unit: "pcs",
        store: "Deck stores",
        source: "whatsapp_IMG_2207.jpg",
        confidence: 0.81,
        brandRule: "Any",
        originalText: 'brush 3" — 24',
      },
    ],
    missing: ["Quote deadline", "4 handwritten lines illegible — ask for a typed list"],
    clarification:
      "Dear Capt. Nikos,\n\nThank you for the list for MT Atlas Pearl ({{caseId}}). Four lines on the photo are hard to read — could you send them typed, and confirm the padlock quantity (10 or 16)?\n\nBest regards,\n{{owner}} — Golden Sea",
    draft: {
      caseType: "rfq",
      customer: "atlas",
      vessel: "MT Atlas Pearl",
      vesselRecord: "atlas-pearl",
      port: "Alexandria",
      eta: "2026-11-28T06:00:00.000Z",
      deadline: "2026-11-19T12:00:00.000Z",
      currency: "USD",
      owner: "ky",
      backup: "ah",
      rule: "Atlas Tankers account → owner Karim Youssef, backup Ahmedy",
      nextAction: "Ask the captain for a typed list; RFQ deck stores",
    },
    manualAck: true,
    notes: ["WhatsApp source: the owner sends the acknowledgement by hand."],
  },

  "aurora-awb": {
    header: [
      { field: "Request", value: "Spare-parts clearance & forwarding (not an RFQ)", confidence: 0.95 },
      { field: "Customer", value: "Nordvik Ship Management", confidence: 0.97 },
      { field: "Vessel", value: "MV Aurora Crest", confidence: 0.98 },
      { field: "AWB", value: "41 2233 9081 (DHL)", confidence: 0.99 },
      { field: "Arrival", value: "Cairo airport 19 Nov", confidence: 0.9 },
      { field: "Deliver with", value: "GS-RFQ-0142 (same vessel & call)", confidence: 0.88 },
    ],
    lines: [],
    missing: ["Commercial invoice and packing list (for customs)"],
    clarification:
      "Dear Capt. Erik,\n\nWe will clear AWB 41 2233 9081 as ship spares in transit and deliver it on board with the stores of GS-RFQ-0142. Please send the commercial invoice, packing list and the vessel's letter for customs.\n\nBest regards,\n{{owner}} — Golden Sea",
    draft: {
      caseType: "service",
      customer: "nordvik",
      vessel: "MV Aurora Crest",
      vesselRecord: "aurora-crest",
      port: "Port Said",
      eta: "2026-11-21T00:00:00.000Z",
      deadline: "2026-11-19T15:00:00.000Z",
      currency: "USD",
      owner: "ah",
      backup: "ky",
      rule: "Clearance & forwarding → owner Ahmedy (operations), backup Karim Youssef",
      nextAction: "Collect invoice & packing list; submit customs declaration",
      service: {
        awb: "41 2233 9081",
        carrier: "DHL",
        arrival: "2026-11-19T06:10:00.000Z",
        consolidateWith: "gs-rfq-0142",
      },
    },
  },
};

export const SIMULATED_RFQ = {
  channel: "Email",
  mailbox: "sales@",
  from: "purchasing@nordvik.example",
  fromName: "Nordvik Ship Management · Purchasing desk",
  subject: "RFQ · MV Aurora Crest · Alexandria · ETA Fri",
  body: "Dear Golden Sea,\n\nPlease quote the attached list for delivery on board at Alexandria.\nExact brand only for Loctite.\n\nQuote needed within 24 h.\n\nBest regards,\nPurchasing desk",
  files: [
    { name: "RFQ_AuroraCrest.xlsx", kind: "Excel", note: "4 lines" },
    { name: "deck_stores.pdf", kind: "PDF", note: "2 pages" },
    { name: "WhatsApp photo · label.jpg", kind: "Image", note: "OCR" },
  ],
  attachmentHash: "sha256:a7c3e91d…aurora-crest-rfq",
  classification: "New RFQ",
  status: "New",
  scenario: "aurora-crest",
};

export const SIMULATED_FORWARD = {
  channel: "Email",
  mailbox: "purchasing@",
  from: "superintendent@nordvik.example",
  fromName: "Capt. Erik H. (Nordvik)",
  subject: "FW: RFQ · MV Aurora Crest · Alexandria · ETA Fri",
  body: "Karim — forwarding in case you didn't get it. Same list as Purchasing sent this morning.\n\n---------- Forwarded message ----------\nPlease quote the attached list for delivery on board at Alexandria.",
  files: [
    { name: "RFQ_AuroraCrest.xlsx", kind: "Excel", note: "identical file" },
    { name: "deck_stores.pdf", kind: "PDF", note: "identical file" },
  ],
  attachmentHash: "sha256:a7c3e91d…aurora-crest-rfq",
  classification: "Duplicate",
  status: "New",
};

export const SIMULATED_REPLY = {
  channel: "Email",
  mailbox: "purchasing@",
  from: "sales@psweld.example",
  fromName: "Port Said Welding Co.",
  subject: "electrodes – our best price",
  body: "Dear Karim,\n\nFor your ref GS-SRFQ-0142-E:\nE6013 3.2mm, 5 kg box — 980 LE per box, 4 boxes available.\nDelivery Port Said 3 days. Cash. Mill certificate OK.\nOffer valid 7 days.\n\nRegards,\nMohamed — Port Said Welding",
  classification: "Supplier reply",
  status: "New",
};

export interface HistoryMailbox {
  mailbox: string;
  provider: "Outlook" | "Gmail" | "WhatsApp";
  from: number;
  to: number;
  emails: number;
  attachments: number;
}

export const HISTORY_MAILBOXES: HistoryMailbox[] = [
  { mailbox: "sales@goldensea.com.eg", provider: "Outlook", from: 2019, to: 2026, emails: 18_420, attachments: 9_240 },
  {
    mailbox: "purchasing@goldensea.com.eg",
    provider: "Outlook",
    from: 2019,
    to: 2026,
    emails: 12_960,
    attachments: 7_115,
  },
  {
    mailbox: "karim.youssef@ (own mailbox)",
    provider: "Outlook",
    from: 2021,
    to: 2026,
    emails: 7_340,
    attachments: 3_020,
  },
  { mailbox: "Gmail · purchasing intake", provider: "Gmail", from: 2023, to: 2026, emails: 2_185, attachments: 1_460 },
  {
    mailbox: "WhatsApp chat exports (2 phones)",
    provider: "WhatsApp",
    from: 2022,
    to: 2026,
    emails: 1_240,
    attachments: 880,
  },
];

export const HISTORY_PER_YEAR = {
  labels: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  values: [3_120, 3_460, 4_380, 5_210, 5_960, 6_420, 7_080, 6_515],
};

export const HISTORY_DEDUP = [
  { label: "Same email in several mailboxes (CC / shared)", count: 6_980 },
  { label: "Forwarded copies (same attachment hash)", count: 1_412 },
  { label: "Newsletters, auto-replies, spam", count: 3_105 },
  { label: "Held back as confidential (HR, bank, personal)", count: 23 },
];

export const HISTORY_TOTALS = {
  customers: 86,
  vessels: 412,
  suppliers: 214,
  prices: 31_580,
  pricesWithoutPo: 21_940,
  rfqThreads: 4_960,
  quotations: 3_140,
};

export const HISTORY_CUSTOMERS = [
  { name: "Nordvik Ship Management", country: "Norway", years: "2019–2026", rfqs: 214, vessels: 18, known: true },
  { name: "Helios Bulk Carriers", country: "Greece", years: "2020–2026", rfqs: 131, vessels: 9, known: true },
  { name: "Atlas Tankers", country: "Greece", years: "2021–2026", rfqs: 77, vessels: 6, known: true },
  { name: "Mare Nostrum Shipping", country: "Italy", years: "2022–2026", rfqs: 52, vessels: 5, known: true },
  { name: "Baltic Reefer Management", country: "Latvia", years: "2024–2025", rfqs: 6, vessels: 3, known: false },
];

export const HISTORY_VESSELS = [
  {
    name: "MV Aurora Crest",
    imo: "9734512",
    fleet: "Nordvik Ship Management",
    ports: "Port Said · Suez",
    calls: 23,
    known: true,
  },
  { name: "MV Helios Star", imo: "9811204", fleet: "Helios Bulk Carriers", ports: "Suez", calls: 14, known: true },
  { name: "MT Atlas Pearl", imo: "9755001", fleet: "Atlas Tankers", ports: "Alexandria", calls: 11, known: true },
  {
    name: "MV Polar Bay",
    imo: "9651198",
    fleet: "Baltic Reefer Management",
    ports: "Alexandria",
    calls: 4,
    known: false,
  },
  {
    name: "MV Polar Star",
    imo: "9651203",
    fleet: "Baltic Reefer Management",
    ports: "Alexandria · Damietta",
    calls: 2,
    known: false,
  },
];

export const HISTORY_SUPPLIERS = [
  {
    name: "Delta Marine Stores",
    city: "Alexandria",
    quoted: 2_310,
    ordered: 1_140,
    categories: "Chemicals · deck & engine",
    known: true,
  },
  {
    name: "Suez Industrial Supply",
    city: "Suez",
    quoted: 1_420,
    ordered: 610,
    categories: "Chemicals · adhesives",
    known: true,
  },
  { name: "Port Said Welding Co.", city: "Port Said", quoted: 380, ordered: 155, categories: "Welding", known: true },
  {
    name: "Canal Ropes & Rigging",
    city: "Port Said",
    quoted: 64,
    ordered: 0,
    categories: "Deck stores · ropes",
    known: false,
    domain: "canalropes.example",
  },
  {
    name: "Damietta Paints & Coatings",
    city: "Damietta",
    quoted: 41,
    ordered: 0,
    categories: "Paints",
    known: false,
    domain: "dampaints.example",
  },
];

export const HISTORY_PRICES = [
  {
    item: "CRC Belt Grip spray 400 ml",
    product: "P1",
    supplier: "Delta Marine Stores",
    price: 690,
    currency: "EGP",
    per: "EA",
    quotedAt: "2024-03-12T00:00:00.000Z",
    validDays: 7,
    ordered: false,
  },
  {
    item: "LOCTITE 243 threadlocker 50 ml",
    product: "P2",
    supplier: "Suez Industrial Supply",
    price: 1_850,
    currency: "EGP",
    per: "EA",
    quotedAt: "2025-06-03T00:00:00.000Z",
    validDays: 14,
    ordered: true,
  },
  {
    item: "Welding electrodes E6013 3.2 mm, 5 kg",
    product: "P4",
    supplier: "Port Said Welding Co.",
    price: 870,
    currency: "EGP",
    per: "Pack 5 kg",
    quotedAt: "2025-01-14T00:00:00.000Z",
    validDays: 7,
    ordered: false,
  },
  {
    item: "Rope PP 24 mm × 220 m",
    supplier: "Canal Ropes & Rigging",
    price: 3_450,
    currency: "EGP",
    per: "Coil",
    quotedAt: "2025-09-21T00:00:00.000Z",
    validDays: 10,
    ordered: false,
  },
  {
    item: "Anti-fouling paint, 20 L",
    supplier: "Damietta Paints & Coatings",
    price: 6_200,
    currency: "EGP",
    per: "Can 20 L",
    quotedAt: "2025-04-02T00:00:00.000Z",
    validDays: 30,
    ordered: false,
  },
];

export const HISTORY_UNCERTAIN = [
  {
    key: "hany-gmail",
    kind: "Supplier",
    mailbox: "purchasing@",
    receivedAt: "2022-05-18T10:12:00.000Z",
    from: "hany.sx@gmail.example",
    fromName: "Hany S.",
    subject: "prices as discussed (41 similar emails, 2021–2023)",
    question: "41 quotes came from a personal Gmail address signed “Hany S.”",
    proposal: "Same person as Delta Marine Stores' contact Hany S. — file these prices under Delta Marine Stores",
    confidence: 0.74,
  },
  {
    key: "nordic-star",
    kind: "Vessel",
    mailbox: "sales@",
    receivedAt: "2021-09-02T07:40:00.000Z",
    from: "purchasing@nordvik.example",
    fromName: "Nordvik Ship Management",
    subject: "RFQ MV Nordic Star — Suez transit",
    question: "“MV Nordic Star” (until 2022) and “MV Aurora Crest” have the same IMO 9734512",
    proposal: "One vessel, renamed in 2022 — keep “Nordic Star” as a former name of MV Aurora Crest",
    confidence: 0.81,
  },
  {
    key: "loctite-currency",
    kind: "Price",
    mailbox: "purchasing@",
    receivedAt: "2024-03-11T13:05:00.000Z",
    from: "sales@suez-industrial.example",
    fromName: "Suez Industrial Supply",
    subject: "RE: loctite",
    question: "LOCTITE 243 quoted at “1,950” on 11 Mar 2024 — no currency stated",
    proposal: "EGP 1,950 per piece (this supplier always quotes EGP; USD would be 40× the market)",
    confidence: 0.68,
  },
  {
    key: "petro-delta",
    kind: "Customer",
    mailbox: "sales@",
    receivedAt: "2025-07-08T09:00:00.000Z",
    from: "purchasing@petro-delta.example",
    fromName: "Petro Delta",
    subject: "Enquiry — safety equipment for PD-3",
    question: "“Petro Delta” enquiries (2025) look similar to “Delta Offshore Services”",
    proposal: "Different companies — add Petro Delta as a new customer (offshore, Abu Qir)",
    confidence: 0.57,
  },
  {
    key: "personal-thread",
    kind: "Confidential",
    mailbox: "purchasing@",
    receivedAt: "2023-02-14T15:30:00.000Z",
    from: "staff@goldensea.example",
    fromName: "Staff member",
    subject: "Salary advance — personal",
    question: "A personal / HR thread was found in the purchasing mailbox",
    proposal: "Exclude it — personal and HR emails are never imported",
    confidence: 0.9,
  },
  {
    key: "bluefin",
    kind: "Customer",
    mailbox: "sales@",
    receivedAt: "2022-11-29T11:20:00.000Z",
    from: "ops@bluefin-shipping.example",
    fromName: "Bluefin Shipping",
    subject: "Quote request",
    question: "“Bluefin Shipping” asked for 3 quotes in 2022 — never answered, no vessel named",
    proposal: "Keep as a prospect in the growth CRM (not a customer)",
    confidence: 0.55,
  },
];
