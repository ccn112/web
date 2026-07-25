/**
 * Lead-care chat bridge proxy → CMS. Forwards `{ token, deviceId }` so the
 * visitor can adopt the warm AI chat session created for their lead (see the
 * magic link in the follow-up email, `/?care_chat=<token>`).
 */

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  try {
    const upstream = await fetch(`${CMS_URL}/api/chat/adopt`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ error: "Lỗi kết nối dịch vụ chat." }, { status: 502 });
  }
}
