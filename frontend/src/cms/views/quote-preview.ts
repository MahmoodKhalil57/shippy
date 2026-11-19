import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type View, type ViewBlock } from "../../app/view/schema.ts";
import type { QuotePaper } from "../components/quote-paper.ts";
import { commercialEndpoints, type QuoteView } from "../endpoints/commercial.ts";
import { egp, pct } from "../endpoints/insights-shared.ts";
import { bodyOf, failWith, forward } from "./forward.ts";

/**
 * Quotation tab "Preview & send" (/collections/quotations/:id/preview): the quotation as Golden
 * Sea's customer receives it, in their own layout: EGP or the quote currency (`?currency=EGP`),
 * English or Arabic, right-to-left (`?lang=ar`), versions (older ones superseded, kept for
 * audit) and decision states. Actions follow the rules: request approval, approve / return
 * (management only), send (a draft email someone confirms), revise, record the customer's
 * decision, print, and the AI portal-submission check. Data: /api/commercial/quotations/:id/*.
 */

type Lang = "en" | "ar";
interface Line {
  lineNo?: number;
  partNo?: string;
  description?: string;
  unit?: string;
  qty?: number;
  unitPrice?: number;
}
interface PortalRow {
  field: string;
  portal: string;
  quote: string;
  matches: boolean;
}

/** The customer-facing wording, in both languages. */
const T = {
  en: {
    title: "QUOTATION",
    no: "Quotation No.",
    ref: "Your ref",
    date: "Date",
    client: "Client Information",
    company: "Company",
    attention: "Attention",
    vessel: "Vessel",
    port: "Delivery port",
    intro: "We are pleased to furnish our quotation as below:",
    s: "S.",
    part: "Part Number",
    desc: "Description",
    uom: "UOM",
    qty: "QTY",
    price: (c: string) => `Price/${c}`,
    total: (c: string) => `Total/${c}`,
    grand: (c: string) => `Total in ${c}`,
    discount: (p: number) => `Less discount ${p}%`,
    remarks: "Remarks:",
    delivery: (port: string, eta: string) => `Delivery: on board at ${port} on arrival (${eta}).`,
    vat: "Prices are exclusive of Value Added Tax (VAT).",
    qtyRule: "QTY in the quote can’t be reduced; prices are based on the QTY listed.",
    valid: (d: string) => `Valid until ${d}; may be renewed thereafter upon mutual agreement.`,
    pay: (t: string) => `Payment terms: ${t}.`,
    wish: "Wish our offer wins your approvals ☺",
    prepared: "Prepared by",
    approved: "Approved by",
    brand: "FOR TRADING & MARKETING · EST. 2011",
    draft: (v: number) => `DRAFT — not yet approved. Will be issued as version ${v}.`,
  },
  ar: {
    title: "عرض سعر",
    no: "رقم العرض",
    ref: "مرجعكم",
    date: "التاريخ",
    client: "بيانات العميل",
    company: "الشركة",
    attention: "عناية",
    vessel: "السفينة",
    port: "ميناء التسليم",
    intro: "يسعدنا أن نقدم لكم عرض أسعارنا كما يلي:",
    s: "م",
    part: "رقم القطعة",
    desc: "الوصف",
    uom: "الوحدة",
    qty: "الكمية",
    price: (c: string) => `السعر/${c}`,
    total: (c: string) => `الإجمالي/${c}`,
    grand: (c: string) => `الإجمالي بال${c}`,
    discount: (p: number) => `خصم ${p}%`,
    remarks: "ملاحظات:",
    delivery: (port: string, eta: string) => `التسليم: على متن السفينة في ${port} عند الوصول (${eta}).`,
    vat: "الأسعار لا تشمل ضريبة القيمة المضافة.",
    qtyRule: "لا يمكن تخفيض الكميات الواردة في العرض، والأسعار مبنية على الكميات المذكورة.",
    valid: (d: string) => `العرض سارٍ حتى ${d}، ويمكن تجديده بعد ذلك باتفاق الطرفين.`,
    pay: (t: string) => `شروط الدفع: ${t}.`,
    wish: "نتمنى أن ينال عرضنا موافقتكم ☺",
    prepared: "أعدّه",
    approved: "اعتمده",
    brand: "للتجارة والتسويق · تأسست 2011",
    draft: (v: number) => `مسودة — لم تُعتمد بعد. ستصدر كنسخة ${v}.`,
  },
};

