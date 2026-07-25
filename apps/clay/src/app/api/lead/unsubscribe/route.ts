/** Unsubscribe proxy → CMS `/api/lead/unsubscribe` (email footer + one-click). */

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

async function forward(token: string, method: "GET" | "POST") {
  try {
    const upstream = await fetch(
      `${CMS_URL}/api/lead/unsubscribe?t=${encodeURIComponent(token)}`,
      { method, cache: "no-store" },
    );
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ error: "Lỗi kết nối." }, { status: 502 });
  }
}

export function GET(req: Request) {
  return forward(new URL(req.url).searchParams.get("t") ?? "", "GET");
}

export function POST(req: Request) {
  return forward(new URL(req.url).searchParams.get("t") ?? "", "POST");
}
