import type { Endpoint } from "payload";
import { block, type Action, type Cell, type Tone, type View, type ViewBlock } from "../../app/view/schema.ts";
import { platformEndpoints, type IntegrationsView } from "../endpoints/platform.ts";
import type { Doc } from "../types.ts";
import { bodyOf, formatDate, refuse, via } from "./via.ts";

/**
 * Integrations & data (/integrations): the connected channels — Outlook and Gmail mailboxes
 * (status, last sync, emails imported, token expiry → reconnect), the branded acknowledgement
 * (English / Arabic preview of the approved template, `?lang=`), website quick-quote form,
 * WhatsApp, Egyptian e-invoicing, Odoo; the email-history import; daily backups, the staging copy
 * and a full data export; the language settings. Data: GET /api/integrations/status.
 */

type Connection = IntegrationsView["connections"][number];

const s = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const STATUS: Record<string, Tone> = {
  Connected: "success",
  "Token expired": "error",
  "To connect": "warning",
  Sandbox: "info",
  Staging: "info",
  Manual: "neutral",
  Disabled: "neutral",
};
const LANG = [
  { label: "English", value: "en" },
  { label: "العربية (Arabic)", value: "ar" },
];
const DAY = 86_400_000;
const muted = (text: string) => block("text", { text, muted: true, variant: "body-sm" });
const status = (c?: Connection) => (c ? [{ label: s(c.status), tone: STATUS[s(c.status)] ?? "neutral" }] : undefined);

function expiry(v: unknown): Cell {
  if (!v) return null;
  const days = Math.round((new Date(s(v)).getTime() - Date.now()) / DAY);
  return {
    text: `${formatDate(s(v))}${days < 0 ? " · expired" : days < 30 ? ` · in ${days} d` : ""}`,
    tone: days < 0 ? "error" : days < 30 ? "warning" : "neutral",
  };
}

function mailboxes(d: IntegrationsView) {
  const rows = d.connections.filter((c) => /mailbox/.test(s(c.kind)));
  const reconnect = (c: Connection): Action => ({
    label: "Reconnect",
    variant: "filled",
    disabled: !d.canManage,
    call: { path: "/integrations/reconnect", body: { index: c.index } },
    confirm: {
      heading: `Reconnect ${s(c.account)}`,
      text: `You'll sign in with the mailbox's ${/Gmail/.test(s(c.kind)) ? "Google" : "Microsoft 365"} account (simulated in the demo). After sign-in, the emails that waited are imported once each — the idempotency check makes sure none is imported, acknowledged or turned into a case twice.`,
      label: "Sign in & reconnect",
    },
    reply: true,
  });
  return block("card", {
    heading: "Mailboxes",
    count: rows.length,
    blocks: [
      muted(
        "Every email to these mailboxes becomes or joins a case, with its attachments kept. A failed sync never drops mail: it waits in the exception queue and imports once on reconnect.",
      ),
      block("table", {
        columns: [
          { key: "account", label: "Mailbox", supporting: "kind" },
          { key: "status", label: "Status" },
          { key: "sync", label: "Last sync", supporting: "poll" },
          { key: "imported", label: "Emails imported" },
          { key: "expires", label: "Token expires" },
          { key: "action", label: "" },
        ],
        rows: rows.map((c) => ({
          account: { text: s(c.account), strong: true },
          kind: s(c.kind),
          status: { text: s(c.status), tone: STATUS[s(c.status)] ?? "neutral", tag: true },
          sync: c.lastSyncAt ? formatDate(s(c.lastSyncAt)) : null,
          poll: c.pollEveryMinutes ? `every ${s(c.pollEveryMinutes)} min` : "",
          imported: { text: ((Number(c.emailsImported) || 0) + c.live).toLocaleString("en-US"), strong: true },
          expires: expiry(c.tokenExpiresAt),
          action:
            c.status === "Token expired" || c.status === "To connect"
              ? { text: "", actions: [reconnect(c)] }
              : { text: s(c.notes), tone: "neutral" },
        })),
      }),
      ...(d.canManage ? [] : [muted("Management, operations or the office manager reconnect mailboxes.")]),
    ],
  });
}

function ack(d: IntegrationsView, lang: "en" | "ar") {
  const a = d.ack;
  const t = a[lang];
  return block("card", {
    heading: "Branded acknowledgement",
    blocks: [
      block("choice", {
        param: "lang",
        label: "Preview language",
        value: lang,
        options: [
          { value: "en", label: "English" },
          { value: "ar", label: "العربية" },
        ],
      }),
      block("tags", {
        items: [
          { label: `${a.status} v${a.version} · ${a.approvedBy}`, tone: "success" },
          { label: "Sent once per thread" },
          { label: "Never to internal senders" },
        ],
      }),
      block("message", {
        meta: [`From: Golden Sea <${a.from}>`, `To: ${a.to}`],
        subject: t.subject,
        body: t.body,
        dir: lang === "ar" ? "rtl" : "ltr",
        lang,
      }),
      muted(
        "Example for GS-RFQ-0142. Wording, recipients and trigger were approved by management; changing them needs a new approval.",
      ),
      block("actions", {
        items: [{ label: "All message templates", href: "/globals/message-templates", variant: "text" }],
      }),
    ],
  });
}

