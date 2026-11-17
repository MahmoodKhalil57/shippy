/* Operational extensions: finance approver, agency principals & pricelists, own stock,
   service case types (clearance, held stores, provisions), extra intake channels. Demo data. */
(() => {
  const G = window.GS;

  /* ---------- people & roles ---------- */
  Object.assign(G.users, {
    mh: { name: "Mohamed Helmy", initials: "MH", role: "Financial Director / Partner" },
    em: { name: "Esraa Mohamed", initials: "EM", role: "Office Manager" },
    ne: { name: "Nancy Elsobhy", initials: "NE", role: "Cairo Office Admin" },
  });
  G.users.kb.role = "CEO / Managing Director — management approver";
  G.roles.push({ role: "Financial Director (Mohamed Helmy)", perms: [1, 1, 1, 0, 1, 1, 0, 1] });
  G.roles.push({ role: "Office admin (Esraa Mohamed, Nancy Elsobhy)", perms: [1, 0, 0, 0, 0, 0, 1, 0] });

  /* ---------- suppliers: agency principals & own stock ---------- */
  Object.assign(G.suppliers, {
    S10: { name: "Vecom Marine (agency principal)", city: "Maassluis, NL", cats: ["Chemicals"], status: "Agency principal", replyHrs: 0, onTime: 91, compliance: 100, rfqs: 0, pos: 18, terms: "45 days", cur: "EUR", contact: "Agency pricelist 2026 · −15%", agency: true },
    S11: { name: "Lalizas (agency principal)", city: "Piraeus, GR", cats: ["Safety & PPE"], status: "Agency principal", replyHrs: 0, onTime: 95, compliance: 100, rfqs: 0, pos: 26, terms: "60 days", cur: "EUR", contact: "Agency pricelist 2026 · −18%", agency: true },
    S12: { name: "Lukoil Marine (agency principal)", city: "Limassol, CY", cats: ["Lubricants"], status: "Agency principal", replyHrs: 0, onTime: 93, compliance: 100, rfqs: 0, pos: 31, terms: "30 days", cur: "USD", contact: "Agency pricelist 2026 · −12%", agency: true },
    S13: { name: "Marichem (agency principal)", city: "Piraeus, GR", cats: ["Chemicals"], status: "Agency principal", replyHrs: 0, onTime: 90, compliance: 100, rfqs: 0, pos: 14, terms: "45 days", cur: "USD", contact: "Agency pricelist 2026 · −10%", agency: true },
    GS: { name: "Golden Sea stock — Alexandria warehouse", city: "Alexandria", cats: ["All stores"], status: "Own stock", replyHrs: 0, onTime: 99, compliance: 100, rfqs: 0, pos: 0, terms: "—", cur: "EGP", contact: "Inventory (avg. cost)", own: true },
  });
  const O = G.mainCase.offers;
  O[3].push({ sup: "S10", ver: 1, price: 4.6, cur: "EUR", packs: 200, packSize: 0.25, packLabel: "200 × 250 ml", lead: 9, valid: "2026-12-31", terms: "45 days", basis: "Agency pricelist — priced instantly, no RFQ", agency: true, expiry: "2029-01" });
  O[5].push({ sup: "GS", ver: 1, price: 295, cur: "EGP", packs: 4, packSize: 1, lead: 1, valid: "2026-12-31", terms: "—", basis: "Own stock Alexandria (avg. cost) — reserve now", stock: true, shortfall: "Only 4 in stock" });
  O[1].push({ sup: "GS", ver: 1, price: 455, cur: "EGP", packs: 6, packSize: 1, lead: 1, valid: "2026-12-31", terms: "—", basis: "Own stock Alexandria (avg. cost)", stock: true, shortfall: "Only 6 in stock" });

  /* ---------- finance approvals ---------- */
  const a2 = G.approvals.find((a) => a.id === "A2"); if (a2) { a2.approver = ["kb", "mh"]; a2.detail += " Approver: Mohamed Helmy (Financial Director) or Karim Balbaa."; }
  const a4 = G.approvals.find((a) => a.id === "A4"); if (a4) { a4.approver = ["kb", "mh"]; a4.twoPerson = true; a4.detail = "Request received by email 16 Nov. Call-back to the number on file (not the one in the email) required. Two-person approval: Mohamed Helmy (Financial Director) AND Karim Balbaa."; }

  /* ---------- extra intake channels ---------- */
  G.inbox.splice(3, 0,
    { id: "m7", from: "Website quick-quote form", fromName: "Website “Request a quick quote”", time: "06:40", subject: "Quick quote — Lalizas life jackets & lifebuoys, Abu Qir rig", fmt: "Web form",
      body: `Name: Hossam R. (Purchasing, Petro Delta offshore base)
Email: purchasing@petro-delta.example   Phone: +20 12 0000 0000
Department: Offshore
Message: Need 30 SOLAS life jackets (Lalizas preferred) and 6 lifebuoys with light & smoke for platform PD-3 offshore Abu Qir. Delivery by supply boat, 24 Nov.`,
      attachment: null, result: "new" },
    { id: "m8", from: "superintendent@nordvik.example", fromName: "Capt. Erik H. (Nordvik technical)", time: "Yesterday", subject: "Spares for MV Aurora Crest — DHL AWB 41 2233 9081 — please clear & deliver with stores", fmt: "Email",
      body: `Dear Golden Sea,

2 cases of main engine spares (fuel valves, gaskets) are arriving Cairo airport by DHL, AWB 41 2233 9081, ETA 19 Nov.
Please clear customs (ship spares in transit) and deliver on board together with the stores on 20/21 Nov at Port Said.
Commercial invoice and packing list attached.

Rgds, Erik`,
      attachment: "AWB_41-2233-9081_invoice_packinglist.pdf", result: "service" },
  );

  /* ---------- service case types ---------- */
  G.cases.splice(1, 0,
    { id: "GS-SVC-0021", customer: "Nordvik Ship Management", vessel: "MV Aurora Crest", port: "Port Said", eta: "2026-11-21", deadline: "2026-11-20T12:00", stage: "Customs clearance — spares in transit", wait: "Awaiting delivery or payment", tone: "info", owner: "ah", waiting: 1, next: "Customs release expected 19 Nov 15:00 → consolidate with GS-RFQ-0142 delivery", latest: "AWB arrived Cairo 19 Nov 06:10", blocker: "", lines: [1, 1, 0, 0], value: 650, cat: "Spare-parts clearance", type: "Service" },
    { id: "GS-RFQ-0143", customer: "Delta Offshore Services", vessel: "Rig support · DOS Falcon", port: "Abu Qir (offshore)", eta: "2026-11-23", deadline: "2026-11-18T16:00", stage: "Comparing offers", wait: "Awaiting supplier", tone: "info", owner: "ah", waiting: 0, next: "Price frozen & chilled provisions; book reefer truck", latest: "3 provision suppliers replied", blocker: "Cold chain: reefer truck 2 required", lines: [14, 6, 0, 0], value: 9600, cat: "Provisions", type: "RFQ" },
    { id: "GS-HLD-0007", customer: "Helios Bulk Carriers", vessel: "MV Helios Dawn", port: "Alexandria warehouse", eta: "2026-12-04", deadline: "2026-12-04T12:00", stage: "Held for vessel (storage)", wait: "Awaiting delivery or payment", tone: "ok", owner: "ah", waiting: 9, next: "Vessel call moved to 04 Dec — keep stored, storage charge from day 15", latest: "ETA changed by owner 15 Nov", blocker: "", lines: [11, 0, 0, 0], value: 7300, cat: "Held stores", type: "Held stores" },
  );

  /* ---------- customers: segments ---------- */
  const seg = { C1: "Marine — ship manager", C2: "Marine — shipowner", C3: "Marine — tankers", C4: "Marine — ship manager", C5: "Offshore / oil & gas" };
  Object.entries(seg).forEach(([k, v]) => { if (G.customers[k]) G.customers[k].segment = v; });

  /* ---------- products: store + IMPA series, agency items, provisions, bond ---------- */
  const store = { P1: ["Engine stores", "45"], P2: ["Engine stores", "81"], P3: ["Electrical stores", "79"], P4: ["Engine stores", "85"], P5: ["Safety stores", "31"], P6: ["Safety stores", "19"] };
  G.products.forEach((p) => { if (store[p.id]) [p.store, p.series] = store[p.id]; });
  G.products.push(
    { id: "P7", name: "Lalizas SOLAS life jacket (adult, 150N)", aliases: ["Lifejacket SOLAS", "Life vest"], brand: "Lalizas (agency)", oem: "70925", impa: "330101", issa: "33.301.01", hs: "6307.20", unit: "EA", packs: "1", specs: "SOLAS/MED approved, with light & whistle", certs: "MED wheelmark certificate", shelf: "Light battery 5 years", lastBuy: "EUR 41.20 (agency list −18%)", suppliers: 1, store: "Safety stores", series: "33", agency: true },
    { id: "P8", name: "Vecom electrical contact cleaner 250 ml", aliases: ["Vecom contact cleaner", "Electro cleaner aerosol"], brand: "Vecom (agency)", oem: "VC-EC250", impa: "450713", issa: "53.240.12", hs: "3814.00", unit: "L", packs: "250 ml can = 0.25 L · carton 12", specs: "Plastic-safe, non-conductive", certs: "SDS", shelf: "36 months", lastBuy: "EUR 4.60 (agency list −15%)", suppliers: 1, store: "Electrical stores", series: "45", agency: true },
    { id: "P9", name: "Lukoil Navigo 6 SO cylinder oil, 208 L drum", aliases: ["Cylinder oil", "Lukoil Navigo"], brand: "Lukoil Marine (agency)", oem: "NAV6SO-208", impa: "—", issa: "—", hs: "2710.19", unit: "L", packs: "208 L drum · IBC 1,000 L", specs: "BN 70 cylinder lubricant", certs: "Product data sheet", shelf: "60 months", lastBuy: "USD 2.31 / L (agency list −12%)", suppliers: 1, store: "Engine stores", series: "45", agency: true },
    { id: "P10", name: "Chicken breast boneless, frozen", aliases: ["Frozen chicken fillet"], brand: "Any (halal)", oem: "—", impa: "002203", issa: "—", hs: "0207.14", unit: "kg", packs: "2 kg bag · 10 kg carton", specs: "−18 °C, halal certified", certs: "Health certificate · halal", shelf: "12 months at −18 °C", lastBuy: "EGP 285 / kg (Nov 2026)", suppliers: 3, store: "Provision stores", series: "Frozen", cold: true },
    { id: "P11", name: "BANDO hydraulic rubber hose 1/2\"", aliases: ["Hydraulic hose 12.7 mm"], brand: "BANDO (distributor)", oem: "BD-HYD-08", impa: "350401", issa: "—", hs: "4009.21", unit: "m", packs: "Coil 50 m · cut to length", specs: "2SN, 275 bar", certs: "Test certificate", shelf: "—", lastBuy: "EGP 190 / m (own stock)", suppliers: 1, store: "Engine stores", series: "35", agency: true },
    { id: "P12", name: "Cigarettes (bond), carton 200", aliases: ["Bonded cigarettes"], brand: "Various", oem: "—", impa: "—", issa: "—", hs: "2402.20", unit: "carton", packs: "Case 50 cartons", specs: "Supplied under customs bond only", certs: "Customs bond release", shelf: "—", lastBuy: "USD 14.50 / carton", suppliers: 1, store: "Bond stores", series: "Bond", bond: true },
  );

  /* ---------- automation & coverage additions ---------- */
  G.automations.push(
    { name: "Website quick-quote form", trigger: "Website quick-quote form submitted", action: "Create draft case + contact (AI extraction of items)", mode: "Auto", owner: "Assignment rule", due: "Ack within 30 min", approval: "None — draft only", retry: "Form also emails the sales mailbox as fallback", stop: "Spam / duplicate submission" },
    { name: "After-hours & weekend RFQ (24/7 service)", trigger: "Urgent RFQ outside Sun–Thu 08:00–17:00 or vessel ETA < 24 h", action: "Alert on-duty person by WhatsApp/SMS + call list of senior staff", mode: "Auto", owner: "On-duty roster", due: "15 min", approval: "—", retry: "Escalate to next on roster after 15 min", stop: "Owner acknowledges" },
    { name: "Agency pricelist pricing", trigger: "Line matches an agency brand (Vecom, Lalizas, Lukoil, Marichem…)", action: "Price instantly from principal pricelist & own stock; no supplier RFQ needed", mode: "Auto", owner: "Case owner", due: "Immediate", approval: "Pricelist versions approved by Karim Balbaa", retry: "—", stop: "Pricelist expired → normal RFQ" },
    { name: "Own-stock check", trigger: "Line created", action: "Show available stock (Cairo / Alexandria) and reserve on selection", mode: "Auto", owner: "Operations", due: "—", approval: "—", retry: "—", stop: "Stock reserved or released" },
    { name: "Held stores storage charge", trigger: "Stores held for a vessel > 14 days", action: "Notify owner & customer draft; start storage charge", mode: "Prepare for review", owner: "Operations", due: "Day 14", approval: "Customer contact rules", retry: "—", stop: "Delivered or cancelled" },
  );
  G.coverage.push(
    ["Intake", "Website “Request a quick quote” form creates a draft case", "Configuration + AI", "Website / CRM", "Form → case; AI extracts items", "—", "Web form RFQ appears in Inbox intake", "#/inbox"],
    ["Operations", "Agency principals' pricelists & discounts price matching lines instantly", "Configuration", "Purchase (vendor pricelists) + Sales pricelists", "Pricelist import per principal, versioned", "Load yearly lists", "Vecom contact cleaner priced without RFQ", "#/case/GS-RFQ-0142/compare"],
    ["Operations", "Own stock (Cairo / Alexandria warehouses) offered alongside supplier offers", "Standard + Customization", "Inventory (multi-warehouse)", "Stock row in comparison, reservation", "—", "4 helmets from stock", "#/case/GS-RFQ-0142/compare"],
    ["Operations", "Store categories & IMPA series (engine, deck, cabin, electrical, safety, medicine, stationery, provisions, bond)", "Configuration", "Inventory product categories", "Category tree = stores", "Map existing products", "Products grouped by store", "#/products"],
    ["Operations", "Spare-parts clearance & forwarding service (AWB, customs, storage, consolidate with stores)", "Customization", "Project / Inventory", "Service case type with billable fees", "Customs broker steps", "GS-SVC-0021 linked to GS-RFQ-0142 delivery", "#/case/GS-SVC-0021"],
    ["Operations", "Held stores for vessels with uncertain movements (storage period, charges)", "Configuration", "Inventory (reservation) + Sales", "Storage location per vessel + charge rule", "—", "GS-HLD-0007 storage charge from day 15", "#/case/GS-HLD-0007"],
    ["Operations", "Provisions cold chain (reefer trucks, temperature log) and bond stores (customs seal)", "Configuration + Customization", "Inventory / Fleet", "Vehicle & temperature checklist on delivery", "Driver records temperature", "Reefer truck on GS-RFQ-0143", "#/case/GS-RFQ-0143"],
    ["Operations", "Own vehicle fleet & boarding staff planning", "Standard + Configuration", "Fleet + Planning", "Vehicle & staff assigned per delivery", "—", "Truck & boarding staff on delivery plan", "#/case/GS-RFQ-0142/delivery?preset=delivery"],
    ["Operations", "24/7 service: after-hours on-call routing & emergency escalation", "Customization", "Automated actions + on-call roster", "Out-of-hours rule alerts on-duty staff", "Roster maintained by office manager", "Rule in registry", "#/automations"],
    ["Operations", "Finance approvals by the Financial Director; two-person rule on bank changes", "Configuration", "Approvals / Accounting", "Approver per type", "—", "Bank change needs 2 approvers", "#/approvals"],
  );
  G.proposalCosts.push(["Optional — website", "Odoo Website: quick-quote form → case, store catalogue by IMPA series, agency brand pages", "TBD (optional)"]);
})();
