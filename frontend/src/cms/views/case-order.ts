import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type Cell, type Row, type View, type ViewBlock } from "../../app/view/schema.ts";
import { bodyOf, failWith } from "./forward.ts";
import { day, dayTime, loadOps, money, operation, person, statusTone, type CaseOps, type OpsPO } from "./o2c-shared.ts";

/**
 * Case tab "Order & purchasing" (/collections/cases/<id>/order): the customer's PO checked line
 * by line against the approved quotation version (commitment blocked until every mismatch has
 * written customer agreement), partial awards, the supplier POs (re-checked before confirming,
 * deposits through approval), supplier bills with the 3-way match and the duplicate-bill block,
 * drop-ship vs warehouse, and receipts with lots, expiry, QC and backorders.
 * Data: GET /api/operations/case/:id; writes: the POST endpoints in ../endpoints/operations.ts.
 */

const base = (d: CaseOps) => `/views/case-order/${encodeURIComponent(d.case.id)}`;
const plural = (n: number, one: string, many = `${one}es`) => (n === 1 ? one : many);

function tiles(d: CaseOps): ViewBlock {
  const po = d.customerPo;
  const confirmed = d.purchaseOrders.filter((p) => !["Draft", "Awaiting approval", "Cancelled"].includes(p.status));
  const ordered = d.receipts.reduce((s, r) => s + r.ordered, 0);
  const received = d.receipts.reduce((s, r) => s + r.received, 0);
  const held = d.bills.filter((b) => b.status === "On hold").length;
  return block("stats", {
    items: [
      {
        label: "Customer PO",
        value: po ? po.status : d.orderConfirmed ? "Validated" : "Not received",
        note: po
          ? `${po.number} vs ${po.quotation}`
          : d.orderConfirmed
            ? "Sales order confirmed"
            : "Waiting for the customer's order",
        tone: po ? (po.status === "Validated" ? "success" : "error") : d.orderConfirmed ? "success" : undefined,
      },
      {
        label: "Supplier POs confirmed",
        value: `${confirmed.length} of ${d.purchaseOrders.length}`,
        note: d.purchaseOrders.length ? "Re-checked before confirming" : "Prepared when the sales order is confirmed",
      },
      {
        label: "Received",
        value: ordered ? `${received} of ${ordered}` : "—",
        note: ordered && received < ordered ? `${ordered - received} on backorder` : "Units across all receipts",
        tone: ordered && received < ordered ? "warning" : undefined,
      },
      ...(d.canSeeCosts
        ? [
            {
              label: "Supplier bills",
              value: `${d.bills.length}`,
              note: held ? `${held} on hold — 3-way match` : "Matched to PO and receipt",
              tone: held ? ("error" as const) : undefined,
            },
          ]
        : []),
    ],
  });
}

