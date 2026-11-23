import { links } from "saastemlycrm-design-system/contracts";

/**
 * Golden Sea's links: the design system's `links()` narrowed to this config's collections,
 * globals and root views, so a wrong or renamed slug is a compile error. `tests/links.test.ts`
 * keeps these lists equal to the config's own.
 *
 *   doc("cases", c.id, "pricing") · list("invoices", { status: "Overdue" }) · global("fx-rates")
 */

export const COLLECTIONS = [
  "cases",
  "customers",
  "suppliers",
  "users",
  "media",
  "intake-messages",
  "supplier-rfqs",
  "offers",
  "quotations",
  "approvals",
  "customer-pos",
  "purchase-orders",
  "supplier-bills",
  "receipts",
  "deliveries",
  "invoices",
  "payments",
  "vessels",
  "products",
  "supplier-prices",
  "pricelists",
  "stock",
  "tasks",
  "activities",
  "integration-exceptions",
  "ai-calls",
  "notifications",
  "bookmarks",
  "opportunities",
  "vendor-registrations",
  "campaigns",
  "guide-topics",
  "tours",
] as const;

export const GLOBALS = [
  "branding",
  "assistant",
  "settings",
  "fx-rates",
  "pricing-policy",
  "approval-rules",
  "automation-rules",
  "message-templates",
  "integrations",
  "on-call-roster",
  "service-usage",
] as const;

export const VIEWS = [
  "/",
  "/inbox",
  "/inbox-history",
  "/approvals",
  "/cash",
  "/control-room",
  "/growth",
  "/automations",
  "/roles",
  "/integrations",
  "/project",
  "/usage",
  "/value",
  "/sourcing-pipeline",
] as const;

export type CollectionSlug = (typeof COLLECTIONS)[number];
export type GlobalSlug = (typeof GLOBALS)[number];
export type ViewPath = (typeof VIEWS)[number];

export const { doc, list, create, global, view } = links<CollectionSlug, GlobalSlug, ViewPath>();
