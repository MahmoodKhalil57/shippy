import { actions, assists, details, message, table, text, tiles, widgets } from "saastemlycrm-design-system/contracts";
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
  // message's next step, its match and its draft case. Every tile is there whichever message is
  // open: one that doesn't apply to it says so in its place, so picking a message never moves the
  // screen.
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
        empty: "No messages match this filter.",
      },
    },
    message({
      title: "Original message",
      // Its subhead comes with the data; this line holds its place while it loads.
      subhead: "The message as it arrived",
      // The message itself, as tall as the list beside it.
      rows: 15,
      // `m`: beside the message list (`s`) on a 3-lane board, master and detail together. Always
      // there, so the row beside the message list never depends on the data.
      size: "m",
      skeleton: "card",
      data: open,
      format: fmt.originalMessage,
    }),
    // Short reads beside the message, each a few assists.
    assists({
      title: "What this message is",
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      empty: { when: ({ d }) => !d.message?.body, heading: "No text to read in this message." },
      format: fmt.messageAssists(fmt.kindAssists),
    }),
    assists({
      title: "Warnings in this message",
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      empty: { when: ({ d }) => !d.message?.body, heading: "No text to check for warnings." },
      format: fmt.messageAssists(fmt.flagAssists),
    }),
    assists({
      title: "Offer details and replies",
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      empty: { when: ({ d }) => !d.message, heading: "No message open.", description: "Pick a message in the list." },
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
        empty: "Nothing waiting for review. Every reply is matched.",
      },
    },
    text({
      title: "Connected channels",
      size: "s",
      skeleton: "text",
      data: inbox,
      format: fmt.connectedChannels,
    }),
    // The open message's next step, whichever applies to it: read an RFQ into a draft case, create
    // the case (or open the one made), match a reply (or where its match stands), or what became of
    // it. One tile for all of them.
    text({
      title: "Next step",
      size: "m",
      rows: 3,
      skeleton: "text",
      data: open,
      empty: { when: (o) => !fmt.nextStep(o), heading: "No next step for this message." },
      format: fmt.nextStep,
    }),
    // A reply's match, when a person decides it or it's decided: an uncertain one, a duplicate or a
    // matched reply, why it matched and the collection's actions (a "Link to…" per candidate case,
    // "Not related"; the case's links).
    {
      title: "Reply match",
      subhead:
        "Why it matched and who decided. Below 85% a person picks the case; a duplicate stays with the message already in.",
      size: "m",
      records: {
        collection: "intake-messages",
        where: {
          ...openMessage,
          ...liveMessages,
          classification: { not_in: RFQ_KINDS },
          status: { in: ["Needs review", "Linked"] },
        },
        layout: "entries",
        columns: ["subject", "status", "fromName", "match.case", "match.reference", "match.reviewedBy"],
        tags: ["match.confidencePct"],
        notes: "match.basis",
        notice: "uncertain",
        empty: "No match to show. A new request is read into a draft case, and a new reply is matched first.",
      },
    },
    // The draft case an RFQ is read into.
    tiles({
      title: "Draft case",
      size: "m",
      skeleton: "text",
      data: open,
      empty: {
        when: ({ d }) => !fmt.draft(d),
        heading: "No draft case for this message.",
        description: "Only a request for quotation is read into one.",
      },
      format: fmt.draftHeader,
    }),
    details({
      title: "Owner, backup and deadline",
      size: "s",
      skeleton: "text",
      data: open,
      empty: {
        when: ({ d }) => !fmt.draft(d),
        heading: "No owner suggested yet.",
        description: "The assignment rules suggest one once a request is read into a draft case.",
      },
      format: fmt.draftAssignment,
    }),
    table({
      title: "Draft lines",
      size: "l",
      skeleton: "table",
      data: open,
      empty: { when: ({ d }) => !fmt.draft(d)?.lines.length, heading: "No draft lines for this message." },
      format: fmt.draftLines,
    }),
    // What's missing or unclear, over the clarification request drafted for it.
    message({
      title: "Missing or unclear",
      size: "l",
      rows: 4,
      skeleton: "text",
      data: open,
      empty: { when: ({ d }) => !fmt.draft(d)?.missing.length, heading: "Nothing to clarify with the sender." },
      format: fmt.clarification,
    }),
    message({
      title: "Acknowledgement draft",
      size: "l",
      skeleton: "text",
      data: open,
      empty: {
        when: ({ d }) => !fmt.draft(d),
        heading: "No acknowledgement for this message.",
        description: "A new request gets one, from the approved template.",
      },
      format: fmt.acknowledgement,
    }),
  ],
});
