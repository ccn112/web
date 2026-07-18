/**
 * Chat proxy → CMS. The provider API keys and all LLM logic live on the CMS
 * backend (apps/cms). This route forwards the request and pipes the SSE stream
 * straight back to the browser, so the site stays a thin frontend and secrets
 * never touch clay. See docs/CHAT_MODULE_HANDOFF.md.
 */

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  let upstream: Response;
  try {
    upstream = await fetch(`${CMS_URL}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
      // @ts-expect-error - Node fetch streaming duplex (required when piping a body)
      duplex: "half",
    });
  } catch {
    return Response.json({ error: "Xin lỗi, không kết nối được dịch vụ chat." }, { status: 502 });
  }

  // Non-stream (JSON error from CMS): pass through as-is.
  const ct = upstream.headers.get("content-type") ?? "";
  if (!ct.includes("text/event-stream")) {
    const text = await upstream.text();
    return new Response(text, { status: upstream.status, headers: { "content-type": ct || "application/json" } });
  }

  // Pipe the SSE stream straight through.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
