import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fireEvent, fn, waitFor, within } from "storybook/test";
import "./doc-form.ts";
import type { DocFormChange, JoinView, RelationOption, UiDocForm } from "./doc-form.ts";
import type { FieldLike } from "../../../lib/contracts/config.ts";
import { AI_CHANGE } from "../../../lib/agent/ai-polyfill.ts";

type Data = Record<string, unknown>;
type Spy = ReturnType<typeof fn>;

const last = (spy: unknown) => {
  const calls = (spy as Spy).mock.calls;
  return calls[calls.length - 1]![0].detail as DocFormChange;
};
const form = (root: HTMLElement) => root.querySelector("ui-doc-form") as UiDocForm;

const contact: FieldLike[] = [
  {
    type: "text",
    name: "fullName",
    required: true,
    maxLength: 40,
    admin: { placeholder: "First and last name", description: "As it appears on the contract." },
    custom: { about: "Used on every document we send." },
  },
  { type: "email", name: "email", label: "Work email" },
  { type: "checkbox", name: "subscribed", label: "Newsletter" },
  { type: "textarea", name: "notes" },
];

const samples = {
  contact,
  contactValue: { fullName: "Ada", email: "", subscribed: false } as Data,
  text: [
    { type: "text", name: "nickname", label: false, admin: { autoComplete: "nickname" } },
    { type: "text", name: "keywords", hasMany: true, maxLength: 10 },
    { type: "text", name: "aliases", hasMany: true, admin: { placeholder: "Add an alias" } },
    { type: "text", name: "labels", hasMany: true },
    { type: "text", name: "postal_code", minLength: 3 },
    { type: "code", name: "snippet", admin: { language: "html", rows: 4 } },
    { type: "code", name: "script" },
    { type: "richText", name: "body" },
    { type: "json", name: "settings" },
    { type: "json", name: "extra", admin: { rows: 3 } },
    { type: "point", name: "location" },
    { type: "point", name: "spot" },
    { type: "text", name: "flagText" },
    { type: "text", name: "objText" },
    { type: "checkbox", name: "agree", label: false, custom: { input: "checkbox" } },
    { type: "signature", name: "signature" },
    { type: "ui", name: "banner" },
    { type: "text", name: "secret", hidden: true },
    { type: "text", name: "internal", admin: { hidden: true } },
    { type: "text", name: "legacy", admin: { disabled: true } },
  ] satisfies FieldLike[],
  textValue: {
    keywords: ["fast", 7],
    body: { root: { children: [] } },
    settings: { theme: "dark" },
    location: [12.5, null],
    flagText: true,
    objText: { a: 1 },
  } as Data,
  numbers: [
    { type: "number", name: "quantity", min: 1, max: 500, admin: { step: 5, placeholder: "How many" } },
    { type: "number", name: "weight", custom: { suffix: "kg" } },
    { type: "number", name: "price", custom: { number: { unit: "money", currency: "EUR" } } },
    { type: "number", name: "fee", custom: { number: { unit: "money", currencyField: "currency" } } },
    { type: "number", name: "deposit", custom: { number: { unit: "money" } } },
    { type: "number", name: "refund", custom: { number: { unit: "money", currencyField: "refundCurrency" } } },
    { type: "text", name: "currency" },
    { type: "number", name: "margin", custom: { number: { unit: "pct" } } },
    { type: "number", name: "discount", min: 0, max: 50, custom: { number: { unit: "pct" } } },
    { type: "number", name: "probability", min: 0, max: 1 },
    { type: "number", name: "volume", min: 0, max: 200, custom: { input: "slider", suffix: " l" } },
    { type: "number", name: "level", custom: { input: "slider" } },
    { type: "number", name: "terms", custom: { number: { unit: "days" } } },
    {
      type: "number",
      name: "seats",
      custom: { input: "stepper", suffix: "seats" },
      min: 1,
      max: 9,
      admin: { step: 1 },
    },
    { type: "number", name: "floors", custom: { input: "stepper" } },
    {
      type: "number",
      name: "rating",
      min: 1,
      max: 5,
      required: true,
      custom: { words: ["Poor", "Fair", "Good", "Great", "Superb"] },
    },
    { type: "number", name: "stars", custom: { input: "rating" } },
    { type: "number", name: "effort", min: 1, max: 7, custom: { low: "Easy", high: "Hard" } },
    { type: "number", name: "urgency", custom: { input: "scale" } },
    { type: "number", name: "sizes", hasMany: true },
    { type: "number", name: "codes", hasMany: true, admin: { placeholder: "Add a code" } },
    { type: "number", name: "share", custom: { input: "percent" }, hasMany: true },
  ] satisfies FieldLike[],
  numbersValue: {
    quantity: 20,
    fee: 12,
    currency: "GBP",
    probability: 0.4,
    terms: 30,
    rating: 4,
    sizes: [38, 40],
  } as Data,
  choices: [
    { type: "select", name: "priority", options: ["Low", "Medium", "High"] },
    {
      type: "select",
      name: "status",
      options: [
        { label: "Open", value: "open" },
        { label: "Won", value: "won" },
        { label: { en: "Lost" }, value: "lost" },
      ],
      custom: { tones: { open: "info", won: "success" } },
    },
    {
      type: "select",
      name: "channels",
      hasMany: true,
      options: ["Email", "Phone", "Chat"],
    },
    {
      type: "select",
      name: "country",
      required: true,
      options: ["Canada", "Denmark", "Egypt", "France", "Germany", "India", "Japan", "Kenya", "Mexico", "Peru"],
      admin: { placeholder: "Pick a country" },
    },
    {
      type: "select",
      name: "languages",
      hasMany: true,
      options: ["Arabic", "Danish", "Dutch", "English", "French", "German", "Hindi", "Japanese", "Spanish"],
    },
    {
      type: "select",
      name: "plan",
      options: [
        { label: "Starter", value: "starter" },
        { label: "Growth", value: "growth" },
        { label: "Enterprise", value: "enterprise" },
        { label: "Legacy", value: "legacy" },
        { label: "Custom", value: "custom" },
      ],
      filterOptions: ({ siblingData }: Record<string, unknown>) =>
        (siblingData as Data).priority === "High" ? ["enterprise", { value: "custom" }] : ["starter", "growth"],
      admin: { isClearable: false },
    },
    {
      type: "select",
      name: "region",
      options: ["North", "South", "East", "West", "Central"],
      filterOptions: () => true,
    },
    {
      type: "select",
      name: "size",
      options: ["S", "M", "L", "XL"],
      custom: { input: "select" },
      filterOptions: () => ["S", "M"],
    },
    { type: "radio", name: "delivery", options: ["Standard", "Express", "Pickup", "Courier", "Freight"] },
    {
      type: "radio",
      name: "billing",
      options: [
        { label: "Monthly", value: "monthly" },
        { label: "Yearly", value: "yearly" },
      ],
      admin: { layout: "vertical" },
      custom: { input: "radio" },
    },
  ] satisfies FieldLike[],
  choicesValue: { status: "open", channels: ["Email"], plan: "legacy", size: "XL" } as Data,
  dates: [
    {
      type: "date",
      name: "startDate",
      admin: { date: { minDate: "2026-01-01", maxDate: new Date("2026-12-31T12:00:00") } },
    },
    { type: "date", name: "signedOn", required: true },
    { type: "date", name: "dueDate" },
    { type: "date", name: "meetingAt", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { type: "date", name: "opensAt", admin: { date: { pickerAppearance: "timeOnly" } } },
    { type: "date", name: "closesAt", admin: { date: { pickerAppearance: "timeOnly" } } },
    { type: "date", name: "period", admin: { date: { pickerAppearance: "monthOnly" } } },
    { type: "date", name: "renewal", admin: { date: { pickerAppearance: "weekly" as "dayOnly" } } },
  ] satisfies FieldLike[],
  datesValue: {
    startDate: "2026-03-05T00:00:00.000Z",
    dueDate: "not a date",
    meetingAt: new Date(2026, 2, 5, 14, 30),
    closesAt: new Date(2026, 2, 5, 17, 0).toISOString(),
    period: 12,
  } as Data,
};

const relations: Record<string, RelationOption[]> = {
  companies: [
    { value: "c1", label: "Harbour Logistics", description: "Shipping", doc: { id: "c1", active: true } },
    { value: "c2", label: "Summit Foods", doc: { id: "c2", active: false } },
    { value: "c3", label: "Riverside Clinic" },
  ],
  people: [
    { value: "p1", label: "Jordan Lee" },
    { value: "p2", label: "Sam Patel" },
  ],
  media: [
    { value: "m1", label: "Floor plan", image: "data:image/gif;base64,R0lGODlhAQABAAAAACw=" },
    { value: "m2", label: "Brochure" },
  ],
};

const relationFields: FieldLike[] = [
  { type: "relationship", name: "company", relationTo: "companies", required: true },
  { type: "relationship", name: "activeCompany", relationTo: "companies", filterOptions: { active: { equals: true } } },
  { type: "relationship", name: "partners", relationTo: "companies", hasMany: true, admin: { allowCreate: false } },
  {
    type: "relationship",
    name: "anyCompany",
    relationTo: "companies",
    filterOptions: ({ relationTo }: Record<string, unknown>) => (relationTo === "companies" ? false : true),
  },
  { type: "relationship", name: "pending", relationTo: "companies", filterOptions: () => Promise.resolve(true) },
  { type: "relationship", name: "contact", relationTo: ["companies", "people"], admin: { allowEdit: false } },
  { type: "relationship", name: "watchers", relationTo: ["companies", "people"], hasMany: true },
  { type: "relationship", name: "fixedContact", relationTo: ["companies", "people"], filterOptions: () => false },
  { type: "relationship", name: "owner", relationTo: "people", admin: { readOnly: true } },
  { type: "relationship", name: "missing", relationTo: "unknown" },
  { type: "relationship", name: "orphan" },
  { type: "upload", name: "cover", relationTo: "media" },
  { type: "upload", name: "gallery", relationTo: "media", hasMany: true },
];

const rowsFields: FieldLike[] = [
  {
    type: "array",
    name: "lineItems",
    required: true,
    minRows: 1,
    maxRows: 3,
    labels: { singular: "Line", plural: "Lines" },
    admin: { description: "What the customer is buying." },
    fields: [
      { type: "text", name: "product" },
      { type: "number", name: "qty" },
    ],
  } as FieldLike,
  {
    type: "array",
    name: "phones",
    maxRows: 2,
    admin: { isSortable: false },
    fields: [
      {
        type: "select",
        name: "kind",
        options: [
          { label: "Mobile", value: "mobile" },
          { label: "Office", value: "office" },
        ],
      },
      { type: "number", name: "number" },
    ],
  },
  {
    type: "array",
    name: "milestones",
    minRows: 2,
    labels: { singular: "Milestone" },
    admin: { initCollapsed: true },
    fields: [
      { type: "number", name: "step" },
      { type: "checkbox", name: "done" },
    ],
  } as FieldLike,
  { type: "array", name: "attachments", label: "", fields: [{ type: "upload", name: "file", relationTo: "media" }] },
];

const blocksField: FieldLike[] = [
  {
    type: "blocks",
    name: "sections",
    labels: { plural: "Page sections" },
    blocks: [
      { slug: "hero", labels: { singular: "Hero banner" }, fields: [{ type: "text", name: "headline" }] },
      { slug: "quote", fields: [{ type: "textarea", name: "quote" }], admin: { disableBlockName: true } } as never,
      { slug: "gallery", fields: [{ type: "upload", name: "image", relationTo: "media" }] },
    ],
    filterOptions: ({ user }: Record<string, unknown>) =>
      (user as Data | null)?.role === "editor" ? ["hero", "quote"] : true,
  } as FieldLike,
  {
    type: "blocks",
    name: "footer",
    labels: { singular: "Footer item" },
    maxRows: 1,
    blocks: [{ slug: "links", fields: [{ type: "text", name: "title" }] }],
  } as FieldLike,
];

const joins: Record<string, JoinView> = {
  deals: {
    columns: [
      { key: "name", label: "Deal" },
      { key: "stage", label: "Stage" },
    ],
    rows: [
      { id: "d1", href: "/deals/d1", cells: { name: "Annual renewal", stage: "Won" } },
      { id: "d2", cells: { name: "Pilot", stage: "Open" } },
    ],
    total: 5,
    createHref: "/deals/new",
  },
  tasks: { columns: [{ key: "title", label: "Task" }], rows: [], total: 0, createHref: "/tasks/new" },
  notes: {
    columns: [{ key: "title", label: "Note" }],
    rows: [{ id: "n1", cells: { title: "Called back" } }],
    total: 1,
  },
};

const joinFields: FieldLike[] = [
  { type: "join", name: "deals", admin: { description: "Deals for this account." } },
  { type: "join", name: "tasks", admin: { allowCreate: false } },
  { type: "join", name: "notes" },
  { type: "join", name: "invoices" },
];

const meta = preview
  .type<{
    args: {
      fields: FieldLike[];
      value: Data;
      errors: Record<string, string>;
      relations: Record<string, RelationOption[]>;
      readonly: boolean;
      joins: Record<string, JoinView>;
      relationHref?: (slug: string, id?: string) => string;
      user: Data | null;
      today: string;
      what: string;
      contextFields?: FieldLike[];
      onChange: (e: CustomEvent<DocFormChange>) => void;
    };
  }>()
  .meta({
    title: "Composed/Forms/Doc Form",
    component: "ui-doc-form",
    args: {
      fields: contact,
      value: samples.contactValue,
      errors: {},
      relations,
      readonly: false,
      joins,
      relationHref: undefined,
      user: null,
      today: "2026-03-05",
      what: "contact",
      contextFields: undefined,
      onChange: fn(),
    },
    argTypes: {
      fields: { control: "object", description: "Payload field configs to render." },
      value: { control: "object", description: "The document being edited." },
      errors: { control: "object", description: "Server errors keyed by dotted path." },
      relations: { control: "object", description: "Options for relationship and upload fields, by collection slug." },
      readonly: { control: "boolean", description: "Locks every control." },
      joins: { control: "object", description: "Rows for join fields, by field name." },
      relationHref: { control: false, description: "Builds links to related documents." },
      user: { control: "object", description: "The signed-in user, passed to filterOptions." },
      today: { control: "text", description: "Today as YYYY-MM-DD, for date shortcuts and suggestions." },
      what: { control: "text", description: "What the document is, for suggestions." },
      contextFields: { control: "object", description: "Fields read for suggestion context instead of fields." },
      onChange: { table: { category: "events" } },
    },
    render: (args) =>
      html`<ui-doc-form
        .fields=${args.fields}
        .value=${args.value}
        .errors=${args.errors}
        .relations=${args.relations}
        ?readonly=${args.readonly}
        .joins=${args.joins}
        .relationHref=${args.relationHref}
        .user=${args.user}
        today=${args.today}
        what=${args.what}
        .contextFields=${args.contextFields}
        @ui-change=${(e: CustomEvent<DocFormChange>) => e.target === e.currentTarget && args.onChange(e)}
      ></ui-doc-form>`,
  });

const noAi = { LanguageModel: undefined, Proofreader: undefined, Rewriter: undefined };

const withGlobals = async (stubs: Record<string, unknown>, run: () => Promise<void>) => {
  const g = globalThis as unknown as Record<string, unknown>;
  const saved = Object.keys(stubs).map((k) => [k, Object.getOwnPropertyDescriptor(g, k)] as const);
  try {
    for (const [k, v] of Object.entries(stubs))
      Object.defineProperty(g, k, { value: v, configurable: true, writable: true });
    dispatchEvent(new Event(AI_CHANGE));
    await run();
  } finally {
    for (const [k, d] of saved) {
      if (d) Object.defineProperty(g, k, d);
      else delete g[k];
    }
    dispatchEvent(new Event(AI_CHANGE));
  }
};

export const Playground = meta.story({
  name: "Playground",
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      const name = await canvas.findByRole("textbox", { name: "Full Name" });
      await expect(name).toHaveValue("Ada");
      await expect(name).toHaveAttribute("placeholder", "First and last name");
      await userEvent.click(canvas.getByRole("button", { name: "About Full Name" }));
      await waitFor(() => expect(canvas.getByText("Used on every document we send.")).toBeVisible());
      await expect(canvas.getAllByText("As it appears on the contract.")[0]).toBeVisible();
      await expect(canvas.getByText("3 / 40")).toBeVisible();
      await userEvent.type(name, " Lovelace");
      await expect(last(args.onChange)).toEqual({
        value: { fullName: "Ada Lovelace", email: "", subscribed: false },
        path: ["fullName"],
        fieldValue: "Ada Lovelace",
      });
      await userEvent.clear(name);
      await waitFor(() => expect(canvas.getByText("Fill this in to save.")).toBeVisible());
      await expect(name.closest("ui-text-input")?.color).toBe("error");
      await userEvent.type(name, "Grace");
      await waitFor(() => expect(canvas.queryByText("Fill this in to save.")).toBeNull());
      const email = canvas.getByRole("textbox", { name: "Work email" });
      await expect(email).toHaveAttribute("type", "email");
      await userEvent.type(email, "grace");
      await waitFor(() => expect(canvas.getByText("An email address, like name@company.com.")).toBeVisible());
      await userEvent.type(email, "@example.com");
      await waitFor(() => expect(canvas.queryByText("An email address, like name@company.com.")).toBeNull());
      const toggle = canvas.getByRole("switch", { name: "Newsletter" });
      await expect(toggle).not.toBeChecked();
      await userEvent.click(toggle);
      await expect(last(args.onChange)).toMatchObject({ path: ["subscribed"], fieldValue: true });
      await expect(toggle).toBeChecked();
      await userEvent.type(canvas.getByRole("textbox", { name: "Notes" }), "Met at the fair.");
      await expect(last(args.onChange).value).toEqual({
        fullName: "Grace",
        email: "grace@example.com",
        subscribed: true,
        notes: "Met at the fair.",
      });
    }),
});

