import { actions, assists, details, message, table, text, tiles, widgets } from "saastemlycrm-design-system/contracts";
import { simulations } from "../actions/inbox.ts";
import * as fmt from "../format/inbox.ts";
import { RFQ_KINDS, inbox, liveMessages, messagesToReview, message as open, openMessage } from "../queries/inbox.ts";
import { m } from "../i18n/paraglide/messages.js";

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
    eyebrow: m.page_inbox_eyebrow(),
    heading: m.page_inbox_heading(),
    subtitle: m.page_inbox_subtitle(),
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
      title: m.page_inbox_messages(),
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
        empty: m.page_inbox_no_match_filter(),
      },
    },
    message({
      title: m.page_inbox_original(),
      // Its subhead comes with the data; this line holds its place while it loads.
      subhead: m.page_inbox_original_subhead(),
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
      title: m.page_inbox_what_is(),
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      empty: { when: ({ d }) => !d.message?.body, heading: m.page_inbox_no_text() },
      format: fmt.messageAssists(fmt.kindAssists),
    }),
    assists({
      title: m.page_inbox_warnings(),
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      empty: { when: ({ d }) => !d.message?.body, heading: m.page_inbox_no_warnings_text() },
      format: fmt.messageAssists(fmt.flagAssists),
    }),
    assists({
      title: m.page_inbox_offer_details(),
      rows: 3,
      size: "s",
      skeleton: "text",
      data: open,
      empty: {
        when: ({ d }) => !d.message,
        heading: m.page_inbox_no_message(),
        description: m.page_inbox_pick_message(),
      },
      format: fmt.messageAssists(fmt.offerAssists),
    }),
    {
      title: m.page_inbox_review_title(),
      subhead: m.page_inbox_review_subhead(),
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
        empty: m.page_inbox_review_empty(),
      },
    },
    text({
      title: m.page_inbox_channels(),
      size: "s",
      skeleton: "text",
      data: inbox,
      format: fmt.connectedChannels,
    }),
    // The open message's next step, whichever applies to it: read an RFQ into a draft case, create
    // the case (or open the one made), match a reply (or where its match stands), or what became of
    // it. One tile for all of them.
    text({
      title: m.page_inbox_next_step(),
      size: "m",
      rows: 3,
      skeleton: "text",
      data: open,
      empty: { when: (o) => !fmt.nextStep(o), heading: m.page_inbox_no_next_step() },
      format: fmt.nextStep,
    }),
    // A reply's match, when a person decides it or it's decided: an uncertain one, a duplicate or a
    // matched reply, why it matched and the collection's actions (a "Link to…" per candidate case,
    // "Not related"; the case's links).
    {
      title: m.page_inbox_match_title(),
      subhead: m.page_inbox_match_subhead(),
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
        empty: m.page_inbox_match_empty(),
      },
    },
    // The draft case an RFQ is read into.
    tiles({
      title: m.page_inbox_draft_case(),
      size: "m",
      skeleton: "text",
      data: open,
      empty: {
        when: ({ d }) => !fmt.draft(d),
        heading: m.page_inbox_no_draft(),
        description: m.page_inbox_no_draft_description(),
      },
      format: fmt.draftHeader,
    }),
    details({
      title: m.page_inbox_assignment(),
      size: "s",
      skeleton: "text",
      data: open,
      empty: {
        when: ({ d }) => !fmt.draft(d),
        heading: m.page_inbox_no_owner(),
        description: m.page_inbox_no_owner_description(),
      },
      format: fmt.draftAssignment,
    }),
    table({
      title: m.page_inbox_draft_lines(),
      size: "l",
      skeleton: "table",
      data: open,
      empty: { when: ({ d }) => !fmt.draft(d)?.lines.length, heading: m.page_inbox_no_draft_lines() },
      format: fmt.draftLines,
    }),
    // What's missing or unclear, over the clarification request drafted for it.
    message({
      title: m.page_inbox_missing(),
      size: "l",
      rows: 4,
      skeleton: "text",
      data: open,
      empty: { when: ({ d }) => !fmt.draft(d)?.missing.length, heading: m.page_inbox_nothing_clarify() },
      format: fmt.clarification,
    }),
    message({
      title: m.page_inbox_ack(),
      size: "l",
      skeleton: "text",
      data: open,
      empty: {
        when: ({ d }) => !fmt.draft(d),
        heading: m.page_inbox_no_ack(),
        description: m.page_inbox_no_ack_description(),
      },
      format: fmt.acknowledgement,
    }),
  ],
});
