import type { Action, Entry, Figure, KindData, Row } from "saastemlycrm-design-system/contracts";
import { caseDeliveryPath, etaAction } from "../actions/case-delivery.ts";
import { caseOrderPath, readPo } from "../actions/case-order.ts";
import type { Check } from "../endpoints/operations.ts";
import type { CaseOps, OpsDelivery, OpsPO } from "../endpoints/order-to-cash.ts";
import { IS_MOCK } from "../flags.ts";
import { m } from "../i18n/paraglide/messages.js";
import { dayTime, person, statusTone } from "./index.ts";

export const lineLabel = (l: { lineNo: number; description: string }) => `L${l.lineNo} · ${l.description}`;

const lineRef = (lineNo: number) => (lineNo ? m.order_to_cash_line_ref({ line: lineNo }) : m.order_to_cash_header());

export const ORDER_FIGURES = ["Customer PO", "Supplier POs confirmed", "Received", "Supplier bills"] as const;
export type OrderFigure = (typeof ORDER_FIGURES)[number];

export const orderFigureName = (key: OrderFigure): string =>
  ({
    "Customer PO": m.order_to_cash_figure_customer_po,
    "Supplier POs confirmed": m.order_to_cash_figure_supplier_pos_confirmed,
    Received: m.order_to_cash_figure_received,
    "Supplier bills": m.order_to_cash_figure_supplier_bills,
  })[key]();

export const orderFigures = (d: CaseOps): Figure<OrderFigure>[] => {
  const po = d.customerPo;
  const confirmed = d.purchaseOrders.filter((p) => !["Draft", "Awaiting approval", "Cancelled"].includes(p.status));
  const ordered = d.receipts.reduce((s, r) => s + r.ordered, 0);
  const received = d.receipts.reduce((s, r) => s + r.received, 0);
  const held = d.bills.filter((b) => b.status === "On hold").length;
  return [
    {
      key: "Customer PO",
      label: orderFigureName("Customer PO"),
      value: po ? po.status : d.orderConfirmed ? m.order_to_cash_po_validated() : m.order_to_cash_po_not_received(),
      note: po
        ? m.order_to_cash_po_vs_quotation({ po: po.number, quotation: po.quotation })
        : d.orderConfirmed
          ? m.order_to_cash_sales_order_confirmed()
          : m.order_to_cash_waiting_customer_order(),
      tone: po ? (po.status === "Validated" ? "success" : "error") : d.orderConfirmed ? "success" : undefined,
    },
    {
      key: "Supplier POs confirmed",
      label: orderFigureName("Supplier POs confirmed"),
      value: m.order_to_cash_n_of_total({ n: confirmed.length, total: d.purchaseOrders.length }),
      note: d.purchaseOrders.length ? m.order_to_cash_pos_rechecked() : m.order_to_cash_pos_prepared_later(),
      share: d.purchaseOrders.length
        ? { value: confirmed.length / d.purchaseOrders.length, text: m.order_to_cash_share_confirmed() }
        : undefined,
    },
    {
      key: "Received",
      label: orderFigureName("Received"),
      value: ordered ? m.order_to_cash_n_of_total({ n: received, total: ordered }) : "—",
      note:
        ordered && received < ordered
          ? m.order_to_cash_on_backorder({ count: ordered - received })
          : m.order_to_cash_units_across_receipts(),
      share: ordered ? { value: received / ordered, text: m.order_to_cash_share_of_units_ordered() } : undefined,
      tone: ordered && received < ordered ? "warning" : undefined,
    },
    ...(d.canSeeCosts
      ? [
          {
            key: "Supplier bills" as const,
            label: orderFigureName("Supplier bills"),
            value: `${d.bills.length}`,
            note: held ? m.order_to_cash_bills_on_hold({ count: held }) : m.order_to_cash_bills_matched(),
            share: d.bills.length
              ? {
                  value: (d.bills.length - held) / d.bills.length,
                  text: m.order_to_cash_share_matched({ count: d.bills.length - held }),
                }
              : undefined,
            tone: held ? ("error" as const) : undefined,
          },
        ]
      : []),
  ];
};

