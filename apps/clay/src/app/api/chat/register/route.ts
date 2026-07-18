/**
 * Register proxy → CMS. Forwards the visitor registration (email + phone) to the
 * CMS chat module, which owns the `chat-users` collection.
 */

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  try {
    const upstream = await fetch(`${CMS_URL}/api/chat/register`, {
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
    return Response.json({ error: "Không thể đăng ký, vui lòng thử lại." }, { status: 502 });
  }
}