function poCheck(d: CaseOps): ViewBlock {
  const po = d.customerPo;
  const readPo: Action = {
    label: "Read customer PO",
    variant: "filled",
    call: { path: `${base(d)}/po-check` },
    reply: true,
  };
  if (!po)
    return block("card", {
      heading: "Customer PO check",
      blocks: [
        d.orderConfirmed
          ? block("alert", {
              tone: "success",
              text: "The customer's PO was checked against the approved quotation and validated — the sales order is confirmed.",
            })
          : d.poExpected
            ? block("alert", {
                tone: "info",
                heading: "Nordvik's purchase order has just arrived by email.",
                text: "The AI reads it and checks every line and commercial term against the quotation version it refers to. Nothing is committed until a person resolves each mismatch.",
                actions: [readPo],
              })
            : block("text", {
                muted: true,
                text: "No customer PO yet. When it arrives it is checked here against the approved quotation version.",
              }),
      ],
    });

  const blocked = po.status !== "Validated";
  const rows: Row[] = po.checks.map((c) => ({
    line: { text: c.lineNo ? `L${c.lineNo}` : "Header", strong: true },
    field: c.field,
    po: c.po,
    quote: c.quote,
    result: c.matches
      ? { text: "Match", tone: "success", tag: true }
      : c.resolution
        ? { text: "Amendment recorded", tone: "success", tag: true }
        : { text: "Mismatch", tone: "error", tag: true },
    note: c.resolution ? `${c.resolution}${c.evidence ? " · evidence attached" : ""}` : "",
  }));
  const amendments: ViewBlock[] = po.checks.flatMap((c, i) =>
    c.matches || c.resolution
      ? []
      : [
          block("attach", {
            action: { label: "Record amendment", variant: "tonal" },
            text: `${c.lineNo ? `L${c.lineNo}` : "Header"} · ${c.field}`,
            heading: `Record customer amendment — line ${c.lineNo || "header"}`,
            intro: `${c.field} — PO: ${c.po} · Quotation: ${c.quote}`,
            fields: [
              {
                type: "textarea",
                name: "resolution",
                label: "Customer's written agreement",
                required: true,
                defaultValue: c.suggestion ?? "",
                admin: {
                  description: c.suggestion
                    ? "AI draft from the customer's email — check it before recording"
                    : "Who agreed, when and what",
                },
              },
            ],
            file: {
              name: "evidence",
              legend: "Evidence (email or signed amendment)",
              hint: "Optional in the demo — a copy of the customer's email is attached if you skip this",
              upload: {
                collection: "media",
                data: { alt: `${po.number} amendment, line ${c.lineNo}`, kind: "Customer PO" },
              },
              sample: {
                filename: `${po.number}-amendment-L${c.lineNo}.pdf`,
                lines: ["From: purchasing (customer)", `Re: ${po.number} line ${c.lineNo}`, "{resolution}"],
              },
            },
            call: { path: "/operations/po-amend", body: { po: po.id, index: i } },
            confirmLabel: "Record amendment & lift block",
            done: `Amendment recorded on line ${c.lineNo} — evidence attached.`,
          }),
        ],
  );

  return block("card", {
    heading: "Customer PO check",
    tags: [{ label: po.status, tone: statusTone(po.status) }],
    actions: [{ ...readPo, label: "Re-run PO check", variant: "text" }],
    blocks: [
      block("text", {
        muted: true,
        text: `${po.number} · received ${dayTime(po.receivedAt)} · matched to ${po.quotation} · billing entity ${po.billingEntity ?? "—"}`,
      }),
      block("tags", { items: [{ label: "AI check · 96%" }] }),
      block("table", {
        columns: [
          { key: "line", label: "Line" },
          { key: "field", label: "Checked" },
          { key: "po", label: "Customer PO" },
          { key: "quote", label: `Quotation ${po.quotation}` },
          { key: "result", label: "Result", supporting: "note" },
        ],
        rows,
      }),
      ...amendments,
      block("custom", {
        element: "ui-ai-check",
        props: {
          label: "Second look with AI",
          text: po.checks
            .map(
              (c) =>
                `${c.lineNo > 0 ? `Line ${c.lineNo}` : "Terms"} · ${c.field}: PO says "${c.po}", quotation ${po.quotation} says "${c.quote}"`,
            )
            .join("\n"),
          questions: [
            {
              id: "prices",
              prompt: "Are the prices on the customer's PO the same as on the quotation?",
              yes: "Prices match the quotation",
              no: "A price differs from the quotation",
            },
            {
              id: "items",
              prompt: "Are the items and quantities on the PO the same as on the quotation?",
              yes: "Items and quantities match",
              no: "An item or quantity differs",
            },
            {
              id: "terms",
              prompt: "Do the PO's commercial terms (payment, delivery, validity) match the quotation?",
              yes: "Terms match",
              no: "A term differs",
            },
          ],
        },
      }),
      blocked
        ? block("alert", {
            tone: "error",
            text: `Commitment blocked: ${po.openMismatches} ${plural(po.openMismatches, "mismatch")} need the customer's written agreement (or an approved exception) before the sales order and supplier POs.`,
          })
        : block("alert", {
            tone: "success",
            text: d.orderConfirmed
              ? "PO validated — sales order confirmed. Supplier POs follow below."
              : "PO validated — every mismatch has written customer agreement.",
          }),
      ...(d.orderConfirmed
        ? []
        : [
            block("actions", {
              items: [
                {
                  label: "Confirm sales order & prepare supplier POs",
                  variant: "filled",
                  disabled: blocked,
                  call: { path: `${base(d)}/confirm-order` },
                  reply: true,
                },
              ],
            }),
          ]),
    ],
  });
}