export const unorderedLines = (d: CaseOps) => {
  const po = d.customerPo;
  if (!po) return [];
  const onPo = new Set(po.checks.filter((c) => c.lineNo > 0).map((c) => c.lineNo));
  return d.lines.filter((l) => !onPo.has(l.lineNo));
};

const outcomeWords = (outcome: string) =>
  outcome === "Closed"
    ? m.order_to_cash_outcome_closed()
    : outcome === "Open — revision to follow"
      ? m.order_to_cash_outcome_open_revision()
      : outcome;

export const partialAward = (d: CaseOps): KindData<"list"> => {
  const po = d.customerPo!;
  const award = (lineNo: number, outcome: string, reason?: string) => ({
    path: "/operations/po-award",
    body: { po: po.id, lineNo, outcome, ...(reason ? { reason } : {}) },
  });
  return {
    note: m.order_to_cash_partial_award_note(),
    items: unorderedLines(d).map((l) => {
      const u = po.unawarded.find((x) => x.lineNo === l.lineNo);
      const actions: Action[] =
        u?.outcome === "Closed"
          ? []
          : [
              ...(u
                ? []
                : [
                    {
                      label: m.order_to_cash_keep_open(),
                      call: award(l.lineNo, "Open — revision to follow", "Revision to follow"),
                      done: m.order_to_cash_kept_open_done({ line: l.lineNo }),
                    },
                  ]),
              {
                label: m.order_to_cash_close_with_reason(),
                call: award(l.lineNo, "Closed"),
                prompt: m.order_to_cash_close_line_prompt({ line: l.lineNo }),
                fields: [
                  {
                    type: "textarea",
                    name: "reason",
                    label: m.order_to_cash_reason_label(),
                    required: true,
                    admin: {
                      placeholder: m.order_to_cash_reason_placeholder(),
                      description: m.order_to_cash_reason_hint({ line: l.lineNo, description: l.description }),
                    },
                  },
                ],
                done: m.order_to_cash_closed_done({ line: l.lineNo }),
              },
            ];
      return {
        headline: lineLabel(l),
        supporting: u
          ? u.reason
            ? m.order_to_cash_outcome_with_reason({ outcome: outcomeWords(u.outcome), reason: u.reason })
            : outcomeWords(u.outcome)
          : m.order_to_cash_not_on_po_decide(),
        tags: [
          u
            ? u.outcome === "Closed"
              ? { label: m.order_to_cash_outcome_closed(), tone: "neutral" as const }
              : { label: m.order_to_cash_outcome_open_revision(), tone: "warning" as const }
            : { label: m.order_to_cash_undecided(), tone: "error" as const },
        ],
        actions,
      };
    }),
  };
};

export const customerPoAwaited = (d: CaseOps) => !d.customerPo && (d.orderConfirmed || d.poExpected);

const customerPoPending = (d: CaseOps): NonNullable<KindData<"table">["alerts"]>[number] =>
  d.orderConfirmed
    ? {
        tone: "success",
        text: m.order_to_cash_po_checked_validated(),
      }
    : {
        tone: "info",
        heading: m.order_to_cash_po_arrived_heading(),
        text: m.order_to_cash_po_arrived_text(),
        actions: [readPo],
      };

