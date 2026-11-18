import type { Access, CollectionConfig, Field, PayloadRequest } from "payload";

/** Shared vocabulary and access rules for the sourcing-desk data model. */

export const ROLES = [
  { label: "Supply chain & customer service", value: "supply-chain" },
  { label: "Management approver", value: "management" },
  { label: "Sales", value: "sales" },
  { label: "Operations & finance", value: "operations" },
  { label: "Financial director", value: "finance-director" },
  { label: "Office admin", value: "office-admin" },
];
export type Role = (typeof ROLES)[number]["value"];

export const CURRENCIES = ["EGP", "USD", "EUR"];
export const PORTS = ["Port Said", "Suez", "Damietta", "Alexandria", "Abu Qir", "Dekheila", "Offshore"];
export const WAREHOUSES = ["Cairo (6th October)", "Alexandria"];

/** Golden Sea's stores (product categories) plus the older sourcing categories used by existing records. */
export const STORES = [
  "Engine stores",
  "Deck stores",
  "Cabin stores",
  "Electrical stores",
  "Safety stores",
  "Medicine stores",
  "Stationery stores",
  "Provision stores",
  "Bond stores",
];

export const UNITS = ["pcs", "EA", "kg", "ltr", "L", "m", "set", "roll", "pack", "can", "drum", "carton"];

export const CASE_TYPES = [
  { label: "Stores / provisions RFQ", value: "rfq" },
  { label: "Spare-parts clearance", value: "service" },
  { label: "Held stores", value: "held" },
];

export const SUPPLIER_RFQ_STATUSES = [
  "Draft",
  "Sent",
  "Awaiting reply",
  "Partial reply",
  "Clarification needed",
  "Replied",
  "Revised offer received",
  "Declined",
  "No response",
];

export const QUOTE_DECISIONS = [
  "Quotation prepared",
  "Awaiting management approval",
  "Submitted",
  "Awaiting customer decision",
  "Revision requested",
  "Won",
  "Lost",
  "Expired",
  "On hold",
];

export const CONTACT_RULES = [
  { label: "Follow-ups allowed", value: "allowed" },
  { label: "Max one follow-up per quotation", value: "one-follow-up" },
  { label: "Do not chase — internal reminders only", value: "do-not-chase" },
];

/* ---------------------------------------------------------------- access */

type User = { id?: string; role?: string } | null | undefined;
const role = (req: PayloadRequest): string | undefined => (req.user as User)?.role;

export const loggedIn: Access = ({ req }) => Boolean(req.user);
export const anyone: Access = () => true;
export const hasRole =
  (...roles: Role[]): Access =>
  ({ req }) =>
    roles.includes(role(req) as Role);
export const management = hasRole("management");
/** Field-level variant (field access must return a boolean). */
export const isManagement = ({ req }: { req: PayloadRequest }) => role(req) === "management";
export const finance = hasRole("management", "finance-director", "operations");

/** Readable by anyone (the mock pages work without logging in); writable by logged-in users; deleted by management. */
export const deskAccess: CollectionConfig["access"] = {
  read: anyone,
  create: loggedIn,
  update: loggedIn,
  delete: management,
};

/** Money records: everyone logged in reads, finance roles write, management deletes. */
export const financeAccess: CollectionConfig["access"] = {
  read: loggedIn,
  create: finance,
  update: finance,
  delete: management,
};

/** Field-level: costs & margins hidden from sales (as in the demo's "Viewing as Soaad Amer"). */
export const costVisible = ({ req }: { req: PayloadRequest }) => Boolean(req.user) && role(req) !== "sales";

/* ---------------------------------------------------------------- reusable fields */

export const money = (name: string, label?: string, extra: Partial<Field> = {}): Field =>
  ({
    type: "row",
    fields: [
      { name, type: "number", label: label ?? name, min: 0 },
      { name: `${name}Currency`, type: "select", label: "Currency", options: CURRENCIES, defaultValue: "EGP" },
    ],
    ...extra,
  }) as Field;

export const evidence = (name = "evidence", label = "Evidence"): Field => ({
  name,
  type: "upload",
  relationTo: "media",
  label,
});

export const caseRef = (required = true): Field => ({
  name: "case",
  type: "relationship",
  relationTo: "cases",
  required,
  index: true,
});

/** `GS-XXX-0001`-style numbering for a collection's reference field. */
export const autoNumber =
  (collection: string, field: string, prefix: string) =>
  async ({ data, operation, req }: { data?: Record<string, unknown>; operation: string; req: PayloadRequest }) => {
    if (operation !== "create" || !data || data[field]) return data;
    const { docs } = await req.payload.find({ collection: collection as never, limit: 0, depth: 0 });
    // The running number is what follows the prefix (`INV/2026/0412` → 412), not every digit.
    const last = Math.max(
      0,
      ...docs.map((d) => {
        const v = scalar((d as Record<string, unknown>)[field]);
        return v.startsWith(prefix) ? Number(/\d+/.exec(v.slice(prefix.length))?.[0] ?? 0) : 0;
      }),
    );
    return { ...data, [field]: `${prefix}${String(last + 1).padStart(4, "0")}` };
  };

/** Records an activity on the related case (the demo's case timeline / audit log). */
export async function logActivity(
  req: PayloadRequest,
  entry: { case?: string | null; kind?: "auto" | "human" | "alert"; text: string; entity?: string },
) {
  try {
    await req.payload.create({
      collection: "activities" as never,
      data: {
        case: entry.case ?? undefined,
        kind: entry.kind ?? (req.user ? "human" : "auto"),
        text: entry.text,
        entity: entry.entity,
        actor: (req.user as User)?.id ?? undefined,
        at: new Date().toISOString(),
      } as never,
      req,
    });
  } catch {
    /* activity logging never blocks the main write */
  }
}

/** A string or number as text; anything else (objects, null) as "". */
export const scalar = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");

/** The id of a relationship value, populated (`{ id }`) or not. */
export const idOf = (v: unknown): string | undefined =>
  (v && typeof v === "object" ? scalar((v as { id?: unknown }).id) : scalar(v)) || undefined;

/** A business-rule violation: HTTP 400 like Payload's `APIError(message, 400)` (kept import-free for the browser). */
export const ruleError = (message: string) => Object.assign(new Error(message), { status: 400, name: "APIError" });
