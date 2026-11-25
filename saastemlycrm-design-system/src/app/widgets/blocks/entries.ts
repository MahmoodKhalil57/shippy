import { html, nothing } from "lit";
import "../../../components/index.ts";
import { actionBar, cell, tag } from "../blocks.ts";
import { defineBlock, renderBlock, type ViewContext } from "../registry.ts";
import type { Entry, Tag } from "../schema.ts";
import { m } from "../../../i18n/index.ts";

const PEOPLE: Record<NonNullable<NonNullable<Entry["people"]>[number]["state"]>, Tag> = {
  done: { label: "", tone: "success", icon: "check" },
  declined: { label: "", tone: "error", icon: "x" },
  waiting: { label: "", tone: "neutral" },
};

function parts(e: Entry, ctx: ViewContext) {
  const people = e.people ?? [];
  const said = people.filter((p) => p.note);
  return html`
    ${
      e.summary
        ? ctx.mount(
            "ui-ai-summary",
            { type: "tldr", auto: true, context: e.summary.context, text: e.summary.text },
            `entry:${e.id ?? e.heading}`,
          )
        : nothing
    }
    ${e.text ? html`<ui-text variant="body-md" pre-line>${e.text}</ui-text>` : nothing}
    ${
      e.facts?.length
        ? html`<ui-description-list
            layout="inline"
            .items=${e.facts.map((f) => ({ label: f.label, value: cell(f.value), note: f.note }))}
          ></ui-description-list>`
        : nothing
    }
    ${
      people.length
        ? html`<ui-flex direction="col" gap="1">
            <ui-flex gap="2" align="center" wrap
              >${people.map((p) => tag({ ...PEOPLE[p.state ?? "waiting"], label: p.name }))}</ui-flex
            >
            ${said.map((p) => html`<ui-text variant="body-sm" color="muted">${p.name}: “${p.note}”</ui-text>`)}
          </ui-flex>`
        : nothing
    }
    ${e.notes?.map((n) => html`<ui-text variant="body-sm" color="muted" pre-line>${n}</ui-text>`)}
    ${e.notice ? html`<ui-alert .tone=${e.notice.tone ?? "info"} .description=${e.notice.text}></ui-alert>` : nothing}
  `;
}

const doing = (e: Entry, ctx: ViewContext) =>
  e.attach
    ? html`<ui-flex direction="col" gap="2"
        >${renderBlock({ type: "attach", ...e.attach }, ctx)}${actionBar(e.actions, ctx)}</ui-flex
      >`
    : actionBar(e.actions, ctx);

const heading = (e: Entry) => (e.href ? html`<ui-link .href=${e.href}>${e.heading}</ui-link>` : e.heading);
const tags = (e: Entry) => [...(e.status ? [e.status] : []), ...(e.tags ?? [])];
const meta = (e: Entry) => (e.meta ?? []).filter(Boolean).join(" · ");

const card = (e: Entry, ctx: ViewContext) =>
  html`<ui-card size="sm" .subhead=${meta(e)}>
    <span slot="heading">${heading(e)}</span>
    ${tags(e).length ? html`<ui-flex slot="trailing" gap="1" align="center" wrap>${tags(e).map(tag)}</ui-flex>` : nothing}
    ${parts(e, ctx)}
    ${e.actions?.length || e.attach ? html`<ui-flex slot="actions" direction="col">${doing(e, ctx)}</ui-flex>` : nothing}
  </ui-card>`;

const row = (e: Entry, ctx: ViewContext) =>
  html`<ui-flex direction="col" gap="3">
    <ui-flex direction="col" gap="1">
      <ui-flex gap="2" align="center" justify="between" wrap>
        <ui-heading level="3" variant="title-sm">${heading(e)}</ui-heading>
        ${tags(e).length ? html`<ui-flex gap="1" align="center" wrap>${tags(e).map(tag)}</ui-flex>` : nothing}
      </ui-flex>
      ${meta(e) ? html`<ui-text variant="body-sm" color="muted">${meta(e)}</ui-text>` : nothing}
    </ui-flex>
    ${parts(e, ctx)} ${doing(e, ctx)}
  </ui-flex>`;

defineBlock("entries", (b, ctx) => {
  if (!b.items.length) return html`<ui-text variant="body-md" color="muted">${b.empty ?? m.widget_empty()}</ui-text>`;
  if (ctx.inCard)
    return html`<ui-flex direction="col" gap="4"
      >${b.items.map((e, i) => html`${i ? html`<ui-divider></ui-divider>` : nothing}${row(e, ctx)}`)}</ui-flex
    >`;
  return html`<ui-grid fit="md" gap="4">${b.items.map((e) => card(e, ctx))}</ui-grid>`;
});