function odoo(d: IntegrationsView) {
  const o = d.connections.find((c) => c.kind === "Odoo");
  const modules = s(o?.modules)
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return block("card", {
    heading: "Odoo",
    tags: status(o),
    blocks: [
      block("text", { text: "Odoo for the books, SaaSTEMLY for the way you work.", variant: "title-md" }),
      block("text", {
        text: "Standard, supported Odoo holds contacts, sales and purchase orders, stock, invoices and accounting. The sourcing desk on top — inbox, comparison, approvals, automations — writes into it, so any Odoo partner can read your books.",
        muted: true,
      }),
      block("tags", { items: modules.map((label) => ({ label, tone: "primary" })) }),
      muted(`${s(o?.account)}${o?.lastSyncAt ? ` · last sync ${formatDate(s(o.lastSyncAt))}` : ""}`),
    ],
  });
}

function channel(c: Connection | undefined, heading: string, text: string, extra: ViewBlock[] = []) {
  return block("card", {
    heading,
    tags: status(c),
    blocks: [
      ...(c?.account ? [block("text", { text: s(c.account), variant: "label-lg" })] : []),
      muted(text),
      ...(c?.notes ? [block("text", { text: s(c.notes), variant: "body-sm" })] : []),
      ...extra,
    ],
  });
}

function channels(d: IntegrationsView) {
  const by = (kind: string) => d.connections.find((c) => c.kind === kind);
  const web = by("Website form");
  const eta = by("E-invoicing (tax authority)");
  const cert = expiry(eta?.tokenExpiresAt);
  return block("grid", {
    fit: "sm",
    blocks: [
      channel(
        web,
        "Website quick-quote form",
        "“Request a quick quote” creates a draft case and contact; AI reads the items.",
        web ? [muted(`${(Number(web.emailsImported) || 0) + web.live} requests received`)] : [],
      ),
      channel(
        by("WhatsApp"),
        "WhatsApp",
        "Captains and agents message on WhatsApp: each message is logged on its case with a screenshot and who logged it.",
      ),
      channel(
        eta,
        "Egyptian e-invoicing (ETA)",
        "Invoices are signed and submitted to the tax authority; the UUID and status are stored on the invoice.",
        [
          ...(cert && typeof cert === "object"
            ? [block("details", { items: [{ label: "Signing certificate", value: cert }] })]
            : []),
          block("actions", {
            items: [{ label: "Submission failures → exception queue", href: "/automations", variant: "text" }],
          }),
        ],
      ),
      channel(by("AI extraction"), "AI extraction", "Reads PDF, Excel, Word and photos into draft lines. Drafts only."),
      channel(by("Document storage"), "Documents", "Every file on its case, searchable."),
    ],
  });
}

function emailImport(d: IntegrationsView) {
  const i = d.emailImport;
  const n = (v: unknown) => Number(v ?? 0).toLocaleString("en-US");
  const item = (label: string, v: unknown, note: string, tone?: Tone) => ({
    label,
    value: tone ? { text: n(v), tone, strong: true } : { text: n(v), strong: true },
    note,
  });
  return block("card", {
    heading: `Email history import — ${s(i.days)} days`,
    tags: [{ label: s(i.status), tone: "info" }],
    blocks: [
      block("details", {
        items: [
          item("Emails scanned", i.scanned, "sales@, purchasing@, Gmail"),
          item("RFQ threads", i.rfqThreads, "become historical cases"),
          item("Likely duplicates", i.duplicates, "linked, not re-created"),
          item("Exceptions", i.exceptions, "unreadable attachments", "warning"),
          item("Flagged confidential", i.confidential, "excluded unless approved", "error"),
        ],
      }),
      muted(
        "Dry run first; nothing is imported before approval, and no acknowledgements or reminders are sent for historical mail.",
      ),
      block("actions", { items: [{ label: "Open inbox history", href: "/inbox-history" }] }),
    ],
  });
}