const STEPS = ["Prepared", "Approval requested", "Approved", "Sent"];
const DECISIONS = ["Won", "Partially won", "Revision requested", "Lost"];
const WRITING = "formal shorter proofread translate";

const amount = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const day = (iso: string, time = false) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
        timeZone: "UTC",
      })
    : "—";

/* ---------------------------------------------------------------- the document */

function paper(v: QuoteView, lang: Lang, inEgp: boolean): QuotePaper {
  const q = v.quotation;
  const t = T[lang];
  const cur = inEgp ? "EGP" : String(q.currency ?? "USD");
  const rate = inEgp ? v.fx : 1;
  const d = inEgp ? 0 : 2;
  const lines = ((q.lines as Line[] | undefined) ?? []).map((l, i) => ({
    s: String(i + 1).padStart(2, "0"),
    partNo: l.partNo ?? "",
    description: l.description ?? "",
    unit: l.unit ?? "",
    qty: String(l.qty ?? ""),
    price: amount((l.unitPrice ?? 0) * rate, d),
    total: amount((l.qty ?? 0) * (l.unitPrice ?? 0) * rate, d),
    sum: (l.qty ?? 0) * (l.unitPrice ?? 0) * rate,
  }));
  const gross = lines.reduce((s, l) => s + l.sum, 0);
  const discount = Number(q.discountPct) || 0;
  const total = gross * (1 - discount / 100);
  const draft = !["Approved", "Submitted"].includes(String(q.status)) && q.status !== "Superseded";
  const created = new Date(String(q.createdAt ?? new Date().toISOString()));
  const ymd = `${String(created.getUTCDate()).padStart(2, "0")}/${String(created.getUTCMonth() + 1).padStart(2, "0")}/${created.getUTCFullYear()}`;
  return {
    lang,
    notices: [
      ...(draft ? [{ tone: "warning" as const, text: t.draft(Number(q.version) || 1) }] : []),
      ...(q.status === "Superseded"
        ? [{ tone: "info" as const, text: "Superseded — kept for audit. Not valid for ordering." }]
        : []),
    ],
    brand: t.brand,
    title: t.title,
    number: `${t.no}: ${q.number}`,
    ref: `${t.ref}: ${v.case.customerRef || "—"}`,
    date: `${t.date}: ${ymd}`,
    clientTitle: t.client,
    client: [
      { label: t.company, value: v.case.customer },
      { label: t.attention, value: `${v.case.attention}${v.case.email ? ` · ${v.case.email}` : ""}` },
      { label: t.vessel, value: `${v.case.vessel}${v.case.imo ? ` (IMO ${v.case.imo})` : ""}` },
      { label: t.port, value: `${v.case.port} · ETA ${day(v.case.eta, true)}` },
    ],
    intro: t.intro,
    columns: [
      { key: "s", label: t.s },
      { key: "partNo", label: t.part },
      { key: "description", label: t.desc },
      { key: "unit", label: t.uom },
      { key: "qty", label: t.qty },
      { key: "price", label: t.price(cur) },
      { key: "total", label: t.total(cur) },
    ],
    lines: lines.map(({ sum: _sum, ...l }) => l),
    discount: discount ? { label: t.discount(discount), value: `− ${amount(gross - total, d)}` } : undefined,
    total: { label: `${t.grand(cur)} (excl. VAT)`, value: amount(total, d) },
    fxNote: inEgp ? `Converted at ${q.currency}/EGP ${v.fx.toFixed(2)} (approved rate on the quotation).` : undefined,
    remarksTitle: t.remarks,
    remarks: [
      t.delivery(v.case.port, day(v.case.eta)),
      t.vat,
      t.qtyRule,
      t.valid(day(String(q.validUntil ?? ""))),
      t.pay(String(q.paymentTerms ?? "—")),
      ...(q.remarks ? String(q.remarks).split("\n") : []),
    ],
    wish: t.wish,
    prepared: `${t.prepared}: ${v.preparedBy || "—"}${v.approvedBy ? ` · ${t.approved}: ${v.approvedBy}` : ""}`,
    signature: v.approvedBy ? `${v.approvedBy} — authorised signature` : "Signature on approval",
    contact: ["+20 10 0000 0000 · Sales@goldensea.com.eg", "6th of October City, Giza Governorate · demo document"],
  };
}

/* ---------------------------------------------------------------- the frame around it */