function partialAward(d: CaseOps): ViewBlock[] {
  const po = d.customerPo;
  if (!po) return [];
  const onPo = new Set(po.checks.filter((c) => c.lineNo > 0).map((c) => c.lineNo));
  const missing = d.lines.filter((l) => !onPo.has(l.lineNo));
  if (!missing.length) return [];
  const award = (lineNo: number, outcome: string, reason?: string) => ({
    path: "/operations/po-award",
    body: { po: po.id, lineNo, outcome, ...(reason ? { reason } : {}) },
  });
  return [
    block("card", {
      heading: "Partial award",
      blocks: [
        block("text", {
          muted: true,
          text: "Quoted lines the customer didn't order: they stay open for a revision or close with a reason — a partly awarded case never shows as complete.",
        }),
        block("list", {
          items: missing.map((l) => {
            const u = po.unawarded.find((x) => x.lineNo === l.lineNo);
            const actions: Action[] =
              u?.outcome === "Closed"
                ? []
                : [
                    ...(u
                      ? []
                      : [
                          {
                            label: "Keep open",
                            variant: "text" as const,
                            call: award(l.lineNo, "Open — revision to follow", "Revision to follow"),
                            done: `Line ${l.lineNo}: kept open for a revision.`,
                          },
                        ]),
                    {
                      label: "Close with reason",
                      variant: "tonal",
                      call: award(l.lineNo, "Closed"),
                      prompt: `Close line ${l.lineNo} (not awarded)`,
                      fields: [
                        {
                          type: "textarea",
                          name: "reason",
                          label: "Reason (kept on the case)",
                          required: true,
                          admin: {
                            placeholder: "e.g. Vessel bought it locally",
                            description: `L${l.lineNo} · ${l.description}. Common: Vessel bought it locally · Customer cancelled the item · Price not accepted`,
                          },
                        },
                      ],
                      done: `Line ${l.lineNo}: closed with reason.`,
                    },
                  ];
            return {
              headline: `L${l.lineNo} · ${l.description}`,
              supporting: u ? `${u.outcome}${u.reason ? ` — ${u.reason}` : ""}` : "Not on the customer's PO — decide",
              tags: [
                u
                  ? u.outcome === "Closed"
                    ? { label: "Closed", tone: "neutral" as const }
                    : { label: "Open — revision to follow", tone: "warning" as const }
                  : { label: "Undecided", tone: "error" as const },
              ],
              actions,
            };
          }),
        }),
      ],
    }),
  ];
}

/** The deposit and its payment state; a pending payment approval links to Cash. */
function depositCell(p: OpsPO): { main: Cell; note: Cell } {
  if (!p.depositPct) return { main: p.proforma ?? "No deposit", note: "" };
  const paid = (p.paid ?? 0) > 0;
  const due = p.balanceDue ? ` · Balance on delivery · ${day(p.balanceDue)}` : "";
  const text = `${p.depositPct}% · ${money(p.deposit, p.currency)}${p.proforma ? ` · ${p.proforma}` : ""}`;
  return {
    main: !paid && p.approval ? { text, href: "/cash" } : text,
    note: paid
      ? { text: `Deposit paid ${money(p.paid, p.currency)}${due}`, tone: "success" }
      : p.approval
        ? { text: `Payment approval: ${p.approval.status}${due}`, tone: statusTone(p.approval.status) }
        : { text: `Needs payment approval${due}`, tone: "warning" },
  };
}

