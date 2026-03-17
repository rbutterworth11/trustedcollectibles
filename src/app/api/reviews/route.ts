import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, rating, comment } = await request.json();

  if (!orderId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Verify the user is the buyer and order is completed
  const { data: order } = await supabase
    .from("orders")
    .select("*, listing:listings(title)")
    .eq("id", orderId)
    .eq("buyer_id", user.id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "completed") {
    return NextResponse.json(
      { error: "Order must be completed to leave a review" },
      { status: 400 }
    );
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("seller_reviews")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existingReview) {
    return NextResponse.json(
      { error: "You have already reviewed this order" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("seller_reviews").insert({
    order_id: orderId,
    reviewer_id: user.id,
    seller_id: order.seller_id,
    rating,
    comment: comment?.trim() || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const listingTitle =
    (order.listing as { title: string } | null)?.title ?? "item";

  // Notify the seller
  await createNotification(supabase, {
    userId: order.seller_id,
    type: "review_received",
    title: "New Review Received",
    body: `A buyer left a ${rating}-star review on "${listingTitle}".`,
    link: "/dashboard",
  });

  return NextResponse.json({ success: true });
}
