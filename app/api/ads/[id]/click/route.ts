import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getClientIp, hashViewer } from "@/lib/rate-limit";

/** تسجيل نقرة إعلان — SPEC.md §10. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: adId } = await context.params;
  const body = await request.json().catch(() => null);

  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const viewerHash = hashViewer(ip, userAgent);

  const admin = createAdminClient();
  await admin.from("ad_events").insert({
    ad_id: adId,
    event_type: "click",
    viewer_hash: viewerHash,
    governorate_id: typeof body?.governorateId === "number" ? body.governorateId : null,
  });

  return NextResponse.json({ success: true });
}