function recheck(d: CaseOps, p: OpsPO): ViewBlock {
  if (!p.recheckDone)
    return block("list", {
      items: [
        {
          headline: `${p.number} · ${p.supplierName}`,
          supporting: p.status,
          dot: statusTone(p.status),
          actions: [
            {
              label: "Re-check & confirm",
              variant: "tonal",
              call: { path: "/operations/po-recheck", body: { po: p.id } },
              done: `Re-checked price, availability, FX and lead time with ${p.supplierName}.`,
            },
          ],
        },
      ],
    });
  const changed = p.recheck.filter((r) => r.ok === false);
  const decide: Action = d.isManagement
    ? {
        label: `Approve & confirm ${p.number}`,
        variant: "filled",
        call: {
          method: "PATCH",
          path: `/purchase-orders/${encodeURIComponent(p.id)}`,
          body: { status: "Confirmed", recheckDone: true },
        },
        done: `${p.number} confirmed — sent to ${p.supplierName}.`,
      }
    : {
        label: "Ask Karim Balbaa to approve",
        variant: "filled",
        call: { path: `${base(d)}/ask-approval`, body: { po: p.id } },
        done: `Approval requested from Karim Balbaa for ${p.number}.`,
      };
  return block("card", {
    variant: "outlined",
    heading: `Re-check before confirming ${p.number}`,
    tags: [{ label: p.status, tone: statusTone(p.status) }],
    blocks: [
      block("table", {
        columns: [
          { key: "item", label: "Item" },
          { key: "atQuotation", label: "At quotation" },
          { key: "now", label: "Now" },
          { key: "ok", label: "" },
        ],
        rows: p.recheck.map((r) => ({
          item: r.item,
          atQuotation: r.atQuotation,
          now: r.now,
          ok:
            r.ok === false
              ? { text: "Changed", tone: "warning", tag: true }
              : { text: "OK", tone: "success", tag: true },
        })),
      }),
      ...(changed.length
        ? [
            block("alert", {
              tone: "warning",
              text: `${changed.map((c) => `${c.item}: ${c.now}`).join(" · ")} — the shortfall is scheduled as a backorder (the customer promise stays as agreed).`,
            }),
          ]
        : []),
      ...(d.isManagement
        ? []
        : [block("text", { muted: true, text: "Supplier POs are confirmed by Karim Balbaa (management)." })]),
      block("actions", { items: [decide] }),
    ],
  });
}

