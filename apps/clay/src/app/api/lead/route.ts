import { NextResponse } from "next/server";

const CMS_URL =
  process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

async function findId(
  collection: string,
  field: string,
  value: string,
): Promise<string | null> {
  const res = await fetch(
    `${CMS_URL}/api/${collection}?where[${field}][equals]=${encodeURIComponent(value)}&limit=1&depth=0`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { docs?: Array<{ id: string }> };
  return data.docs?.[0]?.id ?? null;
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/**
 * Extra form answers, rendered as the visitor's opening turn of the
 * consultation. The qualification analyzer reads this and pre-fills the slots,
 * so the first AI email already knows what was asked on the form.
 */
const NARRATIVE_FIELDS: Array<[string, string]> = [
  ["message", "Nội dung"],
  ["priorityProblems", "Bài toán ưu tiên"],
  ["companyModel", "Mô hình doanh nghiệp"],
  ["userScale", "Quy mô người dùng"],
  ["currentSystems", "Hệ thống hiện hữu"],
  ["products", "Sản phẩm quan tâm"],
  ["preferredTime", "Thời gian mong muốn"],
];

function buildNarrative(payload: Record<string, unknown>): string {
  const known = new Set(NARRATIVE_FIELDS.map(([k]) => k));
  const lines = NARRATIVE_FIELDS.filter(([k]) => str(payload[k])).map(([k, label]) =>
    k === "message" ? str(payload[k]) : `${label}: ${str(payload[k])}`,
  );
  // Anything bespoke a form adds later still reaches the AI.
  for (const [k, v] of Object.entries(payload)) {
    if (known.has(k) || ["fullName", "email", "phone", "company", "consent"].includes(k)) continue;
    if (str(v)) lines.push(`${k}: ${str(v)}`);
  }
  return lines.join("\n");
}

/**
 * Lead-form submission. Two things happen, in this order:
 *   1. the raw submission is archived in `form-submissions` (unchanged behaviour,
 *      and what triggers the existing staff notification email);
 *   2. the CMS lead pipeline is started — lead + conversation + the first
 *      qualification email, with the visitor's `deviceId` recorded as the origin
 *      device so they can continue the same thread in the web chat.
 *
 * Step 2 failing never fails the request: the lead is already safely stored.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      formCode?: string;
      siteCode?: string;
      pageId?: string;
      deviceId?: string;
      payload?: Record<string, unknown>;
      consent?: boolean;
    };
    if (!body.formCode || !body.payload) {
      return NextResponse.json(
        { error: "Missing formCode or payload" },
        { status: 400 },
      );
    }

    const formId = await findId("forms", "code", body.formCode);
    if (!formId) return NextResponse.json({ error: "Unknown form" }, { status: 404 });
    const siteId = body.siteCode ? await findId("sites", "code", body.siteCode) : null;

    const res = await fetch(`${CMS_URL}/api/form-submissions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        form: formId,
        site: siteId,
        page: body.pageId ?? null,
        payload: body.payload,
        consent: body.consent ?? false,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "CMS rejected submission" }, { status: 502 });
    }

    // Start the AI consultation (email + web chat). Best-effort.
    let consultation: { conversationPublicId?: string; status?: string } = {};
    const email = str(body.payload.email);
    if (email) {
      try {
        const intake = await fetch(`${CMS_URL}/api/lead/intake`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            email,
            fullName: str(body.payload.fullName) || undefined,
            phone: str(body.payload.phone) || undefined,
            company: str(body.payload.company) || undefined,
            message: buildNarrative(body.payload),
            siteCode: body.siteCode,
            formCode: body.formCode,
            deviceId: body.deviceId,
            consent: body.consent ?? false,
            source: "web-form",
            formPayload: body.payload,
          }),
        });
        if (intake.ok) {
          const j = (await intake.json()) as { conversationPublicId?: string; status?: string };
          consultation = { conversationPublicId: j.conversationPublicId, status: j.status };
        }
      } catch {
        /* the submission is stored; the consultation loop can be retried by staff */
      }
    }

    return NextResponse.json({ ok: true, ...consultation });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