export const TextAndStructuredFields = meta.story({
  name: "Text and structured fields",
  args: { fields: samples.text, value: samples.textValue },
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      const nickname = canvas.getByRole("textbox", { name: "Nickname" });
      await expect(nickname).toHaveAttribute("autocomplete", "nickname");
      await expect(nickname.closest("ui-field")!.querySelector("label")?.textContent?.trim() ?? "").toBe("");
      await userEvent.type(nickname, "Al");
      await expect(last(args.onChange)).toMatchObject({ path: ["nickname"], fieldValue: "Al" });

      const keywords = canvas.getByRole("combobox", { name: "Keywords" });
      await expect(canvas.getByText("fast")).toBeVisible();
      await expect(canvas.getByText("7")).toBeVisible();
      await expect(keywords).toHaveAttribute("placeholder", "");
      await expect(canvas.getByRole("combobox", { name: "Labels" })).toHaveAttribute(
        "placeholder",
        "Type and press Enter",
      );
      await userEvent.type(keywords, "cheap{Enter}");
      await expect(last(args.onChange)).toMatchObject({ path: ["keywords"], fieldValue: ["fast", "7", "cheap"] });
      await expect(canvas.getByRole("combobox", { name: "Aliases" })).toHaveAttribute("placeholder", "Add an alias");

      const postal = canvas.getByRole("textbox", { name: "Postal code" });
      await userEvent.type(postal, "1");
      await waitFor(() => expect(canvas.getByText(/At least 3/)).toBeVisible());

      const snippet = canvas.getByRole("textbox", { name: "Snippet · html" });
      await expect(snippet).toHaveAttribute("rows", "4");
      await userEvent.type(snippet, "<p>");
      await expect(last(args.onChange)).toMatchObject({ path: ["snippet"], fieldValue: "<p>" });
      await expect(canvas.getByRole("textbox", { name: "Script" })).toHaveAttribute("rows", "8");
      const body = canvas.getByRole("textbox", { name: "Body" });
      await expect(body).toHaveValue('{"root":{"children":[]}}');
      await expect(body).toHaveAttribute("rows", "3");

      const settings = canvas.getByRole("textbox", { name: "Settings" });
      await expect(settings).toHaveValue('{\n  "theme": "dark"\n}');
      await userEvent.clear(settings);
      await expect(last(args.onChange)).toMatchObject({ path: ["settings"], fieldValue: null });
      await userEvent.type(settings, "{{");
      await waitFor(() => expect(canvas.getByText("Not valid JSON yet; it's saved once it is.")).toBeVisible());
      await expect(settings).toHaveValue("{");
      await userEvent.type(settings, '"a":1}');
      await expect(last(args.onChange)).toMatchObject({ path: ["settings"], fieldValue: { a: 1 } });
      await waitFor(() => expect(canvas.queryByText("Not valid JSON yet; it's saved once it is.")).toBeNull());
      await expect(canvas.getByRole("textbox", { name: "Extra" })).toHaveAttribute("rows", "3");
      await expect(canvas.getByRole("textbox", { name: "Extra" })).toHaveValue("");

      const longitude = canvas.getAllByRole("spinbutton", { name: "Longitude" })[0]!;
      const latitude = canvas.getAllByRole("spinbutton", { name: "Latitude" })[0]!;
      await expect(longitude).toHaveValue(12.5);
      await expect(latitude).toHaveValue(null);
      await userEvent.type(latitude, "4");
      await expect(last(args.onChange)).toMatchObject({ path: ["location"], fieldValue: [12.5, 4] });
      await userEvent.clear(longitude);
      await expect(last(args.onChange)).toMatchObject({ path: ["location"], fieldValue: [null, 4] });

      await expect(canvas.getAllByRole("spinbutton", { name: "Longitude" })[1]).toHaveValue(null);
      await expect(canvas.getByRole("textbox", { name: "Flag Text" })).toHaveValue("true");
      await expect(canvas.getByRole("textbox", { name: "Obj Text" })).toHaveValue('{"a":1}');
      const agree = canvas.getByRole("checkbox", { name: "Agree" });
      await userEvent.click(agree);
      await expect(last(args.onChange)).toMatchObject({ path: ["agree"], fieldValue: true });
      await expect(canvas.getByText('Signature: unsupported field type "signature"')).toBeVisible();
      await expect(canvas.queryByText("Banner")).toBeNull();
      await expect(canvas.queryByRole("textbox", { name: "Secret" })).toBeNull();
      await expect(canvas.queryByRole("textbox", { name: "Internal" })).toBeNull();
      await expect(canvas.queryByRole("textbox", { name: "Legacy" })).toBeNull();
    }),
});

