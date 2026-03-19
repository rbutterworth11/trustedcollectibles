import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendListingReviewResult } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the user is an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { listingId, action, reason, notes } = await request.json();

  if (!listingId || !action) {
    return NextResponse.json(
      { error: "listingId and action are required" },
      { status: 400 }
    );
  }

  const validActions = [
    "approved",
    "rejected",
    "request_photos",
    "flagged",
    "unflagged",
  ];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (
    (action === "rejected" || action === "request_photos" || action === "flagged") &&
    !reason?.trim()
  ) {
    return NextResponse.json(
      { error: "Reason is required for this action" },
      { status: 400 }
    );
  }

  // Build the listing update based on action
  const listingUpdate: Record<string, unknown> = {
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
  };

  if (notes?.trim()) {
    listingUpdate.admin_notes = notes.trim();
  }

  switch (action) {
    case "approved":
      listingUpdate.status = "listed";
      listingUpdate.rejection_reason = null;
      break;
    case "rejected":
      listingUpdate.status = "draft";
      listingUpdate.rejection_reason = reason.trim();
      break;
    case "request_photos":
      listingUpdate.status = "draft";
      listingUpdate.rejection_reason = `More photos needed: ${reason.trim()}`;
      break;
    case "flagged":
      listingUpdate.flagged = true;
      listingUpdate.flag_reason = reason.trim();
      break;
    case "unflagged":
      listingUpdate.flagged = false;
      listingUpdate.flag_reason = null;
      break;
  }

  // Update the listing
  const { error: updateError } = await supabase
    .from("listings")
    .update(listingUpdate)
    .eq("id", listingId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  // Log the review action
  const { error: reviewError } = await supabase
    .from("listing_reviews")
    .insert({
      listing_id: listingId,
      reviewer_id: user.id,
      action,
      reason: reason?.trim() || null,
    });

  if (reviewError) {
    return NextResponse.json(
      { error: reviewError.message },
      { status: 500 }
    );
  }

  // Send notifications for approved/rejected actions
  if (action === "approved" || action === "rejected") {
    const { data: listing } = await supabase.from("listings").select("seller_id, title").eq("id", listingId).single();
    if (listing) {
      // In-app notification
      await createNotification(supabase, {
        userId: listing.seller_id,
        type: action === "approved" ? "listing_approved" : "listing_rejected",
        title: action === "approved"
          ? "Listing Approved & Live!"
          : "Listing Needs Attention",
        body: action === "approved"
          ? `Your listing "${listing.title}" has been approved and is now live on the marketplace!`
          : `Your listing "${listing.title}" was not approved. Reason: ${reason?.trim() || "See details"}`,
        link: action === "approved" ? "/dashboard/listings" : "/dashboard/listings",
      });

      // Email notification
      const { data: sellerProfile } = await supabase.from("profiles").select("email, full_name").eq("id", listing.seller_id).single();
      if (sellerProfile) {
        sendListingReviewResult(
          sellerProfile.email, sellerProfile.full_name, listing.title,
          action === "approved",
          action === "rejected" ? reason?.trim() : undefined
        );
      }
    }
  }

  return NextResponse.json({ success: true });
}