export const customerPoCheck = (d: CaseOps): KindData<"table"> => {
  const po = d.customerPo;
  if (!po)
    return customerPoAwaited(d)
      ? {
          alerts: [customerPoPending(d)],
          columns: [],
          rows: [],
          empty: d.orderConfirmed ? m.order_to_cash_po_empty_confirmed() : m.order_to_cash_po_empty_read(),
        }
      : {
          columns: [],
          rows: [],
          empty: m.order_to_cash_po_empty_none(),
        };
  const blocked = po.status !== "Validated";
  const rows: Row[] = po.checks.map((c) => ({
    line: { text: lineRef(c.lineNo), strong: true },
    field: c.field,
    po: c.po,
    quote: c.quote,
    result: c.matches
      ? { text: m.order_to_cash_result_match(), tone: "success", tag: true }
      : c.resolution
        ? { text: m.order_to_cash_result_amendment(), tone: "success", tag: true }
        : { text: m.order_to_cash_result_mismatch(), tone: "error", tag: true },
    note: c.resolution
      ? c.evidence
        ? m.order_to_cash_resolution_evidence({ resolution: c.resolution })
        : c.resolution
      : "",
  }));
  return {
    head: {
      subhead: m.order_to_cash_po_subhead({
        number: po.number,
        received: dayTime(po.receivedAt),
        quotation: po.quotation,
        entity: po.billingEntity ?? "—",
      }),
      tags: [{ label: po.status, tone: statusTone(po.status) }, { label: m.order_to_cash_ai_check_tag() }],
      actions: [{ ...readPo, label: m.order_to_cash_rerun_po_check() }],
    },
    columns: [
      { key: "line", label: m.order_to_cash_col_line() },
      { key: "field", label: m.order_to_cash_col_checked() },
      { key: "po", label: m.order_to_cash_col_customer_po() },
      { key: "quote", label: m.order_to_cash_col_quotation({ quotation: po.quotation }) },
      { key: "result", label: m.order_to_cash_col_result(), supporting: "note" },
    ],
    rows,
    alerts: [
      blocked
        ? {
            tone: "error",
            text: m.order_to_cash_commitment_blocked({ count: po.openMismatches }),
          }
        : {
            tone: "success",
            text: d.orderConfirmed ? m.order_to_cash_po_validated_confirmed() : m.order_to_cash_po_validated_agreed(),
          },
    ],
    actions: d.orderConfirmed
      ? []
      : [
          {
            label: m.order_to_cash_confirm_sales_order(),
            main: true,
            disabled: blocked,
            call: { path: `${caseOrderPath}/confirm-order` },
            reply: true,
          },
        ],
  };
};

export type OpenMismatch = { c: Check; i: number };

export const openMismatches = (d: CaseOps): OpenMismatch[] =>
  (d.customerPo?.checks ?? []).flatMap((c, i) => (c.matches || c.resolution ? [] : [{ c, i }]));

export const customerAmendment = ({ c, i }: OpenMismatch, d: CaseOps): KindData<"attach"> => {
  const po = d.customerPo!;
  return {
    action: { label: m.order_to_cash_record_amendment() },
    text: m.order_to_cash_mismatch_text({ line: lineRef(c.lineNo), field: c.field }),
    heading: c.lineNo
      ? m.order_to_cash_amendment_heading_line({ line: c.lineNo })
      : m.order_to_cash_amendment_heading_header(),
    intro: m.order_to_cash_amendment_intro({ field: c.field, po: c.po, quote: c.quote }),
    fields: [
      {
        type: "textarea",
        name: "resolution",
        label: m.order_to_cash_agreement_label(),
        required: true,
        defaultValue: c.suggestion ?? "",
        admin: {
          description: c.suggestion ? m.order_to_cash_agreement_hint_ai() : m.order_to_cash_agreement_hint(),
        },
      },
    ],
    file: {
      name: "evidence",
      legend: m.order_to_cash_evidence_legend(),
      hint: m.order_to_cash_evidence_hint(),
      upload: {
        collection: "media",
        data: { alt: `${po.number} amendment, line ${c.lineNo}`, kind: "Customer PO" },
      },
      sample: sample({
        filename: `${po.number}-amendment-L${c.lineNo}.pdf`,
        lines: [
          m.order_to_cash_sample_from(),
          m.order_to_cash_sample_re({ number: po.number, line: c.lineNo }),
          "{resolution}",
        ],
      }),
    },
    call: { path: "/operations/po-amend", body: { po: po.id, index: i } },
    confirmLabel: m.order_to_cash_amendment_confirm(),
    done: m.order_to_cash_amendment_done({ line: c.lineNo }),
  };
};

