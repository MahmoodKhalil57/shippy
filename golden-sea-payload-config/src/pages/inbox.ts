import {
  actions,
  alert,
  assists,
  details,
  message,
  table,
  text,
  tiles,
  widgets,
} from "saastemlycrm-design-system/contracts";
import { simulations } from "../actions/inbox.ts";
import * as fmt from "../format/inbox.ts";
import { RFQ_KINDS, inbox, liveMessages, messagesToReview, message as open, openMessage } from "../queries/inbox.ts";

/**
 * Inbox (`/inbox`): every channel in one list — Outlook and Gmail mailboxes, the website
 * quick-quote form, WhatsApp forwards — as master and detail. The side column lists the messages
 * and the review queue, the intake-messages collection's own records (../collections/sourcing.ts,
 * read with no code: their status, channel and urgency tags; filter and order are the `show` and
 * `order` parameters); picking one sets `?message=`. The reading pane's widgets load it from
 * `GET /api/inbox/message?id=` (the newest when none is picked): the original as received with
 * the on-device assists, "Extract with AI" into a draft case with a confidence per value, the
 * owner, backup and deadline, "Create the case", or the reply matching. A person's decision on an
 * uncertain match, and what a matched reply links to, are the collection's again (its fields and
 * actions: "Link to…" per candidate case, "Not related"). Data and actions: /api/inbox
 * (../endpoints/sourcing.ts); the people a case can be given to: the `users` collection.
 * Formatters: ../format/inbox.ts.
 */
