import type { Endpoint, PayloadRequest } from "payload";
import { commercialEndpoints, type QuoteView } from "./commercial.ts";
import { bodyOf, failWith, forward } from "./forward.ts";
import * as link from "../links.ts";
import { m } from "../i18n/paraglide/messages.js";
import { langOf, optionLabel } from "./insights-shared.ts";

const act = <T>(req: PayloadRequest, action: string, body: Record<string, unknown>) =>
  forward<T>(req, commercialEndpoints, "/commercial/quotations/:id/:action", {
    params: { id: String(req.routeParams?.id), action },
    body,
  });

export const quotationEndpoints: Endpoint[] = [
  {
    path: "/quote-preview/:id/send",
    method: "post",
    handler: async (req) => {
      const b = await bodyOf(req);
      const lang = langOf(req);
      const portal = b.method === "portal";
      const r = await act<QuoteView>(req, "send", { method: portal ? "portal" : "email", to: b.to });
      if (r instanceof Response) return r;
      const number = r.quotation.number;
      return Response.json({
        message: portal
          ? m.api_quotations_entered_in_portal({ number }, { locale: lang })
          : m.api_quotations_sent_to({ number, to: typeof b.to === "string" ? b.to : "" }, { locale: lang }),
      });
    },
  },
  {
    path: "/quote-preview/:id/decision",
    method: "post",
    handler: async (req) => {
      const b = await bodyOf(req);
      const lang = langOf(req);
      const decision = typeof b.decision === "string" ? b.decision : "";
      const note = typeof b.note === "string" ? b.note.trim() : "";
      if (decision === "Lost" && !note) return failWith(m.api_quotations_give_lost_reason({}, { locale: lang }));
      const r = await act(req, "decision", { decision, note });
      return r instanceof Response
        ? r
        : Response.json({
            message: m.api_quotations_decision_recorded(
              { decision: optionLabel(req, "quotations", "decision", decision) },
              { locale: lang },
            ),
          });
    },
  },
  {
    path: "/quote-preview/:id/revise",
    method: "post",
    handler: async (req) => {
      const r = await act<{ id: string }>(req, "revise", { reason: (await bodyOf(req)).reason });
      if (r instanceof Response) return r;
      return Response.json({
        message: m.api_quotations_new_version({}, { locale: langOf(req) }),
        href: link.doc("quotations", r.id, "preview"),
      });
    },
  },
];
