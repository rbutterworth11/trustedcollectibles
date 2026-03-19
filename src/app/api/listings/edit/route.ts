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

  const { listingId, updates } = await request.json();

  if (!listingId || !updates) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify ownership
  const { data: listing } = await supabase
    .from("listings")
    .select("seller_id, status")
    .eq("id", listingId)
    .single();

  if (!listing || listing.seller_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Allowed fields for seller editing
  const allowed = [
    "title", "description", "price", "accept_offers", "minimum_offer",
    "player", "team", "year", "condition", "images", "signature_photo",
  ];

  // Fields that trigger re-review if changed on a listed item
  const reviewTriggers = ["images", "signature_photo", "coa_front", "coa_back", "coa_hologram"];

  const updateData: Record<string, unknown> = {};
  let needsReReview = false;

  for (const [key, value] of Object.entries(updates)) {
    if (allowed.includes(key)) {
      updateData[key] = value;
      if (listing.status === "listed" && reviewTriggers.includes(key)) {
        needsReReview = true;
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  // If photos/COA changed on a live listing, send back to review
  if (needsReReview) {
    updateData.status = "pending_verification";
  }

  const { error } = await supabase
    .from("listings")
    .update(updateData)
    .eq("id", listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, reReview: needsReReview });
}
