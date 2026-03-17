import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { offerId, status } = body;

  if (!offerId || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Verify the user is the seller on this offer
  const { data: offer } = await supabase
    .from("offers")
    .select("*, listing:listings(title)")
    .eq("id", offerId)
    .single();

  if (!offer || offer.seller_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (offer.status !== "pending") {
    return NextResponse.json(
      { error: "Offer is no longer pending" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("offers")
    .update({ status })
    .eq("id", offerId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const listingTitle =
    (offer.listing as { title: string } | null)?.title ?? "item";

  // Notify the buyer
  if (status === "accepted") {
    const platformFee = Math.round(offer.amount * 0.1);
    await supabase.from("orders").insert({
      listing_id: offer.listing_id,
      buyer_id: offer.buyer_id,
      seller_id: offer.seller_id,
      amount: offer.amount,
      platform_fee: platformFee,
      status: "payment_held",
    });

    // Decline other pending offers on the same listing
    await supabase
      .from("offers")
      .update({ status: "declined" })
      .eq("listing_id", offer.listing_id)
      .eq("status", "pending")
      .neq("id", offerId);

    await createNotification(supabase, {
      userId: offer.buyer_id,
      type: "offer_accepted",
      title: "Offer Accepted!",
      body: `Your offer of $${(offer.amount / 100).toFixed(2)} on "${listingTitle}" was accepted.`,
      link: "/dashboard/orders",
    });
  } else {
    await createNotification(supabase, {
      userId: offer.buyer_id,
      type: "offer_declined",
      title: "Offer Declined",
      body: `Your offer on "${listingTitle}" was declined.`,
      link: "/dashboard/offers",
    });
  }

  return NextResponse.json({ success: true });
}
