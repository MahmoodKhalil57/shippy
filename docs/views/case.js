/* RFQ case workspace — one parent case from intake to close (GS-RFQ-0142 fully modelled). */
(() => {
  const { D, C, state, views, actions, h, m, toast, runAI, log, openDialog, PRESETS, setPreset, atLeast, MIN_MARGIN } = App;
  const { esc, num, egp, usd, money, chip, who, conf, fmtDate, until, sup, seg, ai, flag, me, daysToEta } = h;
  const { line, offerKey, findOffer, reqBase, offerTotalEGP, perBaseEGP, coverage, offerFlags, bestOffer, selParts, lineStatus, pricing } = m;
  const L = D.lifecycle;

  const STEPS = ["Intake", "Validate", "Source", "Compare", "Price & approve", "Quote sent", "Customer PO", "Purchase", "Deliver", "Invoice & collect", "Close"];
  const DECISIONS = ["Quotation prepared", "Awaiting management approval", "Submitted", "Awaiting customer decision", "Revision requested", "Won", "Lost", "Expired", "On hold"];
  const stepper = (cur) => `<ol class="stepper" aria-label="Case progress">${STEPS.map((s, i) => `<li class="${i < cur ? "done" : i === cur ? "current" : ""}" ${i === cur ? 'aria-current="step"' : ""}>${s}</li>`).join("")}</ol>`;
  const poBlocked = () => L.customerPO.checks.some((c) => !c.ok && !state.poResolved[c.line]);

  function stageInfo() {
    const p = state.preset;
    if (p === "settled") return state.caseClosed ? ["Closed — settled", "ok", 11] : ["Delivered & invoiced — ready to close", "ok", 10];
    if (p === "delivery") return ["Purchasing & delivery — drop 1 of 2", "info", 8];
    if (p === "won") return poBlocked() ? ["Won — customer PO check blocked", "danger", 6] : ["Won — sales order confirmed", "ok", 7];
    return {
      draft: ["Comparing offers & pricing", "info", 3], pending: ["Awaiting management approval", "warn", 4], approved: ["Approved — ready to submit", "ok", 4],
      sent: ["Submitted — awaiting customer decision", "info", 5], revision: ["Revision requested — v2 in preparation", "warn", 4],
    }[state.quoteStatus] || ["Comparing offers", "info", 3];
  }

  /* ---------------- line lifecycle matrix ---------------- */
  function lineLife(l) {
    const p = state.preset;
    const yes = ["✓", "cell-ok"], no = ["—", "cell-no"], part = (t) => [t, "cell-part"], x = (t) => [t, "cell-x"];
    const priced = selParts(l.n).length > 0 || p !== "quote";
    const awarded = [1, 2, 3, 5].includes(l.n);
    const quoted = p === "quote" ? (["sent", "won"].includes(state.quoteStatus) && priced ? yes : priced ? part("draft") : no) : awarded ? yes : l.n === 4 ? part("v2 to follow") : x("closed");
    if (p === "quote") return [quoted, no, no, no, no, no, no];
    const aw = awarded ? (l.n === 5 && !state.poResolved[5] && p === "won" ? part("qty check") : yes) : l.n === 6 ? x("lost") : part("open");
    if (p === "won") return [quoted, aw, no, no, no, no, no];
    const settled = p === "settled";
    if (!awarded) return [quoted, aw, no, no, no, no, no];
    const ord = yes;
    const rec = l.n === 5 && !settled ? part("13 / 15") : yes;
    const del = l.n === 5 && !settled ? part("13 / 15") : yes;
    const inv = l.n === 5 && !settled ? part("13 / 15") : yes;
    const paid = settled ? yes : part("partial");
    return [quoted, aw, ord, rec, del, inv, paid];
  }

  /* ================================================================== */
  views.case = (parts) => {
    const [id, tab = "lines"] = parts;
    if (id !== C.id) return otherCase(id);
    const statuses = C.lines.map(lineStatus);
    const ok = statuses.filter((s) => /selected/.test(s[0])).length;
    const blk = statuses.filter((s) => s[0] === "Clarification needed").length;
    const wait = C.lines.length - ok - blk;
    const [stageLabel, stageTone, curStep] = stageInfo();
    const flagsCount = Object.values(C.offers).reduce((n, os) => n + os.filter((o) => o.mismatch || o.packChange || o.specMismatch).length, 0);
    const lockedFor = (need) => !atLeast(need);
    const tabs = [
      ["lines", "Lines", C.lines.length], ["sourcing", "Supplier RFQs", state.supplierRfqs.length], ["compare", "Compare offers", flagsCount, "warn"], ["pricing", "Pricing"], ["quote", "Quotation"],
      ["order", "Customer PO", null, null, "won"], ["purchasing", "Purchasing", null, null, "delivery"], ["delivery", "Receipts & delivery", null, null, "delivery"], ["billing", "Billing & cash", null, null, "delivery"], ["close", "Profit & close", null, null, "delivery"],
      ["activity", "Activity", state.timeline.length],
    ];
    const bodies = { lines: tabLines, sourcing: tabSourcing, compare: tabCompare, pricing: tabPricing, quote: tabQuote, order: tabOrder, purchasing: tabPurchasing, delivery: tabDelivery, billing: tabBilling, close: tabClose, activity: tabActivity };
    const t = tabs.find((x) => x[0] === tab);
    const body = t && t[4] && lockedFor(t[4]) ? lockedTab(t[4]) : (bodies[tab] || tabLines)();
    const eta = atLeast("delivery") ? "2026-11-20T22:00" : C.eta;

    return [`
      <div>
        <div class="crumbs"><a href="#/cases">RFQ cases</a> / ${C.id}</div>
        <div class="page-head">
          <div><h1>${C.id} · ${esc(C.vessel)}</h1></div>
          <div class="row">${chip(stageLabel, stageTone)}${state.preset === "quote" ? chip("Urgent · ETA < 7 days", "danger") : ""}<button type="button" class="btn btn-sm btn-ai" data-action="ai-summary">Summary</button><button type="button" class="btn btn-sm" data-action="reassign">Reassign</button></div>
        </div>
      </div>

      <div class="demo-bar" role="group" aria-label="Demo timeline">
        <strong>Demo timeline ▸</strong>
        ${Object.entries(PRESETS).map(([k, p]) => `<a class="btn btn-sm ${state.preset === k ? "btn-primary" : ""}" href="#/case/${C.id}/${{ quote: "compare", won: "order", delivery: "delivery", settled: "close" }[k]}?preset=${k}" ${state.preset === k ? 'aria-current="true"' : ""}>${esc(p.label)}</a>`).join("")}
        <span class="notice">Jumps the same case forward in time (mock data).</span>
      </div>

      <section class="card case-head" aria-label="Case summary">
        <dl class="case-meta">
          <div><dt>Customer</dt><dd><a href="#/customers/C1">${esc(C.customer)}</a></dd></div>
          <div><dt>Customer ref · internal ID</dt><dd class="mono">${esc(C.customerRef)}<span class="sub">${C.id}</span></dd></div>
          <div><dt>Vessel · IMO</dt><dd>${esc(C.vessel)} · ${C.imo}</dd></div>
          <div><dt>Port · agent</dt><dd>${esc(C.port)}<span class="sub">${esc(C.agent)}</span></dd></div>
          <div><dt>Vessel ETA</dt><dd>${fmtDate(eta, true)} <span class="sub ${atLeast("delivery") ? "t-warn" : ""}">${atLeast("delivery") ? "moved −10 h (agent 19 Nov)" : until(C.eta)}</span></dd></div>
          <div><dt>Quote deadline</dt><dd>${fmtDate(C.quoteDeadline, true)} <span class="sub t-warn">${state.preset === "quote" ? until(C.quoteDeadline) : "met"}</span></dd></div>
          <div><dt>Owner · backup</dt><dd>${who(C.owner)} <span class="sub">Backup: ${D.users[C.backup].name}</span></dd></div>
          <div><dt>Currency · contact rule</dt><dd>${C.currency} <span class="sub">${esc(C.contactRule)}</span></dd></div>
        </dl>
        <div>
          <div class="progress" role="img" aria-label="${ok} of ${C.lines.length} lines have a selected offer">${seg(ok, 6, "var(--ok)")}${seg(wait, 6, "var(--warn)")}${seg(blk, 6, "var(--danger)")}</div>
          <div class="legend mt-2"><span><i style="background:var(--ok)"></i>${ok} offer selected</span><span><i style="background:var(--warn)"></i>${wait} in progress</span><span><i style="background:var(--danger)"></i>${blk} blocked</span><span class="spacer"></span><span><strong>Next action:</strong> ${esc(nextAction())}</span></div>
        </div>
        ${stepper(curStep)}
      </section>

      <nav class="tabs" aria-label="Case sections">
        ${tabs.map(([k, l, n, tone, need]) => `<a href="#/case/${C.id}/${k}" ${k === tab ? 'aria-current="page"' : ""}>${need && lockedFor(need) ? "🔒 " : ""}${l}${n ? ` <span class="count ${tone || ""}">${n}</span>` : ""}</a>`).join("")}
      </nav>
      ${body}`, `${C.id} · ${t ? t[1] : "Lines"}`];
  };

  function nextAction() {
    const p = state.preset;
    if (p === "won") return poBlocked() ? "Resolve 2 PO mismatches before confirming the sales order" : "Re-check costs, then approve supplier POs";
    if (p === "delivery") return "Collect POD for drop 1 · chase Nile Safety backorder · release Horizon balance";
    if (p === "settled") return state.caseClosed ? "None — case closed" : "Review actual profit and close";
    return { draft: "Select remaining offers, check pricing, request approval", pending: "Karim Balbaa to approve quotation", approved: "Submit quotation to customer", sent: "Wait for customer — internal reminder 19 Nov", revision: "Prepare v2 and re-submit for approval" }[state.quoteStatus];
  }
  const lockedTab = (need) => `<section class="card locked"><h2>Not reached yet</h2><p class="mt-2">This stage opens when the case reaches “${esc(PRESETS[need].label)}”.</p><a class="btn btn-primary mt-3" href="#/case/${C.id}/${{ won: "order", delivery: "delivery" }[need]}?preset=${need}">Jump to that point in the demo</a></section>`;

  /* ---------------- Lines ---------------- */
  function tabLines() {
    const life = ["Quoted", "Awarded", "Ordered", "Received", "Delivered", "Invoiced", "Paid"];
    return `
      <section class="card">
        <div class="card-head"><div><h2>Requested lines</h2><p>Extracted from the customer PDF · original text & attachment preserved · units converted for comparison</p></div>
          <div class="row"><button type="button" class="btn btn-sm">📎 ${esc(C.customerRef)}.pdf</button><button type="button" class="btn btn-sm">+ Add line</button></div></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>#</th><th>Description · original text</th><th>Brand rule</th><th>Model · part · IMPA / ISSA</th><th class="num">Qty</th><th>Category</th><th>Certificates / requirements</th><th>Extraction</th><th>Status</th></tr></thead>
          <tbody>${C.lines.map((l) => {
            const [s, t] = lineStatus(l);
            return `<tr>
              <td>${l.n}</td>
              <td>${esc(l.desc)}${l.note ? `<span class="sub">${esc(l.note)}</span>` : ""}${l.missing ? `<span class="sub t-danger">⚑ ${esc(l.missing)}</span>` : ""}
                <details class="small"><summary class="text-2">Original</summary><code>${esc(l.original)}</code></details></td>
              <td>${l.exact ? chip(`${l.brand} ${l.pn} only`, "gold") : "Alternatives allowed"}</td>
              <td class="small">${esc(l.model)} · <span class="mono">${esc(l.pn)}</span><span class="sub">IMPA ${esc(l.impa)} · ISSA ${esc(l.issa)}</span></td>
              <td class="num">${l.qty} <span class="sub">${esc(l.uom)}${l.packSize !== 1 ? ` = ${num(reqBase(l))} ${l.base}` : ""}</span></td>
              <td>${esc(l.cat)}</td>
              <td class="small">${esc(l.certs)}</td>
              <td>${conf(l.conf)}</td>
              <td>${chip(s, t)}</td></tr>`;
          }).join("")}</tbody></table></div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Clarifications</h2><p>Questions and answers recorded against the affected line — clear lines keep moving</p></div><button type="button" class="btn btn-sm" data-action="ask">+ Ask a question</button></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Line</th><th>Question</th><th>Asked</th><th>Answer</th><th></th></tr></thead><tbody>
          ${state.clarifications.map((q, i) => `<tr><td>L${q.line}</td><td>${esc(q.q)}<span class="sub">${esc(q.via)}</span></td><td class="nowrap small">${esc(q.asked)} · ${who(q.by, false)}</td><td>${q.a ? `<span class="t-ok">${esc(q.a)}</span>` : chip("Waiting", "warn")}</td><td>${q.a ? "" : `<button type="button" class="btn btn-sm" data-action="answer" data-i="${i}">Record answer</button>`}</td></tr>`).join("")}
        </tbody></table></div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Line progress through the order</h2><p>The case is the parent; each line moves on its own — a partly delivered case never shows as complete</p></div></div>
        <div class="table-wrap"><table class="data matrix"><thead><tr><th>Line</th>${life.map((x) => `<th class="num">${x}</th>`).join("")}</tr></thead><tbody>
          ${C.lines.map((l) => `<tr><td>L${l.n} · ${esc(l.desc.slice(0, 38))}…</td>${lineLife(l).map(([v, c]) => `<td class="cell ${c}">${esc(v)}</td>`).join("")}</tr>`).join("")}
        </tbody></table></div>
      </section>`;
  }

  /* ---------------- Sourcing ---------------- */
  function tabSourcing() {
    const st = (s) => ({ Replied: "ok", "Revised offer received": "ok", "Awaiting reply": "warn", "Partial reply": "warn", "Clarification needed": "warn", Declined: "", "No response": "danger", Sent: "info", Requested: "info" }[s] ?? "");
    const count = (re) => state.supplierRfqs.filter((r) => re.test(r.status)).length;
    return `
      <div class="kpis">
        <div class="card kpi"><span class="label">Supplier requests</span><span class="value">${state.supplierRfqs.length}</span><span class="delta">from 1 customer RFQ, split by category</span></div>
        <div class="card kpi"><span class="label">Replied / revised</span><span class="value t-ok">${count(/Replied|Revised/)}</span><span class="delta">offers captured automatically</span></div>
        <div class="card kpi"><span class="label">Pending · partial · clarification</span><span class="value t-warn">${count(/Awaiting|Sent|Partial|Clarification/)}</span><span class="delta">reminders scheduled</span></div>
        <div class="card kpi"><span class="label">Declined / no response</span><span class="value">${count(/Declined|No response/)}</span><span class="delta">1 escalated to owner</span></div>
      </div>
      <section class="card">
        <div class="card-head"><div><h2>Supplier RFQs</h2><p>Each supplier sees only the lines they can quote — never the client, vessel or client attachments</p></div>
          <div class="row"><button type="button" class="btn btn-sm" data-action="log-manual">Log phone / WhatsApp offer</button><button type="button" class="btn btn-sm btn-ai" data-action="ai-offer">Extract offer from text</button><button type="button" class="btn btn-sm btn-primary" data-action="new-srfq">+ Send supplier RFQ</button></div></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Supplier</th><th>Lines</th><th>Sent</th><th>Due</th><th>Status</th><th class="num">Reminders</th><th>Latest</th><th></th></tr></thead>
          <tbody>${state.supplierRfqs.map((r, i) => {
            const s = sup(r.sup);
            const act = /Awaiting|Sent/.test(r.status) ? `<button type="button" class="btn btn-sm" data-action="remind" data-i="${i}">Remind now</button>` : r.status === "Partial reply" ? `<button type="button" class="btn btn-sm btn-ai" data-action="ai-partial" data-i="${i}">Draft follow-up</button>` : r.status === "Clarification needed" ? `<button type="button" class="btn btn-sm" data-action="answer-sup" data-i="${i}">Answer supplier</button>` : "";
            return `<tr>
              <td><a class="row-link" href="#/suppliers/${r.sup}">${esc(s.name)}</a>${s.isNew ? ` ${chip("New supplier", "gold")}` : ""}<span class="sub">${esc(s.city)} · ${s.cats.join(", ")}</span></td>
              <td class="nowrap">${r.lines.map((n) => `<span class="chip no-dot" title="${esc(line(n).desc)}">L${n}</span>`).join(" ")}</td>
              <td class="nowrap">${fmtDate(r.sent, true)}</td><td class="nowrap">${fmtDate(r.due, true)}</td>
              <td>${chip(r.status, st(r.status))}</td>
              <td class="num">${r.reminders}${/Declined|Replied|Revised/.test(r.status) ? `<span class="sub">stopped</span>` : r.status === "No response" ? `<span class="sub t-danger">escalated</span>` : ""}</td>
              <td class="small">${esc(r.last)}</td><td class="nowrap">${act}</td></tr>`;
          }).join("")}</tbody></table></div>
      </section>
      <div class="two">
        <div class="callout"><strong>Automatic reply matching.</strong> Replies match by supplier RFQ reference (e.g. <code>GS-SRFQ-0142-H</code>), thread and sender — even when the subject changes. Below 85% confidence they go to the <a href="#/inbox">review queue</a> instead of being guessed.</div>
        <div class="callout"><strong>New suppliers are saved automatically.</strong> Horizon Trading didn't exist before this case. Its contact, category and dated price were stored on reply — available for future RFQs even if we never order.</div>
      </div>`;
  }

  /* ---------------- Compare ---------------- */
  function tabCompare() {
    return `
      <div class="row"><p class="text-2">Each offer is checked against the original line. Prices are normalised to the requested unit (EA / L / kg) in EGP at the approved FX rate, keeping the supplier's own units and currency. AI suggests matches and deviations; technical equivalence is a human decision.</p><span class="spacer"></span><span class="chip info no-dot">${esc(D.fxApproved)}</span></div>
      ${C.lines.map((l) => {
        const offers = C.offers[l.n] || [];
        const best = bestOffer(l.n);
        const [s, t] = lineStatus(l);
        const head = `<header><strong>L${l.n} · ${esc(l.desc)}</strong><span class="req">Requested: ${l.qty} ${esc(l.uom)}${l.packSize !== 1 ? ` (${num(reqBase(l))} ${l.base})` : ""} · ${l.exact ? `${esc(l.brand)} ${esc(l.pn)} only` : "alternatives allowed"} · ${esc(l.certs)}</span><span class="spacer"></span>${chip(s, t)}</header>`;
        if (!offers.length) return `<article class="cmp-line">${head}<div class="empty">Not sent to suppliers yet — waiting for the customer's size breakdown.<div class="row mt-3" style="justify-content:center"><a class="btn btn-sm" href="#/case/${C.id}/lines">See clarification</a></div></div></article>`;
        const pending = state.supplierRfqs.filter((r) => r.lines.includes(l.n) && /Awaiting|Sent|Clarification/.test(r.status));
        const missing = (C.missingFrom[l.n] || []);
        const split = C.split[l.n];
        const reason = state.selReason[l.n];
        return `<article class="cmp-line">${head}
          <div class="table-wrap"><table class="data">
            <thead><tr><th class="radio-cell"><span class="visually-hidden">Select</span></th><th>Supplier</th><th>Offered</th><th class="num">Price (orig.)</th><th class="num">Total EGP</th><th class="num">EGP / ${l.base}</th><th class="num">Lead</th><th>Valid · terms · basis</th><th>Checks</th></tr></thead>
            <tbody>${offers.map((o) => {
              const key = offerKey(o);
              const selected = state.selected[l.n] === key;
              const blocked = o.mismatch || o.superseded || o.specMismatch;
              const sp = sup(o.sup);
              return `<tr class="${selected ? "selected" : ""} ${o.superseded ? "dim" : ""}">
                <td class="radio-cell"><input type="radio" name="sel-${l.n}" aria-label="Select ${esc(sp.name)} v${o.ver}" data-action="select" data-line="${l.n}" data-key="${key}" ${selected ? "checked" : ""} ${blocked ? "disabled" : ""}></td>
                <td><span class="strong">${esc(sp.name)}</span> <span class="text-2 small">v${o.ver}</span>${best === o ? ` <span class="best">· Best fit</span>` : ""}<span class="sub">On-time ${sp.onTime ?? "—"}${sp.onTime ? "%" : " (new)"} · compliance ${sp.compliance ?? "—"}${sp.compliance ? "%" : ""} · replies ~${sp.replyHrs} h</span></td>
                <td class="nowrap">${esc(o.packLabel || `${o.packs} ${l.uom}`)}<span class="sub">${Math.round(coverage(o, l) * 100)}% of requested${o.expiry ? ` · exp. ${o.expiry}` : ""}</span></td>
                <td class="num">${money(o.price, o.cur)}<span class="sub">per ${o.packSize === 1 && l.base === "EA" ? "EA" : "pack"}</span></td>
                <td class="num">${egp(offerTotalEGP(o))}</td>
                <td class="num strong">${num(perBaseEGP(o), 2)}</td>
                <td class="num ${o.lead > daysToEta ? "t-danger" : ""}">${o.lead} d<span class="sub">ready ${fmtDate(new Date(Date.parse(D.today) + o.lead * 864e5))}</span></td>
                <td class="small nowrap">${fmtDate(o.valid)} · ${esc(o.terms || "—")}<span class="sub">${esc(o.basis || "—")}</span></td>
                <td><div class="stack" style="gap:4px">${offerFlags(o, l).map(([tone, txt]) => flag(tone, txt)).join("")}
                  ${o.mismatch ? `<div class="row"><button type="button" class="btn btn-sm" data-action="correction">View correction request</button>${chip("v2 received", "ok")}</div>` : ""}
                  ${o.specMismatch ? `<button type="button" class="btn btn-sm btn-ai" data-action="ai-equiv" data-line="${l.n}">Technical check</button>` : ""}
                  ${o.packChange ? `<button type="button" class="btn btn-sm btn-ai" data-action="ai-equiv" data-line="${l.n}">Equivalence & differences</button>` : ""}
                  ${o.packChange && selected && !state.customerAccepted[l.n] ? `<button type="button" class="btn btn-sm" data-action="accept-alt" data-line="${l.n}">Record customer acceptance</button>` : ""}
                  ${o.packChange && state.customerAccepted[l.n] ? flag("ok", "Customer accepted in writing (email 17 Nov, attached)") : ""}
                </div></td></tr>`;
            }).join("")}
            ${split ? (() => {
              const cost = split.reduce((s, p) => s + perBaseEGP(findOffer(l.n, p.key)) * p.qty * l.packSize, 0);
              const single = best ? perBaseEGP(best) * reqBase(l) : 0;
              return `<tr class="${state.selected[l.n] === "split" ? "selected" : ""}"><td class="radio-cell"><input type="radio" name="sel-${l.n}" aria-label="Select split sourcing" data-action="select" data-line="${l.n}" data-key="split" ${state.selected[l.n] === "split" ? "checked" : ""}></td>
                <td colspan="3"><span class="strong">Split sourcing</span> ${ai("Proposal")}<span class="sub">${split.map((p) => `${sup(findOffer(l.n, p.key).sup).name} × ${p.qty}`).join(" + ")}</span></td>
                <td class="num">${egp(cost)}</td><td class="num strong">${num(cost / reqBase(l), 2)}</td><td colspan="2" class="small">Two POs, both before ETA</td>
                <td>${single ? flag("ok", `Saves ${egp(single - cost)} vs best single supplier`) : ""}</td></tr>`;
            })() : ""}
            ${missing.map((sid) => `<tr class="dim"><td></td><td>${esc(sup(sid).name)}</td><td colspan="7">${flag("danger", "Missing item: supplier did not quote this line (partial reply) — follow-up drafted")}</td></tr>`).join("")}
            ${pending.map((r) => `<tr class="dim"><td></td><td>${esc(sup(r.sup).name)}</td><td colspan="7">${chip(r.status, "warn")} <span class="text-2 small">${esc(r.last)}</span></td></tr>`).join("")}
            </tbody></table></div>
            ${reason ? `<div class="card-body small"><b>Selection reason (kept for approver):</b> ${esc(reason)}</div>` : ""}
          </article>`;
      }).join("")}
      <div class="row"><span class="spacer"></span><a class="btn btn-primary" href="#/case/${C.id}/pricing">Continue to pricing →</a></div>`;
  }

  /* ---------------- Pricing ---------------- */
  function tabPricing() {
    if (state.role === "sa") return `<section class="card"><div class="empty"><h2>Costs and margins are hidden for your role</h2><p class="mt-2">Soaad Amer (Sales) sees selling prices on the quotation; supplier costs and margins are restricted to supply chain, finance and management.</p><a class="btn mt-3" href="#/case/${C.id}/quote">View quotation</a></div></section>`;
    const P = pricing();
    const exceptions = P.priced.some((r) => r.checks.some((c) => c[0] === "warn" || c[0] === "danger")) || state.discount > 3;
    return `
      <div class="kpis">
        <div class="card kpi"><span class="label">Landed cost (priced lines)</span><span class="value">${egp(P.tot.cost)}</span><span class="delta">incl. ${egp(P.charges)} shared charges · ${P.tot.missingCost ? "1 estimate" : "all confirmed"}</span></div>
        <div class="card kpi"><span class="label">Selling total (excl. VAT)</span><span class="value">${usd(P.tot.sellUSD, 0)}</span><span class="delta">${egp(P.tot.sell)} at USD/EGP ${D.fx.USD}${state.discount ? ` · after ${state.discount}% discount` : ""}</span></div>
        <div class="card kpi"><span class="label">Expected gross profit</span><span class="value ${P.tot.profit < 0 ? "t-danger" : "t-ok"}">${egp(P.tot.profit)}</span><span class="delta">Margin ${num(P.tot.margin, 1)}% (profit ÷ sales) · Markup ${num((P.tot.profit / P.tot.cost) * 100, 1)}% (profit ÷ cost)</span></div>
        <div class="card kpi"><span class="label">Recoverable input VAT</span><span class="value">${egp(P.tot.vat)}</span><span class="delta">14% on supplier bills — excluded from cost</span></div>
        <div class="card kpi"><span class="label">Lines priced</span><span class="value">${P.priced.length} / ${C.lines.length}</span><span class="delta">${C.lines.length - P.priced.length} to follow as revision</span></div>
      </div>
      <section class="card">
        <div class="card-head"><div><h2>Line pricing</h2><p>Policy “Marine stores 2026” — target 25%, minimum ${MIN_MARGIN}% (<a href="#/settings">configurable by management</a>; past assumptions are never a fixed default)</p></div>
          <div class="row"><label class="lbl" style="flex-direction:row;align-items:center">Shared charges<select id="alloc" data-action="alloc"><option value="value" ${state.allocation === "value" ? "selected" : ""}>by line value</option><option value="qty" ${state.allocation === "qty" ? "selected" : ""}>by quantity</option><option value="lines" ${state.allocation === "lines" ? "selected" : ""}>equal per line</option></select></label>
          <label class="lbl" style="flex-direction:row;align-items:center" for="disc">Customer discount %<input id="disc" type="number" min="0" max="20" step="0.5" value="${state.discount}" data-action="discount"></label></div></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>#</th><th>Line · selected supplier(s)</th><th class="num">Cost</th><th class="num">+ Shared</th><th class="num">Landed</th><th class="num">Margin %</th><th class="num">Markup</th><th class="num">Sell (USD)</th><th class="num">Unit (USD)</th><th>Checks</th></tr></thead>
          <tbody>${P.rows.map((r) => r.parts.length ? `
            <tr><td>${r.l.n}</td>
              <td>${esc(r.l.desc)}<span class="sub">${r.parts.map((p) => `${esc(sup(p.o.sup).name)} v${p.o.ver} · ${money(p.o.price, p.o.cur)} · ${p.o.lead} d`).join(" + ")}</span></td>
              <td class="num">${egp(r.cost)}</td><td class="num">${egp(r.alloc)}</td><td class="num strong">${egp(r.landed)}</td>
              <td class="num"><label class="visually-hidden" for="m-${r.l.n}">Margin for line ${r.l.n}</label><input id="m-${r.l.n}" type="number" min="-50" max="80" step="0.5" value="${r.m}" data-action="margin" data-line="${r.l.n}"></td>
              <td class="num">${num(r.markup, 1)}%</td><td class="num strong">${usd(r.sellUSD)}</td><td class="num">${usd(r.unitUSD)}</td>
              <td><div class="stack" style="gap:4px">${r.checks.length ? r.checks.map(([t, x]) => flag(t, x)).join("") : flag("ok", "OK")}</div></td></tr>` : `
            <tr class="dim"><td>${r.l.n}</td><td>${esc(r.l.desc)}</td><td colspan="8">${chip(lineStatus(r.l)[0], lineStatus(r.l)[1])} <span class="text-2 small">No cost yet — excluded from this version (flag: missing cost estimate)</span></td></tr>`).join("")}
          </tbody></table></div>
      </section>
      <section class="card"><div class="card-head"><div><h2>Price build-up per line</h2><p>Supplier cost + shared charges + gross profit = selling price (EGP) · hover for values</p></div></div>
        <div class="card-body">${Viz.stacked({ rows: P.priced.map((r) => [`L${r.l.n} ${r.l.desc.split(",")[0].split(" ").slice(0, 3).join(" ")}`, [Math.round(r.cost), Math.round(r.alloc), Math.round(r.profit)]]), keys: ["Supplier cost", "Shared charges", "Gross profit"], colors: ["var(--s1)", "var(--s2)", "var(--s3)"], fmt: (v) => num(v), label: "Price build-up per line" })}</div></section>
      <div class="two">
        <section class="card"><div class="card-head"><h2>Shared charges</h2><p>Estimates and unknowns are marked; actuals replace them at close</p></div>
          <div class="card-body stack">${C.deliveryCharges.map((c) => `<div class="row"><span>${esc(c.label)}</span><span class="spacer"></span>${c.na ? chip("Not applicable — local supply", "") : c.estimate ? chip("Estimate", "warn") : chip("Confirmed", "ok")}<span class="strong nowrap">${egp(c.egp)}</span></div>`).join("")}
          <div class="row small text-2">VAT: supply to a foreign vessel in transit is expected to be 0% — confirm treatment with finance. Quote shows prices excl. VAT; invoice totals shown separately.</div></div></section>
        <section class="card"><div class="card-head"><h2>Approval</h2><p>Rule: quotations, discounts > 3%, margin exceptions → Karim Balbaa</p></div>
          <div class="card-body stack">
            ${exceptions ? flag("warn", "Exceptions present — shown to the approver with the request.") : flag("ok", "No exceptions — standard approval.")}
            ${approvalButton()}
          </div></section>
      </div>`;
  }
  actions["change:margin"] = (el) => { state.margins[el.dataset.line] = parseFloat(el.value) || 0; };
  actions["change:alloc"] = (el) => { state.allocation = el.value; };
  actions["change:discount"] = (el) => { state.discount = Math.max(0, parseFloat(el.value) || 0); };

  function approvalButton() {
    const s = state.quoteStatus;
    if (s === "draft" || s === "revision") return `<button type="button" class="btn btn-primary" data-action="request-approval">Request approval from Karim Balbaa${s === "revision" ? " (v" + state.quoteVersion + ")" : ""}</button>`;
    if (s === "pending") return state.role === "kb" ? `<div class="row"><button type="button" class="btn btn-primary" data-action="approve-quote">Approve quotation</button><button type="button" class="btn btn-danger" data-action="return-quote">Return with comment</button></div>` : flag("info", "Waiting for Karim Balbaa. Switch “Viewing as” to Karim Balbaa to approve.");
    if (s === "approved") return `<div class="row">${flag("ok", "Approved by Karim Balbaa")}<a class="btn btn-primary" href="#/case/${C.id}/quote">Go to quotation →</a></div>`;
    return flag("ok", `Quotation v${state.quoteVersion} submitted`);
  }

  /* ---------------- Quote ---------------- */
  function tabQuote() {
    const P = pricing();
    const pending = C.lines.filter((l) => !selParts(l.n).length);
    const draft = !["approved", "sent", "won"].includes(state.quoteStatus) && state.preset === "quote";
    const decisionNow = state.preset !== "quote" ? "Won" : { draft: "Quotation prepared", pending: "Awaiting management approval", approved: "Quotation prepared", sent: "Awaiting customer decision", revision: "Revision requested" }[state.quoteStatus];
    const sub = state.submission;
    return `
      <section class="card"><div class="card-body stack">
        <div class="row"><b>Customer decision</b><span class="text-2 small">· no response never means lost</span></div>
        <div class="row">${DECISIONS.map((d) => d === decisionNow ? chip(d, "info") : `<span class="chip no-dot">${esc(d)}</span>`).join("")}</div>
        <div class="row small">${state.quoteStatus === "sent" ? `Submitted 17 Nov 11:05 · follow-up 19 Nov (internal reminder + 1 approved customer draft) · owner Karim Youssef · latest response: none` : state.preset !== "quote" ? "Won 18 Nov 09:20 — customer PO NSM-PO-77231 (all reminders cancelled)" : "Not yet submitted"}
          <span class="spacer"></span>${state.quoteStatus === "sent" ? `<button type="button" class="btn btn-sm" data-action="revision">Customer requested revision</button><a class="btn btn-sm btn-primary" href="#/case/${C.id}/order?preset=won">Customer PO received →</a>` : ""}</div>
      </div></section>
      <div class="row">
        ${flag("info", "Customer-facing — supplier names, costs and margins are never included.")}
        <span class="spacer"></span>
        <span class="small text-2">Versions: ${Array.from({ length: state.quoteVersion }, (_, i) => `<b>v${i + 1}</b>`).join(" · ")}</span>
        ${state.quoteStatus === "approved" ? `<button type="button" class="btn btn-primary" data-action="send-quote">Submit to customer</button>` : state.preset === "quote" && !["sent"].includes(state.quoteStatus) ? `<a class="btn" href="#/case/${C.id}/pricing">Back to pricing</a>${approvalButton()}` : ""}
      </div>
      ${state.quoteStatus === "approved" || state.quoteStatus === "sent" ? `
      <section class="card"><div class="card-head"><h2>Submission</h2><p>Portal submissions are complete only with a stored receipt and matching values</p></div>
        <div class="card-body stack">
          <div class="row" role="radiogroup" aria-label="Submission method"><label class="switch"><input type="radio" name="sm" data-action="sub-method" value="email" ${sub.method === "email" ? "checked" : ""}> Email from Odoo (tracked: sent / viewed / accepted)</label><label class="switch"><input type="radio" name="sm" data-action="sub-method" value="portal" ${sub.method === "portal" ? "checked" : ""}> Customer procurement portal</label></div>
          ${sub.method === "portal" ? `<div class="row"><span class="small">1. Enter quote in customer portal · 2. Upload confirmation screenshot / receipt</span><span class="spacer"></span><button type="button" class="btn btn-sm btn-ai" data-action="ai-portal">Upload screenshot & compare</button></div>
            ${sub.portal ? `<div class="table-wrap"><table class="data"><thead><tr><th>Field</th><th>Portal</th><th>Approved quote</th><th></th></tr></thead><tbody>${sub.portal.map((r) => `<tr><td>${esc(r.field)}</td><td>${esc(r.portal)}</td><td>${esc(r.quote)}</td><td>${r.ok ? chip("Match", "ok") : chip("Difference", "danger")}</td></tr>`).join("")}</tbody></table></div>
            ${flag("warn", "Portal submission NOT marked complete: payment terms differ (portal default 60 days). Correct in portal or record customer agreement.")}` : ""}` : ""}
        </div></section>` : ""}
      <article class="quote-paper" aria-label="Quotation preview">
        ${draft ? `<div class="watermark">DRAFT — not yet approved. Will be issued as version ${state.quoteVersion}.</div>` : ""}
        <div class="q-top">
          <div class="q-logo"><span class="brand-mark">GS</span><div><strong>GOLDEN SEA</strong><small>FOR TRADING &amp; MARKETING · EST. 2011</small></div></div>
          <div style="text-align:end"><h2>QUOTATION</h2><div class="small">No. GS-Q-0142 · v${state.quoteVersion}<br>Your ref: ${esc(C.customerRef)}<br>Date: 17/11/2026</div></div>
        </div>
        <table style="width:auto;margin-top:18px"><tbody>
          <tr><td><b>Company</b></td><td>${esc(C.customer)}</td></tr>
          <tr><td><b>Attention</b></td><td>${esc(C.contact)}</td></tr>
          <tr><td><b>Vessel</b></td><td>${esc(C.vessel)} (IMO ${C.imo})</td></tr>
          <tr><td><b>Delivery</b></td><td>On board at ${esc(C.port)} · ETA ${fmtDate(C.eta, true)}</td></tr>
        </tbody></table>
        <p style="color:#0b2a6b;font-weight:600">We are pleased to furnish our quotation as below:</p>
        <table><thead><tr><th>S.</th><th>Part no.</th><th>Description</th><th>UOM</th><th class="num">Qty</th><th>Lead</th><th class="num">Price/USD</th><th class="num">Total/USD</th></tr></thead>
          <tbody>${P.priced.map((r, i) => { const alt = r.parts.some((p) => p.o.packChange); return `<tr><td>${String(i + 1).padStart(2, "0")}</td><td>${esc(r.l.pn === "local" || r.l.pn === "—" ? `IMPA ${r.l.impa}` : r.l.pn)}</td><td>${esc(alt ? r.l.desc.replace("250 ml", "500 ml (alternative pack, accepted)") : r.l.desc)}</td><td>${alt ? "CAN 500 ml" : esc(r.l.quoteUom)}</td><td class="num">${alt ? 100 : r.l.qty}</td><td>On arrival</td><td class="num">${num(alt ? r.sellUSD / 100 : r.unitUSD, 2)}</td><td class="num">${num(r.sellUSD, 2)}</td></tr>`; }).join("")}</tbody></table>
        ${state.discount ? `<div class="row small" style="justify-content:space-between"><span>Discount ${state.discount}%</span><span>included</span></div>` : ""}
        <div class="q-total"><span>Total in USD (excl. VAT)</span><span>${num(P.tot.sellUSD, 2)}</span></div>
        <p style="margin-top:16px;font-weight:700;text-decoration:underline;font-style:italic">Remarks:</p>
        <ul>
          <li>Delivery: on board at ${esc(C.port)} on arrival (${fmtDate(C.eta)}), subject to PO by 18 Nov 2026 14:00.</li>
          <li>Prices are exclusive of Value Added Tax (VAT); VAT treatment per applicable law.</li>
          ${pending.length ? `<li>Items ${pending.map((l) => l.n).join(", ")} of your request will follow in a revised quotation.</li>` : ""}
          <li>Valid until 24 Nov 2026. Payment terms: 90 days from invoice date.</li>
        </ul>
        <div class="row" style="justify-content:space-between;margin-top:14px;align-items:flex-end"><p class="small">Prepared by Karim Youssef${draft ? "" : " · Approved by Karim Balbaa"}</p><p class="small" style="border-top:1px solid #0b2a6b;padding-top:4px;min-width:180px;text-align:center">${draft ? "signature on approval" : "<i>K. Youssef</i> — authorised signature"}</p></div>
        <div class="q-foot">sales@goldensea.com.eg · 6th of October City, Giza · demo document</div>
      </article>`;
  }

  /* ---------------- Customer PO ---------------- */
  function tabOrder() {
    const po = L.customerPO;
    const blocked = poBlocked();
    return `
      <section class="card"><div class="card-head"><div><h2>Customer PO ${po.no}</h2><p>Received ${po.received} · matched to ${po.quoteVersion} · billing entity ${esc(po.billing)}</p></div>
        <div class="row"><button type="button" class="btn btn-sm">📎 ${po.no}.pdf</button><button type="button" class="btn btn-sm btn-ai" data-action="ai-po">Re-run PO check</button></div></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Line</th><th>Checked field</th><th>Customer PO</th><th>Approved quotation</th><th>Result</th><th></th></tr></thead><tbody>
          ${po.checks.map((c) => { const res = c.ok || state.poResolved[c.line]; return `<tr><td>${c.line ? "L" + c.line : "Header"}</td><td>${esc(c.field)}</td><td>${esc(c.po)}</td><td>${esc(c.quote)}</td><td>${c.ok ? (c.info ? flag("info", c.info) : chip("Match", "ok")) : res ? flag("ok", c.fix + " — recorded") : chip("Mismatch", "danger")}</td><td>${!c.ok && !res ? `<button type="button" class="btn btn-sm" data-action="po-fix" data-line="${c.line}">Record customer amendment</button>` : ""}</td></tr>`; }).join("")}
        </tbody></table></div></section>
      ${blocked ? flag("danger", "Sales order confirmation and supplier POs are blocked until every mismatch has written customer agreement or an approved exception.") : flag("ok", "PO validated — sales order SO/0142 confirmed. Supplier POs can be prepared.")}
      <section class="card"><div class="card-head"><h2>Partial award</h2><p>Unawarded lines stay open or are closed with a reason</p></div>
        <div class="card-body stack small">${po.unawarded.map((u) => `<div class="row">L${u.line} · ${esc(line(u.line).desc)} <span class="spacer"></span>${/Closed/.test(u.reason) ? chip(u.reason, "") : chip(u.reason, "warn")}</div>`).join("")}
        <div class="row">Call-off / scheduled delivery: L5 helmets split into 13 now + 2 on return call (agreed with customer).</div></div></section>
      <div class="row"><span class="spacer"></span><button type="button" class="btn btn-primary" ${blocked ? "disabled" : ""} data-action="confirm-so">Confirm sales order & prepare supplier POs</button></div>`;
  }

  /* ---------------- Purchasing ---------------- */
  function tabPurchasing() {
    return `
      <section class="card"><div class="card-head"><div><h2>Re-check before purchase approval</h2><p>Costs, FX, availability and lead time are reconfirmed — changes re-enter approval</p></div></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Item</th><th>At quotation</th><th>Now</th><th>Impact</th><th></th></tr></thead><tbody>
          ${L.recheck.map((r) => `<tr><td>${esc(r.item)}</td><td>${esc(r.was)}</td><td>${esc(r.now)}</td><td class="small">${esc(r.impact)}</td><td>${r.ok ? chip("OK", "ok") : chip("Changed", "warn")}</td></tr>`).join("")}
        </tbody></table></div></section>
      <section class="card"><div class="card-head"><div><h2>Linked supplier purchase orders</h2><p>Created from the approved sales requirement — split suppliers & scheduled quantities · approved by Karim Balbaa 18 Nov</p></div></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>PO</th><th>Supplier</th><th>Lines</th><th class="num">Amount</th><th>Acknowledgement</th><th>Pro forma · deposit</th><th>Supplier bill (3-way match)</th><th>Status</th></tr></thead><tbody>
          ${L.supplierPOs.map((p) => `<tr><td class="mono">${p.po}</td><td>${esc(sup(p.sup).name)}</td><td class="small">${esc(p.lines)}</td><td class="num">${esc(p.amount)}</td><td class="small">${esc(p.ack)}</td><td class="small">${esc(p.proforma)}<span class="sub">${esc(p.deposit)}</span></td><td class="small">${esc(p.bill)}</td><td>${chip(state.preset === "settled" ? "Paid" : p.status, state.preset === "settled" ? "ok" : /hold/.test(p.status) ? "warn" : "info")}</td></tr>`).join("")}
        </tbody></table></div></section>
      <div class="two">${flag("danger", "Duplicate bill blocked: " + L.duplicateBill)}${flag("info", "Supplier invoices are issued to Golden Sea; we invoice the customer separately. Deposits use the approved exception route; credit note CN-DM-031 (damaged helmet) is linked to P00432.")}</div>`;
  }

  /* ---------------- Delivery ---------------- */
  function tabDelivery() {
    const settled = state.preset === "settled";
    return `
      ${flag("warn", "⚓ " + L.etaChange)}
      <section class="card"><div class="card-head"><h2>Delivery plan</h2><p>Supplier promises and customer promises are tracked separately</p></div>
        <div class="card-body"><dl class="kv">
          <dt>Port · place</dt><dd>Port Said anchorage — launch delivery</dd>
          <dt>Vessel ETA</dt><dd>20 Nov 22:00 <span class="text-2">(was 21 Nov 08:00)</span></dd>
          <dt>Agent / delivery contact</dt><dd>${esc(C.agent)}</dd>
          <dt>Goods ready (warehouse Port Said)</dt><dd>20 Nov 14:00 — packed, labelled per line</dd>
          <dt>Vehicle &amp; boarding staff</dt><dd>Golden Sea truck 3 (Alexandria → Port Said) · boarding staff Ahmed R. · departs 20 Nov 15:30</dd>
          <dt>Transport booking</dt><dd>Launch “Canal Star 3” 20 Nov 21:30 (moved from 21 Nov 07:00)</dd>
          <dt>Consolidated with</dt><dd><a href="#/case/GS-SVC-0021">GS-SVC-0021</a> — 2 cases of the owner's engine spares cleared at Cairo airport ride on the same truck and launch (no duplicate transport charge)</dd>
          <dt>Clearance</dt><dd>Ship-stores declaration via agent · documents ready</dd>
          <dt>Customer promise</dt><dd>On board on arrival · helmets 2 pcs on return call 05 Dec (agreed)</dd>
          <dt>Supplier promises</dt><dd>Nile Safety: 2 helmets 22 Nov (late vs 19 Nov) · all others received</dd>
          <dt>Pre-dispatch check</dt><dd>${chip("Goods ready", "ok")} ${chip("Docs: DN, packing list, SDS, EN 397 cert", "ok")} ${chip("No open approval", "ok")}</dd>
        </dl></div></section>
      <section class="card"><div class="card-head"><h2>Receipts · lots · expiry · quality</h2><p>Shelf life checked against delivery date + 12-month usage period</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Line</th><th>Supplier</th><th class="num">Received</th><th>Batch / lot</th><th>Expiry</th><th>Quality check</th><th>Note</th></tr></thead><tbody>
          ${L.receipts.map((r) => `<tr><td>L${r.line}</td><td>${esc(sup(r.sup).name)}</td><td class="num">${settled && r.line === 5 && r.sup === "S4" ? "10 / 10" : esc(r.qty)}</td><td class="mono">${esc(r.batch)}</td><td>${esc(r.expiry)}</td><td>${/short|damaged/.test(r.qc) && !settled ? chip(r.qc, "warn") : chip(settled && /short/.test(r.qc) ? "Backorder received 22 Nov" : r.qc, "ok")}</td><td class="small">${esc(r.note)}</td></tr>`).join("")}
        </tbody></table></div>
        <div class="card-body">${flag("ok", "Line 3 originally offered with Feb 2027 expiry (15 months) — rejected for the 18-month requirement; accepted alternative batch expires Jun 2028.")}</div></section>
      <section class="card"><div class="card-head"><h2>Deliveries</h2><p>“Delivered” requires evidence — dispatch and confirmed receipt are separate</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Delivery</th><th>Date</th><th>Place</th><th>Lines</th><th>Dispatched</th><th>Confirmed receipt</th><th>Evidence</th></tr></thead><tbody>
          ${L.deliveries.map((d, i) => { const done = i === 0 || settled; return `<tr><td class="mono">${d.no}</td><td>${esc(i === 1 && settled ? "05 Dec" : d.date)}</td><td class="small">${esc(d.place)}</td><td class="small">${esc(d.lines)}</td><td>${done ? chip("Dispatched", "ok") : chip("Scheduled", "info")}</td><td>${done ? chip("Signed by vessel", "ok") : chip("Pending", "")}</td><td class="small">${esc(done ? (i === 1 ? "Signed DN, 2nd Officer, 05 Dec 16:20" : d.evidence) : "—")}</td></tr>`; }).join("")}
        </tbody></table></div></section>`;
  }

  /* ---------------- Billing & cash ---------------- */
  function tabBilling() {
    const settled = state.preset === "settled";
    const inv = L.invoices.map((x, i) => settled ? { ...x, no: i === 1 ? "INV/2026/0447" : x.no, eta: "Submitted · Valid", status: "Paid", paid: x.amount } : x);
    const recv = inv.reduce((s, x) => s + x.amount - x.paid, 0);
    return `
      <div class="kpis">
        <div class="card kpi"><span class="label">Invoiced to customer</span><span class="value">${usd(inv.filter((x) => x.status !== "Not invoiced yet").reduce((s, x) => s + x.amount, 0))}</span><span class="delta">only delivered quantities — never twice</span></div>
        <div class="card kpi"><span class="label">Receivable outstanding</span><span class="value ${recv ? "t-warn" : "t-ok"}">${usd(recv)}</span><span class="delta">${settled ? "settled" : "USD 1,000 received 15 Dec (partial)"}</span></div>
        <div class="card kpi"><span class="label">Payables outstanding</span><span class="value">${settled ? "EGP 0" : "EGP 45,440 + USD 117.60"}</span><span class="delta">${settled ? "all suppliers paid" : "Horizon balance due on delivery"}</span></div>
        <div class="card kpi"><span class="label">Cash exposure</span><span class="value">${settled ? "EGP 0" : "EGP 5,715"}</span><span class="delta">deposit paid before customer collection</span></div>
      </div>
      <section class="card"><div class="card-head"><div><h2>Customer invoices</h2><p>From the accepted order and delivery evidence · legal entity, tax ID, currency and prices verified</p></div></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Invoice</th><th>Basis</th><th class="num">Amount</th><th>VAT</th><th>Tax authority e-invoice</th><th class="num">Paid</th><th>Due</th><th>Status</th></tr></thead><tbody>
          ${inv.map((x) => `<tr><td class="mono">${esc(x.no)}</td><td class="small">${esc(x.basis)}</td><td class="num">${usd(x.amount)}</td><td class="small">${esc(x.vat)}</td><td class="small">${/Valid/.test(x.eta) ? chip(x.eta, "ok") : chip(x.eta, "")}</td><td class="num">${usd(x.paid)}</td><td>${esc(x.due)}</td><td>${chip(x.status, x.status === "Paid" ? "ok" : /Partial/.test(x.status) ? "warn" : "")}</td></tr>`).join("")}
        </tbody></table></div>
        <div class="card-body small text-2">Egyptian e-invoicing via the Odoo Egypt localisation (signed submission, UUID and status stored on the invoice). Scope and signing set-up to be confirmed with Golden Sea's finance team.</div></section>
      <section class="card"><div class="card-head"><h2>Supplier payables</h2><p>Payments, postings and bank changes need authorised review — no autonomous bank transactions</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Supplier</th><th>Document</th><th class="num">Total</th><th class="num">Paid</th><th>Due</th><th>Status</th></tr></thead><tbody>
          ${L.payables.map((p) => `<tr><td>${esc(p.sup)}</td><td class="mono small">${esc(p.doc)}</td><td class="num">${esc(p.total)}</td><td class="num">${settled ? esc(p.total) : esc(p.paid)}</td><td>${esc(p.due)}</td><td>${chip(settled ? "Paid" : p.status, settled ? "ok" : /hold/.test(p.status) ? "warn" : "")}</td></tr>`).join("")}
        </tbody></table></div></section>
      ${settled ? "" : `<div class="row">${flag("info", "Collection: internal reminder 14 Jan · customer draft prepared (Nordvik allows follow-ups) for review.")}<button type="button" class="btn btn-sm btn-ai" data-action="ai-collect">Draft collection email</button></div>`}`;
  }

  /* ---------------- Profit & close ---------------- */
  function tabClose() {
    const settled = state.preset === "settled";
    const est = L.actuals.reduce((s, a) => s + a.est, 0), act = L.actuals.reduce((s, a) => s + a.act, 0);
    const sell = 1789.46 * 48.6;
    const checks = [
      ["All awarded quantities delivered with signed evidence", settled],
      ["All customer invoices issued & accepted by tax authority", settled],
      ["Customer balance collected", settled],
      ["Supplier bills matched & paid", settled],
      ["Claims & credit notes linked (DM-C-17 / CN-DM-031)", true],
      ["Estimated costs replaced by actuals", settled],
    ];
    const ready = checks.every((c) => c[1]);
    return `
      <div class="kpis">
        <div class="card kpi"><span class="label">Expected gross profit (at quote)</span><span class="value">${egp(sell - est)}</span><span class="delta">${num(((sell - est) / sell) * 100, 1)}% margin</span></div>
        <div class="card kpi"><span class="label">Actual gross profit</span><span class="value ${settled ? "t-ok" : ""}">${settled ? egp(sell - act) : "—"}</span><span class="delta">${settled ? num(((sell - act) / sell) * 100, 1) + "% margin" : "available when costs are final"}</span></div>
        <div class="card kpi"><span class="label">Operational status</span><span class="value">${settled ? "Complete" : "1 of 2 drops"}</span><span class="delta">deliveries with evidence</span></div>
        <div class="card kpi"><span class="label">Financial status</span><span class="value">${settled ? "Settled" : "Open"}</span><span class="delta">${settled ? "no residual balances" : "USD 789 receivable · payables open"}</span></div>
      </div>
      <section class="card"><div class="card-head"><h2>Expected vs actual</h2></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Cost</th><th class="num">Expected</th><th class="num">Actual</th><th class="num">Difference</th><th>Note</th></tr></thead><tbody>
          ${L.actuals.map((a) => `<tr><td>${esc(a.item)}</td><td class="num">${egp(a.est)}</td><td class="num">${settled ? egp(a.act) : "—"}</td><td class="num ${a.act - a.est > 0 ? "t-danger" : "t-ok"}">${settled ? egp(a.act - a.est) : "—"}</td><td class="small">${esc(a.note || "")}</td></tr>`).join("")}
        </tbody></table></div></section>
      <section class="card"><div class="card-head"><h2>Close checklist</h2><p>Closes only when quantities, documents, claims and balances reconcile — or an authorised exception is recorded</p></div>
        <div class="card-body stack">${checks.map(([t, ok]) => `<div class="row">${ok ? chip("Done", "ok") : chip("Open", "warn")} ${esc(t)}</div>`).join("")}
          <div class="row">${state.caseClosed ? flag("ok", "Case closed 15 Jan 2027 by Karim Youssef. Supplier prices, lead times and on-time results fed back to supplier records.") : `<button type="button" class="btn btn-primary" data-action="close-case" ${ready ? "" : "disabled"}>Close case</button>${ready ? "" : `<button type="button" class="btn">Close with authorised exception…</button>`}`}</div>
        </div></section>`;
  }

  /* ---------------- Activity ---------------- */
  function tabActivity() {
    const items = state.timeline.slice().reverse();
    return `
      <div class="grid-2-1">
        <section class="card"><div class="card-head"><h2>Case history</h2><p>Every automatic step and human decision — email, WhatsApp, files, approvals</p></div>
          <div class="card-body"><ol class="timeline">${items.map((e) => `
            <li><span class="dot ${e.kind}" aria-hidden="true">${esc(e.ico)}</span>
              <div><div class="row"><time>${e.live ? "Just now" : fmtDate(e.t, true)}</time>${e.kind === "auto" ? `<span class="tag-auto">Automatic</span>` : e.kind === "alert" ? `<span class="tag-auto" style="background:var(--danger-soft);color:var(--danger)">Alert</span>` : `<span class="tag-human">Human</span>`}</div>
              <p>${esc(e.text)}</p></div></li>`).join("")}</ol></div></section>
        <section class="card"><div class="card-head"><h2>Linked documents</h2></div>
          <div class="card-body stack small">
            <div>📄 Customer RFQ · ${esc(C.customerRef)}.pdf (original)</div><div>✉ Acknowledgement · 15 Nov 09:14</div>
            <div>📤 ${state.supplierRfqs.length} supplier RFQs (GS-SRFQ-0142-A…J)</div><div>📥 8 supplier offers (incl. 1 revision, 1 WhatsApp)</div>
            <div>🧾 Quotation GS-Q-0142 v${state.quoteVersion}</div>
            ${atLeast("won") ? `<div>📄 Customer PO NSM-PO-77231 · SO/0142</div>` : ""}
            ${atLeast("delivery") ? `<div>🛒 P00431–P00434 · bills DM-5512, NS-2290</div><div>🚚 DN-0142-1 signed · POD photo</div><div>🧾 INV/2026/0431 (tax authority: Valid)</div>` : `<div class="text-2">Sales order · POs · deliveries · invoices appear here once created</div>`}
          </div></section>
      </div>`;
  }

  /* ---------------- other cases (summary) ---------------- */
  function otherCase(id) {
    const c = D.cases.find((x) => x.id === id);
    if (!c) return [`<div class="empty"><h1>Case not found</h1><p><a href="#/cases">Back to cases</a></p></div>`, "Not found"];
    const idx = /Awaiting supplier|corrected/.test(c.stage) ? 2 : /approval|Revision/.test(c.stage) ? 4 : /customer decision|On hold|Expired|Lost/.test(c.stage) ? 5 : /PO/.test(c.stage) ? 6 : /Delivering/.test(c.stage) ? 8 : /Invoiced/.test(c.stage) ? 9 : 3;
    const special = {
      "GS-RFQ-0139": `<div class="callout"><strong>Customer contact rule: “Do not ask for RFQ status.”</strong> Quote submitted 12 Nov. The case stays in <em>Awaiting customer decision</em> — it is never auto-marked lost. Internal reminder to Karim Youssef every 3 days; no customer follow-up drafts are generated.</div>
        <section class="card"><div class="card-head"><h2>Reminders</h2></div><div class="card-body stack">
          <div class="row">${chip("Internal", "info")} 15 Nov — “No reply on GS-Q-0139 v1 (USD 21,650). Check vessel schedule.”</div>
          <div class="row">${chip("Internal", "info")} 18 Nov — scheduled</div>
          <div class="row">${chip("Customer follow-up", "")} <span class="text-2">Disabled by account rule</span></div></div></section>`,
      "GS-RFQ-0136": `${flag("danger", "Customer PO NSM-PO-77104 line 3 uses USD 3.10 from quotation v1 (expired 07 Nov). Current approved v2 price is USD 3.45. Sales order and supplier POs are blocked until a revised customer agreement is recorded.")}
        <div class="row"><button type="button" class="btn btn-primary" data-action="toast" data-msg="Draft to customer prepared: PO line 3 price vs quotation v2">Draft PO amendment request</button><button type="button" class="btn">Accept old price (needs approval)</button></div>`,
      "GS-RFQ-0133": `${flag("warn", "Vessel ETA changed 20 Nov → 21 Nov. Drop 2 delivery task, launch booking and supplier pickup moved automatically; owner Ahmedy notified.")}`,
      "GS-RFQ-0131": `<section class="card"><div class="card-head"><h2>Balances</h2></div><div class="card-body stack">
          <div class="row">Customer invoice INV/2026/0412 · USD 14,200 ${chip("Partially paid", "warn")} <span class="spacer"></span>Received USD 10,000 · <b>Due USD 4,200 on 30 Nov</b></div>
          <div class="row">Supplier bill BILL/2026/0388 · EGP 512,000 ${chip("Paid", "ok")} <span class="spacer"></span>Deposit 50% + balance, matched to PO P00402</div></div></section>`,
      "GS-SVC-0021": `<div class="callout"><strong>Spare-parts clearance &amp; forwarding.</strong> Owner's spares (DHL AWB 41 2233 9081) cleared at Cairo airport as ship spares in transit, then delivered on board with the stores of <a href="#/case/GS-RFQ-0142">GS-RFQ-0142</a> — one truck, one launch.</div>
        <section class="card"><div class="card-head"><h2>Clearance steps</h2></div><div class="table-wrap"><table class="data"><thead><tr><th>Step</th><th>Status</th><th>Evidence</th></tr></thead><tbody>
        ${[["AWB arrived Cairo airport", "Done 19 Nov 06:10", "DHL tracking"], ["Documents: invoice, packing list, vessel letter", "Complete", "3 files"], ["Customs declaration (spares in transit)", "Submitted 19 Nov 10:20", "Declaration 88412"], ["Customs release", "Expected 19 Nov 15:00", "—"], ["Truck to Port Said with GS-RFQ-0142 stores", "Planned 20 Nov 15:30", "Truck 3"], ["Delivery on board", "Planned 20 Nov 22:30", "Signed delivery note required"]].map(([a, b, c]) => `<tr><td>${a}</td><td>${/Done|Complete/.test(b) ? chip(b, "ok") : chip(b, "info")}</td><td class="small">${c}</td></tr>`).join("")}</tbody></table></div></section>
        <section class="card"><div class="card-head"><h2>Billable to customer</h2></div><div class="card-body stack small"><div class="row">Clearance &amp; handling fee <span class="spacer"></span><b>USD 350</b></div><div class="row">Airport → warehouse transport <span class="spacer"></span><b>USD 120</b></div><div class="row">Customs duties / storage (re-billed at cost) <span class="spacer"></span><b>USD 180 (estimate)</b></div></div></section>`,
      "GS-RFQ-0143": `<div class="callout"><strong>Provisions with cold chain.</strong> Fresh, dry, frozen and chilled lines for the DOS Falcon rig — delivered offshore Abu Qir by supply boat.</div>
        <section class="card"><div class="card-head"><h2>Cold-chain checklist</h2></div><div class="card-body stack small">
          <div class="row">${chip("Reefer truck 2 booked", "ok")} Alexandria warehouse → Abu Qir base, 23 Nov 05:00</div>
          <div class="row">${chip("Temperature log", "info")} Frozen ≤ −18 °C · chilled 0–4 °C — recorded at loading, at the base and at boat transfer</div>
          <div class="row">${chip("Certificates", "warn")} Health &amp; halal certificates for 4 frozen lines — 1 missing (chicken breast)</div>
          <div class="row">${chip("Insulated containers", "ok")} 3 × 1 m³ for the boat transfer</div></div></section>`,
      "GS-HLD-0007": `<div class="callout"><strong>Held stores for an incoming vessel.</strong> 11 lines received for MV Helios Dawn and stored in the Alexandria warehouse because the vessel's call keeps moving — Golden Sea's service for uncertain vessel movements.</div>
        <section class="card"><div class="card-head"><h2>Storage</h2></div><div class="card-body stack small">
          <div class="row">Location <span class="spacer"></span><b>Alexandria WH / Held / HELIOS-DAWN</b></div>
          <div class="row">Received <span class="spacer"></span><b>08 Nov 2026</b></div>
          <div class="row">Free storage until <span class="spacer"></span><b>22 Nov 2026 (14 days)</b></div>
          <div class="row">Storage charge afterwards <span class="spacer"></span><b>USD 5 / day — customer draft prepared for review</b></div>
          <div class="row">Vessel call <span class="spacer"></span><b>Moved 25 Nov → 04 Dec (owner email 15 Nov)</b></div></div></section>`,
      "GS-RFQ-0140": `${flag("warn", "Awaiting corrected offer: supplier quoted RAL 7035 instead of RAL 7038 on line 4. Correction due 19 Nov 12:00. The line is excluded from pricing until the corrected version arrives.")}`,
      "GS-RFQ-0135": `${flag("info", "Revision requested by customer 15 Nov: replace line 3 with ESAB alternative. v2 re-enters approval because scope and price change; v1 kept in history.")}`,
    }[id] || "";
    return [`
      <div><div class="crumbs"><a href="#/cases">RFQ cases</a> / ${c.id}</div>
      <div class="page-head"><h1>${c.id} · ${esc(c.vessel)}</h1><div class="row">${chip(c.stage, c.tone === "neutral" ? "" : c.tone)}</div></div></div>
      <section class="card case-head">
        <dl class="case-meta">
          <div><dt>Customer</dt><dd>${esc(c.customer)}</dd></div><div><dt>Port</dt><dd>${esc(c.port)}</dd></div>
          <div><dt>ETA</dt><dd>${fmtDate(c.eta)}</dd></div><div><dt>Owner</dt><dd>${who(c.owner)}</dd></div>
          <div><dt>Value</dt><dd>${usd(c.value, 0)}</dd></div><div><dt>Next action</dt><dd>${esc(c.next)}</dd></div>
        </dl>
        ${c.blocker ? flag(c.tone === "danger" ? "danger" : "warn", "⚑ " + c.blocker) : ""}
        ${stepper(idx)}
      </section>
      ${special}
      <p class="text-2 small">This demo models <a href="#/case/${C.id}">${C.id}</a> in full; other cases show their summary and the scenario they illustrate.</p>`, c.id];
  }

  /* ================================================================== */
  /* Actions                                                            */
  /* ================================================================== */
  const initials = () => me().initials;
  Object.assign(actions, {
    select(el) {
      const n = +el.dataset.line, key = el.dataset.key;
      const best = bestOffer(n);
      const apply = (reason) => {
        state.selected[n] = key;
        if (reason) state.selReason[n] = reason; else delete state.selReason[n];
        const label = key === "split" ? "split sourcing" : `${sup(findOffer(n, key).sup).name} v${findOffer(n, key).ver}`;
        log("human", initials(), `Selected ${label} for line ${n}${reason ? ` — reason: ${reason}` : ""}.`);
        toast(`Line ${n}: ${label} selected`);
        App.render();
      };
      if (key !== "split" && best && offerKey(best) === key) return apply();
      openDialog({
        title: `Why this offer for line ${n}?`,
        body: `<p class="small">This isn't the system's best-fit offer. The reason is kept with the case and shown to the approver.</p><label class="lbl">Reason<textarea name="r" data-autofocus>${key === "split" ? "Split: cheapest combination that covers the full quantity before ETA" : "Faster / more reliable supplier for a vessel call; difference within tolerance"}</textarea></label>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Select with reason", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => apply(App.val(f, "r")),
      });
      App.render(); // restore radio state if cancelled
    },
    remind(el) {
      const r = state.supplierRfqs[+el.dataset.i];
      r.reminders++; r.last = `Reminder ${r.reminders} sent just now`;
      log("human", initials(), `Manual reminder sent to ${sup(r.sup).name}.`);
      toast(`Reminder sent to ${sup(r.sup).name}`); App.render();
    },
    "ai-partial"(el) {
      const r = state.supplierRfqs[+el.dataset.i];
      runAI(el, () => GSAI.draftSupplierClarification(sup(r.sup).name, "missing line 1"), (txt) => openDialog({
        title: `Follow-up to ${esc(sup(r.sup).name)}`, body: `${ai("Draft")}<div class="email-preview">${esc(txt)}</div><p class="small text-2">✓ No client identity · due date set on send</p>`,
        actions: [{ label: "Discard", value: "cancel" }, { label: "Send", value: "ok", cls: "btn-primary" }],
        onClose: () => { r.last = "Follow-up for missing line 1 sent just now"; log("human", initials(), `Asked ${sup(r.sup).name} to quote missing line 1.`); toast("Follow-up sent"); App.render(); },
      }));
    },
    "answer-sup"(el) {
      const r = state.supplierRfqs[+el.dataset.i];
      openDialog({ title: `Answer ${esc(sup(r.sup).name)}`, body: `<p class="small">Question: “ESAB only? Mill certificate required?”</p><label class="lbl">Answer (sent without client identity)<textarea name="a" data-autofocus>Any reputable brand is acceptable (state brand). EN ISO 2560 mill certificate is required with delivery.</textarea></label>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Send answer", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => { r.status = "Awaiting reply"; r.last = "Answer sent — awaiting offer"; const q = state.clarifications.find((x) => x.line === 4 && !x.a); if (q) q.a = App.val(f, "a"); log("human", initials(), `Answered supplier question on line 4.`); toast("Answer sent · status back to Awaiting reply"); App.render(); } });
    },
    ask() {
      openDialog({ title: "Ask a question about a line", body: `<div class="field-grid"><label class="lbl">Line<select name="l" data-autofocus>${C.lines.map((l) => `<option value="${l.n}">L${l.n} · ${esc(l.desc.slice(0, 40))}</option>`).join("")}</select></label><label class="lbl">To<select name="t"><option>Customer</option><option>Supplier</option><option>Internal</option></select></label></div><label class="lbl">Question<textarea name="q">Is a certificate of conformity required for line 5?</textarea></label>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Send question", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => { state.clarifications.push({ line: +App.val(f, "l"), q: App.val(f, "q"), asked: "Just now", by: state.role, via: App.val(f, "t"), a: null }); toast("Question logged against the line"); App.render(); } });
    },
    answer(el) {
      const q = state.clarifications[+el.dataset.i];
      openDialog({ title: `Record answer — line ${q.line}`, body: `<p class="small">${esc(q.q)}</p><label class="lbl">Answer & source<textarea name="a" data-autofocus>${q.line === 6 ? "Sizes: 2 M, 4 L, 3 XL, 1 XXL — Capt. Erik via WhatsApp 17 Nov" : ""}</textarea></label>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Save answer", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => { q.a = App.val(f, "a"); log("human", initials(), `Clarification answered for line ${q.line}.`); toast(`Line ${q.line} answer saved${q.line === 6 ? " — line can now be sent to suppliers" : ""}`); App.render(); } });
    },
    reassign() {
      openDialog({
        title: "Reassign case",
        body: `<label class="lbl">New owner<select name="owner" data-autofocus>${Object.entries(D.users).filter(([k]) => k !== "mb").map(([k, u]) => `<option value="${k}" ${k === "sa" ? "selected" : ""}>${u.name}</option>`).join("")}</select></label>
               <label class="lbl">Handover note (logged)<textarea name="note">Covering while I'm at the port tomorrow. Line 6 waiting on sizes; Port Said Welding due today 12:00.</textarea></label><p class="small text-2">Tip: ✦ Summary drafts a handover note.</p>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Reassign", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => { const u = D.users[App.val(f, "owner")]; log("human", initials(), `Reassigned to ${u.name}. Note: ${App.val(f, "note")}`); toast(`Case reassigned to ${u.name} — handover note logged`); App.render(); },
      });
    },
    "ai-summary"(el) { runAI(el, () => GSAI.summarizeCase(C.id), (t) => openDialog({ title: "Case summary", body: `${ai("Summary")}<div class="ai-out mt-2">${esc(t)}</div>`, actions: [{ label: "Close", value: "cancel", cls: "btn-primary" }] })); },
    correction() {
      openDialog({
        title: "Correction request — Suez Industrial Supply",
        body: `${flag("danger", "Line 2: offered LOCTITE 242, requested LOCTITE 243 (exact brand & part required).")}
          <div class="email-preview">To: sales@suez-industrial.example
Subject: GS-SRFQ-0142-B · Correction needed on item 2

Dear Suez Industrial team,

Thank you for your offer. Item 2 does not match our request:
 • Requested: LOCTITE 243, 50 ml (medium strength) — exact part required
 • Offered:   LOCTITE 242

Please confirm price and availability for LOCTITE 243, 3 pcs, delivery Port Said by 20 Nov.

Best regards,
Karim Youssef — Golden Sea</div>
          <div class="row small text-2">✓ Client name, vessel and correspondence not included · status “Awaiting corrected offer” due 16 Nov 15:00 · v2 received 13:05 · v1 kept</div>`,
        actions: [{ label: "Close", value: "cancel", cls: "btn-primary" }],
      });
    },
    "ai-equiv"(el) {
      const l = line(+el.dataset.line);
      runAI(el, () => GSAI.assessTechnicalEquivalence(l.desc, "offer"), (r) => openDialog({
        title: `Technical check — line ${l.n}`,
        body: `${ai("Advisory")}<div class="ai-out mt-2"><b>${l.n === 3 && el.closest("tr")?.textContent.includes("Gulf") ? "Not equivalent — bulk liquid cannot replace aerosol for this use" : esc(r.verdict)}</b> ${conf(r.confidence)}<ul>${r.differences.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div><p class="small">AI is advisory. A person approves technical equivalence, and the <b>customer must accept in writing</b> before ordering an alternative.</p><button type="button" class="btn btn-sm" data-action="toast" data-msg="Alternative proposal (technical data + differences) prepared for the customer">Prepare alternative proposal for customer</button>`,
        actions: [{ label: "Close", value: "cancel", cls: "btn-primary" }],
      }));
    },
    "accept-alt"(el) {
      const n = el.dataset.line;
      openDialog({
        title: `Record customer acceptance — line ${n}`,
        body: `<p>Alternative: <b>100 × 500 ml</b> instead of <b>200 × 250 ml</b> (same 50 L). Internal approval alone does not count as customer acceptance.</p>
          <label class="lbl">Customer's written acceptance<input type="text" name="ref" value="Email from Nordvik purchasing, 17 Nov 10:12 — “500 ml cans acceptable”" data-autofocus></label>
          <label class="lbl">Attach evidence<input type="file" name="file"></label>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Record acceptance", value: "ok", cls: "btn-primary" }],
        onClose: () => { state.customerAccepted[n] = true; log("human", initials(), `Customer written acceptance recorded for line ${n} pack-size change.`); toast("Customer acceptance recorded with evidence"); App.render(); },
      });
    },
    "ai-offer"(el) {
      openDialog({ title: "Extract an offer from pasted text, PDF or photo", body: `<label class="lbl">Paste supplier text<textarea name="t" data-autofocus>E6013 3.2mm 5kg box 980 LE, 4 boxes avail, delivery Port Said 3 days, cash, mill cert ok</textarea></label><label class="lbl">…or attach file / photo<input type="file"></label>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Extract", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => runAI(null, () => GSAI.extractSupplierOffer(App.val(f, "t")), (r) => openDialog({
          title: "Extracted offer — review before saving", body: `${ai("Draft")} ${conf(r.confidence)}<dl class="kv mt-2">${Object.entries(r).filter(([k]) => k !== "confidence").map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`,
          actions: [{ label: "Discard", value: "cancel" }, { label: "Save offer to line 4", value: "ok", cls: "btn-primary" }],
          onClose: () => { const r2 = state.supplierRfqs.find((x) => x.sup === "S3"); if (r2) { r2.status = "Replied"; r2.last = "Offer extracted from pasted text (reviewed)"; } toast("Offer saved · Port Said Welding reminders stopped"); App.render(); },
        })) });
    },
    "new-srfq"() {
      const cand = Object.entries(D.suppliers).filter(([, s]) => s.cats.some((c) => ["Welding", "Safety & PPE"].includes(c)));
      openDialog({
        title: "Send supplier RFQ", wide: true,
        body: `
          <fieldset class="stack" style="border:0;padding:0"><legend class="strong">1. Lines to include</legend>
            <div class="check-grid">${C.lines.map((l) => `<label class="check"><input type="checkbox" name="line" value="${l.n}" ${l.n === 4 ? "checked" : ""} ${l.missing && !state.clarifications.find((q) => q.line === l.n && q.a) ? "disabled" : ""}><span>L${l.n} · ${esc(l.desc)}<small>${l.qty} ${esc(l.uom)} · ${esc(l.cat)}${l.missing ? " · needs clarification first" : ""}</small></span></label>`).join("")}</div></fieldset>
          <fieldset class="stack" style="border:0;padding:0"><legend class="row strong">2. Suppliers <button type="button" class="btn btn-sm btn-ai" id="rec-btn">Recommend</button></legend>
            <div id="rec-out"></div>
            <div class="check-grid">${cand.map(([id, s]) => `<label class="check"><input type="checkbox" name="sup" value="${id}" ${id === "S9" ? "checked" : ""}><span>${esc(s.name)}<small>${s.cats.join(", ")} · on-time ${s.onTime ?? "—"}%</small></span></label>`).join("")}</div></fieldset>
          <label class="lbl">Reply due<input type="text" name="due" value="18 Nov 2026 12:00"></label>
          <div class="stack"><div class="row"><span class="strong">3. Preview</span>${chip("Client identity removed", "ok")}${chip("No customer attachments", "ok")}</div>
            <div class="email-preview" id="srfq-preview"></div></div>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Approve & send", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => {
          const lines = [...f.querySelectorAll("input[name=line]:checked")].map((x) => +x.value);
          const sups = [...f.querySelectorAll("input[name=sup]:checked")].map((x) => x.value);
          if (!lines.length || !sups.length) { toast("Nothing sent — choose at least one line and one supplier", "!"); return; }
          sups.forEach((s) => state.supplierRfqs.unshift({ sup: s, lines, sent: App.NOW.toISOString(), due: "2026-11-18T12:00", status: "Sent", reminders: 0, last: "Sent just now · reminder scheduled 18 Nov 09:00" }));
          log("human", initials(), `Sent supplier RFQ for lines ${lines.join(", ")} to ${sups.map((s) => sup(s).name).join(", ")}.`);
          toast(`Sent to ${sups.length} supplier${sups.length > 1 ? "s" : ""} · replies will be matched automatically`); App.render();
        },
      });
      const body = document.querySelector("#dialog-form .body");
      const upd = () => {
        const ls = [...body.querySelectorAll("input[name=line]:checked")].map((x) => line(+x.value));
        document.getElementById("srfq-preview").textContent = `Subject: Request for quotation GS-SRFQ-0142-K — reply by 18 Nov 12:00

Dear supplier,

Please quote the following, delivery Port Said by 20 Nov 2026:

${ls.map((l, i) => ` ${i + 1}. ${l.desc} — ${l.qty} ${l.uom}${l.exact ? " (exact brand/part only)" : " (alternatives: state brand)"} · IMPA ${l.impa} · ${l.certs}`).join("\n") || " (no lines selected)"}

Please state for each line: unit price & currency, discount, available quantity, pack size, lead time / readiness date, delivery basis, freight, taxes, validity, payment terms, technical compliance — and attach SDS / TDS / certificates.

Best regards,
${me().name} — Golden Sea for Trading & Marketing`;
      };
      body.addEventListener("change", upd); upd();
      document.getElementById("rec-btn").addEventListener("click", (e) => runAI(e.currentTarget, () => GSAI.recommendSuppliers([4]), (recs) => {
        document.getElementById("rec-out").innerHTML = `<div class="ai-out">${ai("Ranking")}<ol class="small mt-2">${recs.map((r) => `<li><b>${esc(sup(r.sup).name)}</b> ${conf(r.score)} — ${esc(r.why)}</li>`).join("")}</ol></div>`;
      }));
    },
    "log-manual"() {
      openDialog({
        title: "Log a phone or WhatsApp offer",
        body: `<div class="field-grid">
            <label class="lbl">Supplier<select name="s" data-autofocus>${Object.entries(D.suppliers).map(([k, x]) => `<option value="${k}" ${k === "S3" ? "selected" : ""}>${x.name}</option>`).join("")}</select></label>
            <label class="lbl">Line<select name="l">${C.lines.map((l) => `<option value="${l.n}" ${l.n === 4 ? "selected" : ""}>L${l.n} · ${esc(l.desc.slice(0, 30))}…</option>`).join("")}</select></label>
            <label class="lbl">Price<input type="text" name="p" value="EGP 980 / 5 kg"></label>
            <label class="lbl">Lead time<input type="text" name="lt" value="3 days"></label>
            <label class="lbl">Validity<input type="text" name="v" value="7 days"></label>
            <label class="lbl">Terms<input type="text" name="t" value="Cash"></label></div>
          <label class="lbl">Source evidence (screenshot / voice note)<input type="file" name="f"></label>
          <p class="small text-2">Logged as entered by ${esc(me().name)} with timestamp — marked “manual” in comparisons.</p>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Save offer", value: "ok", cls: "btn-primary" }],
        onClose: (v, f) => {
          const sId = App.val(f, "s"); const r = state.supplierRfqs.find((x) => x.sup === sId);
          if (r) { r.status = "Replied"; r.last = `WhatsApp offer logged by ${me().name}: ${App.val(f, "p")}`; }
          log("human", initials(), `Manual WhatsApp offer from ${sup(sId).name} logged: ${App.val(f, "p")}, ${App.val(f, "lt")}.`);
          toast(`Offer from ${sup(sId).name} saved with attribution — reminders stopped`); App.render();
        },
      });
    },
    "request-approval"() {
      state.quoteStatus = "pending";
      const P = pricing();
      state.approvals.unshift({ id: "A0", type: "Customer quotation", caseId: C.id, title: `Quote GS-Q-0142 v${state.quoteVersion} to ${C.customer} — ${usd(P.tot.sellUSD, 0)}, margin ${num(P.tot.margin, 1)}%`, detail: `${P.priced.length} of ${C.lines.length} lines priced. Exceptions: ${P.priced.flatMap((r) => r.checks.filter((c) => c[0] !== "info").map((c) => `L${r.l.n} ${c[1]}`)).join("; ") || "none"}.${state.discount ? ` Discount ${state.discount}%.` : ""}`, by: state.role, age: "0 min", tone: "info", quote: true });
      log("human", initials(), `Requested approval of quotation GS-Q-0142 v${state.quoteVersion} from Karim Balbaa.`);
      toast("Approval requested — Karim Balbaa notified"); App.render();
    },
    "approve-quote"() { App.approve("A0"); },
    "return-quote"() { const a = state.approvals.find((x) => x.id === "A0"); if (a) { a.done = "Rejected"; a.reason = "Re-check line 1 advance payment"; } state.quoteStatus = "draft"; toast("Returned to owner with comment"); App.render(); },
    "send-quote"() {
      if (state.submission.method === "portal" && state.submission.portal?.some((r) => !r.ok)) { toast("Portal values differ from the approved quote — resolve before marking submitted", "!"); return; }
      state.quoteStatus = "sent";
      log("human", initials(), `Quotation GS-Q-0142 v${state.quoteVersion} submitted (${state.submission.method}). Internal reminder 19 Nov.`);
      toast("Quotation submitted · Awaiting customer decision"); App.render();
    },
    revision() {
      state.quoteVersion++; state.quoteStatus = "revision";
      log("human", initials(), `Customer requested revision — v${state.quoteVersion} created; v${state.quoteVersion - 1} kept. Re-enters approval.`);
      toast(`v${state.quoteVersion} created — re-enters approval`); App.render();
    },
    "ai-portal"(el) { runAI(el, () => GSAI.comparePortalSubmission("screenshot.png"), (r) => { state.submission.portal = r; App.render(); }); },
    "ai-po"(el) { runAI(el, () => GSAI.compareCustomerPO("NSM-PO-77231.pdf", "v1"), () => toast("PO re-checked against GS-Q-0142 v1", "✦")); },
    "po-fix"(el) {
      const ln = +el.dataset.line; const c = L.customerPO.checks.find((x) => x.line === ln);
      openDialog({ title: `Record customer amendment — line ${ln}`, body: `<p class="small">${esc(c.field)}: PO <b>${esc(c.po)}</b> vs quote <b>${esc(c.quote)}</b></p><label class="lbl">Written agreement<input type="text" name="r" value="${esc(c.fix)}" data-autofocus></label><label class="lbl">Evidence<input type="file"></label>`,
        actions: [{ label: "Cancel", value: "cancel" }, { label: "Record", value: "ok", cls: "btn-primary" }],
        onClose: () => { state.poResolved[ln] = true; log("human", initials(), `PO amendment recorded for line ${ln}.`); toast("Amendment recorded"); App.render(); } });
    },
    "confirm-so"() { toast("Sales order SO/0142 confirmed · 4 supplier POs prepared for approval"); location.hash = `#/case/${C.id}/purchasing?preset=delivery`; },
    "ai-collect"(el) { runAI(el, () => GSAI.draftCustomerFollowUp(C.id, C.contactRule), () => openDialog({ title: "Collection reminder draft", body: `${ai("Draft")}<div class="email-preview">Dear Ingrid,\n\nA friendly reminder that invoice INV/2026/0431 (USD 1,726.42) has a balance of USD 726.42 due 17 Jan 2027.\n\nBest regards,\nAhmedy — Golden Sea</div>`, actions: [{ label: "Discard", value: "cancel" }, { label: "Send", value: "ok", cls: "btn-primary" }], onClose: () => toast("Collection reminder sent & logged") })); },
    "close-case"() { state.caseClosed = true; log("human", initials(), "Case closed — actual profit recorded; supplier performance updated."); toast("Case closed · supplier prices & performance fed back"); App.render(); },
    "change:sub-method"(el) { state.submission.method = el.value; },
    toast(el) { toast(el.dataset.msg); },
  });
})();
