/** Liveness probe for PaaS/uptime checks. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true, service: "clay" });
}