export const NumberFields = meta.story({
  name: "Number fields",
  args: { fields: samples.numbers, value: samples.numbersValue },
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      const qty = await canvas.findByRole("spinbutton", { name: "Quantity" });
      await expect(qty).toHaveValue(20);
      await expect(qty).toHaveAttribute("step", "5");
      await expect(qty).toHaveAttribute("min", "1");
      await expect(qty).toHaveAttribute("max", "500");
      await expect(qty).toHaveAttribute("placeholder", "How many");
      await userEvent.clear(qty);
      await expect(last(args.onChange)).toMatchObject({ path: ["quantity"], fieldValue: null });
      await userEvent.type(qty, "600");
      await expect(last(args.onChange)).toMatchObject({ path: ["quantity"], fieldValue: 600 });
      await waitFor(() => expect(canvas.getByText("500 or less.")).toBeVisible());
      const weight = canvas.getByRole("spinbutton", { name: "Weight" });
      await expect(weight).toHaveAttribute("step", "any");
      await expect(canvas.getByText("kg")).toBeVisible();
      await expect(canvas.getByText("EUR")).toBeVisible();
      await expect(canvas.getByText("GBP")).toBeVisible();
      await expect(canvas.getByRole("spinbutton", { name: "Fee" })).toHaveValue(12);
      await expect(canvas.getByRole("spinbutton", { name: "Deposit" })).toHaveValue(null);
      await expect(
        canvas.getByRole("spinbutton", { name: "Refund" }).closest("ui-text-input")?.leading,
      ).toBeUndefined();
      await expect(canvas.getByRole("spinbutton", { name: "Fee" }).closest("ui-text-input")?.leading).toBe("GBP");
      await expect(canvas.getByText("%")).toBeVisible();

      const discount = canvas.getByRole("slider", { name: "Discount" });
      await expect(discount).toHaveValue("0");
      await fireEvent.input(discount, { target: { value: "15" } });
      await expect(last(args.onChange)).toMatchObject({ path: ["discount"], fieldValue: 15 });
      await expect(discount).toHaveAttribute("aria-valuetext", "15%");
      const probability = canvas.getByRole("slider", { name: "Probability" });
      await expect(probability).toHaveAttribute("step", "0.01");
      await expect(probability).toHaveAttribute("aria-valuetext", "40%");
      const volume = canvas.getByRole("slider", { name: "Volume" });
      await fireEvent.input(volume, { target: { value: "120" } });
      await expect(volume).toHaveAttribute("aria-valuetext", "120 l");
      await expect(canvas.getByRole("slider", { name: "Level" })).toHaveAttribute("aria-valuetext", "0");

      const terms = canvas.getByRole("spinbutton", { name: "Terms" });
      await expect(terms).toHaveValue(30);
      await expect(canvas.getByText("days")).toBeVisible();
      await userEvent.click(canvas.getByRole("button", { name: "More Terms" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["terms"], fieldValue: 31 });
      await userEvent.click(canvas.getByRole("button", { name: "More Seats" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["seats"], fieldValue: 2 });
      await expect(canvas.getByText("seats")).toBeVisible();
      await expect(canvas.getByRole("spinbutton", { name: "Floors" })).toHaveValue(null);

      await expect(canvas.getByRole("radiogroup", { name: "Rating" })).toBeVisible();
      await userEvent.click(canvas.getByRole("radio", { name: "5: Superb" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["rating"], fieldValue: 5 });
      await userEvent.click(canvas.getByRole("radio", { name: "2 of 5" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["stars"], fieldValue: 2 });

      const effort = canvas.getByRole("radiogroup", { name: "Effort" });
      await expect(within(effort).getAllByRole("radio")).toHaveLength(7);
      await expect(canvas.getByText("Easy")).toBeVisible();
      await expect(canvas.getByText("Hard")).toBeVisible();
      await userEvent.click(within(effort).getByRole("radio", { name: "6" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["effort"], fieldValue: 6 });
      const urgency = canvas.getByRole("radiogroup", { name: "Urgency" });
      await expect(within(urgency).getAllByRole("radio")).toHaveLength(5);

      const sizes = canvas.getByRole("combobox", { name: "Sizes" });
      await expect(sizes).toHaveAttribute("placeholder", "");
      await userEvent.type(sizes, "42{Enter}");
      await expect(last(args.onChange)).toMatchObject({ path: ["sizes"], fieldValue: [38, 40, 42] });
      await userEvent.type(sizes, "big{Enter}");
      await expect(last(args.onChange)).toMatchObject({ path: ["sizes"], fieldValue: [38, 40, 42] });
      await expect(canvas.getByRole("combobox", { name: "Codes" })).toHaveAttribute("placeholder", "Add a code");
      await expect(canvas.getByRole("combobox", { name: "Share" })).toHaveAttribute(
        "placeholder",
        "Type a number and press Enter",
      );
    }),
});

export const ChoiceFields = meta.story({
  name: "Choice fields",
  args: { fields: samples.choices, value: samples.choicesValue },
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      const priority = await canvas.findByRole("radiogroup", { name: "Priority" });
      await userEvent.click(within(priority).getByRole("radio", { name: "High" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["priority"], fieldValue: "High" });
      const status = canvas.getByRole("radiogroup", { name: "Status" });
      await expect(within(status).getByRole("radio", { name: "Open" })).toHaveAttribute("aria-checked", "true");
      await expect(within(status).getByRole("radio", { name: "lost" })).toBeVisible();
      const channels = canvas.getByRole("group", { name: "Channels" });
      await expect(within(channels).getByRole("button", { name: "Email" })).toHaveAttribute("aria-pressed", "true");
      await userEvent.click(within(channels).getByRole("button", { name: "Chat" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["channels"], fieldValue: ["Email", "Chat"] });
      await userEvent.click(within(channels).getByRole("button", { name: "Email" }));
      await userEvent.click(within(channels).getByRole("button", { name: "Chat" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["channels"], fieldValue: [] });

      const country = canvas.getByRole("combobox", { name: "Country" });
      await expect(country).toHaveAttribute("placeholder", "Pick a country");
      await userEvent.click(country);
      await userEvent.type(country, "Ken");
      await userEvent.click(await canvas.findByRole("option", { name: /Kenya/ }));
      await expect(last(args.onChange)).toMatchObject({ path: ["country"], fieldValue: "Kenya" });

      const languages = canvas.getByRole("combobox", { name: "Languages" });
      await expect(languages).toHaveAttribute("placeholder", "Choose…");
      await userEvent.click(languages);
      await userEvent.click(await canvas.findByRole("option", { name: /Danish/ }));
      await expect(last(args.onChange)).toMatchObject({ path: ["languages"], fieldValue: ["Danish"] });

      const plan = canvas.getByRole("combobox", { name: "Plan" });
      await userEvent.click(plan);
      const offered = await canvas.findAllByRole("option");
      await expect(offered.map((o) => o.textContent?.trim())).toEqual(["Enterprise", "Legacy", "Custom"]);
      await userEvent.click(canvas.getByRole("option", { name: /Custom/ }));
      await expect(last(args.onChange)).toMatchObject({ path: ["plan"], fieldValue: "custom" });
      await expect(within(plan.closest("ui-combobox")!).queryByRole("button", { name: "Clear" })).toBeNull();

      const region = canvas.getByRole("combobox", { name: "Region" });
      await userEvent.click(region);
      await expect(await canvas.findAllByRole("option")).toHaveLength(5);
      await userEvent.click(canvas.getByRole("option", { name: /West/ }));
      await expect(last(args.onChange)).toMatchObject({ path: ["region"], fieldValue: "West" });
      await userEvent.click(await within(region.closest("ui-combobox")!).findByRole("button", { name: "Clear" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["region"], fieldValue: null });

      await userEvent.click(canvas.getByRole("combobox", { name: "Size" }));
      const sizes = await canvas.findAllByRole("option");
      await expect(sizes.map((o) => o.textContent?.trim())).toEqual(["S", "M", "XL"]);
      await userEvent.keyboard("{Escape}");

      const delivery = canvas.getByRole("radiogroup", { name: "Delivery" });
      await userEvent.click(within(delivery).getByRole("radio", { name: "Courier" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["delivery"], fieldValue: "Courier" });
      const billing = canvas.getByRole("radiogroup", { name: "Billing" });
      await userEvent.click(within(billing).getByRole("radio", { name: "Yearly" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["billing"], fieldValue: "yearly" });
    }),
});

export const DateFields = meta.story({
  name: "Date fields",
  args: { fields: samples.dates, value: samples.datesValue },
  play: async ({ canvas, userEvent, args, canvasElement }) =>
    withGlobals(noAi, async () => {
      const start = await canvas.findByLabelText("Start Date");
      await expect(start).toHaveValue(new Date("2026-03-05T00:00:00.000Z").toLocaleDateString("en-CA"));
      await expect(start).toHaveAttribute("min", "2026-01-01");
      await expect(start).toHaveAttribute("max", "2026-12-31");
      const startPicks = canvas.getByRole("group", { name: "Quick picks for Start Date" });
      await userEvent.click(within(startPicks).getByRole("button", { name: "Clear" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["startDate"], fieldValue: null });
      const signed = canvas.getByRole("group", { name: "Quick picks for Signed On" });
      await expect(within(signed).queryByRole("button", { name: "Clear" })).toBeNull();
      await userEvent.click(within(signed).getByRole("button", { name: "Tomorrow" }));
      await expect(last(args.onChange)).toMatchObject({
        path: ["signedOn"],
        fieldValue: new Date("2026-03-06").toISOString(),
      });
      const due = canvas.getByLabelText("Due Date");
      await expect(due).toHaveValue("");
      await userEvent.type(due, "2026-04-10");
      await expect(last(args.onChange)).toMatchObject({
        path: ["dueDate"],
        fieldValue: new Date("2026-04-10").toISOString(),
      });
      const meeting = canvas.getByLabelText("Meeting At");
      await expect(meeting).toHaveAttribute("type", "datetime-local");
      await expect(meeting).toHaveValue("2026-03-05T14:30");
      const opens = canvasElement.querySelector<HTMLInputElement>('input[type="time"][aria-label="Opens At"]')!;
      await expect(opens).toHaveValue("");
      await userEvent.type(opens, "09:15");
      const opened = new Date(last(args.onChange).fieldValue as string);
      await expect([opened.getHours(), opened.getMinutes()]).toEqual([9, 15]);
      const closes = canvasElement.querySelector<HTMLInputElement>('input[type="time"][aria-label="Closes At"]')!;
      await expect(closes).toHaveValue("17:00");
      await fireEvent.input(closes, { target: { value: "08:05" } });
      const closed = new Date(last(args.onChange).fieldValue as string);
      await expect([closed.getFullYear(), closed.getMonth(), closed.getDate(), closed.getHours()]).toEqual([
        2026, 2, 5, 8,
      ]);
      await userEvent.clear(closes);
      await expect(last(args.onChange)).toMatchObject({ path: ["closesAt"], fieldValue: null });
      const period = canvasElement.querySelector<HTMLInputElement>('input[type="month"]')!;
      await expect(period).toHaveValue("");
      await userEvent.type(period, "2026-07");
      await expect(last(args.onChange)).toMatchObject({
        path: ["period"],
        fieldValue: new Date("2026-07-01T00:00").toISOString(),
      });
      await expect(canvas.getByLabelText("Renewal")).toHaveAttribute("type", "date");
    }),
});

const linkTo = (slug: string, id?: string) => (id ? `/${slug}/${id}` : `/${slug}/new`);

export const RelationshipsAndUploads = meta.story({
  name: "Relationships and uploads",
  args: {
    fields: relationFields,
    relationHref: linkTo,
    value: {
      company: { id: "c1" },
      activeCompany: "c2",
      partners: ["c1", "c3"],
      contact: { relationTo: "people", value: "p2" },
      watchers: [{ relationTo: "companies", value: { id: "c3" } }],
      fixedContact: { relationTo: "people", value: "p2" },
      owner: "p1",
      cover: "m1",
      gallery: ["m1", "m2", "zz"],
    },
  },
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      const company = await canvas.findByRole("combobox", { name: "Company" });
      const companyBox = within(company.closest("ui-combobox")!);
      await expect(companyBox.getByRole("link", { name: "Open" })).toHaveAttribute("href", "/companies/c1");
      await expect(companyBox.getByRole("link", { name: "+ New" })).toHaveAttribute("href", "/companies/new");
      await expect(companyBox.getByRole("link", { name: "+ New" })).toHaveAttribute("target", "_blank");
      await expect(companyBox.queryByRole("button", { name: "Clear" })).toBeNull();
      await userEvent.click(company);
      await expect(await canvas.findAllByRole("option")).toHaveLength(3);
      await userEvent.click(canvas.getByRole("option", { name: /Summit Foods/ }));
      await expect(last(args.onChange)).toMatchObject({ path: ["company"], fieldValue: "c2" });

      const active = canvas.getByRole("combobox", { name: "Active Company" });
      await userEvent.click(active);
      const activeOptions = await canvas.findAllByRole("option");
      await expect(activeOptions.map((o) => o.textContent?.replace(/\s+/g, " ").trim())).toEqual([
        "Harbour Logistics Shipping",
        "Summit Foods",
        "Riverside Clinic",
      ]);
      await userEvent.keyboard("{Escape}");
      await userEvent.click(within(active.closest("ui-combobox")!).getByRole("button", { name: "Clear" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["activeCompany"], fieldValue: null });
      await userEvent.click(active);
      await expect(await canvas.findAllByRole("option")).toHaveLength(2);
      await userEvent.keyboard("{Escape}");

      const partners = canvas.getByRole("combobox", { name: "Partners" });
      const partnersBox = within(partners.closest("ui-combobox")!);
      await expect(partnersBox.queryByRole("link")).toBeNull();
      await userEvent.click(partnersBox.getByRole("button", { name: "Remove Riverside Clinic" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["partners"], fieldValue: ["c1"] });

      const anyCompany = canvas.getByRole("combobox", { name: "Any Company" });
      await userEvent.click(anyCompany);
      await waitFor(() => expect(canvas.getByText("Nothing to choose from")).toBeVisible());
      await userEvent.keyboard("{Escape}");
      const pending = canvas.getByRole("combobox", { name: "Pending" });
      await userEvent.click(pending);
      await expect(await canvas.findAllByRole("option")).toHaveLength(3);
      await userEvent.keyboard("{Escape}");

      const contactBox = within(canvas.getByRole("combobox", { name: "Contact" }).closest("ui-combobox")!);
      await expect(contactBox.queryByRole("link")).toBeNull();
      await userEvent.click(canvas.getByRole("combobox", { name: "Contact" }));
      await waitFor(() => expect(canvas.getByText("People")).toBeVisible());
      await userEvent.click(canvas.getByRole("option", { name: /Jordan Lee/ }));
      await expect(last(args.onChange)).toMatchObject({
        path: ["contact"],
        fieldValue: { relationTo: "people", value: "p1" },
      });

      const watchers = canvas.getByRole("combobox", { name: "Watchers" });
      await expect(within(watchers.closest("ui-combobox")!).getByText("Riverside Clinic")).toBeVisible();
      await userEvent.click(watchers);
      await userEvent.click(await canvas.findByRole("option", { name: /Sam Patel/ }));
      await expect(last(args.onChange)).toMatchObject({
        path: ["watchers"],
        fieldValue: [
          { relationTo: "companies", value: "c3" },
          { relationTo: "people", value: "p2" },
        ],
      });

      await userEvent.click(canvas.getByRole("combobox", { name: "Fixed Contact" }));
      const fixed = await canvas.findAllByRole("option");
      await expect(fixed.map((o) => o.textContent?.trim())).toEqual(["Sam Patel"]);
      await userEvent.keyboard("{Escape}");

      const ownerBox = within(canvas.getByRole("combobox", { name: "Owner" }).closest("ui-combobox")!);
      await expect(ownerBox.getByRole("link", { name: "Open" })).toHaveAttribute("href", "/people/p1");
      await expect(ownerBox.queryByRole("link", { name: "+ New" })).toBeNull();

      await expect(canvas.getAllByRole("img", { name: "Floor plan" })).toHaveLength(2);
      await expect(canvas.queryByRole("img", { name: "Brochure" })).toBeNull();
      const cover = canvas.getByRole("combobox", { name: "Cover" });
      await expect(within(cover.closest("ui-combobox")!).getByRole("link", { name: "Open" })).toHaveAttribute(
        "href",
        "/media/m1",
      );
      await userEvent.click(within(cover.closest("ui-combobox")!).getByRole("button", { name: "Clear" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["cover"], fieldValue: null });
      await waitFor(() => expect(canvas.getAllByRole("img", { name: "Floor plan" })).toHaveLength(1));
      await userEvent.click(canvas.getByRole("combobox", { name: "Missing" }));
      await waitFor(() => expect(canvas.getByText("Nothing to choose from")).toBeVisible());
      await userEvent.keyboard("{Escape}");
      await expect(canvas.getByRole("combobox", { name: "Orphan" })).toBeVisible();
    }),
});

const layoutFields: FieldLike[] = [
  {
    type: "row",
    fields: [
      { type: "text", name: "firstName", admin: { width: "40%" } },
      { type: "text", name: "lastName" },
      { type: "text", name: "middleName", hidden: true },
      { type: "text", name: "suffix", admin: { hidden: true } },
    ],
  },
  { type: "text", name: "website", admin: { width: "50%" } },
  { type: "checkbox", name: "hasAddress", label: "Has a postal address", custom: { input: "checkbox" } },
  {
    type: "collapsible",
    label: "Address",
    admin: { initCollapsed: true, description: "Where we send paper mail." },
    fields: [
      { type: "text", name: "street", admin: { condition: (data: Data) => data.hasAddress === true } },
      { type: "text", name: "city" },
    ],
  },
  { type: "collapsible", admin: { initCollapsed: true }, fields: [{ type: "text", name: "taxId" }] },
  { type: "collapsible", label: "Extras", fields: [{ type: "text", name: "hobby" }] },
  {
    type: "tabs",
    tabs: [
      { label: "General", fields: [{ type: "text", name: "headline" }] },
      {
        name: "seo",
        description: "How the page shows in search results.",
        fields: [{ type: "text", name: "metaTitle" }],
      } as never,
      { name: "social_links", label: { en: "Social" }, fields: [{ type: "text", name: "handle" }] },
      { fields: [{ type: "text", name: "footnote" }] },
    ],
  },
  {
    type: "group",
    name: "billing",
    label: "Billing contact",
    admin: { hideGutter: true, description: "Who receives invoices." },
    fields: [{ type: "email", name: "email" }],
  },
  {
    type: "group",
    name: "shipping",
    admin: { description: "Where parcels go." },
    fields: [{ type: "text", name: "dock" }],
  },
  {
    type: "group",
    name: "meta",
    label: false,
    admin: { hideGutter: true },
    fields: [{ type: "text", name: "source" }],
  },
];

export const LayoutFields = meta.story({
  name: "Layout fields",
  args: {
    fields: layoutFields,
    value: { firstName: "Ada", seo: "broken", billing: { email: "ap@example.com" }, shipping: [] },
    errors: { city: "Pick a city.", "seo.metaTitle": "Too long.", footnote: "Needed.", headline: "Needed too." },
  },
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      await expect(await canvas.findByRole("textbox", { name: "First Name" })).toHaveValue("Ada");
      await expect(canvas.getByRole("textbox", { name: "Last Name" })).toBeVisible();
      await expect(canvas.queryByRole("textbox", { name: "Middle Name" })).toBeNull();
      await expect(canvas.queryByRole("textbox", { name: "Suffix" })).toBeNull();
      await expect(canvas.getByRole("textbox", { name: "Website" })).toBeVisible();

      const address = canvas.getByRole("checkbox", { name: "Address" });
      await expect(address).toBeChecked();
      await expect(canvas.getByText("Where we send paper mail.")).toBeVisible();
      await waitFor(() => expect(canvas.getByText("Pick a city.")).toBeVisible());
      await expect(canvas.queryByRole("textbox", { name: "Street" })).toBeNull();
      await userEvent.click(canvas.getByRole("checkbox", { name: "Has a postal address" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["hasAddress"], fieldValue: true });
      await expect(await canvas.findByRole("textbox", { name: "Street" })).toBeVisible();
      await expect(canvas.getByRole("checkbox", { name: "Details" })).not.toBeChecked();
      await expect(canvas.getByRole("checkbox", { name: "Extras" })).toBeChecked();

      const tabs = canvas.getAllByRole("tab");
      await expect(tabs.map((t) => t.textContent?.trim())).toEqual([
        "General · 1 error",
        "Seo · 1 error",
        "Social links",
        "· 1 error",
      ]);
      await userEvent.click(canvas.getByRole("tab", { name: "Seo · 1 error" }));
      await waitFor(() => expect(canvas.getByText("How the page shows in search results.")).toBeVisible());
      const metaTitle = canvas.getByRole("textbox", { name: "Meta Title" });
      await expect(metaTitle).toHaveValue("");
      await userEvent.type(metaTitle, "Hi");
      await expect(last(args.onChange)).toMatchObject({ path: ["seo", "metaTitle"], fieldValue: "Hi" });
      await expect(last(args.onChange).value.seo).toEqual({ metaTitle: "Hi" });
      await userEvent.click(canvas.getByRole("tab", { name: "Social links" }));
      await userEvent.type(await canvas.findByRole("textbox", { name: "Handle" }), "@a");
      await expect(last(args.onChange)).toMatchObject({ path: ["social_links", "handle"], fieldValue: "@a" });

      await expect(canvas.getByText("Billing contact")).toBeVisible();
      await expect(canvas.getByText("Who receives invoices.")).toBeVisible();
      await expect(canvas.getByRole("textbox", { name: "Email" })).toHaveValue("ap@example.com");
      await expect(canvas.getByRole("group", { name: "Shipping" })).toBeVisible();
      await userEvent.type(canvas.getByRole("textbox", { name: "Dock" }), "7");
      await expect(last(args.onChange)).toMatchObject({ path: ["shipping", "dock"], fieldValue: "7" });
      await userEvent.type(canvas.getByRole("textbox", { name: "Source" }), "Web");
      await expect(last(args.onChange)).toMatchObject({ path: ["meta", "source"], fieldValue: "Web" });
    }),
});

export const SparseConfigs = meta.story({
  name: "Sparse configs",
  args: {
    fields: [
      { type: "row" },
      { type: "collapsible", label: "Empty section" },
      { type: "tabs" },
      { type: "group", name: "empty", label: "Empty group" },
      { type: "array", name: "things" },
      { type: "blocks", name: "pieces" },
      { type: "select", name: "choice" },
      { type: "radio", name: "pick" },
      {
        type: "collapsible",
        label: "Nested",
        admin: { initCollapsed: true },
        fields: [
          { type: "row" },
          { type: "row", fields: [{ type: "text", name: "inner" }] },
          { type: "collapsible" },
          { type: "tabs" },
          {
            type: "tabs",
            tabs: [
              { name: "named", fields: [{ type: "text", name: "deep" }] },
              { fields: [{ type: "text", name: "tabbed" }] },
            ],
          },
          { type: "ui" },
        ],
      },
      { type: "array", name: "bits" },
      { type: "blocks", name: "parts", blocks: [] },
    ],
    value: { bits: [{ id: "b1" }], parts: [{ id: "x1" }] },
    errors: { tabbed: "Needed." },
  },
  play: async ({ canvas, userEvent, canvasElement }) =>
    withGlobals(noAi, async () => {
      await expect(await canvas.findByRole("checkbox", { name: "Empty section" })).toBeChecked();
      await expect(canvas.getAllByRole("tab").map((t) => t.textContent?.trim())).toEqual(["Named", "· 1 error"]);
      await expect(canvas.getByRole("group", { name: "Empty group" })).toBeVisible();
      await expect(canvas.getByText("No things yet.")).toBeVisible();
      await expect(canvas.getByText("No pieces yet.")).toBeVisible();
      const adders = canvas.getAllByRole("button", { name: "+ Add block" });
      await expect(adders).toHaveLength(2);
      await userEvent.click(adders[0]!);
      const empty = await canvas.findByRole("menu", { name: "+ Add block" });
      await expect(within(empty).queryAllByRole("menuitem")).toHaveLength(0);
      await userEvent.click(canvas.getByRole("combobox", { name: "Choice" }));
      await waitFor(() => expect(canvas.getByText("Nothing to choose from")).toBeVisible());
      await expect(canvasElement.querySelector("ui-radio")).toBeInTheDocument();
      await expect(canvas.getByRole("checkbox", { name: "Nested" })).toBeChecked();
      await expect(canvas.getByRole("button", { name: "Collapse Row 01" })).toBeVisible();
      await expect(canvas.getByRole("button", { name: "1 actions" })).toBeVisible();
    }),
});

const arrayValue: Data = {
  lineItems: [
    { id: "a", product: "Desk", qty: 2 },
    { id: "b", product: "02", qty: 5 },
  ],
  phones: [{ kind: "mobile", number: 1 }, { kind: "fax" }],
  milestones: [
    { id: "m1", step: 1 },
    { id: "m2", step: 2 },
  ],
  attachments: [],
  primaryContact: [{ id: "only", name: "Robin" }],
};

const arrayFields: FieldLike[] = [
  ...rowsFields,
  {
    type: "array",
    name: "primaryContact",
    minRows: 1,
    maxRows: 1,
    labels: { singular: "Contact" },
    fields: [{ type: "text", name: "name" }],
  } as FieldLike,
];

const rowMenu = async (
  canvas: ReturnType<typeof within>,
  userEvent: { click: (el: Element) => Promise<void> },
  name: string,
) => {
  await userEvent.click(canvas.getByRole("button", { name }));
  const menu = await canvas.findByRole("menu", { name });
  await waitFor(() => expect(menu).toBeVisible());
  return within(menu);
};

export const ArrayFields = meta.story({
  name: "Array fields",
  args: {
    fields: arrayFields,
    value: arrayValue,
    errors: { lineItems: "Check the lines.", "milestones.1.step": "Must be set." },
  },
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      await expect(await canvas.findByText("Line Items *")).toBeVisible();
      await expect(canvas.getByText("2 · 1–3")).toBeVisible();
      await expect(canvas.getByText("2 · up to 2")).toBeVisible();
      await expect(canvas.getByText("2 · at least 2")).toBeVisible();
      await expect(canvas.getByText("What the customer is buying.")).toBeVisible();
      await expect(canvas.getByText("Check the lines.")).toBeVisible();
      await expect(canvas.getByText("No attachments yet.")).toBeVisible();

      const line1 = canvas.getByRole("button", { name: "Collapse Line 01 Desk" });
      await expect(line1).toHaveTextContent(/Line 01\s*Desk/);
      await expect(canvas.getByRole("button", { name: "Collapse Line 02" })).toHaveTextContent(/^\s*Line 02\s*$/);
      await expect(canvas.getByRole("button", { name: "Collapse Row 01 Mobile" })).toHaveTextContent(/Mobile/);
      await expect(canvas.getByRole("button", { name: "Collapse Row 02 fax" })).toHaveTextContent(/fax/);
      await expect(canvas.getByRole("button", { name: "Expand Milestone 01" })).toHaveTextContent(
        /^\s*Milestone 01\s*$/,
      );
      await expect(canvas.getByRole("button", { name: "Collapse Milestone 02" })).toBeVisible();
      await expect(canvas.getByText("1 error")).toBeVisible();
      await expect(canvas.getByText("The most phones allowed is 2.")).toBeVisible();
      await expect(canvas.queryByRole("button", { name: "Row 1 actions" })).toBeVisible();

      let menu = await rowMenu(canvas, userEvent, "Line 1 actions");
      await expect(menu.getAllByRole("menuitem").map((i) => i.textContent?.trim())).toEqual([
        "Move down",
        "Duplicate",
        "Remove",
      ]);
      await userEvent.click(menu.getByRole("menuitem", { name: "Move down" }));
      await expect(last(args.onChange)).toMatchObject({
        path: ["lineItems"],
        fieldValue: [
          { id: "b", product: "02", qty: 5 },
          { id: "a", product: "Desk", qty: 2 },
        ],
      });
      menu = await rowMenu(canvas, userEvent, "Line 2 actions");
      await expect(menu.getAllByRole("menuitem").map((i) => i.textContent?.trim())).toEqual([
        "Move up",
        "Duplicate",
        "Remove",
      ]);
      await userEvent.click(menu.getByRole("menuitem", { name: "Move up" }));
      await expect(last(args.onChange).fieldValue).toEqual(arrayValue.lineItems);
      menu = await rowMenu(canvas, userEvent, "Line 1 actions");
      await userEvent.click(menu.getByRole("menuitem", { name: "Duplicate" }));
      const tripled = last(args.onChange).fieldValue as Data[];
      await expect(tripled).toHaveLength(3);
      await expect(tripled[1]).toMatchObject({ product: "Desk", qty: 2 });
      await expect(tripled[1]!.id).toMatch(/^[0-9a-f]{24}$/);
      await expect(await canvas.findByText("The most lines allowed is 3.")).toBeVisible();
      menu = await rowMenu(canvas, userEvent, "Line 3 actions");
      await expect(menu.queryByRole("menuitem", { name: "Duplicate" })).toBeNull();
      await userEvent.click(menu.getByRole("menuitem", { name: "Remove" }));
      await expect(last(args.onChange).fieldValue).toHaveLength(2);
      await userEvent.click(await canvas.findByRole("button", { name: "+ Add Line" }));
      const added = last(args.onChange).fieldValue as Data[];
      await expect(added).toHaveLength(3);
      await expect(Object.keys(added[2]!)).toEqual(["id"]);

      menu = await rowMenu(canvas, userEvent, "Row 1 actions");
      await expect(menu.getAllByRole("menuitem").map((i) => i.textContent?.trim())).toEqual(["Remove"]);
      await userEvent.click(menu.getByRole("menuitem", { name: "Remove" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["phones"], fieldValue: [{ kind: "fax" }] });

      const milestones = canvas.getAllByRole("button", { name: "Collapse all" });
      await expect(milestones).toHaveLength(2);
      await userEvent.click(milestones[0]!);
      await expect(await canvas.findByRole("button", { name: "Expand Line 01 Desk" })).toBeVisible();
      await expect(canvas.queryByRole("textbox", { name: "Product" })).toBeNull();
      await userEvent.click(canvas.getAllByRole("button", { name: "Expand all" })[0]!);
      await expect(await canvas.findAllByRole("textbox", { name: "Product" })).toHaveLength(3);
      await userEvent.click(canvas.getByRole("button", { name: "Expand Milestone 01" }));
      await expect(await canvas.findByRole("button", { name: "Collapse Milestone 01" })).toBeVisible();
      await userEvent.click(canvas.getByRole("button", { name: "Collapse Milestone 01" }));
      await expect(await canvas.findByRole("button", { name: "Expand Milestone 01" })).toBeVisible();
      menu = await rowMenu(canvas, userEvent, "Milestone 1 actions");
      await expect(menu.getAllByRole("menuitem").map((i) => i.textContent?.trim())).toEqual(["Move down", "Duplicate"]);
      await userEvent.click(canvas.getByRole("button", { name: "Milestone 1 actions" }));
      menu = await rowMenu(canvas, userEvent, "Milestone 2 actions");
      await expect(menu.getAllByRole("menuitem").map((i) => i.textContent?.trim())).toEqual(["Move up", "Duplicate"]);
      await userEvent.click(menu.getByRole("menuitem", { name: "Move up" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["milestones"] });

      await expect(canvas.queryByRole("button", { name: "Contact 1 actions" })).toBeNull();
      await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "!");
      await expect(last(args.onChange)).toMatchObject({ path: ["primaryContact", 0, "name"], fieldValue: "Robin!" });
    }),
});

const sectionsValue: Data = {
  sections: [
    { id: "s1", blockType: "hero", headline: "Welcome", blockName: "Top" },
    { id: "s2", blockType: "quote", quote: "Great service" },
    { id: "s3", blockType: "retired" },
  ],
  footer: [],
};

export const BlockFields = meta.story({
  name: "Block fields",
  args: { fields: blocksField, value: sectionsValue, user: { role: "editor" } },
  play: async ({ canvas, userEvent, args }) =>
    withGlobals(noAi, async () => {
      const hero = await canvas.findByRole("button", { name: "Collapse Hero banner 01 Top" });
      await expect(hero).toHaveTextContent(/Hero banner 01\s*Top/);
      await expect(canvas.getByRole("button", { name: "Collapse Quote 02 Great service" })).toHaveTextContent(
        /Great service/,
      );
      await expect(canvas.getByRole("button", { name: "Collapse Retired 03" })).toHaveTextContent(/^\s*Retired 03\s*$/);
      const names = canvas.getAllByRole("textbox", { name: "Name" });
      await expect(names).toHaveLength(2);
      await expect(names[0]).toHaveValue("Top");
      await expect(names[0]).toHaveAttribute("placeholder", "Optional");
      await expect(names[1]).toHaveValue("");
      await userEvent.type(names[1]!, "Old");
      await expect(last(args.onChange)).toMatchObject({ path: ["sections", 2, "blockName"], fieldValue: "Old" });
      await userEvent.type(canvas.getByRole("textbox", { name: "Headline" }), "!");
      await expect(last(args.onChange)).toMatchObject({ path: ["sections", 0, "headline"], fieldValue: "Welcome!" });

      await userEvent.click(canvas.getByRole("button", { name: "+ Add block" }));
      const menu = within(await canvas.findByRole("menu", { name: "+ Add block" }));
      await expect(menu.getAllByRole("menuitem").map((i) => i.textContent?.trim())).toEqual(["Hero banner", "Quote"]);
      await userEvent.click(menu.getByRole("menuitem", { name: "Quote" }));
      const sections = last(args.onChange).fieldValue as Data[];
      await expect(sections).toHaveLength(4);
      await expect(sections[3]).toMatchObject({ blockType: "quote" });

      await expect(canvas.getByText("No footer yet.")).toBeVisible();
      await userEvent.click(canvas.getByRole("button", { name: "+ Add Footer item" }));
      await userEvent.click(await canvas.findByRole("menuitem", { name: "Links" }));
      await expect(last(args.onChange)).toMatchObject({ path: ["footer"], fieldValue: [{ blockType: "links" }] });
      await expect(await canvas.findByText("The most footer allowed is 1.")).toBeVisible();
    }),
});

export const BlocksForEveryone = meta.story({
  name: "Blocks for everyone",
  args: { fields: blocksField, value: { sections: [] } },
  play: async ({ canvas, userEvent }) =>
    withGlobals(noAi, async () => {
      await expect(await canvas.findByText("No page sections yet.")).toBeVisible();
      await userEvent.click(canvas.getByRole("button", { name: "+ Add block" }));
      const menu = within(await canvas.findByRole("menu", { name: "+ Add block" }));
      await expect(menu.getAllByRole("menuitem").map((i) => i.textContent?.trim())).toEqual([
        "Hero banner",
        "Quote",
        "Gallery",
      ]);
    }),
});

export const JoinFields = meta.story({
  name: "Join fields",
  args: { fields: joinFields, value: {} },
  play: async ({ canvas }) =>
    withGlobals(noAi, async () => {
      await expect(await canvas.findByText("Deals")).toBeVisible();
      await expect(canvas.getByText("Deals for this account.")).toBeVisible();
      await expect(canvas.getByRole("link", { name: "+ Create new" })).toHaveAttribute("href", "/deals/new");
      await expect(canvas.getAllByRole("link", { name: "+ Create new" })).toHaveLength(1);
      await expect(canvas.getByRole("link", { name: "Annual renewal" })).toHaveAttribute("href", "/deals/d1");
      await expect(canvas.queryByRole("link", { name: "Pilot" })).toBeNull();
      await expect(canvas.getByText("Pilot")).toBeVisible();
      await expect(canvas.getByText("Showing 2 of 5.")).toBeVisible();
      await expect(canvas.getByText("None yet.")).toBeVisible();
      await expect(canvas.getByText("Called back")).toBeVisible();
      await expect(canvas.queryByText(/Showing 1/)).toBeNull();
      await expect(canvas.queryByText("Invoices")).toBeNull();
    }),
});

export const ReadOnly = meta.story({
  name: "Read only",
  args: {
    readonly: true,
    fields: [
      ...contact,
      { type: "date", name: "renewsOn" },
      { type: "select", name: "tier", options: ["Basic", "Plus", "Pro"] },
      { type: "relationship", name: "account", relationTo: "companies" },
      { type: "join", name: "deals" },
      ...arrayFields.slice(0, 1),
      blocksField[0]!,
    ],
    relationHref: linkTo,
    value: {
      ...samples.contactValue,
      account: "c1",
      lineItems: arrayValue.lineItems,
      sections: sectionsValue.sections,
    },
  },
  play: async ({ canvas }) =>
    withGlobals(noAi, async () => {
      await expect(await canvas.findByRole("textbox", { name: "Full Name" })).toHaveAttribute("readonly");
      await expect(canvas.getByRole("switch", { name: "Newsletter" })).toBeDisabled();
      await expect(canvas.getByLabelText("Renews On")).toBeDisabled();
      await expect(canvas.queryByRole("group", { name: "Quick picks for Renews On" })).toBeNull();
      await expect(canvas.getByRole("radio", { name: "Plus" })).toBeDisabled();
      await expect(canvas.getByRole("link", { name: "Open" })).toHaveAttribute("href", "/companies/c1");
      await expect(canvas.queryByRole("link", { name: "+ New" })).toBeNull();
      await expect(canvas.queryByRole("link", { name: "+ Create new" })).toBeNull();
      await expect(canvas.queryByRole("button", { name: /actions$/ })).toBeNull();
      await expect(canvas.queryByRole("button", { name: /^\+ Add/ })).toBeNull();
      await expect(canvas.queryByText(/allowed is/)).toBeNull();
      await expect(canvas.getAllByRole("textbox", { name: "Name" })[0]).toHaveAttribute("readonly");
      await expect(canvas.queryByRole("button", { name: /^Suggest/ })).toBeNull();
    }),
});

interface ModelLog {
  systems: string[];
  inputs: string[];
}

const fakeModel = (answers: Record<string, unknown>, log: ModelLog) => ({
  availability: async () => "available",
  create: async (options: { initialPrompts: { content: string }[] }) => {
    log.systems.push(options.initialPrompts[0]!.content);
    return {
      prompt: async (input: string) => {
        log.inputs.push(input);
        const label = /Suggest: ([^(\n]+)/.exec(input)![1]!.trim();
        const answer = answers[label];
        if (answer instanceof Error) throw answer;
        return JSON.stringify({ value: answer ?? null });
      },
      destroy() {},
    };
  },
});

const fakeProofreader = {
  availability: async () => "available",
  create: async () => ({
    proofread: async (t: string) => ({ correctedInput: `${t.trim()} Thanks.`, corrections: [{}] }),
  }),
};

const aiFields: FieldLike[] = [
  { type: "text", name: "companyName", admin: { description: "The trading name." } },
  { type: "email", name: "contactEmail" },
  { type: "textarea", name: "summary" },
  { type: "number", name: "employees" },
  { type: "number", name: "budget" },
  { type: "number", name: "sizes", hasMany: true },
  { type: "text", name: "tags", hasMany: true },
  { type: "text", name: "region" },
  { type: "checkbox", name: "active" },
  { type: "checkbox", name: "archived" },
  { type: "date", name: "startDate" },
  { type: "date", name: "callAt", admin: { date: { pickerAppearance: "dayAndTime" } } },
  { type: "date", name: "opensAt", admin: { date: { pickerAppearance: "timeOnly" } } },
  {
    type: "select",
    name: "stage",
    options: [
      { label: "Open", value: "open" },
      { label: "Won", value: "won" },
      { label: { en: "Lost" }, value: "lost" },
    ],
  },
  { type: "select", name: "channels", hasMany: true, options: ["Email", "Phone"] },
  { type: "select", name: "code", options: Array.from({ length: 81 }, (_, i) => `C${i}`) },
  { type: "select", name: "blank" },
  { type: "radio", name: "size", options: ["Small", "Large"] },
  { type: "relationship", name: "account", relationTo: "companies" },
  { type: "relationship", name: "anyone", relationTo: ["companies", "people"] },
  { type: "code", name: "snippet" },
  { type: "text", name: "reference", admin: { readOnly: true } },
];

const aiAnswers = {
  "Company Name": "Northside Bakery",
  "Contact Email": "hello@example.com",
  Employees: 42,
  Budget: new Error("The model is busy."),
  Region: null,
  Active: true,
  Archived: false,
  "Start Date": "2026-04-01",
  "Call At": "2026-04-02",
  Stage: "Won",
  Size: "Large",
  Account: "Summit Foods",
};

const suggestAndUse = async (
  canvas: ReturnType<typeof within>,
  userEvent: { click: (el: Element) => Promise<void> },
  label: string,
  shown: string | RegExp,
) => {
  await userEvent.click(canvas.getByRole("button", { name: `Suggest ${label}` }));
  const name = typeof shown === "string" ? `Suggested: ${shown}. Use it` : shown;
  const use = await canvas.findByRole("button", { name });
  await userEvent.click(use);
};

export const AiSuggestions = meta.story({
  name: "AI suggestions",
  args: { fields: aiFields, what: "supplier", value: { employees: 12, summary: "  Long-time customer." } },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const log: ModelLog = { systems: [], inputs: [] };
    await withGlobals({ LanguageModel: fakeModel(aiAnswers, log), Proofreader: fakeProofreader }, async () => {
      await expect(await canvas.findByRole("button", { name: "Suggest Company Name" })).toBeVisible();
      for (const none of ["Sizes", "Tags", "Opens At", "Channels", "Code", "Blank", "Anyone", "Snippet", "Reference"])
        await expect(canvas.queryByRole("button", { name: `Suggest ${none}` })).toBeNull();

      await suggestAndUse(canvas, userEvent, "Company Name", "Northside Bakery");
      await expect(last(args.onChange)).toMatchObject({ path: ["companyName"], fieldValue: "Northside Bakery" });
      await expect(log.systems[0]).toContain("fill in a supplier");
      await expect(log.systems[0]).toContain("Today is 2026-03-05.");
      await expect(log.inputs[0]).toContain("- Employees: 12");
      await expect(log.inputs[0]).toContain("Suggest: Company Name (The trading name.)");
      await expect(log.inputs[0]).not.toContain("- Company Name:");

      await userEvent.click(canvas.getByRole("button", { name: "Suggest Contact Email" }));
      await userEvent.click(await canvas.findByRole("button", { name: "Dismiss the suggestion" }));
      await waitFor(() =>
        expect(canvas.queryByRole("button", { name: "Suggested: hello@example.com. Use it" })).toBeNull(),
      );
      await expect(log.inputs[1]).toContain("- Company Name: Northside Bakery");

      await suggestAndUse(canvas, userEvent, "Employees", "42");
      await expect(last(args.onChange)).toMatchObject({ path: ["employees"], fieldValue: 42 });
      await suggestAndUse(canvas, userEvent, "Active", "Yes");
      await expect(last(args.onChange)).toMatchObject({ path: ["active"], fieldValue: true });
      await suggestAndUse(canvas, userEvent, "Archived", "No");
      await expect(last(args.onChange)).toMatchObject({ path: ["archived"], fieldValue: false });
      await suggestAndUse(canvas, userEvent, "Start Date", /^Suggested: .*2026.*\. Use it$/);
      await expect(last(args.onChange)).toMatchObject({
        path: ["startDate"],
        fieldValue: new Date("2026-04-01").toISOString(),
      });
      await suggestAndUse(canvas, userEvent, "Call At", /^Suggested: .*2026.*\. Use it$/);
      await expect(last(args.onChange)).toMatchObject({
        path: ["callAt"],
        fieldValue: new Date("2026-04-02T09:00").toISOString(),
      });
      await suggestAndUse(canvas, userEvent, "Stage", "Won");
      await expect(last(args.onChange)).toMatchObject({ path: ["stage"], fieldValue: "won" });
      await expect(log.inputs.at(-1)).toContain("- Start Date: ");
      await suggestAndUse(canvas, userEvent, "Size", "Large");
      await expect(last(args.onChange)).toMatchObject({ path: ["size"], fieldValue: "Large" });
      await suggestAndUse(canvas, userEvent, "Account", "Summit Foods");
      await expect(last(args.onChange)).toMatchObject({ path: ["account"], fieldValue: "c2" });

      await userEvent.click(canvas.getByRole("button", { name: "Suggest Region" }));
      await expect(
        await canvas.findByText("Nothing on the form points to an answer yet. Fill in more and try again."),
      ).toBeInTheDocument();
      await userEvent.type(canvas.getByRole("textbox", { name: "Region" }), "N");
      await waitFor(() => expect(canvas.queryByText(/Nothing on the form points/)).toBeNull());
      await expect(last(args.onChange)).toMatchObject({ path: ["region"], fieldValue: "N" });

      await userEvent.click(canvas.getByRole("button", { name: "Suggest Budget" }));
      await expect(
        await canvas.findByText("The AI couldn't suggest an answer this time. Try again in a moment."),
      ).toBeInTheDocument();

      await userEvent.type(canvas.getByRole("textbox", { name: "Summary" }), " ");
      await userEvent.click(await canvas.findByRole("button", { name: "Proofread" }));
      await waitFor(() =>
        expect(last(args.onChange)).toMatchObject({ path: ["summary"], fieldValue: "Long-time customer. Thanks." }),
      );

      const el = form(canvasElement);
      const parent = el.parentElement!;
      el.remove();
      await expect(el.isConnected).toBe(false);
      parent.append(el);
      await expect(await canvas.findByRole("button", { name: "Suggest Company Name" })).toBeVisible();
      Object.defineProperty(globalThis, "LanguageModel", { value: undefined, configurable: true, writable: true });
      dispatchEvent(new Event(AI_CHANGE));
      await waitFor(() => expect(canvas.queryByRole("button", { name: "Suggest Company Name" })).toBeNull());
    });
  },
});

const manyNotes = Object.fromEntries(Array.from({ length: 62 }, (_, i) => [`note${i}`, `Value ${i}`]));

const contextFields: FieldLike[] = [
  { type: "row" },
  { type: "tabs" },
  { type: "group", name: "emptyGroup" },
  { type: "text", name: "headline" },
  {
    type: "row",
    fields: [
      {
        type: "select",
        name: "tier",
        options: ["Basic", { label: "Plus", value: "plus" }, { label: { en: "Pro" }, value: "pro" }],
      },
      { type: "radio", name: "grade", options: ["A", "B"] },
      { type: "select", name: "legacyTier", options: ["Basic"] },
      { type: "radio", name: "level", options: [{ label: { en: "Top" }, value: "top" }] },
    ],
  },
  {
    type: "collapsible",
    fields: [
      { type: "checkbox", name: "verified" },
      { type: "checkbox", name: "blocked" },
      { type: "text", name: "flag" },
      { type: "date", name: "since" },
    ],
  },
  {
    type: "tabs",
    tabs: [
      { name: "seo", fields: [{ type: "text", name: "metaTitle" }] },
      { name: "extra", fields: [{ type: "text", name: "hidden" }] },
      { fields: [{ type: "relationship", name: "owner", relationTo: "people" }] },
    ],
  },
  { type: "group", name: "billing", fields: [{ type: "email", name: "email" }] },
  { type: "group", name: "shipping", fields: [{ type: "text", name: "dock" }] },
  { type: "relationship", name: "lostOwner", relationTo: "people" },
  { type: "relationship", name: "either", relationTo: ["companies", "people"] },
  { type: "text", name: "blankText" },
  { type: "json", name: "settings" },
  { type: "array", name: "lines", fields: [{ type: "text", name: "x" }] },
  { type: "number", name: "score" },
  { type: "select", name: "freeChoice" },
  { type: "relationship", name: "loose", relationTo: ["companies", "people"] },
  ...Object.keys(manyNotes).map((name) => ({ type: "text", name })),
];

export const SuggestionContext = meta.story({
  name: "Suggestion context",
  args: {
    fields: [{ type: "text", name: "nextStep" }],
    contextFields,
    what: "",
    today: "",
    value: {
      headline: "Spring launch",
      tier: "plus",
      grade: "B",
      legacyTier: 5,
      level: "top",
      verified: true,
      blocked: false,
      flag: true,
      since: "2025-06-01T10:00:00.000Z",
      seo: { metaTitle: "Launch" },
      extra: "none",
      owner: "p1",
      billing: { email: "ap@example.com" },
      shipping: "none",
      lostOwner: "p9",
      either: { relationTo: "people", value: "p1" },
      blankText: "",
      settings: { a: 1 },
      lines: [{ x: "1" }],
      score: 7,
      freeChoice: "x",
      loose: "p1",
      ...manyNotes,
    },
  },
  play: async ({ canvas, userEvent }) => {
    const log: ModelLog = { systems: [], inputs: [] };
    await withGlobals({ LanguageModel: fakeModel({ "Next Step": "Call back" }, log) }, async () => {
      await suggestAndUse(canvas, userEvent, "Next Step", "Call back");
      await expect(log.systems[0]).toContain("fill in a record");
      await expect(log.systems[0]).toContain(`Today is ${new Date().toISOString().slice(0, 10)}.`);
      const lines = log.inputs[0]!.split("\n").filter((l) => l.startsWith("- "));
      await expect(lines).toHaveLength(60);
      await expect(lines.slice(0, 13)).toEqual([
        "- Headline: Spring launch",
        "- Tier: Plus",
        "- Grade: B",
        "- Legacy Tier: 5",
        "- Level: top",
        "- Verified: Yes",
        "- Blocked: No",
        "- Since: 2025-06-01",
        "- seo · Meta Title: Launch",
        "- Owner: Jordan Lee",
        "- Billing · Email: ap@example.com",
        "- Score: 7",
        "- Free Choice: x",
      ]);
    });
  },
});
