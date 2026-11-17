/* My day · Management dashboard · Follow-ups (next steps) */
(() => {
  const { D, C, state, views, actions, h, toast, runAI, NOW } = App;
  const { esc, num, egp, usd, chip, who, fmtDate, until, seg, ai, me } = h;

  const WAITS = ["Awaiting supplier", "Awaiting corrected offer", "Awaiting internal approval", "Awaiting customer decision", "Awaiting delivery or payment"];

  App.caseTable = function caseTable(list, compact = false) {
    if (!list.length) return `<div class="empty">No cases match. Try another filter.</div>`;
    return `<table class="data">
      <thead><tr><th>Case</th><th>Customer · vessel</th><th>Stage</th>${compact ? "" : "<th>Lines</th>"}<th>Deadline</th><th class="num">Days waiting</th><th>Latest event</th><th>Next action · blocker</th><th>Owner</th>${compact ? "" : '<th class="num">Value</th>'}</tr></thead>
      <tbody>${list.map((c) => `
        <tr class="clickable" data-href="#/case/${c.id}">
          <td class="nowrap"><a class="row-link" href="#/case/${c.id}">${c.id}</a>${c.urgent ? `<span class="sub t-danger">Urgent</span>` : ""}</td>
          <td>${esc(c.customer)}<span class="sub">${esc(c.vessel)} · ${esc(c.port)} · ETA ${fmtDate(c.eta)}</span></td>
          <td>${c.type && c.type !== "RFQ" ? chip(c.type, "gold", "no-dot") + " " : ""}${chip(c.stage, c.tone === "neutral" ? "" : c.tone)}${c.wait ? `<span class="sub">${esc(c.wait)}</span>` : ""}</td>
          ${compact ? "" : `<td class="nowrap">${lineMini(c.lines)}</td>`}
          <td class="nowrap">${fmtDate(c.deadline, true)}<span class="sub ${new Date(c.deadline) < NOW ? "t-danger" : ""}">${until(c.deadline)}</span></td>
          <td class="num">${c.waiting}</td>
          <td class="small">${esc(c.latest || "—")}</td>
          <td>${esc(c.next)}${c.blocker ? `<span class="sub ${c.tone === "danger" ? "t-danger" : ""}">⚑ ${esc(c.blocker)}</span>` : ""}</td>
          <td>${who(c.owner, !compact)}</td>
          ${compact ? "" : `<td class="num">${usd(c.value, 0)}</td>`}
        </tr>`).join("")}</tbody></table>`;
  };
  const lineMini = ([ok, wait, blk, none]) => {
    const t = ok + wait + blk + none;
    if (!t) return `<span class="text-2">—</span>`;
    return `<div class="progress" style="width:90px" role="img" aria-label="${ok} of ${t} lines ready">${seg(ok, t, "var(--ok)")}${seg(wait, t, "var(--warn)")}${seg(blk, t, "var(--danger)")}</div><span class="sub">${ok}/${t} lines ready</span>`;
  };
  const brief = (tone, ico, title, sub, href) => `<li><span class="b-ico chip ${tone} no-dot" aria-hidden="true">${ico}</span><div><a class="row-link" href="${href}">${esc(title)}</a><span class="sub">${esc(sub)}</span></div><span></span></li>`;

  /* ---------------- My day ---------------- */
  views.dashboard = () => {
    const isApprover = state.role === "kb";
    const pendingApprovals = state.approvals.filter((x) => !x.done);
    const live = D.cases.filter((c) => !["Lost", "Expired"].includes(c.stage));
    const mine = live.filter((c) => isApprover || c.owner === state.role);
    const tones = { danger: 0, warn: 1, info: 2, ok: 3, neutral: 4 };
    mine.sort((x, y) => (tones[x.tone] - tones[y.tone]) || (new Date(x.deadline) - new Date(y.deadline)));
    const waitCounts = WAITS.map((w) => [w, live.filter((c) => c.wait === w).length]);

    return [`
      <div class="page-head">
        <div>
          <p class="eyebrow">My day · Tuesday 17 November 2026</p>
          <h1>Good morning, ${esc(me().name.split(" ")[0])}</h1>
          <p>${isApprover ? "Decisions waiting for you are listed first. Everything below is prepared — you approve or return." : "Your prioritised queue. The system has prepared the drafts — you check, decide and send."}</p>
        </div>
        <div class="row"><a class="btn" href="#/inbox">Review inbox</a><a class="btn btn-primary" href="#/case/${C.id}/compare">Continue GS-RFQ-0142</a></div>
      </div>

      <section class="kpis" aria-label="Waiting states">
        ${waitCounts.map(([w, n]) => `<a class="card kpi" href="#/cases?wait=${encodeURIComponent(w)}"><span class="label">${esc(w)}</span><span class="value">${n}</span><span class="delta">${w === "Awaiting supplier" ? "2 overdue · 1 escalated" : w === "Awaiting internal approval" ? `${pendingApprovals.length} items for Karim Balbaa` : w === "Awaiting customer decision" ? "1 do-not-chase account" : "&nbsp;"}</span>${Viz.spark(D.analytics.waitTrend[w], { labels: D.analytics.weeks })}</a>`).join("")}
      </section>

      <div class="chart-grid">
        <section class="card"><div class="card-head"><div><h2>My deadlines — next 7 days</h2><p>Quote and delivery deadlines on cases I own</p></div></div><div class="card-body">${Viz.bars({ x: D.analytics.myDue.map((d) => d[0]), series: [{ name: "Deadlines", values: D.analytics.myDue.map((d) => d[1]) }], label: "My deadlines next 7 days" })}</div></section>
        <section class="card"><div class="card-head"><div><h2>My quote turnaround</h2><p>Median days, last 8 weeks · target 1 day</p></div></div><div class="card-body">${Viz.line({ x: D.analytics.weeks.slice(-8), series: [{ name: "Turnaround", values: D.analytics.myTurnaround, color: "var(--s2)" }], fmt: (v) => v.toFixed(1) + " d", target: { value: 1, label: "Target 1 d" }, yMax: 4, label: "My quote turnaround" })}</div></section>
      </div>

      <section class="card" aria-labelledby="q-h">
          <div class="card-head"><h2 id="q-h">${isApprover ? "All live cases" : "My queue"}</h2><p>Sorted by risk, then deadline · every live case has an owner, deadline and next action</p></div>
          <div class="table-wrap">${App.caseTable(mine, true)}</div>
        </section>

      <div class="three">
        <section class="card" aria-labelledby="b-h">
          <div class="card-head"><h2 id="b-h">Daily briefing</h2><button type="button" class="btn btn-sm btn-ai" data-action="ai-briefing">Summarise</button></div>
          ${state.briefing ? `<div class="card-body"><div class="ai-out">${ai("Briefing")} <p class="mt-2">${esc(state.briefing)}</p></div></div>` : ""}
          <ul class="briefing">
            ${brief("danger", "⏱", "Helios Star quote due today 16:00", "2 pump-seal suppliers haven't replied. Reminder drafts ready.", "#/case/GS-RFQ-0141")}
            ${brief("danger", "⚠", "Customer PO mismatch on GS-RFQ-0136", "PO uses expired v1 price on line 3 — commitment blocked.", "#/case/GS-RFQ-0136")}
            ${brief("warn", "!", "Cairo Chem not responding (2 reminders)", "Escalated to you on GS-RFQ-0142. Line 3 still has 2 compliant offers.", `#/case/${C.id}/sourcing`)}
            ${brief("warn", "⚓", "MV Nordic Tern ETA moved earlier (18 Nov)", "Delivery task for GS-RFQ-0136 updated; owner notified.", "#/case/GS-RFQ-0136")}
            ${brief("info", "✓", `${pendingApprovals.length} items awaiting Karim Balbaa`, "Margin exception, deposit, alternative, bank change, FX.", "#/approvals")}
            ${brief("info", "$", "Helios Bulk balance USD 4,200 due 30 Nov", "Partial payment received 12 Nov. Collection draft scheduled 28 Nov.", "#/case/GS-RFQ-0131")}
            ${brief("warn", "⚙", `${state.exceptions.filter((x) => x.status === "Open").length} integration exceptions`, "Outlook token expired; tax-authority e-invoice not submitted. Safe retry available.", "#/automations")}
          </ul>
        </section>
        <section class="card">
          <div class="card-head"><h2>Today's follow-ups</h2><a class="btn btn-sm" href="#/followups">All follow-ups</a></div>
          <ul class="briefing">
            ${D.steps.filter((s) => s.due <= "2026-11-17").map((s) => `<li><span class="b-ico chip ${s.overdue ? "danger" : "info"} no-dot">${s.channel === "Call" ? "☎" : s.channel === "WhatsApp" ? "◍" : "✉"}</span><div><b>${esc(s.channel)} · ${esc(s.who)}</b><span class="sub">${esc(s.goal)}</span></div>${s.overdue ? chip("Overdue", "danger") : chip(s.time || "Today", "info")}</li>`).join("")}
          </ul>
        </section>
        <section class="card">
          <div class="card-head"><h2>Start here for the demo</h2><a class="btn btn-sm" href="#/demo-script">Demo script →</a></div>
          <div class="card-body stack small">
            <p>One case — <b>GS-RFQ-0142, MV Aurora Crest</b> — is modelled end to end. Use the <b>timeline bar</b> on the case to jump from sourcing (today) to customer PO, delivery and settlement.</p>
            <p>Switch <b>Viewing as</b> to see permissions: Karim Balbaa approves; Soaad Amer (Sales) cannot see costs or margins.</p>
            <p>Press <span class="kbd">Ctrl K</span> anywhere to search cases, IMO numbers, part numbers, products and suppliers.</p>
          </div>
        </section>
      </div>`, "My day"];
  };

  actions["ai-briefing"] = (el) => runAI(el, () => GSAI.dailyBriefing(state.role), (t) => { state.briefing = t; App.render(); });

  /* ---------------- Management dashboard ---------------- */
  views.management = () => {
    const A = D.analytics;
    const V = window.Viz;
    const k = (v) => (v ? `$${num(v)}k` : "$0");
    const card = (title, sub, body) => `<section class="card"><div class="card-head"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div></div><div class="card-body">${body}</div></section>`;
    const sum = (a) => a.reduce((s, v) => s + v, 0);
    const live = D.cases.filter((c) => !["Lost", "Expired"].includes(c.stage));
    return [`
      <div class="page-head">
        <div><p class="eyebrow">Management · live · illustrative data</p><h1>Business dashboard</h1><p>Every tile and chart drills into the underlying cases; hover or focus any mark for exact values, or open its table view. Definitions are agreed during the pilot baseline so numbers can't mislead.</p></div>
        <div class="row"><select id="mg-period" aria-label="Period"><option>Last 12 weeks</option><option>This month</option><option>This quarter</option></select><button type="button" class="btn" data-action="export-csv">Export cases (CSV)</button></div>
      </div>

      <section class="kpis">
        <a class="card kpi" href="#/cases"><span class="label">Inquiries (12 wk)</span><span class="value">${sum(A.inquiries)}</span><span class="delta">+21% vs previous 12 wk</span>${V.spark(A.inquiries, { labels: A.weeks })}</a>
        <a class="card kpi" href="#/cases"><span class="label">Quoted</span><span class="value">${sum(A.quoted)}</span><span class="delta">${Math.round((sum(A.quoted) / sum(A.inquiries)) * 100)}% of inquiries</span>${V.spark(A.quoted, { labels: A.weeks })}</a>
        <a class="card kpi" href="#/cases"><span class="label">Won</span><span class="value">${sum(A.won)}</span><span class="delta">${live.length} cases live now</span>${V.spark(A.won, { labels: A.weeks })}</a>
        <div class="card kpi"><span class="label">Quote turnaround</span><span class="value">${A.turnaround.at(-1)} d</span><span class="delta">was ${A.turnaround[0]} d · target ≤ 1 d</span>${V.spark(A.turnaround, { color: "var(--s2)", labels: A.weeks, labelFmt: (v) => v + " d" })}</div>
        <div class="card kpi"><span class="label">Manual touches / RFQ</span><span class="value">${A.touches.at(-1)}</span><span class="delta">was ${A.touches[0]} before go-live</span>${V.spark(A.touches, { color: "var(--s2)", labels: A.weeks })}</div>
        <div class="card kpi"><span class="label">Gross profit Nov</span><span class="value">EGP ${A.gpExpectedK.at(-1)}k</span><span class="delta">expected · EGP ${A.gpActualK.at(-1)}k actual so far</span>${V.spark(A.gpExpectedK, { labels: A.months, labelFmt: (v) => "EGP " + v + "k" })}</div>
      </section>

      <h2 class="sec-h">Pipeline & conversion</h2>
      <div class="chart-grid">
        ${card("Inquiries, quotes and wins per week", "Count of RFQ cases by week of receipt", V.line({ x: A.weeks, series: [{ name: "Inquiries", values: A.inquiries }, { name: "Quoted", values: A.quoted }, { name: "Won", values: A.won }], label: "Inquiries, quoted and won per week" }))}
        ${card("Conversion funnel (90 days)", "Each step as a share of the previous one", V.funnel({ stages: A.funnel, label: "Conversion funnel" }))}
        ${card("Value won per month", "Customer POs incl. partial awards, USD", V.bars({ x: A.months, series: [{ name: "Value won", values: A.wonValueK }], fmt: k, highlightLast: true, label: "Value won per month" }))}
        ${card("Conversion rate by RFQ cohort", "Value of POs ÷ value quoted, by month the RFQ arrived (Nov still open)", V.line({ x: A.months, series: [{ name: "Value conversion", values: A.conversion }], fmt: (v) => Math.round(v) + "%", target: { value: 35, label: "Target 35%" }, yMax: 60, label: "Conversion by cohort" }))}
        ${card("Why we lose", "Lost cases by recorded reason (90 days)", V.hbars({ rows: A.lostReasons.map(([l, v]) => [l, v, "Lost cases"]), label: "Lost reasons" }))}
        ${card("Demand by store & service", "Cases received per month", V.heatmap({ rows: A.catDemand.map((r) => r[0]), cols: A.catMonths, values: A.catDemand.map((r) => r[1]), label: "RFQs by category and month" }))}
      </div>

      <h2 class="sec-h">Speed & workload</h2>
      <div class="chart-grid">
        ${card("Quotation turnaround", "Median days from RFQ received to quote sent", V.line({ x: A.weeks, series: [{ name: "Turnaround", values: A.turnaround, color: "var(--s2)" }], fmt: (v) => v.toFixed(1) + " d", target: { value: 1, label: "Target 1 d" }, yMax: 4, label: "Quotation turnaround" }))}
        ${card("Acknowledgement time", "Median minutes to acknowledge an RFQ — automation went live 6 Oct", V.bars({ x: A.weeks, series: [{ name: "Minutes", values: A.ackMinutes }], fmt: (v) => Math.round(v) + " min", highlightLast: true, label: "Acknowledgement time" }))}
        ${card("Open actions by owner and weekday", "Tasks due, current week", V.heatmap({ rows: A.workload.map((r) => r[0]), cols: A.workloadDays, values: A.workload.map((r) => r[1]), label: "Workload heatmap" }))}
        ${card("Out-of-hours requests", "RFQs received outside Sun–Thu 08:00–17:00 and routed to the on-call person", V.bars({ x: A.weeks, series: [{ name: "Out-of-hours RFQs", values: A.afterHours }], highlightLast: true, label: "Out-of-hours requests" }))}
        ${card("Live cases per owner", "", V.hbars({ rows: ["ky", "sa", "ah"].map((u) => [D.users[u].name, live.filter((c) => c.owner === u).length, "Live cases"]), label: "Cases per owner" }))}
      </div>

      <h2 class="sec-h">Profit & cash</h2>
      <div class="chart-grid">
        ${card("Gross profit: expected vs actual", "EGP thousands · actual replaces estimates as costs are billed (Nov in progress)", V.line({ x: A.months, series: [{ name: "Expected", values: A.gpExpectedK }, { name: "Actual", values: A.gpActualK }], fmt: (v) => Math.round(v) + "k", label: "Gross profit expected vs actual" }))}
        ${card("Gross margin by store", "Actual, last 90 days · dashed line = 15% minimum policy", V.hbars({ rows: A.marginByCat.map(([l, v]) => [l, v, "Gross margin"]), fmt: (v) => v.toFixed(1) + "%", max: 45, refLine: { value: 15, label: "min 15%" }, label: "Margin by store" }))}
        ${card("Sales by source", "EGP thousands per month — agency pricelists and own stock carry higher margins than buying to order", V.stacked({ rows: A.sourceByMonth, keys: A.sourceKeys, colors: ["var(--s1)", "var(--s2)", "var(--s3)"], fmt: (v) => Math.round(v) + "k", label: "Sales by source" }))}
        ${card("Margin by source", "Gross margin, last 90 days", V.hbars({ rows: A.sourceMargin.map(([l, v]) => [l, v, "Gross margin"]), fmt: (v) => v.toFixed(1) + "%", max: 40, label: "Margin by source" }))}
        ${card("Receivables ageing by customer", "USD thousands", V.stacked({ rows: A.ageing, keys: A.ageingKeys, colors: ["var(--o1)", "var(--o2)", "var(--o4)", "var(--o5)"], fmt: (v) => (v ? v.toFixed(1) : "0"), label: "Receivables ageing" }))}
        ${card("Cash in vs cash out — next 8 weeks", "Expected customer receipts and committed supplier payments, EGP thousands", V.line({ x: A.cashWeeks, series: [{ name: "Receipts", values: A.receiptsK }, { name: "Payments", values: A.paymentsK }], fmt: (v) => Math.round(v) + "k", label: "Cash projection" }))}
      </div>

      <h2 class="sec-h">Delivery & suppliers</h2>
      <div class="chart-grid">
        ${card("Supplier reliability vs speed", "On-time delivery against average reply time — top-left is best", V.scatter({ points: Object.entries(D.suppliers).filter(([, s]) => s.onTime && !s.agency && !s.own).map(([, s]) => ({ name: s.name, short: s.name.split(" ")[0], x: s.replyHrs, y: s.onTime })), xLabel: "Avg reply (hours)", yLabel: "On-time %", xFmt: (v) => Math.round(v) + " h", yFmt: (v) => Math.round(v) + "%", yMin: 70, yMax: 100, label: "Supplier scatter" }))}
        ${card("Deliveries by outcome", "Last 3 weeks", V.stacked({ rows: [["This week", [6, 2, 1]], ["Last week", [9, 1, 0]], ["2 weeks ago", [7, 2, 1]]], keys: ["On time", "Partial", "Late"], colors: ["var(--s1)", "var(--s2)", "var(--s3)"], label: "Deliveries by outcome" }) + `<div class="stack small mt-3">
          <div class="row">${chip("ETA risk", "danger")} MV Nordic Tern ETA moved earlier — GS-RFQ-0136 <span class="spacer"></span><a href="#/case/GS-RFQ-0136">Open</a></div>
          <div class="row">${chip("Partial", "warn")} DOS Falcon drop 1 of 2 — signed POD missing <span class="spacer"></span><a href="#/case/GS-RFQ-0133">Open</a></div>
          <div class="row">${chip("Late supplier", "warn")} Nile Safety backorder 2 helmets <span class="spacer"></span><a href="#/case/GS-RFQ-0142/delivery?preset=delivery">Open</a></div></div>`)}
      </div>`, "Dashboard"];
  };

  actions["export-csv"] = () => {
    const rows = [["Case", "Customer", "Vessel", "Port", "ETA", "Stage", "Waiting state", "Owner", "Deadline", "Value USD", "Next action", "Blocker"], ...D.cases.map((c) => [c.id, c.customer, c.vessel, c.port, c.eta, c.stage, c.wait, D.users[c.owner].name, c.deadline, c.value, c.next, c.blocker])];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "golden-sea-cases.csv";
    a.click();
    toast("CSV exported");
  };

  /* ---------------- Follow-ups & next steps (Omnicron pattern) ---------------- */
  views.followups = () => {
    const sRfq = state.supplierRfqs.filter((r) => /Awaiting|Partial|Clarification|No response|Sent/.test(r.status));
    const cust = [
      { c: "GS-RFQ-0139", who: "Atlas Tankers", what: "Quote GS-Q-0139 v1 — no answer for 5 days", rule: "DO NOT ask for RFQ status — internal reminder only", next: "18 Nov", internal: true },
      { c: "GS-RFQ-0137", who: "Mare Nostrum Shipping", what: "Waiting for internal approval before sending", rule: "Follow-ups allowed", next: "Today", internal: true },
      { c: "GS-RFQ-0131", who: "Helios Bulk Carriers", what: "Collection: USD 4,200 due 30 Nov", rule: "Follow-ups allowed", next: "28 Nov (draft scheduled)", internal: false },
    ];
    const channelIco = { Call: "☎", WhatsApp: "◍", Email: "✉", "Site visit": "⌂" };
    return [`
      <div class="page-head"><div><p class="eyebrow">Work</p><h1>Follow-ups & next steps</h1><p>Separate waiting states, scheduled reminders, overdue alerts and stop rules. Calls and WhatsApp open your phone with the number and message ready — you send it yourself, then record the outcome.</p></div></div>
      <section class="card"><div class="card-head"><h2>Supplier replies pending</h2><p>Reminders stop automatically on reply, decline or case closure</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Supplier</th><th>Case · lines</th><th>Status</th><th class="num">Reminders</th><th>Next automatic step</th><th>Stop condition</th><th></th></tr></thead><tbody>
        ${sRfq.map((r) => `<tr><td>${esc(D.suppliers[r.sup].name)}</td><td>${C.id} · ${r.lines.map((n) => "L" + n).join(", ")}</td><td>${chip(r.status, r.status === "No response" ? "danger" : "warn")}</td><td class="num">${r.reminders}</td><td class="small">${r.status === "No response" ? "Escalated to owner (no further auto reminders)" : r.status === "Clarification needed" ? "Waiting for our answer — no reminder" : "Reminder " + (r.reminders + 1) + " at 15:00"}</td><td class="small">Reply · decline · line cancelled · case closed</td><td><a class="btn btn-sm" href="#/case/${C.id}/sourcing">Open</a></td></tr>`).join("")}
        </tbody></table></div></section>
      <section class="card"><div class="card-head"><h2>Customer decisions & collections</h2><p>Per-account contact rules decide whether a customer draft is ever prepared</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Case</th><th>Customer</th><th>Waiting for</th><th>Contact rule</th><th>Next</th><th></th></tr></thead><tbody>
        ${cust.map((x) => `<tr><td><a class="row-link" href="#/case/${x.c}">${x.c}</a></td><td>${esc(x.who)}</td><td>${esc(x.what)}</td><td>${/DO NOT/.test(x.rule) ? chip(x.rule, "danger") : chip(x.rule, "ok")}</td><td class="small">${esc(x.next)} · ${x.internal ? "internal reminder" : "customer draft for review"}</td><td><button type="button" class="btn btn-sm btn-ai" data-action="ai-followup" data-rule="${esc(x.rule)}" data-case="${x.c}">Draft</button></td></tr>`).join("")}
        </tbody></table></div></section>
      <h2 class="sec-h">Sales next steps <span class="dim">growth CRM · ${D.steps.length} open</span></h2>
      <div class="step-grid">
        ${D.steps.map((s) => `<article class="card step">
          <div class="row"><span class="chip info no-dot">${channelIco[s.channel] || "•"} ${esc(s.channel)}</span>${s.overdue ? chip("Overdue", "danger") : chip(fmtDate(s.due) + (s.time ? " " + s.time : ""), "")}${state.stepsDone[s.id] ? chip("Done", "ok") : ""}<span class="spacer"></span>${who(s.owner, false)}</div>
          <b>${esc(s.who)}</b><span class="small">${esc(s.goal)}</span>
          <div class="say"><b>What to say</b>${esc(s.script)}</div>
          <div class="row">${state.stepsDone[s.id] ? `<span class="small text-2">Outcome: ${esc(state.stepsDone[s.id])}</span>` : `<button type="button" class="btn btn-sm btn-primary" data-action="step-done" data-id="${s.id}">Record outcome</button><button type="button" class="btn btn-sm">Reschedule</button>`}</div>
        </article>`).join("")}
      </div>`, "Follow-ups"];
  };
  actions["ai-followup"] = (el) => runAI(el, () => GSAI.draftCustomerFollowUp(el.dataset.case, el.dataset.rule), (txt) => {
    if (!txt) { toast("Contact rule forbids customer follow-ups — internal reminder created instead", "i"); return; }
    App.openDialog({ title: `Follow-up draft — ${el.dataset.case}`, body: `${ai("Draft")}<div class="email-preview">${esc(txt)}</div><p class="small text-2">Nothing is sent until you press Send.</p>`, actions: [{ label: "Discard", value: "cancel" }, { label: "Send", value: "ok", cls: "btn-primary" }], onClose: () => toast("Follow-up sent and logged on the case") });
  });
  actions["step-done"] = (el) => App.openDialog({
    title: "Record outcome",
    body: `<label class="lbl">Outcome<select name="o" data-autofocus><option>Reached — positive</option><option>Reached — call back</option><option>No answer</option><option>Not interested</option></select></label><label class="lbl">What happened (who said what, next date)<textarea name="n">Registration committee meets 24 Nov; documents complete.</textarea></label><label class="lbl">Next step date<input type="text" name="d" value="24 Nov 2026"></label>`,
    actions: [{ label: "Cancel", value: "cancel" }, { label: "Save outcome", value: "ok", cls: "btn-primary" }],
    onClose: (v, f) => { state.stepsDone[el.dataset.id] = `${App.val(f, "o")} — next ${App.val(f, "d")}`; toast("Outcome saved; next step planned"); App.render(); },
  });
})();
