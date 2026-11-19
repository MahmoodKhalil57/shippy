# State audit — Golden Sea Sourcing Desk (docs/ demo → frontend/ Payload stack)

Every piece of state the static demo (`docs/`) holds, classified by where it belongs after the migration:

- **Frontend store** (`src/stores/*`) — UI and session state. Never sent to the server; some of it is kept in `localStorage`.
- **Backend collection** (`src/cms/collections/*`) — business records with many rows, each with its own id, access rules and hooks.
- **Backend global** (`src/cms/globals/*`) — one-per-company configuration.
- **Derived** — computed from backend records (custom endpoints or page code). Never stored.
- **Static content** — the pitch/proposal material. Stays as constants in the page code.

## 1. Frontend stores

| Demo state (`docs/core.js` → `state.*` unless noted)       | Store                      | Persisted | Notes                                                      |
| ---------------------------------------------------------- | -------------------------- | --------- | ---------------------------------------------------------- |
| `theme` (localStorage `gs-theme`)                          | `preferences.theme`        | yes       | `system` / `light` / `dark`                                |
| demo-script ticks (localStorage `gs-demo-done`)            | `tour.completed`           | yes       | per browser                                                |
| active guided tour + step (`tour.js`)                      | `tour.active`, `tour.step` | no        |                                                            |
| `role` ("Viewing as")                                      | `session.viewAs`           | no        | demo only; the real role comes from `/api/users/me`        |
| `preset` (demo timeline)                                   | `session.demoPreset`       | no        | demo only; a real case moves through stages                |
| `inboxSel`                                                 | `inbox.selectedId`         | no        |                                                            |
| `inboxAI` (draft extraction before confirming)             | `inbox.drafts`             | no        | the confirmed result is saved on the `intake-messages` doc |
| `caseView`, `caseFilter`, `wait`, `type` query params      | `filters.cases`            | yes       | list / board, waiting state, case type, owner scope        |
| supplier filter `?f=`                                      | `filters.suppliers`        | yes       |                                                            |
| coverage filter `?c=`                                      | `filters.coverage`         | no        |                                                            |
| settings tab `?tab=`                                       | `ui.settingsTab`           | no        |                                                            |
| case workspace tab (route)                                 | `ui.caseTab`               | no        | the route stays the source of truth                        |
| `q` / command palette (open, query, highlighted index)     | `palette`                  | no        |                                                            |
| dialogs (`dialogHandler`) and their form drafts            | `ui.dialog`                | no        |                                                            |
| toasts                                                     | `toasts`                   | no        | queue with auto-dismiss                                    |
| `briefing` (AI summary text)                               | `ui.briefing`              | no        | cache of `/api/briefing/:user`                             |
| "select with reason" form draft, margin inputs before save | component state            | no        | saved values go to the backend                             |

## 2. Backend collections

