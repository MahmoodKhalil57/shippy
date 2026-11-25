import type { Action } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";

export const caseOrderPath = "/case-order/$doc.id";

export const readPo: Action = {
  label: m.action_order_read_po(),
  main: true,
  call: { path: `${caseOrderPath}/po-check` },
  reply: true,
};