export const customerPoAiCheck = (d: CaseOps): KindData<"custom"> => {
  const po = d.customerPo!;
  return {
    element: "ui-ai-check",
    key: `po-${po.number}`,
    props: {
      label: m.order_to_cash_ai_second_look(),
      text: po.checks
        .map((c) =>
          m.order_to_cash_ai_check_line({
            what: c.lineNo > 0 ? m.order_to_cash_ai_line({ line: c.lineNo }) : m.order_to_cash_ai_terms(),
            field: c.field,
            po: c.po,
            quotation: po.quotation,
            quote: c.quote,
          }),
        )
        .join("\n"),
      questions: [
        {
          id: "prices",
          prompt: m.order_to_cash_q_prices(),
          yes: m.order_to_cash_q_prices_yes(),
          no: m.order_to_cash_q_prices_no(),
        },
        {
          id: "items",
          prompt: m.order_to_cash_q_items(),
          yes: m.order_to_cash_q_items_yes(),
          no: m.order_to_cash_q_items_no(),
        },
        {
          id: "terms",
          prompt: m.order_to_cash_q_terms(),
          yes: m.order_to_cash_q_terms_yes(),
          no: m.order_to_cash_q_terms_no(),
        },
      ],
    },
  };
};

export const purchaseOrdersToConfirm = (d: CaseOps): OpsPO[] =>
  d.canSeeCosts ? d.purchaseOrders.filter((p) => ["Draft", "Awaiting approval"].includes(p.status)) : [];

export const recheckTitle = (p: OpsPO) => m.order_to_cash_recheck_title({ number: p.number });

const recheckColumns = () => [
  { key: "item", label: m.order_to_cash_col_item() },
  { key: "atQuotation", label: m.order_to_cash_col_at_quotation() },
  { key: "now", label: m.order_to_cash_col_now() },
  { key: "ok", label: m.order_to_cash_col_check(), hideLabel: true },
];

const recheckRequest = (p: OpsPO): KindData<"table"> => ({
  head: { tags: [{ label: p.status, tone: statusTone(p.status) }] },
  note: m.order_to_cash_recheck_note({ number: p.number, supplier: p.supplierName }),
  columns: recheckColumns(),
  rows: [],
  empty: m.order_to_cash_not_rechecked(),
  actions: [
    {
      label: m.order_to_cash_recheck_confirm(),
      main: true,
      call: { path: "/operations/po-recheck", body: { po: p.id } },
      done: m.order_to_cash_recheck_done({ supplier: p.supplierName }),
    },
  ],
});

const recheckResult = (p: OpsPO, d: CaseOps): KindData<"table"> => {
  const changed = p.recheck.filter((r) => r.ok === false);
  const decide: Action = d.isManagement
    ? {
        label: m.order_to_cash_approve_confirm({ number: p.number }),
        main: true,
        call: { path: "/operations/po-confirm", body: { po: p.id } },
        confirm: {
          heading: m.order_to_cash_confirm_heading({ number: p.number }),
          text: m.order_to_cash_confirm_text({ number: p.number, supplier: p.supplierName }),
          label: m.order_to_cash_confirm_send(),
        },
        done: m.order_to_cash_confirmed_done({ number: p.number, supplier: p.supplierName }),
      }
    : {
        label: m.order_to_cash_ask_approval(),
        main: true,
        call: { path: `${caseOrderPath}/ask-approval`, body: { po: p.id } },
        done: m.order_to_cash_ask_approval_done({ number: p.number }),
      };
  return {
    head: { tags: [{ label: p.status, tone: statusTone(p.status) }] },
    note: d.isManagement ? undefined : m.order_to_cash_confirmed_by_management(),
    columns: recheckColumns(),
    rows: p.recheck.map((r) => ({
      item: r.item,
      atQuotation: r.atQuotation,
      now: r.now,
      ok:
        r.ok === false
          ? { text: m.order_to_cash_changed(), tone: "warning", tag: true }
          : { text: m.order_to_cash_ok(), tone: "success", tag: true },
    })),
    alerts: changed.length
      ? [
          {
            tone: "warning",
            text: m.order_to_cash_shortfall_backorder({
              changes: changed.map((c) => m.order_to_cash_change_line({ item: c.item, now: c.now ?? "" })).join(" · "),
            }),
          },
        ]
      : [],
    actions: [decide],
  };
};

export const recheck = (p: OpsPO, d: CaseOps): KindData<"table"> =>
  p.recheckDone ? recheckResult(p, d) : recheckRequest(p);

const delivered = (x: OpsDelivery) => /confirmed/.test(x.status);

