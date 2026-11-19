import type { Endpoint, PayloadRequest } from "payload";
import { commercialEndpoints, type QuoteView } from "./commercial.ts";
import { bodyOf, failWith, forward } from "./forward.ts";

/**
 * The actions of the quotation tab "Preview & send" (../widgets/quote-preview.ts) that answer in
 * words: each runs the quotation action (POST /api/commercial/quotations/:id/<action>, ./commercial.ts)
 * as the same request and says what happened (`{ message, href? }`). Registered next to the
 * commercial endpoints in ./index.ts.
 */

/** A quotation action as this request. */
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
    path: "/quote-preview/:id/decision",
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
    path: "/quote-preview/:id/revise",
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
