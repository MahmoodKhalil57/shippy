/**
 * The sourcing desk's canned AI results (./sourcing-data.ts) in Arabic, keyed by their English:
 * the extraction's field names and notes, what is missing, the assignment rules and next actions,
 * the inbox history's de-duplication and the organiser's questions and proposals. What customers
 * and suppliers wrote (subjects, bodies, line descriptions, names) stays as they wrote it.
 * `sourcingInArabic` reads a value in Arabic; English is the value itself.
 */
export const SOURCING_AR: Record<string, string> = {
  // extraction: field names
  Customer: "العميل",
  Vessel: "السفينة",
  Port: "الميناء",
  "Quote deadline": "موعد عرض السعر",
  "Customer ref": "مرجع العميل",
  Currency: "العملة",
  Request: "الطلب",
  Arrival: "الوصول",
  "Deliver with": "يُسلَّم مع",
  Subject: "الموضوع",
  // extraction: values with Golden Sea's notes
  "Nordvik Ship Management (sender domain + vessel record)": "Nordvik Ship Management (نطاق المرسل + سجل السفينة)",
  "9734512 (from the vessel record)": "9734512 (من سجل السفينة)",
  "Fri 20 Nov 2026 (“ETA Fri”, no time given)": "الجمعة 20 نوفمبر 2026 («ETA Fri»، دون وقت محدد)",
  "Wed 18 Nov 09:30 (“within 24 h”)": "الأربعاء 18 نوفمبر 09:30 («خلال 24 ساعة»)",
  "— not found in email or files": "— غير موجود في البريد أو الملفات",
  "USD (account default)": "USD (افتراضي الحساب)",
  "Suez (northbound transit)": "السويس (عبور شمالًا)",
  "— not found": "— غير موجود",
  "— not stated (default USD)": "— غير مذكور (افتراضيًا USD)",
  "Petro Delta (new — offshore)": "Petro Delta (جديد — أوفشور)",
  "Platform PD-3 (offshore Abu Qir)": "المنصة PD-3 (أوفشور أبو قير)",
  "n/a — fixed platform": "لا ينطبق — منصة ثابتة",
  "Abu Qir — by supply boat": "أبو قير — بقارب إمداد",
  "Delivery 24 Nov 2026": "التسليم 24 نوفمبر 2026",
  "— not stated (set 19 Nov 12:00)": "— غير مذكور (حُدد 19 نوفمبر 12:00)",
  "— web form": "— نموذج الموقع",
  "EGP (local customer)": "EGP (عميل محلي)",
  "Baltic Reefer Management (prospect)": "Baltic Reefer Management (عميل محتمل)",
  "≈ 26 Nov 2026": "≈ 26 نوفمبر 2026",
  "— not stated (set 20 Nov 12:00)": "— غير مذكور (حُدد 20 نوفمبر 12:00)",
  "Atlas Tankers (from the sender's number)": "Atlas Tankers (من رقم المرسل)",
  "9755001 (from the fleet record)": "9755001 (من سجل الأسطول)",
  "“asap” → set 19 Nov 12:00": "«asap» ← حُدد 19 نوفمبر 12:00",
  "— none (WhatsApp)": "— لا يوجد (واتساب)",
  "Spare-parts clearance & forwarding (not an RFQ)": "تخليص قطع غيار وشحنها (ليس طلب عرض أسعار)",
  "Cairo airport 19 Nov": "مطار القاهرة 19 نوفمبر",
  "GS-RFQ-0142 (same vessel & call)": "GS-RFQ-0142 (السفينة والزيارة نفسها)",
  // extraction: flags
  "Label partly unreadable: material and thickness unclear": "الملصق غير مقروء جزئيًا: الخامة والسُمك غير واضحين",
  "Stem length and connection thread not given": "طول الساق وسن التوصيل غير مذكورين",
  "Colour temperature not stated": "درجة حرارة اللون غير مذكورة",
  "Handwriting: quantity could be 10 or 16": "خط اليد: قد تكون الكمية 10 أو 16",
  // assignment rules
  "Nordvik Ship Management account → owner Karim Youssef, backup Soaad Amer":
    "حساب Nordvik Ship Management ← المسؤول Karim Youssef، والبديل Soaad Amer",
  "Helios Bulk account → owner Soaad Amer, backup Karim Youssef · urgent: vessel arrives in 2 days":
    "حساب Helios Bulk ← المسؤول Soaad Amer، والبديل Karim Youssef · عاجل: السفينة تصل خلال يومين",
  "New offshore customer from the website → owner Ahmedy (Alexandria office), contact created":
    "عميل أوفشور جديد من الموقع ← المسؤول Ahmedy (مكتب الإسكندرية)، وأُنشئت جهة الاتصال",
  "New prospect (Baltic Reefer, growth pipeline) → owner Soaad Amer, backup Karim Youssef":
    "عميل محتمل جديد (Baltic Reefer، مسار النمو) ← المسؤول Soaad Amer، والبديل Karim Youssef",
  "Atlas Tankers account → owner Karim Youssef, backup Ahmedy":
    "حساب Atlas Tankers ← المسؤول Karim Youssef، والبديل Ahmedy",
  "Clearance & forwarding → owner Ahmedy (operations), backup Karim Youssef":
    "التخليص والشحن ← المسؤول Ahmedy (العمليات)، والبديل Karim Youssef",
  // next actions
  "Send supplier RFQs (split by category) · clarify line 6":
    "أرسل طلبات عروض الأسعار للموردين (مقسّمة حسب الفئة) · استوضح البند 6",
  "Send supplier RFQs today — Grundfos seal is exact brand":
    "أرسل طلبات عروض الأسعار للموردين اليوم، فحشوة Grundfos علامة محددة",
  "Price life jackets from the Lalizas agency list; RFQ lifebuoys":
    "سعّر سترات النجاة من قائمة وكالة Lalizas، واطلب عروض أسعار لأطواق النجاة",
  "Confirm IMO & deadline; RFQ cabin stores": "أكّد رقم IMO والموعد النهائي، واطلب عروض أسعار لمستلزمات الكبائن",
  "Ask the captain for a typed list; RFQ deck stores": "اطلب من القبطان قائمة مكتوبة، واطلب عروض أسعار لمستلزمات السطح",
  "Collect invoice & packing list; submit customs declaration": "اجمع الفاتورة وقائمة التعبئة، وقدّم البيان الجمركي",
  // missing
  "Customer reference": "مرجع العميل",
  "ETA time": "وقت الوصول المتوقع",
  "Line 6: gasket sheet material and thickness": "البند 6: خامة لوح الحشوات وسُمكه",
  "Line 5: stem length and thread": "البند 5: طول الساق والسن",
  "New customer: contact details and credit terms": "عميل جديد: بيانات الاتصال وشروط الائتمان",
  "IMO number": "رقم IMO",
  "Line 3: colour temperature": "البند 3: درجة حرارة اللون",
  "4 handwritten lines illegible — ask for a typed list": "4 بنود مكتوبة بخط اليد غير مقروءة، اطلب قائمة مكتوبة",
  "Commercial invoice and packing list (for customs)": "الفاتورة التجارية وقائمة التعبئة (للجمارك)",
  "No lines found — add them by hand": "لم يُعثر على بنود، أضفها يدويًا",
  // notes
  "Lines 2 and 3 can also be checked against Alexandria stock before RFQs go out.":
    "يمكن أيضًا مطابقة البندين 2 و3 مع مخزون الإسكندرية قبل إرسال طلبات العروض.",
  "Lalizas is a Golden Sea agency — life jackets are priced from the agency pricelist, no supplier RFQ.":
    "Lalizas وكالة لـ Golden Sea، فتُسعَّر سترات النجاة من قائمة أسعار الوكالة دون طلب عرض أسعار من مورّد.",
  "WhatsApp source: the owner sends the acknowledgement by hand.": "المصدر واتساب: يرسل المسؤول تأكيد الاستلام يدويًا.",
  // inbox history
  "Same email in several mailboxes (CC / shared)": "البريد نفسه في عدة صناديق (نسخة / مشترك)",
  "Forwarded copies (same attachment hash)": "نسخ محوّلة (بصمة المرفق نفسها)",
  "Newsletters, auto-replies, spam": "النشرات والردود التلقائية والرسائل المزعجة",
  "Held back as confidential (HR, bank, personal)": "محجوبة لسريتها (الموارد البشرية، البنك، شخصية)",
  "karim.youssef@ (own mailbox)": "karim.youssef@ (صندوقه الخاص)",
  "Gmail · purchasing intake": "Gmail · استلام المشتريات",
  "WhatsApp chat exports (2 phones)": "تصدير محادثات واتساب (هاتفان)",
  "41 quotes came from a personal Gmail address signed “Hany S.”":
    "41 عرض سعر وصلت من بريد Gmail شخصي بتوقيع «Hany S.»",
  "“MV Nordic Star” (until 2022) and “MV Aurora Crest” have the same IMO 9734512":
    "«MV Nordic Star» (حتى 2022) و«MV Aurora Crest» لهما رقم IMO نفسه 9734512",
  "LOCTITE 243 quoted at “1,950” on 11 Mar 2024 — no currency stated":
    "سُعّر LOCTITE 243 بـ«1,950» في 11 مارس 2024 دون ذكر العملة",
  "“Petro Delta” enquiries (2025) look similar to “Delta Offshore Services”":
    "استفسارات «Petro Delta» (2025) تشبه «Delta Offshore Services»",
  "A personal / HR thread was found in the purchasing mailbox":
    "وُجدت مراسلة شخصية / للموارد البشرية في صندوق المشتريات",
  "“Bluefin Shipping” asked for 3 quotes in 2022 — never answered, no vessel named":
    "طلبت «Bluefin Shipping» ثلاثة عروض أسعار في 2022 دون رد، ودون ذكر سفينة",
  "Same person as Delta Marine Stores' contact Hany S. — file these prices under Delta Marine Stores":
    "الشخص نفسه جهة اتصال Delta Marine Stores ‏Hany S.، فتُسجَّل هذه الأسعار باسم Delta Marine Stores",
  "One vessel, renamed in 2022 — keep “Nordic Star” as a former name of MV Aurora Crest":
    "سفينة واحدة تغيّر اسمها في 2022، فيُحفظ «Nordic Star» اسمًا سابقًا لـ MV Aurora Crest",
  "EGP 1,950 per piece (this supplier always quotes EGP; USD would be 40× the market)":
    "EGP 1,950 للقطعة (هذا المورّد يسعّر دائمًا بالجنيه، وبالدولار سيكون 40 ضعف السوق)",
  "Different companies — add Petro Delta as a new customer (offshore, Abu Qir)":
    "شركتان مختلفتان، فتُضاف Petro Delta عميلًا جديدًا (أوفشور، أبو قير)",
  "Exclude it — personal and HR emails are never imported":
    "استبعادها، فالرسائل الشخصية ورسائل الموارد البشرية لا تُستورد أبدًا",
  "Keep as a prospect in the growth CRM (not a customer)": "تُحفظ عميلًا محتملًا في إدارة النمو (ليست عميلًا)",
};

/** A value with every string the table knows read in Arabic (arrays and objects walked). */
export function sourcingInArabic<T>(value: T): T {
  if (typeof value === "string") return (SOURCING_AR[value] ?? value) as T;
  if (Array.isArray(value)) return value.map(sourcingInArabic) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sourcingInArabic(v)])) as T;
  return value;
}
