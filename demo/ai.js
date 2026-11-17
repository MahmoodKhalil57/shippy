/* =====================================================================
   GSAI — AI service stubs ("dud" functions) for the demo.
   ---------------------------------------------------------------------
   Each function documents the production contract and returns canned
   output after a short delay so the UI can show loading → result.

   Production plan (not implemented here):
   - Called from an Odoo server action / custom module, never from the
     browser, so API keys and client data stay server-side.
   - Model: an LLM with vision (e.g. Claude) for PDF / Excel / Word /
     photo parsing; structured JSON output validated against a schema.
   - Every result carries a confidence score. Values below the threshold
     are proposed, never written over approved data (human review).
   - All calls logged (input hash, output, user, timestamp) for audit.
   ===================================================================== */
window.GSAI = (() => {
  const wait = (ms = 900) => new Promise((r) => setTimeout(r, ms));
  const log = (fn, input) => console.info(`[GSAI stub] ${fn}`, input ?? "");

  return {
    /** Extract a customer RFQ from an email + attachment (PDF/XLSX/DOCX/image OCR).
     *  @returns {Promise<{header: Object<string,[string,number]>, lines: Array, missing: string[]}>} */
    async extractRfqFromEmail(message) {
      log("extractRfqFromEmail", message?.id); await wait(1100);
      const byFmt = {
        m1: { header: { Customer: ["Helios Bulk Carriers", 0.99], Vessel: ["MV Helios Star", 0.98], IMO: ["9811204", 0.97], Port: ["Suez (northbound)", 0.93], ETA: ["19 Nov 2026", 0.9], "Quote deadline": ["18 Nov 2026 12:00", 0.95], "Customer ref": ["— not found", 0.2], Currency: ["— not stated (default USD)", 0.45] },
          lines: [["Mechanical seal, Grundfos NB 65-200", "Grundfos", "NB 65-200", "96534915", "—", "2 EA", "Exact brand", 0.96], ["V-belt SPB 2360", "Any", "SPB 2360", "SPB2360", "IMPA 450102", "6 EA", "Any", 0.94], ["Rags, white cotton", "Any", "—", "—", "IMPA 232001", "50 kg", "Any", 0.92], ["Hand cleaner gel 4.5 L", "Any", "—", "—", "IMPA 550211", "4 EA", "Any", 0.88], ["Thermometer bi-metal 0–120 °C, 100 mm", "Any", "—", "—", "—", "2 EA", "Any", 0.71]],
          missing: ["Customer reference", "Currency"] },
        m4: { header: { Customer: ["Baltic Reefer Management", 0.97], Vessel: ["MV Polar Bay", 0.95], IMO: ["— not found", 0.1], Port: ["Alexandria", 0.92], ETA: ["≈ 26 Nov 2026", 0.66], "Quote deadline": ["— not stated", 0.2], "Customer ref": ["REQ-PB-1125", 0.88], Currency: ["EUR", 0.98] },
          lines: [["Galley detergent 20 L", "Any", "—", "—", "IMPA 550612", "6 CAN", "Any", 0.9], ["Toilet paper, 2-ply", "Any", "—", "—", "IMPA 150501", "96 ROLL", "Any", 0.93], ["Cabin light bulb E27 LED 9 W", "Any", "—", "—", "—", "40 EA", "Any", 0.62]],
          missing: ["IMO number", "Quote deadline"] },
        m5: { header: { Customer: ["Atlas Tankers (from sender)", 0.8], Vessel: ["MT Atlas Pearl", 0.9], IMO: ["9755001 (from fleet record)", 0.85], Port: ["Alexandria", 0.9], ETA: ["28 Nov 2026", 0.84], "Quote deadline": ["“asap” → set 19 Nov 12:00?", 0.4], "Customer ref": ["— none (WhatsApp)", 0.1], Currency: ["USD (account default)", 0.7] },
          lines: [["Rope polypropylene 24 mm × 220 m", "Any", "—", "—", "IMPA 210624", "2 COIL", "Any", 0.74], ["Padlock brass 50 mm", "Any", "—", "—", "—", "10 EA", "Any", 0.58], ["Paint brush 3\"", "Any", "—", "—", "IMPA 270403", "24 EA", "Any", 0.81]],
          missing: ["Customer reference", "Quote deadline", "4 handwritten lines illegible — ask for typed list"] },
        m7: { header: { Customer: ["Petro Delta (new — offshore)", 0.86], Vessel: ["Platform PD-3 (offshore Abu Qir)", 0.9], IMO: ["n/a — fixed platform", 0.95], Port: ["Abu Qir — by supply boat", 0.88], ETA: ["Delivery 24 Nov 2026", 0.92], "Quote deadline": ["— not stated", 0.2], "Customer ref": ["— web form", 0.1], Currency: ["EGP (local customer)", 0.6] },
          lines: [["SOLAS life jacket, adult", "Lalizas", "SOLAS 150N", "70925", "IMPA 330101", "30 EA", "Preferred brand", 0.93], ["Lifebuoy with light & smoke signal", "Any", "—", "—", "IMPA 330201", "6 EA", "Any", 0.84]],
          missing: ["Quote deadline", "Customer is new — create contact & check credit terms"] },
      };
      return byFmt[message?.id] || byFmt.m1;
    },

    /** Match an inbound supplier/customer email to an open case.
     *  @returns {Promise<{caseId:string|null, confidence:number, basis:string[]}>} */
    async matchReplyToCase(message) {
      log("matchReplyToCase", message?.id); await wait(700);
      return message?.id === "m6"
        ? { caseId: null, confidence: 0.62, basis: ["sender is invited on GS-RFQ-0142 and GS-RFQ-0140", "4/5 line descriptions resemble GS-RFQ-0142", "no RFQ reference in subject/body"] }
        : { caseId: "GS-RFQ-0142", confidence: 0.99, basis: ["RFQ reference GS-SRFQ-0142-H in body", "thread id"] };
    },

    /** Read a supplier offer (email body / PDF / photo) into structured offer lines.
     *  Output fields: unit price, currency, qty available, pack size, lead time, basis, freight, taxes, validity, terms, compliance. */
    async extractSupplierOffer(text) {
      log("extractSupplierOffer", text?.slice?.(0, 40)); await wait(1000);
      return { supplier: "Port Said Welding Co.", line: 4, unitPrice: 980, currency: "EGP", per: "5 kg pack", qty: 4, lead: "3 days", basis: "Delivered Port Said", validity: "7 days", terms: "Cash", compliance: "Mill cert available", confidence: 0.86 };
    },

    /** Rank suppliers for given lines using category, history, approved list, prices, stock & lead-time records. */
    async recommendSuppliers(lines) {
      log("recommendSuppliers", lines); await wait(900);
      return [
        { sup: "S9", score: 0.91, why: "Welding · on-time 92% · quoted E6013 in Oct (EGP 990 / 5 kg, expired) · stock confirmed weekly" },
        { sup: "S3", score: 0.78, why: "Welding · local to Port Said · slow replies (≈30 h)" },
        { sup: "S1", score: 0.74, why: "All categories · last E6013 price EGP 1,010 (Sep 2026, expired) · lead 5 d misses ETA" },
      ];
    },

    /** Detect deviations between a supplier offer line and the request. Deterministic rules run too; AI adds spec reading. */
    async detectOfferDeviations(offer, line) {
      log("detectOfferDeviations", { offer, line }); await wait(600);
      return offer?.specMismatch ? [offer.specMismatch] : offer?.mismatch ? [offer.mismatch] : [];
    },

    /** Technical equivalence opinion — advisory only, a human must approve. */
    async assessTechnicalEquivalence(lineDesc, offeredDesc) {
      log("assessTechnicalEquivalence", { lineDesc, offeredDesc }); await wait(1000);
      return { verdict: "Likely equivalent — same chemistry & standard; different pack size", confidence: 0.72, differences: ["Pack 500 ml vs 250 ml", "Same 50 L total", "SDS rev. 2025 attached"], requiresCustomerAcceptance: true };
    },

    /** Draft a supplier clarification / correction email without client identity. */
    async draftSupplierClarification(supplier, issue) {
      log("draftSupplierClarification", { supplier, issue }); await wait(800);
      return `Dear ${supplier} team,\n\nThank you for your offer. Item 1 (CRC Belt Grip spray 400 ml, 24 pcs) was not included in your reply.\nCould you please quote it, or confirm you cannot supply, by 17 Nov 15:00?\n\nBest regards,\nKarim Youssef — Golden Sea`;
    },

    /** Draft a customer follow-up, respecting the account's contact rule. Returns null when contact is not allowed. */
    async draftCustomerFollowUp(caseId, rule) {
      log("draftCustomerFollowUp", { caseId, rule }); await wait(700);
      if (/DO NOT/i.test(rule || "")) return null;
      return `Dear Ingrid,\n\nFollowing our quotation GS-Q-0142 v1 for MV Aurora Crest, we can still deliver on arrival at Port Said if we receive your PO by 18 Nov 14:00.\n\nBest regards,\nKarim Youssef`;
    },

    /** Compare a customer PO (PDF) against the approved quotation version. */
    async compareCustomerPO(poFile, quoteVersion) {
      log("compareCustomerPO", { poFile, quoteVersion }); await wait(1200);
      return window.GS.lifecycle.customerPO.checks;
    },

    /** Compare a customer-portal screenshot/receipt with the approved quotation. */
    async comparePortalSubmission(screenshot, quote) {
      log("comparePortalSubmission", screenshot); await wait(1200);
      return [
        { field: "Total", portal: "USD 1,789.46", quote: "USD 1,789.46", ok: true },
        { field: "Line 3 unit price", portal: "5.46", quote: "5.46", ok: true },
        { field: "Payment terms", portal: "60 days (portal default)", quote: "90 days", ok: false },
        { field: "Validity", portal: "24 Nov 2026", quote: "24 Nov 2026", ok: true },
      ];
    },

    /** Suggest owner from customer & category rules + workload. */
    async suggestOwner(caseDraft) { log("suggestOwner", caseDraft); await wait(300); return { owner: "sa", backup: "ky", rule: "Helios Bulk account → Soaad Amer" }; },

    /** Near-duplicate detection (same ref, attachment hash, similar lines). */
    async detectDuplicate(message) { log("detectDuplicate", message?.id); await wait(300); return message?.id === "m3" ? { duplicateOf: "GS-RFQ-0142", basis: "customer ref + attachment hash" } : null; },

    /** Morning briefing text for a user (summarises queue, approvals, risks, cash). */
    async dailyBriefing(userId) {
      log("dailyBriefing", userId); await wait(1000);
      return "3 things need you first: Helios Star quote is due 16:00 with 2 pump-seal suppliers silent; the Nordic Tern PO uses an expired price (commitment blocked); and Cairo Chem was escalated on GS-RFQ-0142. 5 approvals wait for Karim Balbaa. Cash: USD 4,200 due from Helios on 30 Nov; supplier deposits of EGP 96,400 pending approval.";
    },

    /** One-paragraph case summary for handover / reassignment. */
    async summarizeCase(caseId) {
      log("summarizeCase", caseId); await wait(900);
      return "GS-RFQ-0142 (Nordvik, MV Aurora Crest, Port Said ETA 21 Nov 08:00, quote due 18 Nov 14:00). 6 lines: 1–3 and 5 have selected offers (L5 split Nile 10 + Delta 5); L4 waits for Port Said Welding / Alex Weld clarification; L6 blocked on customer sizes. Watch: L3 alternative pack needs written customer acceptance; Horizon (new supplier) wants 50% advance.";
    },

    /** Read an Excel/Word/photo attachment and classify lines into categories (for supplier split). */
    async classifyLines(lines) { log("classifyLines", lines?.length); await wait(500); return lines?.map((l) => ({ ...l, cat: l.cat || "General stores" })); },
  };
})();
