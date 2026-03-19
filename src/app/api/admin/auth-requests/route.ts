import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { requestId, verdict, notes, status } = await request.json();
  if (!requestId) return NextResponse.json({ error: "Missing requestId" }, { status: 400 });

  // If just changing status (e.g. to in_review)
  if (status && !verdict) {
    const { error } = await supabase.from("auth_requests").update({ status }).eq("id", requestId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Submit verdict
  if (!verdict) return NextResponse.json({ error: "Missing verdict" }, { status: 400 });

  const { error } = await supabase.from("auth_requests").update({
    verdict,
    reviewer_notes: notes?.trim() || null,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
    status: "completed",
  }).eq("id", requestId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get the request to notify the user
  const { data: authReq } = await supabase.from("auth_requests").select("user_id, sport, item_type, tier").eq("id", requestId).single();
  if (authReq) {
    const verdictLabels: Record<string, string> = {
      authentic: "Authentic",
      likely_authentic: "Likely Authentic",
      inconclusive: "Inconclusive",
      likely_not_authentic: "Likely Not Authentic",
    };
    await createNotification(supabase, {
      userId: authReq.user_id,
      type: "listing_approved",
      title: "Authentication Result Ready",
      body: `Your ${authReq.sport} ${authReq.item_type} has been assessed as: ${verdictLabels[verdict] || verdict}.${authReq.tier === "premium" ? " Your certificate is ready to download." : ""}`,
      link: "/dashboard/authentications",
    });
  }

  return NextResponse.json({ success: true });
}
