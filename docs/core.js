/* Golden Sea Sourcing Desk — core: state, helpers, maths, router, dialog, toast, palette. */
window.App = (() => {
  "use strict";
  const D = window.GS;
  const C = D.mainCase;
  const NOW = new Date("2026-11-17T10:30");
  const MIN_MARGIN = 15;

  /* ---------------- state ---------------- */
  const fresh = () => ({
    role: "ky",
    preset: "quote",
    selected: { 1: "S5|1", 2: "S1|1", 3: "S1|1", 5: "split" },
    selReason: { 5: "Split: Nile Safety only has 10 — cheaper than 15 from Delta (AI proposal accepted)" },
    margins: { 1: 25, 2: 22, 3: 25, 4: 20, 5: 28 },
    allocation: "value",
    discount: 0,
    customerAccepted: {},
    quoteStatus: "draft", // draft | pending | approved | sent | revision | won | lost
    quoteVersion: 1,
    submission: { method: "email", portal: null, receipt: false },
    poResolved: {},
    poChecked: false,
    caseClosed: false,
    approvals: structuredClone(D.approvals),
    supplierRfqs: structuredClone(C.supplierRfqs),
    clarifications: structuredClone(C.clarifications),
    timeline: structuredClone(C.timeline),
    exceptions: structuredClone(D.exceptions),
    audit: structuredClone(D.audit),
    inboxSel: "m1",
    inboxAI: {},
    inboxDone: {},
    reviewed: {},
    importApproved: false,
    caseView: "list",
    q: "",
    stepsDone: {},
    briefing: null,
  });
  const state = fresh();

  /* ---------------- helpers ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const egp = (n) => `EGP ${num(n)}`;
  const usd = (n, d = 2) => `USD ${num(n, d)}`;
  const money = (n, cur) => (cur === "EGP" ? egp(n) : `${cur} ${num(n, 2)}`);
  const fmtDate = (s, withTime = false) => {
    const d = new Date(s);
    if (isNaN(d)) return esc(s);
    const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    return withTime ? `${date} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : date;
  };
  const until = (s) => {
    const ms = new Date(s) - NOW;
    if (ms < 0) return `overdue ${Math.round(-ms / 36e5)} h`;
    const h = Math.round(ms / 36e5);
    return h < 24 ? `in ${h} h` : `in ${Math.floor(h / 24)} d ${h % 24} h`;
  };
  const chip = (text, tone = "", extra = "") => `<span class="chip ${tone} ${extra}">${esc(text)}</span>`;
  const who = (id, showName = true) => {
    const u = D.users[id];
    return u ? `<span class="who"><span class="avatar" aria-hidden="true">${u.initials}</span>${showName ? esc(u.name) : `<span class="visually-hidden">${esc(u.name)}</span>`}</span>` : "";
  };
  const confClass = (c) => (c >= 0.85 ? "high" : c >= 0.6 ? "mid" : "low");
  const conf = (c) => `<span class="conf ${confClass(c)}" title="AI confidence">${Math.round(c * 100)}%</span>`;
  const sup = (id) => D.suppliers[id];
  const daysToEta = Math.round((new Date(C.eta.slice(0, 10)) - new Date(D.today)) / 864e5);
  const seg = (n, t, c) => (n ? `<span style="width:${(n / t) * 100}%;background:${c}"></span>` : "");
  const ai = (label = "AI") => `<span class="ai-badge">✦ ${esc(label)}</span>`;
  const flag = (tone, text) => `<span class="flag ${tone}">${esc(text)}</span>`;
  const me = () => D.users[state.role];
  const can = (perm) => {
    const idx = D.permNames.indexOf(perm);
    const map = { ky: 0, sa: 1, ah: 2, kb: 3, mh: 5, em: 6, ne: 6 };
    return !!D.roles[map[state.role]]?.perms[idx];
  };

  /* ---------------- offer maths ---------------- */
  const line = (n) => C.lines.find((l) => l.n === n);
  const offerKey = (o) => `${o.sup}|${o.ver}`;
  const findOffer = (n, key) => (C.offers[n] || []).find((o) => offerKey(o) === key);
  const reqBase = (l) => l.qty * l.packSize;
  const offerTotalEGP = (o) => o.price * o.packs * D.fx[o.cur];
  const perBaseEGP = (o) => offerTotalEGP(o) / (o.packs * o.packSize);
  const coverage = (o, l) => (o.packs * o.packSize) / reqBase(l);
  const isExpired = (o) => new Date(o.valid) < new Date(D.today);

  function offerFlags(o, l) {
    const f = [];
    if (o.mismatch) f.push(["danger", o.mismatch]);
    if (o.specMismatch) f.push(["danger", o.specMismatch]);
    if (o.superseded) f.push(["", "Superseded by v2 — kept for audit"]);
    if (o.revised) f.push(["ok", `${o.revised}: now matches LOCTITE 243`]);
    if (o.packChange) f.push(["warn", `Pack size differs (${o.packLabel}). Same ${num(reqBase(l))} ${l.base} total — customer written acceptance required.`]);
    if (o.shortfall) f.push(["warn", o.shortfall]);
    if (o.shelfNote) f.push(["warn", o.shelfNote]);
    if (o.lead > daysToEta) f.push(["danger", `Lead time ${o.lead} d misses vessel ETA ${fmtDate(C.eta)}`]);
    else if (o.lead === daysToEta) f.push(["warn", "Tight: ready on ETA day"]);
    if (isExpired(o)) f.push(["danger", `Offer expired ${fmtDate(o.valid)}`]);
    if (o.newSupplier) f.push(["info", "New supplier · no delivery history · 50% advance requested"]);
    if (o.agency) f.push(["info", "Golden Sea agency pricelist — priced instantly, no supplier RFQ"]);
    if (o.stock) f.push(["ok", "Own stock — reserve now, delivered by Golden Sea truck"]);
    if (o.cur !== "EGP") f.push(["info", `Converted at approved FX ${o.cur}/EGP ${D.fx[o.cur]}`]);
    return f;
  }
  const usable = (o, l) => !o.mismatch && !o.specMismatch && !o.superseded && !isExpired(o) && o.lead <= daysToEta && coverage(o, l) >= 1;
  const bestOffer = (n) => {
    const l = line(n);
    return (C.offers[n] || []).filter((o) => usable(o, l)).sort((a, b) => perBaseEGP(a) - perBaseEGP(b))[0];
  };
  /** Selected parts for a line: [{o, qtyBase}] */
  function selParts(n) {
    const key = state.selected[n];
    if (!key) return [];
    const l = line(n);
    if (key === "split") return (C.split[n] || []).map((p) => ({ o: findOffer(n, p.key), qtyBase: p.qty * l.packSize }));
    const o = findOffer(n, key);
    return o ? [{ o, qtyBase: reqBase(l) }] : [];
  }
  const splitCost = (n) => selParts(n).reduce((s, p) => s + perBaseEGP(p.o) * p.qtyBase, 0);

  function lineStatus(l) {
    if (l.missing) return ["Clarification needed", "danger"];
    const parts = selParts(l.n);
    if (parts.length) {
      if (parts.some((p) => p.o.packChange) && !state.customerAccepted[l.n]) return ["Awaiting customer acceptance", "warn"];
      return [parts.length > 1 ? "Split offer selected" : "Offer selected", "ok"];
    }
    const pending = state.supplierRfqs.some((r) => r.lines.includes(l.n) && /Awaiting|Sent|Clarification|Partial/.test(r.status));
    if (pending) return ["Awaiting supplier", "warn"];
    return (C.offers[l.n] || []).length ? ["Ready to select", "info"] : ["Not sourced", ""];
  }

  function pricing() {
    const rows = C.lines.map((l) => {
      const parts = selParts(l.n);
      if (!parts.length) return { l, parts };
      return { l, parts, o: parts[0].o, cost: splitCost(l.n) };
    });
    const priced = rows.filter((r) => r.parts.length);
    const sumCost = priced.reduce((s, r) => s + r.cost, 0);
    const sumQty = priced.reduce((s, r) => s + r.l.qty, 0);
    const charges = C.deliveryCharges.reduce((s, c) => s + c.egp, 0);
    priced.forEach((r) => {
      r.alloc = state.allocation === "qty" ? (charges * r.l.qty) / sumQty : state.allocation === "lines" ? charges / priced.length : (charges * r.cost) / sumCost;
      r.landed = r.cost + r.alloc;
      r.m = state.margins[r.l.n] ?? 25;
      r.sell = r.landed / (1 - r.m / 100);
      r.profit = r.sell - r.landed;
      r.markup = (r.profit / r.landed) * 100;
      r.sellUSD = r.sell / D.fx.USD;
      r.unitUSD = r.sellUSD / r.l.qty;
      r.inputVat = r.cost * D.vat; // recoverable, excluded from cost
      r.checks = [];
      if (r.m < MIN_MARGIN) r.checks.push(["warn", `Below ${MIN_MARGIN}% minimum margin — approval exception`]);
      if (r.m <= 0) r.checks.push(["danger", "Negative / zero profit"]);
      if (r.parts.some((p) => p.o.lead > daysToEta)) r.checks.push(["danger", "Supplier lead time misses ETA"]);
      if (r.parts.some((p) => isExpired(p.o))) r.checks.push(["danger", "Supplier price expired — reconfirm"]);
      if (r.parts.some((p) => p.o.packChange) && !state.customerAccepted[r.l.n]) r.checks.push(["warn", "Alternative pack — needs written customer acceptance"]);
      if (r.parts.some((p) => p.o.shelfNote)) r.checks.push(["warn", "Shelf life below customer requirement"]);
      if (r.parts.length === 1 && coverage(r.o, r.l) < 1) r.checks.push(["warn", `Supplier covers only ${Math.round(coverage(r.o, r.l) * 100)}% — split sourcing needed`]);
      if (r.parts.length > 1) r.checks.push(["info", `Split sourcing: ${r.parts.map((p) => `${sup(p.o.sup).name} ${p.qtyBase / r.l.packSize}`).join(" + ")}`]);
      if (r.parts.some((p) => p.o.newSupplier)) r.checks.push(["info", "Advance payment exposure 50%"]);
    });
    const tot = priced.reduce((a, r) => ({ cost: a.cost + r.landed, sell: a.sell + r.sell, profit: a.profit + r.profit, vat: a.vat + r.inputVat }), { cost: 0, sell: 0, profit: 0, vat: 0 });
    tot.discount = tot.sell * (state.discount / 100);
    tot.sell -= tot.discount;
    tot.profit -= tot.discount;
    tot.margin = tot.sell ? (tot.profit / tot.sell) * 100 : 0;
    tot.sellUSD = tot.sell / D.fx.USD;
    tot.missingCost = C.deliveryCharges.some((c) => c.estimate);
    return { rows, priced, tot, charges };
  }

  /* ---------------- presets (demo time-travel) ---------------- */
  const PRESETS = {
    quote: { label: "Sourcing & quote (17 Nov)", apply: () => {} },
    won: {
      label: "Customer PO received (18 Nov)", apply: () => {
        state.selected[3] = "S2|1"; state.customerAccepted[3] = true; state.quoteStatus = "won";
        state.selReason[3] = "Alternative pack fixes shelf life (19 months) and is cheaper; customer accepted in writing";
        state.poChecked = true; state.poResolved = {};
      },
    },
    delivery: {
      label: "In delivery (20 Nov)", apply: () => { PRESETS.won.apply(); state.poResolved = { 3: true, 5: true }; },
    },
    settled: {
      label: "Delivered & settled (Jan 2027)", apply: () => { PRESETS.delivery.apply(); },
    },
  };
  function setPreset(p) {
    const keep = { role: state.role, inboxSel: state.inboxSel };
    Object.assign(state, fresh(), keep);
    state.preset = p;
    PRESETS[p].apply();
  }
  const atLeast = (p) => ["quote", "won", "delivery", "settled"].indexOf(state.preset) >= ["quote", "won", "delivery", "settled"].indexOf(p);

  /* ---------------- UI primitives ---------------- */
  function toast(msg, ico = "✓") {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="t-ico" aria-hidden="true">${ico}</span><span>${msg}</span>`;
    $("#toasts").append(t);
    setTimeout(() => t.remove(), 4500);
  }

  let dialogHandler = null;
  function openDialog({ title, body, actions, onClose, wide }) {
    const dlg = $("#dialog");
    dlg.style.width = wide ? "min(1000px, calc(100vw - 24px))" : "";
    $("#dialog-form").innerHTML = `
      <header><h2 id="dialog-title">${title}</h2><button type="submit" value="cancel" class="btn btn-ghost icon-btn" aria-label="Close">✕</button></header>
      <div class="body">${body}</div>
      <footer>${actions.map((a) => `<button type="submit" value="${a.value}" class="btn ${a.cls || ""}">${a.label}</button>`).join("")}</footer>`;
    dialogHandler = onClose;
    dlg.returnValue = "";
    if (!dlg.open) dlg.showModal();
    dlg.querySelector("[data-autofocus]")?.focus();
  }
  $("#dialog").addEventListener("close", () => {
    const dlg = $("#dialog");
    const fn = dialogHandler;
    dialogHandler = null;
    if (fn && dlg.returnValue && dlg.returnValue !== "cancel") fn(dlg.returnValue, $("#dialog-form"));
  });

  /** Run an async AI stub with button busy state. */
  async function runAI(btn, fn, onDone) {
    if (btn) { btn.setAttribute("aria-busy", "true"); btn.dataset.label = btn.textContent; }
    try { const res = await fn(); onDone(res); }
    catch (e) { toast(`AI service error — nothing changed (${esc(e.message)})`, "!"); }
    finally { if (btn?.isConnected) btn.removeAttribute("aria-busy"); }
  }

  function log(kind, ico, text) {
    state.timeline.push({ t: NOW.toISOString(), kind, ico, text, live: true });
    state.audit.unshift({ at: "Just now", who: kind === "auto" ? "System" : me().name, what: text, undo: kind !== "auto" });
  }

  /* ---------------- router ---------------- */
  const views = {};
  const actions = {};
  function parse() {
    const [path, query] = location.hash.replace(/^#/, "").split("?");
    const parts = path.split("/").filter(Boolean);
    return { parts: parts.length ? parts : ["dashboard"], query: new URLSearchParams(query || "") };
  }

  let lastPath = "";
  function render() {
    const { parts, query } = parse();
    if (query.get("preset") && query.get("preset") !== state.preset && PRESETS[query.get("preset")]) setPreset(query.get("preset"));
    const [route] = parts;
    const view = views[route] || views.dashboard;
    const main = $("#main");
    let html, title;
    try { [html, title] = view(parts.slice(1), query); }
    catch (e) { console.error(e); html = `<div class="flag danger">View error: ${esc(e.message)}</div>`; title = "Error"; }
    main.innerHTML = html;
    document.title = `${title} · Golden Sea Sourcing Desk`;
    document.querySelectorAll("#nav a").forEach((el) => {
      const r = el.dataset.route;
      const active = r === route || (r === "cases" && route === "case");
      active ? el.setAttribute("aria-current", "page") : el.removeAttribute("aria-current");
    });
    const pa = state.approvals.filter((x) => !x.done).length;
    $("#nav-approval-count").textContent = pa; $("#nav-approval-count").hidden = !pa;
    const ib = D.inbox.filter((m) => !state.inboxDone[m.id] && (m.result === "new" || (m.result === "review" && !state.reviewed[m.id]))).length;
    $("#nav-inbox-count").textContent = ib; $("#nav-inbox-count").hidden = !ib;
    const ex = state.exceptions.filter((x) => x.status === "Open" || x.status === "Waiting for review").length;
    $("#nav-ex-count").textContent = ex; $("#nav-ex-count").hidden = !ex;

    const path = location.hash.split("?")[0];
    if (path !== lastPath) {
      const sameCase = lastPath.startsWith(`#/case/${parts[1]}`) && route === "case";
      lastPath = path;
      if (!sameCase) { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
    }
    document.dispatchEvent(new CustomEvent("rendered"));
  }
  window.addEventListener("hashchange", render);

  /* ---------------- events ---------------- */
  document.addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-href]");
    if (row && !e.target.closest("a,button,input,select,label")) { location.hash = row.dataset.href; return; }
    const el = e.target.closest("[data-action]");
    if (!el || el.matches("input[type=number], select")) return;
    const fn = actions[el.dataset.action];
    if (fn) fn(el, e);
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    const fn = el.dataset?.action && actions[`change:${el.dataset.action}`];
    if (fn) { const id = el.id; fn(el); render(); if (id) $("#" + id)?.focus(); }
  });

  /* ---------------- command palette (Ctrl/⌘ K) ---------------- */
  function paletteItems() {
    const items = [
      ["My day", "Page", "#/dashboard"], ["Follow-ups & next steps", "Page", "#/followups"], ["Inbox intake", "Page", "#/inbox"],
      ["RFQ cases", "Page", "#/cases"], ["Cases board", "Page", "#/cases?view=board"], ["Approvals", "Page", "#/approvals"],
      ["Customers", "Page", "#/customers"], ["Suppliers", "Page", "#/suppliers"], ["Products", "Page", "#/products"], ["Growth CRM", "Page", "#/growth"],
      ["Management dashboard", "Page", "#/management"], ["Automations & exceptions", "Page", "#/automations"], ["Integrations & import", "Page", "#/integrations"],
      ["Settings — roles, FX, pricing policy, audit", "Page", "#/settings"], ["Requirement coverage", "Proposal", "#/coverage"], ["Pilot plan", "Proposal", "#/pilot"], ["Demo script (10 scenarios)", "Proposal", "#/demo-script"],
    ];
    const imo = {};
    Object.values(D.customers).forEach((cu) => cu.fleet.forEach((v) => { imo[v.vessel] = v.imo; }));
    D.cases.forEach((c) => items.push([`${c.id} · ${c.vessel}${imo[c.vessel] ? ` (IMO ${imo[c.vessel]})` : ""} · ${c.customer}`, c.stage, `#/case/${c.id}`]));
    Object.entries(D.suppliers).forEach(([id, s]) => items.push([s.name, "Supplier", `#/suppliers/${id}`]));
    Object.entries(D.customers).forEach(([id, c]) => items.push([c.name, "Customer", `#/customers/${id}`]));
    D.products.forEach((p) => items.push([`${p.name} · IMPA ${p.impa} · ${p.aliases.join(", ")}`, "Product", `#/products/${p.id}`]));
    C.lines.forEach((l) => items.push([`L${l.n} ${l.desc} · ${l.pn}`, "Line · GS-RFQ-0142", `#/case/${C.id}/lines`]));
    return items;
  }
  function openPalette(prefill = "") {
    openDialog({
      title: "Go to… <span class='kbd'>Ctrl K</span>",
      body: `<input class="pal-input" id="pal-q" type="search" placeholder="Case, vessel, IMO, supplier, product, part no., page…" value="${esc(prefill)}" data-autofocus aria-controls="pal-list"><ul class="pal-list" id="pal-list" role="listbox"></ul>`,
      actions: [{ label: "Close", value: "cancel" }],
    });
    const all = paletteItems();
    const draw = () => {
      const q = $("#pal-q").value.toLowerCase().trim();
      const res = all.filter(([t, k]) => !q || `${t} ${k}`.toLowerCase().includes(q)).slice(0, 14);
      $("#pal-list").innerHTML = res.map(([t, k, h], i) => `<li><a href="${h}" role="option" aria-selected="${i === 0}" data-pal>${esc(t)}<small>${esc(k)}</small></a></li>`).join("") || `<li class="empty small">No match</li>`;
    };
    $("#pal-q").addEventListener("input", draw);
    $("#pal-q").addEventListener("keydown", (e) => {
      const links = [...document.querySelectorAll("#pal-list a")];
      const cur = links.findIndex((a) => a.getAttribute("aria-selected") === "true");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const nx = Math.max(0, Math.min(links.length - 1, cur + (e.key === "ArrowDown" ? 1 : -1)));
        links.forEach((a, i) => a.setAttribute("aria-selected", i === nx));
        links[nx]?.scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter") { e.preventDefault(); const a = links[cur]; if (a) { location.hash = a.getAttribute("href"); $("#dialog").close("cancel"); } }
    });
    $("#pal-list").addEventListener("click", (e) => { if (e.target.closest("a[data-pal]")) $("#dialog").close("cancel"); });
    draw();
  }
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
  });

  /* ---------------- global controls ---------------- */
  function initChrome() {
    $("#role").addEventListener("change", (e) => { state.role = e.target.value; toast(`Now viewing as ${me().name}`, "👤"); render(); });
    $("#global-search").addEventListener("focus", (e) => { e.target.blur(); openPalette(); });
    $("#palette-btn").addEventListener("click", () => openPalette());
    const applyTheme = (t) => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
    try { applyTheme(localStorage.getItem("gs-theme")); } catch {}
    $("#theme-toggle").addEventListener("click", () => {
      const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      const next = dark ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("gs-theme", next); } catch {}
    });
  }

  function start() { initChrome(); render(); }

  return {
    D, C, NOW, MIN_MARGIN, state, views, actions, PRESETS, setPreset, atLeast,
    h: { $, esc, num, egp, usd, money, fmtDate, until, chip, who, conf, confClass, sup, seg, ai, flag, me, can, daysToEta },
    m: { line, offerKey, findOffer, reqBase, offerTotalEGP, perBaseEGP, coverage, isExpired, offerFlags, usable, bestOffer, selParts, splitCost, lineStatus, pricing },
    toast, openDialog, runAI, log, render, parse, openPalette, start,
    val: (form, name) => form.querySelector(`[name="${name}"]`)?.value ?? "",
  };
})();