export const nextDrop = (d: CaseOps): OpsDelivery | undefined =>
  d.deliveries.find((x) => !/confirmed|Cancelled/.test(x.status)) ?? d.deliveries[0];

export const replanNotice = (d: CaseOps): KindData<"alert"> => {
  const eta = d.alerts.find((a) => /ETA change/.test(a.text));
  if (eta)
    return {
      tone: "warning",
      heading: m.order_to_cash_replan_heading({ owner: person(d.case.owner) }),
      text: m.order_to_cash_replan_text({ at: dayTime(eta.at), text: eta.text }),
    };
  return d.case.blocker ? { tone: "info", text: d.case.blocker } : { tone: "success", text: m.order_to_cash_on_plan() };
};

export const deliveryPlan = (d: CaseOps): KindData<"details"> => {
  const next = nextDrop(d);
  if (!next)
    return {
      note: m.order_to_cash_no_plan(),
      items: [],
    };
  const eta = etaAction(d);
  const p = next.plan;
  return {
    head: {
      tags: [
        {
          label: m.order_to_cash_drop_tag({ drop: next.drop, total: d.deliveries.length, status: next.status }),
          tone: statusTone(next.status),
        },
      ],
      actions: eta ? [eta] : [],
    },
    note: m.order_to_cash_plan_note(),
    items: [
      { label: m.order_to_cash_port_place(), value: m.order_to_cash_pair({ a: d.case.port ?? "—", b: next.place }) },
      { label: m.order_to_cash_vessel_eta(), value: dayTime(d.case.eta) },
      { label: m.order_to_cash_agent_contact(), value: d.case.agent || "—" },
      {
        label: m.order_to_cash_truck_staff(),
        value: m.order_to_cash_pair({ a: p.vehicle ?? "—", b: p.boardingStaff ?? "—" }),
      },
      { label: m.order_to_cash_launch_boat(), value: p.launch ?? "—" },
      { label: m.order_to_cash_goods_ready(), value: dayTime(p.readyAt) },
      { label: m.order_to_cash_planned_on_board(), value: dayTime(next.plannedAt) },
      { label: m.order_to_cash_clearance(), value: p.clearance ?? "—" },
    ],
  };
};

export const preDispatchChecks = (d: CaseOps): KindData<"actions"> => {
  const next = nextDrop(d)!;
  const p = next.plan;
  const openApprovals = d.purchaseOrders.some((x) => x.status === "Awaiting approval");
  const goodsReady = d.backorders.every((b) => !next.lines.some((l) => l.lineNo === b.lineNo) || !b.late);
  const checks: [string, boolean][] = [
    [m.order_to_cash_check_goods_ready(), goodsReady],
    [m.order_to_cash_check_documents(), true],
    [m.order_to_cash_check_ship_stores(), Boolean(p.clearance)],
    [m.order_to_cash_check_transport(), Boolean(p.vehicle && p.launch && !/to be confirmed/i.test(p.launch))],
    [m.order_to_cash_check_no_approval(), !openApprovals],
  ];
  return {
    head: { subhead: next.number },
    tags: checks.map(([label, ok]) => ({
      label,
      tone: ok ? ("success" as const) : ("warning" as const),
      icon: ok ? "success" : "warning",
    })),
    items: [],
  };
};

