/**
 * Consultation web-chat proxy → CMS `/api/lead/chat` (SSE passthrough).
 * The CMS owns the provider keys, the transcript and the device authorisation,
 * so this route only forwards bytes.
 */

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  try {
    const upstream = await fetch(`${CMS_URL}/api/lead/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
    });
    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") ?? "application/json",
        },
      });
    }
    return new Response(upstream.body, {
      headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
      },
    });
  } catch {
    return Response.json({ error: "Lỗi kết nối dịch vụ tư vấn." }, { status: 502 });
  }
}
