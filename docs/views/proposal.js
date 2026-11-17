/* Proposal: requirement coverage, pilot plan & costs, demo script. */
(() => {
  const { D, views, actions, h, toast } = App;
  const { esc, chip } = h;
  const clsTone = (c) => c.split(/\s*\+\s*/).map((p) => `<span class="chip no-dot cls-${p.split(" ")[0]}">${esc(p)}</span>`).join(" ");

  views.coverage = (_, query) => {
    const f = query.get("c") || "all";
    const classes = ["Standard", "Configuration", "Customization", "Integration", "AI", "Manual"];
    const match = (r) => f === "all" || r[2].toLowerCase().includes(f.toLowerCase());
    const rows = D.coverage.filter(match);
    const count = (c) => D.coverage.filter((r) => r[2].toLowerCase().includes(c.toLowerCase())).length;
    return [`
      <div class="page-head"><div><p class="eyebrow">Proposal</p><h1>Requirement coverage</h1><p>Every requirement in Golden Sea's brief, classified as standard Odoo, configuration, customization, external integration, AI or manual — with the responsible app, automation method, manual steps, acceptance test and the screen that demonstrates it.</p></div>
        <button type="button" class="btn" data-action="export-coverage">Export (CSV)</button></div>
      <div class="row" role="group" aria-label="Filter by classification">
        <a class="btn btn-sm ${f === "all" ? "btn-primary" : ""}" href="#/coverage">All ${D.coverage.length}</a>
        ${classes.map((c) => `<a class="btn btn-sm ${f === c ? "btn-primary" : ""}" href="#/coverage?c=${c}">${c} ${count(c)}</a>`).join("")}
      </div>
      <section class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>Section</th><th>Requirement</th><th>Classification</th><th>Odoo app</th><th>Automation method</th><th>Manual steps</th><th>Acceptance test</th><th>Demo</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td class="nowrap small">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${clsTone(r[2])}</td><td class="small">${esc(r[3])}</td><td class="small">${/AI/.test(r[2]) ? "✦ " : ""}${esc(r[4])}</td><td class="small">${esc(r[5])}</td><td class="small">${esc(r[6])}</td><td><a class="btn btn-sm" href="${r[7]}">Show</a></td></tr>`).join("")}</tbody></table></div></section>
      <section class="card"><div class="card-head"><h2>Application map</h2><p>One role per app — no duplicate trackers</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>App</th><th>Role in Golden Sea's process</th><th>Notes</th></tr></thead><tbody>
        ${D.appMap.map(([a, b, c]) => `<tr><td class="strong">${a}</td><td>${b}</td><td class="small">${c}</td></tr>`).join("")}</tbody></table></div></section>
      <div class="two">
        <div class="callout"><strong>Recommended edition & hosting:</strong> Odoo Enterprise (Custom plan) on Odoo.sh. Odoo.sh is required for the custom sourcing module and lets integrations (Outlook, AI service, tax-authority signing) run as server-side modules with staging and automatic upgrades testing. Odoo Online would block the custom code.</div>
        <div class="callout"><strong>AI boundaries:</strong> AI drafts and suggests (extraction, matching, deviation hints, drafts, briefings). Low-confidence output is never written over approved values, and technical equivalence, prices, commitments and payments are always decided by a person.</div>
      </div>`, "Requirement coverage"];
  };
  actions["export-coverage"] = () => {
    const rows = [["Section", "Requirement", "Classification", "App", "Method", "Manual", "Acceptance test"], ...D.coverage.map((r) => r.slice(0, 7))];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "golden-sea-requirement-coverage.csv"; a.click();
    toast("Coverage exported");
  };

  views.pilot = () => [`
    <div class="page-head"><div><p class="eyebrow">Proposal</p><h1>Pilot plan & costs</h1><p>A phased ~90-day pilot with a weekly review. This is a planning proposal, not a committed schedule.</p></div></div>
    <section class="card"><div class="card-head"><h2>Timeline (weeks)</h2><p>Phase 1 intake → approved quote · Phase 2 orders → billing · Phase 3 collections, actual profit, growth</p></div>
      <div class="card-body table-wrap"><div class="gantt" role="img" aria-label="Pilot timeline over 13 weeks">
        <span></span>${Array.from({ length: 13 }, (_, i) => `<span class="gh">W${i + 1}</span>`).join("")}
        ${D.pilot.map((p) => `<span>${esc(p.name)}</span>${Array.from({ length: 13 }, (_, i) => `<span class="gb" style="${i + 1 >= p.from && i + 1 <= p.to ? `background:${p.tone}` : ""}"></span>`).join("")}`).join("")}
      </div></div></section>
    <div class="two">
      <section class="card"><div class="card-head"><h2>Baseline & targets</h2><p>Agreed and measured before go-live</p></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Measure</th><th>Baseline</th><th>Pilot target</th></tr></thead><tbody>
        ${D.kpiTargets.map(([a, b, c]) => `<tr><td>${a}</td><td class="small">${b}</td><td class="strong">${c}</td></tr>`).join("")}</tbody></table></div></section>
      <section class="card"><div class="card-head"><h2>Dependencies</h2></div><div class="card-body stack small">
        <span>• Mailbox admin consent (Outlook) and Gmail OAuth — Golden Sea IT</span><span>• Named users & licences confirmed</span><span>• Finance input on VAT treatment and e-invoicing signing</span><span>• Product / supplier master data export from current Odoo & Excel</span><span>• Approval rules signed by Karim Balbaa (quotes, discounts, POs, payments, FX)</span><span>• Weekly 45-min review: progress, baseline numbers, decisions</span></div></section>
    </div>
    <section class="card"><div class="card-head"><h2>Cost structure</h2><p>Shown separately as requested — figures to be completed in the commercial proposal</p></div>
      <div class="table-wrap"><table class="data"><thead><tr><th>Item</th><th>Scope</th><th>Cost</th></tr></thead><tbody>
      ${D.proposalCosts.map(([a, b, c]) => `<tr><td class="strong">${a}</td><td class="small">${b}</td><td>${/TBD|confirm/.test(c) ? chip(c, "") : chip(c, "ok")}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="card"><div class="card-head"><h2>Delivery terms</h2></div><div class="card-body three small">
      <div class="stack"><b>Milestones</b><span>M1 assessment report (W1) · M2 intake→quote live (W5) · M3 order→billing live (W9) · M4 collections & dashboards (W12) · M5 handover (W13)</span></div>
      <div class="stack"><b>Responsibilities</b><span>Us: configuration, custom module, integrations, migration, training, documentation. Golden Sea: data, approvals, test scenarios, weekly review attendance.</span></div>
      <div class="stack"><b>Documentation & training</b><span>Role-based manuals, recorded sessions, acceptance test log.</span></div>
      <div class="stack"><b>Data export, backup & recovery</b><span>Odoo.sh daily backups in 3 locations; restore tested in W12; full data export on request.</span></div>
      <div class="stack"><b>Integration maintenance</b><span>Mail & AI connectors monitored via the exception queue; tax-authority changes tracked through Odoo updates.</span></div>
      <div class="stack"><b>Ownership of custom code</b><span>Custom modules delivered in Golden Sea's Odoo.sh repository; Golden Sea owns the code.</span></div>
    </div></section>`, "Pilot plan"];

  const KEY = "gs-demo-done";
  const done = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };
  views["demo-script"] = () => {
    const d = done();
    const n = Object.values(d).filter(Boolean).length;
    return [`
      <div class="page-head"><div><p class="eyebrow">Proposal · meeting</p><h1>Demo script</h1><p>The ten scenarios Golden Sea asked to see live, each with its acceptance evidence. Each “Open” starts a guided tour that walks through the screens and evidence step by step (arrow keys or Next / Back, Esc to exit) and ticks the scenario when finished.</p></div><span class="chip ${n === 10 ? "ok" : "info"} no-dot">${n} / 10 shown</span></div>
      <section class="card"><div class="table-wrap"><table class="data"><thead><tr><th>#</th><th>Scenario</th><th>Acceptance evidence</th><th></th><th>Shown</th></tr></thead><tbody>
        ${D.demoScenarios.map(([s, e, href], i) => `<tr><td>${i + 1}</td><td class="strong">${esc(s)}</td><td class="small">${esc(e)}</td><td class="nowrap"><button type="button" class="btn btn-sm btn-primary" data-action="tour" data-i="${i}">Open ▶ tour</button> <a class="btn btn-sm btn-ghost" href="${href}">Skip tour</a></td><td><input type="checkbox" aria-label="Mark scenario ${i + 1} shown" data-action="demo-tick" data-i="${i}" ${d[i] ? "checked" : ""}></td></tr>`).join("")}
      </tbody></table></div></section>
      <div class="callout"><strong>Tip:</strong> tours 5–8 and 10 jump GS-RFQ-0142 forward in time; return with “Sourcing &amp; quote (17 Nov)” on the case timeline bar.</div>`, "Demo script"];
  };
  actions["demo-tick"] = (el) => { const d = done(); d[el.dataset.i] = el.checked; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} App.render(); };
})();
