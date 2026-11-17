/* Mock data for the Golden Sea Sourcing Desk demo.
   Every customer, vessel, supplier, price and person outside Golden Sea is fictional. */

window.GS = {
  today: "2026-11-17",
  vat: 0.14,
  fx: { EGP: 1, USD: 48.6, EUR: 52.9 },
  fxApproved: "Approved by Karim Balbaa · 16 Nov 2026 · source: CBE mid-rate + 0.5% buffer",
  fxHistory: [
    { cur: "USD", rate: 48.6, date: "16 Nov 2026", source: "CBE mid + 0.5%", by: "Karim Balbaa", status: "Active" },
    { cur: "EUR", rate: 52.9, date: "16 Nov 2026", source: "CBE mid + 0.5%", by: "Karim Balbaa", status: "Active" },
    { cur: "USD", rate: 48.95, date: "17 Nov 2026", source: "CBE mid + 0.5%", by: "Proposed by Ahmedy", status: "Awaiting approval" },
    { cur: "USD", rate: 48.3, date: "09 Nov 2026", source: "CBE mid + 0.5%", by: "Karim Balbaa", status: "Superseded" },
  ],

  users: {
    ky: { name: "Karim Youssef", initials: "KY", role: "Supply chain & customer service" },
    kb: { name: "Karim Balbaa", initials: "KB", role: "Management approver" },
    sa: { name: "Soaad Amer", initials: "SA", role: "Sales" },
    ah: { name: "Ahmedy", initials: "AH", role: "Operations & finance" },
    mb: { name: "sales@ mailbox", initials: "@", role: "Shared sales mailbox" },
  },

  suppliers: {
    S1: { name: "Delta Marine Stores", city: "Alexandria", cats: ["Chemicals", "Deck & engine stores", "Welding", "Safety & PPE"], status: "Approved", replyHrs: 6, onTime: 94, compliance: 98, rfqs: 41, pos: 23, terms: "30 days", cur: "EGP", contact: "Hany S. · +20 10 0000 1101" },
    S2: { name: "Suez Industrial Supply", city: "Suez", cats: ["Chemicals", "Adhesives"], status: "Approved", replyHrs: 14, onTime: 88, compliance: 91, rfqs: 27, pos: 11, terms: "15 days", cur: "EGP", contact: "Mona A. · +20 10 0000 1102" },
    S3: { name: "Port Said Welding Co.", city: "Port Said", cats: ["Welding"], status: "Approved", replyHrs: 30, onTime: 81, compliance: 95, rfqs: 12, pos: 6, terms: "Cash", cur: "EGP", contact: "Sherif K. · +20 10 0000 1103" },
    S4: { name: "Nile Safety Equipment", city: "Cairo", cats: ["Safety & PPE"], status: "Approved", replyHrs: 9, onTime: 97, compliance: 100, rfqs: 19, pos: 12, terms: "30 days", cur: "EGP", contact: "Rania F. · +20 10 0000 1104" },
    S5: { name: "Horizon Trading", city: "Damietta", cats: ["Chemicals"], status: "New · quoted, never ordered", replyHrs: 3, onTime: null, compliance: null, rfqs: 1, pos: 0, isNew: true, terms: "50% advance", cur: "USD", contact: "sales@horizon-trading.example", addedFrom: "Auto-created from email reply to GS-RFQ-0142 on 16 Nov 2026" },
    S6: { name: "Red Sea Technical", city: "Hurghada", cats: ["Chemicals", "Adhesives"], status: "Approved", replyHrs: 20, onTime: 90, compliance: 93, rfqs: 15, pos: 4, terms: "30 days", cur: "EGP", contact: "Omar T." },
    S7: { name: "Cairo Chem", city: "Cairo", cats: ["Chemicals"], status: "Approved · on watch", replyHrs: 48, onTime: 76, compliance: 85, rfqs: 9, pos: 2, terms: "Cash", cur: "EGP", contact: "Info desk" },
    S8: { name: "Gulf Marine Chemicals", city: "Suez", cats: ["Chemicals"], status: "Approved", replyHrs: 12, onTime: 89, compliance: 82, rfqs: 7, pos: 2, terms: "30 days", cur: "EGP", contact: "Tamer G." },
    S9: { name: "Alex Weld Supplies", city: "Alexandria", cats: ["Welding"], status: "Approved", replyHrs: 10, onTime: 92, compliance: 97, rfqs: 6, pos: 3, terms: "30 days", cur: "EGP", contact: "Nader W." },
  },

  /* ------------------------------------------------------------------ */
  mainCase: {
    id: "GS-RFQ-0142",
    customer: "Nordvik Ship Management",
    customerId: "C1",
    customerRef: "NSM-REQ-55821",
    contact: "Ingrid L. — Purchasing (Nordvik)",
    vessel: "MV Aurora Crest",
    imo: "9734512",
    port: "Port Said (Suez Canal northbound)",
    agent: "Canal Link Agency · ops desk +20 66 000 0001",
    eta: "2026-11-21T08:00",
    quoteDeadline: "2026-11-18T14:00",
    currency: "USD",
    owner: "ky",
    backup: "sa",
    received: "2026-11-15T09:12",
    source: "Email · sales@ (Outlook) · PDF attachment",
    contactRule: "Follow-ups allowed — max 1 customer follow-up per quotation",
    lines: [
      { n: 1, desc: "CRC Belt Grip spray for mud pump V-belts, 400 ml aerosol", brand: "CRC", model: "Belt Grip 400 ml", exact: false, pn: "local", impa: "450652", issa: "53.235.01", qty: 24, uom: "EA", quoteUom: "EACH", packSize: 1, base: "EA", cat: "Chemicals", conf: 0.97, certs: "SDS", original: "LOCAL CRC BELT GRIP SPRAY FOR MUD PUMP V-BELTS | local | 24 | Each" },
      { n: 2, desc: "LOCTITE 243 threadlocker, medium strength, 50 ml", brand: "Loctite", model: "243", exact: true, pn: "243", impa: "812561", issa: "75.112.43", qty: 3, uom: "EA", quoteUom: "EACH", packSize: 1, base: "EA", cat: "Adhesives", conf: 0.99, certs: "TDS", note: "Customer: for securing bolts & nuts against vibration loosening", original: "LOCTITE PRODUCT 243 HEAVY COAT | 243 | 3 | Each" },
      { n: 3, desc: "Electrical contact cleaner, 250 ml aerosol — 50 L total", brand: "Any", model: "—", exact: false, pn: "—", impa: "450713", issa: "53.240.12", qty: 200, uom: "× 250 ml", quoteUom: "CAN 250 ml", packSize: 0.25, base: "L", cat: "Chemicals", conf: 0.91, certs: "SDS required · min. 18 months shelf life", shelfMonths: 18, original: "CONTACT CLEANER AEROSOL 250ML | — | 200 | CAN" },
      { n: 4, desc: "Welding electrodes E6013, Ø3.2 mm, 5 kg pack", brand: "Any", model: "E6013", exact: false, pn: "E6013-3.2", impa: "850542", issa: "61.110.32", qty: 4, uom: "PK (5 kg)", quoteUom: "PACK 5 kg", packSize: 5, base: "kg", cat: "Welding", conf: 0.94, certs: "EN ISO 2560 mill certificate", original: "ELECTRODE E6013 3.2MM | — | 20 | KG" },
      { n: 5, desc: "Safety helmet EN 397, white, with chin strap", brand: "Any", model: "—", exact: false, pn: "—", impa: "310102", issa: "33.101.02", qty: 15, uom: "EA", quoteUom: "EACH", packSize: 1, base: "EA", cat: "Safety & PPE", conf: 0.96, certs: "EN 397 certificate", original: "SAFETY HELMET WHITE W/ CHIN STRAP | — | 15 | PCS" },
      { n: 6, desc: "Flame-retardant coverall, navy, EN ISO 11612", brand: "Any", model: "—", exact: false, pn: "—", impa: "190451", issa: "33.410.05", qty: 10, uom: "EA", quoteUom: "EACH", packSize: 1, base: "EA", cat: "Safety & PPE", conf: 0.58, certs: "EN ISO 11612", missing: "Size breakdown not specified", original: "COVERALL FR NAVY | — | 10 | PCS" },
    ],
    clarifications: [
      { line: 6, q: "Please confirm size breakdown (S/M/L/XL/XXL) for 10 FR coveralls.", asked: "15 Nov 10:40", by: "ky", via: "Email to customer", a: null },
      { line: 2, q: "Customer wrote “heavy coat” — confirm standard LOCTITE 243 (medium strength), 50 ml?", asked: "15 Nov 10:45", by: "ky", via: "Phone", a: "Confirmed: 243, 50 ml, 3 pcs (Ingrid L., phone 15 Nov 12:10)" },
      { line: 4, q: "Supplier Alex Weld asks: any brand acceptable, or ESAB only? Mill cert required?", asked: "16 Nov 11:20", by: "ky", via: "Supplier question", a: null },
    ],
    offers: {
      1: [
        { sup: "S1", ver: 1, price: 520, cur: "EGP", packs: 24, packSize: 1, lead: 3, valid: "2026-11-24", terms: "30 days", basis: "Delivered Port Said" },
        { sup: "S2", ver: 1, price: 495, cur: "EGP", packs: 24, packSize: 1, lead: 6, valid: "2026-11-30", terms: "15 days", basis: "Ex-works Suez" },
        { sup: "S5", ver: 1, price: 9.8, cur: "USD", packs: 24, packSize: 1, lead: 2, valid: "2026-11-26", newSupplier: true, terms: "50% advance", basis: "Ex-stock Damietta + EGP 600 freight" },
      ],
      2: [
        { sup: "S1", ver: 1, price: 2405, cur: "EGP", packs: 3, packSize: 1, lead: 3, valid: "2026-11-24", terms: "30 days", basis: "Delivered Port Said" },
        { sup: "S2", ver: 1, price: 2190, cur: "EGP", packs: 3, packSize: 1, lead: 4, valid: "2026-11-30", superseded: true, mismatch: "Wrong part: offered LOCTITE 242, requested 243 (exact brand & part required)", terms: "15 days" },
        { sup: "S2", ver: 2, price: 2350, cur: "EGP", packs: 3, packSize: 1, lead: 4, valid: "2026-11-30", revised: "Revised after clarification 16 Nov", terms: "15 days" },
      ],
      3: [
        { sup: "S1", ver: 1, price: 185, cur: "EGP", packs: 200, packSize: 0.25, packLabel: "200 × 250 ml", lead: 3, valid: "2026-11-24", terms: "30 days", expiry: "2027-02", shelfNote: "Batch expires Feb 2027 (15 months) — below 18-month requirement" },
        { sup: "S2", ver: 1, price: 330, cur: "EGP", packs: 100, packSize: 0.5, packLabel: "100 × 500 ml", lead: 4, valid: "2026-11-30", packChange: true, terms: "15 days", expiry: "2028-06" },
        { sup: "S8", ver: 1, price: 610, cur: "EGP", packs: 50, packSize: 1, packLabel: "50 × 1 L bottle", lead: 2, valid: "2026-11-16", specMismatch: "Spec mismatch: bulk liquid in 1 L bottles offered, aerosol requested", terms: "30 days" },
      ],
      4: [
        { sup: "S1", ver: 1, price: 1050, cur: "EGP", packs: 4, packSize: 5, packLabel: "4 × 5 kg", lead: 5, valid: "2026-11-24", terms: "30 days" },
      ],
      5: [
        { sup: "S4", ver: 1, price: 340, cur: "EGP", packs: 10, packSize: 1, lead: 2, valid: "2026-12-01", shortfall: "Only 10 of 15 available", terms: "30 days" },
        { sup: "S1", ver: 1, price: 365, cur: "EGP", packs: 15, packSize: 1, lead: 3, valid: "2026-11-24", terms: "30 days" },
      ],
      6: [],
    },
    missingFrom: { 1: ["S8"] },
    split: { 5: [{ key: "S4|1", qty: 10 }, { key: "S1|1", qty: 5 }] },
    supplierRfqs: [
      { sup: "S1", lines: [1, 2, 3, 4, 5], sent: "2026-11-15T11:05", due: "2026-11-17T12:00", status: "Replied", reminders: 0, last: "Full offer received 16 Nov 10:22" },
      { sup: "S2", lines: [1, 2, 3], sent: "2026-11-15T11:05", due: "2026-11-17T12:00", status: "Revised offer received", reminders: 0, last: "v2 received after correction request" },
      { sup: "S5", lines: [1], sent: "2026-11-15T11:40", due: "2026-11-17T12:00", status: "Replied", reminders: 0, last: "New supplier — offer captured from email", isNew: true },
      { sup: "S4", lines: [5], sent: "2026-11-15T11:05", due: "2026-11-17T12:00", status: "Replied", reminders: 0, last: "Offer received 15 Nov 16:40 (10 available)" },
      { sup: "S8", lines: [1, 3], sent: "2026-11-15T11:05", due: "2026-11-17T12:00", status: "Partial reply", reminders: 1, last: "Quoted line 3 only — line 1 missing, follow-up drafted" },
      { sup: "S9", lines: [4], sent: "2026-11-15T11:05", due: "2026-11-17T12:00", status: "Clarification needed", reminders: 0, last: "Supplier asked: ESAB only? mill cert? — answer pending" },
      { sup: "S3", lines: [4], sent: "2026-11-15T11:05", due: "2026-11-17T12:00", status: "Awaiting reply", reminders: 1, last: "Reminder 1 sent 16 Nov 15:00 · due today 12:00" },
      { sup: "S6", lines: [1, 2], sent: "2026-11-15T11:05", due: "2026-11-17T12:00", status: "Declined", reminders: 0, last: "“No stock until December” — reminders stopped" },
      { sup: "S7", lines: [3], sent: "2026-11-15T11:05", due: "2026-11-16T12:00", status: "No response", reminders: 2, last: "Escalated to Karim Youssef 17 Nov 09:00" },
    ],
    deliveryCharges: [
      { label: "Port Said launch delivery to vessel", egp: 4200, estimate: true },
      { label: "Horizon freight Damietta → Port Said", egp: 600, estimate: false },
      { label: "Bank transfer charges", egp: 350, estimate: false },
      { label: "Customs / clearance", egp: 0, na: true },
    ],
    timeline: [
      { t: "2026-11-15T09:12", kind: "auto", ico: "✉", text: "RFQ email received from Nordvik purchasing desk (sales@ alias, Outlook). 1 PDF attachment linked and preserved." },
      { t: "2026-11-15T09:13", kind: "auto", ico: "✦", text: "AI extraction: 6 lines, vessel MV Aurora Crest (IMO 9734512), Port Said, ETA 21 Nov, deadline 18 Nov 14:00. Line 6 low confidence (size missing)." },
      { t: "2026-11-15T09:13", kind: "auto", ico: "⚑", text: "Case GS-RFQ-0142 created. Owner Karim Youssef (rule: Nordvik account), backup Soaad Amer. Flagged urgent: vessel ETA < 7 days." },
      { t: "2026-11-15T09:14", kind: "auto", ico: "✓", text: "Acknowledgement sent using approved template “RFQ received – marine”. Duplicate check passed (1 ack per thread)." },
      { t: "2026-11-15T10:40", kind: "human", ico: "KY", text: "Karim Youssef validated lines 1–5. Asked customer for coverall size breakdown (line 6 → Clarification needed)." },
      { t: "2026-11-15T11:05", kind: "human", ico: "KY", text: "Approved & sent 8 supplier RFQs: split by category, client identity removed. Line 2 marked exact brand." },
      { t: "2026-11-15T11:40", kind: "human", ico: "KY", text: "Sent line 1 to new supplier Horizon Trading (first contact)." },
      { t: "2026-11-15T16:40", kind: "auto", ico: "✉", text: "Reply from Nile Safety Equipment matched to GS-RFQ-0142 (subject changed to “Helmets offer”). Prices extracted for line 5." },
      { t: "2026-11-16T08:55", kind: "auto", ico: "✉", text: "Reply from Horizon Trading matched by RFQ reference. Supplier & product prices saved to database — no PO required." },
      { t: "2026-11-16T09:30", kind: "alert", ico: "!", text: "Suez Industrial offer line 2: LOCTITE 242 offered, 243 requested. Line blocked from pricing → Awaiting corrected offer." },
      { t: "2026-11-16T09:41", kind: "human", ico: "KY", text: "Correction request sent to Suez Industrial (draft prepared by system, client not disclosed). Due 16 Nov 15:00." },
      { t: "2026-11-16T10:22", kind: "auto", ico: "✉", text: "Delta Marine Stores full offer received (5/5 lines). Line 3 batch expiry Feb 2027 flagged against 18-month shelf-life requirement." },
      { t: "2026-11-16T11:20", kind: "auto", ico: "?", text: "Alex Weld Supplies asked a clarification on line 4 — logged against the line, supplier RFQ set to Clarification needed." },
      { t: "2026-11-16T13:05", kind: "auto", ico: "↻", text: "Suez Industrial revised offer v2 attached. v1 kept in history." },
      { t: "2026-11-16T14:10", kind: "auto", ico: "◐", text: "Gulf Marine partial reply: line 3 only (spec mismatch: 1 L bottles). Line 1 missing — follow-up draft prepared." },
      { t: "2026-11-16T15:00", kind: "auto", ico: "⏰", text: "Reminder 1 sent to Port Said Welding (pre-approved follow-up template)." },
      { t: "2026-11-16T17:10", kind: "auto", ico: "■", text: "Red Sea Technical declined (no stock). Reminders stopped." },
      { t: "2026-11-17T09:00", kind: "alert", ico: "!", text: "Cairo Chem: no response after 2 reminders → escalated to owner. Line 3 still covered by 2 compliant offers." },
    ],
  },

  /* ------------------------------------------------------------------ */
  cases: [
    { id: "GS-RFQ-0142", customer: "Nordvik Ship Management", vessel: "MV Aurora Crest", port: "Port Said", eta: "2026-11-21", deadline: "2026-11-18T14:00", stage: "Comparing offers", wait: "Awaiting supplier", tone: "info", owner: "ky", waiting: 2, next: "Select offers & price lines 1–5", latest: "Cairo Chem escalated 09:00", blocker: "Line 6 awaiting customer clarification", lines: [3, 1, 1, 1], value: 7480, cat: "Chemicals" },
    { id: "GS-RFQ-0141", customer: "Helios Bulk Carriers", vessel: "MV Helios Star", port: "Suez", eta: "2026-11-19", deadline: "2026-11-17T16:00", stage: "Awaiting supplier", wait: "Awaiting supplier", tone: "warn", owner: "sa", waiting: 1, next: "Chase 2 pump-seal suppliers", latest: "Reminder 1 sent 08:00", blocker: "Deadline today 16:00", lines: [2, 4, 0, 0], value: 12900, urgent: true, cat: "Engine spares" },
    { id: "GS-RFQ-0140", customer: "Mare Nostrum Shipping", vessel: "MV Corallo", port: "Damietta", eta: "2026-11-27", deadline: "2026-11-19T12:00", stage: "Awaiting corrected offer", wait: "Awaiting corrected offer", tone: "warn", owner: "ky", waiting: 1, next: "Supplier to correct paint colour code (RAL 7035 → 7038)", latest: "Correction sent 16 Nov", blocker: "1 line blocked from pricing", lines: [5, 1, 0, 0], value: 8800, cat: "Paints" },
    { id: "GS-RFQ-0139", customer: "Atlas Tankers", vessel: "MT Atlas Pearl", port: "Alexandria", eta: "2026-11-28", deadline: "2026-11-12T12:00", stage: "Awaiting customer decision", wait: "Awaiting customer decision", tone: "info", owner: "ky", waiting: 5, next: "Internal reminder only — do not chase", latest: "Internal reminder 15 Nov", blocker: "Customer rule: no status requests", lines: [8, 0, 0, 0], value: 21650, noChase: true, cat: "Deck stores" },
    { id: "GS-RFQ-0137", customer: "Mare Nostrum Shipping", vessel: "MV Corallo", port: "Damietta", eta: "2026-11-25", deadline: "2026-11-18T10:00", stage: "Awaiting management approval", wait: "Awaiting internal approval", tone: "warn", owner: "sa", waiting: 0, next: "Karim Balbaa: margin exception (12.4%)", latest: "Approval requested 2 h ago", blocker: "Below 15% minimum margin", lines: [6, 0, 0, 0], value: 9340, cat: "Paints" },
    { id: "GS-RFQ-0136", customer: "Nordvik Ship Management", vessel: "MV Nordic Tern", port: "Port Said", eta: "2026-11-18", deadline: "2026-11-14T12:00", stage: "Won — PO mismatch", wait: "Awaiting customer decision", tone: "danger", owner: "ky", waiting: 1, next: "Customer PO uses expired v1 price on line 3", latest: "PO received 16 Nov", blocker: "Commitment blocked", lines: [5, 0, 0, 0], value: 6120, cat: "Chemicals" },
    { id: "GS-RFQ-0135", customer: "Delta Offshore Services", vessel: "Rig support · DOS Falcon", port: "Abu Qir", eta: "2026-12-02", deadline: "2026-11-11T12:00", stage: "Revision requested", wait: "Awaiting internal approval", tone: "info", owner: "sa", waiting: 2, next: "Prepare v2 with ESAB alternative", latest: "Customer asked for v2 15 Nov", blocker: "", lines: [7, 2, 0, 0], value: 15400, cat: "Welding" },
    { id: "GS-RFQ-0133", customer: "Delta Offshore Services", vessel: "Rig support · DOS Falcon", port: "Abu Qir", eta: "2026-11-21", deadline: "2026-11-09T12:00", stage: "Delivering (drop 1 of 2)", wait: "Awaiting delivery or payment", tone: "ok", owner: "ah", waiting: 0, next: "Collect signed delivery note drop 1", latest: "ETA moved +1 day", blocker: "ETA moved +1 day", lines: [9, 0, 0, 0], value: 18400, cat: "Safety & PPE" },
    { id: "GS-RFQ-0131", customer: "Helios Bulk Carriers", vessel: "MV Helios Dawn", port: "Suez", eta: "2026-11-10", deadline: "2026-11-03T12:00", stage: "Invoiced — partially paid", wait: "Awaiting delivery or payment", tone: "ok", owner: "ah", waiting: 12, next: "Balance USD 4,200 due 30 Nov", latest: "Payment USD 10,000 on 12 Nov", blocker: "", lines: [7, 0, 0, 0], value: 14200, cat: "Engine spares" },
    { id: "GS-RFQ-0130", customer: "Atlas Tankers", vessel: "MT Atlas Wave", port: "Alexandria", eta: "2026-12-10", deadline: "2026-11-05T12:00", stage: "On hold", wait: "Awaiting customer decision", tone: "neutral", owner: "sa", waiting: 9, next: "Customer paused — vessel drydock moved", latest: "On hold until 01 Dec", blocker: "", lines: [4, 0, 0, 0], value: 5200, cat: "Deck stores" },
    { id: "GS-RFQ-0128", customer: "Helios Bulk Carriers", vessel: "MV Helios Star", port: "Suez", eta: "2026-10-30", deadline: "2026-10-25T12:00", stage: "Expired", wait: "", tone: "neutral", owner: "sa", waiting: 0, next: "Validity ended without decision", latest: "Expired 01 Nov", blocker: "", lines: [0, 0, 0, 0], value: 3100, cat: "Chemicals" },
    { id: "GS-RFQ-0129", customer: "Atlas Tankers", vessel: "MT Atlas Wave", port: "Alexandria", eta: "2026-11-06", deadline: "2026-10-30T12:00", stage: "Lost", wait: "", tone: "neutral", owner: "sa", waiting: 0, next: "—", latest: "Lost reason: price (competitor 6% lower)", blocker: "Lost reason: price (competitor 6% lower)", lines: [0, 0, 0, 0], value: 8800, cat: "Deck stores" },
  ],

  inbox: [
    {
      id: "m1", from: "purchasing@helios-bulk.example", fromName: "Helios Bulk Carriers", time: "09:48", subject: "RFQ – MV Helios Star – engine stores – urgent", fmt: "Excel",
      body: `Dear Golden Sea team,

Please quote the following for MV Helios Star (IMO 9811204), ETA Suez 19 Nov, northbound transit. Quotation needed by 18 Nov 12:00.

1. Mechanical seal for main SW pump, Grundfos NB 65-200, part 96534915 – 2 pcs
2. V-belt SPB 2360 – 6 pcs
3. Rags, white cotton – 50 kg
4. Hand cleaner gel, 4.5 L – 4 cans
5. Thermometer bi-metal 0–120 °C, 100 mm dial – 2 pcs

Original brand only for item 1.
See attached spec sheet.

Best regards,
Chief Engineer / Purchasing`,
      attachment: "HeliosStar_engine_stores_RFQ.xlsx",
      result: "new",
    },
    {
      id: "m4", from: "procurement@baltic-reefer.example", fromName: "Baltic Reefer Management", time: "08:31", subject: "Inquiry MV Polar Bay – provisions & cabin stores", fmt: "Word",
      body: `Good day,

Kindly find attached our requisition (Word) for MV Polar Bay, calling Alexandria approx. 26 Nov.
Please quote in EUR, delivered on board.

Regards,
Superintendent`,
      attachment: "PolarBay_requisition_Nov.docx",
      result: "new",
    },
    {
      id: "m5", from: "WhatsApp · +30 69 0000 0000", fromName: "Capt. Nikos (Atlas Tankers)", time: "07:55", subject: "Photo of requisition list (WhatsApp, forwarded by Karim)", fmt: "Image",
      body: `[Image: handwritten requisition list, 7 lines — photographed on board]
“Pls quote asap, MT Atlas Pearl, Alex 28/11. Thx”`,
      attachment: "whatsapp_IMG_2207.jpg",
      result: "new",
    },
    {
      id: "m2", from: "sales@horizon-trading.example", fromName: "Horizon Trading (new supplier)", time: "Yesterday", subject: "RE: Price enquiry – belt grip spray", fmt: "Email",
      body: `Hello,

Thank you for your enquiry ref GS-SRFQ-0142-H.
CRC Belt Grip 400 ml: USD 9.80 / can, 24 cans available ex-stock Damietta.
Delivery 2 days. Valid until 26 Nov. Payment 50% advance.

Regards,
Horizon Trading`,
      attachment: null,
      result: "matched",
      matchNote: "Matched to GS-RFQ-0142 by supplier RFQ reference GS-SRFQ-0142-H (confidence 0.99). Offer captured on line 1. New supplier + product price saved to database.",
    },
    {
      id: "m6", from: "info@delta-marine.example", fromName: "Delta Marine Stores", time: "Yesterday", subject: "prices as requested", fmt: "Email",
      body: `Hi Karim, see attached our prices as discussed on the phone. Rgds Hany`,
      attachment: "DMS_quote_1611.pdf",
      result: "review",
      matchNote: "Uncertain match (0.62): no RFQ reference, subject changed. Candidates: GS-RFQ-0142 (lines match 4/5) or GS-RFQ-0140 (supplier also invited). Routed to review — not auto-linked.",
    },
    {
      id: "m3", from: "purchasing@nordvik.example", fromName: "Nordvik Ship Management", time: "Yesterday", subject: "FW: RFQ NSM-REQ-55821 MV Aurora Crest", fmt: "Email",
      body: `(forwarded copy of the original RFQ already received 15 Nov 09:12)`,
      attachment: "NSM-REQ-55821.pdf",
      result: "duplicate",
      matchNote: "Same customer ref NSM-REQ-55821 and identical attachment hash as GS-RFQ-0142. No new case, no second acknowledgement — linked to existing case.",
    },
  ],

  approvals: [
    { id: "A1", type: "Quotation margin exception", caseId: "GS-RFQ-0137", title: "Quote v2 to Mare Nostrum — 12.4% margin (min 15%)", detail: "Customer target price on 2 paint lines. Expected GP USD 1,158 on USD 9,340.", by: "sa", age: "2 h", tone: "warn" },
    { id: "A2", type: "Supplier deposit (payment)", caseId: "GS-RFQ-0133", title: "50% advance to Delta Marine Stores — EGP 96,400", detail: "PO P00418 · supplier pro forma attached · bank details unchanged since 2025. Payment is executed manually by finance after approval — never automatically.", by: "ah", age: "5 h", tone: "info" },
    { id: "A3", type: "Alternative product (internal)", caseId: "GS-RFQ-0142", title: "Line 3 pack-size change 200 × 250 ml → 100 × 500 ml", detail: "Saves EGP 3,700 on line 3 and solves the shelf-life issue. Internal approval only — customer written acceptance still required before ordering.", by: "ky", age: "20 min", tone: "info" },
    { id: "A4", type: "Bank detail change", caseId: "—", title: "Cairo Chem requests new beneficiary bank account", detail: "Request received by email 16 Nov. Verification call-back to known number required (not the number in the email). Two-person approval.", by: "ah", age: "1 d", tone: "danger" },
    { id: "A5", type: "Exchange rate", caseId: "—", title: "New USD rate 48.95 (from 48.60)", detail: "Proposed by Ahmedy from CBE mid-rate + 0.5% buffer. Affects 3 open quotations (re-check queued).", by: "ah", age: "1 h", tone: "info" },
  ],

  priceHistory: {
    S5: [{ item: "CRC Belt Grip spray 400 ml", price: "USD 9.80", date: "16 Nov 2026", valid: "26 Nov 2026", source: "Email reply · GS-RFQ-0142", ordered: false }],
    S1: [
      { item: "CRC Belt Grip spray 400 ml", price: "EGP 520", date: "16 Nov 2026", valid: "24 Nov 2026", source: "GS-RFQ-0142", ordered: false },
      { item: "CRC Belt Grip spray 400 ml", price: "EGP 1,010", date: "10 Oct 2026", valid: "17 Oct 2026 (expired)", source: "PO P00377", ordered: true },
      { item: "LOCTITE 243, 50 ml", price: "EGP 2,405", date: "16 Nov 2026", valid: "24 Nov 2026", source: "GS-RFQ-0142", ordered: false },
      { item: "Welding electrodes E6013 3.2 mm 5 kg", price: "EGP 1,010", date: "02 Sep 2026", valid: "expired", source: "PO P00377", ordered: true },
    ],
    S2: [
      { item: "LOCTITE 242 (offered by mistake)", price: "EGP 2,190", date: "16 Nov 2026", valid: "superseded", source: "GS-RFQ-0142 v1", ordered: false },
      { item: "LOCTITE 243, 50 ml", price: "EGP 2,350", date: "16 Nov 2026", valid: "30 Nov 2026", source: "GS-RFQ-0142 v2", ordered: false },
    ],
  },
};
