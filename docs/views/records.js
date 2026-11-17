/* Records: cases (list + board), customers & fleets, suppliers, products, growth CRM. */
(() => {
  const { D, C, state, views, actions, h, toast } = App;
  const { esc, num, usd, chip, who, fmtDate } = h;

  /* ---------------- Cases ---------------- */
  const BOARD = [
    ["New / validating", (c) => /New|Validat/.test(c.stage)],
    ["Sourcing", (c) => /supplier|corrected|Comparing/i.test(c.stage)],
    ["Approval", (c) => /approval|Revision/.test(c.stage)],
    ["Awaiting customer", (c) => /customer decision|On hold/.test(c.stage)],
    ["Won → PO / purchasing", (c) => /Won|PO/.test(c.stage)],
    ["Delivering", (c) => /Deliver/.test(c.stage)],
    ["Invoiced / collecting", (c) => /Invoiced/.test(c.stage)],
    ["Closed (lost / expired)", (c) => /Lost|Expired/.test(c.stage)],
  ];
  views.cases = (_, query) => {
    const f = query.get("f") || "all";
    const wait = query.get("wait");
    const view = query.get("view") || "list";
    const type = query.get("type") || "all";
    const filters = [["all", "All"], ["mine", "Mine"], ["blocked", "Blocked / exceptions"], ["nonext", "Closed & expired"]];
    let list = D.cases.slice();
    if (f === "mine") list = list.filter((c) => c.owner === state.role);
    if (f === "blocked") list = list.filter((c) => c.tone === "danger" || c.tone === "warn");
    if (f === "nonext") list = list.filter((c) => /Lost|Expired/.test(c.stage));
    if (wait) list = list.filter((c) => c.wait === wait);
    if (type !== "all") list = list.filter((c) => (c.type || "RFQ") === type);
    const board = `<div class="board">${BOARD.map(([title, fn]) => {
      const col = list.filter(fn);
      return `<div class="col"><div class="col-head">${title}<span>${col.length} · $${num(col.reduce((s, c) => s + c.value, 0) / 1000, 1)}k</span></div>
        ${col.map((c) => `<a class="deal ${c.tone === "danger" ? "danger" : c.tone === "warn" ? "warn" : ""}" href="#/case/${c.id}"><b>${c.id} · ${esc(c.vessel)}</b><span class="meta">${esc(c.customer)}</span><span class="meta">${chip(c.stage, c.tone === "neutral" ? "" : c.tone)} ${who(c.owner, false)}</span><span class="meta">Next: ${esc(c.next)}</span><span class="meta">Deadline ${fmtDate(c.deadline)} · ${usd(c.value, 0)}</span></a>`).join("") || `<div class="empty small">—</div>`}</div>`;
    }).join("")}</div>`;
    return [`
      <div class="page-head">
        <div><p class="eyebrow">Work</p><h1>RFQ cases</h1><p>Each customer RFQ is one parent case. Lines can be sourced, quoted, delivered and invoiced in stages — a partly quoted case never shows as complete.</p></div>
        <div class="row"><a class="btn ${view === "list" ? "btn-primary" : ""}" href="#/cases?view=list">List</a><a class="btn ${view === "board" ? "btn-primary" : ""}" href="#/cases?view=board">Board</a><a class="btn" href="#/inbox">+ New case</a></div>
      </div>
      <div class="row" role="group" aria-label="Case type">
        ${[["all", "All case types"], ["RFQ", "Stores & provisions RFQs"], ["Service", "Spare-parts clearance"], ["Held stores", "Held stores"]].map(([k, l]) => `<a class="btn btn-sm ${k === type ? "btn-primary" : ""}" href="#/cases?type=${encodeURIComponent(k)}&view=${view}">${l}</a>`).join("")}
      </div>
      <div class="row" role="group" aria-label="Filter cases">
        ${filters.map(([k, l]) => `<a class="btn btn-sm ${k === f && !wait ? "btn-primary" : ""}" href="#/cases?f=${k}&view=${view}">${l}</a>`).join("")}
        ${["Awaiting supplier", "Awaiting corrected offer", "Awaiting internal approval", "Awaiting customer decision", "Awaiting delivery or payment"].map((w) => `<a class="btn btn-sm ${wait === w ? "btn-primary" : ""}" href="#/cases?wait=${encodeURIComponent(w)}&view=${view}">${w}</a>`).join("")}
      </div>
      ${view === "board" ? board : `<section class="card"><div class="table-wrap">${App.caseTable(list)}</div></section>`}`, "RFQ cases"];
  };

  /* ---------------- Customers ---------------- */
  views.customers = ([id]) => {
    if (id && D.customers[id]) return customer(id);
    return [`
      <div class="page-head"><div><p class="eyebrow">Records</p><h1>Customers & fleets</h1><p>Shipowners, ship managers and industrial customers — with vessels and IMO numbers, fleet relationships, contacts, port preferences, vendor registrations and contact rules.</p></div><button type="button" class="btn">+ Add customer</button></div>
      <section class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>Customer</th><th>Type</th><th>Fleet</th><th>Registration</th><th>Contact rule</th><th class="num">RFQs / won</th><th class="num">Conversion</th><th>Next activity</th></tr></thead>
        <tbody>${Object.entries(D.customers).map(([k, c]) => `<tr class="clickable" data-href="#/customers/${k}">
          <td><a class="row-link" href="#/customers/${k}">${esc(c.name)}</a><span class="sub">${esc(c.country)}</span></td><td>${esc(c.type)}<span class="sub">${esc(c.segment || "")}</span></td>
          <td class="small">${c.fleet.map((v) => esc(v.vessel)).join(", ")}</td>
          <td>${chip(c.registration.status, /overdue/i.test(c.registration.renew) ? "warn" : "ok")}${/overdue/i.test(c.registration.renew) ? `<span class="sub t-warn">Renewal overdue</span>` : ""}</td>
          <td>${/DO NOT/.test(c.contactRule) ? chip("Do not chase", "danger") : chip("Follow-ups OK", "")}</td>
          <td class="num">${c.stats.rfqs} / ${c.stats.won}</td><td class="num">${c.stats.conversion}%</td>
          <td class="small ${c.noNext ? "t-danger" : ""}">${c.noNext ? "⚑ No next activity — plan one" : esc(c.nextActivity)}</td></tr>`).join("")}</tbody></table></div></section>`, "Customers"];
  };
  function customer(id) {
    const c = D.customers[id];
    const cases = D.cases.filter((x) => x.customer === c.name);
    return [`
      <div><div class="crumbs"><a href="#/customers">Customers</a> / ${esc(c.name)}</div>
      <div class="page-head"><div><h1>${esc(c.name)}</h1><p>${esc(c.type)} · ${esc(c.country)} · lead source: ${esc(c.leadSource)}</p></div><div class="row">${/DO NOT/.test(c.contactRule) ? chip(c.contactRule, "danger") : chip(c.contactRule, "ok")}</div></div></div>
      <section class="kpis">
        <div class="card kpi"><span class="label">RFQs received</span><span class="value">${c.stats.rfqs}</span></div>
        <div class="card kpi"><span class="label">Won</span><span class="value">${c.stats.won}</span><span class="delta">${usd(c.stats.valueWon, 0)}</span></div>
        <div class="card kpi"><span class="label">Conversion (value)</span><span class="value">${c.stats.conversion}%</span></div>
        <div class="card kpi"><span class="label">Avg. margin</span><span class="value">${c.stats.avgMargin}%</span></div>
      </section>
      <div class="two">
        <section class="card"><div class="card-head"><h2>Fleet</h2><p>Vessels link every case to IMO and ports</p></div><div class="table-wrap"><table class="data"><thead><tr><th>Vessel</th><th>IMO</th><th>Type</th><th>Manager</th></tr></thead><tbody>
          ${c.fleet.map((v) => `<tr><td>${esc(v.vessel)}</td><td class="mono">${esc(v.imo)}</td><td>${esc(v.type)}</td><td class="small">${esc(v.manager || "—")}</td></tr>`).join("")}</tbody></table></div></section>
        <section class="card"><div class="card-head"><h2>Commercial</h2></div><div class="card-body"><dl class="kv">
          <dt>Billing entity</dt><dd>${esc(c.billing)}</dd><dt>Payment terms</dt><dd>${esc(c.terms)}</dd><dt>Currency</dt><dd>${esc(c.currency)}</dd>
          <dt>Port preferences</dt><dd>${c.ports.map(esc).join(", ")}</dd>
          <dt>Vendor registration</dt><dd>${esc(c.registration.status)} · ${esc(c.registration.portal)} · since ${esc(c.registration.since)} · renew ${esc(c.registration.renew)}</dd>
          <dt>Frequently requested</dt><dd>${c.stats.top.map(esc).join(", ")}</dd>
          <dt>Next sales activity</dt><dd class="${c.noNext ? "t-danger" : ""}">${esc(c.nextActivity)}</dd></dl></div></section>
      </div>
      <section class="card"><div class="card-head"><div><h2>Value won per month</h2><p>USD thousands · customer POs incl. partial awards</p></div></div><div class="card-body">${Viz.bars({ x: D.analytics.months, series: [{ name: "Value won", values: D.analytics.customerWonK[id] || [0, 0, 0, 0, 0, 0] }], fmt: (v) => "$" + num(v, 1) + "k", highlightLast: true, label: "Value won per month" })}</div></section>
      <section class="card"><div class="card-head"><h2>Contacts</h2></div><div class="table-wrap"><table class="data"><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Preferred channel</th></tr></thead><tbody>
        ${c.contacts.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.role)}</td><td>${esc(p.email || "—")}</td><td>${esc(p.phone || "—")}</td><td>${esc(p.pref)}</td></tr>`).join("") || `<tr><td colspan="5" class="empty small">No contacts yet</td></tr>`}</tbody></table></div></section>
      <section class="card"><div class="card-head"><h2>Cases, quotations, orders, invoices</h2><p>Full transaction history from one record</p></div><div class="table-wrap">${App.caseTable(cases)}</div></section>`, c.name];
  }

  /* ---------------- Suppliers ---------------- */
  views.suppliers = ([selId], query) => {
    const sf = query?.get("f") || "all";
    const keep = ([, x]) => sf === "all" || (sf === "agency" && x.agency) || (sf === "stock" && x.own) || (sf === "local" && !x.agency && !x.own) || (sf === "new" && x.isNew);
    const s = selId && D.suppliers[selId];
    const hist = (selId && D.priceHistory[selId]) || [];
    return [`
      <div class="page-head"><div><p class="eyebrow">Records</p><h1>Suppliers</h1><p>One supplier database built from every RFQ, reply, PO and delivery — including suppliers that quoted but were never ordered from. Categories, approved status, dated offers, currencies, terms, response time, delivery reliability and technical compliance.</p></div><button type="button" class="btn">+ Add supplier</button></div>
      <div class="row" role="group" aria-label="Filter suppliers">${[["all", "All"], ["agency", "Agency principals"], ["local", "Local & regional suppliers"], ["stock", "Own stock"], ["new", "New — never ordered"]].map(([k, l]) => `<a class="btn btn-sm ${k === sf ? "btn-primary" : ""}" href="#/suppliers?f=${k}">${l}</a>`).join("")}</div>
      <div class="${s ? "grid-2-1" : ""}">
      <section class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>Supplier</th><th>Categories</th><th>Status</th><th>Terms · currency</th><th class="num">RFQs / POs</th><th class="num">Avg reply</th><th class="num">On-time</th><th class="num">Compliance</th></tr></thead>
        <tbody>${Object.entries(D.suppliers).filter(keep).map(([id, x]) => `
          <tr class="clickable ${id === selId ? "selected" : ""}" data-href="#/suppliers/${id}">
            <td><a class="row-link" href="#/suppliers/${id}">${esc(x.name)}</a><span class="sub">${esc(x.city)}</span></td>
            <td class="small">${x.cats.join(", ")}</td>
            <td>${x.isNew ? chip("New · not yet ordered", "gold") : x.agency ? chip("Agency principal · pricelist", "info") : x.own ? chip("Own stock", "ok") : chip(x.status, /watch/.test(x.status) ? "warn" : "ok")}</td>
            <td class="small">${esc(x.terms)} · ${esc(x.cur)}</td>
            <td class="num">${x.rfqs} / ${x.pos}</td><td class="num">${x.replyHrs} h</td>
            <td class="num ${x.onTime && x.onTime < 85 ? "t-warn" : ""}">${x.onTime ? x.onTime + "%" : "—"}</td><td class="num">${x.compliance ? x.compliance + "%" : "—"}</td>
          </tr>`).join("")}</tbody></table></div></section>
      ${s ? `
      <section class="card"><div class="card-head"><div><h2>${esc(s.name)}</h2><p>${esc(s.city)} · ${s.cats.join(", ")} · ${esc(s.contact)}</p></div><a class="btn btn-sm btn-ghost" href="#/suppliers" aria-label="Close supplier panel">✕</a></div>
        <div class="card-body stack">
          ${s.isNew ? `<div class="flag info">${esc(s.addedFrom)}. Contact, category and price were captured from the email reply; approved-vendor status waits for Karim Balbaa.</div><div class="row"><button type="button" class="btn btn-sm" data-action="toast" data-msg="Approval request sent to Karim Balbaa">Request approved-vendor status</button></div>` : ""}
          <h3>Dated price history</h3>
          ${hist.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Item</th><th class="num">Price</th><th>Quoted</th><th>Valid</th><th>Source</th></tr></thead><tbody>
            ${hist.map((x) => `<tr><td>${esc(x.item)} ${x.ordered ? chip("Ordered", "ok") : chip("Quote only", "")}</td><td class="num">${esc(x.price)}</td><td class="nowrap">${esc(x.date)}</td><td class="small ${/expired|superseded/.test(x.valid) ? "t-danger" : ""}">${esc(x.valid)}</td><td class="small">${esc(x.source)}</td></tr>`).join("")}
          </tbody></table></div>` : `<p class="empty small">No price history in the demo data for this supplier.</p>`}
          ${D.analytics.supplierOnTime[selId] ? `<h3>On-time delivery, last 6 months</h3>${Viz.line({ x: D.analytics.months, series: [{ name: "On-time", values: D.analytics.supplierOnTime[selId] }], fmt: (v) => Math.round(v) + "%", yMax: 100, height: 180, label: "On-time delivery trend" })}` : ""}
          <dl class="kv"><dt>Response time</dt><dd>${s.replyHrs} h average</dd><dt>Delivery reliability</dt><dd>${s.onTime ? s.onTime + "% on time" : "No deliveries yet"}</dd><dt>Technical compliance</dt><dd>${s.compliance ? s.compliance + "% of offers compliant" : "—"}${selId === "S2" ? " · 1 wrong part (Nov 2026)" : ""}</dd><dt>Bank details</dt><dd>Verified ${selId === "S7" ? "— change request pending (see Approvals)" : "· unchanged"}</dd></dl>
        </div></section>` : ""}
      </div>`, s ? s.name : "Suppliers"];
  };

  /* ---------------- Products ---------------- */
  views.products = ([pid]) => {
    const p = pid && D.products.find((x) => x.id === pid);
    return [`
      <div class="page-head"><div><p class="eyebrow">Records</p><h1>Products</h1><p>Organised like Golden Sea's own catalogue — engine, deck, cabin, electrical, safety, medicine, stationery, provision and bond stores by IMPA series. Descriptions and aliases (so “belt dressing spray” finds CRC Belt Grip), brands, OEM part numbers, IMPA / ISSA and HS codes, units and pack conversions, specifications, certificates and shelf-life controls.</p></div><button type="button" class="btn">+ Add product</button></div>
      <div class="${p ? "grid-2-1" : ""}">
      <section class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>Product · aliases</th><th>Store · series</th><th>Brand · OEM</th><th>IMPA · ISSA · HS</th><th>Unit & packs</th><th>Last purchase price</th></tr></thead>
        <tbody>${D.products.slice().sort((a, b) => (a.store || "").localeCompare(b.store || "")).map((x) => `<tr class="clickable ${x.id === pid ? "selected" : ""}" data-href="#/products/${x.id}">
          <td><a class="row-link" href="#/products/${x.id}">${esc(x.name)}</a>${x.agency ? ` ${chip("Agency", "gold")}` : ""}${x.cold ? ` ${chip("Cold chain", "info")}` : ""}${x.bond ? ` ${chip("Bond", "warn")}` : ""}<span class="sub">${x.aliases.map(esc).join(" · ")}</span></td>
          <td class="small">${esc(x.store || "—")}<span class="sub">${esc(x.series ? (/^\d/.test(x.series) ? "IMPA series " + x.series : x.series) : "")}</span></td>
          <td>${esc(x.brand)}<span class="sub mono">${esc(x.oem)}</span></td><td class="small mono">${esc(x.impa)} · ${esc(x.issa)} · ${esc(x.hs)}</td>
          <td class="small">${esc(x.unit)}<span class="sub">${esc(x.packs)}</span></td><td class="small">${esc(x.lastBuy)}</td></tr>`).join("")}</tbody></table></div></section>
      ${p ? `<section class="card"><div class="card-head"><h2>${esc(p.name)}</h2><a class="btn btn-sm btn-ghost" href="#/products" aria-label="Close">✕</a></div><div class="card-body"><dl class="kv">
        <dt>Aliases</dt><dd>${p.aliases.map(esc).join("; ")}</dd><dt>Brand · OEM</dt><dd>${esc(p.brand)} · ${esc(p.oem)}</dd><dt>IMPA / ISSA</dt><dd>${esc(p.impa)} / ${esc(p.issa)}</dd><dt>HS code</dt><dd>${esc(p.hs)}</dd>
        <dt>Unit & conversions</dt><dd>${esc(p.unit)} — ${esc(p.packs)}</dd><dt>Specification</dt><dd>${esc(p.specs)}</dd><dt>Certificates</dt><dd>${esc(p.certs)}</dd><dt>Shelf life / expiry</dt><dd>${esc(p.shelf)}</dd>
        <dt>Suppliers</dt><dd>${p.suppliers} with dated prices</dd><dt>Last purchase</dt><dd>${esc(p.lastBuy)}</dd></dl></div></section>` : ""}
      </div>`, p ? p.name : "Products"];
  };

  /* ---------------- Growth CRM ---------------- */
  views.growth = () => [`
    <div class="page-head"><div><p class="eyebrow">Growth</p><h1>Growth CRM</h1><p>Prospects, ship-management companies, fleets, introductions and vendor-registration applications — kept separate from operational RFQs, and linked to the customer record once business is won.</p></div><button type="button" class="btn btn-primary">+ Add opportunity</button></div>
    <div class="board">${D.growthStages.map((s) => {
      const col = D.opportunities.filter((o) => o.stage === s);
      return `<div class="col"><div class="col-head">${s}<span>${col.length}</span></div>${col.map((o) => `<div class="deal ${o.noNext ? "danger" : ""}" tabindex="0"><b>${esc(o.name)}</b><span class="meta">${esc(o.kind)}</span><span class="meta">${o.noNext ? `<span class="t-danger">⚑ No next step — plan one or close</span>` : `Next: ${esc(o.next)} · ${fmtDate(o.due)}`}</span><span class="meta">${esc(o.value)} · ${who(o.owner, false)} · ${esc(o.source)}</span></div>`).join("") || `<div class="empty small">—</div>`}</div>`;
    }).join("")}</div>
    <section class="card"><div class="card-head"><h2>Vendor registrations</h2><p>Applications to become an approved supplier of a ship manager / owner</p></div>
      <div class="table-wrap"><table class="data"><thead><tr><th>Company</th><th>Portal / method</th><th>Submitted</th><th>Status</th><th>Documents</th><th>Next</th></tr></thead><tbody>
        ${D.registrations.map((r) => `<tr><td>${esc(r.company)}</td><td class="small">${esc(r.portal)}</td><td>${esc(r.submitted)}</td><td>${chip(r.status, /overdue/i.test(r.status) ? "danger" : /requested/.test(r.status) ? "warn" : "info")}</td><td class="small">${esc(r.docs)}</td><td class="small">${esc(r.next)}</td></tr>`).join("")}
      </tbody></table></div></section>
    <section class="card"><div class="card-head"><h2>Email marketing</h2><p>Approved lists and content only · sending restricted to Karim Balbaa</p></div>
      <div class="table-wrap"><table class="data"><thead><tr><th>Campaign</th><th>List</th><th>Content</th><th>Status</th><th>Permission</th></tr></thead><tbody>
        ${D.campaigns.map((c) => `<tr><td>${esc(c.name)}</td><td class="small">${esc(c.list)}</td><td>${/Approved/.test(c.content) ? chip(c.content, "ok") : chip(c.content, "warn")}</td><td>${esc(c.status)}</td><td class="small">${esc(c.sender)}</td></tr>`).join("")}
      </tbody></table></div></section>
    <p class="small text-2">Sales activities for these opportunities appear in <a href="#/followups">Follow-ups</a> with a channel, a script and an outcome.</p>`, "Growth CRM"];
})();
