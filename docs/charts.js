/* Tiny dependency-free SVG charts for the demo.
   Palette: validated categorical slots 1–3 (blue, orange, aqua), sequential blue ramp,
   reserved status colours. Every chart: hover/focus tooltip, legend for ≥2 series,
   direct labels, and a table view (relief for the sub-3:1 aqua on light surfaces). */
window.Viz = (() => {
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const W = 640;
  const nice = (max) => { if (max <= 0) return 1; const p = 10 ** Math.floor(Math.log10(max)); const n = max / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
  /** evenly spaced ticks with a clean step (1 / 2 / 2.5 / 5 × 10^k) */
  const ticks = (max) => {
    for (const ok of [[1, 2, 5, 10], [2.5]]) for (const n of [4, 5, 3, 6, 2, 8]) {
      const step = max / n, norm = step / 10 ** Math.floor(Math.log10(step));
      if (ok.some((x) => Math.abs(norm - x) < 1e-9)) return Array.from({ length: n + 1 }, (_, i) => step * i);
    }
    return Array.from({ length: 5 }, (_, i) => (max / 4) * i);
  };
  /** tooltip payload: title + rows [[label, value, slot?]] → data attribute */
  const tip = (title, rows) => `data-tip="${esc(JSON.stringify({ t: title, r: rows }))}" tabindex="0"`;
  const slot = (i) => `var(--s${i + 1})`;

  function legend(series) {
    if (series.length < 2) return "";
    return `<div class="viz-legend">${series.map((s, i) => `<span><i style="background:${s.color || slot(i)}"></i>${esc(s.name)}</span>`).join("")}</div>`;
  }
  function table(headers, rows) {
    return `<details class="viz-table"><summary>Table view</summary><div class="table-wrap"><table class="data"><thead><tr>${headers.map((h, i) => `<th class="${i ? "num" : ""}">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="${i ? "num" : ""}">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`;
  }
  /** bar with rounded data-end only (4px), anchored to baseline */
  function vbar(x, y, w, h, r = 4) {
    if (h <= 0) return "";
    r = Math.min(r, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  }
  function hbar(x, y, w, h, r = 4) {
    if (w <= 0) return "";
    r = Math.min(r, h / 2, w);
    return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  }

  /* ---------------- line chart (≤3 series, one axis) ---------------- */
  function line({ x, series, fmt = (v) => v, height = 220, target, yMax, label }) {
    const L = 44, R = 96, T = 12, B = 26, H = height;
    const iw = W - L - R, ih = H - T - B;
    const max = yMax || nice(Math.max(...series.flatMap((s) => s.values), target?.value || 0) * 1.08);
    const X = (i) => L + (x.length === 1 ? iw / 2 : (iw * i) / (x.length - 1));
    const Y = (v) => T + ih - (v / max) * ih;
    const grid = ticks(max).map((t) => `<line class="viz-grid" x1="${L}" x2="${L + iw}" y1="${Y(t)}" y2="${Y(t)}"/><text class="viz-axis" x="${L - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(fmt(t))}</text>`).join("");
    const xl = x.map((d, i) => (x.length <= 8 || i % Math.ceil(x.length / 8) === 0 || i === x.length - 1) ? `<text class="viz-axis" x="${X(i)}" y="${H - 6}" text-anchor="middle">${esc(d)}</text>` : "").join("");
    const paths = series.map((s, si) => `<path d="${s.values.map((v, i) => `${i ? "L" : "M"}${X(i)},${Y(v)}`).join("")}" fill="none" stroke="${s.color || slot(si)}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? 'stroke-dasharray="5 4"' : ""}/>`).join("");
    // direct labels at line end, nudged apart
    const ends = series.map((s, si) => ({ y: Y(s.values[s.values.length - 1]), s, si })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
    const labels = ends.map(({ y, s, si }) => `<line x1="${L + iw + 6}" x2="${L + iw + 16}" y1="${y}" y2="${y}" stroke="${s.color || slot(si)}" stroke-width="2"/><text class="viz-label" x="${L + iw + 20}" y="${y + 4}">${esc(s.name)} ${esc(fmt(s.values[s.values.length - 1]))}</text>`).join("");
    const tgt = target ? `<line class="viz-target" x1="${L}" x2="${L + iw}" y1="${Y(target.value)}" y2="${Y(target.value)}"/><text class="viz-axis" x="${L + 4}" y="${Y(target.value) - 5}">${esc(target.label)}</text>` : "";
    const step = x.length > 1 ? iw / (x.length - 1) : iw;
    const cols = x.map((d, i) => `<g class="viz-col" ${tip(d, series.map((s, si) => [s.name, fmt(s.values[i]), si]))}>
        <rect x="${X(i) - step / 2}" y="${T}" width="${step}" height="${ih}" fill="transparent"/>
        <line class="viz-cross" x1="${X(i)}" x2="${X(i)}" y1="${T}" y2="${T + ih}"/>
        ${series.map((s, si) => `<circle class="viz-dot" cx="${X(i)}" cy="${Y(s.values[i])}" r="4.5" fill="${s.color || slot(si)}"/>`).join("")}</g>`).join("");
    return `${legend(series)}<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || series.map((s) => s.name).join(", "))}">${grid}${tgt}${paths}${labels}${xl}${cols}</svg>
      ${table(["", ...series.map((s) => s.name)], x.map((d, i) => [d, ...series.map((s) => fmt(s.values[i]))]))}`;
  }

  /* ---------------- vertical bars (single series or grouped ≤3) ---------------- */
  function bars({ x, series, fmt = (v) => v, height = 220, label, highlightLast }) {
    const L = 44, R = 12, T = 18, B = 26, H = height;
    const iw = W - L - R, ih = H - T - B;
    const max = nice(Math.max(...series.flatMap((s) => s.values)) * 1.08);
    const Y = (v) => T + ih - (v / max) * ih;
    const band = iw / x.length, gap = 2, n = series.length;
    const bw = Math.min(34, (band * 0.62 - gap * (n - 1)) / n);
    const grid = ticks(max).map((t) => `<line class="viz-grid" x1="${L}" x2="${L + iw}" y1="${Y(t)}" y2="${Y(t)}"/><text class="viz-axis" x="${L - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(fmt(t))}</text>`).join("");
    const marks = x.map((d, i) => {
      const gx = L + band * i + (band - (bw * n + gap * (n - 1))) / 2;
      return `<g class="viz-hit" ${tip(d, series.map((s, si) => [s.name, fmt(s.values[i]), si]))}><rect x="${L + band * i}" y="${T}" width="${band}" height="${ih}" fill="transparent"/>
        ${series.map((s, si) => { const v = s.values[i]; const y = Y(v); const op = highlightLast && n === 1 && i < x.length - 1 ? ' opacity="0.55"' : ""; return `<path d="${vbar(gx + si * (bw + gap), y, bw, T + ih - y)}" fill="${s.color || slot(si)}"${op}/>`; }).join("")}
        <text class="viz-axis" x="${L + band * i + band / 2}" y="${H - 6}" text-anchor="middle">${esc(d)}</text></g>`;
    }).join("");
    const lastLbl = n === 1 ? (() => { const i = x.length - 1, v = series[0].values[i]; return `<text class="viz-label" x="${L + band * i + band / 2}" y="${Y(v) - 6}" text-anchor="middle">${esc(fmt(v))}</text>`; })() : "";
    return `${legend(series)}<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || "")}"><line class="viz-base" x1="${L}" x2="${L + iw}" y1="${T + ih}" y2="${T + ih}"/>${grid}${marks}${lastLbl}</svg>
      ${table(["", ...series.map((s) => s.name)], x.map((d, i) => [d, ...series.map((s) => fmt(s.values[i]))]))}`;
  }

  /* ---------------- horizontal bars (ranking, single series) ---------------- */
  function hbars({ rows, fmt = (v) => v, label, color = "var(--s1)", max: forcedMax, refLine }) {
    const rowH = 30, L = 170, R = 70, T = 6;
    const H = T + rows.length * rowH + 4;
    const iw = W - L - R;
    const max = forcedMax || Math.max(...rows.map((r) => r[1])) * 1.02;
    const marks = rows.map(([lab, v, sub, c], i) => {
      const y = T + i * rowH, w = (v / max) * iw;
      return `<g class="viz-hit" ${tip(lab, [[sub || "Value", fmt(v), c ? null : 0]])}><rect x="0" y="${y}" width="${W}" height="${rowH}" fill="transparent"/>
        <text class="viz-label" x="${L - 10}" y="${y + 19}" text-anchor="end">${esc(lab)}</text>
        <path d="${hbar(L, y + 7, Math.max(w, 2), 16)}" fill="${c || color}"/>
        <text class="viz-label" x="${L + w + 6}" y="${y + 19}">${esc(fmt(v))}</text></g>`;
    }).join("");
    const ref = refLine ? `<line class="viz-target" x1="${L + (refLine.value / max) * iw}" x2="${L + (refLine.value / max) * iw}" y1="${T}" y2="${H - 4}"/><text class="viz-axis" x="${L + (refLine.value / max) * iw + 4}" y="${H - 2}">${esc(refLine.label)}</text>` : "";
    return `<svg class="viz" viewBox="0 0 ${W} ${H + (refLine ? 10 : 0)}" role="img" aria-label="${esc(label || "")}">${marks}${ref}</svg>${table(["", "Value"], rows.map((r) => [r[0], fmt(r[1])]))}`;
  }

  /* ---------------- 100% / absolute stacked horizontal bars ---------------- */
  function stacked({ rows, keys, colors, fmt = (v) => v, label, percent = false }) {
    const rowH = 34, L = 150, R = 70, T = 4;
    const H = T + rows.length * rowH;
    const iw = W - L - R;
    const totals = rows.map((r) => r[1].reduce((a, b) => a + b, 0));
    const max = percent ? 1 : Math.max(...totals);
    const marks = rows.map(([lab, vals], i) => {
      const y = T + i * rowH; let x = L; const tot = totals[i];
      const segs = vals.map((v, k) => {
        const w = ((percent ? v / tot : v) / max) * iw; const sx = x; x += w;
        if (w <= 0) return "";
        const isLast = vals.slice(k + 1).every((z) => !z);
        const d = isLast ? hbar(sx, y + 8, Math.max(w - 2, 1), 18) : `M${sx},${y + 8}h${Math.max(w - 2, 1)}v18h${-Math.max(w - 2, 1)}Z`;
        return `<path d="${d}" fill="${colors[k]}"/>`;
      }).join("");
      return `<g class="viz-hit" ${tip(lab, keys.map((k, j) => [k, fmt(vals[j]) + (percent ? ` (${Math.round((vals[j] / tot) * 100)}%)` : ""), null, colors[j]]))}><rect x="0" y="${y}" width="${W}" height="${rowH}" fill="transparent"/>
        <text class="viz-label" x="${L - 10}" y="${y + 21}" text-anchor="end">${esc(lab)}</text>${segs}
        <text class="viz-label" x="${L + (percent ? iw : (tot / max) * iw) + 6}" y="${y + 21}">${esc(fmt(tot))}</text></g>`;
    }).join("");
    return `<div class="viz-legend">${keys.map((k, i) => `<span><i style="background:${colors[i]}"></i>${esc(k)}</span>`).join("")}</div>
      <svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || "")}">${marks}</svg>${table(["", ...keys, "Total"], rows.map((r, i) => [r[0], ...r[1].map(fmt), fmt(totals[i])]))}`;
  }

  /* ---------------- funnel (ordinal blue ramp) ---------------- */
  function funnel({ stages, fmt = (v) => v, label }) {
    const rowH = 38, L = 170, R = 110, H = stages.length * rowH + 4;
    const iw = W - L - R, max = stages[0][1];
    const marks = stages.map(([lab, v], i) => {
      const w = (v / max) * iw, x = L + (iw - w) / 2, y = 2 + i * rowH;
      const conv = i ? Math.round((v / stages[i - 1][1]) * 100) + "% of previous" : "";
      return `<g class="viz-hit" ${tip(lab, [["Count", fmt(v), 0], ...(conv ? [["Step conversion", conv]] : []), ["Of first stage", Math.round((v / max) * 100) + "%"]])}><rect x="0" y="${y}" width="${W}" height="${rowH}" fill="transparent"/>
        <text class="viz-label" x="${L - 10}" y="${y + 23}" text-anchor="end">${esc(lab)}</text>
        <rect x="${x}" y="${y + 6}" width="${Math.max(w, 2)}" height="${rowH - 12}" rx="4" fill="var(--o${i + 1})"/>
        <text class="viz-label" x="${L + iw + 8}" y="${y + 23}">${esc(fmt(v))}${conv ? ` · ${esc(conv.split(" ")[0])}` : ""}</text></g>`;
    }).join("");
    return `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || "Funnel")}">${marks}</svg>${table(["Stage", "Count"], stages.map((s) => [s[0], fmt(s[1])]))}`;
  }

  /* ---------------- heatmap (sequential, 5 steps) ---------------- */
  function heatmap({ rows, cols, values, fmt = (v) => v, label }) {
    const L = 140, T = 22, cw = (W - L - 8) / cols.length, ch = 30;
    const H = T + rows.length * ch + 4;
    const all = values.flat(), max = Math.max(...all);
    const q = (v) => (v <= 0 ? 0 : Math.min(5, Math.ceil((v / max) * 5)));
    const head = cols.map((c, j) => `<text class="viz-axis" x="${L + cw * j + cw / 2}" y="14" text-anchor="middle">${esc(c)}</text>`).join("");
    const cells = rows.map((r, i) => `<text class="viz-label" x="${L - 10}" y="${T + ch * i + 19}" text-anchor="end">${esc(r)}</text>` + cols.map((c, j) => {
      const v = values[i][j], k = q(v);
      return `<g class="viz-hit" ${tip(`${r} · ${c}`, [["Value", fmt(v), 0]])}><rect x="${L + cw * j + 1}" y="${T + ch * i + 1}" width="${cw - 2}" height="${ch - 2}" rx="4" fill="var(--q${k})"/><text x="${L + cw * j + cw / 2}" y="${T + ch * i + 19}" text-anchor="middle" class="viz-cell" style="fill:var(--q${k}-ink)">${v ? esc(fmt(v)) : ""}</text></g>`;
    }).join("")).join("");
    return `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || "")}">${head}${cells}</svg>
      <div class="viz-legend viz-scale"><span>fewer</span>${[1, 2, 3, 4, 5].map((k) => `<i style="background:var(--q${k})"></i>`).join("")}<span>more</span></div>
      ${table(["", ...cols], rows.map((r, i) => [r, ...values[i].map(fmt)]))}`;
  }

  /* ---------------- scatter (single series, labelled points) ---------------- */
  function scatter({ points, xLabel, yLabel, xFmt = (v) => v, yFmt = (v) => v, label, xMax, yMin = 0, yMax = 100 }) {
    const L = 48, R = 20, T = 12, B = 40, H = 260, iw = W - L - R, ih = H - T - B;
    const mx = xMax || nice(Math.max(...points.map((p) => p.x)) * 1.1);
    const X = (v) => L + (v / mx) * iw, Y = (v) => T + ih - ((v - yMin) / (yMax - yMin)) * ih;
    const gy = ticks(yMax - yMin).map((t) => t + yMin);
    const grid = gy.map((t) => `<line class="viz-grid" x1="${L}" x2="${L + iw}" y1="${Y(t)}" y2="${Y(t)}"/><text class="viz-axis" x="${L - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(yFmt(t))}</text>`).join("")
      + ticks(mx).map((t) => `<text class="viz-axis" x="${X(t)}" y="${T + ih + 16}" text-anchor="middle">${esc(xFmt(t))}</text>`).join("");
    const dots = points.map((p) => `<g class="viz-hit" ${tip(p.name, [[yLabel, yFmt(p.y), 0], [xLabel, xFmt(p.x)]])}><circle cx="${X(p.x)}" cy="${Y(p.y)}" r="14" fill="transparent"/><circle class="viz-pt" cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" fill="${p.color || "var(--s1)"}"/><text class="viz-axis" x="${X(p.x) + 9}" y="${Y(p.y) + 4}">${esc(p.short || p.name)}</text></g>`).join("");
    return `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || "")}">${grid}<text class="viz-axis" x="${L + iw / 2}" y="${H - 4}" text-anchor="middle">${esc(xLabel)} →</text><text class="viz-axis" x="12" y="${T + ih / 2}" transform="rotate(-90 12 ${T + ih / 2})" text-anchor="middle">${esc(yLabel)} →</text>${dots}</svg>
      ${table(["Supplier", yLabel, xLabel], points.map((p) => [p.name, yFmt(p.y), xFmt(p.x)]))}`;
  }

  /* ---------------- sparkline (stat tile) ---------------- */
  function spark(values, { color = "var(--s1)", labelFmt = (v) => v, labels = [] } = {}) {
    const w = 120, h = 30, max = Math.max(...values), min = Math.min(...values);
    const X = (i) => 2 + (i * (w - 4)) / (values.length - 1), Y = (v) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
    const d = values.map((v, i) => `${i ? "L" : "M"}${X(i)},${Y(v)}`).join("");
    const last = values.length - 1;
    return `<svg class="viz-spark" viewBox="0 0 ${w} ${h}" aria-hidden="true" ${tip("Last " + values.length + " weeks", values.map((v, i) => [labels[i] || `W${i + 1}`, labelFmt(v), 0]).slice(-6))}><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${X(last)}" cy="${Y(values[last])}" r="3" fill="${color}"/></svg>`;
  }

  /* ---------------- shared tooltip ---------------- */
  let tipEl;
  function showTip(target, cx, cy) {
    let data; try { data = JSON.parse(target.getAttribute("data-tip")); } catch { return; }
    if (!tipEl) { tipEl = document.createElement("div"); tipEl.className = "viz-tip"; tipEl.setAttribute("role", "tooltip"); document.body.append(tipEl); }
    tipEl.replaceChildren();
    const t = document.createElement("div"); t.className = "viz-tip-t"; t.textContent = data.t; tipEl.append(t);
    for (const [lab, val, si, col] of data.r) {
      const row = document.createElement("div"); row.className = "viz-tip-r";
      const key = document.createElement("i"); key.style.background = col || (si == null ? "transparent" : `var(--s${si + 1})`);
      const v = document.createElement("b"); v.textContent = val;
      const l = document.createElement("span"); l.textContent = lab;
      row.append(key, v, l); tipEl.append(row);
    }
    tipEl.hidden = false;
    const r = tipEl.getBoundingClientRect();
    let x = cx + 14, y = cy + 14;
    if (x + r.width > innerWidth - 8) x = cx - r.width - 14;
    if (y + r.height > innerHeight - 8) y = cy - r.height - 14;
    tipEl.style.transform = `translate(${Math.max(8, x)}px, ${Math.max(8, y)}px)`;
  }
  const hide = () => { if (tipEl) tipEl.hidden = true; };
  document.addEventListener("pointermove", (e) => { const g = e.target.closest?.("[data-tip]"); g ? showTip(g, e.clientX, e.clientY) : hide(); });
  document.addEventListener("focusin", (e) => { const g = e.target.closest?.("[data-tip]"); if (g) { const b = g.getBoundingClientRect(); showTip(g, b.left + b.width / 2, b.top); } });
  document.addEventListener("focusout", hide);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
  document.addEventListener("scroll", hide, { passive: true });

  return { line, bars, hbars, stacked, funnel, heatmap, scatter, spark };
})();
