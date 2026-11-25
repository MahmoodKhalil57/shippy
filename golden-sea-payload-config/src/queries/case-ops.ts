import { query } from "saastemlycrm-design-system/contracts";
import type { CaseOps } from "../endpoints/order-to-cash.ts";

export const caseOps = query.endpoint<CaseOps>("/operations/case/$doc.id");

export const ofCase = { case: { equals: "$doc.id" } };
export const caseShortfalls = { ...ofCase, shortfall: { greater_than: 0 } };
export const caseOpenInvoices = { ...ofCase, balance: { greater_than: 0 } };
