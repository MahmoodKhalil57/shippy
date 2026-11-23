import { beforeEach, describe, expect, it } from "vite-plus/test";
import { backend, call, login } from "./backend.ts";

type Json = Record<string, any>;

beforeEach(async () => {
  backend.reset();
  await login("karim.youssef");
});

describe("endpoints answer in the request's language (?locale=)", () => {
  it("writes the month, tile labels and notes in Arabic, with Latin digits", async () => {
    expect((await call("GET", "/api/usage")).body.month).toBe("November 2026");
    expect((await call("GET", "/api/usage?locale=ar")).body.month).toBe("نوفمبر 2026");

    const room = (await call("GET", "/api/control-room?period=12w&locale=ar")).body as Json;
    expect(room.tiles[0].label).toBe("طلبات عروض الأسعار المفتوحة");
    expect(room.tiles[0].note).toMatch(/^\d+ متوقفة أو عاجلة$/);
    expect(room.sections[0].title).toBe("مسار المبيعات ونسب التحويل");
  });

  it("answers the assistant in Arabic, matching an Arabic question", async () => {
    const en = (await call("POST", "/api/ask", { question: "Who owes us money?" })).body as Json;
    expect(en.intent).toBe("cash");
    expect(en.answer).toMatch(/^Customers owe /);
    const ar = (await call("POST", "/api/ask?locale=ar", { question: "من يدين لنا بالمال؟" })).body as Json;
    expect(ar.intent).toBe("cash");
    expect(ar.answer).toMatch(/^العملاء مدينون بـ/);
    // The question is kept as asked; codes stay as they are.
    expect(ar.question).toBe("من يدين لنا بالمال؟");
  });

  it("says why it refuses in Arabic", async () => {
    const en = await call("POST", "/api/quote-preview/q-0142-v1/decision", { decision: "Lost" });
    expect(en.body.errors[0].message).toBe("Give the lost reason.");
    const ar = await call("POST", "/api/quote-preview/q-0142-v1/decision?locale=ar", { decision: "Lost" });
    expect(ar.status).toBe(400);
    expect(ar.body.errors[0].message).toBe("اذكر سبب الخسارة.");
  });
});

describe("a person's language", () => {
  it("is kept on their own record, which they may change and nobody else but management", async () => {
    await login("karim.youssef");
    const me = (await call("GET", "/api/users/me")).body.user as { id: string; language: string };
    expect(me.language).toBe("en");
    expect((await call("PATCH", `/api/users/${me.id}`, { language: "ar" })).status).toBe(200);
    expect((await call("GET", "/api/users/me")).body.user.language).toBe("ar");
    const others = (await call("GET", "/api/users?limit=0&depth=0")).body.docs as { id: string; role: string }[];
    const someone = others.find((u) => u.id !== me.id)!;
    expect((await call("PATCH", `/api/users/${someone.id}`, { language: "ar" })).status).toBe(403);
  });
});