function supplierPos(d: CaseOps): ViewBlock {
  const pos = d.purchaseOrders;
  const rows: Row[] = pos.map((p) => {
    const drop = /dropship/i.test(p.deliverTo ?? "");
    const dep = depositCell(p);
    const flagged = p.recheck.some((x) => x.ok === false);
    const statusNote = [
      p.acknowledgedAt ? `Acknowledged ${day(p.acknowledgedAt)}` : "",
      p.recheckDone ? `Re-checked${flagged ? " · change flagged" : ""}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    return {
      number: { text: p.number, href: `/collections/purchase-orders/${p.id}`, strong: true },
      supplier: p.supplierName,
      lines: p.lines
        .map(
          (l) =>
            `L${l.lineNo} · ${l.qty} × ${l.description}${d.canSeeCosts && l.unitPrice != null ? ` · ${money(l.unitPrice, p.currency)}` : ""}`,
        )
        .join("; "),
      route: {
        text: drop ? "Drop-ship to vessel" : `Warehouse · ${p.deliverTo ?? "—"}`,
        tone: drop ? "info" : "neutral",
        tag: true,
      },
      total: money(p.total, p.currency),
      deposit: dep.main,
      depositNote: dep.note,
      status: { text: p.status, tone: statusTone(p.status), tag: true },
      statusNote: { text: statusNote, tone: p.recheckDone && flagged ? "warning" : undefined },
    };
  });
  const toConfirm = d.canSeeCosts ? pos.filter((p) => ["Draft", "Awaiting approval"].includes(p.status)) : [];
  return block("card", {
    heading: "Supplier purchase orders",
    count: pos.length,
    blocks: [
      block("text", {
        muted: true,
        text: `Created from the confirmed sales order — split suppliers and scheduled quantities. Price, availability, FX and lead time are re-checked before a PO is confirmed; Karim Balbaa approves. Deposits go through payment approval.${d.canSeeCosts ? "" : " Supplier costs are hidden for Sales."}`,
      }),
      pos.length
        ? block("table", {
            columns: [
              { key: "number", label: "PO", supporting: "supplier" },
              { key: "lines", label: "Lines" },
              { key: "route", label: "Route" },
              ...(d.canSeeCosts
                ? [
                    { key: "total", label: "Amount", align: "end" as const },
                    { key: "deposit", label: "Pro forma · deposit", supporting: "depositNote" },
                  ]
                : []),
              { key: "status", label: "Status", supporting: "statusNote" },
            ],
            rows,
          })
        : block("alert", {
            tone: d.customerPo?.status === "Validated" ? "info" : "warning",
            text:
              d.customerPo?.status === "Validated"
                ? "Confirm the sales order to prepare the supplier POs."
                : "Blocked: no supplier PO is prepared until the customer's PO is validated.",
          }),
      ...toConfirm.map((p) => recheck(d, p)),
    ],
  });
}

function bills(d: CaseOps): ViewBlock[] {
  if (!d.canSeeCosts || !d.purchaseOrders.length) return [];
  const first = d.bills[0];
  const book: Action | undefined =
    d.canFinance && first
      ? {
          label: "Book incoming bill",
          variant: "tonal",
          call: { path: `${base(d)}/book-bill` },
          confirm: {
            heading: "Book incoming supplier bill",
            text: `Bill from ${first.supplierName} received by email: ${first.billNumber} · ${money(first.amount, first.currency)} · PO ${first.poNumber} — read by AI (confidence 98%).\nBooking checks the bill number against this supplier's bills first.`,
            label: "Book bill",
          },
          done: "Bill booked.",
        }
      : undefined;
  return [
    block("card", {
      heading: "Supplier bills — 3-way match",
      actions: book ? [book] : undefined,
      blocks: [
        block("text", {
          muted: true,
          text: "A bill is payable only when ordered = received = billed. More billed than received puts it on hold; the same supplier's bill number can't be booked twice.",
        }),
        block("table", {
          empty: "No supplier bills yet.",
          columns: [
            { key: "bill", label: "Bill", supporting: "from" },
            { key: "match", label: "PO · receipt · bill" },
            { key: "amount", label: "Amount", align: "end" },
            { key: "due", label: "Due" },
            { key: "status", label: "Status", supporting: "hold" },
          ],
          rows: d.bills.map((b) => ({
            bill: { text: b.billNumber, strong: true },
            from: `${b.supplierName} · ${b.poNumber ?? "—"}`,
            match: {
              text: b.match.map((m) => `L${m.lineNo}: ${m.ordered} · ${m.received} · ${m.billed}`).join("; "),
              tone: b.match.some((m) => m.billed > m.received || m.received > m.ordered) ? "error" : undefined,
            },
            amount: money(b.amount, b.currency),
            due: day(b.dueDate),
            status: { text: b.status, tone: statusTone(b.status), tag: true },
            hold: b.holdReason ? { text: b.holdReason, tone: "error" } : "",
          })),
        }),
      ],
    }),
  ];
}

function receipts(d: CaseOps): ViewBlock[] {
  if (!d.receipts.length) return [];
  return [
    block("card", {
      heading: "Receipts · lots · expiry · quality",
      blocks: [
        block("text", {
          muted: true,
          text: "Warehouse receipts and drop-ship deliveries, with lot, expiry and quality check per line. A shortfall becomes a backorder with a date and an owner — it follows in the next drop.",
        }),
        block("table", {
          columns: [
            { key: "line", label: "Line", supporting: "from" },
            { key: "qty", label: "Received" },
            { key: "where", label: "Where" },
            { key: "lot", label: "Lot · expiry", supporting: "expiry" },
            { key: "qc", label: "Quality check", supporting: "claim" },
            { key: "bo", label: "Backorder" },
          ],
          rows: d.receipts.map((r) => ({
            line: { text: `L${r.lineNo} · ${r.description}`, strong: true },
            from: `${r.supplierName} · ${r.poNumber ?? ""}`,
            qty: { text: `${r.received} of ${r.ordered}`, tone: r.shortfall > 0 ? "warning" : undefined },
            where: `${r.warehouse === "Direct to vessel" ? "Drop-ship → vessel" : `Warehouse ${r.warehouse ?? ""}`} · ${day(r.receivedAt)}`,
            lot: { text: r.lot ?? "—", mono: true },
            expiry: r.expiry ? `Expires ${day(r.expiry)} ${String(r.expiry).slice(0, 4)}` : "No expiry",
            qc: { text: r.qc, tone: statusTone(r.qc), tag: true },
            claim: r.claim ?? "",
            bo:
              r.shortfall > 0
                ? {
                    text: `${r.shortfall} follow · ${day(r.backorderDate)} · owner ${person(d.case.owner)}`,
                    tone: "warning",
                  }
                : null,
          })),
        }),
        ...d.backorders.map((b) =>
          block("alert", {
            tone: "warning",
            text: `${b.qty} × ${b.description} short from ${b.supplierName}: backorder ${day(b.date)} ${b.followsIn ? `— follows in ${b.followsIn}` : ""} (owner ${person(b.owner)}).`,
          }),
        ),
      ],
    }),
  ];
}

export function caseOrderView(d: CaseOps): View {
  return {
    blocks: [tiles(d), poCheck(d), ...partialAward(d), supplierPos(d), ...bills(d), ...receipts(d)],
  };
}

/* ---------------------------------------------------------------- endpoints */

/** The case's data for an action, or the error response. */
async function withOps(req: PayloadRequest, fn: (d: CaseOps) => Promise<Response>) {
  const d = await loadOps(req);
  return d instanceof Response ? d : fn(d);
}

const errorText = (e: unknown) => {
  const err = e as Error & { data?: { errors?: { message: string }[] } };
  return err.data?.errors?.map((x) => x.message).join("; ") || err.message;
};

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/case-order/:id: the "Order & purchasing" tab as a View (src/app/view).
    path: "/views/case-order/:id",
    method: "get",
    handler: (req) => withOps(req, async (d) => Response.json(caseOrderView(d))),
  },
  {
    // The AI reads the customer's PO (or re-runs the check) and says what it found.
    path: "/views/case-order/:id/po-check",
    method: "post",
    handler: async (req) => {
      const r = await operation<{ created: boolean; doc: { openMismatches?: number } }>(req, "po-check", {
        case: req.routeParams?.id,
      });
      if (r instanceof Response) return r;
      const open = r.doc.openMismatches ?? 0;
      return Response.json({
        message: `${r.created ? "Customer PO read and checked" : "PO re-checked"}: ${open ? `${open} mismatch(es) block commitment` : "all lines match"}.`,
      });
    },
  },
  {
    path: "/views/case-order/:id/confirm-order",
    method: "post",
    handler: async (req) => {
      const r = await operation<{ created: string[] }>(req, "confirm-order", { case: req.routeParams?.id });
      if (r instanceof Response) return r;
      return Response.json({
        message: `Sales order confirmed${r.created.length ? ` · supplier POs ${r.created.join(", ")} prepared for re-check & approval` : ""}.`,
      });
    },
  },
  {
    // A supplier PO re-checked by someone outside management goes to Karim Balbaa for approval.
    path: "/views/case-order/:id/ask-approval",
    method: "post",
    handler: (req) =>
      withOps(req, async (d) => {
        const { po: poId } = await bodyOf(req);
        const po = d.purchaseOrders.find((p) => p.id === String(poId));
        if (!po) return failWith("Purchase order not found.", 404);
        const as = { req, overrideAccess: false };
        try {
          await req.payload.create({
            ...as,
            collection: "approvals" as never,
            data: {
              title: `Supplier PO ${po.number} to ${po.supplierName}`,
              type: "Supplier PO",
              case: d.case.id,
              detail: `PO ${po.number} · re-check done${po.recheck.some((r) => !r.ok) ? " — changes flagged" : ", no changes"}.`,
              approvers: ["kb"],
              subject: { relationTo: "purchase-orders", value: po.id },
            } as never,
          });
        } catch (e) {
          return failWith(errorText(e));
        }
        await req.payload
          .create({
            ...as,
            collection: "notifications" as never,
            data: {
              user: "kb",
              title: `Approve supplier PO ${po.number}`,
              detail: `${po.supplierName} · ${d.case.caseId}`,
              kind: "Approval",
              href: "/approvals",
            } as never,
          })
          .catch(() => null);
        return Response.json({ ok: true });
      }),
  },
  {
    // The supplier emails the same bill again: booking it is refused (same supplier + bill number).
    path: "/views/case-order/:id/book-bill",
    method: "post",
    handler: (req) =>
      withOps(req, async (d) => {
        const bill = d.bills[0];
        if (!bill) return failWith("No supplier bill to book.");
        try {
          await req.payload.create({
            req,
            overrideAccess: false,
            collection: "supplier-bills" as never,
            data: {
              billNumber: bill.billNumber,
              supplier: bill.supplier,
              purchaseOrder: bill.purchaseOrder,
              amount: bill.amount,
              currency: bill.currency,
            } as never,
          });
        } catch (e) {
          return failWith(`Duplicate bill blocked — ${errorText(e)}`);
        }
        return Response.json({ ok: true });
      }),
  },
];
