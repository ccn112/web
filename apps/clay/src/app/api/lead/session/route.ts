/** Consultation session bootstrap proxy → CMS `/api/lead/session`. */

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const qs = new URL(req.url).search;
  try {
    const upstream = await fetch(`${CMS_URL}/api/lead/session${qs}`, { cache: "no-store" });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ session: null }, { status: 200 });
  }
}
