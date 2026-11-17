/* Guided tours — one per demo-script scenario. Spotlight + step card; Back / Next / Esc; arrow keys.
   A step: { go?: hash, do?: () => void, wait?: ms, target?: selector | {sel, text}, title, body, place? } */
window.Tour = (() => {
  const $ = (s) => document.querySelector(s);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const click = (sel) => () => { const el = typeof sel === "string" ? $(sel) : find(sel); el?.click(); };
  const card = (text) => ({ sel: "section.card, article.cmp-line, .callout", text });
  const row = (text) => ({ sel: "main tr", text });
  const flagT = (text) => ({ sel: "main .flag, main .callout", text });

  function find(t) {
    if (!t) return null;
    if (typeof t === "string") return document.querySelector(t);
    return [...document.querySelectorAll(t.sel)].find((el) => el.textContent.includes(t.text)) || null;
  }

  const C = "#/case/GS-RFQ-0142";
  const TOURS = [
    { name: "RFQ email → one case", steps: [
      { go: "#/inbox", target: ".mail-list", title: "Every channel lands in one inbox", body: "Emails from Outlook and Gmail, the website quick-quote form and WhatsApp photos all arrive here. Each message is classified: new RFQ, supplier reply, service request or duplicate." },
      { do: click('[data-action=inbox][data-id=m1]'), target: ".mail-body", title: "The original is kept", body: "Helios Bulk's RFQ email with an Excel attachment. The original text and file stay linked to the case for audit — nothing is retyped." },
      { target: '[data-action=ai-extract]', title: "AI drafts the case", body: "One click (or automatically on arrival) reads the email and attachment: customer, vessel, IMO, port, ETA, deadline and every line with brand, part no. and IMPA code." },
      { do: click('[data-action=ai-extract]'), wait: 1500, target: ".field-grid", title: "Confidence on every field", body: "Green = confident, red = uncertain. Low-confidence values (customer ref, currency) are never applied automatically — a person confirms them." },
      { target: flagT("Missing / unclear"), title: "Missing information is flagged", body: "The system lists what's missing and prepares a clarification request to the customer — clear lines keep moving." },
      { target: { sel: ".split .callout", text: "Assignment rule" }, title: "Owner, deadline, urgency, acknowledgement", body: "Owner and backup come from the customer rule; the vessel arriving in 2 days flags it urgent. The approved acknowledgement template is sent once — never twice." },
      { target: '[data-action=create-case]', title: "Confirm and the case exists", body: "One parent case with a unique internal ID plus the customer's reference. Every later document links back to it." },
      { do: click('[data-action=inbox][data-id=m3]'), target: { sel: ".split .flag", text: "No new case" }, title: "Duplicates are caught", body: "A forwarded copy of an existing RFQ (same reference and attachment) is linked to the existing case — no second case, no second acknowledgement." },
    ] },
    { name: "Wrong item in a supplier offer", steps: [
      { go: `${C}/sourcing?preset=quote`, target: card("Supplier RFQs"), title: "One RFQ, many suppliers", body: "Lines were split by category and sent to 9 suppliers without the client's identity. Each status is tracked separately: replied, revised, partial, clarification, awaiting, declined, no response." },
      { go: `${C}/compare`, target: { sel: "article.cmp-line", text: "L2 ·" }, title: "Line-by-line comparison", body: "Every offer is laid against the original line — here LOCTITE 243, exact brand and part required." },
      { target: row("offered LOCTITE 242"), title: "The mismatch is caught", body: "Suez Industrial offered LOCTITE 242. The line is blocked from pricing — it can't silently reach the customer quotation." },
      { target: '[data-action=correction]', title: "Correction drafted for you", body: "The system drafts the correction request with the exact difference, without revealing the client. The line waits in ‘Awaiting corrected offer’ with a due date." },
      { target: row("Revised after clarification"), title: "Revised offer = new version", body: "v2 arrives and becomes selectable; v1 stays on record. Nothing is overwritten — the audit trail shows both." },
    ] },
    { name: "Pack size & brand changes", steps: [
      { go: `${C}/compare?preset=quote`, target: { sel: "article.cmp-line", text: "L3 ·" }, title: "Same need, different packs", body: "The customer asked for 200 × 250 ml (50 L). Offers come in 250 ml cans, 500 ml cans and 1 L bottles." },
      { target: { sel: "article.cmp-line th", text: "EGP / L" }, title: "Normalised to the same unit", body: "Every offer is converted to EGP per litre at the approved FX rate, so 200 × 250 ml and 100 × 500 ml compare fairly — while the supplier's original units are kept." },
      { target: row("1 L bottle"), title: "Wrong specification flagged", body: "Bulk liquid in bottles is not an aerosol — flagged as a spec mismatch (and expired). AI can advise; a person decides technical equivalence." },
      { do: click('input[data-line="3"][data-key="S2|1"]'), target: row("100 × 500 ml"), title: "Choose the alternative pack", body: "100 × 500 ml is cheaper and has longer shelf life, but it's a change to what the customer asked for." },
      { target: '[data-action=accept-alt]', title: "Customer acceptance is required", body: "Internal approval is not enough: written customer acceptance must be recorded (with evidence) before anything is ordered." },
      { go: `${C}/pricing`, target: card("Line pricing"), title: "Pricing knows the condition", body: "Until acceptance is recorded, the pricing check keeps the warning on line 3 — and the approver sees it." },
    ] },
    { name: "Quote submitted, no answer", steps: [
      { go: "#/case/GS-RFQ-0139", target: ".callout", title: "No response ≠ lost", body: "Atlas Tankers hasn't answered quote GS-Q-0139 for 5 days. The case stays in ‘Awaiting customer decision’ — it is never auto-closed as lost." },
      { target: card("Reminders"), title: "Internal reminders only", body: "This customer told Golden Sea not to ask for RFQ status, so only internal reminders are created. No customer follow-up drafts are generated." },
      { go: "#/followups", target: card("Customer decisions"), title: "Contact rules per account", body: "Every waiting customer case shows its contact rule. Drafting a follow-up for Atlas returns ‘not allowed’; for Helios a draft is prepared for review." },
      { go: "#/settings?tab=templates", target: card("Customer contact rules"), title: "Configured once", body: "Contact rules live on the customer account, so every owner and every automation respects them." },
    ] },
    { name: "PO with old price or wrong quantity", steps: [
      { go: `${C}/order?preset=won`, target: card("Customer PO NSM"), title: "Customer PO checked against the quote", body: "The PO is matched to quotation version v1 and checked line by line: price, quantity, pack size, currency, tax, delivery and payment terms." },
      { target: row("20 EA"), title: "Wrong quantity caught", body: "The PO says 20 helmets; the quote was for 15. Line 3 also references the old pack size." },
      { target: flagT("blocked until"), title: "Commitment is blocked", body: "No sales order and no supplier POs until each mismatch has written customer agreement or an approved exception." },
      { target: '[data-action=po-fix]', title: "Record the amendment", body: "The customer's written confirmation is attached to the case — then the block lifts." },
      { target: card("Partial award"), title: "Partial awards handled", body: "Unawarded lines stay open for a revision or are closed with a recorded reason." },
      { go: "#/case/GS-RFQ-0136", target: flagT("expired"), title: "Old price on another case", body: "GS-RFQ-0136: the PO uses an expired v1 price. Same rule — blocked until the customer agrees or management approves an exception." },
    ] },
    { name: "Split delivery with short shelf life", steps: [
      { go: `${C}/delivery?preset=delivery`, target: card("Receipts · lots"), title: "Lots, expiry and quality on receipt", body: "Every receipt records batch, expiry and the quality check against the purchase order." },
      { target: flagT("originally offered"), title: "Shelf life checked before buying", body: "The first offer's batch expired in 15 months — below the customer's 18-month requirement. The accepted batch lasts to June 2028." },
      { target: row("2 short"), title: "Shortfall becomes a backorder", body: "The supplier delivered 8 of 10 helmets; 2 follow later." },
      { target: card("Deliveries"), title: "One order, two deliveries", body: "Drop 1 goes now; drop 2 is scheduled for the vessel's return call. Remaining quantity is always visible." },
      { go: `${C}/lines`, target: card("Line progress"), title: "Never shown as complete too early", body: "Line 5 shows 13 / 15 received, delivered and invoiced — the case can't look finished while anything is open." },
      { go: `${C}/billing`, target: card("Customer invoices"), title: "Billing follows deliveries", body: "Only delivered quantities are invoiced; the second invoice waits for drop 2." },
    ] },
    { name: "Supplier deposit & partial collection", steps: [
      { go: `${C}/billing?preset=delivery`, target: ".kpis", title: "Receivables and payables, separately", body: "What the customer owes, what we owe suppliers, and the cash exposure from deposits paid before collection." },
      { target: card("Customer invoices"), title: "Partial payment", body: "INV/2026/0431 is partly paid — the balance and due date stay visible, and the Egyptian e-invoice status is stored on the invoice." },
      { target: card("Supplier payables"), title: "Supplier side", body: "Horizon's 50% deposit is paid, the balance is due on delivery; one bill is on hold because 2 items weren't received." },
      { go: "#/approvals", target: card("50% advance"), title: "Payments need authorisation", body: "Deposits are approved by the Financial Director or the CEO — the system never makes bank transfers by itself." },
      { target: card("beneficiary bank"), title: "Bank changes: two people", body: "A bank-detail change needs a call-back check and two approvers." },
    ] },
    { name: "Vessel ETA changes, supplier late", steps: [
      { go: `${C}/delivery?preset=delivery`, target: flagT("Agent update"), title: "ETA changed — everything moves", body: "The agent moved the ETA 10 hours earlier. Packing, truck, launch booking and supplier pickup moved automatically and the owner was alerted." },
      { target: card("Delivery plan"), title: "Delivery plan stays current", body: "Truck, boarding staff, launch, documents and the pre-dispatch check — with supplier and customer promises tracked separately." },
      { target: row("Supplier late"), title: "Late supplier, clear next action", body: "Nile Safety is late on 2 helmets. The backorder has an owner and a date, and the customer was told they'll come on the return call." },
      { go: "#/dashboard", target: { sel: ".briefing li", text: "ETA moved" }, title: "Escalated in the daily briefing", body: "ETA changes and delivery risks appear in everyone's morning briefing with a link to the case." },
    ] },
    { name: "Duplicate email or failed integration", steps: [
      { go: "#/automations", target: card("Exception queue"), title: "Nothing fails silently", body: "An expired Outlook token and an unreachable e-invoice signing service are listed with their impact." },
      { target: '[data-action=retry]', title: "Safe retry", body: "Retrying is idempotent: the system checks what was already processed, so nothing is created or sent twice. The retry is written to the audit log." },
      { target: row("Duplicate email reprocessed"), title: "Duplicates resolved automatically", body: "A re-processed email was recognised by its message ID — no new case, no second acknowledgement." },
      { target: card("Rule registry"), title: "Every automation is explicit", body: "Trigger, owner, due time, approval rule, retry behaviour and stop condition for each automation." },
    ] },
    { name: "Order completed and settled", steps: [
      { go: `${C}/close?preset=settled`, target: ".kpis", title: "Expected vs actual profit", body: "The profit promised at quotation compared with the real result once all bills are in." },
      { target: card("Expected vs actual"), title: "Estimates replaced by actuals", body: "Launch delivery cost more (the ETA moved to night time); the damaged-helmet credit note and the FX gain are linked." },
      { go: `${C}/delivery`, target: card("Deliveries"), title: "Signed evidence", body: "Both deliveries were dispatched and confirmed by the vessel with signed delivery notes." },
      { go: `${C}/billing`, target: card("Customer invoices"), title: "Fully invoiced and paid", body: "Both invoices are accepted by the tax authority and paid; all supplier bills are matched and paid." },
      { go: `${C}/close`, target: card("Close checklist"), title: "Close only when reconciled", body: "Every check is green, so the case can be closed — supplier prices and on-time results feed back into future sourcing." },
    ] },
  ];

  /* ---------------- engine ---------------- */
  let tour = null, idx = 0, spot, box, onResize;
  function ensureUI() {
    if (spot) return;
    spot = document.createElement("div"); spot.className = "tour-spot"; spot.setAttribute("aria-hidden", "true");
    box = document.createElement("div"); box.className = "tour-box"; box.setAttribute("role", "dialog"); box.setAttribute("aria-live", "polite"); box.setAttribute("aria-labelledby", "tour-title");
    document.body.append(spot, box);
    box.addEventListener("click", (e) => {
      const a = e.target.closest("[data-tour]"); if (!a) return;
      if (a.dataset.tour === "next") next(); else if (a.dataset.tour === "back") back(); else end();
    });
  }
  function place(el) {
    const pad = 6;
    if (!el) { spot.style.cssText = "display:block;left:50%;top:40%;width:0;height:0"; }
    else {
      const r = el.getBoundingClientRect();
      spot.style.cssText = `display:block;left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px`;
    }
    const bw = Math.min(380, innerWidth - 24), bh = box.offsetHeight || 180;
    let x, y;
    if (!el) { x = (innerWidth - bw) / 2; y = innerHeight * 0.3; }
    else {
      const r = el.getBoundingClientRect();
      const below = r.bottom + 14 + bh < innerHeight, above = r.top - 14 - bh > 0;
      y = below ? r.bottom + 14 : above ? r.top - 14 - bh : Math.max(12, innerHeight - bh - 12);
      x = Math.min(Math.max(12, r.left), innerWidth - bw - 12);
      if (!below && !above && r.right + bw + 24 < innerWidth) { x = r.right + 14; y = Math.max(12, Math.min(r.top, innerHeight - bh - 12)); }
    }
    box.style.width = bw + "px"; box.style.left = x + "px"; box.style.top = y + "px";
  }
  async function show() {
    const s = tour.steps[idx];
    box.classList.add("is-busy");
    if (s.go && location.hash !== s.go) { location.hash = s.go; await sleep(120); }
    if (s.do) { try { s.do(); } catch {} await sleep(s.wait || 150); }
    let el = find(s.target);
    if (!el) { await sleep(300); el = find(s.target); }
    if (el) { el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); await sleep(350); }
    const n = tour.steps.length;
    box.innerHTML = `<div class="tour-meta" title="${tour.name}">Scenario ${tour.i + 1} · step ${idx + 1} of ${n}</div>
      <h2 id="tour-title">${s.title}</h2><p>${s.body}</p>
      <div class="tour-dots" aria-hidden="true">${tour.steps.map((_, i) => `<i class="${i === idx ? "on" : ""}"></i>`).join("")}</div>
      <div class="tour-actions"><button type="button" class="btn btn-ghost btn-sm" data-tour="end">${idx === n - 1 ? "Close" : "Exit tour"}</button><span class="spacer"></span>
        ${idx ? `<button type="button" class="btn btn-sm" data-tour="back">Back</button>` : ""}
        <button type="button" class="btn btn-primary btn-sm" data-tour="next">${idx === n - 1 ? "Finish ✓" : "Next →"}</button></div>`;
    box.classList.remove("is-busy");
    place(el);
    box.querySelector("[data-tour=next]").focus({ preventScroll: true });
    onResize = () => place(find(s.target));
  }
  function next() { if (idx < tour.steps.length - 1) { idx++; show(); } else finish(); }
  function back() { if (idx > 0) { idx--; show(); } }
  function finish() {
    try { const k = "gs-demo-done", d = JSON.parse(localStorage.getItem(k) || "{}"); d[tour.i] = true; localStorage.setItem(k, JSON.stringify(d)); } catch {}
    App.toast(`Scenario ${tour.i + 1} shown — ticked in the demo script`);
    end();
  }
  function end() { tour = null; spot.style.display = "none"; box.style.display = "none"; onResize = null; App.render(); }
  function start(i) {
    ensureUI();
    tour = { ...TOURS[i], i }; idx = 0;
    spot.style.display = "block"; box.style.display = "block";
    show();
  }
  addEventListener("resize", () => onResize?.());
  addEventListener("scroll", () => onResize?.(), { passive: true });
  document.addEventListener("keydown", (e) => {
    if (!tour || document.querySelector("dialog[open]")) return;
    if (e.key === "Escape") end();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") back();
  });
  App.actions.tour = (el) => start(+el.dataset.i);
  return { start, TOURS };
})();
