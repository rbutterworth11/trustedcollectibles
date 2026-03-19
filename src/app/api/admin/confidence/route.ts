import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { listingId, score, factors } = await request.json();

  if (!listingId || score === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (score < 0 || score > 100) {
    return NextResponse.json({ error: "Score must be 0-100" }, { status: 400 });
  }

  const { error } = await supabase
    .from("listings")
    .update({
      confidence_score: score,
      confidence_factors: factors || [],
    })
    .eq("id", listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
