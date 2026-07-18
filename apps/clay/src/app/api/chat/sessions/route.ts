/**
 * Chat history proxy → CMS (GET list/resume, DELETE soft-hide). The CMS chat
 * module owns the `chat-sessions` collection and the registration gate.
 */

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

async function forward(req: Request, method: "GET" | "DELETE") {
  const qs = new URL(req.url).search;
  try {
    const upstream = await fetch(`${CMS_URL}/api/chat/sessions${qs}`, { method, cache: "no-store" });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ error: "Lỗi kết nối dịch vụ chat." }, { status: 502 });
  }
}

export function GET(req: Request) {
  return forward(req, "GET");
}

export function DELETE(req: Request) {
  return forward(req, "DELETE");
}