function actions(v: QuoteView, me: string): Action[] {
  const q = v.quotation;
  const id = encodeURIComponent(q.id);
  const data = `/commercial/quotations/${id}`;
  const own = `/views/quote-preview/${id}`;
  const out: Action[] = [];
  if (v.can.requestApproval)
    out.push({
      label: "Request approval",
      variant: "filled",
      call: { path: `${data}/request-approval` },
      done: "Approval requested from Karim Balbaa.",
    });
  if (v.can.approve && v.approvalId) {
    const decide = `/commercial/approvals/${encodeURIComponent(v.approvalId)}/decide`;
    out.push(
      {
        label: "Return",
        tone: "error",
        call: { path: decide, body: { decision: "Reject" } },
        confirm: {
          heading: `Return ${q.number}`,
          text: `Return ${q.number} to the preparer. A reason is required and goes on the case timeline.`,
          label: "Return",
          tone: "error",
        },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: "Reason",
            required: true,
            admin: { placeholder: "e.g. Re-check line 3 — margin too thin for a new supplier" },
          },
        ],
        assist: { field: "reason", tools: WRITING },
        done: "Returned to the preparer with your reason.",
      },
      {
        label: "Approve",
        variant: "filled",
        call: { path: decide, body: { decision: "Approve" } },
        confirm: {
          heading: `Approve ${q.number}`,
          text: [
            `Approve ${q.number} (${q.currency} ${amount(Number(q.totalExVat) || 0)} excl. VAT)${v.internal?.marginPct !== undefined ? ` at ${pct(v.internal.marginPct)} margin` : ""}. It can then be sent to the customer.`,
            ...(v.internal?.exceptions ? ["", v.internal.exceptions] : []),
          ].join("\n"),
          label: "Approve",
        },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: "Comment (optional)",
            admin: { placeholder: "e.g. OK — confirm the launch cost before sending" },
          },
        ],
        assist: { field: "reason", tools: WRITING },
        done: "Approved — the quotation can be sent.",
      },
    );
  }
  if (v.can.send) {
    const portal = Boolean(v.case.portal && /portal/i.test(v.case.portal) && !/Nordvik/.test(v.case.customer));
    out.push({
      label: "Send to customer",
      variant: "filled",
      call: { path: `${own}/send`, body: { to: v.case.email } },
      confirm: {
        heading: `Send ${q.number}`,
        text: [
          "AI draft · Nothing is sent until you confirm.",
          "",
          `Email from Odoo — To: ${v.case.email || "customer"} · Subject: Quotation ${q.number} — ${v.case.vessel} — ref. ${v.case.customerRef} · Attachment: ${q.number}.pdf`,
          `Customer portal — enter the quotation in ${v.case.portal || "the customer's portal"}, then upload the confirmation screenshot below — the submission is only complete when it matches the approved quote.`,
        ].join("\n"),
        label: "Send",
      },
      fields: [
        {
          type: "radio",
          name: "method",
          label: "Submission method",
          defaultValue: portal ? "portal" : "email",
          options: [
            { value: "email", label: "Email from Odoo" },
            { value: "portal", label: "Customer portal" },
          ],
        },
        {
          type: "textarea",
          name: "message",
          label: "Message",
          admin: { rows: 9 },
          defaultValue: [
            `Dear ${v.case.attention},`,
            "",
            `Please find attached our quotation ${q.number} for ${v.case.vessel} (your ref. ${v.case.customerRef || "—"}), delivery on board at ${v.case.port}.`,
            `Valid until ${day(String(q.validUntil ?? ""))}. Prices exclude VAT.`,
            "",
            "Best regards,",
            me,
            "Golden Sea for Trading & Marketing",
          ].join("\n"),
        },
      ],
      assist: { field: "message", tools: WRITING },
      reply: true,
    });
  }
  if (v.can.decide)
    out.push({
      label: "Record customer decision",
      call: { path: `${own}/decision` },
      confirm: {
        heading: "Customer decision",
        text: `The customer's decision on ${q.number}. No response never means lost.`,
        label: "Record",
      },
      fields: [
        {
          type: "radio",
          name: "decision",
          label: "Decision",
          defaultValue: "Won",
          options: DECISIONS.map((d) => ({ value: d, label: d })),
        },
        {
          type: "textarea",
          name: "note",
          label: "Note (the lost reason, if lost)",
          admin: { placeholder: "e.g. PO NSM-PO-77231 received for lines 1–3" },
        },
      ],
      assist: { field: "note", tools: WRITING },
      reply: true,
    });
  if (v.can.revise)
    out.push({
      label: "Create revision",
      call: { path: `${own}/revise` },
      confirm: {
        heading: `Revise ${q.number}`,
        text: `Creates version ${(v.versions.at(-1)?.version ?? 1) + 1} as a draft with the same lines; ${q.number} is kept for audit and marked superseded.`,
        label: "Create revision",
      },
      fields: [
        {
          type: "textarea",
          name: "reason",
          label: "What changes",
          admin: { placeholder: "e.g. Customer asked for ESAB on line 1" },
        },
      ],
      assist: { field: "reason", tools: WRITING },
      reply: true,
    });
  out.push({ label: "Print", variant: "text", print: true });
  return out;
}

