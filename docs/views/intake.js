/* Inbox intake: RFQ emails (PDF/Excel/Word/photo), reply matching, review queue, duplicates. */
(() => {
  const { D, state, views, actions, h, toast, runAI } = App;
  const { esc, chip, conf, confClass, ai } = h;

  const resultChip = (x) => {
    if (x.result === "new") return state.inboxDone[x.id] ? chip("Case created", "ok") : chip(`New RFQ · ${x.fmt}`, "info");
    if (x.result === "matched") return chip("Matched to case", "ok");
    if (x.result === "review") return state.reviewed[x.id] ? chip("Linked after review", "ok") : chip("Needs review", "warn");
    if (x.result === "service") return state.inboxDone[x.id] ? chip("Service case created", "ok") : chip("Service request · clearance", "gold");
    return chip("Duplicate — linked", "");
  };

  views.inbox = () => {
    const m = D.inbox.find((x) => x.id === state.inboxSel) || D.inbox[0];
    const res = state.inboxAI[m.id];
    let detail = "";
    const header = `
      <div class="row"><h2>${esc(m.subject)}</h2></div>
      <p class="text-2 small">From ${esc(m.from)} · ${esc(m.time)} · ${m.fmt === "Image" ? "forwarded from WhatsApp by Karim Youssef" : m.fmt === "Web form" ? "submitted on the website “Request a quick quote” form" : "via sales@goldensea (Outlook)"}</p>
      <div class="row">${m.attachment ? `<span class="attach">📎 ${esc(m.attachment)} <span class="text-2 small">${m.fmt}${m.fmt === "Image" ? " · OCR" : ""} · original preserved</span></span>` : ""}${resultChip(m)}</div>
      <div class="mail-body">${esc(m.body)}</div>`;

    if (m.result === "new") {
      const done = state.inboxDone[m.id];
      detail = `${header}
        ${!res ? `<div class="ai-out row">${ai("Extraction")}<span>Read the email and the ${m.fmt} attachment into a draft case (customer, vessel, IMO, port, ETA, deadline, lines, brand, model, part no., IMPA/ISSA).</span><span class="spacer"></span><button type="button" class="btn btn-primary btn-ai" data-action="ai-extract" data-id="${m.id}">Extract draft case</button></div>` : `
        <div class="stack">
          <div class="row"><h3>Extracted case header</h3>${ai("Draft")}<span class="spacer"></span><span class="text-2 small">Low-confidence values are never auto-applied</span></div>
          <div class="field-grid">${Object.entries(res.header).map(([k, [v, c]]) => `<div class="xfield ${confClass(c)}"><small>${esc(k)} ${conf(c)}</small><div>${esc(v)}</div></div>`).join("")}</div>
          ${res.missing.length ? `<div class="flag warn">Missing / unclear: ${esc(res.missing.join(" · "))} — a clarification draft to the customer is prepared.</div>` : ""}
        </div>
        <div class="stack">
          <div class="row"><h3>Extracted lines</h3>${ai("Draft")}</div>
          <div class="table-wrap card"><table class="data"><thead><tr><th>#</th><th>Description</th><th>Brand</th><th>Model</th><th>Part no.</th><th>IMPA / ISSA</th><th>Qty</th><th>Brand rule</th><th>Confidence</th></tr></thead>
          <tbody>${res.lines.map((l, i) => `<tr><td>${i + 1}</td><td>${esc(l[0])}</td><td>${esc(l[1])}</td><td>${esc(l[2])}</td><td class="mono">${esc(l[3])}</td><td class="small">${esc(l[4])}</td><td class="nowrap">${esc(l[5])}</td><td>${l[6] === "Exact brand" ? chip("Exact brand", "gold") : esc(l[6])}</td><td>${conf(l[7])}${l[7] < 0.8 ? `<span class="sub t-warn">Check against original</span>` : ""}</td></tr>`).join("")}</tbody></table></div>
        </div>
        <div class="callout"><strong>Assignment rule:</strong> ${m.id === "m1" ? "Helios Bulk account → owner Soaad Amer, backup Karim Youssef" : m.id === "m4" ? "New prospect (Baltic Reefer, growth pipeline) → owner Soaad Amer" : m.id === "m7" ? "New offshore customer from the website → owner Ahmedy (Alexandria office, offshore); contact created in Growth CRM. <b>Lalizas is a Golden Sea agency</b> — life jackets are priced from the agency pricelist without a supplier RFQ" : "Atlas Tankers account → owner Karim Youssef"}. ${m.id === "m1" ? "<b>Urgent:</b> vessel arrives in 2 days." : ""} Acknowledgement template “RFQ received – marine” will be sent once (pre-approved rule). ${m.id === "m5" ? "WhatsApp source: acknowledgement must be sent manually by the owner." : ""}</div>
        <div class="row">
          ${done ? `<a class="btn btn-primary" href="#/case/GS-RFQ-0141">Open created case →</a>` : `<button type="button" class="btn btn-primary" data-action="create-case" data-id="${m.id}">Confirm &amp; create case</button><button type="button" class="btn">Edit extracted data</button><button type="button" class="btn">Request missing info</button><button type="button" class="btn btn-ghost">Not an RFQ</button>`}
        </div>`}`;
    } else if (m.result === "service") {
      detail = `${header}
        <div class="callout"><strong>Recognised as a service request, not an RFQ:</strong> spare-parts clearance &amp; forwarding — one of Golden Sea's core services. AWB <b>41 2233 9081</b> (DHL), arriving Cairo 19 Nov · MV Aurora Crest · deliver on board with the stores of GS-RFQ-0142.</div>
        <div class="field-grid">${[["Service", "Customs clearance — ship spares in transit"], ["AWB", "41 2233 9081 (DHL)"], ["Arrival", "Cairo airport 19 Nov"], ["Linked supply case", "GS-RFQ-0142 (same vessel & call)"], ["Owner", "Ahmedy (operations)"], ["Billable", "Clearance fee + transport (customer)"]].map(([k, v]) => `<div class="xfield high"><small>${k}</small><div>${v}</div></div>`).join("")}</div>
        <div class="row">${state.inboxDone[m.id] ? `<a class="btn btn-primary" href="#/case/GS-SVC-0021">Open GS-SVC-0021 →</a>` : `<button type="button" class="btn btn-primary" data-action="create-case" data-id="${m.id}">Create service case &amp; link to GS-RFQ-0142</button>`}</div>`;
    } else if (m.result === "review") {
      detail = `${header}
        <div class="flag warn">${esc(m.matchNote)}</div>
        ${state.reviewed[m.id] ? `<div class="flag ok">Linked to GS-RFQ-0142 by ${esc(App.h.me().name)} — offer lines sent to extraction.</div>` : `
        <div class="row"><button type="button" class="btn btn-primary" data-action="review-link" data-id="${m.id}">Link to GS-RFQ-0142</button><button type="button" class="btn" data-action="review-link" data-id="${m.id}">Link to GS-RFQ-0140</button><button type="button" class="btn btn-ghost">Not related</button><button type="button" class="btn btn-sm btn-ai" data-action="ai-match" data-id="${m.id}">Explain match</button></div>`}`;
    } else {
      detail = `${header}
        <div class="flag ${m.result === "matched" ? "ok" : "info"}"><span aria-hidden="true">${m.result === "matched" ? "✓" : "⧉"}</span><span>${esc(m.matchNote)}</span></div>
        <div class="row"><a class="btn btn-primary" href="#/case/GS-RFQ-0142/${m.result === "matched" ? "compare" : "activity"}">Open GS-RFQ-0142</a>${m.result === "matched" ? `<a class="btn" href="#/suppliers/S5">View new supplier record</a>` : ""}</div>`;
    }

    return [`
      <div class="page-head"><div><p class="eyebrow">Work · intake</p><h1>Inbox intake</h1><p>Every format customers use — email body, PDF, Excel, Word or a photo from WhatsApp — becomes one draft case. Replies and forwards are matched to existing cases even when the subject changes; uncertain matches wait here for a person.</p></div>
        <div class="row"><button type="button" class="btn" data-action="manual-rfq">+ Log phone / WhatsApp RFQ</button><button type="button" class="btn">Upload file</button></div></div>
      <div class="row small"><span class="chip ok no-dot">Outlook · sales@ connected</span><span class="chip ok no-dot">Gmail · purchasing intake connected</span><span class="chip warn no-dot">Website quick-quote form (to connect)</span><span class="chip danger no-dot">Outlook · purchasing@ token expired → <a href="#/automations">exception</a></span></div>
      <div class="card split">
        <ul class="mail-list" aria-label="Messages">
          ${D.inbox.map((x) => `<li><button type="button" data-action="inbox" data-id="${x.id}" aria-pressed="${x.id === m.id}">
            <span class="from"><span>${esc(x.fromName)}</span><span class="text-2 small">${esc(x.time)}</span></span>
            <span class="subj">${esc(x.subject)}</span>
            <span>${resultChip(x)}</span></button></li>`).join("")}
          <li class="empty small">Processed earlier today: 14 · Duplicates suppressed: 2</li>
        </ul>
        <div class="card-body stack">${detail}</div>
      </div>`, "Inbox intake"];
  };

  actions.inbox = (el) => { state.inboxSel = el.dataset.id; App.render(); };
  actions["ai-extract"] = (el) => runAI(el, () => GSAI.extractRfqFromEmail({ id: el.dataset.id }), (r) => { state.inboxAI[el.dataset.id] = r; App.render(); });
  actions["ai-match"] = (el) => runAI(el, () => GSAI.matchReplyToCase({ id: el.dataset.id }), (r) => toast(`Match ${Math.round(r.confidence * 100)}%: ${r.basis.join("; ")}`, "✦"));
  actions["create-case"] = (el) => {
    state.inboxDone[el.dataset.id] = true;
    toast("Case created · owner assigned · acknowledgement sent once (approved template) · deadline reminder scheduled");
    App.render();
  };
  actions["review-link"] = (el) => { state.reviewed[el.dataset.id] = true; toast("Linked — reviewer and reason saved in the audit log"); App.render(); };
  actions["manual-rfq"] = () => App.openDialog({
    title: "Log an RFQ received by phone or WhatsApp",
    body: `<div class="field-grid"><label class="lbl">Customer<select name="c" data-autofocus>${Object.values(D.customers).map((c) => `<option>${esc(c.name)}</option>`).join("")}</select></label>
      <label class="lbl">Vessel<input type="text" name="v" value="MT Atlas Pearl"></label><label class="lbl">Channel<select name="ch"><option>WhatsApp</option><option>Phone</option><option>Meeting</option></select></label></div>
      <label class="lbl">Paste message / notes<textarea name="t">Pls quote rope 24mm x 220m 2 coils, padlocks 50mm x10, brushes 3" x24 — Alex 28/11</textarea></label>
      <label class="lbl">Source evidence (screenshot / voice note)<input type="file" name="f"></label>
      <p class="small text-2">Saved with your name and time as the source. ${ai("Extraction")} turns the text into draft lines.</p>`,
    actions: [{ label: "Cancel", value: "cancel" }, { label: "Create draft case", value: "ok", cls: "btn-primary" }],
    onClose: () => toast("Draft case created from WhatsApp — attributed to " + App.h.me().name),
  });
})();
