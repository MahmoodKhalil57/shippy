/* Approvals · Automations & exceptions · Integrations & import · Settings (roles, FX, pricing policy, audit). */
(() => {
  const { D, state, views, actions, h, toast, openDialog, log } = App;
  const { esc, chip, flag } = h;

  /* ---------------- Approvals ---------------- */
  App.approve = (id) => {
    const a = state.approvals.find((x) => x.id === id);
    if (!a) return;
    if (a.twoPerson) {
      a.approvedBy = [...(a.approvedBy || []), state.role];
      if (a.approvedBy.length < 2) { toast(`First approval recorded (${esc(App.h.me().name)}) — second approver still required`); App.render(); return; }
    }
    a.done = `Approved by ${a.twoPerson ? a.approvedBy.map((u) => D.users[u].name).join(" + ") : App.h.me().name}`;
    if (a.quote) { state.quoteStatus = "approved"; log("human", "KB", `Karim Balbaa approved quotation GS-Q-0142 v${state.quoteVersion}.`); }
    toast(`Approved: ${esc(a.title.slice(0, 60))}…`);
    App.render();
  };
  views.approvals = () => {
    const canApprove = state.role === "kb";
    const may = (a) => (a.approver || ["kb"]).includes(state.role) && !(a.approvedBy || []).includes(state.role);
    return [`
      <div class="page-head"><div><p class="eyebrow">Work · control</p><h1>Approvals</h1><p>Commercial commitments and financial actions wait here for Karim Balbaa: quotations, discounts, margin exceptions, supplier POs, deposits and payments, bank-detail changes, exchange rates and alternatives. The system prepares; people decide.</p></div></div>
      ${canApprove || state.role === "mh" ? "" : flag("info", `You're viewing as ${App.h.me().name}. Karim Balbaa approves commercial items; Mohamed Helmy (Financial Director) approves payments and bank changes — switch “Viewing as” to try it.`)}
      <div class="stack">
        ${state.approvals.map((a) => `
          <section class="card"><div class="card-body row" style="align-items:flex-start;gap:16px">
            <div style="flex:1;min-width:240px" class="stack">
              <div class="row">${chip(a.type, a.tone)}${a.caseId !== "—" ? `<a href="#/case/${a.caseId}" class="small">${a.caseId}</a>` : ""}<span class="text-2 small">Requested by ${esc(D.users[a.by].name)} · ${esc(a.age)} ago</span></div>
              <h2>${esc(a.title)}</h2><p class="text-2">${esc(a.detail)}</p>
              <span class="small text-2">Approver: ${(a.approver || ["kb"]).map((u) => esc(D.users[u].name)).join(a.twoPerson ? " AND " : " or ")}${a.twoPerson ? ` · ${(a.approvedBy || []).length} of 2 approvals` : ""}</span>
              ${a.done ? flag(/^Approved/.test(a.done) ? "ok" : "danger", `${a.done}${a.reason ? ` — “${a.reason}”` : ""}`) : ""}
            </div>
            ${a.done ? "" : `<div class="row"><button type="button" class="btn btn-primary" data-action="approve" data-id="${a.id}" ${may(a) ? "" : "disabled"}>Approve</button><button type="button" class="btn" data-action="reject" data-id="${a.id}" ${may(a) ? "" : "disabled"}>Reject…</button></div>`}
          </div></section>`).join("")}
      </div>`, "Approvals"];
  };
  actions.approve = (el) => App.approve(el.dataset.id);
  actions.reject = (el) => openDialog({
    title: "Reject request",
    body: `<label class="lbl">Reason (sent to requester)<textarea name="r" data-autofocus>Please renegotiate supplier price before quoting below minimum margin.</textarea></label>`,
    actions: [{ label: "Cancel", value: "cancel" }, { label: "Reject", value: "ok", cls: "btn-primary" }],
    onClose: (v, f) => { const a = state.approvals.find((x) => x.id === el.dataset.id); a.done = `Rejected by ${App.h.me().name}`; a.reason = App.val(f, "r"); if (a.quote) state.quoteStatus = "draft"; toast("Rejected — requester notified with reason"); App.render(); },
  });

  /* ---------------- Automations & exceptions ---------------- */
  views.automations = () => [`
    <div class="page-head"><div><p class="eyebrow">Management · automation</p><h1>Automations & exceptions</h1><p>Every automation has an event trigger, owner, due date, approval rule, retry behaviour and stop condition. Reprocessed emails never create duplicate records or sends; failures land in the exception queue with a safe retry and audit trail.</p></div></div>
    <section class="card"><div class="card-head"><h2>Exception queue</h2><p>Nothing fails silently</p></div>
      <div class="table-wrap"><table class="data"><thead><tr><th>When</th><th>What happened</th><th>Impact</th><th>Status</th><th></th></tr></thead><tbody>
        ${state.exceptions.map((x) => `<tr><td class="nowrap small">${esc(x.when)}</td><td>${esc(x.what)}</td><td class="small">${esc(x.impact)}</td><td>${chip(x.status, x.status === "Open" ? "danger" : /review/.test(x.status) ? "warn" : "ok")}</td><td>${x.status === "Open" && x.action === "retry" ? `<button type="button" class="btn btn-sm" data-action="retry" data-id="${x.id}">Safe retry</button>` : x.action === "review" && x.status !== "Resolved" ? `<a class="btn btn-sm" href="#/inbox">Review</a>` : ""}</td></tr>`).join("")}
      </tbody></table></div></section>
    <section class="card"><div class="card-head"><h2>Automation boundaries</h2><p>What runs automatically vs what is prepared for an authorised person</p></div>
      <div class="two card-body">
        <div class="stack small"><b>Runs automatically under approved rules</b><span>Capture emails, link files, extract draft data, identify likely duplicates</span><span>Assign tasks, update proven events, calculate waiting times</span><span>Calculate costs, FX conversions, margins and comparisons</span><span>Create reminders, escalations, dashboards and daily briefings</span><span>Prepare linked quotations, POs, bills and invoice drafts</span></div>
        <div class="stack small"><b>Prepared for authorised review</b><span>Uncertain matches, technical interpretation, missing information</span><span>Owner overrides, exception resolution, discretionary closure</span><span>Final selling prices, discounts, substitutions, supplier selection</span><span>External messages and follow-ups unless explicitly pre-approved</span><span>Commercial commitments, accounting postings and payments</span></div>
      </div></section>
    <section class="card"><div class="card-head"><h2>Rule registry</h2><p>${D.automations.length} rules · ✦ marks AI-assisted steps (stubbed in <code>ai.js</code>)</p></div>
      <div class="table-wrap"><table class="data"><thead><tr><th>Rule</th><th>Trigger</th><th>Action</th><th>Mode</th><th>Owner · due</th><th>Approval</th><th>Retry</th><th>Stop condition</th></tr></thead><tbody>
        ${D.automations.map((a) => `<tr><td class="strong">${esc(a.name)}</td><td class="small">${esc(a.trigger)}</td><td class="small">${/AI/.test(a.action) ? "✦ " : ""}${esc(a.action)}</td><td>${chip(a.mode, /Prepare/.test(a.mode) ? "warn" : /review/.test(a.mode) ? "info" : "ok")}</td><td class="small">${esc(a.owner)} · ${esc(a.due)}</td><td class="small">${esc(a.approval)}</td><td class="small">${esc(a.retry)}</td><td class="small">${esc(a.stop)}</td></tr>`).join("")}
      </tbody></table></div></section>`, "Automations"];
  actions.retry = (el) => {
    const x = state.exceptions.find((e) => e.id === el.dataset.id);
    el.setAttribute("aria-busy", "true");
    setTimeout(() => { x.status = "Resolved"; x.impact += " — retried safely, no duplicates (idempotency key checked)"; log("auto", "↻", `Exception resolved by safe retry: ${x.what}`); toast("Retry succeeded — audit entry written"); App.render(); }, 900);
  };

  /* ---------------- Integrations & import ---------------- */
  views.integrations = () => [`
    <div class="page-head"><div><p class="eyebrow">Management · integration</p><h1>Integrations & data import</h1><p>Start by reviewing the existing Golden Sea Odoo database and confirming what actually works. Nothing previously discussed is assumed complete.</p></div></div>
    <div class="three">
      ${[
        ["Website quick-quote form", "To connect", "warn", "Website form posts to Odoo and creates a draft case (fallback: email to the sales mailbox)"],
        ["Microsoft Outlook (sales@)", "Connected · OAuth (Microsoft 365)", "ok", "Incoming server, every 2 min"],
        ["Microsoft Outlook (purchasing@)", "Token expired — reconnect", "danger", "See exception queue"],
        ["Gmail intake", "Connected · OAuth", "ok", "Previously discussed intake verified 14 Nov"],
        ["AI extraction service", "Stubbed in demo (ai.js)", "warn", "Production: server-side LLM with vision; confidence + audit log"],
        ["Egyptian e-invoicing (tax authority)", "Sandbox connected", "info", "Odoo Egypt localisation · signing set-up with finance"],
        ["WhatsApp", "Manual logging (screenshot + attribution)", "", "Optional later: WhatsApp Business API"],
        ["Document storage", "Odoo Documents", "ok", "Folder per case; certificates, PODs, receipts"],
        ["Backups", "Odoo.sh daily, 3 locations", "ok", "Data export available any time (XLSX / SQL dump)"],
      ].map(([n, s, t, d]) => `<section class="card"><div class="card-body stack"><b>${esc(n)}</b>${chip(s, t)}<span class="small text-2">${esc(d)}</span></div></section>`).join("")}
    </div>
    <section class="card"><div class="card-head"><h2>Existing Odoo database — week-1 assessment</h2><p>Verified in the demo, not assumed</p></div>
      <div class="table-wrap"><table class="data"><thead><tr><th>Item</th><th>Found</th><th>Status</th></tr></thead><tbody>
        ${[["Email alias → CRM opportunity", "Configured on sales@", "Works"], ["Gmail intake", "Configured", "Works (verified 14 Nov)"], ["Historical email import", "Not done", "Planned — see below"], ["Access rights per role", "All users = admin", "Must fix"], ["Automations / reminders", "None active", "To build"], ["Products & suppliers", "312 products, 58 suppliers, many duplicates", "Clean-up during migration"], ["Egypt localisation / e-invoicing", "Module installed, not configured", "Configure with finance"]].map(([a, b, c]) => `<tr><td>${a}</td><td class="small">${b}</td><td>${chip(c, /Works/.test(c) ? "ok" : /fix|build/.test(c) ? "danger" : "warn")}</td></tr>`).join("")}
      </tbody></table></div></section>
    <section class="card"><div class="card-head"><div><h2>Email history import — 90 days (proposed)</h2><p>Dry run first · duplicates and exceptions previewed · confidential material needs approval before import</p></div></div>
      <div class="card-body stack">
        <div class="kpis">
          <div class="card kpi"><span class="label">Emails scanned</span><span class="value">1,284</span><span class="delta">sales@, purchasing@, Gmail</span></div>
          <div class="card kpi"><span class="label">RFQ threads found</span><span class="value">312</span><span class="delta">→ 212 historical cases</span></div>
          <div class="card kpi"><span class="label">Likely duplicates</span><span class="value">41</span><span class="delta">will be linked, not re-created</span></div>
          <div class="card kpi"><span class="label">Exceptions</span><span class="value t-warn">9</span><span class="delta">unreadable attachments</span></div>
          <div class="card kpi"><span class="label">Flagged confidential</span><span class="value t-danger">23</span><span class="delta">HR, bank, legal — excluded unless approved</span></div>
        </div>
        <div class="row">${state.importApproved ? flag("ok", "Import approved by Karim Balbaa — 23 confidential threads excluded. Running overnight; no acknowledgements or reminders are sent for historical cases.") : `<button type="button" class="btn" data-action="toast" data-msg="Preview list downloaded (CSV)">Download preview</button><button type="button" class="btn btn-primary" data-action="approve-import" ${state.role === "kb" ? "" : "disabled"}>Approve import (Karim Balbaa)</button>${state.role === "kb" ? "" : `<span class="small text-2">Switch to Karim Balbaa to approve</span>`}`}</div>
      </div></section>`, "Integrations"];
  actions["approve-import"] = () => { state.importApproved = true; toast("Import approved — confidential threads excluded"); App.render(); };

  /* ---------------- Settings ---------------- */
  views.settings = (_, query) => {
    const tab = query.get("tab") || "roles";
    const tabs = [["roles", "Users & permissions"], ["fx", "Exchange rates"], ["pricing", "Pricing policy"], ["templates", "Templates & contact rules"], ["audit", "Audit log"]];
    const body = {
      roles: `<section class="card"><div class="card-head"><h2>Role-based permissions</h2><p>Initial users: Karim Youssef, Soaad Amer, Ahmedy, the sales mailbox, Karim Balbaa — confirm named users & licences before invitations</p></div>
        <div class="table-wrap"><table class="data matrix"><thead><tr><th>Role</th>${D.permNames.map((p) => `<th class="num">${esc(p)}</th>`).join("")}</tr></thead><tbody>
        ${D.roles.map((r) => `<tr><td>${esc(r.role)}</td>${r.perms.map((x) => `<td class="cell ${x ? "cell-ok" : "cell-no"}">${x ? "✓" : "—"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        <div class="card-body small text-2">Try it: switch “Viewing as” to Soaad Amer and open a case's Pricing tab — costs and margins are hidden.</div></section>`,
      fx: `<section class="card"><div class="card-head"><h2>Approved exchange rates</h2><p>Quotations and comparisons only use approved rates; a new rate re-checks open quotations</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Currency</th><th class="num">EGP per unit</th><th>Date</th><th>Source</th><th>By</th><th>Status</th></tr></thead><tbody>
        ${D.fxHistory.map((f) => `<tr><td>${f.cur}</td><td class="num">${f.rate}</td><td>${esc(f.date)}</td><td class="small">${esc(f.source)}</td><td class="small">${esc(f.by)}</td><td>${chip(f.status, f.status === "Active" ? "ok" : /Awaiting/.test(f.status) ? "warn" : "")}</td></tr>`).join("")}</tbody></table></div></section>`,
      pricing: `<section class="card"><div class="card-head"><h2>Pricing policy (management-approved, configurable)</h2><p>Previous pricing assumptions never become a fixed default</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Category</th><th class="num">Target margin</th><th class="num">Minimum margin</th><th class="num">Max discount w/o approval</th><th>Rounding</th></tr></thead><tbody>
        ${[["Chemicals", 25, 15, 3], ["Adhesives", 22, 15, 3], ["Safety & PPE", 28, 18, 3], ["Welding", 20, 12, 2], ["Engine spares (OEM)", 15, 8, 0], ["Paints", 22, 15, 3]].map(([c, t, mn, d]) => `<tr><td>${c}</td><td class="num">${t}%</td><td class="num">${mn}%</td><td class="num">${d}%</td><td class="small">USD 0.05</td></tr>`).join("")}</tbody></table></div>
        <div class="card-body stack small"><span><b>Definitions:</b> markup = profit ÷ cost · gross margin = profit ÷ sales. Recoverable VAT is excluded from cost; tax-exclusive sales are shown apart from invoice totals.</span><span><b>Shared charges:</b> allocated by line value by default (alternatives: quantity, equal per line) — the same method for the whole case.</span><span><b>Flags:</b> negative profit, below-minimum margin, expired supplier price, missing cost estimate → approval exception.</span></div></section>`,
      templates: `<section class="card"><div class="card-head"><h2>Message templates</h2></div><div class="table-wrap"><table class="data"><thead><tr><th>Template</th><th>Used by</th><th>Status</th></tr></thead><tbody>
        ${[["RFQ received – marine (acknowledgement)", "Automatic, once per thread", "Approved v3 · 16 Nov"], ["Supplier RFQ (anonymised)", "Send supplier RFQ", "Approved"], ["Supplier reminder 1 & 2", "Automatic", "Approved"], ["Supplier correction request", "Draft for review", "Approved"], ["Customer follow-up (quote)", "Draft for review", "Approved"], ["Collection reminder", "Draft for review", "Draft — needs approval"], ["Intro — ship managers", "Growth", "Approved"]].map(([a, b, c]) => `<tr><td>${a}</td><td class="small">${b}</td><td>${chip(c, /Draft/.test(c) ? "warn" : "ok")}</td></tr>`).join("")}</tbody></table></div></section>
        <section class="card"><div class="card-head"><h2>Customer contact rules</h2></div><div class="table-wrap"><table class="data"><thead><tr><th>Customer</th><th>Rule</th></tr></thead><tbody>${Object.values(D.customers).map((c) => `<tr><td>${esc(c.name)}</td><td>${/DO NOT/.test(c.contactRule) ? chip(c.contactRule, "danger") : esc(c.contactRule)}</td></tr>`).join("")}</tbody></table></div></section>`,
      audit: `<section class="card"><div class="card-head"><h2>Audit log</h2><p>Every change, automatic or human — with undo where safe</p></div><div class="table-wrap"><table class="data"><thead><tr><th>When</th><th>Who</th><th>What</th><th></th></tr></thead><tbody>
        ${state.audit.map((a, i) => `<tr><td class="nowrap small">${esc(a.at)}</td><td>${esc(a.who)}</td><td>${esc(a.what)}</td><td>${a.undo ? `<button type="button" class="btn btn-sm" data-action="undo" data-i="${i}">Undo</button>` : ""}</td></tr>`).join("")}</tbody></table></div></section>`,
    }[tab];
    return [`
      <div class="page-head"><div><p class="eyebrow">Management</p><h1>Settings & audit</h1></div></div>
      <nav class="tabs" aria-label="Settings sections">${tabs.map(([k, l]) => `<a href="#/settings?tab=${k}" ${k === tab ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
      ${body}`, "Settings"];
  };
  views["pricing-policy"] = () => { location.replace("#/settings?tab=pricing"); return ["", "Settings"]; };
  actions.undo = (el) => { const a = state.audit[+el.dataset.i]; a.undo = false; a.what += " — undone"; toast("Change undone (logged)"); App.render(); };
})();