function dropEntry(d: CaseOps, x: OpsDelivery): Entry {
  const done = delivered(x);
  const signedBy = m.order_to_cash_signed_by_default({ vessel: d.case.vessel || m.order_to_cash_vessel() });
  return {
    id: x.id,
    heading: m.order_to_cash_drop_heading({ drop: x.drop, number: x.number }),
    meta: [dayTime(x.plannedAt), x.place],
    status: { label: x.status, tone: statusTone(x.status) },
    text: x.lines
      .map((l) =>
        l.lot
          ? m.order_to_cash_drop_line_lot({ line: l.lineNo, qty: l.qty, description: l.description, lot: l.lot })
          : m.order_to_cash_drop_line({ line: l.lineNo, qty: l.qty, description: l.description }),
      )
      .join("\n"),
    facts: [
      {
        label: m.order_to_cash_dispatch(),
        value: x.dispatchedAt
          ? { text: m.order_to_cash_dispatched_at({ at: dayTime(x.dispatchedAt) }), tone: "success" }
          : { text: m.order_to_cash_not_dispatched(), tone: "neutral" },
      },
      {
        label: m.order_to_cash_receipt(),
        value: done
          ? {
              text: (x.proof ? m.order_to_cash_signed_by_at_proof : m.order_to_cash_signed_by_at)({
                by: x.confirmedBy ?? m.order_to_cash_vessel(),
                at: dayTime(x.confirmedAt),
              }),
              tone: "success",
            }
          : { text: m.order_to_cash_receipt_pending(), tone: "warning" },
      },
      ...(x.shortages
        ? [{ label: m.order_to_cash_shortages(), value: { text: x.shortages, tone: "warning" as const } }]
        : []),
      ...(x.invoice ? [{ label: m.order_to_cash_invoiced(), value: x.invoice }] : []),
    ],
    attach:
      !done && x.status !== "Cancelled"
        ? {
            action: { label: m.order_to_cash_confirm_delivery(), main: !!x.dispatchedAt },
            heading: m.order_to_cash_confirm_delivered_heading({ number: x.number }),
            intro: m.order_to_cash_intro({
              lines: x.lines.map((l) => m.order_to_cash_intro_line({ line: l.lineNo, qty: l.qty })).join(" · "),
              place: x.place,
            }),
            file: {
              name: "proof",
              legend: m.order_to_cash_proof_legend(),
              accept: "image/*,application/pdf",
              hint: m.order_to_cash_proof_hint(),
              required: true,
              upload: { collection: "media", data: { alt: `${x.number} signed`, kind: "Delivery note / POD" } },
              sample: sample({
                label: m.order_to_cash_sample_scan(),
                filename: `${x.number}-signed.pdf`,
                lines: [
                  m.order_to_cash_sample_note({ number: x.number }),
                  m.order_to_cash_sample_received({ signedBy: "{signedBy}" }),
                ],
              }),
            },
            fields: [
              {
                type: "text",
                name: "signedBy",
                label: m.order_to_cash_signed_by_vessel(),
                required: true,
                defaultValue: signedBy,
              },
              {
                type: "textarea",
                name: "shortages",
                label: m.order_to_cash_shortages_label(),
                defaultValue: "",
                admin: { description: m.order_to_cash_shortages_hint() },
              },
            ],
            dictate: { label: m.order_to_cash_dictate(), field: "shortages" },
            extract: {
              label: m.order_to_cash_read_note(),
              what: "signed delivery note or receipt from a ship",
              fields: [
                {
                  id: "signedBy",
                  label: m.order_to_cash_x_signed_by(),
                  hint: "name and rank of the officer who signed",
                },
                { id: "date", label: m.order_to_cash_x_date() },
                { id: "vessel", label: m.order_to_cash_x_vessel() },
                {
                  id: "remarks",
                  label: m.order_to_cash_x_remarks(),
                  hint: "anything written about missing or damaged items",
                },
              ],
              into: { signedBy: { field: "signedBy" }, remarks: { field: "shortages", append: true } },
            },
            missing: m.order_to_cash_missing_proof(),
            call: { path: "/operations/confirm-delivery", body: { delivery: x.id } },
            confirmLabel: m.order_to_cash_confirm_delivered(),
            done: m.order_to_cash_delivered_done({ number: x.number }),
          }
        : undefined,
    actions:
      done && !x.invoice && d.canFinance
        ? [
            {
              label: m.order_to_cash_invoice_delivered(),
              call: { path: `${caseDeliveryPath}/invoice`, body: { delivery: x.id } },
              reply: true,
            },
          ]
        : undefined,
  };
}

export const dropEntries = (d: CaseOps): KindData<"entries"> => ({
  head: {
    tags: [
      {
        label: m.order_to_cash_delivered_count({
          n: d.deliveries.filter(delivered).length,
          total: d.deliveries.length,
        }),
      },
    ],
  },
  items: d.deliveries.map((x) => dropEntry(d, x)),
});

function sample<T>(s: T): T | undefined {
  if (IS_MOCK) {
    return s;
  } else {
    return undefined;
  }
}