function status(v: QuoteView, me: string): ViewBlock {
  const q = v.quotation;
  const sub = q.submission;
  const said = [q.decision, sub?.submittedAt ? `sent ${day(sub.submittedAt, true)} via ${sub.method}` : ""]
    .filter(Boolean)
    .join(" · ");
  return block("card", {
    heading: "Decision state",
    actions: actions(v, me),
    blocks: [
      block("steps", {
        current: v.step,
        items: [...STEPS.map((label) => ({ label })), { label: v.step === 4 ? v.stepLabel : "Customer decision" }],
      }),
      block("tags", { items: [{ label: q.number, tone: "primary" }, { label: q.status }] }),
      ...(said ? [block("text", { muted: true, text: said })] : []),
      ...(v.approvals.length
        ? [
            block("list", {
              items: v.approvals.map((a) => ({ headline: `${a.type}: ${a.progress}`, dot: a.tone })),
            }),
          ]
        : []),
      ...(v.why.approve && v.approvalId && !v.can.approve
        ? [block("text", { muted: true, variant: "body-sm", text: v.why.approve })]
        : []),
    ],
  });
}

function portalCard(v: QuoteView): ViewBlock[] {
  const rows = (v.quotation.submission?.portalCheck as PortalRow[] | undefined) ?? [];
  if (!v.can.portalCheck && !rows.length) return [];
  const diffs = rows.filter((r) => !r.matches);
  return [
    block("card", {
      heading: "Portal submission check",
      tags: [{ label: "AI check", tone: "primary", icon: "sparkles" }],
      blocks: [
        block("text", {
          muted: true,
          text: "For customers who buy through a procurement portal: upload the confirmation screenshot and the AI compares it with the approved quotation. The submission is complete only when every field matches.",
        }),
        ...(rows.length
          ? [
              block("table", {
                columns: [
                  { key: "field", label: "Field" },
                  { key: "portal", label: "Portal" },
                  { key: "quote", label: "Approved quote" },
                  { key: "matches", label: "" },
                ],
                rows: rows.map((r) => ({
                  field: r.field,
                  portal: r.portal,
                  quote: r.quote,
                  matches: r.matches
                    ? { text: "Match", tone: "success", tag: true }
                    : { text: "Difference", tone: "error", tag: true },
                })),
              }),
              diffs.length
                ? block("alert", {
                    tone: "warning",
                    text: `Not marked complete: ${diffs.map((r) => r.field.toLowerCase()).join(", ")} differ. Correct it in the portal or record the customer's agreement.`,
                  })
                : block("alert", { tone: "success", text: "All fields match — submission complete." }),
            ]
          : []),
        block("actions", {
          items: [
            {
              label: rows.length ? "Check again" : "Upload screenshot & compare",
              call: { path: `/commercial/quotations/${encodeURIComponent(v.quotation.id)}/portal-check` },
            },
          ],
        }),
      ],
    }),
  ];
}