| Demo source                                                       | Collection                | Key fields / behaviour                                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `D.users`                                                         | `users` (auth, extended)  | role (+ finance-director, office-admin), phone, on-call                                                                                                                                                                                          |
| `D.customers`                                                     | `customers` (extended)    | type, segment, billing entity, tax id, terms, currency, contact rule (enum), port preferences, vendor registration, contacts[]                                                                                                                   |
| `customers.fleet`                                                 | `vessels`                 | name, IMO (unique, validated), type, owner / manager customer                                                                                                                                                                                    |
| `D.suppliers`                                                     | `suppliers` (extended)    | kind (local / agency principal / own stock), approval status, categories, currency, terms, contacts[], performance, bank details (+ verification), source                                                                                        |
| `D.products`                                                      | `products`                | aliases[], store, IMPA series, brand, OEM, IMPA / ISSA / HS, unit, pack conversions[], specs, certificates, shelf life, cold-chain / bond flags, agency principal                                                                                |
| `D.priceHistory`                                                  | `supplier-prices`         | product × supplier dated price, validity, source (case / email / PO / pricelist), ordered?                                                                                                                                                       |
| agency pricelists                                                 | `pricelists`              | principal, version, currency, discount, validity, file, approval                                                                                                                                                                                 |
| own stock (`offers.GS`)                                           | `stock`                   | product, warehouse, on hand, reserved, avg cost, lots[] (lot, expiry, qty)                                                                                                                                                                       |
| `D.inbox` + `inboxAI` + `reviewed` + `inboxDone`                  | `intake-messages`         | channel, message-id (unique → idempotent), classification, status, match {case, confidence, basis}, extraction {header[], lines[], missing[]}, created case                                                                                      |
| `D.cases`, `mainCase`                                             | `cases` (extended)        | case type, customer ref, vessel, agent, ETA, quote deadline, currency, owner / backup, stage, decision, wait, risk, items[] (requested lines), clarifications[], pricing {allocation, discount, charges[]}, service {AWB, customs}, held storage |
| `supplierRfqs`                                                    | `supplier-rfqs`           | reference, case, supplier, lines, sent / due, status (7 states), reminders, next reminder, anonymised check                                                                                                                                      |
| `mainCase.offers`                                                 | `offers`                  | case, line, supplier, version / supersedes, price, currency, packs × pack size, lead, validity, terms, basis, source, evidence, deviations, compliance                                                                                           |
| `state.selected` / `selReason` / `customerAccepted` / `margins`   | `cases.items[].selection` | selected offer(s) + split quantities, reason, customer acceptance + evidence, margin %                                                                                                                                                           |
| quotation preview + `quoteStatus` / `quoteVersion` / `submission` | `quotations`              | version, status, line snapshot, totals, FX, discount, validity, terms, submission {method, portal check, receipt}                                                                                                                                |
| `D.approvals` / `approvals`                                       | `approvals`               | type, related doc, approvers, two-person rule, decisions[]; status computed by a hook                                                                                                                                                            |
| `lifecycle.customerPO` + `poResolved`                             | `customer-pos`            | number, quotation version, checks[] with resolution and evidence, unawarded lines, status                                                                                                                                                        |
| `lifecycle.supplierPOs`                                           | `purchase-orders`         | supplier, lines, amount, acknowledgement, pro forma, deposit, status                                                                                                                                                                             |
| bills, `duplicateBill`                                            | `supplier-bills`          | supplier + number unique (blocks duplicates), PO match (ordered = received = billed), hold reason, credit notes                                                                                                                                  |
| `lifecycle.receipts`                                              | `receipts`                | PO, line, received / ordered, lot, expiry, QC result, damage claim                                                                                                                                                                               |
| `lifecycle.deliveries` + `etaChange`                              | `deliveries`              | number, plan (vehicle, boarding staff, launch), lines, dispatched / confirmed, evidence                                                                                                                                                          |
| `lifecycle.invoices`                                              | `invoices`                | basis delivery, amount, VAT treatment, e-invoice {status, UUID}, due, status                                                                                                                                                                     |
| `lifecycle.payables` + payments                                   | `payments`                | direction in / out, invoice or bill, amount, reference, approval                                                                                                                                                                                 |
| `timeline` + `audit`                                              | `activities`              | case / entity, kind (auto / human / alert), text, actor, undoable                                                                                                                                                                                |
| `D.steps`, reminders, follow-ups                                  | `tasks`                   | type, channel, due, script, owner, status, outcome, contact-rule check                                                                                                                                                                           |
| `D.opportunities`                                                 | `opportunities`           | stage, owner, next step (missing → flagged), value, source, customer link                                                                                                                                                                        |
| `D.registrations`                                                 | `vendor-registrations`    | company, portal, status, documents, next step                                                                                                                                                                                                    |
| `D.campaigns`                                                     | `campaigns`               | list, content approval, schedule, send permission                                                                                                                                                                                                |
| `D.exceptions` / `exceptions`                                     | `integration-exceptions`  | source, impact, status, retries, idempotency key                                                                                                                                                                                                 |
| attachments, PODs, certificates                                   | `media` (exists)          |                                                                                                                                                                                                                                                  |

## 3. Backend globals

| Demo source                                        | Global                |
| -------------------------------------------------- | --------------------- |
| company basics, working hours, VAT, numbering      | `settings` (extended) |
| `fx`, `fxHistory`, `fxApproved`                    | `fx-rates`            |
| pricing policy tab, `MIN_MARGIN`                   | `pricing-policy`      |
| approval routing (who approves what, thresholds)   | `approval-rules`      |
| `D.automations`                                    | `automation-rules`    |
| templates tab, acknowledgement template            | `message-templates`   |
| integrations page, 90-day import, `importApproved` | `integrations`        |
| after-hours rule roster                            | `on-call-roster`      |

## 4. Derived (computed, never stored)

- Line status, best-fit offer, normalised price per base unit, landed cost, margin / markup, pricing checks: from `cases` + `offers` + globals (`docs/core.js` → `m.*`).
- Waiting-state counts, queue sorting, daily briefing, management KPIs and charts (`D.analytics`): aggregate endpoints over `cases`, `quotations`, `invoices`, etc.
- Supplier performance roll-ups and customer stats: from `purchase-orders`, `deliveries`, `quotations`.
- Permissions matrix: from `users.role` + `approval-rules`.

## 5. Static content (stays in page code)

Requirement coverage, application map, pilot plan, KPI targets, proposal costs, demo-script scenarios, and the tour scripts.