export const inboxPage = widgets({
  params: { show: fmt.SHOWS.all, order: fmt.ORDERS.time, message: "" },
  // The demo's "Simulate…" buttons: a new RFQ email, a forwarded copy, a supplier's reply.
  header: {
    eyebrow: "Sourcing desk · intake",
    heading: "Inbox",
    subtitle: "Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide.",
    actions: simulations,
  },
  // Master–detail: the message list beside the reading pane, then the side cards, then the open
  // message's next steps (only the ones that apply to it take a tile).
  widgets: [
    // The list, the message, and beside it the list's order and what the device reads in the
    // message, then the review queue: small tiles of their own, which the board puts one under
    // another beside the message. Nothing here depends on which message is open.
    // Which messages and in what order (`show`, `order`): the list below reads them.
    actions({
      size: "s",
      rows: 2,
      skeleton: "text",
      data: inbox,
      format: fmt.messageFilters,
    }),
    {
      title: "Messages",
      // With the filters above it, as tall as the message beside them, so the row is one block.
      rows: 13,
      size: "s",
      records: {
        collection: "intake-messages",
        where: { ...liveMessages, status: { in: "$param.show" } },
        sort: "$param.order",
        limit: 50,
        columns: ["subject", "fromName", "receivedAt"],
        tags: ["status", "via", "fileCount", "urgencyTag"],
        layout: "list",
        select: { param: "message" },
        actions: false,
        empty: "Nothing here.",
      },
    },
    message({
      title: "Original message",
      // The message itself, as tall as the list beside it.
      rows: 15,
      // `m`: beside the message list (`s`) on a 3-lane board, master and detail together. Always
      // there, so the row beside the message list never depends on the data.
      size: "m",
      skeleton: "card",
      data: open,
      format: fmt.originalMessage,
    }),
    // Short reads beside the message, each a few assists. The pane opens the newest message when
    // none is picked: these usually show.
    assists({
      title: "What this message is",
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      expect: "shown",
      hidden: ({ d }) => !d.message?.body,
      format: fmt.messageAssists(fmt.kindAssists),
    }),
    assists({
      title: "Warnings in this message",
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      expect: "shown",
      hidden: ({ d }) => !d.message?.body,
      format: fmt.messageAssists(fmt.flagAssists),
    }),
    assists({
      title: "Offer details and replies",
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      expect: "shown",
      hidden: ({ d }) => !d.message,
      format: fmt.messageAssists(fmt.offerAssists),
    }),
    {
      title: "Review queue",
      subhead: "Matches below 85% confidence are never linked automatically — a person picks the case.",
      // A few matches to look at.
      rows: 5,
      size: "s",
      head: (d) => ({ countTone: (d as { totalDocs?: number } | undefined)?.totalDocs ? "warning" : "success" }),
      records: {
        collection: "intake-messages",
        where: messagesToReview,
        sort: "-receivedAt",
        columns: ["subject", "fromName", "match.confidencePct"],
        layout: "list",
        dot: "status",
        select: { param: "message" },
        actions: false,
        empty: "Nothing waiting — every reply is matched.",
      },
    },
    text({
      title: "Connected channels",
      size: "s",
      skeleton: "text",
      data: inbox,
      format: fmt.connectedChannels,
    }),
    // The open message's next step (one of these shows), beside the draft it makes.
    text({
      title: "Read it into a draft case",
      size: "m",
      skeleton: "text",
      data: open,
      hidden: (o) => !fmt.unreadRfq(o),
      format: fmt.extractPrompt,
    }),
    alert({
      title: "Outcome",
      size: "m",
      skeleton: "text",
      data: open,
      hidden: (o) => !fmt.settledWithoutDraft(o),
      format: fmt.messageOutcome,
    }),
    text({
      title: "Match this message",
      size: "m",
      skeleton: "text",
      data: open,
      hidden: (o) => !fmt.unmatchedReply(o),
      format: fmt.matchPrompt,
    }),
    // The open message's match, when a person decides it or it's decided: why it matched, and the
    // collection's actions (a "Link to…" per candidate case, "Not related"; the case's links).
    {
      title: "Needs a person",
      subhead: "Uncertain match — not linked automatically.",
      size: "m",
      records: {
        collection: "intake-messages",
        where: { ...openMessage, ...messagesToReview },
        layout: "entries",
        columns: ["subject", "status", "fromName", "receivedAt"],
        tags: ["match.confidencePct"],
        notes: "match.basis",
        notice: "uncertain",
        hideEmpty: true,
      },
    },
    {
      title: "Duplicate detected",
      subhead: "No new case and no second acknowledgement — kept with the message already in.",
      size: "m",
      records: {
        collection: "intake-messages",
        where: { ...openMessage, classification: { equals: "Duplicate" }, status: { equals: "Linked" } },
        layout: "entries",
        columns: ["subject", "status", "match.case"],
        tags: ["match.confidencePct"],
        notes: "match.basis",
        hideEmpty: true,
      },
    },
    {
      title: "Reply matched",
      size: "m",
      records: {
        collection: "intake-messages",
        where: {
          ...openMessage,
          classification: { not_in: ["Duplicate", ...RFQ_KINDS] },
          status: { equals: "Linked" },
        },
        layout: "entries",
        columns: ["subject", "status", "match.case", "match.reference", "match.reviewedBy"],
        tags: ["match.confidencePct"],
        notes: "match.basis",
        hideEmpty: true,
      },
    },
    tiles({
      title: "Draft case",
      size: "m",
      skeleton: "text",
      data: open,
      hidden: ({ d }) => !fmt.draft(d),
      format: fmt.draftHeader,
    }),
    details({
      title: "Owner, backup and deadline",
      size: "s",
      skeleton: "text",
      data: open,
      hidden: ({ d }) => !fmt.draft(d),
      format: fmt.draftAssignment,
    }),
    text({
      title: "Create the case",
      size: "s",
      skeleton: "text",
      data: open,
      hidden: ({ d }) => !(fmt.draft(d) && !d.message!.createdCase),
      format: fmt.createCase,
    }),
    alert({
      title: "Case created",
      size: "s",
      skeleton: "text",
      data: open,
      hidden: ({ d }) => !(fmt.draft(d) && d.message!.createdCase),
      format: fmt.caseCreated,
    }),
    table({
      title: "Draft lines",
      size: "l",
      skeleton: "table",
      data: open,
      hidden: ({ d }) => !fmt.draft(d)?.lines.length,
      format: fmt.draftLines,
    }),
    alert({
      title: "Missing or unclear",
      size: "l",
      skeleton: "text",
      data: open,
      hidden: ({ d }) => !fmt.draft(d)?.missing.length,
      format: fmt.draftMissing,
    }),
    message({
      title: "Clarification request",
      size: "l",
      skeleton: "text",
      data: open,
      hidden: ({ d }) => !(fmt.draft(d)?.missing.length && d.extraction!.clarification),
      format: fmt.clarification,
    }),
    message({
      title: "Acknowledgement draft",
      size: "l",
      skeleton: "text",
      data: open,
      hidden: ({ d }) => !fmt.draft(d),
      format: fmt.acknowledgement,
    }),
  ],
});
