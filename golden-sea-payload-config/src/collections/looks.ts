import type { CollectionConfig } from "payload";
import type { CollectionSettings } from "saastemlycrm-design-system/contracts";

type Look = NonNullable<CollectionSettings["list"]>;

const LOOKS: Record<string, Look> = {
  cases: { calendar: "deadline", status: "stage", figure: "value", eyebrow: "caseType" },
  customers: { eyebrow: "type", cardFields: ["country", "segment", "paymentTermsDays", "vessels"] },
  suppliers: {
    eyebrow: "country",
    figure: "onTime",
    cardFields: ["city", "categories", "replyHrs", "openRfqs"],
  },
  users: { eyebrow: "role", cardFields: ["office", "phone", "language"] },
  "intake-messages": {
    calendar: "receivedAt",
    eyebrow: "channel",
    cardFields: ["fromName", "classification", "receivedAt"],
  },
  "supplier-rfqs": { calendar: "dueAt", eyebrow: "supplier", cardFields: ["case", "dueAt", "reminders", "mode"] },
  offers: {
    calendar: "validUntil",
    status: "compliance",
    eyebrow: "supplier",
    cardFields: ["case", "price", "currency", "leadDays", "validUntil"],
  },
  quotations: {
    calendar: "validUntil",
    figure: "totalExVat",
    eyebrow: "case",
    cardFields: ["version", "currency", "validUntil", "preparedBy"],
  },
  approvals: { eyebrow: "type", status: "status", cardFields: ["case", "progress", "whoDecides"] },
  "purchase-orders": { figure: "total", eyebrow: "supplier", cardFields: ["case", "linesSummary", "deliverTo"] },
  "supplier-bills": {
    calendar: "dueDate",
    figure: "amount",
    eyebrow: "supplier",
    cardFields: ["purchaseOrder", "dueDate", "holdReason"],
  },
  receipts: {
    calendar: "receivedAt",
    status: "qc",
    eyebrow: "warehouse",
    cardFields: ["item", "ordered", "received", "shortfall"],
  },
  deliveries: {
    calendar: "plannedAt",
    status: "status",
    eyebrow: "place",
    cardFields: ["case", "plannedAt", "dispatchedAt"],
  },
  invoices: {
    calendar: "dueDate",
    figure: "balance",
    status: "status",
    eyebrow: "customer",
    cardFields: ["case", "dueDate", "ageBucket", "amount"],
  },
  payments: {
    calendar: "paidAt",
    figure: "amount",
    status: "status",
    eyebrow: "direction",
    cardFields: ["kind", "invoice", "bill", "paidAt"],
  },
  vessels: { eyebrow: "vesselType", cardFields: ["imo", "flag", "customer", "manager"] },
  products: { eyebrow: "store", cardFields: ["brand", "impa", "unit", "shelfLifeMonths"] },
  "supplier-prices": {
    calendar: "validUntil",
    eyebrow: "supplier",
    cardFields: ["product", "price", "currency", "per"],
  },
  pricelists: { calendar: "validUntil", eyebrow: "principal", cardFields: ["currency", "discountPct", "leadDays"] },
  stock: { eyebrow: "warehouse", cardFields: ["product", "onHand", "reserved", "available"] },
  tasks: { calendar: "due" },
  activities: { calendar: "at", status: "kind", cardFields: ["case", "actor", "at"] },
  "ai-calls": { calendar: "at", eyebrow: "task", status: "outcome", cardFields: ["case", "confidence", "at"] },
  "integration-exceptions": {
    calendar: "occurredAt",
    eyebrow: "source",
    cardFields: ["impact", "retries", "occurredAt"],
  },
  opportunities: {
    calendar: "nextStepDue",
    eyebrow: "segment",
    cardFields: ["kind", "nextStep", "nextStepDue", "estimatedValue"],
  },
  "vendor-registrations": {
    calendar: "renewBy",
    eyebrow: "portal",
    cardFields: ["customer", "committeeDate", "renewBy", "nextStep"],
  },
  campaigns: {
    calendar: "scheduledAt",
    status: "contentStatus",
    cardFields: ["audience", "recipients", "scheduledAt"],
  },
};

export function withLooks(collections: CollectionConfig[]): CollectionConfig[] {
  return collections.map((c) => {
    const look = LOOKS[c.slug];
    if (!look) return c;
    const own = (c.custom ?? {}) as CollectionSettings;
    return { ...c, custom: { ...own, list: { ...look, ...own.list } } };
  });
}