export function quotePreviewView(v: QuoteView, opts: { lang: Lang; egp: boolean; me: string }): View {
  const q = v.quotation;
  const versions = block("card", {
    heading: "Versions",
    blocks: [
      block("list", {
        items: v.versions.map((x) => ({
          headline: x.number,
          href: `/collections/quotations/${x.id}/preview`,
          selected: x.id === q.id,
          tags: [
            {
              label: `${x.status}${x.status === "Superseded" ? " · kept for audit" : ""}`,
              tone:
                x.status === "Superseded"
                  ? ("neutral" as const)
                  : x.status === "Approved" || x.status === "Submitted"
                    ? ("success" as const)
                    : ("warning" as const),
            },
          ],
          trailing: `${q.currency} ${amount(x.totalExVat)}`,
        })),
      }),
    ],
  });
  const i = v.internal;
  const internal = i
    ? [
        block("card", {
          heading: "Internal — never printed",
          actions: v.case.id
            ? [{ label: "Pricing", variant: "text", href: `/collections/cases/${v.case.id}/pricing` }]
            : undefined,
          blocks: [
            block("details", {
              items: [
                { label: "Landed cost", value: egp(i.landedCostEGP ?? 0) },
                { label: "Gross profit", value: egp(i.grossProfitEGP ?? 0) },
                {
                  label: "Margin",
                  value: {
                    text: `${pct(i.marginPct ?? 0)} (minimum ${v.minMarginPct}%)`,
                    tone: (i.marginPct ?? 0) < v.minMarginPct ? "warning" : "success",
                  },
                },
              ],
            }),
            ...(i.exceptions ? [block("text", { muted: true, variant: "body-sm", text: i.exceptions })] : []),
          ],
        }),
      ]
    : [];
  return {
    blocks: [
      status(v, opts.me),
      block("grid", {
        fit: "sm",
        blocks: [
          block("choice", {
            param: "currency",
            label: "Currency",
            value: opts.egp ? "EGP" : "quote",
            options: [
              { value: "quote", label: q.currency },
              { value: "EGP", label: "EGP" },
            ],
          }),
          block("choice", {
            param: "lang",
            label: "Language",
            value: opts.lang,
            options: [
              { value: "en", label: "English" },
              { value: "ar", label: "العربية" },
            ],
          }),
          block("text", {
            muted: true,
            variant: "body-sm",
            text: "Customer-facing: supplier names, costs and margins are never printed.",
          }),
        ],
      }),
      block("custom", { element: "gs-quote-paper", props: { paper: paper(v, opts.lang, opts.egp) } }),
      block("grid", { fit: "md", blocks: [versions, ...internal, ...portalCard(v)] }),
    ],
  };
}

/* ---------------------------------------------------------------- endpoints */

const load = (req: PayloadRequest) =>
  forward<QuoteView>(req, commercialEndpoints, "/commercial/quotations/:id", {
    params: { id: String(req.routeParams?.id) },
  });

/** A quotation action (POST /api/commercial/quotations/:id/<action>) as this request. */
const act = <T>(req: PayloadRequest, action: string, body: Record<string, unknown>) =>
  forward<T>(req, commercialEndpoints, "/commercial/quotations/:id/:action", {
    params: { id: String(req.routeParams?.id), action },
    body,
  });

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/quote-preview/:id?currency=EGP&lang=ar: the "Preview & send" tab as a View.
    path: "/views/quote-preview/:id",
    method: "get",
    handler: async (req) => {
      const v = await load(req);
      if (v instanceof Response) return v;
      const query = (req.query ?? {}) as Record<string, unknown>;
      const me = (req.user as { name?: unknown } | null)?.name;
      return Response.json(
        quotePreviewView(v, {
          lang: query.lang === "ar" ? "ar" : "en",
          egp: query.currency === "EGP",
          me: typeof me === "string" ? me : "",
        }),
      );
    },
  },
  {
    path: "/views/quote-preview/:id/send",
    method: "post",
    handler: async (req) => {
      const b = await bodyOf(req);
      const portal = b.method === "portal";
      const r = await act<QuoteView>(req, "send", { method: portal ? "portal" : "email", to: b.to });
      if (r instanceof Response) return r;
      const number = r.quotation.number;
      return Response.json({
        message: portal
          ? `${number} marked as entered in the portal.`
          : `${number} sent to ${typeof b.to === "string" ? b.to : ""}.`,
      });
    },
  },
  {
    path: "/views/quote-preview/:id/decision",
    method: "post",
    handler: async (req) => {
      const b = await bodyOf(req);
      const decision = typeof b.decision === "string" ? b.decision : "";
      const note = typeof b.note === "string" ? b.note.trim() : "";
      if (decision === "Lost" && !note) return failWith("Give the lost reason.");
      const r = await act(req, "decision", { decision, note });
      return r instanceof Response ? r : Response.json({ message: `Decision recorded: ${decision}.` });
    },
  },
  {
    // A new version; the person goes to its preview.
    path: "/views/quote-preview/:id/revise",
    method: "post",
    handler: async (req) => {
      const r = await act<{ id: string }>(req, "revise", { reason: (await bodyOf(req)).reason });
      if (r instanceof Response) return r;
      return Response.json({
        message: "New version created — the previous one is kept for audit.",
        href: `/collections/quotations/${r.id}/preview`,
      });
    },
  },
];
