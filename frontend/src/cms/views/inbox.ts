import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type Tone, type View } from "../../app/view/schema.ts";
import { inboxPayload, type InboxPayload } from "../endpoints/sourcing.ts";
import { SIMULATED_FORWARD, SIMULATED_REPLY, SIMULATED_RFQ } from "../endpoints/sourcing-data.ts";

/**
 * Inbox (`/inbox`): every channel in one list — Outlook and Gmail mailboxes, the website
 * quick-quote form, WhatsApp forwards. The header (with the presenter's "simulate" buttons) and
 * the connected channels are blocks; the triage itself (message list, review queue, reading
 * pane with the AI assists, draft case, matching) is the project's `gs-inbox-triage`
 * (src/cms/components/inbox.ts). Data and actions: /api/inbox (../endpoints/sourcing.ts).
 */

const simulate = (kind: "rfq" | "forward" | "reply", label: string, done: string, primary = false): Action => ({
  label,
  icon: primary ? "mail" : undefined,
  variant: primary ? "filled" : "tonal",
  call: { path: "/inbox/simulate", body: { kind } },
  done,
});

const channelTone = (s: string): Tone =>
  s === "Connected" ? "success" : s === "Manual" ? "neutral" : /expired|error/i.test(s) ? "error" : "warning";

export function inboxView(d: InboxPayload, users: { label: string; value: string }[]): View {
  return {
    header: {
      eyebrow: "Sourcing desk · intake",
      heading: "Inbox",
      subtitle: "Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide.",
      actions: [
        simulate("rfq", "Simulate new email", `New email: “${SIMULATED_RFQ.subject}”`, true),
        simulate("forward", "Simulate forwarded copy", `New email: “${SIMULATED_FORWARD.subject}”`),
        simulate("reply", "Simulate supplier reply", `New supplier reply: “${SIMULATED_REPLY.subject}”`),
      ],
    },
    blocks: [
      block("card", {
        heading: "Connected channels",
        blocks: [
          block("tags", {
            items: d.connections.map((c) => ({
              label: `${c.kind.replace(" mailbox", "")} · ${c.account} — ${c.status}`,
              tone: channelTone(c.status),
            })),
          }),
          block("text", {
            muted: true,
            variant: "body-sm",
            text: `Processed today: ${d.stats.processedToday} · duplicates suppressed: ${d.stats.duplicates} · waiting for a person: ${d.stats.review}`,
          }),
        ],
      }),
      block("custom", {
        element: "gs-inbox-triage",
        props: { messages: d.messages, review: d.stats.review, users },
      }),
    ],
  };
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/inbox: the inbox as a View (src/app/view).
    path: "/views/inbox",
    method: "get",
    handler: async (req: PayloadRequest) => {
      if (!req.user)
        return Response.json({ errors: [{ message: "You are not allowed to perform this action." }] }, { status: 401 });
      const [d, people] = await Promise.all([
        inboxPayload(req),
        req.payload.find({
          collection: "users" as never,
          limit: 0,
          depth: 0,
          sort: "name",
          req,
        } as never),
      ]);
      const users = (people as { docs: { id: string; name?: unknown }[] }).docs.map((u) => ({
        label: typeof u.name === "string" ? u.name : u.id,
        value: u.id,
      }));
      return Response.json(inboxView(d, users));
    },
  },
];