function backups(d: IntegrationsView, management: boolean) {
  const b = d.backups;
  const when = (v: unknown) => (v ? formatDate(s(v)) : "—");
  return block("card", {
    heading: "Backups, staging & export",
    blocks: [
      block("details", {
        layout: "inline",
        items: [
          { label: "Schedule", value: s(b.schedule) },
          { label: "Copies", value: `${s(b.locations)} locations · kept ${s(b.retentionDays)} days` },
          { label: "Last backup", value: when(b.lastBackupAt) },
          { label: "Restore last tested", value: when(b.restoreTestedAt) },
          { label: "Staging copy", value: when(b.stagingRefreshedAt) },
        ],
      }),
      muted(
        "The staging copy is where changes are tried before they reach your team; email sending and integrations are switched off there. Your data is always yours: export everything at any time.",
      ),
      block("actions", {
        items: [
          {
            label: "Refresh staging copy",
            call: { path: "/integrations/staging" },
            disabled: !management,
            reason: management ? undefined : "Only management refreshes staging.",
            done: "Staging copy refreshed from last night's backup",
          },
        ],
      }),
    ],
  });
}

function language(d: IntegrationsView) {
  const call = (body: Record<string, unknown>) => ({ path: "/views/integrations/language", body });
  return block("card", {
    heading: "Language — English / العربية",
    blocks: [
      muted(
        "The whole platform runs in English and Arabic: acknowledgements, quotations and invoices go out in the customer's language.",
      ),
      block("settings", {
        items: [
          {
            label: "Company default",
            value: d.language.default,
            options: LANG,
            disabled: !d.canSettings,
            call: call({ field: "default" }),
          },
          ...LANG.map((l) => ({
            label: `Customer documents in ${l.label}`,
            value: d.language.documents.includes(l.value),
            disabled: !d.canSettings,
            call: call({ field: "documents", lang: l.value }),
          })),
        ],
      }),
      ...(d.canSettings ? [] : [muted("Company settings are changed by management.")]),
      block("settings", {
        items: [{ label: "Your language", value: d.myLanguage, options: LANG, call: call({ field: "mine" }) }],
      }),
    ],
  });
}

export function integrationsView(d: IntegrationsView, lang: "en" | "ar", management: boolean): View {
  return {
    header: {
      eyebrow: "Configuration · integrations",
      heading: "Integrations & data",
      subtitle:
        "Your mailboxes, website, WhatsApp, the tax authority and Odoo, connected — with daily backups, a staging copy and your data exportable at any time.",
      actions: [
        { label: "Exception queue", href: "/automations" },
        { label: "Edit connections", href: "/globals/integrations" },
      ],
    },
    blocks: [
      mailboxes(d),
      block("grid", { fit: "md", blocks: [ack(d, lang), odoo(d)] }),
      channels(d),
      block("grid", { fit: "md", blocks: [emailImport(d), backups(d, management), language(d)] }),
    ],
  };
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/integrations?lang=en|ar: integrations & data as a View (src/app/view).
    path: "/views/integrations",
    method: "get",
    handler: async (req) => {
      const d = await via<IntegrationsView>(platformEndpoints, "get", "/integrations/status", req);
      if (d instanceof Response) return d;
      const lang = req.query?.lang === "ar" ? "ar" : "en";
      return Response.json(integrationsView(d, lang, s((req.user as Doc | null)?.role) === "management"));
    },
  },
  {
    // POST /api/views/integrations/language { field: default | documents | mine, lang?, value }.
    path: "/views/integrations/language",
    method: "post",
    handler: async (req) => {
      const me = req.user as Doc | null;
      if (!me) return refuse("Please sign in.", 401);
      const b = await bodyOf(req);
      const value = b.value;
      if (b.field === "mine") {
        const language = value === "ar" ? "ar" : "en";
        await req.payload.update({
          collection: "users",
          id: me.id,
          data: { language },
          req,
          overrideAccess: false,
        } as never);
        return Response.json({
          ok: true,
          message:
            language === "ar"
              ? "Your dashboard language: Arabic (applies after go-live translation)"
              : "Your dashboard language: English",
        });
      }
      if (s(me.role) !== "management") return refuse("Company settings are changed by management.");
      let data: Record<string, unknown>;
      if (b.field === "default") data = { defaultLanguage: value === "ar" ? "ar" : "en" };
      else if (b.field === "documents") {
        const settings = await req.payload.findGlobal({ slug: "settings", depth: 0 } as never);
        const docs = ((settings.documentLanguages as string[] | undefined) ?? ["en"]).map(s);
        const l = s(b.lang);
        const next = value === true ? [...new Set([...docs, l])] : docs.filter((x) => x !== l);
        data = { documentLanguages: next.length ? next : ["en"] };
      } else return refuse("Unknown setting.", 400);
      await req.payload.updateGlobal({ slug: "settings", data, req, overrideAccess: false } as never);
      return Response.json({ ok: true, message: "Language settings saved" });
    },
  },
];
